---
id: vaulttorchgrid
title: Vaulttorchgrid
description: Manages the placement, initialization, and serialization of a grid of vault torches attached to an entity in Don't Starve Together.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 7336ab56
---

# Vaulttorchgrid

## Overview
This component handles the creation, layout, and state management of a rectangular grid of `vault_torch` prefabs relative to its owning entity's position. It supports initializing torches at fixed offsets, tracking their on/off/stuck/broken states, iterating over torches (including adjacent neighbors), and saving/loading their state for persistence across sessions.

## Dependencies & Tags
- **Component Usage:** None explicitly added to `inst` in this file.
- **Entity Prefab Dependency:** Assumes owned entity has a `Transform` component (for world position) and potentially a `machine` component on torches (used during save/load).
- **Tags:** None identified.
- **Prefabs Spawned:** `vault_torch` (via `SpawnPrefab`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `GObject` | — | Reference to the entity this grid belongs to. |
| `spacing` | `number` | `4` (via `DEFAULT_SPACING`) | Distance (in world units) between adjacent torches in the grid. |
| `numcols` | `number` | `0` | Number of columns in the torch grid. |
| `numrows` | `number` | `0` | Number of rows in the torch grid. |
| `coloffs` | `number` | `0` | Offset used to center the grid; computed from `numcols` as `floor((1 - numcols) / 2)`. |
| `rowoffs` | `number` | `0` | Offset used to center the grid; computed from `numrows` as `floor((1 - numrows) / 2)`. |
| `grid` | `table<table<VaultTorch>>` | `{}` | 2D array (table-of-tables) storing torch entities by grid column index (`grid[col][row]`). |
| `ontorchaddedfn` | `function?` | `nil` | Optional callback `(entity, torch) → boolean?` triggered when a torch is added during `Initialize`. |
| `ontorchremovedfn` | `function?` | `nil` | Optional callback `(entity, torch) → void` triggered when a torch is removed (via `Clear` or `OnRemoveEntity`). |

## Main Functions

### `Initialize(numcols, numrows, spacing)`
* **Description:** Clears any existing grid and generates a new grid of `vault_torch` prefabs arranged in `numcols` × `numrows` layout, centered around the owner's position with the specified spacing.
* **Parameters:**
  * `numcols` (`number`) – Number of columns in the grid.
  * `numrows` (`number`) – Number of rows in the grid.
  * `spacing` (`number?`) – Optional spacing override; defaults to `DEFAULT_SPACING` if omitted.

### `GetTorch(col, row)`
* **Description:** Returns the torch at the given logical grid coordinates `(col, row)` (0-indexed, relative to the center), or `nil` if out of bounds.
* **Parameters:**
  * `col` (`number`) – Column index (e.g., `coloffs`-adjusted).
  * `row` (`number`) – Row index (e.g., `rowoffs`-adjusted).

### `ForEach(cb)`
* **Description:** Iterates through all torches in the grid in row-major order (nested columns then rows). Stops early if the callback returns `true`.
* **Parameters:**
  * `cb` (`function(entity, torch) → boolean?`) – Callback function invoked for each torch; returning `true` aborts iteration.

### `ForEachAdjacent(torch, cb)`
* **Description:** For a given torch in the grid, invokes `cb` for each of its four orthogonally adjacent neighbors (up/down/left/right), if present.
* **Parameters:**
  * `torch` (`GObject`) – Torch entity that must belong to this grid and have valid `col`/`row` properties.
  * `cb` (`function(entity, torch) → void`) – Callback invoked for each adjacent torch.

### `Clear()`
* **Description:** Removes and destroys all torches in the grid, resets counts, and triggers the `ontorchremovedfn` callback if set.
* **Parameters:** None.

### `OnRemoveEntity()`
* **Description:** Removes and destroys all torches in the grid without triggering `ontorchremovedfn`. Called when the owning entity is being removed.
* **Parameters:** None.

### `OnSave()`
* **Description:** Serializes the grid state (presence and state of each torch) into a compact hex string and returns a table containing grid configuration and serialized data. Returns `nil` if the grid is uninitialized.
* **Parameters:** None.
* **Returns:** (`table?`) – Returns `{ cols, rows, spacing?, bits }` or `nil` if not initialized.

### `OnLoad(data)`
* **Description:** Loads a previously saved grid configuration and torch states. Re-initializes the grid if dimensions or spacing differ, then deserializes torch states (on/off, stuck, broken).
* **Parameters:**
  * `data` (`table`) – Saved grid state with keys `cols`, `rows`, `spacing?`, and `bits`.

## Events & Listeners
- **Listeners:** None (`self.inst:ListenForEvent` is not used in this component).
- **Emitters:** None (`self.inst:PushEvent` is not used in this component).
- **Callbacks:** `ontorchaddedfn` and `ontorchremovedfn` are *not* events; they are user-configurable callbacks invoked synchronously during grid initialization and clearing.