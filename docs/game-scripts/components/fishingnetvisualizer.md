---
id: fishingnetvisualizer
title: Fishingnetvisualizer
description: Manages visual behavior and logic for a fishing net entity during casting, opening, retrieving, and final pickup phases.
tags: [fishing, visual, physics, interaction, item]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: components
source_hash: 26d5c557
system_scope: entity
---

# Fishingnetvisualizer

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`Fishingnetvisualizer` is a visual/component that handles the complete lifecycle of a fishing net entity in flight and interaction phases. It is responsible for animating the net's trajectory during throw, opening the net to capture nearby items, retrieving it back toward the thrower, and finally releasing captured items. The component interacts primarily with physics and transform systems, and notifies relevant entities and the thrower via events.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("fishingnet")
inst:AddComponent("fishingnetvisualizer")

-- Begin cast toward a target point
local target_x, target_z = 10, -5
inst.components.fishingnetvisualizer:BeginCast(some_thrower, target_x, target_z)

-- After some time, begin retrieval
inst.components.fishingnetvisualizer:BeginRetrieving()

-- After retrieval completes, begin final pickup
inst.components.fishingnetvisualizer:BeginFinalPickup()
```

## Dependencies & tags
**Components used:** None directly accessed via `inst.components.X` on `self.inst`; uses `v.components.inventoryitem` on captured entities (but checks `~= nil` first).  
**Tags:** None added or checked on `self.inst`; expects `self.inst` to have `fishingnet` tag and `Transform`, `AnimState` components.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `velocity` | number | `10` | Movement speed (units/sec) during cast to target. |
| `retrieve_velocity` | number | `12` | Movement speed (units/sec) during retrieve phase. |
| `collect_radius` | number | `2` | Radius around net center used to detect entities to capture. |
| `collect_velocity` | number | `4` | Speed at which captured entities are pulled toward the net center. |
| `retrieve_distance` | number | `1.5` | Distance threshold to trigger final pickup upon reaching thrower. |
| `distance_to_play_open_anim` | number | `1.65` | Distance remaining at which `play_throw_pst` event is fired. |
| `has_played_throw_pst` | boolean | `false` | Flag indicating whether `play_throw_pst` has been pushed. |
| `max_captured_entity_collect_distance` | number | `0.25` | Max accumulated distance an entity may be pulled before collection stops. |
| `captured_entities` | table | `{}` | List of captured `inventoryitem` entities. |
| `captured_entities_collect_distance` | table | `{}` | Per-entity tracking of how far each has been pulled toward net. |
| `retrieve_distance_traveled` | number | `0` | Accumulated distance traveled during retrieve phase. |

## Main functions
### `BeginCast(thrower, target_x, target_z)`
*   **Description:** Initializes the cast phase: positions net at thrower, calculates trajectory, hides thrower's carry arm, and sets direction/remaining travel distance.
*   **Parameters:**
    * `thrower` (Entity) — the entity that threw the net.
    * `target_x` (number) — X coordinate of the net's intended destination.
    * `target_z` (number) — Z coordinate of the net's intended destination.
*   **Returns:** Nothing.

### `UpdateWhenMovingToTarget(dt)`
*   **Description:** Advances the net along its cast trajectory each frame, updates Y height via parabolic arc, and triggers events when reaching target or passing animation trigger point.
*   **Parameters:** `dt` (number) — Delta time in seconds.
*   **Returns:** Nothing.

### `CalculateY(x, x_span, scale)`
*   **Description:** Computes the Y position (height) for a parabolic arc based on position along the arc.
*   **Parameters:**
    * `x` (number) — Current horizontal offset from arc start.
    * `x_span` (number) — Total horizontal span of arc.
    * `scale` (number) — Controls arc height.
*   **Returns:** `y` (number) — Vertical offset from the linear path.

### `UpdateWhenOpening(dt)`
*   **Description:** While the net is open, pulls captured entities toward the net center using physics/transform offsets.
*   **Parameters:** `dt` (number) — Delta time in seconds.
*   **Returns:** Nothing.

### `BeginOpening()`
*   **Description:** Invoked when net reaches target location. Finds nearby items and captures those with `inventoryitem` component.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `DropItem(item, last_dir_x, last_dir_z, idx)`
*   **Description:** Schedules delayed release of a captured item from the net, placing it in front of the thrower with random offset and initial drop velocity.
*   **Parameters:**
    * `item` (Entity) — The captured `inventoryitem` entity to drop.
    * `last_dir_x` (number) — Last direction X of net retrieval.
    * `last_dir_z` (number) — Last direction Z of net retrieval.
    * `idx` (number) — Index used to stagger release timing between items.
*   **Returns:** Nothing.

### `BeginRetrieving()`
*   **Description:** Starts the retrieve phase: pushes `begin_retrieving` on thrower and removes captured entities from scene (they will be dropped later).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `BeginFinalPickup()`
*   **Description:** Final pickup phase: triggers `begin_final_pickup` on thrower, releases all captured items via `DropItem`, restores thrower's arm animation, and removes the net entity.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `UpdateWhenRetrieving(dt)`
*   **Description:** Moves net back toward thrower at `retrieve_velocity`, updating height and triggering final pickup when close enough.
*   **Parameters:** `dt` (number) — Delta time in seconds.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None — does not register `inst:ListenForEvent`.
- **Pushes:**
    * `begin_opening` — fired when net reaches target and opens.
    * `play_throw_pst` — fired once when net passes `distance_to_play_open_anim`.
    * `begin_final_pickup` — fired when net returns near thrower (via `UpdateWhenRetrieving`).
- **Per-entity events:**
    * `on_pre_net` — pushed on entities found during `BeginOpening` (radius + school size).
    * `on_release_from_net` — pushed on each item during `DropItem` before being dropped.
    * `begin_retrieving` — pushed on thrower when `BeginRetrieving` is called.
    * `begin_final_pickup` — pushed on thrower when `BeginFinalPickup` is called.
