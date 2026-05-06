---
id: prefabskin
title: Prefabskin
description: Defines initialization and cleanup functions for applying and removing skins on various prefabs including tools, structures, wearables, furniture, boats, walls, and decorative items, handling animation state changes, symbol swaps, visual effects, and sound effects.
tags: [skins, prefabs, visuals, animation, audio]
sidebar_position: 10

last_updated: 2026-04-17
build_version: 722832
change_status: stable
category_type: root
source_hash: 23a0bac6
system_scope: entity
---

# Prefabskin

> Based on game build **722832** | Last updated: 2026-04-17

## Overview
`prefabskin.lua` is a data configuration module providing static lookup tables for skin-related prefab settings. External systems access these configurations by calling `local mod = require("prefabskin")`, which returns the module table containing exported fields. Key tables include `BASE_TORSO_TUCK` (torso tucking modes), `BASE_ALTERNATE_FOR_BODY` and `BASE_ALTERNATE_FOR_SKIRT` (alternate mesh configurations), `ONE_PIECE_SKIRT` (one-piece skirt definitions), `BASE_LEGS_SIZE` and `BASE_FEET_SIZE` (limb scaling), `SKIN_FX_PREFAB` (visual effect mappings), and `SKIN_SOUND_FX` (audio effect mappings). These tables are structured as key-value pairs where keys identify skin categories or IDs and values hold configuration strings or prefab names, enabling the skinning system to apply visual and audio properties without runtime component logic.
## Usage example
```lua
local Prefabskin = require "prefabskin"

-- Initialize a spear skin on an entity
local inst = SpawnPrefab("spear")
Prefabskin.spear_init_fn(inst, "swap_spear_golden")

-- Clear the skin and restore default
Prefabskin.spear_clear_fn(inst)

-- Initialize a firepit with custom FX offset
local firepit = SpawnPrefab("firepit")
Prefabskin.firepit_init_fn(firepit, "firepit_marble", Vector3(0, 1, 0))

-- Create a custom prefab skin with metadata
local skin = Prefabskin.CreatePrefabSkin("my_custom_skin", {
    type = "inventory",
    assets = { Asset("ANIM", "anim/my_skin.zip") },
    skin_tags = { "rare" }
})
```

## Dependencies & tags
**External dependencies:**
- `class` -- Required for Class system
- `prefabs` -- Required for prefab definitions
- `TheWorld` -- ismastersim checked for server-side logic

**Components used:**
- `blinkstaff` -- SetSoundFX and ResetSoundFX called for staff skin sounds
- `inventoryitem` -- ChangeImageName called to update item image for skins
- `floater` -- IsFloating, SwitchToDefaultAnim, SwitchToFloatAnim called for floating items
- `container` -- IsOpen checked to append _open to skin name
- `placer` -- linked table accessed for placer skin synchronization
- `mightygym` -- SetLevelArt and CalcWeight called for gym skin updates
- `symbolswapdata` -- SetData called in cavein_boulder_init_fn to configure symbol swapping
- `bundlemaker` -- SetSkinData called in bundlewrap_init_fn and bundlewrap_clear_fn
- `burnable` -- SetFXOffset called in firepit_init_fn and coldfirepit_init_fn; fxoffset and fxchildren properties accessed
- `saddler` -- SetSwaps called in saddle_basic_init_fn and saddle_basic_clear_fn
- `inspectable` -- SetNameOverride called to change displayed name for record skins
- `locomotor` -- GetRunSpeed called in cane_do_trail for trail offset calculation
- `rider` -- IsRiding called in cane_do_trail to adjust trail offset for mounted entities
- `machine` -- ison property checked in lantern_init_fn to determine initial FX state
- `equippable` -- SetOnEquip called for molehat to set equip callback

**Tags:**
- `nobundling` -- check
- `regaljoker` -- add
- `open_top_hat` -- add
- `burnt` -- check
- `hermithouse_winter_ornament` -- add
## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| None | | | No properties are defined. |

## Main functions
### `basic_init_fn(inst, build_name, def_build, filter_fn)`
* **Description:** Core initialization function that sets the skin build on AnimState, updates inventory item image name (appending _open if container is open), and handles floater animation switching.
* **Parameters:**
  - `inst` -- Entity instance to apply skin to
  - `build_name` -- Name of the skin build to apply
  - `def_build` -- Default build name to use as fallback
  - `filter_fn` -- Optional function to filter/modify skin name
* **Returns:** nil
* **Error states:** None

### `basic_clear_fn(inst, def_build)`
* **Description:** Core clear function that resets the build to default, clears inventory item image name, and handles floater animation switching.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
  - `def_build` -- Default build name to restore
* **Returns:** nil
* **Error states:** None

### `backpack_init_fn(inst, build_name, fns)`
* **Description:** Initializes backpack skin by calling basic_init_fn with swap_backpack, then runs custom initialize function if provided and triggers OnBackpackSkinChanged callback.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
  - `fns` -- Table of initialize/uninitialize functions
* **Returns:** nil
* **Error states:** None

### `backpack_clear_fn(inst)`
* **Description:** Clears backpack skin by calling basic_clear_fn, runs uninitialize function if exists, clears backpack_skin_fns, and triggers OnBackpackSkinChanged with nil.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `spicepack_init_fn(inst, build_name)`
* **Description:** Initializes spice pack skin using basic_init_fn with swap_chefpack build.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** nil
* **Error states:** None

### `spicepack_clear_fn(inst)`
* **Description:** Clears spice pack skin using basic_clear_fn with swap_chefpack build.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `krampus_sack_init_fn(inst, build_name)`
* **Description:** Initializes Krampus sack skin using basic_init_fn with swap_krampus_sack build.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** nil
* **Error states:** None

### `krampus_sack_clear_fn(inst)`
* **Description:** Clears Krampus sack skin using basic_clear_fn with swap_krampus_sack build.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `piggyback_init_fn(inst, build_name)`
* **Description:** Initializes piggyback skin using basic_init_fn with swap_piggyback build.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** nil
* **Error states:** None

### `piggyback_clear_fn(inst)`
* **Description:** Clears piggyback skin using basic_clear_fn with swap_piggyback build.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `icepack_init_fn(inst, build_name)`
* **Description:** Initializes ice pack skin using basic_init_fn with swap_icepack build.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** nil
* **Error states:** None

### `icepack_clear_fn(inst)`
* **Description:** Clears ice pack skin using basic_clear_fn with swap_icepack build.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `ruins_bat_init_fn(inst, build_name)`
* **Description:** Initializes ruins bat skin using basic_init_fn with swap_ruins_bat build.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** nil
* **Error states:** None

### `ruins_bat_clear_fn(inst)`
* **Description:** Clears ruins bat skin using basic_clear_fn with swap_ruins_bat build.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `hambat_init_fn(inst, build_name)`
* **Description:** Initializes ham bat skin using basic_init_fn with ham_bat build.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** nil
* **Error states:** None

### `hambat_clear_fn(inst)`
* **Description:** Clears ham bat skin using basic_clear_fn with ham_bat build.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `batbat_init_fn(inst, build_name)`
* **Description:** Initializes bat bat skin using basic_init_fn with batbat build.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** nil
* **Error states:** None

### `batbat_clear_fn(inst)`
* **Description:** Clears bat bat skin using basic_clear_fn with batbat build.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `boomerang_init_fn(inst, build_name)`
* **Description:** Initializes boomerang skin using basic_init_fn with boomerang build.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** nil
* **Error states:** None

### `boomerang_clear_fn(inst)`
* **Description:** Clears boomerang skin using basic_clear_fn with boomerang build.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `mighty_gym_init_fn(inst, build_name)`
* **Description:** Initializes mighty gym skin and updates level art based on current weight and strongman character.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** nil
* **Error states:** None

### `mighty_gym_clear_fn(inst)`
* **Description:** Clears mighty gym skin and updates level art based on current weight and strongman character.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `armor_bramble_init_fn(inst, build_name)`
* **Description:** Initializes bramble armor skin using basic_init_fn with armor_bramble build.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** nil
* **Error states:** None

### `armor_bramble_clear_fn(inst)`
* **Description:** Clears bramble armor skin using basic_clear_fn with armor_bramble build.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `wood_table_round_init_fn(inst, build_name, facings)`
* **Description:** Initializes round wood table skin and sets transform facings.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
  - `facings` -- Number of facings for transform
* **Returns:** nil
* **Error states:** None

### `wood_table_round_clear_fn(inst)`
* **Description:** Clears round wood table skin and resets transform to no-facing.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `wood_table_square_init_fn(inst, build_name)`
* **Description:** Initializes square wood table skin using basic_init_fn with wood_table_square build.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** nil
* **Error states:** None

### `wood_table_square_clear_fn(inst)`
* **Description:** Clears square wood table skin using basic_clear_fn with wood_table_square build.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `wood_stool_init_fn(inst, build_name, facings)`
* **Description:** Initializes wood stool skin and sets transform facings.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
  - `facings` -- Number of facings for transform
* **Returns:** nil
* **Error states:** None

### `wood_stool_clear_fn(inst)`
* **Description:** Clears wood stool skin and resets transform to no-facing.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `wood_chair_init_fn(inst, build_name)`
* **Description:** Initializes wood chair skin and overrides chair01_parts symbol on back component if not on client.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** nil
* **Error states:** None

### `wood_chair_clear_fn(inst)`
* **Description:** Clears wood chair skin and clears chair01_parts symbol override on back component if not on client.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `stone_table_round_init_fn(inst, build_name, facings)`
* **Description:** Initializes round stone table skin and sets transform facings.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
  - `facings` -- Number of facings for transform
* **Returns:** nil
* **Error states:** None

### `stone_table_round_clear_fn(inst)`
* **Description:** Clears round stone table skin and resets transform to no-facing.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `stone_table_square_init_fn(inst, build_name)`
* **Description:** Initializes square stone table skin using basic_init_fn with stone_table_square build.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** nil
* **Error states:** None

### `stone_table_square_clear_fn(inst)`
* **Description:** Clears square stone table skin using basic_clear_fn with stone_table_square build.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `stone_stool_init_fn(inst, build_name, facings)`
* **Description:** Initializes stone stool skin and sets transform facings.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
  - `facings` -- Number of facings for transform
* **Returns:** nil
* **Error states:** None

### `stone_stool_clear_fn(inst)`
* **Description:** Clears stone stool skin and resets transform to four-faced.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `stone_chair_init_fn(inst, build_name)`
* **Description:** Initializes stone chair skin and overrides chair01_parts symbol on back component if not on client.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** nil
* **Error states:** None

### `stone_chair_clear_fn(inst)`
* **Description:** Clears stone chair skin and clears chair01_parts symbol override on back component if not on client.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `decor_centerpiece_init_fn(inst, build_name)`
* **Description:** Initializes decor centerpiece skin using basic_init_fn with decor_centerpiece build.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** nil
* **Error states:** None

### `decor_centerpiece_clear_fn(inst)`
* **Description:** Clears decor centerpiece skin using basic_clear_fn with decor_centerpiece build.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `decor_flowervase_init_fn(inst, build_name)`
* **Description:** Initializes decor flower vase skin and refreshes image if not on client.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** nil
* **Error states:** None

### `decor_flowervase_clear_fn(inst)`
* **Description:** Clears decor flower vase skin and refreshes image if not on client.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `decor_lamp_init_fn(inst, build_name)`
* **Description:** Initializes decor lamp skin using basic_init_fn with decor_lamp build.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** nil
* **Error states:** None

### `decor_lamp_clear_fn(inst)`
* **Description:** Clears decor lamp skin using basic_clear_fn with decor_lamp build.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `phonograph_init_fn(inst, build_name)`
* **Description:** Initializes phonograph skin using basic_init_fn with phonograph build.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** nil
* **Error states:** None

### `phonograph_clear_fn(inst)`
* **Description:** Clears phonograph skin using basic_clear_fn with phonograph build.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `decor_pictureframe_init_fn(inst, build_name)`
* **Description:** Initializes decor picture frame skin and refreshes image if not on client.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** nil
* **Error states:** None

### `decor_pictureframe_clear_fn(inst)`
* **Description:** Clears decor picture frame skin and refreshes image if not on client.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `decor_portraitframe_init_fn(inst, build_name)`
* **Description:** Initializes decor portrait frame skin using basic_init_fn with decor_portraitframe build.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** nil
* **Error states:** None

### `decor_portraitframe_clear_fn(inst)`
* **Description:** Clears decor portrait frame skin using basic_clear_fn with decor_portraitframe build.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `magician_chest_init_fn(inst, build_name)`
* **Description:** Initializes magician chest skin using basic_init_fn with magician_chest build.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** nil
* **Error states:** None

