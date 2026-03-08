---
id: SGshadow_leech
title: Sgshadow Leech
description: Defines the state machine for the shadow leech entity, handling behaviors such as spawning, jumping, attaching to targets, and death.
tags: [ai, combat, stategraph]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: ddfdd9b7
system_scope: ai
---

# Sgshadow Leech

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGshadow_leech` is a stategraph component that implements the behavioral state machine for the shadow leech entity. It manages transitions between states such as idle, spawn, jump, attached, death, and flung, coordinating animations, physics, sounds, and interaction with the target (typically the Daywalker). The stategraph interacts with several components including `locomotor`, `health`, `entitytracker`, and `lootdropper`, and uses common state helpers for run/walk states.

## Usage example
This stategraph is assigned to a shadow leech entity instance during its creation, typically via the `StateGraph` constructor. Modders do not usually instantiate it manually; instead, it is used internally by the game for the `shadow_leech` prefab.

```lua
-- Not typically used directly by modders.
-- The stategraph is automatically applied when the entity is constructed as:
-- return Class(function(inst)
--     inst:AddComponent("entitytracker")
--     inst:AddComponent("health")
--     inst:AddComponent("locomotor")
--     inst:AddComponent("lootdropper")
--     inst.sg = StateGraph("shadow_leech", ...)
--     ...
-- end)
```

## Dependencies & tags
**Components used:** `entitytracker`, `health`, `locomotor`, `lootdropper`
**Tags:**  
- Added: `idle`, `canrotate`, `busy`, `noattack`, `temp_invincible`, `invisible`, `hit`, `jumping`, `notarget`, `NOCLICK`  
- Removed: `noattack`, `temp_invincible`, `invisible`, `notarget`, `NOCLICK` (contextually during state transitions)  
- Checked: `noattack`, `temp_invincible`, `busy`, `softstop`

## Properties
No public properties are initialized or exposed in the stategraph definition.

## Main functions
This is a `StateGraph` definition, not a component. There are no callable methods directly defined in this file. State behavior is implemented via `onenter`, `onexit`, `onupdate`, and `ontimeout` handlers for each state.

## Events & listeners
- **Listens to:**  
  - `locomote` – handled by `CommonHandlers.OnLocomote` (imported from `commonstates`)  
  - `jump` – triggers `jump_pre` state if not busy  
  - `attacked` – triggers `hit` state if not invulnerable or dead  
  - `death` – triggers `death` state  
  - `animover` – handled per-state to transition after animation completion  

- **Pushes:**  
  - No events are explicitly pushed by this stategraph itself.