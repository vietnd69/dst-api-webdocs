---
id: two
title: Two
description: A static map layout file defining the 'pit_room_armoury' sub-room configuration for level generation, including background tiles and object spawners.
tags: [map, procedural_generation, room]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 8af492dc
system_scope: world
---

# Two

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file is a static layout configuration for a room in the game's world generation system. Specifically, it defines the tile-based structure and object placement for a variant of the `'pit_room_armoury'` room. It does not implement a game component or entity logic — rather, it is a data definition used by the worldgen system to procedurally generate the game world. The room consists of a 32x32 tile background layer and an object layer with predefined spawners.

## Usage example
This file is not instantiated as a component and is not used directly in Lua scripts. It is loaded by the worldgen system as part of the static layout database. Modders reference this file when designing room variants or debugging map generation behavior.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties — this file returns a Lua table used for level design, not a component class.

## Main functions
This file does not define any functional methods. It returns a static data structure containing:
- `version`, `luaversion`, `orientation`, `width`, `height`, `tilewidth`, `tileheight`: Metadata for the map layout.
- `tilesets`: Tileset definitions (not used in DST's runtime, only in the Tiled editor).
- `layers`: Array of layer definitions:
  - `'BG_TILES'`: A tile layer with 32x32 tiles (16x16 px each), specifying background tile IDs via a flat array.
  - `'FG_OBJECTS'`: An object group with three spawner objects placed in the room (chessjunk_spawner, ruins_statue_mage_spawner, bishop_nightmare_spawner).

## Events & listeners
Not applicable — this is a static data file, not an active component.