---
id: maputil
title: Map Utilities
description: Map topology utilities for pathfinding, node manipulation, convex hull calculations, and map visualization
sidebar_position: 4
slug: api-vanilla/core-systems/maputil
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Map Utilities

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `maputil.lua` script provides essential utilities for working with map topology, including pathfinding operations, node manipulation, graph reconstruction, and visualization tools. These functions are used for world generation analysis, debugging, and runtime pathfinding operations.

## Usage Example

```lua
-- Find the closest node to player
local closest_node = GetClosestNodeToPlayer()
print("Player is near node:", closest_node.id)

-- Show area around player
ShowClosestNodeToPlayer()

-- Create a convex hull from points
local points = {{0,0}, {1,0}, {1,1}, {0,1}}
local hull = convexHull(points)
```

## Node Finding Functions

### GetClosestNode(x, y) {#get-closest-node}

**Status:** `stable`

**Description:**
Finds the closest topology node to the specified world coordinates.

**Parameters:**
- `x` (number): World X coordinate
- `y` (number): World Y coordinate (Z coordinate in 3D space)

**Returns:**
- (table): The closest topology node, or nil if no valid nodes exist

**Example:**
```lua
-- Find closest node to a specific position
local node = GetClosestNode(100, 200)
if node then
    print("Found node at:", node.x, node.y)
    print("Node has", #node.neighbours, "neighbours")
end
```

### GetClosestNodeToPlayer() {#get-closest-node-to-player}

**Status:** `stable`

**Description:**
Finds the closest topology node to the current player's position.

**Returns:**
- (table): The closest topology node to the player

**Example:**
```lua
local player_node = GetClosestNodeToPlayer()
if player_node then
    print("Player is in node:", player_node.id)
    print("Node center:", player_node.x, player_node.y)
end
```

### ShowClosestNodeToPlayer() {#show-closest-node-to-player}

**Status:** `stable`

**Description:**
Reveals the closest node to the player on the minimap for debugging purposes.

**Example:**
```lua
-- Debug: Show player's current node on minimap
ShowClosestNodeToPlayer()
```

## Geometry Functions

### cross(o, a, b) {#cross}

**Status:** `stable`

**Description:**
Calculates the cross product of vectors for geometric calculations.

**Parameters:**
- `o` (table): Origin point {x, y}
- `a` (table): First point {x, y}
- `b` (table): Second point {x, y}

**Returns:**
- (number): Cross product value

### convexHull(points) {#convex-hull}

**Status:** `stable`

**Description:**
Computes the convex hull of a set of 2D points using Andrew's algorithm.

**Parameters:**
- `points` (table): Array of point coordinates {{x1, y1}, {x2, y2}, ...}

**Returns:**
- (table): Array of points forming the convex hull

**Example:**
```lua
-- Create convex hull from a set of points
local points = {
    {0, 0}, {2, 0}, {1, 1}, {2, 2}, {0, 2}
}
local hull = convexHull(points)

-- Hull will contain the outer boundary points
for i, point in ipairs(hull) do
    print("Hull point", i, ":", point[1], point[2])
end
```

## Graph Manipulation Functions

### GrabSubGraphAroundNode(node, numnodes) {#grab-sub-graph-around-node}

**Status:** `stable`

**Description:**
Extracts a connected subgraph around a starting node by randomly walking through neighboring nodes.

**Parameters:**
- `node` (table): Starting topology node
- `numnodes` (number): Number of nodes to include in the subgraph

**Returns:**
- (table): Array of selected nodes forming the subgraph

**Example:**
```lua
-- Get a subgraph of 10 nodes around the player
local start_node = GetClosestNodeToPlayer()
local subgraph = GrabSubGraphAroundNode(start_node, 10)

print("Selected", #subgraph, "nodes in subgraph")
for i, node in ipairs(subgraph) do
    print("Node", i, "at", node.x, node.y)
end
```

### PlayerSub(count) {#player-sub}

**Status:** `stable`

**Description:**
Creates a subgraph around the player's position and visualizes its convex hull on the minimap.

**Parameters:**
- `count` (number): Number of nodes to include (default: 5)

**Example:**
```lua
-- Visualize a 7-node subgraph around player
PlayerSub(7)
```

## Map Visualization Functions

### MapHideAll() {#map-hide-all}

**Status:** `stable`

**Description:**
Clears all revealed areas from the minimap.

**Example:**
```lua
-- Reset minimap to unexplored state
MapHideAll()
```

