---
id: marionette_fx
title: Marionette Fx
description: Creates client-side visual effects for the Marionette stage actor's appearance and disappearance animations with fading and sound playback.
tags: [fx, animation, sound]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8b3286b2
system_scope: fx
---

# Marionette Fx

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`marionette_fx.lua` defines two prefabs: `marionette_appear_fx` and `marionette_disappear_fx`, which provide visual and audio effects for the Marionette character entering or exiting the stage. These prefabs use `AnimState`, `SoundEmitter`, and the `fader` component to animate alpha transparency and trigger timed events. The prefabs are non-persistent (`persists = false`) and are created only on the master simulation.

## Usage example
```lua
-- Spawn an appearance effect
local fx_appear = Prefab("marionette_appear_fx", marionette_appear_fn, assets)
local inst = fx_appear()

-- Adjust fade-out timing (optional)
inst:SetTime(5 * FRAMES)

-- Spawn a disappearance effect
local fx_disappear = Prefab("marionette_disappear_fx", marionette_disappear_fn, assets)
local inst2 = fx_disappear()

-- Adjust exit timing (optional)
inst2:SetTime(10 * FRAMES)
```

## Dependencies & tags
**Components used:** `fader`, `transform`, `animstate`, `soundemitter`, `network`
**Tags:** Adds `FX` to all created entities.

## Properties
No public properties.

## Main functions
The module exposes two top-level functions via `return Prefab(...)`, not methods on a component class. However, the prefabs expose the following instance methods after construction:

### `inst:SetTime(time)`
*   **Description:** Sets or updates the delay before the fade-out (for appearance fx) or exit animation (for disappearance fx) begins. Cancels any previously scheduled task.
*   **Parameters:** `time` (number, optional) — delay in seconds or frames. Defaults to `FRAMES` if omitted.
*   **Returns:** Nothing.
*   **Error states:** No return value; silently cancels prior scheduled tasks.

## Events & listeners
- **Listens to:** `animover` — for disappearance fx, fires `inst.Remove` when animation completes.
- **Pushes:** None.
