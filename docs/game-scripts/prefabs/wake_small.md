---
id: wake_small
title: Wake Small
description: Creates a small visual water-squid wake effect particle with randomized animation.
tags: [fx, world, visual]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3790fe51
system_scope: fx
---

# Wake Small

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wake_small` is a lightweight entity prefab that generates a small, background-level visual effect simulating water disturbances—typically associated with a squid's movement. It is instantiated once per effect and automatically removes itself after its animation completes. It uses `ANIM_ORIENTATION.OnGround`, resides on the `LAYER_BACKGROUND`, and has no logic or simulation components beyond basic animation and network sync.

## Usage example
```lua
-- This prefab is not meant to be instantiated manually via `AddComponent`.
-- It is used as a prefab via `SpawnPrefab("wake_small")` or via prefabs that reference it.
-- Example usage (internal):
local wake = SpawnPrefab("wake_small")
wake.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `network`  
**Tags:** Adds `fx` on the instance.

## Properties
No public properties.

## Main functions
Not applicable.

## Events & listeners
- **Listens to:** `animover` — triggers automatic removal of the entity (`inst.Remove`) when the animation finishes playing.