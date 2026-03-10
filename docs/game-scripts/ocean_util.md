---
id: ocean_util
title: Ocean Util
description: Provides utility functions for ocean-related game logic, including tile querying, wave spawning, creature flight state management, entity sinking, and shore point detection.
tags: [ocean, world, utilities, environment]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 6413f57c
system_scope: world
---

# Ocean Util

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`ocean_util` is a collection of standalone utility functions for handling ocean-world terrain and gameplay mechanics. It provides abstractions for querying ocean/land tile states, spawning wave prefabs (e.g., for boss attacks), finding paths between points, managing flying creature collision states, sinking entities with appropriate visual FX, and identifying safe spawn locations on shore. This module relies heavily on the world map, tile group manager, and topology data, and interacts with the `playerspawner`, `inventory`, `container`, and `inventoryitem` components during entity sinking.

## Usage example
```lua
-- Query ocean depth at a point
local depth = GetOceanDepthAtPosition(x, y, z)

-- Spawn a line of attack waves
SpawnAttackWaves(position, rotation, spawn_radius, 5, 180, 6, "wave_big", 3, true)

-- Sinking an entity (e.g., upon death in ocean)
if ShouldEntitySink(entity, true) then
    SinkEntity(entity)
end

-- Land a flying creature (e.g., after exiting water)
LandFlyingCreature(creature)
```

## Dependencies & tags
**Components used:** `playerspawner`, `inventory`, `container`, `inventoryitem`, `Physics`, `Transform`, `AnimState`  
**Tags:** Checks `flying`, `irreplaceable`, `shoreonsink`, `player`, `multiplayer_portal`; adds/removes `flying` tag on creatures

## Properties
No public properties.

## Main functions
### `IsOceanTile(tile)`
* **Description:** Determines whether a given tile is an ocean tile.
* **Parameters:** `tile` (string or int) – the tile identifier from `TheWorld.Map:GetTileAtPoint(...)`.
* **Returns:** `true` if the tile is ocean; `false` otherwise.

### `IsLandTile(tile)`
* **Description:** Determines whether a given tile is a land tile.
* **Parameters:** `tile` (string or int) – tile identifier.
* **Returns:** `true` if the tile is land; `false` otherwise.

### `GetOceanDepthAtPosition(x, y, z)`
* **Description:** Returns the ocean depth at a world point. Returns `nil` if the tile or tile info is unavailable.
* **Parameters:**  
  - `x`, `y`, `z` (numbers) – world coordinates.
* **Returns:** `number?` – ocean depth (may be `nil` if not in ocean), or `nil` if out of bounds.

### `GetOceanDepthAtPoint(pt)`
* **Description:** Convenience wrapper for `GetOceanDepthAtPosition`, accepting a `Vector3` or table with `x`, `y`, `z`.
* **Parameters:** `pt` (Vector3 or table) – point with `x`, `y`, `z`.
* **Returns:** `number?` – depth.

### `SpawnAttackWaves(position, rotation, spawn_radius, numWaves, totalAngle, waveSpeed, wavePrefab, idleTime, instantActive)`
* **Description:** Spawns a configurable number of attack waves in a radial or arc formation. Used for ocean boss attacks.
* **Parameters:**  
  - `position` (Vector3) – center of wave formation.  
  - `rotation` (number, optional) – starting rotation in degrees.  
  - `spawn_radius` (number, optional) – distance from center to spawn points.  
  - `numWaves` (number) – number of waves to spawn.  
  - `totalAngle` (number, optional) – arc size in degrees (`360` = full circle, `180` = semicircle).  
  - `waveSpeed` (number or table) – motor velocity (if table, used as `<vx, vy, vz>`; otherwise, x-velocity only).  
  - `wavePrefab` (string, optional, default `"wave_med"`) – prefab name for waves.  
  - `idleTime` (number, optional, default `5`) – time before active phase.  
  - `instantActive` (boolean) – if `true`, sets initial state to `"instant_rise"` (if `idleTime > 0`) or `"lower"`.
* **Returns:** `boolean` – `true` if at least one wave was spawned; `false` otherwise.

### `SpawnAttackWave(position, rotation, waveSpeed, wavePrefab, idleTime, instantActive)`
* **Description:** Wrapper around `SpawnAttackWaves` that spawns a single wave with full circle `360°` spread.
* **Parameters:** Same as `SpawnAttackWaves` except `numWaves=1` and `totalAngle=0` are implied.
* **Returns:** `boolean` – `true` if wave spawned; `false` otherwise.

