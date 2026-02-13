---
id: commander
title: Commander
description: This component allows an entity to command a group of other entities, managing their membership, issuing shared directives, and tracking their proximity.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# Commander

## Overview
The Commander component enables an entity to act as a leader for a group of other entities, referred to as "soldiers." It provides functionality to manage the roster of soldiers, issue shared commands (like setting combat targets or alerting them), and optionally track their distance from the commander, automatically removing those that stray too far or become incapacitated. This component is crucial for implementing follower AI, pet systems, or any scenario where one entity directs a collective group.

## Dependencies & Tags
This component interacts with several other components present on the "soldier" entities it manages:
*   `health`: Checked in `AddSoldier` to prevent dead entities from becoming soldiers.
*   `combat`: Used by `ShareTargetToAllSoldiers` and `DropAllSoldierTargets` to manage soldier targets.
*   `sleeper`: Used by `IsAnySoldierNotAlert` and `AlertAllSoldiers` to check and modify the sleep status of soldiers.
*   `freezable`: Used by `IsAnySoldierNotAlert` and `AlertAllSoldiers` to check and modify the frozen status of soldiers.

No tags are explicitly added or removed by this component on its host entity.

## Properties
| Property         | Type     | Default Value | Description                                                                                             |
|:-----------------|:---------|:--------------|:--------------------------------------------------------------------------------------------------------|
| `inst`           | `Entity` | `inst`        | A reference to the entity this component is attached to.                                                |
| `soldiers`       | `table`  | `{}`          | A table containing soldier entities, mapped to `true` for efficient lookup.                             |
| `numsoldiers`    | `number` | `0`           | The current count of soldiers managed by this commander.                                                |
| `trackingdist`   | `number` | `0`           | The maximum distance (in world units) a soldier can be from the commander before being automatically removed. A value of 0 disables distance tracking. |
| `trackingperiod` | `number` | `3`           | The time interval (in seconds) between checks for soldier distances when tracking is active.            |
| `_task`          | `Task`   | `nil`         | An internal reference to the periodic task used for distance tracking.                                  |
| `_onremove`      | `function` | (anonymous function) | An internal callback function used to handle `onremove` and `death` events from soldier entities.       |

## Main Functions
### `OnRemoveFromEntity()`
*   **Description:** Called when the Commander component is removed from its host entity. It iterates through all managed soldiers and calls `RemoveSoldier` for each to ensure proper cleanup, removing event listeners and updating soldier counts.
*   **Parameters:** None.

### `GetNumSoldiers(prefab)`
*   **Description:** Returns the total number of active soldiers. If a `prefab` string is provided, it returns the count of soldiers matching that specific prefab.
*   **Parameters:**
    *   `prefab` (`string`, optional): The prefab name to filter soldiers by.

### `CollectSoldiers(tbl, prefab)`
*   **Description:** Populates a given table (`tbl`) with all active soldier entities. If a `prefab` is specified, only soldiers matching that prefab will be added to the table.
*   **Parameters:**
    *   `tbl` (`table`): The table to which soldier entities will be added.
    *   `prefab` (`string`, optional): The prefab name to filter soldiers by.

### `GetAllSoldiers(prefab)`
*   **Description:** Returns a new table containing all active soldier entities. If a `prefab` is specified, only soldiers matching that prefab will be included.
*   **Parameters:**
    *   `prefab` (`string`, optional): The prefab name to filter soldiers by.

### `IsSoldier(ent)`
*   **Description:** Checks if the given entity (`ent`) is currently being managed as a soldier by this commander.
*   **Parameters:**
    *   `ent` (`Entity`): The entity to check.

### `ForEachSoldier(fn, ...)`
*   **Description:** Executes a provided function (`fn`) for each active soldier. Note that the current implementation passes `self.inst` (the commander) as the first argument to `fn`, not the soldier entity itself.
*   **Parameters:**
    *   `fn` (`function`): The function to execute.
    *   `...` (variadic): Any additional arguments to pass to `fn` after the commander entity.

