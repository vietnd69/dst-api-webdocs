---
id: entitytracker
title: Entitytracker
description: Manages a set of named entity references and tracks their lifecycle to prevent dangling references.
tags: [entity, lifecycle, tracking]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 37c21cec
system_scope: entity
---

# Entitytracker

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`EntityTracker` provides a safe mechanism for an entity to hold named references to other entities without creating memory leaks or stale references. It listens for the `onremove` event on tracked entities and automatically removes them from its internal registry when they are removed from the world. It also implements standard save/load (`OnSave`/`LoadPostPass`) for serialization across network and persistence contexts.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("entitytracker")

-- Track another entity under a custom name
inst.components.entitytracker:TrackEntity("ally", ally_entity)

-- Retrieve a tracked entity
local ally = inst.components.entitytracker:GetEntity("ally")

-- Stop tracking a specific entity
inst.components.entitytracker:ForgetEntity("ally")
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `entities` | table | `{}` | Dictionary mapping string names to tracked entity objects (`{inst, onremove}`). |

## Main functions
### `TrackEntity(name, inst)`
* **Description:** Begins tracking a new entity under the given name. Automatically registers an `onremove` listener so the entity is untracked when it is removed.
* **Parameters:**  
  * `name` (string) — The key used to identify this entity in subsequent lookups.  
  * `inst` (Entity) — The entity instance to track.
* **Returns:** Nothing.
* **Error states:** If `name` is already in use, the previous entry is silently overwritten.

### `ForgetEntity(name)`
* **Description:** Stops tracking the entity associated with the given name and cleans up its event listener.
* **Parameters:**  
  * `name` (string) — The name used when tracking the entity.
* **Returns:** Nothing.
* **Error states:** No-op if `name` is not currently tracked.

### `GetEntity(name)`
* **Description:** Retrieves the tracked entity instance by name, if still present.
* **Parameters:**  
  * `name` (string) — The name used when tracking the entity.
* **Returns:** `Entity` if tracked, otherwise `nil`.

### `OnSave()`
* **Description:** Serializes the set of tracked entities into a compact data structure using GUIDs for persistence across game sessions or network sync.
* **Parameters:** None.
* **Returns:**  
  * A table `{ entities = { {name, GUID}, ... } }` and  
  * A list of GUIDs used for reference resolution during `LoadPostPass`.  
  * `nil` if no entities are tracked.

### `LoadPostPass(ents, data)`
* **Description:** Reconstructs tracked entity references after game data is loaded, using the saved GUID-to-entity map (`ents`).
* **Parameters:**  
  * `ents` (table) — A map of GUID to resolved entity data (typically from the world state).  
  * `data` (table) — The `entities` array returned by `OnSave`.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onremove` — registered per tracked entity to remove it from internal tracking when removed.  
- **Pushes:** None identified.

## Constructor
### `Class(function(self, inst) ... end)`
* **Description:** Initializes the tracker with the owning entity instance and an empty `entities` table.
* **Parameters:** `inst` (Entity) — The entity that owns this component.
* **Returns:** Nothing (constructor only).
