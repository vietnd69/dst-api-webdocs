---
id: sizetweener
title: Sizetweener
description: Manages smooth scaling (size) animations of an entity over time using linear interpolation.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 3ed354b4
---

# Sizetweener

## Overview
The `SizeTweener` component handles animated scaling of an entity’s transform over time. It supports starting and ending size tweens via linear interpolation (Lerp), optionally triggering a user-defined callback upon completion. It integrates with the entity’s update loop to perform per-frame interpolation when a tween is active.

## Dependencies & Tags
* **Component Dependency:** `Transform` (must be present on the entity; used via `inst.Transform` for scale manipulation)
* **Events Pushed:** `"sizetweener_start"` and `"sizetweener_end"` (see Events & Listeners section)

No additional components are added or tags applied.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (passed to constructor) | The entity to which this component is attached |
| `i_size` | `number?` | `nil` | The initial scale value at tween start (read from `Transform:GetScale()`) |
| `t_size` | `number?` | `nil` | The target scale value (uniform scale applied to X, Y, Z) |
| `callback` | `function?` | `nil` | Optional function to invoke when tween completes |
| `time` | `number?` | `nil` | Total duration (in seconds) of the tween |
| `timepassed` | `number` | `0` | Accumulated time elapsed during the current tween |
| `tweening` | `boolean` | `false` | Whether a tween is currently in progress |

## Main Functions

### `StartTween(size, time, callback)`
* **Description:** Begins a size tween from the entity’s current scale to the specified `size` over `time` seconds. If `time` is 0 or negative, the tween ends immediately. Pushes the `"sizetweener_start"` event and starts updates if `time > 0`.
* **Parameters:**
  * `size` (`number`): Uniform scale value to tween to (applied equally to X, Y, Z axes).
  * `time` (`number`): Duration of the tween in seconds. If ≤ 0, instant transition occurs.
  * `callback` (`function?`): Optional callback function accepting the entity (`inst`) as its sole argument, called when the tween completes.

### `EndTween()`
* **Description:** Stops the current tween (if active), snaps the entity’s scale to the target (`t_size`), resets internal state, pushes `"sizetweener_end"`, and executes the callback if provided.
* **Parameters:** None

### `OnUpdate(dt)`
* **Description:** Called each frame while tweening is active. Updates elapsed time and performs Lerp-based scaling. If the elapsed time reaches or exceeds the tween duration, triggers `EndTween()`.
* **Parameters:**
  * `dt` (`number`): Delta time in seconds since the last frame.

## Events & Listeners
* **Events Pushed:**
  * `"sizetweener_start"` — fired when a tween begins.
  * `"sizetweener_end"` — fired when a tween completes (either naturally or via `EndTween()`).
* **Event Listeners:** None (this component does not listen for external events).