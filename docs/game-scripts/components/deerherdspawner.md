---
id: deerherdspawner
title: Deerherdspawner
description: This component manages the spawning, tracking, and seasonal migration of deer herds in the world.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: world
---

# Deerherdspawner

## Overview
The `Deerherdspawner` component is responsible for orchestrating the lifecycle of deer herds within the game world. It handles the initial summoning of deer during autumn, tracks the active deer population, and manages their migration behavior as winter approaches, ensuring deer populations are maintained and interact appropriately with the game's seasons.

## Dependencies & Tags
This component implicitly relies on the existence and proper functioning of the `deerherding` component on the `TheWorld` entity. It also expects "deer" prefabs to be defined and available for spawning, and "deerspawningground" prefabs to be registered as potential spawning locations.
It does not directly add or remove tags from the entity it is attached to.

## Properties
| Property | Type | Default Value | Description |
| :------- | :--- | :------------ | :---------- |
| `inst` | `Entity` | - | A reference to the parent entity this component is attached to. |

## Main Functions
### `GetDeer()`
*   **Description:** Returns a table containing all currently active deer entities being tracked by this spawner.
*   **Parameters:** None.

### `SpawnDeer(pos, center)`
*   **Description:** Creates and spawns a single "deer" prefab at the specified position. It also registers the newly spawned deer with the spawner for tracking.
*   **Parameters:**
    *   `pos`: A `Vector3` representing the exact world position where the deer should be spawned.
    *   `center`: A `Vector3` representing the center of the herd, used to calculate the deer's offset from the herd center for its `knownlocations` component.

### `OnUpdate(dt)`
*   **Description:** This function is called every frame when the component is updating. It manages the internal timers for spawning new herds (`_timetospawn`) and triggering herd migration (`_timetomigrate`), calling the respective functions when timers expire. If no timers are active, it stops the component from updating.
*   **Parameters:**
    *   `dt`: The delta time (time elapsed since the last frame) in seconds.

### `LongUpdate(dt)`
*   **Description:** An alias for `OnUpdate`. Used for updates that can tolerate less frequent calls, though in this component, it behaves identically to `OnUpdate`.
*   **Parameters:**
    *   `dt`: The delta time in seconds.

### `OnSave()`
*   **Description:** Serializes the component's internal state for persistence, including active timers and the GUIDs of active deer.
*   **Parameters:** None.

### `OnLoad(data)`
*   **Description:** Deserializes and restores the component's internal state from saved data, including timers for spawning and migration.
*   **Parameters:**
    *   `data`: A table containing the saved state data.

### `LoadPostPass(newents, data)`
*   **Description:** Called after all entities have been loaded, allowing the component to re-establish references to active deer entities using their GUIDs from saved data. It also restarts component updates if any timers were active.
*   **Parameters:**
    *   `newents`: A table mapping GUIDs to newly loaded entities.
    *   `data`: A table containing the saved state data.

### `GetDebugString()`
*   **Description:** Returns a formatted string providing debug information about the spawner's current state, such as remaining time until spawning/migration or the number of active deer.
*   **Parameters:** None.

### `DebugSummonHerd(time)`
*   **Description:** A debug function to force the immediate or delayed summoning of a deer herd, bypassing normal seasonal logic.
*   **Parameters:**
    *   `time` (optional): The time in seconds until the herd should be summoned. Defaults to 1 second if not provided.

### `OnPostInit()`
*   **Description:** Called after the entity and its components have been fully initialized. It performs initial setup checks for deer spawning, particularly if the game starts in winter or autumn.
*   **Parameters:** None.

## Events & Listeners
*   **Listens For:**
    *   `ms_registerdeerspawningground`: Triggered by other entities to register themselves as valid deer spawning locations.
    *   `onremove` (from individual deer entities): Called when a tracked deer entity is removed from the world, causing it to be untracked.
    *   `onremove` (from registered spawner entities): Called when a registered spawning ground entity is removed, removing it from the list of available spawners.
    *   `death` (from individual deer entities): Called when a tracked deer entity dies, causing it to be untracked.
    *   World State Change `isautumn`: Triggers `QueueSummonHerd` to schedule new deer herd spawning.
    *   World State Change `iswinter`: Triggers `QueueHerdMigration` to schedule deer herd migration.

*   **Pushes/Triggers:**
    *   `queuegrowantler` (on individual deer entities): Signaled to active deer when herd migration is queued, potentially triggering antler growth.
    *   `deerherdmigration` (on individual deer entities): Signaled to active deer when the herd migration is initiated, prompting them to migrate.