### `magician_chest_clear_fn(inst)`
* **Description:** Clears magician chest skin using basic_clear_fn with magician_chest build.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `critter_lunarmothling_clear_fn(inst)`
* **Description:** Clears lunarmothling critter skin by setting build to lunarmoth_build.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `critter_lunarmothling_builder_clear_fn(inst)`
* **Description:** Clears lunarmothling builder by setting linked_skinname to nil.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `staff_tornado_init_fn(inst, build_name)`
* **Description:** Initializes tornado staff skin and sets linked_skinname by removing stick_ prefix from build_name.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** nil
* **Error states:** None

### `staff_tornado_clear_fn(inst)`
* **Description:** Clears tornado staff skin and sets linked_skinname to nil.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `tornado_init_fn(inst, build_name)`
* **Description:** Initializes tornado skin using basic_init_fn with tornado build.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** nil
* **Error states:** None

### `tornado_clear_fn(inst)`
* **Description:** Clears tornado skin using basic_clear_fn with tornado build.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `succulent_potted_init_fn(inst, build_name)`
* **Description:** Initializes potted succulent skin and clears succulent symbol override.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** nil
* **Error states:** None

### `succulent_potted_clear_fn(inst)`
* **Description:** Clears potted succulent skin and calls SetupPlant.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `raincoat_init_fn(inst, build_name)`
* **Description:** Initializes raincoat skin using basic_init_fn with torso_rain build.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** nil
* **Error states:** None

### `raincoat_clear_fn(inst)`
* **Description:** Clears raincoat skin using basic_clear_fn with torso_rain build.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `beef_bell_init_fn(inst, build_name)`
* **Description:** Initializes beef bell skin and fixes inventory icon.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** nil
* **Error states:** None

### `beef_bell_clear_fn(inst)`
* **Description:** Clears beef bell skin and fixes inventory icon with nil.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `deserthat_init_fn(inst, build_name)`
* **Description:** Initializes desert hat skin using basic_init_fn with hat_desert build.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** nil
* **Error states:** None

### `deserthat_clear_fn(inst)`
* **Description:** Clears desert hat skin using basic_clear_fn with hat_desert build.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `goggleshat_init_fn(inst, build_name)`
* **Description:** Initializes goggles hat skin using basic_init_fn with hat_goggles build.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** nil
* **Error states:** None

### `goggleshat_clear_fn(inst)`
* **Description:** Clears goggles hat skin using basic_clear_fn with hat_goggles build.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `eyeturret_init_fn(inst, build_name)`
* **Description:** Initializes eyeball turret skin, clears horn symbol if placer, overrides multiple symbols, and calls FixupSkins on base.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** nil
* **Error states:** None

### `eyeturret_clear_fn(inst)`
* **Description:** Clears eyeball turret skin, clears symbol overrides, and calls FixupSkins on base.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `eyeturret_item_init_fn(inst, build_name)`
* **Description:** Initializes eyeball turret item skin and sets linked_skinname.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** nil
* **Error states:** None

### `eyeturret_item_clear_fn(inst)`
* **Description:** Clears eyeball turret item skin and sets linked_skinname to nil.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `moondial_init_fn(inst, build_name)`
* **Description:** Initializes moondial skin by overriding basin symbol with item skin symbol.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** nil
* **Error states:** None

### `moondial_clear_fn(inst)`
* **Description:** Clears moondial skin by clearing basin symbol override.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `sewing_mannequin_init_fn(inst, build_name)`
* **Description:** Initializes sewing mannequin skin using basic_init_fn with sewing_mannequin build.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** nil
* **Error states:** None

### `sewing_mannequin_clear_fn(inst)`
* **Description:** Clears sewing mannequin skin using basic_clear_fn with sewing_mannequin build.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `winona_battery_high_init_fn(inst, build_name)`
* **Description:** Initializes Winona high battery skin, handling item and placer variants with symbol overrides for linked entities.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** nil
* **Error states:** None

### `winona_battery_high_clear_fn(inst)`
* **Description:** Clears Winona high battery skin, handling item variant or clearing symbol overrides.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `winona_battery_high_item_init_fn(inst, build_name)`
* **Description:** Initializes Winona high battery item skin using basic_init_fn with filter function.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** nil
* **Error states:** None

### `winona_battery_high_item_clear_fn(inst)`
* **Description:** Clears Winona high battery item skin using basic_clear_fn.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `winona_battery_low_init_fn(inst, build_name)`
* **Description:** Initializes Winona low battery skin, handling item and placer variants with symbol overrides for linked entities.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** nil
* **Error states:** None

### `winona_battery_low_clear_fn(inst)`
* **Description:** Clears Winona low battery skin, handling item variant or clearing symbol overrides.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `winona_battery_low_item_init_fn(inst, build_name)`
* **Description:** Initializes Winona low battery item skin using basic_init_fn with filter function.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** nil
* **Error states:** None

### `winona_battery_low_item_clear_fn(inst)`
* **Description:** Clears Winona low battery item skin using basic_clear_fn.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `winona_catapult_init_fn(inst, build_name)`
* **Description:** Initializes Winona catapult skin, handling item and placer variants with symbol overrides and wire dummy on master sim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** nil
* **Error states:** None

### `winona_catapult_clear_fn(inst)`
* **Description:** Clears Winona catapult skin, handling item variant or clearing symbol overrides.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `winona_catapult_item_init_fn(inst, build_name)`
* **Description:** Initializes Winona catapult item skin using basic_init_fn with filter function.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** nil
* **Error states:** None

### `winona_catapult_item_clear_fn(inst)`
* **Description:** Clears Winona catapult item skin using basic_clear_fn.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `winona_spotlight_init_fn(inst, build_name)`
* **Description:** Initializes Winona spotlight skin, handling item and placer variants with symbol overrides, wire dummy on master sim, and head instance overrides.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** nil
* **Error states:** None

### `winona_spotlight_clear_fn(inst)`
* **Description:** Clears Winona spotlight skin, handling item variant or clearing symbol overrides including head instance.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `winona_spotlight_item_init_fn(inst, build_name)`
* **Description:** Initializes Winona spotlight item skin using basic_init_fn with filter function.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** nil
* **Error states:** None

### `winona_spotlight_item_clear_fn(inst)`
* **Description:** Clears Winona spotlight item skin using basic_clear_fn.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `boat_grass_item_init_fn(inst, build_name)`
* **Description:** Initializes boat grass item skin by setting linked_skinname, applying skin to AnimState, and updating inventory item image.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `boat_grass_item_clear_fn(inst)`
* **Description:** Clears boat grass item skin by resetting linked_skinname, restoring default build, and resetting inventory item image.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `boat_grass_init_fn(inst, build_name)`
* **Description:** Initializes boat grass skin with placer component check for client/server simulation.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `boat_grass_clear_fn(inst)`
* **Description:** Clears boat grass skin by restoring default build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `walkingplank_grass_init_fn(inst, build_name)`
* **Description:** Initializes walking plank grass skin with placer component check for client/server simulation.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `walkingplank_grass_clear_fn(inst, build_name)`
* **Description:** Clears walking plank grass skin by restoring default build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
  - `build_name` -- String name parameter (unused in body)
* **Returns:** None
* **Error states:** None

### `winch_init_fn(inst, build_name)`
* **Description:** Initializes winch skin with placer and mastersim checks for client/server simulation.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `winch_clear_fn(inst)`
* **Description:** Clears winch skin by restoring default build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `ocean_trawler_init_fn(inst, build_name)`
* **Description:** Initializes ocean trawler skin with water shadow symbol override and placer/mastersim checks.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `ocean_trawler_clear_fn(inst)`
* **Description:** Clears ocean trawler skin by clearing water shadow override and restoring default build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `ocean_trawler_kit_init_fn(inst, build_name)`
* **Description:** Initializes ocean trawler kit skin by setting linked_skinname, applying skin, and updating inventory item image.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `ocean_trawler_kit_clear_fn(inst)`
* **Description:** Clears ocean trawler kit skin by resetting linked_skinname, restoring default build, and resetting inventory item image.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `hammer_init_fn(inst, build_name)`
* **Description:** Initializes hammer skin with invisible build check for floater bank swap, calls basic_init_fn, and adds skin sounds.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `hammer_clear_fn(inst)`
* **Description:** Clears hammer skin by resetting floater bank swap, calling basic_clear_fn, and removing skin sounds.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `torch_init_fn(inst, build_name)`
* **Description:** Initializes torch skin by calling basic_init_fn with swap_torch build.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `torch_clear_fn(inst)`
* **Description:** Clears torch skin by calling basic_clear_fn with swap_torch build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `lighter_init_fn(inst, build_name)`
* **Description:** Initializes lighter skin by calling basic_init_fn with lighter build.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `lighter_clear_fn(inst)`
* **Description:** Clears lighter skin by calling basic_clear_fn with lighter build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `spear_init_fn(inst, build_name)`
* **Description:** Initializes spear skin by calling basic_init_fn with swap_spear build.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `spear_clear_fn(inst)`
* **Description:** Clears spear skin by calling basic_clear_fn with swap_spear build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `spear_wathgrithr_init_fn(inst, build_name)`
* **Description:** Initializes Wathgrithr spear skin by calling basic_init_fn with swap_spear_wathgrithr build.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `spear_wathgrithr_clear_fn(inst)`
* **Description:** Clears Wathgrithr spear skin by calling basic_clear_fn with swap_spear_wathgrithr build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `spear_wathgrithr_lightning_init_fn(inst, build_name)`
* **Description:** Initializes Wathgrithr lightning spear skin by calling basic_init_fn with spear_wathgrithr_lightning build.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `spear_wathgrithr_lightning_clear_fn(inst)`
* **Description:** Clears Wathgrithr lightning spear skin by calling basic_clear_fn with spear_wathgrithr_lightning build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `spear_wathgrithr_lightning_charged_init_fn(inst, build_name)`
* **Description:** Initializes charged Wathgrithr lightning spear skin with RemoveChargedFrom transform and sets FX owner on master sim.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `spear_wathgrithr_lightning_charged_clear_fn(inst)`
* **Description:** Clears charged Wathgrithr lightning spear skin and resets FX owner on master sim.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `berrybush_init_fn(inst, build_name)`
* **Description:** Initializes berrybush skin with linked_skinname, placer check, and spawns VFX FX instance if available.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `berrybush_clear_fn(inst)`
* **Description:** Clears berrybush skin by removing VFX FX instance and resetting linked_skinname.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `dug_berrybush_init_fn(inst, build_name)`
* **Description:** Initializes dug berrybush skin with linked_skinname set to build_name.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `dug_berrybush_clear_fn(inst)`
* **Description:** Clears dug berrybush skin and resets linked_skinname.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `dug_berrybush_waxed_clear_fn(inst)`
* **Description:** Clears dug waxed berrybush skin and updates inventory item image to parent prefab if inventoryitem component exists.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `reskin_tool_init_fn(inst, build_name)`
* **Description:** Initializes reskin tool skin by calling basic_init_fn with reskin_tool build.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `reskin_tool_clear_fn(inst)`
* **Description:** Clears reskin tool skin by calling basic_clear_fn with reskin_tool build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `whip_init_fn(inst, build_name)`
* **Description:** Initializes whip skin with mastersim check and adds skin sounds.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `whip_clear_fn(inst)`
* **Description:** Clears whip skin and removes skin sounds.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `trident_init_fn(inst, build_name)`
* **Description:** Initializes trident skin with mastersim check and adds skin sounds.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `trident_clear_fn(inst)`
* **Description:** Clears trident skin and removes skin sounds.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `multitool_axe_pickaxe_init_fn(inst, build_name)`
* **Description:** Initializes multitool axe pickaxe skin by calling basic_init_fn.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `multitool_axe_pickaxe_clear_fn(inst)`
* **Description:** Clears multitool axe pickaxe skin by calling basic_clear_fn.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `axe_init_fn(inst, build_name)`
* **Description:** Initializes axe skin with invisible build check for floater bank swap.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** Errors if `inst` lacks `floater` component when `build_name` contains "_invisible" (nil dereference on `inst.components.floater` — no guard present).

### `axe_clear_fn(inst)`
* **Description:** Clears axe skin by resetting floater bank swap and calling basic_clear_fn.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** Errors if `inst` has no `floater` component (nil dereference on `inst.components.floater` — no guard present in source).
### `farm_hoe_init_fn(inst, build_name)`
* **Description:** Initializes farm hoe skin with invisible build check for floater bank swap.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** Errors if `inst` has no `floater` component (nil dereference on `inst.components.floater` when `build_name` contains '_invisible' — no guard present in source).

