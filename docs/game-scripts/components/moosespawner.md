---
id: moosespawner
title: Moosespawner
description: Manages Moose boss spawning mechanics and nest initialization during Spring season.
tags: [boss, spawn, seasonal]
sidebar_position: 10
last_updated: 2026-04-22
build_version: 722832
change_status: stable
category_type: components
source_hash: 51a7162f
system_scope: environment
---

# Moosespawner

> Based on game build **722832** | Last updated: 2026-04-22

## Overview
`Moosespawner` controls the spawning behavior of the Moose boss entity in relation to Moose Nesting Ground prefabs. It operates exclusively on the master simulation server and initializes nests during Spring season based on configured density values. The component coordinates with timer and entitytracker components to manage spawn timing and mother-egg relationships.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("moosespawner")

-- Initialize all nests in the world (typically called on Spring start)
inst.components.moosespawner:InitializeNests()

-- Spawn a moose at a specific nest with egg
-- Obtain nest reference through game world (e.g., from Ents table or other valid means)
local nest = Ents[1] -- example nest reference
inst.components.moosespawner:DoHardSpawn(nest)

-- Spawn a moose with glide animation (no egg)
inst.components.moosespawner:DoSoftSpawn(nest)
```

## Dependencies & tags
**External dependencies:**
- `easing` -- required but not actively used in visible code
- `TUNING` -- accesses MOOSE_DENSITY, SEG_TIME, NO_BOSS_TIME constants
- `Ents` -- global entity table for finding nest prefabs
- `TheWorld` -- world state monitoring via WatchWorldState
- `SpawnPrefab` -- spawns moose and mooseegg prefabs
- `PickSome` -- selects random subset of nests for spawning
- `FindWalkableOffset` -- calculates valid spawn positions
- `Vector3` -- position vector operations

**Components used:**
- `timer` -- StartTimer/StopTimer for CallMoose and WantsToLayEgg timers on nests and moose
- `entitytracker` -- TrackEntity to link moose and egg entities together
- `transform` -- Sets position for spawned moose and egg entities
- `sg` -- StateGraph control for moose glide animation

**Tags:**
None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | Entity | N/A (set in constructor) | The entity instance that owns this component. |

## Main functions

### `OverrideAttackDensity(density)`
* **Description:** Deprecated function. Previously allowed overriding the moose spawn density value. No longer performs any operation.
* **Parameters:** `density` -- number value for spawn density (ignored).
* **Returns:** None.
* **Error states:** None.

### `DoSoftSpawn(nest)`
* **Description:** Spawns a moose entity at the nest location with a glide animation. The moose will act out laying an egg sequence. Stops the nest's CallMoose timer.
* **Parameters:** `nest` -- Moose Nesting Ground entity instance.
* **Returns:** None.
* **Error states:** Errors if `nest` is nil or lacks `timer` component.

### `DoHardSpawn(nest)`
* **Description:** Spawns a moose egg at the nest position, then spawns the moose at a nearby walkable offset. Uses FindWalkableOffset with fallback to Vector3(0,0,0) if no valid offset found. Establishes bidirectional entity tracking between moose (mother) and egg. Initializes the egg entity.
* **Parameters:** `nest` -- Moose Nesting Ground entity instance.
* **Returns:** None.
* **Error states:** Errors if `nest` is nil. Errors if `mooseegg` prefab fails to spawn (egg would be nil, causing crash on egg.components.entitytracker or egg:InitEgg() access).

### `InitializeNest(nest)`
* **Description:** Sets up a single nest with a CallMoose timer and marks it as expecting a moose spawn. Timer duration is randomized between 8 and 24 segment times.
* **Parameters:** `nest` -- Moose Nesting Ground entity instance.
* **Returns:** None.
* **Error states:** Errors if `nest` is nil or lacks `timer` component.

### `InitializeNests()`
* **Description:** Finds all moose nesting grounds in the world, selects a subset based on density configuration, and initializes each selected nest. Typically called when Spring season begins.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** Errors if any nest in the selected list lacks `timer` component (called by InitializeNest).

## Events & listeners
- **Listens to:** `isspring` (World State) -- via `WatchWorldState`, triggers `InitializeNests()` when Spring begins and cycle count exceeds `TUNING.NO_BOSS_TIME`.