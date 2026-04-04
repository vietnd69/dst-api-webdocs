---
id: prefabskin
title: Prefabskin
description: This component defines initialization and cleanup functions for applying and removing skins on various prefabs including structures, items, weapons, armor, hats, and pets, managing animation overrides, visual effects, sound effects, component states, and event listeners, with a factory function to register skin prefabs.
tags: [skins, prefabs, visuals, animation, items]
sidebar_position: 10

last_updated: 2026-04-04
build_version: 718694
change_status: stable
category_type: root
source_hash: b66dacf4
system_scope: entity
---

# Prefabskin

> Based on game build **718694** | Last updated: 2026-04-04

The `prefabskin` module provides a framework for managing entity skins in Don't Starve Together. It defines static configuration tables for skin-related data including `BASE_TORSO_TUCK` (torso tucking options: "full", "none", "skirt"), `BASE_ALTERNATE_FOR_BODY`, `BASE_ALTERNATE_FOR_SKIRT`, `ONE_PIECE_SKIRT`, `BASE_LEGS_SIZE`, `BASE_FEET_SIZE`, `SKIN_FX_PREFAB`, and `SKIN_SOUND_FX`. These tables are accessed by other systems via `require("prefabskin")` to retrieve skin configuration constants and prefab references.

## Usage example

```lua
local SkinUtils = require("modules.skinutils")

-- Initialize a skin on an entity
local inst = SpawnPrefab("cane")
SkinUtils.cane_init_fn(inst, "cane_skin_001")

-- Remove the skin later
SkinUtils.cane_clear_fn(inst)

-- Register a custom skin prefab
local function my_custom_init_fn(inst, build_name)
    -- Custom initialization logic
end

local function my_custom_clear_fn(inst)
    -- Custom cleanup logic
end

SkinUtils.CreatePrefabSkin("my_custom_skin", {
    type = "base",
    build_name = "custom_skin_build",
    init_fn = my_custom_init_fn,
    clear_fn = my_custom_clear_fn
})
```

## Dependencies & tags

**External dependencies:**
- `class` -- Required for class system
- `prefabs` -- Required for prefab definitions
- `TheWorld` -- Checked ismastersim to guard server-only logic
- `dbui_no_package/debug_skins_data/hooks` -- Required for debug skin hooks

**Components used:**
- `placer` -- Checked for nil, accessed linked entities for skin overrides
- `inventoryitem` -- ChangeImageName called to update inventory icon
- `container` -- IsOpen checked to append _open to skin name
- `floater` -- IsFloating, SwitchToDefaultAnim, SwitchToFloatAnim called for floating items; do_bank_swap property read/written for bank swap animations
- `blinkstaff` -- SetFX, SetSoundFX, and ResetSoundFX called for staff visual and teleport effects
- `mightygym` -- Component reference retrieved
- `symbolswapdata` -- Used in cavein_boulder_init_fn to set swap data
- `saddler` -- Used in saddle_basic_init_fn to set swaps
- `bundlemaker` -- Used in bundlewrap_init_fn/clear_fn to set skin data
- `burnable` -- Used in firepit/campfire/coldfirepit init/clear to set FX offset or position FX children
- `inspectable` -- Used by record to override inspection name
- `locomotor` -- Used by cane to calculate trail position based on speed
- `rider` -- Used by cane to adjust trail offset if owner is riding
- `machine` -- Used by lantern to check if light is on
- `equippable` -- Used in molehat to set OnEquip callback

**Tags:**
- `nobundling` -- check
- `regaljoker` -- remove
- `open_top_hat` -- add/remove
- `burnt` -- check
- `hermithouse_winter_ornament` -- remove

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| None | | | No properties are defined. |

## Main functions

### `basic_init_fn(inst, build_name, def_build, filter_fn)`
* **Description:** Sets skin build, updates inventory image, and handles floater animation swaps.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
  - `def_build` -- Default build name
  - `filter_fn` -- Optional function to filter skin name
* **Returns:** `nil`
* **Error states:** Returns early if placer is nil and not mastersim

### `basic_clear_fn(inst, def_build)`
* **Description:** Resets build to default, clears inventory image, and handles floater animation swaps.
* **Parameters:**
  - `inst` -- Entity instance
  - `def_build` -- Default build name
* **Returns:** `nil`
* **Error states:** None

### `backpack_init_fn(inst, build_name, fns)`
* **Description:** Initializes backpack skin, runs custom initialize function, and triggers callback.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
  - `fns` -- Table of skin functions
* **Returns:** `nil`
* **Error states:** Returns early if not mastersim

### `backpack_clear_fn(inst)`
* **Description:** Clears backpack skin, runs custom uninitialize function, and triggers callback.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `spicepack_init_fn(inst, build_name)`
* **Description:** Initializes spicepack skin with swap_chefpack build.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `spicepack_clear_fn(inst)`
* **Description:** Clears spicepack skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `krampus_sack_init_fn(inst, build_name)`
* **Description:** Initializes krampus sack skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `krampus_sack_clear_fn(inst)`
* **Description:** Clears krampus sack skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `piggyback_init_fn(inst, build_name)`
* **Description:** Initializes piggyback skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `piggyback_clear_fn(inst)`
* **Description:** Clears piggyback skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `icepack_init_fn(inst, build_name)`
* **Description:** Initializes icepack skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `icepack_clear_fn(inst)`
* **Description:** Clears icepack skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `ruins_bat_init_fn(inst, build_name)`
* **Description:** Initializes ruins bat skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `ruins_bat_clear_fn(inst)`
* **Description:** Clears ruins bat skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `hambat_init_fn(inst, build_name)`
* **Description:** Initializes ham bat skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `hambat_clear_fn(inst)`
* **Description:** Clears ham bat skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `batbat_init_fn(inst, build_name)`
* **Description:** Initializes bat bat skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `batbat_clear_fn(inst)`
* **Description:** Clears bat bat skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `boomerang_init_fn(inst, build_name)`
* **Description:** Initializes boomerang skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `boomerang_clear_fn(inst)`
* **Description:** Clears boomerang skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `mighty_gym_init_fn(inst, build_name)`
* **Description:** Initializes mighty gym skin and updates level art.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `mighty_gym_clear_fn(inst)`
* **Description:** Clears mighty gym skin and updates level art.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `armor_bramble_init_fn(inst, build_name)`
* **Description:** Initializes bramble armor skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `armor_bramble_clear_fn(inst)`
* **Description:** Clears bramble armor skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `wood_table_round_init_fn(inst, build_name, facings)`
* **Description:** Initializes round wood table skin and facings.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
  - `facings` -- Number of facings
* **Returns:** `nil`
* **Error states:** None

### `wood_table_round_clear_fn(inst)`
* **Description:** Clears round wood table skin and resets facings.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `wood_table_square_init_fn(inst, build_name)`
* **Description:** Initializes square wood table skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `wood_table_square_clear_fn(inst)`
* **Description:** Clears square wood table skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `wood_stool_init_fn(inst, build_name, facings)`
* **Description:** Initializes wood stool skin and facings.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
  - `facings` -- Number of facings
* **Returns:** `nil`
* **Error states:** None

### `wood_stool_clear_fn(inst)`
* **Description:** Clears wood stool skin and resets facings.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `wood_chair_init_fn(inst, build_name)`
* **Description:** Initializes wood chair skin and overrides back symbol if mastersim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** Returns early if not mastersim

### `wood_chair_clear_fn(inst)`
* **Description:** Clears wood chair skin and clears back symbol override.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** Returns early if not mastersim

### `stone_table_round_init_fn(inst, build_name, facings)`
* **Description:** Initializes round stone table skin and facings.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
  - `facings` -- Number of facings
* **Returns:** `nil`
* **Error states:** None

### `stone_table_round_clear_fn(inst)`
* **Description:** Clears round stone table skin and resets facings.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `stone_table_square_init_fn(inst, build_name)`
* **Description:** Initializes square stone table skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `stone_table_square_clear_fn(inst)`
* **Description:** Clears square stone table skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `stone_stool_init_fn(inst, build_name, facings)`
* **Description:** Initializes stone stool skin and facings.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
  - `facings` -- Number of facings
* **Returns:** `nil`
* **Error states:** None

### `stone_stool_clear_fn(inst)`
* **Description:** Clears stone stool skin and sets four faced.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `stone_chair_init_fn(inst, build_name)`
* **Description:** Initializes stone chair skin and overrides back symbol if mastersim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** Returns early if not mastersim

### `stone_chair_clear_fn(inst)`
* **Description:** Clears stone chair skin and clears back symbol override.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** Returns early if not mastersim

### `decor_centerpiece_init_fn(inst, build_name)`
* **Description:** Initializes decor centerpiece skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `decor_centerpiece_clear_fn(inst)`
* **Description:** Clears decor centerpiece skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `decor_flowervase_init_fn(inst, build_name)`
* **Description:** Initializes decor flowervase skin and refreshes image.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** Returns early if not mastersim

### `decor_flowervase_clear_fn(inst)`
* **Description:** Clears decor flowervase skin and refreshes image.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** Returns early if not mastersim

### `decor_lamp_init_fn(inst, build_name)`
* **Description:** Initializes decor lamp skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `decor_lamp_clear_fn(inst)`
* **Description:** Clears decor lamp skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `phonograph_init_fn(inst, build_name)`
* **Description:** Initializes phonograph skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `phonograph_clear_fn(inst)`
* **Description:** Clears phonograph skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `decor_pictureframe_init_fn(inst, build_name)`
* **Description:** Initializes decor pictureframe skin and refreshes image.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** Returns early if not mastersim

### `decor_pictureframe_clear_fn(inst)`
* **Description:** Clears decor pictureframe skin and refreshes image.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** Returns early if not mastersim

