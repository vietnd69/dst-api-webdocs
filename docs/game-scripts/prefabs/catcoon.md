---
id: catcoon
title: Catcoon
description: Implements the catcoon creature, a tameable animal that interacts with players through trading, retching gifts, and combat with flocking behavior.
tags: [trading, ai, follower, combat, animal]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 49a09a29
system_scope: entity
---

# Catcoon

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`catcoon.lua` defines the `catcoon` prefab—a small creature capable of forming loyalty-based bonds with players through gift-giving, retching items as gifts, and engaging in combat with intelligent targeting logic. It integrates with multiple components: `combat` for aggressive behavior and retargeting, `follower` for relationship tracking, `trader` for item exchange, `sleeper` for cat-napping, `playerprox` for wake-on-player-near detection, and `locomotor` with platform-hopping support. It also responds to weather changes via rain vulnerability.

## Usage example
```lua
local inst = Prefab("catcoon", fn, assets, prefabs)
local ent = SpawnPrefab("catcoon")
ent.components.trader.onaccept = OnGetItemFromPlayer  -- custom accept handler
ent.components.follower:AddLoyaltyTime(300)           -- increase loyalty
ent.components.combat:SetTarget(target)               -- engage target manually
```

## Dependencies & tags
**Components used:** `combat`, `embarker`, `follower`, `health`, `homeseeker`, `inventory`, `locomotor`, `lootdropper`, `playerprox`, `sleeper`, `trader`, `rainimmunity`, `drownable`, `inspectable`, `minigame_participator`

**Tags:** Adds `smallcreature`, `animal`, `catcoon`, `trader`. Checks `catcoon`, `monster`, `smallcreature`, `cattoy`, `catfood`, `cattoyairborne`, `abigail`, `invisible`, `notarget`, `INLIMBO`, `_health`, and player-specific tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `nap_interval` | number | `math.random(TUNING.MIN_CATNAP_INTERVAL, TUNING.MAX_CATNAP_INTERVAL)` | Duration between naps in seconds. |
| `nap_length` | number | `math.random(TUNING.MIN_CATNAP_LENGTH, TUNING.MAX_CATNAP_LENGTH)` | Duration of current nap in seconds. |
| `last_sleep_time` | number or nil | `nil` | Timestamp of when last sleep started. |
| `last_wake_time` | number | `GetTime()` at spawn | Timestamp of last wake-up. |
| `last_hairball_time` | number | `GetTime()` at spawn | Timestamp of last hairball (gift) interaction. |
| `hairball_friend_interval` | number | `math.random(2,4)` or `math.random(TUNING.MIN_HAIRBALL_FRIEND_INTERVAL, TUNING.MAX_HAIRBALL_FRIEND_INTERVAL)` | Cooldown (in seconds) for offering gifts while friendly. |
| `hairball_neutral_interval` | number | `math.random(TUNING.MIN_HAIRBALL_NEUTRAL_INTERVAL, TUNING.MAX_HAIRBALL_NEUTRAL_INTERVAL)` | Cooldown (in seconds) for offering gifts while neutral. |
| `raining` | boolean | `false` | Tracks whether the world is currently raining (local state). |
| `_catcoonraintask` | DoTaskInTime task or nil | `nil` | Delayed task to apply rain state. |
| `override_combat_fx_height` | string | `"high"` | Visual effect height override for combat FX. |
| `force_onwenthome_message` | boolean | `true` | Forces `onwenthome` event when entering a home room. |
| `neutralGiftPrefabs` | table | `neutralGiftPrefabs` | Loot tiers for neutral (non-friend) catcoons. |
| `friendGiftPrefabs` | table | `friendGiftPrefabs` | Loot tiers for friendly catcoons. |
| `PickRandomGift` | function | `PickRandomGift` | Helper to select a random item based on tier and relationship. |
| `ScheduleRaining` | function | `ScheduleRaining` | Function to schedule rain state update. |
| `OnLoadPostPass` | function | `OnLoadPostPass` | Post-load hook to schedule rain state. |

## Main functions
### `KeepTargetFn(inst, target)`
* **Description:** Determines whether the catcoon should retain a currently targeted entity. Used by `combat` component during targeting cycles.
* **Parameters:** `inst` (entity instance), `target` (entity instance).  
* **Returns:** `true` if target should be kept, `false` otherwise.  
* **Error states:** Returns `false` if `target` is dead, missing `combat`/`health` components, is a fellow catcoon with shared leader, or is an `abigail` follower. Catcoon never targets another catcoon that shares the same leader.

