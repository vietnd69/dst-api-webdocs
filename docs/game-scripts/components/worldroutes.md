---
id: worldroutes
title: Worldroutes
description: Caches precomputed circular traversal paths across the world's traverseable terrain for persistent use in Don't Starve Together.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 79fd16bd
---

# Worldroutes

## Overview
The `WorldRoutes` component caches static, world-scale route data—specifically, precomputed circular paths across traverseable terrain—to avoid expensive real-time calculations. It exists only on the master simulation and is attached exclusively to `TheWorld`. Route data is stored as named collections of `Vector3` points and supports serialization for save/load operations.

## Dependencies & Tags
- **Component Requirements:** None explicitly added via `AddComponent`.
- **Tags:** None assigned or removed.
- **Constraints:** Requires `TheWorld.ismastersim` to be true; must be attached to `TheWorld`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (assigned in `_ctor`) | Reference to `TheWorld`, set during construction and never modified. |
| `routes` | `table<string, vector3[]>` | `{}` | Dictionary mapping route names to ordered lists of `Vector3` points defining traversal paths. |

## Main Functions

### `SetRoute(routename, route)`
* **Description:** Stores or overwrites a named route (an array of `Vector3` points) in the component's internal `routes` table.  
* **Parameters:**
  - `routename` (`string`): Unique identifier for the route.
  - `route` (`vector3[]`): Ordered list of `Vector3` positions defining the path.

### `GetRoute(routename)`
* **Description:** Returns the stored route corresponding to the given name, or `nil` if not found.  
* **Parameters:**
  - `routename` (`string`): Name of the route to retrieve.

### `OnSave()`
* **Description:** Serializes all stored routes into a compact format suitable for world save files. Converts each `Vector3` point to a 2-element numeric array `[x, z]`. Returns `nil` if no routes exist.  
* **Parameters:** None.

### `OnLoad(data)`
* **Description:** Deserializes route data from a previously saved state. Converts numeric `[x, z]` arrays back into `Vector3` objects (`y` is hardcoded to `0`). Does nothing if `data` is `nil` or missing a `routes` field.  
* **Parameters:**
  - `data` (`table?`): Save data table, typically containing a `routes` key with serialized route data.

## Events & Listeners
None.