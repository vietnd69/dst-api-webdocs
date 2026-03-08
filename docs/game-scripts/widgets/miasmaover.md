---
id: miasmaover
title: Miasmaover
description: Manages the visual overlay representing miasma fog effects and goggle-based vision adaptation for the player, including animated background layers and dynamic brightness/scale adjustments.
tags: [player, environment, visual, fx]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 248ed395
system_scope: visual
---

# Miasmaover

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Miasmaover` is a UI widget component responsible for rendering the miasma fog visual effect and adjusting screen appearance based on goggle vision status. It dynamically blends animated background layers (`blind_root` with miasma animation) and letterbox bars, while also managing cloud layer visibility and ambient brightness scaling. It integrates with `ambientlighting` and `playervision` components to react to world lighting and player goggle status, and it updates continuously during miasma exposure or goggle toggling.

## Usage example
```lua
local miasmaover = CreateWidget("miasmaover", owner, cloudlayer)
owner:AddComponent("miasmaover")
owner.components.miasmaover:BlindTo(1, false)
owner.components.miasmaover:FadeTo(1, false)
```

## Dependencies & tags
**Components used:** `ambientlighting`, `playervision`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `inst` | `nil` | The player entity this overlay belongs to. |
| `minscale` | number | `0.9` | Minimum scale factor for the background animation. |
| `maxscale` | number | `1.20625` | Maximum scale factor for the background animation. |
| `bg` | `UIAnim` | — | Animated background layer for the blind effect. |
| `letterbox` | `Widget` | — | Letterbox overlay container for screen edge masking. |
| `clouds` | `Widget` | — | Cloud layer visual (shared with other systems). |
| `ambientlighting` | `AmbientLighting` component | — | Reference to global ambient lighting. |
| `camera` | `Camera` | — | Reference to global camera. |
| `blind` | number | `1` | Current opacity of the blind effect (0 = no blind, 1 = fully blind). |
| `blindto` | number | `1` | Target opacity for blind interpolation. |
| `blindtime` | number | `0.2` | Seconds to interpolate blind effect. |
| `fade` | number | `0` | Current intensity of the miasma fade effect (0–1). |
| `fadeto` | number | `0` | Target intensity for fade interpolation. |
| `fadetime` | number | `3` | Seconds to interpolate fade effect. |
| `brightness` | number | `1` | Dynamic ambient brightness factor. |
| `alpha` | number | `0` | Combined alpha used for rendering visual layers. |

## Main functions
### `BlindTo(blindto, instant)`
*   **Description:** Sets the target opacity for the blind effect, interpolating over time unless `instant` is `true`. Used when goggle vision is enabled or disabled.
*   **Parameters:** `blindto` (number) – target blind level, clamped between 0 (no blind) and 1 (full blind); `instant` (boolean) – if `true`, updates `blind` immediately and calls `ApplyLevels()`.
*   **Returns:** Nothing.
*   **Error states:** No effect if `blindto` equals current `self.blindto`.

### `FadeTo(fadeto, instant)`
*   **Description:** Sets the target intensity for the miasma fade effect, interpolating over time. Effectively hidden if the owner is not in miasma.
*   **Parameters:** `fadeto` (number) – target fade level, clamped between 0 (transparent) and 1 (opaque); `instant` (boolean) – if `true`, jumps directly to the target and calls `ApplyLevels()`.
*   **Returns:** Nothing.
*   **Error states:** Immediately sets `fadeto` to `0` if `owner:IsInMiasma()` returns `false`.

### `ApplyLevels()`
*   **Description:** Computes the final `alpha` value and applies tinting and visibility to visual layers (`bg`, `letterbox`, `clouds`). Controls when overlays are shown or hidden.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Interpolates `blind` and `fade` values toward their targets, adjusts brightness, updates background scale based on camera distance, and calls `ApplyLevels()` if any value changed.
*   **Parameters:** `dt` (number) – time elapsed since last frame.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `TheNet:IsServerPaused()` is `true`.

## Events & listeners
- **Listens to:** `gogglevision` – triggered on owner, updates blind level based on `data.enabled`; `miasmalevel` – triggered on owner, updates fade level based on `data.level`.
- **Pushes:** None identified.