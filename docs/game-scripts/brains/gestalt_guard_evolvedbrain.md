---
id: gestalt_guard_evolvedbrain
title: Gestalt Guard Evancedbrain
description: Implements the behavior tree for the evolved Gestalt Guard enemy, dynamically selecting attack behavior based on distance to the current combat target.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: b0158237
---

# Gestalt Guard Evolvedbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This component defines the decision-making logic for the evolved Gestalt Guard entity. It constructs and manages a behavior tree (`self.bt`) that orchestrates the entity’s actions in combat. The brain dynamically evaluates the distance to its combat target and executes the appropriate attack sequence—such as teleporting to close distance, evading, or performing melee strikes at close, mid, or far ranges—while respecting busy state constraints.

The brain depends on the `combat` component to identify the current target and coordinates movement and attack actions using utility functions (`GetTarget`, `GetTargetPos`, `IsTarget`) to abstract target state. It imports and utilizes the `standstill` behavior for fallback non-combat states.

## Dependencies & Tags
- **Components used:**
  - `combat` (`inst.components.combat`) — for accessing and validating the current combat target.
- **Tags:**
  - None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (inherited) | The entity instance this brain controls, passed to the constructor and stored as `self.inst`. |
| `bt` | `BT` | `nil` (assigned in `OnStart`) | The behavior tree instance created during `OnStart`. |

*Note: The constructor does not declare additional public properties beyond those initialized in the base `Brain` class.*

## Main Functions

### `OnStart()`
* **Description:** Initializes the behavior tree by constructing the root node tree. This method is called when the brain begins executing (i.e., when the entity’s state graph enters the brain’s active state). It sets up a hierarchy that prioritizes handling non-busy states, computes distance to the target, and selects attack actions conditionally based on range thresholds from `TUNING`.
* **Parameters:** None.
* **Returns:** None.

*Internal logic (not directly callable):*
- `GetTarget(inst)` — Returns `inst.components.combat.target`, the current combat target entity.
- `GetTargetPos(inst)` — Returns the world position of the target, or `nil` if no valid target exists.
- `IsTarget(inst, target)` — Returns `true` if `target` matches the current `combat.target` using `Combat:TargetIs`.
- `calculatedistancetotarget()` — Computes Euclidean distance to the current target using `GetDistanceSqToInst` and stores it in the local `distancetotarget` variable; sets it to `nil` if the target is invalid.
- `startcombatphase()` — Faces the target, attempts teleport-based approach (if `_should_teleport` is true), and if successful, teleports the entity closer. Then attempts evasion via teleport. Returns `true` if a teleport action was taken, else `false`.
- `hastarget()` — Helper returning `true` if `distancetotarget` is non-`nil`.

*Behavior Tree structure:*
- **Root:** `PriorityNode` (weight `0.5`)
  - **Child 1 (Priority):** `WhileNode` (executes only while the entity’s state graph lacks the `"busy"` tag)
    - `FailIfSuccessDecorator(ActionNode(calculatedistancetotarget))`
    - `IfNode(hastarget, "Combat", ...)`
      - `ConditionNode(startcombatphase)`
      - Nested range checks:
        - `"Range: Close"`: executes `TryAttack_Close()` if `distancetotarget < TUNING.GESTALT_EVOLVED_CLOSE_RANGE`
        - `"Range: Mid"`: executes `TryAttack_Mid()` if `distancetotarget < TUNING.GESTALT_EVOLVED_MID_RANGE`
        - `"Range: Far"`: executes `TryAttack_Far()` if `distancetotarget < TUNING.GESTALT_EVOLVED_FAR_RANGE`
        - `"Fallback"`: executes `TryAttack_Teleport_GetCloser()` if none of the above matched
    - `StandStill(self.inst)` — fallback action when not in combat.
  - **Child 2 (Fallback):** `StandStill(self.inst)` — executed while in `"busy"` state.

## Events & Listeners
- None identified.