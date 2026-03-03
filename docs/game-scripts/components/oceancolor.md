---
id: oceancolor
title: Oceancolor
description: Manages dynamic color and texture blending for the ocean floor and sky based on time of day phases (day, dusk, night, no_ocean).
tags: [environment, world, map, rendering]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: bf74ed65
system_scope: environment
---

# Oceancolor

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`OceanColor` is a world-level component responsible for smoothly transitioning the ocean's visual appearance (including clear color and texture blend) in response to time-of-day phase changes (`phasechanged` events). It integrates with `TheWorld.Map` to update rendering parameters in real time. The component operates on the client-side (via wall updates) and interpolates between predefined color/blend states for `default`, `dusk`, `night`, and `no_ocean` phases.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("oceancolor")
inst.components.oceancolor:Initialize(true) -- enables ocean rendering
inst.components.oceancolor:OnPostInit()     -- fixes potential client-side initialization bug
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `start_color` | array of 4 numbers | `shallowcopy(COLORS.default.color)` | RGBA color at the beginning of a transition. |
| `current_color` | array of 4 numbers | `shallowcopy(COLORS.default.color)` | Current interpolated RGBA color. |
| `end_color` | array of 4 numbers | `shallowcopy(COLORS.default.color)` | Target RGBA color for the transition. |
| `start_ocean_texture_blend` | number | `COLORS.default.ocean_texture_blend` | Starting texture blend amount (0 = no texture, 1 = full texture). |
| `current_ocean_texture_blend` | number | `COLORS.default.ocean_texture_blend` | Current interpolated blend amount. |
| `end_ocean_texture_blend` | number | `COLORS.default.ocean_texture_blend` | Target blend amount. |
| `lerp` | number | `1` | Normalized interpolation progress (`0` to `1`). |
| `lerp_delay` | number | `0` | Delay (in seconds) before interpolation starts. |
| `blend_delay` | number | `COLORS.default.blend_delay` | Delay duration (seconds) per transition phase. |
| `blend_speed` | number | `COLORS.default.blend_speed` | Speed factor for interpolation (higher = faster). |

## Main functions
### `Initialize(has_ocean)`
* **Description:** Initializes the component and sets the initial clear color and wall update state. Should be called once after the component is added to an entity.
* **Parameters:** `has_ocean` (boolean) – If `true`, enables wall updates and sets the default ocean clear color; otherwise, sets `no_ocean` clear color and disables wall updates.
* **Returns:** Nothing.

### `OnPostInit()`
* **Description:** Applies a client-side workaround to ensure ocean texture blending is correctly updated after loading, preventing stale values (e.g., `blend = 0`) at initial load.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnWallUpdate(dt)`
* **Description:** Called every frame during wall updates. Handles linear interpolation (`Lerp`) of color and texture blend, then updates `TheWorld.Map` with the new values.
* **Parameters:** `dt` (number) – Time in seconds since the last update.
* **Returns:** Nothing.
* **Error states:** Returns early if `lerp >= 1`, i.e., interpolation is complete.

### `OnPhaseChanged(src, phase)`
* **Description:** Callback triggered on `"phasechanged"` events. Prepares the next interpolation by capturing the current state as `start_*`, updating `end_*` to the new phase’s settings, and resetting interpolation.
* **Parameters:**  
  * `src` – Event source (unused in logic).  
  * `phase` (string) – Phase name (e.g., `"default"`, `"dusk"`, `"night"`, `"no_ocean"`). If invalid, defaults to `"default"`.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `phasechanged` – Triggers `OnPhaseChanged` to handle transitions.
- **Pushes:** None identified.
