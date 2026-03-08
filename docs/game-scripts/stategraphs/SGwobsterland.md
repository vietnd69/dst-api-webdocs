---
id: SGwobsterland
title: Sgwobsterland
description: Defines the state machine behavior for the Wobster creature on land, handling movement states (idle, run, hop), combat states (hit, stunned), and death transitions.
tags: [ai, locomotion, combat, stategraph, creature]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 46240f8d
system_scope: ai
---

# Sgwobsterland

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGwobsterland` is a state graph that controls the behavior of the Wobster entity while on land. It implements a finite state machine (FSM) managing animations, physics, and sound cues for states such as `idle`, `run`, `hop`, `hit`, `stunned`, and `death`. The state graph integrates closely with the `locomotor`, `health`, `inventoryitem`, `lootdropper`, and `animstate` components, and inherits common states from `stategraphs/commonstates.lua`.

## Usage example
This state graph is instantiated automatically for the `wobster` prefab and is not added manually by modders. The game engine loads it as part of the prefab definition using:

```lua
return StateGraph("wobster_land", states, events, "idle")
```

To customize behavior, modders should override the `wobster` prefab or use `inst.sg:GoToState("newstate")` in custom prefabs if reusing this graph.

## Dependencies & tags
**Components used:**  
- `health` (`IsDead`)  
- `locomotor` (`Stop`, `StopMoving`)  
- `inventoryitem` (`canbepickedup`)  
- `lootdropper` (`DropLoot`)  

**Tags added/checked:**  
- States use tags: `busy`, `stunned`, `autopredict`, `doing`, `jumping`, `nointerrupt`, `nomorph`, `nosleep`, `caninterrupt`, `frozen`  
- Entity tags managed: `ignorewalkableplatforms` (added/removed during hop)

## Properties
No public properties — this is a state graph definition returning a `StateGraph` object. All mutable data is stored in `inst.sg.statemem` and component-owned values.

## Main functions
Not applicable — this file defines a `StateGraph` (a declarative data structure), not a component class. Core behavior is expressed via the `states` and `events` tables.

## Events & listeners
- **Listens to:**
  - `onsleep`, `onwake` (via `CommonHandlers.OnSleepEx()` / `OnWakeEx()`)
  - `onfreeze`, `onelectrocute` (via `CommonHandlers.OnFreezeEx()` / `OnElectrocute()`)
  - `attacked` — triggers `hit` state unless busy and not interruptible
  - `ondeath` (via `CommonHandlers.OnDeath()`)
  - `locomote` (via `CommonHandlers.OnLocomote(true, false)`)
  - `onhop` — initiates hop to specified location or returns to idle
  - `stunbomb` — forces `stunned` state

- **Pushes:**
  - No direct `PushEvent` calls; relies on `StateGraph`-internal event propagation (`ontimeout`, `onupdate`, `animover`).
