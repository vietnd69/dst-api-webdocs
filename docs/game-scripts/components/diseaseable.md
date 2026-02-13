---
id: diseaseable
title: Diseaseable
description: This component manages an entity's ability to become diseased, spread disease to other entities, and handle related visual effects and timers.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# Diseaseable

## Overview
This component integrates into the game's Entity Component System to manage the disease state of an entity. It enables entities to develop a disease over time, display visual cues, potentially spread the disease to nearby eligible entities, and persist their disease state across game saves. It handles the scheduling of various stages of disease progression, from an initial delay, through a warning phase, to full-blown disease and subsequent spreading attempts.

## Dependencies & Tags
This component explicitly adds and removes the following tags from its associated entity:
*   `diseaseable` (added in `_ctor` and removed on `OnRemoveFromEntity`)
*   `diseased` (added when the `diseased` property is true, removed when false or on `OnRemoveFromEntity`)

It relies on the global `TUNING` table for various disease-related parameters such as chance, delay times, warning times, and spread radius. It also leverages other components of nearby entities (specifically `v.components.diseaseable`) to interact with them for disease spread and delay rescheduling. The component also spawns the `diseaseflies` prefab for visual effects.

## Properties
| Property | Type | Default Value | Description |
| :------- | :--- | :------------ | :---------- |
| `inst` | `Entity` | (set in `_ctor`) | A reference to the entity this component is attached to. |
| `onDiseasedFn` | `function` | `nil` | A custom callback function that is invoked when the entity becomes fully diseased. |
| `diseased` | `boolean` | `false` | Indicates whether the entity is currently in a diseased state. Setting this property triggers the `ondiseased` observer, which manages the "diseased" tag. |
| `_lastfx` | `number` | `0` | Timestamp of the last time disease visual effects (flies) were spawned, used to prevent rapid re-spawning. |
| `_fxtask` | `Task` | `nil` | Reference to the `Task` object managing the scheduling of disease visual effects. |
| `_spreadtask` | `Task` | `nil` | Reference to the `Task` object managing the scheduling of disease spread attempts. |
| `_delaytask` | `Task` | `nil` | Reference to the `Task` object managing the initial delay before a disease attempt is made. |
| `_warningtask` | `Task` | `nil` | Reference to the `Task` object managing the warning period before an entity becomes fully diseased. |

## Main Functions
### `ondiseased(self, diseased)`
*   **Description:** This function is an observer callback triggered when the `diseased` property of the component changes. It is responsible for adding or removing the "diseased" tag from the entity based on the new state.
*   **Parameters:**
    *   `self`: A reference to the Diseaseable component instance.
    *   `diseased`: A boolean indicating the new state of the `diseased` property (`true` if diseased, `false` otherwise).

### `OnRemoveFromEntity()`
*   **Description:** Called when the component is removed from its entity. This function cancels all active tasks (`_fxtask`, `_spreadtask`, `_delaytask`, `_warningtask`) and removes both the "diseased" and "diseaseable" tags from the entity to ensure a clean state.
*   **Parameters:** None.

### `IsDiseased()`
*   **Description:** Returns whether the entity is currently in a fully diseased state.
*   **Parameters:** None.

### `IsBecomingDiseased()`
*   **Description:** Returns whether the entity is currently undergoing the warning phase before becoming fully diseased.
*   **Parameters:** None.

### `SetDiseasedFn(fn)`
*   **Description:** Sets a custom callback function that will be executed when the entity transitions into a fully diseased state.
*   **Parameters:**
    *   `fn`: The function to be called. It receives the entity instance as its argument: `fn(inst)`.

### `Disease()`
*   **Description:** Initiates the transition of the entity into a diseased state. If the entity is not already diseased, it cancels any existing tasks (delay, warning), sets `diseased` to `true`, schedules disease visual effects (`_fxtask`), schedules disease spread attempts (`_spreadtask`), and invokes the `onDiseasedFn` if one is set.
*   **Parameters:** None.

### `Spread()`
*   **Description:** Attempts to spread the disease from the current diseased entity to a nearby eligible entity. It finds a random nearby entity with the "diseaseable" tag within `TUNING.DISEASE_SPREAD_RADIUS`. If found, it calls `Disease()` on that entity's `diseaseable` component and then reschedules its own spread task.
*   **Parameters:** None.

### `RestartNearbySpread()`
*   **Description:** Finds all nearby entities within `TUNING.DISEASE_SPREAD_RADIUS` that are currently diseased and have the "diseased" tag. For each found entity, it cancels its current spread task and immediately reschedules a new one. This is used to make spread attempts more responsive.
*   **Parameters:** None.

### `OnSave()`
*   **Description:** Serializes the current state of the component for saving. It stores information about active tasks (`_spreadtask`, `_delaytask`, `_warningtask`) and their remaining times if the entity is diseased or in a pre-diseased state.
*   **Parameters:** None.

### `OnLoad(data)`
*   **Description:** Deserializes the component's state from saved `data`. It restores the disease state, including active tasks and their remaining durations, effectively resuming the disease progression from where it was saved.
*   **Parameters:**
    *   `data`: A table containing the saved state information for the component.

### `GetDebugString()`
*   **Description:** Provides a formatted string containing debug information about the component's current state, including whether it's diseased and the remaining times for its active spread, delay, and warning tasks.
*   **Parameters:** None.