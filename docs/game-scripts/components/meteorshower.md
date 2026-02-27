---
id: meteorshower
title: Meteorshower
description: Manages the periodic spawning, duration, and scheduling of meteor showers centered on a world spawner entity.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 1da1758d
---

# Meteorshower

## Overview
This component governs the behavior of meteor shower events in the game world. It handles three distinct states — `SHOWERING`, `COOLDOWN`, and `STOPPED` — by scheduling periodic tasks, tracking remaining meteor quotas (medium/large), calculating spawn locations with radius-based ease-in logic, and persisting state across game sessions. The component is typically attached to a world-level spawner prefab (e.g., a meteor crater or celestial source) and dynamically responds to player proximity and game time to coordinate realistic, clustered meteor impacts.

## Dependencies & Tags
- `TheWorld.Map`: Used for tile passability checks via `IsPassableAtPoint`.
- `TheWorld.components.worldmeteorshower`: Queried to obtain `rockmoonshell` spawn odds via `GetRockMoonShellWaveOdds()`.
- No explicit component additions or tag modifications observed in this file.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (passed to constructor) | The entity instance this component is attached to (the spawner). |
| `level` | `integer` | Randomly selected from 1–3 | The current meteor shower intensity level, determining spawn parameters from `SHOWER_LEVELS`. |
| `dt` | `number` | `nil` | Time interval between meteor spawns (seconds); `nil` when not showering. |
| `spawn_mod` | `number` | `nil` | Modulator applied to spawn cost and chance during off-screen operation (decreases over time). |
| `medium_remaining` | `integer` | `nil` | Count of remaining medium meteor allowances for the current shower. |
| `large_remaining` | `integer` | `nil` | Count of remaining large meteor allowances for the current shower. |
| `retries_remaining` | `integer` | `nil` | Number of delayed cooldown retries left before forcing a shower start. |
| `task` | `Task` | `nil` | The active periodic task (either `OnUpdate` or `OnCooldown`). |
| `tasktotime` | `number` | `nil` | Game time at which the current task (shower or cooldown) ends. |
| `should_have_rock_moon_shell` | `boolean` | `nil` | Whether this shower wave should spawn a single `shadowmeteor` with `rockmoonshell` size (one-time flag). |

## Main Functions

### `SpawnMeteor(mod)`
* **Description:** Spawns a `shadowmeteor` prefab at a validated position near the spawner, using fan-based offset search and random radial distribution with easing. Applies size (small/medium/large) based on rarity, remaining quotas, and spawn location periphery. If `should_have_rock_moon_shell` is set, it assigns `rockmoonshell` size once.
* **Parameters:**  
  `mod` (`number` or `nil`): Optional spawn cost modifier. If `nil`, defaults to `1`. Used when spawning off-screen (e.g., to reduce spawn rate/frequency).

### `StartShower(level)`
* **Description:** Initiates a meteor shower for the given or randomized level. Validates duration and rate parameters, sets quotas for medium/large meteors, and starts a periodic `OnUpdate` task. May assign `rockmoonshell` to the first meteor in the wave based on world-tier odds.
* **Parameters:**  
  `level` (`integer` or `nil`): The shower level to use; if `nil`, a random level is selected.

### `StopShower()`
* **Description:** Immediately halts any active shower or cooldown tasks, resets all runtime state (`dt`, `task`, quotas, etc.), and clears `should_have_rock_moon_shell`. Idempotent — safe to call multiple times.

### `StartCooldown()`
* **Description:** Begins a cooldown period after a shower. Schedules a periodic `OnCooldown` task that periodically rechecks player proximity and retry counters before restarting a shower. Allows up to `NUM_RETRIES` delays to give players a chance to witness the next shower.
* **Parameters:** None.

### `OnSave()`
* **Description:** Returns a serializable table capturing current state for world persistence. Includes level, normalized remaining time, spawn interval, quotas, and retry counters. (Note: The function currently returns `nil` implicitly due to a stray `return` statement before the table.)
* **Parameters:** None.

### `OnLoad(data)`
* **Description:** Restores component state from saved data, supporting version 2 saves and legacy (pre-version) formats. Re-instantiates appropriate periodic tasks (`OnUpdate` for showering, `OnCooldown` for cooling) and re-applies quotas and timing.
* **Parameters:**  
  `data` (`table` or `nil`): The saved state table, typically from `OnSave()`.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string describing the current state (`SHOWERING`, `COOLDOWN`, or `STOPPED`) and relevant values (e.g., time remaining, quotas, retry count).
* **Parameters:** None.

## Events & Listeners
- **Listens to:** None (does not use `inst:ListenForEvent`).
- **Triggers:** None explicitly; events are internal task-driven callbacks (`OnUpdate`, `OnCooldown`).