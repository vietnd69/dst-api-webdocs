---
id: hallucinations
title: Hallucinations
description: Manages the spawning and tracking of environment-based hallucination entities (e.g., Creepy Eyes, Shadow Watcher, Shadow Skittish) in response to player sanity, lighting, and time-of-day conditions.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 59fa2c90
---

# Hallucinations

## Overview
This component governs the lifecycle of hallucination entities—temporary visual disturbances spawned near the player based on their sanity, ambient light levels, and time of day. It dynamically spawns, tracks, and removes hallucinations by monitoring player state, lighting, and night cycles.

## Dependencies & Tags
- **Components Required via `inst`:** None explicitly added by this component.
- **Tags Used Internally:**
  - `fire` (must-tag for `shadowwatcher` search)
  - `_equippable` (prohibited-tag for `shadowwatcher` search)
  - All `FUELTYPE` values appended with `"_fueled"` (e.g., `"wood_fueled"`, `"greengas_fueled"`) to identify active fire sources for `shadowwatcher` placement logic.
- **Watched World States:** `isnight`, `isfullmoon`
- **Listened Events:** `playeractivated`, `playerdeactivated`, `onremove` (attached to hallucination entities), and `nightvision` (attached per-player)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (assigned via constructor) | The root entity to which this component is attached (typically the world or a manager). |
| `_player` | `Entity?` | `nil` | Reference to the currently active player. |
| `_hallucinations` | `table` | `{}` | Internal registry of hallucination types, each containing `name`, `params`, and `count`. |
| `_fueltags` | `table<string>` | `{}` | List of fuel-related tags used to detect burning fire sources. Populated from `FUELTYPE`. |

## Main Functions
### `RestartHallucination(hallucination)`
* **Description:** Starts or restarts a hallucination task after an initial random delay (`initial_variance * random()`), ensuring the first spawn is randomized.
* **Parameters:**  
  `hallucination` — A hallucination entry from `_hallucinations`, containing `.params` (with `initial_variance`) and `.task`.

### `RepeatHallucination(hallucination, delay)`
* **Description:** Schedules the next spawn of a hallucination. Uses either a provided `delay` or computes a random delay within `interval ± variance`.
* **Parameters:**  
  `hallucination` — A hallucination entry.  
  `delay` (optional) — A numeric delay override; if omitted, computed as `interval + variance * math.random()`.

### `Start(nightonly)`
* **Description:** Starts all hallucination tasks (or only those matching `nightonly` if specified) that are currently inactive (`.task == nil`).
* **Parameters:**  
  `nightonly` (optional, `boolean?`) — If `true`/`false`, only starts hallucinations where `params.nightonly` matches; if `nil`, starts all inactive hallucinations.

### `Stop(nightonly)`
* **Description:** Cancels all currently scheduled hallucination tasks (or only those matching `nightonly`) by setting `.task = nil`.
* **Parameters:**  
  `nightonly` (optional, `boolean?`) — Filters which hallucinations to stop, mirroring `Start`.

### `self:GetDebugString()`
* **Description:** Returns a comma-separated string listing each hallucination type and its current spawn count for debugging.
* **Parameters:** None.  
* **Returns:** `string?` — E.g., `" 0 creepyeyes, 2 shadowwatcher, 4 shadowskittish"` or `nil` if all counts are zero.

## Events & Listeners
- **Listens for `playeractivated` → `OnPlayerActivated(inst, player)`**  
  Switches the active player context, sets up sanity/lighting observers, and starts hallucinations.
- **Listens for `playerdeactivated` → `OnPlayerDeactivated(inst, player)`**  
  Cleans up the active player reference, cancels tasks, and stops all hallucinations.
- **Listens for `nightvision` on `_player` → `OnIsNight()`**  
  Re-evaluates night-specific hallucinations when the player gains/loses night vision.
- **Watches `isnight` and `isfullmoon` → `OnIsNight()`**  
  Reacts to day/night/full-moon transitions to control night-only hallucinations.
- **Listens for `onremove` on hallucination entities → `StopTracking(ent)`**  
  Decrements the current count for the hallucination type when an entity is removed, allowing new spawns.
- **Triggers `RepeatHallucination(...)` calls**  
  Internally via `spawnfn`s to reschedule the next spawn after each successful or failed spawn attempt.