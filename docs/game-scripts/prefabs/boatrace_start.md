---
id: boatrace_start
title: Boatrace Start
description: Acts as the starting beacon for the Year of the Dragon boat race event, managing race initialization, checkpoint coordination, beacon tracking, and prize distribution.
tags: [event, race, interaction, lighting]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3cb875ee
system_scope: world
---

# Boatrace Start

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`boatrace_start` is the central entity for the Year of the Dragon (YOTD) boat race event. It functions as the race origin point: players activate it to begin the race, it coordinates the deployment and tracking of race checkpoints, monitors participant beacons (`boatrace_checkpoint_indicator`) for progress, and handles prize distribution upon race completion. It manages state transitions (e.g., fuse on/off, win, prize), integrates with the `yotd_raceprizemanager`, and supports both player-controlled and AI boats.

The entity is a server-authoritative structure with associated client-side visual effects (bobbers, flags, fireworks). It uses several components for proximity detection, loot dropping, timers, and updates via `updatelooper`.

## Usage example
```lua
-- Typically spawned automatically during world generation or via YOTD event setup
-- No direct usage required for most modders; interaction occurs via components and events

-- Example: Activate a boatrace_start instance programmatically
local start_point = SpawnPrefab("boatrace_start")
start_point.components.activatable.inactive = false
start_point.components.activatable:Activate(player_entity)
```

## Dependencies & tags
**Components used:** `activatable`, `boatrace_proximitychecker`, `deployhelper`, `lootdropper`, `talker`, `timer`, `updatelooper`, `walkableplatform`, `yotd_raceprizemanager`, `inspectable`, `highlightchild`.

**Tags added by `boatrace_start` entity:** `boatracecheckpoint`, `boatrace_proximitychecker`, `structure`.

