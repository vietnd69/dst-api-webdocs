---
id: veggies
title: Veggies
description: Generates prefabs and logic for vegetables, their cooked/dried variants, oversized variants with weight-based physics and equippable functionality, and seed deployment mechanics.
tags: [crop, cooking, equipment, inventory, weight]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e3521812
system_scope: entity
---

# Veggies

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
The `veggies.lua` file defines a collection of prefab factories and helper functions for generating vegetable entities in Don't Starve Together. It supports multiple variants (fresh, cooked, dried, oversized) and integrates deeply with the ECS via components such as `edible`, `cookable`, `dryable`, `deployable`, `farmplantable`, `equippable`, `heavyobstaclephysics`, `waxable`, `workable`, `lootdropper`, `perishable`, and `halloweenmoonmutable`. oversized vegetables are treated as heavy, equippable items with weight-based physics, and some (e.g., carrots) support activation animations and spinning. The system also includes season-specific behavior (e.g., waxing, rotting, and Halloween moon mutation), as well as save/load synchronization.

## Usage example
```lua
-- Generate prefabs for a standard seeded vegetable (e.g., carrot)
local carrot_prefabs = require("prefabs/veggies").MakeVeggie("carrot", true)

-- Use MakeVegStats to define custom vegetable nutrition and behavior
local custom_stats = MakeVegStats(
    1,             -- seedweight
    2,             -- hunger
    1,             -- health
    4 * 60,        -- perish_time (4 minutes)
    0.5,           -- sanity
    5,             -- cooked_hunger
    2,             -- cooked_health
    8 * 60,        -- cooked_perish_time
    1,             -- cooked_sanity
    {0.8, -1, 1},  -- float_settings
    {1.0, -1, 1},  -- cooked_float_settings
    {              -- dryable config
        build = "carrot_dried",
        hunger = 3,
        health = 1,
        sanity = 0,
        perish = 16 * 60,
        time = 6 * 60
    },
    nil,          -- secondary_foodtype
    nil,          -- halloweenmoonmutable_settings
    nil,          -- lure_data
    true          -- issnowmandecor
)

-- Deploy a seed to plant
local planted = OnDeploy(seed_inst, {x=10, y=0, z=10}, player)
```

## Dependencies & tags
**Components used:** `activatable`, `burnable`, `cookable`, `crop`, `deployable`, `driedsalticon`, `dryable`, `edible`, `equippable`, `farmplantable`, `halloweenmoonmutable`, `heavyobstaclephysics`, `inspectable`, `inventory`, `inventoryitem`, `lootdropper`, `mightygym`, `oceanfishingtackle`, `perishable`, `pickable`, `plantable`, `pumpkincarvable`, `repairer`, `stackable`, `symbolswapdata`, `timer`, `waxable`, `weighable`, `workable`

**Tags:**
- `cookable`, `deployedplant`, `deployedfarmplant`, `oceanfishing_lure`, `dryable`, `weighable_OVERSIZEDVEGGIES`, `heavy`, `waxable`, `oversized_veggie`, `show_spoilage`, `farm_plant_killjoy`, `pickable_harvest_str`, `pickable`, `monkeyqueenbribe`, `waxed`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `self.product` (Cookable) | string or table | `nil` | Product prefab(s) resulting from cooking. |
| `self.buildfile` (Dryable) | string | `nil` | Prefab name for the dried version. |
| `self.drytime` (Dryable) | number | `nil` | Time in seconds to dry the item. |
| `self.product` (Dryable) | string | `nil` | Product prefab resulting from drying. |
| `self.foodtype` (Edible) | FOODTYPE | `FOODTYPE.GENERIC` | Type of food for compatibility checks. |
| `self.healthvalue` (Edible) | number | `10` | Health restored per unit. |
| `self.hungervalue` (Edible) | number | `10` | Hunger restored per unit. |
| `self.sanityvalue` (Edible) | number | `0` | Sanity restored/delta per unit. |
| `self.secondaryfoodtype` (Edible) | FOODTYPE | `nil` | Secondary food type for multi-type food. |
| `self.temperaturedelta` (Edible) | number | `0` | Temperature change applied. |
| `self.temperatureduration` (Edible) | number | `0` | Duration of temperature effect. |
| `self.plant` (FarmPlantable) | string | `nil` | Plant prefab that results from planting. |
| `self.onmutatefn` (HalloweenMoonMutable) | function | `nil` | Callback when mutated by moon phase. |
| `self.prefab_mutated` (HalloweenMoonMutable) | string | `nil` | Prefab name after mutation. |
| `self.maxradius` (HeavyObstaclePhysics) | number | `nil` | Radius for physics collision. |
| `self.nameoverride` (Inspectable) | string | `nil` | Override display name. |
| `self.onperishreplacement` (Perishable) | string | `nil` | Prefab to spawn on spoilage. |
| `self.product` (Plantable) | string | `nil` | Product (e.g., raw veggie) harvested. |
| `self.growtime` (Plantable) | number | `120` | Time in seconds to fully grow. |
| `self.healthrepairvalue` (Repairer) | number | `0` | Health points repaired. |
| `self.perishrepairpercent` (Repairer) | number | `0` | Perish time repair fraction (0–1). |
| `self.repairmaterial` (Repairer) | string | `nil` | Material used for repair. |
| `self.maxsize` (Stackable) | number | `TUNING.STACK_SIZE_MEDITEM` | Max stack size. |
| `self.ondeploy` (Deployable) | function | `nil` | Callback on deployment. |
| `self.mode` (Deployable) | string | `nil` | Deployment mode (e.g., `"farm"`). |
| `self.lure_data` (OceanFishingTackle) | table | `nil` | Lure config for ocean fishing. |
| `self.lure_setup` (OceanFishingTackle) | table | `nil` | Full setup data for the lure. |
| `self.weight` (Weighable) | number | `nil` | Weight value. |
| `self.min_weight` (Weighable) | number | `nil` | Minimum weight threshold. |
| `self.max_weight` (Weighable) | number | `nil` | Maximum weight threshold. |
| `self.type` (Weighable) | string | `nil` | Weight type descriptor. |

