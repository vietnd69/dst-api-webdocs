---
id: SGkoalefant
title: Sgkoalefant
description: Manages the animation and state behavior for the Koalefant creature, including idle, movement, attack, and death states.
tags: [ai, animation, creature, combat, locomotion]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: aea734d7
system_scope: entity
---

# Sgkoalefant

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGkoalefant` defines the state graph for the Koalefant creature, controlling its behavior through animation states and event-driven transitions. It integrates with the `health`, `combat`, and `locomotor` components to respond to game events such as attacks, death, electrocution, and sleep. The state graph implements standard locomotion, idle animations, attack, and death sequences using helper functions from `commonstates.lua`.

## Usage example
```lua
-- The state graph is defined and returned automatically by the script.
-- It is used internally by the game to drive the Koalefant entity's behavior.
-- No manual instantiation is required for modders.
return StateGraph("koalefant", states, events, "init")
```

## Dependencies & tags
**Components used:** `health`, `combat`, `locomotor`
**Tags:** `idle`, `canrotate`, `attack`, `busy`, `corpse`

## Properties
No public properties.

## Main functions
The state graph itself is a return value and not instantiated as a class. It defines the `states` and `events` tables, but does not expose standalone functions. Public functions are internal to state callbacks (e.g., `onenter`, `ontimeout`) and are not intended for external invocation.

## Events & listeners
- **Listens to:**
  - `doattack` — triggers the `attack` state if not dead or electrocuted.
  - `attacked` — triggers `hit` state if not dead or in an immunity state.
  - `animover`, `animqueueover` — transitions from animation completion to `idle`.
  - `ontimeout` (state-specific) — transitions from idle/graze to other states.
  - `OnStep`, `OnLocomote`, `OnSleep`, `OnFreeze`, `OnElectrocute`, `OnDeath`, `OnCorpseChomped`, `OnCorpseDeathAnimOver` — via `CommonHandlers`.
- **Pushes:** No events directly; relies on state transitions and common handlers for propagation.

