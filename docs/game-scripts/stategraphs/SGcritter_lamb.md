---
id: SGcritter_lamb
title: Sgcritter Lamb
description: Defines the state graph and behavioral logic for the lamb critter, including movement, idle, eating, sleeping, emotes, and sound playback.
tags: [ai, stategraph, critter, animation, sound]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: e6fc0881
system_scope: entity
---

# Sgcritter Lamb

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGcritter_lamb` is a state graph definition for the lamb critter entity. It aggregates reusable state machine patterns from `SGcritter_common.lua` and `commonstates.lua` to implement core critter behaviors such as idle, walking, eating, sleeping, emoting, and reacting to falling or sinking. The graph is built by calling helper functions that populate a `states` table and specifying event handlers and actions.

## Usage example
```lua
local inst = CreateEntity()
-- Attach the stategraph component (handled internally by the prefab)
inst.sg = StateGraph("SGcritter_lamb", states, events, "idle", actionhandlers)
-- The lamb entity uses this graph to transition between states like idle, walk, eat, sleep, etc.
```

## Dependencies & tags
**Components used:** None directly (relies on shared stategraph helpers and `inst.SoundEmitter`).
**Tags:** None identified.

## Properties
No public properties.

## Main functions
This file does not define custom main functions; it configures the stategraph via helper calls.

## Events & listeners
- **Listens to:** Events defined by `SGCritterEvents.OnEat()`, `SGCritterEvents.OnAvoidCombat()`, `SGCritterEvents.OnTraitChanged()`, `CommonHandlers.OnSleepEx()`, `CommonHandlers.OnWakeEx()`, `CommonHandlers.OnLocomote(false,true)`, `CommonHandlers.OnHop()`, `CommonHandlers.OnSink()`, and `CommonHandlers.OnFallInVoid()`.  
- **Pushes:** None directly; events are handled internally by the stategraph framework.