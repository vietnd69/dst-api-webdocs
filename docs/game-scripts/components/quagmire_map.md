---
id: quagmire_map
title: Quagmire Map
description: Extends the world map functionality with Quagmire-specific terrain checks, specifically identifying farmable Quagmire soil and evaluating tillability at a given point.
tags: [quagmire, terrain, map, farming]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: d7470f44
system_scope: world
---

# Quagmire Map

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This component supplements the core `map` system by adding Quagmire-specific logic for farmland detection and soil tillability. It is not a standalone ECS component but a set of extension methods added to the global `Map` object (the world map instance). The functions help determine where crops can be planted by validating terrain type and checking for interfering placed entities.

## Usage example
```lua
local pt = Vector3(x, y, z)
if TheWorld.Map:IsFarmableSoilAtPoint(x, y, z) then
    -- terrain is Quagmire soil; safe to consider planting
end

if TheWorld.Map:CanTillSoilAtPoint(pt) then
    -- point is tillable (farmable soil and no planted soil blocks present)
end
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** Uses `plantedsoil` internally as a must-tag when querying entities.

## Properties
No public properties.

## Main functions
### `IsFarmableSoilAtPoint(x, y, z)`
*   **Description:** Checks whether the tile at the specified world coordinates is Quagmire farmland (i.e., `QUAGMIRE_SOIL`).
*   **Parameters:**  
    * `x` (number) — World X coordinate.  
    * `y` (number) — World Y coordinate.  
    * `z` (number) — World Z coordinate.
*   **Returns:** `true` if the tile at `(x, y, z)` is `WORLD_TILES.QUAGMIRE_SOIL`; otherwise `false`.

### `CanTillSoilAtPoint(pt)`
*   **Description:** Determines whether the soil at the given point can be tilled — that is, if it is farmable Quagmire soil and no entity with the `plantedsoil` tag occupies the same tile.
*   **Parameters:**  
    * `pt` (Vector3 or table with `.x`, `.z`) — World position to check.
*   **Returns:** `true` if the point is tillable; otherwise `false`.
*   **Error states:** Returns `false` if the tile is not `QUAGMIRE_SOIL`, or if any entity at radius `1` with the `plantedsoil` tag is present at the point.

## Events & listeners
Not applicable.
