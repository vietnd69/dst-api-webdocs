---
id: moosebrain
title: Moosebrain
description: Controls the behavior tree of the moose entity, coordinating movement, combat, egg-laying, and facial orientation using behavior tree nodes and known locations.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 34b572c5
---

# Moosebrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This component implements the behavior tree for the moose entity in Don't Starve Together. It orchestrates high-level behaviors such as fleeing (`shouldGoAway`), leash tracking, chasing and attacking targets, laying eggs, facing nearby players, and wandering near a designated home location (`landpoint`). It inherits from `Brain` and constructs a `BT` (Behavior Tree) in `OnStart()` using priority-ordered behavior nodes defined in external behavior modules.

The moosebrain relies on several external components: `Combat` for target tracking, `KnownLocations` for home/landmark positions, and `EntityTracker` for locating related entities like eggs. It integrates with the `behaviours` module to delegate specific behavioral tasks (e.g., `ChaseAndAttack`, `FaceEntity`, `Leash`, `Wander`).

## Dependencies & Tags

- **Components used:**
  - `Combat` (via `self.inst.components.combat`)
  - `KnownLocations` (via `self.inst.components.knownlocations`)
  - `EntityTracker` (via `self.inst.components.entitytracker`)
- **Tags:**
  - Checks: `"notarget"`, `"busy"` (via `inst:HasTag("notarget")`, `self.inst.sg:HasStateTag("busy")`)
  - Sets: `"busy"` is only read (no tag modification logic present in this script)

## Properties

| Property       | Type     | Default Value | Description |
|----------------|----------|---------------|-------------|
| `inst.shouldGoAway` | `boolean` | `nil` (checked dynamically) | Indicates whether the moose should flee/halt aggressive behavior and return home. |
| `inst.WantsToLayEgg` | `boolean` | `nil` (checked dynamically) | Controls whether the moose attempts to lay an egg. |
| `inst.sg` | `StateGraph` | — | The state graph instance; used to check `busy` state tag. |
| `self.bt` | `BT` | `nil` (assigned in `OnStart`) | The behavior tree constructed in `OnStart()`. |

## Main Functions

### `GoHome(inst)`
* **Description:** Returns a buffered `ACTIONS.GOHOME` action if the moose is in "go away" mode and has no active combat target; otherwise returns `nil`.
* **Parameters:** `inst` — the moose entity instance.
* **Returns:** `BufferedAction` (if conditions are met) or `nil`.

### `GetFaceTargetFn(inst)`
* **Description:** Finds the closest player within `START_FACE_DIST` (15 units) that does not have the `"notarget"` tag, provided the moose is not currently in a "busy" state. Used by the `FaceEntity` behavior to select a new target to face.
* **Parameters:** `inst` — the moose entity instance.
* **Returns:** `Entity` (if found) or `nil`.

### `KeepFaceTargetFn(inst, target)`
* **Description:** Determines whether to continue facing a given target. Returns `true` only if the moose is not in a "busy" state, does not have `"notarget"`, and is within `KEEP_FACE_DIST` (20 units) of the target.
* **Parameters:**  
  - `inst` — the moose entity instance.  
  - `target` — the entity currently being faced.  
* **Returns:** `boolean`.

### `LayEgg(inst)`
* **Description:** Returns a buffered `ACTIONS.LAYEGG` action if the moose wishes to lay an egg and no egg entity has been registered yet via `EntityTracker`.
* **Parameters:** `inst` — the moose entity instance.
* **Returns:** `BufferedAction` (if conditions are met) or `nil`.

### `MooseBrain:OnStart()`
* **Description:** Initializes the behavior tree with a priority-based root node that evaluates (in order):  
  1. Flee if `shouldGoAway` is true (calls `GoHome`).  
  2. Enforce leash distance (25 units) from the `"landpoint"` location.  
  3. Chase and attack the current combat target.  
  4. Attempt egg laying.  
  5. Face a target (via `GetFaceTargetFn` and `KeepFaceTargetFn`).  
  6. Wander within 15 units of `"landpoint"`.  
  The lowest-priority node is `Wander`. This function must be called by the game when the moose enters the world.
* **Parameters:** None.
* **Returns:** None.

### `MooseBrain:OnInitializationComplete()`
* **Description:** Records the moose's initial position as `"spawnpoint"` in `KnownLocations` using `RememberLocation`. Ensures the spawn location is stored before gameplay proceeds.
* **Parameters:** None.
* **Returns:** None.

## Events & Listeners

None.