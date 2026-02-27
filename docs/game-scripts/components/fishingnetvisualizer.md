---
id: fishingnetvisualizer
title: Fishingnetvisualizer
description: Manages the visual behavior and item capture/delivery logic of a fishing net entity during casting, opening, retrieving, and final pickup phases.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 26d5c557
---

# Fishingnetvisualizer

## Overview
This component handles the full lifecycle of a fishing net in the world: from throwing and flight to opening (capturing nearby items), retrieving, and finally dropping captured items near the thrower. It controls movement physics, animation triggers, and entity capture logic—primarily for visual and gameplay effect rather than authoritative simulation.

## Dependencies & Tags
- Relies on `inst.Transform` for positioning.
- Interacts with `inst.Physics` (if present) for movement.
- Uses `inst.AnimState` on the thrower to manage arm animations.
- Relies on `TheSim:FindEntities()` for proximity-based item detection.
- Relies on `TheCamera` for direction-aware item drop offsets.
- Relies on `TUNING.MAX_FISH_SCHOOL_SIZE` for initial entity search radius.

No explicit component dependencies are registered via `inst:AddComponent`, but it assumes the owner (`inst`) has transform, and that target entities have `Transform`, optional `Physics`, and `inventoryitem` components.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `velocity` | number | `10` | Speed (units/sec) while moving toward target during cast. |
| `retrieve_velocity` | number | `12` | Speed (units/sec) while moving back to thrower during retrieve. |
| `collect_radius` | number | `2` | Radius around net when opening, used to find items for capture. |
| `collect_velocity` | number | `4` | Speed at which captured entities are pulled into the net during opening phase. |
| `retrieve_distance` | number | `1.5` | Distance to thrower at which net transitions to final pickup. |
| `distance_to_play_open_anim` | number | `1.65` | Remaining distance to target at which to trigger the "play_throw_pst" event. |
| `has_played_throw_pst` | boolean | `false` | Tracks whether the throw PST event has been triggered. |
| `max_captured_entity_collect_distance` | number | `0.25` | Max distance a captured entity can move toward the net during opening. |
| `captured_entities` | table | `{}` | List of entities (items) captured by the net. |
| `captured_entities_collect_distance` | table | `{}` | Per-entity tracking of how far each has been pulled toward the net. |
| `retrieve_distance_traveled` | number | `0` | Accumulated distance traveled during retrieval phase. |
| `thrower` | entity | `nil` | Reference to the player/entity that threw the net (set at cast). |

## Main Functions

### `BeginCast(thrower, target_x, target_z)`
* **Description:** Initializes the cast phase: positions the net at the thrower, calculates flight vector, and prepares animation states.
* **Parameters:**
  - `thrower` (entity): The player or entity that threw the net.
  - `target_x`, `target_z` (numbers): World coordinates of the cast target point.

### `UpdateWhenMovingToTarget(dt)`
* **Description:** Updates net position during flight toward target. Adjusts height via parabolic arc using `CalculateY`. Triggers events when near target or arriving.
* **Parameters:**
  - `dt` (number): Delta time in seconds.

### `CalculateY(x, x_span, scale)`
* **Description:** Computes the vertical (y-axis) position for a parabolic arc trajectory.
* **Parameters:**
  - `x` (number): Horizontal distance along the arc (typically current travel offset).
  - `x_span` (number): Total horizontal span of the arc.
  - `scale` (number): Controls the height of the arc.

### `UpdateWhenOpening(dt)`
* **Description:** During the opening phase, pulls captured entities toward the net until `max_captured_entity_collect_distance` is reached. Moves entities using teleport (physics) or direct transform offset.
* **Parameters:**
  - `dt` (number): Delta time in seconds.

### `BeginOpening()`
* **Description:** Triggers pre-capture events, then scans for nearby items within `collect_radius` and adds valid inventory items to `captured_entities`.

### `DropItem(item, last_dir_x, last_dir_z, idx)`
* **Description:** Schedules an item to be released from the net with a staggered delay and direction offset based on camera orientation and net’s last movement direction.
* **Parameters:**
  - `item` (entity): The item to drop.
  - `last_dir_x`, `last_dir_z` (numbers): Direction vector components of net’s last movement.
  - `idx` (number): Used to stagger drop timing (0-based).

### `BeginRetrieving()`
* **Description:** Signals thrower of retrieval start, removes captured entities from the scene (they’ll be re-added on drop).

### `BeginFinalPickup()`
* **Description:** Signals thrower of final pickup, then drops all captured items around the thrower using `DropItem`, updates thrower animations, and destroys the net entity.

### `UpdateWhenRetrieving(dt)`
* **Description:** Moves net back toward thrower at `retrieve_velocity`, adjusting height with a shallower parabola. Triggers final pickup when within range or arrival.
* **Parameters:**
  - `dt` (number): Delta time in seconds.

## Events & Listeners

- Listens for:
  - *(None internal to this component)*

- Triggers:
  - `inst:PushEvent("begin_opening")` — when net reaches target.
  - `inst:PushEvent("play_throw_pst")` — once during flight when remaining distance ≤ `distance_to_play_open_anim`.
  - `inst:PushEvent("begin_retrieving")` — when opening phase ends and retrieval starts.
  - `inst:PushEvent("begin_final_pickup")` — when retrieval completes.

## State Machine (conceptual)

```text
[Idle] → (BeginCast) → [Flying] → (arrives) → [Opening] → (done pulling in) → [Retrieving] → (arrives) → [Destroyed]
```

- **Flying**: `UpdateWhenMovingToTarget`
- **Opening**: `UpdateWhenOpening`
- **Retrieving**: `UpdateWhenRetrieving`

## Utility Functions

- `GetRandomWithVariance(base, variance)` — returns `base + random(-variance, +variance)`.
- `VecUtil_Length(x, z)` — length of 2D vector.
- `VecUtil_Scale(x, z, scale)` — scales vector by scalar.
- `VecUtil_Dot(x1, z1, x2, z2)` — dot product of two 2D vectors.
- `GetDropDir(...)` — calculates drop direction vector relative to camera.

## Notes & Observations

- **No authority:** This is a visual/simulation helper component. It doesn’t own item positions or physics directly—relies on teleport and physics reset for captured entities.
- **Camera alignment:** Uses `TheCamera:GetDownVec()` and `GetCameraUpVec()` to orient drops relative to player’s view.
- **Staggered drops:** Each captured item is dropped with a slight delay via `PushEvent("drop_item", { ... })` scheduled at 0.05s intervals.
- **Height arc smoothing:** Uses `CalculateY` for realistic flight and retrieval arcs.
- **Hardcoded logic:** Assumes `item.Physics` exists (if not, y is set to `0`).
- **Cleanup:** `self.inst:Remove()` at end of `BeginFinalPickup` ensures the net disappears.

## Known Issues (from comments)

- `TODO(YOG): Fix me` — Likely refers to animation consistency (`ARM_carry`/`ARM_normal`) or drop behavior.
- No validation that `item.Physics` or `item.Transform` exist beyond `~= nil`.
- Potential edge case: If `distance_traveled >= dir_length` is true on first frame (e.g., thrower moves fast or net starts close), may go straight to pickup.

## File Location (Assumed)
`components/fishingnetvisualizer.lua`

## Related Components & Systems
- `item` (inventoryitem) — for captured items.
- `animstate` — for thrower’s arm animation.
- `physics` — optional; used only if present on `item`.
- `camera` — for orientation and drop vector.

---

*Documentation generated automatically. Last verified in build 714014.*