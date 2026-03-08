---
id: SGshadowthrall_parasite
title: Sgshadowthrall Parasite
description: Defines the state graph for the ShadowThrall parasite entity, managing its idle and hit animation states and integrating with locomotion control.
tags: [ai, stategraph, parasite]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 4015572e
system_scope: entity
---

# Sgshadowthrall Parasite

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGshadowthrall_parasite` is a state graph definition for the ShadowThrall parasite entity in DST. It establishes two core states — `idle` and `hit` — and integrates with the `locomotor` component to control physical movement during state transitions. The graph inherits common walk/run states via `CommonStates.AddWalkStates` and `CommonStates.AddRunStates`, enabling movement while maintaining animation consistency.

## Usage example
This state graph is not instantiated directly by modders. It is automatically assigned to relevant prefabs via the `StateGraph` return value, and entities using it will automatically respond to animation events and locomotion signals defined within.

```lua
-- Internal use only — state graph is registered and used by the game engine.
-- A prefab using this graph (e.g., "shadowthrall_parasite") will instantiate it automatically:
-- inst:AddComponent("stategraph")
-- inst.components.stategraph:SetStateGraph("shadowthrall_parasite")
```

## Dependencies & tags
**Components used:** `locomotor` (calls `Stop()`, `StopMoving()`)  
**Tags added to states:**  
- `idle` state: `{"idle", "canrotate"}`  
- `hit` state: `{"hit", "busy"}`

## Properties
No public properties. This is a state graph definition, not a component with mutable state.

## Main functions
Not applicable.

## Events & listeners
- **Listens to:** `animover` — triggers state return to `idle` once animation finishes in both `idle` and `hit` states.  
- **Pushes:** No events are explicitly pushed by this state graph. Event handling is deferred to `CommonHandlers` via `events` table, which includes `OnLocomote` and `OnAttacked` (handled externally via `commonstates.lua`).