---
id: torchfire_rag
title: Torchfire Rag
description: Creates and manages a rag-doll-style torch fire effect with smoke, flame, and ember particle systems.
tags: [fx, particle, visual]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: cbc61e42
system_scope: fx
---

# Torchfire Rag

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`torchfire_rag` is a prefab definition that produces a stylized torch fire effect composed of three particle layers: smoke, flame (fire), and ember sparks. It leverages `MakeTorchFire` from `torchfire_common.lua` and defines custom particle envelopes, emitter configurations, and spawn logic via `common_postinit`. This effect is designed for visual storytelling in the game world, often used in narrative or environmental contexts where a dramatic, non-interactive torch fire is required (e.g., static fixtures or narrative props). It is not a functional fire source and does not interact with gameplay systems like heat or damage.

## Usage example
```lua
local torch = Prefab("torchfire_rag")
inst = CreateEntity()
inst:AddPrefab("torchfire_rag")
-- The effect is automatically initialized on creation via its postinit hooks
```

## Dependencies & tags
**Components used:** `vfxeffect` (added via `inst.entity:AddVFXEffect()`), `emittermanager` (via `EmitterManager:AddEmitter`)
**Tags:** None identified.

## Properties
No public properties.

## Main functions
The component does not define any callable methods; all initialization logic occurs during prefab construction via `common_postinit` and `master_postinit`.

### `common_postinit(inst)`
*   **Description:** Initializes particle effects for smoke, fire, and embers. Configures the VFX effect system with textures, shaders, envelopes, blend modes, and particle emission rates. Runs only on non-dedicated clients. Checks for and executes one-time envelope initialization (`InitEnvelope`) if needed.
*   **Parameters:** `inst` (entity instance) — the entity to attach the effect to.
*   **Returns:** Nothing.
*   **Error states:** Does nothing on dedicated servers (`TheNet:IsDedicated() == true`). Initializes envelopes only once (via `InitEnvelope = nil` guard).

### `master_postinit(inst)`
*   **Description:** Sets the render offset (`fx_offset`) for the effect, adjusting vertical position on the entity.
*   **Parameters:** `inst` (entity instance).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.