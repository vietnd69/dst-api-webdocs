---
id: childspawner
title: Childspawner
description: This component manages the spawning, tracking, and regeneration of child entities for a parent entity, including regular and "emergency" children.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: 8d24c6ec
---

# Childspawner

## Overview
The Childspawner component is responsible for managing a pool of child entities associated with the entity it is attached to. It handles the logic for periodically spawning children, regenerating the internal count of children when existing ones are killed or return home, and tracking the children currently spawned in the world. It also supports "emergency" children for situations like multiple players being nearby.

## Dependencies & Tags
This component relies on or interacts with the following:
*   **Components:** `homeseeker`, `knownlocations`, `inventoryitem`, `combat`, `health` (on spawned children or target entities), `Transform` (on self and children).
*   **Tags:** Checks for `player` and `playerghost` tags on entities within `emergencydetectionradius`.

## Properties
| Property                      | Type      | Default Value | Description                                                                                                                                                                                                                                                                                                                                                                                                         |
| :---------------------------- | :-------- | :------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `inst`                        | `table`   | (entity ref)  | A reference to the entity this component is attached to.                                                                                                                                                                                                                                                                                                                                                            |
| `childrenoutside`             | `table`   | `{}`          | A table containing references to the regular child entities currently spawned and active in the world.                                                                                                                                                                                                                                                                                                              |
| `childreninside`              | `number`  | `1`           | The count of regular children available to be spawned or regenerated; represents children "at home".                                                                                                                                                                                                                                                                                                                |
| `numchildrenoutside`          | `number`  | `0`           | The number of regular children currently outside the spawner's internal pool (i.e., spawned in the world).                                                                                                                                                                                                                                                                                                          |
| `maxchildren`                 | `number`  | `0`           | The maximum total number of regular children (inside + outside) this spawner can manage.                                                                                                                                                                                                                                                                                                                            |
| `childname`                   | `string`  | `""`          | The prefab name of the default regular child to be spawned. This can be overridden per `SpawnChild` call.                                                                                                                                                                                                                                                                                                         |
| `rarechild`                   | `string`  | `nil`         | The prefab name of a rare child that can be spawned instead of the default.                                                                                                                                                                                                                                                                                                                                         |
| `rarechildchance`             | `number`  | `0.1`         | The probability (0-1) of spawning a `rarechild` instead of the `childname` prefab.                                                                                                                                                                                                                                                                                                                                  |
| `onvacate`                    | `function`| `nil`         | Callback function invoked when all regular children have been spawned or otherwise removed from the "inside" pool (i.e., `childreninside` reaches 0). Signature: `onvacate(inst)`.                                                                                                                                                                                                                                      |
| `onoccupied`                  | `function`| `nil`         | Callback function invoked when the `childreninside` count increases from 0 (i.e., a child returns home or is regenerated). Signature: `onoccupied(inst)`.                                                                                                                                                                                                                                                             |
| `onspawned`                   | `function`| `nil`         | Callback function invoked after a child entity has been successfully spawned and positioned. Signature: `onspawned(inst, child)`.                                                                                                                                                                                                                                                                                    |
| `ontakeownership`             | `function`| `nil`         | Callback function invoked when the spawner takes ownership of a child, either through spawning or `TakeOwnership`. Signature: `ontakeownership(inst, child)`.                                                                                                                                                                                                                                                        |
| `ongohome`                    | `function`| `nil`         | Callback function invoked when a child successfully goes home (is removed from the world and added back to the internal pool). Signature: `ongohome(inst, child)`.                                                                                                                                                                                                                                                     |
| `spawning`                    | `boolean` | `false`       | Whether the component is actively trying to spawn children periodically.                                                                                                                                                                                                                                                                                                                                            |
| `queued_spawn`                | `boolean` | `false`       | Indicates if a spawn event is queued to occur when the entity wakes up or is loaded.                                                                                                                                                                                                                                                                                                                                |
| `timetonextspawn`             | `number`  | `0`           | The remaining time until the next regular child can be spawned.                                                                                                                                                                                                                                                                                                                                                     |
| `spawnperiod`                 | `number`  | `20`          | The base time (in seconds) between spawning regular children when `spawning` is true.                                                                                                                                                                                                                                                                                                                               |
| `spawnvariance`               | `number`  | `2`           | The variance (in seconds) applied to `spawnperiod` to make spawn times less predictable.                                                                                                                                                                                                                                                                                                                            |
| `regening`                    | `boolean` | `true`        | Whether the component is actively regenerating `childreninside` from killed/removed children.                                                                                                                                                                                                                                                                                                                       |
| `timetonextregen`             | `number`  | `0`           | The remaining time until the next child is regenerated into the `childreninside` pool.                                                                                                                                                                                                                                                                                                                              |
| `regenperiod`                 | `number`  | `20`          | The base time (in seconds) between regenerating `childreninside` counts.                                                                                                                                                                                                                                                                                                                                            |
| `regenvariance`               | `number`  | `2`           | The variance (in seconds) applied to `regenperiod`.                                                                                                                                                                                                                                                                                                                                                                 |
| `spawnoffscreen`              | `boolean` | `false`       | If true, children can be spawned even if the parent entity is off-screen or asleep.                                                                                                                                                                                                                                                                                                                                 |
| `task`                        | `userdata`| `nil`         | Reference to the `DoPeriodicTask` handle used for internal updates.                                                                                                                                                                                                                                                                                                                                                 |
| `emergencychildname`          | `string`  | `nil`         | The prefab name of the default emergency child to be spawned.                                                                                                                                                                                                                                                                                                                                                       |
| `emergencychildrenperplayer`  | `number`  | `1`           | The number of emergency children to commit for each player detected within `emergencydetectionradius`.                                                                                                                                                                                                                                                                                                              |
| `maxemergencychildren`        | `number`  | `0`           | The absolute maximum number of emergency children (inside + outside) this spawner can manage.                                                                                                                                                                                                                                                                                                                       |
| `maxemergencycommit`          | `number`  | `0`           | The current maximum number of emergency children the spawner is "committed" to providing, based on nearby players.                                                                                                                                                                                                                                                                                                  |
| `emergencydetectionradius`    | `number`  | `10`          | The radius around the spawner used to detect players for `maxemergencycommit` calculation.                                                                                                                                                                                                                                                                                                                          |
| `emergencychildreninside`     | `number`  | `0`           | The count of emergency children available to be spawned or regenerated.                                                                                                                                                                                                                                                                                                                                             |
| `emergencychildrenoutside`    | `table`   | `{}`          | A table containing references to the emergency child entities currently spawned and active in the world.                                                                                                                                                                                                                                                                                                            |
| `numemergencychildrenoutside` | `number`  | `0`           | The number of emergency children currently outside the spawner's internal pool.                                                                                                                                                                                                                                                                                                                                     |
| `_doqueuedspawn`              | `function`| (internal)    | Internal callback bound to `DoQueuedSpawn()`.                                                                                                                                                                                                                                                                                                                                                                     |
| `_onchildkilled`              | `function`| (internal)    | Internal callback bound to `OnChildKilled(child)`.                                                                                                                                                                                                                                                                                                                                                                |
| `useexternaltimer`            | `boolean` | `false`       | If true, the spawner expects external functions (`spawntimerstart`, `regentimerstart`, etc.) to manage its update timers instead of its internal `DoPeriodicTask`.                                                                                                                                                                                                                                              |

