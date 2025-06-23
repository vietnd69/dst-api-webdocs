---
title: "Data Grid"
description: "Utility class for managing 2D grid data structures with coordinate-to-index mapping in Don't Starve Together"
sidebar_position: 10
slug: /api-vanilla/core-systems/datagrid
last_updated: "2024-12-28"
build_version: "675312"
change_status: "stable"
---

# Data Grid

The `DataGrid` class provides a utility for managing 2D grid-based data structures in Don't Starve Together. It offers efficient storage and access patterns for grid data using a 1D array internally while maintaining a 2D coordinate interface.

## Overview

DataGrid is designed for scenarios where you need to store and access data in a grid pattern, such as:
- World tile data management
- Map generation algorithms
- Spatial data organization
- Game board representations
- Any 2D data structure requiring efficient coordinate-based access

The class internally uses a 1D array for storage efficiency while providing convenient 2D coordinate methods for data access.

## Class Definition

### DataGrid

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

**Properties:**
- `grid` (table): Internal 1D array storing the grid data
- `width` (number): Grid width in cells
- `height` (number): Grid height in cells

## API Reference

### Dimension Methods

#### `Width()`

Returns the width of the grid.

**Returns:**
- `number`: Grid width (number of columns)

**Example:**
```lua
local grid = DataGrid(10, 5)
print("Grid width:", grid:Width()) -- Output: 10
```

#### `Height()`

Returns the height of the grid.

**Returns:**
- `number`: Grid height (number of rows)

**Example:**
```lua
local grid = DataGrid(10, 5)
print("Grid height:", grid:Height()) -- Output: 5
```

#### `GetMaxSize()`

Calculates and returns the total number of cells in the grid.

**Returns:**
- `number`: Total grid capacity (width × height)

**Example:**
```lua
local grid = DataGrid(10, 5)
print("Total cells:", grid:GetMaxSize()) -- Output: 50
```

### Coordinate Conversion Methods

#### `GetIndex(x, y)`

Converts 2D coordinates to a 1D array index.

**Parameters:**
- `x` (number): X coordinate (column index)
- `y` (number): Y coordinate (row index)

**Returns:**
- `number`: 1D array index corresponding to the (x, y) position

**Formula:** `index = y * width + x`

**Example:**
```lua
local grid = DataGrid(10, 5)
local index = grid:GetIndex(3, 2) -- Get index for position (3, 2)
print("Index:", index) -- Output: 23 (2 * 10 + 3)
```

#### `GetXYFromIndex(index)`

Converts a 1D array index back to 2D coordinates.

**Parameters:**
- `index` (number): 1D array index

**Returns:**
- `x` (number): X coordinate (column index)
- `y` (number): Y coordinate (row index)

**Formula:** 
- `x = index % width`
- `y = floor(index / width)`

**Example:**
```lua
local grid = DataGrid(10, 5)
local x, y = grid:GetXYFromIndex(23)
print("Coordinates:", x, y) -- Output: 3, 2
```

### Data Access Methods

#### `GetDataAtPoint(x, y)`

Retrieves data stored at the specified 2D coordinates.

**Parameters:**
- `x` (number): X coordinate (column index)
- `y` (number): Y coordinate (row index)

**Returns:**
- `any`: Data stored at the specified position, or `nil` if no data is set

**Example:**
```lua
local grid = DataGrid(10, 5)
grid:SetDataAtPoint(3, 2, "treasure")
local data = grid:GetDataAtPoint(3, 2)
print("Data at (3,2):", data) -- Output: "treasure"
```

#### `SetDataAtPoint(x, y, data)`

Stores data at the specified 2D coordinates.

**Parameters:**
- `x` (number): X coordinate (column index)
- `y` (number): Y coordinate (row index)
- `data` (any): Data to store at the specified position

**Example:**
```lua
local grid = DataGrid(10, 5)
grid:SetDataAtPoint(3, 2, { type = "forest", density = 0.8 })
```

#### `GetDataAtIndex(index)`

Retrieves data stored at the specified 1D array index.

**Parameters:**
- `index` (number): 1D array index

**Returns:**
- `any`: Data stored at the specified index, or `nil` if no data is set

**Example:**
```lua
local grid = DataGrid(10, 5)
grid:SetDataAtIndex(23, "direct_access_data")
local data = grid:GetDataAtIndex(23)
print("Data at index 23:", data) -- Output: "direct_access_data"
```

#### `SetDataAtIndex(index, data)`

Stores data at the specified 1D array index.

**Parameters:**
- `index` (number): 1D array index
- `data` (any): Data to store at the specified index

**Example:**
```lua
local grid = DataGrid(10, 5)
grid:SetDataAtIndex(23, { biome = "swamp", resources = {"reeds", "tentacles"} })
```

### Serialization Methods

#### `Save()`

Returns the internal grid data for serialization purposes.

**Returns:**
- `table`: Internal grid array containing all stored data

