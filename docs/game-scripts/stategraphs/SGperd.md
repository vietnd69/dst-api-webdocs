---
id: SGperd
title: Sgperd
description: Defines the state graph for the Perd creature, managing its movement, combat, and life cycle behaviors.
tags: [ai, stategraph, combat, creature]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: ba2209a2
system_scope: entity
---

# Sgperd

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGperd` is a stategraph that controls the behavior of the Perd creature in DST. It handles state transitions for core actions such as attacking, eating, idle exploration (with gobble animations), hit recovery, death, and movement (walking, running). It integrates with the `combat`, `health`, and `locomotor` components to synchronize visual, audio, and gameplay logic during state changes. It also responds to standard world events (e.g., electrocution, freezing, death) and defines custom action handlers for `GOHOME`, `EAT`, and `PICK`.

## Usage example
```lua
-- Typically registered internally via Prefab file (e.g., perd.lua)
-- Example of instantiating and initializing the stategraph:
local inst = CreateEntity()
inst:AddComponent("stategraph")
inst.components.stategraph:SetStateGraph("perd")
-- Stategraph is automatically activated when the entity is spawned
```

## Dependencies & tags
**Components used:** `combat`, `health`, `locomotor`  
**Tags:** `idle`, `busy`, `attack`, `electrocute`, `sleep`, `frozen`, `death`, `corpse` (via `CommonStates.*` functions and explicit state tags)

## Properties
No public properties defined.

## Main functions
Not applicable — this file defines a `StateGraph` and returns it; no custom functional methods are exposed directly.

## Events & listeners
- **Listens to:**  
  - `animover` — Triggers transition to `idle` after animations complete in `gobble_idle`, `appear`, `attack`, `eat`, and `hit` states.  
  - `doattack` — Initiates the `attack` state if not dead or electrocuted.  
  - `attacked` — Handles hit reaction, electrocution response, and transitions to `hit` state.  
  - `onstep`, `onlocomote`, `onsleep`, `onfreeze`, `onelectrocute`, `ondeath`, `onchomped` — Standard lifecycle and environmental event handlers (via `CommonHandlers`).
- **Pushes:** No events directly. It consumes events and responds via state transitions. Event propagation is handled by the StateGraph engine and connected components.

