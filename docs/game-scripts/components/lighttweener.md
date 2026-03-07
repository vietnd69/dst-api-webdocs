---
id: lighttweener
title: Lighttweener
description: Interpolates light properties (radius, intensity, falloff, colour) over time for an entity's attached light component.
tags: [light, animation, tween]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 7f5f55aa
system_scope: fx
---

# Lighttweener

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`LightTweener` provides linear interpolation (tweening) for dynamic lighting effects. It modifies the visual properties of a `light` component attached to the same entity over a specified duration. This component is used to create smooth transitions between lighting states—such as dimming, brightening, or shifting colour—commonly seen in ambient effects, ambient alerts, or event-driven environmental changes.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("lighttweener")

local light = inst:AddChild()
light:AddComponent("light")
light:GetComponent("light"):SetRadius(3)
light:GetComponent("light"):SetIntensity(0.5)
light:GetComponent("light"):SetFalloff(1.0)
light:GetComponent("light"):SetColour(1, 1, 1)

inst.components.lighttweener:StartTween(
    light,           -- light to tween
    5,               -- target radius
    1.0,             -- target intensity
    0.5,             -- target falloff
    {0.8, 0.2, 0.2}, -- target colour (red-ish)
    2.0,             -- duration in seconds
    function() print("Tween finished!") end -- callback
)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Reference to the entity that owns this component. |
| `light` | `LightComponent` or `nil` | `nil` | The light component being tweened. |
| `i_falloff`, `i_intensity`, `i_radius` | `number` or `nil` | `nil` | Initial (start) values for light properties. |
| `i_colour_r`, `i_colour_g`, `i_colour_b` | `number` or `nil` | `nil` | Initial RGB colour components. |
| `t_falloff`, `t_intensity`, `t_radius` | `number` or `nil` | `nil` | Target (end) values for light properties. |
| `t_colour_r`, `t_colour_g`, `t_colour_b` | `number` or `nil` | `nil` | Target RGB colour components. |
| `callback` | `function` or `nil` | `nil` | Function called when tween completes. |
| `time` | `number` or `nil` | `nil` | Total duration of the tween in seconds. |
| `timepassed` | `number` | `0` | Time elapsed since tween started. |
| `tweening` | `boolean` | `false` | Whether a tween is currently in progress. |

## Main functions
### `StartTween(light, rad, intensity, falloff, colour, time, callback)`
*   **Description:** Begins a tween operation on the specified light, interpolating its properties from current values to target values over `time` seconds. If `time` is `0`, the tween completes immediately.
*   **Parameters:**
    *   `light` (`LightComponent`) — The light component to animate.
    *   `rad` (`number` or `nil`) — Target radius.
    *   `intensity` (`number` or `nil`) — Target intensity.
    *   `falloff` (`number` or `nil`) — Target falloff.
    *   `colour` (`table` or `nil`) — Table of `{r, g, b}`; values expected in `[0, 1]` range.
    *   `time` (`number`) — Duration in seconds.
    *   `callback` (`function` or `nil`) — Function to call upon completion, receiving `(inst, light)` as arguments.
*   **Returns:** Nothing.
*   **Error states:** Returns early and prints a warning if `light` is `nil` or not provided; sets `self.light` but skips updating if unset.

### `EndTween()`
*   **Description:** Immediately sets the light to its final (target) values and stops the update loop.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No-op if `self.light` is `nil`.

### `OnUpdate(dt)`
*   **Description:** Updates the tween per frame by linearly interpolating between initial and target values. Called automatically while `tweening` is `true`.
*   **Parameters:**
    *   `dt` (`number`) — Time in seconds since last frame.
*   **Returns:** Nothing.
*   **Error states:** Prints warning and stops updates if `self.light` is `nil`. Automatically calls `EndTween()` when `timepassed >= time`.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.
