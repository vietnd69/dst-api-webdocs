---
id: rose_petals_fx
title: Rose Petals Fx
description: Creates a short-lived visual effect of falling rose petals, typically used for ambiance or cinematic moments.
tags: [fx, cinematic, visual]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1bd84ff6
system_scope: fx
---

# Rose Petals Fx

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`rose_petals_fx` is a simple entity prefab that renders a one-time falling rose petal animation. It is designed to be spawned for transient visual effects — for example, during atmospheric or narrative moments — and is automatically removed after its animation completes. It has no persistent logic on the server and is not replicated beyond its initial spawn and animation playback.

## Usage example
```lua
-- Spawn the rose petals effect at a specific world position
local inst = Prefab("rose_petals_fx")
inst.Transform:SetPosition(x, y, z)
inst.AnimState:PlayAnimation("fall")
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** Adds `FX` tag.

## Properties
No public properties.

## Main functions
### `fn()`
* **Description:** The prefab constructor function. Initializes the entity with required components (`Transform`, `AnimState`, `SoundEmitter`, `Network`), sets up animation playback for the falling petal effect, and registers cleanup behavior if running on the master simulation.
* **Parameters:** None.  
* **Returns:** `inst` (TheEntity) — the constructed entity instance.  
* **Error states:** Returns early on non-master clients without further setup.

### `ErodeAway(event)`
* **Description:** Cleanup function called automatically when the animation completes (via the `animover` event). Removes the entity from the world.
* **Parameters:** `event` (string) — the event name (`"animover"`).  
* **Returns:** Nothing.  
* **Error states:** Not applicable.

## Events & listeners
- **Listens to:** `animover` — triggers `ErodeAway` to remove the entity after animation finishes.
- **Pushes:** None.