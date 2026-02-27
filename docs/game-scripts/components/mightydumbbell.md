---
id: mightydumbbell
title: Mightydumbbell
description: Manages strength-based workout interactions for Strongman-tagged entities and adjusts their mightiness growth rate based on current mightiness level.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: 48c6aa26
---

# Mightydumbbell

## Overview
This component enables and governs the "Mightydumbbell" item's workout functionality, specifically for entities with the `strongman` tag. It tracks the current workout user, applies efficiency multipliers based on the user's *mightiness* level (wimpy, normal, or mighty), modifies the growth rate of mightiness during workouts, and handles finite-usage consumption.

## Dependencies & Tags
- **Component Dependencies:**
  - `doer.components.mightiness` (required for workout effects)
  - `self.inst.components.finiteuses` (optional; used for usage tracking)
- **Entity Tags Added/Removed:**
  - Adds tag `lifting` to the *Mightydumbbell* instance when workout begins (`StartWorkout`)
  - Removes tag `lifting` when workout ends (`StopWorkout`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `efficiency_wimpy` | `number` (efficiency constant) | `TUNING.DUMBBELL_EFFICIENCY_LOW` | Mightiness gain rate multiplier applied when user's mightiness is below `WIMPY_THRESHOLD`. |
| `efficiency_normal` | `number` (efficiency constant) | `TUNING.DUMBBELL_EFFICIENCY_LOW` | Mightiness gain rate multiplier applied when user's mightiness is between `WIMPY_THRESHOLD` and `MIGHTY_THRESHOLD`. |
| `efficiency_mighty` | `number` (efficiency constant) | `TUNING.DUMBBELL_EFFICIENCY_LOW` | Mightiness gain rate multiplier applied when user's mightiness meets or exceeds `MIGHTY_THRESHOLD`. |
| `strongman` | `entity or nil` | `nil` | Reference to the entity currently performing a workout using this item. |
| `consumption` | `number` | *unset* (assigned via `SetConsumption`) | Amount of uses consumed per workout cycle. |

## Main Functions

### `CanWorkout(doer)`
* **Description:** Determines whether a given entity is allowed to use this workout item. Only entities with the `strongman` tag and a valid `mightiness` component qualify.
* **Parameters:**  
  `doer` (`entity`): The entity attempting to start a workout.

### `IsWorkingOut(doer)`
* **Description:** Checks if the specified entity is currently the active workout user.
* **Parameters:**  
  `doer` (`entity`): The entity to check against the current workout user.

### `CheckEfficiency(doer)`
* **Description:** Calculates and applies the appropriate mightiness growth rate scale for the *current workout user*, returning the corresponding efficiency constant. Also adjusts the user's `mightiness` component's `RateScale`.
* **Parameters:**  
  `doer` (`entity`, *unused in implementation but passed*): Not used internally; logic relies on stored `self.strongman`.

### `CheckAttackEfficiency(doer)`
* **Description:** Computes the efficiency multiplier *for attack-based workouts* (e.g., punch-dumbbell interactions) without modifying the rate scale. Returns the efficiency constant (not scaled).
* **Parameters:**  
  `doer` (`entity`): The entity performing the attack workout.

### `StartWorkout(doer)`
* **Description:** Begins a workout session for the specified entity. Marks the item as `lifting`, stores the user in `self.strongman`, and applies the appropriate mightiness growth rate.
* **Parameters:**  
  `doer` (`entity`): The entity initiating the workout.

### `StopWorkout(doer)`
* **Description:** Ends the current workout session. Removes the `lifting` tag, resets the user's mightiness rate scale to neutral, and clears `self.strongman`.
* **Parameters:**  
  `doer` (`entity`, *unused*): Included for API consistency but not used.

### `SetConsumption(consumption)`
* **Description:** Sets the per-workout usage amount for finite-usage items.
* **Parameters:**  
  `consumption` (`number`): Number of uses consumed per workout.

### `SetEfficiency(wimpy, normal, mighty)`
* **Description:** Configures custom efficiency constants for wimpy, normal, and mighty mightiness levels.
* **Parameters:**  
  `wimpy` (`number`): Efficiency constant for low mightiness.  
  `normal` (`number`): Efficiency constant for mid-level mightiness.  
  `mighty` (`number`): Efficiency constant for high mightiness.

### `DoAttackWorkout(doer)`
* **Description:** Applies a mightiness gain from an *attack-based* interaction (e.g., striking the dumbbell). Uses `CheckAttackEfficiency()` and scales by `TUNING.DUMBBELL_EFFICIENCY_ATTCK_SCALE`.
* **Parameters:**  
  `doer` (`entity`): The entity performing the attack workout.

### `DoWorkout(doer)`
* **Description:** Executes a standard workout: applies mightiness gain, consumes finite uses if present, and returns `false` if the item is exhausted (triggering auto-stop).
* **Parameters:**  
  `doer` (`entity`): The entity performing the workout.  
* **Returns:**  
  `true` if the workout succeeded and the item still has uses remaining; `false` if uses reached zero.

## Events & Listeners
None identified.