## Main Functions
### `OnRemoveFromEntity()`
*   **Description:** Called when the component is removed from its entity. It unregisters all child listeners and cancels any active periodic update tasks to prevent memory leaks or errors.
*   **Parameters:** None.

### `StartRegen()`
*   **Description:** Activates the regeneration process for `childreninside` and `emergencychildreninside`. If not already full, it sets the `timetonextregen` and starts the component's update task.
*   **Parameters:** None.

### `StopRegen()`
*   **Description:** Deactivates the regeneration process. It also attempts to stop the component's update task if no other updates are needed.
*   **Parameters:** None.

### `SetSpawnPeriod(period, variance)`
*   **Description:** Sets the base time and variance for how often regular children are spawned.
*   **Parameters:**
    *   `period` (`number`): The new base time (in seconds) between spawns.
    *   `variance` (`number`, optional): The new variance (in seconds). Defaults to `period * 0.1` if not provided.

### `SetRegenPeriod(period, variance)`
*   **Description:** Sets the base time and variance for how often children are regenerated back into the internal pool.
*   **Parameters:**
    *   `period` (`number`): The new base time (in seconds) between regenerations.
    *   `variance` (`number`, optional): The new variance (in seconds). Defaults to `period * 0.1` if not provided.

### `SetEmergencyRadius(rad)`
*   **Description:** Sets the radius used to detect players for calculating `maxemergencycommit`.
*   **Parameters:**
    *   `rad` (`number`): The new detection radius.

