---
id: sandover
title: Sandover
description: Manages visual and auditory effects for sandstorm conditions and goggle vision on the player, including animated overlays and dynamic scaling adjustments.
tags: [environment, ui, fx]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 4c697d43
system_scope: environment
---

# Sandover

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SandOver` is a UI widget component that renders the visual and auditory effects associated with sandstorms and goggle vision for the player. It manages animated overlays (`sand_over`), letterboxing, dust layer rendering, and ambient brightness transitions. The component listens to player-specific events (`gogglevision`, `stormlevel`) and reacts by adjusting blind level, fade level, and sound intensity. It integrates with `ambientlighting` and `playervision` components for dynamic brightness and goggle detection.

## Usage example
```lua
local owner = ThePlayer
local dustlayer = CreateEntity()
dustlayer:AddComponent("uianim")
-- Assume dustlayer has proper UIAnim setup
local sandover = SandOver(owner, dustlayer)
sandover:BlindTo(0.8, false) -- gradually increase sand obstruction
sandover:FadeTo(1.0, false) -- gradually increase storm intensity
```

## Dependencies & tags
**Components used:** `playervision` (via `HasGoggleVision`), `ambientlighting`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity or `nil` | `nil` | The player entity this widget is associated with. |
| `minscale` | number | `0.9` | Minimum scale factor for the sand overlay, based on camera distance. |
| `maxscale` | number | `1.20625` | Maximum scale factor for the sand overlay, based on camera distance. |
| `bg` | Widget | (UIAnim child) | Animated sand overlay background widget. |
| `letterbox` | Widget | (returned from `CreateLetterbox`) | Letterbox widget for screen boundaries. |
| `dust` | Widget | `nil` | Dust overlay layer widget (must be provided at construction). |
| `blind` | number | `1` | Current blind intensity (0 = clear vision, 1 = fully obscured). |
| `blindto` | number | `1` | Target blind intensity. |
| `blindtime` | number | `0.2` | Time in seconds to transition blind intensity. |
| `fade` | number | `0` | Current sandstorm fade intensity (0 = no storm, 1 = full storm). |
| `fadeto` | number | `0` | Target fade intensity. |
| `fadetime` | number | `3` | Time in seconds to transition fade intensity. |
| `brightness` | number | `1` | Ambient brightness multiplier, derived from `ambientlighting`. |
| `alpha` | number | `0` | Computed opacity based on `fade` and `blind`. |

## Main functions
### `BlindTo(blindto, instant)`
*   **Description:** Sets the target blind level (obstruction) and triggers interpolation toward it over time. A higher `blindto` value means more obstruction (0 = no obstruction, 1 = full). Also updates sandstorm sound intensity.
*   **Parameters:**  
    `blindto` (number) — Target blind level, clamped to `[0, 1]`.  
    `instant` (boolean) — If `true`, applies the change immediately without interpolation.
*   **Returns:** Nothing.

### `FadeTo(fadeto, instant)`
*   **Description:** Sets the target fade level (sandstorm intensity) and triggers interpolation. Updates the dust layer visibility and sound. Automatically resets to `0` if the player's current sandstorm level is `0`.
*   **Parameters:**  
    `fadeto` (number) — Target fade level, clamped to `[0, 1]`.  
    `instant` (boolean) — If `true`, applies the change immediately (duration = `math.huge`).
*   **Returns:** Nothing.
*   **Error states:** If `owner` is `nil` or `owner:GetStormLevel(STORM_TYPES.SANDSTORM)` returns `0`, `fadeto` is clamped to `0`.

### `ApplyLevels()`
*   **Description:** Updates visual and sound states based on current `fade`, `blind`, and `brightness`. Controls visibility of sand overlay, letterbox tinting, and dust animation/sound. Called internally on state changes.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Called every frame to interpolate `blind` and `fade` toward their targets, adjust brightness, update overlay scale based on camera distance, and manage update loop lifecycle.
*   **Parameters:**  
    `dt` (number) — Delta time in seconds.
*   **Returns:** Nothing.
*   **Error states:** Returns early if server is paused (`TheNet:IsServerPaused()` is `true`). Also stops updating when both `fade` and `fadeto` are `<= 0`.

## Events & listeners
- **Listens to:**  
  `gogglevision` (on `owner`) — Adjusts `blind` to `0` when goggles are enabled, `1` when disabled.  
  `stormlevel` (on `owner`) — Calls `FadeTo(data.level)` if storm type is sandstorm; otherwise calls `FadeTo(0)`.
- **Pushes:** None.