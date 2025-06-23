---
id: data-grid
title: Data Grid
description: Utility class for managing 2D grid data structures with coordinate-to-index mapping in Don't Starve Together
sidebar_position: 10
slug: /api-vanilla/core-systems/data-grid
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Data Grid

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `DataGrid` class provides a utility for managing 2D grid-based data structures in Don't Starve Together. It offers efficient storage and access patterns for grid data using a 1D array internally while maintaining a 2D coordinate interface.

DataGrid is designed for scenarios where you need to store and access data in a grid pattern, such as world tile data management, map generation algorithms, spatial data organization, and any 2D data structure requiring efficient coordinate-based access.

## Usage Example

```lua
-- Create a 20x15 grid for world tile data
local worldGrid = DataGrid(20, 15)

-- Set terrain types at specific coordinates
worldGrid:SetDataAtPoint(0, 0, "grass")
worldGrid:SetDataAtPoint(1, 0, "forest")

-- Retrieve terrain type
local terrainType = worldGrid:GetDataAtPoint(1, 0)
print("Terrain at (1,0):", terrainType) -- Output: "forest"

-- Save and load grid data
local savedData = worldGrid:Save()
local newGrid = DataGrid(20, 15)
newGrid:Load(savedData)
```

## Functions

### Width() {#width}

**Status:** `stable`

**Description:**
Returns the width of the grid (number of columns).

**Parameters:**
- None

**Returns:**
- (number): Grid width in cells

**Example:**
```lua
local grid = DataGrid(10, 5)
print("Grid width:", grid:Width()) -- Output: 10
```

**Version History:**
- Current in build 676042: Returns grid width

### Height() {#height}

**Status:** `stable`

**Description:**
Returns the height of the grid (number of rows).

**Parameters:**
- None

**Returns:**
- (number): Grid height in cells

**Example:**
```lua
local grid = DataGrid(10, 5)
print("Grid height:", grid:Height()) -- Output: 5
```

**Version History:**
- Current in build 676042: Returns grid height

### GetMaxSize() {#get-max-size}

**Status:** `stable`

**Description:**
Calculates and returns the total number of cells in the grid (width × height).

**Parameters:**
- None

**Returns:**
- (number): Total grid capacity

**Example:**
```lua
local grid = DataGrid(10, 5)
print("Total cells:", grid:GetMaxSize()) -- Output: 50
```

**Version History:**
- Current in build 676042: Returns total grid capacity

### GetIndex(x, y) {#get-index}

**Status:** `stable`

**Description:**
Converts 2D coordinates to a 1D array index using the formula `index = y * width + x`.

**Parameters:**
- `x` (number): X coordinate (column index)
- `y` (number): Y coordinate (row index)

**Returns:**
- (number): 1D array index corresponding to the (x, y) position

**Example:**
```lua
local grid = DataGrid(10, 5)
local index = grid:GetIndex(3, 2) -- Get index for position (3, 2)
print("Index:", index) -- Output: 23 (2 * 10 + 3)
```

**Version History:**
- Current in build 676042: Row-major order conversion

### GetXYFromIndex(index) {#get-xy-from-index}

**Status:** `stable`

**Description:**
Converts a 1D array index back to 2D coordinates using modulo and division operations.

**Parameters:**
- `index` (number): 1D array index

**Returns:**
- (number, number): X coordinate, Y coordinate

**Example:**
```lua
local grid = DataGrid(10, 5)
local x, y = grid:GetXYFromIndex(23)
print("Coordinates:", x, y) -- Output: 3, 2
```

**Version History:**
- Current in build 676042: Index to coordinate conversion

### GetDataAtPoint(x, y) {#get-data-at-point}

**Status:** `stable`

**Description:**
Retrieves data stored at the specified 2D coordinates. Converts coordinates to index internally.

**Parameters:**
- `x` (number): X coordinate (column index)
- `y` (number): Y coordinate (row index)

**Returns:**
- (any|nil): Data stored at the specified position, or `nil` if no data is set

**Example:**
```lua
local grid = DataGrid(10, 5)
grid:SetDataAtPoint(3, 2, "treasure")
local data = grid:GetDataAtPoint(3, 2)
print("Data at (3,2):", data) -- Output: "treasure"
```

**Version History:**
- Current in build 676042: 2D coordinate data access

### SetDataAtPoint(x, y, data) {#set-data-at-point}

**Status:** `stable`

**Description:**
Stores data at the specified 2D coordinates. Converts coordinates to index internally.

