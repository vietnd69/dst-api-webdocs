---
id: SGgelblob
title: Sggelblob
description: Manages state transitions and behavior for the Gelatinous Blob entity, including spawning, shrinking/growing, and death animations.
tags: [animation, entity, state-machine, boss]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: ed81ad82
system_scope: entity
---

# Sggelblob

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGgelblob` defines the state machine for the Gelatinous Blob entity, a boss-like creature in DST that can change size, spawn via delay, and respond to damage. It manages animations (including shared back-layer animations), sound effects, shadow scaling, sanity aura effects, and interaction with the `health` and `sanityaura` components. It extends common electrocution states and uses timeline/frame events to coordinate timed gameplay effects during transitions.

## Usage example
This stategraph is automatically assigned to the `gelblob` prefab during entity instantiation and is not manually invoked. A typical invocation pattern is handled internally by the engine:
```lua
-- internally in the prefab definition (not user-modifiable directly)
inst.entity:AddPhysics()
inst:AddTag("gelblob")
inst:AddStateGraph("gelblob", "SGgelblob")
```

## Dependencies & tags
**Components used:** `health`, `sanityaura`
**Tags:** `gelblob`, `boss`, `monster`, `prey`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst.size` | string | `"_big"` | Current size suffix used for animations and sounds (`"_big"`, `"_med"`, `"_small"`). Managed via state transitions (`shrink_*`, `grow_*`). |

## Main functions
### `_PlayAnimation(inst, anim, loop)`
* **Description:** Plays an animation on both the main and back `AnimState` components, appending the entity’s `inst.size` suffix (e.g., `"idle_big"`).
* **Parameters:** `inst` (entity instance), `anim` (string base animation name), `loop` (boolean — whether to loop).
* **Returns:** Nothing.

### `_PushAnimation(inst, anim, loop)`
* **Description:** Pushes an animation onto the animation queue (non-blocking), appending the entity’s `inst.size` suffix.
* **Parameters:** `inst` (entity instance), `anim` (string base animation name), `loop` (boolean).
* **Returns:** Nothing.

### `SetShadowScale(inst, scale)`
* **Description:** Adjusts the entity’s dynamic shadow size proportionally using `scale`, based on in-progress animation frames during spawning or shrinking.
* **Parameters:** `inst` (entity instance), `scale` (number — multiplier for shadow width/height).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"jiggle"` (custom event) — triggers `jiggle` state if not busy/dead and `caninterrupt` is allowed.  
  - `"animover"` (in `spawn`, `hit`, `jiggle`, `spit`, `shrink_*`, `grow_*` states) — transitions back to `idle` when animation completes.  
  - `"onelectrocute"`, `"onattacked"`, `"ondeath"` — handled via `CommonHandlers.OnElectrocute()`, etc., integrated into `events` list.  
- **Pushes:**  
  - `"healthdelta"` — triggered by `health:DoDelta()` during electrocution state.  
  - `"animover"` — implicitly fired by the engine when animations complete, then handled by state callbacks.