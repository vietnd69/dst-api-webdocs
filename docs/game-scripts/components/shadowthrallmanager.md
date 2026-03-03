---
id: shadowthrallmanager
title: Shadowthrallmanager
description: Manages the lifecycle of shadow fissures and their associated thralls during nightmare events, including spawning, tracking, and releasing fissures and their thralls.
tags: [combat, boss, ai, event, world]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 62bbd71e
system_scope: world
---

# Shadowthrallmanager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Shadowthrallmanager` is a master-only component responsible for orchestrating nightmare event phases centered around a controlled fissure and three shadow thralls (hands, horns, wings or mouth variants). It manages fissure selection, thrall spawning and tracking, miasma generation, and cooldown handling. It interacts closely with the `riftspawner`, `riftthralltype`, `entitytracker`, and `workable` components, and depends on the world being in `mastersim` mode.

## Usage example
```lua
-- Typically attached automatically to TheWorld during nightmare events.
-- Manual usage is not intended for modders.
local fissure = SpawnPrefab("fissure")
fissure.Transform:SetPosition(x, y, z)
fissure:MakeTempFissure()
TheWorld.components.shadowthrallmanager:ControlFissure(fissure)
```

## Dependencies & tags
**Components used:** `areaaware`, `combat`, `entitytracker`, `health`, `knownlocations`, `lootdropper`, `riftspawner`, `riftthralltype`, `workable`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `thralltype` | string or nil | `nil` | Type of thralls currently spawned (`THRALL_TYPES.SHADOW.TRIO` or `THRALL_TYPES.SHADOW.MOUTH`). Set on rift pool event. |

## Main functions
### `IsGoodFissureLocation(pt)`
*   **Description:** Validates whether a world point is a suitable fissure location (above ground, no blocking structures within radius).
*   **Parameters:** `pt` (`Vector3`) — the candidate position.
*   **Returns:** `boolean` — `true` if suitable; otherwise `false`.

### `FindGoodFissureLocation()`
*   **Description:** Attempts to find a suitable fissure spawn location near players currently in a "Nightmare" tag area.
*   **Parameters:** None.
*   **Returns:** `number, number, number` — x, y, z coordinates if found; otherwise `nil, nil, nil`.

### `StartFindingGoodFissures()`
*   **Description:** Begins a periodic task to locate and claim a fissure from the world pool or spawn a new one if configured.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `StopFindingGoodFissures()`
*   **Description:** Cancels the fissure-finding periodic task.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ControlFissure(fissure)`
*   **Description:** Registers a fissure as the currently controlled one, marking its phase as "controlled".
*   **Parameters:** `fissure` (`Inst`) — the fissure entity to control.
*   **Returns:** Nothing.

### `GetControlledFissure()`
*   **Description:** Returns the currently controlled fissure, if any.
*   **Parameters:** None.
*   **Returns:** `Inst` or `nil` — the controlled fissure entity.

### `OnSpawnThralls()`
*   **Description:** Spawns three thralls near the controlled fissure for the current thrall type, and starts event listeners on them.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SpawnThrallFromPoint(prefabname, x, z, angle, delay)`
*   **Description:** Spawns a single thrall at a position calculated with walkable offset and rotation.
*   **Parameters:**
    *   `prefabname` (`string`) — the thrall prefab to spawn.
    *   `x`, `z` (`number`) — base coordinates.
    *   `angle` (`number`) — orientation in degrees.
    *   `delay` (`number`) — state delay before entering "spawndelay".
*   **Returns:** `Inst` — the spawned thrall entity.

### `KillThrall(thrall)`
*   **Description:** Rapidly kills a thrall by setting its health to 0% and clearing loot tables.
*   **Parameters:** `thrall` (`Inst`) — the thrall to kill.
*   **Returns:** Nothing.

### `ReleaseFissure(cooldown)`
*   **Description:** Releases control of the fissure, kills all thralls, clears miasmas, and sets a cooldown before a new fissure can be controlled.
*   **Parameters:** `cooldown` (`number?`) — override cooldown duration in seconds (defaults to `5` if `nil` or negative).
*   **Returns:** Nothing.

### `OnFissureAnimationsFinished(fissure)`
*   **Description:** Called when the fissure's opening animation sequence completes. Spawns miasma clouds and schedules thrall spawns.
*   **Parameters:** `fissure` (`Inst`) — the fissure that finished animating.
*   **Returns:** Nothing.

### `OnFissureMinedFinished(fissure)`
*   **Description:** Resets dreadstone regen task when fissure mining completes (if not already running).
*   **Parameters:** `fissure` (`Inst`) — the fissure that was mined.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Serializes the component’s state for saving, including fissure GUID, thrall GUIDs, miasmas, and active task timers.
*   **Parameters:** None.
*   **Returns:** `table, table` — data table (cooldowns, GUIDs) and entities list (GUIDs to persist).

### `OnLoad(data)`
*   **Description:** Loads serialized state; restores cooldowns and pending tasks.
*   **Parameters:** `data` (`table?`) — the saved data table.
*   **Returns:** Nothing.

### `LoadPostPass(newents, savedata)`
*   **Description:** Post-load resolver: reassigns entities by GUID and re-registers listeners.
*   **Parameters:**
    *   `newents` (`table`) — map of GUID → entity table.
    *   `savedata` (`table`) — the original `data` from `OnSave`.
*   **Returns:** Nothing.

### `CheckForNoThralls()`
*   **Description:** Triggers fissure release if all thralls are gone.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetThrallCount()`
*   **Description:** Returns the number of active thralls (0–3).
*   **Parameters:** None.
*   **Returns:** `number` — current thrall count.

### `GetDebugString()`
*   **Description:** Returns a debug string summarizing internal state for debug UI.
*   **Parameters:** None.
*   **Returns:** `string` — formatted status string.

## Events & listeners
- **Listens to:**  
    - `ms_riftaddedtopool` — triggers fissure detection when a compatible rift is added.  
    - `ms_riftremovedfrompool` — cancels fissure tracking if rift pool empties.  
    - `onremove` (on thralls) — decrements thrall count and checks for fissure release.  
    - `isnightmarewild` — watches world state (currently unused).  
- **Pushes:** None.
