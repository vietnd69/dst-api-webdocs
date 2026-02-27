---
id: mosquitobrain
title: Mosquitobrain
description: Controls the behavior tree logic for the mosquito entity, coordinating movement, combat, and homing behaviors via a priority-based state machine.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 0f5581cf
---

# Mosquitobrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `MosquitoBrain` component defines the behavior tree for the mosquito entity in Don't Starve Together. It orchestrates high-level decision-making using a priority-weighted behavior tree, integrating core behaviors such as fleeing from danger, chasing targets, returning home during daylight or winter, leashing to a home location, following a leader, and wandering when no immediate priorities apply. It relies on external behavior modules (e.g., `ChaseAndAttack`, `RunAway`, `Wander`, `Leash`, `Follow`) and interacts with several components (`combat`, `follower`, `homeseeker`, `knownlocations`) to evaluate conditions and select actions.

## Dependencies & Tags
- **Components used:**
  - `combat`: Used to validate targets, check cooldown status (`InCooldown()`), and access `target`.
  - `follower`: Used to retrieve the mosquito's leader via `GetLeader()`.
  - `homeseeker`: Used to check for and access the home location.
  - `knownlocations`: Used to retrieve stored locations (e.g., `"home"`).
- **Tags:** None identified.

## Properties
No public instance properties are defined in the constructor. Behavior configuration is embedded in local constants and functions.

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `self.inst` | `Entity` | (inherited) | The entity instance to which this brain is attached. |
| `self.bt` | `BT` | `nil` (set in `OnStart`) | The behavior tree instance constructed during startup. |

## Main Functions

### `MosquitoBrain:OnStart()`
* **Description:** Initializes and assigns the behavior tree (`self.bt`) for the mosquito. Constructs a priority-ordered root node that evaluates conditions to select the highest-priority behavior (panic, follow, leash, attack, go home, flee, or wander).
* **Parameters:** None.
* **Returns:** `nil`.

### Local Utility Functions
These helper functions are referenced within the behavior tree and evaluate runtime conditions.

#### `GoHomeAction(inst)`
* **Description:** Returns a buffered action to go to the mosquito's home location if the home exists and is valid; otherwise returns `nil`.
* **Parameters:**
  - `inst`: `Entity` — The mosquito entity.
* **Returns:** `Action?` — A `BufferedAction` to execute `"go home"`, or `nil`.

#### `GetLeader(inst)`
* **Description:** Returns the mosquito's leader (if any) by delegating to the `follower` component.
* **Parameters:**
  - `inst`: `Entity`.
* **Returns:** `Entity?` — The leader entity, or `nil`.

#### `WanderTarget(inst)`
* **Description:** Determines the target position for wandering. Prioritizes the combat target, then the leader, and finally the "home" location.
* **Parameters:**
  - `inst`: `Entity`.
* **Returns:** `Vector3?` — The position to wander toward.

#### `ShouldGoHome(inst)`
* **Description:** Determines if the mosquito should attempt to go home (i.e., during winter or daytime unless `override_stay_out` is `true`).
* **Parameters:**
  - `inst`: `Entity`.
* **Returns:** `boolean`.

#### `GetNoLeaderHomePos(inst)`
* **Description:** Returns the "home" location only if the mosquito has no leader; otherwise returns `nil`.
* **Parameters:**
  - `inst`: `Entity`.
* **Returns:** `Vector3?`.

#### `ShouldChaseAndAttack(inst)`
* **Description:** Evaluates whether the mosquito should engage in combat (no current target or not in attack cooldown).
* **Parameters:**
  - `inst`: `Entity`.
* **Returns:** `boolean`.

#### `ShouldRunAway(inst)`
* **Description:** Evaluates whether the mosquito should flee (i.e., has a target *and* is in attack cooldown).
* **Parameters:**
  - `inst`: `Entity`.
* **Returns:** `boolean`.

#### `GetRunawayTarget(inst)`
* **Description:** Returns the current combat target as the source of threat to flee from.
* **Parameters:**
  - `inst`: `Entity`.
* **Returns:** `Entity?`.

## Events & Listeners
None identified — this brain component does not directly register or emit events. Behavior is driven solely by the behavior tree evaluation cycle.