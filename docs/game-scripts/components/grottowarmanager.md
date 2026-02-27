---
id: grottowarmanager
title: Grottowarmanager
description: Manages grotto war events—including spawning enemies and terrain obstacles—based on player presence and world topology.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: ec61bc73
---

# Grottowarmanager

## Overview
The `Grottowarmanager` component orchestrates grotto war dynamics in DST: it tracks players within specific areas (e.g., Lunacy zones), spawns Nightmare and Brightmare entities periodically based on population tuning, and constructs front-line war obstacles (e.g., fissures, spawners) when the war begins via the `ms_archivesbreached` event. It is authoritative and runs exclusively on the master simulation.

## Dependencies & Tags
- **Component Dependency**: None explicitly added via `AddComponent`. It relies on entity `inst` being present on a world-level object (e.g., a master controller).
- **Tags**:
  - Adds `grotto_war_wall` to spawned war obstacles via `SpawnFrontLines`.
  - Listens for `GrottoWarEntrance` tag on world topology nodes.
  - Uses internal tags: `brightmare`, `player`, `playerghost`, `shadow`, `brightmare_guard`, `shadow`, `lunacyarea`.
- **Uses Components**:
  - `TheWorld.Map`: for point checks (`IsPointNearHole`) and topology.
  - `TheWorld.topology`: nodes, edges, story depths.
  - `TheSim`: entity spawning and queries.
  - `player.components.locomotor`, `player.components.areaaware`, `player.components.combat`.

## Properties
No public properties are exposed beyond the core `self.inst`. All state is held in private local variables. `_enabled`, `_players`, `_activeplayers`, `_poptask`, `_retrofitted_spawnpoints`, and `_retrofitted_homepoint` are defined at the module scope, but only `self.inst` is publicly accessible.

## Main Functions

### `self:RetrofittedSpawnFrontLines()`
* **Description:** Handles war front-line spawning for retrofitted worlds (e.g., modded world gen). Removes pre-registered spawnpoints and homepoint, then replaces them with war infrastructure like `nightmaregrowth_spawner`, `fissure_grottowar`, and transition statues.
* **Parameters:** None.

### `self:SpawnFrontLines()`
* **Description:** Constructs front-line obstacles (fissures and spawners) across edges connecting nodes of differing story depths near the `GrottoWarEntrance` node. Spawns visual and functional war assets with area clearing and known-location tracking.
* **Parameters:** None.

### `self:IsWarStarted()`
* **Description:** Returns whether the grotto war has started (`_enabled`).
* **Parameters:** None.

### `self:GetDebugString()`
* **Description:** Returns a debug-friendly string indicating the number of tracked players.
* **Parameters:** None.

## Events & Listeners

- **`ms_playerjoined`** → `OnPlayerJoined(inst, player)`  
  Registers new players and listens for `changearea` events on them.

- **`ms_playerleft`** → `OnPlayerLeft(inst, player)`  
  Unregisters players and stops war logic if no players remain.

- **`changearea`** (on each player) → `OnPlayerAreaChanced(player, data)`  
  Tracks players entering/exiting `lunacyarea`. When present, the player is added to `_players`; when absent, removed. Triggers war start if war is enabled and players remain.

- **`nightmarephasechanged`** → `OnNightmarePhaseChanged(inst, phase)`  
  Currently unimplemented (placeholder).

- **`ms_archivesbreached`** → `StartTheWar()`  
  Triggers war start: calls `SpawnFrontLines`, sets nightmare phase to `"wild"`, and initiates camera shake. Sets `_enabled = true`.

- **`ms_register_retrofitted_grotterwar_spawnpoint`** → anonymous function  
  Registers a spawnpoint entity for retrofitted worlds into `_retrofitted_spawnpoints`.

- **`ms_register_retrofitted_grotterwar_homepoint`** → anonymous function  
  Registers a homepoint entity for retrofitted worlds into `_retrofitted_homepoint`.

- **`entitysleep`** (on spawned Mare entities) → `RemoveMare(ent)`  
  Cleans up spawned Mares (e.g., `nightmarebeak`, `gestalt_guard`) when they go to sleep.

## Save/Load Support
- **`OnSave()`**  
  Returns a table with `_enabled2` mapping to `_enabled` (note: renamed to `_enabled2` for bug fix in beta).

- **`OnLoad(data)`**  
  Restores `_enabled` if `data._enabled2` is truthy.

## Notes
- This component **must** be attached to the master instance (`TheWorld.ismastersim`)—client instances will fail on construction.
- All spawn logic (including `UpdatePopulation`) runs with randomized offsets, intervals, and probabilities based on tuning values (e.g., `TUNING.GROTTOWAR_MAX_NIGHTMARES`, `TUNING.GROTTOWAR_NIGHTMARE_TARGET_PLAYER_CHANCE`).
- Uses `FindWalkableOffset` to avoid spawning entities in holes or obstructed zones.
- The component actively cancels its population task (`_poptask`) when no tracked players remain or war is stopped.