---
title: "Containers"
description: "Container system configuration and widget setup for various storage types in Don't Starve Together"
sidebar_position: 1
slug: /game-scripts/core-systems/containers
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Containers

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The containers system manages all storage interfaces in Don't Starve Together, including backpacks, chests, cooking stations, and specialized containers. It defines UI layouts, item validation rules, and interaction behaviors for each container type.

The containers module provides:
- **Widget Configuration**: Slot positions, animations, and UI layout for container interfaces
- **Item Validation**: Rules determining which items can be placed in specific containers
- **Interaction Behaviors**: Button actions, sounds, and special container mechanics
- **Container Types**: Support for different container categories (pack, chest, cooker, hand_inv, side_inv_behind, top_rack)

## Core Functions

### containers.widgetsetup(container, prefab, data)

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

### containers.MAXITEMSLOTS

Maximum number of item slots across all container types, calculated automatically during module initialization.

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
- **type**: Container category (`"pack"`, `"chest"`, `"cooker"`, `"hand_inv"`, `"side_inv_behind"`, `"top_rack"`, `"backpack"`)
- **acceptsstacks**: Whether container accepts item stacks
- **usespecificslotsforitems**: Forces items to specific slot positions
- **issidewidget**: Renders container as side panel
- **openlimit**: Maximum concurrent users
- **excludefromcrafting**: Hides container contents from crafting recipes
- **lowpriorityselection**: Lower priority for automatic item selection

### Item Validation
- **itemtestfn**: Function determining valid items for container
- **priorityfn**: Function for automatic item sorting priority

## Container Types

### Storage Containers

#### Backpacks
**Prefabs:** `backpack`, `icepack`, `krampus_sack`, `piggyback`, `seedpouch`, `candybag`, `spicepack`

```lua
-- Backpack configuration example (2x4 slots)
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

-- Spice pack (2x3 slots)
params.spicepack = {
    widget = {
        slotpos = {}, -- 2x3 grid
        animbank = "ui_icepack_2x3",
        animbuild = "ui_icepack_2x3",
        pos = Vector3(-5, -70, 0),
    },
    issidewidget = true,
    type = "pack",
    openlimit = 1,
}
```

#### Chests
**Prefabs:** `treasurechest`, `icebox`, `chester`, `hutch`, `fish_box`, `boat_ancient_container`, `sacred_chest`

```lua
-- Chester configuration (3x3 slots)
params.chester = {
    widget = {
        slotpos = {}, -- 3x3 grid calculated in loop
        animbank = "ui_chest_3x3",
        animbuild = "ui_chest_3x3",
        pos = Vector3(0, 200, 0),
        side_align_tip = 160,
    },
    type = "chest",
}

-- Icebox with food validation
function params.icebox.itemtestfn(container, item, slot)
    if item:HasTag("icebox_valid") then
        return true
    end
    
    -- Must be perishable
    if not (item:HasTag("fresh") or item:HasTag("stale") or item:HasTag("spoiled")) then
        return false
    end
    
    -- Must not be small creature
    if item:HasTag("smallcreature") then
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

#### Specialized Storage

**Fish Box** - Stores ocean creatures:
```lua
function params.fish_box.itemtestfn(container, item, slot)
    return item:HasTag("smalloceancreature")
end
```

**Salt Box** - Preserves cookable foods:
```lua
function params.saltbox.itemtestfn(container, item, slot)
    return ((item:HasTag("fresh") or item:HasTag("stale") or item:HasTag("spoiled"))
        and item:HasTag("cookable")
        and not item:HasTag("deployable")
        and not item:HasTag("smallcreature")
        and item.replica.health == nil)
        or item:HasTag("saltbox_valid")
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

### Character-Specific Containers

#### Wendy's Sisturn
```lua
function params.sisturn.itemtestfn(container, item, slot)
    local owner
    if TheWorld.ismastersim then
        owner = container.inst.components.container:GetOpeners()[1]
    elseif ThePlayer and container:IsOpenedBy(ThePlayer) then
        owner = ThePlayer
    end

    -- Skill tree integration for expanded functionality
    if not owner or (owner.components.skilltreeupdater and 
       owner.components.skilltreeupdater:IsActivated("wendy_sisturn_3")) then
        return item.prefab == "petals" or item.prefab == "moon_tree_blossom" or item.prefab == "petals_evil"
    end

    return item.prefab == "petals" 
end
```

