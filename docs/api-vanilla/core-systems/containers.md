---
title: "Containers"
description: "Container system configuration and widget setup for various storage types in Don't Starve Together"
sidebar_position: 6
slug: /api-vanilla/core-systems/containers
last_updated: 2024-12-19
build_version: 675312
change_status: stable
---

# Containers

The containers system manages all storage interfaces in Don't Starve Together, including backpacks, chests, cooking stations, and specialized containers. It defines UI layouts, item validation rules, and interaction behaviors for each container type.

## Overview

The containers module provides:
- **Widget Configuration**: Slot positions, animations, and UI layout for container interfaces
- **Item Validation**: Rules determining which items can be placed in specific containers
- **Interaction Behaviors**: Button actions, sounds, and special container mechanics
- **Container Types**: Support for different container categories (pack, chest, cooker, hand_inv)

## Core Functions

### widgetsetup(container, prefab, data)

Sets up container widget configuration based on prefab or provided data.

**Parameters:**
- `container` - The container component instance
- `prefab` - Container prefab name (optional)
- `data` - Custom configuration data (optional)

**Usage:**
```lua
-- Called automatically during container initialization
containers.widgetsetup(self, "backpack")

-- Using custom data
local custom_config = {
    widget = {
        slotpos = {Vector3(0, 0, 0)},
        animbank = "ui_chest_1x1",
        animbuild = "ui_chest_1x1"
    },
    type = "chest"
}
containers.widgetsetup(self, nil, custom_config)
```

## Container Configuration Structure

Each container configuration in `params` table contains:

### Widget Properties
- **slotpos**: Array of Vector3 positions for inventory slots
- **animbank/animbuild**: Animation assets for container UI
- **pos**: Container widget position offset
- **side_align_tip**: Tooltip alignment for side containers
- **buttoninfo**: Configuration for action buttons (cooking, crafting, etc.)
- **slotbg**: Custom slot background images
- **opensound/closesound**: Audio cues for container interactions

### Container Behavior
- **type**: Container category (`"pack"`, `"chest"`, `"cooker"`, `"hand_inv"`, etc.)
- **acceptsstacks**: Whether container accepts item stacks
- **usespecificslotsforitems**: Forces items to specific slot positions
- **issidewidget**: Renders container as side panel
- **openlimit**: Maximum concurrent users
- **excludefromcrafting**: Hides container contents from crafting recipes

### Item Validation
- **itemtestfn**: Function determining valid items for container
- **priorityfn**: Function for automatic item sorting priority

## Container Types

### Storage Containers

#### Backpacks
**Prefabs:** `backpack`, `icepack`, `krampus_sack`, `piggyback`, `seedpouch`, `candybag`

```lua
-- Backpack configuration example
params.backpack = {
    widget = {
        slotpos = {}, -- 2x4 grid calculated in loop
        animbank = "ui_backpack_2x4",
        animbuild = "ui_backpack_2x4",
        pos = Vector3(-5, -80, 0),
    },
    issidewidget = true,
    type = "pack",
    openlimit = 1,
}
```

#### Chests
**Prefabs:** `treasurechest`, `icebox`, `chester`, `hutch`, `fish_box`

```lua
-- Icebox with food validation
function params.icebox.itemtestfn(container, item, slot)
    if item:HasTag("icebox_valid") then
        return true
    end
    
    -- Must be perishable
    if not (item:HasTag("fresh") or item:HasTag("stale") or item:HasTag("spoiled")) then
        return false
    end
    
    -- Must be edible
    for k, v in pairs(FOODTYPE) do
        if item:HasTag("edible_"..v) then
            return true
        end
    end
    
    return false
end
```

### Cooking Containers

#### Cook Pot
**Prefabs:** `cookpot`, `archive_cookpot`, `portablecookpot`

