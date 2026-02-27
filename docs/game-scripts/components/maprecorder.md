---
id: maprecorder
title: Maprecorder
description: Records, teaches, and manages structured map exploration data for entities (specifically maps) in Don't Starve Together.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 5971661b
---

# Maprecorder

## Overview
The `MapRecorder` component stores and manages recorded map data (e.g., explored tiles) associated with a specific world session and author. It enables recording new map data from an explorer (a player), verifying compatibility, teaching the map to another explorer, querying tile visibility, and persisting/loading state via `OnSave`/`OnLoad`. It is primarily used by map-related entities (e.g., the "Map" item) to interact with the `MapExplorer` component on players.

## Dependencies & Tags
- Requires target entities to have a `MapExplorer` component (accessed via `target.player_classified.MapExplorer`).  
- No components are added/removed on the host entity (`inst`).  
- No tags are added/removed.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `mapdata` | `string?` | `nil` | Base64-encoded serialized map data from a recording session. |
| `mapsession` | `string?` | `nil` | Session identifier of the world where the map was recorded. |
| `maplocation` | `string` | `TheWorld.worldprefab` | World prefab name (e.g., "forest", "cave") where the map was recorded. |
| `mapauthor` | `string?` | `nil` | Name of the player who recorded the map. |
| `mapday` | `number?` | `nil` | Day number (1-indexed, based on `TheWorld.state.cycles + 1`) when the map was recorded. |
| `onteachfn` | `function?` | `nil` | Optional callback invoked after successfully teaching the map data to a target. |
| `ondatachangedfn` | `function?` | `nil` | Optional callback invoked when map data is cleared, set, or loaded (e.g., after `ClearMap`, `RecordMap`, `OnLoad`). |

## Main Functions

### `SetOnTeachFn(fn)`
* **Description:** Sets the optional callback function executed after successfully teaching the map to a target.  
* **Parameters:**  
  - `fn`: Function expecting `(maprecorder_inst, target)` as arguments.

### `SetOnDataChangedFn(fn)`
* **Description:** Sets the optional callback function executed whenever map data changes (e.g., cleared, recorded, or loaded).  
* **Parameters:**  
  - `fn`: Function expecting `(maprecorder_inst)` as argument.

### `HasData()`
* **Description:** Returns `true` if `mapdata` is non-empty; otherwise `false`.  
* **Parameters:** None.  
* **Returns:** `boolean`

### `IsCurrentWorld()`
* **Description:** Checks whether the recorded map session matches the current world’s session identifier.  
* **Parameters:** None.  
* **Returns:** `boolean`

### `ClearMap()`
* **Description:** Clears all recorded map data and metadata (`mapdata`, `mapsession`, `mapauthor`, `mapday`), and invokes `ondatachangedfn` if defined.  
* **Parameters:** None.

### `RecordMap(target)`
* **Description:** Records current exploration state from a player (target) and stores it in this component. Returns success/failure and an error code.  
* **Parameters:**  
  - `target`: Entity expected to have a `MapExplorer` component (typically a player).  
* **Returns:**  
  - On success: `true`  
  - On failure: `false, "NOEXPLORER"` (no `MapExplorer` component), `false, "BLANK"` (failed to generate data), or `false, "WRONGWORLD"` (invalid check; *note: logic uses `IsCurrentWorld()` only during teaching*).

### `TeachMap(target)`
* **Description:** Attempts to teach (apply) the recorded map data to a target player. Removes the entity after successful teaching.  
* **Parameters:**  
  - `target`: Entity expected to have a `MapExplorer` component.  
* **Returns:**  
  - On success: `true`  
  - On failure: `false, "BLANK"` (no data), `false, "WRONGWORLD"` (session mismatch), or `false, "NOEXPLORER"` (missing `MapExplorer`).

### `IsTileSeeableInRecordedMap(target, tx, ty)`
* **Description:** Checks if a specific tile (`tx`, `ty`) is visible in the recorded map data for a given target.  
* **Parameters:**  
  - `target`: Entity with `MapExplorer` component.  
  - `tx`, `ty`: Integer world tile coordinates.  
* **Returns:** `boolean`

### `TransferComponent(newinst)`
* **Description:** Copies the map data and metadata to another entity’s `maprecorder` component (used when duplicating or transferring map items). Invokes `ondatachangedfn` if new data is valid.  
* **Parameters:**  
  - `newinst`: The destination entity instance.

### `OnSave()`
* **Description:** Returns a table containing all serializable map data for world save persistence.  
* **Parameters:** None.  
* **Returns:** `{mapdata, mapsession, maplocation, mapauthor, mapday}`

### `OnLoad(data)`
* **Description:** Restores map data from a saved table. Triggers `ondatachangedfn` only if data fields are loaded or `maplocation` changes.  
* **Parameters:**  
  - `data`: Saved state table (from `OnSave`).  
* **Returns:** None.

## Events & Listeners
None. This component does not register or dispatch any events via `inst:ListenForEvent` or `inst:PushEvent`. Callbacks (`onteachfn`, `ondatachangedfn`) are invoked directly.