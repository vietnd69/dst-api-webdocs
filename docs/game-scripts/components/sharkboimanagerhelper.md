---
id: sharkboimanagerhelper
title: Sharkboimanagerhelper
description: Helper component for managing and querying the Sharkboi arena’s spatial boundaries in the game world.
tags: [arena, map, networking]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: e9db4337
system_scope: world
---

# Sharkboimanagerhelper

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Sharkboimanagerhelper` stores and provides utilities for the Sharkboi arena’s geometry — specifically its origin coordinates (`arena_origin_x`, `arena_origin_z`) and radius (`arena_radius`). These values are defined as networked float properties using `net_float`, enabling synchronization across the client and server. The component exposes a single utility method, `IsPointInArena`, to check whether a world point lies within the arena's playable area while also verifying that the location is walkable ground.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("sharkboimanagerhelper")

-- Set arena parameters (typically done by sharkboimanager)
inst.components.sharkboimanagerhelper.arena_origin_x:set(100)
inst.components.sharkboimanagerhelper.arena_origin_z:set(200)
inst.components.sharkboimanagerhelper.arena_radius:set(64)

-- Check if a point is inside the arena
if inst.components.sharkboimanagerhelper:IsPointInArena(102, 0, 198) then
    -- Point is inside and on valid ground
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `arena_origin_x` | `net_float` | `0` | Networked X-coordinate of the arena center. |
| `arena_origin_z` | `net_float` | `0` | Networked Z-coordinate of the arena center. |
| `arena_radius` | `net_float` | `0` | Networked radius of the arena (in world units). |

## Main functions
### `IsPointInArena(x, y, z)`
* **Description:** Determines if the given world point `(x, y, z)` lies within the Sharkboi arena, considering both distance and visual ground validity.
* **Parameters:**  
  `x` (number) — World X-coordinate to test.  
  `y` (number) — World Y-coordinate (unused in distance check, but passed for completeness).  
  `z` (number) — World Z-coordinate to test.  
* **Returns:**  
  `true` if the point is within the arena radius and `_map:IsVisualGroundAtPoint(x, y, z)` returns `true`; otherwise `false`.  
* **Error states:** Returns `false` if `arena_radius` is `<= 0`, or if the point exceeds the computed bounding region.

## Events & listeners
None identified
