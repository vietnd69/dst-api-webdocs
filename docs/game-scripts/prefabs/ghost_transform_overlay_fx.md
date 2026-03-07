---
id: ghost_transform_overlay_fx
title: Ghost Transform Overlay Fx
description: Renders a visual overlay effect (light and animation) used during player ghost transformation sequences.
tags: [fx, animation, light, client]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 5dacbd12
system_scope: fx
---

# Ghost Transform Overlay Fx

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`ghost_transform_overlay_fx` is a client-side prefab that provides a visual overlay during player ghost transformation (e.g., during revival or death transition). It creates an entity with an animation bank (`player_revive_fx`), a dynamic light source, and a shudder animation, along with periodic updates to modulate light radius and intensity. The entity is non-physical (`NOCLICK`, `FX` tags), does not persist, and is automatically removed after animation completion via `animqueueover` event.

## Usage example
This prefab is instantiated internally by the game engine during ghost transformation events and is not typically added directly by mods. However, for reference:

```lua
-- Example instantiation (not recommended for direct use)
local fx = SpawnPrefab("ghost_transform_overlay_fx")
fx.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** None identified (uses entity subsystem primitives: `transform`, `animstate`, `light`, `network`)
**Tags:** `NOCLICK`, `FX`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_kintensity` | number | `0` | Internal multiplier for light intensity modulation during the effect. |
| `_kradius` | number | `0` | Internal radius decay counter; used to fade out the light. |

## Main functions
No public methods are defined in this prefab; behavior is driven by internal tasks and event listeners.

## Events & listeners
- **Listens to:** `animqueueover` — triggers `RemoveMe` to delete the entity 1 second after the animation queue completes.
- **Pushes:** None.

> Note: All active tasks (`DoPeriodicTask`, `DoTaskInTime`) are scheduled at construction time to drive the light modulation and eventually trigger removal. The light effect decays via `OnUpdate` over time.