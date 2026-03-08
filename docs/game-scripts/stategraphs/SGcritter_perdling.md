---
id: SGcritter_perdling
title: Sgcritter Perdling
description: Defines the stategraph and behavior for the Perdling critter, handling movement, emotes, eating, and interaction animations.
tags: [ai, critter, animation, sound]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 74a07319
system_scope: entity
---

# Sgcritter Perdling

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGcritter_perdling` is a stategraph that defines the complete animation and behavior logic for the Perdling critter in DST. It inherits foundational state definitions from `SGcritter_common.lua` and `commonstates.lua`, extending them with critter-specific emotes (e.g., wingflap, nuzzle, distress), locomotion states (walk, hop, sink), sleep sequences, and interaction handlers (e.g., eating, play, combat). This file constructs the full finite state machine (FSM) for the Perdling entity’s visual and audible responses to game events.

## Usage example
This stategraph is not instantiated directly by modders. Instead, it is automatically assigned to Perdling prefabs via the engine's stategraph system, typically set in the entity’s `master_postinit` or stategraph configuration.

## Dependencies & tags
**Components used:** None directly referenced (relies on core engine and shared critter stategraph utilities).  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
Not applicable — this file returns a `StateGraph` definition, not a component with standalone functions.

## Events & listeners
- **Listens to:**  
  - `SGCritterEvents.OnEat`  
  - `SGCritterEvents.OnAvoidCombat`  
  - `SGCritterEvents.OnTraitChanged`  
  - `CommonHandlers.OnSleepEx`  
  - `CommonHandlers.OnWakeEx`  
  - `CommonHandlers.OnLocomote` (with `isHopping=true`, `isSwimming=false`)  
  - `CommonHandlers.OnHop`  
  - `CommonHandlers.OnSink`  
  - `CommonHandlers.OnFallInVoid`  

- **Pushes:** None — this stategraph consumes events and transitions between states, but does not define or dispatch custom events itself.

