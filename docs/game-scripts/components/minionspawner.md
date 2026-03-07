---
id: minionspawner
title: Minionspawner
description: Spawns and manages groups of minion entities around a central spawner entity, tracking their positions, lifecycle, and synchronization across network sessions.
tags: [minion, spawner, network, ai]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 78ac6ef9
system_scope: entity
---

# Minionspawner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Minionspawner` manages a dynamic group of minion entities that spawn around the owning entity in a radial pattern. It handles minion lifecycle (creation, ownership, death, removal), position assignment using a fixed spatial grid, and state persistence across network sessions. The component is designed primarily for boss or controlled entities that summon units (e.g., `eyeplant`). It tracks minions in a table, maintains a list of available spawn positions (`freepositions`), and coordinates timed spawning via DST’s task system. It does not perform AI decisions itself but acts as a manager and event dispatcher.

**Note:** The code includes inline warnings that this component is outdated and should not be used as a reference for new development.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("minionspawner")

inst.components.minionspawner.miniontype = "eyeplant"
inst.components.minionspawner.maxminions = 5
inst.components.minionspawner.minionspawntime = { min = 8, max = 12 }

-- Optionally set callbacks for spawn/loss/attack events
inst.components.minionspawner.onspawnminionfn = function(spawner, minion) print("Spawned:", minion) end
inst.components.minionspawner.onlostminionfn = function(spawner) print("Lost a minion") end

-- Triggers the first spawn after an internal delay
-- Subsequent spawns happen automatically until maxed or stopped
```

## Dependencies & tags
**Components used:** `health` (via `minion.components.health:IsDead()` and `Kill()`)
**Tags:** None added, removed, or directly checked by this component itself (though it may interact with tags on minions like `"eyeplant"` during spawn validation).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | Entity instance | *(injected)* | Entity that owns this component. |
| `miniontype` | string | `"eyeplant"` | Prefab name to spawn for minions. |
| `maxminions` | number | `27` | Maximum number of active minions allowed. |
| `minionspawntime` | table | `{ min = 5, max = 10 }` | Table specifying min/max delay (seconds) between spawns. |
| `minions` | table | `{}` | Map of `minion → minion` tracking currently owned minions. |
| `numminions` | number | `0` | Count of active minions. |
| `distancemodifier` | number | `11` | Factor used in radial position calculation. |
| `onspawnminionfn` | function | `nil` | Callback fired when a minion is successfully spawned: `(spawner_inst, minion)`. |
| `onlostminionfn` | function | `nil` | Callback fired when a minion is lost (died or removed). |
| `onminionattacked` | function | `nil` | Callback fired when any minion is attacked: `(spawner_inst)`. |
| `onminionattack` | function | `nil` | Callback fired when any minion attacks: `(spawner_inst)`. |
| `spawninprogress` | boolean | `false` | Whether a spawn task is currently scheduled. |
| `nextspawninfo` | table | `{}` | Holds `{ start = time, time = delay }` for current spawn timer. |
| `shouldspawn` | boolean | `true` | Controls whether automatic spawning is enabled. |
| `minionpositions` | table | `nil` | Cached array of `Vector3` positions for minion slots. |
| `validtiletypes` | table | `DEFAULT_VALID_TILE_TYPES` | Set of valid tile types where minions may spawn. |
| `freepositions` | table | `[1..max]` (generated) | List of available slot numbers (1-based), used for assigning minion IDs. |

## Main functions
### `GetDebugString()`
*   **Description:** Returns a formatted string for debugging the current spawner state, including minion count, spawn status, time until next spawn, and spawn toggle.
*   **Parameters:** None.
*   **Returns:** `string` — Human-readable debug info.

### `RemovePosition(num)`
*   **Description:** Removes a specific position number (`num`) from the `freepositions` list.
*   **Parameters:** `num` (number) — Position index to remove.
*   **Returns:** Nothing.
*   **Error states:** No effect if `num` is not in `freepositions`.

### `AddPosition(num, tbl)`
*   **Description:** Inserts `num` into the given position list (`tbl`, defaults to `freepositions`) in sorted order, avoiding duplicates.
*   **Parameters:**  
    `num` (number) — Position index to add.  
    `tbl` (table, optional) — List to insert into (defaults to `freepositions`).
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Serializes the current spawner state for network/persistence use. Includes minion GUIDs and numbers, max minion count, cached spawn positions, and remaining spawn time if a spawn is pending.
*   **Parameters:** None.
*   **Returns:**  
    `data` (table) — Map containing:  
    `minions` (array of `{ GUID, NUMBER }`) — List of owned minions.  
    `maxminions` (number) — Current max minion limit.  
    `minionpositions` (array of `{ x, z }`) — Serialized positions.  
    `spawninprogress`, `timeuntilspawn` (if applicable).  
    `guidtable` (array of GUID strings) — List of minion GUIDs.

### `OnLoad(data)`
*   **Description:** Restores spawner state from serialized `data`. Applies `maxminions`, `minionpositions`, and resumes a pending spawn if indicated.
*   **Parameters:** `data` (table) — Data from `OnSave()`.
*   **Returns:** Nothing.

### `LoadPostPass(newents, savedata)`
*   **Description:** Called after entities are created in a load session. Reconnects minion instances to this spawner using saved GUIDs, assigns minion positions and restores ownership.

*   **Parameters:**  
    `newents` (table) — Map of GUID → entity instance (post-load).  
    `savedata` (table) — Loaded save data (same as passed to `OnLoad()`).
*   **Returns:** Nothing.

### `TakeOwnership(minion)`
*   **Description:** Registers a minion entity as owned by this spawner, increments `numminions`, assigns a `minionnumber` if missing, and sets up event listeners for death/attack/loss.
*   **Parameters:** `minion` (Entity instance) — Minion to claim.
*   **Returns:** Nothing.
*   **Error states:** No effect if minion is already owned (i.e., present in `self.minions`).

### `OnLostMinion(minion)`
*   **Description:** Handles cleanup when a minion is lost (died or removed). Recycles its position into `freepositions` after 3 seconds, removes listeners, decrements count, and may trigger a new spawn if allowed.
*   **Parameters:** `minion` (Entity instance) — The lost minion.
*   **Returns:** Nothing.
*   **Error states:** No effect if minion is not tracked by this spawner.

### `MakeMinion()`
*   **Description:** Spawns a new minion prefab if not at max capacity.
*   **Parameters:** None.
*   **Returns:** `minion` (Entity instance or `nil`) — The new minion, or `nil` if `miniontype` is `nil` or `MaxedMinions()` returns `true`.

### `CheckTileCompatibility(tile)`
*   **Description:** Checks whether the given `tile` type is allowed for minion spawning.
*   **Parameters:** `tile` (number/string, WORLD_TILES constant) — Tile type to check.
*   **Returns:** `boolean` — `true` if `self.validtiletypes[tile]` exists and is `true`.

### `MakeSpawnLocations()`
*   **Description:** Computes a radial pattern of valid spawn positions around the spawner, using physics, tile, and entity-density checks. Updates `minionpositions` and regenerates `freepositions` based on valid positions found.
*   **Parameters:** None.
*   **Returns:** `positions` (table or `nil`) — Array of `Vector3` positions, or `nil` if no valid positions were found. May also reduce `self.maxminions` if fewer positions are viable.

### `GetSpawnLocation(num)`
*   **Description:** Returns the precomputed spawn `Vector3` for slot `num`, if valid and tile-compatible.
*   **Parameters:** `num` (number) — Slot index (1-based).
*   **Returns:** `Vector3` or `nil`.

### `GetNextSpawnTime()`
*   **Description:** Returns a random delay based on `minionspawntime.min` and `minionspawntime.max`.
*   **Parameters:** None.
*   **Returns:** `number` — Random delay in seconds.

### `KillAllMinions()`
*   **Description:** Immediately kills all currently owned minions after a small random delay. Cancels pending spawn tasks.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SpawnNewMinion()`
*   **Description:** Attempts to spawn a single minion: reserves a free position, places the minion, registers ownership, sets state to `"spawn"`, and may start the next spawn.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Silently exits if spawn is not enabled (`shouldspawn`), at max minions, or position unavailable.

