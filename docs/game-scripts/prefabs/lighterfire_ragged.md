---
id: lighterfire_ragged
title: Lighterfire Ragged
description: Creates a ragged-style fire visual effect using custom particle envelopes and emitters, deployed via the `MakeLighterFire` framework.
tags: [fx, visual, particle, environment]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 6983b1f5
system_scope: fx
---

# Lighterfire Ragged

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lighterfire_ragged` is a prefab helper that configures and instantiates a visually distinct fire effect using custom particle envelopes for smoke and flame. It is built on top of `MakeLighterFire` (defined in `prefabs/lighterfire_common.lua`) and customizes the rendering behavior through particle emitters, shaders, and time-based emission logic. It is intended for use in environments where a more turbulent or uneven flame appearance ("ragged") is desired over smoother alternatives.

The component does not define a standalone `Component`—instead, it returns a prefab factory function (`MakeLighterFire(...)`) used to generate entities with the described visual properties.

## Usage example
```lua
local inst = Prefabs.GetPrefab("lighterfire_ragged")
if inst then
    inst.Transform:SetPosition(x, y, z)
    TheWorld:SpawnPrefab(inst)
end
```

## Dependencies & tags
**Components used:** `entity`, `transform`, `vfxeffect` (via `AddVFXEffect`)  
**Tags:** None identified.

## Properties
No public properties are defined in this file. Configuration is handled internally via closure variables and passed to the underlying `MakeLighterFire` system.

## Main functions
This file does not define any new functions beyond local helpers (`IntColour`, `InitEnvelope`, `emit_smoke_fn`, `emit_fn`, `common_postinit`, `master_postinit`) used during initialization. All core logic is internal and executed during prefab instantiation.

### `IntColour(r, g, b, a)`
*   **Description:** Converts 8-bit RGB[A] color values to normalized floats `[0..1]`. Used to define particle color envelopes.
*   **Parameters:** `r`, `g`, `b`, `a` (number) — integer color components (0–255).
*   **Returns:** `{r, g, b, a}` — table of normalized floats.
*   **Error states:** Not applicable.

### `InitEnvelope()`
*   **Description:** Registers color and scale envelopes for smoke and fire particles with `EnvelopeManager`. Called once per game session (lazily, via reassignment to `nil`).
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Not applicable.

### `emit_smoke_fn(effect, sphere_emitter)`
*   **Description:** Generates a single smoke particle with randomized velocity, lifetime, and position, using the `effect:AddParticleUV` API.
*   **Parameters:**  
    `effect` (VFXEffect instance) — target effect container.  
    `sphere_emitter` (function) — returns `{x,y,z}` position on unit sphere.
*   **Returns:** Nothing.

### `emit_fn(effect, sphere_emitter)`
*   **Description:** Generates a single flame particle with rotation, using `effect:AddRotatingParticleUV`.
*   **Parameters:**  
    `effect` (VFXEffect instance) — target effect container.  
    `sphere_emitter` (function) — returns `{x,y,z}` position on unit sphere.
*   **Returns:** Nothing.

### `common_postinit(inst)`
*   **Description:** Configures and starts particle emitter logic for the fire effect on the client. Skipped entirely on dedicated servers.
*   **Parameters:** `inst` (Entity instance) — the fire entity being initialized.
*   **Returns:** Nothing.

### `master_postinit(inst)`
*   **Description:** Sets fire offset values (`fx_offset_x`, `fx_offset_y`) for placement relative to parent objects.
*   **Parameters:** `inst` (Entity instance).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.