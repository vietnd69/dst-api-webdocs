---
id: moontreehiddenaxe
title: Moontreehiddenaxe
description: Defines a static map layout containing moon trees and a hidden moonglass axe for world generation in DST.
tags: [worldgen, map, static_layout]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: a4b05ab8
system_scope: world
---

# Moontreehiddenaxe

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`moontreehiddenaxe.lua` is a static layout file used in the world generation system. It specifies a pre-defined, rectangular 2x2 tile area containing background tiles and a set of placed objects—including three `moon_tree_normal`, three `moon_tree_tall`, one `moon_tree_short`, and one `moonglassaxe`. These layouts are embedded into the game’s map generation pipeline (e.g., via `static_layouts` tasksets) to create consistent environmental features in specific map contexts, such as Moon Biome zones.

This file is not an Entity Component System (ECS) component; rather, it is a JSON-like table structure consumed by DST’s tilemap loader. It instructs the game engine where to instantiate specific prefabs and render background tiles during world initialization.

## Usage example
This file is not used directly by modders at runtime. Instead, it is referenced implicitly via map generation logic. A typical usage in the game’s codebase would be:

```lua
-- Inside a static layout taskset or room generator
local layout = require("map/static_layouts/moontreehiddenaxe")
-- The layout table is passed to the world generator to spawn prefabs and tiles at defined relative coordinates
```

No direct component instantiation or method calls are required or possible for this file.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties — this is a static data file, not a component class.

## Main functions
Not applicable.

## Events & listeners
Not applicable.