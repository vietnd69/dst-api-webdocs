---
id: SGlightflier
title: Sglightflier
description: Manages state transitions and animations for the lightflier creature, handling idle movement, actions, startled reactions, and sleep-related flying behavior.
tags: [ai, locomotion, animation, flying]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 691d65f0
system_scope: entity
---

# Sglightflier

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGlightflier` defines the state machine for the lightflier entity, controlling its movement, actions, and reactions in the game world. It uses the `StateGraph` framework to transition between states such as `idle`, `action`, `startled`, and `go_home`, and integrates with common state helpers for locomotion, combat, sleep, freeze, and electrocution behaviors. Flying-specific logic (e.g., buzz enabling/disabling, liftoff/land transitions) is implemented via helper functions and extended using `CommonStates`.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("lightflier")
inst:AddComponent("stategraph")
inst.components.stategraph:SetStateGraph("SGlightflier")
-- The stategraph activates automatically upon initialization
```

## Dependencies & tags
**Components used:** None directly referenced (uses `inst.Physics`, `inst.AnimState`, `inst.SoundEmitter`, `inst.sg`, and buffered action APIs provided by core engine).
**Tags:** None added/removed by this stategraph itself. State-specific tags include `"idle"`, `"canrotate"` (on `idle`), and `"busy"` (on `startled`, `go_home`).

## Properties
No public properties.

## Main functions
Not applicable.

## Events & listeners
- **Listens to:**
  - `animover` — triggers transition back to `idle` after animation completion in `idle`, `action`, and `startled` states.
  - `startled` — enters the `startled` state unless currently electrocuted.
  - `GOHOME` action (via `ActionHandler`) — initiates the `go_home` state.
  - Common handlers: `OnLocomote`, `OnFreeze`, `OnElectrocute`, `OnAttacked`, `OnDeath`, `OnSleepEx`, `OnWakeEx` (imported from `commonstates.lua`).
- **Pushes:** No events are directly pushed by this stategraph; it relies on external systems to fire events and uses internal transitions via `GoToState`.