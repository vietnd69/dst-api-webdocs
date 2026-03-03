---
id: wagpunk_arena_manager
title: Wagpunk Arena Manager
description: Manages the progression, entity spawning, and state transitions for the Wagpunk Arena minigame sequence.
tags: [arena, boss, quest, event]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 23162cc5
system_scope: world
---
# Wagpunk Arena Manager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`wagpunk_arena_manager` is a world-scoped component responsible for orchestrating the Wagpunk Arena minigame—a multi-stage event involving quest progression, Wagstaff NPC interactions, arena construction, and a boss fight with the Wagboss robot. It manages entity placement (floors, markers, walls, drones, boss), tracks state transitions, handles player entrapping during the boss fight (including lunacy effects), and persists state across saves. It relies on dynamic angle calculations from static layout landmarks to position arena elements consistently.

## Usage example
```lua
-- Automatically added to TheWorld via worldgen/tasksets when Wagpunk Arena is enabled.
-- No manual instantiation needed. Key usage includes:
if TheWorld.components.wagpunk_arena_manager then
    -- Check current stage
    local state_str = TheWorld.components.wagpunk_arena_manager:GetStateString()
    -- Debug force completion of current stage
    TheWorld.components.wagpunk_arena_manager:DebugSkipState()
end
```

## Dependencies & tags
**Components used:**  
`constructionsite`, `craftingstation`, `friendlevels`, `health`, `hermitcrab_relocation_manager`, `inventory`, `inventoryitem`, `lunaralterguardianspawner`, `maprecorder`, `npc_talker`, `playerprox`, `sanity`, `talker`, `wagboss_tracker`, `wagpunk_floor_helper`, `winchtarget`

