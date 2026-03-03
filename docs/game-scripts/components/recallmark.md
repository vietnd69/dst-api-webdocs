---
id: recallmark
title: Recallmark
description: Marks a specific world position as a recall point for teleportation, storing coordinates and shard ID for later use.
tags: [teleportation, memory, world]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: a5d5046f
system_scope: world
---

# Recallmark

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Recallmark` is a component that allows an entity to store and manage a single recall position—a saved coordinate in the world (including shard ID) used for teleportation. It enforces teleportation permission checks before marking and maintains a `recall_unmarked` tag until a valid position is set. The component persists its state across saves and supports copying its state from another entity.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("recallmark")

-- Attempt to mark a position
local success, reason = inst.components.recallmark:MarkPosition(100, 0, -100, "forest")

if success then
    print("Recall position marked at", inst.components.recallmark:GetMarkedPosition())
else
    print("Failed to mark:", reason)
end

-- Later: check if marked and for same shard
if inst.components.recallmark:IsMarked() and inst.components.recallmark:IsMarkedForSameShard() then
    -- Safe to recall
end
```

## Dependencies & tags
**Components used:** None  
**Tags:** Adds `recall_unmarked` in constructor; removes it upon successful marking.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `recall_x` | number? | `nil` | X coordinate of the marked position. |
| `recall_y` | number? | `nil` | Y coordinate of the marked position. |
| `recall_z` | number? | `nil` | Z coordinate of the marked position. |
| `recall_worldid` | string? | `nil` | Shard/world ID associated with the marked position. |
| `onMarkPosition` | function? | `nil` | Optional callback fired after marking; signature: `fn(inst, x, y, z, worldid)`. |

## Main functions
### `MarkPosition(recall_x, recall_y, recall_z, recall_worldid)`
*   **Description:** Attempts to mark a position as the entity’s recall point. Validates teleport permission (using `IsTeleportingPermittedFromPointToPoint`). If valid, stores coordinates and world ID, removes `recall_unmarked` tag, and fires `onMarkPosition` callback if set.
*   **Parameters:**  
    - `recall_x`, `recall_y`, `recall_z` (numbers or `nil`) — Position coordinates. Missing values default to `0`.  
    - `recall_worldid` (string or `nil`) — Shard ID. Defaults to current shard if omitted.
*   **Returns:**  
    - `true` on success.  
    - `false, "NO_TELEPORT_ZONE"` if teleporting is disallowed at the position.
*   **Error states:** Returns early with `false` if the point fails the teleport permission check (e.g., inside a禁止区域).

### `Copy(rhs)`
*   **Description:** Copies the recall position from another entity’s `recallmark` component (`rhs`) into this component. If `rhs` is `nil` or lacks the component, does nothing.
*   **Parameters:** `rhs` (entity or `nil`) — Entity whose recall position to copy.
*   **Returns:** Nothing.

### `IsMarked()`
*   **Description:** Checks whether a recall position has been set.
*   **Parameters:** None.
*   **Returns:** `true` if `recall_worldid` is non-`nil`; otherwise `false`.

### `IsMarkedForSameShard()`
*   **Description:** Checks whether the stored recall position belongs to the current shard.
*   **Parameters:** None.
*   **Returns:** `true` if `recall_worldid` matches `TheShard:GetShardId()`; otherwise `false`.

### `GetMarkedPosition()`
*   **Description:** Returns the stored coordinates **only** if the recall position is in the current shard. Otherwise returns `nil`.
*   **Parameters:** None.
*   **Returns:** `recall_x`, `recall_y`, `recall_z` (all numbers) if on the same shard; otherwise `nil`.

### `OnSave()`
*   **Description:** Serializes the current recall position for world save.
*   **Parameters:** None.
*   **Returns:** Table: `{ recall_x, recall_y, recall_z, recall_worldid }` — `nil` values included if unset.

### `OnLoad(data)`
*   **Description:** Restores the recall position from saved data. Calls `MarkPosition` with saved coordinates and world ID if present.
*   **Parameters:** `data` (table or `nil`) — Saved data from `OnSave`.
*   **Returns:** Nothing.

## Events & listeners
None identified.
