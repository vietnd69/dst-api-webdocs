---
id: SGtallbird
title: Sgtallbird
description: Manages the state machine and behavior logic for the Tallbird entity, including movement, idle animations, combat, nesting, and life cycle transitions.
tags: [ai, entity, stategraph, boss]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 8c4dbf0c
system_scope: entity
---

# Sgtallbird

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGtallbird` defines the full state graph for the Tallbird entity, implementing its core behavioral patterns such as idling, taunting, attacking, laying eggs, building nests, sleeping, and maturing from juvenile to adult. It integrates with multiple components (`combat`, `health`, `locomotor`, `sleeper`, `talker`) to coordinate animations, sounds, combat actions, and transitions between states. The state graph uses common state helpers (`CommonStates`) to handle shared behaviors like walking, sleeping, freezing, and electrocution.

## Usage example
This state graph is not manually instantiated by modders; it is automatically applied to the Tallbird prefab via the engine. Modders typically interact with it indirectly by modifying behavior through components or event handlers.

```lua
-- Modders can influence Tallbird behavior by listening to its events or overriding userfunctions
inst:ListenForEvent("doattack", function(inst)
    -- Custom logic when Tallbird is about to attack
end)
```

## Dependencies & tags
**Components used:** `combat`, `health`, `locomotor`, `sleeper`, `talker`  
**Tags:** Uses and checks the following state tags: `busy`, `idle`, `canrotate`, `attack`, `hit`, `nosleep`, `noelectrocute`. Also uses entity tags like `teenbird`, `peck_attack`.

## Properties
No public properties. The state graph relies on `inst.sg.statemem` for transient state-specific data (e.g., `made_new_home`) and `inst.userfunctions` for game logic hooks.

## Main functions
This file returns a `StateGraph` instance and does not define public methods. All functional logic is embedded in state definitions and event handlers.

### StateGraph constructor (internal)
*   **Description:** Constructs and returns a new `StateGraph` named `"tallbird"` using the defined states, events, initial state `"init"`, and action handlers.
*   **Parameters:** None (parameters are passed implicitly during construction: `name`, `states`, `events`, `startstate`, `actionhandlers`).
*   **Returns:** `StateGraph` — used internally by the game engine to drive Tallbird behavior.
*   **Error states:** None; construction is assumed always successful.

## Events & listeners
- **Listens to:**
  - `doattack` — triggers `attack` or `peck` state based on tags and combat state.
  - `makenewnest` — triggers `makenest` state to build a new home and sleep.
  - `animover`, `animqueueover` — transitions from animation-heavy states (`idle_blink`, `idle_peep`, `attack`, etc.) back to `idle`.
  - `gotosleep`, `wakeup` — handled via `CommonHandlers` integration.
  - `OnAttacked`, `OnDeath`, `OnFreeze`, `OnElectrocute`, `OnCorpseChomped`, `OnLocomote` — handled by `CommonHandlers`.
- **Pushes:** None directly. Delegates to common event handlers and state transitions (`GoToState`, `PerformBufferedAction`).
