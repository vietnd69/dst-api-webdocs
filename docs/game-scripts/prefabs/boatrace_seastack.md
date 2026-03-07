---
id: boatrace_seastack
title: Boatrace Seastack
description: A destructible, buoyant obstacle block used in boat races that yields throwable deployment kits upon destruction.
tags: [physics, combat, object, environment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b30f834a
system_scope: environment
---

# Boatrace Seastack

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`boatrace_seastack` is a destructible environmental obstacle in boat races—designed to be broken by player attacks or tools and to yield throwable deployment kits upon destruction. It behaves like a boat (via `boatphysics`) while being buoyant and interactable via `workable` and `combat` components. It spawns from throwable kits created using `boatrace_common.MakeThrowableBoatRaceKitPrefabs`. The monkey variant has no persistence and self-removes upon spawning or landing, replacing itself with a "redpouch_yotd_unwrap" effect.

## Usage example
```lua
-- Add to an entity (typically via prefab factory or in spawner code)
local inst = Prefab("boatrace_seastack", fn, assets, prefabs)
inst:AddComponent("workable")
inst.components.workable:SetWorkLeft(3)
inst.components.workable:SetOnWorkCallback(OnWork)
```

## Dependencies & tags
**Components used:** `boatphysics`, `floater`, `lootdropper`, `workable`, `combat`, `health`, `inspectable`, `waterphysics`, `inventoryitem`
**Tags:** Adds `blocker`, `ignorewalkableplatforms`, `noauradamage`, `seastack`
**Tags checked:** Checks `burnt`, `structure` (in `lootdropper:DropLoot`), and uses `likewateroffducksback` (indirectly via floater logic)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `max_health` | number | `1` | Health pool set via `health:SetMaxHealth(1)` |
| `absorption` | number | `1` | Used to absorb one hit of damage before destruction |
| `work_left` | number | `3` | Initial work units required to break the object |
| `mass` | number | `TUNING.BOAT.MASS` | Physics mass |
| `friction` | number | `0` | Zero friction for realistic boat motion |
| `damping` | number | `5` | Damping factor for physics simulation |
| `collision_group` | enum | `COLLISION.OBSTACLES` | Physics collision group |
| `collision_mask` | bitfield | `COLLISION.WORLD`, `COLLISION.OBSTACLES` | Physics collision masks |
| `restitution` | number | `1.0 + TUNING.BOATRACE_SEASTACK_EXTRA_RESTITUTION` | Bounciness from `waterphysics` component |
| `persist` | boolean | `true` (default) / `false` for monkey variant | Whether the object persists between sessions |

## Main functions
### `OnWorkFinished(inst)`
*   **Description:** Finalizes work completion by dropping loot, creating a particle effect, and removing the instance. Called when `workleft <= 0`.
*   **Parameters:** `inst` (entity) — the instance being worked on.
*   **Returns:** Nothing.
*   **Error states:** Safe to call only on master simulation (checked implicitly via component presence).

### `OnWork(inst, worker, workleft)`
*   **Description:** Handles ongoing work on the seastack, playing a sound and triggering `OnWorkFinished` when done.
*   **Parameters:** `inst` (entity), `worker` (entity), `workleft` (number) — remaining work units.
*   **Returns:** Nothing.
*   **Error states:** Does not validate ownership or tool validity—relies on `workable` system.

### `ShouldKeepTarget(_)`
*   **Description:** Static callback that disables target retention for `combat`—ensuring the seastack is not pursued by AI.
*   **Parameters:** `_` — unused parameter (通常为 entity).
*   **Returns:** `false`.

### `OnHitByAttack(inst, attacker, damage, specialdamage)`
*   **Description:** Converts incoming damage into work units using `TUNING.BOATRACE_SEASTACK_DAMAGE_TO_WORK`, then processes via `workable:WorkedBy`.
*   **Parameters:** `inst` (entity), `attacker` (entity), `damage` (number), `specialdamage` (table or number, unused).
*   **Returns:** Nothing.
*   **Error states:** Skips work application if `workable` component is absent.

### `OnCollide(inst, data)`
*   **Description:** Plays the hit sound on physics collision, regardless of cause.
*   **Parameters:** `inst` (entity), `data` (table, unused).
*   **Returns:** Nothing.

### `OnBuilt(inst, _)`
*   **Description:** Plays initial animation (`1_emerge`) then transitions to `1_idle`, and emits a placement sound.
*   **Parameters:** `inst` (entity), `_` — unused event data.
*   **Returns:** Nothing.

### `OnPhysicsWake(inst)`
*   **Description:** Starts boat physics update loop via `boatphysics:StartUpdating`.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `OnPhysicsSleep(inst)`
*   **Description:** Stops boat physics update loop via `boatphysics:StopUpdating`.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `CLIENT_ResolveFloater(inst)`
*   **Description:** Ensures floater state is resolved on client (calls `OnLandedServer`) after a brief delay to align with physics settling.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `on_collide` — triggers `OnCollide`.
- **Listens to:** `onbuilt` — triggers `OnBuilt`.
- **Pushes:** `floater_startfloating` — indirectly via `floater:OnLandedServer()` (see connected `floater.lua`).
- **Pushes:** `entity_droploot` — indirectly via `lootdropper:DropLoot()` (see connected `lootdropper.lua`).
- **Pushes:** Custom events are not defined in this file.
