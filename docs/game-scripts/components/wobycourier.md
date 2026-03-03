---
id: wobycourier
title: Wobycourier
description: Manages and synchronizes the chest location for the Woby Courier quest system across shards, storing world coordinates and updating network replication.
tags: [quest, map, network]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 8a6cb022
system_scope: network
---

# Wobycourier

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`WobyCourier` tracks and replicates the current chest position for the Woby Courier quest mechanic. It stores per-shard world coordinates (`xz` pairs) and synchronizes them to the client via the `woby_commands_classified` component’s replicated fields. It also validates storage locations against land tiles and handles save/load persistence.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("wobycourier")

-- Store a valid chest position (e.g., after placing)
if inst.components.wobycourier:StoreXZ(100, -200) then
    print("Chest location stored.")
end

-- Clear the stored position (e.g., after removing chest)
inst.components.wobycourier:ClearXZ()

-- Read current position for debugging or rendering
print(inst.components.wobycourier:GetDebugString())
```

## Dependencies & tags
**Components used:** `undertile`, `woby_commands_classified` (via `inst.woby_commands_classified`), `TheWorld.Map`, `TheWorld.components.undertile`, `TheShard`, `TileGroupManager`  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `shardid` | string | value of `TheShard:GetShardId()` | Identifier for the current shard; used as key for position storage. |
| `positions` | table | `{}` | Dictionary mapping shard IDs to `{x, z}` coordinate tables. |

## Main functions
### `NetworkLocation()`
*   **Description:** Replicates the stored chest position to the client via the `woby_commands_classified` component. If no position exists, sets a special "no chest" coordinate (`WOBYCOURIER_NO_CHEST_COORD`).
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Silently does nothing if `inst.woby_commands_classified` is absent.

### `CanStoreXZ(x, z)`
*   **Description:** Checks whether the given world coordinates lie on a valid land tile.
*   **Parameters:**  
  `x` (number) — world X coordinate.  
  `z` (number) — world Z coordinate.
*   **Returns:** `true` if the tile is land; `false` otherwise.

### `StoreXZ(x, z)`
*   **Description:** Stores the provided world coordinates for the current shard, validates them, and triggers replication.
*   **Parameters:**  
  `x` (number) — world X coordinate.  
  `z` (number) — world Z coordinate.
*   **Returns:** `true` if the coordinates were valid and stored; `false` if invalid (e.g., water tile).

### `ClearXZ()`
*   **Description:** Removes the stored position for the current shard and updates replication.
*   **Parameters:** None.
*   **Returns:** `true` if a position was cleared; `false` if none existed.

### `OnSave()`
*   **Description:** Serializes position data for world save persistence.
*   **Parameters:** None.
*   **Returns:** A table `{ positions = self.positions }` if positions exist; `nil` otherwise.

### `OnLoad(data)`
*   **Description:** Restores position data from a save file.
*   **Parameters:**  
  `data` (table | `nil`) — the loaded save data.
*   **Returns:** Nothing.
*   **Error states:** Silently returns if `data` or `data.positions` is missing.

### `GetDebugString()`
*   **Description:** Returns a human-readable debug string containing the current chest coordinates, or `"NPOS"` if none exist.
*   **Parameters:** None.
*   **Returns:** `string` — formatted as `"Pos: X.Z Z.Z"` or `"NPOS"`.

## Events & listeners
- **Pushes:** `updatewobycourierchesticon` — fired on the player entity when the chest icon location is updated on the client (only if `inst == ThePlayer` and the `woby_commands_classified` component is present).
