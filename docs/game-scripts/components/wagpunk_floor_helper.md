---
id: wagpunk_floor_helper
title: Wagpunk Floor Helper
description: Manages the active arena and barrier state for Wagpunk boss encounters, including spatial containment logic and networked synchronization.
tags: [boss, arena, barrier, network]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 99e40e96
system_scope: world
---

# Wagpunk Floor Helper

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`wagpunk_floor_helper` is a component that tracks and broadcasts the active state, origin coordinates, and barrier status of a predefined arena used in Wagpunk boss fights. It defines spatial containment logic for the arena using a composite three-rectangle model and synchronizes relevant data across the network via `net_bool` and `net_float` members. It does not manage visual effects or game physics directly but provides the spatial and state infrastructure for other systems (e.g., AI or damage logic) to reference.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("wagpunk_floor_helper")

-- Initialize the arena at a specific location.
local marker = CreateEntity()
marker.Transform:SetPosition(10, 0, 15)
inst.components.wagpunk_floor_helper:TryToSetMarker(marker)

-- Check if a point is inside the arena.
local x, y, z = 11, 0, 14
if inst.components.wagpunk_floor_helper:IsPointInArena(x, y, z) then
    print("Inside arena")
end

-- Check barrier status.
if inst.components.wagpunk_floor_helper:IsBarrierUp() then
    print("Barrier is active")
end
```

## Dependencies & tags
**Components used:** None  
**Tags:** None

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `barrier_active` | `net_bool` | `false` | Networked flag indicating whether the barrier is currently raised. |
| `arena_active` | `net_bool` | `false` | Networked flag indicating whether the arena is active. |
| `arena_origin_x` | `net_float` | `0` | Networked X coordinate of the arena center. |
| `arena_origin_z` | `net_float` | `0` | Networked Z coordinate of the arena center. |
| `marker` | `Entity | nil` | `nil` | Reference to the marker entity used to define the arena origin (server-only). |

## Main functions
### `IsPointInArena(x, y, z)`
* **Description:** Determines whether the given world position lies within the current arena, using a fixed-size spatial model. Ignores Y coordinate for containment logic.
* **Parameters:**  
  `x` (number) — World X coordinate  
  `y` (number) — World Y coordinate (not used in calculation)  
  `z` (number) — World Z coordinate  
* **Returns:** `true` if the point is inside the arena, otherwise `false`. Returns `false` if `arena_active` is `false`.
* **Error states:** None.

### `IsXZWithThicknessInArena(x, z, thickness)`
* **Description:** Determines whether the given XZ point lies within the arena boundary with a specified thickness offset. Useful for checking proximity to the arena edge (e.g., for barrier collision).
* **Parameters:**  
  `x` (number) — World X coordinate  
  `z` (number) — World Z coordinate  
  `thickness` (number) — Thickness offset; positive means inside, negative means outside.  
* **Returns:** `true` if the point is within the arena with the given thickness, and *not* within the arena with negative thickness (i.e., strictly within the band of `thickness`). Returns `false` if `arena_active` is `false`.
* **Error states:** None.

### `IsXZWithThicknessInArena_Calculation(x, z, thickness)`
* **Description:** Internal helper that checks if a point lies within the arena *model* using three overlapping rectangles: horizontal wide, vertical tall, and central square. Used by `IsPointInArena` and `IsXZWithThicknessInArena`.
* **Parameters:**  
  `x` (number) — World X coordinate  
  `z` (number) — World Z coordinate  
  `thickness` (number) — Thickness offset added to rectangle half-sizes.  
* **Returns:** `true` if the point lies within the expanded model, otherwise `false`.
* **Error states:** None.

### `GetArenaOrigin()`
* **Description:** Returns the world XZ coordinates of the arena center if active.
* **Parameters:** None.  
* **Returns:**  
  `x` (number) — Arena origin X  
  `z` (number) — Arena origin Z  
  Returns `nil, nil` if `arena_active` is `false`.
* **Error states:** None.

### `IsBarrierUp()`
* **Description:** Returns the current barrier state.
* **Parameters:** None.  
* **Returns:** `true` if the barrier is active, otherwise `false`.
* **Error states:** None.

### `TryToSetMarker(inst)`
* **Description:** (Server only) Sets or replaces the marker entity used to define the arena origin. Also listens for marker removal to reset arena state.
* **Parameters:**  
  `inst` (Entity) — Marker entity to use as arena center.  
* **Returns:** Nothing.  
* **Error states:** If a marker is already set, the existing marker is removed and replaced.

### `IsXZWithThicknessInArena_Calculation`
* **Note:** This is not exposed as a standalone function; it is an internal private method used for containment calculations.

## Events & listeners
- **Listens to:** `onremove` (on the marker entity) — Triggers `OnRemove_Marker`, which resets arena state (`arena_active`, `arena_origin_x`, `arena_origin_z`) and clears the `marker` reference.
- **Pushes:** None.
