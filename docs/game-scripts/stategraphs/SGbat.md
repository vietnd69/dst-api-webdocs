---
id: SGbat
title: Sgbat
description: Defines the state machine for the bat creature, handling flight, idle, eating, taunting, and combat behaviors.
tags: [locomotion, ai, combat, entity]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 0435ab85
system_scope: entity
---

# Sgbat

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGbat` is the state graph for the bat creature in DST, managing its movement (flying), idle behavior, feeding, taunting, combat, and reaction to environmental hazards (freezing, electrocution, death). It leverages shared helper functions from `commonstates.lua` to integrate locomotion, combat, sleep, frozen, electrocution, and corpse handling states. The state graph relies on components including `health`, `combat`, and `inventory`, and uses sound events, animation timelines, and buffered actions to drive behavior.

## Usage example
This state graph is automatically applied when the bat prefab is constructed and instantiated. Modders typically do not interact with it directly; it is managed by the entity's `StateGraph` component. To observe bat behavior changes, modify the state machine via mod overrides:
```lua
local bat_stategraph = require("stategraphs/SGbat")
-- Modify or extend states as needed before the entity is spawned
```

## Dependencies & tags
**Components used:** `health`, `combat`, `inventory`, `soundemitter`, `animstate`, `physics`, `dynamicshadow`, `transform`  
**Tags:** Uses tags `idle`, `canrotate`, `flight`, `busy`, `noelectrocute`, `sleeping`, `dead`. Also references `LandFlyingCreature` and `RaiseFlyingCreature` functions for flight state transitions.

## Properties
No public properties are initialized directly in this file. State memory is stored in `inst.sg.statemem` during state execution (e.g., `chewsounds` in `chew_ground` state).

## Main functions
This file does not define standalone functions — it returns a `StateGraph` definition.

## Events & listeners
- **Listens to:**
  - `"fly_back"` → transitions to `"flyback"` state  
  - `"animover"` → returns to `"idle"` state (from various states)  
  - `"animqueueover"` → ends `"chew_ground"` and proceeds  
  - `"attacked"` → drops all inventory and returns to `"idle"`  
  - `"sleep"` / `"wake"` (via `CommonHandlers`)  
  - `"freeze"` / `"electrocute"` / `"attack"` / `"death"` / `"corpsechomped"` (via `CommonHandlers`)  
  - `"ontimeout"` (from `eat_loop`) → ends eating and proceeds  
- **Pushes:** None directly (relies on shared handlers in `commonstates.lua` to push events like `"dead"`, `"frozen"`, etc.); uses `inst:PerformBufferedAction()` to trigger actions like eat/pickup.