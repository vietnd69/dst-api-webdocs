---
id: monkeyisland_retrofitlarge_01
title: Monkeyisland Retrofitlarge 01
description: A Tiled map layout file defining the static tile and object configuration for the Monkey Island island environment.
tags: [world, map, static_layout]
sidebar_position: 10
last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 6884fee7
system_scope: world
---
# Monkeyisland Retrofitlarge 01

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file is a static layout map configuration for the Monkey Island area in Don't Starve Together. It defines a 36x36 tile grid using Tiled map format (orthogonal orientation, 64x64 px tiles), specifying background tile patterns, foreground object placements (including portals, boats, cannons, docks, flags, monkey structures, and decorative plants), and tile registration zones for ocean coastal shore transitions. It is a read-only data structure used at runtime to instantiate the level environment and is not a mod component with executable logic.

## Usage example
Static layout files like this one are loaded and parsed by the game engine during world initialization and are not instantiated or interacted with directly in mod code. Example of how the game engine consumes this data:

```lua
-- Internal engine use only — not modder-facing.
-- Example (hypothetical, not actual modder API):
-- local layout = LoadStaticLayout("map/static_layouts/monkeyisland_retrofitlarge_01.lua")
-- layout:ApplyToWorld(world_inst)
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.  
This file is pure data, not an entity component, and does not reference or define any components, tags, or executable logic.

## Properties
No public properties. This file returns a plain Lua table containing map metadata and layer definitions. The table keys match the Tiled JSON specification.

## Main functions
Not applicable.

## Events & listeners
Not applicable.
