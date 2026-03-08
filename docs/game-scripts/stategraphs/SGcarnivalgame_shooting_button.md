---
id: SGcarnivalgame_shooting_button
title: Sgcarnivalgame Shooting Button
description: Manages the state machine for a carnival shooting button entity, controlling animation playback, activation state, and transitions between idle, on, off, and shoot states.
tags: [game, carnival, ui, activation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: caea8bc1
system_scope: ui
---

# Sgcarnivalgame Shooting Button

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGcarnivalgame_shooting_button` is a stategraph that defines the behavior of a carnival shooting game button entity (e.g., the button players press to shoot in the shooting gallery minigame). It handles transitions among states including `place`, `idle_off`, `idle_on`, `turn_on`, `turn_off`, and `shoot`, with animation and sound effects for each. It integrates with the `activatable` component to control the `inactive` property during state transitions, effectively enabling/disabling interaction logic based on visual state.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("activatable")
-- Attach the stategraph to the entity
inst:AddStateGraph("carnivalgame_shooting_target")
-- Trigger state changes via events
inst:PushEvent("carnivalgame_turnon")   -- initiates turn_on state
inst:PushEvent("carnivalgame_turnoff")  -- initiates turn_off from idle_on
```

## Dependencies & tags
**Components used:** `activatable`  
**Tags:** The `idle_off` and `turn_off` states assign the `"off"` tag via `tags = {"off"}`.

## Properties
No public properties. State variables (e.g., `inst._shouldturnoff`) are set externally and referenced during state transitions.

## Main functions
Not applicable — this file returns a `StateGraph` definition, not a component class with methods.

## Events & listeners
- **Listens to:**  
  - `carnivalgame_turnon` — transitions to `turn_on` state.  
  - `carnivalgame_turnoff` — transitions to `turn_off` state from `idle_on`.  
  - `animover` — fires within `place`, `turn_on`, `turn_off`, and `shoot` states to trigger subsequent state changes upon animation completion.  
- **Pushes:** None — this stategraph only reacts to events; it does not emit custom events.