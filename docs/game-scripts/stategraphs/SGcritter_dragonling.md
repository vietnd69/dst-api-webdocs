---
id: SGcritter_dragonling
title: Sgcritter Dragonling
description: Defines the state machine and emote behaviors for the dragonling critter, including flight animations, sleep states, combat readiness, and interaction sounds.
tags: [ai, stategraph, creature, sound, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 8a8da055
system_scope: entity
---

# Sgcritter Dragonling

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGcritter_dragonling` is a stategraph responsible for managing the behavioral states and animations of the dragonling critter entity. It builds upon shared critter utilities (`SGcritter_common`) and generic state helpers (`commonstates`) to define idle, emote, combat, sleep, and locomotion behaviors. The stategraph integrates timing events with sound playback and creature posture changes (e.g., flying vs. landed) via helper functions like `LandFlyingCreature`, `RaiseFlyingCreature`, and sound management functions.

## Usage example
This stategraph is not added manually by modders. It is automatically assigned to dragonling prefabs via the game's entity system:
```lua
-- Example internal usage (not modder-facing)
inst.sg = StateGraph("SGcritter_dragonling", ...)
inst.sg:GoToState("idle")
```

## Dependencies & tags
**Components used:** None directly accessed.  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
Not applicable (this file defines a stategraph data structure, not procedural functions.)

## Events & listeners
- **Listens to:** `SGCritterEvents.OnEat`, `SGCritterEvents.OnAvoidCombat`, `SGCritterEvents.OnTraitChanged`, `CommonHandlers.OnSleepEx`, `CommonHandlers.OnWakeEx`, `CommonHandlers.OnLocomote`  
- **Pushes:** None — this file consumes events but does not define event pushes (those happen in referenced stategraph modules).