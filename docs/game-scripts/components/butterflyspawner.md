---
id: butterflyspawner
title: Butterflyspawner
description: Manages the periodic spawning of butterflies near active players based on environmental conditions.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: environment
source_hash: 82b6d3bc
---

# Butterflyspawner

## Overview
This component is a world-level manager responsible for spawning butterflies into the environment. It operates only on the master simulation. The spawner activates during the day and outside of winter, scheduling butterfly spawns near each active player. It finds suitable spawn locations (flowers), respects a global maximum number of butterflies, and tracks certain butterflies to remove them if they become inactive.

## Dependencies & Tags
**Dependencies:**
- This component adds the `homeseeker` component to butterflies it tracks if they don't already have one.
- It interacts with the `pollinator`, `homeseeker`, and `Physics` components of spawned butterfly entities.

**Tags:**
- It searches for entities with the `"flower"` tag to use as spawn points.
- It searches for entities with the `"butterfly"` tag to count existing butterflies.

## Properties
| Property | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `inst` | `table` | `inst` | The entity instance this component is attached to. |

## Main Functions

### `OnPostInit()`
* **Description:** A lifecycle function called after the component is fully initialized. It kicks off the spawning logic by calling `ToggleUpdate(true)`.

### `StartTracking(target)`
* **Description:** Begins tracking a specific butterfly entity (`target`). This makes the butterfly non-persistent for the duration of tracking and adds a listener to automatically remove it if it goes to sleep. It also ensures the butterfly has a `homeseeker` component.
* **Parameters:**
    * `target`: The butterfly entity instance to start tracking.

### `StopTracking(target)`
* **Description:** Stops tracking a specific butterfly entity (`target`). This restores the butterfly's original persistence state, potentially removes the `homeseeker` component if it was added by this system, and removes the "sleep" event listener.
* **Parameters:**
    * `target`: The butterfly entity instance to stop tracking.

### `GetDebugString()`
* **Description:** Returns a formatted string containing debug information about the spawner's state, including whether it is active and the current count of tracked butterflies versus the maximum allowed.
* **Parameters:** None.

### Deprecated Functions
The following functions are present in the code but are empty and marked as deprecated:
- `SpawnModeNever()`
- `SpawnModeLight()`
- `SpawnModeMed()`
- `SpawnModeHeavy()`

## Events & Listeners
This component listens for the following events:

*   **`isday` (World State):** Triggers `ToggleUpdate` to start or stop the spawning logic when the world transitions between day and night.
*   **`iswinter` (World State):** Triggers `ToggleUpdate` to start or stop the spawning logic when the world enters or leaves the winter season.
*   **`ms_playerjoined`:** Listens on `TheWorld` to add new players to the active player list for spawning.
*   **`ms_playerleft`:** Listens on `TheWorld` to remove players from the active list and cancel their scheduled spawns.
*   **`entitysleep`:** A listener is dynamically added to each tracked butterfly. When a tracked butterfly goes to sleep, this triggers its removal from the world.