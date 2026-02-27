---
id: generic
title: Generic
description: Defines static cave room templates including impassable pit rooms and cave exit rooms with distributed flora and light assets.
tags: [map, room, cave, procedural, worldgen]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: f4c22b3e
---

# Generic

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This component defines two static cave room templates used during world generation: `PitRoom` and `CaveExitRoom`. It specifies visual properties, tile types, and content generation rules (e.g., prefabs to distribute). These rooms are integral to the procedural cave mapping system and are registered via `AddRoom` from `map/room_functions`.

## Usage example
This file does not define a reusable component class; instead, it is a configuration script executed during world generation initialization. Typical usage involves the engine calling `AddRoom` at startup to register room definitions. Modders should not instantiate or call functions directly here, but can override or extend room behavior by redefining room names via `AddRoom` after requiring the same `room_functions` module.

```lua
-- Example mod extension (not from this file; illustrative only)
require "map/room_functions"

AddRoom("CustomCaveRoom", {
    colour = {r=0.1, g=0.1, b=0.1, a=0.5},
    value = WORLD_TILES.WALKABLE,
    type = NODE_TYPE.Room,
    contents = {
        distributeprefabs = {
            custom_cave_flower = 0.3,
            candle = 0.02,
        }
    }
})
```

## Dependencies & tags
**Components used:** None — this file is self-contained and does not access any `inst.components.X` or manage entity components.

**Tags:** None identified — no entity tags are added, removed, or checked.

## Properties
No properties are defined, as this is a configuration script rather than a component class. Room templates are registered as top-level data structures.

## Main functions
This file does not define any reusable functions. It calls `AddRoom` directly with room definitions.

### `AddRoom(name, definition)`
* **Description:** Registers a room template with the world generation system. Used to define shape, appearance, tile type, and content distribution rules for a specific room.
* **Parameters:**
  * `name` (string): Unique identifier for the room (e.g., `"PitRoom"`, `"CaveExitRoom"`).
  * `definition` (table): Room configuration with keys such as `colour`, `value`, `type`, `internal_type`, and `contents`.
* **Returns:** Nothing (side-effect only).
* **Error states:** May fail silently or raise errors during worldgen if `name` conflicts or `definition` is malformed. Room definitions must comply with expected schema used by `room_functions`.

## Events & listeners
None — this script performs static registration and does not use the event system.

---