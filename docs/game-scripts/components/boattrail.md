---
id: boattrail
title: Boattrail
description: Manages the creation of visual water wake effects behind a moving entity.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: environment
source_hash: 26c1d469
---

# Boattrail

## Overview
The Boattrail component is responsible for generating a trail of visual water wake effects as its parent entity moves. It tracks the distance traveled and periodically spawns a `boat_water_fx` prefab to create the illusion of a wake. The component automatically stops updating when the entity is asleep (off-screen) to conserve resources.

## Dependencies & Tags
None identified.

## Properties

| Property | Type | Default Value | Description |
|---|---|---|---|
| `anim_idx` | `number` | `0` | A zero-based index used to cycle through the available wake animations. |
| `effect_spawn_rate` | `number` | `1` | The distance the entity must travel before a new wake effect is spawned. |
| `radius` | `number` | `3` | The distance behind the entity's center where the wake effect is spawned. |
| `scale_x` | `number` | `1` | The horizontal scale applied to the spawned wake effect prefab. |
| `scale_z` | `number` | `1` | The depth scale applied to the spawned wake effect prefab. |
| `total_distance_traveled` | `number` | `0` | Tracks the accumulated distance traveled since the last effect was spawned. |
| `last_x` | `number` | `nil` | The entity's X-coordinate from the previous update frame. |
| `last_z` | `number` | `nil` | The entity's Z-coordinate from the previous update frame. |

## Main Functions
### `SpawnEffectPrefab(x, y, z, dir_x, dir_z)`
* **Description:** Spawns a single `boat_water_fx` prefab at a calculated position behind the entity, applies scaling, and assigns a semi-random animation to it. If the spawned prefab has a `boattrailmover` component, this function will configure it.
* **Parameters:**
    * `x, y, z`: The current world coordinates of the parent entity.
    * `dir_x, dir_z`: The normalized direction vector of the parent entity's movement.

### `OnUpdate(dt)`
* **Description:** This function is called every frame. It calculates the distance the entity has traveled since the last update. If the accumulated distance exceeds `effect_spawn_rate`, it calls `SpawnEffectPrefab` to create a new wake effect and resets the distance counter.
* **Parameters:**
    * `dt`: The delta time (time elapsed since the last frame).

## Events & Listeners
* **`entitysleep`**: When the parent entity goes to sleep (is off-screen), this component stops its update tick to save performance.
* **`entitywake`**: When the parent entity wakes up (comes on-screen), this component resets its position tracking and resumes its update tick.