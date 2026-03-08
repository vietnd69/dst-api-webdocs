---
id: SGwormwood_fruitdragon
title: Sgwormwood Fruitdragon
description: Defines the state machine for the Wormwood Fruit Dragon entity, handling idle, attack, movement, and status-affected behaviors.
tags: [ai, combat, boss, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: b7041a67
system_scope: entity
---

# Sgwormwood Fruitdragon

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
This stategraph implements the complete behavioral state machine for the Fruit Dragon, a boss entity encountered in the Wormwood biome. It orchestrates animations, sound effects, combat state transitions, and interactions with status effects like freezing, electrocution, death, and sleep. It integrates with core components (`combat`, `health`, `locomotor`) and leverages shared state helpers from `commonstates.lua`.

## Usage example
This stategraph is automatically assigned to the Fruit Dragon entity during its prefab initialization and is not intended for manual instantiation. Modders typically reference it when overriding or extending behavior, for example:

```lua
-- Example of inspecting or modifying the stategraph at runtime
inst.sg:GoToState("attack", target_entity)
```

## Dependencies & tags
**Components used:** `combat`, `health`, `locomotor`  
**Tags:** Adds `idle`, `canrotate`, `attack`, `busy`, `caninterrupt`, `frozen` (via inherited states); checks `busy`, `hit`, `electrocute`  
**Inherits states from:** `commonstates.lua` (`AddHitState`, `AddDeathState`, `AddWalkStates`, `AddRunStates`, `AddSleepStates`, `AddFrozenStates`, `AddElectrocuteStates`, `AddSinkAndWashAshoreStates`, `AddVoidFallStates`)

## Properties
No public properties. The stategraph is stateless beyond runtime `sg.statemem` usage (e.g., storing `target` during attack).

## Main functions
Not applicable. This is a declarative `StateGraph` definition — it does not expose functional methods. State transitions and behaviors are configured via static `states` and `events` tables and executed by the stategraph engine.

## Events & listeners
- **Listens to:**
  - `doattack` – initiates the `attack` state if healthy and not busy (with conditions).
  - `attacked` – triggers the `hit` state unless blocked by `busy`, unless `caninterrupt` or `frozen`.
  - `animover` (state-specific) – returns to `idle` after animation completion.
  - Common state handlers: `onsleep`, `onfreeze`, `onelectrocute`, `ondeath`, `onlocomote`, `onsink`, `onfallinvoid`
- **Pushes:** Not applicable (event dispatch is internal to the stategraph engine).