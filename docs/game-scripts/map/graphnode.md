---
id: graphnode
title: Graphnode
description: Manages procedural generation logic for a Voronoi region in the world map, including entity placement, tile generation, and population using custom functions or Voronoi-based sampling.
tags: [world, generation, voronoi, entity, terrain]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 5a5db0c2
---

# Graphnode

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `Node` component represents a single Voronoi region (site) in the world map and handles procedural population of entities (e.g., prefabs), terrain tiles, and custom layout generation within that region. It is central to world generation logic in `Don't Starve Together`, orchestrating how ground entities, background rooms (children), and static layouts are placed using Voronoi-generated coordinates and filtering rules. It interacts with `map/terrain` and `map/object_layout`, and uses `PrefabSwaps` to resolve proxy and inactive prefabs.

## Usage example

```lua
local Node = require("map/graphnode").Node

-- Create a node with a unique ID and data table
local node = Node("site_10", {
    type = "forest",
    colour = {r = 0, g = 255, b = 0, a = 50},
    tags = {"grass", "outdoor"},
    terrain_contents = {
        countprefabs = { "grass" = 3, "tree" = 2 },
        distributeprefabs = { "rock" = 1, "bush" = 1 },
        distributepercent = 0.3,
    },
    terrain_contents_extra = {
        prefabs = { "bunny" }
    }
})

-- Assign custom population functions (if needed)
node:SetPopulateFunction(my_custom_populate_data)

-- Trigger population with a spawn function and world dimensions
node:PopulateVoronoi(spawnFn, entitiesOut, map.width, map.height, world_gen_choices, prefabDensities)
```

## Dependencies & tags
**Components used:** None (this is a data/functional helper, not a standard ECS component attached to an entity).
**Tags:** No tags are added/removed; the component only reads `self.data.tags` (from constructor `data` input) for serialization and metadata.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `id` | `string` | — | Unique identifier for this node/site. |
| `graph` | `table` or `nil` | `nil` | Reference to the parent graph (uninitialized in constructor). |
| `delta_graph` | `table` or `nil` | `nil` | Reference to a delta graph (uninitialized in constructor). |
| `edges` | `table` | `{}` | List of edges connecting this node to others. |
| `data` | `table` | — | Configuration data passed at construction; contains `type`, `tags`, `terrain_contents`, `custom_tiles`, `custom_objects`, etc. |
| `visited` | `boolean` | `false` | Used during graph traversal algorithms. |
| `colour` | `{r, g, b, a}` | `{r=255, g=255, b=0, a=55}` | RGBA colour used for debug rendering or serialization. |
| `ents` | `table` or `nil` | `nil` | Unused in current code. |
| `populateFn` | `function` or `nil` | `nil` | Unused. |
| `tileFn` | `function` or `nil` | `nil` | Unused. |
| `populated` | `boolean` | `false` | Flag indicating whether this node has been populated. |
| `children_populated` | `boolean` | `false` | Flag indicating whether child (background) sites have been populated. |
| `custom_objects_data` | `table` or `nil` | `nil` | Stores custom population function data after `SetPopulateFunction`. |
| `custom_tiles_data` | `table` or `nil` | `nil` | Stores custom tile generation function data after `SetTilesFunction`. |

## Main functions

### `Node:SaveEncode(map)`
* **Description:** Serializes node geometry, position, type, and colour into a compact table for saving to map files. Converts world-space coordinates to tile scale and centric coordinates.
* **Parameters:** 
  - `map` (`table`): The map definition containing `width`, `height` (used to compute offsets).
* **Returns:** 
  - `table`: Serialized node data with keys `x`, `y`, `cent`, `poly`, `type`, `c`, `area`, `tags`.
* **Error states:** None.

### `Node:SetPosition(position)`
* **Description:** Stores the node’s position in `self.data.position`.
* **Parameters:** 
  - `position` (`{x, y}`): The position vector.
* **Returns:** None.

### `Node:GetPosition()`
* **Description:** Returns the stored position.
* **Parameters:** None.
* **Returns:** `position` (`{x, y}`) or `nil`.
* **Error states:** Returns `nil` if `self.data.position` was never set.

### `Node:IsConnectedTo(node)`
* **Description:** Checks whether this node shares an edge with the given `node`.
* **Parameters:** 
  - `node` (`Node`): The node to test connectivity against.
* **Returns:** `boolean`: `true` if connected, else `false`.
* **Error states:** Fails with `assert(node)` if `node` is `nil`.

### `Node:SetPopulateFunction(custom_objects_data)`
* **Description:** Assigns a custom object population function; marks node as unpopulated.
* **Parameters:** 
  - `custom_objects_data` (`table`): Contains `GeneratorFunction` and `data` fields. Expected structure: `{ GeneratorFunction = function(site_id, data), data = table }`.
* **Returns:** None.

### `Node:SetTilesFunction(custom_tiles_data)`
* **Description:** Assigns a custom tile generation function.
* **Parameters:** 
  - `custom_tiles_data` (`table`): Same structure as `custom_objects_data`.
