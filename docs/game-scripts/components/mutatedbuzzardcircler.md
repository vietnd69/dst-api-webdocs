---
id: mutatedbuzzardcircler
title: Mutatedbuzzardcircler
description: Controls the circling behavior of a mutated buzzard around a target entity, managing movement, migration, and interactions like flare detonations and corpse landings.
tags: [ai, migration, combat, npc]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 93ebb679
system_scope: entity
---

# Mutatedbuzzardcircler

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`MutatedBuzzardCircler` manages the circling and eventual landing behavior of a mutated buzzard entity around a designated target (typically a killed creature or player). It handles radial movement around the target, dynamic speed and scale adjustments using sine-based easing, migration node tracking, and interactions with flares and corpses. It is typically attached to a “buzzard spawner” entity (e.g., a lunar beacon or flare event object), which spawns the actual buzzard instance stored in `self.inst.buzzard`.

## Usage example
```lua
local spawner = SpawnPrefab("lunar_beacon_spawner")
spawner:AddComponent("mutatedbuzzardcircler")
spawner.components.mutatedbuzzardcircler:SetCircleTarget(target_entity)
spawner.components.mutatedbuzzardcircler:Start()
```

## Dependencies & tags
**Components used:** `migrationmanager`, `mutatedbuzzardmanager`, `corpsepersistmanager`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scale` | number | `1` | Current visual scale of the spawner entity (used for animation/simulation only; real buzzard scale is separate). |
| `speed` | number | `math.random(3) * 0.01` | Circulation speed (radians/tick) during active circling. |
| `circle_target` | `TheSim` entity or `nil` | `nil` | Target entity around which the buzzard circles. Must be valid and persist. |
| `min_speed` | number | `5` | Minimum speed factor (used in scaling `speed` via `Lerp`). |
| `max_speed` | number | `7` | Maximum speed factor (used in scaling `speed` via `Lerp`). |
| `min_dist` | number | `8` | Minimum radial distance (units) from target. |
| `max_dist` | number | `12` | Maximum radial distance (units) from target. |
| `min_scale` | number | `8` | Minimum scale factor (scaled by `0.1` before use). |
| `max_scale` | number | `12` | Maximum scale factor (scaled by `0.1` before use). |
| `sine_mod` | number | `(10 + math.random() * 20) * 0.001` | Frequency modifier for sine-based speed/scale oscillation. |
| `sine` | number | `0` | Current sine value, updated each frame. |
| `update_target_pos_cooldown` | number | `0` | Countdown until the next target position update. |
| `last_valid_migration_node` | any | `nil` | Last known valid migration node for the target (used during entity sleep). |

## Main functions
### `Start()`
*   **Description:** Initializes and begins the circling behavior: sets speed, distance, angle, and offset based on tunables, positions the spawner, starts the update loop, and records the current migration node.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Returns early with no effect if `circle_target` is `nil` or invalid.

### `Stop()`
*   **Description:** Stops the circling behavior by ending the update loop.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetCircleTarget(tar)`
*   **Description:** Sets or clears the circling target, adjusting internal counts and registering/unregistering `onremove` and `death` listeners.
*   **Parameters:** `tar` (entity or `nil`) — the entity to circle. If valid, increments `_num_circling_buzzards`; if cleared, decrements it.
*   **Returns:** Nothing.

### `GetSpeed()`
*   **Description:** Returns the current effective circling speed, applying direction (positive/negative) to indicate clockwise or counterclockwise motion.
*   **Parameters:** None.
*   **Returns:** number — scaled speed adjusted for rotation direction.

### `GetMinSpeed()`, `GetMaxSpeed()`, `GetMinScale()`, `GetMaxScale()`
*   **Description:** Return configured minimum/maximum speed and scale factors. Scale values are scaled by `0.1` before being returned (`min_scale * 0.1`, `max_scale * 0.1`).
*   **Parameters:** None.
*   **Returns:** number — the respective tunable factor.

### `OnUpdate(dt)`
*   **Description:** Main per-frame logic: updates target position (with cooldown), finds and lands on corpses, adjusts speed/scale via sine modulation, calculates angular velocity, sets rotation and motor velocity, and manages proximity-based acceleration.
*   **Parameters:** `dt` (number) — time since last frame.
*   **Returns:** Nothing.

### `FindCorpse(target)`
*   **Description:** Searches for valid corpses near `target` within a 25-unit radius, filtering for those that aren’t ignored, mutating, or gestalt-arriving.
*   **Parameters:** `target` (entity) — center point for corpse search.
*   **Returns:** entity or `nil` — a randomly selected valid corpse, or `nil` if none found.

### `LandOnCorpse(corpse)`
*   **Description:** Positions the spawned buzzard onto the corpse, sets it to `glide`, assigns the corpse to the buzzard, plays a sound, and terminates the spawner circling behavior.
*   **Parameters:** `corpse` (entity) — the corpse to land on.
*   **Returns:** boolean — `true` if successful, `false` otherwise.

### `DropBuzzard()`
*   **Description:** Spawns a `buzzardcorpse` at the spawner’s current location and removes the actual buzzard entity.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `UpdateMigrationNode()`
*   **Description:** Updates `last_valid_migration_node` to the target’s current migration node if valid and close enough. Otherwise calls `StoreInMigrationNode`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `StoreInMigrationNode()`
*   **Description:** Removes the spawner entity via `KillShadow()` if it is valid to enter the migration node.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnEntitySleep()`
*   **Description:** Ensures migration node tracking during entity sleep; updates node if the target is valid, then calls `StoreInMigrationNode`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a formatted string for debugging: current sine value, speed, and max speed.
*   **Parameters:** None.
*   **Returns:** string — e.g., `"Sine: 0.5214, Speed: 0.060/0.070"`.

## Events & listeners
- **Listens to:**  
  - `onremove` (on `self.inst`) — triggers `OnRemove`, which clears `circle_target`.  
  - `miniflare_detonated` (on `TheWorld`) — fires `OnMiniFlareDetonated`, potentially spawning the buzzard from the spawner on flare impact.  
  - `megaflare_detonated` (on `TheWorld`) — fires `OnMegaFlareDetonated`, potentially spawning the buzzard on flare impact (up to 5 buzzards).  
  - `onremove` and `death` (on `circle_target`) — fires internal callback to `KillShadow()` and nullify `circle_target` if the target is removed or dies.
- **Pushes:** None.
