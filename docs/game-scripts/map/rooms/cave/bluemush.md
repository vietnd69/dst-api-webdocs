---
id: bluemush
title: Bluemush
description: Defines cave-level blue mushroom biome room types and their content distributions for world generation.
tags: [world, generation, environment, biome]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: d8e731c5
---

# Bluemush

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This script defines room templates for the blue mushroom cave biome in Don't Starve Together's world generation system. It specifies multiple room variants (e.g., "BlueMushForest", "BlueSpiderForest", "MoonMushForest") that contain distinct distributions of prefabs such as `mushtree_tall`, `blue_mushroom`, `dropperweb`, and `batcave`. Each room is registered via `AddRoom()` with associated visual and functional properties including tile type, colour tint, tags, and probabilistic content generation rules. This file contributes to the procedural mapping of cave levels, particularly the blue fungal caverns.

## Usage example
This file does not define a component usable by modders at runtime. It is used internally during world generation to populate cave levels with themed rooms. Modders should register custom room definitions using `AddRoom()` and `Roomify()` from `map/room_functions`.

```lua
-- Example custom room registration (not part of this file)
require "map/room_functions"

AddRoom("MyCustomBlueMush", {
    colour = {r=0.1, g=0.1, b=0.8, a=0.9},
    value = WORLD_TILES.FUNGUS,
    tags = {"Hutch_Fishbowl"},
    contents = {
        distributepercent = 0.5,
        distributeprefabs = {
            mushtree_tall = 4.0,
            blue_mushroom = 1.0,
        },
    },
})
```

## Dependencies & tags
**Components used:** None — this script operates at the world generation layer and does not interact with in-game entity components.

**Tags:** All blue mushroom rooms are tagged with `"Hutch_Fishbowl"` (except `"MoonMushForest"` and `"MoonMushForest_entrance"`, which have no tags or `"GrottoWarEntrance"` respectively). Tags influence room selection and placement logic.

## Properties
This script does not define an ECS component or data structure with persistent instance properties. Instead, it registers static room definitions via `AddRoom()`.

**None applicable.**

## Main functions
This script does not define a component with public methods. It contains only top-level function calls: `AddRoom()` and `Roomify()`.

- `AddRoom(name, roomdef)` — Registers a named room definition for world generation. The `roomdef` table includes `colour`, `value`, `tags`, and `contents`.
- `Roomify(roomdef)` — Wraps a room definition (like `bgbluemush`) into a format suitable for direct room placement in static layouts.

## Events & listeners
None — this script does not use events or listeners, as it executes during map generation before gameplay begins.

---