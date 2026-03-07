---
id: confetti_fx
title: Confetti Fx
description: Generates a particle-based visual effect using shaped confetti particles and sparkles, typically used for celebratory events.
tags: [fx, visual, celebration]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7a6552a9
system_scope: fx
---

# Confetti Fx

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`confetti_fx` is a prefab factory that creates a one-time visual effect entity emitting shaped confetti particles and sparkles. It is used for celebratory or decorative purposes (e.g., after certain events or achievements). The effect uses triangle meshes (`BEEFALO_SHAPE_TRIS` or `RABBIT_SHAPE_TRIS`) to define particle shapes, and leverages the VFX effect system with per-emitter custom shaders, envelopes, and physics properties.

## Usage example
```lua
-- Spawn confetti effect with beefalo shape
local confetti = SpawnPrefab("confetti_fx")
confetti.Transform:SetPosition(0, 2, 0)

-- Spawn confetti effect with rabbit shape
local rabbit_confetti = SpawnPrefab("rabbit_confetti_fx")
rabbit_confetti.Transform:SetPosition(0, 2, 0)
```

## Dependencies & tags
**Components used:** `transform`, `network`, `soundemitter`, `vfxeffect`
**Tags:** Adds `FX`

## Properties
No public properties

## Main functions
### `MakeConfetti(name, data)`
*   **Description:** Factory function that creates and returns a `Prefab` for a confetti effect. Takes a name string and a `data` table containing `tri_list` (an array of triangle vertex data) to define the shape of the confetti particles.
*   **Parameters:** 
    *   `name` (string) – Name of the prefab to create.
    *   `data` (table) – Contains `tri_list` key mapping to an array of 3D triangle vertex tables (e.g., `BEEFALO_SHAPE_TRIS`).
*   **Returns:** `Prefab` – A configured prefab instance for the confetti effect.
*   **Error states:** On dedicated servers, the function returns an inert entity (no VFX initialized); on clients, it proceeds with full effect setup only after `InitEnvelope()` runs once.

## Events & listeners
None identified.