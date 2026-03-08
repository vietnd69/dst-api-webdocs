---
id: SGprimemate
title: Sgprimemate
description: State graph defining AI behavior and animation states for the Prime Mate character, handling movement, combat, crafting, and special interactions like rowing and diving.
tags: [ai, stategraph, character]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 4e0c3a2d
system_scope: entity
---

# Sgprimemate

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGprimemate` is the state graph for the Prime Mate character in DST. It defines all core behavioral states—including idle, walking, combat, rowing, eating, taunting, diving, and corpse handling—via the stategraph system. It integrates with multiple components (`combat`, `inventory`, `locomotor`, `drownable`, `health`, `talker`, `timer`) to drive animations, physics, sound, and state transitions. This stategraph is initialized using `StateGraph` and built upon reusable utility functions from `commonstates.lua` for walking, sleep, combat, frozen, electrocute, corpse, and init states.

## Usage example
The stategraph is not instantiated manually by modders; it is registered automatically by the game via the return statement at the end of the file. To use it for a custom entity, assign it via `inst:AddStateGraph("primemate", "primemate")` during prefab construction, ensuring the entity has the required components.

```lua
local inst = CreateEntity()
inst:AddStateGraph("primemate", "primemate")
-- Ensure required components are present:
inst:AddComponent("combat")
inst:AddComponent("health")
inst:AddComponent("inventory")
inst:AddComponent("locomotor")
inst:AddComponent("drownable")
inst:AddComponent("talker")
inst:AddComponent("timer")
```

## Dependencies & tags
**Components used:** `combat`, `drownable`, `health`, `inventory`, `locomotor`, `talker`, `timer`, `weapon`, `oar`, `equippable`, `setbonus`, `inventoryitem`, `curseditem`, `revivablecorpse`  
**Tags added:** `busy`, `idle`, `canrotate`, `nomorph`, `cheering`, `drowning`, `corpse`  
**Tags checked:** `player`, `debuffed`, `buffed`, `ignoretalking`, `personal_possession`

## Properties
No public properties are defined in the constructor.

## Main functions
Not applicable — `SGprimemate` is a stategraph definition, not a class with public functions.

## Events & listeners
- **Listens to:**
  - `locomote` (via `CommonHandlers.OnLocomote`)
  - `freeze` (via `CommonHandlers.OnFreeze`)
  - `electrocute` (via `CommonHandlers.OnElectrocute`)
  - `attacked` (via `CommonHandlers.OnAttacked`)
  - `death` (via `CommonHandlers.OnDeath`)
  - `sleep` (via `CommonHandlers.OnSleep`)
  - `doattack` (custom handler triggers `attack` state)
  - `command` (custom handler triggers `taunt` state)
  - `onsink` (handles sinking/falling into water, drops inventory, removes entity)
  - `cheer` (custom handler triggers `cheer` state)
  - `animover`, `animqueueover`, `unequip` (state-specific handlers)
  - Corpse-related events (via `CommonHandlers.OnCorpseChomped`)
- **Pushes:** None defined directly; relies on internal `inst.sg:GoToState(...)` transitions and component events.
