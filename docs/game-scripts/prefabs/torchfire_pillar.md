---
id: torchfire_pillar
title: Torchfire Pillar
description: Defines a persistent fire effect for torchfire pillars using custom particle emitters and visual envelopes.
tags: [fx, environment, light, visual]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d2506002
system_scope: fx
---

# Torchfire Pillar

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`torchfire_pillar` defines a visual prefab that produces persistent fire and smoke particle effects. It relies on `MakeTorchFire` from `torchfire_common.lua` to construct the entity, and custom logic to configure rendering resources, particle behavior, and envelope definitions (color/scale over lifetime). This is used for environment props like the Torchfire Pillar, providing dynamic lighting and atmospheric visuals.

## Usage example
The component itself is not added manually — it is instantiated as part of a prefab via the `MakeTorchFire` factory:
```lua
-- Inside another prefab's definition (e.g., prefabs/torchfire_pillar.lua itself)
return MakeTorchFire("torchfire_pillar", assets, nil, common_postinit, master_postinit)
```

## Dependencies & tags
**Components used:** None directly; uses `entity:AddVFXEffect()` and `EmitterManager`.
**Tags:** None identified.

## Properties
No public properties are exposed or initialized. All configuration occurs via factory parameters and runtime function calls.

## Main functions
No standalone public functions are defined outside the factory usage. The file contributes two main setup functions used internally by `MakeTorchFire`:
- `common_postinit(inst)` — Sets up particle effects on the client (non-dedicated servers). Initializes two emitters: one for fire, one for smoke.
- `master_postinit(inst)` — Sets `inst.fx_offset = -130` (likely for lighting calculation adjustments).

The internal helper functions `emit_fire_fn` and `emit_smoke_fn` are used by the emitter callback to spawn particles via `effect:AddParticleUV` and `effect:AddRotatingParticleUV`.

## Events & listeners
None identified. Particle emission is handled by `EmitterManager` callbacks instead of event listeners.