---
id: grassgator
title: Grassgator
description: Manages the behavior, stats, movement, and state persistence of the Grassgator entity in DST.
tags: [combat, ai, creature, sleep, water]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 41100fce
system_scope: entity
---

# Grassgator

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The Grassgator is a prefab definition for a large amphibious animal that patrols grasslands and shallow waters. It uses an ECS design with multiple components to manage combat, health, loot drops, movement, sleep behavior, and environmental adaptation. It interacts with terrain depth (e.g., avoiding deep water) and coordinates with nearby Grassgators to share aggro. The prefab supports persistence across saves and entity sleep cycles.

## Usage example
This is a prefab definition, so it is instantiated via the prefab system:
```lua
local inst = Prefab("grassgator", create_base, assets, prefabs)
local gator = TheWorld:SpawnPrefab("grassgator")
gator.Transform:SetPosition(x, y, z)
```
Components like `combat`, `health`, `locomotor`, and `sleeper` are attached and configured automatically in `create_base`.

## Dependencies & tags
**Components used:** `eater`, `combat`, `health`, `lootdropper`, `inspectable`, `knownlocations`, `timer`, `saltlicker`, `locomotor`, `sleeper`, `embarker`, `amphibiouscreature`, `burnable`, `freezable`, `hauntable`.  
**Tags:** Adds `grassgator`, `animal`, `largecreature`, `saltlicker`. Checks `burnt`, `player`, `debuffed` (via `IsDead`).

## Properties
No public properties are initialized as direct fields in the constructor. Functional state is managed internally (e.g., `shed_ready`, `landspeed`) or via component APIs.

## Main functions
### `create_base()`
*   **Description:** Constructor function that initializes the Grassgator entity with all necessary components, physics, animations, and behaviors. It configures combat stats, loot, movement (including water adaptation), sleep logic, and saves/loads support. Returns the fully built `inst`.
*   **Parameters:** None.
*   **Returns:** `inst` (Entity) — the constructed Grassgator entity.

### `ShouldWakeUp(inst)`
*   **Description:** Sleep test function determining if the Grassgator should wake. Returns true if the default wake test passes or a player is within `WAKE_TO_RUN_DISTANCE`.
*   **Parameters:** `inst` (Entity) — the Grassgator entity.
*   **Returns:** `boolean`.

### `ShouldSleep(inst)`
*   **Description:** Sleep test function determining if the Grassgator should fall asleep. Returns true if the default sleep test passes and no player is within `SLEEP_NEAR_ENEMY_DISTANCE`.
*   **Parameters:** `inst` (Entity) — the Grassgator entity.
*   **Returns:** `boolean`.

### `KeepTarget(inst, target)`
*   **Description:** Combat helper function used to decide whether the Grassgator should maintain aggression toward a target. Checks if the target is within a fixed chase distance.
*   **Parameters:** `inst` (Entity), `target` (Entity or nil).
*   **Returns:** `boolean`.

### `ShareTargetFn(dude)`
*   **Description:** Filter function for `Combat:ShareTarget`. Ensures only non-dead Grassgators (excluding players) can assist in combat.
*   **Parameters:** `dude` (Entity) — candidate helper.
*   **Returns:** `boolean`.

### `OnAttacked(inst, data)`
*   **Description:** Event handler for `attacked`. Sets attacker as combat target and broadcasts the target to up to five nearby Grassgators within 30 units.
*   **Parameters:** `inst` (Entity), `data` (table) — includes `attacker`.
*   **Returns:** Nothing.

### `lootsetfn(lootdropper)`
*   **Description:** Loot setup function. Overrides the default loot table if the Grassgator is burning or has the `burnt` tag, selecting the fire loot table instead.
*   **Parameters:** `lootdropper` (LootDropper component).
*   **Returns:** Nothing.

### `OnTimerDone(inst, data)`
*   **Description:** Handles `timerdone` event for the `shed` timer. Sets `inst.shed_ready = true` when the timer expires.
*   **Parameters:** `inst` (Entity), `data` (table) — includes `name`.
*   **Returns:** Nothing.

### `OnSave(inst, data)`
*   **Description:** Serialization hook. Saves `shed_ready` flag and remaining time of the `shed` timer (if active) to the `data` table.
*   **Parameters:** `inst` (Entity), `data` (table) — writable persistence data.
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Deserialization hook. Restores `shed_ready` or resumes/restarts the `shed` timer from saved data.
*   **Parameters:** `inst` (Entity), `data` (table) — loaded persistence data.
*   **Returns:** Nothing.

### `checkforshallowwater(inst)`
*   **Description:** Periodic task that checks if the Grassgator is over deep water while awake. If so, pushes a `diveandrelocate` event to request repositioning to shallow water.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `findnewshallowlocation(inst, range)`
*   **Description:** Search helper for valid shallow water locations using a fan sweep from the current facing. Uses `TILEDEPTH_LOOKUP` to determine depth thresholds.
*   **Parameters:** `inst` (Entity), `range` (number, optional, default ~17.5).
*   **Returns:** `Vector3` (new position) or `nil`.

### `isovershallowwater(inst)`
*   **Description:** Helper that checks if the Grassgator is currently standing over a shallow water tile.
*   **Parameters:** `inst` (Entity).
*   **Returns:** `boolean`.

## Events & listeners
- **Listens to:** `attacked` (calls `OnAttacked`), `timerdone` (calls `OnTimerDone`).
- **Pushes:** `diveandrelocate` (from `checkforshallowwater`).
- **Hooks:** `OnSave`, `OnLoad`, `OnEntitySleep`.