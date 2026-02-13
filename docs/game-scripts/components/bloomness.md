---
id: bloomness
title: Bloomness
description: Manages an entity's multi-stage growth or blooming cycle, tracking its current level, duration, and response to fertilizers.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# Bloomness

## Overview
The `Bloomness` component manages a multi-stage process for an entity, typically related to growth, blooming, or decay. It tracks the entity's current "bloom level" and uses a timer to progress between stages. The rate of progression can be influenced by external factors, and the process can be advanced or sustained through fertilization. This component is responsible for starting and stopping its own update logic based on whether it is in an active state (level > 0).

## Dependencies & Tags
None identified.

## Properties
| Property | Type | Default Value | Description |
|---|---|---|---|
| `max` | number | `3` | The maximum bloom level the entity can reach. |
| `level` | number | `0` | The current bloom level of the entity. |
| `onlevelchangedfn` | function | `nil` | A callback function that is executed whenever the bloom level changes. |
| `timer` | number | `0` | The countdown timer for the current stage. |
| `stage_duration` | number | `0` | The base duration for each intermediate bloom stage. |
| `full_bloom_duration` | number | `0` | The base duration for the final (max) bloom stage. |
| `rate` | number | `1` | A multiplier affecting how quickly the `timer` depletes. |
| `fertilizer` | number | `0` | A value representing the amount of fertilizer applied in the current stage. |
| `is_blooming` | boolean | `nil` | A state flag indicating if the entity is progressing to a higher level (`true`) or regressing to a lower one (`false`). |
| `calcratefn` | function | `nil` | An optional custom function to calculate the `rate`. |
| `calcfullbloomdurationfn` | function | `nil` | An optional custom function to calculate the effect of fertilizer at the max level. |

## Main Functions

### `SetLevel(level)`
* **Description:** Directly sets the entity's bloom level. This function handles the logic for starting or stopping the component's update tick, adjusting the timer, and setting the `is_blooming` state. It ensures the level does not exceed `self.max`.
* **Parameters:**
    * `level` (number): The new bloom level to set.

### `SetDurations(stage, full)`
* **Description:** Configures the base durations for the blooming stages.
* **Parameters:**
    * `stage` (number): The duration for each intermediate stage.
    * `full` (number): The duration for the final, fully-bloomed stage (`self.max`).

### `UpdateRate()`
* **Description:** Recalculates the progression rate (`self.rate`). If a custom `calcratefn` function has been provided, it will be called to determine the new rate; otherwise, it defaults to `1`.

### `Fertilize(value)`
* **Description:** Applies fertilizer to the entity. If the entity is not at its max level, this will increase its fertilizer value and ensure it is in a blooming state. If the entity is at max level, it typically extends the duration of the full bloom stage.
* **Parameters:**
    * `value` (number): The amount of fertilizer to apply.

### `OnUpdate(dt)`
* **Description:** The main update logic, called every game tick when the component is active. It decrements the stage timer by `dt * self.rate`. When the timer reaches zero, it transitions the entity to the next or previous level based on the `is_blooming` flag.
* **Parameters:**
    * `dt` (number): The delta time since the last update.

### `LongUpdate(dt)`
* **Description:** Handles updates for entities that are off-screen or otherwise not receiving regular updates. It functions identically to `OnUpdate`.
* **Parameters:**
    * `dt` (number): The delta time since the last long update.

### `OnSave()`
* **Description:** Serializes the component's current state into a table for saving the game. It only returns data if the bloom level is greater than 0.
* **Parameters:** None.

### `OnLoad(data)`
* **Description:** Deserializes and applies saved data to the component when loading a game. It restores the level, timer, rate, and other state variables, and resumes the update loop if necessary.
* **Parameters:**
    * `data` (table): The saved data table to load from.