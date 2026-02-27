---
id: graphedge
title: Graphedge
description: Represents a bidirectional connection between two graph nodes in the world map, managing rendering, locking, and data persistence for map navigation structures.
tags: [map, graph, navigation, rendering, persistence]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 0fe9f86a
---

# Graphedge

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `Edge` component defines a bidirectional connection between two graph nodes (`node1` and `node2`) in the game's world map system. It maintains metadata such as visual colour, optional lock configuration, and content references. Edges are used internally to support procedural map generation, level traversal logic, and debug rendering — but are not attached to game entities as standard components (i.e., they exist as plain Lua objects, not ECS components). Each edge is automatically registered with both its connected nodes, and tracks whether it has been visited or is hidden.

## Usage example
```lua
local node1 = GraphNode(1, x1, y1, data1)
local node2 = GraphNode(2, x2, y2, data2)
local edge = Edge("e_12", node1, node2, nil, { colour = { r=255, g=128, b=0, a=255 } })
edge.hidden = false
edge:RenderToMap(map_instance)
```

## Dependencies & tags
**Components used:** None (the class is self-contained and does not reference or interact with any entity components via `inst.components.X`).  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `id` | `string` | — | Unique identifier for the edge. |
| `node1` | `GraphNode` | — | First node this edge connects. |
| `node2` | `GraphNode` | — | Second node this edge connects. |
| `visited` | `boolean` | `false` | Flag indicating whether this edge has been traversed. |
| `hidden` | `boolean` | `false` | Controls whether the edge is skipped during rendering. |
| `data` | `table?` | `nil` | Optional arbitrary data passed on construction (used for colour, etc.). |
| `locked` | `table?` | `nil` | Lock configuration in form `{locktype, keytype, keynode}`; if present, enforces traversal restrictions. |
| `contents` | `table` | `{}` | Mutable array-like table for edge-related content (e.g., loot, events). |
| `colour` | `table` | `{r=255,g=0,b=0,a=255}` | RGBA colour for debug rendering; defaults to red unless overridden via `data.colour`. |

## Main functions
### `RenderToMap(map, args)`
* **Description:** Renders a line segment between the two connected nodes on the specified map, using the second node's data value as the render value. Overridable via `args.value_override`.
* **Parameters:**
  * `map` (`Map`): Target map object providing the `DrawLine` method and dimensions.
  * `args` (`table?`): Optional arguments; if present and contains `value_override`, its value replaces `self.node2.data.value`.
* **Returns:** `nil`
* **Error states:** No explicit error handling documented; silently returns if `self.hidden == true`.

### `DrawDebug(draw, map)`
* **Description:** Draws the edge as a debug line centered relative to the map, scaled by `TILE_SCALE`.
* **Parameters:**
  * `draw` (`Draw`): Graphics context providing a `Line` method.
  * `map` (`Map`): Map instance used to compute center offsets.
* **Returns:** `nil`

### `SaveEncode(map)`
* **Description:** Serializes essential edge state into a compact table, suitable for map saving/loading.
* **Parameters:**
  * `map` (`Map?`): Unused in current implementation; included for API compatibility.
* **Returns:** `table` with keys:
  * `n1` (`string`): ID of `node1`.
  * `n2` (`string`): ID of `node2`.
  * `c` (`table`): `self.colour` table (RGBA values).

### `Populate(map, spawnFn)`
* **Description:** Placeholder method intended for filling the edge with dynamic content (e.g., via a spawner function). Currently empty.
* **Parameters:**
  * `map` (`Map`): Target map instance.
  * `spawnFn` (`function`): Expected callback for content generation.
* **Returns:** `nil`

## Events & listeners
None. This class does not register or dispatch any events via `inst:ListenForEvent` or `inst:PushEvent`.