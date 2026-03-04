---
id: hermitcrab_01
title: Hermitcrab 01
description: Static map layout definition for the Hermit Crab island, containing tile data, foreground objects (e.g., structures, flora, markers), and their spawn positions.
tags: [map, layout, static, level_design]
sidebar_position: 10

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: 03d3b335
system_scope: world
---

# Hermitcrab 01

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file defines a static layout (`hermitcrab_01`) for the Hermit Crab island in Don't Starve Together. It is a Tiled map format file used to construct the physical environment of the island during world generation. It specifies ground tile patterns (`BG_TILES` layer), and a collection of decorative and functional objects (`FG_OBJECTS` layer) such as structures (`hermithouse_construction1`, `meatrack_hermit`, `beebox_hermit`), flora (`moon_tree`, `sapling_moon`), natural features (`bullkelp_beachedroot`, `moonglass_rock`), and placement markers (e.g., `hermitcrab_marker`, `hermitcrab_marker_fishing`, `hermitcrab_lure_marker`) used by the world generation system to instantiate prefabs at runtime. This file does not contain logic or component code — it is pure data configuration.

## Usage example
This file is not intended to be used directly by modders as a component or script. It is consumed internally by the world generation system when loading the Hermit Crab island map. However, if you are creating a custom map using Tiled and need to reference the structure, here is a simplified example of how such a layout might be structured in Lua:

```lua
return {
  version = "1.1",
  luaversion = "5.1",
  orientation = "orthogonal",
  width = 20,
  height = 20,
  tilewidth = 64,
  tileheight = 64,
  layers = {
    {
      type = "tilelayer",
      name = "BG_TILES",
      data = { /* 400 integers representing tile IDs */ }
    },
    {
      type = "objectgroup",
      name = "FG_OBJECTS",
      objects = {
        { name = "", type = "moon_tree", shape = "rectangle", x = 304, y = 549 },
        { name = "", type = "hermitcrab_marker", shape = "rectangle", x = 574, y = 640 }
      }
    }
  }
}
```

## Dependencies & tags
**Components used:** None — this is a static data file, not a component script.  
**Tags:** None — this file does not manipulate entity tags or components.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | `string` | `"1.1"` | Tiled map format version. |
| `luaversion` | `string` | `"5.1"` | Lua version target. |
| `orientation` | `string` | `"orthogonal"` | Map orientation type. |
| `width` | `number` | `20` | Map width in tiles. |
| `height` | `number` | `20` | Map height in tiles. |
| `tilewidth` | `number` | `64` | Width of each tile in pixels. |
| `tileheight` | `number` | `64` | Height of each tile in pixels. |
| `properties` | `table` | `{}` | Custom properties (unused in this layout). |
| `tilesets` | `table` | See source | Tileset definitions (ground texture source). |
| `layers` | `table` | See source | List of map layers (`tilelayer`, `objectgroup`). |

## Main functions
This file returns a plain Lua table and does not define any functions. It is consumed by the world generation engine to instantiate prefabs based on the `type` field in `FG_OBJECTS.objects`.

## Events & listeners
None — this file is data-only and does not participate in event-driven logic.