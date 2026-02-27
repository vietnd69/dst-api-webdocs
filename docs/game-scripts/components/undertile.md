---
id: undertile
title: Undertile
description: Manages a persistent data grid for storing underlying tile types beneath the map surface in the game world.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 6c81f3cc
---

# Undertile

## Overview
This component maintains and manipulates an internal `DataGrid` that stores "underneath" tile information—i.e., the tile types beneath the currently visible map layer. It is initialized in response to world map size changes and supports saving/loading its state for persistence across sessions. It is strictly server-side (mastersim-only).

## Dependencies & Tags
- **Component Dependency**: None (relies only on internal `DataGrid` and global systems).
- **Event Listener**: Listens for `"worldmapsetsize"` on `TheWorld` to initialize its internal data grid.
- **No tags are added or removed** from the entity it is attached to.

## Properties
The component does not expose public instance variables beyond `self.inst`. All internal state is held in private variables (`_underneath_tiles`, `_world`, `_map`), which are initialized during construction.

No public properties are exposed.

## Main Functions

### `GetTileUnderneath(x, y)`
* **Description:** Returns the tile ID stored at the specified world coordinates `(x, y)` in the underlying tile grid.
* **Parameters:**
  * `x` (number): The X coordinate in world space.
  * `y` (number): The Y coordinate in world space.

### `SetTileUnderneath(x, y, tile)`
* **Description:** Sets the underlying tile at `(x, y)` to the specified tile ID.
* **Parameters:**
  * `x` (number): The X coordinate in world space.
  * `y` (number): The Y coordinate in world space.
  * `tile` (any): The tile ID to store. May be `nil` (though `SetTileUnderneath` is intended for non-nil values; use `ClearTileUnderneath` instead for clearing).

### `ClearTileUnderneath(x, y)`
* **Description:** Clears (removes) the underlying tile at `(x, y)` by setting its value to `nil`.
* **Parameters:**
  * `x` (number): The X coordinate in world space.
  * `y` (number): The Y coordinate in world space.

### `OnSave()`
* **Description:** Serializes and compresses the current state of the underneath tile grid for saving to disk.
* **Returns:** A compressed, encoded data string suitable for storage.

### `OnLoad(data)`
* **Description:** Loads and reconstructs the underneath tile grid from saved data. Applies tile ID conversion mappings (e.g., for mod compatibility across versions).
* **Parameters:**
  * `data` (string): Compressed and encoded save data returned by `OnSave()`.

## Events & Listeners
- Listens for `"worldmapsetsize"` event on `TheWorld` to trigger `_underneath_tiles` initialization via `InitializeDataGrid`.
- Does **not** push or emit any events itself.