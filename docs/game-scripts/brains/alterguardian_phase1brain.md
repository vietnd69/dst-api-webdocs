---
id: alterguardian_phase1brain
title: Alterguardian Phase1Brain
description: Controls the behavior tree logic for the Phase 1 form of the Alter Guardian, managing combat aggression, shield usage, and wandering while preserving proximity to its spawn point.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 2a39a9ec
---

# Alterguardian Phase1Brain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `AlterGuardian_Phase1Brain` component implements the behavior tree for the Phase 1 form of the Alter Guardian entity. It orchestrates decision-making via a hierarchical behavior tree (BT) that prioritizes shield usage, transitions to direct combat when a target is valid and within attack range, and falls back to wandering when no target is present. This brain ensures the entity stays near its designated spawn point by anchoring its wandering to a remembered location, and prevents over-aggressive movement during charge states by wrapping the root behavior in a conditional guard.

## Dependencies & Tags
- **Components used:**
  - `combat`: Accessed via `inst.components.combat` for target retrieval, attack validation (`CanAttack`), and cooldown checks (`InCooldown`).
  - `knownlocations`: Used to remember and later retrieve the `spawnpoint` location for wandering anchoring.
- **Tags:**
  - Checks for state tag `"charge"` via `self.inst.sg:HasStateTag("charge")` to suppress movement during charging.
  - No tags are added or removed by this brain directly.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | Entity instance | (injected via `Brain._ctor`) | Reference to the entity instance this brain controls. |
| `bt` | BehaviorTree | `nil` (assigned in `OnStart`) | The compiled behavior tree used to execute behaviors. |

## Main Functions

### `AlterGuardian_Phase1Brain:OnStart()`
* **Description:** Initializes and assigns the behavior tree (`self.bt`) for the entity. Constructs a priority-based root behavior node that executes: (1) shield usage when triggered, (2) immediate attack when target is valid and cooldown permits, and (3) wandering when no combat conditions are met. It also wraps this root under a guard that suppresses wandering while the entity is in a `"charge"` state.
* **Parameters:** None.
* **Returns:** Nothing.

### `AlterGuardian_Phase1Brain:OnInitializationComplete()`
* **Description:** Records the entity's current position as the `spawnpoint` location. This location is used by the wander behavior as the home anchor when no combat target exists.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetWanderHome(inst)` (local helper)
* **Description:** Returns the home position for wandering. If a combat target exists, returns `nil` (allowing dynamic pathing); otherwise, retrieves the remembered `spawnpoint`.
* **Parameters:**
  - `inst`: Entity instance — typically the Alter Guardian.
* **Returns:** `Vector3?` — Position of the `spawnpoint` if no target, otherwise `nil`.

### `GetWanderDir(inst)` (local helper)
* **Description:** Calculates a randomized movement direction when a combat target exists. Computes the angle toward the target and adds up to ±30 degrees of randomness, then returns the direction as a radian angle.
* **Parameters:**
  - `inst`: Entity instance — typically the Alter Guardian.
* **Returns:** `number?` — Direction angle in radians (relative to world forward), or `nil` if no target.

## Events & Listeners
None. This brain does not register or dispatch events directly.