**Tags:** None added/removed by this component (uses existing tags for checks, e.g., `mapscroll`, `gestalt_cage_filled`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `state` | number (see `STATES`) | `nil` (initialized to `SPARKARK`) | Current minigame stage. |
| `ARENA_ENTITIES` | table | Static table of prefabs and local offsets | Entity templates used to spawn arena fixtures. |
| `TILESPOTS` | table | Hardcoded list of `{x, z, rot}` triplets | Tile locations for floor placement. |
| `WALLSPOTS` | table | Copied and transformed `WAGPUNK_ARENA_COLLISION_DATA` | Cage wall locations with orientation. |
| `storedx_pearl`, `storedz_pearl` | number | `nil` | World tile-center coordinates for Pearl’s static layout origin. |
| `storedangle_pearl` | number | `nil` | Calculated angle between `hermitcrab_marker` and `beebox_hermit`. |
| `storedx_monkey`, `storedz_monkey` | number | `nil` | World tile-center coordinates for Monkey Island’s static layout origin. |
| `storedangle_monkey` | number | `nil` | Calculated angle between `monkeyqueen` and `monkeyportal`. |
| `appliedrotationtransformation` | boolean | `false` | Flag indicating all coordinates have been rotated/oriented. |
| `cagewalls` | table | `nil` | Map of active cage wall entities. |
| `wagdrones` | table | `{}` | Map of tracked drone entities. |
| `playersdata` | table | `nil` | Tracks active players in arena (alive count, disconnected KUs). |

## Main functions
### `:GetStateString()`
* **Description:** Returns a string key (e.g., `"CONSTRUCT"`) corresponding to the current numeric `state`. Used for display, serialization, and logging.
* **Parameters:** None.
* **Returns:** `string` — state name, defaults to `"SPARKARK"` if `state` is `nil`.
* **Error states:** None.

### `:SetState(state)`
* **Description:** Sets the current minigame state and syncs it to the networked `wagpunk_floor_helper.barrier_active` flag.
* **Parameters:** `state` (number) — A value from `self.STATES`.
* **Returns:** Nothing.

### `:CheckStateForChanges()`
* **Description:** Drives state transitions by repeatedly calling `CheckStateForChanges_Internal` until no more transitions occur. Called automatically when quest triggers fire or flags are set.
* **Parameters:** None.
* **Returns:** Nothing.

### `:QueueCheck()`
* **Description:** Schedules a `CheckStateForChanges()` call with `DoTaskInTime(0)` to process pending state transitions after current updates. De-duplicates pending checks via `self.checktask`.
* **Parameters:** None.
* **Returns:** Nothing.

### `:TryToSpawnWagstaff()`
* **Description:** Spawns `wagstaff_npc_wagpunk_arena` if none exists and Wagboss is not defeated. Tracks the instance.
* **Parameters:** None.
* **Returns:** `Entity?` — the spawned Wagstaff or `nil` if one already exists or conditionally blocked.

### `:CheckTurfCompletion()`
* **Description:** Verifies that all `TILESPOTS` are covered by `WAGSTAFF_FLOOR` tiles. If complete, fires `:TurfCompleted()` and triggers a state check.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if the turf was just completed.

### `:CheckConstructCompleted()`
* **Description:** Verifies that all drone spots are occupied and the Wagboss is socketed. If complete, fires `:ConstructCompleted()` and triggers a state check.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if construction was just completed.

### `:WorkstationToggled(workstation, on)`
* **Description:** Handles toggling of the workstation. Spawns/respawns Wagstaff with appropriate state-dependent dialogue and positioning depending on the current arena stage. Only responds to events from `self.workstation`.
* **Parameters:**  
  `workstation` (Entity) — the workstation instance.  
  `on` (boolean) — whether the workstation was turned on.
* **Returns:** Nothing.

### `:LeverToggled(lever, on)`
* **Description:** Handles lever toggle events. Only responds to events from `self.lever`. Manages Wagstaff location and state transitions upon lever pull.
* **Parameters:**  
  `lever` (Entity) — the lever instance.  
  `on` (boolean) — whether the lever was pulled.
* **Returns:** Nothing.

### `:SpawnCageWalls()`
* **Description:** Spawns cage walls at `WALLSPOTS` coordinates using the calculated Pearl-origin and rotation.
* **Parameters:** None.
* **Returns:** Nothing.

### `:TryToSpawnArenaEntities(prefab, validspotfn, postinitfn)`
* **Description:** Spawns one or zero instances of a given arena prefab (e.g., `wagpunk_lever`, `wagboss_robot`) if not already present. Uses `validspotfn` to verify placement validity.
* **Parameters:**  
  `prefab` (string) — prefab name.  
  `validspotfn(x, z, r)` (function) — optional validation function.  
  `postinitfn(ent)` (function) — optional post-spawn hook.
* **Returns:** `{Entity} | nil` — table of spawned entities or `nil` if prefab already present or none placed.

### `:LockPlayersIn()`
* **Description:** Initializes player tracking for the boss fight. Enables lunacy for players in the arena, sets up event callbacks, and begins periodic updates.
* **Parameters:** None.
* **Returns:** Nothing.

### `:UnlockPlayers()`
* **Description:** Clears player tracking, disables lunacy, cancels updates, and fires `ms_wagpunk_barrier_playerleft` events.
* **Parameters:** None.
* **Returns:** Nothing.

### `:StartLunacy()` / `:StopLunacy()`
* **Description:** Toggles lunacy for all tracked players via `sanity:EnableLunacy()`.
* **Parameters:** None.
* **Returns:** Nothing.

### `:OnUpdate(dt)`
* **Description:** Periodic tick (every `1` second) that dynamically updates player arena membership based on position and arena bounds, rebalancing the alive count as players enter/exit.
* **Parameters:** `dt` (number) — time since last update.
* **Returns:** Nothing.

### `:DoWagstaffOneshotAtXZ(x, z, radiusopt, lines, oneline, postinitfn)`
* **Description:** Spawns or uses an existing Wagstaff to deliver a one-shot dialogue line at a specified location and orientation, often used for scripted monologues.
* **Parameters:**  
  `x, z` (numbers) — world coordinates.  
  `radiusopt` (number) — stopping distance radius.  
  `lines` (string) — STRINGS path key.  
  `oneline` (boolean) — whether to pick one random index.  
  `postinitfn(wagstaff)` (function) — optional callback after Wagstaff is ready.
* **Returns:** Nothing.

### `:DebugSkipState()`
* **Description:** Development helper that advances the arena to the next state by completing current objectives (e.g., forcing Pearl upgrade, filling tiles, socketing boss). Used for testing.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `ms_register_hermitcrab_marker`, `ms_register_beebox_hermit`, `ms_register_hermitcrab`, `ms_register_pearl_entity`, `ms_register_monkeyisland_portal`, `ms_register_monkeyqueen`, `ms_register_wagpunk_arena_lunacycreator`
  - `ms_lunarriftmutationsmanager_taskcompleted`, `ms_hermitcrab_relocated`, `ms_wagpunk_floor_kit_deployed`, `ms_wagpunk_constructrobot`, `ms_wagpunk_lever_activated`, `ms_wagboss_robot_losecontrol`, `ms_wagboss_alter_defeated`, `ms_alterguardian_phase1_lunarrift_capturable`, `ms_wagboss_robot_turnoff`, `ms_wagboss_robot_constructed`
  - `ms_wagstaff_arena_oneshot`, `ms_wagboss_snatched_wagstaff`
  - `ms_playerjoined`, plus per-player callbacks (`onremove`, `ms_becameghost`, `ms_respawnedfromghost`) once tracking starts.
- **Pushes:**
  - `ms_wagpunk_barrier_playerentered`, `ms_wagpunk_barrier_playerleft`
  - `ms_wagpunk_barrier_isactive` (when `wagpunk_floor_helper` changes state)
