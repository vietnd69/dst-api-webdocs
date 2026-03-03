---
id: fishingnetvisualizer
title: Fishingnetvisualizer
description: Visualizes the flight and capture behavior of a fishing net when thrown, including entity collection during retrieval.
tags: [fishing, visual, entity_capture]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 26d5c557
system_scope: entity
---

# Fishingnetvisualizer

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`FishingNetVisualizer` is a visual-only component responsible for simulating the trajectory, opening, and retrieval animations of a fishing net entity. It does not handle gameplay logic (e.g., whether an entity can be caught), but instead manages the visual placement and movement of the net itself, along with the inward movement of captured entities during the retrieval phase. It is typically attached to a temporary net entity spawned by the `fishing` action.

## Dependencies & tags
**Components used:** `self.thrower.AnimState`, `self.thrower.Transform`, `self.thrower.Physics` (via `self.thrower`), and `v.Physics`, `v.Transform` (via captured entities `v`). Also accesses `TheSim:FindEntities`, `TheCamera`, and `TUNING`.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `velocity` | number | `10` | Forward speed of the net during cast, in units per second. |
| `retrieve_velocity` | number | `12` | Speed at which the net returns toward the thrower during retrieval. |
| `collect_radius` | number | `2` | Radius around the net's center where entities are scanned for capture during `BeginOpening`. |
| `collect_velocity` | number | `4` | Speed at which captured entities are pulled toward the net's center during `UpdateWhenOpening`. |
| `retrieve_distance` | number | `1.5` | Distance threshold to the thrower at which retrieval ends and final pickup begins. |
| `distance_to_play_open_anim` | number | `1.65` | Distance remaining before target at which the `"play_throw_pst"` event is pushed. |
| `has_played_throw_pst` | boolean | `false` | Tracks whether `"play_throw_pst"` has been pushed for this cast. |
| `max_captured_entity_collect_distance` | number | `0.25` | Maximum cumulative distance captured entities are moved toward the net before pickup. |
| `captured_entities` | table | `{}` | List of entities captured by the net (added during `BeginOpening`). |
| `captured_entities_collect_distance` | table | `{}` | Tracks how far each captured entity has been moved toward the net (per entity). |
| `retrieve_distance_traveled` | number | `0` | Accumulated distance traveled during retrieval. |
| `distance_remaining` | number | `nil` | Distance remaining for the net to reach its target. Set in `BeginCast`. |
| `total_distance` | number | `nil` | Total cast distance. Set in `BeginCast`. |
| `dir_x`, `dir_z` | number | `nil` | Normalized direction vector of the cast. Set in `BeginCast`. |
| `target_x`, `target_z` | number | `nil` | Coordinates of the net's intended target. Set in `BeginCast`. |
| `thrower` | entity | `nil` | Entity that cast the net. Set in `BeginCast`. |
| `last_dir_x`, `last_dir_z` | number | `nil` | Direction vector used at retrieval completion (passed to `DropItem`). |

## Main functions
### `BeginCast(thrower, target_x, target_z)`
*   **Description:** Initializes a cast operation, positioning the net at the thrower and computing the trajectory toward `(target_x, target_z)`. Also handles thrower animation state transitions.
*   **Parameters:**  
    - `thrower` (entity) — The entity casting the net.  
    - `target_x` (number) — X-coordinate of the target point.  
    - `target_z` (number) — Z-coordinate of the target point.  
*   **Returns:** Nothing.

### `UpdateWhenMovingToTarget(dt)`
*   **Description:** Moves the net along its cast trajectory each frame. When the net reaches its target (`distance_remaining <= 0`), it pushes `"begin_opening"`. If within `"distance_to_play_open_anim"`, it pushes `"play_throw_pst"` once. Computes and sets vertical Y position using a parabolic arc.
*   **Parameters:**  
    - `dt` (number) — Delta time in seconds.  
*   **Returns:** Nothing.
*   **Error states:** Safely initializes `self.distance_remaining` to `0` if `nil`; sets `self.total_distance` to `self.distance_remaining` if `nil` to prevent mod-induced crashes.

### `CalculateY(x, x_span, scale)`
*   **Description:** Computes the Y (height) position along a parabolic arc. Used to animate the net’s arc during cast and retrieval.
*   **Parameters:**  
    - `x` (number) — Current position along the horizontal span (in range `[0, x_span]`).  
    - `x_span` (number) — Total horizontal distance spanned (e.g., `self.total_distance`).  
    - `scale` (number) — Controls the height of the arc’s peak (e.g., `0.2` for cast, `0.15` for retrieval).  
*   **Returns:** Y position (number).

### `UpdateWhenOpening(dt)`
*   **Description:** During the net’s open phase, pulls nearby captured entities toward the net’s center until `max_captured_entity_collect_distance` is reached per entity. Uses `Physics:TeleportOffset` if available, else `Transform:OffsetPosition`.
*   **Parameters:**  
    - `dt` (number) — Delta time in seconds.  
*   **Returns:** Nothing.

### `BeginOpening()`
*   **Description:** Begins the net’s open phase. First fires `"on_pre_net"` on all nearby entities, then populates `self.captured_entities` and `self.captured_entities_collect_distance` with items inside `collect_radius`.
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `DropItem(item, last_dir_x, last_dir_z, idx)`
*   **Description:** Schedules the delayed release of a captured `item`. Calculates drop position using camera orientation and randomness, applies vertical velocity, and fires `"on_release_from_net"`.
*   **Parameters:**  
    - `item` (entity) — The entity (typically an `inventoryitem`) to drop.  
    - `last_dir_x` (number) — Last known X component of net direction (used to orient drop).  
    - `last_dir_z` (number) — Last known Z component of net direction.  
    - `idx` (number) — Index used to stagger drop timing (`idx * 0.25 + 0.15` seconds delay).  
*   **Returns:** Nothing.

### `BeginRetrieving()`
*   **Description:** Starts the net’s return phase. Pushes `"begin_final_pickup"` on the thrower and removes all captured entities from the scene (to be re-added via `DropItem` later).
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `BeginFinalPickup()`
*   **Description:** Finalizes the net’s pickup. Fires `"begin_final_pickup"` on the thrower, drops all captured entities via `DropItem`, resets thrower animation states, and removes the net entity.
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `UpdateWhenRetrieving(dt)`
*   **Description:** Updates net position during retrieval, moving it toward the thrower at `retrieve_velocity`. Computes Y height using a shallower parabola. When distance to thrower falls to `retrieve_distance`, it triggers `"begin_final_pickup"` and records direction for `DropItem`.
*   **Parameters:**  
    - `dt` (number) — Delta time in seconds.  
*   **Returns:** Nothing.

## Events & listeners
- **Pushes:**  
  - `"begin_opening"` — Fired when the net reaches its target during cast.  
  - `"play_throw_pst"` — Fired once when net reaches `distance_to_play_open_anim`.  
  - `"begin_final_pickup"` — Fired when retrieval completes and pickup begins.  
- **Listens to:** None identified.

## Usage example
```lua
local net = PrefabFiles.fishing_net:MakeInstance()
net:AddComponent("fishingnetvisualizer")
net.components.fishingnetvisualizer:BeginCast(player, target_x, target_z)

-- Update loop (typically handled by game engine):
net.components.fishingnetvisualizer:UpdateWhenMovingToTarget(dt)
