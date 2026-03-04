---
id: storygen
title: Storygen
description: Generates and connects map regions, tasks, and narrative-driven room layouts using lock-and-key progression, node graphs, and setpieces for world generation in DST.
tags: [world, narrative, generation, graph, map]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 129a43d6
---

# Storygen

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `Storygen` component orchestrates narrative-driven world generation by constructing a graph of interconnected map regions (called *tasks*), applying lock-and-key progression logic to determine room placement and connectivity, and populating rooms with prefabs, static layouts, and special tags. It builds upon graph and terrain systems (`Graph`, `Terrain`) and integrates tightly with `Rooms`, `MapTags`, and `LockAndKey` to guide player progression through world segments such as the mainland, islands, and region-specific areas (e.g., `ruins_island`). This component is not a typical ECS component but a standalone generator class instantiated for each story/level.

## Usage example

```lua
local Story = require("map/storygen")
local tasks = {
    { id = "start", region_id = "mainland", locks = {}, keys_given = { "axe" }, room_choices = { "Grass", "Twigs" } },
    { id = "pig_village", region_id = "mainland", locks = { "blocked_path" }, keys_given = {}, room_choices = { "PigHouse" } },
}
local level = { ... } -- level definition
local story_gen_params = { branching = "default", loop_percent = 0.5, start_setpeice = "Teleportato" }

local story_instance = Story("MAIN_STORY", tasks, terrain, story_gen_params, level)
story_instance:GenerationPipeline()
-- Result: story_instance.rootNode, story_instance.startNode, story_instance.GlobalTags
```

## Dependencies & tags
**Components used:** None — this is a standalone generator, not an ECS component. It *uses* external modules via `require()` (e.g., `map/rooms`, `map/maptags`) but does *not* call `inst:AddComponent()` or manage component instances.

**Tags:** None explicitly added or removed on entities via `inst:AddTag()` — however, it populates `self.GlobalTags`, a nested table mapping tag names to sets of `task_id` → list of node IDs that carry that tag via `MapTags.Tag` (e.g., `"TeleportatoExit"` tags may be applied to specific nodes via static layout metadata).

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `id` | `string` | `nil` (passed to constructor) | Identifier for this story instance (e.g., `"GAME"`). |
| `loop_blanks` | `number` | `1` | Counter for loop-blank node IDs (used when closing loops). |
| `gen_params` | `table` | `nil` (passed to constructor) | World generation parameters (e.g., `branching`, `island_percent`, `start_setpeice`). |
| `impassible_value` | `number` | `WORLD_TILES.IMPASSABLE` | Terrain tile value used for impassable nodes (e.g., blank regions). |
| `level` | `table` | `nil` (passed to constructor) | Level definition containing `background_node_range`, `ocean_population`, `ordered_story_setpieces`, etc. |
| `tasks` | `table` | `{}` | Map of `task_id → task_definition` used to build the world. |
| `region_link_tasks` | `number` | `1` | Counter for auto-generated region link task IDs. |
| `region_tasksets` | `table` | `{}` | Map of `region_id → { task_id → task }`, grouping tasks by region (e.g., `"mainland"`, `"ruins_island"`). |
| `GlobalTags` | `table` | `{}` | Aggregated global tags for modders; structure: `{ tag_name → { task_id → { node_id1, node_id2, ... } } }`. |
| `TERRAIN` | `table` | `{}` | Map of `task_id → Graph` storing the generated node graphs for each task (built during `GenerateNodesFromTasks`). |
| `terrain` | `table` | `nil` (passed to constructor) | Terrain configuration object (contains `filter`, used in room generation). |
| `rootNode` | `Graph` | constructed in constructor | Root `Graph` node containing all generated story nodes as children. |
| `startNode` | `Graph.Node?` | `nil` | The starting node graph (set by `_AddPlayerStartNode`). |
| `map_tags` | `MapTags` | `MapTags()` | Instance of `MapTags` used to process room tags (e.g., for static layout injection). |

## Main functions

### `Story(id, tasks, terrain, gen_params, level)`
* **Description:** Constructor. Initializes the story generator, parses provided tasks into `self.tasks` and `self.region_tasksets`, creates the root graph node, and initializes `map_tags`.
* **Parameters:**
  - `id` (`string`): Story instance identifier.
  - `tasks` (`table`): Array of task definitions (each with `id`, `region_id`, `locks`, `keys_given`, `room_choices`, etc.).
  - `terrain` (`table`): Terrain config object.
  - `gen_params` (`table`): Generation parameters (e.g., `branching`, `loop_percent`).
  - `level` (`table`): Level-specific overrides and metadata (e.g., `ocean_population`).
