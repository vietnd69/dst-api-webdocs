---
id: SGwilson_gymstates
title: Sgwilson Gymstates
description: Defines the state machine for Wolfgang’s gym workout sequences, including lift success, failure, and loop states, while interacting with mightiness and gym components.
tags: [player, ai, combat, gym, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 9ac2975c
system_scope: player
---

# Sgwilson Gymstates

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGwilson_gymstates` extends the state graph for Wolfgang (and potentially other strongman characters) with states that govern gym-based workout interactions. It integrates closely with the `strongman`, `mightiness`, `locomotor`, and `mightygym` components to handle animation control, mightiness gain/loss, motion state, and exit logic upon workout completion or interruption. This script does not define a component itself but provides a reusable function to populate state definitions and action handlers into an existing state graph system.

## Usage example
```lua
local GymStates = require "stategraphs/SGwilson_gymstates"
local states = {}
local actionhandlers = {}
local events = {}

GymStates.AddGymStates(states, actionhandlers, events)

-- Then pass states/actionhandlers to the stategraph builder
SGWilson.stategraph = SGStateGraph("SGWilson")
SGWilson.stategraph.states = states
SGWilson.stategraph.actionhandlers = actionhandlers
```

## Dependencies & tags
**Components used:** `locomotor`, `mightiness`, `mightygym`, `strongman`  
**Tags added (per state):**  
- `"gym"`, `"busy"`, `"silentmorph"` in `"workout_gym"`  
- `"busy"` in `"mighty_gym_success_perfect"`, `"mighty_gym_success"`, `"mighty_gym_workout_fail"`

## Properties
No public properties are initialized by this file. It exports a single table `GymStates` with one method.

## Main functions
### `GymStates.AddGymStates(states, actionhandlers, events)`
*   **Description:** Inserts gym-related state definitions and action handlers into the provided state and handler arrays. This function is called during stategraph construction to populate workout-related behavior for Wolfgang.
*   **Parameters:**
    - `states` (table) – The array of state definitions to extend.
    - `actionhandlers` (table) – The array of action handlers to extend.
    - `events` (table) – Reserved for future use; not used in current implementation.
*   **Returns:** Nothing (modifies arrays in-place).

### `getfull(inst)` *(local helper)*
*   **Description:** Returns `"_full"` if the player’s mightiness percentage is at or above `1.0`, otherwise returns an empty string. Used to select appropriate animation suffixes.
*   **Parameters:** `inst` (EntityInst) – The player entity instance.
*   **Returns:** `string` – Either `"_full"` or `""`.

### `exitgym(inst)` *(local helper)*
*   **Description:** Triggers the gym exit sequence by calling `CharacterExitGym` on the associated gym component, if one exists.
*   **Parameters:** `inst` (EntityInst) – The player entity instance.
*   **Returns:** Nothing.

### `State: "workout_gym"`
*   **Description:** Initial transition state when entering the gym. Stops locomotion, plays the pickup animation, and waits briefly before triggering the buffered action.
*   **`onenter`**: Calls `locomotor:Stop()`, plays `"pickup"` animation, sets timeout to `6 * FRAMES`.
*   **`ontimeout`**: Calls `inst:PerformBufferedAction()`.
*   **Tags:** `"gym"`, `"busy"`, `"silentmorph"`.

### `State: "mighty_gym_active_pre"`
*   **Description:** Preparatory animation before beginning the workout loop. Plays based on mightiness level (via `getfull`).
*   **`onenter`**: Plays `"mighty_gym_active_pre"` + suffix. Stores `norestart` flag in `statemem`.
*   **`events.animover`**: Switches to `"mighty_gym_workout_loop"` and sets `dontleavegym = true`.
*   **`onexit`**: Conditionally calls `ResetBell` (unless `norestart`) and calls `exitgym` if `dontleavegym` is `false`.

### `State: "mighty_gym_workout_loop"`
*   **Description:** Main continuous workout loop. Plays looping animation and workout sound. Verifies line of sight to the gym object.
*   **`onenter`**: Checks visibility to gym; if lost, calls `exitgym`. Otherwise plays `"mighty_gym_active_loop"` animation, starts `"workout_LP"` sound, and pushes `gym_bell_start` event.
*   **`events.animover`**: Re-enters `"mighty_gym_workout_loop"` and sets `dontleavegym = true`.
*   **`onexit`**: Calls `exitgym` if `dontleavegym` is `false`.

### `State: "mighty_gym_success_perfect"`
*   **Description:** Handles a perfect gym lift, granting a larger mightiness gain. Plays success animation and sound, then decides whether to exit or resume workout.
*   **`onenter`**: Calls `mightiness:DoDelta(..., true)` with perfect calculation (`CalculateMightiness(true)`), plays `"lift_pre"` and `"mighty_gym_success_big"` animations with dynamic suffixes, plays `"wolfgang2/common/gym/success"` sound, then triggers buffered action.
*   **`events.animqueueover`**: If mightiness is at full capacity (`current >= max + overmax`), calls `exitgym`; otherwise sets `dontleavegym = true` and loops back to `"mighty_gym_workout_loop"`.
*   **`onexit`**: Calls `exitgym` if `dontleavegym` is `false`.
*   **Tags:** `"busy"`.

### `State: "mighty_gym_success"`
*   **Description:** Handles a standard (non-perfect) gym lift, granting a standard mightiness gain.
*   **`onenter`**: Same as `"mighty_gym_success_perfect"` but uses `CalculateMightiness(false)`.
*   **`events.animqueueover`** and **`onexit`**: Same logic as the perfect state.
*   **Tags:** `"busy"`.

### `State: "mighty_gym_workout_fail"`
*   **Description:** Handles a failed gym lift attempt. Plays fail animation, stops workout sound, and returns to pre-loop state after delay.
*   **`onenter`**: Plays `"lift_pre"` and `"mighty_gym_fail"` animations, kills `"workout_LP"` sound, triggers buffered action.
*   **`timeline`**: At `5*FRAMES`, plays `"wolfgang2/common/gym/fail"` sound.
*   **`events.animqueueover`**: Sets `dontleavegym = true` and returns to `"mighty_gym_active_pre"` with `norestart=true`.
*   **`onexit`**: Calls `exitgym` if `dontleavegym` is `false`.
*   **Tags:** `"busy"`.

## Events & listeners
- **Listens to:**  
  - `"animover"` (in `"mighty_gym_active_pre"` and `"mighty_gym_workout_loop"`)  
  - `"animqueueover"` (in `"mighty_gym_success_perfect"`, `"mighty_gym_success"`, `"mighty_gym_workout_fail"`)  
- **Pushes:**  
  - `"gym_bell_start"` (via `player_classified.gym_bell_start:push()`)  
  - `"locomote"` (indirectly, via `locomotor:Stop()`)  
  - `"mightinessdelta"` (indirectly, via `mightiness:DoDelta()`)