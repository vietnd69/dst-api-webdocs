---
id: spoiledfood
title: Spoiledfood
description: Prefab file defining three spoiled food entity variants (spoiled_food, spoiled_fish, spoiled_fish_small) with fertilizer, edible, and rain-disappear mechanics.
tags: [prefab, food, fertilizer, entity]
sidebar_position: 10

last_updated: 2026-04-27
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 197b3c8a
system_scope: entity
---

# Spoiledfood

> Based on game build **722832** | Last updated: 2026-04-27

## Overview
`spoiledfood.lua` registers three spawnable spoiled food entity prefabs. The main `fn()` constructor builds the base entity with shared components (fertilizer, edible, inventory, stackable); variant-specific init functions customize animation, loot, and behavior for `spoiled_food` (disappears in rain, works as fishing lure), `spoiled_fish` (hammerable for loot), and `spoiled_fish_small` (smaller variant with random loot). All variants are fertilizer researchable and can be used to fertilize crops.

## Usage example
```lua
-- Spawn spoiled food at world origin:
local inst = SpawnPrefab("spoiled_food")
inst.Transform:SetPosition(0, 0, 0)

-- Spawn spoiled fish variant:
local fish = SpawnPrefab("spoiled_fish")

-- Reference assets at load time:
local assets = {
    Asset("ANIM", "anim/spoiled_food.zip"),
    Asset("ANIM", "anim/oceanfishing_lure_mis.zip"),
    Asset("SCRIPT", "scripts/prefabs/fertilizer_nutrient_defs.lua"),
}
```

## Dependencies & tags
**External dependencies:**
- `prefabs/fertilizer_nutrient_defs.lua` -- provides `FERTILIZER_DEFS` table with nutrient definitions for each variant
- `event_server_data("quagmire", ...)` -- applies Quagmire event mode modifications on master

**Components used:**
- `fertilizer` -- nutrient values for crop fertilization (all variants)
- `edible` -- sets spoiled food status, health/hunger values (all variants)
- `inventoryitem` -- allows carrying in inventory (all variants)
- `stackable` -- enables stacking up to `TUNING.STACK_SIZE_SMALLITEM` (all variants)
- `fertilizerresearchable` -- enables fertilizer research via `SetResearchFn` (all variants)
- `selfstacker` -- automatic stacking behavior (all variants)
- `fuel` -- burnable as fuel with `TUNING.SMALL_FUEL` value (all variants)
- `burnable` -- small burn time via `MakeSmallBurnable` (all variants)
- `propagator` -- fire spreading via `MakeSmallPropagator` (all variants)
- `tradable` -- enables trading (all variants)
- `smotherer` -- extinguishes fires (all variants)
- `inspectable` -- provides inspection status (all variants)
- `disappears` -- rain-based disappearance for `spoiled_food` only
- `oceanfishingtackle` -- fishing lure setup for `spoiled_food` only
- `driedsalticon` -- salt icon display for `spoiled_food` only
- `lootdropper` -- loot drops on hammer for fish variants only
- `workable` -- hammer action for fish variants only
- `floater` -- floating animation scale (all variants, added via MakeInventoryFloatable in fn()).

**Tags:**
- `icebox_valid` -- added in `fn()` for icebox storage
- `saltbox_valid` -- added in `fn()` for saltbox storage
- `show_spoiled` -- added in `fn()` for spoiled food display
- `fertilizerresearchable` -- added in `fn()` for research system
- `selfstacker` -- added in `fn()` for auto-stacking
- `spoiledfood` -- added in `fn()` for edible component optimization
- `oceanfishing_lure` -- added in `food_init()` for fishing system
- `spoiled_fish` -- added in `fish_init()` and `fish_small_init()` for fish identification

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `assets` | table | --- | Array of `Asset(...)` entries for `spoiled_food` prefab (anim, script). |
| `fish_assets` | table | --- | Array of `Asset(...)` entries for `spoiled_fish` prefab. |
| `fish_small_assets` | table | --- | Array of `Asset(...)` entries for `spoiled_fish_small` prefab. |
| `prefabs` | table | `{"gridplacer_farmablesoil"}` | Dependent prefab names loaded with `spoiled_food`. |
| `fish_prefabs` | table | `{"boneshard", "spoiled_food"}` | Dependent prefab names loaded with fish variants. |
| `fish_loot` | table | `{"spoiled_food", "boneshard"}` | Loot table for `spoiled_fish` hammer drops. |
| `FERTILIZER_DEFS` | table | --- | Imported nutrient definitions from `fertilizer_nutrient_defs.lua`. |


