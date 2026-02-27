---
id: chaseandram
title: Chaseandram
description: A behaviour node that makes an entity chase and ram toward a combat target, executing attacks along the way while respecting distance, time, and attack count limits.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: behaviour
system_scope: combat
source_hash: bee17ea9
---

# Chaseandram

## Overview

`ChaseAndRam` is a behaviour node used in the DST AI system to orchestrate a charging or chasing attack pattern against a selected target. It inherits from `BehaviourNode` and manages the entity’s locomotion and combat state during pursuit. When active, it lines up the entity for a charged "ram" (i.e., directional charge), executes attacks via `combat:TryAttack()`, and tracks progress using distance, time, and attack count limits. It integrates tightly with the `combat`, `locomotor`, and `embarker` components, and listens for `onattackother` and `onmissother` events to update internal state.

## Dependencies & Tags
- **Components used:**
  - `combat`: Used for `BattleCry()`, `ForceAttack()`, `TryAttack()`, and `SetTarget()`.
  - `locomotor`: Used for `GoToPoint()`, `RunInDirection()`, and `Stop()`.
  - `health`: Checked via `IsDead()` to terminate on target death.
  - `embarker`: Checked for platform-hopping logic via `GetCurrentPlatform()`.
- **Tags:**
  - Adds `"ChaseAndRam"` when the behaviour starts running or while charging.
  - Removes `"ChaseAndRam"` on status change (e.g., failure, success, or interruption).

## Properties

| Property           | Type     | Default Value | Description |
|--------------------|----------|---------------|-------------|
| `inst`             | `Entity` | —             | The entity instance to which this behaviour is attached. |
| `max_chase_time`   | `number` | —             | Maximum duration (in seconds) the entity will continue chasing before aborting. `nil` disables the limit. |
| `give_up_dist`     | `number` | —             | Distance (in units) beyond which the target is considered too far; chaser gives up if it overshoots or falls too far behind. |
| `max_charge_dist`  | `number` | —             | Maximum total distance moved from the start of the charge before aborting. `nil` disables the limit. |
| `max_attacks`      | `number` | —             | Maximum number of attacks to perform before succeeding. `nil` disables the limit. |
| `numattacks`       | `number` | `0`           | Tracks how many attacks have been recorded (via `onattackother` or `onmissother`). |
| `onattackfn`       | `function` | —          | Internal callback for `onattackother` / `onmissother` events. |
| `startruntime`     | `number?` | `nil`        | Timestamp marking when the chase began; used for timing out. |
| `startloc`         | `Vector?` | `nil`        | World position at the start of the chase. |
| `ram_angle`        | `number?` | `nil`        | Angle (in degrees) of the intended charge direction. |
| `ram_vector`       | `Vector?` | `nil`        | Normalized direction vector of the intended charge. |

## Main Functions

### `OnStop()`
* **Description:** Cleans up event callbacks when the behaviour node is stopped (e.g., by parent behaviour or priority override). Prevents memory leaks or stale callbacks.
* **Parameters:** None.
* **Returns:** `nil`.

### `OnAttackOther(target)`
* **Description:** Increments the `numattacks` counter and resets the `startruntime` timer (to restart the chase-time limit) whenever an attack event occurs—regardless of hit or miss. This ensures both successful and missed attacks count toward `max_attacks`.
* **Parameters:**
  - `target` (`Entity?`): The target of the attack event (may be `nil` for misses).
* **Returns:** `nil`.

### `AreDifferentPlatforms(inst, target)`
* **Description:** Determines if the entity and target are on different platforms (e.g., ground vs. bridge) using the `embarker` component. Used to adjust movement logic (e.g., disable ram and fall back to direct pathing).
* **Parameters:**
  - `inst` (`Entity`): The owner entity.
  - `target` (`Entity`): The target entity.
* **Returns:** `boolean` — `true` if the two entities are on different platforms and `embarker` is present; otherwise `false`.

### `Visit()`
* **Description:** The core execution logic of the behaviour node. Operates in two phases: `READY` (initialization and setup) and `RUNNING` (main chase/ram loop).
  
  **In `READY`:**
  - Validates target exists and is alive.
  - Sets `startruntime`, `startloc`, `ram_angle`, and `ram_vector`.
  - Adds `"ChaseAndRam"` tag and transitions to `RUNNING`.
  - If no valid target, sets `status = FAILED` and removes `"ChaseAndRam"`.

  **In `RUNNING`:**
  - Checks for invalid/dead target and transitions to `FAILED`/`SUCCESS` accordingly.
  - Continuously updates `ram_angle` and `ram_vector` if in a rotatable state.
  - Handles platform transitions (`on_different_platforms`) by disabling ram and switching to point pathing.
  - If angle to target ≤ 60°, performs `RunInDirection()` (i.e., the ram).
  - If overstepped (`offset_angle > 60°` and too far), stops, performs `ForceAttack()`, and fails.
  - Attempts `combat:TryAttack()` when not in `atk_pre` state.
  - Monitors all three termination conditions:
    1. `max_attacks` reached → `SUCCESS`.
    2. Distance moved ≥ `max_charge_dist` → `FAILED`.
    3. Elapsed time ≥ `max_chase_time` → `FAILED`.
  - Calls `self:Sleep(0.125)` to yield control between ticks.

* **Parameters:** None.
* **Returns:** `nil` (modifies internal `status` and invokes component actions).

## Events & Listeners

- **Listens to:**
  - `"onattackother"` — Triggers `OnAttackOther()` to count attacks and reset timer.
  - `"onmissother"` — Also triggers `OnAttackOther()` (missed attacks count toward `max_attacks`).
- **Pushes:** None. (Only fires actions on other components; does not emit game events.)

## Notes for Modders

- This behaviour expects the target to be set via `combat:SetTarget(entity)` *before* it is started.
- The `Combat` component’s `BattleCry()` is called upon entering `RUNNING` and when `startruntime` resets.
- Platform-hopping logic is sensitive to presence of the `embarker` component—without it, `AreDifferentPlatforms` always returns `false`.
- The comment in `Visit()` notes that `Stop()` was deliberately omitted on entry to avoid stutter during state transitions (e.g., from `RunAway`), implying `ChaseAndRam` should be inserted into a behaviour tree carefully, ideally after states that own movement clearing.