---
id: antlion_spawner
title: Antlion Spawner
description: Spawns an antlion when a sandstorm becomes active, and manages the spawned antlion's lifecycle.
tags: [combat, entity, environment, event, spawn]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b456a4a4
system_scope: environment
---

# Antlion Spawner

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`antlion_spawner` is a non-networked entity that spawns an `antlion` instance when a sandstorm starts and stops spawning when the sandstorm ends. It uses the `timer` and `entitytracker` components to manage delayed spawning and track the spawned antlion. The spawner responds to sandstorm state changes via `ms_stormchanged` events and adjusts behavior based on the current season (`issummer`). It also persists state across saves and restores it on load.

## Usage example
```lua
-- Automatically instantiated by the game as `antlion_spawner` prefab.
-- Typical interaction is indirect (via the spawner entity itself), e.g.:
local spawner = SpawnPrefab("antlion_spawner")
spawner.Transform:SetPosition(x, y, z)
-- The spawner listens to world state changes and handles spawning on its own.
```

## Dependencies & tags
**Components used:** `timer`, `entitytracker`
**Tags:** Adds `CLASSIFIED`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `spawned` | boolean or `nil` | `nil` | Set to `true` when a sandstorm is active and the spawner has registered intent to spawn. |
| `killed` | boolean or `nil` | `nil` | Set to `true` if the spawned antlion dies (tracked via `death` event). |

## Main functions
### `OnInit(inst)`
*   **Description:** Initializes the spawner by registering world state listeners and setting up event handlers for sandstorm changes and seasonal transitions. Called automatically via `DoTaskInTime(0, ...)` on spawn.
*   **Parameters:** `inst` (The instance of this entity).
*   **Returns:** Nothing.

### `OnSandstormChanged(inst, active)`
*   **Description:** Handles sandstorm state changes. When a sandstorm starts and no antlion has been spawned yet, it schedules a random delayed spawn (10–20 seconds). When the sandstorm ends, it cancels any pending spawn and marks `spawned` as `nil`.
*   **Parameters:**
    *   `inst` (The instance of this entity).
    *   `active` (boolean) — Whether a sandstorm is currently active.
*   **Returns:** Nothing.

### `OnStopSummer(inst)`
*   **Description:** Resets `killed` to `nil` when summer ends, allowing a future antlion to be considered viable for spawning again.
*   **Parameters:** `inst` (The instance of this entity).
*   **Returns:** Nothing.

### `OnTimerDone(inst, data)`
*   **Description:** Triggered when the `"spawndelay"` timer expires. Spawns the `antlion` prefab, places it at the spawner's world position, tracks it via `entitytracker`, and transitions it to `"enterworld"` state.
*   **Parameters:**
    *   `inst` (The instance of this entity).
    *   `data` (table) — Timer callback payload containing `{ name = "spawndelay" }`.
*   **Returns:** Nothing.

### `OnSave(inst, data)`
*   **Description:** Serializes the spawner’s persistent state (`spawned`, `killed`) for saving to disk.
*   **Parameters:**
    *   `inst` (The instance of this entity).
    *   `data` (table) — The save data table to populate.
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Restores the spawner’s state from saved data. If a spawn was previously recorded (`data.spawned == true`), it reinitializes listeners or timers as needed.
*   **Parameters:**
    *   `inst` (The instance of this entity).
    *   `data` (table or `nil`) — Saved state (may be `nil` if no prior save).
*   **Returns:** Nothing.

### `OnLoadPostPass(inst)`
*   **Description:** After world entities are loaded, re-establishes the `death` event listener for the tracked `antlion` (if present).
*   **Parameters:** `inst` (The instance of this entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"timerdone"` — From `timer` component, used to trigger antlion spawn.
  - `"death"` — On the spawned `antlion` entity, used to detect its demise.
  - `"ms_stormchanged"` (on `TheWorld`) — To detect sandstorm start/end.
  - `"stopsummer"` (on `TheWorld`) — To reset `killed` when summer ends.

- **Pushes:**  
  None.

