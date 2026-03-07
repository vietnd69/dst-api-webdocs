---
id: spider
title: Spider
description: Defines three procedural room templates (SpiderCity, SpiderVillage, SpiderVillageSwamp) for generating spider-infested areas in the Forest, Rocky, and Marsh biomes.
tags: [world, procedural, room, spider, generation]
sidebar_position: 10
last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 7d006679
---
# Spider

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This file defines three static room templates used during world generation to create spider-dominant areas. It does not implement a reusable `Component` class; instead, it registers three unique room configurations (`SpiderCity`, `SpiderVillage`, and `SpiderVillageSwamp`) using the `AddRoom()` API. Each template specifies visual appearance (via `colour`), terrain type (`value`), and content rules for placing prefabs (e.g., `spiderden`, `goldnugget`, and biome-specific vegetation).

## Usage example
Room templates defined here are not instantiated manually. They are automatically applied by the world generator when room placement algorithms select them. Example of how a room generator might internally reference them:

```lua
-- Not directly usable, but used by worldgen tasksets like "forest.lua"
AddRoom("Forest", {
    contents = {
        rooms = {
            "SpiderCity",
            "SpiderVillage",
            -- other rooms...
        }
    }
})
```

## Dependencies & tags
**Components used:** None (this file does not define or interact with Entity Component System components).
**Tags:** None identified.

## Properties
No properties are defined, as this file only invokes `AddRoom()` with static configuration tables.

## Main functions
### `AddRoom(name, roomdef)`
* **Description:** Registers a new room template named `name` for use in procedural world generation. The `roomdef` table defines how the room is placed and what it contains.
* **Parameters:**
  * `name` (`string`): Unique identifier for the room (e.g., `"SpiderCity"`).
  * `roomdef` (`table`): Configuration table specifying `colour`, `value`, and `contents`.
* **Returns:** None (calls internal registration logic).
* **Error states:** None documented; uses validated `AddRoom` implementation.

## Events & listeners
No event handling is present in this file.

