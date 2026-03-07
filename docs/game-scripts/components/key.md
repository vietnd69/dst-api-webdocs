---
id: key
title: Key
description: Manages the type of key associated with an entity and provides callbacks for lock interactions.
tags: [lock, key, interaction]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 51f35ce5
system_scope: world
---

# Key

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Key` is a component that stores and manages the type of key an entity represents (e.g., `LOCKTYPE.DOOR`, `LOCKTYPE.CHEST`) and provides hooks for custom behavior when the key is used or removed. It automatically manages tags (`<keytype>_key`) to enable querying for key types via entity tags. This component is typically attached to key prefabs and used in conjunction with `lock` components.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("key")
inst.components.key:SetOnUsedFn(function(inst, lock, doer)
    print("Key used on lock by", doer and doer.name or "unknown")
end)
inst.components.key.keytype = LOCKTYPE.CHEST
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `<keytype>_key` tag when `keytype` is set; removes it when changed or on removal.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `keytype` | `LOCKTYPE` enum | `LOCKTYPE.DOOR` | The type of lock this key opens. Changes trigger tag updates (`old_keytype.."_key"` removed, `keytype.."_key"` added). |
| `onused` | function or `nil` | `nil` | Optional callback invoked when `OnUsed` is called. Signature: `fn(inst, lock, doer)`. |
| `onremoved` | function or `nil` | `nil` | Optional callback invoked when `OnRemoved` is called. Signature: `fn(inst, lock, doer)`. |

## Main functions
### `OnRemoveFromEntity()`
* **Description:** Cleans up tags when the component is removed from its entity.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Removes the tag `<keytype.."_key">` if `keytype` is not `nil`.

### `SetOnUsedFn(fn)`
* **Description:** Sets a callback function to execute when the key is used on a lock.
* **Parameters:** `fn` (function or `nil`) — the function to call on use; signature is `fn(inst, lock, doer)`.
* **Returns:** Nothing.

### `SetOnRemovedFn(fn)`
* **Description:** Sets a callback function to execute when the key is removed.
* **Parameters:** `fn` (function or `nil`) — the function to call on removal; signature is `fn(inst, lock, doer)`.
* **Returns:** Nothing.

### `OnUsed(lock, doer)`
* **Description:** Invokes the `onused` callback if set. Typically called by a lock component when the key successfully opens it.
* **Parameters:**  
  - `lock` (entity/component reference) — the lock being operated on.  
  - `doer` (entity reference) — the entity that triggered the key usage.  
* **Returns:** Nothing.
* **Error states:** Does nothing if `onused` is `nil`.

### `OnRemoved(lock, doer)`
* **Description:** Invokes the `onremoved` callback if set. Typically called when the key is deleted or removed from a lock interaction.
* **Parameters:**  
  - `lock` (entity/component reference) — the lock involved.  
  - `doer` (entity reference) — the entity triggering removal.  
* **Returns:** Nothing.
* **Error states:** Does nothing if `onremoved` is `nil`.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified
