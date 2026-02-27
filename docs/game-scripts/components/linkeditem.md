---
id: linkeditem
title: Linkeditem
description: Manages the association between an item and its owner user ID, enabling ownership tracking and server-side registration/deregistration across networked entities.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: network
source_hash: bfe34c4e
---

# Linkeditem

## Overview
This component maintains a persistent link between an item entity and a specific player's user ID, enabling secure ownership tracking, network synchronization, and integration with the `linkeditemmanager` system. It handles registration/deregistration events on the master simulation, stores owner metadata (name and user ID) via netvars, and supports runtime callbacks for owner instance lifecycle events.

## Dependencies & Tags
- Uses `TheWorld`, `TheNet`, and `GetTime` from the global scope.
- Relies on `net_string` and `net_bool` for networked state variables.
- Adds no tags; does not require any specific external components to be present on the entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Reference to the entity the component is attached to. |
| `ismastersim` | `boolean` | `TheWorld.ismastersim` | Indicates whether the current instance is the master simulation (server). |
| `netowneruserid` | `net_string` | `""` | Networked string storing the owner's user ID; synced across clients. |
| `netownername` | `net_string` | `""` | Networked string storing the owner's display name; synced and locally updated. |
| `restrictequippabletoowner` | `net_bool` | `false` | Networked boolean controlling whether equipping is restricted to the owner. |
| `OnRemoveCallback` | `function` | `nil` (set only on master) | Cleanup callback triggered on item removal; unlinks owner. |
| `owner_inst` | `Entity?` | `nil` | Reference to the owner's player instance (server-only, local to this component). |
| `onownerinst_removedfn` | `function?` | `nil` | Optional callback invoked when the owner instance is removed. |
| `onownerinst_createdfn` | `function?` | `nil` | Optional callback invoked when the owner instance is assigned. |
| `onownerinst_skilltreeinitializedfn` | `function?` | `nil` | Optional callback invoked after the owner's skill tree is initialized. |

## Main Functions

### `GetOwnerName()`
* **Description:** Returns the owner's display name. Attempting to refresh it from `TheNet:GetClientTableForUser` every 10 seconds if the user ID is set; falls back to cached `netownername` otherwise.
* **Parameters:** None.

### `GetOwnerUserID()`
* **Description:** Returns the owner's user ID as a string, or `nil` if not set.
* **Parameters:** None.

### `IsEquippableRestrictedToOwner()`
* **Description:** Returns whether equipping this item is restricted to its owner.
* **Parameters:** None.

### `GetOwnerInst()`
* **Description:** Returns the current owner entity instance (server-only). Returns `nil` if not set.
* **Parameters:** None.

### `LinkToOwnerUserID(owner_userid)`
* **Description:** Updates the linked owner user ID. On the master simulation, triggers server-side registration/deregistration events (`ms_registerlinkeditem` / `ms_unregisterlinkeditem`). Avoids redundant updates.
* **Parameters:**
  - `owner_userid` (`string?`): The new owner's user ID, or `nil` to unlink.

### `SetEquippableRestrictedToOwner(val)`
* **Description:** Sets whether equipping is restricted to the owner, updating the networked `restrictequippabletoowner` variable.
* **Parameters:**
  - `val` (`boolean`): New restriction flag.

### `SetOwnerInst(owner_inst)`
* **Description:** Assigns the owner instance (e.g., a `playercontroller` or `wilson` player). Updates `netownername`, and triggers creation/removal callbacks. *Intended for use only by the `linkeditemmanager` component.*
* **Parameters:**
  - `owner_inst` (`Entity?`): The owner entity instance, or `nil` to unlink.

### `SetOnOwnerInstRemovedFn(fn)`
* **Description:** Sets the callback function invoked when the owner instance is removed.
* **Parameters:**
  - `fn` (`function?`): A function of signature `(item, new_owner)`.

### `SetOnOwnerInstCreatedFn(fn)`
* **Description:** Sets the callback function invoked when the owner instance is assigned.
* **Parameters:**
  - `fn` (`function?`): A function of signature `(item, owner)`.

### `SetOnSkillTreeInitializedFn(fn)`
* **Description:** Sets the callback function invoked after the owner's skill tree is initialized.
* **Parameters:**
  - `fn` (`function?`): A function of signature `(item, owner)`.

### `OnSkillTreeInitialized()`
* **Description:** Invokes the registered skill tree initialization callback, if any. *Intended for use only by the `linkeditemmanager` component.*
* **Parameters:** None.

### `OnSave()`
* **Description:** Returns save data containing the current `netowneruserid` and `netownername`, if set. Returns `nil` if both are empty.
* **Parameters:** None.

### `OnLoad(data)`
* **Description:** Restores the linked owner user ID and name from save data. Automatically re-registers the item on the server if a valid `netowneruserid` is present.
* **Parameters:**
  - `data` (`table?`): Save data containing `netowneruserid` and optionally `netownername`.

### `GetDebugString()`
* **Description:** Returns a formatted debug string describing the current link state, including owner name, user ID, and (on server) owner instance reference.
* **Parameters:** None.

## Events & Listeners
- **Listens for:**
  - `"onremove"` (master only): Triggers `OnRemoveCallback`, which calls `LinkToOwnerUserID(nil)` to unlink the owner.

- **Triggers:**
  - `"ms_unregisterlinkeditem"` (master only): Fired when unlinking from a previous owner (on `LinkToOwnerUserID`).
  - `"ms_registerlinkeditem"` (master only): Fired when linking to a new owner (on `LinkToOwnerUserID`, `SetOwnerInst`, and `OnLoad`).