---
id: SGmonkey
title: Sgmonkey
description: Defines the state machine for monkey entities, handling movement, combat, eating, idle, and interaction behaviors in Don't Starve Together.
tags: [ai, stategraph, creature, combat, locomotion]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: afc48f2b
system_scope: entity
---

# Sgmonkey

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGmonkey` is a stategraph that implements the behavioral state machine for monkey entities. It manages transitions between idle, walking, eating, attacking (melee and ranged), taunting, interacting, sleeping, and death states. It leverages common state helpers (`CommonStates`) for standardized locomotion, combat, freezing, electrocution, and corpse handling, while defining monkey-specific custom states such as `taunt` and `throw`. It interacts with core components: `combat` (for target tracking and attack), `health` (to detect death), and `locomotor` (to stop movement during actions).

## Usage example
```lua
-- Automatically applied via prefab definition (e.g., prefabs/monkey.lua)
-- Example of manual addition in a mod (not typical):
local inst = CreateEntity()
inst:AddStateGraph("monkey")
-- Stategraph is bound at instantiation; do not override manually.
```

## Dependencies & tags
**Components used:** `combat`, `health`, `locomotor`
**Tags added:** `idle`, `canrotate`, `busy`, `attack`, `throwing`
**Tags checked (via `HasStateTag`):** `busy`

## Properties
No public properties.

## Main functions
The stategraph itself is a function call to `StateGraph(...)`, not a class with methods. The `onenter`, `onexit`, `timeline`, and `events` callbacks in states serve as functional entry points.

### `go_to_idle(inst)`
*   **Description:** Utility function to transition the stategraph to the `idle` state.
*   **Parameters:** `inst` (Entity) – The entity instance.
*   **Returns:** Nothing.

### `play_eat(inst)`
*   **Description:** Plays the monkey's eating sound.
*   **Parameters:** `inst` (Entity) – The entity instance.
*   **Returns:** Nothing.

### `play_chest_pound(inst)`
*   **Description:** Plays the monkey's chest-pounding sound, used during the taunt state.
*   **Parameters:** `inst` (Entity) – The entity instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `"animover"` – Triggers transitions after animations complete (e.g., return to `idle`, perform buffered action).
  - `"doattack"` – Determines whether to switch to `attack`, `throw`, or `idle` based on target validity and distance.
  - `"OnLocomote"` – Pauses locomotion handling.
  - `"OnFreeze"` – Handles freezing state.
  - `"OnElectrocute"` – Handles electrocution state.
  - `"OnAttacked"` – Plays hurt sound and animation.
  - `"OnDeath"` – Handles death animation and cleanup.
  - `"OnSleep"` – Enters sleep state.
  - `"OnCorpseChomped"` – Manages corpse behavior.

- **Pushes:**
  - None directly. State transitions are handled internally by the stategraph engine via `GoToState`.
