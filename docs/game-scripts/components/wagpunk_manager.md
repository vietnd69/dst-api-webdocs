---
id: wagpunk_manager
title: Wagpunk Manager
description: Manages the lifecycle of Wagstaff machinery, hints, and spawning behavior in the Wagpunk arena, including fence generation, machine placement, and hint delivery logic.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 2b41a503
---

# Wagpunk Manager

## Overview
This component is responsible for orchestrating the dynamic spawning, hinting, and environmental setup of the Wagpunk gameplay sequence in *Don't Starve Together*. It tracks active players and spawned machines, manages timed events (hints and machine spawns), handles placement of Wagstaff NPCs and machinery, and constructs decorative fences around the arena based on relative positions of key set-piece entities. It runs exclusively on the master simulation and persists state across saves.

## Dependencies & Tags
- **Events Listened To:**  
  - `wagstaff_machine_destroyed`, `wagstaff_machine_added`, `ms_playerjoined`, `ms_playerleft` (on `self.inst`)  
  - `ms_register_wagstaff_machinery`, `ms_register_junk_pile_big` (on `TheWorld`)  
- **Components Required on Entity:** None directly added by this component; relies on the entity having a `wagboss_tracker` (for defeat detection) and `timer` (for event scheduling).  
- **Tags Used Internally:** `INLIMBO`, `NOBLOCK`, `FX` (as exclusion filters), `mutationsnote` (to check note presence), `wagstaff_npc`, `wagstaff_machine` (for range checks).  
- **Tags Added:** None directly.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (constructor arg) | The entity this component is attached to (typically `TheWorld`). |
| `_enabled` | `boolean` | `nil` | Whether the manager is active and scheduling events. Initialized as `nil`, becomes `true`/`false` after `Enable()`/`Disable()`. |
| `_updating` | `boolean` | `false` | Tracks if the component is currently being updated via `OnUpdate`. |
| `machineGUIDS` | `table` | `{}` | Set-like table mapping machine GUIDs to `true` to track spawned machinery. |
| `_activeplayers` | `table` | `{}` | List of active players currently in the world (for hint targeting). |
| `hintcount` | `number` | `0` | Number of hints (NPC spawns for hinting) given since last machine spawn batch. |
| `nexthinttime` | `number?` | `nil` | Remaining time (seconds) until the next hint spawn; `nil` during machine spawn phase. |
| `nextspawntime` | `number?` | `nil` | Remaining time until next machine batch spawn; `nil` during hint phase. |
| `_currentnodeindex` | `number?` | `nil` | Index of the last topology node used for machine placement, to avoid repetition. |
| `machinemarker` | `Entity?` | `nil` | Reference to the `wagstaff_machinery_marker` entity (set-piece anchor for fence alignment). |
| `bigjunk` | `Entity?` | `nil` | Reference to the `junk_pile_big` entity (set-piece anchor for fence alignment). |
| `appliedfencerotationtransformation` | `boolean?` | `nil` | Tracks whether fence rotation has been applied (set during fence generation). |
| `spawnedfences` | `boolean?` | `nil` | Flags whether fences have already been spawned (prevents duplicate fence generation). |

## Main Functions
### `Enable()`
* **Description:** Activates the manager, resuming scheduled events if times were saved, otherwise starting the machine spawn timer.
* **Parameters:** None.

### `Disable()`
* **Description:** Deactivates the manager, clearing timers and resetting hint/machine counters.
* **Parameters:** None.

### `IsEnabled()`
* **Description:** Returns whether the component is currently enabled.
* **Parameters:** None.

### `StartSpawnMachinesTimer(timeoverride)`
* **Description:** Starts the machine spawn countdown, overriding the next hint phase. Called when enabling or after machine spawns.
* **Parameters:**  
  `timeoverride` *(number, optional)* – Custom delay before next spawn. Defaults to `TUNING.WAGSTAFF_SPAWN_MACHINE_TIME` + random variation.

### `StartHintTimer(timeoverride)`
* **Description:** Starts the hint countdown, overriding the next spawn phase. Skips if Wagboss is defeated.
* **Parameters:**  
  `timeoverride` *(number, optional)* – Custom delay. Defaults to interpolated value based on hint count.

### `AddMachine(GUID)`
* **Description:** Records a newly spawned machine in `machineGUIDS`.
* **Parameters:**  
  `GUID` *(string)* – GUID of the spawned machine entity.

### `RemoveMachine(GUID)`
* **Description:** Removes a destroyed machine from tracking; if no machines remain, triggers a machine spawn timer.
* **Parameters:**  
  `GUID` *(string)* – GUID of the destroyed machine.

