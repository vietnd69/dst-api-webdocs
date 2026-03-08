---
id: SGcaveventmite
title: Sgcaveventmite
description: Defines the state machine and behavior logic for the cave ventmite entity, including movement, attacking, shield mechanics, and environmental interaction via miasma spawning and temperature effects.
tags: [ai, combat, stategraph, environment]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: a46a19d9
system_scope: ai
---

# Sgcaveventmite

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGcaveventmite` is the stategraph responsible for governing the behavior of the cave ventmite entity. It implements state transitions for common actions such as moving, idle periods, eating, attacking, and using a shield (vent phase). It integrates with multiple components—`freezable`, `burnable`, `temperature`, `locomotor`, `combat`, `lootdropper`, `health`, `planarentity`, `timer`—to produce core behaviors: blowing heat to thaw or warm targets, spawning miasma clouds when active, and toggling physics/shield states during vent phases. It inherits shared states for sleeping, freezing, electrocution, sinking, and void fall via `CommonStates.Add*`.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("caveventmite")
inst:AddComponent("health")
inst:AddComponent("freezable")
inst:AddComponent("locomotor")
inst:AddComponent("combat")
inst:AddComponent("lootdropper")
inst:AddComponent("planarentity")
inst:AddComponent("temperature")
inst:AddComponent("timer")
inst:AddStateGraph("caveventmite", "SGcaveventmite")
inst.sg:GoToState("idle")
```

## Dependencies & tags
**Components used:** `health`, `freezable`, `locomotor`, `combat`, `lootdropper`, `planarentity`, `temperature`, `timer`  
**Tags:** Adds and checks state tags including `busy`, `moving`, `idle`, `attack`, `shield`, `vent`, `shield_end`, `noelectrocute`, `noattack`, `waking`, `caninterrupt`, `canrotate`, `blowing`, `hit`, `shield_hit`, `electrocute`, `freeze`, `sleep`, `sink`, `voidfall`, `death`. Also uses `NO_TAGS` and `BLOW_ONEOF_TAGS` internally for entity filtering.

## Properties
No public properties exposed. Internal state is maintained via `inst.sg.statemem`, component fields, and local variables within functions.

## Main functions
### `GetHeatRate(inst)`
* **Description:** Calculates the heat rate applied by the ventmite's blow based on ambient temperature and wetness; used by `DoBlowUpdate`.
* **Parameters:** `inst` (entity instance) — the ventmite entity.
* **Returns:** number — multiplicative heat rate adjusted for environmental conditions.

### `DoBlowUpdate(inst, dt)`
* **Description:** Core update function applied during `blowing` states. Iterates over nearby entities within range and applies heating or thawing effects based on their `freezable`, `burnable`, and `temperature` components.
* **Parameters:**  
  - `inst` (entity instance) — the ventmite entity performing the blow.  
  - `dt` (number) — delta time for frame rate–independent updates.
* **Returns:** Nothing.
* **Error states:** No-op if `inst.sg.statemem.blowing` is nil or not true.

### `CheckSpawnMiasma(inst)`
* **Description:** Spawns a `miasma_cloud` prefab at the ventmite’s position if none exists nearby and the entity has the `planarentity` component.
* **Parameters:** `inst` (entity instance).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `attacked` — triggers hit, shield_hit, or interruption logic depending on state tags and health.
  - `doattack` — chooses between `blow_attack` or regular `attack` based on cooldown and state.
  - `locomote` — transitions between `premoving`, `moving`, and `idle` states based on movement intent.
  - `spawn` — enters `spawn` state on entity activation if conditions allow.
  - `entershield` / `exitshield` — enters `shield_pre` / `shield_end` states to toggle vent shield physics.
  - Common stategraph events: `hop`, `sleep`, `freeze`, `electrocute`, `sink`, `fallinvoid`, `death` — via `CommonHandlers`.
- **Pushes:** None directly; relies on the StateGraph engine to handle transitions and external event handling.