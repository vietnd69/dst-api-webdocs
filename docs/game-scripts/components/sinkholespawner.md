---
id: sinkholespawner
title: Sinkholespawner
description: Manages the spawning, targeting, timing, and state of antlion sinkhole attacks in response to player activity.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 6a82fa3b
---

# Sinkholespawner

## Overview
This component orchestrates antlion sinkhole attacks during specific seasonal windows (e.g., Autumn and Winter). It identifies eligible player targets using weighted selection, schedules warning phases and attack waves per target, and coordinates local and remote sinkhole placement via periodic updates. It integrates with world state, network, and world generation systems to ensure attacks are placement-valid and synchronized across shards.

## Dependencies & Tags
- Uses `TheWorld.has_ocean`, `TheWorld.Map`, `TheNet`, `TheSim`, `TUNING.ANTLION_SINKHOLE`, `GetString`, `smallhash`, `weighted_random_choice`, `SpawnPrefab`, `FindValidPositionByFan`, `GetRandomWithVariance`, `ShakeAllCameras`.
- Adds no tags to the host entity (`self.inst`).
- No component dependencies (e.g., `AddComponent`) are present in this file.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (passed to constructor) | The entity that owns this component (typically the Antlion or world-level controller). |
| `targets` | `table` | `{}` | List of active target info tables, each describing a player's sinkhole attack state. Limited to `MAX_TARGETS = 2`. |

No additional public properties are initialized beyond the constructor.

## Main Functions

### `StartSinkholes()`
* **Description:** Begins a new sinkhole attack wave. Selects up to two eligible players based on weighted criteria (player age and ground validity), computes required attack counts per target, and schedules warnings and attacks. If targets were added, starts component updates and broadcasts `"onsinkholesstarted"`.
* **Parameters:** None.

### `StopSinkholes()`
* **Description:** Clears all active targets, stops updates, broadcasts `"onsinkholesfinished"`, and syncs to remote clients.
* **Parameters:** None.

### `UpdateTarget(targetinfo)`
* **Description:** Resolves a player and world position for a given target, or resets position if the player is migrating. Called during target initialization and periodically to refresh positions.
* **Parameters:**
  - `targetinfo` (table): Target info table containing `client`, `userid`, and optionally `player`, `pos`.

### `DoTargetWarning(targetinfo)`
* **Description:** Handles warning logic for a target: spawns visual/sound effects (camera shake, rock FX), optionally announces the attack via talker, and decrements warning count. When warnings end, sets up the first attack delay.
* **Parameters:**
  - `targetinfo` (table): Target info table with `warnings`, `next_warning`, `pos`, and `player`.

### `DoTargetAttack(targetinfo)`
* **Description:** Executes a sinkhole spawn attempt for a target if position is known and no other sinkholes are too close (merge distance check). Decrements attack count; if zero, clears attack timer.
* **Parameters:**
  - `targetinfo` (table): Target info table with `pos`, `attacks`, and `next_attack`.

### `SpawnSinkhole(spawnpt)`
* **Description:** Attempts to spawn an `antlion_sinkhole` prefab at a valid location near the given point, using variance, obstacle checking, terrain compatibility, and passability tests. Falls back to radial search if the center position is invalid.
* **Parameters:**
  - `spawnpt` (`Vector3`): Base world position for the sinkhole.

### `PushRemoteTargets()`
* **Description:** Serializes and sends target timing states for remote players to the master server via `"master_sinkholesupdate"` event. Only includes targets where position is unknown (i.e., remote players).
* **Parameters:** None.

### `OnUpdate(dt)`
* **Description:** Periodically called during active attack phases. Updates positions, decrements warning/attack timers, triggers warnings and attacks, cleans up completed targets, stops updates if no targets remain, and syncs remote state.
* **Parameters:**
  - `dt` (number): Delta time in seconds.

### `OnSave()`
* **Description:** Serializes in-progress sinkhole attacks (only those with known positions) for save/load persistence.
* **Parameters:** None.
* **Returns:** `table` with `targets` array of saved attack data, or `nil` if no active attacks.

### `OnLoad(data)`
* **Description:** Restores active sinkhole attacks from saved data, respecting `MAX_TARGETS` limit, restarting updates and remote sync if any targets were loaded.
* **Parameters:**
  - `data` (table): Saved data containing `targets` array with `x`, `z`, `attacks`, `next_attack`, `next_warning`.

### `GetDebugString()`
* **Description:** Returns a multiline debug string summarizing each target’s current warning or attack progress, position, and remaining time.
* **Parameters:** None.
* **Returns:** `string` or `nil`.

## Events & Listeners
- **Listeners:**
  - None (no `inst:ListenForEvent` calls in this component).
- **Events triggered (via `inst:PushEvent`):**
  - `"onsinkholesstarted"` — When sinkhole attacks begin or are resumed after loading.
  - `"onsinkholesfinished"` — When all sinkhole attacks complete or are explicitly stopped.
- **Events pushed globally (via `TheWorld:PushEvent`):**
  - `"master_sinkholesupdate"` — Carries updated remote target data to master shard.