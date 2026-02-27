---
id: quaker
title: Quaker
description: This component manages global earthquake events in DST, including timing, debris spawning, sound playback, and player-specific dropping logic during quakes.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: c07f1a7b
---

# Quaker

## Overview
The Quaker component orchestrates large-scale environmental earthquakes across the world. It handles scheduling quake phases (waiting, warning, quaking), spawning debris based on terrain and configuration, managing player-specific drop timing, emitting earthquake sounds, and responding to game events like explosions, player joins/leaves, and mini-quakes. It runs exclusively on the master simulation and synchronizes playback state to clients via network variables.

## Dependencies & Tags
- Relies on `TheWorld` and its components (`Map`, `SoundEmitter`, `riftspawner`, `rabbitkingmanager`).
- Uses `SourceModifierList` to support pausing/quarantining earthquake activity.
- Registers the network variables `quakesoundintensity` and `miniquakesoundintensity`.
- Listens to common world-scoped events: `ms_playerjoined`, `ms_playerleft`, `ms_miniquake`, `ms_forcequake`, `explosion`, `pausequakes`, `unpausequakes`.
- Adds no tags to entities.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Component` | `self.inst` passed to constructor | The owning entity (typically `TheWorld`) for the quaker component. |
| `_debrispersecond` | `number` | `1` | Controls debris spawn rate (items per second) during an active quake. |
| `_mammalsremaining` | `number` | `0` | Tracks remaining valid mammal spawns (rabbit, mole, carrat); prevents overpopulation during quakes. |
| `_task` | `Task` | `nil` | Future task scheduled to transition between quake states (WAITING → WARNING → QUAKING). |
| `_frequencymultiplier` | `number` | `TUNING.QUAKE_FREQUENCY_MULTIPLIER` | Global multiplier applied to next quake delay (e.g., for mod overrides). |
| `_quakedata` | `table` | `nil` | Configuration data for quake timing, duration, debris, and mammals. Populated in initialization. |
| `_debris` | `table` | Default loot table (rocks, flint, gems, etc.) | Global fallback debris table when no matching tile tag is found. |
| `_tagdebris` | `table` | `{ lunacyarea = ..., nocavein = {} }` | Tile-tag-specific debris tables, indexed by tile tag name. |
| `_activeplayers` | `table` | `{}` | List of players currently subscribed to quake debris events. |
| `_scheduleddrops` | `table` | `{}` | Maps player entities to their pending drop-task references. |
| `_pausesources` | `SourceModifierList` | Initialized with `boolean` mode and `false` default | Tracks paused states of earthquakes (e.g., from world mods or achievements). |
| `_quakesoundintensity` | `net_tinybyte` | `0` | Network variable indicating quake sound intensity: `0` (off), `1` (warning), `2` (quaking). |
| `_miniquakesoundintensity` | `net_bool` | `false` | Network variable indicating whether a mini-quake is playing. |

## Main Functions

### `SetQuakeData(data)`
* **Description:** Sets the global quake configuration (timing, debris, mammals) and schedules the next quake if enabled (non-zero frequency multiplier).
* **Parameters:** `data` — A table containing `warningtime`, `quaketime`, `debrispersecond`, `nextquake`, and optionally `mammals` fields, each supporting functions for dynamic values.

### `SetDebris(data)`
* **Description:** Replaces the global fallback debris loot table.
* **Parameters:** `data` — An array of debris table entries, each with `weight` (number) and `loot` (array of prefab names).

### `SetTagDebris(tile, data)`
* **Description:** Assigns or clears a tile-specific debris table (for overwriting fallback debris on specific tile types like `lunacyarea` or `nocavein`).
* **Parameters:** `tile` — Tile tag string; `data` — Debris table or an empty table to prevent debris on that tile.

### `IsQuaking()`
* **Description:** Returns `true` if a full quake or mini-quake is currently active (sound intensity > 1 or mini-quake active).
* **Returns:** `boolean`

## Events & Listeners

- **Listens to:**
  - `quakesoundintensitydirty`: Triggers `OnQuakeSoundIntensityDirty` on non-dedicated clients to manage global earthquake sound playback and intensity.
  - `miniquakesoundintensitydirty`: Triggers `OnMiniQuakeSoundIntensityDirty` on non-dedicated clients to manage mini-quake sound playback.
  - `ms_playerjoined` (on master): Triggers `OnPlayerJoined` to add player to active players list and schedule drops if quaking.
  - `ms_playerleft` (on master): Triggers `OnPlayerLeft` to cancel pending drops and remove player from active list.
  - `ms_miniquake` (on master): Triggers `OnMiniQuake` to handle mini-quake events (spawn debris, shake cameras, play sound).
  - `ms_forcequake` (on master): Triggers `OnForceQuake` to immediately start a quake (full or override), returning `false` if already quaking.
  - `explosion` (on master): Triggers `OnExplosion` to accelerate or skip warning phase depending on quake state.
  - `pausequakes` (on master): Adds a pause modifier via `_pausesources`.
  - `unpausequakes` (on master): Removes a pause modifier via `_pausesources`.

- **Emits:**
  - `startquake`: Sent when a full quake begins, with payload `{ duration = ..., debrisperiod = ... }`.
  - `warnquake`: Sent during the warning phase before the main quake starts.
  - `endquake`: Sent when a full quake ends (after quake time expires).

## Events & Listeners
*Listens to world-scoped events (as detailed in the table above). Does not emit any custom events beyond those listed.*