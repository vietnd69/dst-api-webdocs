---
id: fader
title: Fader
description: Manages smooth transitions (fades) of arbitrary numeric values over time by updating them each frame until completion.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: f2555918
---

# Fader

## Overview
The `Fader` component enables smooth interpolation (fade-in/fade-out) of numeric values over time. It maintains a list of active fade operations, each defined by a start value, end value, duration, and a setter function to apply the interpolated value. It automatically starts/stops its own update loop based on active fades.

## Dependencies & Tags
- Relies on `inst:StartUpdatingComponent(self)` and `inst:StopUpdatingComponent(self)` to integrate with the entity’s update loop.
- No components are added or tags assigned by this script.
- No other components are directly required or referenced.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity the component is attached to. |
| `values` | `table` | `{}` | List of active fade operations (each a table of fade parameters). |
| `numvals` | `number` | `0` | Count of currently active fades. |

## Main Functions
### `Fade(startval, endval, time, setter, atend, id)`
* **Description:** Adds a new fade operation to the queue. Interpolates the value from `startval` to `endval` over `time` seconds using linear interpolation. The `setter` function is called each frame with `(current_value, inst)` to apply the interpolated value. Optionally executes `atend` when the fade completes.
* **Parameters:**
  - `startval` (number): Starting value for the fade.
  - `endval` (number): Target value at the end of the fade.
  - `time` (number): Duration of the fade in seconds.
  - `setter` (function): Callback `(value, inst)` invoked each frame to apply the current interpolated value.
  - `atend` (function, optional): Callback `(inst, value)` invoked once when the fade finishes.
  - `id` (number/string, optional): Identifier for the fade; defaults to its 1-based index in `values`.

### `StopAll()`
* **Description:** Immediately completes all active fades (by fast-forwarding their remaining time), clears the fade queue, and stops the component’s update loop.
* **Parameters:** None.

### `OnUpdate(dt)`
* **Description:** Internal callback invoked each frame. Updates all active fades by decrementing remaining time, computing the interpolated value, and invoking the `setter`. Completes and removes any fades whose time has elapsed (and triggers `atend` if present).
* **Parameters:**
  - `dt` (number): Delta time in seconds since the last frame.

## Events & Listeners
- Listens to: none (`inst:ListenForEvent` not used).
- Emits: none (`inst:PushEvent` not used).
- Updates itself via the entity’s update loop (`StartUpdatingComponent`/`StopUpdatingComponent`), which is standard for DST components but not classified as a game event.