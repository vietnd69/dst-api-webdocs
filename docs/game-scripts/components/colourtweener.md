---
id: colourtweener
title: Colourtweener
description: This component facilitates the smooth, time-based animation of an entity's multiplicative color on its AnimState.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: 1523ff84
---

# Colourtweener

## Overview
The `Colourtweener` component is responsible for animating the multiplicative color (RGB and Alpha) of an entity's `AnimState` over a specified duration. It allows developers to smoothly transition an entity's visual tint from one color to another, providing visual feedback or aesthetic effects. Once started, it automatically updates the color each frame until the target color is reached, at which point an optional callback function is executed.

## Dependencies & Tags
This component implicitly relies on the entity having an `AnimState` component for its functionality, as it calls `self.inst.AnimState:GetMultColour()` and `self.inst.AnimState:SetMultColour()`.
No specific tags are added or removed by this component.

## Properties
| Property        | Type      | Default Value | Description                                                                 |
| :-------------- | :-------- | :------------ | :-------------------------------------------------------------------------- |
| `inst`          | `entity`  | `nil`         | A reference to the entity this component is attached to.                    |
| `i_colour_r`    | `number`  | `nil`         | The initial red component (0-1) of the color tween.                         |
| `i_colour_g`    | `number`  | `nil`         | The initial green component (0-1) of the color tween.                       |
| `i_colour_b`    | `number`  | `nil`         | The initial blue component (0-1) of the color tween.                        |
| `i_alpha`       | `number`  | `nil`         | The initial alpha component (0-1) of the color tween.                       |
| `t_colour_r`    | `number`  | `nil`         | The target red component (0-1) of the color tween.                          |
| `t_colour_g`    | `number`  | `nil`         | The target green component (0-1) of the color tween.                        |
| `t_colour_b`    | `number`  | `nil`         | The target blue component (0-1) of the color tween.                         |
| `t_alpha`       | `number`  | `nil`         | The target alpha component (0-1) of the color tween.                        |
| `callback`      | `function`| `nil`         | An optional function to be called when the color tween finishes.            |
| `time`          | `number`  | `nil`         | The total duration, in seconds, for the color tween to complete.            |
| `timepassed`    | `number`  | `0`           | The amount of time that has elapsed since the current tween started.        |
| `tweening`      | `boolean` | `false`       | A flag indicating whether the component is currently performing a tween.    |
| `usewallupdate` | `boolean` | `nil`         | A flag indicating whether to use `OnWallUpdate` (true) or `OnUpdate` (false) for the tween. |

## Main Functions
### `IsTweening()`
* **Description:** Checks if the component is currently actively tweening an entity's color.
* **Parameters:** None.

### `EndTween()`
* **Description:** Immediately stops any active color tween. It sets the entity's `AnimState` multiplicative color to the final target values, executes the registered `callback` function (if any), pushes a "colourtweener_end" event, and stops the component's update loop.
* **Parameters:** None.

### `StartTween(colour, time, callback, usewallupdate)`
* **Description:** Initiates a new color tween for the entity. The entity's current `AnimState` multiplicative color will smoothly transition to the `colour` over the specified `time`. If `time` is 0, the color is set instantly, and the tween ends immediately.
* **Parameters:**
    * `colour`: A table `{r, g, b, [a]}` representing the target multiplicative color. `r`, `g`, `b`, and `a` should be numbers between 0 and 1. If `a` is omitted, it defaults to 1.
    * `time`: A number specifying the duration in seconds for the tween to complete.
    * `callback`: An optional function to be called when the tween finishes. It receives the entity instance as its sole argument.
    * `usewallupdate`: An optional boolean. If `true`, the component will use the `OnWallUpdate` lifecycle method, otherwise `OnUpdate` (default). This influences when the component receives its update ticks.

### `DoUpdate(dt)`
* **Description:** This internal function is called repeatedly while the component is updating. It calculates the interpolated color based on `dt` (delta time) and the total `time`, then applies it to the entity's `AnimState`. When `timepassed` exceeds `time`, it calls `EndTween()`. This function is aliased to both `OnUpdate` and `OnWallUpdate`.
* **Parameters:**
    * `dt`: A number representing the time elapsed since the last update tick.

## Events & Listeners
*   `colourtweener_start`: Pushed by `StartTween()` when a new color tween begins.
*   `colourtweener_end`: Pushed by `EndTween()` when a color tween finishes (either by reaching its target or being explicitly stopped).