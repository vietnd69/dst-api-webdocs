---
id: reticulelong
title: Reticulelong
description: Creates visual reticle FX entities for targeting and pinging, supporting static display or animated scaling/color pulsing effects.
tags: [ui, fx, visual, targeting]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 42638add
system_scope: fx
---

# Reticulelong

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`reticulelong` defines a reusable Prefab factory for generating visual targeting reticles in the game world. These are non-persistent FX entities (tagged `FX` and `NOCLICK`) used for dynamic visual feedback, such as attack indicators or ping effects. The component supports both static rendering and a pulsing animation via `UpdatePing`, which modulates scale, additive, and multiplicative color over time using interpolation and exponential decay.

## Usage example
```lua
-- Create a basic static reticle
local reticule = Prefab("reticulelong")
local inst = reticule()

-- Create a pinging reticle (animated scaling + flash effect)
local pinging_reticule = Prefab("reticulelongping")
local ping_inst = pinging_reticule()
ping_inst.components.reticulelong.SetChargeScale(ping_inst, 2)  -- Optional: scale override
```

## Dependencies & tags
**Components used:** `animstate`, `transform`
**Tags:** Adds `FX`, `NOCLICK`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `chargescale` | number | `1` | Base scale multiplier applied before the static `SCALE` factor. Set via `SetChargeScale`. |
| `SetChargeScale` | function | `nil` | Reference to the `SetChargeScale` helper function, exposed on ping-enabled instances. |

## Main functions
### `SetChargeScale(inst, chargescale)`
*   **Description:** Sets the `chargescale` property and applies the combined scale to the anim state.
*   **Parameters:**  
    `inst` (Entity) — the entity instance.  
    `chargescale` (number) — the base scale multiplier to apply.
*   **Returns:** Nothing.

### `UpdatePing(inst, s0, s1, t0, duration, multcolour, addcolour)`
*   **Description:** Animates the reticle’s scale and color over time using a quadratic easing curve. Used to produce a pulsing ping effect. Called via `DoPeriodicTask` while active.
*   **Parameters:**  
    `inst` (Entity) — the entity instance.  
    `s0` (table `{x,y}`) — initial scale vector.  
    `s1` (table `{x,y}`) — target scale vector.  
    `t0` (number) — start timestamp (from `GetTime()`).  
    `duration` (number) — total animation duration in seconds.  
    `multcolour` (table `{r,g,b,a}`) — vector for multiplicative color tint.  
    `addcolour` (table `{r,g,b,a}`) — vector for additive color flash.
*   **Returns:** Nothing.

## Events & listeners
**None identified.**  
*(Note: Uses `DoPeriodicTask`/`DoTaskInTime` for internal scheduling, but does not register or push any game events.)*