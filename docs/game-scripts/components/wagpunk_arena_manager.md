---
id: wagpunk_arena_manager
title: Wagpunk Arena Manager
description: Manages the progression state, entity spawning, and orchestration of the Wagpunk Arena questline, including dynamic layout adaptation and player barrier mechanics.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 23162cc5
---

# Wagpunk Arena Manager

## Overview
This server-side `Component` coordinates the multi-stage Wagpunk Arena questline in DST, dynamically adapting to world layout variations via rotation transformations. It handles arena setup (floor placement, walls, workstation, levers, drone markers), spawns and manages key entities (Wagstaff NPC, Wagboss robot, drones), tracks state progression (Spark Ark → Pearl Map → Turf → Construct → Lever → Boss → Cooldown), and enforces player boundaries with lunacy effects. The manager orchestrates events between NPCs, players, and environment to drive quest completion.

## Dependencies & Tags
- **World Dependencies**: Relies on specific world entities and components:
  - `TheWorld.Map`
  - `TheWorld.components.wagboss_tracker`
  - `TheWorld.components.lunaralterguardianspawner`
  - `TheWorld.components.hermitcrab_relocation_manager`
  - `TheWorld.net.components.wagpunk_floor_helper`
- **Entity Tags Used**:
  - `"mapscroll"`, `"gestalt_cage"`, `"gestalt_cage_filled"`, `"wagpunk_floor_placerindicator"`, `"CLASSIFIED"`, `"winchtarget"`
- **Event Listeners**: Registers callbacks for many world-level events (e.g., `ms_register_hermitcrab_marker`, `ms_wagboss_alter_defeated`, `ms_lunarriftmutationsmanager_taskcompleted`, etc.)
- **Tags Added**: None — component operates on other entities; does not manage its own tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the component's owner entity (typically `TheWorld`). |
| `TILESPOTS` | `table of {x, z, rot}` | Static array (see code) | Hardcoded tile positions (relative to arena origin) for floor placement. Modified by rotation transformation. |
| `WALLSPOTS` | `table of {x, z, rot, sfxlooper?}` | Deep copy of `WAGPUNK_ARENA_COLLISION_DATA` | Wall placement spots; origin-adjusted and transformed. |
| `ARENA_ENTITIES` | `table` | Static table (see code) | Prefab → placement spots mapping; populated during init with transformed coordinates. |
| `STATES` | `table` | `{SPARKARK=0, PEARLMAP=1, ...}` | Named state IDs defining quest progression stages. |
| `state` | `number (state ID)` | `nil` → `SPARKARK` | Current quest stage; updated by `SetState()`. |
| `storedx_pearl`, `storedz_pearl` | `number` | `nil` | World coordinates of Pearl's arena reference point (calculated from `hermitcrab_marker` and `beebox_hermit`). |
| `storedangle_pearl` | `number` | `nil` | Rotation angle (degrees) of Pearl's arena layout. Used in transformation. |
| `storedx_monkey`, `storedz_monkey` | `number` | `nil` | World coordinates of Monkey Island reference point. |
| `storedangle_monkey` | `number` | `nil` | Rotation angle for Monkey Island layout. |
| `appliedrotationtransformation` | `boolean` | `false` | Flag indicating whether all spot arrays (`TILESPOTS`, `WALLSPOTS`, etc.) have been transformed. |
| `failed` | `boolean` | `false` | Set if too many/missing required entities (debug-only error state). |
| `wagstaff`, `lever`, `workstation`, `wagboss` | `Entity?` | `nil` | References to tracked NPCs/structures. |
| `cagewalls` | `table` | `nil` | Active cage walls during boss fight; `{entity = true}`. |
| `wagdrones` | `table` | `nil` | Drones currently placed in arena. |
| `arenaentities` | `table` | `nil` | All arena-spawned entities tracked for destruction/removal. |
| `arenaprefabcounts` | `table` | `nil` | Count of each prefab type in arena (e.g., `wagdrone_spot_marker`). |
| `pearlsentities`, `lunacycreators` | `table` | `{}` | Track Pearl-related and lunacy-related entities. |
| `playersdata` | `table?` | `nil` | Manages player participation during boss fight: `{players={player=isalive}, alivecount, disconnected={ku=true}}`. |
| `lunacymode` | `boolean?` | `nil` | Whether arena lunacy is active (controls sanity influence). |
| `bosscooldowntask` | `Task?` | `nil` | Scheduled task for post-boss cooldown timer. |
| `checktask`, `workstationtoggledtask`, `levertoggledtask`, `updatenetvarstask`, `despawngraceperiodtask` | `Task?` | `nil` | Scheduled tasks for deferred logic, debouncing, and updates. |

