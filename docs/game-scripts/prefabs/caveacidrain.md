---
id: caveacidrain
title: Caveacidrain
description: Manages the spawning and rendering of acid rain particles in the game world, including interaction with rain domes and entity pooling.
tags: [environment, fx, pool, weather]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c83bb49b
system_scope: environment
---

# Caveacidrain

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`caveacidrain` is a non-networked FX entity responsible for generating and animating acid rain particles in the world. It uses an emitter-based system (`VFXEffect`) to render falling particles and maintains a local pool of `acidraindrop` prefabs for splash effects. It integrates with the `RainDome` system to avoid spawning rain where covered (e.g., under structures like rain domes), and respects map constraints like passability and acid rain eligibility per point.

## Usage example
```lua
-- The prefab is automatically instantiated via world generation or events (e.g., in cave biomes).
-- Typical usage does not require manual spawning; however, if needed:
local rain = SpawnPrefab("caveacidrain")
-- The rain emitter runs automatically via EmitterManager after PostInit()
-- No further manual calls are required for basic operation.
```

## Dependencies & tags
**Components used:** `nil` (no direct component access)
**Tags:** Adds `FX` tag; entity is explicitly marked non-persistent (`persists = false`) and cannot sleep (`SetCanSleep(false)`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `acidraindrop_pool` | table | `{ valid = true, ents = {} }` | Pool table for `acidraindrop` prefabs; used for efficient reuse. |
| `particles_per_tick` | number | `0` | Target number of particles to emit per simulation tick. |
| `splashes_per_tick` | number | `0` | Target number of splash raindrops to spawn per tick (currently disabled by default). |
| `num_particles_to_emit` | number | `particles_per_tick` | Accumulator used to track how many particles remain to emit. |
| `num_splashes_to_emit` | number | `0` | Accumulator for splash drops (unused by default). |
| `OnRemoveEntity` | function | `OnRemoveEntity` | Cleanup function; clears the raindrop pool and invalidates it on entity removal. |

## Main functions
### `GetPooledFx(prefab, pool)`
*   **Description:** Retrieves a reusable FX entity from the pool or spawns a new one if the pool is empty.
*   **Parameters:** `prefab` (string) - name of the prefab to spawn; `pool` (table) - pool table containing `ents` array and `valid` flag.
*   **Returns:** The FX entity instance (table).
*   **Error states:** May return a newly spawned entity if pooling is exhausted or pool is invalid.

### `ClearPoolEnts(ents)`
*   **Description:** Removes and nils all entities in the provided pool array.
*   **Parameters:** `ents` (table) - array of FX entity instances to destroy.
*   **Returns:** Nothing.

### `SpawnRaindropAtXZ(inst, x, z, fastforward)`
*   **Description:** Spawns or recycles an `acidraindrop` at the specified world coordinates and optionally fast-forwards its animation.
*   **Parameters:** `inst` (entity) - owner of the rain pool; `x`, `z` (numbers) - world coordinates; `fastforward` (optional number) - animation frame to fast-forward to.
*   **Returns:** Nothing.

### `OnRemoveEntity(inst)`
*   **Description:** Cleanup handler invoked when the entity is removed; clears the raindrop pool and marks it invalid.
*   **Parameters:** `inst` (entity) - the entity being removed.
*   **Returns:** Nothing.

### `updateFunc(fastforward)`
*   **Description:** Core simulation function executed every tick by `EmitterManager`. Emits falling acid rain particles and splash raindrops based on configuration, respecting rain dome coverage and map constraints.
*   **Parameters:** `fastforward` (optional number) - time delta to simulate when fast-forwarding (e.g., during `PostInit`).
*   **Returns:** Nothing.
*   **Error states:** Skips particle/spawn logic if `num_particles_to_emit` or `num_splashes_to_emit` is zero; safely handles missing or invalid `RainDome` components via fallback checks.

## Events & listeners
- **Listens to:** `nil` (no event listeners registered).
- **Pushes:** `nil` (no events fired by this component).