**Example:**
```lua
local grid = DataGrid(10, 5)
grid:SetDataAtPoint(0, 0, "spawn_point")
grid:SetDataAtPoint(9, 4, "exit_point")

local savedData = grid:Save()
-- savedData can be stored to file or transmitted
```

#### `Load(grid)`

Loads previously saved grid data into the current DataGrid instance.

**Parameters:**
- `grid` (table): Previously saved grid data (from `Save()` method)

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

## Usage Examples

### Basic Grid Operations

```lua
-- Create a 20x15 grid for world tile data
local worldGrid = DataGrid(20, 15)

-- Set terrain types at specific coordinates
worldGrid:SetDataAtPoint(0, 0, "grass")
worldGrid:SetDataAtPoint(1, 0, "forest")
worldGrid:SetDataAtPoint(2, 0, "swamp")

-- Retrieve terrain type
local terrainType = worldGrid:GetDataAtPoint(1, 0)
print("Terrain at (1,0):", terrainType) -- Output: "forest"

-- Check grid dimensions
print("World size:", worldGrid:Width(), "x", worldGrid:Height())
print("Total tiles:", worldGrid:GetMaxSize())
```

### Complex Data Storage

```lua
-- Create a grid for storing complex tile information
local mapGrid = DataGrid(50, 50)

-- Store detailed tile data
local tileData = {
    biome = "forest",
    resources = {"tree", "grass", "rock"},
    entities = {"pighouse", "spider_den"},
    danger_level = 3,
    explored = true
}

mapGrid:SetDataAtPoint(25, 25, tileData)

-- Retrieve and use tile data
local tile = mapGrid:GetDataAtPoint(25, 25)
if tile and tile.explored then
    print("Biome:", tile.biome)
    print("Danger level:", tile.danger_level)
    print("Resources:", table.concat(tile.resources, ", "))
end
```

### Grid Iteration Patterns

```lua
local grid = DataGrid(10, 8)

-- Fill grid with coordinate-based data
for y = 0, grid:Height() - 1 do
    for x = 0, grid:Width() - 1 do
        local distance = math.sqrt(x*x + y*y)
        grid:SetDataAtPoint(x, y, { 
            position = {x, y},
            distance_from_origin = distance 
        })
    end
end

-- Process all grid data using index iteration
for i = 0, grid:GetMaxSize() - 1 do
    local data = grid:GetDataAtIndex(i)
    if data and data.distance_from_origin < 5 then
        local x, y = grid:GetXYFromIndex(i)
        print(string.format("Close to origin: (%d,%d) distance=%.2f", 
              x, y, data.distance_from_origin))
    end
end
```

### Grid-based Pathfinding Data

```lua
-- Create a navigation grid
local navGrid = DataGrid(30, 30)

-- Initialize all cells as walkable
for y = 0, navGrid:Height() - 1 do
    for x = 0, navGrid:Width() - 1 do
        navGrid:SetDataAtPoint(x, y, {
            walkable = true,
            cost = 1,
            visited = false
        })
    end
end

-- Add obstacles
local obstacles = {
    {5, 5}, {5, 6}, {5, 7}, {6, 7}, {7, 7}
}

for _, pos in ipairs(obstacles) do
    local x, y = pos[1], pos[2]
    navGrid:SetDataAtPoint(x, y, {
        walkable = false,
        cost = math.huge,
        visited = false
    })
end

-- Check if position is walkable
local function IsWalkable(x, y)
    local cellData = navGrid:GetDataAtPoint(x, y)
    return cellData and cellData.walkable
end

-- Get neighbors for pathfinding
local function GetNeighbors(x, y)
    local neighbors = {}
    local directions = {{0,1}, {1,0}, {0,-1}, {-1,0}}
    
    for _, dir in ipairs(directions) do
        local nx, ny = x + dir[1], y + dir[2]
        if nx >= 0 and nx < navGrid:Width() and 
           ny >= 0 and ny < navGrid:Height() and
           IsWalkable(nx, ny) then
            table.insert(neighbors, {nx, ny})
        end
    end
    
    return neighbors
end
```

### Data Persistence Example

```lua
-- Create and populate a game board
local gameBoard = DataGrid(8, 8)

-- Set up initial game state
gameBoard:SetDataAtPoint(0, 0, {piece = "rook", color = "white"})
gameBoard:SetDataAtPoint(1, 0, {piece = "knight", color = "white"})
gameBoard:SetDataAtPoint(7, 7, {piece = "king", color = "black"})

-- Save game state
local gameState = {
    board = gameBoard:Save(),
    turn = "white",
    move_count = 15
}

-- Simulate saving to file (in actual game, use proper serialization)
print("Game state saved!")

-- Later, restore game state
local newBoard = DataGrid(8, 8)
newBoard:Load(gameState.board)

-- Verify data was restored
local piece = newBoard:GetDataAtPoint(0, 0)
print("Restored piece:", piece.piece, piece.color) -- Output: "rook white"
```

