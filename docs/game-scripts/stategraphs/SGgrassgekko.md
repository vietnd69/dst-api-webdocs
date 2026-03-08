---
id: SGgrassgekko
title: Sggrassgekko
description: Manages the state machine for the Grass Gekko creature, handling locomotion transitions, tail drop mechanics, and integration with common combat and environmental states.
tags: [locomotion, ai, creature, combat, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 04381cd7
system_scope: entity
---

# Sggrassgekko

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGgrassgekko` defines the state graph for the Grass Gekko creature in DST. It orchestrates movement states (`idle`, `walk_start`, `walk`, `walk_stop`, `run_start`, `scare`, `run`, `run_stop`) and integrates with `CommonStates` to support combat (`hittimeline`, `deathtimeline`), sleep, freeze, sink, void fall, electrocution, and corpse handling behaviors. The state graph reacts to locomotion requests (`locomote` event) via the `locomotor` component and manages tail-related logic (e.g., tail loss on `scare`, regrowth timer via `timer` component, and visual state updates).

## Usage example
This state graph is applied automatically when the Grass Gekko prefab is created; it is not instantiated manually by mods. To customize behavior, override the `states` table or extend event handlers in `actionhandlers` and `events`. For example:
```lua
-- Example override in a mod's main.lua (conceptual)
local SGgrassgekko = require "stategraphs/SGgrassgekko"
-- Custom logic can be injected by modifying SGgrassgekko.states or events before returning
```

## Dependencies & tags
**Components used:**  
- `locomotor` — for movement requests and control (`WantsToMoveForward`, `WantsToRun`, `WalkForward`, `RunForward`, `StopMoving`)  
- `lootdropper` — to spawn `cutgrass` when tail is dropped  
- `timer` — to schedule tail regrowth  
**Tags added by states:**  
- `idle`, `moving`, `running`, `canrotate`, `busy`, `noelectrocute`  
**Tags checked via `inst.sg:HasStateTag(...)`:**  
- `idle`, `moving`, `running`

## Properties
No public properties — this is a `StateGraph` definition, not a component class.

## Main functions
Not applicable — this file defines a `StateGraph` structure via a `return` statement; it exposes no standalone functions.

## Events & listeners
- **Listens to:**  
  - `animover` — transitions between animation phases (e.g., `walk_start` → `walk`)  
  - `locomote` — triggers state transitions based on movement intent (`WantsToMoveForward`, `WantsToRun`)  
  - `common` events: `sleep`, `freeze`, `electrocute`, `attacked`, `death`, `sink`, `fallinvoid`, `corpsechomped` (via `CommonHandlers`)  
- **Pushes:**  
  - None directly; all events are handled internally or delegated via `CommonStates` helpers.