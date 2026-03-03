---
id: vault_teleporter
title: Vault Teleporter
description: Stores and manages teleport destination data (marker name, room ID, direction) for vault-related entities in the game.
tags: [vault, teleporter, navigation]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 98467f4d
system_scope: map
---
# Vault Teleporter

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`VaultTeleporter` is a lightweight component attached to vault-related entities to store and manage teleportation metadata — specifically the target marker name, room ID, directional orientation, and an internal counter. It is designed to persist configuration data across network sync and facilitate coordination between vault entities and the map system. The component does not perform actual teleportation logic; it serves as a data container and event trigger.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("vault_teleporter")
inst.components.vault_teleporter:SetTargetRoomID("vault_room_1")
inst.components.vault_teleporter:SetTargetMarkerName("teleport_exit_1")
inst.components.vault_teleporter:SetDirectionName("north")
inst.components.vault_teleporter:AddCounter()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `counter` | number | `0` | Internal counter, incremented/decremented via `AddCounter`/`RemoveCounter`. |
| `markername` | string or `nil` | `nil` | Target teleport marker name (e.g., `"teleport_exit_1"`). |
| `roomid` | string or `nil` | `nil` | Target vault room ID. |
| `directionname` | string or `nil` | `nil` | Orientation direction name (e.g., `"north"`). |
| `unshuffleddirectionname` | string or `nil` | `nil` | Unshuffled orientation direction name, preserved during shuffle operations. |
| `rigid` | any or `nil` | `nil` | Optional rigid reference (type not specified). |

## Main functions
### `Reset()`
* **Description:** Clears the target marker name and room ID by setting them to `nil`. Does not affect direction, unshuffled direction, rigid, or counter values.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetTargetRoomID(roomid)`
* **Description:** Sets the target vault room ID and fires the `"newvaultteleporterroomid"` event on the owning entity with the new room ID as payload.
* **Parameters:** `roomid` (string) - The ID of the target room.
* **Returns:** Nothing.

### `TeleportEntitiesToInst(ents, targetinst)`
* **Description:** Placeholder or incomplete implementation. Accepts a list of entities and a target entity instance but currently contains no logic (empty `for` loop body). Not functional as written.
* **Parameters:**  
  `ents` (table of entities) - List of entities to teleport.  
  `targetinst` (entity instance) - Target entity to teleport to.  
* **Returns:** Nothing.

### `SetRigid(rigid)`, `GetRigid()`
* **Description:** Store and retrieve an optional rigid reference.
* **Parameters:** `rigid` (any) - Rigid reference to set.
* **Returns:** The currently stored rigid value (in `GetRigid`).

### `SetTargetMarkerName(markername)`, `GetTargetMarkerName()`
* **Description:** Store and retrieve the target marker name (used to locate a specific teleport marker in the map).
* **Parameters:** `markername` (string) - Target marker identifier.
* **Returns:** The stored marker name (in `GetTargetMarkerName`).

### `GetTargetRoomID()`
* **Description:** Returns the currently stored target room ID.
* **Parameters:** None.
* **Returns:** string or `nil` — The room ID set via `SetTargetRoomID`, or `nil` if unset.

### `SetDirectionName(directionname)`, `GetDirectionName()`
* **Description:** Store and retrieve the (possibly shuffled) direction name used for orientation.
* **Parameters:** `directionname` (string) — Direction such as `"north"`, `"south"`, etc.
* **Returns:** The stored direction name (in `GetDirectionName`).

### `SetUnshuffledDirectionName(unshuffleddirectionname)`, `GetUnshuffledDirectionName()`
* **Description:** Store and retrieve the unshuffled (original) direction name, preserved even when direction shuffling is applied.
* **Parameters:** `unshuffleddirectionname` (string) — Original direction name before shuffling.
* **Returns:** The stored unshuffled direction name (in `GetUnshuffledDirectionName`).

### `AddCounter()`, `RemoveCounter()`, `GetCounter()`
* **Description:** Increment, decrement, or read the internal counter value. Used to track entity references or usage counts.
* **Parameters:** None (for `AddCounter`, `RemoveCounter`, `GetCounter`).
* **Returns:** number — Current counter value (in `GetCounter`).

## Events & listeners
- **Pushes:** `newvaultteleporterroomid` — Fired by `SetTargetRoomID` with the new room ID as the payload (`roomid`).
