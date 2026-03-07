---
id: lighterfire_old
title: Lighterfire Old
description: Creates a visual particle effect simulating a flickering lighter flame using VFX effects and envelope-controlled colour/scale animation.
tags: [fx, visual, particle]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: de264130
system_scope: fx
---

# Lighterfire Old

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lighterfire_old` is a prefab that generates a short-lived, flickering particle-based flame effect using the VFX system. It uses an envelope manager for colour and scale interpolation over time, and spawns particles via an emitter attached to the entity. This prefab is intended for visual feedback only and is never used on dedicated servers. It depends on `lighterfire_common.lua`, which provides the core instantiation logic.

## Usage example
This prefab is typically used internally by other prefabs or game events. A typical usage would be via `TheSim:LoadPrefab` and `SpawnPrefab`, but modders usually call it through higher-level helpers:
```lua
local lighterfire = SpawnPrefab("lighterfire_old")
if lighterfire then
    lighterfire.Transform:SetPosition(x, y, z)
end
```

## Dependencies & tags
**Components used:** None (uses `inst.entity:AddVFXEffect()`, `EmitterManager`, and `EnvelopeManager` — core engine services, not ECS components).
**Tags:** None identified.

## Properties
No public properties

## Main functions
No public functions

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.

### Notes
- This prefab is not designed for direct component usage; it is a prefab with pre-configured VFX setup and no ECS component.
- The effect is client-only: dedicated servers skip VFX initialization in `common_postinit`.
- The `InitEnvelope()` function is defined inline and called once per session to register colour and vector2 envelopes with the `EnvelopeManager` for shader-based animation.
- Particle lifetime (`MAX_LIFETIME = 0.5`) and smoke lifetime (`SMOKE_MAX_LIFETIME = 1.3`) are defined but only the former is used in `emit_fn`.