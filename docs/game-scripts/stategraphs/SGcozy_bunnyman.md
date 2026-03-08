---
id: SGcozy_bunnyman
title: Sgcozy Bunnyman
description: Manages the AI behavior and state transitions for the Cozy Bunnyman character, including combat, movement, emotions, spawning/despawning, and event responses.
tags: [ai, stategraph, emotion, combat]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 456d4b14
system_scope: entity
---

# Sgcozy Bunnyman

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGcozy_bunnyman` is the stategraph for the Cozy Bunnyman entity in DST. It defines the full suite of behavioral states (idle, attack, walk, run, hide, despawn, emote, etc.) and handles transitions based on events, timers, and component states. The stategraph integrates closely with the `combat`, `health`, `locomotor`, `talker`, `lootdropper`, and `follower` components, and manages animation sequencing, sound effects, and positional logic for digging/hiding mechanics.

## Usage example
The stategraph is not added manually but is assigned to an entity via the `StateGraph` constructor at the end of the file. A typical entity definition includes:

```lua
local inst = CreateEntity()
inst:AddComponent("stategraph")
inst.components.stategraph:SetStateGraph("cozy_bunnyman")
```
The `stategraph` component then uses the returned `StateGraph` definition from `SGcozy_bunnyman.lua` to drive the entity's behavior.

## Dependencies & tags
**Components used:** `combat`, `health`, `locomotor`, `talker`, `lootdropper`, `follower`, `entitytracker`, `inventory`, `timer`  
**Tags added/removed:** `idle`, `busy`, `canrotate`, `attack`, `emote`, `hide`, `noattack`, `alert`, `sleeping`, `jumping`  
State tags are dynamically added/removed during state entry/exit (e.g., `attack`, `busy`, `noattack`, `hide`).

## Properties
No public properties are defined in this stategraph. State memory (`inst.sg.statemem` and `inst.sg.mem`) is used internally for transient data (e.g., `is_holding_overhead`, `barf`, `pos`, `endhide`).

## Main functions
Not applicable — this is a `StateGraph` definition, not a component class with methods.

## Events & listeners
- **Listens to:**
  - Common game events: `animover`, `animqueueover`, `gobacktocave`, `cheer`, `disappoint`, `dance`, `reject`, `question`, `hide`, `digtolocation`, `raiseobject`, `pillowfight_ringout`, `doattack`, `pillowfight_ended`, `knockback`, `gotyotrtoken`, `cheating`
  - Common state handlers: `OnStep`, `OnLocomote`, `OnSleep`, `OnFreeze`, `OnAttacked`, `OnDeath`, `OnHop`, `OnSink`, `OnFallInVoid`, `OnCorpseDeathAnimOver`
- **Pushes:** None directly — this file defines the *listener* side of event handling. State transitions are driven by external events (`inst:PushEvent(...)`) and internal timers/conditions.