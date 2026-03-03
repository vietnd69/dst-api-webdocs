---
id: embarker
title: Embarker
description: Manages the movement and positioning of an entity during embarkation or disembarkation onto/from a platform or designated position.
tags: [locomotion, platform, movement]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 27dc6b38
system_scope: locomotion
---

# Embarker

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Embarker` handles the physics and logic for moving an entity toward a specific target position, typically during transitions such as boarding or exiting platforms (e.g., boats, rafts, or walkable structures). It is used in coordination with `WalkablePlatform` (for embarking) and `LocoMotor` (for speed and hop mechanics). The component supports both continuous movement updates and atomic teleportation, emitting events at key stages.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("embarker")

local platform = TheWorld.Map:GetPlatformAtPoint(x, z)
if platform and platform.components.walkableplatform then
    inst.components.embarker:SetEmbarkable(platform)
    inst.components.embarker:StartMoving()
end
```

## Dependencies & tags
**Components used:** `locomotor`, `walkableplatform`, `physics`, `transform`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `embarkable` | `Entity?` | `nil` | Reference to the `WalkablePlatform` entity being boarded, if any. |
| `embark_speed` | number | `10` | Speed in units per second used during movement. |
| `disembark_x`, `disembark_z` | number? | `nil` | Target coordinates for disembarking (manual override). |
| `last_embark_x`, `last_embark_z` | number? | `nil` | Last known valid embark position, used as fallback. |
| `start_x`, `start_y`, `start_z` | number | World position at instantiation | Initial world coordinates captured in constructor. |
| `max_hop_dist_sq` | number? | `nil` | Squared maximum allowed travel distance for a hop (set in `StartMoving`). |
| `hop_start_pt` | `{x, y, z}`? | `nil` | Position at start of current hop (used for distance tracking). |

## Main functions
### `UpdateEmbarkingPos(dt)`
*   **Description:** Advances the entity toward its current embark target over `dt` seconds. If the target is reached, teleports to the final position and fires `done_embark_movement`. If movement exceeds `max_hop_dist_sq`, cancels the move and fires `done_embark_movement`.
*   **Parameters:** `dt` (number) — time elapsed since last update.
*   **Returns:** Nothing.
*   **Error states:** If no valid destination is set (`GetEmbarkPosition` returns `nil`), behavior falls back to the entity’s current position, which may stall movement.

### `SetEmbarkable(embarkable)`
*   **Description:** Sets the `WalkablePlatform` instance to be boarded. Computes and updates the embark position using the platform’s `GetEmbarkPosition`, and orients the entity toward it.
*   **Parameters:** `embarkable` (`Entity`) — the platform entity with a `walkableplatform` component.
*   **Returns:** Nothing.
*   **Error states:** No explicit validation; assumes `embarkable.components.walkableplatform` exists.

### `SetDisembarkPos(pos_x, pos_z)`
*   **Description:** Sets a direct disembark position (e.g., on land) without referencing a platform. Clears `embarkable` and forces the entity to face the new position.
*   **Parameters:**  
    `pos_x` (number) — X coordinate of disembark position.  
    `pos_z` (number) — Z coordinate of disembark position.  
*   **Returns:** Nothing.

### `SetDisembarkActionPos(pos_x, pos_z)`
*   **Description:** Sets a disembark position using a helper function that computes a safe distance away from the target, typically to avoid overlapping obstacles.
*   **Parameters:** `pos_x`, `pos_z` (number) — coordinates of the intended disembark target.
*   **Returns:** Nothing.
*   **Notes:** Internally calls `GetDisembarkPosAndDistance`, which adjusts the position based on platform availability and distance.

### `StartMoving()`
*   **Description:** Begins the movement update loop. Computes the maximum hop distance using `LocoMotor:GetHopDistance` (scaled by 1.5×), records the hop start position, and fires `start_embark_movement`.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Early return if `max_hop_dist_sq` is already set (i.e., movement already in progress).

### `OnUpdate(dt)`
*   **Description:** Wrapper for `UpdateEmbarkingPos(dt)` used when the component is registered for updates via `inst:StartUpdatingComponent(self)`.
*   **Parameters:** `dt` (number) — time elapsed.
*   **Returns:** Nothing.

### `HasDestination()`
*   **Description:** Checks if a valid destination is currently set (either via `embarkable` or `disembark_x/z`).
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if a destination is active, otherwise `false`.

### `GetEmbarkPosition()`
*   **Description:** Retrieves the current target position for movement. Prioritizes `embarkable`, then `disembark_x/z`, and finally `last_embark_x/z`.
*   **Parameters:** None.
*   **Returns:** `number, number` — `x`, `z` coordinates of the target position.
*   **Error states:** Returns entity’s current position if no embark/disembark target is set and `last_embark_x/z` is `nil`.

### `Embark()`
*   **Description:** Finalizes the movement by teleporting to the computed embark position and resetting all internal state (clearing platforms, positions, hop tracking). Calls `LocoMotor:FinishHopping` to clean up reserved platform state.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Cancel()`
*   **Description:** Immediately terminates movement without completing the hop, resetting all state and stopping physics. Also calls `LocoMotor:FinishHopping`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetDisembarkPosAndDistance(inst, target_x, target_z)`
*   **Description:** *Standalone helper function* — computes a safe disembark position `disembark_distance` (default `4`) units away from a target, while avoiding invalid terrain. Returns the adjusted coordinates and the original distance.
*   **Parameters:**  
    `inst` (`Entity`) — the entity performing the disembark.  
    `target_x`, `target_z` (number) — intended target coordinates.  
*   **Returns:**  
    `number, number, number` — adjusted `x`, `z` coordinates, and original or adjusted travel distance (as a safety metric).
*   **Error states:** If the adjusted position lies on invalid terrain (e.g., water or underground), falls back to `target_x/z` with distance `0`.

## Events & listeners
- **Listens to:** None.
- **Pushes:**  
    - `start_embark_movement` — fired when `StartMoving()` initiates movement.  
    - `done_embark_movement` — fired when movement completes (success or cancellation).
