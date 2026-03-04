---
id: waterplant2
title: Waterplant2
description: Defines the static layout data for a waterplant map room using Tiled map format.
tags: [map, static_layout]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 617b128a
system_scope: world
---

# Waterplant2

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file is a static map layout definition for a room containing waterplants. It uses the Tiled map format (v1.1, Lua encoding) to specify tile layers and object placement. It is used by the world generation system to instantiate physical representations of waterplants (e.g., in swamps or wet environments). The file defines background tiles (`BG_TILES`) and object placement markers (`FG_OBJECTS`) for waterplant prefabs, but contains no logic or component code itself — it is data only.

## Usage example
This file is not meant to be loaded as a component. It is loaded by the world generation system to construct in-world structures. Example of how a generator might reference it:
```lua
local layout = require "map/static_layouts/waterplant2"
-- Generator code would process layout.layers to place tiles and spawn prefabs
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties (this file returns raw map data, not a component class).

## Main functions
Not applicable.

## Events & listeners
Not applicable.