---
id: boatring
title: Boatring
description: Manages the rotational movement, attached bumpers, and rotators for a boat entity.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: a99f1f1b
---

# Boatring

## Overview
The Boatring component is the central controller for a boat's physical ring structure. It manages the boat's rotation, keeps track of attached functional parts like bumpers and rotators (e.g., masts), and handles the core update loop that applies rotational movement to the boat's transform. It works in tandem with the `boatringdata` component to define the boat's physical properties.

## Dependencies & Tags
**Dependencies:**
- `boatringdata`: Required for accessing core boat properties like radius and segment count. The component will fail to initialize if `boatringdata` is not present.
- `SoundEmitter`: Used to play and stop boat movement sounds.

**Tags:**
- None identified.

## Properties
| Property | Type | Default Value | Description |
|---|---|---|---|
| `rotationdirection` | number | `0` | The current direction of rotation. `1` for clockwise, `-1` for counter-clockwise, and `0` for stationary. |
| `rotate_speed` | number | `0.5` | The base rotational speed contributed by a single rotator. |
| `max_rotate_speed` | number | `2` | The maximum possible rotational speed, regardless of the number of rotators. |
| `updating` | boolean | `false` | A flag indicating whether the component is currently receiving `OnUpdate` calls. |
| `boatbumpers` | table | `{}` | An array-like table containing references to all attached bumper entities. |
| `rotators` | table | `{}` | An array-like table containing references to all attached rotator entities (e.g., masts). |
| `onrotationchanged`| function | `function` | A callback function that triggers when the boat's rotation direction changes. It updates the state of all attached rotators. |

## Main Functions
### `GetRadius()`
* **Description:** Retrieves the radius of the boat ring. This value is fetched from the attached `boatringdata` component.
* **Parameters:** None.
* **Returns:** `number` - The radius of the boat.

### `GetNumSegments()`
* **Description:** Retrieves the number of segments that make up the boat ring. This value is fetched from the attached `boatringdata` component.
* **Parameters:** None.
* **Returns:** `number` - The number of boat segments.

### `SetRotationDirection(dir)`
* **Description:** Sets the boat's direction of rotation. This function also controls the component's update loop, starting it when rotation begins and stopping it when the boat is stationary.
* **Parameters:**
    * `dir` (number): The desired rotation direction (`1`, `-1`, or `0`).

### `AddBumper(bumper)`
* **Description:** Adds a bumper entity to the internal list of tracked bumpers.
* **Parameters:**
    * `bumper` (Entity): The bumper entity instance to add.

### `RemoveBumper(bumper)`
* **Description:** Removes a specific bumper entity from the internal list.
* **Parameters:**
    * `bumper` (Entity): The bumper entity instance to remove.

### `AddRotator(rotator)`
* **Description:** Adds a rotator entity (e.g., a mast) to the internal list of tracked rotators.
* **Parameters:**
    * `rotator` (Entity): The rotator entity instance to add.

### `RemoveRotator(rotator)`
* **Description:** Removes a specific rotator entity from the internal list.
* **Parameters:**
    * `rotator` (Entity): The rotator entity instance to remove.

### `GetBumperAtPoint(x, z)`
* **Description:** Searches through all attached bumpers to find one that occupies the specified world coordinates.
* **Parameters:**
    * `x` (number): The x-coordinate to check.
    * `z` (number): The z-coordinate to check.
* **Returns:** The bumper `Entity` instance at the given point, or `nil` if none is found.

### `OnDeath()`
* **Description:** A callback function triggered when the boat entity is destroyed. It kills the "boat_movement" sound.
* **Parameters:** None.

### `OnUpdate(dt)`
* **Description:** The main update function, called every frame when the boat is rotating. It calculates the rotation speed based on the number of active rotators and applies the rotation to the boat's transform.
* **Parameters:**
    * `dt` (number): The time delta since the last update.

### `OnSave()`
* **Description:** Saves the component's state for persistence. It saves the `rotationdirection`.
* **Parameters:** None.
* **Returns:** A `table` containing the data to be saved.

### `OnLoad(data)`
* **Description:** Loads the component's state from saved data. It restores the `rotationdirection`.
* **Parameters:**
    * `data` (table): The saved data table.

## Events & Listeners
* **Listens for `death`:** When the boat entity dies, it calls the `OnDeath()` function to clean up sounds.
* **Listens for `rotationdirchanged`:** When this event is triggered on the boat entity, it calls the internal `onrotationchanged` handler to update the visual state of all attached rotator entities (e.g., turning sails).