### `decor_portraitframe_init_fn(inst, build_name)`
* **Description:** Initializes decor portraitframe skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `decor_portraitframe_clear_fn(inst)`
* **Description:** Clears decor portraitframe skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `magician_chest_init_fn(inst, build_name)`
* **Description:** Initializes magician chest skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `magician_chest_clear_fn(inst)`
* **Description:** Clears magician chest skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `critter_lunarmothling_clear_fn(inst)`
* **Description:** Clears lunarmothling critter build.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `critter_lunarmothling_builder_clear_fn(inst)`
* **Description:** Clears lunarmothling builder linked skinname.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `staff_tornado_init_fn(inst, build_name)`
* **Description:** Initializes tornado staff skin and sets linked skinname.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `staff_tornado_clear_fn(inst)`
* **Description:** Clears tornado staff skin and linked skinname.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `tornado_init_fn(inst, build_name)`
* **Description:** Initializes tornado skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `tornado_clear_fn(inst)`
* **Description:** Clears tornado skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `succulent_potted_init_fn(inst, build_name)`
* **Description:** Initializes potted succulent skin and clears succulent symbol.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `succulent_potted_clear_fn(inst)`
* **Description:** Clears potted succulent skin and setups plant.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `raincoat_init_fn(inst, build_name)`
* **Description:** Initializes raincoat skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `raincoat_clear_fn(inst)`
* **Description:** Clears raincoat skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `beef_bell_init_fn(inst, build_name)`
* **Description:** Initializes beef bell skin and fixes icon.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `beef_bell_clear_fn(inst)`
* **Description:** Clears beef bell skin and fixes icon.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `deserthat_init_fn(inst, build_name)`
* **Description:** Initializes desert hat skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `deserthat_clear_fn(inst)`
* **Description:** Clears desert hat skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `goggleshat_init_fn(inst, build_name)`
* **Description:** Initializes goggles hat skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `goggleshat_clear_fn(inst)`
* **Description:** Clears goggles hat skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `eyeturret_init_fn(inst, build_name)`
* **Description:** Initializes eyeturret skin, overrides symbols, and fixes base skins.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `eyeturret_clear_fn(inst)`
* **Description:** Clears eyeturret skin overrides and fixes base skins.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `eyeturret_item_init_fn(inst, build_name)`
* **Description:** Initializes eyeturret item skin and sets linked skinname.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `eyeturret_item_clear_fn(inst)`
* **Description:** Clears eyeturret item skin and linked skinname.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `moondial_init_fn(inst, build_name)`
* **Description:** Initializes moondial skin and overrides basin symbol.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `moondial_clear_fn(inst)`
* **Description:** Clears moondial skin basin symbol override.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `sewing_mannequin_init_fn(inst, build_name)`
* **Description:** Initializes sewing mannequin skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `sewing_mannequin_clear_fn(inst)`
* **Description:** Clears sewing mannequin skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `winona_battery_high_init_fn(inst, build_name)`
* **Description:** Initializes winona battery high skin, handles item/placer variants and symbol overrides.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `winona_battery_high_clear_fn(inst)`
* **Description:** Clears winona battery high skin symbol overrides.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `winona_battery_high_item_init_fn(inst, build_name)`
* **Description:** Initializes winona battery high item skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `winona_battery_high_item_clear_fn(inst)`
* **Description:** Clears winona battery high item skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `winona_battery_low_init_fn(inst, build_name)`
* **Description:** Initializes winona battery low skin, handles item/placer variants and symbol overrides.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `winona_battery_low_clear_fn(inst)`
* **Description:** Clears winona battery low skin symbol overrides.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `winona_battery_low_item_init_fn(inst, build_name)`
* **Description:** Initializes winona battery low item skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `winona_battery_low_item_clear_fn(inst)`
* **Description:** Clears winona battery low item skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `winona_catapult_init_fn(inst, build_name)`
* **Description:** Initializes winona catapult skin, handles item/placer variants and symbol overrides.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `winona_catapult_clear_fn(inst)`
* **Description:** Clears winona catapult skin symbol overrides.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `winona_catapult_item_init_fn(inst, build_name)`
* **Description:** Initializes winona catapult item skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `winona_catapult_item_clear_fn(inst)`
* **Description:** Clears winona catapult item skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `winona_spotlight_init_fn(inst, build_name)`
* **Description:** Initializes winona spotlight skin, handles item/placer variants and symbol overrides.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `winona_spotlight_clear_fn(inst)`
* **Description:** Clears winona spotlight skin symbol overrides.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `winona_spotlight_item_init_fn(inst, build_name)`
* **Description:** Initializes winona spotlight item skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `winona_spotlight_item_clear_fn(inst)`
* **Description:** Clears winona spotlight item skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `boat_grass_item_init_fn(inst, build_name)`
* **Description:** Initializes boat grass item skin, setting linked skinname and anim state.
* **Parameters:**
  - `inst` -- Entity instance to initialize
  - `build_name` -- Skin build name to apply
* **Returns:** `nil`
* **Error states:** None

### `boat_grass_item_clear_fn(inst)`
* **Description:** Clears boat grass item skin, resetting anim state and linked skinname.
* **Parameters:**
  - `inst` -- Entity instance to clear
* **Returns:** `nil`
* **Error states:** None

### `boat_grass_init_fn(inst, build_name)`
* **Description:** Initializes boat grass skin, checking for placer component and mastersim. Returns early if no placer and not mastersim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `boat_grass_clear_fn(inst)`
* **Description:** Clears boat grass skin build.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `walkingplank_grass_init_fn(inst, build_name)`
* **Description:** Initializes walking plank grass skin. Returns early if no placer and not mastersim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `walkingplank_grass_clear_fn(inst, build_name)`
* **Description:** Clears walking plank grass skin build.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name (unused)
* **Returns:** `nil`
* **Error states:** None

