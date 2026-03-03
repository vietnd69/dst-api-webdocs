---
id: emitter
title: Emitter
description: Manages particle emission for an entity by scheduling and dispatching particles over time using a custom update loop.
tags: [fx, particle, world]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 031585d1
system_scope: fx
---

# Emitter

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Emitter` is a lightweight component responsible for emitting particles from an entity over time. It supports both legacy `ParticleEmitter` and modern `VFXEffect` systems, selecting the appropriate one based on what is attached to the entity. The component calculates particle production rates based on tick time and manages particle count limits using configurable density and lifetime factors. It integrates with the global `EmitterManager` system to schedule periodic updates.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("emitter")

inst.components.emitter.max_lifetime = 2.0
inst.components.emitter.ground_height = 0.5
inst.components.emitter.density_factor = 1.5
inst.components.emitter.config = { max_num_particles = 100 }

inst.components.emitter.area_emitter = function()
    return 0, 0, 0  -- center emission point
end

inst.components.emitter:Emit()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | Entity | `nil` (assigned in constructor) | The entity instance this component is attached to. |
| `area_emitter` | function | `function() print("no emitter") end` | Callback that returns `(x, z)` coordinates for particle spawn position. |
| `config` | table | `{}` | Configuration table, expected to contain `max_num_particles`. |
| `max_lifetime` | number | `1` | Maximum lifetime (in seconds) for emitted particles. Actual lifetime is randomized within ±10% of this value. |
| `ground_height` | number | `1` | Vertical (`y`) position where particles are emitted. |
| `particles_per_tick` | number | `1` | Estimated number of particles to emit per tick (derived from desired rate and tick duration). |
| `num_particles_to_emit` | number | `1` | Current accumulated particle count scheduled for emission. |
| `density_factor` | number | `1` | Multiplier applied to particle counts and lifetimes for scaling emission intensity. |

## Main functions
### `Emit()`
* **Description:** Starts the particle emission process by registering an update function with `EmitterManager`. It calculates per-tick emission rates and configures particle limits for both legacy and modern VFX systems. Does not emit particles immediately — it schedules periodic emission updates.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** If neither `VFXEffect` nor `ParticleEmitter` is present on `self.inst`, the component will silently fail to emit (no particles added, but no error thrown).

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified  
