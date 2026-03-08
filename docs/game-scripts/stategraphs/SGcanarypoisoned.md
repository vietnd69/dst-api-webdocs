---
id: SGcanarypoisoned
title: Sgcanarypoisoned
description: Manages the animated behavior and transformation sequence of a poisoned canary in DST, including idle loops, hit reactions, explosion, and recovery into a normal canary.
tags: [ai, fx, animation, entity, transformation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: c1f97344
system_scope: entity
---

# Sgcanarypoisoned

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGcanarypoisoned` is a state graph that controls the behavioral transitions of a poisoned canary entity. It handles animation timing, sound playback, physics state management, and conditional state transitions—including recovery back to a normal canary when environmental conditions permit (via `TheWorld.components.birdspawner` present and `TheWorld.components.toadstoolspawner` absent). It integrates with standard DST systems such as fire, loot, and shock/electrocution handling via common states, and supports state-specific logic like explosive death with area-of-effect poisoning.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("poisoned_canary")
inst:AddComponent("health")
inst:AddComponent("burnable")
inst:AddComponent("inventoryitem")
inst:AddComponent("lootdropper")
inst.sg = StateGraph("canarypoisoned", states, events, "idle_loop")
inst.sg:GoToState("dropped")
```

## Dependencies & tags
**Components used:** `health`, `burnable`, `inventoryitem`, `lootdropper`  
**Tags:** `poisoned_canary` (implied via `EXPLODE_MUST_TAGS`), `absorbpoison`, `NOCLICK`, `idle`, `canrotate`, `busy`, `nofreeze`, `noattack`, `nopickup`, `nodeath`, `noelectrocute` (set dynamically per state)  
**World components accessed:** `birdspawner`, `toadstoolspawner`

## Properties
No public properties are defined. State memory (`inst.sg.statemem`) is used internally to track loop count (`loops`) and explosion trigger (`explode`).

## Main functions
None. This file defines a `StateGraph` structure—not a component class—and therefore exports no standalone functions. State behavior is defined via `onenter`, `onupdate`, `onexit`, `timeline`, and `events` tables within each `State`.

## Events & listeners
- **Listens to:**
  - `attacked` — triggers `hit` or `fall` state depending on height and electrocution state.
  - `death` — transitions to `death` state unless `nodeath` tag is active.
  - `animover` / `animqueueover` — used to advance transitions between animations and finalize state changes.
  - Standard freezing/electrocution states from `CommonStates` (added via `CommonStates.AddFrozenStates` and `CommonStates.AddElectrocuteStates`).

- **Pushes:**
  - `poisonburst` — broadcast to all entities within 3 tiles that carry the `absorbpoison` tag during explosion.
  - Uses shared event handlers (e.g., `OnFreeze`, `OnElectrocute`) via `CommonHandlers`, but does not define additional custom events itself.