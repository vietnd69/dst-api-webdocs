---
id: distancetracker
title: Distancetracker
description: Tracks the distance an entity travels between update frames by recording its position and computing Euclidean displacement.
tags: [locomotion, tracking, utility]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: ee127131
system_scope: locomotion
---

# Distancetracker

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`DistanceTracker` is a lightweight component that records and computes the distance an entity moves per frame. It is attached to an entity and updates continuously via the `OnUpdate` callback, storing the entity's previous position to calculate incremental travel distance. It is primarily used for telemetry, statistics, or gameplay logic that depends on movement distance.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("distancetracker")
-- The component automatically begins tracking distance every frame.
-- No further interaction is typically required.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `previous_pos` | `Point` (or `nil`) | `nil` | Stores the last known world position of the entity (in `Point` format) for delta calculation. |
| `inst` | `Entity` | — | Reference to the entity the component is attached to. |

## Main functions
### `OnUpdate(dt)`
*   **Description:** Called each frame to compute the Euclidean distance traveled since the last update. Updates `previous_pos` with the current position.
*   **Parameters:** `dt` (number) — delta time since last frame.
*   **Returns:** Nothing.
*   **Error states:** If `previous_pos` is `nil` (e.g., on the first update), distance is recorded as `0`.

## Events & listeners
*None identified.*
