---
id: furniture_tables
title: Furniture Tables
description: Defines shared logic and prefab templates for wooden and stone tables, including decor handling, burning behavior, and hammer interaction.
tags: [furniture, crafting, fire, loot]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ab122e14
system_scope: entity
---

# Furniture Tables

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
This file implements reusable logic for crafting tables (wood and stone variants) in DST. It defines the entity construction function via `AddTable`, setting up components like `furnituredecortaker`, `lootdropper`, `workable`, and `burnable`. The component logic primarily supports decor item placement/removal, burning behavior (including item transmutation on fire), and hammering collapse mechanics.

## Usage example
This file is not intended for direct runtime use; it is a prefab generator called during world initialization to produce prefabs like `wood_table_round`. A modder would reference these prefabs directly:
```lua
local table_prefab = "wood_table_round"
local inst = SpawnPrefab(table_prefab)
```

## Dependencies & tags
**Components used:** `furnituredecortaker`, `inspectable`, `lootdropper`, `savedrotation`, `workable`, `burnable`, `propagator`, `health` (via `MakeMediumBurnable` and `MakeMediumPropagator`), `hauntable` (via `MakeHauntableWork`), `obstacle` (via `MakeObstaclePhysics`).

**Tags added:** `decortable`, `structure`.

## Properties
No public properties are defined in this file. The file is a prefab generator and does not define a reusable component class.

## Main functions
The file defines helper functions used during entity construction and lifecycle, not component methods. Each is internal to the file.

### `GetStatus(inst)`
*   **Description:** Returns a status string for the table based on its state: `"BURNT"` if burnt, `"HAS_ITEM"` if holding decor, or `nil`.
*   **Parameters:** `inst` (Entity) — the table instance.
*   **Returns:** String or `nil`.

### `AbleToAcceptDecor(inst, item, giver)`
*   **Description:** Predicate determining whether the table can accept a decor item. Currently always returns `true` if `item` is non-`nil`.
*   **Parameters:** `inst` (Entity), `item` (Entity or `nil`), `giver` (Entity or `nil`).
*   **Returns:** Boolean (`true` if `item` is non-`nil`).

### `OnDecorGiven(inst, item, giver)`
*   **Description:** Callback triggered when decor is placed on the table. Plays a sound, deactivates physics, and starts following the table’s symbol.
*   **Parameters:** `inst` (Entity), `item` (Entity), `giver` (Entity or `nil`).
*   **Returns:** Nothing.

### `OnDecorTaken(inst, item)`
*   **Description:** Callback triggered when decor is removed. Reactivates physics and stops following.
*   **Parameters:** `inst` (Entity), `item` (Entity or `nil`).
*   **Returns:** Nothing.

### `TossDecorItem(inst)`
*   **Description:** Removes the decor item from the table and flings it at a default velocity.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `OnHammer(inst, worker, workleft, workcount)`
*   **Description:** Plays the "hit" animation when the table is hammered.
*   **Parameters:** `inst` (Entity), `worker` (Entity), `workleft` (number), `workcount` (number).
*   **Returns:** Nothing.

### `OnHammered(inst, worker)`
*   **Description:** Collapses the table on hammer completion: spawns collapse FX, drops loot, tosses decor, and removes the table.
*   **Parameters:** `inst` (Entity), `worker` (Entity).
*   **Returns:** Nothing.

### `OnBuilt(inst)`
*   **Description:** Plays the "place" animation and a sound upon construction.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `on_ignite(inst, source, doer)`
*   **Description:** Custom ignite handler: stores whether the fire was controlled, then calls `DefaultBurnFn`.
*   **Parameters:** `inst` (Entity), `source` (Entity), `doer` (Entity).
*   **Returns:** Nothing.

### `on_extinguish(inst)`
*   **Description:** Custom extinguish handler: clears controlled-burn flag, then calls `DefaultExtinguishFn`.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `OnBurnt(inst)`
*   **Description:** Handles burnt event: takes and flings decor item, ignites the decor if not controlled-burn, and disables decor acceptance.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `OnSave(inst, data)`
*   **Description:** Saves burnt status and controlled-burn flag to persistence data.
*   **Parameters:** `inst` (Entity), `data` (table).
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Restores the controlled-burn flag on entity load.
*   **Parameters:** `inst` (Entity), `data` (table or `nil`).
*   **Returns:** Nothing.

### `OnLoadPostPass(inst, newents, data)`
*   **Description:** Triggers the `onburnt` event and `onburnt` callback if the saved data indicates burnt state. Must run after decor component has loaded.
*   **Parameters:** `inst` (Entity), `newents` (table), `data` (table or `nil`).
*   **Returns:** Nothing.

### `AddTable(results, prefab_name, data)`
*   **Description:** Core table constructor. Builds and registers a table prefab with components, event listeners, and callbacks based on `data`.
*   **Parameters:** `results` (table) — output list of prefabs; `prefab_name` (string); `data` (table) — configuration (e.g., `bank`, `build`, `burnable`).
*   **Returns:** Nothing (modifies `results` in place).

## Events & listeners
- **Listens to:** `ondeconstructstructure` — calls `TossDecorItem`; `onbuilt` — calls `OnBuilt`; `onburnt` — calls `OnBurnt`.
- **Pushes:** None directly (event callbacks are triggered externally).
