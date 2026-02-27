---
id: layout
title: Layout
description: A utility module for computing force-directed layouts of node clusters using physics-based repulsion and attraction forces.
tags: [layout, positioning, physics, utility]
last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: environment
source_hash: 38c6472f
---

# Layout

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `Layout` module is a standalone utility that provides algorithms for arranging node entities in 2D space using a force-directed graph layout approach. It does not implement an Entity Component System component; instead, it defines reusable functions (`ForceDirected`, `KeepAwayFromWall`, `KeepAwayFromPoints`, and `RunForceDirected`) that operate on arbitrary node tables with position and velocity fields. It is typically used during world generation or room layout planning to organically space entities (e.g., loot, props, or structural elements) within a bounded area while respecting spatial constraints.

The module exposes a single table `layout` with three key functions: `run`, `avoidwall`, and `avoidpoints`, which wrap internal logic for layout execution and obstacle avoidance.

## Usage example

```lua
local layout = require "map/layout"

-- Define a node table where each node has:
-- node.data.position = {x = 0, y = 0}
-- node.data.dx = 0 -- velocity x
-- node.data.dy = 0 -- velocity y
-- node:IsConnectedTo(otherNode) -> boolean
-- node:UpdateMovePositionWithConstraint(fn) -> void

local nodes = {
    { id = "a", data = { position = {x=0, y=0}, dx=0, dy=0 }, IsConnectedTo = function() return false end, UpdateMovePositionWithConstraint = function() end },
    { id = "b", data = { position = {x=1, y=0}, dx=0, dy=0 }, IsConnectedTo = function() return true end, UpdateMovePositionWithConstraint = function() end },
}

local center = {x = 10, y = 10}
local constrainFn = function(x, y) return x, y end -- placeholder constraint

layout.run(center, nodes, function(x, y) return 0, 0 end, constrainFn)
```

## Dependencies & tags
**Components used:** None. This module does not interact with entity components directly and is stateless.
**Tags:** None identified.

## Properties
No public properties are defined in this module.

## Main functions

### `ForceDirected(nodes, springForce, chargeForce, dampingForce, globalEffectFN, constrainFn)`
* **Description:** Computes and applies forces to each node based on connections and mutual repulsion, updating velocities. This is the core physics engine of the layout system.
* **Parameters:**
  * `nodes`: Table of node objects. Each node must have:
    * `node.data.position` (table `{x, y}`)
    * `node.data.dx`, `node.data.dy` (velocity accumulators, updated in-place)
    * `node:IsConnectedTo(otherNode)` → boolean
    * `node:UpdateMovePositionWithConstraint(constrainFn)` → void (applies constraint to position and resets velocities)
  * `springForce`: Number. Target distance for connected (spring) nodes to maintain.
  * `chargeForce`: Number. Scaling factor for repulsive force between all node pairs.
  * `dampingForce`: Number. Velocity decay factor applied per iteration (e.g., 0.5 halves velocity).
  * `globalEffectFN`: Function `(x, y) -> dx, dy`. Optional global force field (currently disabled in code).
  * `constrainFn`: Function `(x, y) -> newX, newY`. Constraint function applied to position after force accumulation.
* **Returns:** `total_kinetic_energy` (number). Sum of squared velocities across all nodes (a proxy for system stability).
* **Error states:** May return `0` if forces evaluate to `NaN` or `inf` (explicitly handled by clamping). Requires all node fields to be correctly initialized; missing fields may cause runtime errors.

### `KeepAwayFromWall(wall, x, y, attract)`
* **Description:** Computes scalar repulsion (or attraction if `attract` is true) force magnitude exerted on position `(x, y)` by a rectangular wall boundary.
* **Parameters:**
  * `wall`: Table `{center = {x, y}, width = number, height = number}` defining the wall bounds.
  * `x`, `y`: Numbers. Position to evaluate.
  * `attract`: Boolean. If true, force direction is reversed (attraction instead of repulsion).
* **Returns:** Force magnitude (number). Positive value indicates repulsion, negative attraction when `attract` is true.
* **Error states:** Uses `assert(not isnan(force))` and `assert(not isinf(force))` internally; illegal values will cause a runtime assertion failure.

### `KeepAwayFromPoints(points, x, y, attract)`
* **Description:** Computes cumulative repulsive force vector (dx, dy) exerted on position `(x, y)` by a list of point obstacles.
* **Parameters:**
  * `points`: List of tables `{x = number, y = number}` representing point obstacles.
  * `x`, `y`: Numbers. Position to evaluate.
  * `attract`: Boolean. Currently unused; force is always repulsive.
* **Returns:** `dxAcc, dyAcc` (two numbers). Net repulsive force components.
* **Error states:** Includes a bug in the reference code: `dyAcc = dyAcc + dx` should be `dyAcc = dyAcc + dy`. May return zero if forces are invalid (`isbadnumber` check suppresses errors).

### `RunForceDirected(center, nodes, layoutFn, constrainFn)`
* **Description:** Runs the force-directed layout algorithm on `nodes` to distribute them around a `center` point within a predefined area, respecting constraints. Performs up to 100 iterations until system kinetic energy drops below `0.5`.
* **Parameters:**
  * `center`: Table `{x, y}`. Center point of the layout zone.
  * `nodes`: Table of node objects (same requirements as `ForceDirected`).
  * `layoutFn`: Function `(x, y) -> dx, dy`. Optional global force (currently unused).
  * `constrainFn`: Function `(x, y) -> newX, newY`. Position constraint applied per iteration.
* **Returns:** `nil`. Modifies node positions in-place via `UpdateMovePositionWithConstraint`.
* **Error states:** Not directly documented, but may fail or behave unexpectedly if node tables lack required fields (`data`, `IsConnectedTo`, `UpdateMovePositionWithConstraint`).

## Events & listeners
This module has no event system or interaction with DST's event infrastructure. It is purely functional and stateless.