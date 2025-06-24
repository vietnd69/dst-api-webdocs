---
id: prefabutil
title: Prefab Utilities
description: Helper functions and utilities for creating and managing prefabs
sidebar_position: 39
slug: api-vanilla/core-systems/prefabutil
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Prefab Utilities

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `prefabutil` module provides utility functions for creating common types of prefabs, particularly placers and deployable kit items. These functions standardize the creation process and handle common patterns used throughout the game.

## Usage Example

```lua
-- Create a placer for building preview
local my_placer = MakePlacer("my_structure_placer", "my_structure", "my_structure", "idle")

-- Create a deployable kit item
local my_kit = MakeDeployableKitItem("my_structure_kit", "my_structure", 
    "my_kit", "my_kit", "idle", assets, floatable_data)

return my_placer, my_kit
```

## Placer Functions

### MakePlacer(name, bank, build, anim, onground, snap, metersnap, scale, fixedcameraoffset, facing, postinit_fn, offset, onfailedplacement) {#makeplacer}

**Status:** `stable`

**Description:**
Creates a placer prefab used for previewing structure placement before building.

**Parameters:**
- `name` (string): Placer prefab name
- `bank` (string): Animation bank name
- `build` (string): Animation build name
- `anim` (string): Animation to play
- `onground` (boolean, optional): Whether placer should be oriented on ground
- `snap` (boolean, optional): Whether to snap to grid
- `metersnap` (number, optional): Snap distance in meters
- `scale` (number, optional): Scale multiplier for the placer
- `fixedcameraoffset` (boolean, optional): Whether to use fixed camera offset
- `facing` (string, optional): Facing type ("two", "four", "six", "eight")
- `postinit_fn` (function, optional): Additional initialization function
- `offset` (Vector3, optional): Position offset for the placer
- `onfailedplacement` (function, optional): Callback when placement fails

**Returns:**
- (Prefab): Configured placer prefab

**Example:**
```lua
-- Basic structure placer
local chest_placer = MakePlacer("chest_placer", "treasure_chest", "treasure_chest", "closed")

-- Advanced placer with grid snapping
local fence_placer = MakePlacer("fence_placer", "fence", "fence", "idle", 
    false,    -- not on ground
    true,     -- snap to grid
    1,        -- 1 meter snap
    1,        -- normal scale
    nil,      -- no fixed camera offset
    "eight",  -- 8-directional facing
    function(inst)
        -- Custom initialization
        inst.AnimState:SetMultColour(0.6, 0.6, 0.6, 0.6)
    end
)

-- Placer with custom offset
local lamp_placer = MakePlacer("lamp_placer", "lamp", "lamp", "idle",
    false, false, nil, nil, nil, nil, nil,
    Vector3(0, 1, 0)  -- Raised above ground
)
```

### Placer Properties

Placers created by `MakePlacer` have several important characteristics:

**Tags:**
- `"CLASSIFIED"` - Non-networked entity
- `"NOCLICK"` - Cannot be clicked/interacted with
- `"placer"` - Identifies as a placement preview

**Components:**
- `placer` - Handles placement logic and validation

**Visual Properties:**
- Light override set to full brightness
- Semi-transparent appearance for preview
- Snapping and grid alignment support

## Deployable Kit Functions

### MakeDeployableKitItem(name, prefab_to_deploy, bank, build, anim, assets, floatable_data, tags, burnable, deployable_data, stack_size, PostMasterSimfn) {#makedeployablekititem}

**Status:** `stable`

**Description:**
Creates a deployable kit item that can be used to place structures in the world.

**Parameters:**
- `name` (string): Kit item prefab name
- `prefab_to_deploy` (string): Name of prefab to spawn when deployed
- `bank` (string): Animation bank for the kit item
- `build` (string, optional): Animation build (defaults to bank)
- `anim` (string, optional): Animation name (defaults to "idle")
- `assets` (table, optional): Array of Asset objects
- `floatable_data` (table, optional): Floating configuration `{size, y_offset, scale}`
- `tags` (table, optional): Additional tags for the kit item
- `burnable` (table/boolean, optional): Burnable configuration or true for default
- `deployable_data` (table, optional): Deployment configuration
- `stack_size` (number, optional): Maximum stack size
- `PostMasterSimfn` (function, optional): Additional master sim initialization

**Returns:**
- (Prefab): Configured deployable kit item

**Deployable Data Options:**
```lua
deployable_data = {
    deploymode = DEPLOYMODE.ANYWHERE,        -- Where item can be deployed
    deployspacing = DEPLOYSPACING.MEDIUM,    -- Spacing requirements
    restrictedtag = "tag_name",              -- Tag restriction for placement
    usegridplacer = true,                    -- Use grid-based placement
    usedeployspacingasoffset = true,         -- Use spacing as offset
    deploytoss_symbol_override = "symbol",   -- Override toss animation symbol
    custom_candeploy_fn = function() end,    -- Custom deployment validation
    common_postinit = function(inst) end,    -- Client-side initialization
    master_postinit = function(inst) end,    -- Server-side initialization
    OnSave = function(inst, data) end,       -- Save function
    OnLoad = function(inst, data) end,       -- Load function
}
```

