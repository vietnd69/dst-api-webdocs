---
id: lighterfire_heart
title: Lighterfire Heart
description: Creates and manages visual particle effects (smoke and embers) for the lighter fire heart item in DST.
tags: [fx, particle, visual]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ae5729d3
system_scope: fx
---

# Lighterfire Heart

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `lighterfire_heart` prefab is a visual FX component that generates persistent particle effects (smoke and embers) using the VFX system. It is a specialized variant of the lighter fire system, implemented via `MakeLighterFire` from `lighterfire_common.lua`. The component initializes rendering resources, sets up color and scale envelopes for animation, and uses an emitter manager to periodically spawn particles over time.

This prefab is used for the "Heart" variant of the lighter fire, which features distinct visual characteristics: a pulsing multi-stage smoke effect with fading transparency and fast-moving ember particles.

## Usage example
```lua
-- Internally instantiated by the game for the "lighterfire_heart" prefab.
-- No direct usage is required for modders; it is created via:
local inst = SpawnPrefab("lighterfire_heart")
```

## Dependencies & tags
**Components used:** None identified (uses VFX effect API and EmitterManager)
**Tags:** None identified

## Properties
No public properties.

## Main functions
### `common_postinit(inst)`
*   **Description:** Initializes and configures the VFX effect system for smoke and ember particles on the entity. Sets up particle emission parameters, rendering resources (textures/shaders), envelopes, blend modes, and bloom. Only runs on non-dedicated servers. Ensures envelopes are initialized once via `InitEnvelope`.
*   **Parameters:** `inst` (TheEntity) — the instance being initialized.
*   **Returns:** Nothing.
*   **Error states:** Returns early if run on a dedicated server or if `InitEnvelope` is `nil` (already initialized).

### `master_postinit(inst)`
*   **Description:** Sets FX offset properties for positioning the visual effect relative to its owner (used for offsetting rendering from parent entity).
*   **Parameters:** `inst` (TheEntity) — the instance being initialized.
*   **Returns:** Nothing.

### `InitEnvelope()`
*   **Description:** Internal helper used once to register color and vector2 envelopes with `EnvelopeManager` for particle animation. Defines colour/opacity and scale trajectories over the particle lifetime.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Registers envelopes only on first invocation; sets itself to `nil` after completion to prevent re-initialization.

### `emit_fn(effect, sphere_emitter)`
*   **Description:** Emits a single smoke particle using rotating UV animation with varying velocity, lifetime, and position derived from a sphere emitter.
*   **Parameters:**
    *   `effect` (VFXEffect) — the effect container to add particles to.
    *   `sphere_emitter` (function) — function returning a 3D position (px, py, pz) on a sphere.
*   **Returns:** Nothing.

### `emit_ember_fn(effect, sphere_emitter)`
*   **Description:** Emits a single ember particle with additive blending and drag, varying in velocity and lifetime.
*   **Parameters:**
    *   `effect` (VFXEffect) — the effect container to add particles to.
    *   `sphere_emitter` (function) — function returning a 3D position (px, py, pz) on a sphere.
*   **Returns:** Nothing.

## Events & listeners
None identified.

## Enums & Constants
| Name | Type | Value | Description |
|------|------|-------|-------------|
| `ANIMSMOKE_TEXTURE` | string | `"fx/animsmoke.tex"` | Texture asset for smoke particles. |
| `EMBER_TEXTURE` | string | `"fx/snow.tex"` | Texture asset for ember particles. |
| `REVEAL_SHADER` | string | `"shaders/vfx_particle_reveal.ksh"` | Shader for smoke particle rendering. |
| `ADD_SHADER` | string | `"shaders/vfx_particle_add.ksh"` | Shader for ember particle rendering. |
| `COLOUR_ENVELOPE_NAME` | string | `"lighterfirecolourenvelope_heart"` | Name of smoke colour envelope in `EnvelopeManager`. |
| `SCALE_ENVELOPE_NAME` | string | `"lighterfirescaleenvelope_heart"` | Name of smoke scale envelope in `EnvelopeManager`. |
| `COLOUR_ENVELOPE_NAME_EMBER` | string | `"lighterfirecolourenvelope_heart_ember"` | Name of ember colour envelope. |
| `SCALE_ENVELOPE_NAME_EMBER` | string | `"lighterfirescaleenvelope_heart_ember"` | Name of ember scale envelope. |
| `MAX_LIFETIME` | number | `0.5` | Maximum lifetime of smoke particles (seconds). |
| `EMBER_MAX_LIFETIME` | number | `1.2` | Maximum lifetime of ember particles (seconds). |