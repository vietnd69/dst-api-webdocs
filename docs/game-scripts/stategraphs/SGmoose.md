---
id: SGmoose
title: Sgmoose
description: Stategraph for the Moose/Moosegoose entity that manages movement, Idle, combat (including disarm), egg-laying, flying, and death animations via state transitions and event handling.
tags: [ai, movement, combat, animation, boss]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: f8e118e4
system_scope: entity
---

# Sgmoose

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGmoose` is the stategraph for the Moosegoose creature in DST. It defines all possible states and transitions—including idle movement (hopping), eating, taunting, gliding, flying away, disarming enemies, and laying eggs—based on entity actions, component states (e.g., health, locomotion), and timeouts. It integrates closely with common state handlers (e.g., `commonstates.lua`) for sleep, freeze, electrocution, death, and combat states. The stategraph drives animations, sound effects, camera shakes, and interaction with components like `combat`, `health`, `inventory`, and `locomotor`.

## Usage example
```lua
-- Stategraph is automatically loaded when the "moose" prefab is instantiated.
-- It is returned via `return StateGraph("moose", states, events, "init", actionhandlers)`
-- and attached to the entity's stategraph system, with no manual instantiation required.

-- Example: Triggering a custom action state from a brain or modder script
if inst.brain then
    inst.brain:PushEvent("doattack", { target = player })
end
```

## Dependencies & tags
**Components used:** `combat`, `entitytracker`, `health`, `inventory`, `knownlocations`, `locomotor`, `playerprox`, `timer`.  
**Tags:** State tags include: `idle`, `canrotate`, `moving`, `hopping`, `busy`, `flight`, `noelectrocute`, `wantstoeat`, `attack`, `hit`, `electrocute`.  
Stategraph also uses common state tags added via `CommonStates.*` calls.

## Properties
No public properties initialized in this file. The stategraph references runtime data through `inst.sg.statemem` for temporary state storage (e.g., `flapSound`, `eggPosition`), but these are internal implementation details, not part of a class-level API.

## Main functions
No standalone public functions are exported. All logic resides inside the returned `StateGraph` structure and its embedded states and event handlers.

## Events & listeners
- **Listens to:**
  - `locomote` – triggers idle vs hop transitions based on movement intent.
  - `doattack` – triggers `attack` or `disarm` state (via `onattackfn`).
  - `flyaway` – initiates `flyaway` state if not dead or busy.
  - `animover`, `animqueueover`, `animqueueover` – transitions to `idle` after animations complete.
  - `ontimeout` – random `preen` or `twitch` transitions.
  - `onupdate` – monitors flight descent, player proximity for layegg, and movement stops.
  - `animqueueover` in `disarm`, `layegg2`, `eat`, `taunt` – returns to `idle`.
  - `attacktimeline`/`deathtimeline` – provided to `CommonStates.AddCombatStates`.
- **Pushes:** Events are not directly pushed by this stategraph itself. Action handlers (`ACTIONS.EAT`, `PICKUP`, `HARVEST`, `PICK`, `LAYEGG`, `GOHOME`) map actions to state transitions via `PerformBufferedAction` or `GoToState`.