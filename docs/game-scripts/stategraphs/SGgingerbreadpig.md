---
id: SGgingerbreadpig
title: Sggingerbreadpig
description: Manages the state machine for the Gingerbread Pig entity, handling movement, idle, scared, hit, and death states with associated animations and audio.
tags: [ai, stategraph, creature]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: b5e6811e
system_scope: entity
---

# Sggingerbreadpig

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGgingerbreadpig` defines the stategraph for the Gingerbread Pig, a festive seasonal creature. It orchestrates transitions between idle, scared, hit, and death states based on internal logic and external events (e.g., player proximity, damage, death). It leverages `CommonStates` to inherit standard locomotion, freezing, and sleep behaviors, and integrates with core components such as `health`, `locomotor`, and `lootdropper` to react to game events.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("gingerbreadpig")
inst:AddComponent("health")
inst:AddComponent("locomotor")
inst:AddComponent("lootdropper")
-- Stategraph is assigned automatically when the prefab is instantiated
-- via the StateGraph system, not directly via inst:AddStateGraph()
```

## Dependencies & tags
**Components used:** `health`, `locomotor`, `lootdropper`
**Tags:** `gingerbreadpig` (inferred from StateGraph name), `busy`, `idle` (state tags)
**External references:** `commonstates.lua`, `ACTIONS.GOHOME`, `ACTIONS.PICK`

## Properties
No public properties are defined in the constructor. The stategraph is configured entirely via state definitions, event handlers, and action handlers.

## Main functions
Not applicable. This file returns a pre-constructed `StateGraph` object. It does not expose callable methods or functions directly.

## Events & listeners
- **Listens to:**  
  - `animover` – transitions from `idle`, `scared`, and `hit` states back to `idle` when animations complete.  
  - `attacked` – triggers `hit` state if the entity is alive and not transforming.  
  - `death` – triggers `death` state.  
  - `onplayernear` – triggers `scared` state when a player approaches.  
  - `OnStep`, `OnLocomote`, `OnSleep`, `OnFreeze` – inherited from `CommonHandlers`.  
- **Pushes:** No events are explicitly pushed by this stategraph. It relies on component events (`attacked`, `death`) and internal animations for coordination.