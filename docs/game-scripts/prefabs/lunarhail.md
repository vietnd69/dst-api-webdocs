---
id: lunarhail
title: Lunarhail
description: Manages the visual particle system and splash effects for lunar hail precipitation in the game world.
tags: [fx, weather, environment]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9cdf4e4f
system_scope: environment
---

# Lunarhail

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lunarhail` is a non-persistent FX prefab that renders the visual representation of lunar hail—white particles falling from the sky and occasionally triggering splash effects on terrain or water surfaces. It uses the VFXEffect component to emit and animate particles, manages particle pools for reusable splash entities (`lunarhaildrop`, `raindrop`), and respects rain dome boundaries by checking `IsUnderRainDomeAtXZ`. It integrates with the `RainDome` component to avoid spawning hail inside sheltered zones.

## Usage example
```lua
local inst = SpawnPrefab("lunarhail")
inst:DoTaskInTime(0, function() inst:PostInit() end)
-- The entity automatically updates via EmitterManager
-- and cleans up on removal via OnRemoveEntity hook
```

## Dependencies & tags
**Components used:** `VFXEffect`, `Transform`
**Tags:** Adds `FX`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `haildrop_pool` | table | `{ valid = true, ents = {} }` | Pool of reusable `lunarhaildrop` prefabs for splash effects. |
| `raindrop_pool` | table | `{ valid = true, ents = {} }` | Pool of reusable `raindrop` prefabs for splash effects over water. |
| `particles_per_tick` | number | `0` | Desired number of particles to emit per simulation tick. |
| `splashes_per_tick` | number | `0` | Desired number of splash entities to spawn per tick. |
| `num_particles_to_emit` | number | `particles_per_tick` | Remaining particles to emit this tick. |
| `num_splashes_to_emit` | number | `0` | Remaining splashes to spawn this tick. |

## Main functions
### `PostInit()`
* **Description:** Pre-warms the particle system by simulating `MAX_LIFETIME` (0.7s) of updates at ~30 FPS using `updateFunc` and fast-forwards the VFX emitter. Ensures visual consistency on initial appearance.
* **Parameters:** None.
* **Returns:** Nothing.

### `updateFunc(fastforward)`
* **Description:** Core update function called by `EmitterManager` each tick. Emits new particles if `num_particles_to_emit > 0`, respects screen clipping and rain dome boundaries, and spawns splash effects for valid terrain locations. Resets counters each tick.
* **Parameters:** `fastforward` (number or `nil`) – If provided, skips animation frames on spawned splash entities using `AnimState:FastForward`.
* **Returns:** Nothing.

### `SpawnLunarHailDropAtXZ(inst, x, z, fastforward)`
* **Description:** Spawns either a `raindrop` (if over ocean) or `lunarhaildrop` (normal terrain) at the specified world coordinates. Uses pooled entities if available.
* **Parameters:**
  * `inst` (entity) – Owner entity containing pools.
  * `x` (number) – World X coordinate.
  * `z` (number) – World Z coordinate.
  * `fastforward` (number or `nil`) – Optional frames to skip on splash animation.
* **Returns:** Nothing.

## Events & listeners
- **Pushes:** None.
- **Listens to:** None.

## Properties (Internal/Transient)
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `max_lifetime` | number | `0.7` | Maximum particle lifetime in seconds (hardcoded). |
| `particles_per_second` | number | `0` | Target rate of particles (disabled in current code). |
| `splashes_per_second` | number | `0` | Target rate of splashes (disabled in current code). |
| `emitter_shape` | function | `CreateBoxEmitter(...)` | Callable that returns random `(x,y,z)` offset within emission bounds. |
| `delay` | number (per splash) | `nil` | Optional delay before splash animation begins; set for ~20% of `lunarhaildrop` splashes. |
| `angle` | number | `0` | Random rotation angle per particle emitted. |

## External dependencies
- `components/raindome.lua`: Referenced for radius (`16`) via `v.components.raindome.radius` in boundary clamping logic (currently commented out in default).
- `IsUnderRainDomeAtXZ(x, z)`: Global function used to determine if a point is under any active rain dome.
- `GetRainDomesAtXZ(x, z)`: Returns list of rain dome entities under the point.

## Notes
- The prefab is **non-persistent** (`inst.persists = false`) and cannot sleep (`SetCanSleep(false)`), ensuring FX updates continue even in sleeping chunks.
- `initEnvelope` runs only once globally; subsequent instantiations skip redefinition.
- Particle count and splash rate are currently disabled (`0`) in production code but code paths for them remain.