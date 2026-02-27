---
id: oceanfishingrod
title: Oceanfishingrod
description: Manages ocean fishing mechanics including casting, tension tracking, reeling, and catch logic for the ocean fishing rod in Don't Starve Together.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: 84b70443
---

# Oceanfishingrod

## Overview
This component handles the complete lifecycle of ocean fishing: launching the bobber, tracking the fishing line tension based on target movement and distance, managing the reeling process, calculating catch success or failure conditions, and reporting statistics. It operates on the fishing rod entity and interfaces with the fisher (player), the fishing target (bobber/projectile), and the caught fish.

## Dependencies & Tags
- Relies on components: `replica.oceanfishingrod`, `equippable`, `container`, `locomotor`, `weighable`, `oceanfishable`, `oceanfishinghook`, `complexprojectile`
- Uses tags: `projectile`, `oceanfish`
- Registers replica methods `_SetTarget` and `_SetLineTension` via metatable

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `target` | `Entity` | `nil` | The current fishing target (bobber or fish projectile). |
| `line_dist` | `number` | `nil` | Target distance from fisher along the line; updated during fishing. |
| `line_tension` | `number` | `0` | Current line tension, ranging 0–1. |
| `line_slack` | `number` | `0` | Amount of slack in the line, ranging 0–1. |
| `reeling_line_dist` | `number` | `0.75` | Distance deducted per tick when reeling. |
| `unreel_resistance` | `number` | `0.1` | Multiplier reducing the unreel effect of fish movement on line distance. |
| `projectile_prefab` | `string` | (inferred) | Prefab name of the bobber/projectile to spawn. |
| `casting_base` / `casting_data` | `table` | (from `TUNING`) | Base and combined casting stats from rod/tackle. |
| `lure_base` / `lure_data` | `table` | (from `TUNING`) | Base and combined lure stats (e.g., stamina drain, weights). |
| `default_lure_setup` / `lure_setup` | `table` | `nil` | Contains `fns`, `build`, `symbol` for visual lure representation. |
| `getDefaultProjectile` | `function` | `nil` | Function returning default projectile prefab (unused in current code). |
| `gettackledatafn` | `function` | `nil` | Function used to retrieve current tackle (bobber/lure) data. |
| `fisher` | `Entity` | `nil` | Player entity performing the fishing. |
| `fishing_stats` | `table` | `nil` | Metrics collected during the current fishing session. |

## Main Functions

### `Cast(fisher, targetpos)`
* **Description:** Launches the bobber/projectile toward the calculated cast destination, caches tackle tuning, initializes fishing stats, and begins update loop.
* **Parameters:**
  - `fisher`: Player entity casting the line.
  - `targetpos`: `Vector3` world position where the bobber *intended* to land.

### `Reel()`
* **Description:** Attempts to reel in the target (fish/bobber) by reducing line distance, updating tension. May snap the line if tension exceeds threshold and was previously high.
* **Parameters:** None. Returns `true` if reeling succeeded without snapping, `false` otherwise.

### `SetTarget(new_target)`
* **Description:** Sets the current fishing target, manages cleanup of previous target (e.g., deregisters remove callback, notifies `oceanfishable`), initializes line distance, and registers for `onremove` event on the new target.
* **Parameters:**
  - `new_target`: Entity to set as the active target (typically the bobber or a caught fish projectile).

### `UpdateTensionRating()`
* **Description:** Recalculates `line_tension` and `line_slack` based on the current distance between fisher and target relative to `line_dist`. Applies smoothing and physics-inspired formulas.
* **Parameters:** None.

### `OnUpdate(dt)`
* **Description:** Main loop called every frame during fishing. Validates continuity conditions (fisher still valid, rod equipped, state correct), updates tension, handles unreeling due to fish movement, and stops fishing under failure conditions (too far, line too loose, interrupted).
* **Parameters:**
  - `dt`: Delta time in seconds.

### `CatchFish()`
* **Description:** Finishes a successful catch: launches the caught fish as a projectile toward the fisher, pushes "fishcaught" event, tracks statistics, and cleans up.
* **Parameters:** None.

### `StopFishing(reason, lost_tackle)`
* **Description:** Terminates the current fishing session: stops updates, fires cleanup callbacks, reports final statistics, and clears target/fisher state.
* **Parameters:**
  - `reason`: String describing why fishing stopped (e.g., `"success"`, `"linesnapped"`, `"interrupted"`).
  - `lost_tackle`: Optional boolean indicating if tackle was lost.

### `:LaunchCastingProjectile(source, targetpos, prefab)`
* **Description:** Spawns and configures the bobber projectile, sets its visual properties, speed, and gravity, then launches it.
* **Parameters:**
  - `source`: Entity spawning the projectile (typically the fisher).
  - `targetpos`: `Vector3` destination for bobber landing.
  - `prefab`: Prefab name of the bobber.

### `:LaunchFishProjectile(projectile, srcpos, targetpos)`
* **Description:** Configures and launches the caught fish projectile toward the fisher after catch.
* **Parameters:**
  - `projectile`: Fish entity to launch.
  - `srcpos`: `Vector3` starting position (fish's current position).
  - `targetpos`: `Vector3` destination (fisher's position).

### `:CalcCastDest(src_pos, dest_pos)`
* **Description:** Applies casting accuracy and angle variance to compute the actual landing position of the bobber.
* **Parameters:**
  - `src_pos`: `Vector3` position of the fisher.
  - `dest_pos`: `Vector3` intended destination.

### `:CalcCatchDest(src_pos, dest_pos, catch_dist)`
* **Description:** Computes where the fish projectile should land during catch.
* **Parameters:**
  - `src_pos`: `Vector3` fish’s position.
  - `dest_pos`: `Vector3` fisher’s position.
  - `catch_dist`: Max catch distance from config.

### `_CacheTackleData(bobber, lure)`
* **Description:** Merges stats from bobber and lure into `casting_data` and `lure_data`, and sets projectile prefab.
* **Parameters:**
  - `bobber`: Bobber entity (tackle slot 1).
  - `lure`: Lure entity (tackle slot 2).

### `_CalcCastDest(src_pos, dest_pos)`
* **Description:** Applies casting accuracy and angle variance to compute the actual landing position of the bobber.
* **Parameters:**
  - `src_pos`: `Vector3` position of the fisher.
  - `dest_pos`: `Vector3` intended destination.

### `:UpdateClientMaxCastDistance()`
* **Description:** Updates the client’s maximum cast distance using current tackle stats.
* **Parameters:** None.

### `:SetDefaults(...)`
* **Description:** Initializes default tuning values and projectile prefab for the rod.
* **Parameters:**
  - `default_projectile_prefab`, `default_casting_tuning`, `default_lure_tuning`, `default_lure_setup`: Tuning tables.

### `GetLureData()`, `GetLureFunctions()`, `GetTensionRating()`, `IsLineTensionHigh()`, `IsLineTensionGood()`, `IsLineTensionLow()`, `GetExtraStaminaDrain()`, `GetDebugString()`
* **Description:** Various getters for data and state introspection.
* **Parameters:** None.

## Events & Listeners
- Listens to `"onremove"` event on `target` via `inst:ListenForEvent("onremove", self.target_onremove, self.target)` to nullify `self.target` if the target is destroyed.
- Pushes the following events:
  - `"newfishingtarget"` on fisher (when target changes)
  - `"fishcaught"` on fisher (when fish is successfully caught)
  - `"oceanfishing_stoppedfishing"` on fisher and target (when fishing stops)
  - Triggers `inst:PushEvent("oceanfishing_stoppedfishing", ...)` on target if applicable.