```lua
-- Cook pot with cooking action
params.cookpot = {
    widget = {
        slotpos = {
            Vector3(0, 64 + 32 + 8 + 4, 0),
            Vector3(0, 32 + 4, 0),
            Vector3(0, -(32 + 4), 0),
            Vector3(0, -(64 + 32 + 8 + 4), 0),
        },
        buttoninfo = {
            text = STRINGS.ACTIONS.COOK,
            position = Vector3(0, -165, 0),
        }
    },
    acceptsstacks = false,
    type = "cooker",
}

function params.cookpot.itemtestfn(container, item, slot)
    return cooking.IsCookingIngredient(item.prefab) and not container.inst:HasTag("burnt")
end

function params.cookpot.widget.buttoninfo.fn(inst, doer)
    if inst.components.container ~= nil then
        BufferedAction(doer, inst, ACTIONS.COOK):Do()
    elseif inst.replica.container ~= nil and not inst.replica.container:IsBusy() then
        SendRPCToServer(RPC.DoWidgetButtonAction, ACTIONS.COOK.code, inst, ACTIONS.COOK.mod_name)
    end
end
```

#### Portable Spicer
**Prefab:** `portablespicer`

```lua
-- Specific slot requirements for spicing
params.portablespicer = {
    widget = {
        slotpos = {
            Vector3(0, 32 + 4, 0),    -- Food slot
            Vector3(0, -(32 + 4), 0), -- Spice slot
        },
        slotbg = {
            { image = "cook_slot_food.tex" },
            { image = "cook_slot_spice.tex" },
        },
    },
    usespecificslotsforitems = true,
    type = "cooker",
}

function params.portablespicer.itemtestfn(container, item, slot)
    return item.prefab ~= "wetgoop"
        and (   (slot == 1 and item:HasTag("preparedfood") and not item:HasTag("spicedfood")) or
                (slot == 2 and item:HasTag("spice")) or
                (slot == nil and (item:HasTag("spice") or (item:HasTag("preparedfood") and not item:HasTag("spicedfood"))))
            )
        and not container.inst:HasTag("burnt")
end
```

### Specialized Containers

#### Bundle Wrapper
**Prefab:** `bundle_container`

```lua
-- Bundle creation interface
function params.bundle_container.itemtestfn(container, item, slot)
    return not (item:HasTag("irreplaceable") or item:HasTag("_container") or 
               item:HasTag("bundle") or item:HasTag("nobundling"))
end

function params.bundle_container.widget.buttoninfo.validfn(inst)
    return inst.replica.container ~= nil and not inst.replica.container:IsEmpty() and 
           not inst.replica.container:IsReadOnlyContainer()
end
```

#### Construction Helper
**Prefab:** `construction_container`

```lua
-- Construction material interface
function params.construction_container.itemtestfn(container, item, slot)
    local doer = container.inst.entity:GetParent()
    return doer ~= nil
        and doer.components.constructionbuilderuidata ~= nil
        and doer.components.constructionbuilderuidata:GetIngredientForSlot(slot) == item.prefab
end
```

### Equipment Containers

#### Fishing Rod
**Prefab:** `oceanfishingrod`

```lua
-- Fishing tackle attachment
params.oceanfishingrod = {
    widget = {
        slotpos = {
            Vector3(0,   32 + 4,  0), -- Bobber slot
            Vector3(0, -(32 + 4), 0), -- Lure slot
        },
        slotbg = {
            { image = "fishing_slot_bobber.tex" },
            { image = "fishing_slot_lure.tex" },
        },
    },
    usespecificslotsforitems = true,
    type = "hand_inv",
    excludefromcrafting = true,
}

function params.oceanfishingrod.itemtestfn(container, item, slot)
    return (slot == nil and (item:HasTag("oceanfishing_bobber") or item:HasTag("oceanfishing_lure")))
        or (slot == 1 and item:HasTag("oceanfishing_bobber"))
        or (slot == 2 and item:HasTag("oceanfishing_lure"))
end
```

#### Slingshot
**Prefabs:** `slingshot`, `slingshotex`, `slingshot2`, `slingshot2ex`

