---
id: distancefade
title: Distancefade
description: This component causes an entity to fade out based on its distance from the camera.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: 07278c0b
---

# Distancefade

## Overview
The Distancefade component manages the visual fading of an entity by adjusting its `AnimState` color alpha based on its distance from the camera. This provides a visual depth cue or can be used to hide distant objects smoothly. It integrates with the game's "wall update" system to perform continuous distance calculations and transparency adjustments.

## Dependencies & Tags
This component implicitly relies on the host entity having the following components:
*   `AnimState`: Required to manipulate the entity's visual transparency.
*   `Transform`: Required to obtain the entity's world position for distance calculations.
No specific tags are added or removed by this component.

## Properties
| Property   | Type     | Default Value | Description                                                                                                                               |
| :--------- | :------- | :------------ | :---------------------------------------------------------------------------------------------------------------------------------------- |
| `range`    | `number` | `25`          | The distance from the camera at which the fading effect begins.                                                                           |
| `fadedist` | `number` | `15`          | The distance over which the fading effect fully applies, measured from the point where `range` is exceeded.                               |
| `extrafn`  | `function` | `nil`       | An optional function that, if set, provides an additional percentage multiplier (0-1) to the final fade calculation.                    |

## Main Functions
### `Setup(range, fadedist)`
*   **Description:** Configures the primary fading parameters for the component.
*   **Parameters:**
    *   `range`: `number`, The new distance from the camera (in game units) after which the fading effect will begin.
    *   `fadedist`: `number`, The new distance (in game units) over which the fading effect will fully apply once `range` is surpassed.

### `SetExtraFn(fn)`
*   **Description:** Sets an optional callback function that can be used to apply an additional percentage multiplier to the fade calculation. This allows for custom fading logic on top of the standard distance-based fade.
*   **Parameters:**
    *   `fn`: `function`, A function that accepts the entity instance (`inst`) and delta time (`dt`) as arguments, and is expected to return a `number` between 0 and 1, representing an additional fade percentage.

### `OnEntitySleep()`
*   **Description:** This callback is invoked when the entity hosting this component goes to sleep. It deregisters the component from receiving further "wall updates."

### `OnEntityWake()`
*   **Description:** This callback is invoked when the entity hosting this component wakes up. It registers the component to begin receiving "wall updates."

### `OnWallUpdate(dt)`
*   **Description:** This method is called repeatedly by the game's update system when the entity is awake and registered for wall updates. It calculates the entity's camera distance and dynamically adjusts its `AnimState` color alpha based on the configured `range` and `fadedist` properties, creating a fading effect. If `ThePlayer` global is not available (e.g., in specific server-side contexts), the entity's color is reset to fully opaque.
*   **Parameters:**
    *   `dt`: `number`, The time elapsed since the last frame.