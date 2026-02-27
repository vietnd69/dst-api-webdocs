---
id: daywalkerbrain
title: Daywalkerbrain
description: Controls the AI decision-making and behavior tree logic for the Daywalker entity, coordinating combat tracking, stalk/chase/dodge tactics, leash mechanics, and cooldown management.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 1f1ec2e6
---

# Daywalkerbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
`DaywalkerBrain` is a `Brain` component responsible for the AI behavior of the Daywalker entity in Don't Starve Together. It constructs and manages a hierarchical behavior tree (`self.bt`) that dynamically selects actions based on combat state, cooldowns, and positional relationships with targets. The brain prioritizes three distinct combat modes: *Kiting* (dodging and initiating stalking), *Stalking* (maintaining optimal distance before an attack), and *Chasing* (pursuing and attacking). It integrates with combat tracking, known locations (for leash to home), and timer utilities to enforce attack restrictions and recovery states.

## Dependencies & Tags
- **Components used:**
  - `combat` (`inst.components.combat`): used to query/modify target, cooldown state, and reset attacks.
  - `knownlocations` (`inst.components.knownlocations`): used to retrieve the "prison" home location for leash behavior.
  - `timer` (`inst.components.timer`): used to check if the "stalk_cd" timer exists.
- **Tags:** None explicitly added or removed by this brain itself. It relies on entity tags (`INLIMBO`, `playerghost`, etc.) via the `HUNTER_PARAMS` configuration for filtering potential targets.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | N/A | Reference to the entity instance this brain controls; inherited from `Brain`. |
| `bt` | `BT` | `nil` (set in `OnStart`) | Behavior tree instance constructed during `OnStart`, containing the root node hierarchy. |

*Note: No custom instance properties are initialized directly in the constructor; all logic is derived from methods and external component interactions.*

## Main Functions
### `DaywalkerBrain:OnStart()`
* **Description:** Initializes and assigns the root behavior tree node to `self.bt`. It defines the full priority-based decision tree that orchestrates combat and movement behaviors depending on the entity's state (e.g., kiting, stalking, chasing, idle). This function is called automatically when the brain component is started.
* **Parameters:** None.
* **Returns:** `nil`.

### `GetHomePos(inst)`
* **Description:** Returns the stored home position for the Daywalker entity by querying the "prison" location from the `knownlocations` component. Used by the `Leash` behavior to ensure the entity returns to its designated home.
* **Parameters:** `inst` (`Entity`) — the entity instance.
* **Returns:** `Vector3` or `nil` — the world position of the "prison" location.

### `ShouldStalk(inst)`
* **Description:** Determines if the Daywalker should enter or remain in the *Stalking* state. Returns `true` only if currently stalking *and* the combat component is either in cooldown *or* lacks a target. Adjusts the `hit_recovery` value based on `TUNING.DAYWALKER_STALK_HIT_RECOVERY` or the default.
* **Parameters:** `inst` (`Entity`).
* **Returns:** `boolean` — `true` if the entity is stalking under valid conditions, otherwise `false`.

### `ShouldDodge(inst)`
* **Description:** Determines if the Daywalker should enter *Kiting* mode (dodge/evade). Returns `true` only if the entity has a target, is in combat cooldown, and is *not* currently stalking. Sets `hit_recovery` to `TUNING.DAYWALKER_DODGE_HIT_RECOVERY` when active.
* **Parameters:** `inst` (`Entity`).
* **Returns:** `boolean` — `true` if kiting conditions are met, otherwise `false`.

### `ShouldChase(inst)`
* **Description:** Determines if the Daywalker should enter the *Chase* state. Returns `true` if there is a target and the combat cooldown has expired.
* **Parameters:** `inst` (`Entity`).
* **Returns:** `boolean` — `true` if combat cooldown is ready and a target exists.

### `DoStalking(inst)`
* **Description:** Computes a movement target for the Daywalker while stalking, approximating a diagonal strafe around the target at an optimal distance (`4` to `RUN_AWAY_DIST`). Uses angular calculations and randomization to prevent linear tracking. Returns the target `Vector3`.
* **Parameters:** `inst` (`Entity`).
* **Returns:** `Vector3` — the desired destination point during stalking; `nil` if no stalker target exists.

### `IsStalkingFar(inst)`
* **Description:** Checks if the stalker target is beyond `RUN_AWAY_DIST`. Used by the "Stalking" state to ensure the entity doesn’t loiter too far while waiting to close in.
* **Parameters:** `inst` (`Entity`).
* **Returns:** `boolean` — `true` if a stalker target exists and is far.

### `IsStalkingTooClose(inst)`
* **Description:** Checks if the stalker target is within the Daywalker’s attack range (`TUNING.DAYWALKER_ATTACK_RANGE`). Signals the entity is positioned to strike.
* **Parameters:** `inst` (`Entity`).
* **Returns:** `boolean` — `true` if a stalker target exists and is close enough to attack.

### `GetFaceTargetFn(inst)`
* **Description:** Returns the entity’s current combat target (stored in `inst.components.combat.target`). Used by the `FaceEntity` behavior.
* **Parameters:** `inst` (`Entity`).
* **Returns:** `Entity` or `nil` — the current target.

### `KeepFaceTargetFn(inst, target)`
* **Description:** Verifies that the entity is still facing the provided target by checking if `inst.components.combat.target` equals the argument.
* **Parameters:** `inst` (`Entity`), `target` (`Entity`).
* **Returns:** `boolean` — `true` if `TargetIs` returns `true`.

## Events & Listeners
None. This component does not register or push any events directly. It relies entirely on state graph state tags (e.g., `jumping`, `tired`) and component query methods (`HasTarget`, `InCooldown`, etc.) to drive behavior tree execution.