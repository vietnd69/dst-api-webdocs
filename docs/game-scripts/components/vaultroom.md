---
id: vaultroom
title: Vaultroom
description: Manages virtual room instantiation, persistence, and entity cleanup for vault-style dungeon rooms.
tags: [dungeon, persistence, worldgen]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: components
source_hash: a49052c6
system_scope: environment
---

# Vaultroom

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`Vaultroom` manages the lifecycle of virtual dungeon rooms that can be dynamically created, saved, and loaded. It handles terraforming at the room location, spawning room-specific entities from definitions, and cleaning up entities when the room is unloaded. This component is essential for instanced dungeon areas where entities need to persist across player visits without cluttering the global entity space.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("vaultroom")

-- Create a new room from definition
inst.components.vaultroom:LayoutNewRoom("vault_room_01")

-- Save and unload the room (returns save data)
local save_data, remaining_ents = inst.components.vaultroom:UnloadRoom(true)

-- Later, load the room from saved data
inst.components.vaultroom:LoadRoom("vault_room_01", save_data)

-- Get current room ID
local roomid = inst.components.vaultroom:GetCurrentRoomId()
```

## Dependencies & tags
**External dependencies:**
- `prefabs/vaultroom_defs` -- room definition table containing layout and terraform functions

**Components used:**
- `spell` -- checks `target` to trace entity ownership chain during unload
- `formationleader` -- checks `target` to trace entity ownership chain during unload
- `follower` -- calls `GetLeader()` to trace entity ownership chain during unload
- `inventoryitem` -- checks `owner` to trace entity ownership chain during unload
- `inventory` -- calls `DropEverythingWithTag()` during unload cleanup
- `container` -- calls `DropEverythingWithTag()` during unload cleanup

**Tags:**
- `INLIMBO` -- excluded from entity search during unload
- `staysthroughvirtualrooms` -- entities with this tag are skipped during unload
- `irreplaceable` -- entities with this tag are kept, not saved or removed
- `followsthroughvirtualrooms` -- entities with this tag are kept during unload

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | --- | The entity instance that owns this component. |
| `roomid` | string | `nil` | Current room definition ID. Set when room is layouted or loaded. |
| `SAVE_RADIUS` | constant (local) | `28` | Search radius for finding entities to save/remove during unload. |
| `SAVE_NO_TAGS` | constant (local) | `{ "INLIMBO" }` | Tags to exclude when searching for entities during unload. |
| `SAVE_CONTAINER_TAGS` | constant (local) | `{ "_inventory", "_container" }` | Tags used to find container entities for dropping irreplaceable items. |
| `_SKIP` | constant (local) | `1` | Action code for entities to ignore during unload (invalid, parented, or staysthroughvirtualrooms). |
| `_SAVE` | constant (local) | `2` | Action code for entities to save/remove during unload. |
| `_KEEP` | constant (local) | `3` | Action code for entities to retain during unload (players, irreplaceable, followsthroughvirtualrooms). |

## Main functions
### `GetCurrentRoomId()`
* **Description:** Returns the current room definition ID. Returns `nil` if no room is active.
* **Parameters:** None
* **Returns:** string room ID or `nil`
* **Error states:** None

### `LayoutNewRoom(id)`
* **Description:** Creates a new room from the given definition ID. Calls terraform and layout functions from `vaultroom_defs`. Behavior depends on definition flags: if `def.TerraformRoomAtXZ` exists, calls custom terraform; otherwise calls `ResetTerraformRoomAtXZ`. If `def.LayoutNewRoomAtXZ` exists, calls custom layout logic; otherwise skips layout phase. Sets `POPULATING = true` during processing.
* **Parameters:**
  - `id` -- string room definition key from `vaultroom_defs`
* **Returns:** nil
* **Error states:** Errors via `assert()` if `self.roomid` is already set (room already exists). Errors via `assert(false)` if `defs[id]` is nil (invalid room ID).

### `UnloadRoom(save)`
* **Description:** Unloads all entities in the room. If `save` is true, collects save records for persisting entities and returns save data. Entities are categorized as `_SKIP` (ignore), `_SAVE` (save/remove), or `_KEEP` (retain). Drops irreplaceable items from containers before removal. Sets `POPULATING = true` during processing.
* **Parameters:**
  - `save` -- boolean; if true, generates save data instead of just removing entities
* **Returns:** Table with save data (if `save` is true), or `nil`; plus table of remaining entities that weren't saved/removed
* **Error states:** None. Returns early if `defs[self.roomid]` is nil.

### `ResetRoom()`
* **Description:** Resets the room to its initial state. Calls `UnloadRoom()` to clear existing entities, then calls `ResetTerraformRoomAtXZ` to restore terrain.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None. Silently returns if `self.roomid` is nil.

### `LoadRoom(id, data)`
* **Description:** Loads a room from save data. If `data` is nil, calls `LayoutNewRoom()` for fresh generation. Otherwise spawns saved entities via `SpawnSaveRecord()`, hooks up references via `LoadPostPass()`, and applies time delta via `LongUpdate()` if `world_time` is present. Sets `POPULATING = true` during spawn.
* **Parameters:**
  - `id` -- string room definition key from `vaultroom_defs`
  - `data` -- save data table from `UnloadRoom()` or `nil` for fresh layout
* **Returns:** nil
* **Error states:** Errors via `assert()` if `self.roomid` is already set. Errors via `assert(false)` if `defs[id]` is nil.

### `OnSave()`
* **Description:** Save lifecycle hook. Returns a table containing the current `roomid` if set, or `nil` if no room is active.
* **Parameters:** None
* **Returns:** Table `{ room = roomid }` or `nil`
* **Error states:** None

### `OnLoad(data)`
* **Description:** Load lifecycle hook. Restores `roomid` from saved data. Does not automatically spawn entities — call `LoadRoom()` separately after this.
* **Parameters:**
  - `data` -- save data table from `OnSave()`
* **Returns:** nil
* **Error states:** None. Handles `data` being nil gracefully.

### `_inroom(ent, map, tile_x, tile_y)` (local)
* **Description:** Checks if an entity is within the room bounds. Returns true if entity is within 5 tiles of the center OR if the tile is `VAULT` or `IMPASSABLE` with visual ground.
* **Parameters:**
  - `ent` -- entity to check
  - `map` -- world map instance
  - `tile_x` -- center tile X coordinate
  - `tile_y` -- center tile Y coordinate
* **Returns:** boolean
* **Error states:** None

### `_getunloadaction(ent, map, tile_x, tile_y)` (local)
* **Description:** Determines what action to take on an entity during unload. Traces ownership chain through `spell.target`, `formationleader.target`, `follower:GetLeader()`, and `inventoryitem.owner`. Returns `_SKIP` for invalid/parented entities or those with `staysthroughvirtualrooms`. Returns `_KEEP` for players or entities with `irreplaceable`/`followsthroughvirtualrooms` tags. Returns `_SAVE` for normal room entities.
* **Parameters:**
  - `ent` -- entity to evaluate
  - `map` -- world map instance
  - `tile_x` -- center tile X coordinate
  - `tile_y` -- center tile Y coordinate
* **Returns:** Number: `_SKIP` (1), `_SAVE` (2), or `_KEEP` (3)
* **Error states:** None

## Events & listeners
None identified. This component does not register any event listeners, push any events, or watch world state variables.