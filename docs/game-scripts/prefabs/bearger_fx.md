---
id: bearger_fx
title: Bearger Fx
description: Defines visual effect prefabs for Bearger attack animations with self-cleanup logic.
tags: [fx, prefab, visual, boss]
sidebar_position: 10

last_updated: 2026-03-20
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7fd3a8dc
system_scope: fx
---

# Bearger Fx

> Based on game build **714014** | Last updated: 2026-03-20

## Overview
`bearger_fx` is a prefab factory script that generates visual effect entities for Bearger attacks. It configures animation states, lighting, and network replication for specific swipe effects. The resulting entities are designed to be transient, automatically removing themselves after their animation cycle completes.

## Usage example
```lua
-- Spawn the standard Bearger swipe effect
local fx = SpawnPrefab("bearger_swipe_fx")
fx.Transform:SetPosition(x, y, z)

-- Trigger the reverse animation manually if needed
if fx.Reverse then
    fx.Reverse()
end
```

## Dependencies & tags
**Components used:** `Transform`, `AnimState`, `Network`
**Tags:** Adds `FX`, `NOCLICK`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `persists` | boolean | `false` | Prevents the entity from being saved in the world state. |
| `Reverse` | function | `nil` | Custom method assigned on server to play the reverse animation. |

## Main functions
### `Reverse()`
*   **Description:** Plays the `atk2` animation on the entity's `AnimState`. This function is only assigned on the master simulation.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Only exists if `TheWorld.ismastersim` is `true`.

## Events & listeners
- **Listens to:** `animover` - Triggers `inst.Remove` to clean up the entity when the animation finishes.