---
id: lavaarenamobtracker
title: Lavaarenamobtracker
description: Tracks and manages entities (mobs) within the lava arena for client- and server-side use, supporting filtering, iteration, and count retrieval.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: caee3975
---

# Lavaarenamobtracker

## Overview
The `Lavaarenamobtracker` component tracks a set of entities ("mobs") relevant to the Lava Arena, enabling dynamic querying by radius and tag filters, iteration over tracked entities, and accurate count management. It maintains a local registry of entities and listens for their removal to ensure the registry stays current, functioning safely on both client and server.

## Dependencies & Tags
- Listens to the `"onremove"` event on each tracked entity.
- Does **not** add or remove any tags on the entity that owns this component.
- Does **not** depend on any other components via `AddComponent`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (set at construction) | The owner entity that hosts this component. |
| `ents` | `table` | `{}` | A dictionary mapping each tracked entity to `true`. Used to maintain uniqueness and allow O(1) lookup. |
| `count` | `number` | `0` | Intended for the number of tracked entities, but is **never updated** in the current implementation (always `0`). Likely unused or outdated. |
| `_onremovemob` | `function` | `nil` (set at construction) | Internal callback function used to stop tracking an entity when it is removed from the world. |

## Main Functions

### `StartTracking(ent)`
* **Description:** Begins tracking the given entity (`ent`) by storing it internally and registering an `"onremove"` listener to automatically stop tracking it when it is removed.
* **Parameters:**
  - `ent` (`Entity`): The entity to begin tracking. Must be valid and not already tracked.

### `StopTracking(ent)`
* **Description:** Stops tracking the given entity, removing it from the internal registry and unregistering the `"onremove"` listener.
* **Parameters:**
  - `ent` (`Entity`): The entity to stop tracking. Must be currently tracked.

### `GetNumMobs()`
* **Description:** Returns the current value of the internal `count` field. **Note:** This value is never modified in the component and always returns `0`.
* **Parameters:** None.

### `GetAllMobs()`
* **Description:** Returns a list (array) of all currently tracked entities.
* **Parameters:** None.
* **Returns:** `table` — A list of entity references.

### `FindMobs(x, y, z, r, musttags, canttags, mustoneoftags)`
* **Description:** Returns a list of tracked mobs within a horizontal radius `r` of the given coordinates, optionally filtered by required/forbidden/one-of tag conditions. Results are sorted by distance (ascending).
* **Parameters:**
  - `x`, `y`, `z` (`number`): World coordinates of the center point (only `x` and `z` are used for horizontal distance).
  - `r` (`number`): Maximum horizontal radius (inclusive); used as squared distance internally.
  - `musttags` (`table?`): Optional list of tags; entity must have *all* of these tags to be included.
  - `canttags` (`table?`): Optional list of tags; entity must have *none* of these tags to be included.
  - `mustoneoftags` (`table?`): Optional list of tags; entity must have *at least one* of these tags to be included.

### `ForEachMob(cb, params)`
* **Description:** Iterates over all tracked entities, invoking the provided callback function for each.
* **Parameters:**
  - `cb` (`function`): Callback to invoke per mob; signature: `cb(entity, params)`.
  - `params` (`any?`): Arbitrary data passed as the second argument to the callback.

## Events & Listeners
- Listens to `"onremove"` event on each tracked entity (`ent`), bound to `self._onremovemob`, which in turn calls `StopTracking(ent)`.
- Does **not** push or emit any events itself.