## Main Functions

### `:QueueCheck()`
* **Description:** Schedules an immediate `CheckStateForChanges` (via a task) to re-evaluate quest state and progress if possible.
* **Parameters:** None.

### `:CheckStateForChanges()`
* **Description:** Iteratively calls `CheckStateForChanges_Internal()` until no state change occurs. Ensures all state dependencies are satisfied before advancing.
* **Parameters:** None.

### `:SetState(state)`
* **Description:** Updates the current quest stage and notifies network helpers.
* **Parameters:**
  - `state` (`number`): One of `self.STATES.*` constants.

### `:TryToApplyRotationTransformation()`
* **Description:** Calculates layout rotation from known landmark entity positions (Pearl: `hermitcrab_marker`/`beebox_hermit`; Monkey Island: `monkeyqueen`/`monkeyportal`), applies affine transformations to static layout arrays, and marks completion.
* **Parameters:** None.

### `:ApplyRotationTransformation_Pearl(data)`
* **Description:** Applies a rotation/flip to a list of `{x,z,rot}` coordinates based on the computed `storedangle_pearl`. Supports 90-degree rotations and diagonal flips.
* **Parameters:**
  - `data` (`table`): In/out table of `{x,z,rot}` tables.

### `:SpawnWagstaffSetPiece()`
* **Description:** Spawns the fixed Wagstaff set (workstation, lever, junk piles, fence junk) if not already present.
* **Parameters:** None.

### `:TryToSpawnArenaEntities(prefab, validspotfn, postinitfn)`
* **Description:** Spawns arena entities (e.g., walls, markers, drones) at pre-transformed spots if none exist and spot validity checks pass.
* **Parameters:**
  - `prefab` (`string`): Prefab name to spawn.
  - `validspotfn(x, z, radius)` (`function?`): Callback to validate placement.
  - `postinitfn(ent)` (`function?`): Optional post-spawn hook.

### `:TrackArenaEntity(ent)`
* **Description:** Registers an arena entity for lifecycle tracking and updates `arenaentities` and `arenaprefabcounts`.
* **Parameters:**
  - `ent` (`Entity`): The spawned entity.

### `:HasArenaEntity(prefab)`
* **Description:** Checks whether at least one instance of `prefab` is currently in the arena.
* **Parameters:**
  - `prefab` (`string`): Prefab name.

### `:RemoveArenaEntities(prefab)`
* **Description:** Removes all arena entities of a given prefab.
* **Parameters:**
  - `prefab` (`string`): Prefab to remove.

### `:CheckTurfCompletion()`
* **Description:** Verifies all required tiles in `TILESPOTS` are set to `WAGSTAFF_FLOOR`. Calls `TurfCompleted()` if complete.
* **Parameters:** None.

### `:CheckConstructCompleted()`
* **Description:** Checks whether all drone spot markers and, if needed, the boss cage have been placed. Triggers `ConstructCompleted()` if satisfied.
* **Parameters:** None.

### `:WorkstationToggled(workstation, on)`
* **Description:** Handles toggling of the arena workstation (e.g., by Wagstaff’s dialogue or UI). Spawns/positions Wagstaff, triggers NPC chatter, or fades them out as appropriate for current state.
* **Parameters:**
  - `workstation` (`Entity`): The workstation entity (must be tracked).
  - `on` (`boolean`): New switch state.

### `:LeverToggled(lever, on)`
* **Description:** Handles lever activation/deactivation during boss preparation and boss phases.
* **Parameters:**
  - `lever` (`Entity`): The lever entity (must be tracked).
  - `on` (`boolean`): New lever state.

