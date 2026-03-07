---
id: rock_avocado_fruit
title: Rock Avocado Fruit
description: Manages the lifecycle and interactivity of rock avocado plant variants, including harvesting, cooking, planting, and growth.
tags: [plant, loot, growth, cooking, deployment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 808df3b9
system_scope: world
---

# Rock Avocado Fruit

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `rock_avocado_fruit` script defines six prefabs representing different growth stages of the rock avocado plant: unripe ("full"), ripe, cooked, sprout (seed), and sapling (planted sprout). It implements core gameplay interactions such as mining (harvesting) unripe fruits, cooking ripe fruits, planting sprouts to grow into bushes, and handling growth timers and burn interactions. The prefabs rely heavily on components like `workable`, `edible`, `perishable`, `stackable`, `deployable`, `lootdropper`, `burnable`, and `timer`.

## Usage example
```lua
-- Example: Harvest an unripe rock avocado fruit
local fruit = SpawnPrefab("rock_avocado_fruit")
fruit.components.stackable:SetStackSize(3) -- stack of 3
fruit.components.workable:SetWorkLeft(3 * TUNING.ROCK_FRUIT_MINES)

-- Example: Cook a ripe rock avocado fruit
local ripe = SpawnPrefab("rock_avocado_fruit_ripe")
ripe:AddComponent("cookable")
ripe.components.cookable.product = "rock_avocado_fruit_ripe_cooked"
ripe:PushEvent("cook") -- triggers cooking logic

-- Example: Deploy a sprout to grow a bush
local sprout = SpawnPrefab("rock_avocado_fruit_sprout")
sprout.components.deployable.ondeploy(sprout, Vector3(0, 0, 0)) -- spawns sapling and removes sprout
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `stackable`, `tradable`, `workable`, `edible`, `bait`, `perishable`, `cookable`, `burnable`, `lootdropper`, `deployable`, `timer`, `soundemitter`, `minimapentity`, `transform`, `animstate`, `network`

**Tags:** Adds `molebait`, `quakedebris`, `cookable`, `deployedplant`. Checks `burnt` (via `lootdropper`), `burnable`, `structure` (via `lootdropper`), and `hive` (via `lootdropper`).

## Properties
No public properties are directly defined or exposed in this file's prefabs. All properties are set via component methods or referenced tunables.

## Main functions
### `rock_avocado_fruit_full()`
*   **Description:** Constructor for the unripe ("rockhard") rock avocado fruit. Handles mining interactions, loot spawning based on tunable odds, and sound effects.
*   **Parameters:** None (used internally as prefab factory function).
*   **Returns:** `inst` (Entity) — the initialized unripe fruit entity.
*   **Error states:** Returns early on non-master clients (`TheWorld.ismastersim == false`) to avoid duplicate entity creation.

### `rock_avocado_fruit_ripe()`
*   **Description:** Constructor for the ripe rock avocado fruit. Includes perishability, cooking capability, and edible properties.
*   **Parameters:** None (used internally as prefab factory function).
*   **Returns:** `inst` (Entity) — the initialized ripe fruit entity.
*   **Error states:** Returns early on non-master clients.

### `rock_avocado_fruit_ripe_cooked()`
*   **Description:** Constructor for the cooked version of the ripe fruit. Similar to ripe fruit but with higher hunger/health, slower perish, and burn behavior.
*   **Parameters:** None (used internally as prefab factory function).
*   **Returns:** `inst` (Entity) — the initialized cooked fruit entity.
*   **Error states:** Returns early on non-master clients.

### `rock_avocado_fruit_sprout()`
*   **Description:** Constructor for the sprout (seed) variant. Designed to be planted using the `deployable` component.
*   **Parameters:** None (used internally as prefab factory function).
*   **Returns:** `inst` (Entity) — the initialized sprout entity.
*   **Error states:** Returns early on non-master clients.

### `rock_avocado_fruit_sprout_sapling()`
*   **Description:** Constructor for the planted sprout (sapling) that grows into a rock avocado bush over time. Handles timer-based growth and burn interaction.
*   **Parameters:** None (used internally as prefab factory function).
*   **Returns:** `inst` (Entity) — the initialized sapling entity.
*   **Error states:** Returns early on non-master clients.

### `on_mine(inst, miner, workleft, workdone)`
*   **Description:** Callback for the `workable` component when mining completes. Calculates loot quantities based on tunables, spawns items with correct stacking and launch physics, and consumes the mined portion of the stack.
*   **Parameters:**  
  `inst` (Entity) — the rock fruit entity being mined.  
  `miner` (Entity) — the entity performing the mining action.  
  `workleft` (number) — remaining work required (unused in function).  
  `workdone` (number) — cumulative work performed so far.
*   **Returns:** Nothing.
*   **Error states:** Uses `math.clamp` to prevent zero or negative fruit counts; loot spawning and stack splitting are performed robustly.

### `OnExplosion_rock_avocado_fruit_full(inst, data)`
*   **Description:** Event handler for explosions. Kicks the fruit toward the explosion source if the inst is the unripe variant and a valid explosion is detected.
*   **Parameters:**  
  `inst` (Entity) — the rock fruit entity.  
  `data` (table) — explosion event data containing `explosive` field.
*   **Returns:** Nothing.
*   **Error states:** No-op if `miner` (explosive source) is `nil`.

### `stack_size_changed(inst, data)`
*   **Description:** Event listener for `stacksizechange`. Updates the `workable` component's remaining work when the stack size changes.
*   **Parameters:**  
  `inst` (Entity) — the rock fruit entity.  
  `data` (table) — contains `stacksize` field.
*   **Returns:** Nothing.
*   **Error states:** No-op if `workable` component is missing.

### `dig_sprout(inst, digger)`
*   **Description:** Callback for the `workable` component when the sapling (sprout) is dug up. Drops the sprout back as loot and removes the entity.
*   **Parameters:**  
  `inst` (Entity) — the sapling entity.  
  `digger` (Entity) — the entity performing the dig action.
*   **Returns:** Nothing.

### `grow_anim_over(inst)`
*   **Description:** Event handler for animation completion (`animover`). Spawns a `rock_avocado_bush` at the current location and removes the sapling.
*   **Parameters:** `inst` (Entity) — the sapling entity.
*   **Returns:** Nothing.

### `on_grow_timer_done(inst, data)`
*   **Description:** Timer callback that triggers growth animation upon timer expiry. Registers `animover` handler and plays growth animation.
*   **Parameters:**  
  `inst` (Entity) — the sapling entity.  
  `data` (table) — timer data containing `name`.
*   **Returns:** Nothing.
*   **Error states:** No-op if timer name is not `"grow"`.

### `start_sprout_growing(inst)`
*   **Description:** Starts the growth timer for the sapling if not already running.
*   **Parameters:** `inst` (Entity) — the sapling entity.
*   **Returns:** Nothing.

### `stop_sprout_growing(inst)`
*   **Description:** Stops the growth timer (typically called on ignition).
*   **Parameters:** `inst` (Entity) — the sapling entity.
*   **Returns:** Nothing.

### `on_deploy_fn(inst, position)`
*   **Description:** Deploy callback for sprout items. Consumes the sprout stack and spawns a sapling at the given position.
*   **Parameters:**  
  `inst` (Entity) — the sprout entity.  
  `position` (Vector3) — deployment location.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `stacksizechange` — triggers `stack_size_changed` to update work left.  
  - `explosion` — triggers `OnExplosion_rock_avocado_fruit_full` for unripe fruit knockback.  
  - `timerdone` — triggers `on_grow_timer_done` for sapling growth.  
  - `animover` — triggers `grow_anim_over` after growth animation completes.
- **Pushes:**  
  - `imagechange` — via `inventoryitem:ChangeImageName()`.  
  - `stacksizechange` — via `stackable:SetStackSize()`.  
  - `entity_droploot` — via `lootdropper:DropLoot()`.