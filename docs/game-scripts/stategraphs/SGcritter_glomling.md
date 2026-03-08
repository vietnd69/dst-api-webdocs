---
id: SGcritter_glomling
title: Sgcritter Glomling
description: Defines the state graph for the Glomling creature, managing animations, sounds, and behavior states such as idle, eat, sleep, and combat emotes.
tags: [ai, stategraph, creature, sound, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 5f3f3b22
system_scope: entity
---

# Sgcritter Glomling

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGcritter_glomling` is a state graph for the Glomling entity, encapsulating its behavioral states and associated animation/sound triggers. It builds on shared critter state utilities (`SGcritter_common.lua`) and common game states (`commonstates.lua`) to provide flying-specific logic (e.g., flapping sounds, flying state transitions) and creature-specific interactions (eating, nuzzling, combat, play). This graph defines how the Glomling animates and reacts across key states using time-based events.

## Usage example
```lua
local inst = CreateEntity()
-- Assume inst is a Glomling prefab instance
inst.sg = StateGraphInstance("SGcritter_glomling", inst, inst:GetStateGraph())
inst.sg:GoToState("idle")
inst.sg:Start()
```

## Dependencies & tags
**Components used:** `soundemitter` (via `inst.SoundEmitter`)  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
This file does not define any standalone public functions beyond helper closures and callbacks. It constructs and returns a `StateGraph` instance.

## Events & listeners
- **Listens to:**  
  `SGCritterEvents.OnEat()`  
  `SGCritterEvents.OnAvoidCombat()`  
  `SGCritterEvents.OnTraitChanged()`  
  `CommonHandlers.OnSleepEx()`  
  `CommonHandlers.OnWakeEx()`  
  `CommonHandlers.OnLocomote(false, true)`  
  *(All events imported via `SGCritterEvents` and `CommonHandlers` helpers)*  

- **Pushes:** None identified.