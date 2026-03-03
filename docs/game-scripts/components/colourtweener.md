---
id: colourtweener
title: Colourtweener
description: Animates an entity's colour over time using linear interpolation.
tags: [fx, animation, visual]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 1523ff84
system_scope: fx
---

# Colourtweener

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Colourtweener` is a component that performs a smooth linear interpolation (tween) between an entity's current colour and a target colour over a specified duration. It integrates with the entity's `AnimState` to modify the multicolour multiplier, enabling dynamic visual effects such as fading, flashing, or colour transitions. It is commonly used for feedback effects (e.g., hit flashes, status transitions) and does not require external dependencies.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("colourtweener")

-- Tween to red over 1 second, then trigger a callback
inst.components.colourtweener:StartTween(
    {1, 0, 0, 1}, -- target RGBA
    1.0,          -- duration in seconds
    function(target) print("Tween finished on", target.prefab) end
)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity this component is attached to. |
| `i_colour_r`, `i_colour_g`, `i_colour_b`, `i_alpha` | number or `nil` | `nil` | Initial RGBA colour values (extracted at start of tween). |
| `t_colour_r`, `t_colour_g`, `t_colour_b`, `t_alpha` | number or `nil` | `nil` | Target RGBA colour values (set at start of tween). |
| `callback` | function or `nil` | `nil` | Optional function called when the tween completes. |
| `time` | number or `nil` | `nil` | Total duration of the tween in seconds. |
| `timepassed` | number | `0` | Accumulated time elapsed during the tween. |
| `tweening` | boolean | `false` | Whether a tween is currently active. |
| `usewallupdate` | boolean or `nil` | `nil` | If `true`, uses wall update mode for the component. |

## Main functions
### `StartTween(colour, time, callback, usewallupdate)`
*   **Description:** Begins a colour tween from the current multicolour to the specified `colour` over `time` seconds. If `time` is `0` or negative, the tween completes instantly.
*   **Parameters:**  
    - `colour` (table): RGBA values as `{r, g, b, a}`. Alpha (`a`) is optional and defaults to `1` if omitted.  
    - `time` (number): Duration in seconds. If `<= 0`, the tween ends immediately.  
    - `callback` (function or `nil`): Optional function called with `inst` as argument upon completion.  
    - `usewallupdate` (boolean or `nil`): If `true`, uses `StartWallUpdatingComponent`; otherwise uses `StartUpdatingComponent`.
*   **Returns:** Nothing.
*   **Error states:** Returns early with no update loop if `time > 0` but initial/target colour components are missing or incomplete (no-op on malformed inputs).

### `EndTween()`
*   **Description:** Immediately finalizes the tween by setting the multicolour to the target values, invoking the callback (if present), resetting state, and stopping the update loop.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `DoUpdate(dt)`
*   **Description:** Called each frame during an active tween (via `OnUpdate`/`OnWallUpdate`) to interpolate and apply the current colour value.
*   **Parameters:**  
    - `dt` (number): Delta time in seconds since the last frame.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if any required colour component (`i_` or `t_`) is missing; otherwise clamps interpolation factor `t` to `[0, 1]`.

## Events & listeners
- **Listens to:** None  
- **Pushes:**  
  - `colourtweener_start` – fired when `StartTween` is called (regardless of duration).  
  - `colourtweener_end` – fired when `EndTween` is called (on completion or forced termination).