### `IsFull()`
*   **Description:** Checks if the spawner has reached its `maxchildren` capacity (i.e., `NumChildren()` >= `maxchildren`).
*   **Parameters:** None.

### `NumChildren()`
*   **Description:** Returns the total number of regular children currently managed by the spawner (both `childreninside` and `numchildrenoutside`).
*   **Parameters:** None.

### `IsEmergencyFull()`
*   **Description:** Checks if the spawner has reached its `maxemergencychildren` capacity (i.e., `NumEmergencyChildren()` >= `maxemergencychildren`).
*   **Parameters:** None.

### `NumEmergencyChildren()`
*   **Description:** Returns the total number of emergency children currently managed by the spawner (both `emergencychildreninside` and `numemergencychildrenoutside`).
*   **Parameters:** None.

### `DoRegen()`
*   **Description:** Performs a single regeneration step. If `regening` is true, it increments `childreninside` and `emergencychildreninside` by 1, if they are not already full.
*   **Parameters:** None.

### `OnUpdate(dt)`
*   **Description:** The primary update function called periodically. It decrements `timetonextregen` and `timetonextspawn`, calling `DoRegen()` or `SpawnChild()` respectively when timers expire. It also handles queuing spawns for when the entity wakes.
*   **Parameters:**
    *   `dt` (`number`): The delta time since the last update.

### `ShouldUpdate()`
*   **Description:** Determines if the component needs to be actively updated (either for spawning or regeneration).
*   **Parameters:** None.

### `StartUpdate()`
*   **Description:** Initiates the periodic update task (or external timers if `useexternaltimer` is true) if `ShouldUpdate()` is true and no task is already running.
*   **Parameters:** None.

### `TryStopUpdate()`
*   **Description:** Attempts to stop the periodic update task (or external timers) if `ShouldUpdate()` is now false, meaning no more updates are currently needed.
*   **Parameters:** None.

### `StartSpawning()`
*   **Description:** Activates the periodic spawning of children. Resets `timetonextspawn` to 0 and starts the update task.
*   **Parameters:** None.

### `StopSpawning()`
*   **Description:** Deactivates the periodic spawning of children. Attempts to stop the component's update task.
*   **Parameters:** None.

### `SetOccupiedFn(fn)`
*   **Description:** Sets the callback function to be invoked when the spawner becomes "occupied" (i.e., `childreninside` increases from 0).
*   **Parameters:**
    *   `fn` (`function`): The callback function.

### `SetSpawnedFn(fn)`
*   **Description:** Sets the callback function to be invoked after a child is successfully spawned.
*   **Parameters:**
    *   `fn` (`function`): The callback function.

### `SetOnTakeOwnershipFn(fn)`
*   **Description:** Sets the callback function to be invoked when the spawner takes ownership of a child entity.
*   **Parameters:**
    *   `fn` (`function`): The callback function.

### `SetGoHomeFn(fn)`
*   **Description:** Sets the callback function to be invoked when a child successfully goes home.
*   **Parameters:**
    *   `fn` (`function`): The callback function.

### `SetVacateFn(fn)`
*   **Description:** Sets the callback function to be invoked when the spawner becomes "vacated" (i.e., `childreninside` reaches 0).
*   **Parameters:**
    *   `fn` (`function`): The callback function.

### `SetOnChildKilledFn(fn)`
*   **Description:** Sets a custom callback function to be executed when one of the spawner's owned children dies or is removed from the world.
*   **Parameters:**
    *   `fn` (`function`): The callback function. Signature: `fn(inst, child)`.

### `SetOnAddChildFn(fn)`
*   **Description:** Sets a custom callback function to be executed when children are added to the `childreninside` pool.
*   **Parameters:**
    *   `fn` (`function`): The callback function. Signature: `fn(inst, count)`.

