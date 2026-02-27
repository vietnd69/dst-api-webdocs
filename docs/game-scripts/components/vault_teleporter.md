---
id: vault_teleporter
title: Vault Teleporter
description: Manages teleportation target configuration (marker, room, direction) and provides counter and state utilities for vault-related teleporter entities.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 98467f4d
---

# Vault Teleporter

## Overview
This component stores and manages configuration data for a vault teleporter entity, including target marker name, room ID, direction names, and a counter used for tracking usage or synchronization state. It also exposes helper methods to update, query, and notify listeners of changes—particularly the room ID.

## Dependencies & Tags
No explicit component dependencies are added or required. No tags are added or removed by this component.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `counter` | `number` | `0` | Integer counter, incremented/decremented via `AddCounter`/`RemoveCounter`. |
| `markername` | `string?` | `nil` | Name of the target marker (e.g., `"vaultmarker"`) used for teleport destination lookup. |
| `roomid` | `string?` | `nil` | ID of the target vault room. Triggers the `"newvaultteleporterroomid"` event on update. |
| `directionname` | `string?` | `nil` | Shuffled or current direction label (e.g., for UI or logic). |
| `unshuffleddirectionname` | `string?` | `nil` | Original (unshuffled) direction label. |
| `rigid` | `boolean?` | `nil` | Optional flag indicating whether the teleporter uses rigid positioning. |

## Main Functions

### `Reset()`
* **Description:** Clears the stored `markername` and `roomid` by setting them to `nil`.
* **Parameters:** None.

### `SetRigid(rigid)`
* **Description:** Sets the `rigid` flag (typically used to control teleport behavior).
* **Parameters:**  
  `rigid` (`boolean?`) — Optional boolean indicating rigid mode.

### `GetRigid()`
* **Description:** Returns the current `rigid` flag value.
* **Parameters:** None.

### `SetTargetMarkerName(markername)`
* **Description:** Sets the target marker name for the teleport destination.
* **Parameters:**  
  `markername` (`string?`) — String identifier for the target marker.

### `GetTargetMarkerName()`
* **Description:** Returns the currently set target marker name.
* **Parameters:** None.

### `SetTargetRoomID(roomid)`
* **Description:** Sets the target vault room ID and emits the `"newvaultteleporterroomid"` event with the new value.
* **Parameters:**  
  `roomid` (`string?`) — String identifier for the target vault room.

### `GetTargetRoomID()`
* **Description:** Returns the currently set target room ID.
* **Parameters:** None.

### `SetDirectionName(directionname)`
* **Description:** Sets the shuffled direction name.
* **Parameters:**  
  `directionname` (`string?`) — Direction label string.

### `GetDirectionName()`
* **Description:** Returns the shuffled direction name.
* **Parameters:** None.

### `SetUnshuffledDirectionName(unshuffleddirectionname)`
* **Description:** Sets the unshuffled (original) direction name.
* **Parameters:**  
  `unshuffleddirectionname` (`string?`) — Original direction label string.

### `GetUnshuffledDirectionName()`
* **Description:** Returns the unshuffled direction name.
* **Parameters:** None.

### `AddCounter()`
* **Description:** Increments the internal `counter` by 1.
* **Parameters:** None.

### `RemoveCounter()`
* **Description:** Decrements the internal `counter` by 1.
* **Parameters:** None.

### `GetCounter()`
* **Description:** Returns the current value of the internal `counter`.
* **Parameters:** None.

### `TeleportEntitiesToInst(ents, targetinst)`
* **Description:** Placeholder method intended to teleport a list of entities to a target instance. As provided, the loop body is empty—no actual teleportation logic is implemented in this component.
* **Parameters:**  
  `ents` (`table`) — Array of entities to teleport.  
  `targetinst` (`Entity`) — Destination instance.

## Events & Listeners

- **Emitted Events:**
  - `"newvaultteleporterroomid"` — Pushed when `SetTargetRoomID` is called, carrying the new `roomid` as payload.

- **Listening Events:**
  - None.