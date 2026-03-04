---
id: network
title: Network
description: Manages world map graph structure including nodes, edges, and child subgraphs for procedural level generation and rendering in Don't Starve Together.
tags: [map, graph, procedural, network, worldgen]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: e141fb2e
---

# Network

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `Graph` component implements a hierarchical graph data structure for the game's world map system. It supports nested subgraphs (via `children`), manages nodes and edges for terrain connections, handles teleporter/wormhole pair generation, and coordinates procedural layout and population logic. The `Graph` is central to world generation, enabling support for complex map layouts including loops, hubs, crosslinks, and inter-connected sub-regions. It integrates with `map/terrain` and `map/object_layout` modules for rendering and entity placement, and works closely with `prefabswaps.lua` for resolved prefabs during world population.

## Usage example

```lua
-- Create a graph instance with initial arguments
local graph = Graph("ForestRegion", {
    parent = nil,
    children = {},
    nodes = {},
    edges = {},
    exit_nodes = {},
    exit_edges = {},
    default_bg = {r=0.5, g=0.5, b=0.5, a=1},
    story_depth = 0,
    required_prefabs = {"tree_1", "rock_1"}
})

-- Add a node and connect it
local node1 = graph:AddNode({ id = "node_a", data = { type = "ROOM", name = "Start" } })
local node2 = graph:AddNode({ id = "node_b", data = { type = "ROOM", name = "End" } })
graph:AddEdge({ id = "edge_ab", node1id = "node_a", node2id = "node_b", lock = nil })

-- Generate wormholes and finalize layout
graph:GlobalPrePopulate(entities, width, height)
graph:GlobalPostPopulate(entities, width, height)
graph:ApplyPoisonTag()
```

## Dependencies & tags
**Components used:** None — this is a standalone map data-structure component. It interacts with external modules via module-level `require()` calls (e.g., `map/graphedge`, `map/graphnode`, `map/terrain`, `map/object_layout`, `prefabswaps.lua`) but does not use ECS components (`inst.components.X`).

**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `id` | `string` | `args.id` | Unique identifier for this graph. |
| `parent` | `Graph?` | `nil` | Parent graph if nested. |
| `children` | `table` | `{}` | Subgraphs contained within this graph. |
| `nodes` | `table` | `{}` | Internal map nodes. |
| `edges` | `table` | `{}` | Internal edges connecting nodes. |
| `exit_nodes` | `table` | `{}` | Nodes that serve as connection points to other graphs. |
| `exit_edges` | `table` | `{}` | Edges connecting this graph to others. |
| `story_depth` | `number` | `-1` | Logical progression depth (e.g., for world tiers). |
| `visited` | `boolean` | `false` | Used during traversal algorithms. |
| `data` | `table` | `{position={x=0,y=0}, ...}` | Graph-level data including bounding box and background color. |
| `room_tags` | `table?` | `nil` | Optional tags for room selection logic. |
| `colour` | `table` | `{r=1,g=0,b=0,a=1}` | Default RGB+A color for rendering. |
| `set_pieces` | `table?` | `nil` | Layout set pieces for this graph. |
| `random_set_pieces` | `table?` | `nil` | Randomized set pieces. |
| `maze_tiles` | `table?` | `nil` | Maze tile definitions. |
| `maze_tile_size` | `number?` | `nil` | Size of maze tiles. |
| `MIN_WORMHOLE_ID` | `number` | `2300000` | Base ID for generating teleporter pairs. |
| `wormholeprefab` | `string?` | `nil` | Prefab name used for wormhole teleporters. |
| `required_prefabs` | `table` | `{}` | Map of prefab names to required counts. |

## Main functions
### `Graph:AddChild(child)`
* **Description:** Registers a child subgraph and links it bidirectionally via parent reference.  
* **Parameters:**
  * `child` (`Graph`) — Subgraph to add.
* **Returns:** `nil`
* **Error states:** Asserts if `child` is missing or if `child.id` already exists in `self.children`.

### `Graph:LockGraph(id, left_exit_node, right_exit_node, lock)`
* **Description:** Creates a new exit edge (typically a locked/conditional transition) between two exit nodes across graphs. Uses `WorldSim:AddExternalLink` to register inter-graph linkage.  
* **Parameters:**
  * `id` (`string?`) — Optional edge ID; defaults to `"Exit" .. GetTableSize(self.exit_edges)`.
  * `left_exit_node` (`Node`) — Source node in this graph.
  * `right_exit_node` (`Node`) — Destination node in another graph.
  * `lock` (`table`) — Lock data (e.g., key requirement).
* **Returns:** `Edge` — The created exit edge.

### `Graph:AddEdgeByNode(id, node1, node2, lock)`
* **Description:** Adds an internal edge connecting two nodes, inserting them into `self.nodes` if absent. Registers a bidirectional link via `WorldSim:AddLink`.  
* **Parameters:**
  * `id` (`string?`) — Edge ID.
  * `node1`, `node2` (`Node`) — Endpoints of the edge.
  * `lock` (`table?`) — Optional lock data.