### `CountChildrenOutside(fn)`
*   **Description:** Counts the number of active children currently spawned in the world that match an optional validation function.
*   **Parameters:**
    *   `fn` (`function`, optional): An optional function to filter children. Signature: `fn(child)`.

### `SetMaxChildren(max)`
*   **Description:** Sets the maximum total number of regular children the spawner can manage. This function also recalculates `childreninside` and adjusts the update task.
*   **Parameters:**
    *   `max` (`number`): The new maximum number of regular children.

### `SetMaxEmergencyChildren(max)`
*   **Description:** Sets the absolute maximum total number of emergency children the spawner can manage. This function recalculates `emergencychildreninside` and adjusts the update task.
*   **Parameters:**
    *   `max` (`number`): The new maximum number of emergency children.

### `OnSave()`
*   **Description:** Serializes the component's state, including spawned children (by GUID), internal child counts, and current spawning/regeneration timers, for saving the game.
*   **Parameters:** None.

### `GetDebugString()`
*   **Description:** Returns a formatted string containing debug information about the spawner's current state, including child counts, timers, and active processes.
*   **Parameters:** None.

### `OnLoad(data)`
*   **Description:** Deserializes the component's state from saved game data. It updates internal counts, timers, and active states based on the loaded data.
*   **Parameters:**
    *   `data` (`table`): The table containing saved component data.

### `DoTakeOwnership(child)`
*   **Description:** Internal function to assign ownership of a child entity to this spawner. It adds `homeseeker` and `knownlocations` components to the child, sets its home, and attaches listeners for its removal/death.
*   **Parameters:**
    *   `child` (`Entity`): The child entity to take ownership of.

### `TakeOwnership(child)`
*   **Description:** Assigns ownership of a regular child entity to this spawner. It calls `DoTakeOwnership` and registers the child in `childrenoutside`.
*   **Parameters:**
    *   `child` (`Entity`): The child entity.

### `TakeEmergencyOwnership(child)`
*   **Description:** Assigns ownership of an emergency child entity to this spawner. It calls `DoTakeOwnership` and registers the child in `emergencychildrenoutside`.
*   **Parameters:**
    *   `child` (`Entity`): The emergency child entity.

### `LoadPostPass(newents, savedata)`
*   **Description:** Called after all entities have been loaded, allowing the spawner to re-establish references to its children by GUID. It calls `TakeOwnership` or `TakeEmergencyOwnership` for each loaded child.
*   **Parameters:**
    *   `newents` (`table`): A table mapping GUIDs to loaded entities.
    *   `savedata` (`table`): The raw saved data for the component.

### `GetChildPrefab(overridedefaultprefab, isemergency, target)`
*   **Description:** Determines which child prefab to spawn, considering rare child chances and any `otherchildreninside` pools.
*   **Parameters:**
    *   `overridedefaultprefab` (`string`, optional): A prefab name to use instead of `childname` or `emergencychildname`.
    *   `isemergency` (`boolean`): True if spawning an emergency child.
    *   `target` (`Entity`, optional): The target entity for luck rolls.

### `DoSpawnChild(target, prefab, radius, isemergency)`
*   **Description:** The core internal function for spawning a child entity at a suitable location near the spawner. It handles position finding, prefab selection, and initial setup of the child.
*   **Parameters:**
    *   `target` (`Entity`, optional): The target entity, potentially used for `combat` component.
    *   `prefab` (`string`, optional): The prefab name to spawn. If `nil`, `childname` or `emergencychildname` is used.
    *   `radius` (`number`, optional): The maximum radius around the spawner to look for a spawn location.
    *   `isemergency` (`boolean`): True if spawning an emergency child.

### `QueueSpawnChild()`
*   **Description:** Sets `queued_spawn` to true, indicating that a child should be spawned when the entity next wakes up or is explicitly told to `DoQueuedSpawn`.
*   **Parameters:** None.

### `OnEntityWake()`
*   **Description:** Event listener for when the component's entity wakes up. If a spawn is queued, it triggers `DoQueuedSpawn`.
*   **Parameters:** None.

### `DoQueuedSpawn()`
*   **Description:** Executes a previously queued spawn operation, if `spawning` is active.
*   **Parameters:** None.

