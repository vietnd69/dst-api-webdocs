---
id: terrarium_forest_fire
title: Terrarium Forest Fire
description: Static map layout definition for the terrarium forest fire scenario, specifying tile configuration and object placement for a predefined environment.
tags: [map, static_layout, scenario]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 6be44704
system_scope: world
---

# Terrarium Forest Fire

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`terrarium_forest_fire` is a static layout file used to define a fixed map configuration for the Terrarium forest fire scenario. It specifies tile layer data (background tiles), and an object group containing prefabs (such as `pighouse`, `terrariumchest`, and multiple `flower_evil` instances) with their positions and properties. This file is consumed by the world generation system to place environmental objects and scenery deterministically when loading the terrarium forest fire scenario.

## Usage example
Static layouts like this one are typically loaded by the world generation system during level initialization and do not require manual component instantiation. As a data file, it is referenced internally by DST's map building tools:

```lua
-- Internal usage (do not replicate manually)
local layout = require("map/static_layouts/terrarium_forest_fire")
-- layout.data, layout.layers, etc., are processed by worldgen systems
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties. This file returns a plain Lua table with map metadata (version, dimensions, layers) intended for map builder tools and runtime map generation — not for direct use in prefab/component code.

## Main functions
Not applicable — this is a data-only file, returning static layout configuration.

## Events & listeners
Not applicable.