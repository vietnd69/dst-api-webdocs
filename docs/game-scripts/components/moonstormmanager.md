---
id: moonstormmanager
title: Moonstormmanager
description: Manages the spawning, propagation, and lifecycle of moonstorms, Wagstaff hunt/experiment events, and associated game mechanics in DST.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 75d319d3
---

# Moonstormmanager

## Overview
This component orchestrates the procedural generation and management of moonstorms—dynamic weather events centered around specific world nodes—alongside related gameplay sequences involving Wagstaff NPC hunts, static roamer experiments, and gestalt bird waves. It runs exclusively on the master simulation and handles all state persistence, event coordination, and timing logic for these complex systems.

## Dependencies & Tags
- **Component Dependency:** Requires `TheWorld.net.components.moonstorms` to be present (accessed via `TheWorld.net`).
- **Event Listeners Registered:** Listens for `"timerdone"`, `"ms_playerjoined"`, `"ms_playerleft"`, `"ms_startthemoonstorms"`, `"ms_stopthemoonstorms"`, and `"ms_moonstormstatic_roamer_spawned"` (global via `TheWorld`).
- **World State Watched:** `"cycles"` — triggers `on_day_change()` on day transitions.
- **Tags Used:** `"birdblocker"`, `"lunacyarea"`, `"sandstorm"`.
- **No tags added/removed** by this component itself.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (constructor arg) | The entity this component is attached to (typically the server `World`). |
| `metplayers` | `table` | `{}` | Map of player user IDs who have met Wagstaff (used to avoid repeating introductions). |
| `roamers` | `table` | `{}` | Tracks active static roamer entities to remove them on detach/cleanup. |
| `_alterguardian_defeated_count` | `number` | `0` | Count of Defeated Moonaltars/Alter Guardians; affects moon phase styling and post-experiment storm behavior. |
| `_activeplayers` | `table` | `{}` | List of currently active players used for location-based logic (e.g., spark/lightning spawning). |
| `_currentbasenodeindex` | `number?` | `nil` | Index of the current moonstorm’s base node in `TheWorld.topology.nodes`. |
| `_currentnodes` | `table?` | `nil` | List of node indices currently involved in the active moonstorm. |
| `_moonstyle_altar` | `boolean?` | `nil` | True when a moonstorm is active and initiated via altar-related logic (not random). |
| `_nummoonstormpropagationsteps` | `number` | `3` | Propagation depth for moonstorm node spread during storm creation. |
| `spawn_wagstaff_test_task` | `Task?` | `nil` | Periodic task (`DoPeriodicTask`) to trigger Wagstaff/hunt experiments. |
| `moonstorm_spark_task` | `Task?` | `nil` | Periodic task to spawn moonstorm sparks. |
| `moonstorm_lightning_task` | `Task?` | `nil` | Delayed task (via `DoTaskInTime`) to spawn moonstorm lightning. |
| `defence_task` | `Task?` | `nil` | Deferred task to spawn gestalt bird waves during experiments/hunts. |
| `tools_task` | `Task?` | `nil` | Deferred task to spawn tools during experiments. |
| `tools_need` | `Task?` | `nil` | Deferred task to trigger need_tool events during experiments. |

## Main Functions

### `CalcNewMoonstormBaseNodeIndex()`
* **Description:** Selects a new valid base node for the next moonstorm by iterating through topology nodes. Ensures the selected node is far enough from the previous one and meets `NodeCanHaveMoonstorm` criteria (not a sandstorm/lunacy area, not ocean).
* **Parameters:** None.

### `GetCelestialChampionsKilled()`
* **Description:** Returns the count of defeated alter guardians (`_alterguardian_defeated_count`).
* **Parameters:** None.

### `StartMoonstorm(set_first_node_index, nodes)`
* **Description:** Initializes and propagates a new moonstorm across world nodes, starting from either a specified base node or a computed one. Spawns periodic tasks for sparks, lightning, and Wagstaff static tests.
* **Parameters:**
  - `set_first_node_index` (optional `number`): Pre-selected base node index; otherwise computed.
  - `nodes` (optional `table`): Pre-built list of node indices; otherwise generated via propagation.

### `StopCurrentMoonstorm()`
* **Description:** Shuts down the current moonstorm, cancels related tasks, and advances `_alterguardian_defeated_count`. If `_moonstyle_altar` is set, leaves the moon locked; otherwise unlocks moon phases.
* **Parameters:** None.

### `StopExperimentTasks()`
* **Description:** Cancels experiment-related timers and tasks (e.g., `moonstorm_experiment_complete`, `tools_task`, `defence_task`) and clears them.
* **Parameters:** None.

### `StopExperiment()`
* **Description:** Cleans up tools, static, or roamer objects created for experiments/hunts; removes tool components or erodes them.
* **Parameters:** None.

### `FailExperiment()`
* **Description:** Triggers Wagstaff failure dialog/animation, erodes Wagstaff, and calls `StopExperiment()`.
* **Parameters:** None.

### `EndExperiment()`
* **Description:** Handles successful experiment completion: Wagstaff dialog, erode, static completion, and restarts a new moonstorm.
* **Parameters:** None.

### `beginNoWagstaffExperiment(player)`
* **Description:** Starts a Wagstaff-less experiment by spawning a `moonstorm_static_roamer` near the player.
* **Parameters:**
  - `player`: The player entity that triggered the event (used for location).

