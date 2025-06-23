---
title: "Component Utilities"
description: "Don't Starve Together component utility functions and helper systems for common gameplay mechanics"
sidebar_position: 9
slug: /core-systems/componentutil
last_updated: "2024-12-19"
build_version: "675312"
change_status: "stable"
---

# Component Utilities

The **Component Utilities** (`componentutil.lua`) is a comprehensive library of helper functions that support various gameplay mechanics and component interactions in Don't Starve Together. It provides utility functions for entity state checking, world manipulation, bridge construction, and many other common tasks.

## Overview

Component utilities serve as a bridge between low-level engine functionality and high-level gameplay systems. These functions are used extensively throughout the game to handle common operations that don't belong to specific components but are needed across multiple systems.

## Entity State Functions

### IsEntityDead

Checks if an entity is considered dead based on its health component.

```lua
function IsEntityDead(inst, require_health)
    local health = inst.replica.health
    if health == nil then
        return require_health == true
    end
    return health:IsDead()
end
```

**Parameters:**
- `inst`: The entity to check
- `require_health`: If `true`, entities without health component are considered dead

**Usage Example:**
```lua
if IsEntityDead(target, true) then
    -- Handle dead entity logic
    return
end
```

### IsEntityDeadOrGhost

Extended death check that also considers ghost players.

```lua
function IsEntityDeadOrGhost(inst, require_health)
    if inst:HasTag("playerghost") then
        return true
    end
    return IsEntityDead(inst, require_health)
end
```

### GetStackSize

Returns the stack size of an item, defaulting to 1 if not stackable.

```lua
function GetStackSize(inst)
    local stackable = inst.replica.stackable
    return stackable and stackable:StackSize() or 1
end
```

## World Manipulation

### HandleDugGround

Handles the creation of turf items when ground is dug up.

```lua
function HandleDugGround(dug_ground, x, y, z)
    local spawnturf = GroundTiles.turf[dug_ground] or nil
    if spawnturf ~= nil then
        local loot = SpawnPrefab("turf_"..spawnturf.name)
        if loot.components.inventoryitem ~= nil then
            loot.components.inventoryitem:InheritWorldWetnessAtXZ(x, z)
        end
        loot.Transform:SetPosition(x, y, z)
        -- Add physics for natural drop behavior
    end
end
```

### FindVirtualOceanEntity

Locates virtual ocean entities within a specified radius.

```lua
function FindVirtualOceanEntity(x, y, z, r)
    local ents = TheSim:FindEntities(x, y, z, r or MAX_PHYSICS_RADIUS, 
                                     VIRTUALOCEAN_HASTAGS, VIRTUALOCEAN_CANTTAGS)
    for _, ent in ipairs(ents) do
        if ent.Physics ~= nil then
            local radius = ent.Physics:GetRadius()
            -- Check if point is within the virtual ocean radius
        end
    end
    return nil
end
```

## Combat Target Classification

### Target Tag Definitions

The system defines several tag collections for combat targeting:

```lua
-- Non-living targets that can be attacked
NON_LIFEFORM_TARGET_TAGS = {
    "structure", "wall", "balloon", "groundspike", 
    "smashable", "veggie"
}

-- Entities without souls (immune to soul-draining effects)
SOULLESS_TARGET_TAGS = ConcatArrays({
    "soulless", "chess", "shadow", "shadowcreature",
    "shadowminion", "shadowchesspiece"
}, NON_LIFEFORM_TARGET_TAGS)
```

**Usage Example:**
```lua
local function CanDrainSoul(target)
    return not target:HasOneOfTags(SOULLESS_TARGET_TAGS)
end
```

## Tile Change Handling

### Ocean Tile Changes

Handles entity behavior when tiles change to ocean:

```lua
function TempTile_HandleTileChange_Ocean(x, y, z)
    local tile_radius_plus_overhang = ((TILE_SCALE / 2) + 1.0) * 1.4142
    local entities_near_tile = TheSim:FindEntities(x, 0, z, tile_radius_plus_overhang, 
                                                   nil, IGNORE_DROWNING_ONREMOVE_TAGS)
    
    local shore_point = nil
    for _, ent in ipairs(entities_near_tile) do
        local has_drownable = (ent.components.drownable ~= nil)
        if has_drownable and shore_point == nil then
            shore_point = Vector3(FindRandomPointOnShoreFromOcean(x, y, z))
        end
        ent:PushEvent("onsink", {boat = nil, shore_pt = shore_point})
    end
end
```

