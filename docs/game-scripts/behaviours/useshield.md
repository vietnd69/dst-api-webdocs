---
id: useshield
title: Useshield
description: Controls shield mechanics by determining when an entity should enter or exit a shielded state based on recent damage, fire, projectiles, or fear events.
tags: [combat, ai, shield, state]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: behaviours
source_hash: 676dabf8
system_scope: combat
---

# Useshield

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`UseShield` is a behaviour node used in DST's AI/behaviour system to manage shield-related state transitions (e.g., entering and exiting a shield animation). It evaluates multiple conditions—including recent damage intake, fire damage, incoming projectiles, and fear periods—to decide when the entity should be shielded. It integrates with the `Health` component to check for death and fire damage status, and it programmatically triggers shield-related events (`entershield`, `exitshield`) on the entity.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("behaviourtree")
inst:AddComponent("health")

inst.components.behaviourtree:PushNode("useshield", {
    damageforshield = 50,
    shieldtime = 1.5,
    hidefromprojectiles = true,
    hidewhenscared = true,
    data = {
        dontupdatetimeonattack = false,
        usecustomanims = false,
        dontshieldforfire = false,
        checkstategraph = true,
        shouldshieldfn = function(ent) return ent.components.health.currenthealth < ent.components.health.maxhealth * 0.5 end
    }
})
```

## Dependencies & tags
**Components used:** `health`
**Tags:** Checks `frozen`, `busy`, `caninterrupt`, `electrocute`, `shield`, `shield_end`. No tags are added or removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity this behaviour is attached to. |
| `damageforshield` | number | `100` | Minimum damage taken within `shieldtime` to trigger shielding. |
| `shieldtime` | number | `2` | Time window (in seconds) for cumulative damage tracking. |
| `hidefromprojectiles` | boolean | `false` | If `true`, incoming projectiles force shielding. |
| `hidewhenscared` | boolean | — | If `true`, sets up listener for `epicscare` to delay shield exit. |
| `dontupdatetimeonattack` | boolean | `nil` | If `true`, time of last attack is updated on node start, not on `attacked`. |
| `usecustomanims` | boolean | `nil` | If `true`, skip automatic `hit_shield` + `hide_loop` animation. |
| `dontshieldforfire` | boolean | `nil` | If `true`, fire damage does not trigger shielding. |
| `checkstategraph` | boolean | `nil` | If `true`, prevents shielding if in a `busy` state without `caninterrupt`. |
| `shouldshieldfn` | function | `nil` | Optional custom predicate: `fn(inst) → should_shield (boolean), [optional time_to_shield] (number)`. |
| `damagetaken` | number | `0` | Accumulated damage since last shield entry. |
| `scareendtime` | number | `0` | Time (from `GetTime()`) after which fear-induced shielding ends. |
| `timelastattacked` | number | `1` | Timestamp (from `GetTime()`) of last attack, used for `shieldtime` window. |
| `projectileincoming` | boolean | `false` | Indicates a projectile is incoming. |
| `shieldendtime` | number? | `nil` | Optional custom shield end time (if `shouldshieldfn` returns a duration). |

## Main functions
### `OnStop()`
* **Description:** Cleans up event listeners registered in the constructor, preventing memory leaks or phantom callbacks on node termination.
* **Parameters:** None.
* **Returns:** Nothing.

### `TimeToEmerge()`
* **Description:** Determines whether the entity is allowed to exit the shield state (i.e., when the shield cooldown period has elapsed and fear has subsided).
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `shieldtime` has passed since last attack, `scareendtime` has elapsed, and no custom `shieldendtime` is pending.
* **Error states:** Returns `false` if any of the following conditions hold: `t - timelastattacked <= shieldtime`, `t < scareendtime`, or `t < shieldendtime` (if set).

### `ShouldShield()`
* **Description:** Evaluates all conditions that justify entering a shield state.
* **Parameters:** None.
* **Returns:** `boolean, number?` — First return value indicates whether shielding is recommended; second (optional) return value is the duration (in seconds) to shield (if provided by `shouldshieldfn`).
* **Error states:** Returns `false` if the entity is dead or in a non-interruptible `busy` state (if `checkstategraph` is enabled). Also respects `dontshieldforfire`, `shouldshieldfn`, projectile status, fire damage, and recent attack/fear timers.

### `OnAttacked(attacker, damage, projectile)`
* **Description:** Called on `attacked`, `hostileprojectile`, `firedamage`, and `startfiredamage` events to record damage or projectile status, update timers, and optionally play shield-hit animation.
* **Parameters:**
  * `attacker` (`Entity?`) — The entity that dealt damage.
  * `damage` (`number?`) — Amount of damage taken (may be `0` for projectile/fire events).
  * `projectile` (`boolean?`) — If `true`, indicates the event came from a projectile.
* **Returns:** Nothing.
* **Error states:** Does nothing if the entity is in a `frozen` state.

### `Visit()`
* **Description:** Main entry point for the behaviour tree system. Decides whether to transition from `READY` → `RUNNING` (enter shield), or `RUNNING` → `SUCCESS`/`FAILED` (exit shield).
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Fails early if `ShouldShield()` returns `false` (and no shield state is active). During `RUNNING`, transitions to `FAILED` if `electrocute` state is active or if conditions to remain shielded no longer hold.

## Events & listeners
- **Listens to:**
  * `attacked` — triggers `OnAttacked`.
  * `hostileprojectile` — sets `projectileincoming = true`.
  * `firedamage`, `startfiredamage` — triggers `OnAttacked`.
  * `startelectrocute` — forces immediate brain update (via `self.inst.brain:ForceUpdate()`).
  * `epicscare` (if `hidewhenscared` is `true`) — extends `scareendtime`.
- **Pushes:**
  * `entershield` — fired on entry into the shield state.
  * `exitshield` — fired on successful exit from the shield state.
