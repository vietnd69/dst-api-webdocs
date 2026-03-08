---
id: SGcritter_kitten
title: Sgcritter Kitten
description: Defines the state graph for the kitten critter, orchestrating its idle behavior, emotes, locomotion, and combat interactions through state transitions and sound timelines.
tags: [ai, creature, animation, sound]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 78661c00
system_scope: entity
---

# Sgcritter Kitten

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGcritter_kitten` is a stategraph responsible for managing the behavior and animations of the kitten critter entity in Don't Starve Together. It inherits reusable state definitions from `SGcritter_common.lua` and `commonstates.lua`, configuring idle, emote, eat, sleep, hop, sink, and void-fall states with associated sound events. The graph returns a fully constructed `StateGraph` instance targeting the `idle` state as default, with no custom logic beyond the state composition and event handling setup.

## Usage example
```lua
-- The kitten entity implicitly uses this stategraph via its prefab definition.
-- No direct instantiation is required in mod code.
-- Stategraph is referenced internally by the engine and entity state management system.
```

## Dependencies & tags
**Components used:** `soundEmitter` — used via `inst.SoundEmitter:PlaySound(...)`.
**Tags:** None identified.

## Properties
No public properties.

## Main functions
This file does not define any public functions; it only assembles and returns a `StateGraph` instance. All state definitions are provided via calls to `SGCritterStates.*` and `CommonStates.*` helper functions imported from referenced modules.

## Events & listeners
- **Listens to:**  
  `SGCritterEvents.OnEat()`, `SGCritterEvents.OnAvoidCombat()`, `SGCritterEvents.OnTraitChanged()`, `CommonHandlers.OnSleepEx()`, `CommonHandlers.OnWakeEx()`, `CommonHandlers.OnLocomote(false,true)`, `CommonHandlers.OnHop()`, `CommonHandlers.OnSink()`, `CommonHandlers.OnFallInVoid()`  
  (These events are passed to the `StateGraph` constructor as part of the `events` table.)
- **Pushes:**  
  No events are explicitly pushed by this stategraph. Event emission occurs via internal state transitions defined in imported helpers.