#### Wortox's Soul Jar
```lua
function params.wortox_souljar.itemtestfn(container, item, slot)
    return item:HasTag("soul") and not item:HasTag("nosouljar")
end
```

#### Beard Sacks (Webber's Beard)
**Prefabs:** `beard_sack_1`, `beard_sack_2`, `beard_sack_3`

```lua
-- Progressive storage capacity based on beard length
params.beard_sack_1 = {
    widget = {
        slotpos = { Vector3(0, 0, 0) },
        slotbg = { { image = "inv_slot_morsel.tex" } },
        animbank = "ui_beard_1x1",
        animbuild = "ui_beard_1x1",
        pos = Vector3(-82, 89, 0),
        bottom_align_tip = -100,
    },
    type = "side_inv_behind",
    acceptsstacks = true,
    lowpriorityselection = true,
}

function params.beard_sack_1.itemtestfn(container, item, slot)
    -- Accepts any edible items
    for k, v in pairs(FOODGROUP.OMNI.types) do
        if item:HasTag("edible_"..v) then
            return true
        end
    end
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

#### Slingshot Variants
**Prefabs:** `slingshot`, `slingshotex`, `slingshot2`, `slingshot2ex`, `slingshot999ex`

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

#### Slingshot Modification Container
**Prefab:** `slingshotmodscontainer`

```lua
params.slingshotmodscontainer = {
    widget = {
        slotpos = {
            Vector3(220, 125, 0),   -- Band slot
            Vector3(20, -60, 0),    -- Frame slot
            Vector3(220, -150, 0),  -- Handle slot
        },
        slotbg = {
            { image = "inv_slot_sketchy.tex", atlas = "images/hud2.xml" },
            { image = "inv_slot_sketchy.tex", atlas = "images/hud2.xml" },
            { image = "inv_slot_sketchy.tex", atlas = "images/hud2.xml" },
        },
        slotscale = 1.6,
        slothighlightscale = 1.75,
    },
    usespecificslotsforitems = true,
    acceptsstacks = false,
    type = "cooker",
    openlimit = 1,
}

function params.slingshotmodscontainer.itemtestfn(container, item, slot)
    if slot == 1 then
        return item:HasTag("slingshot_band")
    elseif slot == 2 then
        return item:HasTag("slingshot_frame")
    elseif slot == 3 then
        return item:HasTag("slingshot_handle")
    elseif slot == nil then
        return item:HasAnyTag("slingshot_band", "slingshot_frame", "slingshot_handle")
    end
    return false
end
```

#### Antlion Hat
**Prefab:** `antlionhat`

```lua
params.antlionhat = {
    widget = {
        slotpos = { Vector3(0, 2, 0) },
        slotbg = { { image = "turf_slot.tex", atlas = "images/hud2.xml" } },
        animbank = "ui_antlionhat_1x1",
        animbuild = "ui_antlionhat_1x1",
        pos = Vector3(106, 40, 0),
    },
    type = "hand_inv",
    excludefromcrafting = true,
}

function params.antlionhat.itemtestfn(container, item, slot)
    return item:HasTag("groundtile") and item.tile
end
```

#### Alter Guardian Hat
**Prefabs:** `alterguardianhatshard`, `alterguardianhat`

```lua
-- Shard version (1 slot)
function params.alterguardianhatshard.itemtestfn(container, item, slot)
    return item:HasTag("spore")
end

-- Full version (5 slots)
local ALTERGUARDIANHAT_ITEMS = {"spore", "lunarseed"}
function params.alterguardianhat.itemtestfn(container, item, slot)
    return item:HasAnyTag(ALTERGUARDIANHAT_ITEMS)
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

#### Construction Containers
**Prefabs:** `construction_container`, `construction_repair_container`, `construction_rebuild_container`, `enable_shadow_rift_construction_container`, `enable_lunar_rift_construction_container`

```lua
-- Construction material interface
function params.construction_container.itemtestfn(container, item, slot)
    local doer = container.inst.entity:GetParent()
    return doer ~= nil
        and doer.components.constructionbuilderuidata ~= nil
        and doer.components.constructionbuilderuidata:GetIngredientForSlot(slot) == item.prefab
end
```

