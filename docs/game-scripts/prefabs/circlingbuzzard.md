---
id: circlingbuzzard
title: Circlingbuzzard
description: Renders and manages the lifecycle of a circling buzzard shadow FX entity with fade-in/fade-out transitions tied to time-of-day and season.
tags: [fx, world, environment]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 914d52df
system_scope: fx
---

# Circlingbuzzard

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`circlingbuzzard` is a client-side FX prefab responsible for rendering a visual shadow representation of a buzzard that circles above the player or world. It supports two variants: a standard version (`circlingbuzzard`) and a lunar-mutated variant (`circlingbuzzard_lunar`). The entity handles dynamic fading based on time of day (`isnight`) and season (`iswinter`) via world state listeners, and manages its own animation and lifecycle—including gradual fade-out upon being "killed".

This prefab uses the standard `commonfn` factory to set up the core ECS entity (`Transform`, `AnimState`, `Network`), and delegates variant-specific behavior to dedicated init functions. It does not implement logic beyond FX rendering; movement and positioning are handled by external components like `circler` and `mutatedbuzzardcircler`.

## Usage example
```lua
-- Add the standard circling buzzard FX to an entity (e.g., a player)
local inst = SpawnPrefab("circlingbuzzard")
inst.Transform:SetPosition(x, y, z)

-- The FX is automatically managed:
-- - it fades in at night and out during day
-- - it fades in during winter regardless of time
-- - calling KillShadow() triggers a fade-out and removes it
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `FX` (always); adds `lunar_aligned` for the lunar variant.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_fadeframe` | net_byte | `0` | Networked frame counter (0 to `MAX_FADE_FRAME`) controlling fade opacity. |
| `_isfadein` | net_bool | `false` | Networked flag indicating whether the shadow is currently fading in (`true`) or out (`false`). |
| `_fadetask` | task or `nil` | `nil` | Reference to the periodic task driving fade updates; `nil` when inactive. |
| `_killed` | boolean | `false` | Internal flag set when `KillShadow()` is invoked; triggers entity removal after fade completes. |

## Main functions
### `KillShadow()`
* **Description:** Initiates a fade-out sequence for the shadow. Stops world state listeners and schedules removal after fade completes. Safe to call from both server and client; removal only occurs on master simulation.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** If the shadow is already fully faded out (`_fadeframe == 0`) or sleeping, it is removed immediately without fading.

## Events & listeners
- **Listens to:** `fadedirty` (client-only) — triggers `OnFadeDirty()` to begin or resume fade updates.
- **Pushes:** `shadowkilled` — fired once when `KillShadow()` begins the fade-out sequence.