### `farm_hoe_clear_fn(inst)`
* **Description:** Clears farm hoe skin by resetting floater bank swap and calling basic_clear_fn.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** Errors if `inst` has no `floater` component (nil dereference on `inst.components.floater` — no guard present in source).
### `golden_farm_hoe_init_fn(inst, build_name)`
* **Description:** Initializes golden farm hoe skin with invisible build check for floater bank swap.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** Errors if `inst` has no `floater` component (nil dereference on `inst.components.floater.do_bank_swap` when build_name contains "_invisible" — no guard present in source).
### `golden_farm_hoe_clear_fn(inst)`
* **Description:** Clears golden farm hoe skin by resetting floater bank swap and calling basic_clear_fn.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** Errors if `inst` has no `floater` component (nil dereference on `inst.components.floater` — no guard present in source).
### `razor_init_fn(inst, build_name)`
* **Description:** Initializes razor skin by calling basic_init_fn with swap_razor build.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `razor_clear_fn(inst)`
* **Description:** Clears razor skin by calling basic_clear_fn with swap_razor build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `goldenaxe_init_fn(inst, build_name)`
* **Description:** Initializes golden axe skin with invisible build check for floater bank swap.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** Errors if `inst` lacks `floater` component when `build_name` contains "_invisible" (nil dereference on `inst.components.floater` — no guard present in source).
### `goldenaxe_clear_fn(inst)`
* **Description:** Clears golden axe skin by resetting floater bank swap and calling basic_clear_fn.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** Errors if `inst` has no `floater` component (nil dereference on `inst.components.floater` — no guard present in source).
### `pickaxe_init_fn(inst, build_name)`
* **Description:** Initializes pickaxe skin with invisible build check for floater bank swap.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** Errors if `inst` lacks `floater` component when `build_name` contains "_invisible" (nil dereference on `inst.components.floater` — no guard present)

### `pickaxe_clear_fn(inst)`
* **Description:** Clears pickaxe skin by resetting floater bank swap and calling basic_clear_fn.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** Errors if `inst` has no `floater` component (nil dereference on `inst.components.floater` — no guard present in source).
### `pitchfork_init_fn(inst, build_name)`
* **Description:** Initializes pitchfork skin with invisible build check for floater bank swap.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** Errors if `inst` lacks `floater` component when `build_name` contains "_invisible" (nil dereference on `inst.components.floater` — no guard present)

### `pitchfork_clear_fn(inst)`
* **Description:** Clears pitchfork skin by resetting floater bank swap and calling basic_clear_fn.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** Errors if `inst` has no `floater` component (nil dereference on `inst.components.floater` — no guard present in source).
### `goldenpitchfork_init_fn(inst, build_name)`
* **Description:** Initializes golden pitchfork skin with invisible build check for floater bank swap.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** Errors if `inst` lacks `floater` component when `build_name` contains "_invisible" (nil dereference on `inst.components.floater`).
### `goldenpitchfork_clear_fn(inst)`
* **Description:** Clears golden pitchfork skin by resetting floater bank swap and calling basic_clear_fn.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** Errors if `inst` has no `floater` component (nil dereference on `inst.components.floater` — no guard present in source).

### `goldenpickaxe_init_fn(inst, build_name)`
* **Description:** Initializes golden pickaxe skin with invisible build check for floater bank swap.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** Errors if `inst` has no `floater` component and `build_name` contains "_invisible" (nil dereference on `inst.components.floater` — no guard present in source).

### `goldenpickaxe_clear_fn(inst)`
* **Description:** Clears golden pickaxe skin by resetting floater bank swap and calling basic_clear_fn.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** Errors if `inst` has no `floater` component (nil dereference on `inst.components.floater` — no guard present in source).

### `shovel_init_fn(inst, build_name)`
* **Description:** Initializes shovel skin with invisible build check for floater bank swap.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** Errors if `inst` lacks `floater` component when `build_name` contains '_invisible' (nil dereference).
### `shovel_clear_fn(inst)`
* **Description:** Clears shovel skin by resetting floater bank swap and calling basic_clear_fn.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** Errors if `inst` has no `floater` component (nil dereference on `inst.components.floater` — no guard present in source).
### `goldenshovel_init_fn(inst, build_name)`
* **Description:** Initializes golden shovel skin with invisible build check for floater bank swap.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** Errors if `inst` has no `floater` component and `build_name` contains "_invisible" (nil dereference on `inst.components.floater` — no guard present in source).
### `goldenshovel_clear_fn(inst)`
* **Description:** Clears golden shovel skin by resetting floater bank swap and calling basic_clear_fn.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** Errors if `inst` has no `floater` component (nil dereference on `inst.components.floater` — no guard present in source).

### `umbrella_init_fn(inst, build_name)`
* **Description:** Initializes umbrella skin by calling basic_init_fn with umbrella build.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `umbrella_clear_fn(inst)`
* **Description:** Clears umbrella skin by calling basic_clear_fn with umbrella build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `oceanfishingrod_init_fn(inst, build_name)`
* **Description:** Initializes ocean fishing rod skin by calling basic_init_fn with fishingrod_ocean build.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `oceanfishingrod_clear_fn(inst)`
* **Description:** Clears ocean fishing rod skin by calling basic_clear_fn with fishingrod_ocean build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `fishingrod_init_fn(inst, build_name)`
* **Description:** Initializes fishing rod skin by calling basic_init_fn with fishingrod build.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `fishingrod_clear_fn(inst)`
* **Description:** Clears fishing rod skin by calling basic_clear_fn with fishingrod build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `beargerfur_sack_init_fn(inst, build_name)`
* **Description:** Initializes Bearger fur sack skin with mastersim check and adds skin sounds.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `beargerfur_sack_clear_fn(inst)`
* **Description:** Clears Bearger fur sack skin and removes skin sounds.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `flotationcushion_init_fn(inst, build_name)`
* **Description:** Initializes flotation cushion skin by calling basic_init_fn.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `flotationcushion_clear_fn(inst, build_name)`
* **Description:** Clears flotation cushion skin by calling basic_clear_fn.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
  - `build_name` -- String name parameter (unused in body)
* **Returns:** None
* **Error states:** None

### `bookstation_init_fn(inst, build_name)`
* **Description:** Initializes book station skin by calling basic_init_fn.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `bookstation_clear_fn(inst, build_name)`
* **Description:** Clears book station skin by calling basic_clear_fn.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
  - `build_name` -- String name parameter (unused in body)
* **Returns:** None
* **Error states:** None

### `sisturn_init_fn(inst, build_name)`
* **Description:** Initializes Sisturn skin with mastersim check, adds skin sounds, and calls UpdateFlowerDecor if available.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `sisturn_clear_fn(inst)`
* **Description:** Clears Sisturn skin, removes skin sounds, and calls UpdateFlowerDecor if available.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `lucy_init_fn(inst, build_name)`
* **Description:** Initializes Lucy axe skin with mastersim check and adds skin sounds.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `lucy_clear_fn(inst)`
* **Description:** Clears Lucy axe skin and removes skin sounds.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `townportal_init_fn(inst, build_name)`
* **Description:** Initializes town portal skin with mastersim check and adds skin sounds.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `townportal_clear_fn(inst)`
* **Description:** Clears town portal skin and removes skin sounds.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `nightlight_init_fn(inst, build_name)`
* **Description:** Initializes nightlight skin with mastersim check and adds skin sounds.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `nightlight_clear_fn(inst)`
* **Description:** Clears nightlight skin and removes skin sounds.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `wx78_scanner_init_fn(inst, build_name)`
* **Description:** Initializes WX78 scanner skin with linked_skinname, inventory item image update, mastersim check, and adds skin sounds.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** Errors if `inst` is nil or `inst.components` is missing (nil dereference on `inst.linked_skinname` assignment or `inst.components` table access — no guard for base entity validity before component checks).

### `wx78_scanner_clear_fn(inst)`
* **Description:** Clears WX78 scanner skin by resetting linked_skinname and removing skin sounds.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `wx78_drone_scout_init_fn(inst, build_name)`
* **Description:** Initializes WX78 drone scout skin with mastersim check and calls OnDroneScoutSkinChanged.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `wx78_drone_scout_clear_fn(inst)`
* **Description:** Clears WX78 drone scout skin and calls OnDroneScoutSkinChanged with nil.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `wx78_drone_delivery_init_fn(inst, build_name)`
* **Description:** Initializes WX78 drone delivery skin with linked_skinname transform and placer/mastersim checks.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `wx78_drone_delivery_clear_fn(inst)`
* **Description:** Clears WX78 drone delivery skin by resetting linked_skinname and restoring default build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `wx78_drone_delivery_item_init_fn(inst, build_name)`
* **Description:** Initializes WX78 drone delivery item skin with linked_skinname, mastersim check, and inventory item image update.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** Errors if `inst` has no `inventoryitem` component (nil dereference on `inst.components.inventoryitem` — no guard present in source).
### `wx78_drone_delivery_item_clear_fn(inst)`
* **Description:** Clears WX78 drone delivery item skin by resetting linked_skinname and inventory item image.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** Errors if `inst` has no `inventoryitem` component (nil dereference on `inst.components.inventoryitem` — no guard present in source).### `wx78_drone_delivery_small_init_fn(inst, build_name)`
* **Description:** Initializes WX78 drone delivery small skin with linked_skinname transform and placer/mastersim checks.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `wx78_drone_delivery_small_clear_fn(inst)`
* **Description:** Clears WX78 drone delivery small skin by resetting linked_skinname and restoring default build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `wx78_drone_delivery_small_item_init_fn(inst, build_name)`
* **Description:** Initializes WX78 drone delivery small item skin with linked_skinname, mastersim check, and inventory item image update.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** Errors if `inst` has no `inventoryitem` component (nil dereference on `inst.components.inventoryitem` — no guard present in source).
### `wx78_drone_delivery_small_item_clear_fn(inst)`
* **Description:** Clears WX78 drone delivery small item skin by resetting linked_skinname and inventory item image.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** Errors if `inst` has no `inventoryitem` component (nil dereference on `inst.components.inventoryitem` — no guard present in source).### `wx78_drone_zap_init_fn(inst, build_name)`
* **Description:** Initializes WX78 drone zap skin with linked_skinname, mastersim check, and calls OnDroneZapSkinChanged if available.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `wx78_drone_zap_clear_fn(inst)`
* **Description:** Clears WX78 drone zap skin by resetting linked_skinname and calling OnDroneZapSkinChanged with nil.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `wx78_moduleremover_init_fn(inst, build_name)`
* **Description:** Initializes WX78 module remover skin by calling basic_init_fn.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `wx78_moduleremover_clear_fn(inst)`
* **Description:** Clears WX78 module remover skin by calling basic_clear_fn.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `portableblender_init_fn(inst, build_name)`
* **Description:** Initializes portable blender skin with linked_skinname and inventory item image update.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `portableblender_clear_fn(inst)`
* **Description:** Clears portable blender skin by resetting linked_skinname.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `portablecookpot_init_fn(inst, build_name)`
* **Description:** Initializes portable cookpot skin with linked_skinname and inventory item image update.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `portablecookpot_clear_fn(inst)`
* **Description:** Clears portable cookpot skin by resetting linked_skinname.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `portablespicer_init_fn(inst, build_name)`
* **Description:** Initializes portable spicer skin with linked_skinname and inventory item image update.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `portablespicer_clear_fn(inst)`
* **Description:** Clears portable spicer skin by resetting linked_skinname.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `slingshot_init_fn(inst, build_name)`
* **Description:** Initializes slingshot skin with mastersim check and calls OnSlingshotSkinChanged.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `slingshot_clear_fn(inst)`
* **Description:** Clears slingshot skin and calls OnSlingshotSkinChanged with nil.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `wobysmall_init_fn(inst, build_name)`
* **Description:** Initializes small Woby skin with mastersim check and calls OnWobySkinChanged.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `wobysmall_clear_fn(inst)`
* **Description:** Clears small Woby skin and calls OnWobySkinChanged with nil.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `wobybig_init_fn(inst, build_name)`
* **Description:** Initializes big Woby skin with mastersim check and calls OnWobySkinChanged.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `wobybig_clear_fn(inst)`
* **Description:** Clears big Woby skin and calls OnWobySkinChanged with nil.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `trunkvest_summer_init_fn(inst, build_name)`
* **Description:** Initializes summer trunk vest skin by calling basic_init_fn with armor_trunkvest_summer build.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `trunkvest_summer_clear_fn(inst)`
* **Description:** Clears summer trunk vest skin by calling basic_clear_fn with armor_trunkvest_summer build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `trunkvest_winter_init_fn(inst, build_name)`
* **Description:** Initializes winter trunk vest skin by calling basic_init_fn with armor_trunkvest_winter build.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `trunkvest_winter_clear_fn(inst)`
* **Description:** Clears winter trunk vest skin by calling basic_clear_fn with armor_trunkvest_winter build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `book_brimstone_init_fn(inst, build_name)`
* **Description:** Initializes brimstone book skin by calling basic_init_fn with books build.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `book_brimstone_clear_fn(inst)`
* **Description:** Clears brimstone book skin by calling basic_clear_fn with books build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `book_temperature_init_fn(inst, build_name)`
* **Description:** Initializes temperature book skin by calling basic_init_fn with books build.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `book_temperature_clear_fn(inst)`
* **Description:** Clears temperature book skin by calling basic_clear_fn with books build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `book_research_station_init_fn(inst, build_name)`
* **Description:** Initializes research station book skin by calling basic_init_fn with books build.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `book_research_station_clear_fn(inst)`
* **Description:** Clears research station book skin by calling basic_clear_fn with books build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `book_silviculture_init_fn(inst, build_name)`
* **Description:** Initializes silviculture book skin by calling basic_init_fn with books build.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `book_silviculture_clear_fn(inst)`
* **Description:** Clears silviculture book skin by calling basic_clear_fn with books build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `book_sleep_init_fn(inst, build_name)`
* **Description:** Initializes sleep book skin by calling basic_init_fn with books build.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `book_sleep_clear_fn(inst)`
* **Description:** Clears sleep book skin by calling basic_clear_fn with books build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `book_web_init_fn(inst, build_name)`
* **Description:** Initializes web book skin by calling basic_init_fn with books build.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `book_web_clear_fn(inst)`
* **Description:** Clears web book skin by calling basic_clear_fn with books build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `ruinsrelic_chair_init_fn(inst, build_name)`
* **Description:** Initializes ruins relic chair skin by calling basic_init_fn with ruins_chair build.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `ruinsrelic_chair_clear_fn(inst)`
* **Description:** Clears ruins relic chair skin by calling basic_clear_fn with ruins_chair build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `bedroll_furry_init_fn(inst, build_name)`
* **Description:** Initializes furry bedroll skin by calling basic_init_fn with swap_bedroll_furry build.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `bedroll_furry_clear_fn(inst)`
* **Description:** Clears furry bedroll skin by calling basic_clear_fn with swap_bedroll_furry build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `featherfan_init_fn(inst, build_name)`
* **Description:** Initializes feather fan skin by calling basic_init_fn with fan build.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `featherfan_clear_fn(inst)`
* **Description:** Clears feather fan skin by calling basic_clear_fn with fan build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `armordragonfly_init_fn(inst, build_name)`
* **Description:** Initializes Dragonfly armor skin by calling basic_init_fn with torso_dragonfly build.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- String name of the skin build to apply
* **Returns:** None
* **Error states:** None

