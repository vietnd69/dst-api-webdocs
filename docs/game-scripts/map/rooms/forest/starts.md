---
id: starts
title: Starts
description: Registers predefined room templates for the forest world type, including custom starting areas like Burnt Forest and Safe Swamp, defining tile type, visual appearance, and content distribution rules.
tags: [room, worldgen, forest]
sidebar_position: 1
last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: ad6bf51b
---
# Starts

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This component defines and registers custom room templates for the forest world type using the `AddRoom` function. Each registered room specifies metadata such as tile type (`value`), a tinted overlay colour (`colour`), and rules for populating the room with prefabs (e.g., `countprefabs`, `distributeprefabs`, `prefabdata`). These rooms are used by the world generator to create specific environmental contexts—such as a burnt forest starting area or a safer marsh zone—when generating levels for the Forest world type.

## Usage example
While this script does not define a reusable component class, it demonstrates the standard pattern for declaring custom room templates in DST's world generation system:

```lua
AddRoom("MyCustomRoom", {
    colour = {r = 0.5, g = 0.5, b = 0.5, a = 0.3},
    value = WORLD_TILES.FOREST,
    contents = {
        countprefabs = { campfire = 2 },
        distributepercent = 0.4,
        distributeprefabs = {
            oak_tree = 1,
            twiggy_tree = function() return math.random(2, 4) end,
        },
        prefabdata = {
            oak_tree = { size = "large" },
        },
    },
})
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified

## Properties
No instantiated component object or class exists in this file; therefore, no properties are defined.

## Main functions
This script calls the global `AddRoom` function twice to register room templates. No local functions are defined or documented.

### `AddRoom(name, room_def)`
* **Description:** Registers a named room template with the world generator. This function is provided by DST's world generation system and is not defined in this file. It configures how rooms of this type are rendered and populated in the world.
* **Parameters:**
  * `name` (`string`): Unique identifier for the room (e.g., `"BurntForestStart"`).
  * `room_def` (`table`): Configuration table specifying room properties (keys: `colour`, `value`, `contents`).
* **Returns:** None (void function).
* **Error states:** Room registration fails silently if `name` conflicts with an existing room or if required keys are malformed or missing.

## Events & listeners
None.

