---
id: componentactions
title: Component Actions
description: DST component action system for handling interactive behaviors and player actions on entities
sidebar_position: 8
slug: core-systems-componentactions
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Component Actions

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The **Component Actions** system is the core mechanism in Don't Starve Together that defines how players can interact with entities through various components. It provides a structured way to register, manage, and execute actions based on component presence and game context.

The system categorizes actions into different types based on the interaction method and context, providing flexibility for complex interactive behaviors. All component actions are stored in the `COMPONENT_ACTIONS` table and are organized by action type, with each component having specific action collectors that determine available interactions.

**Core Features:**
- Automatic action discovery based on entity components
- Context-sensitive interactions (left/right click, mounted/dismounted)
- Mod support for custom component actions
- Network-optimized component registration system
- Validation framework for action availability

## Action Types

### SCENE Actions
Direct interactions with objects in the world without using items.

**Function Signature:**
```lua
function(inst, doer, actions, right)
```

**Parameters:**
- `inst`: The entity being interacted with
- `doer`: The player performing the action
- `actions`: Array to insert available actions
- `right`: Boolean indicating right-click interaction

**Example Implementation:**
```lua
activatable = function(inst, doer, actions, right)
    if inst:HasTag("inactive") then
        --portableengineer needs r.click for dismantle
        if right and inst:HasTag("engineering") and doer:HasTag("portableengineer") then
            return
        elseif not right and (inst.replica.inventoryitem or inst:HasTag("activatable_forceright")) then
            --no l.click for inventoryitem or forceright
            return
        end
        if not (inst:HasTag("smolder") or inst:HasTag("fire")) then
            table.insert(actions, ACTIONS.ACTIVATE)
        end
    end
end
```

**Common SCENE Actions:**
- `activatable`: Activate/turn on inactive objects
- `container`: Open containers and storage
- `pickable`: Harvest plants and collectibles  
- `workable`: Work objects with tools (chopping, mining, etc.)
- `burnable`: Smother fires or stoke fires
- `sleepingbag`: Sleep in beds and sleeping bags

### USEITEM Actions
Using an inventory item on a target entity.

**Function Signature:**
```lua
function(inst, doer, target, actions, right)
```

**Parameters:**
- `inst`: The item being used
- `doer`: The player using the item
- `target`: The entity being targeted
- `actions`: Array to insert available actions
- `right`: Boolean indicating right-click interaction

**Example Implementation:**
```lua
fuel = function(inst, doer, target, actions)
    if not (doer.replica.rider ~= nil and doer.replica.rider:IsRiding())
        or (target.replica.inventoryitem ~= nil and target.replica.inventoryitem:IsGrandOwner(doer)) then
        if inst.prefab ~= "spoiled_food" and
            inst:HasTag("quagmire_stewable") and
            target:HasTag("quagmire_stewer") and
            target.replica.container ~= nil and
            target.replica.container:IsOpenedBy(doer) then
            return
        end
        for k, v in pairs(FUELTYPE) do
            if inst:HasTag(v.."_fuel") then
                if target:HasTag(v.."_fueled") then
                    table.insert(actions, inst:GetIsWet() and ACTIONS.ADDWETFUEL or ACTIONS.ADDFUEL)
                end
                return
            end
        end
    end
end
```

**Common USEITEM Actions:**
- `fuel`: Add fuel to burnable objects (campfires, lanterns)
- `tool`: Use tools on workable objects
- `edible`: Feed food to creatures or players
- `weapon`: Attack targets or store weapons in containers
- `repairer`: Repair damaged items with appropriate materials
- `tradable`: Trade items with NPCs

### POINT Actions
Using items on specific world positions.

**Function Signature:**
```lua
function(inst, doer, pos, actions, right, target)
```

**Parameters:**
- `inst`: The item being used
- `doer`: The player using the item
- `pos`: World position Vector3
- `actions`: Array to insert available actions
- `right`: Boolean indicating right-click interaction
- `target`: Optional target entity at position

**Example Implementation:**
```lua
deployable = function(inst, doer, pos, actions, right, target)
    if right and inst.replica.inventoryitem ~= nil then
        if CLIENT_REQUESTED_ACTION == ACTIONS.DEPLOY_TILEARRIVE or CLIENT_REQUESTED_ACTION == ACTIONS.DEPLOY then
            table.insert(actions, CLIENT_REQUESTED_ACTION)
        elseif inst.replica.inventoryitem:CanDeploy(pos, nil, doer, rotation) then
            if inst:HasTag("tile_deploy") then
                table.insert(actions, ACTIONS.DEPLOY_TILEARRIVE)
            elseif not (inst.CanTossInWorld and inst:HasTag("projectile") and not inst:CanTossInWorld(doer, pos)) then
                table.insert(actions, ACTIONS.DEPLOY)
            end
        end
    end
end
```

