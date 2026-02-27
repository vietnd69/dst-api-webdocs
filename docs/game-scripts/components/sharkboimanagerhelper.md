---
id: sharkboimanagerhelper
title: Sharkboimanagerhelper
description: A helper component that defines and provides utilities for checking whether a point lies within a configurable circular arena in the game world.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: e9db4337
---

# Sharkboimanagerhelper

## Overview
This component manages the geometric definition of an arena (center and radius) for an entity and offers a method to determine whether a given world point lies within that arena. It is designed to work with the entity’s networked state, storing arena parameters as replicated float values.

## Dependencies & Tags
- Relies on `TheWorld` and `TheWorld.Map` for coordinate and terrain checks.
- Uses `net_float` to expose arena parameters (`arena_origin_x`, `arena_origin_z`, `arena_radius`) over the network, keyed by the entity's GUID.
- Requires the `TILE_SCALE` and `SQRT2` constants (globally available).
- Assumes the presence of `_map:IsVisualGroundAtPoint(x, y, z)` for ground validation.

No components or tags are explicitly added or removed by this script.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (parameter) | The entity instance the component is attached to. |
| `arena_origin_x` | `net_float` | `0` | Networked X coordinate (world space) of the arena center. |
| `arena_origin_z` | `net_float` | `0` | Networked Z coordinate (world space) of the arena center. |
| `arena_radius` | `net_float` | `0` | Networked radius of the arena (in world units). |

## Main Functions
### `IsPointInArena(x, y, z)`
* **Description:** Checks if the given world point `(x, y, z)` lies within the arena. The check considers both radial distance (with padding via `SQRT2` for tile-based collision margin) and whether the point resides on valid visual ground.
* **Parameters:**
  - `x` (number): World X coordinate.
  - `y` (number): World Y (height) coordinate (used for ground lookup but not distance calculation).
  - `z` (number): World Z coordinate.

Note: Arena radius is rounded up to the nearest tile scale and scaled by `SQRT2` to cover diagonal tile coverage. Returns `false` if radius is zero or negative.