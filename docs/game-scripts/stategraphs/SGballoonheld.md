---
id: SGballoonheld
title: Sgballoonheld
description: Manages the animation and sound state machine for a balloon held by an entity.
tags: [animation, audio, entity]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: e4e701aa
system_scope: entity
---

# Sgballoonheld

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGballoonheld` is a stategraph that defines the animation and sound sequence states for a held balloon (specifically the speed balloon), including idle, running start, running loop, running stop, and deflate transitions. It is used by entities that carry and animate a balloon item, responding to internal `_isrunning` state to trigger appropriate visual and audio feedback.

## Usage example
```lua
-- Typically attached automatically to prefabs carrying the balloon via the StateGraph system.
-- Example usage inside a prefab definition:
inst:AddStategraph("balloonheld")
-- The stategraph handles its own transitions; external triggers include setting `inst._isrunning`
-- and sending `sg_update_running_state` events to update the graph accordingly.
```

## Dependencies & tags
**Components used:** None explicitly accessed (uses `inst.AnimState`, `inst.SoundEmitter`, `inst.sg`, `inst:UpdateBalloonSymbol()` — typically provided by owning prefab or attached components).
**Tags:** None identified.

## Properties
No public properties.

## Main functions
This stategraph is defined entirely via state declarations and does not expose standalone functions.

## Events & listeners
- **Listens to:**
  - `sg_update_running_state` — triggers state transitions between idle/running based on `inst._isrunning`.
  - `animover` — responds to animation completion to advance state (e.g., from `start_running` to `running`, or from `stop_running` to `idle`).
- **Pushes:** Nothing — this is a passive stategraph, does not fire events.