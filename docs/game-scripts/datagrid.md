---
id: datagrid
title: Datagrid
description: A utility class for managing a 2D grid of data stored in a 1D Lua table, supporting coordinate-to-index conversion and basic persistence operations.
tags: [util, data, grid]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: e65e7202
system_scope: util
---

# Datagrid

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`DataGrid` is a lightweight utility component that provides a 2D grid interface backed by a 1D Lua table. It supports indexing via `(x, y)` coordinates or linear `index`, enabling efficient storage and retrieval of grid-based data. This component is self-contained and does not integrate with the ECS or require attachment to an entity—it is designed for standalone use in utility or helper contexts.

## Usage example
```lua
local grid = DataGrid(5, 5) -- 5x5 grid
grid:SetDataAtPoint(2, 3, "water")
local value = grid:GetDataAtPoint(2, 3)
local index = grid:GetIndex(2, 3) -- returns 17
local x, y = grid:GetXYFromIndex(17) -- returns 2, 3
local saved = grid:Save()
local loaded = DataGrid(0, 0)
loaded:Load(saved)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `grid` | table | `{}` | Internal 1D table storing grid data, indexed linearly. |
| `width` | number | — | Width of the grid (number of columns), set at construction. |
| `height` | number | — | Height of the grid (number of rows), set at construction. |

## Main functions
### `Width()`
* **Description:** Returns the grid's width (number of columns).
* **Parameters:** None.
* **Returns:** `number` — the width.

### `Height()`
* **Description:** Returns the grid's height (number of rows).
* **Parameters:** None.
* **Returns:** `number` — the height.

### `GetMaxSize()`
* **Description:** Returns the total number of cells in the grid (width × height).
* **Parameters:** None.
* **Returns:** `number` — maximum capacity.

### `GetIndex(x, y)`
* **Description:** Converts `(x, y)` coordinates to a linear index. Indexing assumes 0-based x and y, with row-major layout (x varies fastest).
* **Parameters:**  
  - `x` (`number`) — column index (0-based).  
  - `y` (`number`) — row index (0-based).  
* **Returns:** `number` — linear index into `self.grid`.
* **Error states:** No bounds checking is performed; invalid coordinates may yield out-of-range or negative indices.

### `GetXYFromIndex(index)`
* **Description:** Converts a linear index back to `(x, y)` coordinates.
* **Parameters:**  
  - `index` (`number`) — linear index (1D position in grid).  
* **Returns:** `number, number` — `x` and `y` coordinates.
* **Error states:** No validation is done on `index`; negative or non-integer inputs may yield undefined results.

### `GetDataAtPoint(x, y)`
* **Description:** Retrieves the data stored at a specific `(x, y)` coordinate.
* **Parameters:**  
  - `x` (`number`) — column index.  
  - `y` (`number`) — row index.  
* **Returns:** `any` — the stored data, or `nil` if unset or out of bounds.
* **Error states:** Delegates to `GetIndex()` and `GetDataAtIndex()`, which perform no bounds checks.

### `SetDataAtPoint(x, y, data)`
* **Description:** Stores `data` at the specified `(x, y)` coordinate.
* **Parameters:**  
  - `x` (`number`) — column index.  
  - `y` (`number`) — row index.  
  - `data` (`any`) — any Lua value to store.  
* **Returns:** `nil`.  
* **Error states:** No bounds checking; assignments may overwrite unintended entries or create sparse table entries.

### `GetDataAtIndex(index)`
* **Description:** Retrieves data at a linear index.
* **Parameters:**  
  - `index` (`number`) — linear index.  
* **Returns:** `any` — stored data, or `nil` if unset.
* **Error states:** No validation of `index`; invalid indices return `nil` silently.

### `SetDataAtIndex(index, data)`
* **Description:** Stores `data` at a linear index.
* **Parameters:**  
  - `index` (`number`) — linear index.  
  - `data` (`any`) — value to store.  
* **Returns:** Nothing.

### `Save()`
* **Description:** Returns the internal `grid` table for serialization.
* **Parameters:** None.
* **Returns:** `table` — reference to `self.grid`.

### `Load(grid)`
* **Description:** Replaces the internal `grid` table with the provided `grid` table.
* **Parameters:**  
  - `grid` (`table`) — a table to use as the new internal grid.  
* **Returns:** Nothing.  
* **Note:** Does not validate structure or dimensions; caller must ensure `grid` matches expected size.

## Events & listeners
Not applicable