### `armordragonfly_clear_fn(inst)`
* **Description:** Clears Dragonfly armor skin by calling basic_clear_fn with torso_dragonfly build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `armorgrass_init_fn(inst, build_name)`
* **Description:** Initializes grass armor skin by calling basic_init_fn with armor_grass build name.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- Name of the skin build to apply
* **Returns:** nil
* **Error states:** None

### `armorgrass_clear_fn(inst)`
* **Description:** Clears grass armor skin by calling basic_clear_fn with armor_grass build name.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `hivehat_init_fn(inst, build_name)`
* **Description:** Initializes hive hat skin and adds regaljoker tag if build_name equals hivehat_joker.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- Name of the skin build to apply
* **Returns:** nil
* **Error states:** None

### `hivehat_clear_fn(inst)`
* **Description:** Clears hive hat skin and removes regaljoker tag.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `walrushat_init_fn(inst, build_name)`
* **Description:** Initializes walrus hat skin and adds skin sounds on master sim only.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- Name of the skin build to apply
* **Returns:** nil
* **Error states:** None

### `walrushat_clear_fn(inst)`
* **Description:** Clears walrus hat skin and removes skin sounds.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `footballhat_init_fn(inst, build_name, opentop)`
* **Description:** Initializes football hat skin, adds open_top_hat tag if opentop is true, and adds skin sounds on master sim.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- Name of the skin build to apply
  - `opentop` -- Boolean indicating if hat should have open_top_hat tag
* **Returns:** nil
* **Error states:** None

### `footballhat_clear_fn(inst)`
* **Description:** Clears football hat skin, removes open_top_hat tag, and removes skin sounds.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `treasurechest_init_fn(inst, build_name)`
* **Description:** Initializes treasure chest skin with upgrade support. Returns early if placer component exists or on client. Uses upgraded build if _chestupgrade_stacksize exists.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- Name of the skin build to apply
* **Returns:** nil
* **Error states:** None

### `treasurechest_clear_fn(inst)`
* **Description:** Clears treasure chest skin, using upgraded build name if _chestupgrade_stacksize exists, and removes skin sounds.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `dragonflychest_init_fn(inst, build_name)`
* **Description:** Initializes dragonfly chest skin with upgrade support. Returns early if placer component exists or on client. Uses upgraded build if _chestupgrade_stacksize exists.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- Name of the skin build to apply
* **Returns:** nil
* **Error states:** None

### `dragonflychest_clear_fn(inst)`
* **Description:** Clears dragonfly chest skin, using upgraded build name if _chestupgrade_stacksize exists, and removes skin sounds.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `meatrack_init_fn(inst, build_name)`
* **Description:** Initializes meat rack skin and calls OnMeatRackSkinChanged on master sim if the method exists.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- Name of the skin build to apply
* **Returns:** nil
* **Error states:** None

### `meatrack_clear_fn(inst)`
* **Description:** Clears meat rack skin and calls OnMeatRackSkinChanged with nil if the method exists.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `rabbithouse_init_fn(inst, build_name)`
* **Description:** Initializes rabbit house skin and spawns glow FX prefab if not a placer and not burnt. Sets parent and overrides glow symbol.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- Name of the skin build to apply
* **Returns:** nil
* **Error states:** None

### `rabbithouse_clear_fn(inst)`
* **Description:** Clears rabbit house skin and removes glow FX instance if it exists.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `cavein_boulder_init_fn(inst, build_name)`
* **Description:** Initializes cave-in boulder skin by clearing override symbol, setting symbol swap data, and calling basic_init_fn.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- Name of the skin build to apply
* **Returns:** nil
* **Error states:** None

### `cavein_boulder_clear_fn(inst)`
* **Description:** Clears cave-in boulder skin by resetting variation and calling basic_clear_fn.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `stagehand_init_fn(inst, build_name)`
* **Description:** Initializes stagehand skin and overrides fingers, fx, and dark_spew symbols.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- Name of the skin build to apply
* **Returns:** nil
* **Error states:** None

### `stagehand_clear_fn(inst)`
* **Description:** Clears stagehand skin by clearing override symbols for fingers, fx, and dark_spew.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `wormhole_init_fn(inst, build_name)`
* **Description:** Initializes wormhole skin and sets mini map icon to build_name.png.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- Name of the skin build to apply
* **Returns:** nil
* **Error states:** None

### `wormhole_clear_fn(inst)`
* **Description:** Clears wormhole skin and resets mini map icon to wormhole.png.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `cave_entrance_init_fn(inst, build_name)`
* **Description:** Initializes cave entrance skin and stores build_name in linked_skinname property.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- Name of the skin build to apply
* **Returns:** nil
* **Error states:** None

### `cave_entrance_clear_fn(inst)`
* **Description:** Clears cave entrance skin and sets linked_skinname to nil.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `gravestone_init_fn(inst, build_name)`
* **Description:** Initializes gravestone skin and plays grave animation based on last character of build_name on master sim.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- Name of the skin build to apply
* **Returns:** nil
* **Error states:** None

### `gravestone_clear_fn(inst)`
* **Description:** Clears gravestone skin and plays grave animation based on random_stone_choice property.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `dug_gravestone_clear_fn(inst)`
* **Description:** Clears dug gravestone skin and changes inventory item image name based on random_stone_choice.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `pottedfern_init_fn(inst, build_name)`
* **Description:** Initializes potted fern skin, sets eight-faced transform, and plays c animation.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- Name of the skin build to apply
* **Returns:** nil
* **Error states:** None

### `pottedfern_clear_fn(inst)`
* **Description:** Clears potted fern skin, resets to no-faced transform, and plays original animation.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `siestahut_init_fn(inst, build_name)`
* **Description:** Initializes siesta hut skin and spawns VFX FX prefab after random delay if not a placer.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin on
  - `build_name` -- Name of the skin build to apply
* **Returns:** nil
* **Error states:** None

### `siestahut_clear_fn(inst)`
* **Description:** Clears siesta hut skin and removes VFX FX instance if it exists.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `bushhat_init_fn(inst, build_name)`
* **Description:** Initializes bushhat skin by calling basic_init_fn, checking for skin FX prefab, and setting up event listeners for equipped, unequipped, and onremove events if vfx_fx exists.
* **Parameters:**
  - `inst` -- Entity instance to initialize skin for
  - `build_name` -- Skin/build name for the bushhat
* **Returns:** nil
* **Error states:** None

### `bushhat_clear_fn(inst)`
* **Description:** Clears bushhat skin by calling basic_clear_fn and removing event callbacks for equipped, unequipped, and onremove events.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `lureplantbulb_init_fn(inst, build_name)`
* **Description:** Initializes lureplant bulb skin by setting linked_skinname, applying skin to AnimState, and changing inventory item image name.
* **Parameters:**
  - `inst` -- Entity instance for lureplant bulb
  - `build_name` -- Skin/build name
* **Returns:** nil
* **Error states:** None

### `lureplantbulb_clear_fn(inst)`
* **Description:** Clears lureplant bulb skin by resetting linked_skinname, restoring default build, and resetting inventory image name.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `lureplant_init_fn(inst, build_name)`
* **Description:** Initializes lureplant skin by setting AnimState skin, retrieving skin data, storing item_skinname, and calling SetSkin. Returns early if placer component exists or not on master sim.
* **Parameters:**
  - `inst` -- Entity instance for lureplant
  - `build_name` -- Skin name
* **Returns:** nil
* **Error states:** None

### `lureplant_clear_fn(inst)`
* **Description:** Clears lureplant skin by restoring default build, clearing item_skinname on master sim, and calling SetSkin.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `saddle_basic_init_fn(inst, build_name)`
* **Description:** Initializes basic saddle skin by calling basic_init_fn and setting saddler swaps with build name, symbol, and GUID.
* **Parameters:**
  - `inst` -- Entity instance for saddle
  - `build_name` -- Skin/build name
* **Returns:** nil
* **Error states:** None

### `saddle_basic_clear_fn(inst)`
* **Description:** Clears basic saddle skin by calling basic_clear_fn and resetting saddler swaps to default values.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `wathgrithrhat_init_fn(inst, build_name, opentop)`
* **Description:** Initializes Wigfrid helmet skin by calling basic_init_fn, adding open_top_hat tag if opentop is true, and adding skin sounds on master sim.
* **Parameters:**
  - `inst` -- Entity instance for Wigfrid helmet
  - `build_name` -- Skin/build name
  - `opentop` -- Boolean indicating if helmet has open top
* **Returns:** nil
* **Error states:** None

### `wathgrithrhat_clear_fn(inst)`
* **Description:** Clears Wigfrid helmet skin by calling basic_clear_fn, removing open_top_hat tag, and removing skin sounds.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `wathgrithr_improvedhat_init_fn(inst, build_name, opentop)`
* **Description:** Initializes improved Wigfrid helmet skin by calling basic_init_fn, adding open_top_hat tag if opentop is true, and adding skin sounds on master sim.
* **Parameters:**
  - `inst` -- Entity instance for improved Wigfrid helmet
  - `build_name` -- Skin/build name
  - `opentop` -- Boolean indicating if helmet has open top
* **Returns:** nil
* **Error states:** None

### `wathgrithr_improvedhat_clear_fn(inst)`
* **Description:** Clears improved Wigfrid helmet skin by calling basic_clear_fn, removing open_top_hat tag, and removing skin sounds.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `pighouse_init_fn(inst, build_name)`
* **Description:** Initializes pighouse skin by calling basic_init_fn and applying skin to window and windowsnow AnimStates if they exist.
* **Parameters:**
  - `inst` -- Entity instance for pighouse
  - `build_name` -- Skin/build name
* **Returns:** nil
* **Error states:** None

### `pighouse_clear_fn(inst)`
* **Description:** Clears pighouse skin by calling basic_clear_fn and restoring default builds for window and windowsnow AnimStates if they exist.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `researchlab_init_fn(inst, build_name)`
* **Description:** Initializes science machine skin by calling basic_init_fn and overriding multiple symbols including bolts, FX effects, and shadow elements.
* **Parameters:**
  - `inst` -- Entity instance for science machine
  - `build_name` -- Skin/build name
