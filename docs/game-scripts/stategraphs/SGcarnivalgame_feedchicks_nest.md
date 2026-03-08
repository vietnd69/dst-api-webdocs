---
id: SGcarnivalgame_feedchicks_nest
title: Sgcarnivalgame Feedchicks Nest
description: Manages state transitions for the Feedchicks Carnival Game nest station, handling idle, active, hungry, and fed animations and logic.
tags: [carnival, game, npc, ai]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: fe8620e1
system_scope: entity
---

# Sgcarnivalgame Feedchicks Nest

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
This stategraph defines the behavioral states for the "Feedchicks" carnival game nest station entity in DST. It controls transitions between idle (on/off), turn-on/off animations, hunger states (pre-loop-post), and feeding interactions. It integrates with the `carnivalgamefeedable` component to indicate when the nest is accepting feed and with the `inspectable` component when idle. State transitions are triggered by events (`carnivalgame_turnon`, `carnivalgame_turnoff`, `carnivalgame_feedchicks_hungry`, `carnivalgame_feedchicks_feed`) and animation completion.

## Usage example
```lua
-- Typical setup within a prefab definition
local inst = CreateEntity()
inst:AddComponent("carnivalgamefeedable")
inst:AddComponent("inspectable")
-- Stategraph is attached via the entity's stategraph system (not directly in Lua code by modders)
```

## Dependencies & tags
**Components used:** `carnivalgamefeedable`, `inspectable`  
**Tags:** Adds `scarytoprey` on entry to non-idle states, removes `scarytoprey` on entry to `idle_off`; emits `off` tag in `idle_off` and `turn_off` states.

## Properties
No public properties. Entity state and behavior are controlled via event-driven state transitions.

## Main functions
None. This is a pure stategraph definition returning a `StateGraph` instance. No standalone functions are exported.

## Events & listeners
- **Listens to:**
  - `animover` – triggers next state after animation finishes.
  - `carnivalgame_turnon` – transitions to `turn_on`.
  - `carnivalgame_turnoff` – transitions to `turn_off` (from `idle_on`) or `hungry_pst` (from `hungry_loop`).
  - `carnivalgame_feedchicks_hungry` – transitions to `hungry_pre` with a duration parameter.
  - `carnivalgame_feedchicks_feed` – transitions from `hungry_loop` to `hungry_fed`.
- **Pushes:**
  - `carnivalgame_feedchicks_available` – fired when exiting `hungry_fed` or `hungry_pst`, signaling the nest is ready for the next feed cycle.