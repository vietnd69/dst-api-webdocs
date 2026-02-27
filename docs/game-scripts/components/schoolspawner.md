---
id: schoolspawner
title: Schoolspawner
description: This component manages the spawning of ocean fish schools and special predators (gnarwail/shark) on the master server when players are present in ocean zones.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 50b534d1
---

# Schoolspawner

## Overview
The `schoolspawner` component is responsible for periodically checking if new ocean fish schools should spawn near players, selecting appropriate fish based on season and tile, and spawning them as `schoolherd_*` prefabs in swimmable ocean locations. It also triggers special predator events (gnarwail and shark) under specific ocean conditions after a school is spawned. It operates exclusively on the master simulation and is tied to the world lifecycle.

## Dependencies & Tags
- `inst`: The owning entity must have `TheWorld.ismastersim` (ensured via assertion).
- Listens to world events: `ms_playerjoined`, `ms_playerleft`.
- Uses components and prefabs: `oceantrawler`, `amphibiouscreature`, `herdmember`, `schoolherd_*`, `fishschoolspawnblocker`.
- Tags used internally: `"oceantrawler"`, `"gnarwail"`, `"shark"`, `"fishschoolspawnblocker"`, `"oceanfish"`, `"oceanfishable"`.
- No components are added to `inst` by this script; it is a behavior container attached via `AddPrefabPostInit`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the owning entity (typically the world). |
| `_scheduledtasks` | `table` | `{}` | Private map storing pending spawn timer tasks keyed by player. Used to avoid duplicate spawn checks. |

No other public properties are initialized.

## Main Functions

### `ShouldSpawnANewSchoolForPlayer(player)`
* **Description:** Determines whether a new fish school should spawn near the given player. Checks ocean coverage, spawn blockers, current fish count, and random chance.
* **Parameters:**
  - `player`: The `Entity` representing the player to evaluate.

### `GetSpawnPoint(pt)`
* **Description:** Finds a valid swimmable ocean position near the given point using radial fan searches. Returns a `Vector3` offset from `pt` if a suitable spot is found; otherwise `nil`.
* **Parameters:**
  - `pt`: `Vector3` or position-like object indicating the center point to search around.

### `SpawnSchool(spawnpoint, target, override_spawn_offset)`
* **Description:** Spawns a school of ocean fish at `spawnpoint`, creates a `schoolherd_*` entity, and schedules individual fish with slight delays. May also trigger gnarwail/shark events for ocean swell/rough tiles.
* **Parameters:**
  - `spawnpoint`: `Vector3` — the precise location to attempt spawning.
  - `target`: `Entity` — the player associated with the spawn attempt.
  - `override_spawn_offset`: `Vector3?` — optional offset to use instead of randomized one.

### `GetFishPrefabAtPoint(spawnpoint)`
* **Description:** Returns the fish prefab name (e.g., `"oceanfish"`) that would spawn at the given location, or `nil` if none applicable.
* **Parameters:**
  - `spawnpoint`: `Vector3` — location to query.

### `GetDebugString()`
* **Description:** Returns a multi-line debug string listing each scheduled spawn task (per player), including remaining time and ocean coverage %.
* **Parameters:** None.

## Events & Listeners
- `inst:ListenForEvent("ms_playerjoined", OnPlayerJoined, TheWorld)`  
  Triggers `ScheduleSpawn(player)` for the joining player.
- `inst:ListenForEvent("ms_playerleft", OnPlayerLeft, TheWorld)`  
  Triggers `CancelSpawn(player)` to cancel pending tasks.
- `inst:PushEvent("schoolspawned", { spawnpoint = spawnpoint })`  
  Emitted after a successful school spawn.