---
id: eyeofterror
title: Eyeofterror
description: Creates the Eye of Terror boss and its variants, handling combat logic, state transitions, twin management, and event-driven behaviors like health-based transformation and limbo cleanup.
tags: [combat, boss, ai,limbo]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: cb4349f4
system_scope: entity
---

# Eyeofterror

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`eyeofterror.lua` defines the `eyeofterror`, `twinofterror1`, `twinofterror2`, and `twinmanager` prefabs. It implements the core behavior for the Eye of Terror boss encounter, including target tracking, health-based phase transformation, soldier management via the `commander` component, and lifecycle handling in and out of limbo. The component integrates closely with `combat`, `grouptargeter`, `commander`, `health`, `sleeper`, and `entitytracker` components, and registers callbacks for critical game events like `attacked`, `healthdelta`, and `enterlimbo`.

## Usage example
```lua
-- Example: Spawning an Eye of Terror boss with default tuning
local inst = SpawnPrefab("eyeofterror")
-- The prefab handles its own initialization and component setup internally.
-- Key behavior is triggered via events and stategraph transitions.
```

## Dependencies & tags
**Components used:** `locomotor`, `health`, `combat`, `stuckdetection`, `explosiveresist`, `sleeper`, `lootdropper`, `inspectable`, `timer`, `knownlocations`, `grouptargeter`, `commander`, `sanityaura`, `epicscare`, `burnable`, `freezable`, `entitytracker`.  
**Tags added:** `eyeofterror`, `epic`, `flying`, `hostile`, `ignorewalkableplatformdrowning`, `largecreature`, `monster`, `noepicmusic`, `scarytoprey`, plus `mech`, `soulless`, `electricdamageimmune`, and `shadow_aligned` for twin variants.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_musicdirty` | event reference | `net_event(...)` | Local event handler for music tracking. |
| `_playingmusic` | boolean | `false` | Tracks whether boss music is currently playing for the local player. |
| `_musictask` | Task | `nil` | Periodic task managing music state updates. |
| `_leftday` | number (cycle count) | `nil` | Day count when the boss last left the world (used for health regen). |
| `_transformonhealthupdate` | boolean | `true` (eye only) | Triggers transformation on health update if below threshold. |
| `_recentlycharged` | table | `nil` | Maps entity → timestamp to prevent repeated collisions during charge. |
| `_soundpath` | string | `data.soundpath` | Sound path prefix for this instance. |
| `_cooldowns` | table | `data.cooldowns` | Initial cooldown values for special abilities. |
| `_chargedata` | table | `data.chargedata` | Charge-specific parameters (speed, timeout, etc.). |
| `_mouthspawncount` | number | `data.mouthspawncount` | Number of mouth summons per spawn event. |
| `_chompdamage` | number | `data.chompdamage` | AoE damage dealt on charge impact. |
| `OnCollide` | function | `OnCollide` | Callback for collision handling. |
| `ClearRecentlyCharged` | function | `ClearRecentlyCharged` | Clears the `_recentlycharged` state. |
| `GetDesiredSoldiers` | function | `GetDesiredSoldiers` | Returns required number of soldiers based on current state. |
| `FlybackHealthUpdate` | function | `FlybackHealthUpdate` | Applies health regen after returning from limbo. |
| `OnSave` / `OnLoad` | functions | `OnSave` / `OnLoad` | Persistence handling. |

## Main functions
### `update_targets(inst)`
* **Description:** Re-evaluates the group of valid combat targets for the boss based on proximity to spawn point and tag filtering.
* **Parameters:** `inst` (Entity) — The Eye of Terror entity instance.
* **Returns:** Nothing.
* **Error states:** Uses hardcoded tag sets (`RETARGET_MUST_TAGS`, `RETARGET_CANT_TAGS`, `RETARGET_ONEOF_TAGS`) to filter entities via `TheSim:FindEntities`.

### `get_target_test_range(inst, use_short_dist, target)`
* **Description:** Computes the effective target detection range, which changes during charge states and if stuck.
* **Parameters:**  
  `inst` (Entity) — Boss entity.  
  `use_short_dist` (boolean) — Whether to use a short-range check (e.g., during attack).  
  `target` (Entity) — Candidate target.  
* **Returns:** number — The computed detection range in world units.

### `RetargetFn(inst)`
* **Description:** The combat component’s re-target function. Ensures valid targets exist, prioritizes players, and picks a random nearby target otherwise.
* **Parameters:** `inst` (Entity) — Boss entity.
* **Returns:**  
  *target* (Entity or `nil`) — Selected target or `nil`.  
  `true` — Always returns `true` to indicate re-targeting should be attempted again.

### `KeepTargetFn(inst, target)`
* **Description:** Determines whether the current target remains valid (not in limbo, combat-able, and within range of spawn point).
* **Parameters:**  
  `inst` (Entity) — Boss entity.  
  `target` (Entity) — Candidate target.  
* **Returns:** boolean — `true` if target remains valid.

### `OnAttacked(inst, data)`
* **Description:** Reacts to boss being attacked by acquiring the attacker as the new target (if not already nearby), and sharing the target with soldiers.
* **Parameters:**  
  `inst` (Entity) — Boss entity.  
  `data` (table) — Damage event data containing `attacker` (Entity).  
* **Returns:** Nothing.

### `OnCollide(inst, other)`
* **Description:** Handles boss collision with entities during movement (e.g., charge). Uses `_recentlycharged` to limit repeated hits on the same entity.
* **Parameters:**  
  `inst` (Entity) — Boss entity.  
  `other` (Entity) — Collided entity.  
* **Returns:** Nothing.
* **Error states:** Skips damage if `other` has no health or is dead, or if hit too recently (< 3 seconds).

### `GetDesiredSoldiers(inst)`
* **Description:** Returns how many soldiers (minions) the boss should maintain based on transformation state and current target.
* **Parameters:** `inst` (Entity) — Boss entity.  
* **Returns:** number — Number of desired soldiers (e.g., `TUNING.EYEOFTERROR_EYE_MINGUARDS` or `TUNING.EYEOFTERROR_MOUTH_MINGUARDS`).

### `FlybackHealthUpdate(inst)`
* **Description:** Heals the boss proportionally to time spent outside the world (`_leftday`), and checks for transformation back to non-wooly state.
* **Parameters:** `inst` (Entity) — Boss entity.  
* **Returns:** Nothing.

### `common_fn(data)`
* **Description:** Shared constructor function used by all Eye variants. Sets up components, tags, sound/music logic, timers, and event handlers.
* **Parameters:** `data` (table) — Prefab-specific configuration (bank, build, health, damage, etc.).  
* **Returns:** Entity — Fully configured prefab instance.

### `eyefn()`, `twin1fn()`, `twin2fn()`, `twinmanagerfn()`
* **Description:** Prefab-specific constructors. `eyefn` creates the base boss; twins are meat/robot variants with extra tags and sleep immunity; `twinmanagerfn` manages twin lifecycle and coordination.
* **Parameters:** None (uses `data` internally).  
* **Returns:** Entity (per prefab).  

### `eyeofterror_isdying(inst)`
* **Description:** Returns `true` if the Eye of Terror has died (health ≤ 0).
* **Parameters:** `inst` (Entity) — Boss entity.  
* **Returns:** boolean.

### `eyeofterror_should_transform(inst, health_data)`
* **Description:** Event listener that pushes `health_transform` when health drops below transformation threshold.
* **Parameters:**  
  `inst` (Entity) — Boss entity.  
  `health_data` (table) — `healthdelta` event payload with `newpercent`.  
* **Returns:** Nothing.

### `eyeofterror_setspawntarget(inst, target)`
* **Description:** Sets the boss’s combat target to the given entity.
* **Parameters:**  
  `inst` (Entity) — Boss entity.  
  `target` (Entity) — New target.  
* **Returns:** Nothing.

### `eyeofterror_onleave_entitysleepcleanup(inst)`
* **Description:** Helper to push `finished_leaving` on sleep cleanup.
* **Parameters:** `inst` (Entity) — Boss entity.  
* **Returns:** Nothing.

### `hookup_twin_listeners(inst, twin)`
* **Description:** Attaches mutual cleanup and sync callbacks between the `twinmanager` and a twin entity.
* **Parameters:**  
  `inst` (Entity) — Twin manager.  
  `twin` (Entity) — Twin entity (`twinofterror1` or `twinofterror2`).  
* **Returns:** Nothing.

### `get_spawn_positions(inst, targeted_player)`
* **Description:** Computes side-by-side spawn positions for twins relative to a player.
* **Parameters:**  
  `inst` (Entity) — Twin manager.  
  `targeted_player` (Entity) — Player to base offset on.  
* **Returns:** `pos1` (Vector3), `pos2` (Vector3).

### `spawn_arriving_twins(inst, targeted_player)`
* **Description:** Spawns and positions twins for arrival phase.
* **Parameters:**  
  `inst` (Entity) — Twin manager.  
  `targeted_player` (Entity) — Player to spawn near.  
* **Returns:** Nothing.

### `flyback_twins(inst, targeted_player)`
* **Description:** Returns twins to the scene after limbo with correct positions and states.
* **Parameters:**  
  `inst` (Entity) — Twin manager.  
  `targeted_player` (Entity) — Player to return near.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `attacked` → `OnAttacked`  
  - `finished_leaving` → `OnFinishedLeaving`  
  - `enterlimbo` → `OnEnterLimbo`  
  - `death` → `OnDeath`  
  - `set_spawn_target` → `eyeofterror_setspawntarget` (eye only) / `manager_setspawntarget` (twin manager)  
  - `healthdelta` → `eyeofterror_should_transform` (eye only) / twin health sync (twin manager)  
  - `leave` → `eyeofterror_onleave_entitysleepcleanup` (eye only) / `twinsmanager_leave` (twin manager)  
  - `onremove`, `forgetme`, `turnoff_terrarium` → twin lifecycle hooks (`twinmanager`)  
  - `arrive`, `flyback`, `leave` → twin lifecycle hooks (`twinmanager`)  
  - `musicdirty` → `OnMusicDirty` (local per-instance music sync)

- **Pushes:**  
  - `health_transform` — When health drops below `TUNING.EYEOFTERROR_TRANSFORMPERCENT`.  
  - `finished_leaving` — When boss fully exits or twins leave/cleanup.  
  - `unfreeze`, `onwakeup`, `onextinguish`, `onremove` — Via component event propagation.