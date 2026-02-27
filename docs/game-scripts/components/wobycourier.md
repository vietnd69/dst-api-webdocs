---
id: wobycourier
title: Wobycourier
description: Stores and synchronizes chest coordinate positions per shard for Woby courier functionality across the game world.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 8a6cb022
---

# Wobycourier

## Overview
This component tracks and synchronizes the XZ-world coordinates of a Woby courier chest on a per-shard basis. It enables persistent storage and dynamic network synchronization of the chest position—primarily for UI updates and world alignment—by interfacing with the shard-specific positioning system and the `woby_commands_classified` component.

## Dependencies & Tags
- `inst.woby_commands_classified`: Requires the `woby_commands_classified` component to be present on the entity (assumed to expose `chest_posx` and `chest_posz` props).
- Uses `TheShard:GetShardId()` to identify the current shard.
- Uses `TheWorld.Map`, `TheWorld.components.undertile`, and `TileGroupManager:IsLandTile()` for coordinate validation.

No explicit entity tags are added or removed by this component.

## Properties

| Property    | Type   | Default Value | Description |
|-------------|--------|---------------|-------------|
| `inst`      | Entity | N/A           | Reference to the entity this component is attached to. |
| `shardid`   | string | Current shard ID from `TheShard:GetShardId()` | Unique identifier for the active shard, used as a key in `positions`. |
| `positions` | table  | `{}`          | Dictionary mapping shard IDs to `{x, z}` coordinate tables. Stores last known chest position per shard. |

## Main Functions

### `NetworkLocation()`
* **Description:** Updates the `chest_posx` and `chest_posz` properties on the `woby_commands_classified` component with the stored position for the current shard, or sets them to `WOBYCOURIER_NO_CHEST_COORD` if no position is stored. If the entity is the player (server is client), it pushes an `updatewobycourierchesticon` event to refresh the UI.
* **Parameters:** None.

### `CanStoreXZ(x, z)`
* **Description:** Validates whether the given world coordinates fall on a valid land tile (non-ocean).
* **Parameters:**
  * `x` (number): World X coordinate.
  * `z` (number): World Z coordinate.

### `StoreXZ(x, z)`
* **Description:** Validates and stores the world coordinates for the current shard, then updates networked UI via `NetworkLocation()`. Returns `true` on success, `false` if the tile is invalid.
* **Parameters:**
  * `x` (number): World X coordinate.
  * `z` (number): World Z coordinate.

### `ClearXZ()`
* **Description:** Removes the stored position for the current shard and triggers `NetworkLocation()` to clear the UI indicators. Returns `true` if a position was cleared; `false` otherwise.
* **Parameters:** None.

### `OnSave()`
* **Description:** Returns a serializable table containing the `positions` data for persistence. Returns `nil` if no positions are stored.
* **Parameters:** None.

### `OnLoad(data)`
* **Description:** Restores the `positions` table from save data and refreshes networked location state via `NetworkLocation()`.
* **Parameters:**
  * `data` (table|nil): Saved component state, expected to contain a `positions` key.

### `GetDebugString()`
* **Description:** Returns a debug string for in-game debugging tools, showing the stored chest position as `"Pos: x z"` or `"NPOS"` if unavailable.
* **Parameters:** None.

## Events & Listeners
- Listens for **no events** explicitly (no `inst:ListenForEvent` calls).
- Triggers/pushes:
  - `"updatewobycourierchesticon"` — Pushed via `inst:PushEvent()` from `NetworkLocation()` when the entity is `ThePlayer` (i.e., server is client), to signal UI updates.