---
id: boatleak
title: Boatleak
description: Manages the state and behavior of a single leak on a boat, including its size, repair status, and visual/audio effects.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# Boatleak

## Overview
The Boatleak component is attached to individual leak prefabs that spawn on a boat. It is responsible for managing the entire lifecycle of a single leak, including its visual state (small, medium, plugged, repaired), audio cues, and interactions with repair items. It functions as a state machine, transitioning the leak's appearance and behavior in response to player actions or timers.

## Dependencies & Tags

**Tags Added/Removed**
*   `boat_leak`: Added when the entity is an active leak.
*   `boat_repaired_patch`: Added when the leak has been patched.

## Properties
| Property | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `has_leaks` | boolean | `false` | Tracks if the entity is currently in an active, leaking state. |
| `leak_build` | string | `"boat_leak_build"` | The asset build to use for the leak's animation. Can be overridden by the boat. |
| `isdynamic` | boolean | `false` | If true, the leak persists through saving and loading. Used for leaks not tied to hull health (e.g., from a Cookie Cutter). |
| `current_state` | string | `nil` | Stores the current state of the leak (e.g., "small_leak", "repaired_kelp"). |
| `boat` | entity | `nil` | A reference to the boat entity this leak is on. |

## Main Functions

### `Repair(doer, patch_item)`
*   **Description:** Attempts to repair the leak using a specified `patch_item`. If the item has a `repairer` component, it will attempt to repair the boat's hull. Otherwise, it consumes the patch item directly and transitions the leak to a repaired state.
*   **Parameters:**
    *   `doer`: The entity performing the repair action.
    *   `patch_item`: The item prefab being used to repair the leak.

### `ChangeToRepaired(repair_build_name, sndoverride)`
*   **Description:** A helper function that transitions the leak to a fully repaired state. It updates the entity's tags, changes its animation build and visuals, plays a repair sound, and kills any leaking sound loops.
*   **Parameters:**
    *   `repair_build_name`: The animation build to use for the repaired patch visual.
    *   `sndoverride` (optional): An alternate sound path to play instead of the default repair sound.

### `SetRepairedTime(time)`
*   **Description:** Starts a countdown timer for temporary repairs (e.g., with Kelp Fronds). When the timer expires, the repair fails and the leak returns.
*   **Parameters:**
    *   `time`: The duration in seconds for the temporary repair to last.

### `GetRemainingRepairedTime()`
*   **Description:** Returns the remaining time in seconds for a temporary repair before it fails.
*   **Returns:** A `number` representing the remaining time, or `nil` if there is no active temporary repair timer.

### `SetPlugged(setting)`
*   **Description:** Toggles the leak's state between plugged and unplugged. A plugged leak still exists but has a different visual and audio treatment.
*   **Parameters:**
    *   `setting`: A boolean. If `true` or omitted, it changes to the plugged state. If `false`, it changes to the unplugged state.

### `SetState(state, skip_open)`
*   **Description:** The core state machine function. It changes the leak's visual appearance, sounds, and tags based on the provided state string. This manages transitions between small leaks, medium leaks, various repaired states, and plugged states.
*   **Parameters:**
    *   `state`: A string identifier for the target state (e.g., "small_leak", "repaired_tape", "med_leak_plugged").
    *   `skip_open` (optional): A boolean that, if true, skips the initial "opening" part of the leak animation.

### `SetBoat(boat)`
*   **Description:** Assigns the leak to a specific boat entity. This allows the leak to inherit properties from the boat, such as custom `leak_build` assets.
*   **Parameters:**
    *   `boat`: The boat entity instance this leak is on.

### `IsFinishedSpawning()`
*   **Description:** Checks if the leak's initial "pre" animation has completed and it has entered its main looping animation.
*   **Returns:** `true` if the leak is in its loop animation or not in a leaking state, `false` otherwise.

### `OnSave(data)`
*   **Description:** Saves the state of a dynamic leak, including its current state and any remaining time on a temporary repair. This is only used for leaks where `isdynamic` is true.
*   **Parameters:**
    *   `data`: The table to serialize save data into.

### `OnLoad(data)`
*   **Description:** Loads the state of a dynamic leak. It schedules a delayed task to re-initialize the leak's state once the world is loaded.
*   **Parameters:**
    *   `data`: The table of deserialized save data.

### `LongUpdate(dt)`
*   **Description:** Manages the temporary repair timer during a `LongUpdate` (e.g., after sleeping or server migration). It correctly reduces the remaining time on the timer by the `dt` value.
*   **Parameters:**
    *   `dt`: The amount of time that has passed during the long update.

## Events & Listeners
*   **Listens for `animover`:** When in the `repaired_treegrowth` state, this listener waits for the repair animation to finish, then either transitions to an idle animation or removes the entity.