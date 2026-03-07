---
id: four
title: Four
description: Static map layout for a residential-style room in the game's world generation system, defining tile background layers and object placements.
tags: [map, room, layout]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 4d22ad3e
system_scope: world
---

# Four

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines a static map layout named "four", intended for use as a residential-style room in the game's procedural world generation. It uses Tiled Map Editor format (version 1.1) and specifies a 32x32 tile grid with 16x16 tiles, composed of a background tile layer (BG_TILES) and a foreground object layer (FG_OBJECTS). The layout is self-contained and does not interact with game components, entities, or network logic—it serves purely as a design-time asset for map room instantiation.

## Usage example
This file is not used directly in Lua code. It is referenced and loaded by the world generation system via the map/ room loading infrastructure (e.g., `map/rooms/room_residential/four.lua`). Modders typically do not invoke this file programmatically; instead, it is referenced by room type configuration in room tilesets or level generation scripts.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties. This file returns a plain Lua table conforming to the Tiled JSON export format (adapted for Lua syntax) and does not define or expose game-related public variables.

## Main functions
None applicable.

## Events & listeners
None applicable.