### `winch_init_fn(inst, build_name)`
* **Description:** Initializes winch skin, handling placer and mastersim checks. Returns early under certain conditions.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `winch_clear_fn(inst)`
* **Description:** Clears winch skin build.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `ocean_trawler_init_fn(inst, build_name)`
* **Description:** Initializes ocean trawler skin, overriding water shadow symbol. Returns early if no placer and not mastersim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `ocean_trawler_clear_fn(inst)`
* **Description:** Clears ocean trawler skin and overrides.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `ocean_trawler_kit_init_fn(inst, build_name)`
* **Description:** Initializes ocean trawler kit skin, updating inventory image.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `ocean_trawler_kit_clear_fn(inst)`
* **Description:** Clears ocean trawler kit skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `hammer_init_fn(inst, build_name)`
* **Description:** Initializes hammer skin, disabling bank swap for invisible skins.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `hammer_clear_fn(inst)`
* **Description:** Clears hammer skin, re-enabling bank swap.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `torch_init_fn(inst, build_name)`
* **Description:** Initializes torch skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `torch_clear_fn(inst)`
* **Description:** Clears torch skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `lighter_init_fn(inst, build_name)`
* **Description:** Initializes lighter skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `lighter_clear_fn(inst)`
* **Description:** Clears lighter skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `spear_init_fn(inst, build_name)`
* **Description:** Initializes spear skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `spear_clear_fn(inst)`
* **Description:** Clears spear skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `spear_wathgrithr_init_fn(inst, build_name)`
* **Description:** Initializes Wathgrithr spear skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `spear_wathgrithr_clear_fn(inst)`
* **Description:** Clears Wathgrithr spear skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `spear_wathgrithr_lightning_init_fn(inst, build_name)`
* **Description:** Initializes lightning spear skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `spear_wathgrithr_lightning_clear_fn(inst)`
* **Description:** Clears lightning spear skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `spear_wathgrithr_lightning_charged_init_fn(inst, build_name)`
* **Description:** Initializes charged lightning spear skin, setting FX owner. Returns early if not mastersim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `spear_wathgrithr_lightning_charged_clear_fn(inst)`
* **Description:** Clears charged lightning spear skin, resetting FX owner. Returns early if not mastersim.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `berrybush_init_fn(inst, build_name)`
* **Description:** Initializes berrybush skin, spawning VFX if applicable. Returns early if placer component exists.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `berrybush_clear_fn(inst)`
* **Description:** Clears berrybush skin, removing VFX instance.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `dug_berrybush_init_fn(inst, build_name)`
* **Description:** Initializes dug berrybush skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `dug_berrybush_clear_fn(inst)`
* **Description:** Clears dug berrybush skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `dug_berrybush_waxed_clear_fn(inst)`
* **Description:** Clears dug berrybush waxed skin, updating inventory image.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `reskin_tool_init_fn(inst, build_name)`
* **Description:** Initializes reskin tool skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `reskin_tool_clear_fn(inst)`
* **Description:** Clears reskin tool skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `whip_init_fn(inst, build_name)`
* **Description:** Initializes whip skin, adding skin sounds on server. Returns early if not mastersim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `whip_clear_fn(inst)`
* **Description:** Clears whip skin, removing skin sounds.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `trident_init_fn(inst, build_name)`
* **Description:** Initializes trident skin, adding skin sounds on server. Returns early if not mastersim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None### `trident_clear_fn(inst)`
* **Description:** Clears trident skin, removing skin sounds.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `multitool_axe_pickaxe_init_fn(inst, build_name)`
* **Description:** Initializes multitool axe pickaxe skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `multitool_axe_pickaxe_clear_fn(inst)`
* **Description:** Clears multitool axe pickaxe skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `axe_init_fn(inst, build_name)`
* **Description:** Initializes axe skin, disabling bank swap for invisible skins.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `axe_clear_fn(inst)`
* **Description:** Clears axe skin, re-enabling bank swap.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `farm_hoe_init_fn(inst, build_name)`
* **Description:** Initializes farm hoe skin, disabling bank swap for invisible skins.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `farm_hoe_clear_fn(inst)`
* **Description:** Clears farm hoe skin, re-enabling bank swap.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `golden_farm_hoe_init_fn(inst, build_name)`
* **Description:** Initializes golden farm hoe skin. Disables bank swap for invisible skins (when build_name contains '_invisible').
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `golden_farm_hoe_clear_fn(inst)`
* **Description:** Clears golden farm hoe skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `razor_init_fn(inst, build_name)`
* **Description:** Initializes razor skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `razor_clear_fn(inst)`
* **Description:** Clears razor skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `goldenaxe_init_fn(inst, build_name)`
* **Description:** Initializes golden axe skin. Disables bank swap for invisible skins.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `goldenaxe_clear_fn(inst)`
* **Description:** Clears golden axe skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `pickaxe_init_fn(inst, build_name)`
* **Description:** Initializes pickaxe skin. Disables bank swap for invisible skins.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `pickaxe_clear_fn(inst)`
* **Description:** Clears pickaxe skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `pitchfork_init_fn(inst, build_name)`
* **Description:** Initializes pitchfork skin. Disables bank swap for invisible skins (build names containing `_invisible`).
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `pitchfork_clear_fn(inst)`
* **Description:** Clears pitchfork skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `goldenpitchfork_init_fn(inst, build_name)`
* **Description:** Initializes golden pitchfork skin. Disables floater bank swap for invisible skins (build names containing '_invisible').
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `goldenpitchfork_clear_fn(inst)`
* **Description:** Clears golden pitchfork skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `goldenpickaxe_init_fn(inst, build_name)`
* **Description:** Initializes golden pickaxe skin. Disables bank swap for invisible skins (build names containing '_invisible').
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `goldenpickaxe_clear_fn(inst)`
* **Description:** Clears golden pickaxe skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `shovel_init_fn(inst, build_name)`
* **Description:** Initializes shovel skin. Disables bank swap for invisible skins.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `shovel_clear_fn(inst)`
* **Description:** Clears shovel skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `goldenshovel_init_fn(inst, build_name)`
* **Description:** Initializes golden shovel skin. Disables bank swap for invisible skins (build names containing `_invisible`).
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `goldenshovel_clear_fn(inst)`
* **Description:** Clears golden shovel skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `umbrella_init_fn(inst, build_name)`
* **Description:** Initializes umbrella skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `umbrella_clear_fn(inst)`
* **Description:** Clears umbrella skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `oceanfishingrod_init_fn(inst, build_name)`
* **Description:** Initializes ocean fishing rod skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `oceanfishingrod_clear_fn(inst)`
* **Description:** Clears ocean fishing rod skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `fishingrod_init_fn(inst, build_name)`
* **Description:** Initializes fishing rod skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `fishingrod_clear_fn(inst)`
* **Description:** Clears fishing rod skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `beargerfur_sack_init_fn(inst, build_name)`
* **Description:** Initializes bearger fur sack skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `beargerfur_sack_clear_fn(inst)`
* **Description:** Clears bearger fur sack skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `flotationcushion_init_fn(inst, build_name)`
* **Description:** Initializes flotation cushion skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `flotationcushion_clear_fn(inst, build_name)`
* **Description:** Clears flotation cushion skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `bookstation_init_fn(inst, build_name)`
* **Description:** Initializes book station skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `bookstation_clear_fn(inst, build_name)`
* **Description:** Clears book station skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Build name string
* **Returns:** `nil`
* **Error states:** None### `sisturn_init_fn(inst, build_name)`
* **Description:** Initializes sisturn skin, updating flower decor. Returns early if not mastersim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `sisturn_clear_fn(inst)`
* **Description:** Clears sisturn skin, updating flower decor.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `lucy_init_fn(inst, build_name)`
* **Description:** Initializes Lucy axe skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `lucy_clear_fn(inst)`
* **Description:** Clears Lucy axe skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `townportal_init_fn(inst, build_name)`
* **Description:** Initializes town portal skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `townportal_clear_fn(inst)`
* **Description:** Clears town portal skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `nightlight_init_fn(inst, build_name)`
* **Description:** Initializes nightlight skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `nightlight_clear_fn(inst)`
* **Description:** Clears nightlight skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `wx78_scanner_init_fn(inst, build_name)`
* **Description:** Initializes WX-78 scanner skin, updating inventory image.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `wx78_scanner_clear_fn(inst)`
* **Description:** Clears WX-78 scanner skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `portableblender_init_fn(inst, build_name)`
* **Description:** Initializes portable blender skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `portableblender_clear_fn(inst)`
* **Description:** Clears portable blender skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `portablecookpot_init_fn(inst, build_name)`
* **Description:** Initializes portable cookpot skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `portablecookpot_clear_fn(inst)`
* **Description:** Clears portable cookpot skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `portablespicer_init_fn(inst, build_name)`
* **Description:** Initializes portable spicer skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `portablespicer_clear_fn(inst)`
* **Description:** Clears portable spicer skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `slingshot_init_fn(inst, build_name)`
* **Description:** Initializes slingshot skin, notifying skin change. Returns early if not mastersim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `slingshot_clear_fn(inst)`
* **Description:** Clears slingshot skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `wobysmall_init_fn(inst, build_name)`
* **Description:** Initializes small Woby skin. Returns early if not mastersim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `wobysmall_clear_fn(inst)`
* **Description:** Clears small Woby skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `wobybig_init_fn(inst, build_name)`
* **Description:** Initializes big Woby skin. Returns early if not mastersim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `wobybig_clear_fn(inst)`
* **Description:** Clears big Woby skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `trunkvest_summer_init_fn(inst, build_name)`
* **Description:** Initializes summer trunk vest skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `trunkvest_summer_clear_fn(inst)`
* **Description:** Clears summer trunk vest skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `trunkvest_winter_init_fn(inst, build_name)`
* **Description:** Initializes winter trunk vest skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `trunkvest_winter_clear_fn(inst)`
* **Description:** Clears winter trunk vest skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `book_brimstone_init_fn(inst, build_name)`
* **Description:** Initializes book of brimstone skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `book_brimstone_clear_fn(inst)`
* **Description:** Clears book of brimstone skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `book_temperature_init_fn(inst, build_name)`
* **Description:** Initializes book of temperature skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `book_temperature_clear_fn(inst)`
* **Description:** Clears book of temperature skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `book_research_station_init_fn(inst, build_name)`
* **Description:** Initializes book of research station skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `book_research_station_clear_fn(inst)`
* **Description:** Clears book of research station skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `book_silviculture_init_fn(inst, build_name)`
* **Description:** Initializes book of silviculture skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `book_silviculture_clear_fn(inst)`
* **Description:** Clears book of silviculture skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `book_sleep_init_fn(inst, build_name)`
* **Description:** Initializes book of sleep skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `book_sleep_clear_fn(inst)`
* **Description:** Clears book of sleep skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `book_web_init_fn(inst, build_name)`
* **Description:** Initializes book of web skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `book_web_clear_fn(inst)`
* **Description:** Clears book of web skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `ruinsrelic_chair_init_fn(inst, build_name)`
* **Description:** Initializes ruins relic chair skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `ruinsrelic_chair_clear_fn(inst)`
* **Description:** Clears ruins relic chair skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `bedroll_furry_init_fn(inst, build_name)`
* **Description:** Initializes furry bedroll skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `bedroll_furry_clear_fn(inst)`
* **Description:** Clears furry bedroll skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `featherfan_init_fn(inst, build_name)`
* **Description:** Initializes feather fan skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `featherfan_clear_fn(inst)`
* **Description:** Clears feather fan skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `armordragonfly_init_fn(inst, build_name)`
* **Description:** Initializes dragonfly armor skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `armordragonfly_clear_fn(inst)`
* **Description:** Clears dragonfly armor skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `armorgrass_init_fn(inst, build_name)`
* **Description:** Initializes grass armor skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `armorgrass_clear_fn(inst)`
* **Description:** Clears grass armor skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `armormarble_init_fn(inst, build_name)`
* **Description:** Initializes marble armor skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `armormarble_clear_fn(inst)`
* **Description:** Clears marble armor skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `armorwood_init_fn(inst, build_name)`
* **Description:** Initializes wood armor skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `armorwood_clear_fn(inst)`
* **Description:** Clears wood armor skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `armorruins_init_fn(inst, build_name)`
* **Description:** Initializes ruins armor skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `armorruins_clear_fn(inst)`
* **Description:** Clears ruins armor skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `armor_sanity_init_fn(inst, build_name)`
* **Description:** Initializes sanity armor skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `armor_sanity_clear_fn(inst)`
* **Description:** Clears sanity armor skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `armorskeleton_init_fn(inst, build_name)`
* **Description:** Initializes skeleton armor skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `armorskeleton_clear_fn(inst)`
* **Description:** Clears skeleton armor skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `armordreadstone_init_fn(inst, build_name)`
* **Description:** Initializes dreadstone armor skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `armordreadstone_clear_fn(inst)`
* **Description:** Clears dreadstone armor skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `beargervest_init_fn(inst, build_name)`
* **Description:** Initializes bearger vest skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `beargervest_clear_fn(inst)`
* **Description:** Clears bearger vest skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `reflectivevest_init_fn(inst, build_name)`
* **Description:** Initializes reflective vest skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `reflectivevest_clear_fn(inst)`
* **Description:** Clears reflective vest skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `monkey_mediumhat_init_fn(inst, build_name)`
* **Description:** Initializes monkey medium hat skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `monkey_mediumhat_clear_fn(inst)`
* **Description:** Clears monkey medium hat skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `monkey_smallhat_init_fn(inst, build_name)`
* **Description:** Initializes monkey small hat skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `monkey_smallhat_clear_fn(inst)`
* **Description:** Clears monkey small hat skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `hivehat_init_fn(inst, build_name)`
* **Description:** Initializes hive hat skin, adding regaljoker tag conditionally.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `hivehat_clear_fn(inst)`
* **Description:** Clears hive hat skin, removing regaljoker tag.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `tophat_init_fn(inst, build_name)`
* **Description:** Initializes top hat skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `tophat_clear_fn(inst)`
* **Description:** Clears top hat skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `flowerhat_init_fn(inst, build_name)`
* **Description:** Initializes flower hat skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `flowerhat_clear_fn(inst)`
* **Description:** Clears flower hat skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `strawhat_init_fn(inst, build_name)`
* **Description:** Initializes straw hat skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `strawhat_clear_fn(inst)`
* **Description:** Clears straw hat skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `walrushat_init_fn(inst, build_name)`
* **Description:** Initializes walrus hat skin, adds skin sounds on server. Returns early if not master sim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `walrushat_clear_fn(inst)`
* **Description:** Clears walrus hat skin, removes skin sounds.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `winterhat_init_fn(inst, build_name)`
* **Description:** Initializes winter hat skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `winterhat_clear_fn(inst)`
* **Description:** Clears winter hat skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `catcoonhat_init_fn(inst, build_name)`
* **Description:** Initializes catcoon hat skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `catcoonhat_clear_fn(inst)`
* **Description:** Clears catcoon hat skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `rainhat_init_fn(inst, build_name)`
* **Description:** Initializes rain hat skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `rainhat_clear_fn(inst)`
* **Description:** Clears rain hat skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `minerhat_init_fn(inst, build_name)`
* **Description:** Initializes miner hat skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `minerhat_clear_fn(inst)`
* **Description:** Clears miner hat skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `footballhat_init_fn(inst, build_name, opentop)`
* **Description:** Initializes football hat skin, adds open_top_hat tag if specified, adds skin sounds on server. Returns early if not master sim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
  - `opentop` -- Boolean flag for open top variant
