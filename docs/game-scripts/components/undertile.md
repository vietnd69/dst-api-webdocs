---
id: undertile
title: Undertile
description: Manages a data grid representing the tile types directly beneath map tiles, used for layered terrain storage in the world.
tags: [world, terrain, save, grid]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 6c81f3cc
system_scope: world
---

# Undertile

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Undertile` is a server-only component that stores and manages a secondary tile layer—referred to as "underneath tiles"—for each map coordinate. It uses a `DataGrid` structure to hold tile IDs that exist *beneath* the primary surface tiles, enabling layered terrain data (e.g., hidden cave layers or base terrain beneath structures). The component initializes its data grid on world size change and supports saving/loading for persistence.

This component is intended for internal world-generation or terrain override logic and is only active on the master simulation.

## Usage example
```lua
-- Attached automatically by the engine; manual usage is rare.
-- Example of reading and writing underneath tile data:
local undertile = some_entity.components.undertile
local tile = undertile:GetTileUnderneath(x, y)
undertile:SetTileUnderneath(x, y, TILE.DIRT_FLOOR)
undertile:ClearTileUnderneath(x, y)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (assigned) | The entity instance to which this component is attached. |

*Note:* `inst` is the only public member variable; all other state is held in private module-level variables (e.g., `_underneath_tiles`).

## Main functions
### `GetTileUnderneath(x, y)`
* **Description:** Retrieves the tile ID stored at the given `(x, y)` map coordinate in the underlying tile layer.
* **Parameters:**  
  `x` (number) — The X map coordinate.  
  `y` (number) — The Y map coordinate.  
* **Returns:** `number?` — The stored tile ID, or `nil` if unset.

### `SetTileUnderneath(x, y, tile)`
* **Description:** Assigns a tile ID to the specified `(x, y)` coordinate in the underlying tile layer.
* **Parameters:**  
  `x` (number) — The X map coordinate.  
  `y` (number) — The Y map coordinate.  
  `tile` (number) — The tile ID to store.  
* **Returns:** Nothing.

### `ClearTileUnderneath(x, y)`
* **Description:** Removes the stored tile at the given `(x, y)` coordinate by setting it to `nil`.
* **Parameters:**  
  `x` (number) — The X map coordinate.  
  `y` (number) — The Y map coordinate.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `worldmapsetsize` — Triggers initialization of the `_underneath_tiles` data grid when the world map size is finalized.

## Save/Load
- **OnSave()** → `string`  
  Serializes the underneath tile grid using `DataGrid:Save()`, then compresses and encodes the data. Returns the resulting save string.

- **OnLoad(data)**  
  Decodes and decompresses the provided save data, then loads it into `_underneath_tiles`. Applies tile ID conversion using `TheWorld.tile_id_conversion_map` to ensure compatibility across save versions. No return value.
