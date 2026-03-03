---
id: objectspawner
title: Objectspawner
description: Manages a collection of spawned prefabs as owned objects, tracking them for persistence and event handling.
tags: [persistence, world, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: b739104a
system_scope: world
---

# Objectspawner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`ObjectSpawner` is a lightweight component that maintains a list of prefabs it has spawned or been explicitly given ownership of. It is designed for entities (often world or room-related) that need to track child objects—for example, to preserve references across saves or trigger actions when new objects are added. It does not manage object lifecycle beyond ownership tracking; object spawning is delegated to the global `SpawnPrefab` function.

This component integrates with the game’s save/load system through `OnSave()` and `LoadPostPass()` methods, storing only GUIDs to re-establish references after loading.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("objectspawner")

-- Spawn a new object and take ownership
inst.components.objectspawner:SpawnObject("fireflies")

-- Or manually take ownership of an existing object
local new_obj = SpawnPrefab("torch")
inst.components.objectspawner:TakeOwnership(new_obj)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *(assigned automatically)* | The entity instance that owns this component. |
| `objects` | `table` | `{}` | List of owned object entities. |
| `onnewobjectfn` | `function?` | `nil` | Optional callback invoked when a new object is taken ownership of. |

## Main functions
### `OnSave()`
* **Description:** Prepares the component’s state for persistence. Collects GUIDs of all owned objects and returns them as data.  
* **Parameters:** None.  
* **Returns:**  
  * If `objects` is non-empty: `{ objects = table_of_GUIDs }, references` — where `references` is identical to `objects`.  
  * If `objects` is empty: `nil`.  

### `LoadPostPass(newents, data)`
* **Description:** Restores references to spawned objects after loading is complete. Uses `newents` (a map of GUID → entity) to lookup and take ownership of each stored object.  
* **Parameters:**  
  * `newents` (table) — Map of GUID strings to entity instances.  
  * `data` (table) — Saved data containing `data.objects` (list of GUIDs).  
* **Returns:** Nothing.  
* **Error states:** Silently skips entries where `newents[v]` is `nil` (e.g., if a referenced object failed to load).

### `TakeOwnership(obj)`
* **Description:** Registers an existing object as owned by this spawner, invokes the optional `onnewobjectfn` callback, and adds the object to the `objects` list.  
* **Parameters:**  
  * `obj` (`Entity`) — The object to take ownership of.  
* **Returns:** Nothing.  
* **Error states:** Does nothing if `obj` is `nil`. Does not prevent duplicate entries.

### `SpawnObject(obj, linked_skinname, skin_id)`
* **Description:** Spawns a new prefab using `SpawnPrefab()` and automatically takes ownership of the result.  
* **Parameters:**  
  * `obj` (string) — Prefab name to spawn.  
  * `linked_skinname` (string?, optional) — Skin name to apply (e.g., `"linked"`).  
  * `skin_id` (number?, optional) — Numeric skin ID.  
* **Returns:** `Entity` — The newly spawned object (same as returned by `SpawnPrefab`).  

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified
