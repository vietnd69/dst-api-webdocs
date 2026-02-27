---
id: standandattack
title: Standandattack
description: A behaviour node that makes an entity face and continuously attempt to attack its current combat target for a limited duration, optionally stopping movement before attacking.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: behaviour
system_scope: combat
source_hash: 424fb4b4
---

# Standandattack

## Overview
`StandAndAttack` is a behaviour node that implements a combat sequence where an entity remains stationary, or pauses movement, while repeatedly attempting to attack a designated target. It extends `BehaviourNode`, indicating it is used within the game's behaviour tree system. The component listens for attack-related events (`onattackother`, `onmissother`) to track attack attempts and manages timeouts and target validity checks during execution.

It interacts primarily with the `combat`, `health`, and `locomotor` components:
- `combat`: To manage target validation, battle cries, and attack attempts.
- `health`: To check if the target has died (which ends the sequence successfully).
- `locomotor`: Optionally stopped before attacks if `shouldstoplocomotor` is enabled.

## Dependencies & Tags
- **Components used:**
  - `combat` (used for `ValidateTarget`, `SetTarget`, `BattleCry`, `TryAttack`)
  - `health` (used for `IsDead` on target)
  - `locomotor` (used conditionally for `Stop`)
- **Tags:** None directly added or removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance this behaviour belongs to. |
| `findnewtargetfn` | `function?` | `nil` | Optional callback used to find a new target when the current one is invalid or nil. |
| `numattacks` | `number` | `0` | Counter tracking the number of attack attempts (both hits and misses). |
| `timeout` | `number?` | `nil` | Optional maximum duration (in seconds) to continue attacking before failing. |
| `shouldstoplocomotor` | `boolean?` | `nil` | If truthy, stops locomotion before each attack attempt. |
| `onattackfn` | `function` | — | Internal listener callback bound to `onattackother` and `onmissother` events. |
| `starttime` | `number?` | `nil` | Timestamp marking when the RUNNING state began or was last reset (e.g., after an attack). |

## Main Functions
### `StandAndAttack:OnStop()`
* **Description:** Called when the behaviour is forcibly stopped (e.g., tree termination). Cleans up event listeners to prevent memory leaks or spurious callbacks.
* **Parameters:** None.
* **Returns:** `nil`.

### `StandAndAttack:OnAttackOther(target)`
* **Description:** Handles `onattackother` and `onmissother` events by incrementing the attack counter and resetting the start time (to extend the timeout window).
* **Parameters:**
  - `target` (`Entity?`): The target entity that was attacked or missed.
* **Returns:** `nil`.

### `StandAndAttack:Visit()`
* **Description:** The core logic executed each tick of the behaviour tree. Implements state transitions (`READY` → `RUNNING` → `SUCCESS`/`FAILED`) based on target validity, timeout, and target death.
* **Parameters:** None.
* **Returns:** `nil`.

  **State Logic:**
  - **`READY` → `RUNNING`:**
    - Validates current target via `combat:ValidateTarget()`.
    - If no target exists and `findnewtargetfn` is provided, calls it to set a new target.
    - If a valid target exists, triggers `BattleCry()`, records `starttime`, and transitions to `RUNNING`.
    - Otherwise, fails immediately (`FAILED`).
  - **`RUNNING`:**
    - Re-evaluates target validity and timeout. Fails if:
      - Target is nil or invalid.
      - Timeout elapsed (`GetTime() - starttime > timeout`).
    - Succeeds if target is dead (`target.components.health:IsDead()`).
    - Otherwise:
      - Optionally stops `locomotor`.
      - Faces the target if `canrotate` state tag is present.
      - Calls `TryAttack()`.
      - Sleeps for `0.125` seconds (prevents blocking, allows behaviour tree tick rescheduling).

## Events & Listeners
- **Listens to:**
  - `"onattackother"` → handled by `self.onattackfn` (which calls `OnAttackOther`)
  - `"onmissother"` → same handler
- **Pushes:** None directly. This component does not fire custom events.

---