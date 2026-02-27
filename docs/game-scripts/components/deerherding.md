---
id: deerherding
title: Deerherding
description: This component manages the collective movement, grazing, spooking, and social behaviors of a group of deer within a herd.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: environment
source_hash: 8a372280
---

# Deerherding

## Overview
This component is responsible for orchestrating the collective behavior of a deer herd. It manages the herd's central location, determines whether the herd is grazing or roaming, detects spooking events, and handles the overall movement and interaction of individual deer within the group to maintain herd cohesion and respond to environmental stimuli.

## Dependencies & Tags
This component implicitly relies on several other components for the deer entities it manages:
*   `Transform` (for position and rotation)
*   `brain` (for forcing brain updates)
*   `health` (to check `takingfiredamage`)
*   `combat` (to check `HasTarget()`)
*   `hauntable` (to check `panic` state)
It also interacts with global systems like `TheSim` for entity queries and `TheWorld.components.deerherdspawner` to get the list of deer.

**Tags:** None identified.

## Properties
| Property         | Type      | Default Value      | Description                                                                  |
| :--------------- | :-------- | :----------------- | :--------------------------------------------------------------------------- |
| `inst`           | `table`   | `self`             | The entity instance this component is attached to.                           |
| `herdhomelocation`| `Vector3` | `nil`              | The initial or home location of the herd.                                    |
| `herdlocation`   | `Vector3` | `Vector3(0,0,0)`   | The current calculated central location of the herd.                         |
| `herdheading`    | `number`  | `0`                | The current calculated heading (rotation) of the herd in degrees.            |
| `herdspawner`    | `table`   | `nil`              | Reference to the `deerherdspawner` component that manages the individual deer. |
| `lastupdate`     | `number`  | `0`                | Timestamp of the last update to control update rate.                         |
| `grazetimer`     | `number`  | `GRAZING_TIME`     | Timer for switching between grazing and roaming states.                       |
| `isgrazing`      | `boolean` | `false`            | `true` if the herd is currently grazing; `false` if roaming.                 |
| `keepheading`    | `boolean` | `nil`              | If set, forces the herd to maintain a specific heading.                      |
| `grazing_time`   | `number`  | `GRAZING_TIME`     | The duration the herd spends grazing before considering roaming.             |
| `roaming_time`   | `number`  | `ROAMING_TIME`     | The duration the herd spends roaming before considering grazing.             |
| `alerttargets`   | `table`   | `{}`               | A table of entities that have alerted the herd, indexed by the deer instance. |

## Main Functions
### `Init(startingpt, herdspawner)`
*   **Description:** Initializes the herd's starting location and links it to the associated herd spawner.
*   **Parameters:**
    *   `startingpt`: A `Vector3` representing the initial world position for the herd.
    *   `herdspawner`: A reference to the `deerherdspawner` component managing this herd.

### `SetValidAareaCheckFn(fn)`
*   **Description:** Sets a custom validation function used to check if a potential target location for herd movement is valid. This allows for environmental restrictions (e.g., avoiding lava, pits).
*   **Parameters:**
    *   `fn`: A function that takes `(inst, x, y, z)` and returns `true` if the location is valid, `false` otherwise.

### `CalcHerdCenterPoint(detailedinfo)`
*   **Description:** Calculates the average center point, average facing, and maximum distance of active deer within the herd.
*   **Parameters:**
    *   `detailedinfo`: A boolean. If `true`, also returns a list of active deer and their average facing.
*   **Returns:** A `Vector3` representing the herd's center, a `number` for average facing, a `number` for maximum distance, and a `table` of active deer if `detailedinfo` is `true`. Returns `nil` if no deer are active.

### `UpdateHerdLocation(radius)`
*   **Description:** Adjusts the `herdlocation` and `herdheading` based on the current deer positions and behaviors (spooked, grazing, roaming). It attempts to find walkable offsets to avoid obstacles.
*   **Parameters:**
    *   `radius`: A `number` specifying the search radius for finding a new walkable location.

### `IsActiveInHerd(deer)`
*   **Description:** Checks if a specific deer instance is part of this herd.
*   **Parameters:**
    *   `deer`: The deer entity instance to check.
*   **Returns:** `true` if the deer is valid and registered with the herd spawner, `false` otherwise.

### `UpdateDeerHerdingStatus()`
*   **Description:** Iterates through all deer associated with the herd spawner and updates their 'active' status within the herd based on distance from the herd center, proximity to urban structures, or saltlicks.

### `CalcIsHerdSpooked()`
*   **Description:** Determines if the entire herd should enter a 'spooked' state. This occurs if any active deer is taking fire damage, is in combat, or is panicked (e.g., from haunting).
*   **Parameters:** None.
*   **Returns:** `true` if the herd is spooked, `false` otherwise.

### `IsAnyEntityAsleep()`
*   **Description:** Checks if any active deer within the herd is currently asleep.
*   **Parameters:** None.
*   **Returns:** `true` if at least one deer is asleep, `false` otherwise.

### `OnUpdate(dt)`
*   **Description:** The primary update loop for the component. It's called periodically and manages the herd's state transitions (grazing/roaming, spooked/calm), updates the herd's location, and handles time-based behaviors.
*   **Parameters:**
    *   `dt`: The time elapsed since the last update in seconds.

### `IsGrazing()`
*   **Description:** Returns the current grazing status of the herd.
*   **Parameters:** None.
*   **Returns:** `true` if the herd is grazing, `false` if roaming.

### `SetHerdAlertTarget(deer, target)`
*   **Description:** Registers or clears an alert target for a specific deer within the herd. This is used when a deer detects a threat.
*   **Parameters:**
    *   `deer`: The deer entity instance that detected the target.
    *   `target`: The entity that is the target of the alert, or `nil` to clear it.

### `GetClosestHerdAlertTarget(deer)`
*   **Description:** Finds the alert target closest to the specified deer from the `alerttargets` list.
*   **Parameters:**
    *   `deer`: The deer entity instance for which to find the closest target.
*   **Returns:** The closest valid alert target entity, or `nil` if none are found.

### `HerdHasAlertTarget()`
*   **Description:** Checks if there are any active alert targets currently registered for the herd.
*   **Parameters:** None.
*   **Returns:** `true` if the `alerttargets` table is not empty, `false` otherwise.

### `IsAHerdAlertTarget(target)`
*   **Description:** Checks if a given entity is currently an alert target for any deer in the herd.
*   **Parameters:**
    *   `target`: The entity to check.
*   **Returns:** `true` if the entity is in `alerttargets`, `false` otherwise.

### `OnSave()`
*   **Description:** Serializes the component's persistent data for saving the game state.
*   **Parameters:** None.
*   **Returns:** A table containing `herdhomelocation`, `herdlocation`, `grazetimer`, and `isgrazing`. Returns `nil` if `herdspawner` is not set.

### `OnLoad(data)`
*   **Description:** Deserializes the component's data when loading a saved game.
*   **Parameters:**
    *   `data`: A table containing the saved component data.

### `LoadPostPass(newents, data)`
*   **Description:** Called after all entities have been loaded. This is used to re-establish the connection to the global `TheWorld.components.deerherdspawner`.
*   **Parameters:**
    *   `newents`: A table of newly loaded entities (unused in this function).
    *   `data`: The component's saved data (unused in this function).

### `GetDebugString()`
*   **Description:** Provides a string for debugging purposes, displaying the herd's current state (grazing/roaming, timers, alert status, spooked status).
*   **Parameters:** None.
*   **Returns:** A formatted string with debug information.