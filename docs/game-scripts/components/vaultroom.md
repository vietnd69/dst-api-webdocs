---
id: vaultroom
title: Vaultroom
description: Manages loading, saving, unloading, and layout of procedural vault rooms in the world map.
tags: [world, map, room, save]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: d49ea297
system_scope: world
---

# Vaultroom

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Vaultroom` is a map-level component responsible for managing the lifecycle of procedural vault rooms—specifically handling room layout, entity unloading/saving during departure, and reloading when revisiting. It is attached to the room's anchor entity and coordinates with the global `defs` table (`prefabs/vaultroom_defs.lua`) to apply room-specific geometry, terrain, and entity populations. The component integrates with the game’s save system by serializing and restoring entities within a defined radius and respects ownership and tag-based logic to determine whether entities should be skipped, saved, or retained.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("vaultroom")
inst.components.vaultroom:LayoutNewRoom("my_room_id")
-- ... game world proceeds ...
local saved_data, remaining_entities = inst.components.vaultroom:UnloadRoom(true)
-- Later, when returning:
inst.components.vaultroom:LoadRoom("my_room_id", saved_data)
```

## Dependencies & tags
**Components used:** `spawner`, `inventory`, `container` (accessed locally via entity component checks), `spell`, `formationleader`, `follower`, `inventoryitem`, `Transform`, `entity`, `persist`, `prefab` (via `v.` fields).
**Tags:** Uses `INLIMBO`, `_inventory`, `_container`, `staysthroughvirtualrooms`, `irreplaceable` for filtering and logic.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `GEntity` | `nil` | The entity instance the component is attached to (set in constructor). |
| `roomid` | `string` or `nil` | `nil` | The identifier of the currently active vault room definition. `nil` when no room is loaded. |

## Main functions
### `GetCurrentRoomId()`
* **Description:** Returns the ID of the currently loaded vault room.
* **Parameters:** None.
* **Returns:** `string?` — The current `roomid`, or `nil` if no room is loaded.

### `LayoutNewRoom(id)`
* **Description:** Initializes and populates a new vault room using the provided room ID from `vaultroom_defs.lua`. Terraforms the terrain and calls layout callbacks at the room’s world position.
* **Parameters:**  
  - `id` (`string`) — The key in `defs` table used to load the room definition.
* **Returns:** Nothing.
* **Error states:** Asserts if `roomid` is already set or if `defs[id]` is missing.

### `UnloadRoom(save)`
* **Description:** Unloads all entities in the room within a radius of 28 tiles. Optionally saves entities to a data structure if `save` is `true`. Entities are selectively skipped, saved, or kept based on ownership and tag logic. Removes remaining entities from the world.
* **Parameters:**  
  - `save` (`boolean`) — Whether to serialize and return entity data.
* **Returns:**  
  - `save?` — A table of saved entities (prefab → records) and metadata (e.g., `world_time`), or `nil` if `save=false` or no entities were saved.  
  - `ents` (`table`) — List of entity instances that were *not* saved or removed (kept in the room).
* **Error states:** Returns early with no action if `self.roomid` is `nil` or invalid (assertions commented out).

### `ResetRoom()`
* **Description:** Unloads the current room (without saving) and resets the terrain layout at the anchor’s position.
* **Parameters:** None.
* **Returns:** Nothing.

### `LoadRoom(id, data)`
* **Description:** Loads a vault room. If `data` is provided, restores entities from a prior `UnloadRoom` call; otherwise, creates a fresh layout using `LayoutNewRoom`.
* **Parameters:**  
  - `id` (`string`) — The room definition ID.  
  - `data?` (`table`) — Optional saved room data containing entity records.
* **Returns:** Nothing.
* **Error states:** Asserts if `roomid` is already set or `defs[id]` is missing.

### `OnSave()`
* **Description:** Serializes the room state for world save. Called by the save system.
* **Parameters:** None.
* **Returns:** `table?` — `{ room = roomid }` if a room is active; otherwise `nil`.

### `OnLoad(data)`
* **Description:** Restores the room state from a saved world. Called by the load system.
* **Parameters:**  
  - `data` (`table?`) — The saved room record (may be `nil`).
* **Returns:** Nothing. Updates `self.roomid` based on `data.room`.

## Events & listeners
None identified.
