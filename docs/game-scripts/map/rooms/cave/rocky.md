---
id: rocky
title: Rocky
description: Defines several cave room templates containing variable distributions of rocks, pillars, slurtle holes, bats, and other environmental props for world generation.
tags: [worldgen, room, environment, cave]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: environment
source_hash: ca0d6057
---

# Rocky

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This file defines multiple cave room templates used in the game's world generation system. It registers named room definitions (e.g., `SlurtleCanyon`, `BatsAndRocky`, `BGRockyCave`) using the `AddRoom` function provided by `map/room_functions.lua`. Each room specifies visual properties (color, noise value), tags, and a contents configuration that determines the probability distribution of prefab entities placed inside the room during map generation. These rooms are primarily used to populate cave levels with environmental props like rocks, pillars, slurtle holes, bats, and fissures.

## Usage example

This file does not expose a reusable component for direct instantiation. Instead, it serves as a declarative configuration used internally by the worldgen system. Modders can replicate its pattern by calling `AddRoom("MyRoomName", room_config)` in a similar location (e.g., a mod's `modmain.lua` or a dedicated worldgen script), where `room_config` includes `colour`, `value`, `tags`, `type`, and `contents` fields as shown below:

```lua
AddRoom("CustomRockyRoom", {
    colour = {r = 0.8, g = 0.8, b = 0.8, a = 0.95},
    value = WORLD_TILES.CAVE_NOISE,
    tags = {"Hutch_Fishbowl"},
    type = NODE_TYPE.Room,
    contents = {
        distributepercent = 0.1,
        distributeprefabs = {
            rock_flintless = 1.0,
            pillar_cave_flintless = 0.5,
            slurtlehole = 0.2,
            fissure = 0.02,
        },
    },
})
```

## Dependencies & tags

**Components used:** None  
**Tags:** `Hutch_Fishbowl` is added to every room definition via the `tags` field.

## Properties

This file does not define a component class or instantiate an entity. It defines configuration tables passed to `AddRoom`, which registers them as room templates for world generation. Therefore, there are no object properties to document.

## Main functions

### `AddRoom(name, room_config)`
* **Description:** Registers a named room template for use in world generation. Accepts a configuration table describing the room’s appearance, content distribution, and metadata. This function is imported from `map/room_functions.lua`.
* **Parameters:** 
  - `name` (string): Unique identifier for the room (e.g., `"SlurtleCanyon"`, `"BGRockyCaveRoom"`).
  - `room_config` (table): Configuration table with fields:
    - `colour` (table `{r,g,b,a}`): RGBA color used for room visualization.
    - `value` (number or constant like `WORLD_TILES.CAVE_NOISE`): Noise value or tile identifier used for room placement logic.
    - `tags` (array of strings): Metadata tags associated with the room (e.g., `{"Hutch_Fishbowl"}`).
    - `type` (NODE_TYPE enum value): Indicates the node type; in all cases here, it is `NODE_TYPE.Room`.
    - `contents` (table): Specifies distribution rules for room contents.
      - `distributepercent` (number): Probability that this room’s contents will be included when generating a map segment.
      - `distributeprefabs` (table): Map of prefab names (strings) to weights (numbers), used by the room generator to randomly place those prefabs inside the room.
* **Returns:** None (side-effect: registers the room template for later use).
* **Error states:** None documented.

### `Roomify(room_config)`
* **Description:** A helper function (from `map/room_functions.lua`) that returns a modified version of the input `room_config`, typically adjusted to make it suitable for use as a standalone, self-contained room template. In this file, it is used to register `"BGRockyCaveRoom"` with the same base configuration as `"BGRockyCave"`.
* **Parameters:** 
  - `room_config` (table): A room configuration table (same structure as passed to `AddRoom`).
* **Returns:** (table) A new room configuration table, possibly with minor modifications to ensure compatibility as a full room definition.
* **Error states:** None documented.

## Events & listeners

None. This file performs top-level configuration registration and does not define event listeners or events.