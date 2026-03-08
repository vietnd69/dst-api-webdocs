---
id: SGabysspillar_minion
title: Sgabysspillar Minion
description: Defines the state machine behavior for the abyss pillar minion entity, controlling its activation, idle, movement, and deactivation logic.
tags: [ai, boss, environment]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: d5310df4
system_scope: entity
---

# Sgabysspillar_minion

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGabysspillar_minion` is a stategraph that implements the behavior of the abyss pillar minion entity — a small floating companion associated with the Abyssal Pillar boss fight. It manages transitions among idle, activation, run, and deactivation states, coordinating animations, sound effects, locomotion, and interaction with its parent pillar. The stategraph uses the ` locomotor` component to control movement and relies on common states utilities for hop-related animations.

## Usage example
```lua
-- This stategraph is automatically assigned to the prefab when it is created in prefabs/abysspillar_minion.lua.
-- Typical usage does not require manual instantiation by modders.
-- To modify behavior, override the stategraph via the stategraph API:
--   TheGame.StateGraph:AddStateGraph("abysspillar_minion", my_custom_stategraph)
```

## Dependencies & tags
**Components used:** `locomotor` (via `inst.components.locomotor`), `animstate`, `soundemitter`  
**Tags:** Adds `ignorewalkableplatformdrowning` during deactivation sequence; checks `deactivating` for conditional logic.  
**Tags set by stategraph:** `idle`, `canrotate`, `deactivating`, `busy`, `moving`, `running`

## Properties
No public properties. All state-related data is stored in `inst.sg.statemem` during runtime.

## Main functions
No custom methods are defined in this file — the stategraph is constructed and returned by `StateGraph(...)`. Functionality is entirely driven by `onenter`, `onexit`, `ontimeout`, and event handler callbacks within the state definitions.

## Events & listeners
- **Listens to:**
  - `CommonHandlers.OnLocomote(true, false)` — handles movement start/stop from locomotor.
  - `CommonHandlers.OnHop()` — handles hop-related transitions.
  - `deactivate` — triggers transition to `"deactivate"` state (if not already in a deactivating state).
  - `animover` — detects animation completion to transition to subsequent states (e.g., `"idle"` after `"activate"`).
  - `entitysleep` — in `"deactivate_delay"`, triggers same logic as `ontimeout` if the entity goes to sleep before timeout.
- **Pushes:** None directly. The stategraph itself is passive and reacts to events; it does not fire custom events.