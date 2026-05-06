---
id: SGwx78_drone_zap
title: SGwx78 Drone Zap
description: Animation state machine for WX-78's drone zap, handling deployment, movement, and attack sequences.
tags: [drone, zap, stategraph, animation]
sidebar_position: 10
last_updated: 2026-05-05
build_version: 722832
change_status: stable
category_type: stategraphs
source_hash: 5a4b4928
system_scope: animation
---

# SGwx78 Drone Zap

> Based on game build **722832** | Last updated: 2026-05-05

## Overview
`wx78_drone_zap` is an animation state machine for WX-78's drone zap functionality. It controls the drone's deployment, movement, and attack sequences, including hover, acceleration, and projectile firing. The state machine handles locomotion, combat transitions, and sound management for the drone entity. Major state categories: deployment (deploy, collapse), movement (idle, run_start, run, run_stop), and attack (attack).

## Usage example
```lua
-- Attach the stategraph to an entity
inst:SetStateGraph("wx78_drone_zap")

-- Trigger the deploy state
inst.sg:GoToState("deploy")

-- Listen for drone zap fired event
inst:ListenForEvent("ms_drone_zap_fired", function(inst, data)
    -- Handle projectile firing
end)
```

## Dependencies & tags
**External dependencies:**
- `math2d` -- used for angle calculations and line intersection
- `TUNING` -- accessed for drone speed and other constants
- `SpawnPrefab` -- creates projectile effects

**Components used:**
- `Transform` -- for position, rotation, and physics
- `Physics` -- for motor velocity and teleportation
- `AnimState` -- for animation playback
- `Light` -- for flickering light effects
- `SoundEmitter` -- for sound playback

**Tags:**
- `busy` -- added during deploy, collapse, and attack states to block other transitions
- `idle` -- added in idle and run_stop states for resting behavior
- `moving` -- added in run_start, run, and run_stop states for movement
- `running` -- added in run_start and run states for active movement
- `attack` -- added in attack state for combat behavior

## Properties

| State name | Tags | Description |
|------------|------|-------------|
| `deploy` | `busy` | Initial deployment state; plays deploy animation and stops physics. |
| `collapse` | `busy` | Landing state; plays collapse animation and handles landing physics. |
| `idle` | `idle` | Default resting state; loops idle animation and hover behavior. |
| `run_start` | `moving, running` | Acceleration state; starts movement with a run_pre animation. |
| `run` | `moving, running` | Constant movement state; loops run_loop animation. |
| `run_stop` | `idle` | Deceleration state; stops movement with run_pst animation. |
| `attack` | `attack, busy` | Attack state; fires a projectile and manages hover during attack sequence. |

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `PROPELLER_VOLUME` | constant (local) | `0.5` | Volume level for propeller sounds. |
| `FRAMES` | constant (global) | `1` | Frame unit for timeline events. |
| `DEGREES` | constant (global) | `math.pi/180` | Conversion factor from degrees to radians. |
| `TWOPI` | constant (global) | `2 * math.pi` | Full circle in radians. |
| `TUNING.SKILLS.WX78.ZAPDRONE_SPEED` | constant (global) | `1.5` | Default speed for the drone during movement. |

## Main functions

### `onenter (deploy)`
* **Description:** Plays deploy animation, starts idle sound loop, and stops physics. Initializes velocity to zero.
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None.

### `onenter (collapse)`
* **Description:** Plays collapse animation and kills all sound loops.
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None.

### `onenter (idle)`
* **Description:** Plays idle animation in loop, starts idle sound loop, and initializes hover timer.
* **Parameters:** `inst` -- entity owning the stategraph, `t` -- optional hover timer start value
* **Returns:** nil
* **Error states:** None.

### `onenter (run_start)`
* **Description:** Sets four-faced transform, plays run_pre animation, starts run sound loop, and initializes speed acceleration parameters.
* **Parameters:** `inst` -- entity owning the stategraph, `t` -- optional hover timer start value
* **Returns:** nil
* **Error states:** None.

### `onenter (run)`
* **Description:** Sets four-faced transform, plays run_loop animation in loop, starts run sound loop, and initializes hover timer.
* **Parameters:** `inst` -- entity owning the stategraph, `t` -- optional hover timer start value
* **Returns:** nil
* **Error states:** None.

### `onenter (run_stop)`
* **Description:** Sets four-faced transform, plays run_pst animation, and initializes hover timer.
* **Parameters:** `inst` -- entity owning the stategraph, `t` -- optional hover timer start value
* **Returns:** nil
* **Error states:** None.

### `onenter (attack)`
* **Description:** Plays attack animations (atk_pre, atk, atk_pst), starts idle sound loop, and sets hover state to charging.
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None.

### `onexit (run_start)`
* **Description:** Resets transform to no-faced if not running (i.e., if the run_start state did not transition to run).
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None.

### `onexit (run)`
* **Description:** Resets transform to no-faced if not running (i.e., if the run state did not continue to run_stop).
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None.

### `onexit (run_stop)`
* **Description:** Resets transform to no-faced.
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None.

