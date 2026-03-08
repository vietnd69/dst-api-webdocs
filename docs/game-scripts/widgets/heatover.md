---
id: heatover
title: Heatover
description: Renders a screen-space visual overlay that intensifies as the owner's temperature rises, accompanied by progressive audio feedback.
tags: [ui, fx, temperature]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: be46eba8
system_scope: ui
---

# Heatover

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`HeatOver` is a client-side UI widget that displays a dynamic heat distortion overlay (using a custom shader) over the screen when the owner's temperature exceeds safe thresholds. It integrates with the `temperature` component to track temperature changes, triggers level-based audio cues, and updates visual properties (alpha, distortion size, frequency, speed) to reflect the severity of overheating. It is typically attached to player entities and only visible on the client side.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("player")
inst:AddComponent("temperature")
-- HeatOver is usually instantiated internally by the player prefab
local heatover = inst:AddWidget("heatover")
heatover:OnHeatChange()  -- Initial setup based on current temperature
```

## Dependencies & tags
**Components used:** `temperature`, `player_classified` (fallback source for temperature)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `Entity` | `nil` | The entity whose temperature is monitored (typically a player). |
| `img` | `Image` | `nil` | The visual image node displaying the heat overlay effect. |
| `laststep` | number | `0` | Current heat level index (0–4), representing the threshold tier reached. |
| `alpha_min` | number | `1.0` | Current minimum alpha value for the overlay; lerps toward `alpha_min_target`. |
| `alpha_min_target` | number | `1.0` | Target minimum alpha, determined by heat level. |
| `effectTime` | number | `0.0` | Accumulated time used by the shader for animation progression. |
| `effectSize` | number | `0.0` | Current distortion size parameter; lerps toward `effectSize_target`. |
| `effectSize_target` | number | `0.0` | Target distortion size, based on heat level. |
| `effectFrequency` | number | `0.0` | Current distortion frequency parameter; lerps toward `effectFrequency_target`. |
| `effectFrequency_target` | number | `0.0` | Target distortion frequency, based on heat level. |
| `effectSpeed` | number | `0.0` | Distortion speed parameter (currently fixed per level, not lerped). |

## Main functions
### `OnHeatChange()`
* **Description:** Reads the owner's current temperature, determines the active heat level (0–4), and updates visual/audio properties accordingly. Resets or updates targets for alpha, distortion size, frequency, and speed.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Falls back to `TUNING.STARTING_TEMP` if `temperature` and `player_classified` components are unavailable.

### `OnUpdate(dt)`
* **Description:** Called during every frame while the overlay is visible. Lerp `alpha_min`, `effectSize`, and `effectFrequency` toward their targets, and update shader parameters. Hides the overlay and stops updates when `alpha_min >= 0.99` (i.e., near ambient/non-heated state).
* **Parameters:** `dt` (number) – Delta time in seconds since the last frame.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `temperaturedelta` (on `owner`) – triggers `OnHeatChange()` when temperature changes.