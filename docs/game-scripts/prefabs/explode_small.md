---
id: explode_small
title: Explode Small
description: Creates a non-persistent visual and audio effect for small explosions and related actions.
tags: [fx, audio, prefabs]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 304f2593
system_scope: fx
---

# Explode Small

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`explode_small.lua` defines reusable prefabs for small explosion effects in `Don't Starve Together`. It is not a traditional component but a factory function (`MakeExplosion`) that generates entity prefabs with animation, sound, and transform capabilities. These prefabs are typically used as temporary visual feedback (e.g., for firecrackers, slurtle explosions, or reskin tools). Effects are created on the client only (not on dedicated servers) and automatically cleaned up after a short delay or upon animation completion.

## Usage example
```lua
-- Spawn a standard small explosion at position
local explosion = SpawnPrefab("explode_small")
explosion.Transform:SetPosition(x, y, z)

-- Spawn a reskin-brush variant with specific properties
local brush_explode = SpawnPrefab("reskin_tool_brush_explode_fx")
brush_explode.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** None identified.
**Tags:** Adds `FX` tag to spawned effect entities.

## Properties
No public properties. This is a Prefab factory and does not expose persistent state.

## Main functions
### `MakeExplosion(data)`
*   **Description:** Returns a factory function that creates explosion effect prefabs. The `data` table customizes animation, sound, scale, and visual properties.
*   **Parameters:** `data` (table or `nil`) — Optional configuration with optional keys: `scale` (number), `bank` (string), `build` (string), `skin_build` (string), `skin_symbol` (string), `anim` (string), `bloom` (boolean, defaults to `true`), `light_override` (number), `final_offset` (number), `sound` (string or function).
*   **Returns:** Function — A Prefab constructor function that spawns the explosion entity.
*   **Error states:** None. Omits `nil` fields gracefully using Lua defaults.

## Events & listeners
- **Listens to:** `animover` — Fires on the effect entity to trigger `inst.Remove` once the animation completes (to ensure cleanup).
- **Pushes:** None.