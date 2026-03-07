---
id: gridplacer
title: Gridplacer
description: A visual helper component used during building placement to show grid-aligned placement outlines and handle build validation feedback via color changes.
tags: [placement, visual, grid, helper]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: fb6d1377
system_scope: world
---

# Gridplacer

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`gridplacer` is a lightweight visual prefab component used to display placement feedback (such as grid-aligned placement outlines) during building interactions. It is not a persistent game object (`persists = false`) and is not networked. It leverages the `placer` component to handle build validation callbacks (`oncanbuild`, `oncannotbuild`) and coordinate snapping. Several variants exist (`tile_outline`, `axisalignedplacement_outline`, `gridplacer_turfhat`, `gridplacer_farmablesoil`, `gridplacer_group_outline`) for specific visual and functional behaviors.

## Usage example
```lua
-- Standard grid placement helper
local inst = SpawnPrefab("gridplacer")
inst.Transform:SetPosition(x, y, z)
inst.components.placer:OnUpdateTransform()

-- Grid group helper (e.g., multi-tile structure outlines)
local group = SpawnPrefab("gridplacer_group_outline")
group:PlaceGrid(tx, tz)
group:RemoveGrid(tx, tz)
```

## Dependencies & tags
**Components used:** `placer`, `updatelooper` (only for `gridplacer_turfhat`)
**Tags:** Adds `CLASSIFIED`, `NOCLICK`, and `placer` to all variants. `CLASSIFIED` and `NOCLICK` prevent interaction and visibility in standard UI contexts; `placer` identifies it for placement-related systems.

## Properties
No public properties are directly defined in the `gridplacer` constructor. It inherits configuration from the `placer` component.

## Main functions
### `SetPlayer(player)` *(gridplacer_turfhat only)*
*   **Description:** Assigns or removes the player associated with this turf hat outline. When assigned, it registers update functions to synchronize placement with the player's position (e.g., for wall-tethered placement). When cleared, it unregisters the callbacks.
*   **Parameters:** `player` (Entity or `nil`) — the entity whose position drives the outline; if `nil`, updates stop.
*   **Returns:** Nothing.

### `PlaceGrid(tx, tz)` *(gridplacer_group_outline only)*
*   **Description:** Spawns a new `gridplacer` instance at the specified tile coordinates and registers it in the group’s internal grid for coordinated visual updates.
*   **Parameters:** `tx` (number) – tile X coordinate; `tz` (number) – tile Z coordinate.
*   **Returns:** Nothing.

### `RemoveGrid(tx, tz)` *(gridplacer_group_outline only)*
*   **Description:** Removes the `gridplacer` instance at the specified tile coordinates from the group and destroys it.
*   **Parameters:** `tx` (number) – tile X coordinate; `tz` (number) – tile Z coordinate.
*   **Returns:** Nothing.

### `PlaceGridAtPoint(x, y, z)` *(gridplacer_group_outline only)*
*   **Description:** Converts a world point to tile coordinates and calls `PlaceGrid`.
*   **Parameters:** `x`, `y`, `z` (numbers) – world coordinates.
*   **Returns:** Nothing.

### `RemoveGridAtPoint(x, y, z)` *(gridplacer_group_outline only)*
*   **Description:** Converts a world point to tile coordinates and calls `RemoveGrid`.
*   **Parameters:** `x`, `y`, `z` (numbers) – world coordinates.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onremove` (gridplacer_group_outline) — triggers cleanup that removes all associated `gridplacer` instances in the group.
- **Pushes:** None (all callbacks are handled internally by the `placer` component or custom handler functions).
