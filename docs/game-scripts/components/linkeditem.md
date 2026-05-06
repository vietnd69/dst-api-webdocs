---
id: linkeditem
title: Linkeditem
description: Manages ownership linkage between an item entity and a player user ID for account-bound items.
tags: [inventory, network, ownership]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: components
source_hash: 8f210864
system_scope: inventory
---

# Linkeditem

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`Linkeditem` establishes and maintains a persistent link between an item entity and a player's user ID. This component is used for account-bound or soulbound items that should only be usable by their owner. The component syncs owner information across the network via netvars and fires world events when the linkage changes. Server-side owner instance tracking is managed by the `linkeditemmanager` component, which calls `SetOwnerInst()` and `OnSkillTreeInitialized()`.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("linkeditem")

-- Server: Link item to a player's user ID
if TheWorld.ismastersim then
    inst.components.linkeditem:LinkToOwnerUserID("KU_abc123")
    inst.components.linkeditem:SetEquippableRestrictedToOwner(true)
end

-- Client or Server: Query owner information
local ownerName = inst.components.linkeditem:GetOwnerName()
local ownerUserID = inst.components.linkeditem:GetOwnerUserID()
local isRestricted = inst.components.linkeditem:IsEquippableRestrictedToOwner()
```

## Dependencies & tags
**External dependencies:**
- `TheWorld` — fires `ms_registerlinkeditem` and `ms_unregisterlinkeditem` world events
- `TheNet` — retrieves client table for user ID to resolve owner name
- `GetTime()` — caches client table lookup to limit frequency (10 second interval)

**Components used:**
- `linkeditemmanager` — referenced in comments as the component that calls `SetOwnerInst()` and `OnSkillTreeInitialized()`

**Tags:**
- None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | — | The entity instance that owns this component. |
| `ismastersim` | boolean | `TheWorld.ismastersim` | Caches server/client state; gates server-only logic. |
| `netowneruserid` | net_string | `""` | Synced owner user ID (e.g., `KU_abc123`). Dirty event propagates to clients. |
| `netownername` | net_string | `""` | Synced owner display name. Updated via `GetOwnerName()` client table lookup. |
| `restrictequippabletoowner` | net_bool | `false` | Whether the item can only be equipped by the owner. |
| `owner_inst` | entity | `nil` | Server-only reference to the owner's player instance. Set by `linkeditemmanager`. |
| `onownerinst_removedfn` | function | `nil` | Callback hook fired when owner instance is removed. Signature: `fn(item_inst, owner_inst)`. |
| `onownerinst_createdfn` | function | `nil` | Callback hook fired when owner instance is created/assigned. Signature: `fn(item_inst, owner_inst)`. |
| `onownerinst_skilltreeinitializedfn` | function | `nil` | Callback hook fired when owner's skill tree initializes. Signature: `fn(item_inst, owner_inst)`. |
| `lastclienttabletime` | number | `nil` | Timestamp of last `TheNet:GetClientTableForUser()` lookup; used for 10-second cache. |
| `OnRemoveCallback` | function | — | Server-only; calls `LinkToOwnerUserID(nil)` on entity remove. |

## Main functions
### `GetOwnerName()`
* **Description:** Returns the owner's display name. Caches client table lookup to once every 10 seconds to reduce network queries. On master, also updates `netownername` netvar for client sync.
* **Parameters:** None
* **Returns:** String owner name, or `nil` if no owner is linked.
* **Error states:** None.

### `GetOwnerUserID()`
* **Description:** Returns the owner's user ID string.
* **Parameters:** None
* **Returns:** String user ID (e.g., `KU_abc123`), or `nil` if no owner is linked.
* **Error states:** None.

### `IsEquippableRestrictedToOwner()`
* **Description:** Returns whether the item is restricted to owner-only equipping.
* **Parameters:** None
* **Returns:** Boolean `true` if restricted, `false` otherwise.
* **Error states:** None.

### `GetOwnerInst()` (master only)
* **Description:** Returns the owner's player entity instance. Server-only; returns `nil` on client.
* **Parameters:** None
* **Returns:** Player entity instance, or `nil` if no owner instance is tracked.
* **Error states:** None.

### `LinkToOwnerUserID(owner_userid)` (master only)
* **Description:** Links or unlinks the item to/from a user ID. Fires world events to register/unregister the linkage. Early returns if the user ID is unchanged.
* **Parameters:** `owner_userid` -- string user ID, or `nil`/`""` to unlink.
* **Returns:** None
* **Error states:** Should only be called on master; client calls will not propagate correctly.

### `SetEquippableRestrictedToOwner(val)` (master only)
* **Description:** Sets whether the item can only be equipped by its owner.
* **Parameters:** `val` -- boolean restriction flag.
* **Returns:** None
* **Error states:** Should only be called on master; client calls will not propagate correctly.

### `SetOnOwnerInstRemovedFn(fn)` (master only)
* **Description:** Registers a callback to fire when the owner instance is removed.
* **Parameters:** `fn` -- callback function. Signature: `fn(item_inst, owner_inst)`.
* **Returns:** None
* **Error states:** None.

### `SetOnOwnerInstCreatedFn(fn)` (master only)
* **Description:** Registers a callback to fire when the owner instance is assigned.
* **Parameters:** `fn` -- callback function. Signature: `fn(item_inst, owner_inst)`.
* **Returns:** None
* **Error states:** None.

### `SetOnSkillTreeInitializedFn(fn)` (master only)
* **Description:** Registers a callback to fire when the owner's skill tree initializes.
* **Parameters:** `fn` -- callback function. Signature: `fn(item_inst, owner_inst)`.
* **Returns:** None
* **Error states:** None.

### `SetOwnerInst(owner_inst)` (master only)
* **Description:** Sets the owner's player entity instance. Fires `onownerinst_removedfn` before clearing old owner, and `onownerinst_createdfn` after assigning new owner. Updates `netownername` from the owner's `name` field. **Note:** Should only be called by `linkeditemmanager` component.
* **Parameters:** `owner_inst` -- player entity instance, or `nil` to clear.
* **Returns:** None
* **Error states:** None.

### `OnSkillTreeInitialized()` (master only)
* **Description:** Triggers the `onownerinst_skilltreeinitializedfn` callback if registered. **Note:** Should only be called by `linkeditemmanager` component.
* **Parameters:** None
* **Returns:** None
* **Error states:** None.

### `OnSave()`
* **Description:** Returns a table containing `netowneruserid` and `netownername` for persistence. Omits empty values.
* **Parameters:** None
* **Returns:** Table with `netowneruserid` and `netownername` keys, or `nil` if both are empty.
* **Error states:** None.

### `OnLoad(data)`
* **Description:** Restores owner user ID and name from saved data. Re-registers the linkage world event if a user ID is present.
* **Parameters:** `data` -- table from `OnSave()`, or `nil`.
* **Returns:** None
* **Error states:** None.

### `GetDebugString()`
* **Description:** Returns a debug string showing owner name, user ID, and owner instance (master only).
* **Parameters:** None
* **Returns:** String debug information.
* **Error states:** None.

## Events & listeners
- **Listens to:** `onremove` (master only) — triggers `OnRemoveCallback` to unlink the item when the entity is removed.
- **Pushes:** `ms_unregisterlinkeditem` (master only) — fired when unlinking from an old owner. Data: `{item = entity, owner_userid = string}`.
- **Pushes:** `ms_registerlinkeditem` (master only) — fired when linking to a new owner or on load. Data: `{item = entity, owner_userid = string}`.