### Void Tile Changes

Handles entities falling into void tiles:

```lua
function TempTile_HandleTileChange_Void(x, y, z)
    -- Similar to ocean handling but uses "onfallinvoid" event
    -- Entities with drownable component and abyss_fall state support falling
end
```

## Bridge Construction System

### Bridge Deploy Check Helper

Comprehensive system for validating and calculating bridge placement:

```lua
function Bridge_DeployCheck_Helper(inst, pt, options)
    local maxlength = options and options.maxlength or TUNING.ROPEBRIDGE_LENGTH_TILES
    local isvalidtileforbridgeatpointfn = options and options.isvalidtileforbridgeatpointfn
    local candeploybridgeatpointfn = options and options.candeploybridgeatpointfn
    
    -- Complex geometric calculations for optimal bridge placement
    -- Returns success status and placement spots
end
```

**Features:**
- Automatic direction detection based on surrounding terrain
- Support for different bridge types through callback functions
- Geometric optimization for natural bridge placement
- Validation of start and end points

**Usage Example:**
```lua
local options = {
    maxlength = 8,
    isvalidtileforbridgeatpointfn = MyCustomValidationFunction,
    candeploybridgeatpointfn = MyCustomDeployFunction
}

local success, spots = Bridge_DeployCheck_Helper(inst, target_point, options)
if success then
    -- Deploy bridge segments at calculated spots
end
```

## Charlie Residue System

### Rose Target Creation

Creates entities that interact with Winona's rose glasses:

```lua
function MakeRoseTarget_CreateFuel(inst)
    local roseinspectable = inst:AddComponent("roseinspectable")
    roseinspectable:SetOnResidueActivated(OnResidueActivated_Fuel)
    roseinspectable:SetForcedInduceCooldownOnActivate(true)
end
```

### Residue Decay Functions

```lua
function DecayCharlieResidueAndGoOnCooldownIfItExists(inst)
    local roseinspectableuser = inst.components.roseinspectableuser
    if roseinspectableuser == nil then
        return
    end
    roseinspectableuser:ForceDecayResidue()
    roseinspectableuser:GoOnCooldown()
end
```

## Close Inspector Utilities

### CLOSEINSPECTORUTIL

Utility functions for Winona's rose glasses close inspection system:

```lua
CLOSEINSPECTORUTIL = {}

CLOSEINSPECTORUTIL.IsValidTarget = function(doer, target)
    -- Validates if a target can be closely inspected
    return not (
        (target.Physics and target.Physics:GetMass() ~= 0) or
        target.components.locomotor or
        target.components.inventoryitem or
        target:HasTag("character")
    )
end

CLOSEINSPECTORUTIL.CanCloseInspect = function(doer, targetorpos)
    -- Comprehensive check for close inspection capability
end
```

### Rose Point Configurations

Defines different context-specific behaviors for rose glasses:

```lua
ROSEPOINT_CONFIGURATIONS = {
    {
        contextname = "Vine Bridge",
        checkfn = RosePoint_VineBridge_Check,
        callbackfn = RosePoint_VineBridge_Do,
    },
    -- Additional configurations can be added here
}
```

## Inventory Management

### Desired Take Count Functions

Dynamic system for controlling item pickup quantities:

```lua
DesiredMaxTakeCountFunctions = {}

function SetDesiredMaxTakeCountFunction(prefab, callback)
    DesiredMaxTakeCountFunctions[prefab] = callback
end

function GetDesiredMaxTakeCountFunction(prefab)
    return DesiredMaxTakeCountFunctions[prefab]
end
```

**Usage Example:**
```lua
-- Set custom pickup logic for a specific item
SetDesiredMaxTakeCountFunction("custom_item", function(item, container, doer)
    -- Return desired pickup count based on context
    return math.min(10, item.components.stackable:StackSize())
end)
```

### Meat Detection

Utility for rabbit king system:

```lua
function HasMeatInInventoryFor(inst)
    local inventory = inst.components.inventory
    if inventory == nil or inventory:EquipHasTag("hidesmeats") then
        return false
    end
    return inventory:FindItem(HasMeatInInventoryFor_Checker) ~= nil
end
```

## Food System Utilities

### Pickable Food Products