## Main functions
### `fn(common_init, mastersim_init, nutrients, kind)`
* **Description:** Main entity constructor. Creates the base entity with transform, animstate, network, and physics. Attaches shared components (fertilizer, edible, inventory, stackable, fuel, etc.). Calls `common_init` on all sims and `mastersim_init` only on server. Returns `inst` for prefab registration.
* **Parameters:**
  - `common_init` -- function called on all sims (client and server) for variant-specific setup
  - `mastersim_init` -- function called only on master sim for server-only component setup
  - `nutrients` -- table of nutrient values from `FERTILIZER_DEFS`
  - `kind` -- string identifier (e.g., `"food"` for spoiled_food variant)
* **Returns:** entity instance
* **Error states:** Errors if `common_init` or `mastersim_init` is nil when called (no nil guard before callback invocation).

### `food_init(inst)`
* **Description:** Client-side initialization for `spoiled_food` variant. Adds ocean fishing lure tag and `driedsalticon` component configured to not collect on dried.
* **Parameters:** `inst` -- entity instance from `fn()`
* **Returns:** None
* **Error states:** None

### `food_mastersim_init(inst)`
* **Description:** Server-only initialization for `spoiled_food` variant. Adds `oceanfishingtackle` component with lure data, adds `disappears` component with dissolve animation and sound, sets up rain event listeners (`gainrainimmunity`, `loserainimmunity`, `ondropped`), watches world `israining` state, and configures inventory put callback for rain immunity.
* **Parameters:** `inst` -- entity instance from `fn()`
* **Returns:** None
* **Error states:** None

### `fish_init(inst)`
* **Description:** Client-side initialization for `spoiled_fish` variant. Sets animation bank/build to `spoiled_fish`, adds `spoiled_fish` tag, configures floater scale to 0.6, and sets transform scale to 1.3.
* **Parameters:** `inst` -- entity instance from `fn()`
* **Returns:** None
* **Error states:** None

### `fish_mastersim_init(inst)`
* **Description:** Server-only initialization for `spoiled_fish` variant. Adds `lootdropper` with fixed loot table (`fish_loot`), adds `workable` component with HAMMER action and work callback (`fish_onhit`), listens for `stacksizechange` event to update work left.
* **Parameters:** `inst` -- entity instance from `fn()`
* **Returns:** None
* **Error states:** None

### `fish_small_init(inst)`
* **Description:** Client-side initialization for `spoiled_fish_small` variant. Sets animation bank/build to `spoiled_fish_small`, adds `spoiled_fish` tag, configures floater scale to 0.35, and sets transform scale to 1.3.
* **Parameters:** `inst` -- entity instance from `fn()`
* **Returns:** None
* **Error states:** None

### `fish_small_mastersim_init(inst)`
* **Description:** Server-only initialization for `spoiled_fish_small` variant. Sets inspectable name override to `"spoiled_fish"`, adds `lootdropper` with random loot (50% `spoiled_food`, 50% `boneshard`), adds `workable` with HAMMER action and work callback, listens for `stacksizechange` event.
* **Parameters:** `inst` -- entity instance from `fn()`
* **Returns:** None
* **Error states:** None

