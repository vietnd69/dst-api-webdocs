---
id: camerashake
title: Camerashake
description: Generates procedural camera shake offsets for visual feedback during gameplay events.
tags: [fx, camera, animation]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 52f1b726
system_scope: fx
---

# Camerashake

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`CameraShake` is a utility class that computes frame-by-frame camera displacement vectors to simulate screen shake effects (e.g., explosions, impacts, or magical bursts). It implements a directional stepping algorithm derived from `Shank2/Ninja CameraShake.cpp`, where shake direction cycles through a predefined set of normalized offsets based on the selected mode (`FULL`, `SIDE`, or `VERTICAL`). The class tracks time internally and applies linear easing to scale the displacement intensity over the shake duration. It is typically instantiated and used by game logic that requires visual feedback without being attached to an entity component.

## Usage example
```lua
local CameraShake = require("camerashake")
local shake = CameraShake(CAMERASHAKE.FULL, 0.5, 0.05, 2.0)

local dt = 1/60 -- per-frame delta time
local offset = shake:Update(dt)
if offset ~= nil then
    -- Apply offset to camera position
    camera:SetPosition(camera:GetPosition() + offset)
end
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `mode` | `CAMERASHAKE.*` constant | `CAMERASHAKE.FULL` | Defines which set of directional offsets to use (`FULL`, `SIDE`, or `VERTICAL`). |
| `duration` | number | `1` | Total duration (in seconds) of the shake effect. |
| `speed` | number | `0.05` | Time interval (in seconds) between directional changes; smaller values produce faster shaking. |
| `scale` | number | `1` | Maximum amplitude (world units) of the shake displacement. |
| `currentTime` | number | `0` | Internal counter tracking elapsed time (readable via `self.currentTime`). |

## Main functions
### `CameraShake(mode, duration, speed, scale)`
*   **Description:** Constructor. Initializes shake parameters and resets the shake state.
*   **Parameters:**  
    `mode` (optional `CAMERASHAKE.*` constant) — shake pattern type.  
    `duration` (optional number) — shake duration in seconds.  
    `speed` (optional number) — time step between direction changes.  
    `scale` (optional number) — displacement intensity factor.  
*   **Returns:** A new `CameraShake` instance.  
*   **Error states:** Invalid `mode` values default to `CAMERASHAKE.FULL`.

### `StopShaking()`
*   **Description:** Immediately halts the shake effect by resetting all state variables.
*   **Parameters:** None.  
*   **Returns:** Nothing.  

### `Update(dt)`
*   **Description:** Computes and returns the current shake displacement vector for the given time step. If the shake has ended or parameters are invalid, it calls `StopShaking()` and returns `nil`.
*   **Parameters:**  
    `dt` (number) — elapsed time since last frame (in seconds).  
*   **Returns:**  
    `Vector3` — the computed displacement vector (x,y,0).  
    `nil` — if shaking has ceased.  
*   **Error states:** Returns `nil` and stops shaking if `mode` is `nil`, `speed` is `0`, or `duration` is `0`.

## Events & listeners
Not applicable.