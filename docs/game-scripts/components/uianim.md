---
id: uianim
title: Uianim
description: Manages animation timelines for UI widgets, including tint, scale, position, and rotation transitions.
tags: [ui, animation, entity]
sidebar_position: 10
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: d11ee69e
system_scope: ui
---
# Uianim

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`UIAnim` is a component responsible for animating UI-related properties of an entity—specifically tint, scale, position, and rotation—using time-based transitions. It leverages the `UITransform` and `widget` subcomponents of an entity and integrates with DST's wall-updating system via `StartWallUpdatingComponent`. Animations use cubic easing (`easing.outCubic`) for smooth interpolation.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("uianim")
-- Tint from white to red over 1 second
inst.components.uianim:TintTo({r=1,g=1,b=1,a=1}, {r=1,g=0,b=0,a=1}, 1.0)
-- Scale from 1x to 1.5x over 0.5 seconds
inst.components.uianim:ScaleTo(1, 1.5, 0.5)
-- Move from (0,0,0) to (10,5,0) over 2 seconds
inst.components.uianim:MoveTo({x=0,y=0,z=0}, {x=10,y=5,z=0}, 2.0)
-- Rotate from 0° to 360° over 3 seconds (infinite loop)
inst.components.uianim:RotateTo(0, 360, 3.0, nil, true)
```

## Dependencies & tags
**Components used:** `UITransform` (for position, scale, rotation), `widget` (for tint)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the owning entity. |
| `update_while_paused` | boolean | `true` | Whether animations continue updating when the game is paused. |

## Main functions
### `UpdateWhilePaused(update_while_paused)`
* **Description:** Configures whether the component continues updating during game pause.
* **Parameters:** `update_while_paused` (boolean) — if `true`, animation updates during pause; otherwise, updates are suspended.
* **Returns:** Nothing.

### `TintTo(start, dest, duration, whendone)`
* **Description:** Begins a tint transition from `start` to `dest` over `duration` seconds. Requires `widget.SetTint` to exist on `inst`.
* **Parameters:**  
  - `start` (table) — `{r, g, b, a}` initial tint values (0–1).  
  - `dest` (table) — `{r, g, b, a}` target tint values (0–1).  
  - `duration` (number) — animation duration in seconds.  
  - `whendone` (function, optional) — callback invoked upon completion.
* **Returns:** Nothing.
* **Error states:** Returns early without starting animation if `inst.widget.SetTint` is not available.

### `FinishCurrentTint()`
* **Description:** Immediately snaps the tint to the destination value, cancels the ongoing tint animation, and invokes the `whendone` callback.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Returns early if `inst` is invalid.

### `CancelTintTo(run_complete_fn)`
* **Description:** Immediately cancels the current tint animation. Optionally runs the completion callback.
* **Parameters:** `run_complete_fn` (boolean or nil) — if truthy and a `whendone` callback exists, it is invoked before cancellation.
* **Returns:** Nothing.

### `ScaleTo(start, dest, duration, whendone)`
* **Description:** Begins a scale transition from `start` to `dest` over `duration` seconds.
* **Parameters:**  
  - `start` (number) — initial scale factor.  
  - `dest` (number) — target scale factor.  
  - `duration` (number) — animation duration in seconds.  
  - `whendone` (function, optional) — callback invoked upon completion.
* **Returns:** Nothing.
* **Error states:** Finishes and cancels any previous scale animation before starting a new one.

### `FinishCurrentScale()`
* **Description:** Snaps the scale to `dest`, cancels the scale animation, and invokes `whendone`.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Returns early if `inst` is invalid.

### `CancelScaleTo(run_complete_fn)`
* **Description:** Cancels the current scale animation. Optionally runs the completion callback.
* **Parameters:** `run_complete_fn` (boolean or nil) — if truthy and a `scale_whendone` callback exists, it is invoked before cancellation.
* **Returns:** Nothing.

### `MoveTo(start, dest, duration, whendone)`
* **Description:** Begins a position transition from `start` to `dest` over `duration` seconds.
* **Parameters:**  
  - `start` (table) — `{x, y, z}` initial position.  
  - `dest` (table) — `{x, y, z}` target position.  
  - `duration` (number) — animation duration in seconds.  
  - `whendone` (function, optional) — callback invoked upon completion.
* **Returns:** Nothing.

### `CancelMoveTo(run_complete_fn)`
* **Description:** Cancels the current position animation. Optionally runs the completion callback.
* **Parameters:** `run_complete_fn` (boolean or nil) — if truthy and a `pos_whendone` callback exists, it is invoked before cancellation.
* **Returns:** Nothing.

### `RotateTo(start, dest, duration, whendone, infinite)`
* **Description:** Begins a rotation transition from `start` to `dest` over `duration` seconds. If `infinite` is `true`, treats `dest` as a per-frame delta rotation applied repeatedly.
* **Parameters:**  
  - `start` (number) — initial rotation in degrees.  
  - `dest` (number) — target rotation (or delta if `infinite`).  
  - `duration` (number) — animation duration in seconds.  
  - `whendone` (function, optional) — callback invoked upon completion.  
  - `infinite` (boolean, optional) — if `true`, applies continuous rotation.
* **Returns:** Nothing.

### `CancelRotateTo(run_complete_fn)`
* **Description:** Cancels the current rotation animation. Optionally runs the completion callback.
* **Parameters:** `run_complete_fn` (boolean or nil) — if truthy and a `rot_whendone` callback exists, it is invoked before cancellation.
* **Returns:** Nothing.

### `OnWallUpdate(dt)`
* **Description:** Internal update method called every frame while the component is active. Processes animation steps for tint, scale, position, and rotation.
* **Parameters:** `dt` (number) — time elapsed since the last frame.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None. Callbacks are invoked directly as functions (`whendone()`), not via `PushEvent`.
