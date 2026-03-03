---
id: moosespawner
title: Moosespawner
description: Manages the spawning and scheduling of moose entities in relation to moose nesting grounds during spring season.
tags: [environment, boss, seasonal, world, spawning]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: world
source_hash: 78980f66
system_scope: world
---

# Moosespawner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Moosespawner` is a world-scoped component responsible for scheduling and initiating moose appearances based on moose nesting grounds (`moose_nesting_ground` entities). It monitors for spring season transitions and triggers either soft or hard spawns of the `moose` prefab. It is only instantiated on the master simulation and interacts with the `timer` and `entitytracker` components.

## Usage example
```lua
-- Typically added to a persistent world entity (e.g., a world spawner or manager)
local inst = CreateEntity()
inst:AddComponent("moosespawner")
-- Auto-initialization occurs upon spring transition if world cycles exceed TUNING.NO_BOSS_TIME
```

## Dependencies & tags
**Components used:** `timer`, `entitytracker`, `WorldState`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance the component is attached to. |

## Main functions
### `OverrideAttackDensity(density)`
* **Description:** Deprecated stub; no effect.
* **Parameters:** `density` (number) — intended override for moose spawn density.
* **Returns:** Nothing.
* **Error states:** Silently ignored.

### `DoSoftSpawn(nest)`
* **Description:** Performs a soft spawn of a moose by placing it above a nesting ground, setting it to glide state, and scheduling egg-laying.
* **Parameters:** `nest` (`Entity`) — the moose nesting ground entity.
* **Returns:** Nothing.
* **Error states:** Assumes `nest.mooseIncoming` is `true`; sets it to `false`. Stops the nest's `"CallMoose"` timer.

### `DoHardSpawn(nest)`
* **Description:** Performs a hard spawn: creates a `mooseegg` at the nest location, finds a nearby walkable spawn point for the moose, and establishes bidirectional tracking between moose and egg.
* **Parameters:** `nest` (`Entity`) — the moose nesting ground entity.
* **Returns:** Nothing.
* **Error states:** Relies on `FindWalkableOffset` returning a valid offset or `Vector3(0,0,0)`.

### `InitializeNest(nest)`
* **Description:** Schedules a future moose spawn by starting a `"CallMoose"` timer on the nest (random interval between 8 and 24 SEGS) and marks it as incoming.
* **Parameters:** `nest` (`Entity`) — the moose nesting ground entity.
* **Returns:** Nothing.

### `InitializeNests()`
* **Description:** Scans the world for all `moose_nesting_ground` entities, selects a subset based on `TUNING.MOOSE_DENSITY`, and initializes them for future spawning.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `isspring` — triggers `InitializeNests` if the current world season is spring and `TheWorld.state.cycles > TUNING.NO_BOSS_TIME`.
- **Pushes:** None identified.
