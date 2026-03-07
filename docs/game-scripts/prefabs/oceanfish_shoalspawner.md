---
id: oceanfish_shoalspawner
title: Oceanfish Shoalspawner
description: Spawns and manages a shoal of medium-sized oceanfish entities in water regions, automatically regenerating and respawning fish over time.
tags: [environment, creature, spawner, water]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: defb84dd
system_scope: environment
---

# Oceanfish Shoalspawner

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `oceanfish_shoalspawner` prefab functions as a static spawner entity placed in ocean biomes to dynamically generate a shoal of `oceanfish_medium_2` entities. It leverages the `childspawner` component to manage periodic spawning and regrowth of fish, ensuring the shoal persists and responds to world events such as entity sleep/wake cycles. This prefab is used exclusively on the master simulation and has no client-side logic. It registers itself with the world via a custom event `ms_registerfishshoal`.

## Usage example
```lua
-- This is a built-in prefab, typically instantiated via world generation or prefabs:
local spawner = Prefab("oceanfish_shoalspawner", fn, assets, prefabs)
```
In most cases, modders will not instantiate this directly. To customize its behavior, override its tuning values in `TUNING.OCEANFISH_SHOAL.*` or extend its prefab definition.

## Dependencies & tags
**Components used:** `childspawner`  
**Tags added:** `NOBLOCK`, `ignorewalkableplatforms`, `oceanshoalspawner`  
**Tags checked:** None identified  
**Listeners:** `ms_registerfishshoal` event is pushed during initialization

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `releasefishtask` | number | `nil` | Task handle for delayed fish release on waking; cleared on sleeping |
| `components.childspawner` | ChildSpawner | `nil` (added at runtime on master sim) | Component responsible for spawning and managing fish children |

## Main functions
### `OnInit(inst)`
*   **Description:** Initializes the spawner by registering it with the world via the `ms_registerfishshoal` event.
*   **Parameters:** `inst` (Entity) — the spawner instance.
*   **Returns:** Nothing.

### `OnSpawnFish(inst, child)`
*   **Description:** Callback invoked by `childspawner` when a fish is spawned. Moves the spawned fish into the `"arrive"` state via its stategraph.
*   **Parameters:**  
    `inst` (Entity) — the spawner instance;  
    `child` (Entity) — the newly spawned fish entity.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `child` is `nil` or lacks a stategraph.

### `ReleaseAllFish(inst)`
*   **Description:** Immediately releases all currently "held" fish from the spawner's internal child count using `childspawner:ReleaseAllChildren()`.
*   **Parameters:** `inst` (Entity) — the spawner instance.
*   **Returns:** Nothing.

### `OnEntitySleep(inst)`
*   **Description:** Cancels any pending fish-release task when the spawner goes to sleep (e.g., when the player leaves the area).
*   **Parameters:** `inst` (Entity) — the spawner instance.
*   **Returns:** Nothing.

### `OnEntityWake(inst)`
*   **Description:** Schedules immediate fish release when the spawner wakes (e.g., when the player returns). Uses a delayed task to avoid potential synchronization issues.
*   **Parameters:** `inst` (Entity) — the spawner instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** `ms_registerfishshoal` — fired during `OnInit()` to notify the world of a new shoal spawner registration.

