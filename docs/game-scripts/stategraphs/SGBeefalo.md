---
id: SGBeefalo
title: Sgbeefalo
description: Manages the state machine and animation logic for beefalo entities, including movement, grazing, aggression, domestication, and life-cycle transitions.
tags: [ai, animation, entity, locomotion, lifecycle]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: a43b0528
system_scope: entity
---

# Sgbeefalo

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGBeefalo` defines the stategraph for beefalo entities (including baby beefalo), governing their behavior transitions such as idle animation loops, movement, grazing, mating calls, attacks, and stage-specific transitions (e.g., hair growth, domestication, death). It integrates closely with the ECS by responding to events and driving animations, locomotion, and component interactions via `inst.sg:GoToState()` and event callbacks. The stategraph also coordinates with `CommonStates` helpers to standardize shared behaviors (e.g., sleep, electrocution, drowning).

## Usage example
```lua
-- Typically attached via the stategraph system, not manually instantiated.
-- Example usage in a prefab file:
inst:AddComponent("health")
inst:AddComponent("locomotor")
inst:AddComponent("combat")
-- ... other components ...

-- The stategraph is assigned in the prefab definition via:
return StateGraph("beefalo", states, events, "init", actionhandlers)
```

## Dependencies & tags
**Components used:** `health`, `locomotor`, `combat`, `rideable`, `domesticatable`, `hunger`, `growable`, `beard`, `brushable`, `burnable`, `freezable`, `drownable`, `follower`, `sleeper`, `yotb_stagemanager`, `beefalometrics`

**Tags added/removed:** `idle`, `busy`, `canrotate`, `attack`, `moving`, `running`, `sleeping`, `nointerrupt`, `deadcreature`, `give_dolongaction`, `has_beard` — conditionally via `AddTag()`/`RemoveTag()` during state transitions.

## Properties
No public properties are defined in the constructor; all state-specific data is stored on `inst.sg.statemem`.

## Main functions
No direct methods are exported by `SGBeefalo`; it is a pure stategraph definition returned by `StateGraph(...)`. State transitions are invoked internally via event handlers or timeouts, not public API methods.

## Events & listeners
- **Listens to:** `onsink`, `doattack`, `death`, `attacked`, `heardhorn`, `loseloyalty`, `eat`, `refusedrider`, `brushed`, `carratboarded`, `unhitch`, `hitch`, `despawn`, plus all common state helpers (`OnStep`, `OnLocomote`, `OnSleepEx`, `OnWakeEx`, `OnFreeze`, `OnElectrocute`, `OnIpecacPoop`, `OnNoSleepFrameEvent`, `OnNoSleepAnimOver`).
- **Pushes:** Events are not directly pushed by `SGBeefalo`; it responds to events and drives animations. State-specific behavior may trigger component events (e.g., `saddlechanged`, `onwakeup`, `unfreeze`), but those originate in component callbacks.

