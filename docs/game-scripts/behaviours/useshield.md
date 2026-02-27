---
id: useshield
title: Useshield
description: A behaviour node that controls an entity’s shield state—activating when damage thresholds, incoming projectiles, or fear effects are detected, and deactivating after a configurable cooldown or threat resolution.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: behaviour
system_scope: combat
source_hash: 676dabf8
---

# Useshield

## Overview

`UseShield` is a behaviour node (inheriting from `BehaviourNode`) responsible for managing shield activation and deactivation logic for an entity. It evaluates incoming threats—including direct damage, projectile fire, fire damage, and epic fear events—and transitions the entity’s state machine into a shielded state when thresholds or conditions are met. Once shielded, the node monitors conditions to determine when the shield should be lowered (i.e., when threats subside for a configured duration).

It integrates closely with the `health` component to assess death status and fire damage, and supports custom logic via optional callbacks (`shouldshieldfn`) and animation/data overrides. It is typically used in AI decision trees to enable tactical defensive postures (e.g., as seen in playable characters like Wendy or enemy behaviours like the Boss Bee).

## Dependencies & Tags

- **Components used:**
  - `health` (accessed via `self.inst.components.health`)
    - Reads `IsDead()` and `takingfiredamage`
- **Tags:**
  - Checks via `inst.sg:HasStateTag(...)`: `"busy"`, `"caninterrupt"`, `"frozen"`, `"electrocute"`, `"shield"`, `"shield_end"`
  - Pushes `"entershield"` and `"exitshield"` events to trigger state machine transitions.

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `damageforshield` | `number` | `100` | Minimum cumulative damage taken in a single encounter required to trigger shield. |
| `shieldtime` | `number` | `2` | Seconds of cooldown elapsed after last attack before shield can end. |
| `hidefromprojectiles` | `boolean` | `false` | If `true`, incoming projectiles reset or extend the shield timer. |
| `scareendtime` | `number` | `0` | Timestamp after which fear-based shielding ends. Updated via `"epicscare"` events. |
| `damagetaken` | `number` | `0` | Accumulated damage since last shield entry. Reset on entry. |
| `timelastattacked` | `number` | `1` | Timestamp of the last attack. Used with `shieldtime` to decide when to end shielding. |
| `projectileincoming` | `boolean` | `false` | Set `true` when a hostile projectile is detected (if `hidefromprojectiles` is `true`). |
| `dontupdatetimeonattack` | `boolean?` | `nil` | If `true`, do *not* update `timelastattacked` on attack—instead, set it on node start. |
| `usecustomanims` | `boolean?` | `nil` | If `true`, skip default "hit_shield" + "hide_loop" animation on attack during shielding. |
| `dontshieldforfire` | `boolean?` | `nil` | If `true`, ignore fire damage in `ShouldShield()` logic. |
| `checkstategraph` | `boolean?` | `nil` | If `true`, prevent shield activation during `"busy"` states unless `"caninterrupt"`. |
| `shouldshieldfn` | `function?` | `nil` | Optional custom predicate `(inst) → (bool, time?)` allowing per-entity control over shielding. |

## Main Functions

### `TimeToEmerge()`
* **Description:** Determines whether enough time has elapsed since the last attack, fear event, and any custom shield end time to exit the shield state.  
* **Parameters:** None.  
* **Returns:** `boolean` — `true` if all cooldowns have expired; `false` otherwise.

### `ShouldShield()`
* **Description:** Evaluates all triggers and custom logic to decide if the entity *should* begin or remain in a shielded state. Called before entering or while running the shield node.  
* **Parameters:** None.  
* **Returns:** `boolean, number?` —  
  - First return: `true` if shielding is warranted; `false` otherwise.  
  - Second return (optional): A duration to extend the shield (passed from `shouldshieldfn`).  
* **Logic:** Returns `false` if dead, or if `checkstategraph` is enabled and the current state is `"busy"` without `"caninterrupt"`. Otherwise, checks:  
  - Damage threshold exceeded (`damagetaken > damageforshield`),  
  - Fire damage active (unless `dontshieldforfire`),  
  - Projectile incoming,  
  - Fear effect active (`GetTime() < scareendtime`),  
  - Or custom `shouldshieldfn` returning `true`.

### `OnAttacked(attacker, damage, projectile)`
* **Description:** Callback invoked on `"attacked"`, `"hostileprojectile"`, `"firedamage"`, `"startfiredamage"`, and `"startelectrocute"` events. Accumulates damage, updates timers, and controls shield-specific animations.  
* **Parameters:**  
  - `attacker` (`Instancer?`): Attacking entity.  
  - `damage` (`number?`): Damage amount.  
  - `projectile` (`boolean?`): Whether the damage originated from a projectile.  
* **Returns:** `nil`.  
* **Notes:**  
  - If `dontupdatetimeonattack` is `nil`/`false`, updates `timelastattacked` and clears `shieldendtime`.  
  - Resets `damagetaken` only on entry to the shield state (in `Visit()`), *not* here.  
  - Plays `"hit_shield"` → `"hide_loop"` animations *unless* `usecustomanims` is set or the node is not in `"shield"` state.  
  - Sets `projectileincoming = true` *only* if `hidefromprojectiles` is `true` and projectile is `true`.

### `Visit()`
* **Description:** Core `BehaviourNode` method invoked each tick to drive state transitions. Handles entering, maintaining, and exiting the shield.  
* **Parameters:** None.  
* **Returns:** `nil`.  
* **Logic:**  
  - **On `READY`:** Calls `ShouldShield()`. If `true` (or already in `"shield"` state), resets `damagetaken`, clears `projectileincoming`, optionally sets `shieldendtime`, updates `timelastattacked` if needed, and pushes `"entershield"` event → sets status to `RUNNING`.  
  - **On `RUNNING`:**  
    - Aborts to `FAILED` if `"electrocute"` state tag is active.  
    - Maintains `RUNNING` if either `TimeToEmerge()` is `false` *or* fire damage is still active (unless `dontshieldforfire`).  
    - Otherwise, pushes `"exitshield"` and sets status to `SUCCESS`.

## Events & Listeners

- **Listens to:**  
  - `"attacked"` → `self.onattackedfn`  
  - `"hostileprojectile"` → `self.onhostileprojectilefn` (which calls `OnAttacked(..., true)`)  
  - `"firedamage"` & `"startfiredamage"` → `self.onfiredamagefn`  
  - `"startelectrocute"` → `self.onelectrocutefn` (which forces a brain update)  
  - `"epicscare"` (if `hidewhenscared` is `true`) → `self.onepicscarefn` (extends `scareendtime`)

- **Pushes:**  
  - `"entershield"` → Signals state machine to enter shielded state.  
  - `"exitshield"` → Signals state machine to exit shielded state.