---
id: shark
title: Shark
description: Implements the behavior and properties of the shark entity, including combat, amphibious movement, state management, and formation following.
tags: [combat, ai, aquatic, formation, predator]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 6c5715f0
system_scope: entity
---

# Shark

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `shark` prefab defines a predatory aquatic creature with amphibious capabilities, advanced targeting logic, and group behaviors. It integrates multiple core components: `combat` for engagement mechanics, `amphibiouscreature` for land/water transitions, `sleeper` for rest management, `eater` for feeding behavior, and `updatelooper` for platform-based state transitions. It supports shared aggro with nearby sharks and adjusts movement speeds depending on environment (land vs. ocean). The entity follows boats in formation using steering behavior logic and coordinates attacks via stategraph events.

## Usage example
```lua
-- Typical usage occurs automatically via worldgen or event spawners
-- To manually spawn a shark in a mod:
local shark = TheWorld:SpawnPrefab("shark")
if shark and shark.components.health then
    shark.components.health:SetMaxHealth(200) -- adjust health
    shark.components.combat:SetDefaultDamage(40) -- adjust damage
end
```

## Dependencies & tags
**Components used:**  
- `amphibiouscreature` (SetBanks, SetEnterWaterFn, SetExitWaterFn)  
- `combat` (hiteffectsymbol, SetDefaultDamage, SetRetargetFunction, SetKeepTargetFunction, SetAreaDamage, SetTarget, ShareTarget, CanTarget)  
- `eater` (SetDiet, SetCanEatHorrible, SetStrongStomach)  
- `health` (SetMaxHealth, StartRegen, IsDead)  
- `locomotor` (walkspeed, runspeed, pathcaps)  
- `lootdropper` (SetChanceLootTable)  
- `sleeper` (SetResistance, SetSleepTest, SetWakeTest, IsAsleep, WakeUp)  
- `timer` (StartTimer, StopTimer, TimerExists)  
- `updatelooper` (AddOnWallUpdateFn)  
- `inspectable`, ` follower` (indirect via `GetLeader`, `IsNearLeader`)  

**Tags added:** `scarytoprey`, `scarytooceanprey`, `monster`, `animal`, `largecreature`, `shark`, `wet`  
**Tags checked:** `shark`, `oceanfish`, `flying`, `FX`, `DECOR`, `INLIMBO`, `blocker`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `targetboat` | Entity or `nil` | `nil` | Reference to the boat entity the shark is following. Used in `GetFormationOffsetNormal`. |
| `foodtoeat` | Entity or `nil` | `nil` | Target ocean fish the shark has queued for eating (used in `testfooddist`). |
| `landspeed` | number | `nil` | Temporarily stores land run speed during water entry. Restored on exit. |
| `landspeedwalk` | number | `nil` | Temporarily stores land walk speed during water entry. Restored on exit. |
| `override_combat_fx_size` | string or `nil` | `"small"` (in water) / `nil` (on land) | Controls size of combat hit FX. |

## Main functions
### `GetFormationOffsetNormal(boat_velocity)`
* **Description:** Computes a steering vector to maintain a fixed distance behind and alongside a boat, while avoiding collisions with other sharks using separation forces. Returns a relative offset vector.
* **Parameters:** `boat_velocity` (Vector3) — Velocity of the target boat.
* **Returns:** Vector3 — Steering offset to apply for formation.
* **Error states:** Returns default unit vector (`Vector3(1, 0, 0)`) if `inst.targetboat` is `nil`.

### `testfooddist()`
* **Description:** Scans buffered actions for valid ocean fish targets, initiates a 2–17 second cooldown, and pushes the `dive_eat` event when close enough.
* **Parameters:** None (instance method).
* **Returns:** Nothing.

### `OnNewTarget(inst, data)`
* **Description:** Handles new combat target assignment: wakes the shark if asleep, and starts a 3-second timer if within charging range (`CHARGEDIST = 10`).
* **Parameters:** `inst` (Entity) — Shark instance; `data` (table) — Event data containing `target`.
* **Returns:** Nothing.

### `KeepTarget(inst, target)`
* **Description:** Retention policy for combat targets. Ensures targets underwater remain locked, even if visually obstructed.
* **Parameters:** `inst` (Entity); `target` (Entity or `nil`).
* **Returns:** `true` if target should be retained (always `true` when target is underwater), `nil` otherwise.

### `Retarget(inst)`
* **Description:** Finds a new valid target within `TUNING.SHARK.TARGET_DIST`, excluding sharks, those with a `calmtime` timer, and those on land.
* **Parameters:** `inst` (Entity).
* **Returns:** Entity or `nil`.

### `OnAttacked(inst, data)`
* **Description:** Reacts to being attacked: sets attacker as current target, shares aggro with up to 5 other sharks within `SHARE_TARGET_DIST = 30`, and cancels the `calmtime` timer.
* **Parameters:** `inst` (Entity); `data` (table) — Event data containing `attacker`.
* **Returns:** Nothing.

### `OnAttackOther(inst, data)`
* **Description:** Shares current target with nearby sharks upon shark attack.
* **Parameters:** `inst` (Entity); `data` (table) — Event data containing `target`.
* **Returns:** Nothing.

### `OnEntitySleep(inst)`
* **Description:** Schedules self-removal after 3 seconds if idle and asleep.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `OnEntityWake(inst)`
* **Description:** Cancels pending removal task upon waking.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `newcombattarget` → `OnNewTarget`  
  - `attacked` → `OnAttacked`  
  - `onattackother` → `OnAttackOther`  
- **Pushes:**  
  - `leap` (via `PushEvent`) — triggers platform transition to water or jump attack.  
  - `dive_eat` (via `PushEventImmediate`) — initiates underwater feeding.  
  - `onwakeup`, `onsleep` (via `sleeper` component) — triggers `OnEntityWake`, `OnEntitySleep`.  
  - `sharkspawned` (via `TheWorld:PushEvent`) — signals new shark spawn to world.