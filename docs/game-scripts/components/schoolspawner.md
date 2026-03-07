---
id: schoolspawner
title: Schoolspawner
description: Spawns fish schools and triggers special ocean predators like gnarwails and sharks in oceanic regions based on player proximity and environmental conditions.
tags: [ocean, fish, ai, spawner, environment]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 50b534d1
system_scope: environment
---

# Schoolspawner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`SchoolSpawner` is a world-level component responsible for periodically spawning fish schools in ocean areas near players, while also triggering special event-based predator spawns (gnarwails and sharks) under specific ocean tile and chance conditions. It operates exclusively on the master simulation (`TheWorld.ismastersim`) and uses a per-player scheduling mechanism to manage spawn attempts. The component relies on external data from `prefabs/oceanfishdef.lua` and integrates with the `herd`, `herdmember`, `amphibiouscreature`, and `oceantrawler` components during spawning logic.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("schoolspawner")
-- Once added, the component automatically begins scheduling fish spawns for existing and future players.
-- It responds to "ms_playerjoined" and "ms_playerleft" events handled internally.
```

## Dependencies & tags
**Components used:** `amphibiouscreature`, `herd`, `herdmember`, `oceantrawler`  
**Tags:** Checks `oceantrawler`, `gnarwail`, `shark`, `fishschoolspawnblocker`, `oceanfish`, and `oceanfishable` via `FindEntities`; adds no tags itself.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity instance the component is attached to. |

## Main functions
### `ShouldSpawnANewSchoolForPlayer(player)`
* **Description:** Determines whether a new fish school should be spawned for a given player based on ocean coverage, existing fish, spawn blockers, and luck. Called internally as part of scheduled spawn attempts.
* **Parameters:** `player` (`Entity`) — the player entity to evaluate.
* **Returns:** `boolean` — `true` if a school should spawn, otherwise `false`.
* **Error states:** Returns `false` if ocean coverage is insufficient or if spawn blocking entities are present.

### `GetSpawnPoint(pt)`
* **Description:** Finds a valid ocean spawn position near the given point using a radial fan search, verifying that a valid school type exists at the candidate location.
* **Parameters:** `pt` (`Vector3`) — the base position (e.g., player position) to search around.
* **Returns:** `Vector3?` — the offset position for spawning, or `nil` if no suitable location found.
* **Error states:** Returns `nil` if no swimmable, valid-tile position is found within the search radii.

### `SpawnSchool(spawnpoint, target, override_spawn_offset)`
* **Description:** Spawns a school of fish at the specified point using data from `PickSchool`. Creates a school herd and individual fish, applies herd membership, spawns a `fishschoolspawnblocker`, and checks for gnarwail/shark spawns on ocean tiles.
* **Parameters:**  
  - `spawnpoint` (`Vector3`) — world position to spawn the school center.  
  - `target` (`Entity`) — the player associated with this spawn (used for luck calculations and predator triggers).  
  - `override_spawn_offset` (`Vector3?`) — optional fixed offset relative to `spawnpoint`.
* **Returns:** `number` — number of fish successfully spawned (`count`).
* **Error states:** Returns `0` if `PickSchool` yields no valid school data or if ocean tile conditions fail (e.g., not ocean). Also destroys the herd entity if spawning fails post-herd creation.

### `GetFishPrefabAtPoint(spawnpoint)`
* **Description:** Returns the prefab name for the school type that would spawn at the given point, without actually spawning.
* **Parameters:** `spawnpoint` (`Vector3`) — world position to check.
* **Returns:** `string?` — the prefab name (e.g., `"smallfish"`), or `nil` if no valid school type exists there.
* **Error states:** Returns `nil` if `PickSchool` returns `nil`.

### `GetDebugString()`
* **Description:** Returns a multiline debug string showing scheduled spawn tasks per player, including time remaining and ocean percentage at their position.
* **Parameters:** None.
* **Returns:** `string` — formatted debug output.

## Events & listeners
- **Listens to:**  
  - `ms_playerjoined` — triggers `ScheduleSpawn` for the joining player.  
  - `ms_playerleft` — triggers `CancelSpawn` for the leaving player.  
- **Pushes:**  
  - `schoolspawned` — fired with `{ spawnpoint = spawnpoint }` when a school is successfully spawned.  

## Events & listeners