### `:TryToSpawnWagstaff()`
* **Description:** Spawns the Wagstaff NPC if one is not already present and not blocked by boss defeat or cooldown.
* **Parameters:** None.

### `:DoWagstaffOneshotAtXZ(x, z, radiusopt, lines, oneline, postinitfn)`
* **Description:** Spawns/activates Wagstaff to deliver a one-shot dialogue line at the specified location, then either fades or despawns him.
* **Parameters:**
  - `x`, `z` (`number`): Target position.
  - `radiusopt` (`number?`): Desired proximity radius.
  - `lines` (`string`): Line string set (e.g., `WAGSTAFF_WAGPUNK_ARENA_LEVERPULLED`).
  - `oneline` (`boolean`): If true, randomly pick one line; else use full list.
  - `postinitfn(wagstaff)` (`function?`): Optional post-spawn callback.

### `:LockPlayersIn()` / `:UnlockPlayers()`
* **Description:** Starts/stops player tracking for arena participation (including death/respawn/ghost state), enables/disables lunacy, and manages dynamic inclusion/exclusion based on current position.
* **Parameters:** None.

### `:OnUpdate(dt)`
* **Description:** Periodically checks each player’s position relative to the arena and updates their tracking state (`TrackPlayer`/`StopTrackingPlayer`). Ensures players are dynamically counted during the fight.
* **Parameters:**
  - `dt` (`number`): Delta time.

### `:UpdateNetvars()`
* **Description:** Syncs the arena barrier active state to `wagpunk_floor_helper` (networked), broadcasting `ms_wagpunk_barrier_isactive`.
* **Parameters:** None.

### `:OnSave()` / `:OnLoad(data)`
* **Description:** Serializes state and entity references to save data; reconstructs them on load.
* **Parameters (OnLoad):**
  - `data` (`table`): Save data table.

### `:LoadPostPass(newents, savedata)`
* **Description:** Resolves GUIDs to real entities post-load; reattaches listeners and sets up tracked entities and player tracking.
* **Parameters:**
  - `newents` (`table`): GUID → `{entity}` map.
  - `savedata` (`table`): Loaded save data.

### `:DebugForcePearl()`, `:DebugForceTurf()`, `:DebugForceConstruct()`, `:DebugSkipState()`, `:DebugPrintFlags()`
* **Description:** Development/debug helpers to simulate quest progression and inspect internal flags.
* **Parameters:** None.

## Events & Listeners

- **Registers on `self.inst` (the world component owner)**:
  - `ms_register_hermitcrab_marker`
  - `ms_register_beebox_hermit`
  - `ms_register_hermitcrab`
  - `ms_register_pearl_entity`
  - `ms_register_monkeyisland_portal`
  - `ms_register_monkeyqueen`
  - `ms_register_wagpunk_arena_lunacycreator`
  - `ms_lunarriftmutationsmanager_taskcompleted` → `:SparkArkCompleted()`
  - `ms_hermitcrab_relocated` → `:PearlMoveCompleted()`
  - `ms_wagpunk_floor_kit_deployed` → `:CheckTurfCompletion()`
  - `ms_wagpunk_constructrobot` → `:CheckConstructCompleted()`
  - `ms_wagpunk_lever_activated` → `:LeverCompleted()`
  - `ms_wagboss_robot_losecontrol` → `:OnRobotLoseControl()`
  - `ms_wagboss_alter_defeated` → `:BossCompleted()`, `:UntrackWagboss()`
  - `ms_alterguardian_phase1_lunarrift_capturable` → `:TryWagstaffGiveGestaltCage()`
  - `ms_wagboss_robot_turnoff` → `:BossCompleted()` (if in boss state)
  - `ms_wagboss_robot_constructed` → `:TrackWagboss()`, spawn cage markers
  - `ms_wagstaff_arena_oneshot` → `:DoWagstaffOneshotAtXZ()`
  - `ms_wagboss_snatched_wagstaff` → removes Wagstaff

- **Player lifecycle events** (on tracked players):
  - `onremove`
  - `ms_becameghost`
  - `ms_respawnedfromghost`
  - `ms_playerjoined` (on world component)