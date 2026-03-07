---
id: reticuleaoe
title: Reticuleaoe
description: Factory function that creates prefabs for area-of-effect visual indicators (reticules, pings, and targets) used in placement and targeting interfaces.
tags: [visual, placement, ui, fx]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e09085d8
system_scope: fx
---

# Reticuleaoe

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`reticuleaoe` is a prefab factory module that defines reusable visual indicators for area-of-effect (AoE) placement and targeting. It provides three distinct types of FX entities: `reticule` (static placement guides), `ping` (expanding/collapsing scale animations for radius visualization), and `target` (fade-controlled markers for targets). These prefabs are used in UI contexts such as building placement, ability targeting, and event-based feedback.

## Usage example
```lua
-- Spawn a standard AoE reticule for building placement
local reticule = SpawnPrefab("reticuleaoe")
reticule.Transform:SetPosition(x, y, z)

-- Spawn a ping to indicate valid/invalid placement
local ping = SpawnPrefab("reticuleaoeping")
ping.Transform:SetPosition(x, y, z)

-- Spawn a target marker for hostile/enemy targets
local target = SpawnPrefab("reticuleaoehostiletarget")
target.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `FX` and `NOCLICK` to all generated entities.

## Properties
No public properties

## Main functions
### `MakeReticule(name, anim, fixedorientation, postinit)`
* **Description:** Constructs a static visual reticule prefab used for placement indication (e.g., building or ability AoE preview). Supports optional post-initialization hook.
* **Parameters:**
  * `name` (string) — Prefab name.
  * `anim` (string or table) — Animation name or a table with `bank`, `build`, and `anim` fields.
  * `fixedorientation` (boolean) — If true, uses `ANIM_ORIENTATION.OnGroundFixed`; otherwise `ANIM_ORIENTATION.OnGround`.
  * `postinit` (function, optional) — Callback to customize the entity after creation.
* **Returns:** Prefab — Returns the constructed prefab definition.

### `MakePing(name, anim, fixedorientation, scaleup, postinit)`
* **Description:** Constructs a scaling ping prefab that expands and fades over time. Used to provide feedback on valid/invalid placement radius.
* **Parameters:**
  * `name` (string) — Prefab name.
  * `anim` (string or table) — Animation definition.
  * `fixedorientation` (boolean) — Orientation mode.
  * `scaleup` (number) — Target scale multiplier applied during ping animation.
  * `postinit` (function, optional) — Callback for post-initialization.
* **Returns:** Prefab — Returns the constructed ping prefab definition.

### `MakeTarget(name, anim, fixedorientation, colour)`
* **Description:** Constructs a target marker prefab with fade-in/out behavior (used for enemy/friendly/targeted entities). Uses networked fade state for client-server sync.
* **Parameters:**
  * `name` (string) — Prefab name.
  * `anim` (string or table) — Animation definition.
  * `fixedorientation` (boolean) — Orientation mode.
  * `colour` (table) — RGBA color values `{r, g, b, a}` used for overlay and fade effect.
* **Returns:** Prefab — Returns the constructed target prefab definition.

## Events & listeners
### MakeTarget-specific:
- **Listens to:** `fadedirty` — Triggered on the client to re-sync fade animation from master.
- **Pushes:** None directly. (`fadedirty` is fired externally via `net_smallbyte` when fade state changes.)
