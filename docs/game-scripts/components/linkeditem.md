---
id: linkeditem
title: Linkeditem
description: Manages networked ownership and equipping restrictions for items that can be linked to a specific player.
tags: [network, inventory, ownership]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: bfe34c4e
system_scope: network
---

# Linkeditem

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Linkeditem` connects an item entity to a specific player by storing and synchronizing their user ID and name across the network. It is designed to work with the `linkeditemmanager` component (referenced in the source comment) to enforce ownership-based equipping restrictions and manage entity lifecycle events tied to the owner. The component uses network variables (`net_string`, `net_bool`) to persist ownership data across clients and server.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("linkeditem")

-- Link the item to a specific player by user ID
inst.components.linkeditem:LinkToOwnerUserID("123456789")

-- Restrict equipping to the owner only
inst.components.linkeditem:SetEquippableRestrictedToOwner(true)

-- Query ownership information
local owner_name = inst.components.linkeditem:GetOwnerName()
local is_restricted = inst.components.linkeditem:IsEquippableRestrictedToOwner()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Reference to the entity that owns this component. |
| `ismastersim` | boolean | `false` | Indicates whether this entity is running on the master simulation (server). |
| `netowneruserid` | `net_string` | `""` | Networked storage for the owner's user ID. |
| `netownername` | `net_string` | `""` | Networked storage for the owner's display name. |
| `restrictequippabletoowner` | `net_bool` | `false` | Networked flag indicating if equipping is restricted to the owner. |
| `owner_inst` | `Entity?` | `nil` | Local reference to the owner entity (server-side only). |
| `lastclienttabletime` | number | `-999` | Timestamp used to throttle updates of the owner name from `TheNet:GetClientTableForUser`. |
| `onownerinst_removedfn` | `function?` | `nil` | Callback invoked when the owner entity is removed. |
| `onownerinst_createdfn` | `function?` | `nil` | Callback invoked when the owner entity is assigned. |
| `onownerinst_skilltreeinitializedfn` | `function?` | `nil` | Callback invoked after the owner's skill tree is initialized. |

## Main functions
### `GetOwnerName()`
*   **Description:** Returns the display name of the item's owner by first checking the cached `netownername`, and if empty or stale, updating it by querying `TheNet:GetClientTableForUser` (throttled to once every 10 seconds).
*   **Parameters:** None.
*   **Returns:** `string?` — the owner's name if available, otherwise `nil`.
*   **Error states:** Returns `nil` if `netowneruserid` is empty or if the client lookup fails.

### `GetOwnerUserID()`
*   **Description:** Returns the user ID of the item's owner stored in `netowneruserid`.
*   **Parameters:** None.
*   **Returns:** `string?` — the owner's user ID if set, otherwise `nil`.

### `IsEquippableRestrictedToOwner()`
*   **Description:** Returns the flag indicating whether equipping this item is restricted to its owner.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if equipping is restricted to the owner, otherwise `false`.

### `LinkToOwnerUserID(owner_userid)`
*   **Description:** Sets the item's owner by user ID and triggers registration/deregistration events on the server. Emits `ms_registerlinkeditem` or `ms_unregisterlinkeditem` events accordingly.
*   **Parameters:** `owner_userid` (`string?`) — the user ID of the new owner, or `nil` to unlink.
*   **Returns:** Nothing.
*   **Error states:** No-op if the new `owner_userid` matches the current one.

### `SetEquippableRestrictedToOwner(val)`
*   **Description:** Updates the equipping restriction flag for this item across the network.
*   **Parameters:** `val` (`boolean`) — `true` to restrict equipping to the owner only; `false` to allow general equipping.
*   **Returns:** Nothing.

### `SetOnOwnerInstRemovedFn(fn)`
*   **Description:** Registers a callback to be invoked when the owner entity is removed from the world.
*   **Parameters:** `fn` (`function(inst: Entity, owner: Entity?)`) — function to call on owner removal.
*   **Returns:** Nothing.

### `SetOnOwnerInstCreatedFn(fn)`
*   **Description:** Registers a callback to be invoked when the owner entity is assigned.
*   **Parameters:** `fn` (`function(inst: Entity, owner: Entity)`) — function to call on owner assignment.
*   **Returns:** Nothing.

### `SetOnSkillTreeInitializedFn(fn)`
*   **Description:** Registers a callback to be invoked after the owner's skill tree has been initialized.
*   **Parameters:** `fn` (`function(inst: Entity, owner: Entity)`) — function to call on skill tree initialization.
*   **Returns:** Nothing.

### `SetOwnerInst(owner_inst)`
*   **Description:** (Server-only) Sets the local `owner_inst` reference and updates `netownername` to match the owner's name. Triggers the registered callbacks (`onownerinst_removedfn`, `onownerinst_createdfn`) as appropriate.
*   **Parameters:** `owner_inst` (`Entity?`) — the new owner entity, or `nil` to clear.
*   **Returns:** Nothing.
*   **Notes:** This method is intended to be called only by the `linkeditemmanager` component.

### `OnSkillTreeInitialized()`
*   **Description:** (Server-only) Invokes the `onownerinst_skilltreeinitializedfn` callback if registered.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Notes:** This method is intended to be called only by the `linkeditemmanager` component.

### `OnSave()`
*   **Description:** Serializes ownership data for persistence. Returns a table containing only non-empty fields (`netowneruserid` and `netownername`).
*   **Parameters:** None.
*   **Returns:** `{netowneruserid: string, netownername: string}?` — a table if either field is non-empty, otherwise `nil`.

### `OnLoad(data)`
*   **Description:** Loads persisted ownership data and re-registers the item on the server if an owner is present.
*   **Parameters:** `data` (`{netowneruserid: string?, netownername: string?}?`) — saved ownership data from `OnSave`.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a human-readable debug string summarizing the item's ownership state.
*   **Parameters:** None.
*   **Returns:** `string` — formatted as `"Owner: <name> <<userid>>, inst: <owner_inst>"` on server; `"Owner: <name> <<userid>>"` on client.

## Events & listeners
- **Listens to:** `onremove` — triggers `LinkToOwnerUserID(nil)` to unlink the item when the entity is removed.
- **Pushes:** `ms_registerlinkeditem` — fired when ownership is newly assigned (server-side only). Payload: `{item: Entity, owner_userid: string}`.  
- **Pushes:** `ms_unregisterlinkeditem` — fired when ownership is cleared (server-side only). Payload: `{item: Entity, owner_userid: string}`.
