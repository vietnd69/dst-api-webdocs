---
id: diseaseflies
title: Diseaseflies
description: Spawns a non-persistent visual effects entity (flies swarm) attached to a parent entity, playing a looping animation and sound.
tags: [fx, visual, sound, network]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: dc8c5e84
system_scope: fx
---

# Diseaseflies

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `diseaseflies` prefab creates a local-only visual effect representing a swarm of flies (typically used on diseased or corrupted entities). It is not part of the core ECS component system but is instead instantiated as a standalone FX prefab. The effect attaches to a parent entity (if present) or to a proxy transform, plays an animation sequence (`swarm_pre` → loops → `swarm_pst`), emits a sound, and automatically removes itself after a fixed lifetime. It is designed to run only on clients (not dedicated servers) and does not persist or sync via the network.

## Usage example
```lua
-- Spawns the flies effect and attaches it to `parent_entity`
local flies = SpawnPrefab("diseaseflies")
flies.components.diseaseflies.SetLoops(flies, 3)  -- optional: override default loop count
flies:SetParent(parent_entity)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `FX` and `NOCLICK` to the effect entity. Does not interact with parent entity tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_loops` | `net_tinybyte` proxy | `5` | Number of `swarm_loop` animations to play; settable via `SetLoops()` on master only. |

## Main functions
### `SetLoops(inst, loops)`
* **Description:** Sets how many times the `swarm_loop` animation plays before transitioning to `swarm_pst`. This function is exposed as a method on the master instance (`inst.SetLoops = SetLoops`), but is only usable on the master simulation (i.e., server in DST).  
* **Parameters:**  
  - `inst` (entity) — the diseaseflies instance.  
  - `loops` (number) — number of loop iterations (`1` to `255` range implied by `net_tinybyte`).  
* **Returns:** Nothing.  
* **Error states:** No-op on clients; effective only on master (server). Must be called before the animation completes.

## Events & listeners
- **Listens to:** `animqueueover` — triggers `inst.Remove()` to destroy the FX entity after the animation sequence finishes.  
- **Pushes:** None identified.