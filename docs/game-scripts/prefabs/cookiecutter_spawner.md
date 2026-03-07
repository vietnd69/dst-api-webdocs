---
id: cookiecutter_spawner
title: Cookiecutter Spawner
description: Spawns and manages Cookiecutter minions underwater, regenerating them over time based on tunable parameters and world settings.
tags: [spawning, minions, underwater, worldsettings]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: aace2528
system_scope: environment
---

# Cookiecutter Spawner

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `cookiecutter_spawner` prefab is a non-networked, classified entity responsible for autonomously spawning `cookiecutter` minions underwater. It relies on the `childspawner` component to handle periodic spawning and regen logic. The spawner responds to entity sleep/wake events and respects world settings via `WorldSettings_ChildSpawner_*` helper functions from `worldsettingsutil.lua`. It is typically used in oceanic or deep environments to populate underwater areas with swarming enemies.

## Usage example
```lua
-- Spawner creation is handled internally by the prefab system.
-- Example of interacting with it post-spawn:
local spawner = SpawnPrefab("cookiecutter_spawner")
spawner.components.childspawner:SetMaxChildren(10)
spawner.components.childspawner:StartSpawning()
```

## Dependencies & tags
**Components used:** `childspawner`
**Tags:** Adds `CLASSIFIED`; no network replication (`SetPristine()`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `childname` | string | `"cookiecutter"` | Prefab name of the child entities to spawn. |
| `childreninside` | integer | `0` (when disabled) | Number of children currently spawned (influences regen/spawn rate). |
| `spawnradius` | table | `{min = 2, max = TUNING.COOKIECUTTER.WANDER_DIST}` | Range of spawn distances from the spawner. |
| `wateronly` | boolean | `true` | If true, children will only spawn in water tiles. |

## Main functions
### `DoReleaseAllChildren(inst)`
*   **Description:** Triggers immediate release of all queued children by calling `childspawner:ReleaseAllChildren()` without arguments (defaults used by component). Called automatically on wake with a short delay.
*   **Parameters:** `inst` (Entity) — the spawner instance.
*   **Returns:** Table of newly spawned child entities (or empty if none spawned).
*   **Error states:** May return fewer children than requested if spawning fails (e.g., no valid tiles, physics conflicts).

### `OnEntitySleep(inst)`
*   **Description:** Cancels pending wake-triggered release tasks when the entity goes to sleep.
*   **Parameters:** `inst` (Entity) — the spawner instance.
*   **Returns:** Nothing.

### `OnEntityWake(inst)`
*   **Description:** Schedules a `DoReleaseAllChildren` call after 0.1 seconds when the entity wakes. Cancel any prior task first.
*   **Parameters:** `inst` (Entity) — the spawner instance.
*   **Returns:** Nothing.
*   **Error states:** May reschedule unnecessarily if already scheduled; avoids duplication via prior `Cancel()`.

### `OnPreLoad(inst, data)`
*   **Description:** Invoked during save/load to restore spawner state using saved data and apply world settings.
*   **Parameters:**  
    `inst` (Entity) — spawner instance.  
    `data` (table) — save data (e.g., child count, timers).  
*   **Returns:** Nothing.
*   **Error states:** Uses `WorldSettings_ChildSpawner_PreLoad`, which handles missing or invalid data gracefully.

### `WorldSettings_ChildSpawner_SpawnPeriod(inst, period, enabled)`
*   **Description:** Applies world-settings-based override to the spawn period (from `worldsettingsutil.lua`). Called during initialization with values from `TUNING`.
*   **Parameters:**  
    `inst` (Entity) — spawner instance.  
    `period` (number) — base spawn period in seconds.  
    `enabled` (boolean) — whether spawning is enabled globally (via world settings).  
*   **Returns:** Nothing.
*   **Error states:** If `enabled` is `false`, `childreninside` is set to `0`, effectively halting further spawns.

### `WorldSettings_ChildSpawner_RegenPeriod(inst, period, enabled)`
*   **Description:** Applies world-settings-based override to the regen period (from `worldsettingsutil.lua`).
*   **Parameters:**  
    `inst` (Entity) — spawner instance.  
    `period` (number) — base regen period in seconds.  
    `enabled` (boolean) — whether regen is enabled globally.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `entity sleep` — handled via `inst.OnEntitySleep`; `entity wake` — via `inst.OnEntityWake`.
- **Pushes:** None directly (relies on `childspawner` component for internal events).

### Special Notes
- This spawner is **non-networked** (`SetPristine()`, `CLASSIFIED` tag), meaning it exists only on the master sim and is not replicated to clients.
- Sleep/wake behavior ensures spawning continues after world reactivates, especially useful for caves or suspended regions.
- Overrides via `TUNING.*` constants (e.g., `COOKIECUTTER_SPAWNER_ENABLED`) are standard DST tuning hooks for level designers.
