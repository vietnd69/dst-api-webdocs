---
id: eyeturretbrain
title: Eyeturretbrain
description: Implements the behavior tree for the Eye Turret entity, managing its target acquisition, facing direction, and combat behavior.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 51cecaa6
---

# Eyeturretbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This component defines the AI behavior for the Eye Turret entity. It inherits from `Brain` and constructs a behavior tree (`BT`) upon initialization. The behavior tree prioritizes two key actions: engaging in combat via `StandAndAttack`, and rotating to face the nearest valid target within a specified radius using `FaceEntity`. The component is responsible for initializing the behavior tree root node and does not define additional state management logic beyond this setup.

## Dependencies & Tags
- **Components used:** None identified.
- **Tags:** Checks for the `notarget` tag on potential targets (via `target:HasTag("notarget")`). Turrets ignore targets bearing this tag.

## Properties
- **`self.inst`** | `Entity` | *assigned by Brain base class* | Reference to the Eye Turret entity instance owning this brain component.
- **`self.bt`** | `BT` | `nil` until `OnStart()` is called | The behavior tree instance controlling the entity’s behavior.

## Main Functions
### `EyeTurretBrain:OnStart()`
* **Description:** Initializes and assigns the behavior tree (`self.bt`) for the Eye Turret. It constructs a root priority node that sequentially evaluates and executes either `StandAndAttack` or `FaceEntity`. The priority is `.25`, meaning child behaviors are re-evaluated every 0.25 seconds.
* **Parameters:** None.
* **Returns:** `nil`.

## Events & Listeners
- **Listens to:** None.
- **Pushes:** None.

> **Note:** `GetFaceTargetFn` and `KeepFaceTargetFn` are helper functions defined in the local scope. `GetFaceTargetFn` locates the nearest player within `START_FACE_DIST` (10 units) who lacks the `notarget` tag. `KeepFaceTargetFn` confirms that the current target remains within `KEEP_FACE_DIST` (15 units) and still lacks the `notarget` tag. These functions are passed as callbacks to the `FaceEntity` behavior and are *not* methods of the `EyeTurretBrain` class.