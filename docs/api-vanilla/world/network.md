---
id: network
title: Network API
sidebar_position: 5
---

# Network API

Tools for generating and managing the world's underlying node network and structure.

## Overview

The Network API provides functionality for creating and manipulating the graph structure that defines how different areas of the world are connected. It's a core part of world generation that determines the layout, connections, and traversal options in the game world.

## Key Components

### Graph

The primary object used to represent the world's structure:

```lua
-- Create a new graph
local graph = Graph("main", {
    nodes = {},           -- Nodes within the graph
    edges = {},           -- Connections between nodes
    exit_nodes = {},      -- Nodes connecting to other graphs
    exit_edges = {},      -- Edges connecting to other graphs
    default_bg = GROUND.GRASS,
    colour = {r=1, g=0, b=0, a=1}
})
```

### Nodes and Edges

Nodes represent distinct areas in the world, while edges define connections between them:

```lua
-- Create and add a node to the graph
local node = GraphNode("forest_area", {
    position = {x=0, y=0},
    data = {
        type = "forest",
        value = GROUND.FOREST
    }
})
graph:AddNode(node)

-- Connect two nodes with an edge
local edge = GraphEdge("path", node1, node2)
graph:AddEdge(edge)
```

## Common Functions

### Graph Functions

```lua
-- Add a node to the graph
graph:AddNode(node)

-- Add an edge connecting two nodes
graph:AddEdge(edge)

-- Find a path between two nodes
local path = graph:FindPath(start_node, end_node)

-- Check if a node is connected to the graph
local is_connected = graph:IsConnected(node)

-- Get all nodes of a specific type
local nodes = graph:GetNodesWithTag("forest")
```

### Traversal Functions

```lua
-- Get all nodes connected to a specified node
local connected_nodes = graph:GetConnectedNodes(node)

-- Get the shortest path between two nodes
local path = graph:GetShortestPath(start_node, end_node)

-- Perform a depth-first search from a starting node
graph:DepthFirstSearch(start_node, visit_function)
```

## World Generation Integration

The Network API integrates with world generation to create the overall structure:

```lua
-- During world generation
local worldgen = TheWorld.worldgenmain

-- Create the main graph structure
local main_graph = worldgen:CreateGraph()

-- Add task nodes based on selected tasks
for _, task in ipairs(tasks) do
    worldgen:AddTaskToGraph(main_graph, task)
end

-- Connect the nodes according to locks and keys
worldgen:ConnectGraphs(main_graph)
```

## Related Components

- **Map System**: Uses the graph to create the physical terrain
- **Room System**: Defines the content of individual nodes
- **Task System**: Higher-level grouping of connected rooms 