**Parameters:**
- `x` (number): X coordinate (column index)
- `y` (number): Y coordinate (row index)
- `data` (any): Data to store at the specified position

**Returns:**
- (void): No return value

**Example:**
```lua
local grid = DataGrid(10, 5)
grid:SetDataAtPoint(3, 2, { type = "forest", density = 0.8 })
```

**Version History:**
- Current in build 676042: 2D coordinate data storage

### GetDataAtIndex(index) {#get-data-at-index}

**Status:** `stable`

**Description:**
Retrieves data stored at the specified 1D array index. Direct access to internal storage.

**Parameters:**
- `index` (number): 1D array index

**Returns:**
- (any|nil): Data stored at the specified index, or `nil` if no data is set

**Example:**
```lua
local grid = DataGrid(10, 5)
grid:SetDataAtIndex(23, "direct_access_data")
local data = grid:GetDataAtIndex(23)
print("Data at index 23:", data) -- Output: "direct_access_data"
```

**Version History:**
- Current in build 676042: Direct index data access

### SetDataAtIndex(index, data) {#set-data-at-index}

**Status:** `stable`

**Description:**
Stores data at the specified 1D array index. Direct access to internal storage for performance.

**Parameters:**
- `index` (number): 1D array index
- `data` (any): Data to store at the specified index

**Returns:**
- (void): No return value

**Example:**
```lua
local grid = DataGrid(10, 5)
grid:SetDataAtIndex(23, { biome = "swamp", resources = {"reeds", "tentacles"} })
```

**Version History:**
- Current in build 676042: Direct index data storage

### Save() {#save}

**Status:** `stable`

**Description:**
Returns the internal grid data for serialization purposes. Provides access to raw grid array.

**Parameters:**
- None

**Returns:**
- (table): Internal grid array containing all stored data

**Example:**
```lua
local grid = DataGrid(10, 5)
grid:SetDataAtPoint(0, 0, "spawn_point")
local savedData = grid:Save()
-- savedData can be stored to file or transmitted
```

**Version History:**
- Current in build 676042: Grid serialization

### Load(grid) {#load}

**Status:** `stable`

**Description:**
Loads previously saved grid data into the current DataGrid instance. Replaces internal grid array.

**Parameters:**
- `grid` (table): Previously saved grid data (from `Save()` method)

**Returns:**
- (void): No return value

**Example:**
```lua
local grid1 = DataGrid(10, 5)
grid1:SetDataAtPoint(3, 2, "important_data")
local savedData = grid1:Save()

-- Later, in a new grid instance
local grid2 = DataGrid(10, 5)
grid2:Load(savedData)
local data = grid2:GetDataAtPoint(3, 2)
print("Loaded data:", data) -- Output: "important_data"
```

**Version History:**
- Current in build 676042: Grid deserialization

## Classes

### DataGrid

**Status:** `stable`

**Description:**
Main class for managing 2D grid data structures. Provides efficient storage using 1D array with 2D coordinate interface.

**Properties:**
- `grid` (table): Internal 1D array storing the grid data
- `width` (number): Grid width in cells
- `height` (number): Grid height in cells

**Constructor:**
```lua
DataGrid = Class(function(self, width, height)
    self.grid = {}
    self.width = width
    self.height = height
end)
```

**Constructor Parameters:**
- `width` (number): The width of the grid (number of columns)
- `height` (number): The height of the grid (number of rows)

**Version History:**
- Current in build 676042: 1D array storage with 2D interface

## Storage Characteristics

### Index Mapping

The DataGrid uses row-major order for coordinate-to-index mapping:

| Formula | Purpose |
|---------|---------|
| `index = y * width + x` | Convert 2D coordinates to 1D index |
| `x = index % width` | Extract X coordinate from index |
| `y = floor(index / width)` | Extract Y coordinate from index |

### Memory Usage

- **Sparse Storage**: Only cells with data consume memory
- **Zero-based Indexing**: Coordinates start from (0, 0) 
- **Type Agnostic**: Can store any Lua value type
- **Cache Efficient**: Row-major storage pattern

## Related Modules

- [Map Generation](mdc:dst-api-webdocs/map/index.md): Uses DataGrid for terrain and biome data
- [World Management](mdc:dst-api-webdocs/core-systems/world.md): Spatial data organization
- [Class System](mdc:dst-api-webdocs/core-systems/class.md): Uses DST's Class constructor pattern
