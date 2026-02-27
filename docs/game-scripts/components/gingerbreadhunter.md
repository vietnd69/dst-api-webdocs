---
id: gingerbreadhunter
title: Gingerbreadhunter
description: Manages the spawning, tracking, and progression of gingerbread-themed hunts (gingerbread pigs and houses) triggered periodically based on player activity and day cycles in Don't Starve Together.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 079a08eb
---

# Gingerbreadhunter

## Overview
This component orchestrates the world-level "Gingerbread Hunt" event logic. It periodically spawns gingerbread pigs near players, generates crumb trails, and ultimately determines whether gingerbread houses or gingerbread wargs are spawned based on the number of completed hunts and luck rolls. It responds to player join/leave events, day cycles, and saves/loads state across sessions.

## Dependencies & Tags
- **Components used:** `health` (via `:Kill()`), `Transform` (for positioning)
- **Tags added/removed:** None explicitly assigned or stripped by this component.
- **World events listened to:** `ms_playerjoined`, `ms_playerleft`, `cycles`
- **Dependencies:** TUNING constants (`TOTAL_DAY_TIME`, `TRACK_ANGLE_DEVIANCE`), `TheWorld`, `AllPlayers`, `shallowcopy`, `FindWalkableOffset`, `IsAnyPlayerInRange`, `TryLuckRoll`, `SpawnPrefab`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `self` parameter | Reference to the owner entity (typically the world or a controller entity). |
| `hunt_count` | `number` | `0` | Number of completed crumb-trail hunts in the current cycle; resets after reaching `MAX_HUNT_COUNT`. |
| `crumb_pts` | `table` | `{}` | List of Vector3 positions representing points in the current crumb trail. |
| `activeplayers` | `table` | `{}` | List of all currently joined players (persistent while they're in the world). |
| `availableplayers` | `table` | `{}` | Subset of `activeplayers` eligible to be hunted in the current cycle. |
| `days` | `number` | `0` | Accumulated day count since the last hunt spawn; resets after `SPAWN_PERIOD`. |
| `newhunttask` | `DoTaskInTime` handle | `nil` | Delayed task used to schedule the next hunt within the current day. |

## Main Functions

### `OnIsDay()`
* **Description:** Increments the day counter and schedules a new hunt to begin at a random time within the remainder of the current day (if at least `SPAWN_PERIOD` days have passed).
* **Parameters:** None. Uses `inst` and internal state.

### `OnPlayerJoined(player)`
* **Description:** Adds the given player to both `activeplayers` and `availableplayers` lists (if not already present).
* **Parameters:** `player` — The `Player.prefab` entity instance.

### `OnPlayerLeft(player)`
* **Description:** Removes the given player from both `activeplayers` and `availableplayers` lists.
* **Parameters:** `player` — The `Player.prefab` entity instance.

### `StartNewHunt()`
* **Description:** Initiates a new hunt by selecting an available player, finding a spawn point ~45 units from them, and spawning a `gingerbreadpig` there. If all spawn attempts for all available players fail, the hunt is aborted, and players are re-added to the available pool.
* **Parameters:** None.

### `GenerateCrumbPoints(origin_pt, amount)`
* **Description:** Generates a sequence of `amount` crumb positions radiating outward from `origin_pt`, each up to `CRUMB_DISTANCE` away (using `GetSpawnPoint`). Returns `true` on success; `false` on failure after too many attempts.
* **Parameters:**  
  `origin_pt` — `Vector3` position of the crumb trail’s starting point.  
  `amount` — `number` of crumb points to generate.

### `SpawnCrumbTrail(killtime, player)`
* **Description:** Spawns the actual crumb trail and, upon reaching the final point, decides whether to spawn gingerbread houses or a gingerbread warg based on `hunt_count`, `MAX_HUNT_COUNT`, and `GINGERWARG_CHANCE`. Also spawns intermediate `crumbs` prefabs.
* **Parameters:**  
  `killtime` — `number`, time (in seconds) before a gingerbread pig (if spawned) expires.  
  `player` — `Player.prefab`, the hunt target, used for luck evaluation.

### `OnSave()`
* **Description:** Returns serializable data (`hunt_count`, `days`) and empty entity references (no prefabs saved directly).
* **Parameters:** None.

### `Load(data, ents)`
* **Description:** Restores `hunt_count` and `days` from saved data.
* **Parameters:**  
  `data` — `table` with keys `hunt_count` and `days`.  
  `ents` — Unused (empty in `OnSave`).

### `LoadPostPass(newents, savedata)`
* **Description:** Stub function, currently does nothing.

## Events & Listeners
- Listens to `"ms_playerjoined"` → calls `OnPlayerJoined(player)`
- Listens to `"ms_playerleft"` → calls `OnPlayerLeft(player)`
- Watches `"cycles"` world state → calls `OnIsDay()` on day transition