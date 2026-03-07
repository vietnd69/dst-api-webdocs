---
id: sharkboimanager
title: Sharkboimanager
description: Manages the Sharkboi arena lifecycle including creation, shrinking, boss spawning, and fishing interactions during ocean winter events.
tags: [arena, boss, fishing, winter, event]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 4308bdfc
system_scope: environment
---

# Sharkboimanager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Sharkboimanager` orchestrates the dynamic Sharkboi ocean arena event that occurs during winter in DST. It handles arena initialization, ice tile generation, boss spawning via fishing progression, arena size adjustment (shrinking/growing with season), and cleanup after boss defeat. It depends heavily on ocean fishing, physics, and world generation systems, and runs exclusively on the master simulation.

## Usage example
```lua
-- The component is added automatically to TheWorld.net in master mode.
-- It reacts to world events and seasons without manual invocation.
-- Modders may interact with its public methods:
if TheWorld and TheWorld.net and TheWorld.net.components.sharkboimanager then
    local manager = TheWorld.net.components.sharkboimanager
    if not manager.arena then
        manager:FindAndPlaceOceanArenaOverTime()
    end
end
```

## Dependencies & tags
**Components used:**  
`combat`, `follower`, `health`, `inventory`, `oceanfishable`, `oceanfishingrod`, `oceanicemanager`, `schoolspawner`, `sharkboimanagerhelper`  
**Tags:**  
Checks: `"boat"`, `"_combat"`, `"INLIMBO"`, `"notarget"`, `"noattack"`, `"flight"`, `"invisible"`, `"playerghost"`, `"epic"`, `"oceanfishing_catchable"`, `"fishinghook"`, `"partiallyhooked"`, `"FX"`.  
No tags added/removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Owner entity (typically `TheWorld.net`). |
| `arena` | `table?` | `nil` | Arena state object, populated during event. |
| `fishingplayertasks` | `table` | `{}` | Temp table mapping players to periodic fishing tasks. Not saved. |
| `defaultfishprefab` | `string` | `"oceanfish_medium_2"` | Default fish prefab used when school spawner fails. |
| `MAX_ARENA_SIZE` | `number` | `6 * TILE_SCALE` | Maximum arena radius in tile units. |
| `MIN_ARENA_SIZE` | `number` | `2.5 * TILE_SCALE` | Minimum arena radius in tile units. |
| `TILEOFFSET_CACHE` | `table` | — | Precomputed sorted list of radial tile offsets within `MAX_ARENA_SIZE`. |
| `STATES` | `table` | `{ UNDEFINED=0, CREATINGARENA=1, CREATEDARENA=2, BOSSSPAWNED=3, BOSSFIGHTING=4, CLEANUP=5 }` | Ordered arena state IDs. |

## Main functions
### `GetArenaStateString()`
* **Description:** Returns the name (string key) of the current arena state (e.g., `"CREATINGARENA"`). Returns `"UNDEFINED"` if `arena` is `nil` or state unknown.
* **Parameters:** None.
* **Returns:** `string`

### `ForEachTileInBetween(min_radius, max_radius, fn)`
* **Description:** Iterates over all cached tile positions within the radial band `[min_radius, max_radius]`, calling `fn(self, x, y, z)` for each valid tile. Exploits sorted offset cache for early termination.
* **Parameters:**  
  `min_radius` (number) – inner radius (inclusive).  
  `max_radius` (number) – outer radius (inclusive).  
  `fn` (function) – callback with signature `(self, x, y, z)`.  
* **Returns:** `nil`

### `FindWalkableOffsetInArena(sharkboi)`
* **Description:** Finds a walkable offset from arena center within the arena radius. If `sharkboi` is provided, verifies it is tracked in `arena.sharkbois`.
* **Parameters:**  
  `sharkboi` (`Entity?`) – optional Sharkboi entity to validate ownership.  
* **Returns:** `Vector3?` – world position or `nil` if no valid offset or arena missing.

### `SetArenaState(state)`
* **Description:** Advances arena to a higher state ID (e.g., `CREATINGARENA` → `CREATEDARENA`). Triggers associated logic (e.g., spawning boss, starting cleanup).
* **Parameters:**  
  `state` (number) – Target `STATES.*` constant. Must be greater than current state.  
* **Returns:** `nil`  
* **Error states:** `assert(oldstate < state)` – only allows state progression.

### `StartShrinking()` / `StopShrinking()`
* **Description:** Control arena radius reduction during gameplay phases (`BOSSFIGHTING` or `CLEANUP`). Shrinking proceeds via periodic task.
* **Parameters:** None.
* **Returns:** `nil`

