---
id: deerclopsspawner
title: Deerclopsspawner
description: Manages the spawning, timing, and targeting logic for Deerclops boss attacks in DST.
tags: [boss, combat, world, spawning, seasonal]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: a4dce30e
system_scope: world
---

# Deerclopsspawner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Deerclopsspawner` orchestrates Deerclops boss spawns during winter (and optionally off-season) in DST. It monitors active players, calculates attack timing based on season length and configured rates, selects a valid target player and location, and spawns the `deerclops` entity when conditions are met. It interacts with the `worldsettingstimer`, `areaaware`, `knownlocations`, and `talker` components to manage state, movement, and player announcements.

## Usage example
```lua
-- Typically added automatically to the world entity during init:
-- TheWorld.components.deerclopsspawner = TheWorld:AddComponent("deerclopsspawner")
-- No manual usage is intended; it operates as a singleton world component.
```

## Dependencies & tags
**Components used:** `worldsettingstimer`, `areaaware`, `knownlocations`, `talker`  
**Tags:** Checks `nohasslers` on player areas; no tags added or removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Owner entity (always `TheWorld` in mastersim). |

## Main functions
### `OnPostInit()`
* **Description:** Initializes the Deerclops attack timer based on season tuning and starts the attack cycle. Called once when the component is added to `TheWorld`.
* **Parameters:** None.
* **Returns:** Nothing.

### `DoWarningSpeech(targetPlayer)`
* **Description:** Triggers Deerclops warning speech for players near the target player.
* **Parameters:** `targetPlayer` (`Entity`) — the player selected as the Deerclops target.
* **Returns:** Nothing.

### `DoWarningSound(targetPlayer)`
* **Description:** Spawns a `deerclopswarning_lvlX` prefab at the target player’s position based on time-to-attack. Warning level depends on how soon the Deerclops is expected (`4` = imminent).
* **Parameters:** `targetPlayer` (`Entity`) — the player selected as the Deerclops target.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Handles warning state progression: tracks time-to-attack, toggles `_warning` flag, and schedules warning sounds and speech at diminishing intervals as the spawn time approaches.
* **Parameters:** `dt` (number) — delta time in seconds since last frame.
* **Returns:** Nothing.
* **Error states:** Returns early and resets if `_activehassler` is present or timer is nil.

### `LongUpdate(dt)`
* **Description:** Alias for `OnUpdate`; required for component update scheduling.
* **Parameters:** `dt` (number) — delta time.
* **Returns:** Nothing.

### `SummonMonster(player)`
* **Description:** Forces Deerclops to spawn within 10 seconds, overriding normal timing. Used for debug or quest triggers.
* **Parameters:** `player` (`Entity`) — ignored; retained for API consistency.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a human-readable string describing current Deerclops state (e.g., waiting, warning, attacking).
* **Parameters:** None.
* **Returns:** `string` — formatted debug info.

## Events & listeners
- **Listens to:**
  - `ms_playerjoined` — adds player to `_activeplayers` and triggers attack checks.
  - `ms_playerleft` — removes player from `_activeplayers`; if leaving player is the current target, calls `TargetLost`.
  - `season` (world state) — triggers `TryStartAttacks` on season change.
  - `hasslerremoved` — resets `_activehassler` and re-evaluates attacks.
  - `hasslerkilled` — sets `_activehassler = nil`, increases next attack delay, and re-evaluates attacks.
  - `storehassler` — saves `deerclops` save record for reuse (prevents duplicate spawns).
  - `megaflare_detonated` — may trigger immediate attack based on RNG, range, and season.
- **Pushes:** None directly. Events are only consumed internally.

## Save/Load integration
- **`OnSave()`** — returns table with `_warning`, `_storedhassler`, and optionally `_activehassler.GUID`. Also returns list of entity GUIDs to persist.
- **`OnLoad(data)`** — restores `_warning` and `_storedhassler`; supports old `_timetoattack` field for backwards compatibility.
- **`LoadPostPass(newents, savedata)`** — resolves `_activehassler` reference after entity restoration.
