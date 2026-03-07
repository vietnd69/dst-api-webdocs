---
id: lavaarenamobtracker
title: Lavaarenamobtracker
description: Tracks entities designated as mobs in the Lava Arena minigame, supporting querying by radius and tags.
tags: [minigame, arena, tracking, filtering]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: caee3975
system_scope: world
---

# Lavaarenamobtracker

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Lavaarenamobtracker` is a lightweight tracking component that maintains a registry of entities participating in the Lava Arena minigame (e.g., arena participants or enemies). It provides methods to monitor tracked entities via `StartTracking`/`StopTracking`, retrieve counts and collections, and query mobs by proximity and tag filters. This component is shared between server and client.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("lavaarenamobtracker")

-- Begin tracking a mob entity
inst.components.lavaarenamobtracker:StartTracking(mob_entity)

-- Retrieve currently tracked mobs within 10 units radius, tagged "player" and not "boss"
local nearby = inst.components.lavaarenamobtracker:FindMobs(x, y, z, 10, {"player"}, {"boss"}, nil)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Checks tags via `ent:HasTag(tag)`; does not manage tags itself.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `ents` | table | `{}` | Internal dictionary mapping tracked entities to `true`. Used for O(1) membership checks. |
| `count` | number | `0` | Track count of mobs. *Note: This field is declared but never updated in the component.* |

## Main functions
### `StartTracking(ent)`
* **Description:** Begins tracking the given entity and registers an event listener for its `onremove` event to automatically stop tracking on removal.
* **Parameters:** `ent` (entity instance) - the entity to track.
* **Returns:** Nothing.
* **Error states:** No effect if the entity is already tracked.

### `StopTracking(ent)`
* **Description:** Stops tracking the given entity and removes its `onremove` event listener.
* **Parameters:** `ent` (entity instance) - the entity to untrack.
* **Returns:** Nothing.
* **Error states:** No effect if the entity is not currently tracked.

### `GetNumMobs()`
* **Description:** Returns the current tracked mob count.
* **Parameters:** None.
* **Returns:** `number` - the number of tracked mobs. *Note: Since `count` is never incremented/decremented, this always returns `0`.*
* **Error states:** Returns `0` unconditionally.

### `GetAllMobs()`
* **Description:** Returns a shallow copy (new table) of all currently tracked entity references.
* **Parameters:** None.
* **Returns:** `table` - array of entity instances currently being tracked.
* **Error states:** Returns an empty table if no mobs are tracked.

### `FindMobs(x, y, z, r, musttags, canttags, mustoneoftags)`
* **Description:** Filters tracked mobs by 3D position (ignoring y-coordinate for distance), radius, and tag conditions, then returns the matches sorted by distance ascending.
* **Parameters:**
  * `x`, `z` (number) - world coordinates for center of search.
  * `y` (number) - unused in distance computation.
  * `r` (number) - radius (squared internally).
  * `musttags` (table or `nil`) - all listed tags must be present on the mob.
  * `canttags` (table or `nil`) - none of these tags may be present on the mob.
  * `mustoneoftags` (table or `nil`) - at least one of these tags must be present on the mob.
* **Returns:** `table` - array of entities meeting all tag/radius criteria, sorted by increasing distance from `(x, z)`.
* **Error states:** Returns an empty table if no matches found.

### `ForEachMob(cb, params)`
* **Description:** Iterates over all tracked mobs and invokes the provided callback function for each.
* **Parameters:**
  * `cb` (function) - callback with signature `cb(entity, params)`.
  * `params` (any) - opaque parameter passed to the callback.
* **Returns:** Nothing.
* **Error states:** No effect if no mobs are tracked.

## Events & listeners
- **Listens to:** `onremove` - fired by tracked entities; triggers automatic `StopTracking`.
- **Pushes:** None identified.
