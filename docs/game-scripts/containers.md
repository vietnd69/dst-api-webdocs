---
id: containers
title: Containers
description: Manages container-specific behavior including item validation, UI configuration, and construction/interaction logic for game entities.
tags: [inventory, ui, crafting, entity, network]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 9a3c93b6
system_scope: inventory
---

# Containers

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The `containers.lua` script centralizes logic for configuring and validating container behavior across DST entities. It defines `itemtestfn` functions to restrict which items may be placed in specific containers (e.g., based on tags or component state), `widgetsetup` for UI parameter configuration, and specialized handlers for construction sites and interactive containers (e.g., Dragonfly Furnace, Quagmire Pot). It integrates with UI components like `RiftConfirmScreen` and leverages components such as `Container`, `ConstructionBuilderUIData`, `InventoryItem`, and `SkillTreeUpdater` to enforce game rules during item placement and action execution.

## Usage example
```lua
-- Example: Validate item placement in a Quagmire Pot
local function CanStewItem(container, item)
    return item:HasTag("quagmire_stewable") and
           not item:HasTag("preparedfood") and
           (not item.components.inventoryitem or not item.components.inventoryitem:IsHeld())
end

-- Example: Configure a container widget with prefab-specific params
containers.widgetsetup(container, "quagmire_pot", { slots = 3 })

-- Example: Trigger construction action with confirmation UI
if params.enable_shadow_rift_construction_container.widget.overrideactionfn(inst, doer) then
    -- UI shown; action delayed until confirmed
else
    EnableRiftsDoAct(inst, doer)
end
```

## Dependencies & tags
**Components used:**
- `components/constructionbuilderuidata` (`GetConstructionSite`, `GetIngredientForSlot`)
- `components/container` (`GetOpeners`, `IsBusy`, `IsEmpty`)
- `components/inventoryitem` (`IsHeld`)
- `components/skilltreeupdater` (`IsActivated`)
- `cooking.lua` (via `IsCookingIngredient`)
- `screens/redux/riftconfirmscreen.lua` (`RiftConfirmScreen`)

**Tags:**
`"irreplaceable"`, `"_container"`, `"bundle"`, `"nobundling"`, `"burnt"`, `"dryable"`, `"lightbattery"`, `"spore"`, `"lightcontainer"`, `"yotb_pattern_fragment"`, `"preparedfood"`, `"spicedfood"`, `"spice"`, `"winter_ornament"`, `"hermithouse_ornament"`, `"petals"`, `"moon_tree_blossom"`, `"petals_evil"`, `"kelp"`, `"icebox_valid"`, `"fresh"`, `"stale"`, `"spoiled"`, `"smallcreature"`, `"edible_basic"`, `"edible_meat"`, `"edible_fish"`, `"edible_fruit"`, `"edible_veggie"`, `"edible_insect"`, `"edible_generic"`, `"edible_seeds"`, `"edible_mushroom"`, `"edible_egg"`, `"edible_creature"`, `"edible_fungus"`, `"edible_crab"`, `"edible_frog"`, `"edible_bug"`, `"edible_worm"`, `"edible_shellfish"`, `"edible_sea"`, `"edible_rope"`, `"edible_rodent"`, `"edible_pig"`, `"edible_krampus"`, `"edible_bird"`, `"edible_hound"`, `"edible_beefalo"`, `"edible_swan"`, `"edible_mermd"`, `"edible_lobstercrab"`, `"edible_penguin"`, `"edible_spider"`, `"edible_worm"`, `"edible_crab"`, `"edible_frog"`, `"edible_egg"`, `"edible_bug"`, `"edible_worm"`, `"cookable"`, `"deployable"`, `"groundtile"`, `"smalloceancreature"`, `"oceanfishing_bobber"`, `"oceanfishing_lure"`, `"halloween_ornament"`, `"slingshotammo"`, `"slingshot_band"`, `"slingshot_frame"`, `"slingshot_handle"`, `"seeds"`, `"treeseed"`, `"halloweencandy"`, `"nonpotatable"`, `"wetgoop"`, `"pocketwatchpart"`, `"bookcabinet_item"`, `"beargerfur_sack_valid"`, `"blowpipeammo"`, `"battlesong"`, `"soul"`, `"nosouljar"`, `"ghostlyelixir"`, `"ghostflower"`, `"quagmire_stewable"`, `"quagmire_sap"`, `"takeonly"`, `"lunarseed"`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| N/A | N/A | N/A | No documented properties. Container behavior is defined via `params` tables and functions. |

