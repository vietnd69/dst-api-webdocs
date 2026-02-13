---
id: age
title: Age
description: Tracks a player's in-game age in seconds and days, syncing it to the network and triggering progression milestones.
sidebar_position: 1

last_updated: 2026-02_13
build_version: 712555
change_status: stable
category_type: component
system_scope: player
---

# age

## Overview
The `age` component is responsible for tracking an entity's in-game age, primarily used for player characters. It calculates age in seconds and days, handles pausing and resuming age progression, and integrates with the game's saving/loading system. Furthermore, it periodically synchronizes the entity's age with the network and triggers player achievements and notifications at specific age milestones.

## Dependencies & Tags
- **Dependencies:**
    - `inst.Network`: For syncing the player's age (`SetPlayerAge`, `GetPlayerAge`).
    - `TUNING.TOTAL_DAY_TIME`: For converting seconds to days.
    - `AwardPlayerAchievement`, `NotifyPlayerProgress`, `NotifyPlayerPresence`, `ShardGameIndex:GetGameMode()`: Global functions/objects for game progression and networking.
- **Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|---|---|---|---|
| `inst` | `Entity` | N/A | A reference to the entity this component is attached to. |
| `saved_age` | `number` | `0` | The accumulated age in seconds, primarily updated by `LongUpdate` or loaded from save data. |
| `paused_time` | `number` | `0` | The total accumulated time (in seconds) during which the aging process was paused. |
| `spawntime` | `number` | `GetTime()` | The game time (in seconds) when the component was initialized. Used as a baseline for age calculation. |
| `last_pause_time` | `number` or `nil` | `nil` | The game time (in seconds) when the aging process was last paused. `nil` if not currently paused. |
| `_synctask` | `task` or `nil` | `nil` | A reference to the `DoPeriodicTask` responsible for syncing the age with the network. |

## Main Functions

### `syncage(inst, self)`
*   **Description:** A helper function that compares the component's current display age with the network's recorded age. If they differ, it updates the network age and triggers specific player achievements ("survive_20", "survive_35", "survive_55", "survive_70") and progress notifications when certain day milestones are reached.
*   **Parameters:**
    *   `inst` (`Entity`): The entity the component belongs to.
    *   `self` (`Age`): The `age` component instance.

### `OnSetOwner(inst)`
*   **Description:** A callback function invoked when the entity's owner is set. It ensures the player's age is immediately synchronized with the network.
*   **Parameters:**
    *   `inst` (`Entity`): The entity whose owner was set.

### `Age:CancelPeriodicSync()`
*   **Description:** Stops the currently running periodic age synchronization task (`_synctask`) if one exists. After cancellation, it immediately performs a manual age synchronization via `syncage`.

### `Age:RestartPeriodicSync()`
*   **Description:** Cancels any existing periodic synchronization task and then initiates a new one. This task will call the `syncage` helper function every `SYNC_PERIOD` seconds (which is `10` seconds).

### `Age:GetAge()`
*   **Description:** Calculates the entity's total elapsed age in seconds. This calculation accounts for the `spawntime`, any accumulated `saved_age`, and time spent `paused_time`. It uses `GetTime()` if `last_pause_time` is `nil` (meaning not paused) to get the current time.
*   **Parameters:** None.
*   **Returns:** (`number`) The entity's age in seconds.

### `Age:GetAgeInDays()`
*   **Description:** Calculates the entity's age in full days by dividing the total age in seconds by `TUNING.TOTAL_DAY_TIME` and flooring the result.
*   **Parameters:** None.
*   **Returns:** (`number`) The entity's age in full days.

### `Age:GetDisplayAgeInDays()`
*   **Description:** Calculates the entity's age in full days for display purposes. This is typically `GetAgeInDays()` plus one, meaning that on day 0, it displays as day 1. This value is used for achievements and network synchronization.
*   **Parameters:** None.
*   **Returns:** (`number`) The entity's display age in full days.

### `Age:PauseAging()`
*   **Description:** Halts the progression of the entity's age. It records the current `GetTime()` as `self.last_pause_time` and cancels the periodic age synchronization task. If the component is already paused, calling this function again has no effect.
*   **Parameters:** None.

### `Age:ResumeAging()`
*   **Description:** Resumes the progression of the entity's age if it was previously paused. It calculates the duration of the pause, adds it to `self.paused_time`, clears `self.last_pause_time`, and restarts the periodic age synchronization task. If the component is not paused, calling this function has no effect.
*   **Parameters:** None.

### `Age:OnSave()`
*   **Description:** Gathers the necessary data to save the component's state. It returns the entity's current calculated age and a boolean indicating whether the aging process was paused.
*   **Parameters:** None.
*   **Returns:** (`table`) A table containing:
    *   `age` (`number`): The entity's current age in seconds.
    *   `ispaused` (`boolean`): `true` if aging is currently paused, `false` otherwise.

### `Age:GetDebugString()`
*   **Description:** Provides a formatted string representing the entity's age, suitable for debugging. If the age is more than half a day, it's displayed in days; otherwise, it's displayed in seconds.
*   **Parameters:** None.
*   **Returns:** (`string`) A formatted string showing the entity's age.

### `Age:LongUpdate(dt)`
*   **Description:** This function is called every game frame with the delta time. It accumulates `dt` into `self.saved_age`. If the aging process is paused, `dt` is also added to `self.paused_time`. If not paused, it ensures the periodic sync task is restarted (which acts as a heartbeat to re-establish the task if it somehow got canceled unexpectedly or to ensure it's running).
*   **Parameters:**
    *   `dt` (`number`): The time elapsed (in seconds) since the last `LongUpdate` call.

### `Age:OnLoad(data)`
*   **Description:** Restores the component's state from saved game data. It sets `self.saved_age` and conditionally sets `self.last_pause_time` and manages the periodic sync task based on the `ispaused` flag in the `data`.
*   **Parameters:**
    *   `data` (`table`): The table containing the saved component data, typically with `age` and `ispaused` fields.

## Events & Listeners
*   `inst:ListenForEvent("setowner", OnSetOwner)`: Listens for the "setowner" event on the entity, triggering `OnSetOwner` when an owner is assigned or changed.