---
id: tenticle_reeds
title: Tenticle Reeds
description: Defines the layout data for a static map room containing tentacle and reeds placement objects in the game world.
tags: [map, layout, environment]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: fa62916c
system_scope: environment
---

# Tenticle Reeds

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file is a static layout definition for a game map room (`tenticle_reeds`), encoded in Tiled Map Editor format. It specifies background tile layer data and an object group (`FG_OBJECTS`) containing placement markers for in-game entities — specifically `"tentacle"` and `"reeds"` objects. It does not implement any component logic itself, but provides procedural data used by the world generation system to instantiate prefabs at runtime. This file is part of the `static_layouts` directory used to define reusable map room content.

## Usage example
This file is not intended for direct component usage. It is consumed by the world generation system to instantiate ents in-game. A typical usage pattern in the generation code would be:

```lua
-- Example of how the layout may be loaded and processed internally
local layout = require("map/static_layouts/tenticle_reeds")
-- The layout is later passed to a spawner which reads layout.layers[2].objects
-- and spawns corresponding prefabs like "tentacle" and "reeds" at each object's x/y
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties — this file returns a Lua table literal defining map metadata and layout object positions.

## Main functions
This file does not define any functions. It returns a single data table.

## Events & listeners
Not applicable.