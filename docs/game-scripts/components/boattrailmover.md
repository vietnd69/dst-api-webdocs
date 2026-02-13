---
id: boattrailmover
title: Boattrailmover
description: Manages the movement and orientation of a boat's wake effect, simulating its travel and dissipation.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# Boattrailmover

## Overview
The `Boattrailmover` component is responsible for the independent movement of an entity, typically a visual effect like a boat's wake. Once set up, it propels the entity in a specified direction with an initial velocity and constant acceleration, simulating the effect's movement and dissipation across the water's surface.

## Dependencies & Tags
None identified.

## Properties
| Property | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `track_boat_time` | number | `0.4` | A countdown timer, decremented on each update tick. |
| `dir_x` | number | `nil` | The x-component of the movement direction vector, set during `Setup`. |
| `dir_z` | number | `nil` | The z-component of the movement direction vector, set during `Setup`. |
| `velocity` | number | `nil` | The current speed of the entity along its direction vector. |
| `acceleration` | number | `nil` | The rate at which the entity's velocity changes over time. |

## Main Functions
### `Setup(dir_x, dir_z, velocity, acceleration)`
* **Description:** Initializes the component with all necessary movement parameters. It sets the initial direction and rotation of the entity, defines its velocity and acceleration, and starts the component's update loop.
* **Parameters:**
    * `dir_x` (number): The x-component of the desired movement direction.
    * `dir_z` (number): The z-component of the desired movement direction.
    * `velocity` (number): The initial speed of the entity.
    * `acceleration` (number): The constant acceleration to apply to the entity's velocity on each update.

### `OnUpdate(dt)`
* **Description:** This function is called every frame to update the entity's state. It calculates the new position based on the current velocity and direction, and then updates the velocity using the defined acceleration. It also decrements the `track_boat_time` property.
* **Parameters:**
    * `dt` (number): The time elapsed since the last update (delta time).