* **Returns:** None.
* **Error states:** None documented in code.

### `Story:GenerationPipeline()`
* **Description:** Orchestrates the full generation pipeline: generates nodes from tasks, adds background and cove nodes, inserts setpieces, processes global tags, and handles ocean content.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** May assert if required rooms (e.g., background, blocker_blank) are missing.

### `Story:GetRoom(roomname)`
* **Description:** Fetches and deep-copies a room template by name from `Rooms.GetRoomByName`, clones it, assigns name and type, and applies any `RoomPreInit` mod hooks.
* **Parameters:**
  - `roomname` (`string`): Name of the room template (e.g., `"Grass"`, `"Blank"`).
* **Returns:** `table?` — The cloned room definition or `nil` if not found.
* **Error states:** Returns `nil` if the room is not found.

### `Story:PlaceTeleportatoParts()`
* **Description:** Deprecated function that attempts to distribute Teleportato parts (via `ordered_story_setpieces` in level) into task nodes marked with `"ExitPiece"` tags. No-op if parts are missing.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** Skips with warning if parts cannot be placed; no assertion failure.

### `Story:ProcessOceanContent()`
* **Description:** Configures ocean fake room content using `ocean_population` and `ocean_population_setpieces` from `self.level`.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** May silently skip if no ocean population is defined.

### `Story:InsertAdditionalSetPieces(task_nodes)`
* **Description:** Inserts fixed setpieces (from `task.set_pieces`) and random setpieces (from `task.random_set_pieces`) into task nodes that meet criteria (non-entrance, non-blank, background-compatible). Uses `shuffledKeys` to iterate.
* **Parameters:**
  - `task_nodes` (`table?`): Optional table of task nodes; defaults to `self.rootNode:GetChildren()`.
* **Returns:** None.
* **Error states:** Logs a warning if no suitable node is found for a setpiece.

### `Story:RestrictNodesByKey(startParentNode, unusedTasks)`
* **Description:** Determines task connectivity using a strict lock-and-key mechanism: tasks are unlocked only when *all* their locks are satisfied by keys provided in previously processed nodes. Supports configurable branching strategies (`"default"`, `"random"`, `"most"`, `"least"`, `"never"`).
* **Parameters:**
  - `startParentNode` (`Graph.Node`): Root starting node.
  - `unusedTasks` (`table`): Map of `task_id → Graph.Node` of tasks not yet added.
* **Returns:** `Graph.Node` — The last node added to the graph.
* **Error states:** Uses `assert` for edge/node exits; may crash if nodes lack required entrance/exit points.

### `Story:LinkNodesByKeys(startParentNode, unusedTasks)`
* **Description:** Alternative to `RestrictNodesByKey`: connectivity is checked per lock using available keys accumulated so far; if any key satisfies a lock, the task is unlockable. Supports the same branching strategies as above.
* **Parameters:**
  - `startParentNode` (`Graph.Node`)
  - `unusedTasks` (`table`)
* **Returns:** `Graph.Node` — Last node added.
* **Error states:** Same as `RestrictNodesByKey`.

### `Story:SeperateStoryByBlanks(startnode, endnode)`
* **Description:** Inserts a blank, impassable node with `"RoadPoison"` and `"ForceDisconnected"` tags between two nodes to prevent direct connectivity (used for loop prevention, region separation).
* **Parameters:**
  - `startnode`, `endnode` (`Graph.Node`)
* **Returns:** None.
* **Error states:** None.

### `Story:GenerateNodesFromTask(task, crossLinkFactor, starting_node_name)`
* **Description:** Generates a subgraph (a `Graph`) for a single task by stacking room definitions (entrance room, `room_choices`) into a node list, adding edges between them, and optionally creating a hub or loop. Handles special rooms (e.g., hub, starting room) and applies `distributeprefabs` substitutions.
* **Parameters:**
  - `task` (`table`): Task definition.
  - `crossLinkFactor` (`number?`): Controls random extra edge insertion via `task_node:CrosslinkRandom`.
  - `starting_node_name` (`string?`): Name of the room to treat as the starting node.
