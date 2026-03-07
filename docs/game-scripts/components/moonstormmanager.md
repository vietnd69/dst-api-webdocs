---
id: moonstormmanager
title: Moonstormmanager
description: Manages moonstorm events, wagstaff hunts, and storm-related gameplay progression in DST's Moon Altar and Wagboss systems.
tags: [moonstorm, boss, events, world]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 75d319d3
system_scope: world
---

# Moonstormmanager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Moonstormmanager` is a master-sim-only component responsible for orchestrating moonstorm events, including storm generation, propagation, wagstaff NPC encounters, and gestalt wave defense phases. It is attached to the world entity (`TheWorld`) and manages phase transitions between normal moon cycles and full moonstorms, as well as player-initiated experiments with the Wagboss.

The component interacts heavily with the `moonstorms` network component for world-wide storm state management, and relies on `timer`, `entitytracker`, `health`, and `talker` components for scheduling, entity tracking, and dialogue. It coordinates behavior between WAGSTAFF, ROAMER, and GESTALT prefabs during moonstorm events.

## Usage example
```lua
-- Access the component on the world entity (mastersim only)
if TheWorld.ismastersim then
    local manager = TheWorld.components.moonstormmanager

    -- Start a new moonstorm (e.g., after certain conditions)
    manager:StartMoonstorm()

    -- Stop the current moonstorm (e.g., after wagboss defeat)
    manager:StopCurrentMoonstorm()

    -- Check how many Alter Guardians have been defeated
    local kills = manager:GetCelestialChampionsKilled()
end
```

## Dependencies & tags
**Components used:** `moonstorms`, `timer`, `entitytracker`, `health`, `talker`, `wagboss_tracker`

**Tags:** None added or removed directly by this component. It reads/writes `TheWorld.components.moonstorms` state via replicated APIs.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The world entity instance (`TheWorld`) that owns this component. |
| `roamers` | `table` | `{}` | Map of active `moonstorm_static_roamer` entities being tracked. |
| `metplayers` | `table` | `{}` | Map of player user IDs who have been met during the current moonstorm. |
| `wagstaff` | `Entity?` | `nil` | Reference to the active `wagstaff_npc` instance (if any). |
| `experiment_static` | `Entity?` | `nil` | Reference to the active `moonstorm_static` instance during no-wagstaff experiments. |
| `stormdays` | `number` | `0` | Number of days elapsed during the current moonstorm. |
| `_alterguardian_defeated_count` | `number` | `0` | Internal counter for how many Alter Guardians have been defeated (saved and loaded). |
| `_moonstyle_altar` | `boolean?` | `nil` | Whether an altar-based moonstorm is active. |
| `_currentbasenodeindex` | `number?` | `nil` | Index of the current base node in `TheWorld.topology.nodes` for the active storm. |
| `_currentnodes` | `table?` | `nil` | List of node indices currently affected by the storm. |

## Main functions
### `CalcNewMoonstormBaseNodeIndex()`
* **Description:** Selects a new valid base node for the next moonstorm, ensuring it is far enough from the previous base node and meets conditions (not ocean, not a `lunacyarea`, etc.).
* **Parameters:** None.
* **Returns:** `number?` — Index of the selected node in `TheWorld.topology.nodes`, or `nil` if no valid node found.

### `GetCelestialChampionsKilled()`
* **Description:** Returns the number of Alter Guardians (Celestial Champions) defeated this world session.
* **Parameters:** None.
* **Returns:** `number` — Count of defeated champions.

### `StartMoonstorm(set_first_node_index, nodes)`
* **Description:** Initializes and propagates a new moonstorm, optionally starting at a specific node or using a provided node list. Cancels existing storm tasks and timers.
* **Parameters:**
  * `set_first_node_index` (`number?`) — Optional index of the first node to use as the storm origin.
  * `nodes` (`table?`) — Optional precomputed list of node indices to include in the storm.
* **Returns:** Nothing.

### `StopCurrentMoonstorm()`
* **Description:** Stops the active moonstorm, cancels associated periodic and delayed tasks, and notifies the `moonstorms` component to clear storm nodes.
* **Parameters:** None.
* **Returns:** Nothing.

### `StopExperimentTasks()`
* **Description:** Stops all experiment-related timers and tasks, including `moonstorm_experiment_complete`, tool spawning, and gestalt wave timers.
* **Parameters:** None.
* **Returns:** Nothing.

### `StopExperiment()`
* **Description:** Cleans up experiment resources (e.g., tool items, static references), typically called after `EndExperiment()` or `FailExperiment()`.
* **Parameters:** None.
* **Returns:** Nothing.

### `FailExperiment()`
* **Description:** Handles experiment failure: triggers wagstaff dialogue, erodes the static entity, and cleans up the experiment state.
* **Parameters:** None.
* **Returns:** Nothing.

### `EndExperiment()`
* **Description:** Completes the experiment successfully: triggers dialogue, erodes wagstaff/static, and starts a new moonstorm.
* **Parameters:** None.
* **Returns:** Nothing.

### `beginWagstaffHunt(player)`
* **Description:** Spawns a `wagstaff_npc` at a random walkable location near the given player to begin a standard moonstorm hunt.
* **Parameters:** `player` (`Entity`) — Player to use as a reference location.
* **Returns:** Nothing.

### `beginNoWagstaffExperiment(player)`
* **Description:** Spawns a `moonstorm_static_roamer` to start a no-wagstaff experiment near the given player.
* **Parameters:** `player` (`Entity`) — Player to use as a reference location.
* **Returns:** Nothing.

