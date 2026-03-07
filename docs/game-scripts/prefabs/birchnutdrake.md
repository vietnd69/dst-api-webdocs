---
id: birchnutdrake
title: Birchnutdrake
description: Prefab definition for the Birchnutdrake mob, a combat-capable monster withAI, looting, and fire-related mechanics.
tags: [combat, ai, monster, fire, boss]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7745377f
system_scope: entity
---

# Birchnutdrake

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `birchnutdrake` prefab defines a medium-sized, mobile enemy (monster) with combat, looting, and fire-related behavior. It uses a custom brain for AI, features ranged combat capabilities, can share aggro with nearby allies, and extinguishes itself on death to prevent fire propagation. It integrates with several core DST systems including state graphs, combat, health, sleeper, and locomotion components.

## Usage example
```lua
local inst = SpawnPrefab("birchnutdrake")
inst.Transform:SetPosition(x, y, z)
inst.components.combat:SetDefaultDamage(10) -- override damage if needed
inst.components.locomotor.walkspeed = 5.0 -- adjust movement speed
```

## Dependencies & tags
**Components used:** `inspectable`, `lootdropper`, `locomotor`, `combat`, `health`, `sleeper`, `knownlocations`, `burnable`, `propagator`, `freezable`, `hauntable`, `transform`, `animstate`, `soundemitter`, `dynamicshadow`, `network`, `finiteuses`, `stackable` (via `MakeSmallBurnableCharacter`, `MakeSmallFreezableCharacter`, `MakeHauntablePanicAndIgnite`)  
**Tags added:** `beaverchewable`, `birchnutdrake`, `monster`, `scarytoprey`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `range` | number | `TUNING.DECID_MONSTER_TARGET_DIST * 1.5` (via `RetargetFn`) | Used by `RetargetFn` as the effective aggro radius for finding new targets. |
| `Exit` | function | `Exit(inst)` | Custom exit callback, pushes `"exit"` event. |
| `Enter` | function | `Enter(inst)` | Custom enter callback, triggers `"enter"` state if not hidden. |

## Main functions
### `RetargetFn(inst)`
*   **Description:** Determines whether the birchnutdrake can find a valid new target within its aggro range while not hidden. Used by the `combat` component to reacquire targets periodically.
*   **Parameters:** `inst` (entity) — the birchnutdrake instance.
*   **Returns:** entity or `nil` — the first valid target found, or `nil`.
*   **Error states:** Returns `nil` if `FindEntity` fails to locate a valid target, or if `inst.sg:HasStateTag("hidden")` is true.

### `KeepTargetFn(inst, target)`
*   **Description:** Evaluates whether the birchnutdrake should maintain its current target. Called by the `combat` component during state transitions and updates.
*   **Parameters:**  
  - `inst` (entity) — the birchnutdrake instance.  
  - `target` (entity or `nil`) — the current target.  
*   **Returns:** boolean — `true` if the target should be kept, `false` otherwise.
*   **Error states:** Returns `false` if in `"exit"` state tag, or if target is dead/invalid/out of range, or if the birchnutdrake is `"hidden"` and not engaged.

### `CanShareTarget(dude)`
*   **Description:** Helper function to check if another entity (`dude`) is eligible to share aggro from the birchnutdrake.
*   **Parameters:** `dude` (entity) — potential helper entity.
*   **Returns:** boolean — `true` if `dude` is a birchnutdrake and not dead.
*   **Error states:** Returns `false` if `dude` lacks the `"birchnutdrake"` tag or is dead.

### `OnAttacked(inst, data)`
*   **Description:** Event handler that sets the attacker as the current target and attempts to pull in up to 10 nearby birchnutdrakes to share the target.
*   **Parameters:**  
  - `inst` (entity) — the birchnutdrake instance.  
  - `data` (table) — event data containing `attacker`.  
*   **Returns:** Nothing.
*   **Error states:** No direct error handling; relies on `combat` component validation.

### `OnLostTarget(inst)`
*   **Description:** Triggers `"exit"` event if the mob has been alive for more than 5 seconds and loses its target.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `Exit(inst)`
*   **Description:** Explicitly pushes the `"exit"` event for the birchnutdrake.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `Enter(inst)`
*   **Description:** Initiates the `"enter"` animation state if the entity is not currently hidden.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `SleepTest()`
*   **Description:** Constant sleep-test function; always returns `false`, indicating the birchnutdrake never sleeps.
*   **Parameters:** None.
*   **Returns:** boolean — `false`.

### `DoExtinguish(inst)`
*   **Description:** Safely extinguishes the birchnutdrake if it is currently burning (e.g., on death).
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `OnDeath(inst)`
*   **Description:** Event handler scheduled on death to extinguish fire after a short delay (0.5 seconds).
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"attacked"` → `OnAttacked(inst, data)` — responds to incoming attacks by targeting the attacker and recruiting allies.  
  - `"losttarget"` → `OnLostTarget(inst)` — triggers exit after 5 seconds.  
  - `"death"` → `OnDeath(inst)` — extinguishes fire on death.  
- **Pushes:**  
  - `"exit"` — via `Exit()` or `OnLostTarget()`; used to transition state graph states.  
  - `"onextinguish"` — indirectly via `Extinguish()` in `burnable` component.