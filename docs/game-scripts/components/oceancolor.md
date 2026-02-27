---
id: oceancolor
title: Oceancolor
description: This component dynamically adjusts the ocean floor color and texture blending over time in response to world phase changes (e.g., dusk, night).
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: bf74ed65
---

# Oceancolor

## Overview
The `Oceancolor` component manages real-time color interpolation and ocean texture blending for the game world's ocean floor. It responds to phase changes (e.g., day, dusk, night) by smoothly transitioning between predefined color states and updating the world's clear color and ocean texture blend amount via the map rendering system.

## Dependencies & Tags
- **Component Dependency:** Relies on the entity (`inst`) supporting `StartUpdatingComponent`, `StartWallUpdatingComponent`, and `ListenForEvent`.
- **Tags Added:** None.
- **Tags Removed:** None.
- **Uses:** `TheWorld.Map` (global), `COLORS` table (local constant), and standard math helpers (`Lerp`, `shallowcopy`).

## Properties
| Property | Type | Default Value | Description |
|---|---|---|---|
| `inst` | `Entity` | `nil` (assigned in constructor) | Reference to the owner entity (typically `TheWorld`) |
| `start_color` | `array[4]` of `number` (RGBA) | Copy of `COLORS.default.color` | RGBA values for the starting color in the current blend |
| `current_color` | `array[4]` of `number` (RGBA) | Copy of `COLORS.default.color` | Current interpolated RGBA color (updated every `OnWallUpdate`) |
| `end_color` | `array[4]` of `number` (RGBA) | Copy of `COLORS.default.color` | Target RGBA color for the current blend |
| `start_ocean_texture_blend` | `number` | `COLORS.default.ocean_texture_blend` | Starting texture blend amount |
| `current_ocean_texture_blend` | `number` | `COLORS.default.ocean_texture_blend` | Current interpolated texture blend amount |
| `end_ocean_texture_blend` | `number` | `COLORS.default.ocean_texture_blend` | Target texture blend amount |
| `lerp` | `number` | `1` | Interpolation progress (0–1) between start and end values |
| `lerp_delay` | `number` | `0` | Accumulated delay before lerp begins (increases up to `blend_delay`) |
| `blend_delay` | `number` | `COLORS.default.blend_delay` | Delay (seconds) before interpolation starts after a phase change |
| `blend_speed` | `number` | `COLORS.default.blend_speed` | Rate of interpolation per second (higher = faster transition) |

## Main Functions

### `Initialize(has_ocean)`
* **Description:** Initializes the ocean color state. If `has_ocean` is true, starts wall-updating and sets the world clear color to default; otherwise, sets it to `no_ocean` color.
* **Parameters:**  
  - `has_ocean` (`boolean`): Indicates whether ocean rendering should be active.

### `OnPostInit()`
* **Description:** Applies a workaround to force immediate texture blend updates on clients during load, preventing stuck blend states at daybreak. Sets the ocean texture blend to `1`, then immediately back to the current value to trigger a dirty state.
* **Parameters:** None.

### `OnWallUpdate(dt)`
* **Description:** Performs per-frame interpolation of color and texture blend values once the delay has elapsed. Updates the world clear color and ocean texture blend amount via `TheWorld.Map`.
* **Parameters:**  
  - `dt` (`number`): Delta time in seconds since the last frame.

### `OnPhaseChanged(src, phase)`
* **Description:** Handles phase-change events (e.g., `"dusk"`, `"night"`). Updates the target (`end_color`, `end_ocean_texture_blend`) and timing parameters (`blend_delay`, `blend_speed`) based on the new phase. Resets the lerp state to begin interpolation.
* **Parameters:**  
  - `src` (`Entity` or `nil`): The source of the event (typically `nil` for global phase changes).  
  - `phase` (`string`): The new world phase (e.g., `"default"`, `"dusk"`, `"night"`, `"no_ocean"`). If unrecognized, defaults to `"default"`.

## Events & Listeners
- Listens for event `"phasechanged"` via `inst:ListenForEvent("phasechanged", ...)`, which triggers `OnPhaseChanged(src, phase)`.
- Does **not** push or emit any events itself.