```lua
-- Ammunition container with skill requirements
function params.slingshot.itemtestfn(container, item, slot)
    if item.REQUIRED_SKILL then
        local owner
        if TheWorld.ismastersim then
            owner = container.inst.components.container:GetOpeners()[1]
        elseif ThePlayer and container:IsOpenedBy(ThePlayer) then
            owner = ThePlayer
        end
        
        if owner and not (owner.components.skilltreeupdater and 
           owner.components.skilltreeupdater:IsActivated(item.REQUIRED_SKILL)) then
            return false
        end
    end
    return item:HasTag("slingshotammo")
end
```

## Advanced Features

### Character-Specific Containers

#### Wendy's Sisturn
```lua
-- Skill tree integration for expanded functionality
function params.sisturn.itemtestfn(container, item, slot)
    local owner
    if TheWorld.ismastersim then
        owner = container.inst.components.container:GetOpeners()[1]
    elseif ThePlayer and container:IsOpenedBy(ThePlayer) then
        owner = ThePlayer
    end

    if not owner or (owner.components.skilltreeupdater and 
       owner.components.skilltreeupdater:IsActivated("wendy_sisturn_3")) then
        return item.prefab == "petals" or item.prefab == "moon_tree_blossom" or item.prefab == "petals_evil"
    end

    return item.prefab == "petals" 
end
```

#### Wortox's Soul Jar
```lua
-- Soul storage with exclusions
function params.wortox_souljar.itemtestfn(container, item, slot)
    return item:HasTag("soul") and not item:HasTag("nosouljar")
end
```

### Priority Systems

Specialized containers can implement priority functions for automatic item sorting:

```lua
-- Seed pouch prioritizes seeds
function params.seedpouch.itemtestfn(container, item, slot)
    return item.prefab == "seeds" or string.match(item.prefab, "_seeds") or item:HasTag("treeseed")
end

params.seedpouch.priorityfn = params.seedpouch.itemtestfn
```

## Integration Examples

### Creating Custom Containers

```lua
-- Define new container configuration
params.my_custom_container = {
    widget = {
        slotpos = {
            Vector3(-37.5, 32, 0),
            Vector3(37.5, 32, 0),
            Vector3(-37.5, -32, 0),
            Vector3(37.5, -32, 0),
        },
        animbank = "ui_chest_2x2",
        animbuild = "ui_chest_2x2",
        pos = Vector3(200, 0, 0),
        side_align_tip = 120,
    },
    type = "chest",
}

-- Add item validation
function params.my_custom_container.itemtestfn(container, item, slot)
    return item:HasTag("my_custom_tag")
end

-- Apply to prefab
local function OnInit(inst)
    containers.widgetsetup(inst.components.container, "my_custom_container")
end
```

### Conditional Item Acceptance

```lua
-- Dynamic item testing based on container state
function params.conditional_container.itemtestfn(container, item, slot)
    -- Check container upgrade level
    if container.inst:HasTag("upgraded") then
        return item:HasTag("advanced_material")
    else
        return item:HasTag("basic_material")
    end
end
```

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 675312 | 2024-12-19 | Current stable implementation |
| 650000 | 2024-06-15 | Added slingshot modification containers |
| 600000 | 2024-01-20 | Expanded fishing tackle system |
| 550000 | 2023-09-10 | Added construction helper containers |

## Related Modules

- **[Components](./components/)** - Container component implementation
- **[Actions](./actions.md)** - Container interaction actions
- **[Recipes](./recipes.md)** - Crafting integration with containers
- **[Networking](./networking.md)** - Container state synchronization
- **[Prefabs](./prefabs.md)** - Container prefab definitions

## Notes

🟢 **Stable API**: Container configuration structure is established and stable across updates.

⚠️ **Performance**: Large containers with complex `itemtestfn` can impact performance during item validation.

🔧 **Modding**: Custom containers can be added by extending the `params` table and ensuring proper widget setup.

📦 **Memory**: Container slot positions are pre-calculated during module load for optimal performance.
