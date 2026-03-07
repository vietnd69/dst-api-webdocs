---
id: beequeen
title: Beequeen
description: Represents the Beequeen boss entity with dynamic health phases, command over beeguards, and honey trail generation mechanics.
tags: [combat, boss, ai, flying, group]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d99b0da6
system_scope: entity
---

# Beequeen

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`beequeen` defines the master prefab for the Beequeen boss, a flying hostile entity that commands beeguards and dynamically adjusts its behavior based on health thresholds. It integrates multiple components to manage combat, grouping, locomotion, sleep states, and boss-specific mechanics like phase transitions and honey trail generation. The entity is designed for dedicated servers and clientside music triggers, and it persists boss-specific state across save/load cycles.

## Usage example
```lua
-- Typically instantiated via Prefab system as "beequeen"
-- Example of adding event listeners to customize behavior:
local inst = Prefab("beequeen")
inst:ListenForEvent("screech", function() print("Beequeen changed phases!") end)
```

## Dependencies & tags
**Components used:** `inspectable`, `lootdropper`, `sleeper`, `locomotor`, `health`, `healthtrigger`, `combat`, `stuckdetection`, `explosiveresist`, `grouptargeter`, `commander`, `timer`, `sanityaura`, `epicscare`, `knownlocations`, `freezable`

**Tags:** `epic`, `noepicmusic`, `bee`, `beequeen`, `insect`, `monster`, `hostile`, `scarytoprey`, `largecreature`, `flying`, `ignorewalkableplatformdrowning`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `focustarget_cd` | number | `TUNING.BEEQUEEN_FOCUSTARGET_CD[1]` | Cooldown between focus-target switches per phase. |
| `spawnguards_cd` | number | `TUNING.BEEQUEEN_SPAWNGUARDS_CD[1]` | Cooldown between guard spawns per phase. |
| `spawnguards_maxchain` | number | `TUNING.BEEQUEEN_SPAWNGUARDS_CHAIN[1]` | Maximum number of consecutive guard spawns per phase. |
| `spawnguards_threshold` | number | `1` | Guard count threshold that triggers phase-specific behavior. |
| `commanderboost` | boolean | `false` | Whether the commander range is currently boosted (80 vs 40). |
| `commandertask` | function | `nil` | Periodic task to restore normal commander range after boost. |
| `_sleeptask` | function | `nil` | Task to remove entity after extended sleep. |
| `_playingmusic` | boolean | `false` | Tracks whether boss music is playing for the local player. |
| `honeytask` | function | `nil` | Periodic task responsible for honey trail generation. |
| `honeycount` | number | `0` | Counter tracking steps since last honey spawn. |
| `honeythreshold` | number | `HONEY_LEVELS[1].threshold` | Step count required to spawn next honey particle. |
| `usedhoney` | table | `{}` | Queue of recently used honey variation IDs. |
| `availablehoney` | table | `{1..7}` | List of available honey variation IDs. |
| `spawnguards_chain` | number | `0` | Current chain count of beeguard spawns. |

## Main functions
### `SetPhaseLevel(inst, phase)`
*   **Description:** Configures phase-specific thresholds and durations for focus-target switching and guard spawning based on the current health phase (1–4).
*   **Parameters:** `phase` (number) – Phase index (1, 2, 3, or 4) corresponding to health thresholds.
*   **Returns:** Nothing.

### `BoostCommanderRange(inst, boost)`
*   **Description:** Temporarily increases or restores the commander tracking distance used to maintain beeguard synchronization.
*   **Parameters:** `boost` (boolean) – If `true`, sets tracking distance to 80; if `false`, schedules gradual reduction to default (40).
*   **Returns:** Nothing.

### `StartHoney(inst)`
*   **Description:** Initiates the periodic honey trail generation task using `DoHoneyTrail`.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No effect if `honeytask` is already active.

### `StopHoney(inst)`
*   **Description:** Cancels the periodic honey trail task if active.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `UpdatePlayerTargets(inst)`
*   **Description:** Synchronizes the grouptargeter list with nearby players within aggro/deaggro radii, ensuring targeted players are correctly tracked and removed.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `RetargetFn(inst)`
*   **Description:** Determines the next combat target based on proximity, player status, and grouptargeter weights. Returns a new target and whether the retarget is valid.
*   **Parameters:** None.
*   **Returns:** `target` (entity or `nil`), `valid` (`true`).

### `KeepTargetFn(inst, target)`
*   **Description:** Validates whether the current combat target should be retained based on tag, proximity to spawn, and combat eligibility.
*   **Parameters:** `target` (entity or `nil`) – Proposed target to retain.
*   **Returns:** Boolean (`true` if target should be kept).

### `bonus_damage_via_allergy(inst, target, damage, weapon)`
*   **Description:** Applies extra damage if the target has the `allergictobees` tag.
*   **Parameters:** `target` (entity), `damage` (number), `weapon` (entity or `nil`).  
*   **Returns:** `TUNING.BEE_ALLERGY_EXTRADAMAGE` if applicable; otherwise `0`.

### `OnAttacked(inst, data)`
*   **Description:** Handles damage reception by acquiring new targets (if needed) and notifying beeguards.
*   **Parameters:** `data` (table) – Event data containing `attacker`.
*   **Returns:** Nothing.

### `OnAttackOther(inst, data)`
*   **Description:** Triggers honey trail generation at the location of a hit target upon successful attack.
*   **Parameters:** `data` (table) – Event data containing `target`.
*   **Returns:** Nothing.

### `OnMissOther(inst)`
*   **Description:** Triggers honey trail generation at the point where the Beequeen *would* have hit (based on attack range and facing direction) when a melee attack misses.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `EnterPhase2Trigger(inst)`
*   **Description:** Called when health falls below 75%; sets phase 2 parameters and pushes `"screech"` event.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `EnterPhase3Trigger(inst)`
*   **Description:** Called when health falls below 50%; sets phase 3 parameters and pushes `"screech"` event.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `EnterPhase4Trigger(inst)`
*   **Description:** Called when health falls below 25%; sets phase 4 parameters and pushes `"screech"` event.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnSave(inst, data)`
*   **Description:** Serializes commander tracking range boost state for persistence.
*   **Parameters:** `data` (table) – Save data table to populate.
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Restores phase and commander range from saved state; corrects phase based on current health.
*   **Parameters:** `data` (table or `nil`) – Loaded save data.
*   **Returns:** Nothing.

### `OnEntitySleep(inst)`
*   **Description:** Cancels honey and commander tasks; schedules entity removal if not dead after sleep timeout.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnEntityWake(inst)`
*   **Description:** Restores commander range boost state and cancels removal task on wake.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `PushMusic(inst)`
*   **Description:** Triggers boss music for the local player when within appropriate distance and not in flight mode.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `attacked` – When the entity is damaged; triggers target acquisition and beeguard targeting.  
  `onattackother` – When a melee attack hits a target; spawns honey at hit location.  
  `onmissother` – When a melee attack misses; spawns honey near the attack direction.

- **Pushes:**  
  `screech` – Fired on every health phase transition (phases 2, 3, and 4).  
  *(No other events are pushed by this prefab.)*