### `AddPlayer(player)`
* **Description:** Adds a player to the active player list for hint targeting.
* **Parameters:**  
  `player` *(Entity)* – Player entity.

### `RemovePlayer(player)`
* **Description:** Removes a player from the active player list.
* **Parameters:**  
  `player` *(Entity)* – Player entity.

### `MachineCount()`
* **Description:** Returns the number of currently active machines.
* **Parameters:** None.

### `FindSpotForMachines()`
* **Description:** Finds a suitable world position for spawning a new machine batch, preferring the `machinemarker` location (if no player is nearby and no Werepig in charge) or falling back to a random valid topology node distant from the last node.
* **Parameters:** None.  
* **Returns:**  
  `pos` *(Vector3)* – World position for machine placement.  
  `shouldspawnfences` *(boolean)* – Whether to generate fences at this location.

### `SpawnMachines(force)`
* **Description:** Spawns a batch of `NUM_MACHINES_PER_SPAWN` machines and optionally a mutations note at the chosen location. Resets hint count and schedules hints after spawning.
* **Parameters:**  
  `force` *(boolean)* – If `true`, spawns even if machines already exist.

### `TryHinting(debug)`
* **Description:** Spawns a Wagstaff NPC at a random location near a random player to indicate where a machine is. May schedule a future hint if placement fails.
* **Parameters:**  
  `debug` *(boolean)* – Enables debug console output.

### `SpawnWagstaff(pos, machinepos)`
* **Description:** Spawns and configures a `wagstaff_npc_wagpunk` hint NPC with appropriate timers and memory of the machine position.
* **Parameters:**  
  `pos` *(Vector3)* – Position to spawn the NPC.  
  `machinepos` *(Vector3)* – Position to remember as the target machine location.

### `SpawnNote(machinepos)`
* **Description:** Spawns a `wagstaff_mutations_note` at a random offset from `machinepos` if no note already exists.
* **Parameters:**  
  `machinepos` *(Vector3)* – Center position to spawn near.

### `MutationsNoteExist(machinepos)`
* **Description:** Checks if any `wagstaff_mutations_note` exists in the world.
* **Parameters:**  
  `machinepos` *(Vector3)* – Not used; included for signature consistency but ignored.

### `PlaceMachinesAround(pos)`
* **Description:** Spawns `NUM_MACHINES_PER_SPAWN` `wagstaff_machinery` entities in a ring around `pos`.
* **Parameters:**  
  `pos` *(Vector3)* – Center position for the machine ring.

### `TryToSpawnFences()`
* **Description:** Spawns decorative `fence_junk` entities in a ring around the arena, using precomputed relative positions transformed based on the angle between `bigjunk` and `machinemarker`.
* **Parameters:** None.  
* **Returns:** `true` if fences were attempted, `false` if missing anchors.

### `ApplyFenceRotationTransformation_Internal(anglefromjunktomachine)`
* **Description:** Mutates the static `fences` table in-place to rotate/flip fence offsets based on the angle from `bigjunk` to `machinemarker`.
* **Parameters:**  
  `anglefromjunktomachine` *(number)* – Angle (in degrees) from junk pile to machine marker.

### `IsWerepigInCharge(pos)`
* **Description:** Checks if a Werepig is currently controlling the area (i.e., in the Forest Daywalker Spawner context).
* **Parameters:**  
  `pos` *(Vector3)* – Position to check (only used for early-exit when `bigjunk` missing).

### `GetDebugString()`
* **Description:** Returns a formatted debug string with current state, timers, hint count, and machine count.
* **Parameters:** None.

### `DebugForceSpawnMachine()`
* **Description:** Immediately spawns a machine batch, bypassing timers.
* **Parameters:** None.

### `DebugForceHint()`
* **Description:** Forces a hint spawn; auto-spawns machines if none exist.
* **Parameters:** None.

## Events & Listeners
- **Listens To:**  
  - `self.inst`: `"wagstaff_machine_destroyed"` → calls `RemoveMachine(GUID)`  
  - `self.inst`: `"wagstaff_machine_added"` → calls `AddMachine(GUID)`  
  - `self.inst`: `"ms_playerjoined"` → calls `AddPlayer(player)`  
  - `self.inst`: `"ms_playerleft"` → calls `RemovePlayer(player)`  
  - `TheWorld`: `"ms_register_wagstaff_machinery"` → calls `RegisterMachineMarker(ent)`  
  - `TheWorld`: `"ms_register_junk_pile_big"` → calls `RegisterBigJunk(ent)`  
- **Pushes:** None (does not trigger custom events).