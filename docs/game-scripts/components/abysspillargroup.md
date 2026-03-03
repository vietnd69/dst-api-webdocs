---
id: abysspillargroup
title: Abysspillargroup
description: Manages a group of abyss pillars, tracking their lifecycle, spawn points, and synchronization during save/load operations.
tags: [boss, environment, map, persistence]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 1bdaa252
system_scope: environment
---

# Abysspillargroup

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`AbyssPillarGroup` is a component that coordinates a dynamic set of abyss pillars within the game world. It handles tracking active pillars, recording spawn points, and managing deferred respawning. It supports event-driven callback hooks for adding/removing or collapsing pillars, and implements save/load logic to persist spawn point state and pillar references across sessions. This component is typically attached to environment entities (e.g., boss arena anchors) and used during high-stakes encounters like the Dragonfly or Shadow contests.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("abysspillargroup")

inst.components.abysspillargroup:SetSpawnAtXZFn(function(parent, x, z, instant)
    return SpawnPrefab("abysspillar")(x, 0, z)
end)

inst.components.abysspillargroup:AddPillarSpawnPointXZ(10, 0)
inst.components.abysspillargroup:RespawnAllPillars()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Checks `onremove` event on tracked pillar entities; does not add or remove tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `spawnfn` | function | `nil` | Callback that creates and returns a new pillar entity at `(x, z)`; called by `SpawnPillarAtXZ`. |
| `collapsefn` | function | `nil` | Callback invoked when `CollapseAllPillars` is called, passing `(parent, pillar)`. |
| `onaddpillarfn` | function | `nil` | Optional callback fired after a pillar is added, `(parent, pillar)`. |
| `onremovepillarfn` | function | `nil` | Optional callback fired after a pillar is removed, `(parent, pillar)`. |
| `pillars` | table | `{}` | Dictionary mapping pillar instances to `true`, representing active pillars. |
| `spawnpts` | table | `{}` | Flat array of x,z coordinate pairs representing recorded spawn points. |

## Main functions
### `SetSpawnAtXZFn(fn)`
*   **Description:** Assigns the function used to instantiate new pillars when `SpawnPillarAtXZ` is called.
*   **Parameters:** `fn` (function) — a callback with signature `(parent: Entity, x: number, z: number, instant: boolean?): Entity?`.
*   **Returns:** Nothing.

### `SetCollapseFn(fn)`
*   **Description:** Sets the callback executed for each pillar during `CollapseAllPillars`.
*   **Parameters:** `fn` (function) — signature `(parent: Entity, pillar: Entity)`.
*   **Returns:** Nothing.

### `StartTrackingPillar(pillar)`
*   **Description:** Begins tracking a pillar instance, registers a death listener, and invokes `onaddpillarfn` if set.
*   **Parameters:** `pillar` (Entity) — the pillar entity to track.
*   **Returns:** Nothing.
*   **Error states:** Asserts if `pillar._abysspillargroup` is already assigned to another group.

### `StopTrackingPillar(pillar)`
*   **Description:** Stops tracking a pillar, removes the death listener, clears its internal reference, and invokes `onremovepillarfn` if set.
*   **Parameters:** `pillar` (Entity) — the pillar entity to stop tracking.
*   **Returns:** Nothing.
*   **Error states:** Asserts if `pillar._abysspillargroup` is not `self`.

### `SpawnPillarAtXZ(x, z, instant)`
*   **Description:** Invokes the configured `spawnfn` at the given world coordinates and begins tracking the resulting pillar.
*   **Parameters:**  
    * `x` (number) — X coordinate for spawn.  
    * `z` (number) — Z coordinate for spawn.  
    * `instant` (boolean?, optional) — passed to `spawnfn` to indicate immediate vs deferred creation.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `spawnfn` is `nil`.

### `AddPillarSpawnPointXZ(x, z)`
*   **Description:** Appends a spawn point `(x, z)` to the internal list; used to record where pillars should be respawned later.
*   **Parameters:**  
    * `x` (number) — X coordinate.  
    * `z` (number) — Z coordinate.
*   **Returns:** Nothing.

### `RespawnAllPillars()`
*   **Description:** Iterates over all recorded spawn points and spawns pillars at each, in FIFO order.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `CollapseAllPillars()`
*   **Description:** Invokes the configured `collapsefn` for each tracked pillar, without removing it from tracking.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Clear()`
*   **Description:** Removes all tracked pillars (including calling `Remove` on them) and clears spawn points.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `HasPillars()`
*   **Description:** Reports whether any pillars are currently tracked.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if `pillars` is non-empty, otherwise `false`.

### `HasSpawnPoints()`
*   **Description:** Reports whether any spawn points have been recorded.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if `spawnpts` is non-empty, otherwise `false`.

### `OnSave()`
*   **Description:** Serializes the group state for world saving. Returns a table containing saved spawn points and a list of pillar GUIDs.
*   **Parameters:** None.
*   **Returns:**  
    * `data` (table|nil) — contains `{ pts = shallowcopy(spawnpts) }` and optionally `{ ents = { guid1, guid2, ... } }`.  
    * `refs` (table|nil) — identical to `data.ents` if present, otherwise `nil`. (This appears to be a duplicate return for convenience in DST’s save system.)

### `OnLoad(data)`
*   **Description:** Restores the recorded spawn points during world load.
*   **Parameters:** `data` (table) — containing `{ pts = {...} }`.
*   **Returns:** Nothing.

### `LoadPostPass(ents, data)`
*   **Description:** Re-establishes pillar tracking after world entities are resolved during load. Retrieves each pillar by GUID and calls `StartTrackingPillar`.
*   **Parameters:**  
    * `ents` (table) — GUID → entity map provided by DST’s loader.  
    * `data` (table) — the deserialized save data, expected to contain `data.ents`.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onremove` — registered per-tracked pillar to detect when a pillar is destroyed, which triggers removal from `pillars`, respawning of its spawn point, and optional callbacks.  
- **Pushes:** No events directly; relies on external callbacks and DST’s entity lifecycle.
