---
id: lureplantspawner
title: Lureplantspawner
description: Manages the seasonal spawning of Lureplants during spring by tracking player movement trails and probabilistically placing them around active players.
tags: [map, spawning, seasonal, environment]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: a93c420b
system_scope: environment
---

# Lureplantspawner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Lureplantspawner` is a server-side-only component responsible for spawning `lureplant` prefabs during the Spring season. It tracks each active player's trail of recent positions and uses weighted random selection to spawn plants near players—prioritizing locations where players have recently walked. It also attempts to spawn at random positions around the player when no suitable trail points exist. The component is strictly initialized on the master simulation and never runs on clients.

## Usage example
This component is automatically attached and initialized internally by the game for a dedicated world-spawner entity (e.g., `lureplant_spawner` prefab). It requires no manual setup.

```lua
-- Not typically used by modders directly.
-- The component is added automatically to the world spawner prefab:
-- inst:AddComponent("lureplantspawner")
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `lureplantspawner` (implicitly via owning entity), checks `lureplant` (during spawn validation)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity instance that owns this component (set by constructor). |

## Main functions
### `GetDebugString()`
* **Description:** Returns a formatted string containing the current spawn interval and variance values for debugging purposes.
* **Parameters:** None.
* **Returns:** `string` — e.g., `"spawn interval:40.00, variance:10.00"`.

> **Depreciated Methods**  
> The following public methods exist but contain no implementation and are unused in the codebase:  
> `SpawnModeNever()`, `SpawnModeHeavy()`, `SpawnModeNormal()`, `SpawnModeMed()`, `SpawnModeLight()`  
> These are obsolete and should not be called.

## Events & listeners
- **Listens to:**
  - `ms_playerjoined` — triggers `OnPlayerJoined` to add new players to tracking.
  - `ms_playerleft` — triggers `OnPlayerLeft` to remove players and clean up tasks.
  - `seasontick` — triggers `OnSeasonTick` to start/stop updates based on season (only active during Spring).

- **Pushes:** None.
