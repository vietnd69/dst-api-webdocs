---
id: caverain
title: Caverain
description: Generates and manages particle-based rain effects for cave environments, including pooling of raindrop prefabs and integration with rain dome boundaries.
tags: [fx, environment, pooling]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8f2a4900
system_scope: environment
---

# Caverain

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`caverain` is a non-networked FX prefab that dynamically generates rain particle effects within cave environments. It creates visual raindrops using an emitter system with configurable particle count, acceleration, and lifetime, while respecting game logic such as `raindome` boundaries to avoid spawning rain indoors. It maintains an internal pool of `raindrop` prefabs for splash effects and integrates with world geometry and camera culling for performance optimization.

The component interacts with the `RainDome` component via `GetRainDomesAtXZ` and `IsUnderRainDomeAtXZ` to determine where rain should be occluded, and it uses `TheSim:GetScreenPos` for frustum-based culling during particle emission.

## Usage example
```lua
-- caverain is instantiated automatically as a prefab; manual usage is rare.
-- Typical integration involves placing it in a scene:
local rainfx = SpawnPrefab("caverain")
rainfx.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `None` (it is a prefab, not a component; however, it reads from the `RainDome` component on other entities via global functions)  
**Tags:** Adds `FX` tag to the entity.

## Properties
No public properties are exposed directly on the `caverain` entity. Internal state is managed in the `inst` table (e.g., `inst.raindrop_pool`, `inst.particles_per_tick`) but not intended for external modification.

## Main functions
No explicit public methods are exported. Functionality is encapsulated in internal closures and registered via `EmitterManager:AddEmitter`. Key internal behaviors are documented as follows:

### `updateFunc(fastforward)`
* **Description:** Core update loop responsible for emitting rain particles and spawning splash raindrop prefabs. Called per tick by the emitter manager. Supports fast-forwarding for initial rendering.
* **Parameters:** `fastforward` (number or `nil`) — optional time delta for fast-forwarding animations of spawned raindrops.
* **Returns:** Nothing.
* **Error states:** May skip raindrop spawning if world position is non-passable or inside a rain dome; also may cull drops based on screen bounds.

### `SpawnRaindropAtXZ(inst, x, z, fastforward)`
* **Description:** Spawns a `raindrop` prefab at the specified world coordinates, reusing pooled entities when possible. Applies fast-forwarding if requested.
* **Parameters:**  
  * `inst` (Entity) — the `caverain` instance (used for pool reference).  
  * `x` (number), `z` (number) — world coordinates for spawn position.  
  * `fastforward` (number or `nil`) — optional animation time to fast-forward.
* **Returns:** Nothing.

### `OnRemoveEntity(inst)`
* **Description:** Cleanup callback invoked on entity removal; clears the pooled raindrop pool and invalidates it.
* **Parameters:** `inst` (Entity) — the `caverain` entity being removed.
* **Returns:** Nothing.

## Events & listeners
* **Pushes:** No events are pushed directly by this prefab.
* **Listens to:** None — relies on `EmitterManager` lifecycle and `OnRemoveEntity` callback.

### Dependencies (External Functions)
* `GetRainDomesAtXZ(x, z)` — returns list of `raindome`-bearing entities covering the point.
* `IsUnderRainDomeAtXZ(x, z)` — returns boolean indicating whether point is under any rain dome.
* `TheSim:GetScreenPos(x, y, z)` — returns screen-space coordinates for world point.
* `TheCamera:GetRightVec()` — returns unit vector for camera right direction.
* `EmitterManager:AddEmitter` — registers `updateFunc` for per-frame calls.
* `EnvelopeManager` — manages color and scale envelopes for VFX particles.
* `TheWorld.Map:IsPassableAtPoint` — used to validate raindrop spawn points.

### Internal Properties (Not Public API)
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst.raindrop_pool` | table | `{valid=true, ents={}}` | Pool for `raindrop` prefabs (reused for splashes). |
| `inst.particles_per_tick` | number | `0` | *Computed* number of particles to emit per tick. |
| `inst.splashes_per_tick` | number | `0` | *Computed* number of splash raindrops to spawn per tick. |
| `inst.num_particles_to_emit` | number | `0` | Accumulator for pending particles to emit. |
| `inst.num_splashes_to_emit` | number | `0` | Accumulator for pending splash drops. |

### Prefab Details
* **Assets required:** `fx/rain.tex` (image), `shaders/vfx_particle.ksh` (shader).
* **Child prefabs required:** `raindrop`.
* **Pooled entities:** `raindrop` instances are reused for splashes; pool is cleared on entity removal.
* **Non-persistent:** `inst.persists = false`; only exists in active world session.
* **Non-sleepable:** `inst.entity:SetCanSleep(false)` ensures continuous updates.

### Notes for Modders
* Avoid creating multiple `caverain` instances — intended as singleton FX context per cave region.
* `updateFunc` runs every simulation tick and must remain lightweight.
* `raindome.radius` is hard-coded to `16` in this file (not accessed via `component.radius`); future-proofing should rely on global helper `GetRainDomesAtXZ` rather than direct property access.
* `FastForward` is only applied to spawned raindrops, not to particle emitters; VFX particles are fast-forwarded via `effect:FastForward(0, dt)`.