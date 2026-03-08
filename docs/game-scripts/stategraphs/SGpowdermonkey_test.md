---
id: SGpowdermonkey_test
title: Sgpowdermonkey Test
description: Defines the state graph and AI behavior for a test version of the Powder Monkey character, handling movement, combat, idle animations, and interaction states.
tags: [ai, stategraph, combat, animation, entity]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 5613d23e
system_scope: entity
---

# Sgpowdermonkey Test

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGpowdermonkey_test` is a state graph that defines the animation and behavioral logic for the Powder Monkey character (or a test variant). It orchestrates transitions between states such as `idle`, `action`, `eat`, `taunt`, and `throw`, and integrates with `CommonStates` utilities for walking, sleeping, and combat animations. The state graph listens for events like `doattack`, `animover`, and common gameplay events (e.g., death, freeze) to drive state transitions, and it coordinates interactions with the `combat`, `health`, and `locomotor` components.

## Usage example
```lua
-- This stategraph is typically loaded automatically for a prefab by the engine.
-- It is registered via `return StateGraph("powdermonkey_test", states, events, "idle", actionhandlers)` at the bottom.
-- No manual instantiation is required; the engine uses the name "powdermonkey_test" to resolve and attach this state graph.
```

## Dependencies & tags
**Components used:** `combat`, `health`, `locomotor`
**Tags:** States add the following tags: `idle`, `canrotate`, `busy`, `attack`, `throwing`. The `idle` state is the initial state.

## Properties
No public properties defined.

## Main functions
### `StateGraph("powdermonkey_test", states, events, "idle", actionhandlers)`
*   **Description:** Constructs and returns the finalized state graph named `"powdermonkey_test"` using the defined `states`, `events`, `actionhandlers`, and `"idle"` as the initial state. This is the constructor call at module load time—not a runtime function—but it is the core output of the file.
*   **Parameters:**  
    - `states`: Array of state definitions (e.g., `idle`, `throw`, `eat`).  
    - `events`: Array of event handlers, including `CommonHandlers.*` utilities and a custom `doattack` handler.  
    - `"idle"`: The starting state name.  
    - `actionhandlers`: Array of `ActionHandler` mappings linking game actions (e.g., `ACTIONS.ATTACK`) to state names (e.g., `"throw"`).
*   **Returns:** A `StateGraph` object used by the game engine to manage state transitions for entities.
*   **Error states:** None documented; relies on correct definition of `states`, `events`, and `actionhandlers`.

## Events & listeners
- **Listens to:**  
  - `animover` (per state) – triggers state transitions upon animation completion.  
  - `doattack` (global) – determines whether to use `attack` or `throw` state based on target distance and validity.  
  - `OnLocomote`, `OnFreeze`, `OnAttacked`, `OnDeath`, `OnHop`, `OnSink`, `OnFallInVoid`, `OnSleep` (via `CommonHandlers.*` wrappers).  
- **Pushes:** None identified — this state graph does not define custom events, only responds to them.