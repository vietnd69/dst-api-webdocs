---
id: rabbits
title: Rabbits
description: Defines cave-level room templates for rabbit warrens and related environments, including RabbitArea, RabbitTown, RabbitCity, RabbitSinkhole, and SpiderIncursion.
tags: [map, worldgen, room, biome]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 19589e4d
---

# Rabbits

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This file defines five procedural cave room templates for rabbit-related environments using the `AddRoom` mechanism. It specifies visual and content-related properties such as color, tile type, static layout usage, and prefab distribution percentages for generating rabbit warrens and adjacent areas in the Caves dimension. It does not define an Entity Component System component, but rather serves as a world-generation configuration file that populates cave areas with rabbit-themed content.

## Usage example
This file is not used directly by modders in code; it is automatically loaded during world initialization as part of the cave worldgen configuration. Modders wishing to extend or override room definitions should replicate or extend the `AddRoom` calls in a custom worldgen script, ensuring proper import of `map/room_functions`.

```lua
-- Example: Manually defining a similar rabbit lair room in a custom worldgen script
require "map/room_functions"

AddRoom("MyRabbitLair", {
    colour = {r=0.25, g=0.2, b=0.1, a=0.4},
    value = WORLD_TILES.SINKHOLE,
    type = NODE_TYPE.Room,
    contents = {
        distributepercent = 0.1,
        distributeprefabs = {
            rabbithouse = 0.5,
            carrot_planted = 1,
            flower_cave = 0.75,
            cavelight = 0.1,
        }
    }
})
```

## Dependencies & tags
**Components used:** None. This file operates at the world-generation layer and does not interact with any Entity Component System components.

**Tags:** None identified. The file sets visual (`colour`) and logical (`value`, `type`) properties, but no game tags are added or removed via `inst:AddTag` or `inst:HasTag`.

## Properties
No properties are defined in an ECS-like manner. Room definitions are passed as Lua table configurations to `AddRoom`. Each room is registered with the following static configuration keys:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `colour` | `{ r, g, b, a }` | Required | RGBA colour values used for debugging and rendering the room in the map editor. |
| `value` | `WORLD_TILES` | Required | Tile type identifier for floor rendering. Always `WORLD_TILES.SINKHOLE` here. |
| `type` | `NODE_TYPE` | `NODE_TYPE.Room` | Room classification used in worldgen graph traversal. |
| `contents.distributepercent` | `number` | Required | Probability that this room appears when the generator considers rabbit-themed rooms. |
| `contents.distributeprefabs` | `{ [string] = weight }` | Required | Prefab weights for random placement inside the room. |
| `contents.countstaticlayouts` | `{ [string] = count }` | Optional | Specifies exact static layouts to place, overriding procedural generation for the room. |

## Main functions
This file does not define any functions directly. All logic is embedded in `AddRoom` calls. The `AddRoom` function is imported via `require "map/room_functions"` and is responsible for registering room definitions with the world generation system.

## Events & listeners
This file does not register or emit any events. It is a declarative world-generation configuration script and does not interact with the DST event system (`inst:ListenForEvent`, `inst:PushEvent`).