---
id: giantutils
title: Giantutils
description: Utilities for calculating valid wander points around a given location, primarily used for giant AI movement logic.
tags: [ai, movement, utilities]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: e2fea6c2
system_scope: ai
---

# Giantutils

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`giantutils` is a utility module providing helper functions for generating safe wander points for giant characters. It ensures that generated points lie on passable terrain and are unobstructed by obstacles (e.g., walls, trees), using map and pathfinding services. The module is stateless and used by AI behavior systems (e.g., in giant prefabs) to compute movement targets.

## Usage example
```lua
local pt = Vector3(10, 0, -20)
local wander_point = GetWanderAwayPoint(pt)
if wander_point then
    -- Use wander_point as movement target
    inst.Transform:SetPosition(wander_point)
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
### `GetWanderAwayPoint(pt)`
* **Description:** Computes a valid point at a fixed distance (`WANDER_AWAY_DIST = 100`) from `pt` that lies on passable terrain and has a clear path (ignoring walls). Returns `nil` if no valid point is found after sampling 12 points on the circle.
* **Parameters:** `pt` (`Vector3`) – the center point around which to search for a wander location.
* **Returns:** `Vector3` – a valid wander point; or `nil` if none found.
* **Error states:** May return `nil` if no valid location is found within the search circle (e.g., surrounded by impassable terrain or obstacles).

## Events & listeners
None identified