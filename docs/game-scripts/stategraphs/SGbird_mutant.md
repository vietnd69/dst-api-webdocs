---
id: SGbird_mutant
title: Sgbird Mutant
description: Manages the behavior state machine for the mutant bird, handling movement, attack, projectile spit, emergence, and transformation states.
tags: [ai, combat, locomotion, stategraph]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: cdfa6238
system_scope: ai
---

# Sgbird Mutant

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGbird_mutant` defines the state machine for the mutant bird entity in DST. It orchestrates movement (e.g., idle, walk, glide), combat behaviors (e.g., attack, spit projectile), and special states (e.g., emerge, death, trapped, stunned). It integrates tightly with `combat`, `locomotor`, `timer`, and `inventoryitem` components to control entity action flow, animation, and physics.

## Usage example
```lua
-- Internally instantiated and returned by the stategraph definition.
-- Typically applied to an entity like so:
local inst = Prefab("bird_mutant")
inst:AddStateGraph("bird_mutant")
-- The stategraph is then automatically activated on entity spawn.
```

## Dependencies & tags
**Components used:** `combat`, `locomotor`, `timer`, `inventoryitem`, `animstate`, `soundemitter`, `physics`, `transform`  
**Tags added/removed:** None directly added or removed by this script. However, states apply temporary state tags such as `"busy"`, `"idle"`, `"moving"`, `"attack"`, `"canrotate"`, `"noattack"`, `"noelectrocute"`.  
**Event listeners:** See Events & listeners section.

## Properties
No public properties. All data is encapsulated within the state machine’s state context (`inst.sg.statemem`) or derived from component references.

## Main functions
Not applicable. This file defines a `StateGraph`, not a component with standalone callable methods. Behavior is triggered by internal state transitions and event handlers.

## Events & listeners
- **Listens to:**
  - `ActionHandler(ACTIONS.TOSS)` — Initiates `shoot` state if not busy.
  - `CommonHandlers.OnLocomote(false, true)` — On movement stop, possibly transitions to `walk_stop`.
  - `CommonHandlers.OnSleep()` — Enters sleep state.
  - `CommonHandlers.OnFreeze()` — Enters frozen state.
  - `CommonHandlers.OnElectrocute()` — Enters electrocution state.
  - `"death"` — Enters `"death"` state.
  - `"arrive"` — Enters `"glide"` state (typically after flying in).
  - `"doattack"` — Enters `"attack"` state if not busy.
  - `"trapped"` — Enters `"trapped"` state.
  - `"locomote"` — Enters `"walk"` if not busy or moving.
  - `"animover"` — Internal state transition on animation completion.

- **Pushes:** None directly. Entity state transitions and components may push events as a result of state logic (e.g., `"droppedtarget"` from `combat:DropTarget()`).