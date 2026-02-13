---
id: deciduoustreeupdater
title: Deciduoustreeupdater
description: This component manages the Deciduous Tree's transition into and behavior within its 'monster' form, including target acquisition, spawning defensive roots, and Birchnut Drakes.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# Deciduoustreeupdater

## Overview
This component is responsible for controlling the Deciduous Tree's "monster" state. When active, it allows the tree to detect nearby threats, sprout damaging roots, and periodically spawn Birchnut Drakes to defend itself. It manages the duration of this monster state, various internal timers for spawning and attacking, and cleanup when the state ends or the entity is removed/sleeps.

## Dependencies & Tags
This component relies on several aspects of the entity and world:
*   The host entity (`self.inst`) is expected to have a `combat` component for target evaluation.
*   The host entity is expected to have a `burnable` component to check for burning status.
*   The host entity interacts with its `statemachine` (`self.inst.sg`) to check state tags like "burning".
*   It utilizes `TheWorld.Map` for position validation (`IsPointNearHole`).
*   It spawns `birchnutdrake` and `deciduous_root` prefabs.

### Tags
*   **Added**: `monster` (when `StartMonster` is called)
*   **Removed**: `monster` (when `StopMonster` is called)
*   **Targeting Tags (internal)**:
    *   `DRAKESPAWNTARGET_MUST_TAGS`: `_combat`
    *   `DRAKESPAWNTARGET_CANT_TAGS`: `flying`, `birchnutdrake`, `wall`

## Properties
| Property                 | Type      | Default Value | Description                                                                                             |
| :----------------------- | :-------- | :------------ | :------------------------------------------------------------------------------------------------------ |
| `inst`                   | `Entity`  | *n/a*         | Reference to the entity this component is attached to.                                                  |
| `monster`                | `boolean` | `false`       | True if the Deciduous Tree is currently in its monster form.                                            |
| `monster_target`         | `Entity`  | `nil`         | The current entity targeted by the tree for root attacks.                                               |
| `last_monster_target`    | `Entity`  | `nil`         | The previously targeted entity, used for `sway` event logic.                                            |
| `last_attack_time`       | `number`  | `0`           | The game time (GetTime()) when the last root attack was initiated.                                      |
| `root`                   | `Entity`  | `nil`         | A reference to the last `deciduous_root` prefab spawned.                                                |
| `starttask`              | `Task`    | `nil`         | A `Task` handle for the delayed start of component updates after `StartMonster` is called.              |
| `drakespawntask`         | `Task`    | `nil`         | A `Task` handle for the periodic spawning of drakes triggered by player proximity.                      |
| `ignitedrakespawntask`   | `Task`    | `nil`         | A `Task` handle for the periodic spawning of drakes triggered by the `SpawnIgniteWave` function.        |
| `sleeptask`              | `Task`    | `nil`         | A `Task` handle for delaying the `StopMonster` call when the entity goes to sleep.                      |
| `time_to_passive_drake`  | `number`  | `1`           | Countdown until the next passive birchnut drake spawn attempt.                                          |
| `num_passive_drakes`     | `number`  | `0`           | The number of passive birchnut drakes to spawn in the current wave.                                     |
| `passive_drakes_spawned` | `number`  | `0`           | The count of passive drakes already spawned in the current wave.                                        |
| `monsterFreq`            | `number`  | `0.5 + math.random()` | The frequency (in seconds) at which the tree's monster logic (target acquisition, root attacks) updates. |
| `monsterTime`            | `number`  | `monsterFreq` | Countdown until the next monster logic update.                                                          |
| `spawneddrakes`          | `boolean` | `false`       | True if the initial proximity-triggered drakes have already been spawned during the current monster state. |
| `numdrakes`              | `number`  | *n/a*         | The total number of drakes to spawn during a proximity-triggered wave. Initialized within `OnUpdate`.   |
| `ignitenumdrakes`        | `number`  | *n/a*         | The total number of drakes to spawn during an ignite-triggered wave. Initialized within `SpawnIgniteWave`. |

## Main Functions
### `StartMonster(starttime)`
*   **Description:** Initiates the Deciduous Tree's monster form. This involves setting the `monster` flag to true, initializing various internal timers and counters, adding the "monster" tag to the entity, and scheduling the component to start updating after a short delay.
*   **Parameters:**
    *   `starttime`: (`number`, optional) The game time at which the monster state officially began. If not provided, `GetTime()` is used.

### `StopMonster()`
*   **Description:** Terminates the Deciduous Tree's monster form. This function sets the `monster` flag to false, clears the current target, removes the "monster" tag, and cancels all active internal tasks related to monster behavior (start task, drake spawn tasks, sleep tasks). It also stops the component from updating.
*   **Parameters:** None.

### `OnRemoveFromEntity()`
*   **Description:** A lifecycle callback invoked when the component is removed from its parent entity. It serves as an alias to `StopMonster`, ensuring that all monster behavior is properly shut down.
*   **Parameters:** None.

### `OnEntityWake()`
*   **Description:** A lifecycle callback invoked when the entity wakes up from sleep. If a `sleeptask` was pending (meaning the entity was going to stop its monster form), it cancels that task. Otherwise, it immediately calls `StartMonster()`, resuming aggressive behavior.
*   **Parameters:** None.

### `OnEntitySleep()`
*   **Description:** A lifecycle callback invoked when the entity goes to sleep. It schedules a delayed `StopMonster` call via `sleeptask`, ensuring that the tree's monster form eventually deactivates if it remains asleep.
*   **Parameters:** None.

### `OnUpdate(dt)`
*   **Description:** This is the primary update loop for the `DeciduousTreeUpdater` component when in monster form. It performs several key checks and actions each frame:
    *   Checks if the monster duration has expired and initiates shutdown if so.
    *   Manages a countdown for spawning "passive" Birchnut Drakes and spawns them periodically.
    *   Manages a separate countdown (`monsterTime`) for more intensive monster logic.
    *   When `monsterTime` elapses, it finds a target, spawns `deciduous_root` spikes towards the target, and potentially triggers the initial wave of Birchnut Drakes if a player is very close and drakes haven't been spawned yet.
    *   Pushes "sway" events to the entity's state graph when a target is acquired or lost.
*   **Parameters:**
    *   `dt`: (`number`) The time elapsed since the last update.

### `SpawnIgniteWave()`
*   **Description:** Triggers a wave of Birchnut Drakes to spawn around the tree. This function is typically called when the Deciduous Tree is ignited. It sets up a periodic task to spawn a configured number of drakes.
*   **Parameters:** None.

## Events & Listeners
This component pushes the following events:
*   `inst:PushEvent("sway", {monster=true, monsterpost=nil})`: Pushed when the tree acquires a new `monster_target`.
*   `inst:PushEvent("sway", {monster=nil, monsterpost=true})`: Pushed when the tree loses its `monster_target`.
*   `root:PushEvent("givetarget", { target = self.monster_target, targetpos = rootpos, targetangle = angle, owner = self.inst })`: Pushed to a newly spawned `deciduous_root` prefab to give it a target and attack parameters.