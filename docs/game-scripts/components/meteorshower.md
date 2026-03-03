---
id: meteorshower
title: Meteorshower
description: Manages timed meteor shower events on a map spawner entity, including level selection, spawning logic, cooldown handling, and save/load state persistence.
tags: [environment, world, event]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 1da1758d
system_scope: world
---

# Meteorshower

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`MeteorShower` controls a map-local meteor spawner entity (typically `rockmoon`, `moonspawner`, or similar). It handles cyclic behavior: starting a shower phase (spawning meteors over time), then entering a cooldown phase before repeating. The component supports multiple intensity levels, randomizes parameters (duration, rate, meteor counts), manages offscreen spawn rate reduction, and persists state across saves. It interacts with `worldmeteorshower` for global rock-moon-shell odds and uses `easing.outSine` to distribute spawn points.

## Usage example
```lua
local spawner = SpawnPrefab("rockmoon")
spawner:AddComponent("meteorshower")
spawner.components.meteorshower:StartShower(1)  -- start level 1 shower manually
```

## Dependencies & tags
**Components used:** `worldmeteorshower` (only to query odds via `GetRockMoonShellWaveOdds()`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | Entity reference | `nil` | The entity this component is attached to. Set in constructor. |
| `dt` | number or nil | `nil` | Time interval (in seconds) between meteor spawns during a shower. `nil` when not showering. |
| `spawn_mod` | number or nil | `nil` | Spawning modifier applied when offscreen to reduce spawn rate. |
| `medium_remaining` | number or nil | `nil` | Number of medium meteors allowed this shower. |
| `large_remaining` | number or nil | `nil` | Number of large meteors allowed this shower. |
| `retries_remaining` | number or nil | `nil` | Number of retries left before forcing cooldown exit. |
| `task` | periodic task or nil | `nil` | Periodic task driving the shower/cooldown loop. |
| `tasktotime` | number or nil | `nil` | World time when the current task should terminate. |
| `level` | number | `1–3` | Selected meteor shower level (1-based index of `SHOWER_LEVELS`). |
| `should_have_rock_moon_shell` | boolean or nil | `nil` | Whether this shower wave should produce one rock-moon-shell meteor. Set during shower start. |

## Main functions
### `IsShowering()`
* **Description:** Checks if the meteor shower is currently active (spawning meteors).
* **Parameters:** None.
* **Returns:** `true` if `self.dt` is non-`nil`, otherwise `false`.

### `IsCoolingDown()`
* **Description:** Checks if the component is currently in the cooldown phase (waiting before next shower).
* **Parameters:** None.
* **Returns:** `true` if a task exists and `self.dt` is `nil`; otherwise `false`.

### `SpawnMeteor(mod)`
* **Description:** Spawns a single meteor at a randomized position near the spawner, applying size constraints and rock-moon-shell logic. Respects remaining medium/large quotas and offscreen modifier `mod`.
* **Parameters:** `mod` (number or `nil`) – spawn rate modifier. Defaults to `1` if `nil`.
* **Returns:** The spawned `shadowmeteor` prefab instance, or `nil` if no valid spawn point found.
* **Error states:** Returns `nil` if `FindValidPositionByFan` fails to locate a passable point.

### `StartShower(level)`
* **Description:** Begins a meteor shower for the given `level` (or a random level if `nil`). Calculates randomized parameters (duration, rate, meteor quotas) from `SHOWER_LEVELS`, then starts a periodic task to call `OnUpdate`.
* **Parameters:** `level` (number or `nil`) – shower intensity level (`1`, `2`, or `3`). If omitted, a random level is chosen.
* **Returns:** Nothing.
* **Error states:** No shower starts if computed duration or rate is `<= 0`.

### `StopShower()`
* **Description:** Immediately terminates the current shower (if active) or cooldown, canceling the periodic task and resetting state fields.
* **Parameters:** None.
* **Returns:** Nothing.

### `StartCooldown()`
* **Description:** Enters the cooldown phase, scheduling a retry-based periodic task (`OnCooldown`) that re-evaluates whether to start the next shower based on player proximity or retry exhaustion.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No task starts if randomized cooldown duration is `<= 0`.

### `OnSave()`
* **Description:** Returns a serializable state table for persistence, including remaining time, interval, quotas, and version info.
* **Parameters:** None.
* **Returns:** A table with keys: `level`, `remainingtime`, `interval`, `mediumleft`, `largeleft`, `retriesleft`, `version`.
* **Error states:** Returns `nil` early (due to an explicit `return` statement before the table).

### `OnLoad(data)`
* **Description:** Restores component state from a previously saved table. Supports version 2 format and legacy retrofits. Rebuilds tasks based on saved values.
* **Parameters:** `data` (table or `nil`) – saved state data.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string describing current phase, remaining time, interval, quotas, and retry count.
* **Parameters:** None.
* **Returns:** A string like `"Level 2 SHOWERING: 10.50, interval: 0.33 (mod: 1.0), stock: (3 large, 5 medium, unlimited small)"` or similar.

## Events & listeners
- **Listens to:** None explicitly registered.
- **Pushes:** None explicitly fired.

> **Note:** The function `OnSave` currently contains a `return` statement before the table construction block, meaning it always returns `nil`. This may be a bug or intentional placeholder; no state is persisted as written.
