---
id: spider_blocker_c
title: Spider Blocker C
description: Static map layout defining terrain tiles and decorative vegetation/obstacle placement, used to block or direct spider paths in the game world.
tags: [map, environment, blocking, static_layout]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: e84f206a
system_scope: environment
---

# Spider Blocker C

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`spider_blocker_c.lua` is a static map layout definition (Tiled JSON format serialized as Lua) that specifies tile-based terrain and object placement for environmental blocking. It is used by the world generation system to create spatial barriers—particularly to impede or route spider movement. The component is not an ECS component but a data file defining static world geometry for use in level design and procedural generation.

## Usage example
This file is not used directly by modders but is consumed by the world generation system via map-related APIs. It would be referenced indirectly by taskset or room definitions like so:
```lua
-- Example conceptual usage within a taskset or room definition:
{
    static_layout = "spider_blocker_c",
    -- ... other properties
}
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled export format version. |
| `luaversion` | string | `"5.1"` | Lua engine version used for export. |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width` | number | `40` | Map width in tiles. |
| `height` | number | `40` | Map height in tiles. |
| `tilewidth` | number | `16` | Width (in pixels) of each tile. |
| `tileheight` | number | `16` | Height (in pixels) of each tile. |
| `tilesets` | table | — | Array of tileset definitions referencing ground texture. |
| `layers` | table | — | Array of layers (`BG_TILES` and `FG_OBJECTS`). |

## Main functions
Not applicable — this file returns static configuration data, not runtime functions.

## Events & listeners
Not applicable — this file contains no runtime logic, event listeners, or event firing.