---
id: SGmultiplayerportal
title: Sgmultiplayerportal
description: Controls the animation, sound, and state transitions for multiplayer portal entities, including spawn, construction, and idle phases.
tags: [portal, animation, sound, construction]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 38bb3b11
system_scope: entity
---

# Sgmultiplayerportal

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGmultiplayerportal` is a stategraph implementation that governs the visual and audio behavior of multiplayer portal entities. It handles state transitions between idle, spawn preparation/loop/post, and multi-stage construction phases (phases 2–4), coordinating animations, sounds, and mesh visibility. The stategraph is self-contained and uses helper functions for consistent playback across the main entity and its optional `fx` child entity.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("stategraph")
inst.sg = inst.components.stategraph
inst.sg:SetStateGraph("SGmultiplayerportal")
-- Set initial state memory for construction portals
inst.sg.mem.constructionphase = 1
inst.sg.mem.targetconstructionphase = 1
-- Begin playback
inst.sg:GoToState("idle")
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds tags dynamically per state: `idle`, `busy`, `open`, `canrotate`, `construction`, `NOCLICK`. Tags are removed in `onexit` handlers as needed.

## Properties
No public properties

## Main functions
### `PlaySound(inst, sound, id)`
* **Description:** Plays a sound asset if it exists and is not already playing (optionally filtered by ID).  
* **Parameters:**  
  - `inst` (Entity): The entity owning the `SoundEmitter` component.  
  - `sound` (string): Key referencing a sound string in `inst.sounds`.  
  - `id` (string?, optional): Sound ID to prevent re-triggering.  
* **Returns:** Nothing.

### `PlayAnimation(inst, anim, loop, update_while_paused)`
* **Description:** Plays a named animation on the main entity (and its `fx` child if present), optionally enabling paused-paused animation and looping.  
* **Parameters:**  
  - `inst` (Entity): The entity with `AnimState`.  
  - `anim` (string): Animation name.  
  - `loop` (boolean?, optional): Whether to loop the animation.  
  - `update_while_paused` (boolean, optional): Whether animation updates while paused.  
* **Returns:** Nothing.

### `PushAnimation(inst, anim, loop)`
* **Description:** Pushes a named animation onto the main entity’s and optional `fx`’s animation queue.  
* **Parameters:**  
  - `inst` (Entity): The entity with `AnimState`.  
  - `anim` (string): Animation name.  
  - `loop` (boolean?, optional): Whether to loop the animation.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `animover`: Triggers state transitions after animations complete (e.g., `spawn_pre` → `spawn_loop`).  
  - Timeline events at specific frames (`TimeEvent`) that fire `PlaySound()` calls.  
- **Pushes:** None identified.