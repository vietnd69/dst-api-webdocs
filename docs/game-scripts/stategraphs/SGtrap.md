---
id: SGtrap
title: Sgtrap
description: Manages the visual and behavioral states of a trap entity, including idle, sprung, full (with loot), and empty states.
tags: [trap, animation, state]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 59412126
system_scope: entity
---

# Sgtrap

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGtrap` is a StateGraph that defines the state transitions for trap entities in DST. It controls the trap's animation playback and handles transitions between idle, full (loot captured), empty (no loot), and sprung (animating the spring mechanism) states. It integrates with the `trap` component to trigger the spring action and determine whether the trap is full or empty afterward, and with the `inventoryitem` component to prevent picking up the trap while it's in the sprung state.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("trap")
inst:AddComponent("inventoryitem")
inst.sg = StateGraph("trap", ... )
-- Initial state is "idle"
-- To spring the trap, fire event:
inst:PushEvent("springtrap", { loading = false })
-- To harvest a full trap:
inst:PushEvent("harvesttrap")
```

## Dependencies & tags
**Components used:** `trap`, `inventoryitem`  
**Tags:** Checks `inst.components.trap.lootprefabs ~= nil` to determine state after springing; checks `inst.entity:IsAwake()` for springing behavior.

## Properties
No public properties.

## Main functions
*(StateGraph definition, no callable methods)*

## Events & listeners
- **Listens to:**  
  - `ondropped` — transitions the state graph to `"idle"`.  
  - `springtrap` — triggers the spring action via `trap:DoSpring()` if the trap is asleep, or transitions directly to `"sprung"` if awake. Determines next state (`"full"` or `"empty"`) based on `trap.lootprefabs`.  
  - `harvesttrap` — transitions to `"idle"` (used for full/empty states).  
  - `animover` — repeats `"full"` state animation loop, or transitions from `"sprung"` to `"full"`/`"empty"` after spring animation completes.
- **Pushes:** None (the graph consumes events internally; events are pushed *to* the graph by external code).