## Main functions

### `MakeVegStats(seedweight, hunger, health, perish_time, sanity, cooked_hunger, cooked_health, cooked_perish_time, cooked_sanity, float_settings, cooked_float_settings, dryable, secondary_foodtype, halloweenmoonmutable_settings, lure_data, issnowmandecor)`
* **Description:** Generates a flat stats table used to populate the global `VEGGIES` registry. This table normalizes vegetable attributes for fresh and cooked states, and configures optional features like drying, fishing lures, waxing, and snowman decoration eligibility.
* **Parameters:**
  - `seedweight`: Number or `0`; used as `seed_weight` in returned table. If `0`, vegetable is seedless.
  - `hunger`, `health`, `sanity`, `perish_time`: Fresh state values.
  - `cooked_hunger`, `cooked_health`, `cooked_sanity`, `cooked_perish_time`: Cooked state values.
  - `float_settings`: Optional array `{size, float_min, float_max}` for fresh floatability config.
  - `cooked_float_settings`: Optional array for cooked floatability.
  - `dryable`: Optional table with keys `build`, `hunger`, `health`, `sanity`, `perish`, `time`.
  - `secondary_foodtype`: Optional `FOODTYPE` constant.
  - `halloweenmoonmutable_settings`: Optional table with `prefab` and `onmutatefn`.
  - `lure_data`: Optional table for ocean fishing lure config.
  - `issnowmandecor`: Boolean indicating snowman decoration eligibility.
* **Returns:** Table with keys matching parameters: `seed_weight`, `hunger`, `health`, `perish_time`, `sanity`, `cooked_hunger`, `cooked_health`, `cooked_perish_time`, `cooked_sanity`, `float_settings`, `cooked_float_settings`, `dryable`, `secondary_foodtype`, `halloweenmoonmutable`, `lure_data`, `issnowmandecor`.

### `can_plant_seed(inst, pt, mouseover, deployer)`
* **Description:** Validates whether a seed can be planted at a given point by checking terrain tilling permissions.
* **Parameters:**
  - `inst`: Seed instance (unused; present for signature compatibility).
  - `pt`: Point table `{x, y, z}` where planting is attempted.
  - `mouseover`, `deployer`: Unused.
* **Returns:** Boolean: `true` if `TheWorld.Map:CanTillSoilAtPoint(x, 0, z, true)` returns `true`.

### `OnDeploy(inst, pt, deployer)`
* **Description:** Plants a seed by spawning its associated plant prefab at the specified point, collapsing soil, and removing the seed instance. Fires the `on_planted` event for other systems.
* **Parameters:**
  - `inst`: Seed instance being deployed.
  - `pt`: Point table `{x, y, z}`.
  - `deployer`: Player deploying the seed (unused beyond presence check).
* **Returns:** None (side-effect only).

### `oversized_calcweightcoefficient(name)`
* **Description:** Computes a weight coefficient (0–1) for oversized vegetables, optionally using a weighted average of two random values for reduced variance when defined in `PLANT_DEFS[name].weight_data[3]`.
* **Parameters:**
  - `name`: Vegetable name; used to look up `PLANT_DEFS[name].weight_data`.
* **Returns:** Float between 0 and 1. Defaults to `math.random()`. If `weight_data[3]` exists and `math.random() < 0.75`, returns `(math.random() + math.random()) / 2`.

### `oversized_onequip(inst, owner)`
* **Description:** Equips an oversized veggie (e.g., as a helmet); overrides the owner's animation symbol to display the veggie.
* **Parameters:**
  - `inst`: Oversized veggie instance.
  - `owner`: Entity wearing the item.
* **Returns:** None (calls `owner.AnimState:OverrideSymbol`).

### `oversized_onunequip(inst, owner)`
* **Description:** Unequips an oversized veggie; clears any overridden symbol on the owner.
* **Parameters:**
  - `inst`, `owner`: Same as above.
* **Returns:** None.

