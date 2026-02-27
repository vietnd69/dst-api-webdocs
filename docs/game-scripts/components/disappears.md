---
id: disappears
title: Disappears
description: This component manages an entity's timed or immediate removal from the game world, often involving an animation and cleanup.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: dcb5fc51
---

# Disappears

## Overview
This component provides functionality for an entity to disappear from the game world. It supports both immediate disappearance with an animation and cleanup, as well as a delayed disappearance triggered after a set amount of time. It handles various aspects like preventing pickup, playing sounds and animations, and eventually removing the entity.

## Dependencies & Tags
*   **Dependencies:**
    *   `inventoryitem` (interacts with it if present on the entity)
    *   `SoundEmitter` (accessed via `inst.SoundEmitter` for playing sounds)
    *   `AnimState` (accessed via `inst.AnimState` for playing animations)
*   **Tags Added:**
    *   `"NOCLICK"` (added to the entity during its disappearance process to prevent interaction)

## Properties
| Property        | Type        | Default Value | Description                                                                                             |
| :-------------- | :---------- | :------------ | :------------------------------------------------------------------------------------------------------ |
| `delay`         | `number`    | `25`          | The base delay in seconds before `PrepareDisappear()` schedules the entity's disappearance. A random variance of up to 10 seconds is added. |
| `disappearsFn`  | `function`  | `nil`         | An optional custom function `function(inst)` to be called when `Disappear()` is invoked, before other actions like animation or removal. |
| `sound`         | `string`    | `nil`         | The asset path for a sound to play when `Disappear()` is invoked via the entity's `SoundEmitter`.       |
| `anim`          | `string`    | `"disappear"` | The name of the animation to play on the entity's `AnimState` when `Disappear()` is invoked.            |
| `disappeartask` | `task_handle` | `nil`         | A reference to the scheduled `DoTaskInTime` handle, used to cancel a pending delayed disappearance.     |
| `tasktotime`    | `number`    | `nil`         | The world time (from `GetTime()`) when the `disappeartask` is scheduled to execute. Useful for debugging remaining time. |
| `isdisappear`   | `boolean`   | `nil`         | A flag indicating if the entity has already begun its disappearance process. Prevents re-triggering.    |

## Main Functions
### `Disappears:Disappear()`
*   **Description:** Initiates the immediate disappearance sequence for the entity. This process sets the `isdisappear` flag, cancels any pending `disappeartask`, executes the custom `disappearsFn` if provided, removes the entity immediately if it's currently asleep, sets `inst.persists = false`, adds the `"NOCLICK"` tag, disables inventory pickup (`canbepickedup`, `canbepickedupalive`), plays an optional sound and the specified animation (`self.anim`), and schedules the entity's final removal when the animation finishes or after a short safety timer.
*   **Parameters:** None.

### `Disappears:StopDisappear()`
*   **Description:** Cancels any currently scheduled delayed disappearance task (`self.disappeartask`) and resets `self.tasktotime`. This effectively prevents an entity from disappearing if `PrepareDisappear()` was previously called but the entity should no longer be removed.
*   **Parameters:** None.

### `Disappears:PrepareDisappear()`
*   **Description:** Schedules the entity to disappear after a randomized delay. The delay is calculated as `self.delay + math.random() * 10` seconds. If the entity is already in the process of disappearing (`self.isdisappear` is true), this function does nothing. It first calls `StopDisappear()` to clear any existing tasks before scheduling a new one.
*   **Parameters:** None.

### `Disappears:GetDebugString()`
*   **Description:** Returns a string indicating the current state of the Disappears component for debugging purposes. It will return "DISAPPEAR" if the disappearance is in progress, a formatted string like "ACTIVE countdown: X.XX" showing the remaining time if a delayed disappearance is scheduled, or "INACTIVE" otherwise.
*   **Parameters:** None.

## Events & Listeners
*   `inst:ListenForEvent("animover", self.inst.Remove)`: This component listens for the `animover` event on its `inst` (the entity). Upon receiving this event, it calls `self.inst.Remove()` to destroy the entity, ensuring it is removed once its disappearance animation has completed.