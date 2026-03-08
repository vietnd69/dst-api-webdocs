---
id: moonstormover
title: Moonstormover
description: Manages the visual and audio overlay effects during a moonstorm, including screen fading, brightness adjustments, dynamic lighting, and shader-based dust animation.
tags: [weather, visual, audio, shader, overlay]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: d9d5a736
system_scope: environment
---

# Moonstormover

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`MoonstormOver` is a UI widget component responsible for rendering the visual and audio effects of the moonstorm weather event in DST. It controls screen blind/darkening (fade), brightness scaling, ambient lighting adjustments, and a dynamic shader-based dust layer that reacts to player movement and storm intensity. It integrates closely with `ambientlighting` (for ambient brightness) and `playervision` (to detect goggle vision state), and It operates as a singleton-like overlay attached to a player entity.

## Usage example
```lua
-- Assuming `owner` is a player entity and `dustlayer` is an Image/Anim instance
local moonstormOverlay = MoonstormOver(owner, dustlayer, dustlayer_goggles)
moonstormOverlay:FadeTo(0.8, false)  -- fade in moonstorm intensity
moonstormOverlay:BlindTo(0.2, false) -- apply partial visual obstruction
```

## Dependencies & tags
**Components used:** `ambientlighting` (`TheWorld.components.ambientlighting`), `playervision` (`owner.components.playervision`)  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | `nil` | The player entity this overlay is attached to; used to query storm level and goggle state. |
| `dust` | UI element | `nil` | The image/anim layer that uses the moonstorm shader. |
| `ambientlighting` | `AmbientLighting` | `nil` | Reference to `TheWorld.components.ambientlighting`. |
| `camera` | `TheCamera` | `nil` | Global camera instance. |
| `brightness` | number | `1` | Current brightness multiplier applied to UI background and letterbox. |
| `blind`, `blindto` | number | `1` | Instantaneous vs target “blindness” level (0 = clear, 1 = fully obstructed). |
| `blindtime` | number | `0.2` | Duration (in seconds) to transition `blind` toward `blindto`. |
| `fade`, `fadeto` | number | `0` | Current vs target storm fade intensity (0 = invisible, 1 = full moonstorm). |
| `fadetime` | number | `3` | Duration (in seconds) to transition `fade` toward `fadeto`. |
| `intensity` | number | `0` | Current moonstorm intensity (synced with `owner:GetStormLevel(STORM_TYPES.MOONSTORM)`). |
| `world_scroll_x`, `world_scroll_y` | number | `0` | Shader scrolling offsets simulating relative movement during the storm. |
| `scroll_speed` | number | `0.03` | Rate of scroll offset update per unit of player movement. |
| `player_position` | Vector3 or `nil` | `nil` | Cached previous position for velocity calculation. |
| `minscale`, `maxscale` | number | `2`, `5` | Scale range for the blind animation (applied at near/far camera distances). |
| `get_view_size_fn` | function | `TheSim:GetWindowSize()` or `GetViewportSize()` | Returns current render size (handles split-screen). |

## Main functions
### `BlindTo(blindto, instant)`
* **Description:** Sets the target level of visual obstruction (blind). A value of `0` means no obstruction, `1` is fully obstructed. Interpolates smoothly toward the target unless `instant` is `true`.
* **Parameters:**  
  `blindto` (number) — target blind level, clamped to `[0, 1]`.  
  `instant` (boolean) — if `true`, immediately snap `blind` to `blindto`.
* **Returns:** Nothing.

### `FadeTo(fadeto, instant)`
* **Description:** Sets the target intensity of the moonstorm overlay fade. Triggers sound/mixer changes and manages update loop lifecycle.
* **Parameters:**  
  `fadeto` (number) — target fade level, clamped to `[0, 1]`.  
  `instant` (boolean) — if `true`, skip interpolation and update immediately.
* **Returns:** Nothing.

### `UpdateAlphaRangeShaderUniforms()`
* **Description:** Configures the `dust` shader’s alpha range uniforms using current window or viewport size.
* **Parameters:** None.
* **Returns:** Nothing.

### `UpdateAllShaderUniforms()`
* **Description:** Updates all time-based and motion-based parameters for the moonstorm shader:
  - Time, scroll offsets, and intensity (via `SetEffectParams`)
  - Brightness and dust falloff (via `SetEffectParams2`).
* **Parameters:** None.
* **Returns:** Nothing.

### `ApplyLevels()`
* **Description:** Computes final alpha, updates background tint and letterbox colors, and manages visibility/show/hide state and sound/mixer state based on `fade` and `blind` values.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Main per-frame update loop. Synchronizes storm intensity, calculates player movement-driven scroll offsets, interpolates `blind` and `fade`, adjusts brightness from ambient lighting, scales the blind animation based on camera distance, and manages update loop stopping/starting.
* **Parameters:**  
  `dt` (number) — delta time in seconds (ignored if server paused or bad).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `gogglevision` — updates blind level and switches dust shader between `"moonstorm_goggles.ksh"` and `"moonstorm.ksh"` based on `data.enabled`.  
  `stormlevel` — initiates fade in/out based on moonstorm level (`STORM_TYPES.MOONSTORM`).  
- **Pushes:** None identified.