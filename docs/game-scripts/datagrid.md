---
id: datagrid
title: Datagrid
description: Provides a 2D grid data structure backed by a 1D table for efficient spatial data storage.
tags: [data, utility, grid]
sidebar_position: 10

last_updated: 2026-03-21
build_version: 714014
change_status: stable
category_type: root
source_hash: e65e7202
system_scope: ui
---

# Datagrid

> Based on game build **714014** | Last updated: 2026-03-21

## Overview
`DataGrid` is a utility class that manages a two-dimensional grid using a single linear table. It provides methods to convert between 2D coordinates (`x`, `y`) and 1D array indices, allowing for efficient storage and retrieval of data in a spatial layout. This class is commonly used for inventory grids, map data, or UI layouts where cell-based data access is required.

## Usage example
```lua
local DataGrid = require("datagrid")

-- Create a 10x10 grid
local grid = DataGrid(10, 10)

-- Set data at coordinate 2, 3
grid:SetDataAtPoint(2, 3, "item_data")

-- Retrieve data using index
local index = grid:GetIndex(2, 3)
local data = grid:GetDataAtIndex(index)
```

## Dependencies & tags
**Components used:** None identified.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `grid` | table | `{}` | Internal 1D table storing grid cell data. |
| `width` | number | `width` | The number of columns in the grid. |
| `height` | number | `height` | The number of rows in the grid. |

## Main functions
### `Width()`
*   **Description:** Returns the total width of the grid.
*   **Parameters:** None.
*   **Returns:** `number` - The width value set during construction.

### `Height()`
*   **Description:** Returns the total height of the grid.
*   **Parameters:** None.
*   **Returns:** `number` - The height value set during construction.

### `GetMaxSize()`
*   **Description:** Calculates the total number of cells available in the grid.
*   **Parameters:** None.
*   **Returns:** `number` - The product of `width` and `height`.

### `GetIndex(x, y)`
*   **Description:** Converts 2D coordinates into a 1D array index.
*   **Parameters:** `x` (number) - The column coordinate. `y` (number) - The row coordinate.
*   **Returns:** `number` - The linear index corresponding to the coordinates.

### `GetXYFromIndex(index)`
*   **Description:** Converts a 1D array index back into 2D coordinates.
*   **Parameters:** `index` (number) - The linear index within the grid.
*   **Returns:** `number`, `number` - The `x` and `y` coordinates respectively.

### `GetDataAtPoint(x, y)`
*   **Description:** Retrieves data stored at a specific 2D coordinate.
*   **Parameters:** `x` (number) - The column coordinate. `y` (number) - The row coordinate.
*   **Returns:** `any` - The data stored at the location, or `nil` if empty.

### `SetDataAtPoint(x, y, data)`
*   **Description:** Stores data at a specific 2D coordinate.
*   **Parameters:** `x` (number) - The column coordinate. `y` (number) - The row coordinate. `data` (any) - The value to store.
*   **Returns:** Nothing.

### `GetDataAtIndex(index)`
*   **Description:** Retrieves data stored at a specific 1D index.
*   **Parameters:** `index` (number) - The linear index.
*   **Returns:** `any` - The data stored at the index, or `nil` if empty.

### `SetDataAtIndex(index, data)`
*   **Description:** Stores data at a specific 1D index.
*   **Parameters:** `index` (number) - The linear index. `data` (any) - The value to store.
*   **Returns:** Nothing.

### `Save()`
*   **Description:** Exports the internal grid table for serialization.
*   **Parameters:** None.
*   **Returns:** `table` - The raw grid data.

### `Load(grid)`
*   **Description:** Replaces the internal grid table with loaded data.
*   **Parameters:** `grid` (table) - The table containing grid data to load.
*   **Returns:** Nothing.

## Events & listeners
None identified.