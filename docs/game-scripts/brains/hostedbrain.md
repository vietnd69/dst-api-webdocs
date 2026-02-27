---
id: hostedbrain
title: Hostedbrain
description: A brain component that coordinates group-based combat behavior for hosted entities (e.g., shadow thralls), enabling coordinated attacks and formation positioning while managing shared targeting with nearby allies.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: b2631255
---

# Hostedbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `HostedBrain` component defines the AI behavior for entities that operate as coordinated "hosted" units—typically parasitic minions (e.g., spider-related entities) that engage in group combat. It orchestrates behavior through a behavior tree to prioritize attacking while respecting a shared targeting system (via `combat:SuggestTarget` and `combat:ShareTarget`). Units maintain formation relative to their target and coordinate with nearby hosted allies to limit simultaneous attacks. The brain ensures proper cleanup upon removal and registers for combat-related events.

This brain is built on top of `Brain` (via `Class(Brain, ...)`), reusing common utility behaviors (`Wander`, `ChaseAndAttack`, `Leash`, `FaceEntity`, `DoAction`, `StandStill`), and integrates with the `Combat` component for target management.

## Dependencies & Tags

- **Components used:**
  - `combat`: accessed via `inst.components.combat` to check cooldowns, suggest targets, and share aggro.
  - `Transform`: used for position/angle calculations.
- **Tags used:**
  - `HOSTED_MUST_TAGS = { "shadowthrall_parasite_hosted" }`: entities must have this tag to be considered as potential allies for targeting.
  - `HOSTED_CANT_TAGS = { "FX", "NOCLICK", "DECOR", "INLIMBO" }`: implicitly excluded from targeting/search (used by common utility functions).
- **No tags are added or removed** by this component.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst.reserved_target` | `entity?` | `nil` | Temporarily assigned when this entity reserves the right to attack the current combat target (used to prevent excessive simultaneous attacks in formation). Cleared after returning to formation via `DoAction(ClearReservedTarget)`. |
| `PARASITES` (global) | `table` | `{}` | Tracks all active hosted entities using this brain (keyed by entity instance). Used to count how many allies are already attacking the same target. |

## Main Functions

### `ClearReservedTarget(inst)`
* **Description:** Resets the `reserved_target` property on the instance, effectively releasing the reservation to attack. Typically invoked after the entity returns to formation.
* **Parameters:**
  - `inst`: The entity instance whose `reserved_target` should be cleared.
* **Returns:** None.

### `GetTarget(inst)`
* **Description:** Retrieves the current combat target stored in the `Combat` component.
* **Parameters:**
  - `inst`: The entity instance.
* **Returns:** `entity?` — The current target, or `nil` if no target is set.

### `GetTargetPos(inst)`
* **Description:** Returns the world position of the current combat target, if valid.
* **Parameters:**
  - `inst`: The entity instance.
* **Returns:** `{x: number, y: number, z: number}` or `nil`.

### `GetFormationPos(inst)`
* **Description:** Calculates a position behind the combat target (relative to the entity’s current angle), used as the destination in the `Leash` behavior to maintain formation.
* **Parameters:**
  - `inst`: The entity instance.
* **Returns:** `{x: number, y: number, z: number}` or `nil` if no target.

### `CanAttackTarget(inst)`
* **Description:** Determines if this entity is permitted to attack the current target. Enforces formation attack coordination: if `FORMATION_SIMULTANEOUS_ATTACKS` (set to `2`) allies are already attacking, or if a random roll fails (70% chance to claim attack right), it returns `false` to stagger attacks. If allowed, it reserves the target for itself.
* **Parameters:**
  - `inst`: The entity instance.
* **Returns:** `boolean` — `true` if the entity may attack *now* and has reserved the target; `false` otherwise.

### `OnAttacked(inst, data)`
* **Description:** Event handler for the `"attacked"` event. Automatically sets the attacker as the new combat target and shares aggro with up to 30 nearby entities that have the `shadowthrall_parasite_hosted` tag.
* **Parameters:**
  - `inst`: The entity instance.
  - `data`: Event data containing `data.attacker`.
* **Returns:** None.

### `OnRemoved(inst)`
* **Description:** Removes this entity from the global `PARASITES` table to stop it from being considered in attack coordination.
* **Parameters:**
  - `inst`: The entity instance.
* **Returns:** None.

### `HostedBrain:OnStart()`
* **Description:** Initializes the behavior tree and event listeners. Adds this instance to `PARASITES` (if still valid), sets up `"attacked"` and `"onremove"` callbacks, and defines the root behavior tree logic:
  1. Prioritize attacking if `CanAttackTarget` returns `true`.
  2. Return to formation (`Leash`) if target is out of range or not actively attacking.
  3. Clear reserved target upon reaching formation.
  4. Face the target while idle.
  5. Wander locally if no target.
  6. Stand still as fallback.
* **Parameters:** None.
* **Returns:** None.

### `HostedBrain:OnStop()`
* **Description:** Cleans up upon brain deactivation: removes this entity from `PARASITES`, clears `reserved_target`, and unregisters event callbacks.
* **Parameters:** None.
* **Returns:** None.

## Events & Listeners

- **Listens to:**
  - `"attacked"`: Triggers `OnAttacked`, which sets the attacker as target and shares aggro with allies.
  - `"onremove"`: Triggers `OnRemoved`, which deregisters the entity from global tracking.
- **Pushes:** None (no events are explicitly fired by this component).