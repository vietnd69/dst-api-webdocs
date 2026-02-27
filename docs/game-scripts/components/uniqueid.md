---
id: uniqueid
title: Uniqueid
description: Assigns and manages a unique persistent identifier for an entity within the world, using the prefab-specific ID registry on initialization and saving/loading the ID across sessions.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 68ff97bd
---

# Uniqueid

## Overview
This component ensures every entity has a globally unique, persistent identifier scoped to its prefab. It assigns a new ID from `TheWorld.components.uniqueprefabids` during initialization (if not already present), stores it in the entity's save data, and cancels the delayed assignment task upon loading if an ID was already assigned.

## Dependencies & Tags
- **Component dependency:** `TheWorld.components.uniqueprefabids` (must be present on the world entity to provide `GetNextID(prefab)`).
- **No components added or removed.**
- **No tags added or removed.**

## Properties
The following public properties are initialized in the constructor:

| Property | Type      | Default Value | Description |
|----------|-----------|---------------|-------------|
| `id`     | `number?` | `nil`         | The unique identifier assigned to the entity (nil until assigned). Persisted across saves. |
| `task`   | `function`| `DoTaskInTime` result | A delayed task (scheduled at time 0) that calls `TryGetNewId` to assign the ID on initialization. |

## Main Functions

### `OnSave()`
* **Description:** Returns the component's serializable state for persistence.  
* **Parameters:** None.  
* **Returns:** A table `{ id = self.id }`, where `id` is either a number or `nil`.

### `OnLoad(data)`
* **Description:** Restores the component’s state from saved data. If an ID is present, it cancels the pending ID-assignment task to avoid overwriting the loaded ID.  
* **Parameters:**  
  - `data` (`table`): The saved data, expected to contain an `id` field (may be `nil`).

### `GetDebugString()`
* **Description:** Returns a human-readable debug representation of the component’s current ID.  
* **Parameters:** None.  
* **Returns:** `string`: The string representation of `self.id` (e.g., `"nil"` or `"5"`).  

## Events & Listeners
- Listens to no events.
- Triggers no events.
- Uses `self.inst:DoTaskInTime(0, TryGetNewId)` to schedule the ID assignment task (not an event).