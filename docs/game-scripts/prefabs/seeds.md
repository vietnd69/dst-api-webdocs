---
id: seeds
title: Seeds
description: Defines the 'seeds' and 'seeds_cooked' prefabs with associated components for use as raw or cooked food, bait, farm planting material, and ocean fishing lures.
tags: [inventory, farming, cooking, fishing, crafting]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8b343c32
system_scope: inventory
---

# Seeds

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `seeds.lua` file defines three prefabs: `seeds`, `seeds_cooked`, and `seeds_placer`. It centralizes the definition and configuration of raw and cooked seeds used as consumables, bait, farmable planting material, and ocean fishing lures. The file uses a shared `common()` helper to initialize base properties (inventory, stackable, edible, perishable, etc.) and specialized `raw()` and `cooked()` functions to customize behavior for each variant. A `seed_placer` prefab is also defined for deploying seeds in the world.

## Usage example
```lua
-- Create a raw seeds instance
local inst = SpawnPrefab("seeds")

-- Create a cooked seeds instance
local cooked_inst = SpawnPrefab("seeds_cooked")

-- Place seeds using the placer
local placer = SpawnPrefab("seeds_placer")
placer.Transform:SetPosition(x, y, z)
placer.components.placer:Place()
```

## Dependencies & tags
**Components used:** `inventoryitem`, `stackable`, `edible`, `cookable`, `tradable`, `inspectable`, `perishable`, `snowmandecor`, `bait`, `farmplantable`, `oceanfishingtackle`, `deployable`, `plantable`, `placer`, `floater`, `animstate`, `transform`, `network`

**Tags:** `deployedplant`, `deployedfarmplant`, `cookable`, `oceanfishing_lure`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `anim` | string | `"idle"` or `"cooked"` | Animation bank used by `AnimState` for the prefab. |
| `cookable` | boolean | `true` | Indicates whether the seed is raw and can be cooked. |
| `oceanfishing_lure` | boolean | `true` | Indicates whether the seed can be used as a fishing lure. |
| `inst.components.stackable.maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size for the item. |
| `inst.components.edible.healthvalue` | number | `0` (raw) or `TUNING.HEALING_TINY` (cooked) | Health restored per consumption. |
| `inst.components.edible.hungervalue` | number | `TUNING.CALORIES_TINY/2` | Hunger restored per consumption. |
| `inst.components.perishable.perishtime` | number | `TUNING.PERISH_SUPERSLOW` (raw) or `TUNING.PERISH_MED` (cooked) | Time until food spoils. |
| `inst.components.deployable.mode` | DEPLOYMODE | `DEPLOYMODE.CUSTOM` | Deployment mode used when planting. |
| `inst.components.plantable.growtime` | number | `TUNING.SEEDS_GROW_TIME` | Time in seconds for the plant to grow. |
| `inst.components.plantable.product` | function | `pickproduct` | Function that returns a random plant product name based on seed weights. |
| `inst.components.farmplantable.plant` | function | `pickfarmplant` | Function that returns the farm plant prefab name. |

## Main functions
### `common(anim, cookable, oceanfishing_lure)`
* **Description:** Shared constructor logic for all seed prefabs. Initializes base entity components, tags, animations, and global properties (e.g., sound, buoyancy). Sets up inventory, stackable, edible, tradable, inspectable, burnable, propagator, and perishable components. On the master simulation, adds components for cooking, fishing, deployment, and planting.
* **Parameters:**
  * `anim` (string) — Animation name to play in `AnimState`.
  * `cookable` (boolean) — If `true`, adds `cookable` tag and configures the `cookable` component.
  * `oceanfishing_lure` (boolean) — If `true`, adds `oceanfishing_lure` tag and configures the `oceanfishingtackle` component.
* **Returns:** The initialized `inst` entity.
* **Error states:** Returns early without component setup on non-master clients (if `TheWorld.ismastersim` is false).

### `raw()`
* **Description:** Builds the raw seeds prefab with functionality for planting, bait, and fishing. Adds `bait`, `farmplantable`, `deployable`, and `plantable` components. Sets `healthvalue` to `0` and `hungervalue` to a small amount. Configures custom deployment logic (`can_plant_seed`).
* **Parameters:** None.
* **Returns:** The initialized raw seeds entity.
* **Error states:** Returns early on non-master clients.

### `cooked()`
* **Description:** Builds the cooked seeds prefab with no planting or fishing functionality. Sets `healthvalue` and `hungervalue` to positive nutritional values and reduces `perishtime`.
* **Parameters:** None.
* **Returns:** The initialized cooked seeds entity.
* **Error states:** Returns early on non-master clients.

### `OnDeploy(inst, pt, deployer)`
* **Description:** Callback executed when raw seeds are deployed (planted). Spawns a `farm_plant_randomseed` prefab, places it at the deployment point, collapses the soil, and removes the seeds entity.
* **Parameters:**
  * `inst` (Entity) — The seeds entity being deployed.
  * `pt` (Vector3) — Deployment world position.
  * `deployer` (Entity) — Entity performing the deployment.
* **Returns:** Nothing.

### `pickproduct()`
* **Description:** Helper function that returns a random plant prefab name weighted by `seed_weight` defined in `VEGGIES`.
* **Parameters:** None.
* **Returns:** (string) — Name of a random viable plant prefab (e.g., `"carrot"`, `"cave_banana"`).

### `pickfarmplant()`
* **Description:** Helper function that always returns the generic random-seed farm plant prefab.
* **Parameters:** None.
* **Returns:** `"farm_plant_randomseed"` (string).

### `can_plant_seed(inst, pt, mouseover, deployer)`
* **Description:** Predicate function used by `deployable` to determine whether the seeds can be deployed at a given point.
* **Parameters:**
  * `inst` (Entity) — The seeds entity.
  * `pt` (Vector3) — Proposed deployment point.
  * `mouseover` (Entity?) — Entity under mouse (unused).
  * `deployer` (Entity) — Deploying entity.
* **Returns:** (boolean) — `true` if soil at `pt` can be tilled.
* **Error states:** Returns `false` if terrain at `pt` is not tillable.

### `update_seed_placer_outline(inst)`
* **Description:** Callback used by the `placer` component to update the visual outline for seed placement. Shows the outline only if the cursor is over tillable soil.
* **Parameters:**
  * `inst` (Entity) — The `seeds_placer` entity.
* **Returns:** Nothing.

### `seed_placer_postinit(inst)`
* **Description:** Initializes visual and behavioral hooks for the `seeds_placer` prefab, including spawning and configuring the soil placement outline.
* **Parameters:**
  * `inst` (Entity) — The `seeds_placer` entity.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onremove` (on `inst.outline`) — Cleans up the outline reference in `seeds_placer` when the outline is removed.
- **Pushes:** `on_planted` — Pushed on the spawned farm plant when seeds are deployed; provides planting context (`in_soil`, `doer`, `seed`).