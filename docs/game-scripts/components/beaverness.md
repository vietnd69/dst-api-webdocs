---
id: beaverness
title: Beaverness
description: Manages the player's Beaverness meter, a resource that depletes over time and causes damage when empty.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: player
---

# Beaverness

## Overview
This component manages a character-specific resource stat called "Beaverness," primarily used for Woodie's werebeaver form. It tracks a numerical value that depletes over time. When the value reaches zero, the entity begins to take periodic damage, mimicking the game's hunger mechanic. The component handles the value's modification, periodic depletion, and the associated game events for starting or stopping the "starving" state.

## Dependencies & Tags

*   **Components:**
    *   `health`: Required to apply damage when the Beaverness meter is empty.
    *   `hunger`: Used to check the player's hunger state and to determine the damage rate.
*   **Tags:**
    *   `beaverness`: Added to the entity to identify it as having this component.

## Properties

| Property                 | Type   | Default Value | Description                                                                    |
| ------------------------ | ------ | ------------- | ------------------------------------------------------------------------------ |
| `max`                    | number | `100`         | The maximum value of the Beaverness meter.                                     |
| `current`                | number | `100`         | The current value of the Beaverness meter.                                     |
| `time_effect_multiplier` | number | `1`           | A multiplier affecting the rate at which Beaverness drains over time.           |
| `task`                   | Task   | `nil`         | A handle for the periodic task that drains Beaverness. Set by `StartTimeEffect`. |

## Main Functions

### `IsStarving()`
*   **Description:** Checks if the Beaverness meter is depleted (at or below zero).
*   **Returns:** `boolean` - `true` if current Beaverness is less than or equal to 0, otherwise `false`.

### `StartTimeEffect(dt, delta_b)`
*   **Description:** Starts a periodic task that drains Beaverness over time. If a task is already running, it is cancelled and replaced. When the meter is empty, it also applies health damage at a rate determined by the `hunger` component's `hurtrate`.
*   **Parameters:**
    *   `dt` (number): The time interval, in seconds, between each tick of the effect.
    *   `delta_b` (number): The amount of Beaverness to subtract on each tick.

### `StopTimeEffect()`
*   **Description:** Stops the periodic task that drains Beaverness.

### `SetTimeEffectMultiplier(multiplier)`
*   **Description:** Sets a multiplier for the rate of Beaverness drain from the periodic time effect.
*   **Parameters:**
    *   `multiplier` (number): The new multiplier value. Defaults to `1` if `nil`.

### `DoDelta(delta, overtime)`
*   **Description:** Modifies the current Beaverness value by a given amount, clamped between 0 and `max`. It also triggers events based on the change, such as `beavernessdelta`, `startstarving`, and `stopstarving`.
*   **Parameters:**
    *   `delta` (number): The amount to add (positive) or subtract (negative) from the current Beaverness.
    *   `overtime` (boolean): A flag passed along in the `beavernessdelta` event, typically indicating if the change happened gradually.

### `GetPercent()`
*   **Description:** Calculates the current Beaverness as a percentage of the maximum.
*   **Returns:** `number` - A value between 0.0 and 1.0 representing the current percentage.

### `SetPercent(percent, overtime)`
*   **Description:** Sets the current Beaverness to a specific percentage of the maximum value.
*   **Parameters:**
    *   `percent` (number): The desired percentage (0.0 to 1.0).
    *   `overtime` (boolean): A flag to indicate if the change should be considered gradual.

### `OnSave()`
*   **Description:** Serializes the component's state for saving the game.
*   **Returns:** `table` - A table containing the `current` Beaverness value.

### `OnLoad(data)`
*   **Description:** Deserializes and applies the component's state from saved game data.
*   **Parameters:**
    *   `data` (table): The data loaded from a save file.

### `GetDebugString()`
*   **Description:** Returns a formatted string showing the current and maximum Beaverness values for debugging purposes.
*   **Returns:** `string` - The debug string (e.g., "100.00 / 100.00").

## Events & Listeners

This component pushes the following events:

*   **`beavernessdelta`**: Pushed when the Beaverness value changes via `DoDelta`.
    *   `data`: `{ oldpercent, newpercent, overtime }`
*   **`startstarving`**: Pushed when the Beaverness value drops to 0 or below from a positive value.
*   **`stopstarving`**: Pushed when the Beaverness value rises above 0 from a non-positive value.