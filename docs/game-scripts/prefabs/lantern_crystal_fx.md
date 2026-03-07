---
id: lantern_crystal_fx
title: Lantern Crystal Fx
description: Creates transient visual effect entities representing lantern crystals in ground or held configurations.
tags: [fx, visual, environment]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ba5e2c8c
system_scope: fx
---

# Lantern Crystal Fx

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
This file defines two static prefabs (`lantern_crystal_fx_ground` and `lantern_crystal_fx_held`) that produce short-lived visual effects for lantern crystal interactions. These are non-persistent FX entities—created and immediately discarded—without logic or state beyond animation playback. They are typically used to visually indicate placement or pickup of lantern crystals in the world. Entities include `transform`, `animstate`, and `network` components, and are tagged with `FX`. They do not exist on the client only; they are fully replicated but marked non-persistent.

## Usage example
```lua
-- Create a ground-based lantern crystal FX effect
local fx = Prefab("lantern_crystal_fx_ground")()
fx.Transform:SetPosition(x, y, z)

-- Create a held lantern crystal FX effect
local fx_held = Prefab("lantern_crystal_fx_held")()
fx_held.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** None identified.  
**Components added internally:** `transform`, `animstate`, `network`.  
**Tags:** Adds `FX`.

## Properties
No public properties.

## Main functions
### `KillFX(inst)`
* **Description:** Removes the effect entity immediately. This is attached as a method (`inst.KillFX`) to each instance during server-side construction, allowing external code to terminate the FX early if needed (e.g., on cancel or overwrite).
* **Parameters:** `inst` (Entity) — the effect instance.
* **Returns:** Nothing.

## Events & listeners
None identified.