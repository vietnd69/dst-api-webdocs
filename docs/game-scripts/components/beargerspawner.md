---
id: beargerspawner
title: Beargerspawner
description: Manages spawning and timers for Bearger events in DST, tracking players, seasonal logic, and countdown warnings.
tags: [boss, spawning, world, timer, event]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 772a7fa3
system_scope: world
---

# Beargerspawner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Beargerspawner` is a server-only (`ismastersim`) component responsible for orchestrating Bearger (Hound-like boss) spawns during autumn. It tracks active players, manages countdown timers via `worldsettingstimer`, determines spawn eligibility based on seasonal state and previous kills, and coordinates warning sounds and announcements before spawning. The component does not spawn Beargers directly but calls `ReleaseHassler` to instantiate them via `SpawnPrefab("bearger")`.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("beargerspawner")
inst.components.beargerspawner:OnPostInit()
inst.components.beargerspawner:SummonMonster(player)
```

## Dependencies & tags
**Components used:** `worldsettingstimer`, `talker` (via `player.components.talker`)
**Tags:** Checks `nohasslers` via `areaaware`; spawns prefabs with tag `bearger_blocker`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity instance this component is attached to (typically a world-level entity). |

*Note: All other state variables are private (`_warnduration`, `_numToSpawn`, `_targetplayer`, etc.) and not exposed as public properties.*

## Main functions
### `OnPostInit()`
* **Description:** Initializes the spawner after prefabs load. Sets up the initial spawn timer if bearger chances are non-zero.
* **Parameters:** None.
* **Returns:** Nothing.

### `DoWarningSpeech(targetplayer)`
* **Description:** Triggers speech (warning) for the given player and nearby players.
* **Parameters:** `targetplayer` (`Entity`) - the player selected as the target for the upcoming Bearger spawn.
* **Returns:** Nothing.

### `DoWarningSound(targetplayer)`
* **Description:** Spawns a `beargerwarning_lvlX` sound prefab at the target player's location based on remaining time before spawn.
* **Parameters:** `targetplayer` (`Entity`) - the player whose location determines where the warning sound plays.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Called every frame while the component is active. Manages warning phase transitions, sound intervals, and timer updates. Advances countdown, picks players, and triggers speech/sounds.
* **Parameters:** `dt` (`number`) - time elapsed since last update.
* **Returns:** Nothing.

### `LongUpdate(dt)`
* **Description:** Alias for `OnUpdate`; same behavior. Used for tick-based updates in longer intervals.
* **Parameters:** `dt` (`number`) - time elapsed since last update.
* **Returns:** Nothing.

### `SummonMonster(player)`
* **Description:** Manually triggers immediate countdown for a Bearger spawn (e.g., for debugging or custom events).
* **Parameters:** `player` (`Entity`) - ignored by current implementation; used only to signal intent.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a formatted debug string describing the current spawn state, timer, warning status, and spawn counts.
* **Parameters:** None.
* **Returns:** `string` - descriptive status string (e.g., `"WARNING Bearger is coming in 45.20 (next warning in 12.50), target number: 3, current number: 1"`).

### `OnSave()`
* **Description:**serializes internal state for world save.
* **Parameters:** None.
* **Returns:** `data` (table), `ents` (array of GUIDs) — `data` contains `warning`, `numToSpawn`, `lastKillDay`, `numSpawned`, `activehasslers`; `ents` contains GUIDs of active hasslers for save/load.

### `OnLoad(data)`
* **Description:** Restores internal state from saved `data`.
* **Parameters:** `data` (table) — saved state object.
* **Returns:** Nothing.

### `LoadPostPass(newents, savedata)`
* **Description:** After entities are loaded, re-links `activehasslers` references from GUIDs to real entities and resumes spawner activity if conditions still permit.
* **Parameters:** `newents` (table of GUID→entity), `savedata` (table with `activehasslers` array of GUIDs).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `ms_playerjoined` → triggers `OnPlayerJoined`
  - `ms_playerleft` → triggers `OnPlayerLeft`
  - `seasontick` → triggers `OnSeasonTick`
  - `beargerremoved` → triggers `OnHasslerRemoved`
  - `beargerkilled` → triggers `OnHasslerKilled`
  - Timer callback: `TUNING.SPAWN_BEARGER` → triggers `OnBeargerTimerDone`
- **Pushes:** None.

*(End of documentation)*
