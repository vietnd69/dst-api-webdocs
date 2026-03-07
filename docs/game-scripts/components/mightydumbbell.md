---
id: mightydumbbell
title: Mightydumbbell
description: Manages workout and attack interactions for strongman characters, dynamically adjusting mightiness gain rates and consumption based on current mightiness state.
tags: [combat, player, interaction, stamina]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 48c6aa26
system_scope: entity
---

# Mightydumbbell

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Mightydumbbell` component enables a durable exercise equipment item (e.g., a dumbbell) to interact with characters who have the `strongman` tag and a `mightiness` component. It provides workout functionality that scales based on the user's current mightiness level (wimpy, normal, or mighty), applyingdelta values to `mightiness` and optionally consuming finite uses via the `finiteuses` component. It also supports attack-based workouts via `DoAttackWorkout`.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("finiteuses")
inst:AddComponent("mightydumbbell")
inst.components.mightydumbbell:SetConsumption(1)
inst.components.mightydumbbell:SetEfficiency(
    TUNING.DUMBBELL_EFFICIENCY_LOW,
    TUNING.DUMBBELL_EFFICIENCY_MED,
    TUNING.DUMBBELL_EFFICIENCY_HIGH
)
```

## Dependencies & tags
**Components used:** `finiteuses`, `mightiness`  
**Tags:** Adds `lifting` while a strongman is actively using the dumbbell; checks for `strongman` on users.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `efficiency_wimpy` | number | `TUNING.DUMBBELL_EFFICIENCY_LOW` | Mightiness delta multiplier when user is wimpy. |
| `efficiency_normal` | number | `TUNING.DUMBBELL_EFFICIENCY_LOW` | Mightiness delta multiplier when user is in normal state. |
| `efficiency_mighty` | number | `TUNING.DUMBBELL_EFFICIENCY_LOW` | Mightiness delta multiplier when user is mighty. |
| `strongman` | entity (optional) | `nil` | Reference to the current user (if any) performing a workout. |
| `consumption` | number | `0` | Number of uses consumed per workout call. |

## Main functions
### `CanWorkout(doer)`
* **Description:** Verifies if the given entity (`doer`) is eligible to use the dumbbell. Requires the `strongman` tag and presence of a `mightiness` component.
* **Parameters:** `doer` (Entity) — the entity attempting to use the dumbbell.
* **Returns:** `true` if eligible; `false` otherwise.

### `IsWorkingOut(doer)`
* **Description:** Checks if the given `doer` is the current active user of the dumbbell.
* **Parameters:** `doer` (Entity) — the entity to check.
* **Returns:** `true` if `doer` matches `self.strongman`; `false` otherwise.

### `StartWorkout(doer)`
* **Description:** Begins a workout session for `doer`, setting them as the active user, adding the `lifting` tag to the dumbbell, and recalculating rate scale for their `mightiness`.
* **Parameters:** `doer` (Entity) — the user starting the workout.
* **Returns:** Nothing.

### `StopWorkout(doer)`
* **Description:** Ends the workout for `doer`, removes the `lifting` tag, resets the `mightiness` rate scale to `RATE_SCALE.NEUTRAL`, and clears `self.strongman`.
* **Parameters:** `doer` (Entity) — the user ending the workout.
* **Returns:** Nothing.

### `DoWorkout(doer)`
* **Description:** Applies a mightiness delta based on current efficiency, optionally consumes uses if `finiteuses` is present, and cleans up if depleted.
* **Parameters:** `doer` (Entity) — the user performing the workout.
* **Returns:** `true` if workout completed successfully (or no `finiteuses` component); `false` if uses exhausted and workout stopped.

### `DoAttackWorkout(doer)`
* **Description:** Applies mightiness gain following an attack, using `CheckAttackEfficiency` to determine the delta based on the user’s state and a scaling constant.
* **Parameters:** `doer` (Entity) — the attacker.
* **Returns:** Nothing.

### `SetConsumption(consumption)`
* **Description:** Sets how many uses are deducted per `DoWorkout` call.
* **Parameters:** `consumption` (number) — number of uses to consume.
* **Returns:** Nothing.

### `SetEfficiency(wimpy, normal, mighty)`
* **Description:** Configures the efficiency constants for each mightiness state (used to compute `mightiness:DoDelta` deltas).
* **Parameters:**  
  `wimpy` (number) — efficiency multiplier when user is wimpy.  
  `normal` (number) — efficiency multiplier when user is normal.  
  `mighty` (number) — efficiency multiplier when user is mighty.
* **Returns:** Nothing.

### `CheckEfficiency(doer)`
* **Description:** Returns the active efficiency value for the current user, and updates their `mightiness` rate scale accordingly. Returns `0` if no valid user or `mightiness` component.
* **Parameters:** `doer` (Entity) — must match `self.strongman`.
* **Returns:** One of `DUMBBELL_EFFICIENCY_*` constants (`LOW`, `MED`, or `HIGH`) or `0`.

### `CheckAttackEfficiency(doer)`
* **Description:** Returns the efficiency value that would apply to a given `doer` during an attack, *without* modifying the rate scale.
* **Parameters:** `doer` (Entity) — the attacker.
* **Returns:** One of `DUMMBELL_EFFICIENCY_*` constants or `0`.

## Events & listeners
- **Listens to:** None.  
- **Pushes:** None.  
*(This component does not directly listen for or fire events.)*
