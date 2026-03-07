---
id: tentacle_arm
title: Tentacle Arm
description: A boss-related combat entity that emerges to attack players and allies, managing lifecycle through player proximity, retraction states, and health-based retreat.
tags: [combat, boss, ai, environment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9944fc84
system_scope: environment
---

# Tentacle Arm

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`tentacle_arm` represents a mobile boss combat entity (tentacle arm) that engages enemies within range, retracts when players move away, and is removed upon full retreat if sleeping. It integrates health, combat, proximity sensing, and sanity modulation, and interacts with the `acidinfusible` system for damage tuning. It is primarily used in tentacle pillar encounters in the Caves.

## Usage example
```lua
local inst = Prefab("tentacle_pillar_arm", fn, assets, prefabs)()
inst.components.combat:SetTarget(target)
inst:Emerge() -- causes emergence animation and starts combat engagement
inst:Retract() -- retracts the arm and stops attacking
```

## Dependencies & tags
**Components used:** `health`, `combat`, `playerprox`, `sanityaura`, `inspectable`, `acidinfusible`, `hauntable`  
**Tags added:** `monster`, `hostile`, `tentacle_pillar_arm`, `wet`, `soulless`, `NPCcanaggro`  
**Tags checked:** `_combat`, `_health`, `character`, `monster`, `animal`, `tentacle_pillar`, `prey`, `INLIMBO`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `retracted` | boolean | `true` | Whether the arm is currently retracted. |
| `retreat` | boolean | `false` | Set when `full_retreat` event fires; triggers removal upon sleeping. |
| `sleeptask` | task | `nil` | Delayed removal task created when waking from sleep while in retreat state. |
| `scrapbook_anim` | string | `"atk_idle"` | Animation name used for scrapbook entry. |
| `scrapbook_removedeps` | table | `{"monstermeat"}` | List of prefabs whose removal does not affect this entity's scrapbook. |

## Main functions
### `Emerge(inst)`
*   **Description:** Sets `retracted` to `false` and fires the `"emerge"` event if currently retracted. Used to awaken the arm for combat when players approach.
*   **Parameters:** `inst` (Entity) — the tentacle arm entity.
*   **Returns:** Nothing.
*   **Error states:** No effect if already emerged (`retracted == false`).

### `Retract(inst)`
*   **Description:** Sets `retracted` to `true` and fires the `"retract"` event if currently emerged. Used to return the arm to a dormant state when players are far.
*   **Parameters:** `inst` (Entity) — the tentacle arm entity.
*   **Returns:** Nothing.
*   **Error states:** No effect if already retracted (`retracted == true`).

### `OnFullRetreat(inst)`
*   **Description:** Handles full retreat logic: sets `retreat = true` or removes the entity immediately if sleeping.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `OnEntitySleep(inst)`
*   **Description:** If `retreat` is `true` and no sleep task is pending, schedules entity removal after 1 second.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `OnEntityWake(inst)`
*   **Description:** Cancels pending removal task if the entity wakes up.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `ShouldKeepTarget(inst, target)`
*   **Description:** Predicate used by `combat` to decide whether to maintain target engagement. Returns `true` only if target is valid, alive, near enough, and has `health` component.
*   **Parameters:**  
  `inst` (Entity) — tentacle arm;  
  `target` (Entity?) — proposed target.
*   **Returns:** `boolean` — `true` if combat should continue with `target`.

### `OnHit(inst, attacker, damage)`
*   **Description:** Called after dealing damage. If the attacker is a non-player follower and randomly succeeds, the attacker is ordered to stop attacking, and if the tentacle arm is already dead, it takes additional penalty damage.
*   **Parameters:**  
  `inst` (Entity) — tentacle arm;  
  `attacker` (Entity) — entity that dealt damage;  
  `damage` (number) — damage dealt.
*   **Returns:** Nothing.

### `CustomOnHaunt(inst, haunter)`
*   **Description:** Custom hauntable reaction. With `HAUNT_CHANCE_HALF` chance, kills the arm if not already dead.
*   **Parameters:**  
  `inst` (Entity);  
  `haunter` (Entity) — the haunter.
*   **Returns:** `boolean` — `true` if haunt effect was applied.

## Events & listeners
- **Listens to:** `full_retreat` — triggers full retreat behavior (see `OnFullRetreat`).  
- **Pushes:** `emerge`, `retract` — fired when arm state changes.  
- **Uses:** `OnEntitySleep`, `OnEntityWake` — instance methods for sleep/wake lifecycle events.