---
id: statuemaxwell
title: Statuemaxwell
description: A destructible decorative statue of Maxwell that yields chess pieces and marbles when mined, with special Charlie-related behavior under certain conditions.
tags: [decoration, mining, loot, maxwell]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 74093fac
system_scope: entity
---

# Statuemaxwell

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`statuemaxwell` is a prefab script defining a decorative statue of Maxwell that functions as a mineable object in the game. It uses the `workable` and `lootdropper` components to support mining interactions and item drops upon destruction. It includes special logic to trigger unique states (`charlies_work`, `charlie_test`) that alter its appearance via animation overrides and occasionally pre-damage the statue during initial placement.

## Usage example
```lua
local inst = SpawnPrefab("statuemaxwell")
inst.Transform:SetPosition(x, y, z)
-- After mining, the statue drops loot and emits FX
-- Optional: charlies_work and charlie_test flags may be set automatically on placement
```

## Dependencies & tags
**Components used:** `lootdropper`, `inspectable`, `workable`, `burnable`, `hauntable`, `fueled` (via `MakeRoseTarget_CreateFuel`), `obstacle` (via `MakeObstaclePhysics`)
**Tags:** Adds `maxwell` and `statue`; checks for `burnt` internally via `burnable` and `fueled` components.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `charlie_test` | boolean | `false` | Flag indicating whether the Charlie-related initialization test has run. |
| `charlies_work` | boolean | `false` | Flag indicating whether Charlie has modified the statue (adds vine override and may reduce work left). |

## Main functions
### `OnWork(inst, worker, workleft)`
*   **Description:** Callback executed whenever the statue is mined. Handles visual feedback, particle effects, loot drops, and removal upon completion. Triggers a world event (`ms_unlockchesspiece`) when destroyed.
*   **Parameters:** `inst` (entity) — the statue instance; `worker` (entity) — entity performing the mine action; `workleft` (number) — remaining work needed to fully mine the statue.
*   **Returns:** Nothing.
*   **Error states:** If `workleft <= 0`, the statue is destroyed; if animation thresholds are crossed, correct idle animations are queued.

### `doCharlieTest(inst)`
*   **Description:** Runs once on placement (via `DoTaskInTime`), with 50% chance of triggering Charlie’s effect: sets `charlies_work`, adds vine animation override, and with 50% chance further pre-damages the statue.
*   **Parameters:** `inst` (entity) — the statue instance.
*   **Returns:** Nothing.

### `invokecharliesanger(inst)`
*   **Description:** Applies the `"statue_maxwell_vine_build"` override animation to the statue’sAnimState.
*   **Parameters:** `inst` (entity) — the statue instance.
*   **Returns:** Nothing.

### `OnSave(inst, data)`
*   **Description:** Serializes `charlies_work` and `charlie_test` flags for world save persistence.
*   **Parameters:** `inst` (entity) — the statue instance; `data` (table) — save data table.
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Restores `charlie_test` and `charlies_work` flags and re-applies vine override if needed.
*   **Parameters:** `inst` (entity) — the statue instance; `data` (table) — loaded save data.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None directly (uses callback-based workable hook).
- **Pushes:** `ms_unlockchesspiece` with argument `"formal"` when the statue is fully mined and destroyed.