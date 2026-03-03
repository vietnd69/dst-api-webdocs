---
id: maprecorder
title: Maprecorder
description: Stores and manages recorded map data for teaching exploration progress between players.
tags: [map, teaching, player, data, persistence]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 5971661b
system_scope: player
---

# Maprecorder

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`MapRecorder` is a component that captures and persists map exploration data from one player (the source) so it can be taught to another player. It holds a serialized map representation (`mapdata`), associated metadata (author, session, world type, day), and provides methods to record, teach, check tile visibility, and persist/load state. The component is typically attached to an item (e.g., a map scroll) that facilitates sharing exploration progress.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("maprecorder")

-- Set callbacks for external reactions to data changes
inst.components.maprecorder:SetOnTeachFn(function(inst, target)
    -- Handle successful teach, e.g., show feedback
end)
inst.components.maprecorder:SetOnDataChangedFn(function(inst)
    -- Update UI when map data changes
end)

-- Record map from a player
local success, reason = inst.components.maprecorder:RecordMap(some_player)

-- Teach the recorded map to another player
local taught, reason = inst.components.maprecorder:TeachMap(another_player)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** No tags are added, removed, or checked.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `mapdata` | string or nil | `nil` | Serialized string representing recorded map tiles and exploration state. |
| `mapsession` | string or nil | `nil` | Session identifier of the world where the map was recorded. |
| `maplocation` | string | `TheWorld.worldprefab` | Name of the world prefab (e.g., `"forest"`, `"caves"`). |
| `mapauthor` | string or nil | `nil` | Name of the player who originally explored and recorded the map. |
| `mapday` | number or nil | `nil` | In-game day number when the map was recorded (1-indexed). |
| `onteachfn` | function or nil | `nil` | Optional callback invoked on successful `TeachMap()`. |
| `ondatachangedfn` | function or nil | `nil` | Optional callback invoked after `ClearMap()`, `RecordMap()`, or `OnLoad()` when data changes. |

## Main functions
### `SetOnTeachFn(fn)`
* **Description:** Sets a callback function that is executed when a map is successfully taught to a target player.
* **Parameters:** `fn` (function) — Function of signature `(inst: Entity, target: Entity) → nil`.
* **Returns:** Nothing.

### `SetOnDataChangedFn(fn)`
* **Description:** Sets a callback function invoked whenever the recorded map data is cleared, recorded, or reloaded.
* **Parameters:** `fn` (function) — Function of signature `(inst: Entity) → nil`.
* **Returns:** Nothing.

### `HasData()`
* **Description:** Checks whether valid map data has been recorded.
* **Parameters:** None.
* **Returns:** `true` if `mapdata` is non-`nil` and has length > `0`; otherwise `false`.

### `IsCurrentWorld()`
* **Description:** Verifies the recorded map session belongs to the current world session.
* **Parameters:** None.
* **Returns:** `true` if `mapsession` equals `TheWorld.meta.session_identifier`; otherwise `false`.

### `ClearMap()`
* **Description:** Resets all recorded map data and metadata to `nil`.
* **Parameters:** None.
* **Returns:** Nothing.
* **Side effects:** Invokes `ondatachangedfn`, if set.

### `RecordMap(target)`
* **Description:** Records the exploration state of the given player into `mapdata`. Requires the target to be a valid player with `player_classified.MapExplorer` component.
* **Parameters:** `target` (Entity) — Player whose map exploration is to be recorded.
* **Returns:** 
  * `true` — On successful recording (and `mapdata` is non-empty).
  * `false`, `"NOEXPLORER"` — If target lacks required component.
  * `false`, `"BLANK"` — If recording produced empty data.
* **Side effects:** Updates `mapsession`, `maplocation`, `mapauthor`, and `mapday`. Invokes `ondatachangedfn` if valid data is stored.

### `TeachMap(target)`
* **Description:** Attempts to teach the recorded map data to the target player.
* **Parameters:** `target` (Entity) — Player who should learn the map.
* **Returns:** 
  * `true` — On success; removes the component from `self.inst` after teaching.
  * `false`, `"BLANK"` — If no recorded data exists (and component is removed).
  * `false`, `"WRONGWORLD"` — If the recorded map was from a different world.
  * `false`, `"NOEXPLORER"` — If target lacks required component.
  * `false` — If `MapExplorer:LearnRecordedMap()` fails.
* **Side effects:** May remove `self.inst` on success or blank data. Invokes `onteachfn`, if set.

### `IsTileSeeableInRecordedMap(target, tx, ty)`
* **Description:** Checks whether a specific world tile (`tx`, `ty`) is visible (explored) in the recorded map for the given player.
* **Parameters:** 
  * `target` (Entity) — Player whose explorer component must be used.
  * `tx`, `ty` (number) — World tile coordinates.
* **Returns:** `true` if tile is visible in recorded data; `false` otherwise (including if no data or explorer is missing).
* **Note:** Documentation comment warns this is expensive; use sparingly or refactor for batch checks.

### `TransferComponent(newinst)`
* **Description:** Transfers all recorded map data and metadata to the `maprecorder` component of another entity.
* **Parameters:** `newinst` (Entity) — Entity that will receive the component data.
* **Returns:** Nothing.
* **Side effects:** Updates `newinst.components.maprecorder` fields and calls its `ondatachangedfn`, if set.

### `OnSave()`
* **Description:** Returns a serializable table of all persistent fields for save/load.
* **Parameters:** None.
* **Returns:** Table with keys: `mapdata`, `mapsession`, `maplocation`, `mapauthor`, `mapday`.

### `OnLoad(data)`
* **Description:** Restores component state from saved data during world load.
* **Parameters:** `data` (table or nil) — Saved map data as returned by `OnSave()`.
* **Returns:** Nothing.
* **Side effects:** Updates internal fields and calls `ondatachangedfn` if any field was updated or if `maplocation` changed.

## Events & listeners
None identified
