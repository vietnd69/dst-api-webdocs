---
id: gelblobspawner
title: Gelblobspawner
description: Manages the spawning, tracking, and removal of gel blobs from spawning grounds based on world conditions and player proximity.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: b9d43f4b
---

# Gelblobspawner

## Overview
The `GelBlobSpawner` component manages the lifecycle of gel blobs in the world: registering valid spawning points (entities with the `gelblobspawningground` tag), spawning new gel blobs near players when conditions permit, cooling down spawners after use, and removing excess gel blobs when shadow rifts are inactive. It operates exclusively on the master simulation and coordinates with world state (e.g., ` riftspawner`, `shadowparasitemanager`) to control gel blob generation.

## Dependencies & Tags
- **Component Requirements:** Must exist on the `TheWorld` entity and only on the master (`ismastersim`).
- **Tags:** Uses the `"gelblobspawningground"` tag to identify valid spawners during entity queries.
- **Event Dependencies:** Listens to:
  - `ms_registergelblobspawningground` to register spawning points.
  - `ms_riftaddedtopool` / `ms_riftremovedfrompool` (on `TheWorld`) to trigger state changes.
- **External Components Referenced:**
  - `TheWorld.components.riftspawner`
  - `TheWorld.components.shadowparasitemanager`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `enabled` | `boolean` | `false` | Whether gel blob spawning is active (controlled by shadow rift state). |
| `spawnpoints` | `table` | `{}` | List of registered spawner entities (with `gelblobspawningground` tag). |
| `gelblobs` | `table` | `{}` | Maps gel blob entity instances to their spawning spawner entity. |
| `gelblobcount` | `number` | `0` | Total number of active gel blobs. |
| `blobbedspawners` | `table` | `{}` | Tracks spawners that currently have active gel blobs. |
| `cooldownspawners` | `table` | `{}` | Maps spawners to remaining cooldown time (in seconds) after spawning. |
| `MIN_GELBLOBS_PER_SPAWNER` | `number` | `TUNING.MIN_GELBLOBS_PER_SPAWNER` | Minimum gel blobs spawned per spawner activation. |
| `MAX_GELBLOBS_PER_SPAWNER` | `number` | `TUNING.MAX_GELBLOBS_PER_SPAWNER` | Maximum gel blobs spawned per spawner activation. |
| `MAX_GELBLOBS_TOTAL_IN_WORLD` | `number` | `TUNING.MAX_GELBLOBS_TOTAL_IN_WORLD` | Soft cap on total gel blobs allowed. |
| `MIN_GELBLOB_DIST_FROM_EACHOTHER_SQ` | `number` | Square of `TUNING.MIN_GELBLOB_DIST_FROM_EACHOTHER` | Minimum squared distance between newly spawned gel blobs. |
| `MAX_GELBLOB_DIST_FROM_SPAWNER` | `number` | `TUNING.MAX_GELBLOB_DIST_FROM_SPAWNER` | Maximum spawn radius around a spawner. |
| `MIN_GELBLOB_SPAWN_DELAY` | `number` | `TUNING.MIN_GELBLOB_SPAWN_DELAY` | Base delay before a gel blob becomes active. |
| `VARIANCE_GELBLOB_SPAWN_DELAY` | `number` | `TUNING.VARIANCE_GELBLOB_SPAWN_DELAY` | Randomized variance added to spawn delay. |
| `COOLDOWN_GELBLOB_SPAWNER_TIME` | `number` | `TUNING.COOLDOWN_GELBLOB_SPAWNER_TIME` | Cooldown duration (seconds) after a spawner is used. |
| `logictickaccumulator` | `number` | `0` | Accumulator tracking time since last logic update. |
| `LOGIC_TICK_TIME` | `number` | `1` | Interval (in seconds) between gel blob logic checks. |

## Main Functions
### `RegisterGelBlobSpawningPoint(spawnpoint)`
* **Description:** Registers a spawner entity (typically with `gelblobspawningground` tag) for gel blob spawning. Automatically unregisters it when the spawner is removed.
* **Parameters:**  
  `spawnpoint` (Entity): The spawner entity to register.

