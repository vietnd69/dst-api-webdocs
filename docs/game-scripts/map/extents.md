---
id: extents
title: Extents
description: Provides utility functions to compute bounding boxes and minimum bounding radii for collections of nodes and polygon points.
tags: [map, utilities, geometry]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 49d4f117
---

# Extents

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This file contains standalone utility functions for computing spatial extents (axis-aligned bounding boxes) and minimum bounding radii for collections of nodes and polygonal shapes. It does not implement an Entity Component System (ECS) component; rather, it offers standalone helper functions used elsewhere in the map generation and layout systems to calculate spatial bounds. Functions here operate on plain Lua tables representing node data and polygon vertices, and update or return extent metadata including min/max coordinates, size, and radius.

## Usage example
```lua
local extents = ResetextentsForNodes(my_nodes)
print("Bounding box:", extents.xmin, extents.ymin, extents.xmax, extents.ymax)

local poly_extents = ResetextentsForPoly({
    {0, 0},
    {4, 0},
    {4, 3},
    {0, 3}
})
print("Polygon radius:", poly_extents.radius)

local radius, cx, cy = GetMinimumRadiusForNodes(my_nodes)
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
No public properties are initialized in a component constructor, as this file defines only stateless utility functions.

## Main functions

### `UpdateextentsForNode(extents, node)`
* **Description:** Expands the given `extents` bounding box to include the spatial footprint of `node`, assuming `node.data.position` is a 2D point and `node.data.size` is the half-size (axis-aligned square centered at `position`).
* **Parameters:**
  - `extents`: Table with keys `xmin`, `ymin`, `xmax`, `ymax`. Modified in place.
  - `node`: Table expected to have `node.data.position = {x, y}` and `node.data.size = number`.
* **Returns:** None (modifies `extents` in place).
* **Error states:** Assumes `node.data.position` is indexable and `node.data.size` is numeric; undefined behavior if not.

### `ResetextentsForNodes(nodes)`
* **Description:** Computes a new bounding box that tightly encloses all nodes in the list. Initializes with extreme initial values (`xmin=1000000`, `xmax=-1000000`, etc.) and iteratively expands via `UpdateextentsForNode`.
* **Parameters:**
  - `nodes`: List (array-like table) of node tables with `node.data.position` and `node.data.size`.
* **Returns:** Table with keys `xmin`, `ymin`, `xmax`, `ymax`.
* **Error states:** Returns extreme initial values if `nodes` is empty.

### `GetMinimumRadiusForNodes(nodes)`
* **Description:** Computes the radius of the smallest circle that encloses all node centers and their extents. Internally constructs a list of candidate points (center and points offset by `+/-size` along each axis) and delegates to a global `getminimumradius` function.
* **Parameters:**
  - `nodes`: List of node tables with `node.data.position` and `node.data.size`.
* **Returns:** Three values: `radius` (number), `cx` (center X), `cy` (center Y). (Exact definition of returned center depends on `getminimumradius` implementation, which is not provided.)
* **Error states:** Returns `nil` or undefined values if `nodes` is empty or `getminimumradius` fails.

### `UpdateextentsForPoint(extents, point)`
* **Description:** Expands the given `extents` bounding box to include a single 2D point (represented as a two-element table).
* **Parameters:**
  - `extents`: Table with keys `xmin`, `ymin`, `xmax`, `ymax`. Modified in place.
  - `point`: Table `{x, y}` (indices `1` and `2`) of numeric coordinates.
* **Returns:** None (modifies `extents` in place).
* **Error states:** Assumes `point` is indexable and numeric; undefined behavior otherwise.

### `ResetextentsForPoly(poly)`
* **Description:** Computes a bounding box for a polygon defined by a list of vertices, and also calculates `size` and `radius` fields for convenience. Radius is defined as the larger of width and height.
* **Parameters:**
  - `poly`: List of 2D points (each `{x, y}` or `{point[1], point[2]}`).
* **Returns:** Table with keys:
  - `xmin`, `ymin`, `xmax`, `ymax`: bounding coordinates.
  - `size`: `{x = width, y = height}`.
  - `radius`: `max(width, height)`.
* **Error states:** Returns extreme initial values if `poly` is empty.

## Events & listeners
None. This file contains no event registration or emission logic.