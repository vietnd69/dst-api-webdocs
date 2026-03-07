---
id: torchfire_yotrpillowfight
title: Torchfire Yotrpillowfight
description: A specialized torch fire effect used for the Yotrpillowfight event, producing smoke and fire particles with custom visual envelopes and emission logic.
tags: [fx, event, lighting]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a98fb6c4
system_scope: fx
---

# Torchfire Yotrpillowfight

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`torchfire_yotrpillowfight` is a prefab helper that generates a custom visual fire effect for the Yotrpillowfight event. It leverages `MakeTorchFire` from `torchfire_common.lua` to instantiate a particle-based fire source with dedicated smoke and flame emitters. The component defines and registers color/scale envelopes for smooth animation of both smoke and fire particles, then configures rendering and emission behavior in `common_postinit`. It is not an ECS component itself but a prefab factory function that returns a configured entity instance.

## Usage example
This prefab is not instantiated manually. It is used internally by the event system as part of the `torchfire_yotrpillowfight` prefab definition:
```lua
local torchfire = require("prefabs/torchfire_yotrpillowfight")
-- Typically invoked via: SpawnPrefab("torchfire_yotrpillowfight")
-- It produces a visual-only entity (no network replication or gameplay logic)
```

## Dependencies & tags
**Components used:** None (this is a prefab factory, not a component)
**Tags:** None identified

## Properties
No public properties — this file defines a prefab configuration, not a component with instance-accessible state.

## Main functions
This file does not expose main functions intended for direct consumption. The following internal functions are defined for particle emission:

### `emit_smoke_fn(effect, sphere_emitter)`
*   **Description:** Spawns a single smoke particle with randomized position and velocity.
*   **Parameters:**  
    `effect` (VFXEffect instance) — target effect object for particle addition.  
    `sphere_emitter` (function) — returns a random 3D position within a small sphere.
*   **Returns:** Nothing.
*   **Error states:** None documented.

### `emit_fire_fn(effect, sphere_emitter)`
*   **Description:** Spawns a single fire particle with randomized position and velocity.
*   **Parameters:**  
    `effect` (VFXEffect instance) — target effect object for particle addition.  
    `sphere_emitter` (function) — returns a random 3D position within a small sphere.
*   **Returns:** Nothing.
*   **Error states:** None documented.

### `InitEnvelope()`
*   **Description:** Registers color and vector2 envelopes for smoke and fire particles. Runs once, then self-resets to `nil`.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Only runs once; subsequent calls have no effect.

## Events & listeners
None — this prefab does not register or push game events.