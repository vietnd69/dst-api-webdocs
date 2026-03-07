---
id: markable
title: Markable
description: Manages a pool of integer identifiers to track which entities have marked this instance, supporting mark/unmark operations with optional callbacks.
tags: [entity, tracking, pool]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 36f9b7e4
system_scope: entity
---

# Markable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Markable` tracks which other entities have "marked" this instance using a pool of integer IDs (`1`–`8`). It supports adding and removing marks via `Mark()` and `Unmarkall()`, and optionally exposes callbacks for mark/unmark logic. The presence of a mark is reflected by the `markable` tag on the owner entity when `canbemarked` is enabled.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("markable")

-- Optional: define callbacks
inst.components.markable.canmarkfn = function(target, doer)
    return doer:HasTag("player")
end
inst.components.markable.markfn = function(target, doer, id)
    print("Marked by", doer.prefab, "with ID", id)
end
inst.components.markable.unmarkfn = function(target, doer, id)
    print("Unmarked by", doer.prefab)
end

-- Perform marking
if inst.components.markable:Mark(some_doer) then
    -- Mark successful
end

-- Clear all marks
inst.components.markable:Unmarkall()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds/removes `markable` on `self.inst` depending on `canbemarked` state.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `marks` | table | `{}` | List of `{doer=entity, id=number}` records of active marks. |
| `markpool` | table | `{1,2,3,4,5,6,7,8}` | Pool of available integer IDs for new marks. |
| `markpool_reset` | table | `{1,2,3,4,5,6,7,8}` | Immutable copy of initial `markpool` (used to reset). |
| `canbemarked` | boolean | `true` (via default `canbemarked` setter) | Controls whether the `markable` tag is added/removed from `self.inst`. |

## Main functions
### `getid()`
* **Description:** Allocates and returns a unique integer ID from the available pool.
* **Parameters:** None.
* **Returns:** `number` — an available ID (`1`–`8`), or `nil` if the pool is empty.

### `returnid(id)`
* **Description:** Returns a previously allocated ID back to the pool.
* **Parameters:** `id` (number) — the ID to return.
* **Returns:** Nothing.

### `Mark(doer)`
* **Description:** Attempts to mark the entity with the given `doer`. If the `doer` is already marked, it unmarks it instead. Delegates decisions and actions to optional callbacks (`canmarkfn`, `markfn`, `unmarkfn`).
* **Parameters:** `doer` (entity) — the entity performing or cancelling the mark.
* **Returns:** `boolean` — `true` if mark/unmark succeeded, `false` otherwise. On failure, returns `false, failreason` (where `failreason` comes from `canmarkfn`).
* **Error states:** If the mark pool is exhausted, `Mark()` will fail and return `false, nil`.

### `Unmarkall()`
* **Description:** Removes all active marks, clears the marks list, and resets the mark pool to its initial state.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetMarkable(markable)`
* **Description:** Sets the `canbemarked` flag and updates the `markable` tag on `self.inst`.
* **Parameters:** `markable` (boolean) — whether the entity should be considered markable.
* **Returns:** Nothing.

### `HasMarked(doer)`
* **Description:** Checks whether the given `doer` has an active mark on this entity.
* **Parameters:** `doer` (entity) — the entity to check.
* **Returns:** `boolean` — `true` if `doer` is currently marked, `false` otherwise.

### `OnSave()`
* **Description:** Prepares serializable save data. Currently returns an empty table.
* **Parameters:** None.
* **Returns:** `table` — always `{}` in the current implementation.

### `OnLoad(data)`
* **Description:** Loads state from saved data. Currently a no-op.
* **Parameters:** `data` (table) — expected save data (unused).
* **Returns:** Nothing.

## Events & listeners
None identified
