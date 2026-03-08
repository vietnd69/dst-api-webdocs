---
id: SGboat_ice
title: Sgboat Ice
description: Manages the lifecycle and state transitions of an ice-based boat entity, including placement, damage响应, sinking, and destruction.
tags: [boat, sinking, entity, lifecycle]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 621a9f09
system_scope: entity
---

# Sgboat Ice

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGboat_ice` defines the state machine for an ice-based boat entity in Don't Starve Together. It orchestrates transitions through states including `place`, `idle`, `ready_to_snap`, `snapping`, and `popping`, responding to health changes and death events. When the boat dies, it notifies entities on its platform, triggers sound and FX events during a prolonged sinking sequence, and finally removes the entity.

The stategraph leverages the `health` component to detect when the boat is destroyed (via `IsDead()`), and uses `walkableplatform` to access entities and players resting on it for boarding/disembarking logic during sinking.

## Usage example
```lua
-- Stategraph is automatically instantiated by the game engine for any entity with the matching StateGraph name ("boat_ice").
-- Modders should attach this stategraph to their entity prefab via:
inst:AddStateGraph("boat_ice")
-- and ensure the entity has the following:
--   - health component
--   - walkableplatform component
--   - anim component for animations ("place", "idle1", "idle2", "idle3", "cracked0", "cracked1")
```

## Dependencies & tags
**Components used:** `health`, `walkableplatform`
**Tags:** `dead` is added during `ready_to_snap` and `snapping` states.

## Properties
No public properties.

## Main functions
Not applicable — this is a `StateGraph` definition, not a component with user-callable methods. The state machine is driven internally by the game engine and event handlers.

## Events & listeners
- **Listens to:**
  - `animover` (in `place` and `snapping` states) — triggers state transition after animation completes.
  - `healthdelta` (in `idle` state) — triggers cracked animation updates when health changes.
  - `death` (in `idle` state) — initiates sinking sequence (`ready_to_snap`).
- **Pushes:** None — this stategraph does not fire custom events.
