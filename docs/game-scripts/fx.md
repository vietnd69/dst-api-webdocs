---
id: fx
title: Fx
description: A runtime script that defines and configures visual and audio effect entities in Don't Starve Together using AnimState, SoundEmitter, and periodic update tasks.
tags: [fx, rendering, audio, animation]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 28f6e804
system_scope: fx
---

# Fx

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The `fx.lua` script defines a library of visual and audio effect configurations used throughout the game. It does not define an ECS component itself but instead populates an `fx` table (typically `FX_TABLE`) with named effect definitions. Each entry specifies animation names, shaders, and a `fn` callback that initializes the entity instance upon spawn. These callbacks perform common setup tasks such as configuring animation orientation/layering, applying bloom and tint effects, adding sound emitters, and scheduling periodic or delayed update logic (e.g., fading alpha, eroding away, or oscillating positions). The script relies heavily on the `AnimState` and `SoundEmitter` components, and uses constants like `FRAMES`, `LAYER`, `ANIM_ORIENTATION`, and `TUNING.OCEAN_SHADER` for consistent FX behavior.

## Usage example
```lua
local FX = require "fx"

-- Spawn a sinkhole warning effect
local fx = SpawnPrefab("sinkhole_warn_fx_1")
if fx ~= nil then
    fx.Transform:SetPos(x, y, z)
    -- The fx definition's `fn` callback will be invoked by the framework upon spawn
    -- It adds a SoundEmitter and plays ground_break with params size=0.01
end

-- Use a utility helper to generate random timing jitter
local time = GetRandomWithVariance(2 * FRAMES, 0.5)
```

## Dependencies & tags
**Components used:**
- `AnimState`
- `SoundEmitter`
- `Transform`
- `Light`

**External constants used:**
- `FRAMES`
- `TUNING.OCEAN_SHADER.EFFECT_TINT_AMOUNT`
- `LAYER_WORLD_BACKGROUND`, `LAYER_BELOW_GROUND`, `LAYER_BACKGROUND`
- `ANIM_ORIENTATION.OnGround`, `ANIM_ORIENTATION.SixFaced`, `ANIM_ORIENTATION.EightFaced`, `ANIM_ORIENTATION.TwoFaced`
- `ANIM_SORT_ORDER`, `ANIM_SORT_ORDER_BELOW_GROUND`

**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| None | — | — | No top-level properties defined. All configuration occurs via fx entry `fn` callbacks and runtime instance properties (e.g., `fall_speed`). |

## Main functions
### `FinalOffset1(inst)`
* **Description:** Applies a final animation offset of `1` to the instance's `AnimState`.
* **Parameters:** `inst` — the FX entity instance.
* **Returns:** `nil` (side-effect only).

### `FinalOffset2(inst)`
* **Description:** Applies a final animation offset of `2` to the instance's `AnimState`.
* **Parameters:** `inst` — the FX entity instance.
* **Returns:** `nil` (side-effect only).

### `FinalOffset3(inst)`
* **Description:** Applies a final animation offset of `3` to the instance's `AnimState`.
* **Parameters:** `inst` — the FX entity instance.
* **Returns:** `nil` (side-effect only).

### `FinalOffsetNegative1(inst)`
* **Description:** Applies a final animation offset of `-1` to the instance's `AnimState`.
* **Parameters:** `inst` — the FX entity instance.
* **Returns:** `nil` (side-effect only).

### `FinalOffsetNegative2(inst)`
* **Description:** Applies a final animation offset of `-2` to the instance's `AnimState`.
* **Parameters:** `inst` — the FX entity instance.
* **Returns:** `nil` (side-effect only).

### `UsePointFiltering(inst)`
* **Description:** Enables point filtering for the instance's `AnimState`, typically to avoid interpolation artifacts in pixel-art FX.
* **Parameters:** `inst` — the FX entity instance.
* **Returns:** `nil` (side-effect only).

### `GroundOrientation(inst)`
* **Description:** Configures the instance for ground-aligned rendering by setting orientation to `OnGround` and layer to `LAYER_BACKGROUND` or `LAYER_BELOW_GROUND`.
* **Parameters:** `inst` — the FX entity instance.
* **Returns:** `nil` (side-effect only).

### `Bloom(inst)`
* **Description:** Enables bloom effect on the `AnimState` using a specific shader and sets final offset to `1`.
* **Parameters:** `inst` — the FX entity instance.
* **Returns:** `nil` (side-effect only).

### `OceanTreeLeafFxFallUpdate(inst)`
* **Description:** Updates the `y` transform position based on stored `fall_speed` and `FRAMES`. Used for animating falling leaf or particle effects over time.
* **Parameters:** `inst` — the FX entity instance (must have `fall_speed` property and `Transform` component).
* **Returns:** `nil` (side-effect only).

### `GetRandomWithVariance(value, variance)`
* **Description:** Returns `value + (math.random() - 0.5) * variance * 2`, used to add jitter to timing or offset values.
* **Parameters:**  
  - `value` — base numeric value  
  - `variance` — proportion of variance (e.g., `0.5` for ±25% jitter)  
* **Returns:** `number` — jittered value.

## Events & listeners
No events are registered via `inst:ListenForEvent`, nor are any events pushed via `inst:PushEvent`. All asynchronous behavior is implemented via `DoTaskInTime` and `DoPeriodicTask`, which are scheduler-based utilities (not DST events).