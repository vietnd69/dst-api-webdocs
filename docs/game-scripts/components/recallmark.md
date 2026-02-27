---
id: recallmark
title: Recallmark
description: Tracks and stores a position and shard ID where a player can teleport back to using recall mechanics.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: a5d5046f
---

# Recallmark

## Overview
The `Recallmark` component enables an entity (typically a player) to mark and store a valid teleport location, including coordinates and shard ID. It manages the "recalled position" state, enforces teleportation permissions, and handles saving/loading for persistence. When a position is marked, the `recall_unmarked` tag is removed from the entity.

## Dependencies & Tags
- **Tags added/removed**: Automatically adds the `"recall_unmarked"` tag on construction; removes it when a position is successfully marked.
- **Dependencies**: Uses `TheShard:GetShardId()` (global shard system). No explicit component dependencies are declared in the constructor or methods.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `recall_x` | number | `nil` | X-coordinate of the marked position (after marking). |
| `recall_y` | number | `nil` | Y-coordinate of the marked position (after marking). |
| `recall_z` | number | `nil` | Z-coordinate of the marked position (after marking). |
| `recall_worldid` | number/string | `nil` | Shard/world ID where the marked position resides. Defaults to current shard if not provided. |
| `onMarkPosition` | function | `nil` | Optional callback invoked when `MarkPosition` succeeds. |

## Main Functions
### `MarkPosition(recall_x, recall_y, recall_z, recall_worldid)`
* **Description**: Attempts to mark the current entity’s recall position. Validates the position using `IsTeleportingPermittedFromPointToPoint` (self-check) and updates internal state if valid. Removes `recall_unmarked` tag and sets properties. Invokes `onMarkPosition` callback if defined.  
* **Parameters**:  
  - `recall_x`, `recall_y`, `recall_z`: Coordinates (numbers). If `nil`, they default to `0`.  
  - `recall_worldid`: Optional shard ID (number or string). Defaults to current shard ID (`TheShard:GetShardId()`) if omitted.  
  - **Returns**: `true` on success; `false, "NO_TELEPORT_ZONE"` if the point is invalid.

### `Copy(rhs)`
* **Description**: Copies recall position data from another entity’s `recallmark` component (if present) to this one.  
* **Parameters**:  
  - `rhs`: Entity or `nil`. If `rhs` has a `recallmark` component, its position data is copied. No return value.

### `IsMarked()`
* **Description**: Checks whether the entity has a currently marked position.  
* **Returns**: `true` if `recall_worldid` is non-`nil`; otherwise `false`.

### `IsMarkedForSameShard()`
* **Description**: Determines if the marked position is on the current shard (i.e., same as `TheShard:GetShardId()`).  
* **Returns**: `true` if `recall_worldid` matches the current shard ID; otherwise `false`.

### `GetMarkedPosition()`
* **Description**: Returns the stored coordinates *only* if the marked position is on the current shard.  
* **Returns**: `x, y, z` (numbers) if on same shard; otherwise `nil`.

### `OnSave()`
* **Description**: Serializes the component’s state into a table for save-file persistence.  
* **Returns**: Table with keys: `recall_x`, `recall_y`, `recall_z`, `recall_worldid`.

### `OnLoad(data)`
* **Description**: Restores the component’s state from saved data. Calls `MarkPosition` if valid data is provided.  
* **Parameters**:  
  - `data`: Table with keys matching `OnSave` output. If `data.recall_worldid` exists, the position is restored.

## Events & Listeners
None.