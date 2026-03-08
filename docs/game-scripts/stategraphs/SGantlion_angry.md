---
id: SGantlion_angry
title: Sgantlion Angry
description: Defines the state machine and behavior for an aggressive Antlion enemy, handling movement, combat, summons, and state transitions.
tags: [combat, ai, boss]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 619b4aef
system_scope: entity
---

# Sgantlion Angry

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGantlion_angry` is a `StateGraph` that governs the behavior of an aggressive Antlion entity. It manages transitions between states such as idle, hit recovery, death, casting spike/stone wall attacks, taunting, and eating to heal. It integrates closely with the `combat`, `health`, `burnable`, `sanityaura`, and `worldsettingstimer` components to drive combat logic, respond to damage, extinguish fire, and apply attack speed modifiers.

## Usage example
This stategraph is automatically associated with the Antlion entity's state graph manager during prefab initialization (e.g., via `inst:AddStateGraph("antlion_angry")`). No direct instantiation or manual use is required for modders.

```lua
-- Example: No direct usage needed; this stategraph is embedded in the Antlion prefab.
-- It defines how the Antlion behaves when in its "angry" state.
```

## Dependencies & tags
**Components used:** `combat`, `health`, `burnable`, `sanityaura`, `worldsettingstimer`

**Tags added by states:**
- `idle`, `hit`, `busy`, `attack`, `caninterrupt`, `nosleep`, `nofreeze`

**Tags added to entity:**
- `NOCLICK` (during death animation)

## Properties
No public properties are defined in this `StateGraph`. Behavior is driven by state logic, timers, and component interactions.

## Main functions
This file does not define custom functions beyond helper callbacks and event handlers. All functional logic is embedded directly in state definitions and event callbacks.

## Events & listeners
- **Listens to:**
  - `doattack` — triggers `ChooseAttack` if not `busy` and not dead.
  - `attacked` — initiates hit recovery unless in `busy` state without `caninterrupt`, or handles electrocution.
  - `eatrocks` — enters `eat` state if hurt, or defers if `busy`.
  - `antlionstopfighting` — calls `StopCombat`, or defers via `wantstostopfighting`.
  - `death`, `freeze`, `electrocute`, `sleep`, `wake`, `animover`, and corpse-related events via `CommonHandlers`.
  - All `CommonHandlers` used: `OnDeath`, `OnFreezeEx`, `OnElectrocute`, `OnSleepEx`, `OnWakeEx`, `OnCorpseChomped`, `OnCorpseDeathAnimOver`, `OnNoSleepTimeEvent`, `OnNoSleepAnimOver`.

- **Pushes:**
  - None directly; relies on `CommonHandlers` and engine-provided events.