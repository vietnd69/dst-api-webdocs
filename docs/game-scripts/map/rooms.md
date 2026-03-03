---
id: rooms
title: Rooms
description: Manages the registration and retrieval of world room definitions for procedural map generation in Don't Starve Together.
tags: [map, procedural-generation, world-creation]
sidebar_position: 100
last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 43c3f513
---
# Rooms

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `rooms` module serves as the central registry for all room definitions used in the game's procedural world generation system. It provides a unified interface for adding and retrieving room blueprints, supporting both built-in and mod-defined rooms. Room definitions are Lua tables specifying visual, gameplay, and content properties for discrete map sections. This module acts as a dependency for the map generation pipeline—particularly `map_gen.lua` and related task/taskset systems—which consume room data to assemble playable maps during world initialization.

## Usage example

```lua
-- Define a new custom room
local my_room_data = {
    colour = {r=0.5, g=0.6, b=0.4, a=1.0},
    value = WORLD_TILES.GRASS,
    type = NODE_TYPE.Plain,
    contents = {
        countprefabs = {
            bush = 3,
            log = function() return 1 + math.random(2) end
        }
    }
}

-- Register the room under a unique name
AddRoom("my_custom_room", my_room_data)

-- Later, retrieve the room definition by name
local room_def = GetRoomByName("my_custom_room")
if room_def ~= nil then
    -- Use room_def to populate map nodes during generation
end
```

## Dependencies & tags

**Components used:** None. This is a pure data management module with no component dependencies.

**Tags:** None identified.

## Properties

No persistent properties are stored in this module’s top-level scope beyond the two global tables `rooms` and `modrooms`.

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `rooms` | `table<string, table>` | `{}` | Stores built-in room definitions registered via `AddRoom`. Keys are room names; values are room data tables. |
| `modrooms` | `table<string, table<string, table>>` | `{}` | Nested table of mod-specific rooms: `modrooms[mod_name][room_name] = room_data`. Used to avoid naming conflicts with built-in rooms. |

## Main functions

### `AddRoom(name, data)`
* **Description:** Registers a built-in room definition. Fails with an error if a room with the same `name` already exists.
* **Parameters:**
  - `name` (`string`): Unique identifier for the room.
  - `data` (`table`): Room definition table (typically containing `colour`, `value`, `type`, and `contents` keys).
* **Returns:** `nil`
* **Error states:** Throws an assertion error if `GetRoomByName(name)` already returns a non-`nil` value.

### `AddModRoom(mod, name, data)`
* **Description:** Registers a mod-defined room under a specific mod namespace. Prevents conflicts with built-in rooms or other mods' rooms by checking for name collisions first.
* **Parameters:**
  - `mod` (`string`): Identifier of the mod adding the room (e.g., `"my_mod_name"`).
  - `name` (`string`): Unique room name *within the mod’s namespace*.
  - `data` (`table`): Room definition table.
* **Returns:** `nil`
* **Error states:** Logs a mod error (via `moderror`) and does *not* register the room if a room with the same `name` already exists in any namespace.

### `GetRoomByName(name)`
* **Description:** Retrieves a room definition by name, searching modded rooms first, then built-in rooms.
* **Parameters:**
  - `name` (`string`): The room identifier.
* **Returns:** `table?` — The room definition table, or `nil` if no room with that name exists.
* **Error states:** None. Returns `nil` for unknown names.

### `ClearModData(mod)`
* **Description:** Clears all mod-defined rooms associated with a given mod. If `mod` is `nil`, clears *all* mod-defined rooms.
* **Parameters:**
  - `mod` (`string?`): Mod identifier. Pass `nil` to clear all mod data.
* **Returns:** `nil`
* **Error states:** None.

## Events & listeners

No events are listened to or pushed by this module.