* **Returns:** `Graph` — The generated task subgraph.
* **Error states:** Asserts if entrance or room templates are missing.

### `Story:_FindStartingTask(task_nodes)`
* **Description:** Selects a starting task that has no locks (or only `"none"` lock) from `task_nodes`; falls back to a random task if none qualify.
* **Parameters:**
  - `task_nodes` (`table`): Map of `task_id → Graph.Node`.
* **Returns:** `Graph.Node` — Selected starting task node.
* **Error states:** None.

### `Story:_AddPlayerStartNode(mainland)`
* **Description:** Creates and attaches a `"START"` node for the player portal, based on `valid_start_tasks`, `gen_params.start_node`, or defaults. Injects default prefabs (e.g., `spawnpoint`, `twiggytree`).
* **Parameters:**
  - `mainland` (`table`): Region data returned by `GenerateNodesForRegion` (`startingTask`, `entranceNode`, `finalNode`).
* **Returns:** `Graph.Node` — The added start node.
* **Error states:** None.

### `Story:AddBGNodes(min_count, max_count, task_nodes)`
* **Description:** Adds background/loop filler nodes to each task, based on `background_node_range`. Respects entrance node exclusion and inserts blocker blanks for entrances.
* **Parameters:**
  - `min_count`, `max_count` (`number`): Random range for background nodes per task.
  - `task_nodes` (`table?`): Task nodes; defaults to root children.
* **Returns:** None.
* **Error states:** Asserts if background template room is missing.

### `Story:AddCoveNodes(task_nodes)`
* **Description:** Adds optional cove (dead-end) nodes to task nodes, based on `cove_room_chance` and `cove_room_max_edges` defined per task. Uses `cove_room_name` (default `"Blank"`).
* **Parameters:**
  - `task_nodes` (`table?`): Task nodes; defaults to root children.
* **Returns:** None.
* **Error states:** Asserts if cove room template is missing.

### `Story:FindMainlandNodesForNewRegion()`
* **Description:** Identifies two low-density mainland nodes in a 3×3 spatial bucket grid for attaching new regions (islands), avoiding the center bucket.
* **Parameters:** None.
* **Returns:** `{ node1, node2 }` — Two mainland nodes (tables with `x`, `y`, `node` fields).
* **Error states:** None.

### `Story:LinkRegions(n1, n2, num_links, link_tile)`
* **Description:** Creates a chain of `"REGION_LINK"` nodes (fake roads) to connect two points (`n1`, `n2`) on the map. Uses `"RoadPoison"` and `"ForceDisconnected"` tags.
* **Parameters:**
  - `n1`, `n2` (`{ node = Graph.Node }`): Connection points.
  - `num_links` (`number?`): Number of link nodes (default `4`).
  - `link_tile` (`number?`): Terrain tile value (default `WORLD_TILES.OCEAN_COASTAL`).
* **Returns:** None.
* **Error states:** None.

### `Story:AddRegionsToMainland(on_region_added_fn)`
* **Description:** Connects non-mainland regions (`"ruins_island"`, `"vault_island"`, etc.) to the mainland via `FindMainlandNodesForNewRegion` and `LinkRegions`.
* **Parameters:**
  - `on_region_added_fn` (`function?`): Optional callback after linking.
* **Returns:** None.
* **Error states:** None.

### `Story:AddRegionToTasksNodes(region_taskset, task_name, node_name, links, on_region_added_fn)`
* **Description:** Connects a region to all nodes matching `node_name` inside a target task (`task_name`), using `LinkRegions`.
* **Parameters:**
  - `region_taskset` (`table`): Task set for the region.
  - `task_name`, `node_name` (`string`)
  - `links` (`number?`): Number of links (default `2`).
  - `on_region_added_fn` (`function?`)
* **Returns:** None.
* **Error states:** None.

### `Story:GetExtrasForRoom(next_room)`
* **Description:** Processes `MapTags.Tag` for a room’s tags to extract extra contents (static layouts, prefabs) and tags to apply. Updates `self.GlobalTags` for global tags.
* **Parameters:**
  - `next_room` (`table`): Room definition.
* **Returns:** `{ extra_contents, extra_tags }`.
* **Error states:** None.

## Events & listeners
None identified. This component does not register or fire events via `inst:ListenForEvent`/`inst:PushEvent`.