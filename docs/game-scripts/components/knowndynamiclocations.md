---
id: knowndynamiclocations
title: Knowndynamiclocations
description: Manages named dynamic positions and tracks their stability relative to walkable platforms in the world.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: ca6d8753
---

# Knowndynamiclocations

## Overview
This component tracks named dynamic locations in the game world by storing `DynamicPosition` objects, which may be anchored to walkable platforms. It provides methods to remember, retrieve, and persist these positions—including handling of platform removal and world loading—making it essential for stable reference points that adapt to dynamic world changes (e.g., moving platforms or floating islands).

## Dependencies & Tags
* Uses the `DynamicPosition` class (imported/available in scope).
* Listens for the `"onremove"` event on `walkable_platform` entities to detect platform removal and convert to world-space coordinates.
* Does not add or remove any tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (passed to constructor) | Reference to the entity this component is attached to. |
| `locations` | `table` | `{}` | Map of location names (`string`) to internal entry records (each containing `pos`, optional `loading`, and `onremoveplatform`). |

## Main Functions

### `RememberLocation(name, pt, dont_overwrite)`
* **Description:** Records a new named location at the given position `pt`. If `dont_overwrite` is `true`, existing entries are preserved; otherwise, the previous entry (if any) is cleared first. Position is stored as a `DynamicPosition`, with deferred platform attachment during world loading.
* **Parameters:**
  * `name` (`string`): Unique identifier for the location.
  * `pt` (`Vector3`): The position (x, y, z) to remember.
  * `dont_overwrite` (`boolean`, optional): If `true`, does not overwrite an existing entry for `name`. Defaults to `false`.

### `ForgetLocation(name)`
* **Description:** Removes a named location and cleans up associated platform event listeners.
* **Parameters:**
  * `name` (`string`): The name of the location to remove.

### `GetLocation(name)`
* **Description:** Returns the world-space position (`Vector3`) of a named location, or `nil` if the location does not exist.
* **Parameters:**
  * `name` (`string`): The name of the location.

### `GetDynamicLocation(name)`
* **Description:** Returns the internal `DynamicPosition` object for a named location (allowing direct manipulation or checks), or `nil` if not found.
* **Parameters:**
  * `name` (`string`): The name of the location.

### `OnSave()`
* **Description:** Serializes all known locations into a table for world save, storing position coordinates. Omits `y=0` for brevity.
* **Returns:** `table` or `nil` — e.g., `{ locations = { { name = "exit", x = 10, z = -5 }, ... } }`.

### `OnLoad(data)`
* **Description:** Restores remembered locations from saved data by re-calling `RememberLocation` with saved coordinates.
* **Parameters:**
  * `data` (`table`): The saved data table, typically containing a `locations` key.

### `LoadPostPass(ents, data)`
* **Description:** Called after loading to finalize deferred `DynamicPosition` creation (i.e., attaches to platforms and switches to world-space positions for entries marked during loading).
* **Parameters:**
  * `ents` (`table`): Entity lookup table (unused in current implementation).
  * `data` (`table`): Saved data table (unused in current implementation).

### `GetDebugString()`
* **Description:** Returns a human-readable string listing all known locations and their current `DynamicPosition` state, or `nil` if none are stored.
* **Returns:** `string?`

### `WatchPlatformForEntry(entry)`
* **Description:** Attaches an `"onremove"` event listener to a platform if the `DynamicPosition` is platform-anchored, ensuring the position updates to world coordinates upon platform removal.
* **Parameters:**
  * `entry` (`table`): Internal location record containing `pos` and `onremoveplatform` fields.

### `StopWatchingPlatformForEntry(entry)`
* **Description:** Removes the platform removal listener and clears related fields.
* **Parameters:**
  * `entry` (`table`): Internal location record.

## Events & Listeners
* Listens for `"onremove"` event on `entry.pos.walkable_platform` (added via `WatchPlatformForEntry`) to update position to world space when the platform is destroyed.
* Uses `inst:ListenForEvent` and `inst:RemoveEventCallback` for platform listener management.