## Main functions
### `containers.widgetsetup(container, prefab, data)`
* **Description:** Configures container widget properties by copying parameters from `params[prefab]` or `data` into the container table and setting the number of slots.
* **Parameters:**
  - `container`: The container instance to configure.
  - `prefab`: String identifier for the prefab (used to look up params if `data` is nil).
  - `data`: Optional override table; defaults to `params[prefab]`.
* **Returns:** `nil`.

### `IsConstructionSiteComplete(inst, doer)`
* **Description:** Checks whether the construction site associated with `doer` has all required ingredients present in `inst`’s container with sufficient quantity.
* **Parameters:**
  - `inst`: The container instance containing the ingredients.
  - `doer`: The entity attempting construction (typically a player).
* **Returns:** `true` if all required ingredients are present; `false` otherwise (including if container, construction site, or ingredients are missing/nil).

### `EnableRiftsPopUpGoBack()`
* **Description:** Pops the current frontend screen to close a confirmation dialog (e.g., for shadow/rift construction).
* **Parameters:** None.
* **Returns:** `nil`.

### `EnableRiftsDoAct(inst, doer)`
* **Description:** Executes the `ApplyConstruction` action for `inst` using `doer`, via local buffered action or RPC.
* **Parameters:**
  - `inst`: The container instance.
  - `doer`: The entity performing the action.
* **Returns:** `nil`.

### `params.enable_shadow_rift_construction_container.widget.overrideactionfn(inst, doer)`
* **Description:** Shows a UI confirmation dialog for shadow/rift construction if the site is complete. Otherwise, allows fallback direct action.
* **Parameters:**
  - `inst`: The container instance.
  - `doer`: The entity performing the action.
* **Returns:** `true` if the confirmation UI was shown; `false` otherwise.

### `params.enable_shadow_rift_construction_container.widget.buttoninfo.fn(inst, doer)`
* **Description:** Button click handler for shadow/rift container UI; delegates to `overrideactionfn`. If that returns `false`, calls `EnableRiftsDoAct`.
* **Parameters:**
  - `inst`: The container instance.
  - `doer`: The entity performing the action.
* **Returns:** `nil`.

### `params.alterguardianhat.itemtestfn(container, item, slot)`
* **Description:** Determines if `item` can be placed in the Alter Guardian Hat container.
* **Parameters:**
  - `container`: The container instance.
  - `item`: The item being tested.
  - `slot`: Slot index (unused).
* **Returns:** `true` if `item` has tag `"spore"` or `"lunarseed"`; `false` otherwise.

### `params.pocketwatch.itemtestfn(container, item, slot)`
* **Description:** Determines if `item` can be placed in the Pocket Watch container.
* **Parameters:** Same as above.
* **Returns:** `true` if `item` has tag `"pocketwatchpart"`; `false` otherwise.

### `params.ocean_trawler.itemtestfn(container, item, slot)`
* **Description:** Determines if `item` can be cooked in the Ocean Trawler.
* **Parameters:** Same as above.
* **Returns:** `true` if `item` has tag `"cookable"` or `"oceanfish"`; `false` otherwise.

### `params.bookstation.itemtestfn(container, item, slot)`
* **Description:** Determines if `item` can be placed in the Book Station container.
* **Parameters:** Same as above.
* **Returns:** `true` if `item` has tag `"bookcabinet_item"`; `false` otherwise.

### `params.beargerfur_sack.itemtestfn(container, item, slot)`
* **Description:** Determines if `item` can be placed in the Bearger Fur Sack.
* **Parameters:** Same as above.
* **Returns:** `true` if `item` has tag `"beargerfur_sack_valid"` or `"preparedfood"`; `false` otherwise.

### `params.houndstooth_blowpipe.itemtestfn(container, item, slot)`
* **Description:** Determines if `item` can be placed in the Hound’s Tooth Blowpipe container.
* **Parameters:** Same as above.
* **Returns:** `true` if `item` has tag `"blowpipeammo"`; `false` otherwise.