### `oversized_onfinishwork(inst, chopper)`
* **Description:** Harvest callback when hammering finishes. Drops loot (e.g., veggie and seeds), then destroys the instance.
* **Parameters:**
  - `inst`: Oversized veggie instance.
  - `chopper`: Entity doing the hammering (unused beyond availability).
* **Returns:** None.

### `oversized_onburnt(inst)`
* **Description:** Handles loot drop when an oversized veggie is burnt.
* **Parameters:** `inst`.
* **Returns:** None (calls `lootdropper:DropLoot`, then destroys instance).

### `oversized_makeloots(inst, name)`
* **Description:** Generates a deterministic loot array for oversized veggies.
* **Parameters:**
  - `inst`: Unused.
  - `name`: Vegetable name used to construct `product` and `seeds` strings.
* **Returns:** Array of 5 items: `{product, product, seeds, seeds, ?product or ?seeds}`. Third seed entry is `product` with 25% probability, otherwise `seeds`.

### `oversized_onperish(inst)`
* **Description:** Spoilage handler. If the instance is on a `mightygym`, spawns a `_rotten` variant and loads it onto the gym. Otherwise, spawns `spoiled_food`.
* **Parameters:** `inst`.
* **Returns:** None.

### `Seed_GetDisplayName(inst)`
* **Description:** Returns the localized name of the associated plant if both the seed and plant are registered in `VEGGIES` and `PLANT_DEFS`.
* **Parameters:** `inst`: Seed instance.
* **Returns:** String or `nil`.

### `Oversized_OnSave(inst, data)`
* **Description:** Serializes oversized veggie state for save/load.
* **Parameters:**
  - `inst`, `data`: Save data table to mutate.
* **Returns:** None.

### `Oversized_OnPreLoad(inst, data)`
* **Description:** Loads and applies persisted oversized veggie state.
* **Parameters:**
  - `inst`, `data`.
* **Returns:** None.

### `displayadjectivefn(inst)`
* **Description:** Returns `"WAXED"` for waxed oversized veggies using `STRINGS.UI.HUD.WAXED`.
* **Parameters:** `inst`.
* **Returns:** `"WAXED"`.

### `dowaxfn(inst, doer, waxitem)`
* **Description:** Waxing callback. Spawns `_waxed` variant, updates inventory slots if applicable, and removes the original.
* **Parameters:**
  - `inst`: Original veggie.
  - `doer`: Entity applying wax (unused beyond availability).
  - `waxitem`: Wax item (unused beyond availability).
* **Returns:** `true`.

### `CancelWaxTask(inst)`
* **Description:** Cancels any pending wax animation task.
* **Parameters:** `inst`.
* **Returns:** None.

### `StartWaxTask(inst)`
* **Description:** Schedules wax animation after 20–40 seconds if the instance is not in limbo and no task is pending.
* **Parameters:** `inst`.
* **Returns:** None.

### `PlayWaxAnimation(inst)`
* **Description:** Plays `wax_oversized` animation, then `idle_oversized`.
* **Parameters:** `inst`.
* **Returns:** None.

### `Carrot_StartSpinning(inst, time)`
* **Description:** Starts spinning animation for carrots; plays loops and sets a timer.
* **Parameters:**
  - `inst`: Carrot instance.
  - `time`: Optional duration override (default `2` seconds).
* **Returns:** None.

### `Carrot_StopSpinning(inst)`
* **Description:** Stops spinning; resets rotation, animation state, and timer; sets inactive flag.
* **Parameters:** `inst`.
* **Returns:** None.

### `Carrot_TimerDone(inst, data)`
* **Description:** Timer callback triggered when spinning completes; spawns spinner FX, resets rotation, and marks inactive.
* **Parameters:**
  - `inst`: Carrot instance.
  - `data`: Event data; only processes if `data.name == "spin"`.
* **Returns:** None.

### `Carrot_GetActivateVerb()`
* **Description:** Returns the verb string used for the carrot’s activatable action.
* **Parameters:** None.
* **Returns:** `"SPIN"`.

### `Carrot_OnActivated(inst)`
* **Description:** Activation callback; triggers spinning via `inst:Spin()` (alias for `Carrot_StartSpinning`).
* **Parameters:** `inst`.
* **Returns:** None.

### `MakeVeggie(name, has_seeds)`
* **Description:** Main prefab factory. Returns a table of one to seven prefabs: pristine seed/fresh, cooked, dried (if `dryable` config exists), and oversized variants (if `has_seeds` is true). Uses global `VEGGIES` and `PLANT_DEFS` tables for stats and configuration.
* **Parameters:**
  - `name`: Vegetable name (e.g., `"carrot"`).
  - `has_seeds`: Boolean; if false, omits seeds and oversized variants.
* **Returns:** `{Prefab, ...}`.

## Events & listeners
- **Listens to:**
  - `timerdone`: Handled by `Carrot_TimerDone`; triggers spinning animation completion.
  - `onputininventory`: Handled by `CancelWaxTask`; cancels pending wax tasks when item is put into inventory.
  - `ondropped`: Handled by `StartWaxTask`; starts wax animation timer when item is dropped.
- **Pushes:**
  - `on_planted`: Fired by `OnDeploy` after successfully planting a seed.
