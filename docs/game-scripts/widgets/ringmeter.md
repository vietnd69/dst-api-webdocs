---
id: ringmeter
title: RingMeter
description: Displays a circular progress meter on-screen, typically used to indicate time-based events such as buff durations or cooldowns, with support for fading and flashing animations.
tags: [ui, animation, timer]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 3e4fa83b
system_scope: ui
---

# RingMeter

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`RingMeter` is a UI widget that renders a circular progress ring (using the `ringmeter` animation build) to visually indicate elapsed time against a total duration. It extends `Widget` and manages its own animation state, position, scaling, and fade/flash transitions. It is designed to be displayed in screen space and updated per-frame to reflect time progression or animation effects.

## Usage example
```lua
local RingMeter = require "widgets/ringmeter"
local owner = Entity()  -- any entity acting as owner
local meter = RingMeter(owner)
meter:SetWorldPosition(Vector3(10, 5, 0))
meter:StartTimer(5)  -- show 5-second timer
-- Later, to trigger a flash effect:
-- meter:FlashOut(0.5)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | `nil` | The entity associated with this meter; stored but not used internally. |
| `meter` | UIAnim | `nil` | The animated UI child widget that renders the ring. |
| `pos` | Vector3 | `nil` | World position used to determine screen position via `TheSim:GetScreenPos`. |

## Main functions
### `SetWorldPosition(pos)`
* **Description:** Updates the meter's screen position based on the provided world position.
* **Parameters:** `pos` (Vector3) – the world-space position to map to screen coordinates.
* **Returns:** Nothing.

### `StartTimer(duration, starttime)`
* **Description:** Begins a progress animation over the specified duration. The meter fills from `starttime` (default `0`) to `duration`.
* **Parameters:**  
  - `duration` (number) – total time in seconds for the full cycle.  
  - `starttime` (number, optional) – initial elapsed time (default `0`).  
* **Returns:** Nothing.

### `FadeOut(duration)`
* **Description:** Initiates a fade-out effect where the meter's alpha decreases over time until it is removed.
* **Parameters:** `duration` (number, optional) – fade duration in seconds (default `0.2`).  
* **Returns:** Nothing.

### `FlashOut(duration)`
* **Description:** Triggers a flash animation followed by fade-out. Plays the `flash` animation, scales up, then fades.
* **Parameters:** `duration` (number, optional) – total animation scale/flash duration in seconds (default `0.5`).  
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Called automatically while active to update progress, fade, or flash states. Handles time accumulation and animation adjustments.
* **Parameters:** `dt` (number) – delta time in seconds since the last frame.
* **Returns:** Nothing.
* **Error states:** Returns early if `TheNet:IsServerPaused()` is true.

## Events & listeners
- **Pushes:** `self:Kill()` is called internally when fade/flash completes, which triggers the widget's own destruction (not an event pushed by this component itself).  
*(No explicit `inst:PushEvent` or `inst:ListenForEvent` calls are present.)*