### `SpawnChild(target, prefab, radius)`
*   **Description:** Spawns a single regular child entity if conditions allow (e.g., `childreninside > 0`, `inst` is valid, etc.). Decrements `childreninside` and takes ownership of the new child.
*   **Parameters:**
    *   `target` (`Entity`, optional): The target for the spawned child.
    *   `prefab` (`string`, optional): The specific prefab to spawn, overriding `childname`.
    *   `radius` (`number`, optional): The spawn radius.

### `SpawnEmergencyChild(target, prefab, radius)`
*   **Description:** Spawns a single emergency child entity if conditions allow (e.g., `emergencychildreninside > 0`, `inst` is valid, etc.). Decrements `emergencychildreninside` and takes ownership.
*   **Parameters:**
    *   `target` (`Entity`, optional): The target for the spawned child.
    *   `prefab` (`string`, optional): The specific prefab to spawn, overriding `emergencychildname`.
    *   `radius` (`number`, optional): The spawn radius.

### `UpdateMaxEmergencyCommit()`
*   **Description:** Recalculates `maxemergencycommit` based on the number of players within `emergencydetectionradius` multiplied by `emergencychildrenperplayer`.
*   **Parameters:** None.

### `TrySpawnEmergencyChild()`
*   **Description:** Updates the `maxemergencycommit` and then attempts to spawn an emergency child.
*   **Parameters:** None.

### `GoHome(child)`
*   **Description:** Attempts to bring a child entity back into the spawner's internal pool. If successful, the child entity is removed from the world, and `childreninside` or `emergencychildreninside` is incremented.
*   **Parameters:**
    *   `child` (`Entity`): The child entity attempting to go home.
*   **Returns:** `true` if the child successfully went home, `false` otherwise.

### `CanSpawn()`
*   **Description:** Checks if the spawner is currently able to spawn a regular child, considering factors like entity validity, `childreninside` count, entity sleep state, health, and an optional `canspawnfn`.
*   **Parameters:** None.

### `CanEmergencySpawn()`
*   **Description:** Checks if the spawner is currently able to spawn an emergency child, considering factors like `canemergencyspawn` flag, `emergencychildreninside` count, `maxemergencycommit`, and other general spawn conditions.
*   **Parameters:** None.

### `OnChildKilled(child)`
*   **Description:** Event handler for when one of the spawner's owned children dies, is trapped, or is removed. It removes listeners from the child, unregisters it from `childrenoutside` or `emergencychildrenoutside`, and triggers `StartUpdate()` to potentially begin regeneration.
*   **Parameters:**
    *   `child` (`Entity`): The child entity that was killed or removed.

### `ReleaseAllChildren(target, prefab, radius)`
*   **Description:** Spawns as many regular and emergency children as possible, up to their respective limits, until `CanSpawn()` and `CanEmergencySpawn()` return false.
*   **Parameters:**
    *   `target` (`Entity`, optional): The target for spawned children.
    *   `prefab` (`string`, optional): The specific prefab to spawn.
    *   `radius` (`number`, optional): The spawn radius.
*   **Returns:** `table` of spawned children.

### `AddChildrenInside(count)`
*   **Description:** Increments the `childreninside` count, capping at `maxchildren`. Triggers `onoccupied` if `childreninside` goes from 0 to positive, and `onaddchild` if set. Adjusts the update task.
*   **Parameters:**
    *   `count` (`number`): The number of children to add back into the internal pool.

### `AddEmergencyChildrenInside(count)`
*   **Description:** Increments the `emergencychildreninside` count, capping at `maxemergencychildren`. Adjusts the update task.
*   **Parameters:**
    *   `count` (`number`): The number of emergency children to add back.

### `LongUpdate(dt)`
*   **Description:** An alias for `OnUpdate(dt)`, allowing the component to be registered for long updates.
*   **Parameters:**
    *   `dt` (`number`): The delta time since the last update.

## Events & Listeners
This component listens for the following events on its owned child entities:
*   `ontrapped`: Triggered when a child is trapped.
*   `death`: Triggered when a child dies.
*   `onremove`: Triggered when a child is removed from the world.
*   `detachchild`: Triggered if the child component detaches from its entity.

This component pushes the following events:
*   `childgoinghome`: Triggered on the spawner (`self.inst`) when a child is returning home. Data: `{ child = child }`.
*   `goinghome`: Triggered on the child entity itself when it is returning home. Data: `{ home = self.inst }`.