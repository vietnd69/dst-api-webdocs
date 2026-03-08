---
id: SGboatmagnetbeacon
title: Sgboatmagnetbeacon
description: Defines the state machine for the boat magnet beacon entity, controlling animation transitions and behavior based on activation state.
tags: [animation, stategraph, beacon]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 55edcbf5
system_scope: entity
---

# Sgboatmagnetbeacon

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGboatmagnetbeacon` is a `StateGraph` definition that manages the visual and behavioral states of the boat magnet beacon entity. It governs transitions between idle, placing, activating, active, deactivating, and hit animation states. The behavior adapts dynamically based on whether the beacon is turned off, using the `boatmagnetbeacon` component's `IsTurnedOff()` method to determine animation sequences.

## Usage example
```lua
-- This stategraph is automatically attached to the boat magnet beacon prefab.
-- It is referenced internally via the StateGraph system and does not require manual instantiation.
-- The beacon entity uses events like "onturnon", "worked", and "animover" to trigger state transitions.
```

## Dependencies & tags
**Components used:** `boatmagnetbeacon` (accessed via `inst.components.boatmagnetbeacon:IsTurnedOff()`)
**Tags:** The state machine assigns tags to states: `"idle"` (for idle and active states), `"busy"` (for place, hit, activate, deactivate states).

## Properties
No public properties — this is a pure stategraph definition file.

## Main functions
This file returns a `StateGraph` constructor call and does not define standalone public functions.

## Events & listeners
- **Listens to:**  
  - `"onturnon"` — triggers transition to the `"activate"` state.  
  - `"worked"` — handled within each state to interrupt animations (e.g., play hit animation then resume looping).  
  - `"animover"` — used in place, hit, and deactivate states to return to `"idle"`.  
  - `"animqueueover"` — used in activate state to transition to `"active"` after the pre-animation queue completes.  

- **Pushes:** This file itself does not push events; it only consumes events to drive state transitions.