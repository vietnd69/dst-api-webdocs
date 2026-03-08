---
id: SGpenguin
title: Sgpenguin
description: Manages the state machine behavior for penguin entities, handling locomotion, eating, attacking, death, and seasonal movement animations.
tags: [locomotion, ai, combat, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 57de22eb
system_scope: entity
---

# Sgpenguin

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
The `SGpenguin` state graph defines the behavior logic for penguin entities in DST, implementing state transitions and responses to game events. It integrates closely with the `locomotor`, `combat`, `health`, and `inventory` components to orchestrate walking, running, eating, attacking, flying away, and death states. The state graph also supports seasonal variations (e.g., slide sounds on snow or dirt), common gameplay states (idle, hit, electrocute, frozen), and special events like lunar mutation.

## Usage example
```lua
-- The state graph is automatically used by the "penguin" prefab via:
return StateGraph("penguin", states, events, "init", actionhandlers)
-- It does not need to be instantiated manually by modders.
-- To extend behavior, modders typically subclass this or patch state/event handlers.
```

## Dependencies & tags
**Components used:** `locomotor`, `combat`, `health`, `inventory`  
**Tags:** Adds state tags including `idle`, `moving`, `running`, `attack`, `runningattack`, `busy`, `flight`, `canrotate`, `noelectrocute`, and conditionally `electrocute`/`hit`/`frozen` via `CommonStates`.  
**Action handlers:** `GOHOME`, `WALKTO`, `PICKUP`, `EAT`

## Properties
No public properties. The state graph relies entirely on runtime state stored in `inst.sg.statemem` and `inst.sg.mem`.

## Main functions
The state graph itself is returned by a `StateGraph()` constructor and is not directly invoked. State logic is defined via `onenter`, `ontimeout`, and event handlers in the `states` table.

### State-specific functions (implied via state definitions)
The following state behaviors are implemented as part of the state definitions:
- `idle`: Stops physics and locomotion, plays idle animation and sound.
- `run_start`, `walk_start`, `run_stop`, `walk_stop`: Handle transitions between motion states using `LocoMotor` methods and adjust sound playback.
- `run`, `walk`: Maintain motion, loop animations, and play footstep sounds at timed intervals.
- `eat_pre`, `eat_loop`, `pickup`: Handle food consumption, drop food on attack interruption, and finalize meal tracking (`inst.lastmeal`).
- `migrate`: Initiates walking behavior for migration, skipping slide sounds.
- `death`: Plays death sound, stops physics, removes collision, and drops loot.
- `flyaway`: Activates flight mode by clearing collision, setting motor velocity override, and removing shadow.
- `attack`, `runningattack`: Initiate combat using `Combat:StartAttack()` and `Combat:DoAttack()`.
- `appear`, `landing`: Handle penguin spawning behavior (e.g., water entry animation).
- `taunt`: Plays taunt animation and sound.

## Events & listeners
- **Listens to:**
  - `doattack` – triggers `attack` or `runningattack` state based on current tags and health.
  - `locomote` – manages walking/running start/stop transitions based on `WantsToMoveForward()` and `WantsToRun()`.
  - `flyaway` – enters `flyaway` state if not dead or already in flight.
  - `attacked` during `eat_loop`/`pickup` – drops held food and transitions to `idle`.
  - `animover`, `animqueueover`, `animqueueover` – state transitions on animation completion.
  - `ontimeout` – used in states like `run`, `eat_loop`, `pickup`, and `landing` for scheduled reentries or transitions.
  - `OnStep`, `OnSleep`, `OnElectrocute`, `OnFreeze`, `OnAttacked`, `OnDeath`, `OnCorpseChomped`, and `OnCorpseDeathAnimOver` from `CommonHandlers`.

- **Pushes:**
  - No custom events are pushed by this state graph itself (relies on component events and internal stategraph transitions).
  - Internal events like `locomote`, `dropitem`, and `doattack` are handled but not re-fired.
