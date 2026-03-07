---
id: torchfire_barber
title: Torchfire Barber
description: Provides a specialized visual effect component for a Barber Fire prefab, rendering distinct smoke, fire, and ember particles with custom envelopes and emitter configurations.
tags: [fx, particle, visual]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 910e9646
system_scope: fx
---

# Torchfire Barber

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`torchfire_barber` is a prefab helper component that configures and manages custom particle effects for a Barber Fire entity. It defines and initializes three distinct particle emitters: smoke, fire, and ember, each with unique textures, shaders, colour/scale envelopes, and emission logic. This component is not a traditional ECS component but a factory function wrapper that creates a fully configured fire entity using `MakeTorchFire` from `torchfire_common.lua`. It is primarily used for visual fidelity in gameplay.

## Usage example
```lua
-- The torchfire_barber prefab is created via MakeTorchFire, typically as a direct prefab:
local inst = Prefab("torchfire_barber", ...)
-- (Instantiation and initialization handled internally by the engine and MakeTorchFire logic)
```

## Dependencies & tags
**Components used:** None — this file does not directly access components via `inst.components.X`.  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `common_postinit(inst)`
*   **Description:** Initializes particle effect emitters and configuration for the Barber Fire on non-dedicated servers. Sets up three VFX emitters (smoke, fire, ember) with custom render resources, particle counts, lifetimes, envelopes, blend modes, bloom, UV frame size, sort order/offset, and drag. Runs `InitEnvelope()` once to define colour and scale envelopes for all particle types.
*   **Parameters:** `inst` (entity instance) — the prefab instance being initialized.
*   **Returns:** Nothing.
*   **Error states:** Returns early if run on a dedicated server (`TheNet:IsDedicated()`), or if `InitEnvelope` was already called (due to `InitEnvelope ~= nil` check).

### `master_postinit(inst)`
*   **Description:** Sets the `fx_offset` property on the instance to `-120`, likely to adjust vertical positioning of visual effects relative to the entity.
*   **Parameters:** `inst` (entity instance) — the prefab instance.
*   **Returns:** Nothing.

## Events & listeners
None.