### EQUIPPED Actions
Actions available when an item is equipped.

**Function Signature:**
```lua
function(inst, doer, target, actions, right)
```

**Example Implementation:**
```lua
tool = function(inst, doer, target, actions, right)
    if not target:HasTag("INLIMBO") then
        for k in pairs(TOOLACTIONS) do
            if inst:HasTag(k.."_tool")
                    and target:IsActionValid(ACTIONS[k], right)
                    and (not right or ACTIONS[k].rmb or not target:HasTag("smolder")) then
                table.insert(actions, ACTIONS[k])
                return
            end
        end
    end
end
```

### INVENTORY Actions
Actions available for items in inventory.

**Function Signature:**
```lua
function(inst, doer, actions, right)
```

**Example Implementation:**
```lua
edible = function(inst, doer, actions, right)
    local rider = doer.replica.rider
    local mount = rider and rider:GetMount() or nil
    local isactiveitem = doer.replica.inventory:GetActiveItem() == inst

    if mount and (isactiveitem or (not right and doer.components.playercontroller.isclientcontrollerattached)) then
        -- Feed mount logic
        for k, v in pairs(FOODGROUP) do
            if mount:HasTag(v.name.."_eater") then
                for i, v2 in ipairs(v.types) do
                    if inst:HasTag("edible_"..v2) then
                        table.insert(actions, ACTIONS.FEED)
                        return
                    end
                end
            end
        end
    end

    if (right or inst.replica.equippable == nil) and not (mount and isactiveitem) then
        for k, v in pairs(FOODTYPE) do
            if inst:HasTag("edible_"..v) and doer:HasTag(v.."_eater") then
                table.insert(actions, ACTIONS.EAT)
                return
            end
        end
    end
end
```

### ISVALID Actions
Validation functions for determining if an action is valid.

**Function Signature:**
```lua
function(inst, action, right)
```

**Example Implementation:**
```lua
workable = function(inst, action, right)
    return (right or action ~= ACTIONS.HAMMER) and
        inst:HasTag(action.id.."_workable")
end
```

## Core Functions

### RegisterComponentActions

Registers a component to participate in the action system.

```lua
function EntityScript:RegisterComponentActions(name)
    local id = ACTION_COMPONENT_IDS[name]
    if id ~= nil then
        table.insert(self.actioncomponents, id)
        if self.actionreplica ~= nil then
            self.actionreplica.actioncomponents:set(self.actioncomponents)
        end
    end
    -- Handle mod component actions...
end
```

**Usage Example:**
```lua
-- In component constructor
local function OnCreate(inst)
    inst:RegisterComponentActions("workable")
end
```

### UnregisterComponentActions

Removes a component from the action system.

```lua
function EntityScript:UnregisterComponentActions(name)
    local id = ACTION_COMPONENT_IDS[name]
    if id ~= nil then
        for i, v in ipairs(self.actioncomponents) do
            if v == id then
                table.remove(self.actioncomponents, i)
                if self.actionreplica ~= nil then
                    self.actionreplica.actioncomponents:set(self.actioncomponents)
                end
                break
            end
        end
    end
    -- Handle mod component actions...
end
```

### CollectActions

Gathers all available actions for an entity based on its registered components.

```lua
function EntityScript:CollectActions(actiontype, ...)
    local t = COMPONENT_ACTIONS[actiontype]
    if t == nil then
        print("Action type", actiontype, "doesn't exist in the table of component actions.")
        return
    end
    for i, v in ipairs(self.actioncomponents) do
        local collector = t[ACTION_COMPONENT_NAMES[v]]
        if collector ~= nil then
            collector(self, ...)
        end
    end
    -- Handle mod component actions...
end
```

### IsActionValid

Validates whether a specific action is valid for an entity.

```lua
function EntityScript:IsActionValid(action, right)
    if action.rmb and action.rmb ~= right then
        return false
    end
    local isvalid_list = COMPONENT_ACTIONS.ISVALID
    for _, v in ipairs(self.actioncomponents) do
        local validator = isvalid_list[ACTION_COMPONENT_NAMES[v]]
        if validator ~= nil and validator(self, action, right) then
            return true
        end
    end
    -- Handle mod validators...
    return false
end
```

