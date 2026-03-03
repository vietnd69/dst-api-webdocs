---
id: worldroutes
title: Worldroutes
description: Stores and manages cached static route data for circular paths across the world's traversable terrain.
tags: [world, routing, navigation, save, cache]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 79fd16bd
system_scope: world
---

# Worldroutes

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`WorldRoutes` is a server-side component attached exclusively to `TheWorld` that caches static route data used to define circular paths across traversable terrain. Since computing these paths is computationally expensive, the component persists the precomputed results in `self.routes` and supports saving/loading via `OnSave`/`OnLoad` to avoid recomputation across sessions.

## Usage example
```lua
-- This component is added only to TheWorld on the master simulation.
-- Typical usage is internal to world initialization and path computation systems.
-- Example addition (not shown in source):
-- inst:AddComponent("worldroutes")
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `routes` | table | `{}` | A map of route names (strings) to ordered lists of `Vector3` positions defining the path. |

## Main functions
### `SetRoute(routename, route)`
*   **Description:** Stores a computed route under a given name in the internal cache. The route is expected to be an array of `Vector3` points.
*   **Parameters:**  
    * `routename` (string) — Unique identifier for the route.  
    * `route` (table) — Ordered list of `Vector3` positions representing the path.
*   **Returns:** Nothing.

### `GetRoute(routename)`
*   **Description:** Retrieves a stored route by name.
*   **Parameters:**  
    * `routename` (string) — The name of the route to fetch.
*   **Returns:** The route table (array of `Vector3`), or `nil` if the route does not exist.

### `OnSave()`
*   **Description:** Serializes all stored routes into a save-compatible format. Converts each `Vector3` point into a 2-element table `{x, z}`.
*   **Parameters:** None.
*   **Returns:** A table of the form `{ routes = { [routename] = { {x1,z1}, {x2,z2}, ... }, ... } }`, or `nil` if no routes exist.

### `OnLoad(data)`
*   **Description:** Deserializes route data from a save file. Converts each 2-element position array back into a `Vector3` with `y = 0`.
*   **Parameters:**  
    * `data` (table?) — Save data previously returned by `OnSave()`, or `nil` if no data exists.
*   **Returns:** Nothing.
*   **Error states:** Silently ignores malformed or missing `data`; safely handles `nil` or empty route tables.

## Events & listeners
None identified