### `FindLandBetweenPoints(p0x, p0y, p1x, p1y)`
* **Description:** Uses a line-drawing algorithm (similar to Bresenham's) to find the first land tile along a straight path between two points.
* **Parameters:**  
  - `p0x`, `p0y` (numbers) – start point (x, z in DST’s 2D projection).  
  - `p1x`, `p1y` (numbers) – end point.
* **Returns:** `Vector3?` – center point of the first land tile encountered; `nil` if no land found.

### `FindRandomPointOnShoreFromOcean(x, y, z, excludeclosest)`
* **Description:** Finds a safe spawn point on land near an ocean position, typically used for respawning `irreplaceable` or `shoreonsink` entities.
* **Parameters:**  
  - `x`, `y`, `z` (numbers) – ocean origin point.  
  - `excludeclosest` (boolean) – whether to skip the absolute nearest room(s).
* **Returns:** `number, number, number` – `dest_x`, `dest_y`, `dest_z` on land, or `nil` if no valid point found.

### `LandFlyingCreature(creature)`
* **Description:** Lands a flying entity by adjusting its tags, collision mask, and events.
* **Parameters:** `creature` (Entity) – entity with `Physics` and `Transform`.
* **Returns:** Nothing.
* **Effects:**  
  - Removes `flying` tag.  
  - Pushes `on_landed` event.  
  - Updates collision masks (adds `LIMITS`, clears `FLYERS`).

### `RaiseFlyingCreature(creature)`
* **Description:** Raises a landed entity into flight.
* **Parameters:** `creature` (Entity).
* **Returns:** Nothing.
* **Effects:**  
  - Adds `flying` tag.  
  - Pushes `on_no_longer_landed` event.  
  - Updates collision masks (removes `LIMITS`, adds `FLYERS`).

### `ShouldEntitySink(entity, entity_sinks_in_water)`
* **Description:** Determines whether an entity should sink based on its position, tag, and held status.
* **Parameters:**  
  - `entity` (Entity) – the entity to check.  
  - `entity_sinks_in_water` (boolean) – whether the entity is configured to sink in water.
* **Returns:** `boolean` – `true` if the entity should sink.

### `GetSinkEntityFXPrefabs(entity, px, py, pz)`
* **Description:** Returns the appropriate FX prefabs for entity sinking based on tile type.
* **Parameters:**  
  - `entity` (Entity, optional).  
  - `px`, `py`, `pz` (numbers) – world position.
* **Returns:**  
  - `table<string>` – array of FX prefabs.  
  - `boolean` – `true` if using fallback (out-of-bounds) logic.

### `SinkEntity(entity)`
* **Description:** Handles entity sinking: drops inventory/container contents, spawns FX, and respawns or removes the entity.
* **Parameters:** `entity` (Entity).
* **Returns:** Nothing.
* **Side effects:**  
  - Calls `inventory:DropEverything()` and `container:DropEverything()` if present.  
  - Spawns FX (ocean splash, void fall, or fallback splash).  
  - If `irreplaceable` or `shoreonsink`, respawns at safe shore point; otherwise, removes entity.  
  - For respawned entities, sets `inventoryitem.is_landed = false` and begins polling.

### `CanProbablyReachTargetFromShore(inst, target, max_distance)`
* **Description:** Checks if a straight line from `inst` to `target` (at `max_distance` beyond target) passes above ground.
* **Parameters:**  
  - `inst` (Entity) – source entity.  
  - `target` (Entity) – destination.  
  - `max_distance` (number) – distance to check beyond target.
* **Returns:** `boolean` – `true` if point is above ground (i.e., reachable).

### `TintByOceanTile(inst)`
* **Description:** Sets a tint color on an entity (e.g., a buoy or visual FX) based on the tile's `wavetint` property, then removes it if no tint is available.
* **Parameters:** `inst` (Entity) – entity with `AnimState` and `Transform`.
* **Returns:** Nothing.
* **Behavior:** Delegates tinting to a delayed task (0 time) to avoid synchronous map lookups during rendering.

## Events & listeners
- **Pushes:** `on_landed`, `on_no_longer_landed` (on creatures during flight state changes).  
- **Listens to:** None — this is a utility module, not an ECS component.
