---
id: emitter
title: Emitter
description: Manages the continuous emission of particles from an entity, coordinating with either the VFXEffect or ParticleEmitter components.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# Emitter

## Overview
The Emitter component is responsible for orchestrating the continuous generation and emission of particles from an entity. It acts as a wrapper, abstracting away the specifics of whether the entity uses the modern `VFXEffect` component or the legacy `ParticleEmitter` component for particle rendering. It defines parameters like particle lifetime, emission rate, and starting position, and interfaces with a global `EmitterManager` to manage ongoing particle updates.

## Dependencies & Tags
This component implicitly relies on the entity having either a `VFXEffect` or `ParticleEmitter` component attached to perform actual particle rendering. It also depends on the global `EmitterManager` for scheduling its update logic.
None identified.

## Properties
| Property | Type | Default Value | Description |
| :------- | :--- | :------------ | :---------- |
| `inst` | `table` | `nil` | A reference to the entity this component is attached to. |
| `area_emitter` | `function` | `function() print("no emitter") end` | A function that, when called, should return the `x` and `z` coordinates for a particle's spawn position. |
| `config` | `table` | `{}` | A table intended to hold configuration parameters, such as `max_num_particles`, used by the particle system. |
| `max_lifetime` | `number` | `1` | The base maximum lifetime for emitted particles, in seconds. Actual lifetime varies slightly. |
| `ground_height` | `number` | `1` | The default `y` (height) coordinate for emitted particles. |
| `particles_per_tick` | `number` | `1` | The number of particles to add to the `num_particles_to_emit` counter each simulation tick. |
| `num_particles_to_emit` | `number` | `1` | A counter tracking the number of particles that are currently queued to be emitted. |
| `density_factor` | `number` | `1` | A multiplier applied to the number of particles and desired particles per second, effectively controlling the particle density. |

## Main Functions
### `Emit()`
*   **Description:** Initiates the particle emission process for the entity. It configures the attached `VFXEffect` or `ParticleEmitter` component and registers a continuous update function with the `EmitterManager` to regularly spawn new particles based on the component's properties.
*   **Parameters:** None.