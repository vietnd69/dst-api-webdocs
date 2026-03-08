---
id: SGmoonpig
title: Sgmoonpig
description: Controls the behavior state machine for the Werepig character, handling movement, combat, idle, death, and special states like working on Moon Base structures.
tags: [ai, combat, locomotion, death, boss]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 584de6cb
system_scope: ai
---

# Sgmoonpig

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGmoonpig` defines the state graph for the Werepig entity, managing its core gameplay behaviors such as idle, run, attack, howl, and death animations/sequences. It integrates with the ECS by reacting to events (e.g., combat, damage, work requests) and invoking functions on components like `combat`, `locomotor`, `health`, and `lootdropper`. This stategraph is part of the `stategraphs` domain and is used by AI-controlled characters.

## Usage example
```lua
-- The stategraph is registered automatically for the 'moonpig' prefab
-- To spawn or inspect a Werepig's state graph:
local pig = SpawnPrefab("moonpig")
if pig and pig.sg then
    pig.sg:GoToState("howl")
end
```

## Dependencies & tags
**Components used:** `combat`, `health`, `locomotor`, `lootdropper`, `workable`
**Tags added:** `busy`, `idle`, `canrotate`, `moving`, `running`, `attack`, `working`, `noelectrocute`
**Tags checked:** `electrocute`, `busy`, `hiding`

## Properties
No public properties. State memory is stored internally in `inst.sg.statemem`.

## Main functions
This stategraph does not expose public functions beyond those provided by the `StateGraph` engine. It is initialized and managed by the game engine when the `moonpig` entity is instantiated.

## Events & listeners
- **Listens to:**
  - `OnStep` — via `CommonHandlers.OnStep()`
  - `OnLocomote` — via `CommonHandlers.OnLocomote(true, false)`
  - `OnSleep` — via `CommonHandlers.OnSleep()`
  - `OnFreeze` — via `CommonHandlers.OnFreeze()`
  - `OnElectrocute` — via `CommonHandlers.OnElectrocute()`
  - `OnAttack` — via `CommonHandlers.OnAttack()`
  - `OnAttacked` — via `CommonHandlers.OnAttacked()`
  - `OnIpecacPoop` — via `CommonHandlers.OnIpecacPoop()`
  - `death` — triggers `death` state, passes `dead` flag
  - `giveuptarget` — transitions to `howl` if target lost and not electrocuted
  - `newcombattarget` — plays howl or idle sound on acquiring a new target
  - `workmoonbase` — triggers `workmoonbase` state if working on a valid Moon Base
  - `animover`, `animqueueover` — transitions between animation-dependent states
  - `timeout` — in `run` state, loops run animation

- **Pushes:**
  - None — only responds to events; does not fire custom events.
