---
id: alterguardian_phase3dead
title: Alterguardian Phase3Dead
description: Manages the post-defeat state of the Alter Guardian boss, handling both the initial death orb and the mined remains, including loot distribution, light decay, and Wagstaff event spawning.
tags: [combat, boss, loot, event]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: bec77b89
system_scope: world
---

# Alterguardian Phase3Dead

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `alterguardian_phase3dead` prefab handles the entity state after the Alter Guardian Phase 3 is defeated. It creates two prefabs: `alterguardian_phase3deadorb` (a glowing orb that decays into a corpse after 5 seconds) and `alterguardian_phase3dead` (the mineable corpse with loot and altar-piece respawn mechanics). It integrates with the `lootdropper`, `workable`, and `wagboss_tracker` components to manage loot, mining, and post-boss event transitions.

## Usage example
```lua
-- Spawn the death orb (e.g., at boss defeat)
local orb = SpawnPrefab("alterguardian_phase3deadorb")
orb.Transform:SetPosition(entity:GetPosition())

-- The orb automatically transitions to the corpse after 5 seconds
-- and starts Wagstaff event sequence if the Wagboss is undefeated
```

## Dependencies & tags
**Components used:** `lootdropper`, `workable`, `inspectable`
**Tags:** Adds `boulder` and `moonglass` to the corpse; checks `wagboss_tracker:IsWagbossDefeated()` for event branching.

## Properties
No public properties.

## Main functions
### `orb_gotopst(inst)`
*   **Description:** Initiates the post-death "pst" animation sequence (light fade and orb replacement). Plays the `phase3_death_pst` animation, starts a periodic light decay task, and listens for `animover` to spawn the corpse and remove the orb.
*   **Parameters:** `inst` (entity) — the orb entity instance.
*   **Returns:** Nothing.
*   **Error states:** No effect if `inst._pststarted` is already `true`.

### `orb_onsave(inst, data)`
*   **Description:** Saves the `pststarted` state to persist across save/load cycles.
*   **Parameters:** `inst` (entity), `data` (table) — the save table to populate.
*   **Returns:** Nothing.

### `orb_onload(inst, data)`
*   **Description:** Restores the pst state; if `pststarted` is `true`, replays the death sequence.
*   **Parameters:** `inst` (entity), `data` (table) — the loaded save data.
*   **Returns:** Nothing.

### `start_wag_sequence(inst)`
*   **Description:** Handles the Wagstaff event spawn or immediate loot drop based on Wagboss defeat status. Spawns or despawns `wagstaff_npc_pstboss` and schedules the `orbtaken` event for loot delivery.
*   **Parameters:** `inst` (entity) — the orb or corpse entity.
*   **Returns:** Nothing.

### `dead_onwork(inst, worker, workleft)`
*   **Description:** Callback for mining the corpse. Triggers hit animation while work remains; on completion, drops loot, spawns visual FX, respawns altar pieces in a circle around the spawn point, and spawns an upgraded moonrock seed before removing the corpse.
*   **Parameters:** `inst` (entity), `worker` (entity or `nil`), `workleft` (number) — remaining work required.
*   **Returns:** Nothing.

### `orb_replacewithdead(inst)`
*   **Description:** Removes the orb and spawns the corpse at the same location/rotation.
*   **Parameters:** `inst` (entity) — the orb being replaced.
*   **Returns:** Nothing.

### `set_lightvalues(inst, val)`
*   **Description:** Configures the orb's light intensity, radius, and falloff based on the provided value.
*   **Parameters:** `inst` (entity), `val` (number) — brightness factor (`0.0` to `1.0`).
*   **Returns:** Nothing.

### `pst_lightupdate(inst)`
*   **Description:** Periodic task that decrements the orb's light intensity over 9 frames during the pst animation, then cancels itself when light is negligible.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` — triggers replacement of the orb with the corpse (`orb_replacewithdead`).
- **Pushes:** `ms_stopthemoonstorms`, `orbtaken`, and `startwork` (on Wagstaff spawn).

## Loot Table
The `"alterguardian_phase3dead"` loot table is defined with weighted entries for items including `alterguardianhat`, `moonglass`, and `moonrocknugget`. Loot is dropped by the `lootdropper` component when the corpse is fully mined.

## Altar Piece Respawn Logic
On corpse completion, 6 `moon_altar_*` pieces are spawned in a circle using `FindWalkableOffset`, with fallback to wider radius if initial placement fails (checked via `altarpiece_spawn_checkfn` which ensures no blockers like `INLIMBO` or `flying` exist in a 1.5 radius).