* **Returns:** nil
* **Error states:** None

### `researchlab_clear_fn(inst)`
* **Description:** Clears science machine skin by calling basic_clear_fn and clearing all overridden symbols.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `chester_eyebone_init_fn(inst, build_name)`
* **Description:** Initializes Chester eyebone skin on master sim by refreshing eye, setting build, and storing linked_skinname.
* **Parameters:**
  - `inst` -- Entity instance for Chester eyebone
  - `build_name` -- Skin/build name
* **Returns:** nil
* **Error states:** None

### `chester_eyebone_clear_fn(inst)`
* **Description:** Clears Chester eyebone skin by refreshing eye, setting build, and clearing linked_skinname.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `chester_init_fn(inst, build_name)`
* **Description:** Initializes Chester skin on master sim by calling SetBuild.
* **Parameters:**
  - `inst` -- Entity instance for Chester
  - `build_name` -- Skin/build name
* **Returns:** nil
* **Error states:** None

### `chester_clear_fn(inst)`
* **Description:** Clears Chester skin by calling SetBuild.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `hutch_fishbowl_init_fn(inst, build_name)`
* **Description:** Initializes Hutch fishbowl skin on master sim by calling basic_init_fn, refreshing fishbowl icon, and storing linked_skinname.
* **Parameters:**
  - `inst` -- Entity instance for Hutch fishbowl
  - `build_name` -- Skin/build name
* **Returns:** nil
* **Error states:** None

### `hutch_fishbowl_clear_fn(inst)`
* **Description:** Clears Hutch fishbowl skin by calling basic_clear_fn, refreshing fishbowl icon, and clearing linked_skinname.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `hutch_init_fn(inst, build_name)`
* **Description:** Initializes Hutch skin on master sim by calling SetBuild.
* **Parameters:**
  - `inst` -- Entity instance for Hutch
  - `build_name` -- Skin/build name
* **Returns:** nil
* **Error states:** None

### `hutch_clear_fn(inst)`
* **Description:** Clears Hutch skin by calling SetBuild.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `glommerflower_init_fn(inst, build_name)`
* **Description:** Initializes Glommer flower skin by calling basic_init_fn and refreshing flower icon on master sim.
* **Parameters:**
  - `inst` -- Entity instance for Glommer flower
  - `build_name` -- Skin/build name
* **Returns:** nil
* **Error states:** None

### `glommerflower_clear_fn(inst)`
* **Description:** Clears Glommer flower skin by calling basic_clear_fn and refreshing flower icon.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `glommer_init_fn(inst, build_name)`
* **Description:** Initializes Glommer skin by calling basic_init_fn.
* **Parameters:**
  - `inst` -- Entity instance for Glommer
  - `build_name` -- Skin/build name
* **Returns:** nil
* **Error states:** None

### `glommer_clear_fn(inst)`
* **Description:** Clears Glommer skin by calling basic_clear_fn.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `bundlewrap_init_fn(inst, build_name)`
* **Description:** Initializes bundle wrap skin by calling basic_init_fn, setting bundlemaker skin data, and adding skin sounds on master sim.
* **Parameters:**
  - `inst` -- Entity instance for bundle wrap
  - `build_name` -- Skin/build name
* **Returns:** nil
* **Error states:** None

### `bundlewrap_clear_fn(inst)`
* **Description:** Clears bundle wrap skin by calling basic_clear_fn, resetting bundlemaker skin data, and removing skin sounds.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `bundle_init_fn(inst, build_name)`
* **Description:** Initializes bundle skin by calling basic_init_fn, updating inventory image, and adding skin sounds.
* **Parameters:**
  - `inst` -- Entity instance for bundle
  - `build_name` -- Skin/build name
* **Returns:** nil
* **Error states:** None

### `bundle_clear_fn(inst)`
* **Description:** Clears bundle skin by calling basic_clear_fn, updating inventory image, and removing skin sounds.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `abigail_flower_init_fn(inst, build_name)`
* **Description:** Initializes Abigail flower skin on master sim by setting flower_skin_id, applying skin to AnimState, changing inventory image name, and storing linked_skinname.
* **Parameters:**
  - `inst` -- Entity instance for Abigail flower
  - `build_name` -- Skin/build name
* **Returns:** nil
* **Error states:** None

### `abigail_flower_clear_fn(inst)`
* **Description:** Clears Abigail flower skin by restoring default build, clearing linked_skinname, and resetting inventory image name.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `abigail_init_fn(inst, build_name)`
* **Description:** Initializes Abigail skin on master sim by overriding ghost_Hat symbol with skin build.
* **Parameters:**
  - `inst` -- Entity instance for Abigail
  - `build_name` -- Skin/build name
* **Returns:** nil
* **Error states:** None

### `abigail_clear_fn(inst)`
* **Description:** Clears Abigail skin by clearing the ghost_Hat override symbol.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `bugnet_init_fn(inst, build_name)`
* **Description:** Initializes bug net skin on master sim by calling basic_init_fn and adding skin sounds.
* **Parameters:**
  - `inst` -- Entity instance for bug net
  - `build_name` -- Skin/build name
* **Returns:** nil
* **Error states:** None

### `bugnet_clear_fn(inst)`
* **Description:** Clears bug net skin by calling basic_clear_fn and removing skin sounds.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `cookpot_init_fn(inst, build_name)`
* **Description:** Initializes crockpot skin by applying skin to AnimState. Returns early if no placer component and not on master sim.
* **Parameters:**
  - `inst` -- Entity instance for crockpot
  - `build_name` -- Skin/build name
* **Returns:** nil
* **Error states:** None

### `cookpot_clear_fn(inst, build_name)`
* **Description:** Clears crockpot skin by restoring default build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
  - `build_name` -- Skin/build name (unused in function body)
* **Returns:** nil
* **Error states:** None

### `firesuppressor_init_fn(inst, build_name)`
* **Description:** Initializes firesuppressor skin by applying skin to linked placer entities or main entity, and overriding swap_meter symbol based on fuel level.
* **Parameters:**
  - `inst` -- Entity instance for firesuppressor
  - `build_name` -- Skin/build name
* **Returns:** nil
* **Error states:** None

### `firesuppressor_clear_fn(inst)`
* **Description:** Clears firesuppressor skin by restoring default build, clearing override symbol, and restoring original symbol if fuel level exists.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `firepit_init_fn(inst, build_name, fxoffset)`
* **Description:** Initializes firepit skin by applying skin to AnimState, setting burnable FX offset, setting up takefuel event listener for skin FX if available, and restarting firepit.
* **Parameters:**
  - `inst` -- Entity instance for firepit
  - `build_name` -- Skin/build name
  - `fxoffset` -- FX offset vector for burnable component
* **Returns:** nil
* **Error states:** None

### `firepit_clear_fn(inst)`
* **Description:** Clears firepit skin by restoring default build, clearing burnable fxoffset, removing takefuel event callback, and restarting firepit.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `campfire_init_fn(inst, build_name, fxoffset)`
* **Description:** Initializes campfire skin by applying skin to AnimState and positioning first fxchild if it exists.
* **Parameters:**
  - `inst` -- Entity instance for campfire
  - `build_name` -- Skin/build name
  - `fxoffset` -- FX offset vector for positioning fxchildren
* **Returns:** nil
* **Error states:** None

### `campfire_clear_fn(inst)`
* **Description:** Clears campfire skin by restoring default build and resetting first fxchild position to origin if it exists.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `coldfirepit_init_fn(inst, build_name, fxoffset)`
* **Description:** Initializes cold firepit skin by applying skin to AnimState, setting burnable FX offset, and restarting firepit.
* **Parameters:**
  - `inst` -- Entity instance for cold firepit
  - `build_name` -- Skin/build name
  - `fxoffset` -- FX offset vector for burnable component
* **Returns:** nil
* **Error states:** None

### `coldfirepit_clear_fn(inst)`
* **Description:** Clears cold firepit skin by restoring default build, clearing burnable fxoffset, and restarting firepit.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `critter_builder_init_fn(inst, build_name)`
* **Description:** Initializes critter builder skin by storing linked_skinname.
* **Parameters:**
  - `inst` -- Entity instance for critter builder
  - `build_name` -- Skin/build name
* **Returns:** nil
* **Error states:** None

### `pet_init_fn(inst, build_name, default_build)`
* **Description:** Initializes pet skin on master sim by applying skin to AnimState.
* **Parameters:**
  - `inst` -- Entity instance for pet
  - `build_name` -- Skin/build name
  - `default_build` -- Default build name for AnimState
* **Returns:** nil
* **Error states:** None

### `perdling_init_fn(inst, build_name, default_build, hungry_sound)`
* **Description:** Initializes perdling skin on master sim by applying skin to AnimState and storing skin_hungry_sound.
* **Parameters:**
  - `inst` -- Entity instance for perdling
  - `build_name` -- Skin/build name
  - `default_build` -- Default build name for AnimState
  - `hungry_sound` -- Sound to play when hungry
* **Returns:** nil
* **Error states:** None

### `glomling_init_fn(inst, build_name, default_build)`
* **Description:** Initializes glomling skin on master sim by applying skin to AnimState and adding skin sounds.
* **Parameters:**
  - `inst` -- Entity instance for glomling
  - `build_name` -- Skin/build name
  - `default_build` -- Default build name for AnimState
* **Returns:** nil
* **Error states:** None

### `critter_dragonling_clear_fn(inst)`
* **Description:** Clears dragonling critter skin by restoring default build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `critter_dragonling_builder_clear_fn(inst)`
* **Description:** Clears dragonling builder critter skin by clearing linked_skinname.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `critter_glomling_clear_fn(inst)`
* **Description:** Clears glomling critter skin by restoring default build and removing skin sounds.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `critter_glomling_builder_clear_fn(inst)`
* **Description:** Clears glomling builder critter skin by clearing linked_skinname.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `critter_kitten_clear_fn(inst)`
* **Description:** Clears kitten critter skin by restoring default build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `critter_kitten_builder_clear_fn(inst)`
* **Description:** Clears kitten builder critter skin by clearing linked_skinname.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `critter_lamb_clear_fn(inst)`
* **Description:** Clears lamb critter skin by restoring default build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `critter_lamb_builder_clear_fn(inst)`
* **Description:** Clears lamb builder critter skin by clearing linked_skinname.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `critter_perdling_clear_fn(inst)`
* **Description:** Clears perdling critter skin by restoring default build and clearing skin_hungry_sound.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `critter_perdling_builder_clear_fn(inst)`
* **Description:** Clears perdling builder critter skin by clearing linked_skinname.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `critter_puppy_clear_fn(inst)`
* **Description:** Clears puppy critter skin by restoring default build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `critter_puppy_builder_clear_fn(inst)`
* **Description:** Clears puppy builder critter skin by clearing linked_skinname.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `critter_bulbin_init_fn(inst, build_name)`
* **Description:** Initializes bulbin critter skin by calling basic_init_fn.
* **Parameters:**
  - `inst` -- Entity instance for bulbin critter
  - `build_name` -- Skin/build name
* **Returns:** nil
* **Error states:** None

### `critter_bulbin_clear_fn(inst)`
* **Description:** Clears bulbin critter skin by setting persists to false and scheduling removal task.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `critter_bulbin_builder_clear_fn(inst)`
* **Description:** Clears bulbin builder critter skin by clearing linked_skinname.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `minisign_item_init_fn(inst, build_name, anim_bank)`
* **Description:** Initializes mini sign item skin by storing linked_skinname, applying skin to AnimState, setting anim bank if provided, and changing inventory image name.
* **Parameters:**
  - `inst` -- Entity instance for mini sign item
  - `build_name` -- Skin/build name
  - `anim_bank` -- Animation bank name (optional)
* **Returns:** nil
* **Error states:** None

### `minisign_item_clear_fn(inst)`
* **Description:** Clears mini sign item skin by clearing linked_skinname, restoring default build and bank, and resetting inventory image name.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `minisign_drawn_init_fn(inst, build_name, anim_bank)`
* **Description:** Initializes drawn mini sign skin by storing linked_skinname, applying skin to AnimState, setting anim bank if provided, and changing inventory image name.
* **Parameters:**
  - `inst` -- Entity instance for drawn mini sign
  - `build_name` -- Skin/build name
  - `anim_bank` -- Animation bank name (optional)
* **Returns:** nil
* **Error states:** None

### `minisign_drawn_clear_fn(inst)`
* **Description:** Clears drawn mini sign skin by clearing linked_skinname, restoring default build and bank, and resetting inventory image name.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `minisign_init_fn(inst, build_name, anim_bank)`
* **Description:** Initializes mini sign skin by applying skin to AnimState, setting anim bank if provided, and storing linked_skinname variants for item and drawn states.
* **Parameters:**
  - `inst` -- Entity instance for mini sign
  - `build_name` -- Skin/build name
  - `anim_bank` -- Animation bank name (optional)