### `beginWagstaffDefence()`
* **Description:** Prepares for the defense phase of a wagstaff experiment: stops timer expiration, spawns tools, and starts gestalt waves.
* **Parameters:** None.
* **Returns:** Nothing.

### `beginNoWagstaffDefence()`
* **Description:** Prepares for the defense phase of a no-wagstaff experiment: spawns tools and starts gestalt waves.
* **Parameters:** None.
* **Returns:** Nothing.

### `AdvanceWagstaff()`
* **Description:** Moves the active wagstaff NPC to a new location closer to the player.
* **Parameters:** None.
* **Returns:** `Vector3?` — New position if successful, otherwise `nil`.

### `FindUnmetCharacter()`
* **Description:** Finds a player in the moonstorm who has not yet been “met” this storm cycle.
* **Parameters:** None.
* **Returns:** `Vector3?` — Position of a player who hasn’t been met, or `nil`.

### `GetNewWagstaffLocation(wagstaff)`
* **Description:** Computes a new walkable location for the wagstaff NPC, optionally based on hunt stage (final hunt when `hunt_count >= WAGSTAFF_NPC_HUNTS`).
* **Parameters:** `wagstaff` (`Entity`) — Wagstaff instance.
* **Returns:** `Vector3` — New walkable position.

### `startNeedTool()` and `foundTool()`
* **Description:** Pauses/resumes the experiment timer and triggers wagstaff’s tool-waiting or tool-received states.
* **Parameters:** None.
* **Returns:** Nothing.

### `startWaglessNeedTool()` and `foundWaglessTool()`
* **Description:** Pauses/resumes the experiment timer and notifies the static entity of tool needs/resolution.
* **Parameters:** None.
* **Returns:** Nothing.

### `AddMetplayer(id)`
* **Description:** Marks a player ID as having been met during the current storm.
* **Parameters:** `id` (`string`) — Player’s `userid`.
* **Returns:** Nothing.

### `DoTestForWagstaff()`
* **Description:** Checks if a wagstaff hunt or no-wagstaff experiment should be started based on active players in the moonstorm and whether the Wagboss has been defeated.
* **Parameters:** None.
* **Returns:** Nothing.

### `DoTestForSparks()`
* **Description:** Ensures enough `moonstorm_spark` entities exist near active players in the moonstorm (max `SPARKLIMIT` per player).
* **Parameters:** None.
* **Returns:** Nothing.

### `DoTestForLightning()`
* **Description:** Spawns a `moonstorm_lightning` instance near a random active player in the moonstorm.
* **Parameters:** None.
* **Returns:** Nothing.

### `SpawnGestalt(angle, prefab)`
* **Description:** Spawns a gestalt entity (e.g., `bird_mutant`) at a safe offset from the wagstaff or static entity.
* **Parameters:**
  * `angle` (`number`) — Base angle for offset calculation.
  * `prefab` (`string`) — Name of gestalt prefab to spawn.
* **Returns:** Nothing.

### `spawnGestaltWave()` and `spawnWaglessGestaltWave()`
* **Description:** Spawns a wave of gestalt entities (mutant birds and spitters), requeues the next wave based on remaining experiment time.
* **Parameters:** None.
* **Returns:** Nothing.

### `spawnTool()` and `spawnWaglessTool()`
* **Description:** Spawns a random tool for the wagstaff/static to collect, recurs by scheduling the next tool spawn.
* **Parameters:** None.
* **Returns:** Nothing.

### `TestAltarTriangleValid(altar0, altar1, altar2, center_pt)`
* **Description:** Validates whether three moon altars form a valid triangle for creating a `moon_altar_link`. Checks distances, angle constraints, and point validity.
* **Parameters:**
  * `altar0`, `altar1`, `altar2` (`Entity`) — Moon altar entities.
  * `center_pt` (`Vector3?`) — Optional point to validate instead of computing centroid.
* **Returns:** `boolean` — Whether the triangle is valid.

### `OnSave()` / `OnLoad(data)`
* **Description:** Serialization/deserialization for world persistence. Saves storm state, player meet tracking, and storm-related tasks.
* **Parameters:** `OnSave` → None; `OnLoad(data)` → `data` (`table`) — Saved data.
* **Returns:** `OnSave` returns `table`; `OnLoad` returns nothing.

### `GetDebugString()`
* **Description:** Returns a debug string summarizing current storm progress, tasks, and kills for dev tools.
* **Parameters:** None.
* **Returns:** `string` — Human-readable debug info.

## Events & listeners
- **Listens to:**
  - `timerdone` — Handles `moonstorm_experiment_complete` timer expiration.
  - `ms_playerjoined` — Adds joining players to `_activeplayers`.
  - `ms_playerleft` — Removes leaving players from `_activeplayers`.
  - `ms_startthemoonstorms` — Starts the moonstorm sequence.
  - `ms_stopthemoonstorms` — Stops the moonstorm sequence.
  - `ms_moonstormstatic_roamer_spawned` — Tracks newly spawned roamers.
  - `ms_moonstormstatic_roamer_captured` — Handles roamer capture to begin no-wagstaff experiments.
- **Pushes:**
  - `ms_setmoonphasestyle`
  - `ms_lockmoonphase`
  - `ms_setclocksegs`
  - `ms_setmoonphase`
  - `ms_moonstormwindowover`
  - `ms_moonboss_was_defeated`
- **Also calls external events** (e.g., `wagstaff:PushEvent("talk")`, `wagstaff:PushEvent("doexperiment")`) via `talker` interactions.
