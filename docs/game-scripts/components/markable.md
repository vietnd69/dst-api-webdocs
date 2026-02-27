---
id: markable
title: Markable
description: Manages a pool of unique mark identifiers and tracks which entities have marked this entity, enabling toggleable mark/unmark behavior with customizable callbacks.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 36f9b7e4
---

# Markable

## Overview
The `Markable` component provides a reusable system for assigning, tracking, and releasing unique mark IDs on an entity. It maintains a pool of available mark identifiers (1–8), supports adding/removing individual marks via callbacks, and ensures only one mark per marking entity. It also manages a "markable" state that controls whether the target entity carries the `"markable"` tag.

## Dependencies & Tags
- Adds/removes the `"markable"` tag on the entity based on the `canbemarked` state.
- No other components are directly required or used.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the owner entity. |
| `marks` | `table` | `{}` | List of active marks, each entry is `{doer = Entity, id = number}`. |
| `markpool_reset` | `table` | `{1,2,3,4,5,6,7,8}` | Static copy of the original ID pool (used for reset). |
| `markpool` | `table` | `deepcopy(markpool_reset)` | Current available IDs (randomly selected, then removed). |
| `canbemarked` | `boolean` | `true` (default) | Controls whether the `"markable"` tag is present on the entity. |

Note: The constructor initializes `inst`, `marks`, `markpool_reset`, and `markpool`. `canbemarked` is initialized implicitly by the metatable’s `__newindex` behavior when set via `SetMarkable`, but defaults to `true` in practice.

## Main Functions
### `Mark(doer)`
* **Description:** Attempts to mark the entity with a unique ID. If the `doer` has already marked this entity, it unmarks instead. Otherwise, assigns a new ID from the pool (if available) and invokes mark callbacks. Returns success status and optional failure reason.
* **Parameters:**
  * `doer` (`Entity`): The entity attempting to mark/unmark this target.

### `Unmarkall()`
* **Description:** Removes all active marks, clears the marks list, and resets the mark pool to its initial state. Invokes the optional `unmarkallfn` callback if set.
* **Parameters:** None.

### `getid()`
* **Description:** Returns a random, unused mark ID from the available pool. Returns `nil` if no IDs remain.
* **Parameters:** None.

### `returnid(id)`
* **Description:** Adds a previously used mark ID back to the pool, making it available for reuse.
* **Parameters:**
  * `id` (`number`): The ID to return to the pool.

### `SetMarkable(markable)`
* **Description:** Sets the `canbemarked` flag and immediately updates the `"markable"` tag on the entity. If `true`, adds the tag; otherwise, removes it.
* **Parameters:**
  * `markable` (`boolean`): Whether this entity should be considered markable.

### `HasMarked(doer)`
* **Description:** Checks whether the specified `doer` currently has an active mark on this entity.
* **Parameters:**
  * `doer` (`Entity`): The entity to check for an existing mark.

## Events & Listeners
- **Listeners (via `inst:ListenForEvent`):** None.
- **Events (via `inst:PushEvent`):** None — events are triggered only by side effects of optional callbacks (`markfn`, `unmarkfn`, `unmarkallfn`), not explicitly pushed by the component.