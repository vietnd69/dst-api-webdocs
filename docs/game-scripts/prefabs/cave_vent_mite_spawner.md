---
id: cave_vent_mite_spawner
title: Cave Vent Mite Spawner
description: A spawner entity that periodically generates cave vent mites in response to nearby players within fumarole areas.
tags: [spawner, environment, world]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a755597d
system_scope: world
---

# Cave Vent Mite Spawner

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `cave_vent_mite_spawner` prefab implements a conditional spawner for `cave_vent_mite` entities. It leverages the `childspawner` component to manage mite generation and dynamically responds to player presence in `fumarolearea` zones. When at least one player is within the configured spawn radius, the spawner periodically attempts to place new mites near random players using walkable-space detection. It integrates with world settings via `WorldSettings_ChildSpawner_*` utilities to respect server configuration flags like `CAVE_MITE_ENABLED`.

## Usage example
```lua
-- Typically instantiated automatically via the Prefab system
local spawner = SpawnPrefab("cave_vent_mite_spawner")
-- The spawner begins operation immediately:
-- - Regenerates its child capacity every CAVE_MITE_REGEN_TIME seconds
-- - Attempts to spawn a mite every CAVE_MITE_RELEASE_TIME seconds
-- - Only spawns when players are detected in fumarole areas within CAVE_MITE_SPAWN_RADIUSSQ distance
```

## Dependencies & tags
**Components used:** `childspawner`
**Tags:** Adds `CLASSIFIED` tag to the spawner entity.
**External utilities:** `worldsettingsutil` (calls `WorldSettings_ChildSpawner_PreLoad`, `WorldSettings_ChildSpawner_SpawnPeriod`, `WorldSettings_ChildSpawner_RegenPeriod`).

## Properties
No public properties initialized directly on this prefab. Configuration is handled via component APIs and `TUNING` constants.

## Main functions
Not applicable (this is a prefab definition, not a component; its behavior resides in the `spawnerfn` constructor and associated callback functions).

## Events & listeners
- **Listens to:**  
  - `wake` → triggers `OnEntityWake`, which starts periodic spawn testing.  
  - `sleep` → triggers `OnEntitySleep`, which cancels periodic spawn testing.  
  - `preload` → triggers `OnPreLoad`, which initializes world-settings-aware spawner/regen periods.  
- **Pushes:**  
  - None directly; mites pushed `"spawn"` event via `OnMiteSpawned`.


The `cave_vent_mite_spawner` relies entirely on the `childspawner` component’s mechanics (e.g., `CanSpawn`, `SpawnChild`, regen cycle). It customizes behavior through:
- `SetSpawnedFn(OnMiteSpawned)`: fires `"spawn"` event on each mite after creation.
- `SetOccupiedFn(StartTesting)`: restarts spawn testing when the spawner is no longer full.
- `SetOnAddChildFn(OnAddMite)`: ensures periodic testing resumes after a mite is added.
- `overridespawnlocation = zero_spawn_offset`: ensures no default offset is applied during spawning.
- Custom `DoSpawnTest` logic performs player proximity checks using `AreaAware:CurrentlyInTag("fumarolearea")` and `GetDistanceSqToPoint`, then positions mites via `FindWalkableOffset`.