* **Returns:** nil
* **Error states:** None

### `minisign_clear_fn(inst)`
* **Description:** Clears mini sign skin by clearing linked_skinname variants and restoring default build and bank.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `boat_item_init_fn(inst, build_name)`
* **Description:** Initializes boat item skin by storing linked_skinname, applying skin to AnimState, and changing inventory image name.
* **Parameters:**
  - `inst` -- Entity instance for boat item
  - `build_name` -- Skin/build name
* **Returns:** nil
* **Error states:** None

### `boat_item_clear_fn(inst)`
* **Description:** Clears boat item skin by clearing linked_skinname, restoring default build, and resetting inventory image name.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `boat_init_fn(inst, build_name)`
* **Description:** Initializes boat skin by applying skin to AnimState. Returns early if no placer component and not on master sim.
* **Parameters:**
  - `inst` -- Entity instance for boat
  - `build_name` -- Skin/build name
* **Returns:** nil
* **Error states:** None

### `boat_clear_fn(inst)`
* **Description:** Clears boat skin by restoring default build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `walkingplank_init_fn(inst, build_name)`
* **Description:** Initializes walking plank skin by applying skin to AnimState. Returns early if no placer component and not on master sim.
* **Parameters:**
  - `inst` -- Entity instance for walking plank
  - `build_name` -- Skin/build name
* **Returns:** nil
* **Error states:** None

### `walkingplank_clear_fn(inst, build_name)`
* **Description:** Clears walking plank skin by restoring default build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
  - `build_name` -- Skin/build name (unused in function body)
* **Returns:** nil
* **Error states:** None

### `steeringwheel_item_init_fn(inst, build_name)`
* **Description:** Initializes steering wheel item skin by storing linked_skinname, applying skin to AnimState, and changing inventory image name.
* **Parameters:**
  - `inst` -- Entity instance for steering wheel item
  - `build_name` -- Skin/build name
* **Returns:** nil
* **Error states:** None

### `steeringwheel_item_clear_fn(inst)`
* **Description:** Clears steering wheel item skin by clearing linked_skinname, restoring default build, and resetting inventory image name.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `steeringwheel_init_fn(inst, build_name)`
* **Description:** Initializes steering wheel skin by applying skin to AnimState. Returns early if no placer component and not on master sim.
* **Parameters:**
  - `inst` -- Entity instance for steering wheel
  - `build_name` -- Skin/build name
* **Returns:** nil
* **Error states:** None

### `steeringwheel_clear_fn(inst)`
* **Description:** Clears steering wheel skin by restoring default build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `anchor_item_init_fn(inst, build_name)`
* **Description:** Initializes anchor item skin by storing linked_skinname, applying skin to AnimState, and changing inventory image name.
* **Parameters:**
  - `inst` -- Entity instance for anchor item
  - `build_name` -- Skin/build name
* **Returns:** nil
* **Error states:** None

### `anchor_item_clear_fn(inst)`
* **Description:** Clears anchor item skin by clearing linked_skinname, restoring default build, and resetting inventory image name.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `anchor_init_fn(inst, build_name)`
* **Description:** Initializes anchor skin by applying skin to AnimState. Returns early if no placer component and not on master sim.
* **Parameters:**
  - `inst` -- Entity instance for anchor
  - `build_name` -- Skin/build name
* **Returns:** nil
* **Error states:** None

### `anchor_clear_fn(inst)`
* **Description:** Clears anchor skin by restoring default build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `mastupgrade_lamp_item_init_fn(inst, build_name)`
* **Description:** Initializes mast upgrade lamp item skin by storing linked_skinname, applying skin to AnimState, and changing inventory image name.
* **Parameters:**
  - `inst` -- Entity instance for mast upgrade lamp item
  - `build_name` -- Skin/build name
* **Returns:** nil
* **Error states:** None

### `mastupgrade_lamp_item_clear_fn(inst)`
* **Description:** Clears mast upgrade lamp item skin by clearing linked_skinname, restoring default build, and resetting inventory image name.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `mastupgrade_lamp_init_fn(inst, build_name)`
* **Description:** Initializes mast upgrade lamp skin by applying skin to AnimState. Returns early if no placer component and not on master sim.
* **Parameters:**
  - `inst` -- Entity instance for mast upgrade lamp
  - `build_name` -- Skin/build name
* **Returns:** nil
* **Error states:** None

### `mastupgrade_lamp_clear_fn(inst)`
* **Description:** Clears mast upgrade lamp skin by restoring default build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `mastupgrade_lightningrod_item_init_fn(inst, build_name)`
* **Description:** Initializes mast upgrade lightning rod item skin by storing linked_skinname, applying skin to AnimState, and changing inventory image name.
* **Parameters:**
  - `inst` -- Entity instance for mast upgrade lightning rod item
  - `build_name` -- Skin/build name
* **Returns:** nil
* **Error states:** None

### `mastupgrade_lightningrod_item_clear_fn(inst)`
* **Description:** Clears mast upgrade lightning rod item skin by clearing linked_skinname, restoring default build, and resetting inventory image name.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `mastupgrade_lightningrod_init_fn(inst, build_name)`
* **Description:** Initializes mast upgrade lightning rod skin by applying skin to AnimState. Returns early if no placer component and not on master sim.
* **Parameters:**
  - `inst` -- Entity instance for mast upgrade lightning rod
  - `build_name` -- Skin/build name
* **Returns:** nil
* **Error states:** None

### `mastupgrade_lightningrod_clear_fn(inst)`
* **Description:** Clears mast upgrade lightning rod skin by restoring default build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `mastupgrade_lightningrod_top_init_fn(inst, build_name)`
* **Description:** Initializes mast upgrade lightning rod top skin by applying skin to AnimState. Returns early if no placer component and not on master sim.
* **Parameters:**
  - `inst` -- Entity instance for mast upgrade lightning rod top
  - `build_name` -- Skin/build name
* **Returns:** nil
* **Error states:** None

### `mastupgrade_lightningrod_top_clear_fn(inst)`
* **Description:** Clears mast upgrade lightning rod top skin by restoring default build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `wall_moonrock_item_init_fn(inst, build_name)`
* **Description:** Initializes moonrock wall item skin by storing linked_skinname, applying skin to AnimState, and changing inventory image name.
* **Parameters:**
  - `inst` -- Entity instance for moonrock wall item
  - `build_name` -- Skin/build name
* **Returns:** nil
* **Error states:** None

### `wall_moonrock_item_clear_fn(inst)`
* **Description:** Clears moonrock wall item skin by clearing linked_skinname, restoring default build, and resetting inventory image name.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `wall_moonrock_init_fn(inst, build_name)`
* **Description:** Initializes moonrock wall skin by applying skin to AnimState. Returns early if no placer component and not on master sim.
* **Parameters:**
  - `inst` -- Entity instance for moonrock wall
  - `build_name` -- Skin/build name
* **Returns:** nil
* **Error states:** None

### `wall_moonrock_clear_fn(inst)`
* **Description:** Clears moonrock wall skin by restoring default build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `wall_ruins_item_init_fn(inst, build_name)`
* **Description:** Initializes ruins wall item skin by storing linked_skinname, applying skin to AnimState, and changing inventory image name.
* **Parameters:**
  - `inst` -- Entity instance for ruins wall item
  - `build_name` -- Skin/build name
* **Returns:** nil
* **Error states:** None

### `wall_ruins_item_clear_fn(inst)`
* **Description:** Clears ruins wall item skin by clearing linked_skinname, restoring default build, and resetting inventory image name.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `wall_ruins_init_fn(inst, build_name)`
* **Description:** Initializes ruins wall skin by applying skin to AnimState. Returns early if no placer component and not on master sim.
* **Parameters:**
  - `inst` -- Entity instance for ruins wall
  - `build_name` -- Skin/build name
* **Returns:** nil
* **Error states:** None

### `wall_ruins_clear_fn(inst)`
* **Description:** Clears ruins wall skin by restoring default build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** nil
* **Error states:** None

### `wall_stone_item_init_fn(inst, build_name)`
* **Description:** Initializes stone wall item skin by setting linked skinname, applying skin to AnimState, and updating inventory item image.
* **Parameters:**
  - `inst` -- Entity instance to apply skin to
  - `build_name` -- Skin build name to apply
* **Returns:** None
* **Error states:** None

### `wall_stone_item_clear_fn(inst)`
* **Description:** Clears stone wall item skin by resetting linked_skinname, restoring default build, and clearing inventory image override.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `wall_stone_init_fn(inst, build_name)`
* **Description:** Initializes stone wall placed skin. Returns early if no placer component on client.
* **Parameters:**
  - `inst` -- Entity instance to apply skin to
  - `build_name` -- Skin build name to apply
* **Returns:** None
* **Error states:** None

### `wall_stone_clear_fn(inst)`
* **Description:** Clears stone wall placed skin by restoring default build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `wall_dreadstone_item_init_fn(inst, build_name)`
* **Description:** Initializes dreadstone wall item skin by setting linked skinname, applying skin to AnimState, and updating inventory item image.
* **Parameters:**
  - `inst` -- Entity instance to apply skin to
  - `build_name` -- Skin build name to apply
* **Returns:** None
* **Error states:** None

### `wall_dreadstone_item_clear_fn(inst)`
* **Description:** Clears dreadstone wall item skin by resetting linked_skinname, restoring default build, and clearing inventory image override.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `wall_dreadstone_init_fn(inst, build_name)`
* **Description:** Initializes dreadstone wall placed skin. Returns early if no placer component on client.
* **Parameters:**
  - `inst` -- Entity instance to apply skin to
  - `build_name` -- Skin build name to apply
* **Returns:** None
* **Error states:** None

### `wall_dreadstone_clear_fn(inst)`
* **Description:** Clears dreadstone wall placed skin by restoring default build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `wall_hay_item_init_fn(inst, build_name)`
* **Description:** Initializes hay wall item skin by setting linked skinname, applying skin to AnimState, and updating inventory item image.
* **Parameters:**
  - `inst` -- Entity instance to apply skin to
  - `build_name` -- Skin build name to apply
* **Returns:** None
* **Error states:** None

### `wall_hay_item_clear_fn(inst)`
* **Description:** Clears hay wall item skin by resetting linked_skinname, restoring default build, and clearing inventory image override.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `wall_hay_init_fn(inst, build_name)`
* **Description:** Initializes hay wall placed skin. Returns early if no placer component on client.
* **Parameters:**
  - `inst` -- Entity instance to apply skin to
  - `build_name` -- Skin build name to apply
* **Returns:** None
* **Error states:** None

### `wall_hay_clear_fn(inst)`
* **Description:** Clears hay wall placed skin by restoring default build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `wall_wood_item_init_fn(inst, build_name)`
* **Description:** Initializes wood wall item skin by setting linked skinname, applying skin to AnimState, and updating inventory item image.
* **Parameters:**
  - `inst` -- Entity instance to apply skin to
  - `build_name` -- Skin build name to apply
* **Returns:** None
* **Error states:** None

### `wall_wood_item_clear_fn(inst)`
* **Description:** Clears wood wall item skin by resetting linked_skinname, restoring default build, and clearing inventory image override.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `wall_wood_init_fn(inst, build_name)`
* **Description:** Initializes wood wall placed skin. Returns early if no placer component on client.
* **Parameters:**
  - `inst` -- Entity instance to apply skin to
  - `build_name` -- Skin build name to apply
* **Returns:** None
* **Error states:** None

### `wall_wood_clear_fn(inst)`
* **Description:** Clears wood wall placed skin by restoring default build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `fence_item_init_fn(inst, build_name)`
* **Description:** Initializes fence item skin by setting linked skinname, applying skin to AnimState, and updating inventory item image.
* **Parameters:**
  - `inst` -- Entity instance to apply skin to
  - `build_name` -- Skin build name to apply
* **Returns:** None
* **Error states:** None

### `fence_item_clear_fn(inst)`
* **Description:** Clears fence item skin by resetting linked_skinname, restoring default build, and clearing inventory image override.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `fence_init_fn(inst, build_name)`
* **Description:** Initializes fence placed skin. Returns early if no placer component on client.
* **Parameters:**
  - `inst` -- Entity instance to apply skin to
  - `build_name` -- Skin build name to apply
* **Returns:** None
* **Error states:** None

