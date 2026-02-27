---
id: minotaurbrain
title: Minotaurbrain
description: Controls the AI behavior tree for the Minotaur enemy, coordinating movement, target tracking, ram attacks, jump attacks, and return-to-home logic.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 8e769774
---

# Minotaurbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This brain component defines the behavior tree for the Minotaur enemy entity. It orchestrates high-level decision-making via a priority-based behavior tree (`BT`), integrating attack logic, environmental awareness (e.g., pillar proximity), and pathing goals (e.g., returning to a known "home" location). It inherits from `Brain` and constructs its behavior tree in the `OnStart()` method. Key interactions include `combat` (target tracking and cooldowns), `health` (assessing health percentage), `knownlocations` (retrieving home position), and `timer` (checking active timers such as cooldowns or stun). It heavily relies on custom behavior nodes (`ChaseAndRam`, `ChaseAndAttack`, `FaceEntity`, `StandStill`, `DoAction`) and condition functions to gate transitions between states.

## Dependencies & Tags

- **Components used:**
  - `combat`: Accesses `target`, `InCooldown()`, `CalcAttackRangeSq()`, and `attackrange` property.
  - `health`: Uses `GetPercent()` to evaluate health status.
  - `knownlocations`: Calls `GetLocation("home")` to determine the Minotaur's home point.
  - `timer`: Queries `TimerExists("rammed")`, `TimerExists("stunned")`, and `TimerExists("leapattack_cooldown")`.

- **Tags checked:**
  - `"notarget"`: Excludes invalid targets from face/attack decisions.
  - `"leapattack"`: Used to prevent conflicting behaviors during jump attacks.
  - `"busy"` and `"running"`: Barrier conditions for initiating or executing jump attacks.
  - `"quake_on_charge"`: Used as a tag filter to detect nearby pillars for ram/jump attack collision checks.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (inherited via `Brain`) | The entity instance this brain controls. |
| `hasrammed` | `boolean or nil` | `nil` | Tracks whether the Minotaur has recently rammed a pillar; used to suppress repeated ram attacks under specific conditions. |
| `bt` | `BT` | `nil` | The constructed behavior tree instance, initialized in `OnStart()`. |

## Main Functions

### `GoHomeAction(inst)`
* **Description:** Creates a buffered walk action toward the Minotaur’s registered home position if no target is active. Returns `nil` if no target and home location is valid; otherwise returns `nil` if target exists or home is missing.
* **Parameters:**
  - `inst` (`Entity`): The Minotaur entity instance.
* **Returns:** `BufferedAction` or `nil`.

### `GetFaceTargetFn(inst)`
* **Description:** Determines the best nearby player to face when stationary or idle, prioritizing proximity and excluding `"notarget"` targets. Returns `nil` if the Minotaur is too far from home (beyond `GO_HOME_DIST`) or no eligible target is found.
* **Parameters:**
  - `inst` (`Entity`): The Minotaur entity instance.
* **Returns:** `Entity?` (valid target) or `nil`.

### `KeepFaceTargetFn(inst, target)`
* **Description:** Continues tracking a given target for face orientation only while near home and within `KEEP_FACE_DIST`. Prevents facing away from home or pursuing distant targets while idle.
* **Parameters:**
  - `inst` (`Entity`): The Minotaur entity instance.
  - `target` (`Entity`): The proposed target to continue facing.
* **Returns:** `boolean` — `true` if the target should remain active for face tracking.

### `ShouldGoHome(inst)`
* **Description:** Evaluates whether the Minotaur should return to its home point. Returns `true` if either (a) it is significantly beyond `GO_HOME_DIST`, or (b) it is farther than `CHASE_GIVEUP_DIST` from home and has no active combat target.
* **Parameters:**
  - `inst` (`Entity`): The Minotaur entity instance.
* **Returns:** `boolean`.

### `closetopillar(inst)`
* **Description:** Detects whether any entity tagged `"quake_on_charge"` (typically pillars) is within a radius of 4 units around the Minotaur.
* **Parameters:**
  - `inst` (`Entity`): The Minotaur entity instance.
* **Returns:** `boolean` — `true` if at least one such entity is nearby.

### `shouldramattack(inst)`
* **Description:** Determines if the Minotaur should execute a ram attack. Returns `nil` if:
  - No target exists,
  - The Minotaur recently rammed and is within attack range (recovery state),
  - A `"rammed"` timer is active and the state graph isn’t running,
  - A `"leapattack"` state tag is active,
  - Or a pillar is too close (blocking impact).
  Otherwise returns `true`.
* **Parameters:**
  - `inst` (`Entity`): The Minotaur entity instance.
* **Returns:** `boolean?` — `true` if ram attack should proceed, `nil` otherwise.

### `shouldjumpattack(inst)`
* **Description:** Determines if the Minotaur should attempt a jump attack. Returns `false` if:
  - Health is above `60%`,
  - The state graph has `"busy"` or `"running"` tags,
  - A `"stunned"` timer is active,
  - The target is too distant (beyond `MAX_JUMP_ATTACK_RANGE`), or
  - A `"leapattack_cooldown"` timer is active *and* the target is within normal attack range,
  - Or a pillar lies between the Minotaur and the target (checked via ray-like angular overlap).
* **Parameters:**
  - `inst` (`Entity`): The Minotaur entity instance.
* **Returns:** `boolean` — `true` if jump attack conditions are satisfied.

### `dojumpAttack(inst)`
* **Description:** Faces the target and fires the `"doleapattack"` event to trigger the jump attack animation and logic in the state graph if not already in a `"leapattack"` state.
* **Parameters:**
  - `inst` (`Entity`): The Minotaur entity instance.
* **Returns:** `nil`.

## Events & Listeners

- **Listens to:**
  - None (this component does not register listeners for external events).

- **Pushes:**
  - `"doleapattack"`: Fired immediately via `inst:PushEventImmediate()` in `dojumpAttack()` to initiate the jump attack state.