* **Returns:** `nil`
* **Error states:** None

### `footballhat_clear_fn(inst)`
* **Description:** Clears football hat skin, removes open_top_hat tag, removes skin sounds.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `featherhat_init_fn(inst, build_name)`
* **Description:** Initializes feather hat skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `featherhat_clear_fn(inst)`
* **Description:** Clears feather hat skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `beehat_init_fn(inst, build_name)`
* **Description:** Initializes bee hat skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `beehat_clear_fn(inst)`
* **Description:** Clears bee hat skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `watermelonhat_init_fn(inst, build_name)`
* **Description:** Initializes watermelon hat skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `watermelonhat_clear_fn(inst)`
* **Description:** Clears watermelon hat skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `beefalohat_init_fn(inst, build_name)`
* **Description:** Initializes beefalo hat skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `beefalohat_clear_fn(inst)`
* **Description:** Clears beefalo hat skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `eyebrellahat_init_fn(inst, build_name)`
* **Description:** Initializes eyebrella hat skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `eyebrellahat_clear_fn(inst)`
* **Description:** Clears eyebrella hat skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `earmuffshat_init_fn(inst, build_name)`
* **Description:** Initializes earmuffs hat skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `earmuffshat_clear_fn(inst)`
* **Description:** Clears earmuffs hat skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `ruinshat_init_fn(inst, build_name)`
* **Description:** Initializes ruins hat skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `ruinshat_clear_fn(inst)`
* **Description:** Clears ruins hat skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `walterhat_init_fn(inst, build_name)`
* **Description:** Initializes walter hat skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `walterhat_clear_fn(inst)`
* **Description:** Clears walter hat skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `alterguardianhat_init_fn(inst, build_name)`
* **Description:** Initializes alter guardian hat skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `alterguardianhat_clear_fn(inst)`
* **Description:** Clears alter guardian hat skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `skeletonhat_init_fn(inst, build_name)`
* **Description:** Initializes skeleton hat skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `skeletonhat_clear_fn(inst)`
* **Description:** Clears skeleton hat skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `dreadstonehat_init_fn(inst, build_name)`
* **Description:** Initializes dreadstone hat skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `dreadstonehat_clear_fn(inst)`
* **Description:** Clears dreadstone hat skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `researchlab3_init_fn(inst, build_name)`
* **Description:** Initializes researchlab3 skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `researchlab3_clear_fn(inst)`
* **Description:** Clears researchlab3 skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `mushroom_light_init_fn(inst, build_name)`
* **Description:** Initializes mushroom light skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `mushroom_light_clear_fn(inst)`
* **Description:** Clears mushroom light skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `mushroom_light2_init_fn(inst, build_name)`
* **Description:** Initializes mushroom light2 skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `mushroom_light2_clear_fn(inst)`
* **Description:** Clears mushroom light2 skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `tent_init_fn(inst, build_name)`
* **Description:** Initializes tent skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `tent_clear_fn(inst)`
* **Description:** Clears tent skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `critterlab_init_fn(inst, build_name)`
* **Description:** Initializes critterlab skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `critterlab_clear_fn(inst)`
* **Description:** Clears critterlab skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `rainometer_init_fn(inst, build_name)`
* **Description:** Initializes rainometer skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `rainometer_clear_fn(inst)`
* **Description:** Clears rainometer skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `winterometer_init_fn(inst, build_name)`
* **Description:** Initializes winterometer skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `winterometer_clear_fn(inst)`
* **Description:** Clears winterometer skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `tacklestation_init_fn(inst, build_name)`
* **Description:** Initializes tacklestation skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `tacklestation_clear_fn(inst)`
* **Description:** Clears tacklestation skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `lightning_rod_init_fn(inst, build_name)`
* **Description:** Initializes lightning rod skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `lightning_rod_clear_fn(inst)`
* **Description:** Clears lightning rod skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `arrowsign_post_init_fn(inst, build_name)`
* **Description:** Initializes arrow sign post skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `arrowsign_post_clear_fn(inst)`
* **Description:** Clears arrow sign post skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `treasurechest_init_fn(inst, build_name)`
* **Description:** Initializes treasure chest skin, handles upgrades and placer checks. Returns early if placer component exists or not master sim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `treasurechest_clear_fn(inst)`
* **Description:** Clears treasure chest skin, handles upgrades.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `dragonflychest_init_fn(inst, build_name)`
* **Description:** Initializes dragonfly chest skin, handles upgrades and placer checks. Returns early if placer component exists or not master sim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `dragonflychest_clear_fn(inst)`
* **Description:** Clears dragonfly chest skin, handles upgrades.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `wardrobe_init_fn(inst, build_name)`
* **Description:** Initializes wardrobe skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `wardrobe_clear_fn(inst)`
* **Description:** Clears wardrobe skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `fish_box_init_fn(inst, build_name)`
* **Description:** Initializes fish box skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `fish_box_clear_fn(inst)`
* **Description:** Clears fish box skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `sculptingtable_init_fn(inst, build_name)`
* **Description:** Initializes sculpting table skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `sculptingtable_clear_fn(inst)`
* **Description:** Clears sculpting table skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `endtable_init_fn(inst, build_name)`
* **Description:** Initializes endtable (stagehand) skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `endtable_clear_fn(inst)`
* **Description:** Clears endtable (stagehand) skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `dragonflyfurnace_init_fn(inst, build_name)`
* **Description:** Initializes dragonfly furnace skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `dragonflyfurnace_clear_fn(inst)`
* **Description:** Clears dragonfly furnace skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `birdcage_init_fn(inst, build_name)`
* **Description:** Initializes birdcage skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `birdcage_clear_fn(inst)`
* **Description:** Clears birdcage skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `meatrack_init_fn(inst, build_name)`
* **Description:** Initializes meatrack skin, triggers skin change callback. Returns early if not master sim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `meatrack_clear_fn(inst)`
* **Description:** Clears meatrack skin, triggers skin change callback.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `meatrack_hermit_init_fn(inst, build_name)`
* **Description:** Initializes hermit meatrack skin, triggers skin change callback. Returns early if not master sim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `meatrack_hermit_clear_fn(inst)`
* **Description:** Clears hermit meatrack skin, triggers skin change callback.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `meatrack_hermit_multi_init_fn(inst, build_name)`
* **Description:** Initializes hermit multi meatrack skin, triggers skin change callback. Returns early if not master sim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None### `meatrack_hermit_multi_clear_fn(inst)`
* **Description:** Clears hermit multi meatrack skin, triggers skin change callback.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `beebox_hermit_init_fn(inst, build_name)`
* **Description:** Initializes hermit beebox skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `beebox_hermit_clear_fn(inst)`
* **Description:** Clears hermit beebox skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `beebox_init_fn(inst, build_name)`
* **Description:** Initializes beebox skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `beebox_clear_fn(inst)`
* **Description:** Clears beebox skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `beemine_init_fn(inst, build_name)`
* **Description:** Initializes beemine skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `beemine_clear_fn(inst)`
* **Description:** Clears beemine skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `trap_teeth_init_fn(inst, build_name)`
* **Description:** Initializes teeth trap skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `trap_teeth_clear_fn(inst)`
* **Description:** Clears teeth trap skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `trap_init_fn(inst, build_name)`
* **Description:** Initializes trap skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `trap_clear_fn(inst)`
* **Description:** Clears trap skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `birdtrap_init_fn(inst, build_name)`
* **Description:** Initializes birdtrap skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `birdtrap_clear_fn(inst)`
* **Description:** Clears birdtrap skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `grass_umbrella_init_fn(inst, build_name)`
* **Description:** Initializes grass umbrella (parasol) skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `grass_umbrella_clear_fn(inst)`
* **Description:** Clears grass umbrella (parasol) skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `saltbox_init_fn(inst, build_name)`
* **Description:** Initializes saltbox skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `saltbox_clear_fn(inst)`
* **Description:** Clears saltbox skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `oar_init_fn(inst, build_name)`
* **Description:** Initializes oar skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `oar_clear_fn(inst)`
* **Description:** Clears oar skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `oar_driftwood_init_fn(inst, build_name)`
* **Description:** Initializes driftwood oar skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `oar_driftwood_clear_fn(inst)`
* **Description:** Clears driftwood oar skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `wateringcan_init_fn(inst, build_name)`
* **Description:** Initializes wateringcan skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `wateringcan_clear_fn(inst)`
* **Description:** Clears wateringcan skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `seedpouch_init_fn(inst, build_name)`
* **Description:** Initializes seedpouch skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `seedpouch_clear_fn(inst)`
* **Description:** Clears seedpouch skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `seafaring_prototyper_init_fn(inst, build_name)`
* **Description:** Initializes seafaring prototyper skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `seafaring_prototyper_clear_fn(inst)`
* **Description:** Clears seafaring prototyper skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `tacklecontainer_init_fn(inst, build_name)`
* **Description:** Initializes tacklecontainer skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `tacklecontainer_clear_fn(inst)`
* **Description:** Clears tacklecontainer skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `supertacklecontainer_init_fn(inst, build_name)`
* **Description:** Initializes supertacklecontainer skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `supertacklecontainer_clear_fn(inst)`
* **Description:** Clears supertacklecontainer skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `mermhouse_crafted_init_fn(inst, build_name)`
* **Description:** Initializes crafted mermhouse skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `mermhouse_crafted_clear_fn(inst)`
* **Description:** Clears crafted mermhouse skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `mermwatchtower_init_fn(inst, build_name)`
* **Description:** Initializes merm watchtower skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `mermwatchtower_clear_fn(inst)`
* **Description:** Clears merm watchtower skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `mermhat_init_fn(inst, build_name)`
* **Description:** Initializes merm hat skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `mermhat_clear_fn(inst)`
* **Description:** Clears merm hat skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `resurrectionstone_init_fn(inst, build_name)`
* **Description:** Initializes resurrection stone skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `resurrectionstone_clear_fn(inst)`
* **Description:** Clears resurrection stone skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `sanityrock_init_fn(inst, build_name)`
* **Description:** Initializes sanity rock skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `sanityrock_clear_fn(inst)`
* **Description:** Clears sanity rock skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `insanityrock_init_fn(inst, build_name)`
* **Description:** Initializes insanity rock skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `insanityrock_clear_fn(inst)`
* **Description:** Clears insanity rock skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `lunarplanthat_init_fn(inst, build_name)`
* **Description:** Initializes lunarplant hat skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `lunarplanthat_clear_fn(inst)`
* **Description:** Clears lunarplant hat skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `armor_lunarplant_init_fn(inst, build_name)`
* **Description:** Initializes lunarplant armor skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `armor_lunarplant_clear_fn(inst)`
* **Description:** Clears lunarplant armor skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `armor_lunarplant_husk_init_fn(inst, build_name)`
* **Description:** Initializes lunarplant husk armor skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `armor_lunarplant_husk_clear_fn(inst)`
* **Description:** Clears lunarplant husk armor skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `wagdrone_rolling_init_fn(inst, build_name)`
* **Description:** Initializes wagdrone rolling skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `wagdrone_rolling_clear_fn(inst)`
* **Description:** Clears wagdrone rolling skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `rabbithouse_init_fn(inst, build_name)`
* **Description:** Initializes rabbit house skin, spawns glow FX if not burnt.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `rabbithouse_clear_fn(inst)`
* **Description:** Clears rabbit house skin, removes glow FX.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `cavein_boulder_init_fn(inst, build_name)`
* **Description:** Initializes cavein boulder skin, sets symbol swap data.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `cavein_boulder_clear_fn(inst)`
* **Description:** Clears cavein boulder skin, resets variation.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `stagehand_init_fn(inst, build_name)`
* **Description:** Initializes stagehand skin, overrides animation symbols.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `stagehand_clear_fn(inst)`
* **Description:** Clears stagehand skin, clears animation symbol overrides.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `wormhole_init_fn(inst, build_name)`
* **Description:** Initializes wormhole skin, sets minimap icon.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `wormhole_clear_fn(inst)`
* **Description:** Clears wormhole skin, resets minimap icon.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `cave_entrance_init_fn(inst, build_name)`
* **Description:** Initializes cave entrance skin, sets linked skinname.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `cave_entrance_clear_fn(inst)`
* **Description:** Clears cave entrance skin, clears linked skinname.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `cave_entrance_open_init_fn(inst, build_name)`
* **Description:** Initializes open cave entrance skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `cave_entrance_open_clear_fn(inst)`
* **Description:** Clears open cave entrance skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `cave_exit_init_fn(inst, build_name)`
* **Description:** Initializes cave exit skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `cave_exit_clear_fn(inst)`
* **Description:** Clears cave exit skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `gravestone_init_fn(inst, build_name)`
* **Description:** Initializes gravestone skin, plays animation based on build name number. Returns early if not master sim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `gravestone_clear_fn(inst)`
* **Description:** Clears gravestone skin, plays animation based on random choice.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `dug_gravestone_init_fn(inst, build_name)`
* **Description:** Initializes dug gravestone skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `dug_gravestone_clear_fn(inst)`
* **Description:** Clears dug gravestone skin, changes inventory item image name.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `pottedfern_init_fn(inst, build_name)`
* **Description:** Initializes potted fern skin, sets eight faced transform.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `pottedfern_clear_fn(inst)`
* **Description:** Clears potted fern skin, resets transform and animation.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `siestahut_init_fn(inst, build_name)`
* **Description:** Initializes siesta hut skin, spawns VFX if not placer.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `siestahut_clear_fn(inst)`
* **Description:** Clears siesta hut skin, removes VFX.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `bushhat_init_fn(inst, build_name)`
* **Description:** Initializes bushhat skin, listens for equip/unequip/remove events. Returns early if not master sim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `bushhat_clear_fn(inst)`
* **Description:** Clears bushhat skin, removes event listeners.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `lureplantbulb_init_fn(inst, build_name)`
* **Description:** Initializes lureplant bulb skin, sets linked skinname and image.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `lureplantbulb_clear_fn(inst)`
* **Description:** Clears lureplant bulb skin, resets build and image.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `lureplant_init_fn(inst, build_name)`
* **Description:** Initializes lureplant skin, handles placer and skin data. Returns early if placer exists or not master sim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `lureplant_clear_fn(inst)`
* **Description:** Clears lureplant skin, resets build and skin. Returns early if not master sim.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `saddle_basic_init_fn(inst, build_name)`
* **Description:** Initializes basic saddle skin, sets saddler swaps.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the build/skin
* **Returns:** `nil`
* **Error states:** None

