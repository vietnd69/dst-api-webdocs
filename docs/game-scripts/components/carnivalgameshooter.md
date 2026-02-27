---
id: carnivalgameshooter
title: Carnivalgameshooter
description: Manages the aiming and shooting mechanics for a carnival shooting gallery game entity.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: f4028d48
---

# Carnivalgameshooter

## Overview
The `Carnivalgameshooter` component provides the core logic for the carnival shooting minigame. It is responsible for managing the oscillating aiming meter, locking in the aim, and firing a projectile along a calculated arc towards the targets.

## Dependencies & Tags
- **Components:** This component requires the `SoundEmitter` component on the same entity to function correctly.
- **Tags:** None identified.

## Properties
Properties are initialized in the `Initialize` method rather than a constructor.

| Property       | Type   | Default Value                                                              | Description                                                      |
|----------------|--------|----------------------------------------------------------------------------|------------------------------------------------------------------|
| `angle`        | number | `(TUNING.CARNIVALGAME_SHOOTING_ANGLE_METER_MIN + TUNING.CARNIVALGAME_SHOOTING_ANGLE_METER_MAX)/2` | The current aiming angle in degrees.                             |
| `power`        | number | `TUNING.CARNIVALGAME_SHOOTING_POWER`                                         | The pre-defined power or force of the shot.                      |
| `meterdirection` | number | `1`                                                                        | The direction the aiming meter is moving (1 for up, -1 for down). |

## Main Functions
### `Initialize()`
* **Description:** Initializes or resets the shooter's aiming properties to their default state. This sets the starting angle to the midpoint of its range, sets the shot power, and sets the initial meter direction.
* **Parameters:** None.

### `UpdateAiming(dt)`
* **Description:** Updates the aiming angle for the oscillating meter based on the elapsed time (`dt`). The angle moves back and forth between `TUNING.CARNIVALGAME_SHOOTING_ANGLE_METER_MIN` and `TUNING.CARNIVALGAME_SHOOTING_ANGLE_METER_MAX`, reversing direction when it hits a boundary.
* **Parameters:**
    * `dt` (number): The time elapsed since the last update frame.

### `SetAim()`
* **Description:** Plays a sound effect to provide feedback when the player locks in their aim.
* **Parameters:** None.

### `Shoot()`
* **Description:** Spawns a "carnivalgame_shooting_projectile" prefab and launches it. It calculates the target position along a predefined arc based on the entity's rotation and the currently set `angle`. The projectile is then launched towards this target using its `complexprojectile` component.
* **Parameters:** None.