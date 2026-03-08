---
id: SGmermking
title: Sgmermking
description: Defines the state machine and animation-driven behavior for the Merm King character, including idle, eating, trade, guard summoning, and item-swap states.
tags: [ai, animation, boss, merm, stategraph]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 0c31d221
system_scope: entity
---

# Sgmermking

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGmermking` is a `StateGraph` definition for the Merm King entity, governing its behavioral states and animation sequences. It defines the complete state machine for actions like idle movement, eating, trading, calling guards, and item equipping (trident, crown, pauldron). It integrates with `CommonStates` to provide standard combat, electrocution, death, and corpse handling, as well as custom animation timelines and sound events.

## Usage example
```lua
-- This StateGraph is instantiated and assigned to the Merm King prefab via its .lua file:
-- inst.stategraph = "SGmermking"
-- The StateGraph itself is not manually added as a component; it is the core AI container.
-- State transitions occur internally via inst.sg:GoToState("state_name")
-- Custom logic such as inst:TradeItem() or inst.CallGuards(inst) are methods on the Merm King entity.
```

## Dependencies & tags
**Components used:** `locomotor` (checked and used to stop movement in `refuse` state)
**Tags:** `idle`, `busy`, `calling_guards` — applied via state tags. Also inherits tags from common states (e.g., `incombat`, `dead`, `deadbody`, `corpse`).

## Properties
No public properties.

## Main functions
This is a `StateGraph` definition, not a component class, and does not define public methods. State transitions are handled internally by the `StateGraph` engine via `inst.sg:GoToState()`.

## Events & listeners
- **Listens to:**  
  - `oncreated` → transitions to `oncreated` state  
  - `call_guards` → transitions to `call_guards` state  
  - Standard locomotion (`on locomote`)  
  - `onsleep`, `onelectrocute`, `onattacked`, `ondeath`, `oncorpsechomped`  
  - `animqueueover` (within `eat`)  
  - `animover` (within `oncreated`, `trade`, `call_guards`, `refuse`)  
- **Pushes:** None — does not fire custom events. Relies on built-in animation and common state events.

