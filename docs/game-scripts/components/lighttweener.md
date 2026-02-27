---
id: lighttweener
title: Lighttweener
description: Provides linear interpolation (tweening) support for dynamically adjusting a light entity's falloff, intensity, radius, and colour over time.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 7f5f55aa
---

# Lighttweener

## Overview
This component implements a light property tweener for entities in the Entity Component System. It enables smooth animation of a light's `radius`, `intensity`, `falloff`, and `colour` from current values to specified target values over a given duration, using linear interpolation. It manages the tween lifecycle, updates values per-frame via `OnUpdate`, and optionally invokes a callback upon completion.

## Dependencies & Tags
- Relies on `inst:StartUpdatingComponent(self)` and `inst:StopUpdatingComponent(self)` to manage frame updates.
- Uses `Lerp` (linear interpolation) — typically available globally in the DST engine.
- No entity tags are added or removed.
- No other components are directly required by name.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity to which this component is attached. |
| `light` | `Light` (or `nil`) | `nil` | The light component/reference to be tweened. |
| `i_falloff`, `i_intensity`, `i_radius` | `number` or `nil` | `nil` | Initial (current) values for light properties at start of tween. |
| `i_colour_r`, `i_colour_g`, `i_colour_b` | `number` or `nil` | `nil` | Initial RGB colour components. |
| `t_falloff`, `t_intensity`, `t_radius` | `number` or `nil` | `nil` | Target values to interpolate towards. |
| `t_colour_r`, `t_colour_g`, `t_colour_b` | `number` or `nil` | `nil` | Target RGB colour components. |
| `callback` | `function` or `nil` | `nil` | Function to call after tween completes (signature: `callback(inst, light)`). |
| `time` | `number` | `nil` | Total duration of the tween in seconds. |
| `timepassed` | `number` | `0` | Elapsed time since the tween started. |
| `tweening` | `boolean` | `false` | Whether a tween is currently in progress. |

## Main Functions

### `EndTween()`
* **Description:** Forces the light to its target values and terminates the tween (stops updates and triggers the callback if present).  
* **Parameters:** None.

### `StartTween(light, rad, intensity, falloff, colour, time, callback)`
* **Description:** Begins a tween on the specified light, storing initial values and interpolating toward the given targets over `time` seconds. If `time <= 0`, jumps immediately to target values.  
* **Parameters:**
  - `light` (`Light`): The light entity to animate. Required for tweening.
  - `rad` (`number` or `nil`): Target radius. Uses current radius if `nil`.
  - `intensity` (`number` or `nil`): Target intensity. Uses current intensity if `nil`.
  - `falloff` (`number` or `nil`): Target falloff. Uses current falloff if `nil`.
  - `colour` (`table` of size ≥ 3 or `nil`): Target RGB colour (e.g., `{r, g, b}`). Falls back to current colour if `nil`.
  - `time` (`number`): Duration of the tween in seconds.
  - `callback` (`function` or `nil`): Optional function executed when the tween finishes.

### `OnUpdate(dt)`
* **Description:** Called each frame during an active tween. Computes interpolated values based on elapsed time and updates the light properties accordingly. Stops automatically when the tween completes.  
* **Parameters:**
  - `dt` (`number`): Delta time since the last frame.

## Events & Listeners
- Listens to: **None** (no `inst:ListenForEvent` calls).
- Triggers: **None** (no `inst:PushEvent` calls).  
  *(Note: While it calls a user-defined `callback`, this is not an event in the DST event system.)*