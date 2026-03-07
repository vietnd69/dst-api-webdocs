---
id: lunarrift_crystal_spawn_fx
title: Lunarrift Crystal Spawn Fx
description: Creates a short-lived visual effect (smoke particles) for the lunar rift crystal spawn event.
tags: [fx, visual, particle, vfx]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 6cc95a08
system_scope: fx
---

# Lunarrift Crystal Spawn Fx

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lunarrift_crystal_spawn_fx` is a prefab that instantiates a brief smoke particle effect for visual feedback when a lunar rift crystal spawns. It uses the VFX effect system (`AddVFXEffect`) to render a small cloud of animated smoke particles with custom color and scale envelopes over 0.5 seconds. The effect is not persistent and is discarded automatically. Dedicated servers skip loading the effect entirely.

## Usage example
This prefab is not meant to be manually instantiated by mods. It is spawned internally by the game at the appropriate time (e.g., during lunar rift events). To use it, call:

```lua
local inst = SpawnPrefab("lunarrift_crystal_spawn_fx")
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `FX`

## Properties
No public properties

## Main functions
### `emit_smoke_fn(effect, smoke_emitter)`
* **Description:** Creates and adds a single smoke particle to the VFX effect. Generates randomized velocity and lifetime within small bounds, and emits from a circular emitter.
* **Parameters:**
  * `effect` (VFXEffect) — The effect instance to which the particle is added.
  * `smoke_emitter` (function) — A function returning `(px, pz)` coordinates for particle spawn position.
* **Returns:** Nothing.
* **Error states:** None — silently no-ops if the effect slot is misconfigured, but this is not expected.

## Events & listeners
None identified