* **Returns:** `Edge`

### `Graph:GetEdge(id)`
* **Description:** Searches for an edge (internal or exit) across the graph hierarchy.  
* **Parameters:**
  * `id` (`string`) — Edge identifier.
* **Returns:** `Edge?` — The edge if found, otherwise `nil`.

### `Graph:GetRandomNode()`
* **Description:** Randomly selects a node excluding entrance nodes. Uses uniform sampling over `self.nodes`.  
* **Parameters:** None  
* **Returns:** `Node`

### `Graph:GetRandomNodeForExit()`
* **Description:** Selects a random node suitable for exit placement, respecting `random_node_exit_weight` weights.  
* **Parameters:** None  
* **Returns:** `Node`

### `Graph:CrosslinkRandom(crossLinkFactor)`
* **Description:** Adds random internal edges between non-entrance nodes to increase graph connectivity. A `crossLinkFactor > 0` controls the maximum new edges. Edges are marked `hidden`.  
* **Parameters:**
  * `crossLinkFactor` (`number`) — Maximum number of crosslinks to add.
* **Returns:** `nil`

### `Graph:MakeLoop()`
* **Description:** Attempts to connect linear graph end-nodes (degree-1 nodes) to form a cycle. Skips entrance nodes.  
* **Parameters:** None  
* **Returns:** `nil`

### `Graph:Populate(map, spawnFN, entities, check_col)`
* **Description:** Populates the graph by delegating to nodes, then spawns default items into uncovered ground areas using `spawnfordefault`.  
* **Parameters:**
  * `map` (`Map`) — World map reference.
  * `spawnFN` (`table`) — Spawn function table.
  * `entities` (`table`) — Entity storage by prefab.
  * `check_col` (`function`) — Collision check function.
* **Returns:** `nil`

### `Graph:ProcessInsanityWormholes(entities, width, height)`
* **Description:** Scans for nodes tagged `"OneshotWormhole"` and pairs them into teleporters with双向 links (`teleporter.target`). Uses `obj_layout` to place wormhole entities.  
* **Parameters:**
  * `entities` (`table`) — Entity storage.
  * `width`, `height` (`number`) — Map dimensions.
* **Returns:** `nil`

### `Graph:SwapWormholesAndRoads(entities, width, height)`
* **Description:** Replaces external edges (`exit_edges`) with wormhole teleporter pairs using coordinates from `WorldSim:GetWormholes`. Inserts wormhole entities into `entities[self.wormholeprefab]`.  
* **Parameters:** Same as `ProcessInsanityWormholes`.  
* **Returns:** `nil`

### `Graph:ApplyPoisonTag()`
* **Description:** Modifies `WorldSim` node flags based on node tags: `"ForceConnected"` (flag `0x02`), `"RoadPoison"` (`0x04`), or `"ForceDisconnected"` (clears links via `WorldSim:ClearNodeLinks`). Recursively processes children.  
* **Parameters:** None  
* **Returns:** `nil`

### `Graph:GetRequiredPrefabs()`
* **Description:** Collects required prefabs recursively across the graph hierarchy. Counts per-prefab occurrences.  
* **Parameters:** None  
* **Returns:** `table` — Shallow copy of `required_prefabs` with aggregated counts.

### `Graph:SwapOutWormholeMarkers(entities, width, height)`
* **Description:** Converts `"wormhole_MARKER"` entries into paired teleporters using `self.wormholeprefab`. Groups markers in pairs and replaces their `teleporter.target` IDs with bidirectional mapping.  
* **Parameters:** Same as `ProcessInsanityWormholes`.  
* **Returns:** `nil`

### `Graph:ResolveCustomizationPrefabs(entities, width, height)`
* **Description:** Applies prefab customization swaps (e.g., `"prefab_CUSTOM"` → `"prefab"`) using `PrefabSwaps.ResolveCustomizationPrefab`, then moves entity data and removes proxy prefabs.  
* **Parameters:** Same as `ProcessInsanityWormholes`.  
* **Returns:** `nil`

### `Graph:ResolveRandomizationPrefabs(entities, width, height)`
* **Description:** Replaces randomized prefabs (e.g., `"prefab_random"`) with resolved values via `PrefabSwaps.ResolveRandomizationPrefab`.  
* **Parameters:** Same as `ProcessInsanityWormholes`.  
* **Returns:** `nil`

### `Graph:SaveEncode(map, encoded)`
* **Description:** Encodes the graph and all descendants into a serializable structure used for network sync and save data. Includes nodes, edges, story depth, and color indexing via `EncodeColour`.  
* **Parameters:**
  * `map` (`Map`) — Map reference.
  * `encoded` (`table`) — Mutable accumulator for encoded data.
* **Returns:** `nil`

## Events & listeners
None.