---
id: wagpunk_manager
title: Wagpunk Manager
description: Manages the lifecycle of Wagstaff machinery spawns, hints, and fence generation in the Wagpunk minigame area.
tags: [boss, event, map, spawn, world]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 2b41a503
system_scope: world
---

# Wagpunk Manager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`WagpunkManager` orchestrates the spawning of Wagstaff machinery (e.g., `wagstaff_machinery`, `wagstaff_npc_wagpunk`, `wagstaff_mutations_note`) and adjacent environmental assets like fences within the Wagpunk arena. It runs exclusively on the master simulation and controls timed events: periodically spawning new machinery after a cooldown (`SpawnMachines`) and periodically spawning hint NPCs (`TryHinting`). It reacts to player presence, machine destruction, and world geometry (e.g., avoiding oceans and occupied tiles). It integrates with `wagboss_tracker` to disable hints after the boss is defeated and uses `knownlocations` to store reference points.

## Usage example
```lua
if TheWorld.ismastersim then
    local manager = TheWorld.components.wagpunk_manager
    if manager then
        manager:Enable()
        manager:DebugForceSpawnMachine()
    end
end
```

## Dependencies & tags
**Components used:** `forestdaywalkerspawner`, `knownlocations`, `shard_daywalkerspawner`, `timer`, `wagboss_tracker`
**Tags:** Checks `INLIMBO`, `NOBLOCK`, `FX` for obstacle clearance; adds no tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_enabled` | boolean | `nil` | Whether the manager is active and running timers. |
| `_updating` | boolean | `false` | Whether the component is registered for updates. |
| `machineGUIDS` | table | `{}` | Map of active machine GUIDs. |
| `_activeplayers` | table | `{}` | List of active player entities. |
| `hintcount` | number | `0` | Number of hints spawned so far. |
| `nexthinttime` | number or `nil` | `nil` | Time remaining until next hint spawn. |
| `nextspawntime` | number or `nil` | `nil` | Time remaining until next machinery spawn. |
| `_currentnodeindex` | number or `nil` | `nil` | Index of the last used topology node. |
| `machinemarker` | Entity or `nil` | `nil` | Reference to the `wagstaff_machinery_marker` entity. |
| `bigjunk` | Entity or `nil` | `nil` | Reference to the `junk_pile_big` entity. |
| `spawnedfences` | boolean or `nil` | `nil` | Whether fences have been generated for this arena. |
| `appliedfencerotationtransformation` | boolean | `false` | Whether fence rotation has been applied. |
| `fences` | table | (see source) | Array of fence placement offsets and rotations (relative to bigjunk). |

## Main functions
### `Enable()`
* **Description:** Enables the manager and starts the initial timer (either hint or spawn, depending on state saved during load).
* **Parameters:** None.
* **Returns:** Nothing.

### `Disable()`
* **Description:** Disables the manager, clears active timers, and resets state.
* **Parameters:** None.
* **Returns:** Nothing.

### `IsEnabled()`
* **Description:** Returns whether the manager is currently enabled.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `_enabled` is `true`, otherwise `false`.

### `StartSpawnMachinesTimer(timeoverride)`
* **Description:** Schedules the next machinery spawn (resets hint timer). Starts updates if not already active.
* **Parameters:** `timeoverride` (number, optional) — custom delay before next spawn. Defaults to `TUNING.WAGSTAFF_SPAWN_MACHINE_TIME + random variation`.
* **Returns:** Nothing.

### `StartHintTimer(timeoverride)`
* **Description:** Schedules the next hint spawn (resets spawn timer). Skips scheduling if wagboss is defeated.
* **Parameters:** `timeoverride` (number, optional) — custom delay before next hint.
* **Returns:** Nothing.

### `SpawnMachines(force)`
* **Description:** Spawns machinery at the next valid location, possibly placing fences and a mutations note.
* **Parameters:** `force` (boolean) — if `true`, spawns machines even if existing machines remain.
* **Returns:** Nothing.

### `TryHinting(debug)`
* **Description:** Spawns a hint `wagstaff_npc_wagpunk` NPC near an active player if conditions are met (valid spawn point, machine exists, not in arena).
* **Parameters:** `debug` (boolean) — if `true`, prints diagnostic info when placement fails.
* **Returns:** Nothing.

### `SpawnWagstaff(pos, machinepos)`
* **Description:** Spawns and configures a hint `wagstaff_npc_wagpunk` at `pos` and records `machinepos` via `knownlocations`.
* **Parameters:**  
  - `pos` (Vector3) — target spawn position.  
  - `machinepos` (Vector3) — position of the associated machine marker.
* **Returns:** Entity — the spawned `wagstaff_npc_wagpunk` prefab.

### `SpawnNote(machinepos)`
* **Description:** Spawns a `wagstaff_mutations_note` near the given position.
* **Parameters:** `machinepos` (Vector3) — center position to search around.
* **Returns:** Nothing.

### `PlaceMachinesAround(pos)`
* **Description:** Spawns `NUM_MACHINES_PER_SPAWN` (`3`) `wagstaff_machinery` entities around `pos` with randomized offsets.
* **Parameters:** `pos` (Vector3) — center position for the spawn group.
* **Returns:** Nothing.

### `FindSpotForMachines()`
* **Description:** Finds a suitable location for machinery spawn. Prioritizes the `machinemarker` location if valid (no player nearby and not controlled by werepig), otherwise searches topology nodes.
* **Parameters:** None.
* **Returns:** `pos` (Vector3 or `nil`), `shouldspawnfences` (boolean) — position and whether fences should be built at this location.

### `TryToSpawnFences()`
* **Description:** Generates fences (`fence_junk`) around the arena relative to `bigjunk` and `machinemarker`.
* **Parameters:** None.
* **Returns:** `true` if fences were built; `false` if `machinemarker` or `bigjunk` is missing.

### `IsPositionClearCenterPoint(pos)`
* **Description:** Checks if the position is free of obstacles and not near players.
* **Parameters:** `pos` (Vector3) — position to test.
* **Returns:** `boolean` — `true` if no entities with tags `INLIMBO`, `NOBLOCK`, `FX` are within `IS_CLEAR_CENTERPOINT_AREA_RADIUS` and no player is within `PLAYER_CAMERA_SEE_DISTANCE`.

### `IsPositionClearNote(pos)`
* **Description:** Checks for clearance around a note spawn point (radius `NOTE_OFFSET_RADIUS`).
* **Parameters:** `pos` (Vector3).
* **Returns:** `boolean`.

### `IsPositionClear(pos)`
* **Description:** Checks for clearance around a machinery spawn point (radius `IS_CLEAR_AREA_RADIUS`).
* **Parameters:** `pos` (Vector3).
* **Returns:** `boolean`.

### `GetDebugString()`
* **Description:** Returns a formatted status string for debugging.
* **Parameters:** None.
* **Returns:** `string`.

### `DebugForceSpawnMachine()`
* **Description:** Immediately spawns machinery regardless of cooldown.
* **Parameters:** None.
* **Returns:** Nothing.

### `DebugForceHint()`
* **Description:** Immediately spawns a hint, spawning machines first if none exist.
* **Parameters:** None.
* **Returns:** Nothing.

### `AddMachine(GUID)`
* **Description:** Registers a machine GUID as active.
* **Parameters:** `GUID` (string) — unique ID of the machine.
* **Returns:** Nothing.

### `RemoveMachine(GUID)`
* **Description:** Removes a machine GUID from the active list; triggers a spawn timer if no machines remain and manager is enabled.
* **Parameters:** `GUID` (string).
* **Returns:** Nothing.

### `MachineCount()`
* **Description:** Returns the number of active machines.
* **Parameters:** None.
* **Returns:** `number`.

### `AddPlayer(player)`
* **Description:** Adds a player to the active players list.
* **Parameters:** `player` (Entity).
* **Returns:** Nothing.

### `RemovePlayer(player)`
* **Description:** Removes a player from the active players list.
* **Parameters:** `player` (Entity).
* **Returns:** Nothing.

### `RegisterMachineMarker(inst)`
* **Description:** Stores the `wagstaff_machinery_marker` entity reference.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `RegisterBigJunk(inst)`
* **Description:** Stores the `junk_pile_big` entity reference.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `GetBigJunk()`
* **Description:** Returns the stored `bigjunk` entity reference.
* **Parameters:** None.
* **Returns:** Entity or `nil`.

### `OnUpdate(dt)`
* **Description:** Called each frame (via `StartUpdatingComponent`). Decrements timers and triggers spawns or hints.
* **Parameters:** `dt` (number) — delta time in seconds.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Returns serializable state for world save.
* **Parameters:** None.
* **Returns:** `table` with fields `nextspawntime`, `nexthinttime`, `hintcount`, `currentnodeindex`, `spawnedfences`.

### `OnLoad(data)`
* **Description:** Restores state from `data` during world load.
* **Parameters:** `data` (table).
* **Returns:** Nothing.

### `CheckToTryToSpawnFences()`
* **Description:** Ensures fences are built once per world after world creation or load.
* **Parameters:** None.
* **Returns:** Nothing.

### `ApplyFenceRotationTransformation_Internal(anglefromjunktomachine)`
* **Description:** Mutates the internal `fences` array to rotate fence placements based on the angle from `bigjunk` to `machinemarker`.
* **Parameters:** `anglefromjunktomachine` (number) — angle in degrees.
* **Returns:** Nothing.

### `IsWerepigInCharge(pos)`
* **Description:** Returns `true` if a werepig is controlling the arena (based on `forestdaywalkerspawner` and `shard_daywalkerspawner` state).
* **Parameters:** `pos` (Vector3) — ignored (check is global).
* **Returns:** `boolean`.

### `FindMachineSpawnPointOffset(pos)`
* **Description:** Finds a walkable offset around `pos` with increasing radius until a clear tile is found.
* **Parameters:** `pos` (Vector3).
* **Returns:** `Vector3` or `nil`.

## Events & listeners
- **Listens to:**
  - `wagstaff_machine_destroyed` (world) — calls `RemoveMachine`
  - `wagstaff_machine_added` (world) — calls `AddMachine`
  - `ms_playerjoined` (world) — calls `AddPlayer`
  - `ms_playerleft` (world) — calls `RemovePlayer`
  - `ms_register_wagstaff_machinery` (world) — calls `RegisterMachineMarker`
  - `ms_register_junk_pile_big` (world) — calls `RegisterBigJunk`
- **Pushes:** None (does not fire events).