### HasActionComponent

Checks if an entity has a specific action component registered.

```lua
function EntityScript:HasActionComponent(name)
    local id = ACTION_COMPONENT_IDS[name]
    if id ~= nil then
        for i, v in ipairs(self.actioncomponents) do
            if v == id then
                return true
            end
        end
    end
    -- Handle mod components...
    return false
end
```

## Helper Functions

### CanCastFishingNetAtPoint

Validates if a fishing net can be cast at a specific location.

**Parameters:**
- `thrower`: The entity throwing the net
- `target_x`: Target X coordinate  
- `target_z`: Target Z coordinate

**Returns:** Boolean indicating if the cast is valid

```lua
local function CanCastFishingNetAtPoint(thrower, target_x, target_z)
    local min_throw_distance = 2
    local thrower_x, thrower_y, thrower_z = thrower.Transform:GetWorldPosition()

    local isoceanactionable = TheWorld.Map:IsOceanAtPoint(target_x, 0, target_z) or 
                             FindVirtualOceanEntity(target_x, 0, target_z) ~= nil
    if isoceanactionable and VecUtil_LengthSq(target_x - thrower_x, target_z - thrower_z) > 
       min_throw_distance * min_throw_distance then
        return true
    end
    return false
end
```

### GetFishingAction

Determines the appropriate fishing action based on current state.

**Parameters:**
- `doer`: The player performing the fishing action
- `fishing_target`: The target entity for fishing

**Returns:** The appropriate ACTIONS constant or nil

```lua
local function GetFishingAction(doer, fishing_target)
    if doer:HasTag("fishing_idle") then
        if fishing_target ~= nil and not fishing_target:HasTag("projectile") then
            if fishing_target:HasTag("oceanfishing_catchable") then
                if fishing_target:HasTag("fishinghook") then
                    return ACTIONS.OCEAN_FISHING_STOP
                else
                    return ACTIONS.OCEAN_FISHING_CATCH
                end
            end
            return ACTIONS.OCEAN_FISHING_REEL
        end
    end
    return nil
end
```

### Row

Handles boat rowing actions and movement on water.

**Parameters:**
- `inst`: The oar item being used
- `doer`: The player using the oar
- `pos`: Target position for rowing
- `actions`: Array to insert available actions

```lua
local function Row(inst, doer, pos, actions)
    local map = TheWorld.Map
    local platform_under_cursor = map:GetPlatformAtPoint(pos.x, pos.z)
    local doer_x, doer_y, doer_z = doer.Transform:GetWorldPosition()
    local my_platform = doer:GetCurrentPlatform()
    local is_controller_attached = doer.components.playercontroller.isclientcontrollerattached

    -- Determines appropriate rowing action based on platform, position, and player state
    -- Handles both keyboard/mouse and controller input differently
    -- Returns ROW, ROW_CONTROLLER, or ROW_FAIL actions
end
```

### CheckRowOverride

Checks if an object overrides the rowing action (like ocean trawler).

**Parameters:**
- `doer`: The player attempting to row
- `target`: The target entity that might override rowing

**Returns:** Boolean indicating if rowing should be overridden

```lua
local function CheckRowOverride(doer, target)
    if target ~= nil then
        local doer_pos = doer:GetPosition()
        local boat = TheWorld.Map:GetPlatformAtPoint(doer_pos.x, doer_pos.z)
        if boat == nil then
            return false
        end

        local target_pos = target:GetPosition()
        local dist_to_target = VecUtil_Dist(target_pos.x, target_pos.z, doer_pos.x, doer_pos.z)
        local boat_pos = boat:GetPosition()
        local dist_to_boat = VecUtil_Dist(target_pos.x, target_pos.z, boat_pos.x, boat_pos.z)
        local boatradius = boat.components.boatringdata and boat.components.boatringdata:GetRadius() or 0
        local boat_dist_to_target = dist_to_boat - boatradius

        if target:HasTag("overriderowaction") and math.min(dist_to_target, boat_dist_to_target) < TUNING.OVERRIDE_ROW_ACTION_DISTANCE then
            return true
        end
    end
    return false
end
```

### PlantRegistryResearch

Handles plant registry research actions for botanical inspection.

**Parameters:**
- `inst`: The plant or fertilizer being researched
- `doer`: The player performing the research
- `actions`: Array to insert available actions

