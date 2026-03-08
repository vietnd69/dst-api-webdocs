---
id: SGlightcrab
title: Sglightcrab
description: Defines the state machine and animation/sound logic for the light crab entity, handling states like idle, eat, hit, stunned, trapped, and death with sound loop management.
tags: [locomotion, combat, ai, sound, death]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: eca14775
system_scope: entity
---

# Sglightcrab

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGlightcrab` is the stategraph defining the behavioral state machine for the light crab entity. It manages transitions between states such as `idle`, `eat`, `hit`, `stunned`, `trapped`, `death`, and locomotion (walk/run) via the `CommonStates` helper functions. The stategraph integrates with the `health`, `inventoryitem`, `soundemitter`, and `transform` components to control entity behavior, sound looping, and collision. It also defines custom handlers for `trapped` and `stunbomb` events, and integrates corpse-related events and actions.

## Usage example
```lua
-- Automatically applied when the light crab prefab is constructed.
-- The stategraph is returned and registered by the engine.
-- Example instantiation (not directly called by modders):
local inst = Prefab("lightcrab", ...)
inst:AddStateGraph("lightcrab", GetStateGraph("lightcrab"))
```

## Dependencies & tags
**Components used:** `health`, `inventoryitem`, `soundemitter`, `animstate`, `transform`, `physics`, `light`
**Tags:** Adds tags dynamically in states: `idle`, `canrotate`, `busy`, `stunned`, `trapped`, `nointerrupt`, `jumping`, `nosleep`, `noelectrocute`. Also uses `death`, `corpse` tags via `CommonStates`.

## Properties
No public properties are declared in the constructor.

## Main functions
Not applicable — this is a stategraph definition file that returns a `StateGraph` object; it does not define custom class methods. All behavior is expressed through state definitions and `onenter`/`ontimeout`/`events` callbacks.

## Events & listeners
- **Listens to:**
  - `animover` → transitions from idle to idle
  - `animqueueover` → handles eat completion
  - `trapped` → enters `trapped` state if not dead
  - `stunbomb` → enters `stunned` state if not dead
  - `OnSleep`, `OnFreeze`, `OnElectrocute`, `OnAttacked`, `OnDeath`, `OnLocomote`, `OnCorpseChomped`, `OnCorpseDeathAnimOver` (via `CommonHandlers`)
- **Pushes:** No events are pushed by this stategraph itself (modders may listen on `inst` for these events).