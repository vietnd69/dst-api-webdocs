---
id: lock
title: Lock
description: Manages lock state, key interaction, and tag updates for entities like doors and chests.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 6fc821df
---

# Lock

## Overview
The `Lock` component manages whether an entity (e.g., a door or chest) is locked or unlocked, handles key-based unlocking, tracks lock state persistence, and dynamically adds/removes tags (`locktype_lock`, `unlockable`) based on current conditions. It integrates with key and inventory components to enable interaction logic.

## Dependencies & Tags
**Depends on components:**
- `key` (for key usage/removal tracking)
- `stackable` (optional, for stackable keys)
- `inventory` (on doer entity during lock/unlock operations)
- `inventoryitem` (on key entity for removal from owner)

**Tags added/removed:**
- `<locktype>_lock` (e.g., `door_lock`, `chest_lock`) — added/removed based on `locktype` and `isstuck`
- `unlockable` — added when `key ~= nil`, `islocked == true`, and `isstuck == false`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (passed in) | The entity the component is attached to |
| `onlocked` | `function?` | `nil` | Optional callback invoked when the lock is manually re-locked |
| `onunlocked` | `function?` | `nil` | Optional callback invoked when the lock is successfully unlocked |
| `unlocktest` | `function?` | `nil` | Optional custom unlock test function; if set, overrides default `Unlock` behavior |
| `islocked` | `boolean` | `true` | Whether the entity is currently locked |
| `isstuck` | `boolean` | `false` | Whether the lock is stuck (cannot be changed via key) |
| `key` | `Entity?` | `nil` | The key entity associated with this lock |
| `locktype` | `LOCKTYPE enum` | `LOCKTYPE.DOOR` | The type of lock (e.g., `DOOR`, `CHEST`), used to generate tags and check compatibility |

## Main Functions
### `Lock:Unlock(key, doer)`
* **Description:** Unlocks the entity using the provided key, provided the lock is not stuck and is currently locked. Decrements/removes the key and triggers the `onunlocked` callback if set.
* **Parameters:**
  - `key` (`Entity?`): The key entity to use for unlocking. If provided, it is consumed or returned to the doer.
  - `doer` (`Entity`): The entity performing the unlock action (e.g., the player).

### `Lock:Lock(doer)`
* **Description:** Manually re-locks the entity (e.g., after being opened without a key or via override). Returns the key to the doer’s inventory if one exists.
* **Parameters:**
  - `doer` (`Entity`): The entity performing the lock action.

### `Lock:TestForUnlock(key)`
* **Description:** Attempts to unlock using the provided key. If a custom `unlocktest` function is set, it is invoked instead of the default unlock logic.
* **Parameters:**
  - `key` (`Entity`): The key entity to test against the lock.

### `Lock:SetLocked(locked)`
* **Description:** Directly sets the `islocked` state without checking key compatibility. Triggers `onlocked` or `onunlocked` callbacks if defined.
* **Parameters:**
  - `locked` (`boolean`): Target lock state.

### `Lock:CompatableKey(keytype)`
* **Description:** Checks if a given key type is compatible with this lock (ignoring case where `isstuck == true`).
* **Parameters:**
  - `keytype` (`LOCKTYPE`): The type of the key being tested.

### `Lock:SetKey(key)`
* **Description:** Assigns a key entity to the lock, managing entity hierarchy (adding/removing as child). Handles scene transitions for key persistence.
* **Parameters:**
  - `key` (`Entity?`): The key entity to associate, or `nil` to clear.

### `Lock:GetDebugString()`
* **Description:** Returns a formatted string for debugging, including lock type, locked state, stuck state, and key GUID.
* **Returns:** `string`

### `Lock:IsStuck()`, `Lock:IsLocked()`
* **Description:** Simple getters for `isstuck` and `islocked` states.
* **Returns:** `boolean`

### `Lock:SetOnUnlockedFn(fn)`, `Lock:SetOnLockedFn(fn)`
* **Description:** Sets optional callback functions for unlock and lock events.
* **Parameters:**
  - `fn` (`function`): Function to be called on unlock/lock.

### `Lock:OnSave()`, `Lock:OnLoad(data)`, `Lock:LoadPostPass(newents, data)`
* **Description:** Serialization/deserialization helpers for save/load. Stores `locked`, `isstuck`, and key GUID. `LoadPostPass` resolves the key entity reference post-load.
* **Parameters:**
  - `data` (`table?`): Persisted state table (keys: `locked`, `isstuck`, `key`).
  - `newents` (`table`): Map of GUID → entity for post-load resolution.

## Events & Listeners
The component does not register any `inst:ListenForEvent` listeners and does not push events (`inst:PushEvent`). Tag changes (`AddTag`/`RemoveTag`) are immediate side effects of state updates, not events.

## Notes
- Tag updates (`_lock`, `unlockable`) are automatically managed via property setters registered in the class metatable (e.g., setting `locktype`, `islocked`, `key`, `isstuck` triggers associated handlers).
- `isstuck` overrides tag management: when true, the `_lock` tag is removed; otherwise, it is applied based on `locktype`.
- If a key is consumed during unlock, it is removed from the doer’s inventory *after* calling `key.components.key:OnUsed`.