```lua
local function PlantRegistryResearch(inst, doer, actions)
    if inst ~= doer and (doer.CanExamine == nil or doer:CanExamine()) then
        local plantinspector = doer.replica.inventory and 
                              doer.replica.inventory:EquipHasTag("plantinspector") or false
        local plantkin = doer:HasTag("plantkin")

        if plantinspector and ((inst.GetPlantRegistryKey and inst.GetResearchStage) or 
                              inst.GetFertilizerKey) then
            local act = CLIENT_REQUESTED_ACTION
            if (not TheNet:IsDedicated() and doer == ThePlayer) then
                if (inst:HasTag("plantresearchable") and 
                    not ThePlantRegistry:KnowsPlantStage(inst:GetPlantRegistryKey(), inst:GetResearchStage())) or
                   (inst:HasTag("fertilizerresearchable") and 
                    not ThePlantRegistry:KnowsFertilizer(inst:GetFertilizerKey())) then
                    act = ACTIONS.PLANTREGISTRY_RESEARCH
                else
                    act = ACTIONS.PLANTREGISTRY_RESEARCH_FAIL
                end
            end
            if act == ACTIONS.PLANTREGISTRY_RESEARCH or act == ACTIONS.PLANTREGISTRY_RESEARCH_FAIL then
                table.insert(actions, act)
            end
        end

        if (plantinspector or plantkin) and 
           (inst:HasTag("farmplantstress") or inst:HasTag("weedplantstress")) then
            table.insert(actions, ACTIONS.ASSESSPLANTHAPPINESS)
        end
    end
end
```

## Mod Support

### AddComponentAction

Allows mods to register custom component actions.

```lua
function AddComponentAction(actiontype, component, fn, modname)
    if MOD_COMPONENT_ACTIONS[modname] == nil then
        MOD_COMPONENT_ACTIONS[modname] = { [actiontype] = {} }
        MOD_ACTION_COMPONENT_NAMES[modname] = {}
        MOD_ACTION_COMPONENT_IDS[modname] = {}
    elseif MOD_COMPONENT_ACTIONS[modname][actiontype] == nil then
        MOD_COMPONENT_ACTIONS[modname][actiontype] = {}
    end
    MOD_COMPONENT_ACTIONS[modname][actiontype][component] = fn
    table.insert(MOD_ACTION_COMPONENT_NAMES[modname], component)
    MOD_ACTION_COMPONENT_IDS[modname][component] = #MOD_ACTION_COMPONENT_NAMES[modname]
end
```

**Usage Example:**
```lua
-- In mod code
AddComponentAction("SCENE", "mycomponent", function(inst, doer, actions, right)
    if inst:HasTag("my_tag") and not inst:HasTag("fire") then
        table.insert(actions, ACTIONS.MY_ACTION)
    end
end, "MyModName")
```

## Network Optimization

### Component ID Mapping

The system uses numeric IDs for efficient component lookup and network synchronization:

```lua
local ACTION_COMPONENT_NAMES = {}
local ACTION_COMPONENT_IDS = {}

local function RemapComponentActions()
    for k, v in orderedPairs(COMPONENT_ACTIONS) do
        for cmp, fn in orderedPairs(v) do
            if ACTION_COMPONENT_IDS[cmp] == nil then
                table.insert(ACTION_COMPONENT_NAMES, cmp)
                ACTION_COMPONENT_IDS[cmp] = #ACTION_COMPONENT_NAMES
            end
        end
    end
end
RemapComponentActions()
assert(#ACTION_COMPONENT_NAMES <= 255, "Increase actioncomponents network data size.")
```

**Network Constraints:**
- Maximum 255 component types for network efficiency
- Uses 8-bit integers for component ID transmission
- Component names stored once in lookup tables for memory optimization

**Network Synchronization:**
Component registration is replicated efficiently using numeric arrays to minimize bandwidth usage.

```lua
-- Client-server synchronization
if self.actionreplica ~= nil then
    self.actionreplica.actioncomponents:set(self.actioncomponents)
end

-- Mod component synchronization
if self.actionreplica ~= nil then
    self.actionreplica.modactioncomponents[modname]:set(self.modactioncomponents[modname])
end
```

## System Constants

### Action Type Categories

The system defines several action type constants:

```lua
-- Action categories used in COMPONENT_ACTIONS table
SCENE = "using an object in the world"
USEITEM = "using an inventory item on an object in the world"  
POINT = "using an inventory item on a point in the world"
EQUIPPED = "using an equipped item on yourself or a target object"
INVENTORY = "using an inventory item"
ISVALID = "validation functions for action availability"
```

### Special Tag Sets

