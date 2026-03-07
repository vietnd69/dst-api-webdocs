---
id: lighterfire
title: Lighterfire
description: Generates and manages visual particle effects for a lighter-style fire, using custom colour and scale envelopes for dynamic appearance.
tags: [fx, visual, particle]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 28b34150
system_scope: fx
---

# Lighterfire

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`Lighterfire` is a prefab helper component that creates a small, stylized fire effect using the VFX system. It is not a standalone component but a prefab factory created by delegating to `MakeLighterFire`, which is defined in `lighterfire_common.lua`. This file configures and initializes particle effect parameters such as texture, shader, lifetime, colour envelope, scale envelope, and emission rate. It only runs client-side and skips initialization on dedicated servers.

## Usage example
```lua
-- This is a prefab factory, not a component to be added directly.
-- Use it by instantiating the prefab (e.g., via_prefab("lighterfire"))
-- Typically used internally or via prefabs that consume this effect.
-- Example internal usage in another prefab's master_postinit:
local inst = ... -- some entity
inst:AddVisual("lighterfire")
inst.components.firelight:Enable(true)
```

## Dependencies & tags
**Components used:** None (this file does not directly interact with components; it defines a prefab that may be added via visual wrappers).
**Tags:** None identified.

## Properties
No public properties are defined or exposed directly by this file.

## Main functions
### `common_postinit(inst)`
*   **Description:** Initializes the visual particle effect for client-side rendering. Registers VFX effect, sets texture/shader, configures envelopes for colour and scale, and starts the emission loop. Does nothing on dedicated servers.
*   **Parameters:** `inst` (entity instance) — the entity this effect is attached to.
*   **Returns:** Nothing.
*   **Error states:** Returns early without effect if `TheNet:IsDedicated()` is `true`.

### `master_postinit(inst)`
*   **Description:** Sets fixed pixel offsets for the effect’s position relative to the entity (`fx_offset_x` and `fx_offset_y`). Used for alignment in UI or entity space.
*   **Parameters:** `inst` (entity instance).
*   **Returns:** Nothing.

### `InitEnvelope()`
*   **Description:** (Internal, called once only.) Registers the colour and scale envelopes used by the particle effect. Defines a colour transition from orange/yellow to red and fading out, and a scale decay over the particle’s lifetime.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Automatically sets `InitEnvelope = nil` after first call, preventing re-initialization.

### `emit_fn(effect, sphere_emitter)`
*   **Description:** (Internal helper.) Emits a single particle with randomized velocity, lifetime, and UV offset.
*   **Parameters:** 
    *   `effect` (VFXEffect instance) — target effect container.
    *   `sphere_emitter` (function) — returns a 3D position vector for particle spawn.
*   **Returns:** Nothing.

## Events & listeners
None identified.