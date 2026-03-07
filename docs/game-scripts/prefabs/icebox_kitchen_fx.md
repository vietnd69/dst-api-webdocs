---
id: icebox_kitchen_fx
title: Icebox Kitchen Fx
description: Plays a one-shot visual effect animation sequence (pre, loop, pst) for the icebox kitchen event in DST.
tags: [fx, environment, event]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9a933bab
system_scope: fx
---

# Icebox Kitchen Fx

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`icebox_kitchen_fx` is a lightweight, non-persistent FX prefab that plays a predefined 3-stage animation sequence (`pre` → `loop` → `pst`) to visualize events in the icebox kitchen environment. It is typically instantiated as a temporary entity to provide visual feedback during gameplay sequences and automatically destroys itself after playback completes.

## Usage example
```lua
local fx = SpawnPrefab("icebox_kitchen_fx")
fx.Transform:SetPosition(x, y, z)
fx.components.performance:Play() -- Note: Not applicable for this specific prefab; See Main functions for actual usage
fx.Kill() -- Optional early termination
```

## Dependencies & tags
**Components used:** `animstate`, `transform`, `network`  
**Tags:** Adds `FX`

## Properties
No public properties

## Main functions
### `Kill()`
* **Description:** Triggers immediate termination of the animation sequence. If the `pst` animation has not yet started, it schedules completion of the current animation before removing the entity.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None.

### `OnKillTask(inst)` (internal)
* **Description:** Final callback that plays the `pst` (post) animation, waits for its duration plus a small frame buffer, then removes the entity. Not intended for direct external call.
* **Parameters:** `inst` (Entity) — the FX instance.
* **Returns:** Nothing.
* **Error states:** None.

## Events & listeners
None identified