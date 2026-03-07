---
id: lunar_goop_trail_fx
title: Lunar Goop Trail Fx
description: Manages visual trail particle effects for lunar-related gameplay elements, playing an animated sequence with fade-out and optional callback support.
tags: [fx, visual, animation]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1b4b5e32
system_scope: fx
---

# Lunar Goop Trail Fx

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lunar_goop_trail_fx` is a prefab-based entity component that renders a short animated particle trail effect (e.g., for lunar goop projectiles or environmental interactions). It uses an `ANIM` asset, plays a three-stage animation sequence (`_pre` → active trail → `_pst`), handles scaling and timing, and supports cleanup or custom callbacks upon completion. This effect is non-interactive (`NOCLICK`) and persists only on the client (`persists = false` on the master), with the transform and `AnimState` component managing its visual appearance and layering.

## Usage example
```lua
local inst = SpawnPrefab("lunar_goop_trail_fx")
if inst ~= nil then
    inst.components.transform:SetPosition(x, y, z)
    inst:SetVariation(2, Vector(1, 1, 1), 1.5)
end
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `network`  
**Tags:** Adds `FX`, `NOCLICK`  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `trailname` | string | `"trail1"` | Base animation name used to construct pre-active-post animation sequences (`trailname.."_pre"`, `trailname`, `trailname.."_pst"`). |
| `duration` | number | `1` | Duration in seconds the active animation plays before initiating the fade-out stage. |
| `task` | task (optional) | `nil` | Active timer used to schedule the fade-out stage; cancels on `SetVariation` or `Dissipate`. |
| `onfinished` | function (optional) | `nil` | Optional callback executed when the post-fade animation completes. |

## Main functions
### `SetVariation(rand, scale, duration)`
*   **Description:** Updates the effect’s animation variation, scale, and duration, restarting the animation sequence from the pre-stage. Typically used to randomize or adjust trail appearance dynamically.
*   **Parameters:**  
  `rand` (number) - Integer index (1–3+) determining which trail animation to use (`trailX`).  
  `scale` (Vector or number) - Uniform scale factor applied to the entity (`Vector(x, y, z)` or single scalar).  
  `duration` (number) - Duration (in seconds) to hold the active trail animation before fading.
*   **Returns:** Nothing.
*   **Error states:** Cancels any existing `task` before setting up a new animation sequence.

### `Dissipate()`
*   **Description:** Immediately initiates the fade-out (`_pst`) animation stage, cancelling any pending active-duration task. Useful for prematurely ending the trail effect.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** If no active `task` exists, sets `duration` to `0` to trigger instant fade-out.

## Events & listeners
- **Listens to:** `animover` - triggers `OnAnimOver` to transition from pre → active → post animation stages and finalize cleanup.  
- **Pushes:** None identified.