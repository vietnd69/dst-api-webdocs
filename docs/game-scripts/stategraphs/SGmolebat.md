---
id: SGmolebat
title: Sgmolebat
description: Defines the state machine for the mole bat entity, governing its behaviors such as idle, movement, eating, summoning allies, and combat via state transitions and event handling.
tags: [ai, locomotion, combat, boss]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 673e2dc4
system_scope: entity
---

# Sgmolebat

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGmolebat` is a stategraph that manages the behavioral states and transitions for the mole bat entity. It integrates common state helpers from `commonstates.lua` to support walking, sleeping, combat, freezing, electrocution, and corpse states. The mole bat transitions between states such as idle, sniffing, eating, making/breaking molehills, taunting, and summoning allies, responding to player actions, timers, and game events. It relies on the `locomotor`, `health`, and `combat` components for movement, life status, and attack logic.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("molebat")
inst:AddComponent("health")
inst:AddComponent("locomotor")
inst:AddComponent("combat")
inst.stategraph = StateGraph("molebat", inst)
inst.sg:GoToState("idle")
```

## Dependencies & tags
**Components used:** `health`, `locomotor`, `combat`  
**Tags:** Adds and checks state tags including `idle`, `canrotate`, `busy`, `noattack`, `noelectrocute`; also checks `electrocute` via `inst.sg:HasStateTag`.

## Properties
No public properties

## Main functions
This stategraph does not expose public methods — functionality is embedded in state definitions and event handlers. All logic resides in state callbacks (`onenter`, `onexit`, `ontimeout`) and event handlers.

## Events & listeners
- **Listens to:**  
  - `animover`, `animqueueover`, `summon`, `onlocomote`, `onsleep`, `onfreeze`, `onelectrocute`, `onattack`, `onattacked`, `ondeath`, `onchomp` (via `CommonHandlers.OnCorpseChomped()`)  
- **Pushes:** Events internally via `inst:PushEvent("suckedup")` when a molehill is broken. No custom events are explicitly pushed beyond core engine events used in `CommonHandlers`.
