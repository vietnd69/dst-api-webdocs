---
id: skinprefabs
title: Skinprefabs
description: This file defines and registers cosmetic skin prefab configurations for items, structures, pets, and characters using CreatePrefabSkin calls with initialization callbacks.
tags: [skins, cosmetics, prefabs, items]
sidebar_position: 10

last_updated: 2026-04-11
build_version: 719586
change_status: stable
category_type: prefabs
source_hash: c9f03c13
system_scope: inventory
---

# Skinprefabs

> Based on game build **719586** | Last updated: 2026-04-11

## Overview
`skinprefabs.lua` is a data configuration file that populates a global `prefs` table with hundreds of cosmetic skin prefab definitions for Don't Starve Together. Each skin entry is created using the `CreatePrefabSkin()` factory function and specifies metadata including base prefab, rarity, skin tags, release group, and an initialization callback. The file covers item skins (weapons, tools, containers), structure skins (fences, walls, furniture), pet skins, and character skin variants for all playable characters. Special logic exists for the labrat backpack skin, which implements dynamic colour-changing mechanics triggered by electrical stimuli, haunting, and freezing events.

## Usage example
```lua
local skinprefabs = require "prefabs/skinprefabs"

-- Access the prefs table containing all skin definitions
local prefs = skinprefabs

-- Iterate through skin definitions
for i, skin_def in ipairs(prefs) do
    print(skin_def.name)        -- Skin identifier
    print(skin_def.base_prefab) -- Base prefab this skin modifies
    print(skin_def.rarity)      -- Rarity level (e.g., "Heirloom", "Elegant")
end

-- Skin definitions are registered with the skin system at game initialization
```

## Dependencies & tags
**External dependencies:**
- `CreatePrefabSkin` -- Global function called to create and insert skin prefab definitions into the prefs table
- `*_init_fn` -- Multiple initialization function references passed as init_fn callbacks for specific skin types

**Components used:**
- `inventoryitem` -- ChangeImageName called to update backpack image based on colour selection
- `bloomer` -- PushBloom called in followfx_postinit to apply bloom shader effect
- `inventory` -- IsInsulated checked to determine if owner is protected from lightning effects

**Tags:**
- `AMULET_RED`, `AMULET_YELLOW`, `ANCHOR`, `ARMOR_BRAMBLE`, `ARMORDREADSTONE`, `ARMORGRASS`, `ARMOR_LUNARPLANT`, `ARMORMARBLE`, `ANCIENT`, `ARTNOUVEAU`, `CRAFTABLE`, `LAVA`, `LUNAR`, `NAUTICAL`, `ORNATE`, `RELIC`, `ROSE`, `SHADOW` -- check operations for various item types
- `BACKPACK`, `FANTASY`, `HALLOWED`, `BEARGERFUR_SACK`, `MYSTICAL`, `BEARGERVEST`, `WINTER`, `BEDROLL`, `MIGHTY`, `BLUE`, `GREEN`, `GREY`, `ORANGE`, `RED`, `GLOMMER`, `GOGGLESHAT`, `COTTAGE`, `GOLDENFARMHOE`, `INVISIBLE`, `GOLDENAXE`, `YOTC`, `GOLDENPICKAXE`, `GOLDENPITCHFORK`, `GOLDENSHOVEL`, `GRAVESTONE`, `GOTHIC`, `PET`, `PICKAXE`, `VICTORIAN`, `PIGGYBACK`, `PIGHOUSE`, `HOCKEY`, `PITCHFORK`, `PORTABLEBLENDER`, `T_UPDATE`, `PORTABLECOOKPOT`, `PORTABLESPICER`, `POTTEDFERN`, `C_UPDATE`, `RAINCOAT`, `WESTERN`, `RAINOMETER`, `CIRCUS`, `SWAMP`, `RAZOR`, `BARBER`, `REFLECTIVEVEST`, `CAWNIVAL`, `ALCHEMY`, `CRYSTAL`, `ADVENTURE`, `MANIPULATOR`, `SCIENCEMACHINE`, `RETRO`, `RESKIN`, `HEART`, `RESURRECTIONSTATUE`, `REVIVER`, `SCULPTINGTABLE`, `SEASIDE`, `SEAFARINGPROTO`, `SEEDPOUCH`, `BOY`, `SEWING_MANNEQUIN`, `SHOVEL`, `SIESTAHUT`, `SISTURN`, `SKELETONHAT`, `MYTHICAL`, `CHEST`, `YULE`, `BASE`, `WANDA`, `WARDROBE`, `HANDMEDOWN`, `YOTP`, `WARLY`, `COSTUME`, `CHEF`, `FISHERMAN`, `FORMAL`, `ICE`, `MASQUERADE`, `VARG`, `PIRATE`, `SURVIVOR`, `BUILDERS`, `WATERINGCAN`, `WATERMELONHAT`, `WATHGRITHR`, `WICKERBOTTOM`, `WILLOW`, `WINONA_SPOTLIGHT`, `SPRING`, `WINONA`, `WINONA_BATTERY_HIGH`, `WINONA_BATTERY_LOW`, `WINTERHAT`, `WOODIE`, `WX78` -- add/check operations for skin categorization

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|

