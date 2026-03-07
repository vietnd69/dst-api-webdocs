---
id: pollen
title: Pollen
description: Generates and manages a particle-based visual effect simulating floating pollen clouds, typically used in warm or wildfire-affected environments.
tags: [fx, particle, environment]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7f9a6c90
system_scope: fx
---

# Pollen

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`pollen` is a non-persistent FX prefab that emits and animates a field of floating pollen particles using the VFX system. It creates a visual layer that reacts to environmental conditions — such as time of day and local temperature — modifying particle motion and behavior accordingly. It is not a component in the traditional ECS sense (i.e., it is a prefab, not a reusable `Component` class), but behaves as a self-contained entity used for atmospheric rendering. The effect is centered on the entity's world position and respects terrain (particles do not spawn over impassable tiles like water).

## Usage example
```lua
-- Create and spawn a pollen effect at a given world position
local pollen = SpawnPrefab("pollen")
if pollen ~= nil then
    pollen.Transform:SetPosition(x, y, z)
end
-- Pollen runs continuously via EmitterManager and updates automatically
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `FX` tag; checks `TheWorld.state.isday`, `TUNING.WILDFIRE_THRESHOLD`, and `GetLocalTemperature(inst)`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `particles_per_tick` | number | `0` (statically defined as `0`) | Target particle emission rate per tick. Currently unused (set to `0`). |
| `num_particles_to_emit` | number | `0` | Accumulator used to emit particles in batches based on tick-based rate. |
| `time` | number | `0` | Accumulated time (in seconds) used for time-varying acceleration. |
| `interval` | number | `0` | Counter tracking ticks for periodic acceleration updates (refreshes every `10` ticks). |

## Main functions
### `emit_fn()`
* **Description:** Generates a single pollen particle at a random position within a defined horizontal box area around the entity, adjusting vertical offset to avoid spawning underground. Skips spawning over water (impassable tiles). Modifies velocity and lifetime based on global and local environmental conditions (e.g., daytime and high temperature increase upward drift).
* **Parameters:** None (closes over `inst`, `effect`, `emitter_shape`, `TheWorld.Map`, `TheWorld.state`, and `GetTemperatureAtXZ`).
* **Returns:** Nothing.
* **Error states:** Spawning silently skips particles over impassable tiles — no explicit error handling or notifications.

### `updateFunc()`
* **Description:** Main update loop executed by `EmitterManager`. Emits buffered particles (based on `particles_per_tick`), updates particle acceleration using time-varying sine/cosine patterns (different behavior for warm daytime vs. other conditions), and maintains `time` and `interval` counters.
* **Parameters:** None (closes over `inst`, `effect`, `worldstate`, and `GetLocalTemperature`).
* **Returns:** Nothing.

### `inst:PostInit()`
* **Description:** Performs an initial warm-up of the particle simulation by simulating ~`MAX_LIFETIME` seconds of updates in a fast-forward loop (at `dt = 1/30`). Ensures particles appear immediately without waiting for the first frame to build up.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
None identified