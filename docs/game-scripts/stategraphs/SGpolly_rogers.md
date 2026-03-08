---
id: SGpolly_rogers
title: Sgpolly Rogers
description: Stategraph defining the animation, movement, and behavioral logic for the Polly Rogers NPC entity, including ground idle states, flight transitions, death, and electrocute responses.
tags: [locomotion, animation, ai, npc, death]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 134163c5
system_scope: entity
---

# Sgpolly Rogers

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGpolly_rogers` is the stategraph that governs the behavior of the Polly Rogers NPC, an avian enemy. It manages transitions between grounded idle actions (e.g., peck, caw, hop, switch), flight states (takeoff, glide, flyaway), movement (walk start, walk, walk stop), and reactive states (hit, death, electrocute). It integrates closely with the `health`, `locomotor`, `floater`, and `inventory` components, and leverages common stategraph utilities from `commonstates.lua`.

## Usage example
```lua
local inst = CreateEntity()
-- ... setup entity and components ...
inst:AddStateGraph("polly_rogers")
-- The stategraph is automatically initialized when inst is spawned with the correct prefabs,
-- and transitions are triggered by events like "attacked", "locomote", and "flyaway".
```

## Dependencies & tags
**Components used:** `health`, `locomotor`, `floater`, `inventory`, `inventoryitem`, `spawner`  
**Tags added:** `flying`, `NOCLICK`, `busy`, `idle`, `ground`, `moving`, `canrotate`, `flight`, `notarget`, `flyaway`, `noelectrocute`, `hopping`, `nointerrupt`  
**Tags removed:** `flying`, `NOCLICK` (on state exit under specific conditions)

## Properties
No public properties — this is a stategraph definition file, not a component with instantiated properties.

## Main functions
Not applicable — this file defines a `StateGraph` via `return StateGraph(...)`, not a component with callable methods.

## Events & listeners
- **Listens to:**  
  - `attacked` — triggers `hit` state or electrocute handling  
  - `flyaway` — initiates `flyaway` state if not dead  
  - `locomote` — synchronizes movement state (`walk_start`, `walk_stop`) with `locomotor` flags  
  - `despawn` — transitions to `despawn` state if not dead  
  - `animover` — used in many states to detect animation completion  
  - `on_landed`, `on_no_longer_landed` — sent via `floater`/`inventoryitem` components  
  - Common events via `CommonHandlers.OnSleep()`, `OnFreeze()`, `OnElectrocute()`, `OnDeath()`, `OnCorpseChomped()`, `OnCorpseDeathAnimOver()`
  
- **Pushes:**  
  - Events triggered internally via `inst:PushEvent(...)`: `on_landed`, `on_no_longer_landed`, `gohomefailed` (via spawner)  
  - `locomote` — pushed by `locomotor:Stop()` when stopping movement  
  - Custom state-specific events may be fired via `inst.sg:GoToState(...)` and internal logic