### `onexit (attack)`
* **Description:** Resets flicker, removes projectile if still attached.
* **Parameters:** `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None.

### `onupdate (deploy) (local)`
* **Description:** Handles hover behavior during deployment state; calculates vertical position and velocity for hovering.
* **Parameters:** `inst` -- entity owning the stategraph, `dt` -- delta time
* **Returns:** nil
* **Error states:** None.

### `onupdate (collapse) (local)`
* **Description:** Handles landing physics; calculates vertical velocity and position to land at ground level.
* **Parameters:** `inst` -- entity owning the stategraph, `dt` -- delta time
* **Returns:** nil
* **Error states:** None.

### `onupdate (idle) (local)`
* **Description:** Handles hover behavior; calculates vertical position based on sine wave for smooth hovering.
* **Parameters:** `inst` -- entity owning the stategraph, `dt` -- delta time
* **Returns:** nil
* **Error states:** None.

### `onupdate (run_start) (local)`
* **Description:** Handles acceleration for running; gradually increases speed multiplier over frames.
* **Parameters:** `inst` -- entity owning the stategraph, `dt` -- delta time
* **Returns:** nil
* **Error states:** None.

### `onupdate (run) (local)`
* **Description:** Handles hover behavior during constant movement; applies drone speed multiplier.
* **Parameters:** `inst` -- entity owning the stategraph, `dt` -- delta time
* **Returns:** nil
* **Error states:** None.

### `onupdate (run_stop) (local)`
* **Description:** Handles hover behavior during deceleration; applies normal hover physics.
* **Parameters:** `inst` -- entity owning the stategraph, `dt` -- delta time
* **Returns:** nil
* **Error states:** None.

### `onupdate (attack) (local)`
* **Description:** Handles hover behavior during attack sequence; manages charging, recoil, and settling phases with flickering light.
* **Parameters:** `inst` -- entity owning the stategraph, `dt` -- delta time
* **Returns:** nil
* **Error states:** None.

### `CanMoveInDir2(inst, costheta, sintheta) (local)`
* **Description:** Checks if movement in a direction is permitted, considering flying restrictions and obstacles. Returns false if movement is blocked.
* **Parameters:**
  - `inst` -- drone entity
  - `costheta` -- cosine of direction angle
  - `sintheta` -- sine of direction angle
* **Returns:** boolean indicating if movement is permitted
* **Error states:** None.

### `CanMoveInDir(inst, dir) (local)`
* **Description:** Converts direction in degrees to radians and calls CanMoveInDir2.
* **Parameters:**
  - `inst` -- drone entity
  - `dir` -- direction in degrees
* **Returns:** boolean indicating if movement is permitted
* **Error states:** None.

### `CalcDecelVelXZ(inst, decel, costheta, sintheta) (local)`
* **Description:** Calculates decelerated velocity in world space for XZ plane.
* **Parameters:**
  - `inst` -- drone entity
  - `decel` -- deceleration value
  - `costheta` -- cosine of direction angle
  - `sintheta` -- sine of direction angle
* **Returns:** new velocity components (vx, vz)
* **Error states:** Errors if inst.sg.mem.vel is nil (no guard present).

### `UpdateHover(inst, dt) (local)`
* **Description:** Controls hover behavior during normal movement; calculates vertical position and velocity based on sine wave. Adjusts horizontal velocity for movement speed.
* **Parameters:**
  - `inst` -- drone entity
  - `dt` -- delta time
* **Returns:** nil
* **Error states:** Errors if inst.sg.mem.vel is nil (no guard present).

### `UpdateAttackHover(inst, dt) (local)`
* **Description:** Controls hover behavior during attack sequence; manages charging, recoil, and settling phases with varying amplitude and height.
* **Parameters:**
  - `inst` -- drone entity
  - `dt` -- delta time
* **Returns:** nil
* **Error states:** Errors if inst.sg.mem.vel is nil (no guard present).

### `UpdateLanding(inst, dt) (local)`
* **Description:** Controls landing physics; calculates vertical velocity to land at ground level.
* **Parameters:**
  - `inst` -- drone entity
  - `dt` -- delta time
* **Returns:** nil
* **Error states:** Errors if inst.sg.mem.vel is nil (no guard present).

### `SetFlicker(inst, c) (local)`
* **Description:** Sets flickering light effect for the drone; adjusts light intensity and color.
* **Parameters:**
  - `inst` -- drone entity
  - `c` -- color value for flicker
* **Returns:** nil
* **Error states:** Errors if inst.Light is nil (no guard present).

### `SetSoundLoop(inst, name) (local)`
* **Description:** Manages sound loops for propeller sounds; kills other sound loops and starts the specified one.
* **Parameters:**
  - `inst` -- drone entity
  - `name` -- sound loop name ("idle", "run", or nil)
* **Returns:** nil
* **Error states:** Errors if inst.SoundEmitter is nil (no guard present).

## Events & listeners
**Listens to:**
- `locomote` -- triggers movement direction updates; checks flying permission and updates physics.
- `doattack` -- transitions to attack state if not busy or killed.
- `animover` -- in deploy, run_start, run_stop states; transitions to next state when animation completes.
- `animqueueover` -- in attack state; transitions to idle when attack animations complete.

**Pushes:**
- `ms_drone_zap_fired` -- pushed when the projectile is launched during attack state.

**World state watchers:**
**None.**