---
id: SGwalkingplank
title: Sgwalkingplank
description: Manages the animation and state transitions for a ship's walking plank entity in DST.
tags: [locomotion, entity, animation, interactivity]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 8521f320
system_scope: entity
---

# Sgwalkingplank

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGwalkingplank` is a stategraph that controls the operational states of a ship's walking plank — specifically, states for retracting, extending, being extended, mounted (by a player), and abandoning the ship. It handles animation playback, sound cues, and tag management (`interactable`, `plank_extended`) to coordinate interaction logic with other systems like player mounting and boat operations.

## Usage example
This stategraph is attached to an entity (typically the plank prefab) via the stategraph system and does not require manual component instantiation. The state transitions are triggered by pushing events to the entity's stategraph:

```lua
-- Trigger extension of the plank
inst.sg:PushEvent("start_extending")

-- Trigger mounting (e.g., by a player)
inst.sg:PushEvent("start_mounting")

-- Trigger abandonment (e.g., player leaves plank)
inst.sg:PushEvent("start_abandoning")
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `interactable` (on `retracted`, `extended`), adds `plank_extended` (on `extended`), removes both in other states.

## Properties
No public properties

## Main functions
This stategraph is declarative (defined via `StateGraph` constructor) and does not expose public methods beyond stategraph internals (`GoToState`, `SetTimeout`, event handlers).

## Events & listeners
- **Listens to:**
  - `start_extending` → transitions to `extending`
  - `start_retracting` → transitions to `retracting`
  - `start_mounting` → transitions to `mounted`
  - `start_abandoning` → transitions to `abandon_ship`
  - `stop_mounting` → transitions to `extended`
  - `animover` (in `extending`, `retracting`) → transitions to `extended`/`retracted`
- **Pushes:** None — this stategraph only reacts to events, not emits its own.