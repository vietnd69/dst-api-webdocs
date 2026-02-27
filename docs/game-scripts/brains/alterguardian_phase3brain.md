---
id: alterguardian_phase3brain
title: Alterguardian Phase3Brain
description: Controls the behavior tree logic for the Alter Guardian during phase 3, managing combat, movement, homing to spawn point, dodging, and target facing.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 44a2d8e3
---

# Alterguardian Phase3Brain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `Alterguardian_Phase3Brain` component implements the decision-making logic for the Alter Guardian in its third combat phase. It uses a behavior tree (`BT`) to orchestrate high-priority actions such as attacking, returning to the spawn point when far away, dodging player proximity, and maintaining orientation toward the current target. The brain depends on `Combat`, `KnownLocations`, and `Timer` components to make decisions and execute actions, and leverages existing behavior modules like `StandAndAttack`, `RunAway`, `FaceEntity`, `StandStill`, and custom actions.

## Dependencies & Tags
- **Components used:** `combat`, `knownlocations`, `timer`
- **Tags:** None added, removed, or explicitly checked at the brain level. The behavior tree references the tag constraints `PHASE3_HUNTERPARAMS` (`_combat`, `not INLIMBO or playerghost`, `character or monster or shadowminion`) for target selection during dodging, but these are not applied as tags to the brain entity itself.
- **Behaviours used (via `require`):** `doaction`, `standandattack`, `standstill`

## Properties
No public properties are initialized or stored in the constructor (`Class(function(self, inst) ... end)`). All logic is implemented inline within function closures or defined as local functions outside the constructor.

## Main Functions

### `AlterGuardian_Phase3Brain:OnStart()`
* **Description:** Initializes and assigns the behavior tree (`self.bt`) for the Alter Guardian in phase 3. The behavior tree prioritizes actions: (1) attacking when possible, (2) returning to the spawn point if too far, (3) dodging players if the "runaway_blocker" timer does not exist, (4) rotating to face the target, and (5) standing still as fallback.
* **Parameters:** None (method of `AlterGuardian_Phase3Brain` class)
* **Returns:** `nil`

### `AlterGuardian_Phase3Brain:OnInitializationComplete()`
* **Description:** Records the entity's current position as the `"spawnpoint"` location using the `knownlocations` component. This position is later used by the `GoHomeAction` to guide movement when the entity drifts too far away.
* **Parameters:** None (method of `AlterGuardian_Phase3Brain` class)
* **Returns:** `nil`

### `GoHomeAction(inst)`
* **Description:** Returns a `BufferedAction` to walk toward the recorded spawn point if the entity is too far (distance squared > `TUNING.ALTERGUARDIAN_PHASE3_GOHOMEDSQ`). Otherwise, returns `nil` and clears `isdodging` state. Sets `inst.sg.mem.isdodging = true` during homing.
* **Parameters:**
  - `inst`: The entity instance (Alter Guardian)
* **Returns:** `BufferedAction` or `nil`

### `GetFaceTargetFn(inst)`
* **Description:** Determines the optimal target for the entity to face. Prioritizes the current `combat.target`; falls back to the closest valid player or NPC within `TUNING.ALTERGUARDIAN_PHASE3_ATTACK_RANGE` (unless `notarget`). Clears `isdodging` state.
* **Parameters:**
  - `inst`: The entity instance (Alter Guardian)
* **Returns:** `ent` or `nil`

### `KeepFaceTargetFn(inst, target)`
* **Description:** Returns `true` if the entity should continue facing the given target (i.e., the target is valid, not `notarget`, and within `TUNING.ALTERGUARDIAN_PHASE3_ATTACK_RANGE + 3` units).
* **Parameters:**
  - `inst`: The entity instance (Alter Guardian)
  - `target`: The target entity to check distance against
* **Returns:** `boolean`

### `ShouldAttack(inst)`
* **Description:** Returns `true` if the entity is ready to attack—i.e., a combat target exists, `Combat:CanAttack()` passes (range, cooldown, state), and not currently in attack cooldown.
* **Parameters:**
  - `inst`: The entity instance (Alter Guardian)
* **Returns:** `boolean`

### `ShouldDodge(inst)`
* **Description:** Returns `true` if the "runaway_blocker" timer does not exist on the `timer` component, indicating the entity should initiate dodge/avoid behavior. Sets `inst.sg.mem.isdodging = true` on dodge, otherwise clears it.
* **Parameters:**
  - `inst`: The entity instance (Alter Guardian)
* **Returns:** `boolean`

## Events & Listeners
This brain component does not register any event listeners or push events. It relies entirely on synchronous behavior tree evaluation and component method calls.