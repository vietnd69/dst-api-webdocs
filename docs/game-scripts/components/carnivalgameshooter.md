---
id: carnivalgameshooter
title: Carnivalgameshooter
description: Manages the aiming and shooting mechanics for the carnival shooting mini-game, controlling projectile launch parameters and aim animation.
tags: [minigame, combat, animation, physics]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: f4028d48
system_scope: world
---

# Carnivalgameshooter

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`CarnivalGameShooter` implements the core logic for the carnival shooting mini-game projectile launcher. It maintains an oscillating aiming angle and calculates projectile trajectories relative to the entity’s orientation. The component does not manage state persistence or network sync directly but delegates projectile physics to the `ComplexProjectile` component.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("carnivalgameshooter")
inst.components.carnivalgameshooter:Initialize()
-- During gameplay loop:
local angle, direction = inst.components.carnivalgameshooter:UpdateAiming(dt)
inst.components.carnivalgameshooter:Shoot()
```

## Dependencies & tags
**Components used:** `complexprojectile`, `transform`, `soundemitter`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `angle` | number | Calculated as midpoint of min/max tuning | Current aiming angle in degrees, oscillates during gameplay. |
| `power` | number | `TUNING.CARNIVALGAME_SHOOTING_POWER` | Projectile power parameter (unused in current implementation). |
| `meterdirection` | number | `1` | Direction of angle oscillation: `1` for increasing, `-1` for decreasing. |

## Main functions
### `Initialize()`
* **Description:** Initializes default aim parameters: sets `angle` to the midpoint of the allowed range and assigns the configured `power`. Does not affect `meterdirection`, which remains `nil` until updated.
* **Parameters:** None.
* **Returns:** Nothing.

### `UpdateAiming(dt)`
* **Description:** Updates the current aiming angle over time, bouncing between the min/max angle bounds defined in tuning. Simulates a back-and-forth aiming meter.
* **Parameters:** `dt` (number) — Delta time in seconds since last frame.
* **Returns:** Two values: `angle` (number) — current aim angle in degrees; `meterdirection` (number) — current oscillation direction (`1` or `-1`).

### `SetAim()`
* **Description:** Plays a placement sound effect when the cannon is positioned (e.g., on setup).
* **Parameters:** None.
* **Returns:** Nothing.

### `Shoot()`
* **Description:** Spawns a `carnivalgame_shooting_projectile` prefab, positions it relative to the shooter, and launches it along a calculated arc trajectory. Uses `ComplexProjectile` to handle physics launch and flight.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.
