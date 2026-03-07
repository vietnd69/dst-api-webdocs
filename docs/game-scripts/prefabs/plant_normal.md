---
id: plant_normal
title: Plant Normal
description: Implements lifecycle and interaction logic for growing crops and their ground variants, including maturation, withering, harvesting, burning, and rotting behaviors.
tags: [crop, environment, harvesting, fire, world]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 57b6e8ff
system_scope: world
---

# Plant Normal

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`plant_normal.lua` defines two core prefabs — `plant_normal` (a standalone growing plant) and `plant_normal_ground` (a ground-based plot that supports crop growth and rotting) — along with associatedFX prefabs. It coordinates components such as `crop`, `witherable`, `workable`, `hauntable`, and `burnable` to manage growth stages, harvesting, decomposition, and transformation under environmental effects (e.g., fire, Halloween moon). The plant prefabs are parameterized via `MakePlant()` to support various vegetable types.

## Usage example
This component logic is embedded in prefabs, not used as a standalone component. A typical modder would extend it by overriding behavior hooks in `VEGGIES` or by listening to its events.

```lua
-- Example: Creating a custom plant with unique rotting time
local plant = SpawnPrefab("plant_normal")
plant.components.crop.product_prefab = "my_custom_veggie"
-- The plant will automatically register rotting and mutation logic via MakePlant.
```

## Dependencies & tags
**Components used:** `crop`, `witherable`, `inspectable`, `workable`, `hauntable`, `burnable`, `timer`, `fertilizer`, `perishable`, `cookable`, `stackable`, `inventoryitem`, `halloweenmoonmutable`  
**Tags:** `NPC_workable`, `witherable`, `FX`, `NOCLICK`, `rotten`

## Properties
No public properties — this is a prefab factory, not a component.

## Main functions
### `MakePlant(name, build, isground)`
*   **Description:** Creates and returns a Prefab definition for either a plant (`isground = false`) or a ground plot (`isground = true`). Initializes components, sets up callbacks for maturation, withering, burning, and rotting.
*   **Parameters:**  
    `name` (string) — prefab name (e.g., `"plant_normal"`).  
    `build` (string) — base animation bank/build name.  
    `isground` (boolean) — whether to create the ground plot version with rotting support.
*   **Returns:** `Prefab` instance.

### `MakeRotten(inst, instant)`
*   **Description:** Transforms the instance into a rotten state: sets the `rotten` tag, overrides the name to `"spoiled_food"`, forces withering, clears `swap_grown` symbol, and plays the `rotten` animation.
*   **Parameters:**  
    `inst` (Entity) — the ground plant instance.  
    `instant` (boolean) — if `true`, animation skips to full progress (`SetPercent("rotten", 1)`); otherwise, plays the animation normally.
*   **Returns:** Nothing.

### `onmatured(inst)`
*   **Description:** Called when the crop completes growth. Updates visual override, stops work action, registers Halloween mutation support, and starts a rotting timer.
*   **Parameters:**  
    `inst` (Entity) — the plant instance.
*   **Returns:** Nothing.

### `onwithered(inst)`
*   **Description:** Called when the crop withers. Clears the `swap_grown` symbol and stops the rotting timer.
*   **Parameters:**  
    `inst` (Entity) — the plant instance.
*   **Returns:** Nothing.

### `onharvest(inst, product, doer)`
*   **Description:** Called on successful harvest. Adjusts the product's perishability based on elapsed rotting time.
*   **Parameters:**  
    `inst` (Entity) — the plant instance.  
    `product` (Entity) — the harvested item.  
    `doer` (Entity) — the harvester (e.g., player).
*   **Returns:** Nothing.

### `onburnt(inst)`
*   **Description:** Called when the plant is burnt. Spawns a burnt product (ash, cooked seeds, or cooked veggie) respecting product cookability and perish state. Removes the plant from its grower and deletes the instance.
*   **Parameters:**  
    `inst` (Entity) — the burnt plant instance.
*   **Returns:** Nothing.

### `OnDigUp(inst)`
*   **Description:** Handles dig-up actions: harvests if mature/ready, otherwise digs up the plant with appropriate FX and size based on growth percent. Removes the plant from the grower if applicable.
*   **Parameters:**  
    `inst` (Entity) — the plant instance.
*   **Returns:** Nothing.

### `GetStatus(inst)`
*   **Description:** Returns a status string indicating the current state: `"WITHERED"`, `"READY"`, or `"GROWING"`.
*   **Parameters:**  
    `inst` (Entity) — the plant instance.
*   **Returns:** `"WITHERED"`, `"READY"`, or `"GROWING"`.

### `OnHaunt(inst, haunter)`
*   **Description:** Handles haunt interactions: fertilizes if not mature/withered (using `spoiled_food`), or destroys if ready for harvest.
*   **Parameters:**  
    `inst` (Entity) — the plant instance.  
    `haunter` (Entity) — the haunter actor.
*   **Returns:** `true` if haunt had an effect, otherwise `false`.

### `OnTimerDone(inst, data)`
*   **Description:** Event handler for timer expiration. Triggers `MakeRotten` when the `"rotting"` timer ends.
*   **Parameters:**  
    `inst` (Entity) — the ground plant instance.  
    `data` (table) — timer data, must contain `{name = "rotting"}`.
*   **Returns:** Nothing.

### `OnSave(inst, data)`
*   **Description:** Saves rotting state to save data.
*   **Parameters:**  
    `inst` (Entity) — the instance.  
    `data` (table) — save data table.
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Restores rotting state from save data.
*   **Parameters:**  
    `inst` (Entity) — the instance.  
    `data` (table) — loaded save data.
*   **Returns:** Nothing.

### `SpawnDugFX(inst, size)`
*   **Description:** Helper to spawn dig-up FX prefabs, overriding symbol for non-ground plants.
*   **Parameters:**  
    `inst` (Entity) — the plant instance.  
    `size` (string) — one of `"small"`, `"medium"`, `"large"`.
*   **Returns:** `Entity` — the spawned FX instance.

### `CalcPerish(inst, product)`
*   **Description:** Computes the spoiled percentage for a harvested product based on remaining rotting time.
*   **Parameters:**  
    `inst` (Entity) — the plant instance.  
    `product` (Entity) — the product to calculate spoilage for.
*   **Returns:** number — a value between `0` and `1`, where `1` means fully spoiled.

## Events & listeners
- **Listens to:** `timerdone` — triggers `OnTimerDone` to start rotting.  
- **Listens to:** `onhalloweenmoonmutate` — resets crop growth and removes from grower during moon mutation.  
- **Pushes:** None directly — interacts via component events (e.g., `burnable`, `crop`).