### `params.battlesong_container.itemtestfn(container, item, slot)`
* **Description:** Determines if `item` (a battlesong) can be placed in the container.
* **Parameters:** Same as above.
* **Returns:** `true` if `item` has tag `"battlesong"`; `false` otherwise.

### `params.wortox_souljar.itemtestfn(container, item, slot)`
* **Description:** Determines if `item` (a soul) can be placed in Wortox’s Soul Jar.
* **Parameters:** Same as above.
* **Returns:** `true` if `item` has tag `"soul"` and does **not** have tag `"nosouljar"`; `false` otherwise.

### `params.elixir_container.itemtestfn(container, item, slot)`
* **Description:** Determines if `item` can be placed in Wendy’s Elixir Container.
* **Parameters:** Same as above.
* **Returns:** `true` if `item` has tag `"ghostlyelixir"` or `"ghostflower"`; `false` otherwise.

### `params.dragonflyfurnace.itemtestfn(container, item, slot)`
* **Description:** Determines if `item` can be placed in the Dragonfly Furnace for incineration.
* **Parameters:** Same as above.
* **Returns:** `true` if `item` does **not** have tag `"irreplaceable"`; `false` otherwise.

### `params.dragonflyfurnace.widget.buttoninfo.fn(inst, doer)`
* **Description:** Handler for the Incinerate button in Dragonfly Furnace UI. Executes incineration locally (if `BufferedAction` available) or via RPC.
* **Parameters:**
  - `inst`: The furnace entity instance.
  - `doer`: The player performing the action.
* **Returns:** `nil`.

### `params.dragonflyfurnace.widget.buttoninfo.validfn(inst)`
* **Description:** Determines if the Incinerate button should be visible/enabled.
* **Parameters:**
  - `inst`: The furnace entity instance.
* **Returns:** `true` if `inst.replica.container` exists and is not empty; `false` otherwise.

### `params.slingshotammo_container.itemtestfn(container, item, slot)`
* **Description:** Determines if `item` can be placed in the Slingshot Ammo container.
* **Parameters:** Same as above.
* **Returns:** `true` if `item` has tag `"slingshotammo"`; `false` otherwise.

### `params.quagmire_pot.itemtestfn(container, item, slot)`
* **Description:** Determines if `item` can be stewed in the Quagmire Pot.
* **Parameters:** Same as above.
* **Returns:** `true` if:
  - `item` has tag `"quagmire_stewable"`,
  - `item.prefab` ≠ `"quagmire_sap"`,
  - and either: `item.components.inventoryitem:IsHeld()` is `false`, or `item` is not `"spoiled_food"`/`"preparedfood"`/`"overcooked"` and container lacks tag `"takeonly"`.
* **Assumes:** `item.components.inventoryitem` exists.

### `params.quagmire_pot_small.itemtestfn(container, item, slot)`
* **Description:** Alias for `params.quagmire_pot.itemtestfn`.

### `params.quagmire_pot_syrup.itemtestfn(container, item, slot)`
* **Description:** Determines if `item` can be stewed in the Quagmire Pot (Syrup variant).
* **Parameters:** Same as above.
* **Returns:** `true` if:
  - `item` has tag `"quagmire_stewable"`,
  - and either: `item.components.inventoryitem:IsHeld()` is `false`, or `item.prefab == "quagmire_sap"` and container lacks tag `"takeonly"`.
* **Assumes:** `item.components.inventoryitem` exists.

### `params.quagmire_casseroledish.itemtestfn(container, item, slot)`
* **Description:** Alias for `params.quagmire_pot.itemtestfn`.

### `params.quagmire_casseroledish_small.itemtestfn(container, item, slot)`
* **Description:** Alias for `params.quagmire_pot_small.itemtestfn`.

### `params.quagmire_grill.itemtestfn(container, item, slot)`
* **Description:** Alias for `params.quagmire_pot.itemtestfn`.

### `params.quagmire_grill_small.itemtestfn(container, item, slot)`
* **Description:** Alias for `params.quagmire_pot_small.itemtestfn`.

## Events & listeners
* No events or listeners are registered in this file.