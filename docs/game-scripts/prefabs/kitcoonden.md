---
id: kitcoonden
title: Kitcoonden
description: Manages a den structure that hosts hide-and-seek minigames with kitcoons, granting rewards upon successful play.
tags: [minigame, boss, event, social, structure]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 71910a38
system_scope: entity
---

# Kitcoonden

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`kitcoonden` is a structure prefab that serves as the center of a hide-and-seek minigame involving kitcoons. When activated by a player, it orchestrates a minigame where a subset of nearby kitcoons hide at valid spots, and players must find them before time expires. It integrates with components such as `activatable`, `hideandseekgame`, `timer`, `playerprox`, `workable`, `lootdropper`, `burnable`, and `sleeper`. It supports event-specific (YOT_CATCOON) reward logic and persists minigame state across save/load cycles.

## Usage example
```lua
--Typical usage occurs when the structure is placed and later activated:
local den = SpawnPrefab("kitcoonden")
den.Transform:SetPosition(x, y, z)
-- Optionally, spawn nearby kitcoons before activation
den.components.activatable:Activate(player)
```

## Dependencies & tags
**Components used:** `workable`, `lootdropper`, `burnable`, `inspectable`, `kitcoonden`, `activatable`, `hideandseekgame`, `timer`, `playerprox`, `sleeper`, `entitytracker`, `hideandseekhider`, `follower`, `talker`, `unwrappable`, `hideandseekhidingspot`.

**Tags added:** `structure`, `kitcoonden`, `no_hideandseek`.

**Tags removed/checked on players:** `near_kitcoonden`.

## Properties
No public properties are defined outside of component state. Component properties (e.g., `hiding_range`, `seekers`) are managed by the `hideandseekgame` component.

## Main functions
### `fn()`
* **Description:** Prefab constructor that assembles the den entity, attaches all required components, registers callbacks, and sets up network and server-side logic.
* **Parameters:** None.
* **Returns:** The fully constructed `kitcoonden` entity instance.
* **Error states:** None. Returns `nil` only if `CreateEntity` fails (extremely rare).

### `onhammered(inst)`
* **Description:** Callback invoked when the den is hammered; triggers visual/physics effects, drops loot, and removes the den.
* **Parameters:** `inst` (entity) — the den instance.
* **Returns:** Nothing.
* **Error states:** None.

### `OnBurnt(inst)`
* **Description:** Handles den burning; converts it to a burnt variant, aborts any active hide-and-seek game, and releases all kitcoons.
* **Parameters:** `inst` (entity) — the den instance.
* **Returns:** Nothing.
* **Error states:** None.

### `OnActivate(inst, doer)`
* **Description:** Initiates the hide-and-seek minigame if requirements are met (sufficient kitcoons, hiding spots, and not already played today). Registers hiding spots, assigns kitcoons, adds the player as a seeker, and starts timers.
* **Parameters:** `inst` (entity) — the den instance; `doer` (entity) — the player initiating the minigame.
* **Returns:** `false, error_string` if minigame can't start (inactive flag is set); otherwise, returns `nil` after starting the game.
* **Error states:** Returns early with `"KITCOON_HIDEANDSEEK_NOT_ENOUGH_HIDERS"` if too few kitcoons; `"KITCOON_HIDEANDSEEK_ONE_GAME_PER_DAY"` if kitcoons already played today; `"KITCOON_HIDEANDSEEK_NOT_ENOUGH_HIDING_SPOTS"` if insufficient valid hiding spots.

### `OnAddKitcoon(inst, kitcoon, doer)`
* **Description:** Handles logic when a kitcoon joins the den (e.g., upon placement or minigame start). Unsets leader, tracks the den as home, wakes sleeping kitcoons, and triggers event-specific unique kitcoon spawning.
* **Parameters:** `inst` (entity) — the den instance; `kitcoon` (entity) — the kitcoon joining; `doer` (entity) — the activator (for YOT_CATCOON event).
* **Returns:** Nothing.
* **Error states:** None.

### `OnRemoveKitcoon(inst, kitcoon)`
* **Description:** Handles cleanup when a kitcoon leaves or is removed. Untracks the den, and re-enables activatable state if no kitcoons remain.
* **Parameters:** `inst` (entity); `kitcoon` (entity).
* **Returns:** Nothing.
* **Error states:** None.

### `OnHidingSpotFound(inst, finder, hiding_spot)`
* **Description:** Called when a hiding spot is discovered; awards YOT_CATCOON event loot, announces progress, and removes hide-and-seeker component from successful finders.
* **Parameters:** `inst` (entity); `finder` (entity); `hiding_spot` (entity).
* **Returns:** Nothing.
* **Error states:** None.

### `OnHideAndSeekOver(inst)`
* **Description:** Ends the minigame, stops timers, and awards loot to seekers based on how many hiders were found. Supports event-specific or default reward logic.
* **Parameters:** `inst` (entity).
* **Returns:** Nothing.
* **Error states:** None.

### `GiveRedPouch(tosser, target, num_lucky_goldnugget, toss_far)`
* **Description:** Utility to spawn a `redpouch_yot_catcoon` containing `lucky_goldnugget` items and launch it toward a target.
* **Parameters:** `tosser` (entity); `target` (entity); `num_lucky_goldnugget` (number); `toss_far` (boolean) — controls throw distance.
* **Returns:** Nothing.
* **Error states:** None.

### `CheckIfKitcoonsCanPlay(inst)`
* **Description:** Verifies all kitcoons at the den are eligible for hide-and-seek (have `hideandseekhider` component and haven't played today).
* **Parameters:** `inst` (entity).
* **Returns:** `true` if all kitcoons can play; `false` otherwise.
* **Error states:** None.

## Events & listeners
- **Listens to:**
  - `"onhammered"` — triggers den destruction.
  - `"onhit"` — plays hit animation.
  - `"onbuilt"` — initializes idle animation, sound, and discovers nearby leaderless kitcoons.
  - `"onremove"` — removes `near_kitcoonden` tag from nearby players.
  - `"timerdone"` — triggers game timeout or warning logic.
  - `"onremove_seeker"` (via `hideandseekgame`) — internal cleanup.
  - `"onhidingspotremoved"` (via `hideandseekgame`) — internal cleanup.
  - `"onwakeup"` (via `sleeper` component) — ensures kitcoons wake up when joining.
- **Pushes:**
  - `"hideandseek_start"` — fired on minigame start with a timeout.
  - `"entity_droploot"` — fired when loot is dropped.
  - `"ms_collect_uniquekitcoons"` (event-specific) — used for unique kitcoon spawning logic.

## Notes
- The den is considered pristinely snowy only if placed correctly (`MakeSnowCoveredPristine`/`MakeSnowCovered`).
- The `playerprox` component manages the `near_kitcoonden` tag on players, enabling proximity-based UI/behavior changes.
- The `activatable.inactive` flag is used to prevent activation when rules aren't met or during minigame cooldown.
- The `hideandseekgame` component's `hiding_range` and `hiding_range_toofar` values are set from tuning constants and affect seeker distance warnings.