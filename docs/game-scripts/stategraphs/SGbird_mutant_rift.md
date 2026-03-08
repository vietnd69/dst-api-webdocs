---
id: SGbird_mutant_rift
title: Sgbird Mutant Rift
description: Manages the state transitions and behavior of the mutant rift bird, including movement, idle taunts, attacks, projectile shooting, and death states.
tags: [ai, combat, stategraph, boss]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 307813a2
system_scope: entity
---

# Sgbird Mutant Rift

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGbird_mutant_rift` is a `StateGraph` that defines the behavioral logic for the mutant rift bird entity in DST. It orchestrates transitions between movement, idle, attack, shooting, stunned, and death states using a combination of animation events, timers, and external component callbacks. It relies heavily on the `locomotor`, `combat`, `timer`, and `inventoryitem` components for motion control, combat resolution, timed actions, and pickup behavior.

## Usage example
```lua
-- The stategraph is instantiated automatically when the prefab `bird_mutant_rift` is created.
-- Modders typically interact with it via component hooks or by pushing events to the entity:
inst:PushEvent("doattack")   -- Initiates an attack if not busy
inst:PushEvent("trapped")    -- Triggers trapped state (e.g., after net trap)
inst:PushEvent("death")      -- Transitions the entity to the death sequence
```

## Dependencies & tags
**Components used:** `locomotor`, `combat`, `timer`, `inventoryitem`
**Tags:** The stategraph itself does not add/remove tags directly, but individual states declare `tags` (e.g., `busy`, `moving`, `canrotate`) used internally by the stategraph system for state transition rules.

## Properties
No public properties are initialized directly by this stategraph. State memory is stored in `inst.sg.statemem`, a temporary per-state memory table.

## Main functions
This file returns a `StateGraph` definition and does not expose standalone functions. Key state logic is expressed in state `onenter`, `onexit`, `ontimeout`, and `onupdate` callbacks.

## Events & listeners
- **Listens to:**
  - `death` → transitions to `death` state.
  - `arrive` → transitions to `glide` state.
  - `doattack` → triggers `attack` state if not `busy`.
  - `trapped` → transitions to `trapped` state.
  - `locomote` → transitions to `walk` if not `busy` or `moving`.
  - `animover` → handled per-state to advance to next state.
  - Standard states added via `CommonStates.AddSleepStates`, `AddFrozenStates`, and `AddElectrocuteStates`.

- **Pushes:** No events are explicitly pushed by this stategraph itself (barring the standard `animover`, `locomote`, etc., which are consumed, not propagated here).