### `fence_clear_fn(inst)`
* **Description:** Clears fence placed skin by restoring default build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `fence_gate_item_init_fn(inst, build_name)`
* **Description:** Initializes fence gate item skin by setting linked skinname, applying skin to AnimState, and updating inventory item image.
* **Parameters:**
  - `inst` -- Entity instance to apply skin to
  - `build_name` -- Skin build name to apply
* **Returns:** None
* **Error states:** None

### `fence_gate_item_clear_fn(inst)`
* **Description:** Clears fence gate item skin by resetting linked_skinname, restoring default build, and clearing inventory image override.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `fence_gate_init_fn(inst, build_name)`
* **Description:** Initializes fence gate placed skin. Sets dooranim skin_id and applies skin to dooranim AnimState. Returns early if no placer component on client.
* **Parameters:**
  - `inst` -- Entity instance to apply skin to
  - `build_name` -- Skin build name to apply
* **Returns:** None
* **Error states:** None

### `fence_gate_clear_fn(inst)`
* **Description:** Clears fence gate placed skin by resetting dooranim skin_id and restoring default build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `mast_item_init_fn(inst, build_name)`
* **Description:** Initializes mast item skin by setting linked skinname, applying skin to AnimState, and updating inventory item image.
* **Parameters:**
  - `inst` -- Entity instance to apply skin to
  - `build_name` -- Skin build name to apply
* **Returns:** None
* **Error states:** None

### `mast_item_clear_fn(inst)`
* **Description:** Clears mast item skin by resetting linked_skinname and restoring default build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None
### `mast_init_fn(inst, build_name)`
* **Description:** Initializes mast placed skin. Returns early if no placer component on client.
* **Parameters:**
  - `inst` -- Entity instance to apply skin to
  - `build_name` -- Skin build name to apply
* **Returns:** None
* **Error states:** None

### `mast_clear_fn(inst)`
* **Description:** Clears mast placed skin by restoring default build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None### `record_init_fn(inst, build_name, trackname)`
* **Description:** Initializes record skin by calling basic_init_fn, setting record displayname, overriding inspectable name, setting songToPlay_skin if trackname provided, and adding skin sounds.
* **Parameters:**
  - `inst` -- Entity instance to apply skin to
  - `build_name` -- Skin build name to apply
  - `trackname` -- Optional track name for skin-specific audio
* **Returns:** None
* **Error states:** None

### `record_clear_fn(inst)`
* **Description:** Clears record skin by calling basic_clear_fn, resetting displayname, clearing inspectable name override, clearing inventory image, resetting songToPlay_skin, and removing skin sounds.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `mast_malbatross_item_init_fn(inst, build_name)`
* **Description:** Initializes malbatross mast item skin by setting linked skinname, applying skin to AnimState, and updating inventory item image.
* **Parameters:**
  - `inst` -- Entity instance to apply skin to
  - `build_name` -- Skin build name to apply
* **Returns:** None
* **Error states:** None

### `mast_malbatross_item_clear_fn(inst, build_name)`
* **Description:** Clears malbatross mast item skin by resetting linked_skinname and restoring default build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
  - `build_name` -- Skin build name (unused in clear)
* **Returns:** None
* **Error states:** None

### `mast_malbatross_init_fn(inst, build_name)`
* **Description:** Initializes malbatross mast placed skin. Returns early if no placer component on client.
* **Parameters:**
  - `inst` -- Entity instance to apply skin to
  - `build_name` -- Skin build name to apply
* **Returns:** None
* **Error states:** None

### `mast_malbatross_clear_fn(inst, build_name)`
* **Description:** Clears malbatross mast placed skin by restoring default build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
  - `build_name` -- Skin build name (unused in clear)
* **Returns:** None
* **Error states:** None

### `bernie_inactive_init_fn(inst, build_name)`
* **Description:** Initializes inactive bernie skin on server only. Applies skin to AnimState and updates inventory item image.
* **Parameters:**
  - `inst` -- Entity instance to apply skin to
  - `build_name` -- Skin build name to apply
* **Returns:** None
* **Error states:** None

### `bernie_inactive_clear_fn(inst)`
* **Description:** Clears inactive bernie skin by restoring default build and clearing inventory image override.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `bernie_active_init_fn(inst, build_name)`
* **Description:** Initializes active bernie skin on server only. Applies skin to AnimState.
* **Parameters:**
  - `inst` -- Entity instance to apply skin to
  - `build_name` -- Skin build name to apply
* **Returns:** None
* **Error states:** None

### `bernie_active_clear_fn(inst)`
* **Description:** Clears active bernie skin by restoring default build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `bernie_big_init_fn(inst, build_name)`
* **Description:** Initializes big bernie skin on server only. Applies skin to AnimState and calls SetBernieSkinBuild if available.
* **Parameters:**
  - `inst` -- Entity instance to apply skin to
  - `build_name` -- Skin build name to apply
* **Returns:** None
* **Error states:** None

### `bernie_big_clear_fn(inst)`
* **Description:** Clears big bernie skin by calling ClearBernieSkinBuild if available, otherwise restores default build.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `researchlab4_init_fn(inst, build_name)`
* **Description:** Initializes researchlab4 skin. Overrides machine_hat symbol for placers on client or server. Returns early on client without placer.
* **Parameters:**
  - `inst` -- Entity instance to apply skin to
  - `build_name` -- Skin build name to apply
* **Returns:** None
* **Error states:** None

### `researchlab4_clear_fn(inst)`
* **Description:** Clears researchlab4 skin by clearing machine_hat symbol override.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `reviver_init_fn(inst, build_name)`
* **Description:** Initializes reviver skin on server only. Applies skin, sets up beat FX if defined in SKIN_FX_PREFAB, spawns glow child entity, adds skin sounds, and triggers skin_switched.
* **Parameters:**
  - `inst` -- Entity instance to apply skin to
  - `build_name` -- Skin build name to apply
* **Returns:** None
* **Error states:** None

### `reviver_clear_fn(inst)`
* **Description:** Clears reviver skin by restoring default build, clearing inventory image, removing highlight children FX, resetting PlayBeatAnimation, removing skin sounds, and triggering skin_switched.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `cane_init_fn(inst, build_name)`
* **Description:** Initializes cane skin on server only. Calls basic_init_fn, overrides grass symbol, sets up VFX and trail FX from SKIN_FX_PREFAB, and registers event listeners for equipped/unequipped/onremove.
* **Parameters:**
  - `inst` -- Entity instance to apply skin to
  - `build_name` -- Skin build name to apply
* **Returns:** None
* **Error states:** None

### `cane_clear_fn(inst)`
* **Description:** Clears cane skin by calling basic_clear_fn, clearing grass symbol override, and removing all event callbacks.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `nightsword_init_fn(inst, build_name)`
* **Description:** Initializes nightsword skin on server only. Calls basic_init_fn, sets up VFX FX from SKIN_FX_PREFAB, and registers event listeners for equipped/unequipped/onremove.
* **Parameters:**
  - `inst` -- Entity instance to apply skin to
  - `build_name` -- Skin build name to apply
* **Returns:** None
* **Error states:** None

### `nightsword_clear_fn(inst)`
* **Description:** Clears nightsword skin by calling basic_clear_fn and removing all event callbacks.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `glasscutter_init_fn(inst, build_name)`
* **Description:** Initializes glasscutter skin. Calls basic_init_fn and adds skin sounds on server only.
* **Parameters:**
  - `inst` -- Entity instance to apply skin to
  - `build_name` -- Skin build name to apply
* **Returns:** None
* **Error states:** None

### `glasscutter_clear_fn(inst)`
* **Description:** Clears glasscutter skin by calling basic_clear_fn and removing skin sounds.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `orangestaff_init_fn(inst, build_name)`
* **Description:** Initializes orange staff skin on server only. Calls staff_init_fn, sets up VFX and trail FX from SKIN_FX_PREFAB, registers event listeners, and configures blinkstaff FX if defined.
* **Parameters:**
  - `inst` -- Entity instance to apply skin to
  - `build_name` -- Skin build name to apply
* **Returns:** None
* **Error states:** None

### `orangestaff_clear_fn(inst)`
* **Description:** Clears orange staff skin by calling staff_clear_fn, removing event callbacks, and resetting blinkstaff FX to defaults.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `yellowstaff_init_fn(inst, build_name)`
* **Description:** Initializes yellow staff skin. Calls caststaff_init_fn and sets morph_skin from granted_items in skin data.
* **Parameters:**
  - `inst` -- Entity instance to apply skin to
  - `build_name` -- Skin build name to apply
* **Returns:** None
* **Error states:** None

### `yellowstaff_clear_fn(inst)`
* **Description:** Clears yellow staff skin by calling caststaff_clear_fn and resetting morph_skin to nil.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `heatrock_init_fn(inst, build_name)`
* **Description:** Initializes thermal stone skin on server only. Applies skin to AnimState and updates inventory image name with currentTempRange.
* **Parameters:**
  - `inst` -- Entity instance to apply skin to
  - `build_name` -- Skin build name to apply
* **Returns:** None
* **Error states:** None

### `heatrock_clear_fn(inst)`
* **Description:** Clears thermal stone skin by restoring default build and resetting inventory image name with currentTempRange.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `lantern_init_fn(inst, build_name, overridesymbols, followoffset)`
* **Description:** Initializes lantern skin on server only. Applies skin, sets up held and ground FX from SKIN_FX_PREFAB, stores override symbols and follow offset, registers event listeners for lantern_on/off/unequipped/onremove, and turns on FX if machine is already on.
* **Parameters:**
  - `inst` -- Entity instance to apply skin to
  - `build_name` -- Skin build name to apply
  - `overridesymbols` -- Table of symbol names to override on FX
  - `followoffset` -- Vector3 offset for FX follower positioning
* **Returns:** None
* **Error states:** None

### `lantern_clear_fn(inst)`
* **Description:** Clears lantern skin by restoring default build, turning off FX, resetting FX references and offsets, and removing all event callbacks.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `panflute_init_fn(inst, build_name)`
* **Description:** Initializes pan flute skin by setting AnimState skin build and updating inventory item image name.
* **Parameters:**
  - `inst` -- Entity instance to apply skin to
  - `build_name` -- Skin build name to set
* **Returns:** None
* **Error states:** None

### `panflute_clear_fn(inst)`
* **Description:** Clears pan flute skin by resetting AnimState build to default and clearing inventory item image name.
* **Parameters:**
  - `inst` -- Entity instance to clear skin from
* **Returns:** None
* **Error states:** None

### `researchlab2_init_fn(inst, build_name)`
* **Description:** Initializes researchlab2 skin with symbol overrides, spawns FX children, and sets up flash animation system.
* **Parameters:**
  - `inst` -- Entity instance to initialize
  - `build_name` -- Skin build name
* **Returns:** None
* **Error states:** None

### `researchlab2_clear_fn(inst)`
* **Description:** Clears researchlab2 skin by removing FX children, canceling flash tasks, and restoring default animation functions.
* **Parameters:**
  - `inst` -- Entity instance to clear
* **Returns:** None
* **Error states:** None

### `icebox_init_fn(inst, build_name)`
* **Description:** Initializes icebox skin, sets up FX prefabs, and listens for open/close/remove events.
* **Parameters:**
  - `inst` -- Icebox entity instance
  - `build_name` -- Skin build name
* **Returns:** None
* **Error states:** None

### `icebox_clear_fn(inst)`
* **Description:** Clears icebox skin by removing event callbacks and killing frost FX.
* **Parameters:**
  - `inst` -- Icebox entity instance
* **Returns:** None
* **Error states:** None

### `telebase_init_fn(inst, build_name)`
* **Description:** Initializes telebase skin and applies same skin to all linked placer decorations.
* **Parameters:**
  - `inst` -- Telebase entity instance
  - `build_name` -- Skin build name
* **Returns:** None
* **Error states:** None

### `telebase_clear_fn(inst)`
* **Description:** Clears telebase skin and resets linked_skinname.
* **Parameters:**
  - `inst` -- Telebase entity instance
* **Returns:** None
* **Error states:** None

### `gemsocket_init_fn(inst, build_name)`
* **Description:** Initializes gemsocket skin on master sim only.
* **Parameters:**
  - `inst` -- Gemsocket entity instance
  - `build_name` -- Skin build name
* **Returns:** None
* **Error states:** None

### `gemsocket_clear_fn(inst)`
* **Description:** Clears gemsocket skin by resetting to default build.
* **Parameters:**
  - `inst` -- Gemsocket entity instance
* **Returns:** None
* **Error states:** None

### `molehat_init_fn(inst, build_name, opentop)`
* **Description:** Initializes molehat skin, adds open_top_hat tag if opentop, and sets equip callback.
* **Parameters:**
  - `inst` -- Molehat entity instance
  - `build_name` -- Skin build name
  - `opentop` -- Boolean indicating if hat has open top
