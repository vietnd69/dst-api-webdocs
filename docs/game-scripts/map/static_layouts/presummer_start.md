---
id: presummer_start
title: Presummer Start
description: A static map layout used for the Presummer scenario start zone, defining terrain tiles, background elements, and interactive world objects such as trees, grass, campfires, and treasure chests.
tags: [map, worldgen, scenario]
sidebar_position: 1
last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: a55abb82
system_scope: world
---
# Presummer Start

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`presummer_start.lua` is a static layout file defining the initial environment for the Presummer scenario in Don't Starve Together. It specifies the map geometry using Tiled map format (orthogonal, 32×32 tiles), including tile layer data (`BG_TILES`) and an object group (`FG_OBJECTS`) that marks placed entities like trees, saplings, grass, campfires, treasure chests, and a spawn point. This file is not an ECS component—it is raw world generation data consumed by the game's map loading and entity placement systems during scenario initialization.

## Usage example
This file is not instantiated directly in mod code. It is referenced in scenario or worldgen configuration files to define a static starting area. Example usage in a scenario file:
```lua
WorldBuilder.AddStaticLayout("presummer_start", {
    x = 0,
    y = 0,
    width = 32,
    height = 32,
})
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `scenario_presummer`, `start_zone` via associated prefabs and scenario logic (not defined in this file)

## Properties
No public properties — this is a static data table returning Tiled JSON-compatible layout metadata.

## Main functions
Not applicable — no executable functions or methods are defined. The file returns a table describing map layout configuration.

## Events & listeners
Not applicable — no event handling logic is present in this file.
