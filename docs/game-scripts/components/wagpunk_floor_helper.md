---
id: wagpunk_floor_helper
title: Wagpunk Floor Helper
description: Manages the logic and network state for an arena and its protective barrier, including point-in-arena detection and marker-based activation.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 99e40e96
---

# Wagpunk Floor Helper

## Overview
This component provides Arena and Barrier logic for the Wagpunk floor, enabling runtime detection of whether entities or points lie within a defined arena area (and optionally within the barrier band) and managing the arena's activation state via a marker entity.

## Dependencies & Tags
- Uses `net_bool` and `net_float` for networked state synchronization.
- Relies on `TheWorld.Map` and `TILE_SCALE` constants.
- No explicit component dependencies or entity tags are added or removed.
- None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `entity` | `nil` (constructor parameter) | The entity the component is attached to. |
| `barrier_active` | `net_bool` | `false` | Networked flag indicating whether the barrier is currently raised. |
| `arena_active` | `net_bool` | `false` | Networked flag indicating whether the arena is active. |
| `arena_origin_x` | `net_float` | `0.0` | X-coordinate of the arena center in world space. |
| `arena_origin_z` | `net_float` | `0.0` | Z-coordinate of the arena center in world space. |
| `marker` | `entity?` | `nil` | Internal reference to the marker entity used to define the arena origin; set during `TryToSetMarker`. |

## Main Functions

### `IsXZWithThicknessInArena_Calculation(x, z, thickness)`
* **Description:** Helper function that checks if the point `(x, z)` lies within the arena *with a given thickness*, effectively modeling a region that accounts for physical thickness (e.g., wall width). Uses a composite shape composed of three overlapping rectangles (wide horizontal, tall vertical, and square center).
* **Parameters:**
  * `x`, `z`: Float coordinates in world space.
  * `thickness`: Float; extends the arena boundary outward by this amount. Positive thickness includes area *inside* the arena; negative thickness excludes area *inside* the arena (used for barrier band logic).

### `IsPointInArena(x, y, z)`
* **Description:** Checks if a point lies strictly *inside* the arena (ignoring thickness). Returns `false` if arena is not active.
* **Parameters:**
  * `x`, `y`, `z`: Float coordinates; only `x` and `z` are used.

### `IsXZWithThicknessInArena(x, z, thickness)`
* **Description:** Checks if a point `(x, z)` lies within the arena *with the given thickness*, but *excludes* points that would fall inside the arena even with negative thickness—effectively computing a "band" region (e.g., the barrier zone). Returns `false` if arena is not active.
* **Parameters:**
  * `x`, `z`: Float coordinates.
  * `thickness`: Float; thickness to apply for inclusion. Must be positive to define an outer band.

### `GetArenaOrigin()`
* **Description:** Returns the `(x, z)` center of the arena if active; otherwise returns `(nil, nil)`.
* **Parameters:** None.

### `IsBarrierUp()`
* **Description:** Returns the current barrier activation state (`true` if the barrier is active).
* **Parameters:** None.

### `TryToSetMarker(inst)`
* **Description:** Activates the arena using the provided entity (`inst`) as a marker. If a marker already exists, the new marker is removed immediately. Otherwise, the marker’s world position becomes the arena origin, arena activation is enabled, and an `onremove` listener is attached to reset arena state if the marker is destroyed.
* **Parameters:**
  * `inst`: `entity` — the marker entity to adopt as arena origin.

## Events & Listeners
- Listens to `"onremove"` event on the `marker` entity (set in `TryToSetMarker`), triggering `OnRemove_Marker`.
- `OnRemove_Marker(ent, data)` resets arena state: `arena_active`, `arena_origin_x`, and `arena_origin_z` are disabled/set to zero, and `self.marker` is cleared.