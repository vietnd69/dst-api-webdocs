---
id: key
title: Key
description: Manages the key's type tag and provides callback hooks for when it's used or removed.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 51f35ce5
---

# Key

## Overview
This component represents an in-game key object. Its primary responsibilities are maintaining a `keytype` tag on the entity (added/removed based on `keytype` changes), and exposing callbacks for when the key is used (e.g., to unlock a lock) or removed (e.g., destroyed or consumed). It integrates with the Entity Component System by adding/removing dynamic tags (e.g., `"door_key"`) to match its key type.

## Dependencies & Tags
- **Component Dependencies**: None explicitly added.
- **Tags Added/Removed**: Dynamically manages tags of the form `<keytype>_key`, where `keytype` is a value from `LOCKTYPE`. For example, if `keytype = LOCKTYPE.DOOR`, the entity is tagged with `"door_key"`.

## Properties
| Property     | Type       | Default Value         | Description |
|--------------|------------|------------------------|-------------|
| `keytype`    | `LOCKTYPE` | `LOCKTYPE.DOOR`        | The type of lock this key can open; determines the associated tag. |
| `onused`     | `function?`| `nil`                  | Optional callback function invoked when the key is used. Signature: `fn(key_entity, lock_entity, doer_entity)`. |
| `onremoved`  | `function?`| `nil`                  | Optional callback function invoked when the key is removed (e.g., destroyed). Signature: `fn(key_entity, lock_entity, doer_entity)`. |

## Main Functions
### `Key:OnRemoveFromEntity()`
* **Description:** Cleans up the entity's tag when the component is removed from its entity (e.g., during component removal or entity deletion).
* **Parameters:** None.

### `Key:SetOnUsedFn(fn)`
* **Description:** Sets the callback function to be invoked when the key is used.
* **Parameters:**
  * `fn` (`function?`): A function that will be called with arguments `(key_entity, lock_entity, doer_entity)`.

### `Key:SetOnRemovedFn(fn)`
* **Description:** Sets the callback function to be invoked when the key is removed.
* **Parameters:**
  * `fn` (`function?`): A function that will be called with arguments `(key_entity, lock_entity, doer_entity)`.

### `Key:OnUsed(lock, doer)`
* **Description:** Triggers the `onused` callback, if set. Typically called by external logic (e.g., a lock or inventory system) when this key successfully unlocks something.
* **Parameters:**
  * `lock` (`Entity`): The lock entity being unlocked.
  * `doer` (`Entity`): The entity performing the unlock action (e.g., a player).

### `Key:OnRemoved(lock, doer)`
* **Description:** Triggers the `onremoved` callback, if set. Typically called when the key is destroyed or removed from the world/inventory.
* **Parameters:**
  * `lock` (`Entity`): The lock entity involved (may be `nil` if removed outside a lock interaction).
  * `doer` (`Entity`): The entity causing the removal (may be `nil`).

## Events & Listeners
None.