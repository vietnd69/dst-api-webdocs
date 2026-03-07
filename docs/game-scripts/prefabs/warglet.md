---
id: warglet
title: Warglet
description: A hostile hound-like boss entity that spawns additional hounds, coordinates a pack, and transitions between land and water locomotion.
tags: [combat, ai, boss, leader, amphibious]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: be708195
system_scope: entity
---

# Warglet

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `warglet` prefab is a high-tier, aggressive boss entity that functions as a `leader` of a hound pack and a `combat` unit. It manages pack behavior via `leader`/`follower` components, adapts movement between land and ocean via `amphibiouscreature`, and summons additional hounds in response to threats or time elapsed. It integrates closely with `follower`, `entitytracker`, `sleeper`, and `combat` components to support AI-driven leadership and survival mechanics.

## Usage example
```lua
local inst = Prefab("warglet", fncommon, assets, prefabs)
-- Typical instantiation occurs internally via `SpawnPrefab("warglet")` in worldgen or scripts.
-- External modders should reference it as a prefab, not instantiate manually.
```

## Dependencies & tags
**Components used:** `amphibiouscreature`, `combat`, `eater`, `embarker`, `entitytracker`, `follower`, `health`, `inspectable`, `leader`, `locomotor`, `lootdropper`, `sanityaura`, `sleeper`, `spawnfader`, `Burnable`, `Freezable` (via helpers)
**Tags added:** `scarytoprey`, `scarytooceanprey`, `monster`, `hostile`, `hound`, `canbestartled`, `hound_summoner`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `spawn_fewer_hounds` | boolean | `true` | Reduces the number of hounds spawned per howl. |
| `max_hound_spawns` | number | `TUNING.WARGLET_MAX_HOUND_AMOUNT` | Upper bound on total hounds this warglet can spawn in its lifetime. |
| `base_hound_num` | number | `TUNING.WARGLET_BASE_HOUND_AMOUNT` | Base number of hounds used in spawning calculations. |
| `chomp_power` | number | `1.5` | Multiplier applied to attack damage or visuals (unused in source beyond initialization). |

## Main functions
### `NumHoundsToSpawn(inst)`
* **Description:** Calculates how many new hounds should spawn based on nearby players' ages and existing followers. Used by `howl` behaviors to determine pack size.
* **Parameters:** `inst` (Entity) — the warglet instance.
* **Returns:** `number` — integer count of hounds to spawn.
* **Error states:** Saturates at `max_hound_spawns` and subtracts current follower count.

### `retargetfn(inst)`
* **Description:** The custom retargeting function used by the `combat` component. Determines if and where the warglet should engage new targets based on proximity, leader status, and validity.
* **Parameters:** `inst` (Entity) — the warglet instance.
* **Returns:** `Entity?` — valid target entity or `nil` if no suitable target found.
* **Error states:** Returns `nil` while statue-stunned or if the leader is statue-stunned.

### `KeepTarget(inst, target)`
* **Description:** Determines whether the warglet should continue targeting a specific entity. Enforces proximity to leader and validity of the target.
* **Parameters:** 
  - `inst` (Entity) — the warglet instance.
  - `target` (Entity) — the entity currently being targeted.
* **Returns:** `boolean` — `true` if target should be retained.
* **Error states:** Returns `false` if warglet is statue-stunned or too far from leader.

### `OnAttacked(inst, data)`
* **Description:** Handler for when the warglet takes damage. Immediately targets the attacker and alerts nearby friendly hounds.
* **Parameters:** 
  - `inst` (Entity) — the warglet instance.
  - `data` (table) — event payload, must contain `attacker`.
* **Returns:** Nothing.
* **Side effects:** Calls `combat:SetTarget` and `combat:ShareTarget` with a distance of `SHARE_TARGET_DIST` (30).

### `OnAttackOther(inst, data)`
* **Description:** Handler for when the warglet attacks another entity. Calls `combat:ShareTarget` to rally nearby hounds to join the fight.
* **Parameters:** 
  - `inst` (Entity) — the warglet instance.
  - `data` (table) — event payload, must contain `target`.
* **Returns:** Nothing.
* **Side effects:** Triggers `combat:ShareTarget` with same filter and range as `OnAttacked`.

### `DoReturn(inst)`
* **Description:** Moves the warglet back toward its home when conditions are met (night, near home, and pet hound). If far from sleeping home, it teleports; otherwise, it delegates to `childspawner:GoHome`.
* **Parameters:** `inst` (Entity) — the warglet instance.
* **Returns:** Nothing.
* **Error states:** Early-exits if no `homeseeker` or no valid home.

## Events & listeners
- **Listens to:**
  - `newcombattarget` — wakes up the warglet and updates target.
  - `attacked` — triggers aggressive counter-attack and hound summoning.
  - `onattackother` — triggers hound summoning when attacking others.
  - `startfollowing` — adjusts leader tracking and follow duration.
  - `stopfollowing` — prepares potential leader restoration task.
- **Pushes:** None directly, but responds to events like `restoredfollower` from leader restoration logic.