Defines which pickable items are considered food sources:

```lua
PICKABLE_FOOD_PRODUCTS = {
    ancientfruit_nightvision = true,
    berries = true,
    berries_juicy = true,
    blue_cap = true,
    cactus_meat = true,
    carrot = true,
    cave_banana = true,
    -- ... additional food items
}

function IsFoodSourcePickable(inst)
    return inst.components.pickable ~= nil and 
           PICKABLE_FOOD_PRODUCTS[inst.components.pickable.product]
end
```

## Woby Courier System

### Chest Position Utilities

Functions for Walter's Woby courier system:

```lua
function GetWobyCourierChestPosition(inst)
    if inst.woby_commands_classified then
        local x = inst.woby_commands_classified.chest_posx:value()
        local z = inst.woby_commands_classified.chest_posz:value()
        if x ~= WOBYCOURIER_NO_CHEST_COORD and z ~= WOBYCOURIER_NO_CHEST_COORD then
            return x, z
        end
    end
    return nil, nil
end
```

## Placement System

### Axis Alignment

Support for mod-compatible placement alignment:

```lua
function UpdateAxisAlignmentValues(intervals)
    TUNING.AXISALIGNEDPLACEMENT_INTERVALS = intervals
    TUNING.AXISALIGNEDPLACEMENT_CIRCLESIZE = math.min(8 / intervals, 4)
    if ThePlayer then
        ThePlayer:PushEvent("refreshaxisalignedplacementintervals")
    end
end

function CycleAxisAlignmentValues()
    -- Cycles through predefined alignment values
    -- Updates placement grid for better building alignment
end
```

## Arena Management

### Wagpunk Arena Collision Data

Predefined collision barrier positions for the Wagpunk Arena:

```lua
WAGPUNK_ARENA_COLLISION_DATA = {
    {-28, -20, 315, false}, -- x, z, rotation, sfxlooper
    {-28, -10, 0, false},
    {-28, 0, 0, true},
    -- ... additional barrier positions
}
```

## Cleanup Utilities

### Clear Spot Function

Removes entities from a specified area:

```lua
function ClearSpotForRequiredPrefabAtXZ(x, z, r)
    local ents = TheSim:FindEntities(x, 0, z, MAX_PHYSICS_RADIUS, nil, CLEARSPOT_CANT_TAGS)
    for _, ent in ipairs(ents) do
        if ent:IsValid() then
            local radius = ent:GetPhysicsRadius(0) + r
            if ent:GetDistanceSqToPoint(x, 0, z) < radius * radius then
                DestroyEntity(ent, TheWorld)
            end
        end
    end
end
```

## Best Practices

### 🟢 Do's
- Use entity state functions for consistent death checking
- Leverage bridge construction helpers for custom bridge types
- Utilize food classification systems for nutrition mechanics
- Check entity validity before performing operations
- Use appropriate tag collections for combat targeting

### ❌ Don'ts
- Don't assume entities have specific components without checking
- Don't ignore the require_health parameter in death checks
- Don't modify global tag collections directly
- Don't skip validation when using bridge construction helpers
- Don't assume inventory items are always valid

## Performance Considerations

### Entity Searching
- Functions use optimized entity finding with appropriate tag filters
- Radius-based searches include overhang calculations for accuracy
- Cached results where possible to avoid repeated calculations

### Memory Management
- Helper functions avoid creating unnecessary temporary objects
- Tag collections are defined as constants to reduce memory allocation
- Entity validation prevents processing of invalid entities

## Related Systems

- **[Components](./components/)**: Individual component implementations
- **[Actions](./actions.md)**: Action system that uses these utilities
- **[World Management](./world-management/)**: World tile and terrain systems
- **[Combat](./game-mechanics/combat.md)**: Combat targeting and damage systems

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 675312 | 2024-12-19 | Current stable implementation with full utility set |
| 675000 | 2024-12-01 | Added Wagpunk Arena collision data and void tile handling |
| 674500 | 2024-11-15 | Enhanced bridge construction system with geometric optimization |
| 674000 | 2024-11-01 | Added close inspector utilities for rose glasses system |
| 673500 | 2024-10-15 | Improved tile change handling for ocean and void transitions |

---

*These utility functions form the foundation for many gameplay mechanics. For specific component implementations that use these utilities, see the [Components documentation](./components/).*
