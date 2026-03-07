---
id: moose_nest_fx
title: Moose Nest Fx
description: Creates non-persistent, client-side particle and sound effects for moose nest interactions (idle and hit states), using a proxy transform for positioning and synchronized animation.
tags: [fx, audio, world, client]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1a984a18
system_scope: fx
---

# Moose Nest Fx

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`moose_nest_fx` is a client-only prefab factory that generates transient visual and audio effects for moose nest interactions. It uses a proxy entity (e.g., a nest) to determine position and animation context, spawns an isolated FX entity with transform, animstate, and sound emitter components, and automatically removes itself after playback completes or after a fixed timeout. The component is used exclusively for gameplay feedback and is never simulated on dedicated servers.

## Usage example
```lua
-- Spawn idle effects (e.g., on nest placement)
local idle_fx = Prefab("moose_nest_fx_idle", Make("idle"), assets)

-- Spawn hit effects (e.g., when nest is disturbed)
local hit_fx = Prefab("moose_nest_fx_hit", Make("hit"), assets)

-- To trigger FX, call the returned function with a proxy (e.g., nest instance)
local proxy = some_nest_entity
local fx_instance = idle_fx() -- position locked to proxy via transform
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** Adds `FX` to spawned effect entities.

## Properties
No public properties.

## Main functions
### `PlayFX(proxy)`
* **Description:** Internal helper that spawns, configures, and plays a single FX entity using the provided proxy for position. Also registers cleanup on animation completion.
* **Parameters:**  
  `proxy` (Entity) — The source entity whose GUID is used to bind the FX transform; used for positioning.
* **Returns:** Nothing.
* **Error states:** Does not return early; assumes `proxy` is valid and contains a GUID.

### `Make(anim)`
* **Description:** Factory generator that returns a function to create a FX entity for a specific animation (`idle` or `hit`). Handles client/server分化, transforms, and lifecycle management.
* **Parameters:**  
  `anim` (string) — The animation name to play (`"idle"` or `"hit"`).
* **Returns:** A zero-argument function that, when invoked, returns a new FX entity instance.
* **Behavior notes:**  
  - On dedicated servers, returns a minimal entity without FX setup.  
  - On clients, delays one frame before `PlayFX` to ensure correct transform sync.  
  - Removes itself after 1 second on the master simulation, or automatically when the animation ends via `animover` event.

## Events & listeners
- **Listens to:** `animover` — triggers `inst.Remove` to delete the FX entity after animation completes.
- **Pushes:** None identified.