---
id: spider_blocker
title: Spider Blocker
description: A static layout definition for a 40x40 world region containing evergreen trees and fully mature spider dens, used to block or partition map areas in procedural generation.
tags: [worldgen, layout, spider]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 1439b3ca
system_scope: world
---

# Spider Blocker

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`spider_blocker` is not a component, but a static layout definition file used in DST's world generation system. It specifies a 40x40 tile map region (`width = 40`, `height = 40`, `tilewidth = 16`, `tileheight = 16`) composed of two layers: a background tile layer (`BG_TILES`) and a foreground object layer (`FG_OBJECTS`). The layout includes 18 evergreen trees and 11 fully grown (`data.growable.stage = "3"`) spider dens placed in a dense, symmetrical pattern, effectively forming a natural barrier or separator between map sections. This file is loaded as a Tiled JSON-style structure during world generation to populate permanent static features.

## Usage example
This file is not intended for direct component usage in prefabs or gameplay logic. Instead, it is referenced in world generation task or taskset files (e.g., in `map/tasksets/caves.lua` or `map/levels/caves.lua`) to define fixed map features. Example integration in a `static_layouts` block would be:

```lua
{
  type = "static_layout",
  layout = "spider_blocker",
  x = 12,
  y = 25,
}
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** Not applicable. This is a data-only layout definition.

## Properties
No public properties are exposed in this file. It is a plain Lua table conforming to Tiled's export format (version 1.1, Lua 5.1).

## Main functions
Not applicable — this is a static data structure, not a component with runtime methods.

## Events & listeners
Not applicable.