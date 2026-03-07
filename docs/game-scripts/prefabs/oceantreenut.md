---
id: oceantreenut
title: Oceantreenut
description: A salvageable ocean object that periodically attempts to grow into an Oceantree when submerged and conditions are met.
tags: [salvage, growth, ocean, underwater]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9a3e1beb
system_scope: environment
---

# Oceantreenut

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `oceantreenut` is a salvageable underwater object that functions as a growth stage toward the `oceantree_short` prefab. It resides on the ocean floor, waiting to be salvaged or to mature. Its core behavior is triggered by submersion: it starts a timer to attempt growth after a delay, and if conditions (clear space, no nearby boats, ocean terrain) are met, it spawns a new Oceantree and removes itself. The component integrates with `submersible` for underwater identification, `heavyobstaclephysics` for placement stability, and `lootdropper` for salvage rewards.

## Usage example
```lua
local inst = SpawnPrefab("oceantreenut")
inst.Transform:SetPosition(x, 0, z)
inst.Transform:SetScale(1, 1, 1)
-- After submerging, it begins growth attempts
```

## Dependencies & tags
**Components used:** `lootdropper`, `heavyobstaclephysics`, `inventoryitem`, `equippable`, `workable`, `timer`, `submersible`, `symbolswapdata`, `inspectable`  
**Tags:** Adds `heavy` to the entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `should_attempt_grow` | boolean | `false` | Whether growth attempts should resume after sleep/wake events. |
| `attempt_grow_task` | Task | `nil` | Periodic task scheduling `AttemptGrow`. |

## Main functions
### `AttemptGrow(inst)`
*   **Description:** Checks if conditions for growth are satisfied via `CanGrow(inst)` and calls `Grow(inst)` if true.
*   **Parameters:** `inst` (Entity) – the oceantreenut instance.
*   **Returns:** Nothing.
*   **Error states:** No growth occurs if `CanGrow(inst)` returns `false`.

### `CanGrow(inst)`
*   **Description:** Validates that the underlying underwater container (e.g., a salvage spot) is in an ocean tile, has no blocking tree entities nearby, and has no boats within a surrounding radius.
*   **Parameters:** `inst` (Entity) – the oceantreenut instance.
*   **Returns:** `true` if all checks pass; otherwise `false`.
*   **Error states:** Returns `false` if `submersible:GetUnderwaterObject()` yields no container.

### `Grow(inst)`
*   **Description:** Spawns `oceantree_short` at the underwater object's position, calls its `sproutfn()`, and removes the nut.
*   **Parameters:** `inst` (Entity) – the oceantreenut instance.
*   **Returns:** Nothing.

### `OnWorkedFinished(inst, worker)`
*   **Description:** Called when the entity is hammered; drops loot, spawns a `collapse_small` FX, and removes the entity.
*   **Parameters:**  
    `inst` (Entity) – the oceantreenut instance.  
    `worker` (Entity) – the entity that performed the work.  
*   **Returns:** Nothing.

### `OnSubmerge(inst, data)`
*   **Description:** Starts the growth timer on first submerge and schedules periodic growth attempts if not already running.
*   **Parameters:**  
    `inst` (Entity) – the oceantreenut instance.  
    `data` (table) – event data (unused).  
*   **Returns:** Nothing.

### `OnSalvaged(inst)`
*   **Description:** Stops growth timer and cancels pending growth attempts when the nut is salvaged manually (e.g., picked up).
*   **Parameters:** `inst` (Entity) – the oceantreenut instance.
*   **Returns:** Nothing.

### `OnTimerDone(inst, data)`
*   **Description:** Called when the growth timer expires; rechecks conditions for growth. If growth is still blocked, schedules periodic attempts.
*   **Parameters:**  
    `inst` (Entity) – the oceantreenut instance.  
    `data` (table) – must contain `{ name = "grow" }`.  
*   **Returns:** Nothing.

### `OnEntitySleep(inst)`
*   **Description:** Cancels the periodic growth task during world sleep (e.g., when the player sleeps).
*   **Parameters:** `inst` (Entity) – the oceantreenut instance.
*   **Returns:** Nothing.

### `OnEntityWake(inst)`
*   **Description:** Restores the periodic growth task if `should_attempt_grow` is true.
*   **Parameters:** `inst` (Entity) – the oceantreenut instance.
*   **Returns:** Nothing.

### `OnSave(inst, data)`
*   **Description:** Persists the `should_attempt_grow` flag to save data.
*   **Parameters:**  
    `inst` (Entity) – the oceantreenut instance.  
    `data` (table) – save data table.  
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Restores `should_attempt_grow` from save data on load.
*   **Parameters:**  
    `inst` (Entity) – the oceantreenut instance.  
    `data` (table) – loaded save data.  
*   **Returns:** Nothing.

### `OnLoadPostPass(inst, newents, data)`
*   **Description:** Finalizes setup after all entities are loaded: positions the nut at water level if misaligned and resumes growth attempts.
*   **Parameters:**  
    `inst` (Entity) – the oceantreenut instance.  
    `newents` (table) – newly loaded entities.  
    `data` (table) – loaded save data.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `on_submerge` – triggers growth timer and periodic attempts.  
  `on_salvaged` – cancels growth tasks.  
  `timerdone` – checks and executes growth when timer expires.  
- **Pushes:** None (no custom events fired by this component).