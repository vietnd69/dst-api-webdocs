---
id: shard_daywalkerspawner
title: Shard Daywalkerspawner
description: This component manages the location state of the Daywalker entity across mastershard and client shards, enabling deterministic position transitions (e.g., cave to surface) upon boss defeat.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: network
source_hash: 9ecab008
---

# Shard Daywalkerspawner

## Overview
This component tracks and synchronizes the Daywalker's current location (e.g., `cavejail` or `forestjunkpile`) across networked shards. It is only instantiated on the mastershard and uses a networked `tinybyte` variable (`location`) to persist and sync location state. On the mastershard, it automatically transitions the location upon receiving the `master_shardbossdefeated` event; on client shards, it merely syncs the value and updates the local state.

## Dependencies & Tags
- `inst.GUID` is used to bind the network variable.
- On the mastershard: listens for the `"master_shardbossdefeated"` event on `TheWorld`.
- On clients: listens for the `"locationdirty"` event on the entity.
- Tags: None explicitly added/removed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *(passed to constructor)* | The entity this component is attached to (typically a shard). |
| `DAYWALKERLOCATION` | `table` | `{ cavejail = 0, forestjunkpile = 1 }` | Enum mapping location names to integer IDs. |
| `DAYWALKERLOCATION_LOOKUP` | `table` | `{ 0 = "cavejail", 1 = "forestjunkpile" }` | Reverse lookup map (populated by `UpdateLocationNames()`). |
| `location` | `net_tinybyte` | `0` | Networked variable storing the current location ID. Synced via `locationdirty` events. |

## Main Functions
### `UpdateLocationNames()`
* **Description:** Builds or rebuilds the reverse lookup table (`DAYWALKERLOCATION_LOOKUP`) from the `DAYWALKERLOCATION` enum for efficient name ↔ ID conversion.
* **Parameters:** None.

### `GetLocation()`
* **Description:** Returns the current integer location ID stored in the network variable.
* **Parameters:** None.

### `GetLocationName()`
* **Description:** Returns the string name (e.g., `"cavejail"`) corresponding to the current location ID.
* **Parameters:** None.

### `SetLocation(location)`
* **Description:** Sets the location by ID or name (supporting string input), updates the network variable, and triggers a `"locationdirty"` event.
* **Parameters:**  
  * `location` (*string* or *number*): Location name (e.g., `"forestjunkpile"`) or enum ID (e.g., `1`). Defaults to `0` if name is invalid.

### `GetNewLocationName(oldlocation)`
* **Description (mastershard only):** Determines the next location based on the current one (currently only supports toggling between `"cavejail"` and `"forestjunkpile"`). Returns `nil` for unrecognized locations.
* **Parameters:**  
  * `oldlocation` (*string*): Current location name.

### `OnLocationUpdate(src, data)`
* **Description (mastershard only):** Handles the `master_shardbossdefeated` event by advancing the Daywalker’s location when `data.bossprefab == "daywalker"`.
* **Parameters:**  
  * `src` (*Entity*): Source of the event.  
  * `data` (*table?*): Event payload; must contain `bossprefab` and optionally `shardid`. Ignored if `nil`.

### `OnSave()`
* **Description (mastershard only):** Returns a serializable table containing the current location name for save/load persistence.
* **Parameters:** None.

### `OnLoad(data)`
* **Description (mastershard only):** Restores the location from saved data (e.g., after world load or shard respawn).
* **Parameters:**  
  * `data` (*table?*): Saved component state; expects `data.location` as a string.

### `GetDebugString()`
* **Description:** Returns a debug string with mastershard status and current location name for logging.
* **Parameters:** None.

## Events & Listeners
- Listens for `"master_shardbossdefeated"` on `TheWorld` (mastershard only).
- Listens for `"locationdirty"` on the entity (client shard only).
- Triggers `"locationdirty"` when `SetLocation()` updates the network variable.