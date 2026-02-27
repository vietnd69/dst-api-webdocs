---
id: cooldown
title: Cooldown
description: This component manages a timed cooldown state for an entity, allowing it to track and signal when a period of inactivity has passed.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: b44a49f9
---

# Cooldown

## Overview
This component provides a robust mechanism for entities to manage timed cooldowns for their abilities or actions. It tracks a "charged" state, initiates timed delays, cancels active cooldowns, and can persist its state across game saves. It also supports custom callback functions for when a cooldown starts and when it finishes.

## Dependencies & Tags
None identified.

## Properties
| Property            | Type      | Default Value | Description                                                               |
|:--------------------|:----------|:--------------|:--------------------------------------------------------------------------|
| `charged`           | boolean   | `false`       | Indicates whether the cooldown period has finished and the ability is ready. |
| `cooldown_duration` | number    | `nil`         | The default duration (in seconds) for the cooldown period.                |
| `startchargingfn`   | function  | `nil`         | A callback function to be executed when the cooldown period begins.       |
| `onchargedfn`       | function  | `nil`         | A callback function to be executed when the cooldown period ends and the component becomes `charged`. |
| `task`              | task_handle| `nil`         | An internal handle to the active `DoTaskInTime` task managing the cooldown timer. |
| `cooldown_deadline` | number    | `nil`         | The global game time (from `GetTime()`) at which the cooldown is scheduled to finish. `nil` if not currently charging. |

## Main Functions
### `OnRemoveFromEntity()`
* **Description:** Cleans up any active cooldown tasks when the component is removed from its entity, preventing memory leaks or unexpected behavior.
* **Parameters:** None.

### `StartCharging(time)`
* **Description:** Initiates a cooldown period for the specified duration. If `time` is not provided, it defaults to `self.cooldown_duration`. This will set `self.charged` to `false` and schedule a task to mark it as charged after the given time.
* **Parameters:**
    *   `time`: (`number`, optional) The duration in seconds for the cooldown. If `nil`, `self.cooldown_duration` is used.

### `FinishCharging()`
* **Description:** Immediately ends the current cooldown period, setting `self.charged` to `true` and invoking the `onchargedfn` callback if it exists.
* **Parameters:** None.

### `GetTimeToCharged()`
* **Description:** Returns the remaining time until the cooldown period ends.
* **Parameters:** None.
* **Returns:** (`number`) The remaining time in seconds, or `0` if already charged or not currently charging.

### `IsCharged()`
* **Description:** Checks if the component is currently in a charged state (i.e., the cooldown has finished).
* **Parameters:** None.
* **Returns:** (`boolean`) `true` if charged, `false` otherwise.

### `IsCharging()`
* **Description:** Checks if the component is currently undergoing a cooldown period.
* **Parameters:** None.
* **Returns:** (`boolean`) `true` if actively charging, `false` otherwise.

### `OnSave()`
* **Description:** Gathers the necessary data to persist the cooldown component's state, allowing it to be correctly restored after a game save and load.
* **Parameters:** None.
* **Returns:** (`table`) A table containing `charged` (boolean) and `time_to_charge` (number) if applicable.

### `GetDebugString()`
* **Description:** Provides a human-readable string representing the current state of the cooldown, useful for debugging.
* **Parameters:** None.
* **Returns:** (`string`) "CHARGED!" if charged, or the remaining time formatted as a string if charging.

### `LongUpdate(dt)`
* **Description:** Handles updates to the cooldown deadline, especially important for synchronizing state after potential game pauses or when time manipulation occurs (`dt` represents elapsed time). If the `cooldown_deadline` falls below the current `GetTime()`, it triggers the `donecharging` logic.
* **Parameters:**
    *   `dt`: (`number`) The delta time since the last update.

### `OnLoad(data)`
* **Description:** Restores the cooldown component's state from saved game data. It will either mark the component as charged or restart the cooldown with the saved remaining time.
* **Parameters:**
    *   `data`: (`table`) The table of saved data, typically from `OnSave()`.