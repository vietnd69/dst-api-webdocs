---
id: SGboatrotator
title: Sgboatrotator
description: Manages the state machine for the boat rotator prop, controlling animation, sound, and transition flow between idle, placement, rotation, and power states.
tags: [environment, prop, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: b7d9b357
system_scope: environment
---

# Sgboatrotator

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGboatrotator` defines the state graph for the boat rotator entity, determining how it responds to player input and animation completion events. It handles transitions between idle, placement, rotation ("hit"), active rotation ("on"), and power-off ("off") states, using the `direction` stored in the state memory (`inst.sg.mem.direction`) to drive directional animation and behavior.

## Usage example
```lua
-- This state graph is automatically attached by the game engine when the boatrotator prefab is instantiated.
-- Modders typically do not manually invoke or modify this state graph — instead, they trigger transitions via events:
inst:PushEvent("worked")
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Uses and checks state tags: `"idle"`, `"busy"`.

## Properties
No public properties

## Main functions
This state graph does not expose any callable public functions. State transitions are triggered solely by events.

## Events & listeners
- **Listens to:**
  - `"worked"` - (global handler) initiates a `"hit"` or `"on"` transition if not busy or burnt.
  - `"animover"` (per state) - triggers next-state transitions upon animation completion:
    - In `"place"` → goes to `"on"` if direction ≠ 0, otherwise `"idle"`.
    - In `"hit"` → goes to `"idle"`.
    - In `"on"` → goes to `"idle"`.
    - In `"off"` → resets `inst.sg.mem.direction` to `0` and goes to `"idle"`.