## Main functions
### `init_fn(inst, skin_custom)`
* **Description:** Anonymous initialization callback assigned to each skin prefab; calls type-specific init function with the skin name and custom data.
* **Parameters:**
  - `inst` -- Entity instance of the skin prefab being initialized
  - `skin_custom` -- Custom skin data table passed from the skin system
* **Returns:** nil
* **Error states:** Errors if the referenced init_fn is not defined in scope when the skin is instantiated

### `followfx_postinit(inst, fx)`
* **Description:** Initializes the follow effect with light override and bloom shader, then applies colour settings if not default yellow.
* **Parameters:**
  - `inst` -- Entity instance owning the backpack skin
  - `fx` -- Follow effect entity to initialize
* **Returns:** nil
* **Error states:** None

### `initialize(inst)`
* **Description:** Creates event handler table for playerlightningtargeted, attacked, haunted, and freeze events, then registers the haunted listener on the instance.
* **Parameters:**
  - `inst` -- Entity instance being initialized with labrat backpack skin
* **Returns:** nil
* **Error states:** None

### `uninitialize(inst)`
* **Description:** Removes all event callbacks from instance and owner, clears stored event handlers, owner reference, colour value, and usefollowsymbol flag.
* **Parameters:**
  - `inst` -- Entity instance being uninitialized
* **Returns:** nil
* **Error states:** None

### `onequip(inst, owner)`
* **Description:** Removes old event listeners from previous owner if present, stores new owner reference, and registers all event listeners on the new owner entity.
* **Parameters:**
  - `inst` -- Entity instance being equipped
  - `owner` -- Player entity equipping the backpack
* **Returns:** nil
* **Error states:** None

### `onunequip(inst, owner)`
* **Description:** Removes all event listeners from the stored owner and clears the owner reference.
* **Parameters:**
  - `inst` -- Entity instance being unequipped
  - `owner` -- Player entity unequipping the backpack
* **Returns:** nil
* **Error states:** Asserts failure if owner parameter does not match stored _backpack_labrat_owner

### `onsave(inst, data)`
* **Description:** Stores the current labrat colour index in the save data table under labrat_colour key.
* **Parameters:**
  - `inst` -- Entity instance being saved
  - `data` -- Save data table to populate
* **Returns:** nil
* **Error states:** None

### `onload(inst, data, ents)`
* **Description:** Restores the labrat colour from save data and updates the visual state, toggling usefollowsymbol as needed.
* **Parameters:**
  - `inst` -- Entity instance being loaded
  - `data` -- Save data table containing labrat_colour
  - `ents` -- Entity reference table for save/load resolution
* **Returns:** nil
* **Error states:** None

## Events & listeners
**Listens to:**
- `haunted` -- Triggers colour reset and visual state change when entity is haunted

**Pushes:**
None
