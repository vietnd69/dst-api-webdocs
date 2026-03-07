---
id: ruinsnightmare_horn_attack
title: Ruinsnightmare Horn Attack
description: Handles the behavior and physics of a fast-moving, AoE-damaging projectile created by the Ruins Nightmare boss attack, including collision detection, speed interpolation, and damage application.
tags: [combat, boss, projectile, aoe]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e0f1e08e
system_scope: combat
---

# Ruinsnightmare Horn Attack

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`ruinsnightmare_horn_attack` is a client-server entity prefab that manifests as a high-speed projectile used in the Ruins Nightmare boss's attack pattern. It travels forward from its spawn position, applying AoE damage to nearby valid targets, then transitions into a collision fx state upon reaching its designated collision point (the boss's position). It integrates with the `updatelooper`, `combat`, `health`, and `planarentity` components, leveraging easing for speed interpolation and physics override for motion.

## Usage example
```lua
-- Typically instantiated via the Ruins Nightmare's brain or behavior logic
local horn = SpawnPrefab("ruinsnightmare_horn_attack")
if horn ~= nil then
    horn.components.ruinsnightmare_horn_attack:SetUp(owner, target, other)
end
```

## Dependencies & tags
**Components used:** `combat`, `health`, `planarentity`, `updatelooper`  
**Tags:** Adds `FX` to the entity upon collision transition. Checks `INLIMBO`, `notarget`, `noattack`, `flight`, `invisible`, `playerghost`, `_combat`, `player` for target filtering.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | `nil` | Reference to the entity that launched the attack; used to query combat stats and planarity. |
| `collision_x` | number or `nil` | `nil` | X coordinate where the projectile should trigger collision/fx transition. |
| `collision_z` | number or `nil` | `nil` | Z coordinate where the projectile should trigger collision/fx transition. |
| `targets` | table | `{}` | A hash table tracking entities already hit in this attack to prevent duplicate damage. |
| `_initial_speed` | number | `INITIAL_SPEED` (`5.5`) or `INITIAL_SPEED_RIFTS` (`7.0`) | Starting forward speed (units/sec), adjusted for planar rift variants. |
| `_final_speed` | number | `FINAL_SPEED` (`13.5`) or `FINAL_SPEED_RIFTS` (`15.0`) | Target speed after interpolation over `FINAL_SPEED_TIME`. |
| `_pair` | entity or `nil` | `nil` | Reference to the twin projectile (used in paired attacks), for co-cleanup on collision. |
| `_OnUpdateFn` | function | `OnUpdate` | The update callback registered with `updatelooper`, called every frame. |

## Main functions
### `SetUp(owner, target, other)`
*   **Description:** Initializes the projectile’s position and orientation: spawns it `INITIAL_DIST_FROM_TARGET` units away from the target position, faces it toward the target, sets collision coordinates, registers the update loop, and adjusts visuals/speed for planar rift variants. Must be called once after instantiation.
*   **Parameters:**  
    - `owner` (entity) – the entity responsible for launching the attack.  
    - `target` (entity) – the intended location/target (typically the Ruins Nightmare itself).  
    - `other` (entity or `nil`) – optional second projectile to form a pair; sets `_pair` bidirectionally.
*   **Returns:** Nothing.
*   **Error states:** No explicit error handling; `other._pair = inst` assumes `other` is non-`nil` and writable.

### `OnUpdate(inst)`
*   **Description:** The core update loop that moves the projectile linearly along its forward direction, checks for collision with the designated point, applies AoE damage to valid targets within range, and manages speed via cubic easing. Terminates by transitioning to collision fx if the target point is reached.
*   **Parameters:** None (uses `inst` from the update loop).
*   **Returns:** Nothing.
*   **Error states:**  
    - Returns early if `owner.components.combat` is `nil`.  
    - Skips damage application if `v` is already in `inst.targets`, is invalid, in limbo, dead, or not targetable by the owner's combat component.  
    - Only applies knockback if `owner.components.planarentity` exists.

### `TurnIntoCollisionFx(inst)`
*   **Description:** Transforms the projectile into a collision effect entity: teleports it to the collision point, plays the `horn_atk_pst` animation, plays a collision sound, removes itself from the update loop, sets motor velocity to zero, adds the `FX` tag, and schedules self-destruction on animation end or entity sleep.
*   **Parameters:** None (uses `inst`).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `animover` (on fx entity) – triggers `inst:Remove()` after collision animation completes.  
  - `entitysleep` (on fx entity) – triggers `inst:Remove()` if the entity is put to sleep.
- **Pushes:**  
  - `knockback` (on hit targets) – with payload `{ knocker = inst, radius = AOE_DAMAGE_RADIUS, strengthmult = 0.6, forcelanded = true }` if the owner has the `planarentity` component.