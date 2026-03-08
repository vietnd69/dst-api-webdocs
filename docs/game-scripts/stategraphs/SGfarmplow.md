---
id: SGfarmplow
title: Sgfarmplow
description: Manages the animation and timing states for placing and drilling with the Farm Plow entity.
tags: [animation, stategraph, farm, tool]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 6d27c21e
system_scope: entity
---

# Sgfarmplow

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGfarmplow` is a stategraph that defines the animation-driven behavior of the Farm Plow entity. It coordinates the "place" and "drilling" states, handling animation playback, timeout transitions, and sound feedback during plow usage. The stategraph is shared across all Farm Plow instances and is not tied to a specific component — it is instantiated and used directly by the `farmplow` prefab via the `StateGraph` system.

## Usage example
```lua
-- Automatically attached to the farmplow prefab
-- No manual component setup is required; the stategraph is used internally
-- Example of triggering drilling via external logic (e.g., after placement):
inst.sg:GoToState("drilling", 5.0) -- drill_time = 5 seconds
```

## Dependencies & tags
**Components used:** None (this is a `StateGraph`, not a component; it uses `AnimState`, `SoundEmitter`, and `sg` services attached to the entity via the entity itself).  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
This stategraph uses only the standard stategraph state definitions. No custom functions are defined.

## Events & listeners
- **Listens to:** `animover` — triggers transition to `drilling` state if the animation completes.
- **Pushes:** None.
