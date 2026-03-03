---
id: gelblobspawner
title: Gelblobspawner
description: Manages the spawning and lifecycle of gel blobs in response to active rifts, player proximity, and spawner cooldowns in DST.
tags: [combat, environment, boss, world, network]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: b9d43f4b
system_scope: environment
---

# Gelblobspawner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`GelBlobSpawner` is a master-world-only component that controls the dynamic spawning of `gelblob` prefabs during active Shadow Rift events. It monitors registered spawning grounds (`gelblobspawningground`-tagged entities), responds to nearby alive non-ghost players, and coordinates blob production based on world tuning parameters and concurrent parasite wave overrides from `ShadowParasiteManager`. It ensures blob counts respect limits (`MAX_GELBLOBS_TOTAL_IN_WORLD`), enforces spawner-specific and global cooldowns, and handles serialization for world save/load.

This component only exists on the `mastersim` (server), as enforced by an assertion in its constructor.

## Usage example
```lua
-- Typically attached automatically to TheWorld in the game's initialization.
-- Example of how a mod might register a custom spawning ground:
local inst = CreateEntity()
inst:AddTag("gelblobspawningground")
inst.Transform:SetPosition(x, 0, z)
TheWorld.components.gelblobspawner:RegisterGelBlobSpawningPoint(inst)
```

## Dependencies & tags
**Components used:** `health`, `riftspawner`, `shadowparasitemanager`  
**Tags:** Registers and listens to entities with tag `gelblobspawningground`; listens to `onremove` on spawned gel blobs and spawners.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `enabled` | boolean | `false` | Whether blob spawning logic is active (toggled on/off by rift state). |
| `spawnpoints` | table of entities | `{}` | List of registered `gelblobspawningground` entities that can produce blobs. |
| `gelblobs` | table: gelblob entity → spawner entity | `{}` | Tracks currently active gel blobs and their associated spawner. |
| `gelblobcount` | number | `0` | Total number of active gel blobs. |
| `blobbedspawners` | table: spawner entity → `true` | `{}` | Tracks spawners that have recently spawned blobs. |
| `cooldownspawners` | table: spawner entity → number (time left) | `{}` | Tracks spawners on cooldown and remaining time. |
| `MIN_GELBLOBS_PER_SPAWNER` | number | `TUNING.MIN_GELBLOBS_PER_SPAWNER` | Minimum blobs spawned per spawner per attempt. |
| `MAX_GELBLOBS_PER_SPAWNER` | number | `TUNING.MAX_GELBLOBS_PER_SPAWNER` | Maximum blobs spawned per spawner per attempt. |
| `MAX_GELBLOBS_TOTAL_IN_WORLD` | number | `TUNING.MAX_GELBLOBS_TOTAL_IN_WORLD` | Maximum total gel blobs allowed. |
| `MIN_GELBLOB_DIST_FROM_EACHOTHER_SQ` | number | `TUNING.MIN_GELBLOB_DIST_FROM_EACHOTHER^2` | Squared minimum distance between spawned blobs. |
| `MAX_GELBLOB_DIST_FROM_SPAWNER` | number | `TUNING.MAX_GELBLOB_DIST_FROM_SPAWNER` | Maximum distance blobs may spawn from a spawner. |
| `MIN_GELBLOB_SPAWN_DELAY` | number | `TUNING.MIN_GELBLOB_SPAWN_DELAY` | Minimum delay before a blob becomes active after spawn. |
| `VARIANCE_GELBLOB_SPAWN_DELAY` | number | `TUNING.VARIANCE_GELBLOB_SPAWN_DELAY` | Variance added to spawn delay. |
| `COOLDOWN_GELBLOB_SPAWNER_TIME` | number | `TUNING.COOLDOWN_GELBLOB_SPAWNER_TIME` | Cooldown duration for a spawner after spawning. |
| `logictickaccumulator` | number | `0` | Accumulator for timed logic updates (every `LOGIC_TICK_TIME` seconds). |
| `LOGIC_TICK_TIME` | number | `1` | Interval in seconds between blob logic checks. |

