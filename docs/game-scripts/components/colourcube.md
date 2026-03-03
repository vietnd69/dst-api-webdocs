---
id: colourcube
title: Colourcube
description: Manages dynamic colour grading via colour cubes (LUTs) to reflect in-game conditions such as time of day, season, sanity, and environment (caves or overworld).
tags: [fx, lighting, player, environment]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 77c58f50
system_scope: fx
---

# Colourcube

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`colourcube` is a client-side component responsible for applying and animating colour correction via colour cube (LUT) textures. It drives visual state such as sanity distortions, lunacy effects, and environmental mood (e.g., seasonal or cave lighting) by interacting with the `PostProcessor` system. The component is typically attached to the world or a global entity, and reacts to player events (sanity, phase, season, overrides) to update visual effects in real time. It depends on the `playervision` component to retrieve active overrides.

## Usage example
```lua
-- Attaching to a global/world instance (common in init scripts)
inst:AddComponent("colourcube")

-- Overrides may be triggered via events, e.g., from sanity system:
inst:PushEvent("overridecolourcube", { cc = "images/colour_cubes/custom_cc.tex" })
inst:PushEvent("ccoverrides", { cctable = myCustomCCTable })
inst:PushEvent("ccphasefn", { fn = myPhaseFn })

-- Adjust distortion sensitivity (e.g., for modded items):
inst.components.colourcube:SetDistortionModifier(1.5)
```

## Dependencies & tags
**Components used:** `playervision` (reads via `GetCCTable()` and `GetCCPhaseFn()`)
**Tags:** None added or removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `GObject` | `nil` | Entity instance this component is attached to. |
| `_iscave` | `boolean` | `false` or `true` depending on `"cave"` tag | Whether the host entity resides in caves. |
| `_activatedplayer` | `GObject?` | `nil` | Currently active player entity, used for event subscriptions. |
| `_distortion_modifier` | `number` | `Profile:GetDistortionModifier()` | Global multiplier for distortion intensity. |

*Note:* Most member variables are private and prefixed with `_`.

## Main functions
### `SetDistortionModifier(modifier)`
*   **Description:** Updates the global distortion intensity multiplier and re-applies sanity-based visual effects if a player is active.
*   **Parameters:** `modifier` (number) — scalar factor applied to distortion calculations (e.g., modded items may increase this).
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Handles per-frame interpolation and effect updates, including blending colour cubes, lens distortion (fisheye), and lunacy/sanity intensity transitions.
*   **Parameters:** `dt` (number) — time delta in seconds.
*   **Returns:** Nothing. Mutates internal state and `PostProcessor` settings.

### `LongUpdate(dt)`
*   **Description:** Periodic update used for slower-changing effects; internally delegates to `OnUpdate`.
*   **Parameters:** `dt` (number) — time delta.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a formatted string summarising the current state of colour cube blending and overrides for debugging.
*   **Parameters:** None.
*   **Returns:** `string` — multi-line debug description including override status, blend progress, and source texture paths.

## Events & listeners
- **Listens to:**
  - `playeractivated` / `playerdeactivated` — manages subscription to per-player events.
  - `phasechanged` — triggers ambient colour cube blending on day/dusk/night transitions.
  - `moonphasechanged2` — updates blending for moon phase (`full` → `"full_moon"`).
  - `moonphasestylechanged` — updates blending when moon phase style changes (e.g., alter active).
  - `seasontick` — updates ambient colour cube table when season changes (overworld only).
  - `overridecolourcube` — sets a full override LUT texture.
  - `overridecolourmodifier` — updates global colour modifier.
  - `ccoverrides` — sets a custom colour cube lookup table (e.g., from `playervision`).
  - `ccphasefn` — sets a function returning current phase string (e.g., for custom phases).
  - `sanitydelta` — updates distortion and lunacy effects based on sanity level.
  - `stormlevel` — updates blending when moonstorm status changes.
  - `enterraindome` / `exitraindome` — triggers fisheye distortion.

- **Pushes:** None — this component only reacts to events.

**Note:** Event handlers are registered conditionally (e.g., `seasontick` is excluded for caves).
