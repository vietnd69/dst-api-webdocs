---
id: embarker
title: Embarker
description: This component manages an entity's movement and state during embarkation onto or disembarkation from a walkable platform or a specific world position.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: 27dc6b38
---

# Embarker

## Overview
The Embarker component is responsible for orchestrating the movement and state changes of an entity when it needs to embark onto a target (e.g., a boat or another platform) or disembark to a specific land position. It handles pathfinding towards the target, checks for completion or cancellation conditions, and provides methods to set the embark/disembark destinations and finalize the action.

## Dependencies & Tags
This component implicitly relies on the owning entity having the following components:
*   `locomotor`: For retrieving hop distance and signaling completion of hopping.
*   `Transform`: For getting and setting world positions and rotations.
*   `Physics`: For controlling movement (stopping, setting motor velocity, teleporting).

Additionally, the `embarkable` target entity, if set, is expected to have a `walkableplatform` component.
No specific tags are added or removed by this component.

## Properties
| Property            | Type        | Default Value | Description                                                                   |
| :------------------ | :---------- | :------------ | :---------------------------------------------------------------------------- |
| `inst`              | `Entity`    | `self`        | A reference to the entity this component is attached to.                      |
| `embarkable`        | `Entity/nil`| `nil`         | The target entity (e.g., a boat) to embark onto.                              |
| `start_x, start_y, start_z` | `number`    | Entity's current world position | The world position of the entity when the component is initialized. |
| `embark_speed`      | `number`    | `10`          | The speed at which the entity moves during an embark/disembark action.        |
| `last_embark_x, last_embark_z` | `number/nil` | `nil`         | The last known or calculated embark position, used as a fallback destination. |

## Main Functions
### `Embarker:UpdateEmbarkingPos(dt)`
*   **Description:** This is the core update logic for the embarking/disembarking movement. It calculates the entity's current position relative to its destination, applies movement, rotation, and checks for completion or if the maximum hop distance has been exceeded.
*   **Parameters:**
    *   `dt`: (`number`) The time elapsed since the last frame.

### `Embarker:SetEmbarkable(embarkable)`
*   **Description:** Sets the target entity that the owning entity will embark onto. This also updates the `last_embark_x`/`z` and forces the entity to face the embark point. It clears any previous disembark destination.
*   **Parameters:**
    *   `embarkable`: (`Entity`) The entity (e.g., a boat, platform) to embark onto. This entity is expected to have a `walkableplatform` component.

### `Embarker:SetDisembarkPos(pos_x, pos_z)`
*   **Description:** Sets a specific world position as the disembark destination. This forces the entity to face the disembark point and clears any `embarkable` target.
*   **Parameters:**
    *   `pos_x`: (`number`) The X-coordinate of the disembark position.
    *   `pos_z`: (`number`) The Z-coordinate of the disembark position.

### `Embarker:SetDisembarkActionPos(pos_x, pos_z)`
*   **Description:** Calculates and sets the disembark position, potentially adjusting it to be a safe distance from the target using the `GetDisembarkPosAndDistance` helper function.
*   **Parameters:**
    *   `pos_x`: (`number`) The desired X-coordinate for disembarking.
    *   `pos_z`: (`number`) The desired Z-coordinate for disembarking.

### `Embarker:StartMoving()`
*   **Description:** Initiates the movement phase for embarking or disembarking. It stops current physics movement, calculates the maximum hop distance, records the starting point, and begins updating the component. It also pushes the "start_embark_movement" event.
*   **Parameters:** None.

### `Embarker:OnUpdate(dt)`
*   **Description:** The main update callback for the component, called by the entity's update loop when the component is started. It simply delegates to `UpdateEmbarkingPos`.
*   **Parameters:**
    *   `dt`: (`number`) The time elapsed since the last frame.

### `Embarker:HasDestination()`
*   **Description:** Checks if the component currently has an active embarkable target or a disembark position set, indicating it has a pending destination.
*   **Parameters:** None.

### `Embarker:GetEmbarkPosition()`
*   **Description:** Determines the current target position for the entity's movement. If an `embarkable` entity is set, it queries its `walkableplatform` component for the position. Otherwise, it uses the `disembark_x`/`z` or `last_embark_x`/`z` as fallback, or the entity's current position if no other target is specified.
*   **Parameters:** None.

### `Embarker:Embark()`
*   **Description:** Finalizes the embark/disembark action. It teleports the entity to its calculated destination, resets all internal state variables related to the embark/disembark action, stops the component's updates, and signals the locomotor component to finish hopping.
*   **Parameters:** None.

### `Embarker:Cancel()`
*   **Description:** Stops the ongoing embark/disembark movement immediately, resets all internal state variables, stops the component's updates, and signals the locomotor component to finish hopping. It effectively aborts the action without reaching the destination.
*   **Parameters:** None.

### `GetDisembarkPosAndDistance(inst, target_x, target_z)` (Global Helper)
*   **Description:** A global utility function that calculates a safe disembark position and the distance to it. It attempts to find a spot approximately `disembark_distance` units away from the `target_x`/`target_z` towards the `inst`'s current position, ensuring it's on land and not on a platform.
*   **Parameters:**
    *   `inst`: (`Entity`) The entity attempting to disembark.
    *   `target_x`: (`number`) The X-coordinate of the intended disembark target.
    *   `target_z`: (`number`) The Z-coordinate of the intended disembark target.

## Events & Listeners
This component pushes the following events:
*   `"done_embark_movement"`: Triggered when the entity completes its movement (reaches destination or is canceled due to exceeding hop distance).
*   `"start_embark_movement"`: Triggered when the `StartMoving()` function is called, indicating the beginning of an embark/disembark action.