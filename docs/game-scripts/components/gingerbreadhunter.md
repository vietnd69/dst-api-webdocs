---
id: gingerbreadhunter
title: Gingerbreadhunter
description: Manages the spawning and progression of gingerbread-themed hunts during events, including generating crumb trails and spawning gingerbread pigs or houses.
tags: [combat, event, spawning]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 079a08eb
system_scope: world
---

# Gingerbreadhunter

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`GingerbreadHunter` is a world-scoped component responsible for orchestrating gingerbread-related event hunts in DST. It tracks active players, schedules hunt initiation based on in-game day cycles, spawns gingerbread pigs as prey, generates crumb trails leading to end targets (gingerbread houses or gingerbread wargs), and handles player availability across sessions. It relies on the `Health` component to terminate spawned entities after a timeout via `health:Kill()`.

## Usage example
```lua
inst:AddComponent("gingerbreadhunter")
-- The component automatically starts listening for players and day cycles.
-- It schedules hunts automatically after a configured number of days (SPAWN_PERIOD).
```

## Dependencies & tags
**Components used:** `health` — used to kill spawned gingerbread pigs and houses via `health:Kill()`.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Reference to the owning entity (typically `TheWorld`). |
| `hunt_count` | number | `0` | Number of hunt stages completed in the current hunt cycle. |
| `crumb_pts` | table | `{}` | List of Vector3 points where crumbs or the final target are placed. |
| `activeplayers` | table | `{}` | List of players currently in the world. |
| `availableplayers` | table | `{}` | Subset of `activeplayers` eligible to be hunted (removed after being selected). |
| `days` | number | `0` | Day counter used to schedule hunts. |
| `newhunttask` | `Task` | `nil` | Scheduled task to start a new hunt. |

## Main functions
### `OnIsDay()`
* **Description:** Increments the day counter; after `SPAWN_PERIOD` days, schedules a new hunt to begin at a random time within the current day cycle.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnPlayerJoined(player)`
* **Description:** Adds a player to both `activeplayers` and `availableplayers` lists if not already present.
* **Parameters:** `player` (Entity) — the joining player instance.
* **Returns:** Nothing.

### `OnPlayerLeft(player)`
* **Description:** Removes a player from `activeplayers` and `availableplayers` lists when they leave.
* **Parameters:** `player` (Entity) — the leaving player instance.
* **Returns:** Nothing.

### `StartNewHunt()`
* **Description:** Selects a random available player as the target, attempts up to `MAX_SPAWN_ATTEMPTS` times to find a valid spawn location at least `PLAYER_CHECK_DISTANCE + 5` away from all players, and spawns a gingerbread pig. If all attempts fail, the hunt is aborted and the player is re-added to `availableplayers` for retry later. If no players remain, resets `availableplayers` to all active players.
* **Parameters:** None.
* **Returns:** Nothing.

### `GenerateCrumbPoints(origin_pt, amount)`
* **Description:** Generates `amount` crumb trail points starting from `origin_pt`, ensuring each point is at least `PLAYER_CHECK_DISTANCE` away from any player. Updates internal `crumb_pts` list and increments `hunt_count`.
* **Parameters:** `origin_pt` (Vector3) — starting point; `amount` (number) — number of points to generate.
* **Returns:** `true` on success, `false` if unable to generate all points.
* **Error states:** Returns `false` if point generation exceeds `MAX_SPAWN_ATTEMPTS` per point.

### `SpawnCrumbTrail(killtime, player)`
* **Description:** Spawns the crumb trail entities (including final target) based on points stored in `crumb_pts`. On the last crumb point: if `hunt_count` exceeds `MAX_HUNT_COUNT`, spawns gingerbread houses or a gingerbread warg; otherwise spawns another gingerbread pig. Also sets `killtask` on gingerbread pigs to kill them after `killtime`.
* **Parameters:** `killtime` (number) — time in seconds before the final target/pig dies; `player` (Entity) — the hunted player (used for luck check).
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Serializes hunt state (e.g., `hunt_count`, `days`) for savegame persistence.
* **Parameters:** None.
* **Returns:** `data` (table) — key-value pairs of persistent state; `ents` (table) — entity references (currently unused, returns `{}`).

### `Load(data, ents)`
* **Description:** Restores hunt state from saved data (`hunt_count`, `days`) during world load.
* **Parameters:** `data` (table) — saved state; `ents` (table) — currently unused.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `ms_playerjoined` — calls `OnPlayerJoined(player)`.
- **Listens to:** `ms_playerleft` — calls `OnPlayerLeft(player)`.
- **Listens to:** `cycles` (world state) — calls `OnIsDay()` on each new day cycle.
- **Pushes:** None identified.
