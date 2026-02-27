---
id: centipedebrain
title: Centipedebrain
description: Implements the behavioral tree AI for the centipede entity, orchestrating movement, combat engagement, retreat, and homing behaviors.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: d53b060b
---

# Centipedebrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This brain component defines the AI behavior for the centipede entity. It uses a priority-based behavioral tree (`BT`) to coordinate high-priority actions such as panic, rolling attacks, combat engagement with a maximum chase duration, evasion (dodging) during cooldowns, homing to a designated home location, and following a leader when assigned. It integrates with components like `combat`, `follower`, and `knownlocations` to make contextual decisions, and relies heavily on predefined behaviors (`ChaseAndAttack`, `RunAway`, `Follow`, `FaceEntity`, `StandStill`) imported via the `behaviours` directory and `BrainCommon`.

The brain prioritizes reactive responses (e.g., panic, dodging) over exploratory behaviors (e.g., homing, following), ensuring combat stability and survival.

## Dependencies & Tags

- **Components used:**
  - `combat`: accessed via `inst.components.combat.target`, `inst.components.combat:InCooldown()`
  - `follower`: accessed via `inst.components.follower:GetLeader()`
  - `knownlocations`: accessed via `inst.components.knownlocations:GetLocation("home")`
- **Tags:**
  - `"notarget"`: checked via `target:HasTag("notarget")` to invalidate potential targets.
- **External behavior modules used:** `standstill`, `runaway`, `doaction`, `follow`, `braincommon`.

## Properties

No public properties are declared in the constructor. The component relies on `inst` (the entity) and behavioral tree (`self.bt`) stored on `self`, as per DST brain conventions.

## Main Functions

### `CentipedeBrain:OnStart()`
* **Description:** Initializes and assigns the behavioral tree root node to `self.bt`. This function is called when the brain becomes active (typically on state graph start or entity spawn). It constructs a hierarchical priority tree that dictates the centipede's behavior in response to internal conditions and external stimuli (e.g., presence of a target, cooldown status, distance to home).
* **Parameters:** None.
* **Returns:** `nil`.

### `GoHomeAction(inst)`
* **Description:** A factory function returning a `BufferedAction` that walks the centipede to its stored home location. Returns `nil` if the centipede currently has a combat target or if no home location is defined.
* **Parameters:**
  - `inst`: The centipede entity instance.
* **Returns:** A `BufferedAction` or `nil`.

### `GetFaceTargetFn(inst)`
* **Description:** Finds the closest player within `START_FACE_DIST` (6 units) who does not have the `"notarget"` tag. Used by `FaceEntity` to determine a target to maintain orientation toward.
* **Parameters:**
  - `inst`: The centipede entity instance.
* **Returns:** A valid player entity or `nil`.

### `KeepFaceTargetFn(inst, target)`
* **Description:** Determines whether the centipede should *continue* facing a given target. It evaluates whether the target still exists and is within `KEEP_FACE_DIST` (8 units), and lacks the `"notarget"` tag.
* **Parameters:**
  - `inst`: The centipede entity instance.
  - `target`: The entity currently being faced.
* **Returns:** `true` if the target should still be faced, `false` otherwise.

### `ShouldGoHome(inst)`
* **Description:** Checks if the centipede should initiate movement toward its home location. Returns `false` if the centipede has a valid leader (via `follower` component); otherwise, checks if the centipede is farther than `GO_HOME_DIST` (1 unit) from its home location.
* **Parameters:**
  - `inst`: The centipede entity instance.
* **Returns:** `true` if the centipede should go home, `false` otherwise.

### `ShouldRoll(inst)`
* **Description:** Conditionally triggers a `"rollattack"` event if the centipede has a target and is farther than `CHARGE_RANGE` (10 units) away from it. Intended to initiate a charge/roll maneuver for closing distance.
* **Parameters:**
  - `inst`: The centipede entity instance.
* **Returns:** `nil` (side-effect only: pushes `"rollattack"` event).

### `GetRunAwayTarget(inst)`
* **Description:** Returns the current combat target as the source of danger that should be evaded.
* **Parameters:**
  - `inst`: The centipede entity instance.
* **Returns:** The combat target entity (or `nil`), passed to the `RunAway` behavior.

## Events & Listeners

- **Pushes:**
  - `"rollattack"`: Triggered by `ShouldRoll` when the centipede begins a charge attack phase. Used by the state graph to transition into the `"charge"` state.

- **Listens to:**
  - None explicitly registered in this file (event-driven reactions are handled by the behaviors referenced in the behavioral tree, e.g., `ChaseAndAttack`, `RunAway` internally manage state changes).

```mdx-code-block
Note: `inst.sg:HasStateTag("charge")` is used internally to conditionally disable the main priority tree while the centipede is in the charge state. This indicates tight coupling with the state graph (SGcentipede) but no explicit event registration occurs in this brain file.