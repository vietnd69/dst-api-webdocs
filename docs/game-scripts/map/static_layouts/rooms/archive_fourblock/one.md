---
id: one
title: One
description: Defines a static room layout for the archive_fourblock map section, containing background tile patterns and object placements for cave lighting and pillars.
tags: [map, room, layout]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: e23949b1
system_scope: environment
---

# One

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`one.lua` is a static room layout file used by DST's world generation system. It specifies the visual and structural layout of a specific room variant in the `archive_fourblock` area. The file contains tile layer data (`BG_TILES`) that renders background patterns and an object group (`FG_OBJECTS`) that defines placement markers for in-game entities such as `pillar_atrium` and `cavelight` objects. This file follows the Tiled Map Editor format (`.json`-compatible Lua table), but is serialized as a Lua module for runtime loading.

## Usage example
This file is not intended for direct use in mod code. It is loaded automatically by the map generator during world initialization via the `static_layouts` system, typically referenced through tasksets or level definitions (e.g., in `map/tasksets/caves.lua`). Modders do not instantiate or call functions from this module directly.

```lua
-- No direct usage — this file is part of the built-in map asset pipeline.
-- It is referenced implicitly by map/tasksets/caves.lua and similar files.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties — this file returns a plain table describing layout metadata only.

## Main functions
No functions — this file returns a static data structure. No callable methods are defined.

## Events & listeners
Not applicable