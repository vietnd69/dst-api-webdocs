---
id: lavae_move_fx
title: Lavae Move Fx
description: Spawns visual trail effects for moving entities (e.g., lavae, hutch) by playing animation sequences at scaled positions.
tags: [fx, visual, entity]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 905e217a
system_scope: fx
---

# Lavae Move Fx

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
This prefab provides reusable effect entities that render animated trail FX when specific entities (such as `lavae` or `hutch`) move. It supports both networked coordination (via `net_tinybyte` properties) and client-side effect spawning (non-dedicated servers only), ensuring visual consistency across the network. The effect is short-lived (`1` second timeout) and uses background-layer animation with configurable scale, variation, and color.

## Usage example
```lua
-- Spawn the effect at a target entity's transform
local effect = SpawnPrefab("lavae_move_fx")
effect.Transform:SetFromProxy(target_entity.GUID)
effect:SetVariation(3, 1.0) -- variation=3, scale=1.0
```

## Dependencies & tags
**Components used:** `Transform`, `AnimState`, `Network` (via `inst.entity` and `net_tinybyte`)
**Tags:** Adds `FX`; does not add or remove other tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_rand` | `net_tinybyte` | `0` | Networked variation index (0–7), controls which animation string `"trail0"` to `"trail7"` is played. |
| `_scale` | `net_tinybyte` | `0` | Networked quantized scale index (0–7), derived from actual scale via clamped normalization. |
| `_min_scale` | number | varies by prefab | Minimum scale value used for linear normalization to `_scale` index. |
| `_max_scale` | number | varies by prefab | Maximum scale value used for linear normalization to `_scale` index. |
| `_colour` | table or `nil` | `nil` | RGBA color multiplier for `AnimState:SetMultColour`, specific to `hutch_move_fx`. |
| `_complete` | boolean | `false` (client-only) | Flag preventing duplicate FX spawns per tick. |

## Main functions
### `SetVariation(inst, rand, scale)`
*   **Description:** Sets the variation index and scale index for the FX effect. This function is only available on the master simulation (`TheWorld.ismastersim`) and syncs values via network properties.
*   **Parameters:**  
    `rand` (number) – Variation index (typically 0–7), passed directly to `inst._rand:set(rand)`.  
    `scale` (number) – Raw scale value; normalized to an integer index between 0 and 7 based on `inst._min_scale` and `inst._max_scale`.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` – removes the FX entity once its animation completes (in spawned effects).  
- **Listens to:** `randdirty` (master sim only) – triggers `OnRandDirty`, which spawns one FX instance with randomized/delayed parameters.  
- **Pushes:** None (does not fire custom events).