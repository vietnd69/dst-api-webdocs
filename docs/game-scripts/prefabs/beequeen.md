---
id: beequeen
title: Beequeen
description: Defines the Beequeen boss prefab with combat, phase transitions, honey trail mechanics, and bee guard command systems.
tags: [boss, combat, ai, monster, bee]
sidebar_position: 10

last_updated: 2026-03-20
build_version: 714014
change_status: stable
category_type: root
source_hash: d99b0da6
system_scope: entity
---

# Beequeen

> Based on game build **714014** | Last updated: 2026-03-20

## Overview
`beequeen` is a prefab file that defines the Beequeen boss entity for Don't Starve Together. It configures the entity with multiple components for combat behavior, health-based phase transitions (4 phases), honey trail spawning, commander functionality for bee guards, and player tracking systems. The prefab integrates with the brain system for AI behavior and stategraph for animation control.

## Usage example
```lua
-- Spawn Beequeen in the world
local beequeen = SpawnPrefab("beequeen")

-- Access phase configuration
beequeen.focustarget_cd = TUNING.BEEQUEEN_FOCUSTARGET_CD[2]

-- Control honey trail system
beequeen:StartHoney()
beequeen:StopHoney()

-- Boost commander range for guard spawning
beequeen:BoostCommanderRange(true)
```

## Dependencies & tags
**Components used:** `combat`, `commander`, `epicscare`, `freezable`, `grouptargeter`, `health`, `healthtrigger`, `inspectable`, `knownlocations`, `locomotor`, `lootdropper`, `sleeper`, `stuckdetection`, `timer`, `sanityaura`, `explosiveresist`

**Tags:** Adds `epic`, `noepicmusic`, `bee`, `beequeen`, `insect`, `monster`, `hostile`, `scarytoprey`, `largecreature`, `flying`, `ignorewalkableplatformdrowning`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `focustarget_cd` | number | Phase-dependent | Cooldown for focus target selection based on current phase |
| `spawnguards_cd` | number | Phase-dependent | Cooldown for spawning bee guards based on current phase |
| `spawnguards_maxchain` | number | Phase-dependent | Maximum chain length for guard spawning based on current phase |
| `spawnguards_threshold` | number | Phase-dependent | Threshold for guard spawning based on current phase |
| `honeytask` | task | `nil` | Periodic task reference for honey trail spawning |
| `honeycount` | number | `0` | Counter for honey trail spawn timing |
| `honeythreshold` | number | `0` | Threshold value for honey trail spawning |
| `usedhoney` | table | `{}` | Array of recently used honey variations |
| `availablehoney` | table | `{1..7}` | Array of available honey variation indices |
| `commanderboost` | boolean | `false` | Whether commander range is currently boosted |
| `commandertask` | task | `nil` | Periodic task for updating commander range |
| `_playingmusic` | boolean | `false` | Whether Beequeen music is currently playing for nearby player |
| `_sleeptask` | task | `nil` | Delayed removal task when entity sleeps |
| `hit_recovery` | number | `TUNING.BEEQUEEN_HIT_RECOVERY` | Recovery time after being hit |
| `spawnguards_chain` | number | `0` | Current chain count for guard spawning |

## Main functions
### `BoostCommanderRange(boost)`
*   **Description:** Enables or disables extended commander tracking distance for bee guard spawning. When boosted, tracking distance increases to 80 units; otherwise returns to default 40 units.
*   **Parameters:** `boost` (boolean) - Whether to enable boosted range.
*   **Returns:** Nothing.
*   **Error states:** Cancels existing `commandertask` if boost is enabled.

### `StartHoney()`
*   **Description:** Initiates the periodic honey trail spawning system. Sets initial threshold and count values, then starts a periodic task that spawns honey trails based on movement state.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `honeytask` is already active.

### `StopHoney()`
*   **Description:** Cancels the honey trail spawning periodic task.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `honeytask` is `nil`.

### `OnSave(data)`
*   **Description:** Serializes Beequeen state for save files. Stores commander tracking distance if boosted.
*   **Parameters:** `data` (table) - Save data table to populate.
*   **Returns:** Nothing.

### `OnLoad(data)`
*   **Description:** Restores Beequeen state from save files. Determines current phase based on health percentage and restores commander boost state.
*   **Parameters:** `data` (table) - Loaded save data table.
*   **Returns:** Nothing.

### `OnEntitySleep()`
*   **Description:** Handles entity sleep state. Schedules entity removal after 10 seconds if not dead, and cancels commander update task.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnEntityWake()`
*   **Description:** Handles entity wake state. Cancels sleep removal task and restores commander boost state.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `attacked` - Triggers target acquisition and shares target with all bee guards via commander component.
- **Listens to:** `onattackother` - Resets stuck detection and spawns honey trail at target location.
- **Listens to:** `onmissother` - Spawns honey trail at attack range distance in facing direction.
- **Pushes:** `screech` - Fired when entering phases 2, 3, or 4 (health thresholds at 75%, 50%, 25%).
- **Pushes:** `triggeredevent` (to player) - Fired when player is near Beequeen to trigger boss music.