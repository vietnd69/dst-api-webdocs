---
id: rain
title: Rain
description: Manages in-game rainfall particle effects and raindrop spawning logic using a VFX emitter system.
tags: [environment, fx, weather]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ca3df19b
system_scope: environment
---

# Rain

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`rain` is a non-networked, non-persistent entity responsible for rendering rainfall particles and handling raindrop splashes. It uses a VFX effect system with configurable particle emission, acceleration, and blending. The entity integrates with the `raindome` component to detect sheltered areas (under rain domes) and suppresses rain particle generation inside them. Raindrops (splash effects) are spawned from a reusable pool for performance.

## Usage example
```lua
local rain_entity = SpawnPrefab("rain")
rain_entity:PostInit()  -- Pre-warm the effect by simulating a few frames
-- Rain effect runs continuously via EmitterManager until the entity is removed
```

## Dependencies & tags
**Components used:** `raindome` (read-only via `dome.components.raindome.radius`, accessed through `GetRainDomesAtXZ` and `IsUnderRainDomeAtXZ`)
**Tags:** Adds `FX` tag.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `raindrop_pool` | table | `{valid = true, ents = {}}` | Pool of reusable `raindrop` prefabs; cleared on entity removal. |
| `particles_per_tick` | number | `0` | Target particles spawned per simulation tick (based on `desired_particles_per_second`). |
| `splashes_per_tick` | number | `0` | Target splashes spawned per tick. |
| `num_particles_to_emit` | number | `0` | Accumulator tracking how many particles to emit in current frame. |
| `num_splashes_to_emit` | number | `0` | Accumulator tracking how many splash entities to spawn. |

## Main functions
### `PostInit()`
* **Description:** Pre-warms the VFX emitter by simulating a fixed number of frames (30 FPS time steps) to ensure visual consistency upon first appearance.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None.

## Events & listeners
- **Pushes:** None.
- **Listens to:** None.
