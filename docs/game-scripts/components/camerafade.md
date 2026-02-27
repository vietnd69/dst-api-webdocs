---
id: camerafade
title: Camerafade
description: Dynamically adjusts an entity's transparency based on its proximity to the game camera and other configurable conditions.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: ui
source_hash: fe7693d1
---

# Camerafade

## Overview
The Camerafade component is responsible for making an entity semi-transparent when it is positioned between the camera and the player's character. This is commonly used on large objects like trees or tall structures to prevent them from obstructing the player's view.

The component calculates the entity's alpha (transparency) based on several factors, including its distance from the camera, the screen position of a specific animation symbol, and its world height. It uses the `WallUpdate` system, an optimized update loop that runs when the camera is potentially being occluded, ensuring efficient performance.

## Dependencies & Tags
None identified.

## Properties
| Property | Type | Default Value | Description |
|---|---|---|---|
| `range` | `number` | `25` | The distance over which the entity fades from fully opaque to fully transparent. |
| `fadetodist` | `number` | `5` | The distance from the camera at which the entity begins to fade. |
| `center_symbol` | `string` | `nil` | An optional animation symbol to track for screen-center based fading. |
| `center_min_dist_sq` | `number` | `nil` | The squared screen distance from the center a symbol must be before fading begins. |
| `center_dist_sq` | `number` | `nil` | The squared screen distance over which the center-based fade is applied. |
| `center_min_fade` | `number` | `nil` | The minimum alpha value (maximum transparency) applied by the center-fade logic. |
| `lerp_to_height` | `number` | `nil` | A world height (`Y` coordinate) used to interpolate the fade effect based on the entity's height. |
| `alpha` | `number` | `1` | The current calculated alpha value of the entity, where `1` is opaque and `0` is transparent. |

## Main Functions
### `Enable(enable, instant)`
* **Description:** Activates or deactivates the component's fading logic. When disabled, it can instantly restore the entity to full opacity.
* **Parameters:**
    * `enable` (`boolean`): `true` to enable the fading effect, `false` to disable it.
    * `instant` (`boolean`): If `true` and `enable` is `false`, the entity's alpha is immediately set to `1` (fully opaque).

### `SetUp(range, fadetodist)`
* **Description:** Configures the primary distance-based fading parameters.
* **Parameters:**
    * `range` (`number`): The distance over which the fade occurs.
    * `fadetodist` (`number`): The distance from the camera where fading starts.

### `SetUpCenterFade(symbol, min_dist_sq, dist_sq, min_fade)`
* **Description:** Configures an additional fading effect based on the screen position of a specific animation symbol relative to the screen's center. This is useful for fading objects that are directly in the middle of the screen.
* **Parameters:**
    * `symbol` (`string`): The name of the animation symbol to track.
    * `min_dist_sq` (`number`): The squared screen distance from the center that the symbol must be before this fade starts.
    * `dist_sq` (`number`): The squared screen distance over which the fade is applied.
    * `min_fade` (`number`): The minimum alpha value this effect can apply.

### `SetLerpToHeight(height)`
* **Description:** Configures an additional fade modifier based on the entity's world `Y` coordinate. The effect is interpolated based on how close the entity's height is to the specified `height`.
* **Parameters:**
    * `height` (`number`): The target world height for the interpolation.

### `GetCurrentAlpha()`
* **Description:** Returns the current alpha value being applied to the entity.
* **Parameters:** None.

## Events & Listeners
This component implicitly listens for the entity's sleep and wake states to manage its update loop efficiently.

*   **Listens To (Implicitly):**
    *   `"entitysleep"` (via `OnEntitySleep` method): Pauses the component's update loop when the entity goes into stasis.
    *   `"entitywake"` (via `OnEntityWake` method): Resumes the component's update loop when the entity comes out of stasis.