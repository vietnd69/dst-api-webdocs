---
id: SGspiderqueen
title: Sgspiderqueen
description: Manages the state machine for the Spider Queen entity, controlling its behaviors such as idle, attack, hit, birth, and nest production.
tags: [ai, boss, combat, locomotion, production]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 3f8ce0ef
system_scope: entity
---

# Sgspiderqueen

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGspiderqueen` defines the state graph for the Spider Queen boss entity in Don't Starve Together. It orchestrates all behavioral states including idle, attack, being hit, birthing spiders, producing spider dens, dying, and reacting to environmental hazards (freezing, electrocution, sinking). The state graph integrates with standard state handlers (via `CommonStates`) and relies on core components such as `combat`, `health`, `locomotor`, and `incrementalproducer` to coordinate animations, sound, logic, and replication.

## Usage example
This file defines a state graph and is not added directly to entities at runtime. Instead, prefabs like `"spiderqueen"` attach it as their state graph via `inst:AddStateGraph("spiderqueen", StateGraph(...))`. Modders typically extend or override it by:
- Requiring this file (`require("stategraphs/SGspiderqueen")`)
- Modifying its `states` or `events` table before returning a new `StateGraph`
Example minimal usage pattern:
```lua
local SGspiderqueen = require("stategraphs/SGspiderqueen")
-- Create a custom variation (e.g., replace idle behavior)
local states = SGspiderqueen.states
states.idle.onenter = function(inst, playanim)
    -- Custom idle behavior
end
return StateGraph("spiderqueen_custom", states, SGspiderqueen.events, "init")
```

## Dependencies & tags
**Components used:** `combat`, `health`, `locomotor`, `incrementalproducer`  
**Tags added per state:** `idle`, `canrotate`, `attack`, `busy`, `hit`, `nointerrupt`  
**Tags checked via `HasAnyStateTag` or `HasStateTag`:** `nointerrupt`, `attack`, `electrocute`, `hit`, `busy`, `softstop` (via `locomotor`)

## Properties
No public properties are defined in this file; it returns a `StateGraph` instance.

## Main functions
This file does not define any standalone functions beyond the constructor pattern (which is implicit via `StateGraph`). All logic is expressed within `onenter`, `timeline`, and `events` closures for each state.

## Events & listeners
- **Listens to:**
  - `attacked`: Triggers hit recovery or `hit` state unless interrupted or dead.
  - `doattack`: Attempts to transition to `attack` state if not busy or electrocuted.
  - `animover`: Triggers transition to next state (e.g., `idle`) upon animation completion in most states.
  - `sleep`, `wake`, `freeze`, `electrocute`, `sink`, `fallvoid`, `death`, `corpsechomped`: Handled by `CommonHandlers` included via `commonstates.lua`.
- **Pushes:**
  - None directly (relies on `CommonStates` handlers for some push events like `locomote`, `buffexpired`, etc., but none are added here).