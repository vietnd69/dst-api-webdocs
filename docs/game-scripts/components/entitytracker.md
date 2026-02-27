---
id: entitytracker
title: Entitytracker
description: Tracks named entity references and automatically removes them when tracked entities are removed from the world.
sidebar_position: 1

last_updated: 2026-02-25
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: 37c21cec
---

# Entitytracker

## Overview
The `EntityTracker` component maintains a dictionary of named entity references, automatically listening for the `"onremove"` event on each tracked entity to clean up the reference when the entity is removed from the world. It supports saving/loading of tracked entities using GUID-based persistence and provides utility methods for managing and inspecting tracked entities.

## Dependencies & Tags
* Relies on the instance having an `inst` reference (standard for all components).
* Internally uses `inst:ListenForEvent`, `inst:RemoveEventCallback`, `inst:PushEvent` — but does not declare or emit any custom events itself.
* No tags are added or removed by this component.
* Depends on `GUID` property existing on tracked entities (standard for most networked entities in DST).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (injected) | The entity instance that owns this component. |
| `entities` | `table` | `{}` | Dictionary mapping string names to tracked entity entries. Each entry has fields `inst` (the entity) and `onremove` (the cleanup callback). |

## Main Functions
### `TrackEntity(name, inst)`
* **Description:** Registers an entity under a given name, and sets up a one-time listener to automatically remove the entry when the tracked entity is removed from the world.
* **Parameters:**
  * `name` (`string`): A unique key used to identify the tracked entity in the internal dictionary.
  * `inst` (`Entity`): The entity instance to track.

### `ForgetEntity(name)`
* **Description:** Removes a tracked entity by name, cleaning up the event callback and deleting the entry.
* **Parameters:**
  * `name` (`string`): The name under which the entity was previously tracked.

### `GetEntity(name)`
* **Description:** Returns the tracked entity instance associated with the given name, or `nil` if not found.
* **Parameters:**
  * `name` (`string`): The name of the tracked entity.
* **Returns:** `Entity?` — the tracked entity, or `nil`.

### `GetDebugString()`
* **Description:** Returns a formatted multi-line debug string listing all currently tracked entities and their instances.
* **Returns:** `string` — human-readable debug representation.

### `OnSave()`
* **Description:** Prepares tracking data for save serialization. Collects GUIDs of all tracked entities and returns a compact snapshot plus a list of GUID references.
* **Returns:** `table` — Two-part save data:  
  * Main table: `{ entities = { { name = ..., GUID = ... }, ... } }`  
  * Second return value: `table` of GUIDs for cross-referencing.

### `LoadPostPass(ents, data)`
* **Description:** Restores tracked entities after save loading. Uses the `ents` dictionary (mapping GUIDs to resolved entities) to re-register each previously tracked entity.
* **Parameters:**
  * `ents` (`table`): A dictionary mapping GUIDs to entity resolution records (i.e., `{ GUID = { entity = ... } }`).
  * `data` (`table?`): The data returned by `OnSave()`. Must contain `data.entities` to be processed.

## Events & Listeners
* Listens to `"onremove"` event on each tracked entity to remove its entry from `self.entities`.
* Does not emit any events.