#### Woby Containers
**Prefabs:** `wobysmall`, `wobybig`, `woby_rack_container`

```lua
-- Woby rack for drying items
function params.woby_rack_container.itemtestfn(container, item, slot)
    return item:HasTag("dryable")
        or (TheWorld.ismastersim and (
                item:GetTimeAlive() == 0 or -- Items perishing replaced by spoiled_food/fish
                container.inst:GetTimeAlive() == 0 or -- Transferring items during woby transform
                (   item.wobyrack_lastinfo and -- Failing to move items; return to slot
                    item.wobyrack_lastinfo.container == container and
                    item.wobyrack_lastinfo.slot == slot
                )
            ))
end
```

#### Offering Pots
**Prefabs:** `offering_pot`, `offering_pot_upgraded`

```lua
function params.offering_pot.itemtestfn(container, item, slot)
    return not container.inst:HasTag("burnt") and item.prefab == "kelp"
end
```

#### Mushroom Lights
**Prefabs:** `mushroom_light`, `mushroom_light2`, `yots_lantern_post`

```lua
function params.mushroom_light.itemtestfn(container, item, slot)
    return (item:HasTag("lightbattery") or item:HasTag("lightcontainer")) and not container.inst:HasTag("burnt")
end

-- Enhanced version accepts spores too
function params.mushroom_light2.itemtestfn(container, item, slot)
    return (item:HasTag("lightbattery") or item:HasTag("spore") or item:HasTag("lightcontainer")) and not container.inst:HasTag("burnt")
end
```

#### Winter Tree Decorations
**Prefabs:** `winter_tree`, `winter_twiggytree`, `winter_deciduoustree`, `winter_palmconetree`

```lua
function params.winter_tree.itemtestfn(container, item, slot)
    return item:HasTag("winter_ornament") and not container.inst:HasTag("burnt")
end
```

#### Merm Buildings
**Prefabs:** `merm_toolshed`, `merm_toolshed_upgraded`, `merm_armory`, `merm_armory_upgraded`

```lua
-- Tool shed (twigs and rocks)
function params.merm_toolshed.itemtestfn(container, item, slot)
    return not container.inst:HasTag("burnt") and (
        (slot == 1 and item.prefab == "twigs") or
        (slot == 2 and item.prefab == "rocks") or
        (slot == nil and (item.prefab == "twigs" or item.prefab == "rocks"))
    )
end

-- Armory (logs and cut grass)
function params.merm_armory.itemtestfn(container, item, slot)
    return not container.inst:HasTag("burnt") and (
        (slot == 1 and item.prefab == "log") or
        (slot == 2 and item.prefab == "cutgrass") or
        (slot == nil and (item.prefab == "log" or item.prefab == "cutgrass"))
    )
end
```

#### Pocket Watch
**Prefab:** `pocketwatch`

```lua
function params.pocketwatch.itemtestfn(container, item, slot)
    return item:HasTag("pocketwatchpart")
end
```

#### Book Station
**Prefab:** `bookstation`

```lua
function params.bookstation.itemtestfn(container, item, slot)
    return item:HasTag("bookcabinet_item")
end
```

#### Tackle Containers
**Prefabs:** `tacklecontainer`, `supertacklecontainer`

```lua
function params.tacklecontainer.itemtestfn(container, item, slot)
    return item:HasTag("oceanfishing_bobber") or item:HasTag("oceanfishing_lure")
end
```

#### Halloween Tree
**Prefab:** `livingtree_halloween`

```lua
function params.livingtree_halloween.itemtestfn(container, item, slot)
    return item:HasTag("halloween_ornament") and not container.inst:HasTag("burnt")
end
```

#### Dragonfly Furnace
**Prefab:** `dragonflyfurnace`

```lua
function params.dragonflyfurnace.itemtestfn(container, item, slot)
    return not item:HasTag("irreplaceable")
end

function params.dragonflyfurnace.widget.buttoninfo.fn(inst, doer)
    if inst.components.container ~= nil then
        BufferedAction(doer, inst, ACTIONS.INCINERATE):Do()
    elseif inst.replica.container ~= nil and not inst.replica.container:IsBusy() then
        SendRPCToServer(RPC.DoWidgetButtonAction, ACTIONS.INCINERATE.code, inst, ACTIONS.INCINERATE.mod_name)
    end
end
```