### `saddle_basic_clear_fn(inst)`
* **Description:** Clears basic saddle skin, resets saddler swaps.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `wathgrithrhat_init_fn(inst, build_name, opentop)`
* **Description:** Initializes Wigfrid helmet skin, adds open_top_hat tag if applicable, and adds skin sounds on server. Returns early if not mastersim.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
  - `opentop` -- Boolean flag indicating if the hat has an open top
* **Returns:** `nil`
* **Error states:** None

### `wathgrithrhat_clear_fn(inst)`
* **Description:** Clears Wigfrid helmet skin, removes open_top_hat tag, and removes skin sounds.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `wathgrithr_improvedhat_init_fn(inst, build_name, opentop)`
* **Description:** Initializes improved Wigfrid helmet skin, adds open_top_hat tag if applicable, and adds skin sounds on server. Returns early if not mastersim.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
  - `opentop` -- Boolean flag indicating if the hat has an open top
* **Returns:** `nil`
* **Error states:** None

### `wathgrithr_improvedhat_clear_fn(inst)`
* **Description:** Clears improved Wigfrid helmet skin, removes open_top_hat tag, and removes skin sounds.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `pighouse_init_fn(inst, build_name)`
* **Description:** Initializes Pighouse skin, updates window anim states if present.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `pighouse_clear_fn(inst)`
* **Description:** Clears Pighouse skin, resets window anim states to default build.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `researchlab_init_fn(inst, build_name)`
* **Description:** Initializes Science Machine skin, overrides various symbols like bolts and FX.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `researchlab_clear_fn(inst)`
* **Description:** Clears Science Machine skin, clears overridden symbols.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `chester_eyebone_init_fn(inst, build_name)`
* **Description:** Initializes Chester eyebone skin, refreshes eye, sets build and linked skinname on server. Returns early if not mastersim.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `chester_eyebone_clear_fn(inst)`
* **Description:** Clears Chester eyebone skin, refreshes eye, sets build and clears linked skinname.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `chester_init_fn(inst, build_name)`
* **Description:** Initializes Chester skin, sets build on server. Returns early if not mastersim.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `chester_clear_fn(inst)`
* **Description:** Clears Chester skin, sets build.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `hutch_fishbowl_init_fn(inst, build_name)`
* **Description:** Initializes Hutch fishbowl skin, refreshes icon and sets linked skinname on server. Returns early if not mastersim.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `hutch_fishbowl_clear_fn(inst)`
* **Description:** Clears Hutch fishbowl skin, refreshes icon and clears linked skinname.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `hutch_init_fn(inst, build_name)`
* **Description:** Initializes Hutch skin, sets build on server. Returns early if not mastersim.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `hutch_clear_fn(inst)`
* **Description:** Clears Hutch skin, sets build.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `glommerflower_init_fn(inst, build_name)`
* **Description:** Initializes Glommer flower skin, refreshes flower icon on server. Returns early if not mastersim.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
* **Returns:** `nil`
* **Error states:** None### `glommerflower_clear_fn(inst)`
* **Description:** Clears Glommer flower skin, refreshes flower icon.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `glommer_init_fn(inst, build_name)`
* **Description:** Initializes Glommer skin using basic init function.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `glommer_clear_fn(inst)`
* **Description:** Clears Glommer skin using basic clear function.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `bundlewrap_init_fn(inst, build_name)`
* **Description:** Initializes Bundle Wrap skin, sets skin data on bundlemaker component and adds sounds on server.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
* **Returns:** `nil`
* **Error states:** Returns early if not mastersim

