---
id: boat_water_fx
title: Boat Water Fx
description: Creates a non-persistent visual effect for boat wake trails beneath the water surface.
tags: [fx, environment, boat]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 6f7e81b5
system_scope: fx
---

# Boat Water Fx

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`boat_water_fx` is a lightweight prefab that generates a water trail effect when a boat moves. It is an FX-only entity—non-persistent, non-networked, and not collidable—that renders an animated visual beneath the water surface. The prefab uses `ANIM_ORIENTATION.OnGround`, places itself on `LAYER_BELOW_GROUND`, and integrates with the ocean shader for appropriate blending.

## Usage example
```lua
local inst = Prefab("boat_water_fx", fn, assets)()
inst.Transform:SetPosition(x, y, z)
inst.components.boattrailmover:StartMoving(trail_speed, trail_direction)
```

## Dependencies & tags
**Components used:** `boattrailmover`  
**Tags:** `FX`, `NOBLOCK`, `ignorewalkableplatforms`

## Properties
No public properties

## Main functions
This file defines a Prefab factory function; it does not define custom methods beyond the entity initialization performed in `fn()`.

## Events & listeners
- **Listens to:** `animover` — removes the entity when the animation completes.
- **Pushes:** None.