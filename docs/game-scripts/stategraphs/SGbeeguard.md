---
id: SGbeeguard
title: Sgbeeguard
description: Manages the state transitions and behavior of the Bee Guard enemy, including spawning, idle, movement, combat, hit reaction, and death states.
tags: [ai, combat, boss]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 2a3a1242
system_scope: entity
---

# Sgbeeguard

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGbeeguard` is the state graph for the Bee Guard enemy, defining how the entity transitions between states such as idle, walk, attack, hit, death, spawn-in, and flee. It integrates with core components like `health`, `combat`, and `locomotor`, and relies on common state handlers for sleep, freeze, electrocution, and corpse management. The state graph controls animations, physics behavior, invincibility windows, and sound triggers during key gameplay events.

## Usage example
```lua
-- The state graph is automatically assigned to Bee Guard prefabs via the return statement:
-- return StateGraph("beeguard", states, events, "init")
-- No manual instantiation is required; prefabs using this state graph register it via:
-- inst.StateGraph = SGbeeguard
```

## Dependencies & tags
**Components used:** `health`, `combat`, `locomotor`  
**Tags added by states:** `idle`, `busy`, `nosleep`, `nofreeze`, `noattack`, `noelectrocute`, `canrotate`, `moving`, `flight`, `hit`, `attack`, `caninterrupt`, `NOCLICK`  
**Tags added/removed dynamically:** `NOCLICK` (added on spawn-in, removed upon completion), `caninterrupt` (added during sleep entry, removed during sleep progression)

## Properties
No public properties are initialized in the state graph. State-specific data is stored in `inst.sg.mem` and `inst.sg.statemem`, which are internal to the state machine.

## Main functions
Not applicable (this is a declarative state graph definition, not an imperative class with methods)

## Events & listeners
- **Listens to:**
  - `doattack` — triggers transition to `attack` if not busy or dead.
  - `attacked` — triggers transition to `hit` or cancels interruption based on state tags and health.
  - `flee` — triggers `flyaway` state or queues `wantstoflyaway` if busy.
  - `animover` — triggers next animation-based transitions in `walk_start`, `walk`, `walk_stop`, `hit`, and `attack`.
  - Standard event handlers via `CommonHandlers.OnLocomote`, `OnDeath`, `OnFreeze`, `OnElectrocute`, `OnSleepEx`, `OnWakeEx`, `OnCorpseChomped`, and `OnCorpseDeathAnimOver`.
- **Pushes:**
  - None directly; relies on `inst:PushEvent` calls within event handlers (e.g., via `CommonHandlers` or timeline functions).
  - Invokes `invincibletoggle` event indirectly via `health:SetInvincible()`.
  - Plays sounds and triggers visual FX using `SoundEmitter`, `AnimState`, and `DynamicShadow`.