**Example:**
```lua
-- Basic deployable chest kit
local chest_kit = MakeDeployableKitItem("chest_kit", "treasurechest",
    "chest_kit", "chest_kit", "idle", {
        Asset("ANIM", "anim/chest_kit.zip"),
        Asset("ATLAS", "images/inventoryimages/chest_kit.xml"),
    }
)

-- Advanced kit with floating and stacking
local advanced_kit = MakeDeployableKitItem("fence_kit", "fence",
    "fence_kit", "fence_kit", "idle",
    assets,
    {size = "med", y_offset = 0.1, scale = 0.8},  -- floatable_data
    {"deployable", "kit"},                         -- tags
    {fuelvalue = 50},                             -- burnable
    {
        deploymode = DEPLOYMODE.ANYWHERE,
        deployspacing = DEPLOYSPACING.LESS,
        usegridplacer = true,
        common_postinit = function(inst)
            inst:AddTag("fence_kit")
        end,
        master_postinit = function(inst)
            inst:AddComponent("fuel")
            inst.components.fuel.fuelvalue = 50
        end
    },
    20  -- stack_size
)

-- Kit with custom deployment validation
local special_kit = MakeDeployableKitItem("special_kit", "special_structure",
    "special_kit", nil, nil, assets, nil, nil, nil,
    {
        deploymode = DEPLOYMODE.ANYWHERE,
        custom_candeploy_fn = function(inst, pt, deployer)
            -- Only allow deployment on specific ground types
            local ground = TheWorld.Map:GetTileAtPoint(pt:Get())
            return ground == GROUND.GRASS or ground == GROUND.FOREST
        end
    }
)
```

## Deployment System

### deployablekititem_ondeploy(inst, pt, deployer, rot) {#deployablekititem-ondeploy}

**Status:** `stable`

**Description:**
Internal function that handles the deployment process when a kit item is used.

**Process:**
1. Spawns the target prefab at the deployment point
2. Transfers skin information if available
3. Triggers `"onbuilt"` event with deployment context
4. Removes the kit item

**Event Data:**
```lua
-- "onbuilt" event data
{
    builder = deployer,     -- Entity that deployed the kit
    pos = pt,              -- Deployment position
    rot = rot,             -- Deployment rotation
    deployable = inst      -- The kit item being deployed
}
```

## Common Deployment Configurations

### Deployment Modes

```lua
-- Available deployment modes
DEPLOYMODE.ANYWHERE          -- Can be placed anywhere valid
DEPLOYMODE.ON_WATER         -- Must be placed on water
DEPLOYMODE.ON_LAND          -- Must be placed on land  
DEPLOYMODE.MAST             -- Special mast placement rules
DEPLOYMODE.TURF             -- Turf-specific placement
```

### Deployment Spacing

```lua
-- Spacing requirements between deployables
DEPLOYSPACING.NONE          -- No spacing requirements
DEPLOYSPACING.LESS          -- Minimal spacing
DEPLOYSPACING.MEDIUM        -- Standard spacing
DEPLOYSPACING.MORE          -- Large spacing requirements
```

### Grid Placement

```lua
-- Grid-based placement for aligned structures
deployable_data = {
    usegridplacer = true,
    deployspacing = DEPLOYSPACING.MEDIUM,
}
```

## Advanced Usage Patterns

### Custom Validation

```lua
-- Kit that can only be placed near water
local dock_kit = MakeDeployableKitItem("dock_kit", "dock",
    "dock_kit", nil, nil, assets, nil, nil, nil,
    {
        custom_candeploy_fn = function(inst, pt, deployer)
            -- Check for nearby water
            local x, y, z = pt:Get()
            for dx = -3, 3 do
                for dz = -3, 3 do
                    local tile = TheWorld.Map:GetTileAtPoint(x + dx, 0, z + dz)
                    if tile == GROUND.OCEAN or tile == GROUND.POND then
                        return true
                    end
                end
            end
            return false, "Must be placed near water"
        end
    }
)
```

### Skin Integration

```lua
-- Kit that preserves skin when deployed
local skinnable_kit = MakeDeployableKitItem("chest_kit", "treasurechest",
    "chest_kit", nil, nil, assets, nil, nil, nil,
    {
        master_postinit = function(inst)
            -- Custom skin handling
            local old_ondeploy = inst.components.deployable.ondeploy
            inst.components.deployable.ondeploy = function(inst, pt, deployer, rot)
                -- Store skin before deployment
                local skin_name = inst.linked_skinname
                local structure = SpawnPrefab(inst._prefab_to_deploy, skin_name, inst.skin_id)
                if structure then
                    structure.Transform:SetPosition(pt:Get())
                    structure:PushEvent("onbuilt", {
                        builder = deployer,
                        pos = pt,
                        rot = rot,
                        deployable = inst
                    })
                    inst:Remove()
                end
            end
        end
    }
)
```

### Multi-Stage Deployment

```lua
-- Kit that creates multiple structures
local complex_kit = MakeDeployableKitItem("base_kit", "main_structure",
    "base_kit", nil, nil, assets, nil, nil, nil,
    {
        master_postinit = function(inst)
            inst.components.deployable.ondeploy = function(inst, pt, deployer, rot)
                -- Deploy main structure
                local main = SpawnPrefab("main_structure")
                main.Transform:SetPosition(pt:Get())
                
                -- Deploy supporting structures
                local support1 = SpawnPrefab("support_structure")
                support1.Transform:SetPosition(pt.x + 2, 0, pt.z)
                
                local support2 = SpawnPrefab("support_structure")  
                support2.Transform:SetPosition(pt.x - 2, 0, pt.z)
                
                -- Link structures
                main.supports = {support1, support2}
                
                inst:Remove()
            end
        end
    }
)
```

## Related Modules

- [Prefabs](./prefabs.md): Core prefab system and classes
- [Deployable Component](../components/deployable.md): Deployment logic and validation
- [Placer Component](../components/placer.md): Placement preview system
- [Construction](./construction.md): Building and structure creation
