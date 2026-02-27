---
id: wander
title: Wander
description: A behaviour node that causes an entity to wander randomly around a home point or freely, using pathfinding-aware offset calculations and locomotion controls.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: behaviour
system_scope: entity
source_hash: 49b41fbf
---

# Wander

## Overview
The `Wander` component is a behaviour node responsible for implementing randomized movement patterns for entities in the game world. It enables entities to move within a specified distance from a home location (optional) or wander freely, while respecting environmental constraints such as walls, terrain type (aquatic vs. land), and pathfinding rules. The component integrates closely with the `Locomotor` component to issue movement commands (`GoToPoint`, `WalkInDirection`, `Stop`) and conditionally trigger walking or waiting phases based on configurable timing parameters.

Key features include:
- Optional home-based leashing with configurable maximum distance.
- Adaptive direction selection via optional `getdirectionFn`/`setdirectionFn` callbacks.
- Robust fallback logic when no valid offset is found (e.g., tight spaces).
- Support for both walking and running speeds via `should_run`.

## Dependencies & Tags
- **Components used:** `Locomotor`
- **Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `homepos` | `position or function` | `nil` | The home position (or a function returning it). If `nil`, entity is unanchored. |
| `maxdist` | `number or function` | `nil` | Maximum distance from home. Used to determine when to return home. |
| `inst` | `Entity` | — | The entity instance the component is attached to. |
| `wander_dist` | `number or function` | `12` | Target distance from current position to wander to. |
| `ignore_walls` | `boolean` | `nil` | If truthy, pathfinding ignores walls (falls back to ignoring them if LOS fails). |
| `offest_attempts` | `number` | `8` | Number of attempts to find a valid offset using `FindWalkableOffset`/`FindSwimmableOffset`. |
| `should_run` | `boolean or function` | `nil` | If truthy, entity runs instead of walks. |
| `leashwhengoinghome` | `boolean` | `nil` | If truthy, entity remains leashed only when returning home (not during free wandering). |
| `getdirectionFn` | `function` | `nil` | Callback to retrieve a pre-selected direction (e.g., from brain input). |
| `setdirectionFn` | `function` | `nil` | Callback to store the chosen direction for later use. |
| `checkpointFn` | `function` | `nil` | Custom checkpoint filter used during offset calculations. |
| `times.minwalktime` | `number` | `2` | Minimum time to spend walking before re-evaluating. |
| `times.randwalktime` | `number` | `3` | Random additive time added to `minwalktime`. |
| `times.minwaittime` | `number` | `1` | Minimum time to wait (stand still) before resuming walk. |
| `times.randwaittime` | `number` | `3` | Random additive time added to `minwaittime`. |
| `times.no_wait_time` | `boolean` | `false` | Set to `true` if both wait parameters are ≤ 0 (i.e., never wait). |
| `far_from_home` | `boolean` | `false` | Tracks whether the entity is currently beyond `maxdist` from home. |

## Main Functions

### `Visit()`
* **Description:** Core behavior logic executed each tick. Manages transitions between waiting and walking states based on timing, home proximity, and locomotor state.
* **Parameters:** None.
* **Returns:** `void`.

### `GetHomePos()`
* **Description:** Retrieves the home position by evaluating `self.homepos` as a value or function.
* **Parameters:** None.
* **Returns:** `Vector3` or `nil`.

### `GetDistFromHomeSq()`
* **Description:** Returns the squared distance between the entity and home. Avoids expensive square root calculation.
* **Parameters:** None.
* **Returns:** `number` or `nil`.

### `IsFarFromHome()`
* **Description:** Checks whether the entity is beyond `maxdist` from home.
* **Parameters:** None.
* **Returns:** `boolean`.

### `GetMaxDistSq()`
* **Description:** Computes the squared maximum allowed distance from home.
* **Parameters:** None.
* **Returns:** `number`.

### `Wait(t)`
* **Description:** Sets a future time (`self.waittime`) to resume action, and puts the behaviour to sleep for `t` seconds.
* **Parameters:**
  - `t` (`number`): Duration to sleep in seconds.
* **Returns:** `void`.

### `PickNewDirection()`
* **Description:** Initiates a new wandering move. Determines whether to return home or select a new direction:
  - If far from home: walks directly to `homepos`.
  - Otherwise: computes a new offset using `FindWalkableOffset`/`FindSwimmableOffset`, optionally adjusting direction via `getdirectionFn`/`setdirectionFn`, and moves the entity via `Locomotor:GoToPoint()` or `Locomotor:WalkInDirection()`.
* **Parameters:** None.
* **Returns:** `void`.

### `HoldPosition()`
* **Description:** Stops movement and initiates a waiting phase (random wait duration derived from `times.minwaittime` and `randwaittime`).
* **Parameters:** None.
* **Returns:** `void`.

### `DBString()`
* **Description:** Returns a formatted string for debugging, showing current state (walking/waiting), remaining time, home position, distance from home, and direction ("Go Home" or "Go Wherever").
* **Parameters:** None.
* **Returns:** `string`.

## Events & Listeners
- **Listens to:** None.
- **Pushes:** None.