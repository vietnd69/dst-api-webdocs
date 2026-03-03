---
id: winter_start_medium
title: Winter Start Medium
description: Defines a pre-built winter starting map layout with static resources and spawnpoints for the Winter game scenario.
tags: [map, layout, resources, winter, static]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 683a66ef
system_scope: environment
---

# Winter Start Medium

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file is a static map layout definition (in Tiled JSON format) used to generate the medium-sized starting zone in the Winter season. It defines tile layers (background tiles), and an object group (FG_OBJECTS) containing spawn points, trees, resources (flint, perma_grass), and starting items (axe, backpack, blueprint). It is not a Lua component or script, but rather a data file that instructs the world generation system where to place assets for player starting areas.

## Usage example
This file is not used directly by modders or in Lua code. It is referenced internally by the worldgen system via scenario and map configuration. Modders typically do not interact with this file; instead, they customize starting layouts by editing or creating new `static_layouts` files and referencing them in scenario or task definitions.

```lua
-- This file is used internally; no direct usage by modders.
-- Example of how it is incorporated (not part of this file):
-- local layout = require "map/static_layouts/winter_start_medium"
-- worldgen:LoadStaticLayout(layout)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties — this file returns a plain Lua table with Tiled-compatible map metadata.

## Main functions
This file does not contain functions. It is a data-return file and exports only a single table literal.

## Events & listeners
Not applicable