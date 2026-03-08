---
id: SGwinch
title: Sgwinch
description: Defines the state machine logic for winch entities, handling transitions between raised, lowered, raising, and lowering states based on animation events and component interactions.
tags: [locomotion, entity, animation, state-machine]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 1627d2f2
system_scope: entity
---

# Sgwinch

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGwinch` is a state graph that governs the animation and behavior of winch entities. It manages transitions through states like `raised`, `lowered`, `raising`, and `lowering`, responding to input events (`start_raising_winch`, `start_lowering_winch`) and internal component events (`winch_fully_raised`, `winch_fully_lowered`). It relies on the `inventory` and `winch` components to determine items in slot 1 and to trigger the `FullyRaised()` method upon completion of raising animations.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("winch")
inst:AddComponent("inventory")
inst:AddStateGraph("winch")
-- Events such as "start_raising_winch" or "winch_fully_raised" trigger state transitions
```

## Dependencies & tags
**Components used:** `inventory` (to check slot 1 for heavy items), `winch` (to call `FullyRaised()`)
**Tags:** Adds `lowered_ground` tag when entering `lowered_ground` state; removes it on exit.

## Properties
No public properties.

## Main functions
None identified (this file defines a `StateGraph`, not a component with public methods).

## Events & listeners
- **Listens to:**  
  `start_lowering_winch` – initiates the `lowering` state.  
  `start_raising_winch` – initiates the `raising` state.  
  `winch_fully_lowered` – transitions to `lowering_pst`.  
  `winch_fully_raised` – transitions to `raised` (if no platform attached) or `raising_pst` (if platform present).  
  `workinghit` – plays hit animations in various states.  
  `claw_interact_ground` – triggers `lowered_ground` state from `raised` or transitions to `raising_ground` from `lowered_ground`.  
  `animqueueover` – used to trigger state transitions after animation completion (e.g., advancing from `raising_ground` to `fullyRaised`, or from `lowering_pst` to `lowered`).  

- **Pushes:** None (does not fire custom events; relies on external components like `winch` for event emission).