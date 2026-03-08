---
id: SGsharkboi_water
title: Sgsharkboi Water
description: Manages water-based locomotion states for a shark-like entity, handling swimming, walking, and running animations with sound and wake effects.
tags: [locomotion, animation, sound, fx]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 73c4a505
system_scope: locomotion
---

# Sgsharkboi Water

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
This stategraph (`SGsharkboi_water`) defines the swimming and movement state machine for a shark-like entity. It integrates with the `locomotor` component to respond to movement commands and drive state transitions between idle, walk, run, and their transition states (`_start`/`_stop`). It manages animation playback, sound effects (via `splash/jump_small`), and periodic wake particle effects (`wake_small`) during running.

The stategraph listens to the `locomote` event — dispatched by the `locomotor` component — and evaluates movement flags (`WantsToMoveForward`, `WantsToRun`) to transition appropriately between states. It also uses soft-stop logic (with the `softstop` state tag) to allow rotation while stopping.

## Usage example
```lua
local inst = CreateEntity()
-- Assume inst is configured with a Transform, AnimState, and LocoMotor components
inst.StateGraph = inst:AddStateGraph("sharkboi_water", true)
inst.sg:GoToState("idle")
-- Movement is triggered externally via the locomotor component:
inst.components.locomotor:WalkForward(true)
```

## Dependencies & tags
**Components used:** `locomotor` — accessed via `inst.components.locomotor` to query movement flags, control velocity, stop, and set `pusheventwithdirection`.
**Tags:** States emit and consume the following state tags: `idle`, `moving`, `running`, `canrotate`, `softstop`. States `walk_start`, `walk`, `run_start`, and `run` add `moving`/`softstop` or `running` as appropriate; transitions preserve or clear these based on context.

## Properties
No public properties are initialized in this stategraph. State memory (`inst.sg.statemem`) is used internally for transient values like `stop`, `speedmult`, and `waketask`.

## Main functions
Stategraphs in DST do not expose public methods. Functions are defined locally (e.g., `PlaySwimstep`, `DoWakeFX`) and referenced in state handlers. No callable API methods exist for external modders.

## Events & listeners
- **Listens to:** `locomote` — triggers state re-evaluation based on movement intent (`WantsToMoveForward`, `WantsToRun`), soft-stop handling, and transitions between walk/run/idle states.
- **Pushes:** None — this stategraph does not fire custom events.
- **Internal event usage:** `animover` (via `FrameEvent`) drives transitions from transition states (`walk_start`, `walk_stop`, `run_stop`) to stable states or idle.
- **Timeout handling:** States `walk` and `run` use `ontimeout` to loop their animations or requeue with persisted tasks (e.g., wake effect tasks).