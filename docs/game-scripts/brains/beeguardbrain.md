---
id: beeguardbrain
title: Beeguardbrain
description: Controls the behavioral logic for the Beeguard character, determining when it chases enemies, holds defensive formation near the queen, panics, avoids electric fences, or wanders.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 97e7938a
---

# Beeguardbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `BeeGuardBrain` component implements the decision-making logic for the Beeguard entity in Don't Starve Together. As a brain, it orchestrates a behavior tree (`BT`) that dynamically selects high-priority actions based on game state and environment conditions. Its core responsibilities include maintaining defensive proximity to the queen, engaging hostile targets within aggro range, evading hazards like electric fences, reacting to panic triggers, and reverting to idle wandering when appropriate.

Key relationships:
- It extends `Brain` and relies on `BrainCommon` for shared state evaluation (e.g., panic, electric fence avoidance).
- It integrates with the `Combat` component to manage targeting and attack readiness.
- It consults the `Health` component to determine target validity during flight decisions.
- It queries `KnownLocations` to retrieve the queen’s positional offset for formation control.

## Dependencies & Tags
- **Components used:**
  - `inst.components.combat` — to query/set target, check cooldowns, and validate targets.
  - `inst.components.health` — to verify if a target is alive.
  - `inst.components.knownlocations` — to fetch the `queenoffset` location.
  - `inst:GetQueen()` — an entity method (inherited or defined on Beeguard) returning the queen entity.
- **Tags used in filtering:**
  - `"_combat"`, `"_health"` — included in `RUN_AWAY_PARAMS` for behavior selection.
  - `"bee"`, `"playerghost"`, `"INLIMBO"` — excluded (negated via `notags`) from run-away candidates.
  - `"player"` — included as a source of threat.

## Properties
| Property         | Type      | Default Value | Description                                                  |
|------------------|-----------|---------------|--------------------------------------------------------------|
| `_shouldchase`   | `boolean` | `false`       | Internal flag indicating whether the beeguard is currently committed to chasing (used to extend aggro range when active). |

## Main Functions
### `GetQueen(inst)`
* **Description:** Helper function that retrieves the queen entity associated with this beeguard via `inst:GetQueen()`.
* **Parameters:**
  - `inst`: The beeguard entity instance.
* **Returns:** The queen entity, or `nil` if none exists.

### `GetQueenPos(inst)`
* **Description:** Retrieves the current world position of the queen, if available.
* **Parameters:**
  - `inst`: The beeguard entity instance.
* **Returns:** A vector position (`pos`) if the queen exists, otherwise `nil`.

### `GetQueenOffset(inst)`
* **Description:** Retrieves the queen’s positional offset (relative coordinate) stored in `KnownLocations`.
* **Parameters:**
  - `inst`: The beeguard entity instance.
* **Returns:** The offset vector, or `nil` if not set.

### `GetGuardPos(inst)`
* **Description:** Calculates the absolute world position the beeguard should guard by adding the queen’s offset to the queen’s position.
* **Parameters:**
  - `inst`: The beeguard entity instance.
* **Returns:** A vector position, or `nil` if either queen or offset is missing.

### `ShouldPanic(self)`
* **Description:** Determines if the beeguard should enter panic mode (e.g., due to extreme danger or environmental threat).
* **Parameters:**
  - `self`: The brain component instance.
* **Returns:** `true` if `BrainCommon.ShouldTriggerPanic(self.inst)` returns `true` and `_shouldchase` is set to `false`; otherwise `false`.

### `ShouldAvoidElectricFence(self)`
* **Description:** Determines if the beeguard should avoid electric fences using shared logic.
* **Parameters:**
  - `self`: The brain component instance.
* **Returns:** `true` if `BrainCommon.ShouldAvoidElectricFence(self.inst)` returns `true` and `_shouldchase` is set to `false`; otherwise `false`.

### `ShouldChase(self)`
* **Description:** Evaluates whether the beeguard should break formation and engage in combat. The decision considers the presence of a valid target, proximity to the queen, and current aggro range.
* **Parameters:**
  - `self`: The brain component instance.
* **Returns:** `true` if:
  - The queen is missing, offset is missing, a focus target (`_focustarget`) exists, *or*
  - The current `Combat` target is valid, alive, and within extended aggro distance (`TUNING.BEEGUARD_AGGRO_DIST + (self._shouldchase and 3 or 0)`).
  In all other cases, returns `false` and clears the combat target.

### `ShouldDodge(inst)`
* **Description:** Checks if the beeguard should dodge incoming attacks (e.g., during a damage cooldown).
* **Parameters:**
  - `inst`: The beeguard entity instance.
* **Returns:** `true` if the beeguard has a combat target *and* is currently in its attack cooldown period (`InCooldown()` returns `true`).

### `ShouldHoldFormation(inst)`
* **Description:** Determines if the beeguard should remain in defensive position near the queen.
* **Parameters:**
  - `inst`: The beeguard entity instance.
* **Returns:** `true` if both the queen entity and queen offset are present; otherwise `false`.

### `BeeGuardBrain:OnStart()`
* **Description:** Initializes the behavior tree with a priority-based node structure that dictates high-priority responses before falling back to idle behavior.
* **Parameters:** None.
* **Returns:** None. Sets `self.bt` to a constructed behavior tree instance.
  * Behavior tree priority order:
    1. **Panic**: Overrides all if `ShouldPanic()` returns `true`.
    2. **AvoidElectricFence**: Activates if `ShouldAvoidElectricFence()` returns `true`.
    3. **BreakFormation**: Activates if `ShouldChase()` returns `true`; sub-prioritizes dodging (if `ShouldDodge()` is `true`) over direct attack.
    4. **HoldFormation**: Moves and orients the beeguard near the queen if `ShouldHoldFormation()` returns `true`.
    5. **Wander**: Default idle behavior if none above apply.

## Events & Listeners
None identified.

## Additional Notes
- All behaviors (e.g., `Panic`, `ChaseAndAttack`, `Leash`, `Wander`, `AvoidElectricFence`, `RunAway`) are imported from the `behaviours/` directory.
- The `RUN_AWAY_PARAMS` configuration defines specific filtering criteria for entities that cause the beeguard to flee. Notably, only entities that either are players *or* have a bee as their own combat target are considered threats.
- Aggro distance dynamically increases by 3 units when `_shouldchase` is `true`, allowing the beeguard to stay engaged during prolonged fights.
- `FaceAwayFromPoint` is used in `HoldFormation` to orient the beeguard away from the queen (i.e., “back-to-back” defensive stance).