---
id: terrarium_forest_spiders
title: Terrarium Forest Spiders
description: Static layout definition for the Terrarium Forest Spiders room, specifying tile layout, background layers, and placed objects such as spider dens, logs, and items.
tags: [world, map, static_layout]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 02d0b879
system_scope: world
---

# Terrarium Forest Spiders

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file defines a static map layout for a terrarium-themed forest environment featuring spider-related content. It specifies the grid-based tile data (`BG_TILES`) and a list of object instances (`FG_OBJECTS`) to be placed in the world, such as `spiderden`, `log`, `pond`, and `terrariumchest`. This is a data-only layout file used by the world generation system to instantiate predefined room layouts, not a component with runtime logic or behavior.

## Usage example
This file is not used directly in mod code. It is consumed by the world generation engine when loading terrarium rooms. For example, during cave or overworld generation, a task may reference this layout to populate a room:

```lua
-- Example usage in a taskset or room definition (not in this file)
room:LoadStaticLayout("terrarium_forest_spiders")
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Map format version (Tiled format). |
| `luaversion` | string | `"5.1"` | Lua version used (metadata only). |
| `orientation` | string | `"orthogonal"` | Map rendering orientation. |
| `width` | number | `3` | Room width in tiles. |
| `height` | number | `3` | Room height in tiles. |
| `tilewidth` | number | `64` | Pixel width per tile. |
| `tileheight` | number | `64` | Pixel height per tile. |
| `tilesets` | table | *(see source)* | Tileset definitions (ground only). |
| `layers` | table | *(see source)* | Layer definitions (`BG_TILES`, `FG_OBJECTS`). |

## Main functions
Not applicable

## Events & listeners
Not applicable