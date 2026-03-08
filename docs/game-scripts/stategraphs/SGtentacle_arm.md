---
id: SGtentacle_arm
title: Sgtentacle Arm
description: Manages state transitions and animations for a small tentacle arm entity in combat, emergence, retraction, and death behaviors.
tags: [combat, ai, animation, boss]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 009f3f52
system_scope: combat
---

# Sgtentacle Arm

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGtentacle_arm` is a stategraph that defines the behavior and animation flow of a small tentacle arm entity. It handles states for emergence from the ground, idle observation, attacking, being hit, retraction, and death. The stategraph coordinates with the `health`, `combat`, and `playerprox` components to trigger transitions based on combat events, player proximity, and entity health status. It is not a component itself but a complete state machine used by the tentacle prefab to manage its lifecycle and interactive behaviors.

## Usage example
The stategraph is registered and applied by the `tentacle` prefab (e.g., `smalltentacle.lua`) during entity initialization, typically via:
```lua
inst:AddTag("tentacle")
inst:AddComponent("health")
inst:AddComponent("combat")
inst:AddComponent("playerprox")
-- Stategraph is assigned internally via `inst.stategraph = "tentacle"` or similar framework logic
```
The entity itself triggers events like `"emerge"`, `"retract"`, `"full_retreat"`, or `"death"` based on game logic (e.g., player proximity, damage, or parent pillar orders).

## Dependencies & tags
**Components used:**  
- `health` (`IsDead`)  
- `combat` (`HasTarget`, `StartAttack`, `DoAttack`)  
- `playerprox` (`IsPlayerClose`)  

**Tags added by states:**  
- `"idle"`, `"retracted"`, `"noelectrocute"` (in `idle`)  
- `"attack_idle"`, `"emerged"` (in `attack_idle`)  
- `"emerge"` (in `emerge`)  
- `"attack"` (in `attack`)  
- `"retract"`, `"noelectrocute"` (in `retract`)  
- `"busy"` (in `death`, `full_retreat`)  
- `"busy"`, `"hit"` (in `hit`)  

## Properties
No public properties are defined in this stategraph definition. All runtime state is managed internally via `inst.sg.statemem` and entity flags (`inst.retreat`, `inst.retracted`).

## Main functions
Not applicable — this is a stategraph definition, not a component with user-callable methods. State transitions are triggered by events, timeouts, or animation callbacks.

## Events & listeners
- **Listens to:**  
  - `"attacked"` — triggers `"hit"` state if not dead and not in hit/attack; also handles electrocution via `CommonHandlers.TryElectrocuteOnAttacked`.  
  - `"newcombattarget"` — transitions to `"attack"` if a target exists and current state has `"attack_idle"` tag.  
  - `"death"` — transitions to `"death"`.  
  - `"emerge"` — transitions to `"emerge"` if current state has `"retracted"` tag.  
  - `"retract"` — transitions to `"retract"` if current state has `"emerged"` tag.  
  - `"full_retreat"` — transitions to `"full_retreat"` with argument based on `"retracted"` vs `"emerged"` tags.  
  - `"animover"` and `"animqueueover"` — handled per-state to trigger next transitions.  
  - `"ontimeout"` (in `idle`) — checks player proximity to trigger `"emerge"`.  

- **Pushes:**  
  - `"full_retreat"` — scheduled from `idle` state's timeout callback.  
  - Events are pushed internally via `inst.PushEvent()`; no custom events are pushed by this stategraph itself.  

- **Stategraph-wide event handlers:**  
  - `CommonHandlers.OnFreeze()` — adds frozen state support.  
  - `CommonHandlers.OnElectrocute()` — adds electrocution state support with custom `onanimover` logic to return to `"attack_idle"` on finish.  

