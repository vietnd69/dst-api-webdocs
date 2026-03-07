---
id: three
title: Three
description: A static map layout definition for an atrium hallway corridor, containing tile data and placement information for foreground objects.
tags: [map, room, layout]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: a91eb01d
system_scope: world
---

# Three

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines a static map layout used in the Atrium hallway corridor. It is a Tiled JSON-compatible structure that specifies tile layer data (`BG_TILES`) and object placement data (`FG_OBJECTS`). This layout is consumed by the game's world generation system to construct atmospheric and structured interior spaces. As a static layout file, it does not implement any runtime logic or component behavior—it is purely declarative data.

## Usage example
Static layouts like this are typically loaded and instantiated during world generation by the map generation engine and are not added directly to entities via component APIs. Example conceptual usage in worldgen context:
```lua
-- This file is referenced in a task or room template and loaded automatically
-- during level generation. No manual instantiation required.
-- Usage is handled internally by map/room generation systems.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties — this is a pure data structure returning a Lua table.

## Main functions
Not applicable — this is a data-only file with no executable functions.

## Events & listeners
Not applicable — this file does not participate in the event system.