### `RetargetFn(inst)`
* **Description:** Callback for periodic retargeting. Searches for valid targets within `TUNING.CATCOON_TARGET_DIST`, prioritizing enemies (`monster`, `smallcreature`) and airborne toys.
* **Parameters:** `inst` (entity instance).  
* **Returns:** Valid target entity or `nil`.  
* **Error states:** Skips `abigail` followers if catcoon has a leader; ignores entities with `INLIMBO`, `notarget`, or `invisible` tags.

### `SleepTest(inst)`
* **Description:** Determines whether the catcoon should fall asleep (cat-nap). Evaluated periodically.
* **Parameters:** `inst` (entity instance).  
* **Returns:** `true` if nap conditions are met, `nil` otherwise.  
* **Error states:** Will not nap if a leader is assigned, in combat, a player is nearby, or it is raining and lacks `rainimmunity`.

### `WakeTest(inst)`
* **Description:** Determines whether the catcoon should wake from a nap. Evaluated periodically.
* **Parameters:** `inst` (entity instance).  
* **Returns:** `true` if nap duration elapsed or it is raining and lacks `rainimmunity`, `nil` otherwise.  
* **Error states:** Resets `nap_interval` and `last_wake_time` upon wake.

### `PickRandomGift(inst, tier)`
* **Description:** Selects a random item from the appropriate gift table (friend vs. neutral) based on loyalty tier.
* **Parameters:** `inst` (entity instance), `tier` (number).  
* **Returns:** Random item prefab name string.  
* **Error states:** Caps `tier` to maximum available in the selected table to prevent out-of-bounds.

### `ShouldAcceptItem(inst, item)`
* **Description:** Trader predicate. Defines which items the catcoon accepts from players.
* **Parameters:** `inst` (entity instance), `item` (entity instance).  
* **Returns:** `true` if item has tags `cattoy`, `catfood`, or `cattoyairborne`; `false` otherwise.

### `OnGetItemFromPlayer(inst, giver, item)`
* **Description:** Triggered when the catcoon accepts a trade. Can evolve the catcoon into a follower and grant loyalty.
* **Parameters:** `inst` (entity instance), `giver` (entity instance), `item` (entity instance).  
* **Returns:** Nothing.  
* **Error states:** Does not turn into a follower if `giver.components.minigame_participator` exists. Wakes up if sleeping; plays pickup sound if not attacking the giver.

### `OnRefuseItem(inst, item)`
* **Description:** Triggered when the catcoon refuses a trade. Wakes up if asleep and plays a hiss sound.
* **Parameters:** `inst` (entity instance), `item` (entity instance).  
* **Returns:** Nothing.

### `OnAttacked(inst, data)`
* **Description:** Event listener triggered on attack. Initiates combat engagement against attacker and plays hiss animation.
* **Parameters:** `inst` (entity instance), `data` (table containing `attacker` reference).  
* **Returns:** Nothing.  
* **Error states:** Does not engage if already targeting a valid entity.

### `ScheduleRaining(inst)`
* **Description:** Schedules a delayed check for rain state changes when the world is rainy and the catcoon lacks `rainimmunity`.
* **Parameters:** `inst` (entity instance).  
* **Returns:** Nothing.

### `ApplyRaining(inst)`
* **Description:** Applies current world rain state to local `raining` flag.
* **Parameters:** `inst` (entity instance).  
* **Returns:** Nothing.

### `OnIsRaining(inst, raining)`
* **Description:** World-state watcher callback. Triggers rain check scheduling on rain start.
* **Parameters:** `inst` (entity instance), `raining` (boolean).  
* **Returns:** Nothing.

### `OnWentHome(inst)`
* **Description:** Handles entity storage when returning to home room (den).
* **Parameters:** `inst` (entity instance).  
* **Returns:** Nothing.

### `OnLoadPostPass(inst, newents, data)`
* **Description:** Post-load hook. Reschedules rain state listener.
* **Parameters:** `inst` (entity instance), `newents` (table), `data` (table).  
* **Returns:** Nothing.

### `OnRainImmunity(inst)`
* **Description:** Event handler when rain immunity is gained. Cancels pending rain tasks and marks not raining.
* **Parameters:** `inst` (entity instance).  
* **Returns:** Nothing.

### `OnRainVulnerable(inst)`
* **Description:** Event handler when rain immunity is lost. Reschedules rain check.
* **Parameters:** `inst` (entity instance).  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `attacked` (calls `OnAttacked`), `onwenthome` (calls `OnWentHome`), `gainrainimmunity` (calls `OnRainImmunity`), `loserainimmunity` (calls `OnRainVulnerable`)
- **Pushes:** None directly. (Event listeners such as `makefriend` are triggered on the *giver* entity via `giver:PushEvent("makefriend")`.)