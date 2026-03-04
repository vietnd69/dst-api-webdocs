---
id: tentacles_blocker
title: Tentacles Blocker
description: Stores static layout data for tentacle and marsh vegetation objects in the Marsh region map layers.
tags: [map, environment, static_layout, level_design]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: ee1fc596
system_scope: environment
---

# Tentacles Blocker

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`tentacles_blocker.lua` is a static map layout file defining tile and object placement for a specific area in the Marsh biome. It is not an ECS component but a Level Design data structure, returned as a Lua table containing TMX-style map configuration. The file encodes background tiles in a grid and specifies object placements (tentacles and marsh vegetation) used by the world generation system to populate the Marsh environment.

This file contributes to static environmental blocking and thematic decoration, likely interacting with worldgen systems like `map/levels/marsh.lua` or region-specific tasks. It does not contain logic code or runtime behavior — it serves as declarative data.

## Usage example
This file is not instantiated by modders. It is loaded internally by the world generation engine when building the Marsh biome. Example internal usage (not modder-facing):
```lua
-- Internal engine code (not called by mods):
local layout = require("map/static_layouts/tentacles_blocker")
-- layout.data contains tile grid and layout metadata for worldgen
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties — this is a static data file, not a component class.

## Main functions
Not applicable.

## Events & listeners
Not applicable.