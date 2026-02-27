---
id: highlightchild
title: Highlightchild
description: Manages highlighting associations between an entity and its owner, including network synchronization and visual highlight state updates.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 6115137f
---

# Highlightchild

## Overview
This component allows an entity to maintain a highlight association with another entity (its "owner"). When set, the owned entity is added to the owner's `highlightchildren` list and receives visual highlighting; when the association is removed, it is removed from that list and its highlight state is cleared. The component also supports network synchronization of the owner reference for non-dedicated clients.

## Dependencies & Tags
- **Component Usage**: None explicitly added to the host instance (`inst`).
- **Tags**: None identified.
- **Network Usage**: Uses `net_entity` for synchronization of `syncowner` on the master simulation (if `inst.Network` is available).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (assigned in constructor) | Reference to the entity that owns this component. |
| `owner` | `Entity?` | `nil` | Current owner entity; `nil` means no active owner. |
| `syncowner` | `net_entity?` | `nil` | Network sync object for the owner reference; only created if `inst.Network ~= nil`. |
| `onchangeownerfn` | `function?` | `nil` | Optional callback function invoked after `owner` changes. |

## Main Functions
### `OnRemoveEntity()`
* **Description:** Cleans up the component's association when the entity is removed: removes `self.inst` from the current owner's `highlightchildren` array (if any owner exists).
* **Parameters:** None.

### `SetOwner(owner)`
* **Description:** Sets the owner of this entity. If network sync is available, it updates the synced owner value and triggers `OnChangeOwner`. This ensures consistency between master and clients.
* **Parameters:**  
  * `owner` (`Entity?`): The new owner entity, or `nil` to clear the owner association.

### `SetOnChangeOwnerFn(fn)`
* **Description:** Registers a callback to be invoked whenever the `owner` changes (i.e., inside `OnChangeOwner`). Useful for custom logic (e.g., updating UI or gameplay state).
* **Parameters:**  
  * `fn` (`function?`): A function with signature `fn(inst, owner)`; can be `nil` to clear.

### `OnChangeOwner(owner)`
* **Description:** Core logic to update the highlight association. On non-dedicated servers:
  * Clears highlighting on the old owner (if any) by removing `self.inst` from the previous owner’s `highlightchildren` list and resetting the animation highlight color.
  * Adds `self.inst` to the new owner’s `highlightchildren` list (creating the list if needed).
  * Sets `self.owner` to the new value.
  * Invokes the `onchangeownerfn` callback if present.
* **Parameters:**  
  * `owner` (`Entity?`): The new owner entity, or `nil`.

## Events & Listeners
- Listens for `"syncownerdirty"` event on the client (via `inst:ListenForEvent`) to re-synchronize the owner when the synced network value updates. The listener (`OnSyncOwnerDirty`) calls `self:OnChangeOwner(self.syncowner:value())`.
- Pushes no custom events.