### `fish_onhit(inst, worker, workleft, workdone)`
* **Description:** Work callback for fish variants when hammered. Calculates loot count based on work done clamped to `TUNING.SPOILED_FISH_LOOT.WORK_MAX_SPAWNS`, launches entity if max spawns reached, drops loot via `lootdropper`, and removes consumed stack items.
* **Parameters:**
  - `inst` -- fish entity being hammered
  - `worker` -- player/entity performing the work
  - `workleft` -- remaining work units
  - `workdone` -- work units completed this action
* **Returns:** None
* **Error states:** Errors if `inst` has no `stackable` or `lootdropper` components; errors if `LaunchAt` function is undefined.

### `fish_stack_size_changed(inst, data)`
* **Description:** Event handler for `stacksizechange` event on fish variants. Updates `workable` component's work left based on new stack size multiplied by `TUNING.SPOILED_FISH_WORK_REQUIRED`.
* **Parameters:**
  - `inst` -- fish entity
  - `data` -- event data table with `stacksize` field
* **Returns:** None
* **Error states:** None

### `GetFertilizerKey(inst)`
* **Description:** Returns the prefab name as the fertilizer research key. Used by `fertilizerresearchable` component to identify this fertilizer type.
* **Parameters:** `inst` -- entity instance
* **Returns:** string prefab name
* **Error states:** None.

### `fertilizerresearchfn(inst)`
* **Description:** Research function wrapper that calls `GetFertilizerKey`. Assigned to `fertilizerresearchable` component via `SetResearchFn`.
* **Parameters:** `inst` -- entity instance
* **Returns:** string fertilizer key from `GetFertilizerKey`
* **Error states:** None.

### `GetStatus(inst, viewer)`
* **Description:** Inspectable status function. Returns `"CAN_PROCESS"` if viewer has `eater` component and is a spoiled processor; returns `nil` otherwise.
* **Parameters:**
  - `inst` -- entity being inspected
  - `viewer` -- player/entity doing the inspecting
* **Returns:** `"CAN_PROCESS"` string or `nil`
* **Error states:** None

### `food_IsExposedToRain(inst, israining)`
* **Description:** Checks if `spoiled_food` entity is exposed to rain. Returns true if raining, entity has no `rainimmunity` component, and is not held in inventory.
* **Parameters:**
  - `inst` -- entity instance
  - `israining` -- boolean rain state (defaults to `TheWorld.state.israining` if nil)
* **Returns:** boolean
* **Error states:** Errors if `inst` has no `rainimmunity` or `inventoryitem` components (accessed without nil guards).

### `food_OnIsRaining(inst, israining)`
* **Description:** World state watcher callback for `israining`. Calls `disappears:PrepareDisappear()` if exposed to rain, otherwise calls `disappears:StopDisappear()`.
* **Parameters:**
  - `inst` -- entity instance
  - `israining` -- boolean rain state
* **Returns:** None
* **Error states:** None

### `food_OnRainImmunity(inst)`
* **Description:** Event handler for `gainrainimmunity` event and inventory put callback. Stops the disappear timer when entity gains rain immunity or is placed in inventory.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** None

### `food_OnRainVulnerable(inst)`
* **Description:** Event handler for `loserainimmunity` and `ondropped` events. Re-evaluates rain exposure by calling `food_OnIsRaining` with current world rain state.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** None

## Events & listeners
- **Listens to (spoiled_food):** `gainrainimmunity` -- stops disappear timer via `food_OnRainImmunity`
- **Listens to (spoiled_food):** `loserainimmunity` -- re-evaluates rain exposure via `food_OnRainVulnerable`
- **Listens to (spoiled_food):** `ondropped` -- re-evaluates rain exposure via `food_OnRainVulnerable`
- **Listens to (spoiled_fish, spoiled_fish_small):** `stacksizechange` -- updates work left via `fish_stack_size_changed`
- **Watches world state (spoiled_food):** `israining` -- triggers `food_OnIsRaining` when rain state changes
- **Pushes:** None identified in this file