### `bundlewrap_clear_fn(inst)`
* **Description:** Clears Bundle Wrap skin, resets skin data on bundlemaker and removes sounds.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `bundle_init_fn(inst, build_name)`
* **Description:** Initializes Bundle skin, updates inventory image and adds sounds.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `bundle_clear_fn(inst)`
* **Description:** Clears Bundle skin, updates inventory image and removes sounds.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `abigail_flower_init_fn(inst, build_name)`
* **Description:** Initializes Abigail flower skin, sets skin ID, anim state, and inventory image name on server.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
* **Returns:** `nil`
* **Error states:** Returns early if not mastersim

### `abigail_flower_clear_fn(inst)`
* **Description:** Clears Abigail flower skin, resets anim state and inventory image name.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `abigail_init_fn(inst, build_name)`
* **Description:** Initializes Abigail skin, overrides ghost hat symbol on server.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
* **Returns:** `nil`
* **Error states:** Returns early if not mastersim

### `abigail_clear_fn(inst)`
* **Description:** Clears Abigail skin, clears ghost hat symbol override.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `bugnet_init_fn(inst, build_name)`
* **Description:** Initializes Bug Net skin and adds sounds on server.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
* **Returns:** `nil`
* **Error states:** Returns early if not mastersim

### `bugnet_clear_fn(inst)`
* **Description:** Clears Bug Net skin and removes sounds.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `cookpot_init_fn(inst, build_name)`
* **Description:** Initializes Crockpot skin, sets anim state skin if placer component exists or on server.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
* **Returns:** `nil`
* **Error states:** Returns early if no placer and not mastersim

### `cookpot_clear_fn(inst, build_name)`
* **Description:** Clears Crockpot skin, resets anim state build.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
  - `build_name` -- The name of the skin build (unused in body)
* **Returns:** `nil`
* **Error states:** None

### `firesuppressor_init_fn(inst, build_name)`
* **Description:** Initializes Firesuppressor skin, updates linked placer skins or main anim state and meter symbol.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
* **Returns:** `nil`
* **Error states:** Returns early if no placer and not mastersim

### `firesuppressor_clear_fn(inst)`
* **Description:** Clears Firesuppressor skin, resets anim state build and meter symbol.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `firepit_init_fn(inst, build_name, fxoffset)`
* **Description:** Initializes Firepit skin, sets FX offset, listens for takefuel event for skin FX on server.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
  - `fxoffset` -- Vector3 offset for fire effects
* **Returns:** `nil`
* **Error states:** Returns early if no placer and not mastersim

### `firepit_clear_fn(inst)`
* **Description:** Clears Firepit skin, resets FX offset, removes takefuel listener, restarts firepit.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `campfire_init_fn(inst, build_name, fxoffset)`
* **Description:** Initializes Campfire skin, positions FX children on server or placer.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
  - `fxoffset` -- Vector3 offset for fire effects
* **Returns:** `nil`
* **Error states:** Returns early if no placer and not mastersim

### `campfire_clear_fn(inst)`
* **Description:** Clears Campfire skin, resets FX children position.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `coldfirepit_init_fn(inst, build_name, fxoffset)`
* **Description:** Initializes Cold Firepit skin, sets FX offset and restarts firepit on server or placer.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
  - `fxoffset` -- Vector3 offset for fire effects
* **Returns:** `nil`
* **Error states:** Returns early if no placer and not mastersim

### `coldfirepit_clear_fn(inst)`
* **Description:** Clears Cold Firepit skin, resets FX offset and restarts firepit.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `critter_builder_init_fn(inst, build_name)`
* **Description:** Initializes Critter Builder skin, sets linked skinname.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `pet_init_fn(inst, build_name, default_build)`
* **Description:** Initializes Pet skin, sets anim state skin on server.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
  - `default_build` -- The default build name
* **Returns:** `nil`
* **Error states:** Returns early if not mastersim

### `perdling_init_fn(inst, build_name, default_build, hungry_sound)`
* **Description:** Initializes Perdling skin, sets anim state skin and hungry sound on server.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
  - `default_build` -- The default build name
  - `hungry_sound` -- Sound to play when hungry
* **Returns:** `nil`
* **Error states:** Returns early if not mastersim

### `glomling_init_fn(inst, build_name, default_build)`
* **Description:** Initializes Glomling skin, sets anim state skin and adds sounds on server.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
  - `default_build` -- The default build name
* **Returns:** `nil`
* **Error states:** Returns early if not mastersim

### `critter_dragonling_clear_fn(inst)`
* **Description:** Clears Critter Dragonling skin, resets anim state build.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `critter_dragonling_builder_clear_fn(inst)`
* **Description:** Clears Critter Dragonling Builder skin, clears linked skinname.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `critter_glomling_clear_fn(inst)`
* **Description:** Clears Critter Glomling skin, resets anim state build and removes sounds.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `critter_glomling_builder_clear_fn(inst)`
* **Description:** Clears Critter Glomling Builder skin, clears linked skinname.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `critter_kitten_clear_fn(inst)`
* **Description:** Clears Critter Kitten skin, resets anim state build.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `critter_kitten_builder_clear_fn(inst)`
* **Description:** Clears Critter Kitten Builder skin, clears linked skinname.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `critter_lamb_clear_fn(inst)`
* **Description:** Clears Critter Lamb skin, resets anim state build.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `critter_lamb_builder_clear_fn(inst)`
* **Description:** Clears Critter Lamb Builder skin, clears linked skinname.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `critter_perdling_clear_fn(inst)`
* **Description:** Clears Critter Perdling skin, resets anim state build and hungry sound.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `critter_perdling_builder_clear_fn(inst)`
* **Description:** Clears Critter Perdling Builder skin, clears linked skinname.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `critter_puppy_clear_fn(inst)`
* **Description:** Clears Critter Puppy skin, resets anim state build.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `critter_puppy_builder_clear_fn(inst)`
* **Description:** Clears Critter Puppy Builder skin, clears linked skinname.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `critter_bulbin_init_fn(inst, build_name)`
* **Description:** Initializes Critter Bulbin skin using basic init function.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `critter_bulbin_clear_fn(inst)`
* **Description:** Clears Critter Bulbin skin, sets persists false and schedules removal.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `critter_bulbin_builder_clear_fn(inst)`
* **Description:** Clears Critter Bulbin Builder skin, clears linked skinname.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `minisign_item_init_fn(inst, build_name, anim_bank)`
* **Description:** Initializes Mini Sign Item skin, sets linked skinname, anim state, bank, and inventory image.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
  - `anim_bank` -- Optional animation bank name
* **Returns:** `nil`
* **Error states:** None

### `minisign_item_clear_fn(inst)`
* **Description:** Clears Mini Sign Item skin, resets linked skinname, anim state, bank, and inventory image.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `minisign_drawn_init_fn(inst, build_name, anim_bank)`
* **Description:** Initializes Mini Sign Drawn skin, sets linked skinname, anim state, bank, and inventory image.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
  - `anim_bank` -- Optional animation bank name
* **Returns:** `nil`
* **Error states:** None

### `minisign_drawn_clear_fn(inst)`
* **Description:** Clears Mini Sign Drawn skin, resets linked skinname, anim state, bank, and inventory image.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `minisign_init_fn(inst, build_name, anim_bank)`
* **Description:** Initializes Mini Sign placed skin, sets anim state, bank, and linked skinnames on server or placer.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
  - `anim_bank` -- Optional animation bank name
* **Returns:** `nil`
* **Error states:** Returns early if no placer and not mastersim

### `minisign_clear_fn(inst)`
* **Description:** Clears Mini Sign placed skin, resets linked skinnames, anim state, and bank.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `boat_item_init_fn(inst, build_name)`
* **Description:** Initializes Boat Item skin, sets linked skinname, anim state, and inventory image.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `boat_item_clear_fn(inst)`
* **Description:** Clears Boat Item skin, resets linked skinname, anim state, and inventory image.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `boat_init_fn(inst, build_name)`
* **Description:** Initializes Boat placed skin, sets anim state on server or placer.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
* **Returns:** `nil`
* **Error states:** Returns early if no placer and not mastersim

### `boat_clear_fn(inst)`
* **Description:** Clears Boat placed skin, resets anim state build.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `walkingplank_init_fn(inst, build_name)`
* **Description:** Initializes Walking Plank skin, sets anim state on server or placer.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
* **Returns:** `nil`
* **Error states:** Returns early if no placer and not mastersim

### `walkingplank_clear_fn(inst, build_name)`
* **Description:** Clears Walking Plank skin, resets anim state build.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
  - `build_name` -- The name of the skin build (unused in body)
* **Returns:** `nil`
* **Error states:** None