#### Balatro Machine
**Prefab:** `balatro_machine`

```lua
params.balatro_machine = {
    widget = {
        slotpos = {
            Vector3(0, 0, 0),
            Vector3(68, 0, 0),
            Vector3(68+68, 0, 0),
            Vector3(68+68+68, 0, 0),
            Vector3(68+68+68+68, 0, 0),
        },
        slotbg = {
            { image = "sisturn_slot_petals.tex" },
            { image = "sisturn_slot_petals.tex" },
            { image = "sisturn_slot_petals.tex" },
            { image = "sisturn_slot_petals.tex" },
            { image = "sisturn_slot_petals.tex" },
        },
        buttoninfo = {
            text = STRINGS.ACTIONS.ACTIVATE.GENERIC,
            position = Vector3(68+68, -68, 0),
        },
    },
    acceptsstacks = false,
    type = "cooker",
    openlimit = 1,
}

function params.balatro_machine.itemtestfn(container, item, slot)
    return not container.inst:HasTag("burnt")
end

function params.balatro_machine.widget.buttoninfo.fn(inst, doer)
    if inst.components.container ~= nil then
        BufferedAction(doer, inst, ACTIONS.ACTIVATE_CONTAINER):Do()
    elseif inst.replica.container ~= nil and not inst.replica.container:IsBusy() then
        SendRPCToServer(RPC.DoWidgetButtonAction, ACTIONS.ACTIVATE_CONTAINER.code, inst, ACTIONS.ACTIVATE_CONTAINER.mod_name)
    end
end
```

#### Webber's Beard Sacks
**Prefabs:** `beard_sack_1`, `beard_sack_2`, `beard_sack_3`

These containers represent Webber's growing beard functionality, providing increasing storage capacity:

```lua
-- Level 1 beard (1 slot)
params.beard_sack_1 = {
    widget = {
        slotpos = { Vector3(0, 0, 0) },
        slotbg = { { image = "inv_slot_morsel.tex" } },
        animbank = "ui_beard_1x1",
        animbuild = "ui_beard_1x1",
        pos = Vector3(-82, 89, 0),
        bottom_align_tip = -100,
    },
    type = "side_inv_behind",
    acceptsstacks = true,
    lowpriorityselection = true,
}

-- Level 2 beard (2 slots)
params.beard_sack_2 = {
    widget = {
        slotpos = {
            Vector3(-(64 + 12)/2, 0, 0),
            Vector3( (64 + 12)/2, 0, 0),
        },
        slotbg = {
            { image = "inv_slot_morsel.tex" },
            { image = "inv_slot_morsel.tex" },
        },
        animbank = "ui_beard_2x1",
        animbuild = "ui_beard_2x1",
        pos = Vector3(-82, 89, 0),
        bottom_align_tip = -100,
    },
    type = "side_inv_behind",
    acceptsstacks = true,
    lowpriorityselection = true,
}

-- Level 3 beard (3 slots)
params.beard_sack_3 = {
    widget = {
        slotpos = {
            Vector3(-(64 + 12), 0, 0),
            Vector3(0, 0, 0),
            Vector3(64 + 12, 0, 0),
        },
        slotbg = {
            { image = "inv_slot_morsel.tex" },
            { image = "inv_slot_morsel.tex" },
            { image = "inv_slot_morsel.tex" },
        },
        animbank = "ui_beard_3x1",
        animbuild = "ui_beard_3x1",
        pos = Vector3(-82, 89, 0),
        bottom_align_tip = -100,
    },
    type = "side_inv_behind",
    acceptsstacks = true,
    lowpriorityselection = true,
}

function params.beard_sack_1.itemtestfn(container, item, slot)
    -- Accepts any edible items
    for k, v in pairs(FOODGROUP.OMNI.types) do
        if item:HasTag("edible_"..v) then
            return true
        end
    end
end

-- Shared item test function for all beard levels
params.beard_sack_2.itemtestfn = params.beard_sack_1.itemtestfn
params.beard_sack_3.itemtestfn = params.beard_sack_1.itemtestfn
```

