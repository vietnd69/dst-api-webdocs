---
id: wander
title: Wander
description: Controls an entity to move randomly within a defined area relative to a home position, using pathfinding and obstacle avoidance to navigate.
tags: [ai, locomotion, navigation]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: behaviour
source_hash: 49b41fbf
system_scope: locomotion
---

# Wander

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Wander` is a behaviour node that causes an entity to explore a local area by moving in randomized directions while optionally respecting a home location and distance constraints. It integrates with the `locomotor` component to perform movement (walking or running), pathfinding, and stopping, while dynamically handling aquatic vs. terrestrial movement and wall avoidance. This component is typically used for passive entities (e.g., animals, minions) that require naturalistic idle motion.

## Usage example
```lua
-- Example setup for a passive creature with wander AI
local inst = CreateEntity()
inst:AddComponent("locomotor")

-- Define wander parameters
local wander_data = {
    wander_dist = 10,
    wander_dist = 15,
    offest_attempts = 6,
    ignore_walls = false,
    should_run = false,
}

local times = {
    minwalktime = 2,
    randwalktime = 3,
    minwaittime = 1,
    randwaittime = 2,
}

inst:Add BehaviourNode("wander", nil, 20, times, nil, nil, nil, wander_data)
```

## Dependencies & tags
**Components used:** `locomotor`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `homepos` | `vector` or `function` | `nil` | Home position (or function returning it); if `nil`, no leash to home. |
| `maxdist` | `number` or `function` | `nil` | Maximum distance from home (or function returning it). |
| `wander_dist` | `number` or `function` | `12` | Target radius for random wandering. |
| `ignore_walls` | `boolean` or `nil` | `nil` | If true, ignore walls during wander pathfinding. |
| `offest_attempts` | `number` | `8` | Number of attempts to find a valid offset point. |
| `should_run` | `boolean` or `nil` | `nil` | If true, entity runs instead of walks. |
| `leashwhengoinghome` | `boolean` or `nil` | `nil` | If true, entity remains leashed (cannot wander far) when returning home. |
| `times` | table | See constructor | Contains `minwalktime`, `randwalktime`, `minwaittime`, `randwaittime`, and `no_wait_time` flags. |
| `getdirectionFn` / `setdirectionFn` | `function` or `nil` | `nil` | Optional functions to retrieve/set direction angle (e.g., for memory or external control). |
| `checkpointFn` | `function` or `nil` | `nil` | Optional callback used by offset finders for custom checks. |

## Main functions
### `Visit()`
* **Description:** Core behaviour node tick function. Manages transitions between waiting and walking phases, calculates whether to return home or pick a new wander direction, and coordinates motion via `locomotor`.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None; silently handles edge cases (e.g., no home set, aquatic movement, wall collisions).

### `PickNewDirection()`
* **Description:** Determines a new target point or direction for movement. If far from home, moves toward home. Otherwise, attempts to find a swimmable/walkable offset in a random or specified direction. Delegates to `LocoMotor:GoToPoint` or `LocoMotor:WalkInDirection`.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** If no valid direction/point is found, falls back to random direction or `WalkInDirection` with no offset.

### `HoldPosition()`
* **Description:** Stops movement and initiates a waiting period before next action.
* **Parameters:** None.
* **Returns:** Nothing.

### `Wait(t)`
* **Description:** Schedules the next action after a delay `t`, and calls `Sleep(t)` for the behaviour node.
* **Parameters:** `t` (number) — duration to wait in seconds.
* **Returns:** Nothing.

### `GetHomePos()`
* **Description:** Returns the resolved home position (either a vector or result of `homepos` function).
* **Parameters:** None.
* **Returns:** `vector` or `nil`.

### `GetDistFromHomeSq()`
* **Description:** Returns the squared distance from the entity to its home position.
* **Parameters:** None.
* **Returns:** `number` or `nil` if no home is set.

### `IsFarFromHome()`
* **Description:** Checks whether the entity is beyond its maximum allowed distance from home.
* **Parameters:** None.
* **Returns:** `boolean`.

### `GetMaxDistSq()`
* **Description:** Returns the squared maximum distance allowed from home (computed from `maxdist`).
* **Parameters:** None.
* **Returns:** `number`.

### `DBString()`
* **Description:** Returns a debug string summarizing current state (walking/waiting, time remaining, home position, distance from home).
* **Parameters:** None.
* **Returns:** `string`.

## Events & listeners
None identified.