### DrawWalkableGrid(graph) {#draw-walkable-grid}

**Status:** `stable`

**Description:**
Creates debug visualization showing walkable connections between topology nodes.

**Parameters:**
- `graph` (table): Optional topology graph (uses TheWorld.topology by default)

**Example:**
```lua
-- Show debug visualization of walkable areas
DrawWalkableGrid()

-- Use custom graph
DrawWalkableGrid(custom_topology)
```

### ShowWalkableGrid(graph) {#show-walkable-grid}

**Status:** `stable`

**Description:**
Reveals walkable connections on the minimap by showing traversable paths between nodes.

**Parameters:**
- `graph` (table): Optional topology graph (uses TheWorld.topology by default)

**Example:**
```lua
-- Reveal all walkable paths on minimap
ShowWalkableGrid()
```

## Topology Reconstruction

### ReconstructTopology(graph) {#reconstruct-topology}

**Status:** `stable`

**Description:**
Rebuilds the topology graph by validating node connections and removing invalid pathways. This is a complex operation that reconstructs the entire pathfinding graph.

**Parameters:**
- `graph` (table): Optional topology graph (uses TheWorld.topology by default)

**Process:**
1. **Point Flattening:** Consolidates duplicate vertices
2. **Edge Sorting:** Identifies shared edges between nodes
3. **Node Connection:** Maps nodes to their shared edges
4. **Path Validation:** Checks if connections are actually traversable
5. **Neighbor Assignment:** Updates node neighbor lists

**Example:**
```lua
-- Rebuild topology after world changes
ReconstructTopology()

-- Rebuild custom topology
ReconstructTopology(custom_graph)
```

**Performance Note:**
This is an expensive operation that should only be called when the world topology has been significantly modified.

## Internal Utility Functions

### RemoveEdge(nodes, edgeIndex) {#remove-edge}

**Status:** `stable`

**Description:**
Internal function that removes an edge index from all nodes' valid edge lists.

**Parameters:**
- `nodes` (table): Array of topology nodes
- `edgeIndex` (number): Edge index to remove

## Data Structures

### Topology Node Structure

```lua
local node = {
    id = 1,                    -- Node identifier
    x = 100,                   -- World X coordinate
    y = 200,                   -- World Y coordinate (Z in 3D)
    poly = {{x1,y1}, {x2,y2}}, -- Polygon vertices
    neighbours = {2, 3, 5},    -- Connected node IDs
    validedges = {1, 4, 7},    -- Valid edge indices
    -- Additional node properties...
}
```

### Graph Structure

```lua
local topology = {
    nodes = {},              -- Array of topology nodes
    flattenedPoints = {},    -- Consolidated vertex list
    flattenedEdges = {},     -- Edge definitions {{p1, p2}, ...}
    edgeToNodes = {},        -- Edge to node mapping
    -- Additional graph properties...
}
```

## Usage Patterns

### Pathfinding Analysis

```lua
-- Analyze connectivity around player
local player_node = GetClosestNodeToPlayer()
print("Player has", #player_node.neighbours, "paths available")

-- Check if two positions are in connected nodes
local node1 = GetClosestNode(x1, y1)
local node2 = GetClosestNode(x2, y2)
local connected = table.contains(node1.neighbours, node2.id)
```

### Map Generation Debugging

```lua
-- Visualize topology structure
DrawWalkableGrid()
ShowWalkableGrid()

-- Test subgraph extraction
local test_node = GetClosestNodeToPlayer()
local subgraph = GrabSubGraphAroundNode(test_node, 8)
PlayerSub(8) -- Visualize the result
```

### World Modification

```lua
-- After making world changes that affect pathfinding
ReconstructTopology()

-- Verify the reconstruction worked
local node = GetClosestNodeToPlayer()
print("Node has", #node.neighbours, "valid connections")
```

## Performance Considerations

- **GetClosestNode:** O(n) operation that checks all nodes
- **convexHull:** O(n log n) due to sorting step
- **ReconstructTopology:** Expensive O(n²) operation for large graphs
- **GrabSubGraphAroundNode:** O(k) where k is the requested node count

## Related Modules

- [MathUtil](./mathutil.md): Mathematical utilities for calculations
- [Physics](./physics.md): Physics and collision systems
- [WorldGen](../map/worldgen.md): World generation systems
- [Pathfinder](../navigation/pathfinder.md): Pathfinding algorithms
- [DebugHelpers](./debughelpers.md): Debug visualization tools
