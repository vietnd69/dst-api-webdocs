---
id: maputil
title: Maputil
description: Provides utility functions for world topology management, pathfinding validation, and static layout placement.
tags: [world, navigation, topology, layout]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 183df68b
system_scope: world
---

# Maputil

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`maputil.lua` is a utility module that provides helper functions for working with the game's topology graph (navigation mesh), including finding closest nodes, reconstructing valid connections, computing convex hulls, and placing static layouts. It does not implement an entity component; all its functions are standalone and operate directly on `TheWorld.topology` and the map system. Key responsibilities include topology validation (ensuring edges represent traversable terrain), dynamic room insertion via static layouts, and debugging visualization.

## Usage example
```lua
-- Show the convex hull around the player's current area
PlayerSub(5)

-- Reconstruct the world topology to validate all connections
ReconstructTopology(TheWorld.topology)

-- Place a static layout near a given tile coordinate
StaticLayoutPlacer.TryToPlaceStaticLayoutNear(layout, 10, -15,
    StaticLayoutPlacer.ScanForStaticLayoutPosition_Spiral,
    StaticLayoutPlacer.TileFilter_Impassable)
```

## Dependencies & tags
**Components used:** `scenariorunner` (via `ent.components.scenariorunner:Run()`)
**Tags:** None identified

## Properties
No public properties.

## Main functions
### `GetClosestNode(x, y)`
*   **Description:** Finds the nearest node in `TheWorld.topology.nodes` to the given world coordinates. Ignores nodes with no neighbours.
*   **Parameters:** 
    *   `x` (number) — World X coordinate.
    *   `y` (number) — World Y coordinate (Z-axis in 3D space).
*   **Returns:** `node` (table) — The closest topology node, or `nil` if no valid nodes exist.

### `GetClosestNodeToPlayer()`
*   **Description:** Returns the closest node to the current player’s position.
*   **Parameters:** None.
*   **Returns:** `node` (table) — The closest topology node, or `nil`.

### `ShowClosestNodeToPlayer()`
*   **Description:** Visually highlights the closest node to the player on the minimap using a circular revealed area.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `convexHull(points)`
*   **Description:** Computes the convex hull of a set of 2D points using the monotone chain algorithm.
*   **Parameters:** 
    *   `points` (array of `{[x], [y]}`) — Array of 2-element coordinate tables.
*   **Returns:** `hull` (array) — Array of points in counter-clockwise order forming the convex hull.

### `GrabSubGraphAroundNode(node, numnodes)`
*   **Description:** Greedily selects `numnodes` connected nodes starting from the given node by walking through random neighbours.
*   **Parameters:** 
    *   `node` (table) — Starting node in `TheWorld.topology.nodes`.
    *   `numnodes` (number, optional, default `5`) — Number of nodes to select.
*   **Returns:** `selected` (array of nodes) — List of selected nodes.

### `PlayerSub(count)`
*   **Description:** Highlights the boundary of the convex hull of the player's surrounding area on the minimap.
*   **Parameters:** 
    *   `count` (number, optional, default `5`) — Number of nodes to consider (passed to `GrabSubGraphAroundNode`).
*   **Returns:** Nothing.

### `MapHideAll()`
*   **Description:** Clears all revealed minimap areas.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ShowWalkableGrid(graph)`
*   **Description:** Draws debug points along all edges in the topology grid at ~5-unit intervals, visible on the minimap.
*   **Parameters:** 
    *   `graph` (table, optional, default `TheWorld.topology`) — Topology graph to visualize.
*   **Returns:** Nothing.

### `DrawWalkableGrid(graph)`
*   **Description:** Draws debug lines for all edges in the topology grid using the debug renderer.
*   **Parameters:** 
    *   `graph` (table, optional, default `TheWorld.topology`) — Topology graph to visualize.
*   **Returns:** Nothing.

### `ReconstructTopology(graph)`
*   **Description:** Rebuilds and validates the topology graph. Removes invalid edges (e.g., connections spanning non-traversable terrain) and rebuilds neighbour relationships and supporting data structures.
*   **Parameters:** 
    *   `graph` (table, optional, default `TheWorld.topology`) — Topology graph to reconstruct.
*   **Returns:** Nothing.

### `StaticLayoutPlacer.TryToPlaceStaticLayoutNear(layout, tx, ty, scanmethodfn, scanfilterfn)`
*   **Description:** Attempts to find a valid placement for a static layout near the given tile coordinates using a scanning strategy, and inserts it into the world and topology.
*   **Parameters:** 
    *   `layout` (table) — Static layout definition (typically from `map/static_layouts/`).
    *   `tx` (number) — Target tile X coordinate.
    *   `ty` (number) — Target tile Y coordinate.
    *   `scanmethodfn` (function) — Scanning function (e.g., `ScanForStaticLayoutPosition_Spiral`).
    *   `scanfilterfn` (function) — Tile filter function (e.g., `TileFilter_Impassable`).
*   **Returns:** `success` (boolean) — `true` if placement succeeded, otherwise `false`.

### `StaticLayoutPlacer.ScanForStaticLayoutPosition_Spiral(tx, ty, size, displacement, filterfn)`
*   **Description:** Searches for a valid tile position in a spiral pattern starting at `(tx, ty)` that satisfies the provided filter.
*   **Parameters:** 
    *   `tx`, `ty` (numbers) — Starting tile coordinates.
    *   `size` (number) — Size (in tiles) of the area to check.
    *   `displacement` (number) — Step size for scanning.
    *   `filterfn` (function) — Filter function returning `true` for valid tiles.
*   **Returns:** `tx2`, `ty2` (numbers) — Valid tile coordinates, or `nil` if not found.

### `StaticLayoutPlacer.TileFilter_Impassable(tileid)`
*   **Description:** Returns `true` if the tile is impassable (e.g., water, deep water).
*   **Parameters:** 
    *   `tileid` (number) — Tile ID.
*   **Returns:** `boolean`.

### `StaticLayoutPlacer.AddTopologyData(topology, left, top, width, height, room_id, tags)`
*   **Description:** Creates a new rectangular node in the topology graph and updates internal node and ID mappings.
*   **Parameters:** 
    *   `topology` (table) — Topology graph to modify.
    *   `left`, `top`, `width`, `height` (numbers) — Tile-space rectangle dimensions.
    *   `room_id` (string) — Unique identifier for the node.
    *   `tags` (table of strings) — Tags to assign to the node.
*   **Returns:** `index` (number) — Index of the newly created node.

### `StaticLayoutPlacer.AddTileNodeIdsForArea(node_index, left, top, width, height)`
*   **Description:** Maps the specified tile area to the given node index in the world map.
*   **Parameters:** 
    *   `node_index` (number) — Index of the topology node.
    *   `left`, `top`, `width`, `height` (numbers) — Tile-space rectangle.
*   **Returns:** Nothing.

### `StaticLayoutPlacer.SpawnLayout_AddFn(...)`
*   **Description:** Callback used by `object_layout.Place` to spawn prefabs and run their `scenariorunner` if present.
*   **Parameters:** (Internal use only; see `map/object_layout.lua` for calling convention.)
*   **Returns:** Nothing.

## Events & listeners
Not applicable.