## Main functions
### `RegisterGelBlobSpawningPoint(spawner)`
* **Description:** Registers a spawner entity as a valid source of gel blobs. Automatically unregisters it if the spawner is removed.
* **Parameters:** `spawner` (entity) — the spawning ground entity (must have tag `gelblobspawningground`).
* **Returns:** Nothing.
* **Error states:** Not meant for direct modder use; prefer `TryToRegisterSpawningPoint`.

### `TryToRegisterSpawningPoint(spawner)`
* **Description:** Attempts to register a spawner only if not already registered. Exposed to mods for dynamic spawner management.
* **Parameters:** `spawner` (entity).
* **Returns:** `true` if successfully registered; `false` if already present.

### `UnregisterGelBlobSpawningPoint(spawner)`
* **Description:** Manually unregisters a spawner.
* **Parameters:** `spawner` (entity).
* **Returns:** Nothing.

### `StartGelBlobs()`
* **Description:** Enables blob spawning and starts component updates. Called when a Shadow Rift is added to the pool (i.e., active).
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No-op if already enabled.

### `StopGelBlobs()`
* **Description:** Disables blob spawning but retains state. Called when all rifts are removed from the pool.
* **Parameters:** None.
* **Returns:** Nothing.

### `SpawnGelBlobFromSpawner(spawner, player)`
* **Description:** Attempts to spawn one or more gel blobs from a given spawner near the specified player, subject to cooldowns, total blob limits, and parasite wave overrides. Uses pathfinding-aware random placement.
* **Parameters:**  
  - `spawner` (entity) — the gel blob spawner entity.  
  - `player` (entity, optional) — the player entity to bias blob placement toward; defaults to `spawner` if omitted.
* **Returns:** `true` if at least one blob was spawned; `false` otherwise.
* **Error states:** Fails and returns `false` if the spawner is currently blobbed or on cooldown, if the shadow parasite override succeeded, or if blob count limit would be exceeded.

### `TrySpawningGelBlobs()`
* **Description:** Iterates over all alive, non-ghost players, finds nearby spawners within range, and triggers spawning for each.
* **Parameters:** None.
* **Returns:** Nothing.

### `TryRemovingGelBlobs()`
* **Description:** Removes one gel blob (via `DoDespawn`) when total count exceeds limits during deactivation. Spawns no more than one blob per call.
* **Parameters:** None.
* **Returns:** Nothing.

### `CheckGelBlobs()`
* **Description:** Central logic gate called every `LOGIC_TICK_TIME` seconds. Spawns blobs if enabled and under cap; removes blobs if disabled and count > 0; cleans cooldowns and stops updates when fully idle.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Drives spawner cooldown countdowns and triggers `CheckGelBlobs` periodically.
* **Parameters:** `dt` (number) — delta time since last frame.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Serializes active gel blobs and spawner cooldown timers into save data.
* **Parameters:** None.
* **Returns:** Two values:  
  - `data` (table or `nil`) — save payload with keys `gelblobs` (list of `{gelblob=guid, spawner=guid}`) and `spawnercds` (list of `{spawner=guid, timeleft=number}`).  
  - `ents` (table of guids) — list of GUIDs referenced in `data` (for save system tracking).

### `LoadPostPass(newents, savedata)`
* **Description:** Reconnects gel blobs and spawners after save load using `newents`.
* **Parameters:**  
  - `newents` (table) — map of `GUID → {entity=ent, ...}`.  
  - `savedata` (table) — as returned by `OnSave`.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string for the component’s state, including spawner count, current blob count, and spawner cooldowns sorted by time left.
* **Parameters:** None.
* **Returns:** `string`.

## Events & listeners
- **Listens to:**  
  - `ms_registergelblobspawningground` — triggers `TryToRegisterSpawningPoint`.  
  - `onremove` (on spawners) — triggers `UnregisterGelBlobSpawningPoint`.  
  - `onremove` (on gel blobs) — decrements blob count, manages spawner cooldowns.  
  - `ms_riftaddedtopool`, `ms_riftremovedfrompool` — triggers `UpdateState` to toggle `enabled`.  
- **Pushes:** None.
