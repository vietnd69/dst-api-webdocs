---
id: camerashake
title: Camerashake
description: Calculates camera offset vectors for vibration effects over time.
tags: [fx, camera, utility]
sidebar_position: 10

last_updated: 2026-03-21
build_version: 714014
change_status: stable
category_type: root
source_hash: 52f1b726
system_scope: fx
---

# Camerashake

> Based on game build **714014** | Last updated: 2026-03-21

## Overview
`CameraShake` is a utility class that calculates dynamic offset vectors to simulate camera vibration. It is not an Entity Component System component attached to an entity, but rather a standalone object instantiated by scripts to manage screen shake effects. It uses easing functions to interpolate between predefined directional deltas over a specified duration.

## Usage example
```lua
local CameraShake = require("camerashake")

-- Create a shake instance with full mode, 2 seconds duration
local shake = CameraShake(CAMERASHAKE.FULL, 2, 0.05, 1)

-- In an update loop
local dt = 0.016
local offset = shake:Update(dt)
-- Apply offset to camera logic
```

## Dependencies & tags
**Modules required:** `easing`
**Components used:** None (Utility class)
**Tags:** None

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `mode` | number | `CAMERASHAKE.FULL` | The shake pattern mode set during construction. |
| `duration` | number | `1` | Total duration of the shake effect in seconds. |
| `speed` | number | `0.05` | Speed factor influencing the interpolation rate. |
| `scale` | number | `1` | Magnitude multiplier for the shake offset. |
| `currentTime` | number | `0` | Tracks elapsed time since shake started. |

## Main functions
### `StopShaking()`
*   **Description:** Immediately halts the shake effect and resets all internal state values to defaults.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Update(dt)`
*   **Description:** Advances the shake simulation by `dt` seconds and returns the current camera offset vector. Automatically stops shaking if the duration expires.
*   **Parameters:** `dt` (number) - Delta time in seconds since the last frame.
*   **Returns:** `Vector3` - The calculated shake offset for this frame. Returns `nil` implicitly if shaking stops internally before calculation completes.
*   **Error states:** If `self.shakeType` is not set externally, it defaults to `CAMERASHAKE.FULL` logic due to fallback in source code.

## Events & listeners
Not applicable. This is a utility class and does not interact with the entity event system.