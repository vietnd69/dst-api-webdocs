---
id: chargingreticule
title: Chargingreticule
description: Manages the visual reticule used for targeting charged abilities, positioning and orienting it based on player input.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: ui
source_hash: eb5077a1
---

# Chargingreticule

## Overview
This component is responsible for creating and managing a visual reticule entity that aids in targeting abilities requiring a charge or specific direction. It dynamically updates the reticule's position and rotation based on the current player input method (mouse or controller), ensuring it accurately reflects the intended target location or direction relative to its owner.

## Dependencies & Tags
This component implicitly relies on the entity having the `transform` component for position/rotation manipulation and the `animstate` component for visual representation.
None identified.

## Properties
| Property          | Type      | Default Value | Description                                                                                             |
| :---------------- | :-------- | :------------ | :------------------------------------------------------------------------------------------------------ |
| `inst`            | `Entity`  | -             | The entity instance this component is attached to.                                                      |
| `ease`            | `boolean` | `false`       | Determines if rotation updates should be smoothly eased (interpolated) or snap directly.                  |
| `smoothing`       | `number`  | `6.66`        | Controls the speed of rotation easing when `ease` is `true`. Higher values mean faster interpolation.   |
| `targetpos`       | `Vector3` | `nil`         | The current world position (x, 0, z) the reticule is targeting. Updated by mouse or controller input. |
| `followhandler`   | `function`| `nil`         | A handler function registered with `TheInput` for mouse movement, if a mouse is being used.           |
| `owner`           | `Entity`  | `nil`         | The entity (e.g., player character) that "owns" and is using this reticule.                             |

## Main Functions
### `OnRemoveEntity()`
*   **Description:** Cleans up internal resources when the reticule entity is removed from the game world. This includes unregistering the mouse move handler and removing the `TheCamera` listener to prevent memory leaks or errors.
*   **Parameters:** None.

### `GetMouseTargetXZ(x, y)`
*   **Description:** Projects screen coordinates (e.g., mouse position) into the game world's XZ plane to determine a target position. This function returns the X and Z world coordinates.
*   **Parameters:**
    *   `x` (`number`): The screen X coordinate.
    *   `y` (`number`): The screen Y coordinate.

### `GetControllerTargetXZ()`
*   **Description:** Calculates a target XZ plane position based on controller input (directional controls) relative to the camera's orientation. This is used when a controller is attached. Returns the X and Z world coordinates.
*   **Parameters:** None.

### `LinkToEntity(target)`
*   **Description:** Initializes and links the reticule to a specified `target` entity. It sets the `owner`, updates the reticule's initial position, and sets up the appropriate input handlers (mouse or controller) and camera listener for continuous targeting updates. If no direct target can be determined initially, it defaults to a position in front of the owner.
*   **Parameters:**
    *   `target` (`Entity`): The entity that will own and use this reticule.

### `UpdatePosition_Internal()`
*   **Description:** Internal helper function that sets the reticule's world position to match its `owner`'s world position. The Y coordinate is always set to 0.
*   **Parameters:** None.

### `UpdateRotation_Internal(dt)`
*   **Description:** Internal helper function that updates the reticule's rotation to face its `targetpos`. If easing is enabled (`self.ease` is true) and a `dt` (delta time) is provided, the rotation will smoothly interpolate; otherwise, it snaps instantly.
*   **Parameters:**
    *   `dt` (`number`, optional): The delta time since the last frame, used for smooth rotation easing.

### `OnCameraUpdate(dt)`
*   **Description:** A callback function invoked whenever the camera updates (typically every frame). It ensures the reticule's position and target are up-to-date and handles rotation based on the active input method.
*   **Parameters:**
    *   `dt` (`number`): The delta time since the last camera update.

### `Snap()`
*   **Description:** Instantly updates the reticule's position to match its owner and forces it to face the `targetpos` directly, bypassing any easing. This is useful for immediate targeting adjustments.
*   **Parameters:** None.

## Events & Listeners
*   **Listens For:**
    *   `TheCamera:AddListener(self, self._oncameraupdate)`: Listens for general camera update events, triggering `self:OnCameraUpdate(dt)` to refresh the reticule's position and orientation.
    *   `TheInput:AddMoveHandler(function(x, y)...)`: When using mouse input, this handler listens for mouse movement events to update the `targetpos`.