### `TryToRegisterSpawningPoint(spawnpoint)`
* **Description:** Attempts to register a spawner only if not already registered. Returns `true` on successful registration.
* **Parameters:**  
  `spawnpoint` (Entity): The spawner entity to conditionally register.

### `UnregisterGelBlobSpawningPoint(spawnpoint)`
* **Description:** Removes a spawner from the active list of spawning points.
* **Parameters:**  
  `spawnpoint` (Entity): The spawner entity to remove.

### `WatchGelBlob(gelblob, spawner)`
* **Description:** Begins tracking a newly spawned gel blob. Decrements the global gel blob count and manages cooldowns for its spawner upon the blob’s removal.
* **Parameters:**  
  `gelblob` (Entity): The gel blob entity to track.  
  `spawner` (Entity): The spawner that generated this gel blob.

### `StartGelBlobs()`
* **Description:** Enables gel blob spawning and starts component updates (calls `OnUpdate` periodically).
* **Parameters:** None.

### `StopGelBlobs()`
* **Description:** Disables gel blob spawning but does not immediately clear existing blobs.
* **Parameters:** None.

### `SpawnGelBlobFromSpawner(spawner, player)`
* **Description:** Attempts to spawn 1–`MAX_GELBLOBS_PER_SPAWNER` gel blobs near a given spawner, favoring positions biased toward the nearest player. Respects spawner cooldowns, global blob limits, and `shadowparasitemanager` overrides.
* **Parameters:**  
  `spawner` (Entity): The spawner to spawn blobs from.  
  `player` (Entity, optional): Player to bias spawn locations toward (defaults to `spawner`). Returns `false` if no blobs were spawned.

### `TrySpawningGelBlobs()`
* **Description:** Iterates over all living, non-ghost players, finds nearby spawners, and attempts to spawn blobs from them.
* **Parameters:** None.

### `TryRemovingGelBlobs()`
* **Description:** Despawns a single random gel blob (if any exist) to reduce total count below `MAX_GELBLOBS_TOTAL_IN_WORLD`.
* **Parameters:** None.

### `CheckGelBlobs()`
* **Description:** Enforces global blob limits: spawns blobs if under the cap and enabled; removes blobs if over zero and disabled.
* **Parameters:** None.

### `OnUpdate(dt)`
* **Description:** Updates cooldown timers and schedules blob logic (`CheckGelBlobs`) on fixed intervals.
* **Parameters:**  
  `dt` (number): Delta time since last frame.

### `OnSave()`
* **Description:** Serializes active gel blobs, their spawners, and spawner cooldowns for persistence.
* **Parameters:** None.  
* **Returns:**  
  `data` (table or `nil`): Structured save data containing `gelblobs`, `spawnercds`, and `spawners` entries.  
  `ents` (table): List of GUIDs for entities involved in save data.

### `LoadPostPass(newents, savedata)`
* **Description:** Restores gel blob tracking and spawner cooldowns after world load using GUID resolution.
* **Parameters:**  
  `newents` (table): Map of loaded GUIDs → entity instances.  
  `savedata` (table): Deserialized save data.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string with spawn points, active blob count, and per-spawner cooldowns.
* **Parameters:** None.

### `IsGelBlobbed(spawner)`
* **Description:** Checks if a spawner currently has one or more active gel blobs.
* **Parameters:**  
  `spawner` (Entity): The spawner to check.  
* **Returns:** `true` or `false`.

### `IsCooldowned(spawner)`
* **Description:** Checks if a spawner is currently on cooldown.
* **Parameters:**  
  `spawner` (Entity): The spawner to check.  
* **Returns:** `true` or `false`.

## Events & Listeners
- **Listens to `ms_registergelblobspawningground` on `self.inst`**  
  Triggers `TryToRegisterSpawningPoint(spawnpoint)` to register new spawning points.
- **Listens to `ms_riftaddedtopool` and `ms_riftremovedfrompool` on `TheWorld`**  
  Triggers `UpdateState`, which calls `StartGelBlobs()` or `StopGelBlobs()` based on shadow portal status.
- **Listens to `onremove` on each registered spawner and gel blob**  
  Automatically unregisters spawners and handles gel blob cleanup (count decrement, cooldown initialization).