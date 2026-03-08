---
id: SGmighty_gym
title: Sgmighty Gym
description: Defines the state machine for the Mighty Gym prop's animation and interaction logic.
tags: [animation, prop, entity]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: e6305108
system_scope: entity
---

# Sgmighty Gym

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGmighty_gym` is a stategraph component that defines the animation states and transitions for the Mighty Gym entity. It manages visual feedback during user interactions (e.g., hitting the gym, placing weights, active workout) by switching between `idle`, `hit`, `place_weight`, and `workout_pst` states. The stategraph is self-contained and does not depend on other components.

## Usage example
This stategraph is not meant to be manually instantiated. It is automatically assigned to the Mighty Gym prefab (`prefabs/mighty_gym.lua`) via the engine's stategraph system when the entity is spawned.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
### `State{name="idle", ...}`
*   **Description:** The default resting state. Sets the animation to `"idle_empty"` and loops it.
*   **Parameters:** None (state block).
*   **Returns:** Nothing — this is a state definition, not a runtime function.

### `State{name="hit", ...}`
*   **Description:** Triggered when the gym is struck. Plays `"hit_loaded"` animation and transitions back to `idle` upon animation completion.
*   **Parameters:** None (state block).
*   **Returns:** Nothing.

### `State{name="place_weight", ...}`
*   **Description:** Triggered when a weight is added. Plays an animation named `"place_X"` where `X` is `data.slot`, then returns to `idle`.
*   **Parameters:** `data` (table, optional) — expected to contain `slot` field used to construct animation name.
*   **Returns:** Nothing.

### `State{name="workout_pst", ...}`
*   **Description:** Plays active workout animation (`"active_pst"` or `"active_pst_full"` depending on `data`). Stops looping workout sound, then returns to `idle` after animation ends.
*   **Parameters:** `data` (any) — if truthy and `>= 1`, `"active_pst_full"` is used; otherwise `"active_pst"` is used.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** 
  - `animover` (global) — handled in each state to transition back to `idle` when animation finishes.