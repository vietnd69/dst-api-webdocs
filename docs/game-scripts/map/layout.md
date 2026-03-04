---
id: layout
title: Layout
description: Provides utility functions for force-directed layout of nodes in 2D space, including repulsion from walls and points.
tags: [layout, physics, map]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: map
source_hash: 38c6472f
system_scope: map
---

# Layout

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `layout` module is a collection of utility functions used to compute and apply force-directed positioning for node-based layouts in 2D space. It is primarily used for arranging entities or points in maps (e.g., room layout generation, visual layout of grottoes or static layouts) by simulating physical forces such as spring attraction between connected nodes and repulsion from walls and other points. This module does not attach to entities or act as a component—it is a standalone utility module with exported functions.

## Usage example
```lua
local layout = require "map.layout"

local nodes = {
    { id = 1, data = { position = {x=0,y=0}, dx=0, dy=0, connected_to = {} } },
    { id = 2, data = { position = {x=1,y=1}, dx=0, dy=0, connected_to = {} } },
}

-- Connect nodes (example-only; logic must be implemented externally)
nodes[1].data.connected_to[nodes[2].id] = true
nodes[2].data.connected_to[nodes[1].id] = true

layout.run({x=0, y=0}, nodes, function() return 0,0 end, function(node) end)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
### `RunForceDirected(center, nodes, layoutFn, constrainFn)`
*   **Description:** Runs an iterative force-directed layout algorithm to position nodes around a center point. Nodes are repelled from each other (via charge force), pulled toward connected neighbors (via spring force), slowed via damping, and optionally guided by a custom layout function and constraint function. Stops when kinetic energy falls below `0.5` or after 100 iterations.
*   **Parameters:**
    *   `center` (table with `x`, `y` fields) - The reference center point for layout.
    *   `nodes` (array of node tables) - Each node table must contain a `data` field with `position` (table `{x,y}`), `dx` (number, velocity), `dy` (number, velocity), and `IsConnectedTo(otherNode)` method.
    *   `layoutFn` (function: `(x, y) -> dx, dy`) - Optional custom force function that returns per-axis adjustments; used to incorporate environment-specific constraints (e.g., walls).
    *   `constrainFn` (function: `(node) -> nil`) - Function applied per-node to enforce position constraints (e.g., bounding boxes).
*   **Returns:** Nothing.
*   **Error states:** None documented; assumes valid node structures.

### `ForceDirected(nodes, springForce, chargeForce, dampingForce, globalEffectFN, constrainFn)`
*   **Description:** Internal helper function implementing the core force computation loop for `RunForceDirected`. Computes pairwise forces between nodes and updates velocities accordingly.
*   **Parameters:**
    *   `nodes` (array of node tables) - Same structure as `RunForceDirected`.
    *   `springForce` (number) - Target distance for connected nodes to maintain.
    *   `chargeForce` (number) - Strength of repulsion between unconnected nodes.
    *   `dampingForce` (number) - Multiplier applied to velocity to reduce kinetic energy each iteration.
    *   `globalEffectFN` (function: `(x, y) -> force`) - Unused in current code (commented out), retained for extensibility.
    *   `constrainFn` (function: `(node) -> nil`) - Same as `RunForceDirected`.
*   **Returns:** `total_kinetic_energy` (number) - Sum of squared velocities across all nodes.
*   **Error states:** Returns early with `force = 0` if `isbadnumber(force)` is true for any computed force.

### `KeepAwayFromWall(wall, x, y, attract)`
*   **Description:** Computes a scalar repulsion (or attraction if `attract` is `true`) force from a rectangular wall boundary defined by `wall.center` and `wall.width/height`.
*   **Parameters:**
    *   `wall` (table with `center` `{x,y}`, `width`, `height`) - Defines the rectangular obstacle.
    *   `x`, `y` (numbers) - Current position coordinates.
    *   `attract` (boolean) - If `true`, inverts the force to *attract* toward the wall instead of repelling.
*   **Returns:** `force` (number) - Net scalar force magnitude.
*   **Error states:** Assertion fails if `isnan(force)` or `isinf(force)`—should not occur for valid inputs.

### `KeepAwayFromPoints(points, x, y, attract)`
*   **Description:** Computes net 2D force vector to repel (or attract if `attract` is `true`) from a set of point obstacles.
*   **Parameters:**
    *   `points` (array of tables with `x`, `y`) - List of point locations to avoid (or seek).
    *   `x`, `y` (numbers) - Current position.
    *   `attract` (boolean) - If `true`, inverts the repulsion to attraction.
*   **Returns:** `dx`, `dy` (numbers) - Net force vector components.
*   **Error states:** If `isbadnumber(force)` occurs, that node's contribution is skipped.

### `printNodes(nodelist)`
*   **Description:** Utility function to generate a human-readable string of node positions (floored to integers) for debugging.
*   **Parameters:**
    *   `nodelist` (array of node tables) - Same node structure as other functions.
*   **Returns:** `str` (string) - Formatted string of node coordinates.

## Events & listeners
None identified.
