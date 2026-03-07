---
id: one
title: One
description: Defines a static hallway layout for archive areas using Tiled map data, including tile layers for background visuals and object groups for interactive and decorative entities.
tags: [map, static_layout, environment]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: f86f5eee
system_scope: environment
---

# One

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`one` is a static layout definition for a hallway in archive-themed areas, encoded in Tiled JSON format and exported as Lua. It specifies map geometry via tile layers (`BG_TILES`) and placement of decorative and functional objects (e.g., statues, chairs, walls) via an object group (`FG_OBJECTS`). This file is used during world generation to instantiate physical room layouts, not as a runtime ECS component. It does not define logic, behavior, or entity interactions directly — rather, it acts as data that the worldgen system consumes to spawn prefabs at designated coordinates.

## Usage example
This file is not instantiated as an entity or component. It is typically loaded and consumed by worldgen systems (e.g., via `WorldGen` or `static_layouts` loaders) like:

```lua
-- Pseudocode: This file is referenced in worldgen task/room loading code
local layout = require("map/static_layouts/rooms/archive_hallway_two/one")
-- The engine later maps object types to prefabs (e.g., "archive_chandelier")
-- and tile IDs to tile prefabs during room construction
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

This file contains no executable Lua logic — it is pure data. No components, tags, or runtime behaviors are defined or referenced.

## Properties
No public properties. The file returns a static Lua table conforming to the Tiled JSON format specification (version `1.1`, orthogonal orientation, 32×32 tiles at 16×16 px). No programmatic variables or fields are used at runtime.

## Main functions
None identified. This file is data-only and does not define functions.

## Events & listeners
Not applicable.