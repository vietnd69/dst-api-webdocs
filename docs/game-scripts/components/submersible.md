---
id: submersible
title: Submersible
description: Manages the submersion and positioning logic for entities (e.g., boats or players) transitioning between land and underwater environments in DST.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: aaa1b38b
---

# Submersible

## Overview
This component handles the submersion mechanics of an entity—determining whether it can remain at its current location underwater or must reposition (e.g., onto land or a different water tile). It facilitates the spawning of underwater salvageable objects, responds to land/sink events, and enforces tile-area checks to ensure valid placement before submerging.

## Dependencies & Tags
- Listens for `"onsink"` and `"on_landed"` events on the entity (`inst`).
- Relies on the following external systems: `TheWorld.Map`, `TheWorld.Map:IsOceanAtPoint`, `TheWorld.Map:IsSurroundedByWater`, `TUNING.MAX_WALKABLE_PLATFORM_RADIUS`, `FindWalkableOffset`, `VecUtil_Normalize`, and `shuffleArray`.
- Uses the `inventoryitem` and `inventory` components on the entity.
- May interact with the `underwater_salvageable` tag via spawned prefabs.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `GObject` | — | Reference to the entity this component is attached to. |
| `force_no_repositioning` | `boolean` | `false` | If `true`, disables automatic repositioning attempts during submersion (e.g., when sinking *from* a boat). |

## Main Functions

### `CheckNearbyTiles(x, y, z)`
* **Description:** Checks the 3×3 grid of tiles centered at the given world coordinates (offset by `CHECK_SPACING = 6`) to determine which are ocean vs. land, and whether the entire area is free of land (i.e., fully surrounded by water).  
* **Parameters:**  
  - `x`, `y`, `z`: World coordinates (floats) to check.

### `Submersible:GetUnderwaterObject()`
* **Description:** Checks if the entity is holding an item inside a container tagged `"underwater_salvageable"`. If so, returns that container; otherwise, returns `nil`.  
* **Parameters:** None.

### `Submersible:OnLanded()`
* **Description:** Ensures that if the entity lands on an ocean tile (e.g., due to being removed from a boat or world transition), it immediately submerges. Does nothing if the entity has an owner and is on land.  
* **Parameters:** None.

### `Submersible:Submerge()`
* **Description:** Handles full submersion logic:  
  - Checks if the entity already has an underwater object (skip if so).  
  - Validates current position and surrounding tiles.  
  - Attempts to find a suitable water tile using `CheckNearbyTiles` and `IsSurroundedByWater`.  
  - If no suitable water tile exists, repositions to a nearby land tile.  
  - Spawns a `"splash_green"` prefab or calls `MakeSunken` depending on destination.  
  *Returns `true` if the entity was moved; `false` otherwise.*  
* **Parameters:** None.

### `Submersible:MakeSunken(x, z, ignore_boats, nosplash)`
* **Description:** Spawns an `"underwater_salvageable"` prefab at the specified coordinates, gives the entity ownership of its inventory, fires the `"on_submerge"` event, and optionally spawns a splash effect.  
* **Parameters:**  
  - `x`, `z`: World coordinates (floats) to spawn the object.  
  - `ignore_boats` *(optional)*: Boolean. Passed to `IsOceanAtPoint`.  
  - `nosplash` *(optional)*: Boolean. If `true`, suppresses splash effect.

### `Submersible:OnRemoveFromEntity()`
* **Description:** Cleans up event listeners (`"onsink"` and `"on_landed"`) when the component is removed from the entity.  
* **Parameters:** None.

### `Submersible:OnSave()`
* **Description:** Returns a serializable table containing persistent state (`force_no_repositioning`) for saving to disk.  
* **Parameters:** None.

### `Submersible:OnLoad(data)`
* **Description:** Restores the `force_no_repositioning` state from saved data. Defaults to `false` if missing.  
* **Parameters:**  
  - `data`: Table loaded from save data (must contain keys matching the `OnSave` return structure).

## Events & Listeners
- Listens for:
  - `"onsink"` → triggers `OnSink`
  - `"on_landed"` → triggers `OnLanded`
- Triggers:
  - `"on_submerge"` → passed with `{ underwater_object = underwater_object }` after successfully sinking and spawning an underwater salvageable item.