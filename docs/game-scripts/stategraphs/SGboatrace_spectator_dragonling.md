---
id: SGboatrace_spectator_dragonling
title: Sgboatrace Spectator Dragonling
description: Defines the state machine for a spectator dragonling entity during boat races, handling emotes, flight animations, and timed self-removal.
tags: [ai, animation, sound, locomotion]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 9bf2700b
system_scope: entity
---

# Sgboatrace Spectator Dragonling

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGboatrace_spectator_dragonling` is a `StateGraph` definition that controls the behavioral states of a dragonling entity acting as a spectator in boat races. It supports emote sequences (e.g., blinking, swiping, distress), transition to and from flight motion (including timed removal), and integration with the `LocoMotor` component to halt movement during animated sequences. It relies on `CommonStates` to provide base `idle` and `walk` states and uses `ocean_util` for context, though no direct utility functions are invoked.

## Usage example
This stategraph is automatically assigned to a dragonling entity during boat race scenarios by the game's logic (e.g., via `inst.sg = StateGraph("SGboatrace_spectator_dragonling", ...)`). Modders should not manually instantiate or modify it directly.

## Dependencies & tags
**Components used:** `locomotor` (via `inst.components.locomotor:StopMoving()`)
**Tags:** The stategraph adds tags (`busy`, `flight`, `nosleep`, `nofreeze`) per state; does not add or remove entity-wide tags.

## Properties
No public properties defined. The stategraph is a pure configuration object; no runtime state is stored beyond the `StateGraph` internals.

## Main functions
### `State { name = "emote_checkpoint" }`
*   **Description:** Plays a cute emote animation with timed sound events (blinks and swipe), then returns to `idle` when the animation completes. The entity is marked as `busy` and cannot move during this state.
*   **Parameters:** None — this is a state definition, executed automatically by the `StateGraph` engine.
*   **Returns:** Nothing.
*   **Error states:** None identified; assumes `inst.components.locomotor` and `inst.AnimState` are present.

### `State { name = "emote_collision" }`
*   **Description:** Plays a distress animation with timed angry sounds, then returns to `idle`. Used to indicate the dragonling has been bumped or collided. Marked `busy`.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None identified.

### `State { name = "fly_away_pre" }`
*   **Description:** Plays an emote_flame animation (pre-flight) with blink and emote sounds, then transitions to `fly_away` on animation completion.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None identified.

### `State { name = "fly_away" }`
*   **Description:** Initiates upward flight using a hardcoded motor velocity, removes the entity 3.5 seconds later, and ensures removal on state exit. Tags include `flight`, `busy`, `nosleep`, and `nofreeze`.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** The entity is unconditionally removed (`inst:Remove()`) on timeout or exit.

### `State { name = "fly_in" }`
*   **Description:** Handles entry flight with a downward override velocity; resets to `idle` if the entity descends to or below `y = 1` or falls asleep. Clears motor velocity override on exit.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Ensures `y` is clamped to `0` on exit to prevent floating incorrectly.

### `CommonStates.AddIdle(states)`
*   **Description:** Adds standard `idle` state to the `states` array (inherited from `commonstates.lua`).
*   **Parameters:** `states` (table) — the array of states being built.
*   **Returns:** Nothing.

### `CommonStates.AddWalkStates(states, nil, nil, true)`
*   **Description:** Adds standard walk-related states (`walk`, `startrun`, `stoprun`, `run`) to the `states` array. The final `true` argument typically enables flight-compatible walk behavior.
*   **Parameters:** `states` (table) — the array of states; `nil, nil` indicate unused overrides; `true` enables flight mode.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` (via `EventHandler`) — triggers transition from emote states to `idle` or `fly_away`.
- **Pushes:** None — the stategraph does not fire custom events.

None.