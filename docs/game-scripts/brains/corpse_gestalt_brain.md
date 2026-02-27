---
id: corpse_gestalt_brain
title: Corpse Gestalt Brain
description: Controls the behavior of a floating corpse entity that moves toward and eventually infests a tracked corpse target.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: entity
source_hash: 0146e001
---

# Corpse Gestalt Brain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This brain controls a small, floating entity (typically a "corpse gestalt") that tracks a single corpse target via the `entitytracker` component. Its primary responsibility is to manage movement and infestation logic: when the entity gets close enough to its target, it moves to the target's position and transitions to an `infest_corpse` state; otherwise, it navigates around the target or drifts freely while remaining within player view distance. If it moves too far from all players, it removes itself from the world.

## Dependencies & Tags

- **Components used:**
  - `entitytracker`: accessed via `inst.components.entitytracker:GetEntity(CORPSE_TRACK_NAME)` to retrieve the tracked corpse.
- **Tags:**
  - `"idle"`: checked via `inst.sg:HasStateTag("idle")` to determine if movement is allowed.
  - `"infesting"`: checked via `inst.sg:HasStateTag("infesting")` to avoid conflicting free movement logic.

## Properties

No public instance properties are explicitly initialized in the constructor. The class inherits from `Brain` and solely manages behavior tree construction and action logic.

## Main Functions

### `CalcNewPosition(inst, radius, angle)`
* **Description:** Computes a new position in world space offset from the entity's current position using polar coordinates with a randomized angular deviation (within ±0.45π radians). Used to generate positions for movement while avoiding direct line-of-sight clustering.
* **Parameters:**
  - `inst`: The entity instance performing the calculation.
  - `radius`: Numeric scalar specifying radial distance from the entity.
  - `angle`: Numeric scalar (in radians) representing the base direction.
* **Returns:** `Vector3` — the new target position in world space.

### `MoveToPointAction(inst)`
* **Description:** Core action function that determines movement behavior. It retrieves the tracked corpse using `entitytracker`, then decides whether to attach (if very close), follow (if moderately close), orbit (if farther away), or drift randomly (if no target is valid or outside close range). It also handles entity removal if no players are nearby.
* **Parameters:**
  - `inst`: The entity instance on which movement logic operates.
* **Returns:** `Action` — a buffered `WALKTO` action toward the computed `pos`, or `nil` if no movement is needed or entity was removed.

### `CorpseGestaltBrain:OnStart()`
* **Description:** Initializes the behavior tree for the entity. Sets up a single top-level `WhileNode` that continuously triggers `MoveToPointAction` as long as the stategraph has the `"idle"` tag.
* **Parameters:** None.
* **Returns:** None — assigns `self.bt` to a newly constructed `BT` instance.

## Events & Listeners

None — this brain component does not register or push any events directly.

---