* **Returns:** None
* **Error states:** None

### `molehat_clear_fn(inst)`
* **Description:** Clears molehat skin, removes open_top_hat tag, and restores default equip callback.
* **Parameters:**
  - `inst` -- Molehat entity instance
* **Returns:** None
* **Error states:** None

### `premiumwateringcan_init_fn(inst, build_name)`
* **Description:** Initializes premium watering can skin using basic_init_fn.
* **Parameters:**
  - `inst` -- Watering can entity instance
  - `build_name` -- Skin build name
* **Returns:** None
* **Error states:** None

### `premiumwateringcan_clear_fn(inst)`
* **Description:** Clears premium watering can skin using basic_clear_fn.
* **Parameters:**
  - `inst` -- Watering can entity instance
* **Returns:** None
* **Error states:** None

### `mushroom_farm_init_fn(inst, build_name)`
* **Description:** Initializes mushroom farm skin using basic_init_fn.
* **Parameters:**
  - `inst` -- Mushroom farm entity instance
  - `build_name` -- Skin build name
* **Returns:** None
* **Error states:** None

### `mushroom_farm_clear_fn(inst)`
* **Description:** Clears mushroom farm skin using basic_clear_fn.
* **Parameters:**
  - `inst` -- Mushroom farm entity instance
* **Returns:** None
* **Error states:** None

### `dock_woodposts_init_fn(inst, build_name)`
* **Description:** Initializes dock woodposts skin and plays random idle animation variant.
* **Parameters:**
  - `inst` -- Dock woodposts entity instance
  - `build_name` -- Skin build name
* **Returns:** None
* **Error states:** None

### `dock_woodposts_clear_fn(inst)`
* **Description:** Clears dock woodposts skin and plays random idle animation variant.
* **Parameters:**
  - `inst` -- Dock woodposts entity instance
* **Returns:** None
* **Error states:** None

### `dock_woodposts_item_init_fn(inst, build_name, anim_bank)`
* **Description:** Initializes dock woodposts item skin, sets linked_skinname, and updates inventory item image.
* **Parameters:**
  - `inst` -- Dock woodposts item entity instance
  - `build_name` -- Skin build name
  - `anim_bank` -- Optional animation bank override
* **Returns:** None
* **Error states:** None

### `dock_woodposts_item_clear_fn(inst)`
* **Description:** Clears dock woodposts item skin and resets inventory item image.
* **Parameters:**
  - `inst` -- Dock woodposts item entity instance
* **Returns:** None
* **Error states:** None

### `trophyscale_fish_init_fn(inst, build_name)`
* **Description:** Initializes trophy scale fish skin using basic_init_fn.
* **Parameters:**
  - `inst` -- Trophy scale fish entity instance
  - `build_name` -- Skin build name
* **Returns:** None
* **Error states:** None

### `trophyscale_fish_clear_fn(inst)`
* **Description:** Clears trophy scale fish skin using basic_clear_fn.
* **Parameters:**
  - `inst` -- Trophy scale fish entity instance
* **Returns:** None
* **Error states:** None

### `trophyscale_oversizedveggies_init_fn(inst, build_name)`
* **Description:** Initializes oversized veggies trophy scale skin using basic_init_fn.
* **Parameters:**
  - `inst` -- Trophy scale veggies entity instance
  - `build_name` -- Skin build name
* **Returns:** None
* **Error states:** None

### `trophyscale_oversizedveggies_clear_fn(inst)`
* **Description:** Clears oversized veggies trophy scale skin using basic_clear_fn.
* **Parameters:**
  - `inst` -- Trophy scale veggies entity instance
* **Returns:** None
* **Error states:** None

### `resurrectionstatue_init_fn(inst, build_name)`
* **Description:** Initializes resurrection statue skin using basic_init_fn.
* **Parameters:**
  - `inst` -- Resurrection statue entity instance
  - `build_name` -- Skin build name
* **Returns:** None
* **Error states:** None

### `resurrectionstatue_clear_fn(inst)`
* **Description:** Clears resurrection statue skin using basic_clear_fn.
* **Parameters:**
  - `inst` -- Resurrection statue entity instance
* **Returns:** None
* **Error states:** None

### `antlionhat_init_fn(inst, build_name)`
* **Description:** Initializes antlion hat skin using basic_init_fn.
* **Parameters:**
  - `inst` -- Antlion hat entity instance
  - `build_name` -- Skin build name
* **Returns:** None
* **Error states:** None

### `antlionhat_clear_fn(inst)`
* **Description:** Clears antlion hat skin using basic_clear_fn.
* **Parameters:**
  - `inst` -- Antlion hat entity instance
* **Returns:** None
* **Error states:** None

### `woodcarvedhat_init_fn(inst, build_name)`
* **Description:** Initializes woodcarved hat skin using basic_init_fn.
* **Parameters:**
  - `inst` -- Woodcarved hat entity instance
  - `build_name` -- Skin build name
* **Returns:** None
* **Error states:** None

### `woodcarvedhat_clear_fn(inst)`
* **Description:** Clears woodcarved hat skin using basic_clear_fn.
* **Parameters:**
  - `inst` -- Woodcarved hat entity instance
* **Returns:** None
* **Error states:** None

### `nightstick_init_fn(inst, build_name)`
* **Description:** Initializes nightstick skin using basic_init_fn.
* **Parameters:**
  - `inst` -- Nightstick entity instance
  - `build_name` -- Skin build name
* **Returns:** None
* **Error states:** None

### `nightstick_clear_fn(inst)`
* **Description:** Clears nightstick skin using basic_clear_fn.
* **Parameters:**
  - `inst` -- Nightstick entity instance
* **Returns:** None
* **Error states:** None

### `hawaiianshirt_init_fn(inst, build_name)`
* **Description:** Initializes hawaiian shirt skin using basic_init_fn.
* **Parameters:**
  - `inst` -- Hawaiian shirt entity instance
  - `build_name` -- Skin build name
* **Returns:** None
* **Error states:** None

### `hawaiianshirt_clear_fn(inst)`
* **Description:** Clears hawaiian shirt skin using basic_clear_fn.
* **Parameters:**
  - `inst` -- Hawaiian shirt entity instance
* **Returns:** None
* **Error states:** None

### `icehat_init_fn(inst, build_name)`
* **Description:** Initializes ice hat skin using basic_init_fn.
* **Parameters:**
  - `inst` -- Ice hat entity instance
  - `build_name` -- Skin build name
* **Returns:** None
* **Error states:** None

### `icehat_clear_fn(inst)`
* **Description:** Clears ice hat skin using basic_clear_fn.
* **Parameters:**
  - `inst` -- Ice hat entity instance
* **Returns:** None
* **Error states:** None

### `w_radio_init_fn(inst, build_name, skin_custom)`
* **Description:** Initializes w radio skin and calls OnWRadioSkinChanged callback if present.
* **Parameters:**
  - `inst` -- W radio entity instance
  - `build_name` -- Skin build name
  - `skin_custom` -- Custom skin parameter
* **Returns:** None
* **Error states:** None

### `w_radio_clear_fn(inst)`
* **Description:** Clears w radio skin and calls OnWRadioSkinChanged with nil.
* **Parameters:**
  - `inst` -- W radio entity instance
* **Returns:** None
* **Error states:** None

### `pumpkinhat_init_fn(inst, build_name)`
* **Description:** Initializes pumpkin hat skin and calls OnPumpkinHatSkinChanged on master sim.
* **Parameters:**
  - `inst` -- Pumpkin hat entity instance
  - `build_name` -- Skin build name
* **Returns:** None
* **Error states:** None

### `pumpkinhat_clear_fn(inst)`
* **Description:** Clears pumpkin hat skin and calls OnPumpkinHatSkinChanged with nil.
* **Parameters:**
  - `inst` -- Pumpkin hat entity instance
* **Returns:** None
* **Error states:** None

### `hermitcrab_init_fn(inst, build_name)`
* **Description:** Initializes hermit crab skin using basic_init_fn.
* **Parameters:**
  - `inst` -- Hermit crab entity instance
  - `build_name` -- Skin build name
* **Returns:** None
* **Error states:** None

### `hermitcrab_clear_fn(inst)`
* **Description:** Clears hermit crab skin using basic_clear_fn.
* **Parameters:**
  - `inst` -- Hermit crab entity instance
* **Returns:** None
* **Error states:** None

### `hermithouse_ornament_init_fn(inst, build_name)`
* **Description:** Initializes hermit house ornament skin, adds winter ornament tag if Winters Feast, and sets up sounds.
* **Parameters:**
  - `inst` -- Hermit house ornament entity instance
  - `build_name` -- Skin build name
* **Returns:** None
* **Error states:** None

### `hermithouse_ornament_clear_fn(inst)`
* **Description:** Clears hermit house ornament skin, removes winter ornament tag, and removes sounds.
* **Parameters:**
  - `inst` -- Hermit house ornament entity instance
* **Returns:** None
* **Error states:** None

### `hermitcrab_lightpost_init_fn(inst, build_name)`
* **Description:** Initializes hermit crab lightpost skin with lantern post common init and callback.
* **Parameters:**
  - `inst` -- Hermit crab lightpost entity instance
  - `build_name` -- Skin build name
* **Returns:** None
* **Error states:** None

### `hermitcrab_lightpost_clear_fn(inst)`
* **Description:** Clears hermit crab lightpost skin with lantern post clear init and callback.
* **Parameters:**
  - `inst` -- Hermit crab lightpost entity instance
* **Returns:** None
* **Error states:** None

### `hermithotspring_init_fn(inst, build_name)`
* **Description:** Initializes hermit hot spring skin by calling OnHermitHotSpringSkinChanged callback only.
* **Parameters:**
  - `inst` -- Hermit hot spring entity instance
  - `build_name` -- Skin build name
* **Returns:** None
* **Error states:** None

### `hermithouse_init_fn(inst, build_name)`
* **Description:** Initializes hermit house skin and calls OnHermitHouseSkinChanged callback.
* **Parameters:**
  - `inst` -- Hermit house entity instance
  - `build_name` -- Skin build name
* **Returns:** None
* **Error states:** None

### `hermithouse_clear_fn(inst)`
* **Description:** Clears hermit house skin and calls OnHermitHouseSkinChanged with nil.
* **Parameters:**
  - `inst` -- Hermit house entity instance
* **Returns:** None
* **Error states:** None

### `hermit_chair_rocking_init_fn(inst, build_name)`
* **Description:** Initializes hermit rocking chair skin and overrides chair_parts symbol on back component.
* **Parameters:**
  - `inst` -- Hermit rocking chair entity instance
  - `build_name` -- Skin build name
* **Returns:** None
* **Error states:** None

### `hermit_chair_rocking_clear_fn(inst)`
* **Description:** Clears hermit rocking chair skin and clears chair_parts symbol override.
* **Parameters:**
  - `inst` -- Hermit rocking chair entity instance
* **Returns:** None
* **Error states:** None

### `hermitcrab_teashop_init_fn(inst, build_name)`
* **Description:** Initializes hermit crab teashop skin on inst and front component if present.
* **Parameters:**
  - `inst` -- Hermit crab teashop entity instance
  - `build_name` -- Skin build name
* **Returns:** None
* **Error states:** None

### `hermitcrab_teashop_clear_fn(inst)`
* **Description:** Clears hermit crab teashop skin on inst and front component if present.
* **Parameters:**
  - `inst` -- Hermit crab teashop entity instance
* **Returns:** None
* **Error states:** None

### `CreatePrefabSkin(name, info)`
* **Description:** Factory function that creates a Prefab skin object with all metadata properties from info table, handles torso tuck builds, alternate body/skirt builds, cuff sizes, and registers FX/sound mappings.
* **Parameters:**
  - `name` -- Prefab skin name
  - `info` -- Table containing skin metadata (type, assets, prefabs, skin_tags, etc.)
* **Returns:** Prefab skin object with is_skin=true and all info properties assigned
* **Error states:** None

## Events & listeners
**Listens to:**
- `equipped` -- Listened to in bushhat_init_fn for vfx_fx handling
- `unequipped` -- Listened to in bushhat_init_fn for vfx_fx cleanup
- `onremove` -- Listened to in bushhat_init_fn for vfx_fx cleanup
- `takefuel` -- Listened to in firepit_init_fn for skin FX spawning based on fuel value
- `lantern_on` -- Registered in lantern_init_fn to turn on lantern light FX
- `lantern_off` -- Registered in lantern_init_fn to turn off lantern light FX
- `enterlimbo` -- Registered in lantern_init_fn on FX entity to track position before limbo
- `onopen` -- icebox listens to trigger open FX when opened
- `onclose` -- icebox listens to kill frost FX when closed

**Pushes:**
None