### `beginWagstaffHunt(player)`
* **Description:** Spawns the Wagstaff NPC at a location near the player to initiate a hunt sequence.
* **Parameters:**
  - `player`: The player entity that triggered the event (used for location).

### `AdvanceWagstaff()`
* **Description:** Moves the current Wagstaff to a new location closer to players inside the storm; updates expiration timer.
* **Parameters:** None.

### `FindUnmetCharacter()`
* **Description:** Finds a random active player currently inside the moonstorm who has not yet met Wagstaff.
* **Parameters:** None.

### `GetNewWagstaffLocation(wagstaff)`
* **Description:** Computes a new valid spawn position for Wagstaff, optionally preferring positions closer to the moonstorm center if in final hunt stage.
* **Parameters:**
  - `wagstaff`: The `wagstaff_npc` entity.

### `startNeedTool()` / `foundTool()` / `startWaglessNeedTool()` / `foundWaglessTool()`
* **Description:** Manages the experiment tool-wait phase by pausing/resuming the experiment timer and signaling the NPC/static to wait for or acknowledge tools.
* **Parameters:** None (all methods are internal steps in tool-wait cycles).

### `AddMetplayer(id)`
* **Description:** Records that a player with the given `userid` has been introduced to Wagstaff.
* **Parameters:**
  - `id`: String player `userid`.

### `beginWagstaffDefence()`
* **Description:** Begins a defense experiment by stopping expiration timer, spawning tools, starting gestalt waves, and triggering the initial experiment dialog.
* **Parameters:** None.

### `SpawnGestalt(angle, prefab)`
* **Description:** Spawns a gestalt entity (`bird_mutant` or `bird_mutant_spitter`) at a random offset around Wagstaff or static, and sets it to swarm the static.
* **Parameters:**
  - `angle`: Directional base for spawn offset.
  - `prefab`: Prefab name (`"bird_mutant"` or `"bird_mutant_spitter"`).

### `spawnGestaltWave()` / `spawnWaglessGestaltWave()`
* **Description:** Spawns a wave of gestalt birds (or spitters) around Wagstaff or static, updating the next wave delay based on experiment timer. Re-schedules itself via `defence_task`.
* **Parameters:** None.

### `spawnTool()` / `spawnWaglessTool()`
* **Description:** Spawns random tools (from `wagstaff_tools_original` list) near Wagstaff or static; removes tool from pool and registers cleanup callback.
* **Parameters:** None.

### `DoTestForWagstaff()`
* **Description:** Checks eligible players in the moonstorm zone and triggers either `beginWagstaffHunt()` or `beginNoWagstaffExperiment()` depending on Wagboss status.
* **Parameters:** None.

### `DoTestForSparks()`
* **Description:** Ensures each player in the moonstorm has up to `SPARKLIMIT` (3) sparks nearby; spawns additional sparks if needed.
* **Parameters:** None.

### `DoTestForLightning()`
* **Description:** Picks a random player in the moonstorm and spawns a lightning entity near them; reschedules itself.
* **Parameters:** None.

### `TestMoonAltarLinkPositionValid(pt)`
* **Description:** Validates whether a point is suitable for a moon altar link (passable, above ground, no blockers within radius).
* **Parameters:**
  - `pt`: A `Point` or table with `.x`, `.y`, `.z`.

### `TestAltarTriangleValid(altar0, altar1, altar2, center_pt)`
* **Description:** Validates a triangle of altars for creating a moon altar link: checks mutual distance, angle constraints (`AltarAngleTest`), and link point validity.
* **Parameters:**
  - `altar0`, `altar1`, `altar2`: Moon altar entities.
  - `center_pt` (optional): Precomputed link center; if `nil`, uses triangle centroid.

### `OnSave()`
* **Description:** Serializes state (storm days, current nodes, met players, flags, counts, tasks).
* **Parameters:** None.

### `OnLoad(data)`
* **Description:** Restores state after loading; reinitializes experiments, timers, and phase style as needed.
* **Parameters:**
  - `data`: Saved state table.

### `GetDebugString()`
* **Description:** Returns a multi-line debug string summarizing storm progress, counts, and task times.
* **Parameters:** None.

## Events & Listeners
- Listens for `"timerdone"` → calls `EndExperiment()` on `"moonstorm_experiment_complete"`.
- Listens for `"ms_playerjoined"` → adds player to `_activeplayers`.
- Listens for `"ms_playerleft"` → removes player from `_activeplayers`.
- Listens for `"ms_startthemoonstorms"` → triggers `StartTheMoonstorms()`.
- Listens for `"ms_stopthemoonstorms"` → triggers `StopTheMoonstorms()`.
- Listens for `"ms_moonstormstatic_roamer_spawned"` → calls `TrackRoamer()`.
- Listens for `"ms_moonstormstatic_roamer_captured"` → calls `CapturedRoamer()`.
- Watches world state `"cycles"` → triggers `on_day_change()`.
- Pushes events: `"ms_setmoonphasestyle"`, `"ms_lockmoonphase"`, `"ms_setclocksegs"`, `"ms_setmoonphase"`, `"ms_moonstormwindowover"`, `"ms_moonboss_was_defeated"`.