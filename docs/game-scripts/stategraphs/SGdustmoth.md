---
id: SGdustmoth
title: Sgdustmoth
description: Defines the state machine for the dust moth entity, handling idle, interaction (e.g., dusting, repair), and environmental response states.
tags: [ai, locomotion, fx, sound, entity]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 80cbe35c
system_scope: entity
---

# Sgdustmoth

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGdustmoth` is a stategraph that governs the behavior of the dust moth entity in DST. It manages a range of states—from idle and walking to specialized actions like dusting dustable objects and repairing dens. The stategraph integrates with common state utilities (`CommonStates`) to handle standard conditions (e.g., freezing, electrocution, death) and uses custom event handlers to respond to game events (e.g., `dustmothsearch`, `onrefuseitem`). It interacts with the `locomotor` component for movement and heavily relies on sound playback and animation sequencing via the `SoundEmitter` and `AnimState` components.

## Usage example
```lua
-- The stategraph is not manually instantiated. It is referenced by the dust moth prefab:
return StateGraph("dustmoth", states, events, "init", actionhandlers)
```
> This stategraph is automatically loaded and applied to entities using the `"dustmoth"` stategraph name in their prefab definition.

## Dependencies & tags
**Components used:** `locomotor` (via `inst.components.locomotor:WalkForward()`).  
**Tags:** States use state tags including `idle`, `canrotate`, `busy`, and `dusting`. Entity-level tag `dustable` is added/removed dynamically.

## Properties
No public properties are defined in this stategraph. All state data is stored in `inst.sg.statemem` (e.g., `loop_count`, `sound_task1`) for transient state-specific use.

## Main functions
This file does not define custom stategraph methods. It declares and returns a `StateGraph` object using the `StateGraph()` constructor. All behavior is embedded in state definitions (`State` blocks), their handlers (`onenter`, `onupdate`, `onexit`, `timeline`, `events`), and common utilities imported from `commonstates.lua`.

## Events & listeners
- **Listens to:**  
  `animover`, `animqueueover`, `dustmothsearch`, `onrefuseitem`, and all handlers from `CommonHandlers` (`OnLocomote`, `OnFreeze`, `OnElectrocute`, `OnAttacked`, `OnSleep`, `OnDeath`, `OnCorpseChomped`).
- **Pushes:**  
  None directly. Event handlers may transition states, which can indirectly trigger callbacks or listener invocations elsewhere. The `dustmothden_repaired` event is *received* from external sources to exit repair states.