### `steeringwheel_item_init_fn(inst, build_name)`
* **Description:** Initializes Steering Wheel Item skin, sets linked skinname, anim state, and inventory image.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `steeringwheel_item_clear_fn(inst)`
* **Description:** Clears Steering Wheel Item skin, resets linked skinname, anim state, and inventory image.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `steeringwheel_init_fn(inst, build_name)`
* **Description:** Initializes Steering Wheel placed skin, sets anim state on server or placer. Returns early if no placer and not mastersim.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `steeringwheel_clear_fn(inst)`
* **Description:** Clears Steering Wheel placed skin, resets anim state build.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `anchor_item_init_fn(inst, build_name)`
* **Description:** Initializes Anchor Item skin, sets linked skinname, anim state, and inventory image.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `anchor_item_clear_fn(inst)`
* **Description:** Clears Anchor Item skin, resets linked skinname, anim state, and inventory image.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `anchor_init_fn(inst, build_name)`
* **Description:** Initializes Anchor placed skin, sets anim state on server or placer. Returns early if no placer and not mastersim.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `anchor_clear_fn(inst)`
* **Description:** Clears Anchor placed skin, resets anim state build.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `mastupgrade_lamp_item_init_fn(inst, build_name)`
* **Description:** Initializes Mast Upgrade Lamp Item skin, sets linked skinname, anim state, and inventory image.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `mastupgrade_lamp_item_clear_fn(inst)`
* **Description:** Clears Mast Upgrade Lamp Item skin, resets linked skinname, anim state, and inventory image.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `mastupgrade_lamp_init_fn(inst, build_name)`
* **Description:** Initializes Mast Upgrade Lamp placed skin, sets anim state on server or placer. Returns early if no placer and not mastersim.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `mastupgrade_lamp_clear_fn(inst)`
* **Description:** Clears Mast Upgrade Lamp placed skin, resets anim state build.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `mastupgrade_lightningrod_item_init_fn(inst, build_name)`
* **Description:** Initializes Mast Upgrade Lightningrod Item skin, sets linked skinname, anim state, and inventory image.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `mastupgrade_lightningrod_item_clear_fn(inst)`
* **Description:** Clears Mast Upgrade Lightningrod Item skin, resets linked skinname, anim state, and inventory image.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `mastupgrade_lightningrod_init_fn(inst, build_name)`
* **Description:** Initializes Mast Upgrade Lightningrod placed skin, sets anim state on server or placer. Returns early if no placer and not mastersim.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `mastupgrade_lightningrod_clear_fn(inst)`
* **Description:** Clears Mast Upgrade Lightningrod placed skin, resets anim state build.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `mastupgrade_lightningrod_top_init_fn(inst, build_name)`
* **Description:** Initializes Mast Upgrade Lightningrod Top placed skin, sets anim state on server or placer. Returns early if no placer and not mastersim.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `mastupgrade_lightningrod_top_clear_fn(inst)`
* **Description:** Clears Mast Upgrade Lightningrod Top placed skin, resets anim state build.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `wall_moonrock_item_init_fn(inst, build_name)`
* **Description:** Initializes Wall Moonrock Item skin, sets linked skinname, anim state, and inventory image.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `wall_moonrock_item_clear_fn(inst)`
* **Description:** Clears Wall Moonrock Item skin, resets linked skinname, anim state, and inventory image.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `wall_moonrock_init_fn(inst, build_name)`
* **Description:** Initializes Wall Moonrock placed skin, sets anim state on server or placer. Returns early if no placer and not mastersim.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `wall_moonrock_clear_fn(inst)`
* **Description:** Clears Wall Moonrock placed skin, resets anim state build.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `wall_ruins_item_init_fn(inst, build_name)`
* **Description:** Initializes Wall Ruins Item skin, sets linked skinname, anim state, and inventory image.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `wall_ruins_item_clear_fn(inst)`
* **Description:** Clears Wall Ruins Item skin, resets linked skinname, anim state, and inventory image.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `wall_ruins_init_fn(inst, build_name)`
* **Description:** Initializes Wall Ruins placed skin, sets anim state on server or placer. Returns early if no placer and not mastersim.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `wall_ruins_clear_fn(inst)`
* **Description:** Clears Wall Ruins placed skin, resets anim state build.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `wall_stone_item_init_fn(inst, build_name)`
* **Description:** Initializes Wall Stone Item skin, sets linked skinname, anim state, and inventory image.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `wall_stone_item_clear_fn(inst)`
* **Description:** Clears Wall Stone Item skin, resets linked skinname, anim state, and inventory image.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `wall_stone_init_fn(inst, build_name)`
* **Description:** Initializes Wall Stone placed skin, sets anim state on server or placer. Returns early if no placer and not mastersim.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `wall_stone_clear_fn(inst)`
* **Description:** Clears Wall Stone placed skin, resets anim state build.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `wall_dreadstone_item_init_fn(inst, build_name)`
* **Description:** Initializes Wall Dreadstone Item skin, sets linked skinname, anim state, and inventory image.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `wall_dreadstone_item_clear_fn(inst)`
* **Description:** Clears Wall Dreadstone Item skin, resets linked skinname, anim state, and inventory image.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `wall_dreadstone_init_fn(inst, build_name)`
* **Description:** Initializes Wall Dreadstone placed skin, sets anim state on server or placer. Returns early if no placer and not mastersim.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `wall_dreadstone_clear_fn(inst)`
* **Description:** Clears Wall Dreadstone placed skin, resets anim state build.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `wall_hay_item_init_fn(inst, build_name)`
* **Description:** Initializes Wall Hay Item skin, sets linked skinname, anim state, and inventory image.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `wall_hay_item_clear_fn(inst)`
* **Description:** Clears Wall Hay Item skin, resets linked skinname, anim state, and inventory image.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `wall_hay_init_fn(inst, build_name)`
* **Description:** Initializes Wall Hay placed skin, sets anim state on server or placer. Returns early if no placer and not mastersim.
* **Parameters:**
  - `inst` -- The entity instance to apply the skin to
  - `build_name` -- The name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `wall_hay_clear_fn(inst)`
* **Description:** Clears Wall Hay placed skin, resets anim state build.
* **Parameters:**
  - `inst` -- The entity instance to clear the skin from
* **Returns:** `nil`
* **Error states:** None

### `wall_wood_item_init_fn(inst, build_name)`
* **Description:** Initializes wood wall item skin by setting animation skin and inventory image.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `wall_wood_item_clear_fn(inst)`
* **Description:** Clears wood wall item skin, resetting animation build and inventory image.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `wall_wood_init_fn(inst, build_name)`
* **Description:** Initializes placed wood wall skin, checking for placer component and server authority. Returns early if no placer component and not master sim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `wall_wood_clear_fn(inst)`
* **Description:** Clears placed wood wall skin, resetting animation build.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `fence_item_init_fn(inst, build_name)`
* **Description:** Initializes fence item skin by setting animation skin and inventory image.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `fence_item_clear_fn(inst)`
* **Description:** Clears fence item skin, resetting animation build and inventory image.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `fence_init_fn(inst, build_name)`
* **Description:** Initializes placed fence skin, checking for placer component and server authority. Returns early if no placer component and not master sim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `fence_clear_fn(inst)`
* **Description:** Clears placed fence skin, resetting animation build.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `fence_gate_item_init_fn(inst, build_name)`
* **Description:** Initializes fence gate item skin by setting animation skin and inventory image.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `fence_gate_item_clear_fn(inst)`
* **Description:** Clears fence gate item skin, resetting animation build and inventory image.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `fence_gate_init_fn(inst, build_name)`
* **Description:** Initializes placed fence gate skin, checking for placer component and server authority. Returns early if no placer component and not master sim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `fence_gate_clear_fn(inst)`
* **Description:** Clears placed fence gate skin, resetting animation build.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `mast_item_init_fn(inst, build_name)`
* **Description:** Initializes mast item skin by setting animation skin and inventory image.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `mast_item_clear_fn(inst, build_name)`
* **Description:** Clears mast item skin, resetting animation build.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Skin build name
* **Returns:** `nil`
* **Error states:** None

