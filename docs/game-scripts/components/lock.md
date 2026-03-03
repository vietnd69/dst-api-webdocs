---
id: lock
title: Lock
description: Manages lock/unlock state and key-based access control for entities such as doors and containers.
tags: [inventory, access, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 6fc821df
system_scope: entity
---

# Lock

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Lock` is a state-management component that controls whether an entity (e.g., a door or container) is locked, unlocked, or stuck, and handles interaction with a physical key item. It integrates with the `inventory`, `inventoryitem`, `key`, and `stackable` components to manage key consumption, removal, and state transitions. It also maintains optional callbacks (`onlocked`, `onunlocked`) and custom unlock tests via `unlocktest`. Tags such as `locktype_lock` and `unlockable` are dynamically applied/removed to reflect state.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("lock")

-- Configure the lock to use a door-type key
inst.components.lock:SetOnUnlockedFn(function(inst, key, doer)
    print("Door unlocked!")
end)

-- Optionally set a custom unlock test
inst.components.lock.unlocktest = function(key, lock_inst)
    if key.prefab == "brass_key" then
        lock_inst:Unlock(key)
    end
end

-- Attach a key and lock the entity
local key = SpawnPrefab("brass_key")
inst.components.lock:SetKey(key)
inst.components.lock:SetLocked(true)
```

## Dependencies & tags
**Components used:** `inventory`, `inventoryitem`, `key`, `stackable`
**Tags:** Adds/Removes:
- `<locktype>_"lock"` (e.g., `"door_lock"`), conditionally based on `locktype` and `isstuck`
- `"unlockable"`, added only when `key ~= nil`, `islocked == true`, and `not isstuck`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (set in constructor) | Entity instance owning this component. |
| `onlocked` | function | `nil` | Callback fired when the lock is set to locked. Signature: `fn(inst, doer?)`. |
| `onunlocked` | function | `nil` | Callback fired when the lock is set to unlocked. Signature: `fn(inst, key, doer)`. |
| `unlocktest` | function | `nil` | Optional custom function to override default unlock logic. Signature: `fn(key, inst)`. If provided, `Unlock()` is not called automatically; the function must handle unlocking explicitly. |
| `islocked` | boolean | `true` | Whether the entity is currently locked. |
| `isstuck` | boolean | `false` | Whether the lock is stuck and cannot be toggled. |
| `key` | `Entity?` | `nil` | The key entity currently associated with this lock. |
| `locktype` | string | `LOCKTYPE.DOOR` | Type of key required (e.g., `"door"`, `"chest"`). |

## Main functions
### `OnRemoveFromEntity()`
*   **Description:** Clean-up function called when the component is removed from its entity. Removes associated tags.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a human-readable debug representation of the lock’s current state.
*   **Parameters:** None.
*   **Returns:** `string` — formatted as `"type:<locktype>, locked:<bool>, isstuck:<bool>, key:<guid or nil>"`.

### `SetOnUnlockedFn(fn)`
*   **Description:** Sets the callback to invoke when the lock is successfully unlocked.
*   **Parameters:** `fn` (function) — callback with signature `fn(inst, key, doer)`.
*   **Returns:** Nothing.

### `SetOnLockedFn(fn)`
*   **Description:** Sets the callback to invoke when the lock is locked.
*   **Parameters:** `fn` (function) — callback with signature `fn(inst, doer?)`.
*   **Returns:** Nothing.

### `CompatableKey(keytype)`
*   **Description:** Determines if a given key type is compatible with this lock. Returns `false` if stuck or type mismatch.
*   **Parameters:** `keytype` (string) — the type of the key being tested.
*   **Returns:** `boolean` — `true` only if `not IsStuck()` and `keytype == locktype`.

### `IsStuck()`
*   **Description:** Returns whether the lock is stuck.
*   **Parameters:** None.
*   **Returns:** `boolean`.

### `IsLocked()`
*   **Description:** Returns whether the lock is currently locked.
*   **Parameters:** None.
*   **Returns:** `boolean`.

### `Unlock(key, doer)`
*   **Description:** Unlocks the entity, consuming or decrementing the key stack. Fires `onunlocked` and removes the key from inventory if applicable.
*   **Parameters:**  
    `key` (Entity or `nil`) — the key entity used.  
    `doer` (Entity) — the entity performing the unlock (e.g., a player).
*   **Returns:** Nothing.
*   **Error states:** No-op if `isstuck == true` or `islocked == false`.

### `Lock(doer)`
*   **Description:** Locks the entity. Returns the key to the `doer`’s inventory if one exists.
*   **Parameters:** `doer` (Entity) — the entity performing the lock.
*   **Returns:** Nothing.
*   **Error states:** No-op if `isstuck == true` or `islocked == true`.

### `SetKey(key)`
*   **Description:** Assigns a key entity to this lock. Handles scene hierarchy (add/remove as child).
*   **Parameters:** `key` (Entity or `nil`) — the key entity to attach/detach.
*   **Returns:** Nothing.

### `TestForUnlock(key)`
*   **Description:** Attempts to unlock using the given key. Uses either a custom `unlocktest` or defaults to `Unlock()`.
*   **Parameters:** `key` (Entity) — the key to test/apply.
*   **Returns:** Nothing.
*   **Error states:** Returns early with `false` if `IsStuck() == true`.

### `SetLocked(locked)`
*   **Description:** Directly sets the `islocked` state without requiring a key, skipping key interactions and callbacks unless provided.
*   **Parameters:** `locked` (boolean) — target lock state.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Serializes lock state for world save.
*   **Parameters:** None.
*   **Returns:**  
    `table, table?` — first table: `{ locked, isstuck, key = GUID? }`; second table: `{ GUID }` of the key if present.

### `OnLoad(data)`
*   **Description:** Restores lock state from save data.
*   **Parameters:** `data` (table or `nil`) — contains `locked` and `isstuck` fields.
*   **Returns:** Nothing.

### `LoadPostPass(newents, data)`
*   **Description:** Resolves key entity reference after load.
*   **Parameters:**  
    `newents` (table) — mapping of GUIDs to entity entries.  
    `data` (table) — contains `key` GUID.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls).
- **Pushes:** None (no `inst:PushEvent` calls).