```lua
params.balatro_machine = {
    widget = {
        slotpos = {
            Vector3(0, 0, 0),
            Vector3(68, 0, 0),
            Vector3(68+68, 0, 0),
            Vector3(68+68+68, 0, 0),
            Vector3(68+68+68+68, 0, 0),
        },
        buttoninfo = {
            text = STRINGS.ACTIONS.ACTIVATE.GENERIC,
            position = Vector3(68+68, -68, 0),
        },
    },
    acceptsstacks = false,
    type = "cooker",
    openlimit = 1,
}

function params.balatro_machine.itemtestfn(container, item, slot)
    return not container.inst:HasTag("burnt")
end
```

#### Additional Specialized Containers

**Elixir Container** (Wendy):
```lua
function params.elixir_container.itemtestfn(container, item, slot)
    return item:HasTag("ghostlyelixir") or item:HasTag("ghostflower")
end
```

**Battle Song Container**:
```lua
function params.battlesong_container.itemtestfn(container, item, slot)
    return item:HasTag("battlesong")
end
```

**Bearger Fur Sack**:
```lua
function params.beargerfur_sack.itemtestfn(container, item, slot)
    return item:HasTag("beargerfur_sack_valid") or item:HasTag("preparedfood")
end
```

**Houndstooth Blowpipe**:
```lua
function params.houndstooth_blowpipe.itemtestfn(container, item, slot)
    return item:HasTag("blowpipeammo")
end
```

**Slingshot Ammo Container**:
```lua
function params.slingshotammo_container.itemtestfn(container, item, slot)
    return item:HasTag("slingshotammo")
end
```

**Ocean Trawler**:
```lua
function params.ocean_trawler.itemtestfn(container, item, slot)
    return item:HasTag("cookable") or item:HasTag("oceanfish")
end
```

**YOTb Sewing Machine**:
```lua
function params.yotb_sewingmachine.itemtestfn(container, item, slot)
    return item:HasTag("yotb_pattern_fragment")
end
```

**Elixir Container** (Wendy):
```lua
function params.elixir_container.itemtestfn(container, item, slot)
    return item:HasTag("ghostlyelixir") or item:HasTag("ghostflower")
end
```

**Battle Song Container**:
```lua
function params.battlesong_container.itemtestfn(container, item, slot)
    return item:HasTag("battlesong")
end
```

**Bearger Fur Sack**:
```lua
function params.beargerfur_sack.itemtestfn(container, item, slot)
    return item:HasTag("beargerfur_sack_valid") or item:HasTag("preparedfood")
end
```

**Houndstooth Blowpipe**:
```lua
function params.houndstooth_blowpipe.itemtestfn(container, item, slot)
    return item:HasTag("blowpipeammo")
end
```

**Slingshot Ammo Container**:
```lua
function params.slingshotammo_container.itemtestfn(container, item, slot)
    return item:HasTag("slingshotammo")
end
```

**Ocean Trawler**:
```lua
function params.ocean_trawler.itemtestfn(container, item, slot)
    return item:HasTag("cookable") or item:HasTag("oceanfish")
end
```

**Teleportato Base** (Legacy):
```lua
function params.teleportato_base.itemtestfn(container, item, slot)
    return not item:HasTag("nonpotatable")
end
```

**Shadow/Rabbit King Horn Containers**:
```lua
function params.shadow_container.itemtestfn(container, item, slot)
    return not item:HasTag("irreplaceable")
end
```

### Event-Specific Containers (Quagmire)

These containers are used during the Quagmire event:

**Quagmire Cooking Containers:**
- `quagmire_pot`, `quagmire_pot_small`
- `quagmire_casseroledish`, `quagmire_casseroledish_small`
- `quagmire_grill`, `quagmire_grill_small`
- `quagmire_pot_syrup`

**Quagmire Backpacks:**
- `quagmire_backpack_small` (4 slots)
- `quagmire_backpack` (8 slots)

```lua
function params.quagmire_pot.itemtestfn(container, item, slot)
    return item:HasTag("quagmire_stewable")
        and item.prefab ~= "quagmire_sap"
        and ((item.components.inventoryitem ~= nil and not item.components.inventoryitem:IsHeld()) or
            not (item.prefab == "spoiled_food" or item:HasTag("preparedfood") or item:HasTag("overcooked") or container.inst:HasTag("takeonly")))
end

function params.quagmire_pot_syrup.itemtestfn(container, item, slot)
    return item:HasTag("quagmire_stewable")
        and ((item.components.inventoryitem ~= nil and not item.components.inventoryitem:IsHeld()) or
            (item.prefab == "quagmire_sap" and not container.inst:HasTag("takeonly")))
end
```

## Advanced Features

### Priority Systems

Specialized containers can implement priority functions for automatic item sorting:

```lua
-- Seed pouch prioritizes seeds
function params.seedpouch.itemtestfn(container, item, slot)
    return item.prefab == "seeds" or string.match(item.prefab, "_seeds") or item:HasTag("treeseed")
end

params.seedpouch.priorityfn = params.seedpouch.itemtestfn

-- Candy bag prioritizes Halloween items
function params.candybag.itemtestfn(container, item, slot)
    return item:HasTag("halloweencandy") or item:HasTag("halloween_ornament") or string.sub(item.prefab, 1, 8) == "trinket_"
end

params.candybag.priorityfn = params.candybag.itemtestfn
```

### Deprecated Containers

Some containers are marked as deprecated but maintained for compatibility:

**Shadow Chester** - Used by Dragonfly Chest and Minotaur Chest:
```lua
--Deprecated; keep definition for dragonflychest, minotaurchest, mods,
--and also for legacy save data
params.shadowchester = {
    widget = {
        slotpos = {}, -- 3x4 grid
        animbank = "ui_chester_shadow_3x4",
        animbuild = "ui_chester_shadow_3x4",
        pos = Vector3(0, 220, 0),
        side_align_tip = 160,
    },
    type = "chest",
}
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

### Complex Button Actions

```lua
-- Multi-stage button validation and execution
function params.complex_container.widget.buttoninfo.validfn(inst)
    local container = inst.replica.container
    if not container or container:IsEmpty() then
        return false
    end
    
    -- Check for specific item combinations
    local has_ingredient_a = container:Has("ingredient_a", 1)
    local has_ingredient_b = container:Has("ingredient_b", 1)
    
    return has_ingredient_a and has_ingredient_b
end

function params.complex_container.widget.buttoninfo.fn(inst, doer)
    -- Custom action execution with confirmation dialog
    if inst.components.container ~= nil then
        BufferedAction(doer, inst, ACTIONS.CUSTOM_ACTION):Do()
    elseif inst.replica.container ~= nil and not inst.replica.container:IsBusy() then
        SendRPCToServer(RPC.DoWidgetButtonAction, ACTIONS.CUSTOM_ACTION.code, inst, ACTIONS.CUSTOM_ACTION.mod_name)
    end
end
```

## Performance Considerations

The containers system calculates `MAXITEMSLOTS` automatically at module initialization:

```lua
for k, v in pairs(params) do
    containers.MAXITEMSLOTS = math.max(containers.MAXITEMSLOTS, v.widget.slotpos ~= nil and #v.widget.slotpos or 0)
end
```

This ensures proper memory allocation for the largest possible container configuration.

## Related Modules

- **[Components](./components/)** - Container component implementation
- **[Actions](./actions.md)** - Container interaction actions
- **[Recipes](./recipes.md)** - Crafting integration with containers
- **[Networking](./networking.md)** - Container state synchronization
- **[Prefabs](./prefabs.md)** - Container prefab definitions
- **[Cooking](./cooking.md)** - Cooking system integration
- **[Player](./player.md)** - Player inventory interactions

## Notes

🟢 **Stable API**: Container configuration structure is established and stable across updates.

⚠️ **Performance**: Large containers with complex `itemtestfn` can impact performance during item validation.

🔧 **Modding**: Custom containers can be added by extending the `params` table and ensuring proper widget setup.

📦 **Memory**: Container slot positions are pre-calculated during module load for optimal performance.

🎯 **Skill Integration**: Some containers check player skill tree progression for expanded functionality.

⭐ **Event Containers**: Quagmire containers are event-specific and may not be available in standard gameplay.
