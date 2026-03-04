---
id: sculptures_5
title: Sculptures 5
description: Defines a static map layout containing decorative sculptures and statues for in-game environments.
tags: [map, decoration, static]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 9f42514a
system_scope: world
---

# Sculptures 5

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file is a static layout definition used by the DST world generation system. It specifies a 20x20 tiled grid (`width = 20`, `height = 20`) with background tiles and an object layer (`FG_OBJECTS`) containing static entity placements for decorative sculptures and statues. The layout is intended to populate environmental scenery in the game world, typically loaded during map or room generation.

The background tile layer (`BG_TILES`) uses tile ID `11` placed in specific coordinates, while the foreground object layer defines nine objects (sculptures and statues) with named types such as `sculpture_knight`, `sculpture_bishop`, `sculpture_rook`, `sculpture_random`, and `statue_marble`. These are likely used as blueprints to instantiate actual prefabs in-game.

## Usage example
This file is not used directly as a component; it is returned as a table by the module loader and consumed by the world generation system. A typical integration in a room or static layout loader might look like:

```lua
local SculpturesLayout = require "map/static_layouts/sculptures_5"
-- During world generation, this layout data is processed by the engine to spawn prefabs
-- based on the 'type' field in the objectgroup.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties — this module returns a plain table conforming to the Tiled JSON-like format, used for static layout definitions.

## Main functions
None identified — this file defines only data, not executable logic or methods.

## Events & listeners
Not applicable.