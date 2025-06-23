---
title: "Component Actions"
description: "Don't Starve Together component action system for handling interactive behaviors and player actions"
sidebar_position: 8
slug: /core-systems/componentactions
last_updated: "2024-12-19"
build_version: "675312"
change_status: "stable"
---

# Component Actions

The **Component Actions** system is the core mechanism in Don't Starve Together that defines how players can interact with entities through various components. It provides a structured way to register, manage, and execute actions based on component presence and game context.

## Overview

Component actions determine what actions are available when a player interacts with an entity. The system categorizes actions into different types based on the interaction method and context, providing flexibility for complex interactive behaviors.

## Action Types

### SCENE Actions
Direct interactions with objects in the world without using items.

```lua
-- Example: Activatable component
activatable = function(inst, doer, actions, right)
    if inst:HasTag("inactive") then
        if not right and (inst.replica.inventoryitem or inst:HasTag("activatable_forceright")) then
            return
        end
        if not (inst:HasTag("smolder") or inst:HasTag("fire")) then
            table.insert(actions, ACTIONS.ACTIVATE)
        end
    end
end
```

### USEITEM Actions
Using an inventory item on a target entity.

```lua
-- Example: Using fuel on a fueled object
fuel = function(inst, doer, target, actions)
    for k, v in pairs(FUELTYPE) do
        if inst:HasTag(v.."_fuel") then
            if target:HasTag(v.."_fueled") then
                table.insert(actions, inst:GetIsWet() and ACTIONS.ADDWETFUEL or ACTIONS.ADDFUEL)
            end
            return
        end
    end
end
```

### POINT Actions
Using items on specific world positions.

```lua
-- Example: Deployable items
deployable = function(inst, doer, pos, actions, right, target)
    if right and inst.replica.inventoryitem ~= nil then
        if inst.replica.inventoryitem:CanDeploy(pos, nil, doer, rotation) then
            table.insert(actions, ACTIONS.DEPLOY)
        end
    end
end
```

### EQUIPPED Actions
Actions available when an item is equipped.

```lua
-- Example: Tool usage
tool = function(inst, doer, target, actions, right)
    for k in pairs(TOOLACTIONS) do
        if inst:HasTag(k.."_tool") and target:IsActionValid(ACTIONS[k], right) then
            table.insert(actions, ACTIONS[k])
            return
        end
    end
end
```

### INVENTORY Actions
Actions available for items in inventory.

```lua
-- Example: Edible items
edible = function(inst, doer, actions, right)
    for k, v in pairs(FOODTYPE) do
        if inst:HasTag("edible_"..v) and doer:HasTag(v.."_eater") then
            table.insert(actions, ACTIONS.EAT)
            return
        end
    end
end
```

### ISVALID Actions
Validation functions for determining if an action is valid.

```lua
-- Example: Workable validation
workable = function(inst, action, right)
    return (right or action ~= ACTIONS.HAMMER) and
        inst:HasTag(action.id.."_workable")
end
```

## Component Registration

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
end
```

**Usage Example:**
```lua
-- In component constructor
local inst = CreateEntity()
-- Add components...
inst:RegisterComponentActions("workable")
```

### UnregisterComponentActions

Removes a component from the action system.

```lua
function EntityScript:UnregisterComponentActions(name)
    -- Implementation handles removal from actioncomponents list
end
```

## Action Collection

### CollectActions

Gathers all available actions for an entity based on its registered components.

```lua
function EntityScript:CollectActions(actiontype, ...)
    local t = COMPONENT_ACTIONS[actiontype]
    for i, v in ipairs(self.actioncomponents) do
        local collector = t[ACTION_COMPONENT_NAMES[v]]
        if collector ~= nil then
            collector(self, ...)
        end
    end
end
```

**Parameters:**
- `actiontype`: The type of action collection (SCENE, USEITEM, etc.)
- `...`: Additional parameters passed to action collectors

## Action Validation

### IsActionValid

Validates whether a specific action is valid for an entity.

```lua
function EntityScript:IsActionValid(action, right)
    if action.rmb and action.rmb ~= right then
        return false
    end
    -- Check component validators...
end
```

**Parameters:**
- `action`: The action to validate
- `right`: Whether this is a right-click action

## Mod Support

### AddComponentAction

Allows mods to register custom component actions.

```lua
function AddComponentAction(actiontype, component, fn, modname)
    if MOD_COMPONENT_ACTIONS[modname] == nil then
        MOD_COMPONENT_ACTIONS[modname] = { [actiontype] = {} }
    end
    MOD_COMPONENT_ACTIONS[modname][actiontype][component] = fn
end
```

**Usage Example:**
```lua
-- In mod code
AddComponentAction("SCENE", "mycomponent", function(inst, doer, actions, right)
    if inst:HasTag("my_tag") then
        table.insert(actions, ACTIONS.MY_ACTION)
    end
end, "MyModName")
```

## Common Patterns

### Tag-Based Actions

Many component actions use entity tags to determine availability:

```lua
pickable = function(inst, doer, actions)
    if inst:HasTag("pickable") and not (inst:HasTag("fire") or inst:HasTag("intense")) then
        table.insert(actions, ACTIONS.PICK)
    end
end
```

### Conditional Actions

Actions often include multiple conditions:

```lua
container = function(inst, doer, actions, right)
    if not inst:HasTag("burnt") and
        inst.replica.container:CanBeOpened() and
        doer.replica.inventory ~= nil then
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
    -- Right-click specific logic...
end
```

## Helper Functions

### Special Case Handlers

The system includes helper functions for complex scenarios:

```lua
local function CanCastFishingNetAtPoint(thrower, target_x, target_z)
    local min_throw_distance = 2
    local thrower_x, thrower_y, thrower_z = thrower.Transform:GetWorldPosition()
    
    local isoceanactionable = TheWorld.Map:IsOceanAtPoint(target_x, 0, target_z)
    return isoceanactionable and VecUtil_LengthSq(target_x - thrower_x, target_z - thrower_z) > min_throw_distance * min_throw_distance
end
```

## Performance Considerations

### Component ID Mapping

The system uses numeric IDs for efficient component lookup:

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
```

### Network Optimization

Component registration is replicated efficiently using numeric arrays:

```lua
-- Client-server synchronization
if self.actionreplica ~= nil then
    self.actionreplica.actioncomponents:set(self.actioncomponents)
end
```

## Best Practices

### 🟢 Do's
- Use specific tags to control action availability
- Include proper validation checks (burned, broken, etc.)
- Consider both left and right-click contexts
- Handle mounted player restrictions
- Check component existence before accessing

### ❌ Don'ts
- Don't forget to handle edge cases like burning/broken entities
- Don't ignore the `right` parameter for click-specific actions
- Don't add actions without proper validation
- Don't assume components exist without checking

## Related Systems

- **[Actions](./actions.md)**: Core action definitions and execution
- **[Components](./components/)**: Individual component implementations
- **[Networking](./networking.md)**: Client-server action synchronization
- **[Tags System](./tags.md)**: Entity classification for action filtering

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 675312 | 2024-12-19 | Current stable implementation |
| 675000 | 2024-12-01 | Enhanced mod support for component actions |
| 674500 | 2024-11-15 | Improved network synchronization |
| 674000 | 2024-11-01 | Added validation system for action types |

---

*For implementation examples of specific component actions, see the individual component documentation in the [Components section](./components/).*
