---
id: spiral
title: Spiral
description: Defines a static map layout for the spiral arena using Tiled map format, including background tiles and object placements for the ruins and relics.
tags: [map, environment, arena]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 810fef4a
system_scope: environment
---

# Spiral

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file is a static layout definition for the spiral arena in DST. It describes a pre-designed 40×40 tile map using Tiled JSON-like format (though stored as Lua table). The layout includes a background tile layer (`BG_TILES`) with specific tile IDs placed in a spiral pattern and an object group (`FG_OBJECTS`) that defines placements for structural features like pillar ruins, a relic zone, and a cave hole.

The data is used during world generation to instantiate the spiral arena environment, typically as part of the lava arena event or related structured content.

## Usage example
This file is not a component and is not added to entities. It is returned as a Lua table by the game engine during level generation, specifically referenced in worldgen logic (e.g., `map/static_layouts/events/lava_arena.lua`). Modders typically do not interact with it directly; instead, it is loaded and processed internally by the level builder.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties exist — this file returns a raw data structure, not a component.

## Main functions
Not applicable — this is a static data file with no executable functions.

## Events & listeners
None identified