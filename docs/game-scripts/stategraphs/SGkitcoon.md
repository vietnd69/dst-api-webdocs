---
id: SGkitcoon
title: Sgkitcoon
description: Defines the state machine for the Kitcoon pet, handling idle behaviors, play animations, nuzzling, evictions, and interaction states with other entities.
tags: [ai, animation, pet, stategraph]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: df7d2d1f
system_scope: entity
---

# Sgkitcoon

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGkitcoon` is a stategraph that controls the behavior and animations of the Kitcoon pet entity. It defines states for idle idling, play animations (both ground- and air-based), nuzzling (including special year-of-the-cat loot events), eviction handling, and common critter locomotion states. It integrates with the `critter_common` stategraph helpers and depends on the `locomotor`, `follower`, and `unwrappable` components to manage movement, leader tracking, and loot wrapping/unwrapping.

## Usage example
This is a stategraph file used internally by the game engine and is not instantiated directly by modders. It is referenced by the Kitcoon prefab (`prefabs/kitcoon.lua`) and loaded via the `StateGraph` constructor returned at the end of the file.

```lua
-- This file is returned as a StateGraph constructor and used by the prefab:
-- return StateGraph("SGcritter_kitten", states, events, "idle", actionhandlers)
```

## Dependencies & tags
**Components used:** `locomotor` (for stopping movement, setting motor velocities, speed multipliers), `follower` (for retrieving the leader entity), `unwrappable` (for wrapping items during special event nuzzles).  
**Tags added/checked:** `idle`, `busy`, `canrotate`, `jumping`, `playful`. States set `busy` and `canrotate` on enter; `playful` tag used to avoid overlap during play events.

## Properties
No public properties defined in this file.

## Main functions
Not applicable — this is a stategraph definition file, not a class or component with public methods.

## Events & listeners
- **Listens to:**
  - `critterplaywithme` — triggers random play animation.
  - `kitcoonplaywithme` — triggers random play animation.
  - `start_playwithplaymate` — initiates mutual play with a target; rates animation speed.
  - Standard critter events via `CommonHandlers.OnSleepEx()`, `OnWakeEx()`, `OnLocomote()`, `OnHop()`, `OnSink()`, `OnFallInVoid()`.
- **Pushes:**
  - `kitcoonplaywithme` — pushed to the target when initiating play (via `data.target:PushEvent(...)`).
  - `locomote` — pushed via `CommonHandlers.OnLocomote()` and `LocoMotor:Stop()`.