### Performance Optimization Patterns

```lua
-- For frequent access, cache commonly used indices
local grid = DataGrid(100, 100)

-- Pre-calculate indices for hot spots
local centerX, centerY = 50, 50
local centerIndex = grid:GetIndex(centerX, centerY)

-- Use direct index access for performance-critical sections
grid:SetDataAtIndex(centerIndex, {important = true})

-- Batch operations using index arithmetic
local function FillRect(grid, startX, startY, width, height, value)
    for dy = 0, height - 1 do
        local rowStart = grid:GetIndex(startX, startY + dy)
        for dx = 0, width - 1 do
            grid:SetDataAtIndex(rowStart + dx, value)
        end
    end
end

FillRect(grid, 10, 10, 5, 5, {terrain = "cleared"})
```

## Performance Characteristics

### Time Complexity
- **Coordinate to Index Conversion**: O(1)
- **Index to Coordinate Conversion**: O(1)
- **Data Access (Get/Set)**: O(1)
- **Grid Creation**: O(1)
- **Save/Load**: O(n) where n is the number of stored elements

### Space Complexity
- **Memory Usage**: O(n) where n is the number of cells with data
- **Empty cells consume no memory** (sparse storage)

### Optimization Tips
1. **Use index-based access** for performance-critical loops
2. **Pre-calculate frequently used indices** to avoid repeated arithmetic
3. **Consider coordinate bounds checking** for robust applications
4. **Batch operations** when possible to reduce method call overhead

## Common Use Cases

### World Generation
```lua
-- Terrain generation
local terrainGrid = DataGrid(worldWidth, worldHeight)
for y = 0, terrainGrid:Height() - 1 do
    for x = 0, terrainGrid:Width() - 1 do
        local biome = GenerateBiome(x, y) -- Custom generation logic
        terrainGrid:SetDataAtPoint(x, y, biome)
    end
end
```

### Inventory Management
```lua
-- Container grid for inventory systems
local inventoryGrid = DataGrid(containerWidth, containerHeight)

local function PlaceItem(x, y, item)
    if inventoryGrid:GetDataAtPoint(x, y) == nil then
        inventoryGrid:SetDataAtPoint(x, y, item)
        return true
    end
    return false -- Slot occupied
end
```

### Spatial Queries
```lua
-- Efficient spatial lookups
local spatialGrid = DataGrid(regionWidth, regionHeight)

local function AddEntity(entity, x, y)
    local existing = spatialGrid:GetDataAtPoint(x, y) or {}
    table.insert(existing, entity)
    spatialGrid:SetDataAtPoint(x, y, existing)
end

local function GetEntitiesAt(x, y)
    return spatialGrid:GetDataAtPoint(x, y) or {}
end
```

## Error Handling

### Bounds Checking
```lua
local function SafeGetData(grid, x, y)
    if x < 0 or x >= grid:Width() or y < 0 or y >= grid:Height() then
        return nil -- Out of bounds
    end
    return grid:GetDataAtPoint(x, y)
end

local function SafeSetData(grid, x, y, data)
    if x < 0 or x >= grid:Width() or y < 0 or y >= grid:Height() then
        return false -- Out of bounds
    end
    grid:SetDataAtPoint(x, y, data)
    return true
end
```

### Validation Patterns
```lua
local function ValidateGridOperation(grid, x, y)
    assert(grid, "Grid cannot be nil")
    assert(type(x) == "number" and type(y) == "number", "Coordinates must be numbers")
    assert(x >= 0 and x < grid:Width(), "X coordinate out of bounds")
    assert(y >= 0 and y < grid:Height(), "Y coordinate out of bounds")
end
```

## Dependencies

### Required Systems
- **Class System**: Uses DST's Class constructor pattern
- **Math Library**: For coordinate calculations (math.floor)

### No External Dependencies
- DataGrid is self-contained and doesn't depend on other DST systems
- Can be used independently in any Lua environment with the Class constructor

## Version History

| Version | Changes |
|---------|---------|
| 675312  | Current implementation with 1D array storage and 2D coordinate interface |

## Related Systems

- [Map Generation](/api-vanilla/map/) - Uses DataGrid for terrain and biome data
- [World Management](/api-vanilla/core-systems/world-management/) - Spatial data organization
- [Components](/api-vanilla/core-systems/components/) - Spatial component systems

## Notes

- **Sparse Storage**: Only cells with data consume memory; empty cells are efficiently handled
- **Zero-based Indexing**: Coordinates start from (0, 0) in the top-left corner
- **Row-major Storage**: Data is stored in row-major order for cache efficiency
- **Type Agnostic**: Can store any Lua value type (numbers, strings, tables, etc.)
- **Thread Safe**: No internal state dependencies make it safe for concurrent read access
- **Serialization Ready**: Save/Load methods support easy persistence and network transmission