```lua
local SCYTHE_ONEOFTAGS = {"plant", "lichen", "oceanvine", "kelp"}
local KITCOON_MUST_TAGS = {"kitcoonden"}

local function IsValidScytheTarget(target)
    return target:HasOneOfTags(SCYTHE_ONEOFTAGS)
end
```

## Common Patterns

### Tag-Based Action Filtering

Most component actions use entity tags to determine availability:

```lua
pickable = function(inst, doer, actions)
    if inst:HasTag("pickable") and not (inst:HasTag("fire") or inst:HasTag("intense")) then
        table.insert(actions, ACTIONS.PICK)
    end
end
```

### Conditional Action Validation

Actions often include multiple condition checks:

```lua
container = function(inst, doer, actions, right)
    if not inst:HasTag("burnt") and
        inst.replica.container:CanBeOpened() and
        doer.replica.inventory ~= nil and
        not (doer.replica.rider ~= nil and doer.replica.rider:IsRiding()) then
        table.insert(actions, ACTIONS.RUMMAGE)
    end
end
```

### Right-Click Specificity

Some actions are only available on right-click:

```lua
portablestructure = function(inst, doer, actions, right)
    if not right then
        return
    end
    -- Right-click specific logic for dismantling...
    if not inst.candismantle or inst.candismantle(inst) then
        table.insert(actions, ACTIONS.DISMANTLE)
    end
end
```

### Mount and Riding Restrictions

Actions must consider player riding state:

```lua
stewer = function(inst, doer, actions, right)
    if not inst:HasTag("burnt") and
        not (doer.replica.rider ~= nil and doer.replica.rider:IsRiding()) then
        if inst:HasTag("donecooking") then
            table.insert(actions, ACTIONS.HARVEST)
        elseif right and inst:HasTag("readytocook") then
            table.insert(actions, ACTIONS.COOK)
        end
    end
end
```

## Error Handling

### Mod Component Validation

The system includes warnings for mod synchronization issues:

```lua
local function ModComponentWarning(self, modname)
    print("ERROR: Mod component actions are out of sync for mod "..(modname or "unknown")..
          ". This is likely a result of your mod's calls to AddComponentAction not happening on both the server and the client.")
    print("self.modactioncomponents is\n"..(dumptable(self.modactioncomponents) or ""))
    print("MOD_COMPONENT_ACTIONS is\n"..(dumptable(MOD_COMPONENT_ACTIONS) or ""))
end
```

**Error Context Functions:**

```lua
local function CheckModComponentActions(self, modname)
    return MOD_COMPONENT_ACTIONS[modname] or ModComponentWarning(self, modname)
end

local function CheckModComponentNames(self, modname)
    return MOD_ACTION_COMPONENT_NAMES[modname] or ModComponentWarning(self, modname)
end

local function CheckModComponentIds(self, modname)
    return MOD_ACTION_COMPONENT_IDS[modname] or ModComponentWarning(self, modname)
end
```

### Action Type Validation

```lua
function EntityScript:CollectActions(actiontype, ...)
    local t = COMPONENT_ACTIONS[actiontype]
    if t == nil then
        print("Action type", actiontype, "doesn't exist in the table of component actions. Is your component name correct in AddComponentAction?")
        return
    end
    -- Continue processing...
end
```

## Performance Considerations

### Efficient Component Lookup

- Uses numeric component IDs for fast array indexing
- Limits component actions to 255 total types for network efficiency
- Batch processes mod component actions to reduce overhead

### Memory Optimization

- Component names are stored once in lookup tables
- Action functions are shared across all entities with the same component
- Network data uses compact numeric representations

## Best Practices

### 🟢 Do's
- Use specific tags to control action availability
- Include proper validation checks (burned, broken, etc.)
- Consider both left and right-click contexts
- Handle mounted player restrictions appropriately
- Check component existence before accessing properties
- Validate network state consistency between client and server

### ❌ Don'ts
- Don't forget to handle edge cases like burning/broken entities
- Don't ignore the `right` parameter for click-specific actions
- Don't add actions without proper state validation
- Don't assume components exist without checking
- Don't create actions that work only on client or server
- Don't register component actions inconsistently across game states

## Related Systems

- **[Actions](./actions.md)**: Core action definitions and execution
- **[BufferedAction](./bufferedaction.md)**: Action queuing and execution system
- **[EntityScript](./entityscript.md)**: Core entity functionality
- **[Networking](./networking.md)**: Client-server action synchronization

---

*For implementation examples of specific component actions, see the individual component documentation. For action execution details, refer to the [Actions documentation](./actions.md).*
