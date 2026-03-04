---
id: trap_winter
title: Trap Winter
description: Defines the static layout data for the winter season trap room in DST's world generation system using Tiled map format.
tags: [map, layout, winter]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: dc99a40d
system_scope: world
---

# Trap Winter

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`trap_winter.lua` is a static layout file used by DST's world generation system. It defines the precise placement and properties of map objects (such as chests, trees, and terrain features) for a specific winter-themed trap room, encoded in Tiled JSON-compatible Lua format. This file contributes to procedural map generation and does not contain executable game logic — it serves purely as data for level composition.

## Usage example
This file is not intended for direct use by modders. It is loaded internally by the world generation system when constructing trap rooms during map setup.

```lua
-- Internal use only — example of how the engine might reference this layout
-- local layout = require("map/static_layouts/trap_winter")
-- worldbuilder:AddStaticLayout(layout, x, y)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
Not applicable

## Events & listeners
Not applicable