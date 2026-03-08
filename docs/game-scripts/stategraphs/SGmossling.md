---
id: SGmossling
title: Sgmossling
description: Manages state transitions and behavioral logic for the Mossling character, including idle, eating, flying, spinning attacks, and death animations.
tags: [ai, animation, combat, locomotion, stategraph]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 2fee850f
system_scope: entity
---

# Sgmossling

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGmossling` is a State Graph (SG) definition that governs the animation and behavior states of the Mossling prefab in Don't Starve Together. It defines how the entity transitions between idle, eating, flying away, spinning in attack mode, hatching, and death states. It integrates with core components like `combat`, `health`, `locomotor`, `burnable`, and `sizetweener` to coordinate actions and animations. The state graph also incorporates common states (e.g., sleep, freeze, electrocute, walk, combat) via `CommonStates` utilities.

## Usage example
```lua
-- This state graph is automatically used by the game when the mossling prefab loads.
-- Modders do not typically instantiate or call this directly.
-- The state graph is referenced in the prefab's definition via:
-- inst.StateGraph = "SGmossling"
```

## Dependencies & tags
**Components used:** `burnable`, `combat`, `health`, `locomotor`, `sizetweener`  
**Tags:** The state graph adds and checks many dynamic state tags including `idle`, `busy`, `moving`, `spinning`, `flight`, `noelectrocute`, `attack`, `wantstoeat`, `canrotate`. Common states also contribute `frozen`, `sleeping`, `dead`, etc.

## Properties
No public properties are initialized directly in this state graph. State memory (`inst.sg.statemem`) is used internally for temporary values (e.g., `strainSound`, `flapSound`, `move`).

## Main functions
No top-level public functions are exported. This file defines a single `StateGraph` instance and returns it.

## Events & listeners
- **Listens to:**  
  - `doattack`, `flyaway`, `locomote` — custom handlers for attack triggering, flight, and movement intent  
  - `animover`, `animqueueover`, `animstart` — animation completion events  
  - `doattack`, `onattacked`, `ondeath` — from `CommonHandlers`  
  - `doattack`, `onattacked`, `ondeath`, `oncorpsechomped` — combined common handlers  
  - `death`, `electrocute`, `freeze`, `sleep`, `wakeup` — via `CommonHandlers.OnSleep()`, `OnFreeze()`, `OnElectrocute()`  
  - `timeout` — used in states like `action`, `spin_pst_loop`  
- **Pushes:**  
  - Events are not directly pushed by this state graph itself; instead, it triggers actions via `inst:PushEvent(...)` internally (e.g., `onextinguish`, `sizetweener_start`) via component callbacks.  
  - The `mossling` prefab may push custom events (e.g., `ms_sendlightningstrike`) via `TheWorld:PushEvent(...)`.  
  - States may push events implicitly through handlers like `LightningStrike` and `ShouldStopSpin`, but no events are directly pushed by this state graph.  
- Note: Common state handlers (`CommonHandlers`) may register listeners and push events, but their behavior is defined elsewhere (`stategraphs/commonstates.lua`).