### `MaxedMinions()`
*   **Description:** Checks if the current minion count has reached `maxminions`.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if `numminions >= maxminions`.

### `SetSpawnInfo(time)`
*   **Description:** Records the current spawn timing data and returns the assigned delay.
*   **Parameters:** `time` (number) — Delay (seconds) for the spawn.
*   **Returns:** `time` (number) — The same input `time`.

### `StartNextSpawn()`
*   **Description:** Schedules the next minion spawn task if spawning is enabled and not already in progress.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ResumeSpawn(time)`
*   **Description:** Resumes a pending spawn task (used during save/load). Schedules a spawn after `time` seconds.
*   **Parameters:** `time` (number) — Time remaining until spawn.
*   **Returns:** Nothing.

### `LongUpdate(dt)`
*   **Description:** Handles elapsed time for long network pauses or fast-forward (e.g., fast travel). Cancels existing spawn task and spawns minions for each missed interval.
*   **Parameters:** `dt` (number) — Time delta (seconds) to process.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `attacked` (on minions) — Triggers `self.onminionattacked` if set.  
  `onattackother` (on minions) — Triggers `self.onminionattack` if set.  
  `death` (on minions) — Calls `OnLostMinion` after pushing `"attacked"` on the minion.  
  `onremove` (on minions) — Calls `OnLostMinion`.  
- **Pushes:**  
  `minionchange` — Fired whenever minion ownership changes (added or removed).