### `DoShrink()`
* **Description:** Executes a single shrinking step: destroys ice tiles between current radius and desired radius, updates arena radius.
* **Parameters:** None.
* **Returns:** `nil`

### `StartCleanup()` / `StopCleanup()`
* **Description:** Begins or halts arena cleanup (destroys remaining ice tiles and entities).
* **Parameters:** None.
* **Returns:** `nil`

### `ForceCleanup()`
* **Description:** Immediately terminates arena: cancels timers, removes all ice and entities (fishing hole, sharkbois), and pushes `"ms_cleanedupsharkboiarena"` event.
* **Parameters:** None.
* **Returns:** `nil`

### `CooldownArena()`
* **Description:** Starts a cooldown timer based on `TUNING.SHARKBOI_ARENA_COOLDOWN_DAYS`; on completion, triggers full cleanup and resets arena.
* **Parameters:** None.
* **Returns:** `nil`

### `TryToMakeArenaBig()`
* **Description:** Expands arena to `MAX_ARENA_SIZE` in winter, if no players are nearby. Spawns ice tiles, breaks boats, spawns decorations and hazards.
* **Parameters:** None.
* **Returns:** `nil`

### `TryToMakeArenaSmall()`
* **Description:** Shrinks arena to `MIN_ARENA_SIZE` outside winter (e.g., season change).
* **Parameters:** None.
* **Returns:** `nil`

### `SpawnBoss()`
* **Description:** Spawns Sharkboi entities at the fishing hole, sets them aggroed to the last attacker, punts nearby entities, and transitions to `BOSSSPAWNED`.
* **Parameters:** None.
* **Returns:** `nil`

### `PlaceOceanArenaAtPosition(x, y, z)`
* **Description:** Creates a new arena instance centered at the provided world position, starts ice generation, schedules transition to `CREATEDARENA`.
* **Parameters:**  
  `x`, `y`, `z` (numbers) – arena center coordinates.  
* **Returns:** `boolean` – `true` if arena was created; `false` if arena already exists.

### `TryToPlaceOceanArena()`
* **Description:** Selects optimal ocean arena point (deepest first) and attempts to place arena.
* **Parameters:** None.
* **Returns:** `boolean` – `true` if arena placed successfully.

### `FindAndPlaceOceanArenaOverTime()`
* **Description:** Polls for ocean arena generation to complete before attempting placement. Recursively schedules itself if arena points not yet ready.
* **Parameters:** None.
* **Returns:** `nil`

### `OnSave()`
* **Description:** Serializes arena state (origin, state, radius, fish count, cooldown remaining, GUIDs for sharkbois and fishing hole).
* **Parameters:** None.
* **Returns:** `table, table?` – data table and list of entity GUIDs to persist.

### `OnLoad(data)`
* **Description:** Restores arena state from saved data. Handles missing or undefined states by queuing cleanup.
* **Parameters:**  
  `data` (`table?`) – Saved arena data from `OnSave()`.  
* **Returns:** `nil`

### `LoadPostPass(newents, savedata)`
* **Description:** Post-load resolver: re-attaches arena entities (sharkbois, fishing hole) via GUIDs, handles legacy save format (single `sharkboi` field), and moves entities in safe zone if needed.
* **Parameters:**  
  `newents` (`table`) – Mapping of GUID to `{ GUID, entity }`.  
  `savedata` (`table`) – Loaded arena data.  
* **Returns:** `nil`

### `GetDebugString()`
* **Description:** Returns a debug-ready status string including state, counts, cooldown, radius, and desired radius.
* **Parameters:** None.
* **Returns:** `string`

## Events & listeners
- **Listens to:**  
  `attacked` (on Sharkboi) – triggers arena state progression and aggro spread.  
  `onremove` (on Sharkboi, fishing hole) – handles cleanup upon entity removal.  
  `startfishinginvirtualocean` (on fishing hole) – starts player fishing tick.  
  `oceanfishing_stoppedfishing` (on player) – stops fishing tasks.  
  `fishcaught` (on player) – increments caught fish count and may spawn new bosses.  
  `worldmapsetsize` (on world) – triggers initial arena placement attempt.  
  `ms_cleanupticksharkboiarena` – internal cleanup tick (not listened, pushed).  
- **Pushes:**  
  `"ms_spawnedsharkboiarena"` – fired after arena creation.  
  `"ms_cleanedupsharkboiarena"` – fired after arena cleanup.  
  `"ms_cleanupticksharkboiarena"` – fired during periodic cleanup updates.
