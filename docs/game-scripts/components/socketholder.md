---
id: socketholder
title: Socketholder
description: Manages socket slots on an entity, allowing items to be attached and stored as save data.
tags: [inventory, items, equipment]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: components
source_hash: f8c392da
system_scope: inventory
---

# Socketholder

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`Socketholder` manages a set of socket slots on an entity, typically used for equipment or gems. It handles storing socketed items as save data (removing the entity from the world) and restoring them when unsocketed. It supports quality tracking and socket naming for filtering. This component is master-authoritative; clients mirror state via netvars initialized in `SetMaxSockets`.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("socketholder")
inst.components.socketholder:SetMaxSockets(3)
inst.components.socketholder:SetSocketPositionName(1, "gem_socket")

-- Attempt to socket an item
local permitted, reason, position = inst.components.socketholder:CanTryToSocket(item, doer)
if permitted then
    inst.components.socketholder:TryToSocket(item, doer)
end
```

## Dependencies & tags
**Components used:**
- `inventoryitem` -- used to drop physics when socket name changes
- `socketable` -- checked for compatibility and quality during socketing
- `stackable` -- checked to extract single item from stack during socketing

**Tags:**
- None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `maxsockets` | number | `nil` | Maximum number of sockets. Must be set via `SetMaxSockets` before use. |
| `ismastersim` | boolean | `TheWorld.ismastersim` | Caches server authority status. |
| `shouldallowsocketablefn_CLIENT` | function \| nil | `nil` | Client-side validation hook. Signature: `fn(inst, item, doer)`. |
| `shouldallowsocketablefn_SERVER` | function \| nil | `nil` | Server-side validation hook. Signature: `fn(inst, item, doer)`. |
| `ongetsocketablefn` | function \| nil | `nil` | Called when an item is successfully socketed. Signature: `fn(inst, item, doer)`. |
| `onremovesocketablefn` | function \| nil | `nil` | Called when an item is unsocketed. Signature: `fn(inst, item)`. |
| `socketdata` | table | `{}` | (Master only) Stores save data for socketed items by position. |
| `socketmetadata` | table | `{}` | (Master only) Unsavable metadata extracted from socketables. |
| `socketed`/`socketquality`/`socketnames` (dynamic arrays) | table of netvars | `{}` | Created by `SetMaxSockets`; `socketed[i]`=net_bool, `socketquality[i]`=net_enum, `socketnames[i]`=net_hash for i=1 to maxsockets. Accessed via `:value()` and `:set()`. |

## Main functions
### `SetMaxSockets(maxsockets)`
*   **Description:** Initializes the socket arrays and netvars. Must be called exactly once before any socket operations.
*   **Parameters:**
    - `maxsockets` -- number of sockets to allocate.
*   **Returns:** nil
*   **Error states:** Asserts if `self.maxsockets` is already set (cannot be called twice).

### `SetSocketPositionName(socketposition, socketname)`
*   **Description:** Assigns a name hash to a specific socket position. If the name changes on an occupied socket, the item is unsocketed and dropped.
*   **Parameters:**
    - `socketposition` -- integer index of the socket.
    - `socketname` -- string name or nil to clear.
*   **Returns:** nil
*   **Error states:** None

### `GetAllSocketPositions(socketname)`
*   **Description:** Returns a list of all socket positions, optionally filtered by `socketname`.
*   **Parameters:**
    - `socketname` -- string name to filter by, or nil for all.
*   **Returns:** Table of integer positions, or nil if none found.

### `GetAllEmptySocketPositions(socketname)`
*   **Description:** Returns positions of sockets that are currently empty, optionally filtered by `socketname`.
*   **Parameters:**
    - `socketname` -- string name to filter by, or nil for all.
*   **Returns:** Table of integer positions, or nil if none found.

### `GetAllFullSocketPositions(socketname)`
*   **Description:** Returns positions of sockets that are currently occupied, optionally filtered by `socketname`.
*   **Parameters:**
    - `socketname` -- string name to filter by, or nil for all.
*   **Returns:** Table of integer positions, or nil if none found.

### `GetFirstEmptySocketPosition(socketname)`
*   **Description:** Returns the first available empty socket position.
*   **Parameters:**
    - `socketname` -- string name to filter by, or nil for all.
*   **Returns:** Integer position or nil.

### `GetFirstFullSocketPosition(socketname)`
*   **Description:** Returns the first occupied socket position.
*   **Parameters:**
    - `socketname` -- string name to filter by, or nil for all.
*   **Returns:** Integer position or nil.

### `GetHighestQualitySocketedPositions(socketname)`
*   **Description:** Returns positions of occupied sockets that match the highest quality found among all socketed items.
*   **Parameters:**
    - `socketname` -- string name to filter by, or nil for all.
*   **Returns:** Table of integer positions, or nil.

### `GetQualityForPosition(position)`
*   **Description:** Returns the socket quality value for a specific position.
*   **Parameters:**
    - `position` -- integer socket index.
*   **Returns:** Integer quality value, or `SOCKETQUALITY.NONE` if invalid.

### `GetHighestQualitySocketed(socketname)`
*   **Description:** Returns the highest quality value found among socketed items.
*   **Parameters:**
    - `socketname` -- string name to filter by, or nil for all.
*   **Returns:** Integer quality value, or `SOCKETQUALITY.NONE`.

### `IsSocketNameForPosition(socketname, position)`
*   **Description:** Checks if a socket position matches a specific name.
*   **Parameters:**
    - `socketname` -- string name to check.
    - `position` -- integer socket index.
*   **Returns:** boolean

### `CanTryToSocket(item, doer)`
*   **Description:** Validates if an item can be socketed. Checks for `socketable` component, available slot, and client validation hook.
*   **Parameters:**
    - `item` -- entity instance to socket.
    - `doer` -- entity attempting the action (can be nil).
*   **Returns:** `permitted` (boolean), `reason` (string|nil), `socketposition` (integer|nil).

### `SetShouldAllowSocketableFn_CLIENT(fn)`
*   **Description:** Sets the client-side validation callback.
*   **Parameters:**
    - `fn` -- function(inst, item, doer).
*   **Returns:** nil

### `TryToUnsocket(socketposition)`
*   **Description:** Triggers an unsocket event. Used to notify network replication.
*   **Parameters:**
    - `socketposition` -- integer index to unsocket.
*   **Returns:** nil

### `SetShouldAllowSocketableFn_SERVER(fn)`
*   **Description:** Sets the server-side validation callback.
*   **Parameters:**
    - `fn` -- function(inst, item, doer).
*   **Returns:** nil

### `SetOnGetSocketableFn(fn)`
*   **Description:** Sets the callback fired when an item is successfully socketed.
*   **Parameters:**
    - `fn` -- function(inst, item, doer).
*   **Returns:** nil

### `SetOnRemoveSocketableFn(fn)`
*   **Description:** Sets the callback fired when an item is unsocketed.
*   **Parameters:**
    - `fn` -- function(inst, item).
*   **Returns:** nil

### `DoSocket(item_or_savedata, doer, socketposition)`
*   **Description:** Internally sockets an item or save data. Removes the item entity and stores its save record.
*   **Parameters:**
    - `item_or_savedata` -- entity instance or save data table.
    - `doer` -- entity attempting the action (can be nil).
    - `socketposition` -- integer index to socket into.
*   **Returns:** boolean (true on success).
*   **Error states:** None

### `TryToSocket(item, doer)`
*   **Description:** Validates and sockets an item. Calls `CanTryToSocket` then `DoSocket`.
*   **Parameters:**
    - `item` -- entity instance to socket.
    - `doer` -- entity attempting the action (can be nil).
*   **Returns:** boolean (true on success), or false + reason.

### `UnsocketPosition(socketposition)`
*   **Description:** Removes the item from a socket, spawns it into the world, and clears slot data.
*   **Parameters:**
    - `socketposition` -- integer index to unsocket.
*   **Returns:** Entity instance or nil.

### `UnsocketEverything()`
*   **Description:** Unsockets all occupied positions and returns the list of items.
*   **Parameters:** None.
*   **Returns:** Table of entity instances.

### `OnSave()`
*   **Description:** Returns the socket data table for persistence.
*   **Parameters:** None.
*   **Returns:** Table (self.socketdata).

### `DoLoadingOfSockets(data)`
*   **Description:** Restores socketed items from save data.
*   **Parameters:**
    - `data` -- table of socket data.
*   **Returns:** nil

### `OnLoad(data, newents)`
*   **Description:** Load hook for player entities (loads immediately).
*   **Parameters:**
    - `data` -- save data table.
    - `newents` -- entity remap table.
*   **Returns:** nil

### `LoadPostPass(newents, data)`
*   **Description:** Load hook for non-player entities (loads after entity state is pristine).
*   **Parameters:**
    - `newents` -- entity remap table.
    - `data` -- save data table.
*   **Returns:** nil

### `GetDebugString()`
*   **Description:** Returns a formatted string summarizing socket states for debugging.
*   **Parameters:** None.
*   **Returns:** String.

### `OnDeath(inst)` (local)
*   **Description:** Event callback fired on entity death. Unsockets all items and launches them physically.
*   **Parameters:**
    - `inst` -- entity instance.
*   **Returns:** nil

## Events & listeners
- **Listens to:** `death` -- (Master only) triggers `OnDeath` to drop socketed items.
- **Pushes:**
    - `socketholder_unsocket` -- fired by `TryToUnsocket`; data is `socketposition`.
    - `onsocketeditem` -- fired by `DoSocket`; data is `{item = item, doer = doer}`.
    - `onunsocketeditem` -- fired by `UnsocketPosition`; data is `{item = item}`.