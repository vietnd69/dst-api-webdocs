---
id: beargerspawner
title: Beargerspawner
description: Manages the seasonal spawning of the Bearger boss during autumn with warning systems and player targeting.
tags: [boss, spawning, season, ai]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: components
source_hash: ca62ad7b
system_scope: world
---

# Beargerspawner

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`Beargerspawner` is a world-level component that controls the spawning mechanics for the Bearger boss during autumn season. It manages spawn timing through the `worldsettingstimer` component, tracks active Bearger instances, and implements a warning system that alerts nearby players before spawning occurs. The component only operates on the master simulation server and coordinates with player presence to determine valid spawn targets.

## Usage example
```lua
-- Beargerspawner is automatically added to TheWorld on master sim
local spawner = TheWorld.components.beargerspawner

-- Debug: Force a Bearger spawn in 10 seconds
spawner:SummonMonster(ThePlayer)

-- Check spawn status via debug string
print(spawner:GetDebugString())

-- Warning speech is triggered automatically during countdown
-- spawner:DoWarningSpeech(targetPlayer) -- called internally
```

## Dependencies & tags
**External dependencies:**
- `easing` -- used for weighted player selection in PickPlayer()

**Components used:**
- `worldsettingstimer` -- manages Bearger spawn timer via StartTimer, GetTimeLeft, PauseTimer, ResumeTimer
- `areaaware` -- checks player location eligibility for spawning (via player.components.areaaware)
- `talker` -- displays warning announcements to players (via player.components.talker:Say)

**Tags:**
- None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | Entity | TheWorld | The entity instance that owns this component (always TheWorld). |
| `_warning` | boolean | `false` | Whether the warning phase is currently active. |
| `_spawndelay` | number | `nil` | Calculated base delay between Bearger spawns. |
| `_warnduration` | number | `60` | Duration in seconds before spawn when warnings begin. |
| `_numToSpawn` | number | `0` | Target number of Beargers to spawn this season. |
| `_numSpawned` | number | `0` | Count of Beargers currently spawned. |
| `_targetplayer` | Entity | `nil` | Player entity selected as the spawn target. |
| `_activehasslers` | table | `{}` | Map of active Bearger entities. |
| `_activeplayers` | table | `{}` | List of eligible player entities. |
| `_lastBeargerKillDay` | number | `nil` | Game cycle day when last Bearger was killed. |

## Main functions
### `SetSecondBeargerChance(chance)`
* **Description:** Deprecated function. Previously set the spawn chance for a second Bearger. No longer has any effect.
* **Parameters:** `chance` -- number representing spawn probability (ignored).
* **Returns:** None.
* **Error states:** None.

### `SetFirstBeargerChance(chance)`
* **Description:** Deprecated function. Previously set the spawn chance for the first Bearger. No longer has any effect.
* **Parameters:** `chance` -- number representing spawn probability (ignored).
* **Returns:** None.
* **Error states:** None.

### `OnPostInit()`
* **Description:** Initializes the Bearger spawn timer after all components are set up. Calculates total spawn chance and registers the timer callback. Only creates timer if total chance is greater than zero.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

### `DoWarningSpeech(_targetplayer)`
* **Description:** Triggers warning announcements for the target player and all nearby players within twice the spawn distance. Uses the Deerclops announcement string as a placeholder.
* **Parameters:** `_targetplayer` -- player entity to base warning proximity on.
* **Returns:** None.
* **Error states:** Errors if `_targetplayer` is nil when passed to `v:IsNear()` -- no nil guard present before proximity check.

### `DoWarningSound(_targetplayer)`
* **Description:** Spawns a warning sound prefab at the target player's position. Sound level (1-4) is determined by time remaining until spawn, with lower numbers for longer remaining time.
* **Parameters:** `_targetplayer` -- player entity to spawn sound at.
* **Returns:** None.
* **Error states:** Errors if `_targetplayer` is nil when accessing `Transform:GetWorldPosition()` -- no nil guard present.

### `OnUpdate(dt)`
* **Description:** Main update loop that manages the warning phase and spawn timing. Activates warning system when timer falls below warning duration threshold. Triggers warning sounds and speech at intervals. Stops updating component when no spawn is pending.
* **Parameters:** `dt` -- delta time since last update in seconds.
* **Returns:** None.
* **Error states:** None.

### `LongUpdate(dt)`
* **Description:** Calls OnUpdate with the same delta time. Provides an alternate update entry point.
* **Parameters:** `dt` -- delta time since last update in seconds.
* **Returns:** None.
* **Error states:** None.

### `OnSave()`
* **Description:** Serializes component state for save files. Includes warning state, spawn counts, last kill day, and active Bearger entity GUIDs.
* **Parameters:** None.
* **Returns:** Two values: `data` (table with save data) and `ents` (table of entity GUIDs for reference resolution).
* **Error states:** None.

### `OnLoad(data)`
* **Description:** Restores component state from save data. Stops updating and pauses timer initially. Supports legacy `timetospawn` field for backwards compatibility.
* **Parameters:** `data` -- table containing saved component state.
* **Returns:** None.
* **Error states:** None.

### `LoadPostPass(newents, savedata)`
* **Description:** Finalizes loading after entity references are resolved. Restores active Bearger references from GUIDs and resumes timer/spawning if conditions are met.
* **Parameters:**
  - `newents` -- table mapping GUIDs to resolved entity instances.
  - `savedata` -- table containing saved component state.
* **Returns:** None.
* **Error states:** None.

### `GetDebugString()`
* **Description:** Returns a formatted debug string showing current spawn state, timer value, warning status, and Bearger counts. Useful for console debugging.
* **Parameters:** None.
* **Returns:** String containing debug information.
* **Error states:** None.

### `SummonMonster(player)`
* **Description:** Debug function that forces a Bearger spawn in 10 seconds. Sets or resumes the timer and starts component updating. Useful for testing spawn mechanics.
* **Parameters:** `player` -- player entity (used for context but not directly referenced in spawn logic).
* **Returns:** None.
* **Error states:** None.

## Events & listeners
- **Listens to:** `ms_playerjoined` -- adds player to active player list and resumes timer if spawning is possible.
- **Listens to:** `ms_playerleft` -- removes player from active list, clears target if needed, pauses timer if no players remain.
- **Listens to:** `seasontick` -- recalculates spawn chances on autumn start, resets on other seasons.
- **Listens to:** `beargerremoved` -- removes Bearger from active hasslers tracking.
- **Listens to:** `beargerkilled` -- removes Bearger from tracking, stops timer, records kill day for cooldown calculation.
- **Pushes:** None identified.