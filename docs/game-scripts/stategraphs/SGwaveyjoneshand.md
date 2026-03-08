---
id: SGwaveyjoneshand
title: Sgwaveyjoneshand
description: Manages state transitions and animation control for Wavey Jones' mechanical hand entity, coordinating locomotion, actions, and trap responses.
tags: [locomotion, animation, interaction]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 71e6ad50
system_scope: entity
---

# Sgwaveyjoneshand

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGwaveyjoneshand` is a state graph that controls the behavior and animation state of Wavey Jones' mechanical hand. It manages transitions between idle, movement, short/looped actions (e.g., raising/lowering sail or anchor), and special states like being trapped or relocated. It integrates with the `locomotor` component for movement and the `timer` component for timed trap handling, while also forwarding state events to an attached `handart` visual component.

## Usage example
```lua
-- Typically instantiated automatically for the Wavey Jones hand entity.
-- Custom usage would involve ensuring the entity has the required components:
local hand = CreateEntity()
hand:AddComponent("locomotor")
hand:AddComponent("timer")
-- The state graph is assigned by the game engine during entity prefab definition.
-- No direct instantiation by modders is required.
```

## Dependencies & tags
**Components used:** `locomotor`, `timer`  
**Tags added/removed:** States add/remove tags including `busy`, `idle`, `canrotate`, `moving`, `trapped`.  
**Event handlers:** Listens for `locomote`, `trapped`, `animover`, `animqueueover`, `performbufferedaction`, `stopraisinganchor`, `released`, `timerdone`.

## Properties
No public properties.

## Main functions
This is a stategraph definition—there are no callable public functions exposed to external code. Behavior is defined declaratively via `states`, `events`, and `actionhandlers`.

## Events & listeners
- **Listens to:**  
  - `locomote` – Triggers hand rotation and conditionally transitions to `premoving` if moving without busy/attack state.  
  - `trapped` – Transitions to `trapped` state and starts a `trappedtimer`.  
  - `animover` – Used in multiple states to transition to `idle` or `moving` after animation completes.  
  - `animqueueover` – Transitions to `idle` after queue completion (e.g., short actions).  
  - `performbufferedaction` – Executes buffered action and clears target, then laughs if arm is attached.  
  - `stopraisinganchor` – Transitions to `loop_action_anchor_pst` for anchor-lowering sequences.  
  - `released` – Transitions from `trapped` to `trapped_pst`.  
  - `timerdone` – Triggers `scared_relocate` when `trappedtimer` expires while trapped.  
- **Pushes:**  
  - `"STATE_IN"`, `"STATE_IDLE"`, `"STATE_PREMOVING"`, `"STATE_MOVING"`, `"STATE_SHORT_ACTION"`, `"STATE_LOOP_ACTION_ANCHOR"`, `"STATE_LOOP_ACTION_ANCHOR_PST"`, `"STATE_TRAPPED"`, `"STATE_TRAPPED_PST"`, `"STATE_SCARED_RELOCATE"` – Forwarded via `passtate()` to the `handart` component for animation sync.  
  - `"laugh"` – Sent to `inst.arm.jones` (if valid) after successful short or looped actions.  
  - `"startlongaction"` – Sent to `bufferedaction.target` when a looped anchor action begins.