---
id: wormhole
title: Wormhole
description: Defines room templates for procedural world generation that represent wormhole entrance variations, each configured with specific tile types and biome content.
tags: [world, generation, environment]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 98231a12
---

# Wormhole

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This file defines six room templates (`Wormhole_Swamp`, `Wormhole_Plains`, `Wormhole_Burnt`, `Wormhole`, `Sinkhole`, and `GrassySinkhole`) used in the world generation system to represent wormhole entrances across different biomes. Each room specifies a visual color overlay, a base tile type (via `WORLD_TILES`), and a probabilistic layout of prefabs (vegetation, rocks, and a marker entity) to be placed during map generation. These rooms are primarily used by the worldgen system to intersperse wormhole-themed areas into forests and swamps.

## Usage example
This file does not define a reusable component for direct instantiation by modders. Instead, it registers room templates for use by the world generation engine. Modders typically do not interact with this file directly; room definitions like these are loaded automatically as part of the map generation pipeline.

If creating a custom wormhole room, the standard pattern (not shown here, as the file itself is static) would be:

```lua
AddRoom("MyCustomWormhole", {
    colour = {r=1, g=0, b=0, a=0.3},
    value = WORLD_TILES.FOREST,
    contents = {
        countprefabs = {
            wormhole_MARKER = 1,
        },
        distributepercent = 0.3,
        distributeprefabs = {
            grass = 1,
            rocks = 2,
        }
    }
})
```

## Dependencies & tags
**Components used:** None identified. This file operates at the room-registration level and does not access components directly.

**Tags:** None identified. This file does not add, remove, or check tags on entities.

## Properties
This file does not define any component classes or properties. It only calls the global function `AddRoom` multiple times with room configuration tables.

## Main functions
The following global functions are used in this file, but are defined externally (in the core worldgen system). This file consumes them, but does not define them:

### `AddRoom(roomname, roomdata)`
* **Description:** Registers a room template with the world generation system. This enables the room to be selected and placed procedurally during map generation based on room distribution rules.
* **Parameters:**
  * `roomname` (`string`): Unique identifier for the room (e.g., `"Wormhole_Swamp"`).
  * `roomdata` (`table`): Configuration table specifying:
    * `colour` (`{r,g,b,a}`): RGBA overlay color applied when rendering the room in debug/editor views.
    * `value` (`WORLD_TILES.*`): Base tile type to assign to the room’s footprint.
    * `contents`: Nested table with:
      * `countprefabs`: Prefabs guaranteed to be placed (e.g., `{wormhole_MARKER = 1}`).
      * `distributepercent`: Probability (0.0–1.0) that this room will be used during generation.
      * `distributeprefabs`: Map of prefabs to weights used for randomized placement.
      * `prefabdata`: Optional map specifying per-prefab custom data (e.g., `{ evergreen = {burnt=true} }`).
* **Returns:** None.
* **Error states:** Room names must be unique. Duplicate names may result in undefined behavior.

## Events & listeners
No events are registered or pushed by this file.