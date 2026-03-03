---
id: batspawner
title: Batspawner
description: Manages the spawning and tracking of bats for a given entity, ensuring bats are only active when the owner is awake and respecting spawn limits.
tags: [environment, entity, ai]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 8aa1ee09
system_scope: environment
---

# Batspawner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`BatSpawner` is a component that handles the lifecycle of bats associated with an entity (typically a boss like Abigail or related creatures). It spawns bats around the owner within a fan-shaped area, maintains a cap on bat count, and ensures spawned bats are automatically removed when the owner goes to sleep. The component integrates with the world map and ground creep system to avoid invalid spawn locations.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("batspawner")
inst.components.batspawner:SetMaxBats(8)
inst.components.batspawner:SetSpawnTimes(5)
-- Spawn bats by calling spawner functions periodically or via external logic
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `bats` | table | `{}` | Dictionary mapping spawned bat entities to cleanup functions. |
| `timetospawn` | number | `0` | Internal timer; used externally for scheduling spawns. |
| `batcap` | number | `6` | Maximum number of bats allowed. |
| `spawntime` | number | `TUNING.BIRD_SPAWN_DELAY` | Delay (in seconds) between bat spawns. |

## Main functions
### `GetDebugString()`
* **Description:** Returns a human-readable string for debugging, showing current and maximum bat count.
* **Parameters:** None.
* **Returns:** `string` — formatted as `"Bats: X/Y"`.

### `SetSpawnTimes(times)`
* **Description:** Updates the interval between bat spawns.
* **Parameters:** `times` (number) — new spawn delay in seconds.
* **Returns:** Nothing.

### `SetMaxBats(max)`
* **Description:** Sets the maximum number of bats this spawner is allowed to maintain.
* **Parameters:** `max` (number) — new bat capacity limit.
* **Returns:** Nothing.

### `StartTracking(inst)`
* **Description:** Registers a spawned bat for automatic removal when the spawner’s owner goes to sleep. Also disables persistence (`inst.persists = false`) on the bat.
* **Parameters:** `inst` (Entity) — the bat entity to track.
* **Returns:** Nothing.

### `GetSpawnPoint(pt)`
* **Description:** Computes a valid spawn point for a bat within a fan-shaped region around position `pt`, avoiding impassable terrain and creep.
* **Parameters:** `pt` (Vector3) — center position for the spawn fan.
* **Returns:** `Vector3?` — the adjusted spawn point, or `nil` if no valid position found.
* **Error states:** May return `nil` if `FindValidPositionByFan` fails to locate a suitable location.

## Events & listeners
- **Listens to:** `entitysleep` — triggers cleanup of all tracked bats via the listener registered in `StartTracking`.
