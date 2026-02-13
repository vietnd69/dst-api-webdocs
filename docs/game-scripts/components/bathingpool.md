---
id: bathingpool
title: Bathingpool
description: Manages entities entering, leaving, and occupying a defined circular area, such as a pond or oasis lake.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: world
---

# Bathingpool

## Overview
The `Bathingpool` component transforms an entity into an area that other entities can occupy. It manages a list of "occupants," enforces a maximum capacity, and provides logic for entities to find a valid spot to enter and to leave the area. This is commonly used for features like the Oasis lake where creatures can cool off.

## Dependencies & Tags
None identified.

## Properties

| Property | Type | Default Value | Description |
|---|---|---|---|
| `maxoccupants` | number | `nil` | The maximum number of entities allowed in the pool at one time. If `nil`, there is no limit. |
| `radius` | number | `nil` | The radius of the pool's occupiable area. If `nil`, the entity's physics radius is used. |
| `occupants` | table | `{}` | An array-like table containing the entity instances currently inside the pool. |
| `onstartbeingoccupiedby` | function | `nil` | An optional callback function that fires when an entity successfully starts occupying the pool. It receives `(inst, occupant)`. |
| `onstopbeingoccupiedby` | function | `nil` | An optional callback function that fires when an entity stops occupying the pool. It receives `(inst, occupant)`. |

## Main Functions

### `OnRemoveFromEntity()`
* **Description:** A cleanup function called when the component is removed from its entity. It iterates through all current occupants, forces them to leave the pool by pushing a `ms_leavebathingpool` event, and removes all associated event listeners.
* **Parameters:** None.

### `SetRadius(r)`
* **Description:** Sets the radius of the pool.
* **Parameters:**
    * `r` (number): The new radius for the pool area.

### `GetRadius()`
* **Description:** Returns the currently configured radius of the pool. If no radius has been explicitly set, it defaults to the entity's physics radius.
* **Parameters:** None.

### `SetMaxOccupants(max)`
* **Description:** Sets the maximum number of entities allowed in the pool. If the new maximum is less than the current number of occupants, any excess occupants will be immediately removed.
* **Parameters:**
    * `max` (number): The new maximum occupant capacity.

### `SetOnStartBeingOccupiedBy(fn)`
* **Description:** Assigns a callback function to be executed when an entity enters the pool.
* **Parameters:**
    * `fn` (function): The callback function to execute. It will be called with the pool's instance and the entering entity as arguments: `fn(inst, occupant)`.

### `SetOnStopBeingOccupiedBy(fn)`
* **Description:** Assigns a callback function to be executed when an entity leaves the pool.
* **Parameters:**
    * `fn` (function): The callback function to execute. It will be called with the pool's instance and the leaving entity as arguments: `fn(inst, occupant)`.

### `IsOccupant(ent)`
* **Description:** Checks if a given entity is currently in the pool's list of occupants.
* **Parameters:**
    * `ent` (Entity): The entity to check.

### `ForEachOccupant(fn, ...)`
* **Description:** Executes a given function for each occupant currently in the pool. The iteration stops if the function `fn` returns a truthy value.
* **Parameters:**
    * `fn` (function): The function to call for each occupant. It receives the pool's instance, the occupant entity, and any additional arguments passed to `ForEachOccupant`.
    * `...` (any): Additional arguments to pass to the callback function `fn`.

### `CheckOccupant(ent)`
* **Description:** Verifies that an entity is still a valid occupant. It does this by checking the entity's stategraph memory (`sg.statemem.occupying_bathingpool`) to ensure it is still in a state associated with occupying this specific pool instance.
* **Parameters:**
    * `ent` (Entity): The occupant entity to validate.

### `EnterPool(ent)`
* **Description:** The primary function for an entity to attempt to enter the pool. It checks for available capacity, calculates an unoccupied position within the pool's radius, and then pushes the `ms_enterbathingpool` event to the entity to initiate movement. If successful, the entity is added to the occupants list.
* **Parameters:**
    * `ent` (Entity): The entity attempting to enter the pool.
* **Returns:** `true` if the entity was successfully added, or `false` and a reason string (e.g., "NOSPACE") on failure.

### `LeavePool(ent)`
* **Description:** The primary function for an entity to leave the pool. It verifies the entity is a valid occupant and then pushes the `ms_leavebathingpool` event to it.
* **Parameters:**
    * `ent` (Entity): The entity attempting to leave the pool.
* **Returns:** `true` if the leave event was successfully pushed, `false` otherwise.

## Events & Listeners

This component pushes events to other entities and listens for events on its occupants.

*   **Pushes Event `ms_enterbathingpool`:** Pushed to an entity to instruct it to move to a specific destination within the pool. The event data includes the pool's instance (`target`) and the destination coordinates (`dest`).
*   **Pushes Event `ms_leavebathingpool`:** Pushed to an occupant to instruct it to exit the pool state.
*   **Listens For Event `onremove` (on occupant):** When an occupant entity is removed from the game, this listener triggers `RemoveOccupant` to clean it up from the pool's list.
*   **Listens For Event `newstate` (on occupant):** When an occupant entity changes its stategraph state, this listener calls `CheckOccupant` to ensure it is still legitimately occupying the pool. If not, the entity is removed.