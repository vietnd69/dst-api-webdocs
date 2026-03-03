---
id: vaulttorchgrid
title: Vaulttorchgrid
description: Manages a grid of vault torch entities and their state persistence in the game world.
tags: [torch, grid, persistence, lighting]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 7336ab56
system_scope: environment
---

# Vaulttorchgrid

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Vaulttorchgrid` manages a 2D grid of `vault_torch` prefabs spawned relative to an owner entity (typically a vault structure). It handles dynamic initialization of the grid, iteration over torches, adjacency queries, and serialization/deserialization of torch states (on/off, stuck, broken) for save/load persistence. The component relies on the `machine` component to read/write torch state via `IsOn`, `TurnOn`, and `TurnOff` methods.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("vaulttorchgrid")
inst.components.vaulttorchgrid:Initialize(3, 2, 4) -- 3 columns, 2 rows, spacing of 4
inst.components.vaulttorchgrid:SetOnTorchAddedFn(function(owner, torch) print("Torch added") end)
local torch = inst.components.vaulttorchgrid:GetTorch(2, 1)
inst.components.vaulttorchgrid:ForEachAdjacent(torch, function(owner, adjtorch) adjtorch:DoTask() end)
```

## Dependencies & tags
**Components used:** `machine` (via `torch.components.machine:IsOn`, `TurnOn`, `TurnOff`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity instance this component is attached to. |
| `spacing` | number | `DEFAULT_SPACING` (`4`) | Distance between adjacent torches in world units. |
| `numcols` | number | `0` | Number of columns in the grid. |
| `numrows` | number | `0` | Number of rows in the grid. |
| `coloffs` | number | `0` | Column offset used to center the grid around the owner's origin. |
| `rowoffs` | number | `0` | Row offset used to center the grid around the owner's origin. |
| `grid` | table | `{}` | 2D array of torch entities indexed as `grid[col][row]`. |

## Main functions
### `SetOnTorchAddedFn(fn)`
*   **Description:** Sets a callback function invoked whenever a torch is added to the grid during `Initialize` or `OnLoad`.
*   **Parameters:** `fn` (function) - signature: `fn(owner_entity, torch_entity)`.
*   **Returns:** Nothing.

### `SetOnTorchRemovedFn(fn)`
*   **Description:** Sets a callback function invoked whenever a torch is removed from the grid during `Clear`.
*   **Parameters:** `fn` (function) - signature: `fn(owner_entity, torch_entity)`.
*   **Returns:** Nothing.

### `OnRemoveEntity()`
*   **Description:** Removes all torch entities in the grid. Typically called when the owner entity is being destroyed.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Clear()`
*   **Description:** Removes all torches from the grid and resets grid dimensions.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Initialize(numcols, numrows, spacing)`
*   **Description:** Creates a new grid of torches with specified dimensions and spacing. Clears any existing grid first.
*   **Parameters:**  
    *   `numcols` (number) - number of columns (positive integer).  
    *   `numrows` (number) - number of rows (positive integer).  
    *   `spacing` (number, optional) - distance between torches; defaults to `DEFAULT_SPACING` (`4`) if omitted.  
*   **Returns:** Nothing.

### `GetTorch(col, row)`
*   **Description:** Returns the torch entity at grid coordinates `(col, row)`, where coordinates are in the *logical* grid (0-based and centered via offsets).
*   **Parameters:**  
    *   `col` (number) - logical column index (0-based).  
    *   `row` (number) - logical row index (0-based).  
*   **Returns:** `Entity` or `nil` — the torch entity if it exists and the indices are within bounds.

### `ForEach(cb)`
*   **Description:** Iterates over all torches in the grid (column-major order) and calls `cb` for each. Iteration stops early if `cb` returns `true`.
*   **Parameters:**  
    *   `cb` (function, optional) - signature: `cb(owner_entity, torch_entity)`; returning `true` terminates iteration.  
*   **Returns:** Nothing.

### `ForEachAdjacent(torch, cb)`
*   **Description:** Iterates over the four orthogonal neighbors (up, down, left, right) of the given torch and calls `cb` for each existing neighbor. The torch must have valid `torch.col` and `torch.row` fields.
*   **Parameters:**  
    *   `torch` (Entity) - the torch entity whose neighbors to iterate.  
    *   `cb` (function, optional) - signature: `cb(owner_entity, neighbor_torch)`.  
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Serializes the current grid state (torch on/off, stuck, broken status) into a compact hex string. Only performs serialization if the grid is initialized (`numcols > 0` and `numrows > 0`).
*   **Parameters:** None.
*   **Returns:**  
    *   `table` with keys:  
        *   `cols` (number) — number of columns.  
        *   `rows` (number) — number of rows.  
        *   `spacing` (number, optional) — spacing only if non-default.  
        *   `bits` (string) — hex-encoded bitstring of torch states.  
    *   `nil` if the grid is not initialized.

### `OnLoad(data)`
*   **Description:** Restores the grid and its torch states from `data` (typically returned by `OnSave`). Recreates the grid if dimensions or spacing differ.
*   **Parameters:**  
    *   `data` (table) — must contain `cols` and `rows`; optionally `spacing` and `bits`.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified.  
- **Pushes:** `machineturnedon`, `machineturnedoff` — via torch `machine` component when toggling state during `OnLoad`.