### `ShareTargetToAllSoldiers(target)`
*   **Description:** Instructs all active soldiers that possess a `combat` component to `SuggestTarget` for the given `target` entity.
*   **Parameters:**
    *   `target` (`Entity`): The entity to suggest as a target.

### `DropAllSoldierTargets()`
*   **Description:** Clears the current combat target for all active soldiers that possess a `combat` component.
*   **Parameters:** None.

### `IsAnySoldierNotAlert()`
*   **Description:** Checks if any active soldier is currently asleep or frozen.
*   **Parameters:** None.

### `AlertAllSoldiers()`
*   **Description:** Wakes up any sleeping soldiers and unfreezes any frozen soldiers.
*   **Parameters:** None.

### `PushEventToAllSoldiers(ev, data)`
*   **Description:** Pushes a custom event (`ev`) with optional `data` to every active soldier entity.
*   **Parameters:**
    *   `ev` (`string`): The name of the event to push.
    *   `data` (`table`, optional): A table containing data to send with the event.

### `AddSoldier(ent)`
*   **Description:** Adds an entity (`ent`) to the commander's list of soldiers. It performs checks to ensure the entity is not dead and not already a soldier. It sets up `onremove` and `death` listeners on the soldier to automatically handle its removal. It also starts distance tracking if configured and pushes relevant events.
*   **Parameters:**
    *   `ent` (`Entity`): The entity to add as a soldier.

### `RemoveSoldier(ent)`
*   **Description:** Removes an entity (`ent`) from the commander's list of soldiers. It cleans up the event listeners previously set on the soldier and stops distance tracking if no more soldiers remain. It also pushes relevant events.
*   **Parameters:**
    *   `ent` (`Entity`): The entity to remove from soldiers.

### `SetTrackingDistance(dist)`
*   **Description:** Sets the `trackingdist` property. If the distance is greater than 0, it ensures distance tracking is started; otherwise, it stops tracking.
*   **Parameters:**
    *   `dist` (`number`): The new maximum tracking distance.

### `StartTrackingDistance()`
*   **Description:** Initiates a periodic task that checks the distance of all soldiers from the commander. If `trackingdist` is greater than 0 and there are active soldiers, any soldier found too far away or asleep will be automatically removed. This task is only started if not already running.
*   **Parameters:** None.

### `StopTrackingDistance()`
*   **Description:** Cancels the periodic distance tracking task if it is currently running.
*   **Parameters:** None.

### `OnEntityWake`
*   **Description:** An alias for `StartTrackingDistance`. This function is automatically called when the commander's host entity wakes up (e.g., from sleep).
*   **Parameters:** None.

### `OnEntitySleep`
*   **Description:** An alias for `StopTrackingDistance`. This function is automatically called when the commander's host entity goes to sleep.
*   **Parameters:** None.

### `GetDebugString()`
*   **Description:** Returns a formatted string containing debug information about the commander, including the number of soldiers, tracking distance, tracking period, and the status of the tracking task.
*   **Parameters:** None.

## Events & Listeners
### Listens To (on Soldier Entities)
*   `"onremove"`: Triggered when a soldier entity is removed from the game. The commander's `_onremove` callback handles this by calling `RemoveSoldier`.
*   `"death"`: Triggered when a soldier entity dies. The commander's `_onremove` callback handles this by calling `RemoveSoldier`.

### Pushes/Triggers (on Commander Entity)
*   `"soldierschanged"`: Triggered on `self.inst` whenever a soldier is successfully added or removed from the commander's list.

### Pushes/Triggers (on Soldier Entities)
*   `"gotcommander"`: Triggered on the newly added soldier entity (`ent`) after `AddSoldier` is called, providing a reference to the commander.
*   `"lostcommander"`: Triggered on the removed soldier entity (`ent`) after `RemoveSoldier` is called, providing a reference to the commander.