### `mast_init_fn(inst, build_name)`
* **Description:** Initializes placed mast skin, checking for placer component and server authority. Returns early if no placer component and not master sim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `mast_clear_fn(inst, build_name)`
* **Description:** Clears placed mast skin, resetting animation build.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` (string) -- Skin build name
* **Returns:** `nil`
* **Error states:** None### `record_init_fn(inst, build_name, trackname)`
* **Description:** Initializes record skin, setting display name, inspectable override, and skin sounds. Returns early if not master sim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
  - `trackname` -- Optional track name for music
* **Returns:** `nil`
* **Error states:** None### `record_clear_fn(inst)`
* **Description:** Clears record skin, resetting display name, inventory image, and skin sounds.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `mast_malbatross_item_init_fn(inst, build_name)`
* **Description:** Initializes Malbatross mast item skin by setting animation skin and inventory image.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `mast_malbatross_item_clear_fn(inst, build_name)`
* **Description:** Clears Malbatross mast item skin, resetting animation build.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `mast_malbatross_init_fn(inst, build_name)`
* **Description:** Initializes placed Malbatross mast skin, checking for placer component and server authority. Returns early if no placer component and not master sim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `mast_malbatross_clear_fn(inst, build_name)`
* **Description:** Clears placed Malbatross mast skin, resetting animation build.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `bernie_inactive_init_fn(inst, build_name)`
* **Description:** Initializes inactive Bernie skin, setting animation and inventory image. Returns early if not master sim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `bernie_inactive_clear_fn(inst)`
* **Description:** Clears inactive Bernie skin, resetting animation and inventory image.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `bernie_active_init_fn(inst, build_name)`
* **Description:** Initializes active Bernie skin, setting animation. Returns early if not master sim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `bernie_active_clear_fn(inst)`
* **Description:** Clears active Bernie skin, resetting animation.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `bernie_big_init_fn(inst, build_name)`
* **Description:** Initializes big Bernie skin, setting animation and optional custom build. Returns early if not master sim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `bernie_big_clear_fn(inst)`
* **Description:** Clears big Bernie skin, resetting animation via custom function or default.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `researchlab4_init_fn(inst, build_name)`
* **Description:** Initializes Research Lab 4 skin, overriding machine hat symbol. Returns early if placer component exists (on client) or if not master sim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `researchlab4_clear_fn(inst)`
* **Description:** Clears Research Lab 4 skin, clearing symbol override.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `reviver_init_fn(inst, build_name)`
* **Description:** Initializes Reviver skin, setting animation, FX, and skin sounds. Returns early if not master sim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `reviver_clear_fn(inst)`
* **Description:** Clears Reviver skin, removing FX and resetting animation.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `cane_init_fn(inst, build_name)`
* **Description:** Initializes Cane skin, setting up VFX and event listeners. Returns early if not master sim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `cane_clear_fn(inst)`
* **Description:** Clears Cane skin, removing event callbacks and resetting symbols.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `nightsword_init_fn(inst, build_name)`
* **Description:** Initializes Night Sword skin, setting up VFX and event listeners. Returns early if not master sim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `nightsword_clear_fn(inst)`
* **Description:** Clears Night Sword skin, removing event callbacks.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `glasscutter_init_fn(inst, build_name)`
* **Description:** Initializes Glass Cutter skin, adding skin sounds. Returns early if not master sim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `glasscutter_clear_fn(inst)`
* **Description:** Clears Glass Cutter skin, removing skin sounds.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `orangestaff_init_fn(inst, build_name)`
* **Description:** Initializes Orange Staff skin, setting up VFX, trail, and blinkstaff FX. Returns early if not master sim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `orangestaff_clear_fn(inst)`
* **Description:** Clears Orange Staff skin, removing callbacks and resetting blinkstaff FX.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `yellowstaff_init_fn(inst, build_name)`
* **Description:** Initializes Yellow Staff skin, storing morph skin data.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `yellowstaff_clear_fn(inst)`
* **Description:** Clears Yellow Staff skin, niling morph skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `heatrock_init_fn(inst, build_name)`
* **Description:** Initializes Thermal Stone skin, setting animation and inventory image with temp range. Returns early if not master sim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `heatrock_clear_fn(inst)`
* **Description:** Clears Thermal Stone skin, resetting animation and inventory image.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `lantern_init_fn(inst, build_name, overridesymbols, followoffset)`
* **Description:** Initializes Lantern skin, setting up FX and event listeners. Returns early if not master sim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
  - `overridesymbols` -- Table of symbols to override
  - `followoffset` -- Vector offset for FX following
* **Returns:** `nil`
* **Error states:** None

### `lantern_clear_fn(inst)`
* **Description:** Clears Lantern skin, turning off FX and removing listeners.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `panflute_init_fn(inst, build_name)`
* **Description:** Initializes Pan Flute skin, setting animation and inventory image. Returns early if no placer and not master sim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `panflute_clear_fn(inst)`
* **Description:** Clears Pan Flute skin, resetting animation and inventory image.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `researchlab2_init_fn(inst, build_name)`
* **Description:** Initializes research lab skin, setting build, overriding symbols, and spawning FX children. Returns early if placer component exists or not master sim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `researchlab2_clear_fn(inst)`
* **Description:** Clears research lab skin overrides, removes children, and resets animation functions.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `icebox_init_fn(inst, build_name)`
* **Description:** Initializes icebox skin, setting build and listening for open/close/remove events. Returns early if placer component exists or not master sim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `icebox_clear_fn(inst)`
* **Description:** Clears icebox skin build and removes event callbacks.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `telebase_init_fn(inst, build_name)`
* **Description:** Initializes telebase skin, applying skin to inst and linked placer decorations. Returns early if placer component exists or not master sim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `telebase_clear_fn(inst)`
* **Description:** Clears telebase skin build and resets linked skin name.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `gemsocket_init_fn(inst, build_name)`
* **Description:** Initializes gemsocket skin build. Returns early if not master sim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `gemsocket_clear_fn(inst)`
* **Description:** Clears gemsocket skin build.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `molehat_init_fn(inst, build_name, opentop)`
* **Description:** Initializes molehat skin, adding open_top_hat tag and equip callback if opentop.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
  - `opentop` -- Boolean indicating if hat has open top
* **Returns:** `nil`
* **Error states:** None

### `molehat_clear_fn(inst)`
* **Description:** Clears molehat skin, removing tag and resetting equip callback.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `premiumwateringcan_init_fn(inst, build_name)`
* **Description:** Initializes premium watering can skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `premiumwateringcan_clear_fn(inst)`
* **Description:** Clears premium watering can skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `mushroom_farm_init_fn(inst, build_name)`
* **Description:** Initializes mushroom farm skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `mushroom_farm_clear_fn(inst)`
* **Description:** Clears mushroom farm skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `dock_woodposts_init_fn(inst, build_name)`
* **Description:** Initializes dock woodposts skin, playing random idle animation.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `dock_woodposts_clear_fn(inst)`
* **Description:** Clears dock woodposts skin, playing random idle animation.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `dock_woodposts_item_init_fn(inst, build_name, anim_bank)`
* **Description:** Initializes dock woodposts item skin, setting linked skin name and inventory image.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
  - `anim_bank` -- Animation bank name
* **Returns:** `nil`
* **Error states:** None

### `dock_woodposts_item_clear_fn(inst)`
* **Description:** Clears dock woodposts item skin, resetting build, bank, and inventory image.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `trophyscale_fish_init_fn(inst, build_name)`
* **Description:** Initializes trophy scale fish skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `trophyscale_fish_clear_fn(inst)`
* **Description:** Clears trophy scale fish skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `trophyscale_oversizedveggies_init_fn(inst, build_name)`
* **Description:** Initializes trophy scale oversized veggies skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `trophyscale_oversizedveggies_clear_fn(inst)`
* **Description:** Clears trophy scale oversized veggies skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `resurrectionstatue_init_fn(inst, build_name)`
* **Description:** Initializes resurrection statue skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `resurrectionstatue_clear_fn(inst)`
* **Description:** Clears resurrection statue skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `antlionhat_init_fn(inst, build_name)`
* **Description:** Initializes antlion hat skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `antlionhat_clear_fn(inst)`
* **Description:** Clears antlion hat skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `woodcarvedhat_init_fn(inst, build_name)`
* **Description:** Initializes woodcarved hat skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `woodcarvedhat_clear_fn(inst)`
* **Description:** Clears woodcarved hat skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `nightstick_init_fn(inst, build_name)`
* **Description:** Initializes nightstick skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `nightstick_clear_fn(inst)`
* **Description:** Clears nightstick skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `hawaiianshirt_init_fn(inst, build_name)`
* **Description:** Initializes hawaiian shirt skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `hawaiianshirt_clear_fn(inst)`
* **Description:** Clears hawaiian shirt skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `icehat_init_fn(inst, build_name)`
* **Description:** Initializes ice hat skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `icehat_clear_fn(inst)`
* **Description:** Clears ice hat skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `w_radio_init_fn(inst, build_name, skin_custom)`
* **Description:** Initializes w_radio skin and triggers callback if available.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
  - `skin_custom` -- Custom skin data
* **Returns:** `nil`
* **Error states:** None

### `w_radio_clear_fn(inst)`
* **Description:** Clears w_radio skin and triggers callback with nil.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `pumpkinhat_init_fn(inst, build_name)`
* **Description:** Initializes pumpkin hat skin and triggers callback on master sim. Returns early if not master sim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `pumpkinhat_clear_fn(inst)`
* **Description:** Clears pumpkin hat skin and triggers callback with nil.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `hermitcrab_init_fn(inst, build_name)`
* **Description:** Initializes hermit crab skin.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `hermitcrab_clear_fn(inst)`
* **Description:** Clears hermit crab skin.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `hermithouse_ornament_init_fn(inst, build_name)`
* **Description:** Initializes hermit house ornament skin, managing winter tag and sounds. Returns early if not master sim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `hermithouse_ornament_clear_fn(inst)`
* **Description:** Clears hermit house ornament skin, removing tag and sounds.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `hermitcrab_lightpost_init_fn(inst, build_name)`
* **Description:** Initializes hermit crab lightpost skin and triggers callback.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `hermitcrab_lightpost_clear_fn(inst)`
* **Description:** Clears hermit crab lightpost skin and triggers callback with nil.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `hermithotspring_init_fn(inst, build_name)`
* **Description:** Initializes hermit hot spring skin, triggering callback without basic fn.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `hermithouse_init_fn(inst, build_name)`
* **Description:** Initializes hermit house skin and triggers callback.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `hermithouse_clear_fn(inst)`
* **Description:** Clears hermit house skin and triggers callback with nil.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `hermit_chair_rocking_init_fn(inst, build_name)`
* **Description:** Initializes hermit rocking chair skin, overriding symbols on master sim. Returns early if not master sim.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `hermit_chair_rocking_clear_fn(inst)`
* **Description:** Clears hermit rocking chair skin, clearing symbol overrides.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `hermitcrab_teashop_init_fn(inst, build_name)`
* **Description:** Initializes hermit crab teashop skin, applying to linked front entity if exists.
* **Parameters:**
  - `inst` -- Entity instance
  - `build_name` -- Name of the skin build
* **Returns:** `nil`
* **Error states:** None

### `hermitcrab_teashop_clear_fn(inst)`
* **Description:** Clears hermit crab teashop skin, applying to linked front entity if exists.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`
* **Error states:** None

### `CreatePrefabSkin(name, info)`
* **Description:** Factory function that creates and configures a skin prefab table with metadata and callbacks. Defaults info.type to 'base' if nil.
* **Parameters:**
  - `name` -- Prefab name
  - `info` -- Table containing skin configuration data
* **Returns:** `prefab_skin` table
* **Error states:** None

## Events & listeners

**Listens to:**
- `equipped` -- Listened to in bushhat_init_fn to spawn VFX
- `unequipped` -- Listened to in bushhat_init_fn to remove VFX
- `onremove` -- Listened to in bushhat_init_fn to remove VFX
- `takefuel` -- Listened to in firepit_init_fn to handle fueling effects for skin FX
- `lantern_on` -- Used by lantern to trigger light FX
- `lantern_off` -- Used by lantern to remove light FX
- `onopen` -- Listened to in icebox_init_fn to trigger open FX
- `onclose` -- Listened to in icebox_init_fn to trigger close FX cleanup

**Pushes:**
- None
