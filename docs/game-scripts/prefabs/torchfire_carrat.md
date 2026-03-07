---
id: torchfire_carrat
title: Torchfire Carrat
description: Creates a particle-based fire effect for a torch-like entity in DST, using custom color and scale envelopes for smoke and flame rendering.
tags: [fx, torch, visual]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4ae5a60c
system_scope: fx
---

# Torchfire Carrat

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`torchfire_carrat` is a prefab factory that constructs a torch fire entity using the `MakeTorchFire` utility. It specializes in rendering a stylized fire effect composed of two particle emitters: one for smoke and one for flame. It defines custom color and scale envelopes via `EnvelopeManager`, sets up particle emission rates, and configures VFX rendering properties such as blending modes, bloom, and UV frame layout. This prefab is used in-game for visual effects associated with carrat-themed torches and requires non-dedicated server environments for particle rendering.

## Usage example
```lua
-- This is a prefab definition — not a component to be added manually.
-- It is registered as a prefab and instantiated via CreateContext or PrefabWorldBuilder.
-- Example in a mod's prefabs folder:
return Prefab("torchfire_carrat", nil, nil, "torchfire_carrat")
```

## Dependencies & tags
**Components used:** `vfxeffect` (added via `inst.entity:AddVFXEffect()`), `emittermanager` (via `EmitterManager:AddEmitter`)
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `InitEnvelope()`
*   **Description:** Initializes two color envelopes (smoke and fire) and two vector2 envelopes (smoke and fire scale) with time-based interpolation values. Called once globally during first instantiation if not already initialized.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No explicit failure mode; mutates global state via `EnvelopeManager`.

### `common_postinit(inst)`
*   **Description:** Sets up the VFX effect for the entity if not running on a dedicated server. Initializes particle emitters for smoke and fire, configures render resources (textures, shaders), particle limits, blending modes, bloom, UV layout, and starts the particle emission loop via `EmitterManager`.
*   **Parameters:** `inst` (Entity) — the prefab instance being initialized.
*   **Returns:** Nothing.
*   **Error states:** Returns early on dedicated servers (`TheNet:IsDedicated()`) without creating any VFX.

### `master_postinit(inst)`
*   **Description:** Sets entity-local fire-offset properties (`fx_offset_x` and `fx_offset`) used to position the VFX relative to the parent entity.
*   **Parameters:** `inst` (Entity) — the prefab instance.
*   **Returns:** Nothing.

### `emit_smoke_fn(effect, sphere_emitter)`
*   **Description:** Emit function for the smoke particle system. Creates a single smoke particle with randomized properties (lifetime, velocity, position, UV frame).
*   **Parameters:**  
    `effect` (VFXEffect) — target effect object.  
    `sphere_emitter` (function) — returns a 3D position vector from the emitter’s local space.  
*   **Returns:** Nothing (creates a particle directly via `effect:AddParticleUV`).

### `emit_fire_fn(effect, sphere_emitter)`
*   **Description:** Emit function for the fire particle system. Creates a single rotating fire particle with randomized rotation and velocity.
*   **Parameters:**  
    `effect` (VFXEffect) — target effect object.  
    `sphere_emitter` (function) — returns a 3D position vector.  
*   **Returns:** Nothing (creates a particle directly via `effect:AddRotatingParticleUV`).

## Events & listeners
None.