---
id: objectspawner
title: Objectspawner
description: Manages a collection of spawnable and persistent entities, tracks their lifecycle, and supports saving/loading of owned objects.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: b739104a
---

# Objectspawner

## Overview
The `ObjectSpawner` component enables an entity to own, track, and persistently manage spawned child objects. It handles object lifecycle registration, custom callbacks on new object creation, and integration with the game's save/load system by storing and restoring references to owned objects using GUIDs.

## Dependencies & Tags
* **Uses:** `SpawnPrefab` (global function) to instantiate prefabs.
* **No explicit component dependencies** — it only requires the parent entity (`inst`) to be present.
* **No tags are added or removed** on the parent entity or spawned objects.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (passed in) | Reference to the entity that owns this component. |
| `objects` | `table (array)` | `{}` | List of owned child entities managed by this spawner. |
| `onnewobjectfn` | `function?` | `nil` | Optional callback invoked whenever a new object is taken into ownership. Signature: `callback(inst, new_object)`. |

## Main Functions
### `OnSave()`
* **Description:** Serializes the component’s state for saving. Collects GUIDs of all owned objects and returns them in a table for persistence.
* **Parameters:** None.  
* **Returns:** A table with an `objects` field containing GUIDs (if any), and a list of references (identical to the GUIDs); or `nil` if no objects are owned.

### `LoadPostPass(newents, data)`
* **Description:** Restores ownership of previously saved objects after world loading completes. Maps saved GUIDs to new entity instances using the `newents` lookup and reassigns ownership.
* **Parameters:**
  * `newents`: `table` — A mapping of saved GUIDs to new entity instances post-load.
  * `data`: `table?` — Saved data payload (must contain an `objects` array of GUIDs to restore).

### `TakeOwnership(obj)`
* **Description:** Registers a new entity (`obj`) as an owned child, adds it to the internal `objects` list, and triggers the optional `onnewobjectfn` callback if defined.
* **Parameters:**
  * `obj`: `Entity` — The entity to register as owned.

### `SpawnObject(obj, linked_skinname, skin_id)`
* **Description:** Spawns a new prefab using `SpawnPrefab`, then registers it under ownership via `TakeOwnership`.
* **Parameters:**
  * `obj`: `string` — The prefab name to spawn.
  * `linked_skinname`: `string?` — Optional skin prefab name.
  * `skin_id`: `number?` — Optional numeric skin ID.
* **Returns:** `Entity` — The newly spawned and owned object.

## Events & Listeners
* **None identified.**  
  This component does not register for or emit any events using `inst:ListenForEvent` or `inst:PushEvent`.