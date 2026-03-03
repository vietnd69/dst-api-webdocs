---
id: greenmush
title: Greenmush
description: Registers multiple cave-specific room templates for green mushroom biomes in the world generation system.
tags: [world, generation, biome]
sidebar_position: 1
last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: b7e43b2f
---
# Greenmush

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This file defines and registers six distinct room templates for green mushroom-themed cave biomes in the world generation system. These rooms represent variations of fungal ecosystems found in the overworld sections of caves, such as open forests, ponds, sinkholes, meadows, rabbit settlements, and procedurally generated noise areas. Each room is configured with a unique visual appearance (via `colour`, `value`, and optional `custom_tiles`), thematic tags (`Hutch_Fishbowl`), and a set of distributed prefabs with associated weights.

The component is not an Entity Component System (ECS) component but a world generation registration module. It contributes to the procedural map layout by exposing `AddRoom` entries that the level/room task system uses to populate cave sections during world generation.

## Usage example
This module is loaded automatically during world generation initialization and does not require direct instantiation or usage in mod code. To reference its registered rooms elsewhere (e.g., in a custom `taskset` or `static_layouts`), use the registered room names directly:

```lua
-- Example: Using a registered greenmush room in a static layout definition
AddStaticLayout("MyCustomGreenMushHut", {
    room = "GreenMushMeadow",
    pos = {x = 0, y = 0},
})
```

## Dependencies & tags
**Components used:** None. This file relies solely on the global `AddRoom` and `Roomify` functions imported via `require "map/room_functions"`.  
**Tags:** All rooms are tagged with `"Hutch_Fishbowl"`, indicating compatibility with the Hutch Fishbowl world generation constraint (prevents conflicts with other Hutch rooms).

## Properties
This file does not define or expose any reusable property objects or component-level variables. All configuration is inline in `AddRoom` calls.

## Main functions
### `AddRoom(name, roomdata)`
* **Description:** Registers a room template under a given name for use in procedural world generation. This function is imported from `map/room_functions` and called for each greenmush variant.
* **Parameters:**
  * `name`: `string` — Unique identifier for the room (e.g., `"GreenMushForest"`).
  * `roomdata`: `table` — Configuration table describing the room’s appearance and contents (see structure below).
* **Returns:** Nothing.
* **Error states:** Failures are typically silent in DST unless the name is duplicate or `roomdata` is malformed.

### `Roomify(roomdata)`
* **Description:** Wraps raw room configuration data into a standardized room definition format, typically used for background or auxiliary rooms where full dynamic room logic is unnecessary.
* **Parameters:**
  * `roomdata`: `table` — Raw room configuration (same structure as passed to `AddRoom`).
* **Returns:** `table` — A normalized room definition, suitable for use with `AddRoom`.
* **Error states:** Returns `nil` if `roomdata` is invalid.

## Events & listeners
None.

