---
id: bishopbrain
title: Bishopbrain
description: Controls the behavior tree of the Clockwork Bishop entity, managing combat, leader following, face-targeting, and returning to home position.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: f19ee654
---

# Bishopbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `BishopBrain` component implements the behavior tree for the Clockwork Bishop entity. It orchestrates high-priority responses such as panic triggers, combat engagement, returning to home position, following a leader, and face-targeting logic. The component inherits from the base `Brain` class and constructs a priority-weighted behavior tree via `OnStart()`, using shared utilities from `braincommon.lua` and `clockwork_common.lua`.

## Dependencies & Tags
- **Components used:** 
  - `combat` (via `HasTarget()` check)
  - `follower` (via `GetLeader()` method)
- **Tags checked:**
  - `notarget`: Used to exclude certain targets from face-targeting logic.
- **Behaviors used:** `standstill`, `doaction`, `follow`, `chaseandattack`, `faceentity`
- **Functions used from external files:**
  - `clockwork_common.GetHomePosition(inst)`, `clockwork_common.WaitForTrader(inst)`
  - `BrainCommon.PanicTrigger()`, `BrainCommon.ElectricFencePanicTrigger()`

## Properties
The `BishopBrain` class inherits directly from `Brain` and does not define additional public properties beyond its inherited `self.bt` (behavior tree). No explicit properties are initialized in the constructor.

## Main Functions
### `BishopBrain:OnStart()`
* **Description:** Initializes and assigns the behavior tree (`self.bt`) for the Bishop entity. The tree is constructed as a priority node list with weighted execution (.25 weight) and includes high-priority panic responses, combat, home-return, leader-following, and face-targeting.
* **Parameters:** None.
* **Returns:** `nil`.

### Local Helper Functions (used in behavior tree construction)
The following functions are local to the script and referenced by the behavior tree nodes:

#### `GoHomeAction(inst)`
* **Description:** Constructs a `BufferedAction` to move the Bishop to its designated home position if no combat target exists and the Bishop is sufficiently far from home.
* **Parameters:**
  - `inst` (Entity instance): The Bishop entity.
* **Returns:** `BufferedAction` or `nil` if conditions are not met.

#### `GetFaceTargetFn(inst)`
* **Description:** Finds the closest player within `START_FACE_DIST` (14 units) who does not have the `notarget` tag.
* **Parameters:**
  - `inst` (Entity instance): The Bishop entity.
* **Returns:** Target entity or `nil`.

#### `KeepFaceTargetFn(inst, target)`
* **Description:** Determines if the Bishop should continue facing the given target (only if within `KEEP_FACE_DIST` = 16 units and target lacks the `notarget` tag).
* **Parameters:**
  - `inst` (Entity instance): The Bishop entity.
  - `target` (Entity instance): The entity being faced.
* **Returns:** `true` if the target is still valid for face-targeting; otherwise `false`.

#### `GetLeader(inst)`
* **Description:** Returns the Bishop's leader via `inst.components.follower:GetLeader()` if the `follower` component exists; otherwise `nil`.
* **Parameters:**
  - `inst` (Entity instance): The Bishop entity.
* **Returns:** Leader entity or `nil`.

#### `GetFaceLeaderFn(inst)`
* **Description:** Wrapper that simply returns `GetLeader(inst)`.
* **Parameters:**
  - `inst` (Entity instance): The Bishop entity.
* **Returns:** Leader entity or `nil`.

#### `KeepFaceLeaderFn(inst, target)`
* **Description:** Verifies that the given `target` is still the Bishop's current leader.
* **Parameters:**
  - `inst` (Entity instance): The Bishop entity.
  - `target` (Entity instance): The candidate leader entity.
* **Returns:** `true` if the target matches the leader; otherwise `false`.

#### `ShouldGoHome(inst)`
* **Description:** Determines if the Bishop should return home: checks that a home position exists and the Bishop is more than `GO_HOME_DIST_SQ` (1 unit squared) away.
* **Parameters:**
  - `inst` (Entity instance): The Bishop entity.
* **Returns:** `true` if the Bishop should go home; otherwise `false`.

## Events & Listeners
None. The `BishopBrain` component does not register or fire events directly.