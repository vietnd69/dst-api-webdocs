---
id: SGcritter_puppy
title: Sgcritter Puppy
description: Defines the state graph and behavioral animations for the Puppy critter, including idle, walk, sleep, eat, and combat-related states.
tags: [ai, stategraph, critter, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 87d646a2
system_scope: entity
---

# Sgcritter Puppy

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGcritter_puppy` is a stategraph definition that configures the animation and behavioral state flow for the Puppy critter entity. It extends shared critter functionality from `SGcritter_common` and `commonstates`, integrating custom emotes, sound triggers, and movement states. This component establishes how the entity transitions between states (e.g., idle, walking, sleeping, eating) and responds to events such as eating or waking.

## Usage example
```lua
-- The stategraph is instantiated automatically for the appropriate prefabs.
-- It is not manually added; the engine loads it when the Puppy entity initializes.
-- It inherits behavior from `SGcritter_common` and `commonstates`.
-- To modify pup-specific behavior, override or extend this stategraph in a mod.
```

## Dependencies & tags
**Components used:** `sound emitter` (`inst.SoundEmitter`) — for playing sounds; `commonstates`, `SGcritter_common` — via `require` for shared states.
**Tags:** None identified.

## Properties
No public properties.

## Main functions
Not applicable.

## Events & listeners
- **Listens to:** `OnEat`, `OnAvoidCombat`, `OnTraitChanged`, `OnSleepEx`, `OnWakeEx`, `OnLocomote`, `OnHop`, `OnSink`, `OnFallInVoid` — all provided via `SGCritterEvents` and `CommonHandlers` in the `events` array.
- **Pushes:** None. Event handlers may respond via side effects (e.g., playing sounds), but no events are explicitly pushed by this stategraph.