**Tags used for filtering (e.g., proximity checks):** `boat`, `walkableplatform`, `dockjammer`, `FX`, `NOCLICK`, `NOBLOCK`, `CLASSIFIED`, `DECOR`, `NOBLOCK`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_checkpoints` | table | `nil` | Set of valid checkpoints (table keys) within proximity range of the start point or other checkpoints. |
| `_beacons` | table | `nil` | Set of active beacon entities (`boatrace_checkpoint_indicator`) currently within range and having players. |
| `prizes` | table | `{}` | List of prize configurations (`{total=number, target=entity/table, awarded=boolean}`) to award winners. |
| `flags` | table | `{}` | Array of spawned flag entities for top racers. |
| `race_places` | table | `nil` | Ordered list of beacons by finishing position. |
| `activator` | entity | `nil` | Entity that activated the race (e.g., player). |
| `indices` | table | Shuffled `1..8` | Pool of race positions (indices) used to assign flags/beacons. |
| `_checkpoints_spawned` | boolean | `nil` | Flag indicating automatic checkpoint generation has occurred. |
| `winid` | number | `nil` | Current winning position ID (1–3) for fireworks animation override. |
| `fuse_off_frame` | number | `nil` | Animation frame for resuming `fuse_off` animation after winning/prize. |

## Main functions
### `OnActivated(inst, doer)`
* **Description:** Called when the start point is activated (e.g., via hammering after fuse light). Begins race initialization: gathers nearby checkpoints, initializes beacon and prize lists, spawns automatic checkpoints if needed, starts the `updatelooper`, and transitions to the `fuse_on` state.
* **Parameters:**  
  `inst` (entity) — The `boatrace_start` instance.  
  `doer` (entity) — The entity performing the activation (typically a player).
* **Returns:** Nothing.
* **Error states:** Early return if no checkpoints are found (`ANNOUNCE_YOTD_NOCHECKPOINTS`), or if prize manager has no prizes available. Sets `activatable.inactive = true` on failure.

### `do_event_start(inst)`
* **Description:** Triggered when the fuse timer (`fuse_on`) completes. Enables the light, spawns a shadow boat (if beacon count is below threshold), creates spectator dragonlings, and starts the proximity check timer for beacons.
* **Parameters:**  
  `inst` (entity) — The `boatrace_start` instance.
* **Returns:** Nothing.
* **Error states:** Fails with `ANNOUNCE_YOTD_NOBOATS`/`ANNOUNCE_YOTD_NOTENOUGHBOATS` sound and resets if beacon count is `0` or shadow boat fails to spawn.

### `updateloop(inst)`
* **Description:** Periodic update function (via `updatelooper`) during race. Validates active beacons: removes those too far from start or lacking players, and adds new beacons if nearby player boats (with `walkableplatform` and no existing beacon) are detected.
* **Parameters:**  
  `inst` (entity) — The `boatrace_start` instance.
* **Returns:** Nothing.

### `OnBeaconAtStartpoint(inst, beacon)`
* **Description:** Handler for beacon events. Checks if a beacon has visited all checkpoints. If so, records it in `race_places` and awards prizes if available. Triggers win animation or prize distribution.
* **Parameters:**  
  `inst` (entity) — The `boatrace_start` instance.  
  `beacon` (entity) — The beacon (`boatrace_checkpoint_indicator`) that has completed the race.
* **Returns:** Nothing.

### `winOver(inst)`
* **Description:** Called after the `win` animation completes. Awards prizes to the top racers (based on `race_places`), spawns prize pouches (`redpouch_yotd`) as projectiles toward winners (or random positions for AI), and transitions to `prize` state.
* **Parameters:**  
  `inst` (entity) — The `boatrace_start` instance.
* **Returns:** Nothing.

### `prizeOver(inst)`
* **Description:** Called after the `prize` animation completes. Transitions to `fuse_off` or `idle_off`. Checks if all winners have been processed and triggers final race completion (`do_event_finish`) if so.
* **Parameters:**  
  `inst` (entity) — The `boatrace_start` instance.
* **Returns:** Nothing.

### `reset_boatrace(inst)`
* **Description:** Resets the race state: clears checkpoints, beacons, flags, race places, prize targets; releases beacons and checkpoints; restores light state; unpause hounded events; sets `activatable.inactive = true`; resets animation to `idle_off` or `reset`.
* **Parameters:**  
  `inst` (entity) — The `boatrace_start` instance.
* **Returns:** Nothing.

### `setflag(inst, position, id)`
* **Description:** Spawns and positions a flag entity for a top racer (`1`–`3`), updates visual effects (`winid`, animation override), and transitions to `win` state.
* **Parameters:**  
  `inst` (entity) — The `boatrace_start` instance.  
  `position` (number) — Flag position (`1`, `2`, or `3`).  
  `id` (number) — Visual ID (`1`–`8`) for flag variant.
* **Returns:** Nothing.

### `do_set_placing(inst, beacon)`
* **Description:** Records a beacon as having finished the race, adds it to `race_places`, and allocates prize targets if prizes remain.
* **Parameters:**  
  `inst` (entity) — The `boatrace_start` instance.  
  `beacon` (entity) — The finished beacon.
* **Returns:** Nothing.

### `getprizes(inst)`
* **Description:** Determines the loot list for a prize based on total checkpoints collected (`_checkpoints` size).
* **Parameters:**  
  `inst` (entity) — The `boatrace_start` instance.
* **Returns:** Table of loot prefabs:  
  `{"lucky_goldnugget"}` for ≤ 4 checkpoints,  
  `{"lucky_goldnugget", "lucky_goldnugget"}` for ≤ 12 checkpoints,  
  `{"lucky_goldnugget", "lucky_goldnugget", "lucky_goldnugget"}` otherwise.

### `GetCheckpoints(inst)`
* **Description:** Returns a shallow copy of the current `_checkpoints` set.
* **Parameters:**  
  `inst` (entity) — The `boatrace_start` instance.
* **Returns:** Table (shallow copy of `inst._checkpoints`).

### `GetBeacons(inst)`
* **Description:** Returns a shallow copy of the current `_beacons` set.
* **Parameters:**  
  `inst` (entity) — The `boatrace_start` instance.
* **Returns:** Table (shallow copy of `inst._beacons`).

### `CLIENT_CreateClientBobber(parent, do_deploy)`
* **Description:** Client-side helper to spawn a bobber (decorative visual ring around start point). Non-persistent and non-networked.
* **Parameters:**  
  `parent` (entity) — The `boatrace_start` instance.  
  `do_deploy` (boolean) — Whether the parent is deployed (affects animation).
* **Returns:** The newly created bobber entity.

### `CLIENT_UpdateReticuleStartRing(inst)`
* **Description:** Client-side check to validate whether the start point's bobber ring is in ocean tiles (reticle visibility).
* **Parameters:**  
  `inst` (entity) — The `boatrace_start` instance.
* **Returns:** Boolean — `true` if all bobbers are over ocean water.

## Events & listeners
- **Listens to:**
  - `onbuilt` (`OnBuilt`) — Initializes checkpoint setup timer.
  - `beacon_reached_checkpoint` (`OnCheckpointReached`) — Records checkpoint visit per beacon.
  - `timerdone` (`OnTimerDone`) — Handles automatic checkpoint spawning (via `"docheckpointsetup"` timer).
  - `loot_prefab_spawned` (`OnLootPrefabSpawned`) — Propagates `_checkpoints_spawned` state to dropped loot.
  - `yotd_ratraceprizechange` (function) — Updates `PRIZE` visual toggle based on prize availability.
  - `animover` (`Flag_AnimOverBehaviour`, etc.) — Cleans up flags and fireworks after animation.
  - `onremove` (function) — Removes entry from `_bobbers` and `_checkpoints` sets on removal of child/related entities.
  - `boatrace_start`, `boatrace_finish`, `boatrace_idle_disappear`, `boatrace_setindex` — Client-side coordination of beacon states.

- **Pushes:**
  - `unpausehounded`, `pausehounded` — To control hounded event timing.
  - `boatrace_start`, `boatrace_starttimerended`, `boatrace_finish`, `boatrace_idle_disappear`, `boatrace_setindex` — Beacon lifecycle events.
  - `entity_droploot` — On `lootdropper:DropLoot`.
  - `cheer` — To AI racers on shadow boat finish (if winner).
