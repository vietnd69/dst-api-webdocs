---
id: gnarwail
title: Gnarwail
description: Controls the behavior, state management, and interaction logic for the Gnarwail entity, including horn combat, loyalty mechanics, and formation following behavior.
tags: [combat, ai, boss, follower, boat]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7dfeb0b3
system_scope: entity
---

# Gnarwail

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `gnarwail` prefab implements the core logic for the Gnarwail boss entity and its derivative prefabs (`gnarwail_attack_horn`, `gnarwail_water_shadow`). It manages combat, follower loyalty, boat-based movement synchronization, horn-breaking mechanics, and state persistence. It integrates with multiple components including `combat`, `health`, `locomotor`, `follower`, `trader`, `eater`, `sleeper`, and `lootdropper` to coordinate AI behavior, social interactions, and environmental adaptation.

## Usage example
```lua
-- Spawning a Gnarwail instance (e.g., via a script or level generator)
local gnar = SpawnPrefab("gnarwail")
gnar.Transform:SetPosition(x, y, z)
gnar:SetHornBroken(false) -- Initialize with full horn
gnar.components.follower:AddLoyaltyTime(600) -- Set initial loyalty

-- Attaching a water shadow (synced visual)
gnar._water_shadow.AnimState:PlayAnimation("emerge_loop", true)
```

## Dependencies & tags
**Components used:**  
`health`, `combat`, `locomotor`, `lootdropper`, `sleeper`, `inspectable`, `trader`, `eater`, `follower`, `timer`

**Tags:**  
- `animal`, `gnarwail`, `hostile`, `scarytoprey`, `scarytocookiecutters` (added on main entity)  
- `gnarwail`, `hostile`, `soulless` (added on horn prefab)  
- `NOBLOCK`, `DECOR` (added on water shadow)  
- Also checks tags: `ediblefish_meat`, `oceanfish`, `flying`, `FX`, `DECOR`, `INLIMBO`, `blocker`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `ready_to_toss` | boolean | `true` | Controls whether the gnarwail may toss items (e.g., fish) back at players or into water. |
| `_horn_broken` | boolean | `false` | Tracks if the main horn is broken (affects loot, animations, and status). |
| `_formation_angle` | number | `nil` | Optional angle override for formation positioning. |
| `_speed_update_task` | task | `nil` | Periodic task that synchronizes speed with the leader’s boat. |
| `_sleep_remove_task` | task | `nil` | Delayed self-removal task when sleeping without a leader. |
| `_water_shadow` | entity | `nil` | Visual shadow entity rendered below the water surface. |
| `WantsToToss` | function | `WantsToTossItem` | Predicate function deciding whether to toss a given item. |
| `TossItem` | function | `TossItem` | Function to launch an item toward a target or randomly. |
| `GetFormationOffsetNormal` | function | `GetFormationOffsetNormal` | Computes steering vector for formation positioning. |
| `HornIsBroken` | function | `HornIsBroken` | Returns `true` if the horn is broken. |
| `SetHornBroken` | function | `SetHornBroken` | Updates horn state (animation, loot, internal flag). |

## Main functions
### `SetHornBroken(inst, horn_is_broken)`
*   **Description:** Updates the horn state, modifying visual representation (via override symbol) and loot table.
*   **Parameters:**  
    *   `horn_is_broken` (boolean) — whether the horn should be considered broken.
*   **Returns:** Nothing.
*   **Error states:** No-op if the new state matches the current `_horn_broken` value.

### `GetStatus(inst)`
*   **Description:** Returns a string describing the Gnarwail’s current condition based on leadership and horn status.
*   **Parameters:** None.
*   **Returns:** One of `"BROKENHORN_FOLLOWER"`, `"FOLLOWER"`, `"BROKENHORN"`, or `nil`.
*   **Error states:** Returns `nil` if the entity has no leader and horn is intact.

### `TossItem(inst, item, target_to_toss_to)`
*   **Description:** Physically launches the given item. If the item is an ocean fish, its loot table is spilled first.
*   **Parameters:**  
    *   `item` (entity) — the item to toss.  
    *   `target_to_toss_to` (entity or nil) — optional target to aim at; if `nil`, tosses randomly.
*   **Returns:** Nothing.
*   **Error states:** May silently fail if `target_to_toss_to` is invalid or the item has no physics component.

### `WantsToTossItem(inst, item)`
*   **Description:** Determines whether the Gnarwail wants to toss a given item.
*   **Parameters:**  
    *   `item` (entity) — the item to evaluate.
*   **Returns:** `boolean` — `true` if toss is desired.
*   **Logic:**  
    *   If it has a leader: tosses all items *except* those with a `health` component.  
    *   Without a leader: only tosses fish (`ediblefish_meat`).

### `GetFormationOffsetNormal(inst, leader, leader_platform, leader_velocity)`
*   **Description:** Calculates a steering offset to maintain formation relative to the leader’s boat, including separation from nearby gnarwails and obstacles.
*   **Parameters:**  
    *   `leader` (entity or nil) — the leader entity.  
    *   `leader_platform` (entity or nil) — the leader’s boat/platform entity.  
    *   `leader_velocity` (Vector3) — the velocity vector of the leader’s boat.  
*   **Returns:** `Vector3` — desired displacement offset.
*   **Error states:** Returns `Vector3(1,0,0)` if any required inputs are invalid.

### `RetargetFunction(inst)`
*   **Description:** Standard retarget logic used during combat to locate valid new targets.
*   **Parameters:** None.
*   **Returns:** `entity or nil` — nearest eligible target entity within range.
*   **Logic:** Excludes entities with tags `epic`, `playermonster`; includes those with `_combat`, `monster`.

### `PlayAnimation(inst, anim_name, loop)`
*   **Description:** Plays the given animation on both the main entity and its water shadow.
*   **Parameters:**  
    *   `anim_name` (string) — animation name.  
    *   `loop` (boolean or nil) — whether to loop the animation.
*   **Returns:** Nothing.

### `PushAnimation(inst, anim_name, loop)`
*   **Description:** Pushes an animation to the main entity’s and water shadow’s animation queues.
*   **Parameters:**  
    *   `anim_name` (string) — animation name.  
    *   `loop` (boolean or nil) — whether to loop.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `death` — triggers `OnAttackHornKilled` (horn prefab) or `RemoveShadowOnDeath` (main entity).  
  - `attacked` — triggers `OnAttacked` to engage attacker as combat target.  
  - `animqueueover` — triggers retreat animations for horn breakage.  
  - `timerdone` — resets `ready_to_toss` after toss delay via `OnTimerFinished`.  
  - `startfollowing` — starts speed-sync task via `OnStartFollowingLeader`.  
  - `stopfollowing` — cancels speed-sync task and restores default speed via `OnStopFollowingLeader`.  
  - `onwakeup` (via sleeper) — cancels sleep-remove task via `OnGnarwailEntityWake`.  
  - `entity_sleep` (via entity) — schedules delayed removal if no leader via `OnGnarwailEntitySleep`.

- **Pushes:**  
  - `onfedbyplayer` — fired after eating from player.  
  - (Horn prefab) `spawnnewboatleak` — via `boat:PushEvent(...)` during retreat.
