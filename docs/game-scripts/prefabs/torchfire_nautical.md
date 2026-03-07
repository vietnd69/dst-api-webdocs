---
id: torchfire_nautical
title: Torchfire Nautical
description: A particle effect component that generates nautical-themed visual effects (smoke, fire, embers) for torch-like entities using VFX particle emitters.
tags: [fx, environment, visual, lighting]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b2fe157d
system_scope: fx
---

# Torchfire Nautical

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`torchfire_nautical` is a prefab initialization module that defines visual particle effects (smoke, fire, and embers) for nautical-style torches. It extends the base `torchfire_common` system by configuring custom particle envelopes, render resources, and emission logic. It is used to spawn entities with distinct visual characteristics suited for ocean or nautical environments, differing in smoke density, fire color, and ember behavior from standard torches.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("torch")
inst:AddTag(" extinguishable")
inst:AddComponent("torch")
inst.prefab = "torchfire_nautical"
-- torchfire_nautical is set as the prefab name in MakeTorchFire call
-- No direct component addition is needed — it is handled via prefab instantiation
```

## Dependencies & tags
**Components used:** None directly accessed via `inst.components.X`; relies on shared `torchfire_common` logic.
**Tags:** None added by this module itself — tagging is handled by the returned `MakeTorchFire` prefab factory.

## Properties
No public properties.

## Main functions
This file defines no top-level functions beyond initialization helpers. All behavior is encapsulated in local functions and passed to `MakeTorchFire`.

### `InitEnvelope()`
*   **Description:** Registers color and scale envelopes used by VFX particle emitters for smoke, fire, and ember effects. Only runs once (self-nulling after execution).
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Registers 6 envelopes via `EnvelopeManager`; fails silently if called after `InitEnvelope` is nulled.

### `emit_smoke_fn(effect, sphere_emitter)`
*   **Description:** Emits a single smoke particle using provided effect and emitter data.
*   **Parameters:**
    *   `effect` (VFXEffect) — target VFX effect instance.
    *   `sphere_emitter` (function) — returns `(px, py, pz)` for particle spawn position.
*   **Returns:** Nothing.
*   **Error states:** Uses `AddParticleUV` with hardcoded emitter index `0`.

### `emit_fire_fn(effect, sphere_emitter)`
*   **Description:** Emits a single fire particle.
*   **Parameters:**
    *   `effect` (VFXEffect) — target VFX effect instance.
    *   `sphere_emitter` (function) — returns `(px, py, pz)` for particle spawn position.
*   **Returns:** Nothing.
*   **Error states:** Uses `AddParticleUV` with emitter index `1`.

### `emit_ember_fn(effect, ember_sphere_emitter)`
*   **Description:** Emits a single ember particle.
*   **Parameters:**
    *   `effect` (VFXEffect) — target VFX effect instance.
    *   `ember_sphere_emitter` (function) — returns `(px, py, pz)` for particle spawn position.
*   **Returns:** Nothing.
*   **Error states:** Uses `AddParticleUV` with emitter index `2`.

### `common_postinit(inst)`
*   **Description:** Initializes VFX effect and particle emission loop for the entity on non-dedicated servers.
*   **Parameters:**
    *   `inst` (Entity instance) — the entity being initialized.
*   **Returns:** Nothing.
*   **Error states:** Returns early on dedicated servers (`TheNet:IsDedicated()`) or if `InitEnvelope` hasn't run.

### `master_postinit(inst)`
*   **Description:** Sets the `fx_offset` property for the entity.
*   **Parameters:**
    *   `inst` (Entity instance) — the entity being initialized.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.