* **Returns:** None.

### `Node:PopulateViaFunction()`
* **Description:** Invokes the custom object population function if one is assigned.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** Does nothing if `self.custom_objects_data` is `nil`.

### `Node:SetTilesViaFunction(entities, width, height)`
* **Description:** Invokes the custom tile generation function, passing world dimensions and tile entity list.
* **Parameters:** 
  - `entities` (`table`): Output tile/terrain data.
  - `width`, `height` (`number`): Map dimensions.
* **Returns:** None.
* **Error states:** Does nothing if `self.custom_tiles_data` is `nil`.

### `Node:ConvertGround(spawnFn, entitiesOut, width, height, world_gen_choices)`
* **Description:** Resolves and places static layouts defined in `self.data.terrain_contents.countstaticlayouts` (and `terrain_contents_extra.static_layouts`) for this node. Uses `map/object_layout` to convert layout definitions to entities.
* **Parameters:** 
  - `spawnFn` (`table`): Unused (argument kept for interface consistency).
  - `entitiesOut` (`table`): Output table keyed by prefab name, holding entity placements.
  - `width`, `height` (`number`): Map dimensions.
  - `world_gen_choices` (`table`): Unused in this function.
* **Returns:** None.

### `Node:PopulateVoronoi(spawnFn, entitiesOut, width, height, world_gen_choices, prefabDensities)`
* **Description:** Main Voronoi-based population routine. Populates entities via `countprefabs`, `distributeprefabs`, and `terrain_contents_extra.prefabs` using precomputed site points. Handles filtering for global prefab swaps, clumping, and extra placement. Computes and records `prefabDensities`.
* **Parameters:** 
  - `spawnFn` (`table`): Must contain methods `pickspawncountprefabforground` and `pickspawnprefab`.
  - `entitiesOut` (`table`): Output table keyed by prefab name.
  - `width`, `height` (`number`): Map dimensions.
  - `world_gen_choices` (`table`): Additional global spawn rules (e.g., clumps, extra percentages).
  - `prefabDensities` (`table`): Output table to store density (count per point) per node.
* **Returns:** None.
* **Error states:** 
  - Silently exits if `self.populated == true`, `self` is impassable, or terrain contents are missing/invalid.
  - May log warnings if `countprefabs` cannot be fully placed.

### `Node:PopulateChildren(spawnFn, entitiesOut, width, height, backgroundRoom, perTerrain, world_gen_choices, prefabDensities)`
* **Description:** Populates child (background) sites using `backgroundRoom` definitions, handling both uniform (`backgroundRoom`) and per-terrain (`perTerrain == true`) cases (e.g., caves). Invokes `PopulateExtra` for remaining sites.
* **Parameters:** 
  - `spawnFn` (`table`): Required for picking prefabs.
  - `entitiesOut`, `width`, `height`: Same as `PopulateVoronoi`.
  - `backgroundRoom` (`table` or `table[terrain_type] = table`): Layout rules.
  - `perTerrain` (`boolean`): If `true`, `backgroundRoom` is keyed by terrain type (e.g., `"grassland"`, `"mushroom"`).
  - `world_gen_choices`, `prefabDensities`: Same as `PopulateVoronoi`.
* **Returns:** None.
* **Error states:** Logs error if site points cannot be retrieved; silently skips if `children_populated == true`.

### `Node:PopulateExtra(world_gen_choices, spawnFn, data)`
* **Description:** Uses leftover Voronoi points to place additional entities based on `world_gen_choices`, including clumping support. Removes prefabs already fully spawned.
* **Parameters:** 
  - `world_gen_choices` (`table`): Map of prefab → amount or `{ clumpcount, clumpsize }` structure.
  - `spawnFn` (`table`): Required for picking prefabs.
  - `data` (`table`): Contains `points_x`, `points_y`, `points_type`, `idx_left`, `entitiesOut`, `width`, `height`, `prefab_list`.
* **Returns:** None.
* **Error states:** None.

## Helper functions (internal)
* `getFilteredSpawnWeight(list, weight, prefab)`: Computes normalized weight for a prefab after excluding inactive or swapped ones. Used to adjust remaining probabilities when prefabs are filtered out.
* `recurseTable(dataTable, removed, fn)`: Recursively processes nested tables (e.g., `distributeprefabs`) via `fn`, returning modified table and a `removed` map of dropped entries.
* `filterPrefabsForGlobalSwaps(params, removed)`: Applies `PrefabSwaps` logic: removes inactive prefabs, resolves proxy prefabs (e.g., `ground_sticks` → `sticks`) using `PrefabSwaps` APIs.
* `resolveswappableprefabs(table)`: Chooses one random prefab from each swappable group (`{prefabs, weight}` table).
* `PopulateWorld_AddEntity(...)`: Internal helper to record entity placements in `entitiesOut`, including optional per-prefab `data`, `id`, `scenario`, `skinname`.

## Events & listeners
None identified.