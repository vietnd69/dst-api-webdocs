---
id: SGlightninggoat
title: Sglightninggoat
description: Defines the state machine behavior for the Lightning Goat, handling movement, taunting, combat, and electrocution mechanics via discrete animation-triggered states.
tags: [ai, locomotion, combat, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: dab9792f
system_scope: entity
---

# Sglightninggoat

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGlightninggoat` is the state graph that orchestrates the Lightning Goat's behavior through a sequence of animation and event-driven states. It integrates with the `health`, `locomotor`, and `combat` components to manage movement (`idle`, `walk`, `walk_stop`), charged and uncharged taunts (`taunt`), discharge transitions (`discharge`), and shock responses (`shocked`, `electrocute`). The graph inherits common behaviors (e.g., sleep, freeze, death) via `CommonStates` helpers and supports charged-sound feedback (`jacobshorn`) and lightning-based attacks (`electric` tag) when `inst.charged` is true.

## Usage example
This state graph is automatically assigned by the game engine when the `lightninggoat` prefab is instantiated and its stategraph is registered. Modders typically do not instantiate it directly but may extend or override states via `CommonStates` helpers or by patching the returned stategraph.

```lua
-- Not typically used directly. For reference, the stategraph is registered as:
-- StateGraph("lightninggoat", states, events, "init")
-- And used internally by prefabs such as "lightninggoat".
```

## Dependencies & tags
**Components used:** `health`, `locomotor`, `combat`  
**Tags added by states:** `idle`, `canrotate`, `moving`, `busy`, `attack` (added/removed via `CommonStates.AddCombatStates`)  
**Tags checked:** None explicitly, though `busy` is checked during hit reaction via `inst.sg:HasStateTag("busy")`.

## Properties
No public properties. The stategraph operates on `inst` fields and `inst.sg` metadata (`statemem`, state tags) for state-specific data.

## Main functions
Not applicable. This file defines a `StateGraph` via `CommonStates` helpers and returns it. It does not export custom functional methods.

## Events & listeners
- **Listens to:**  
  - `animover`, `animqueueover`, `attacked`, `corpsechomped` (via `CommonHandlers.OnCorpseChomped`)  
  - Various common handlers: `OnLocomote`, `OnSleep`, `OnFreeze`, `OnAttack`, `OnDeath`  
- **Pushes:** None directly (events are handled internally via state transitions); inherits `Combat` state events from `CommonStates.AddCombatStates` (e.g., `attackEnded`, `deathEnded`).