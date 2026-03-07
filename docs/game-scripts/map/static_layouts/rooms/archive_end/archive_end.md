---
id: archive_end
title: Archive End
description: Defines the static Tiled map layout for the archive end room, including tile layers and object placements for environmental props and interactive elements.
tags: [map, room, environment]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 50867276
system_scope: world
---

# Archive End

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file is a Tiled map export (in Lua table format) defining the static layout for the "archive end" room in DST's caves. It specifies map metadata, tilesets, and two layers: `BG_TILES` (background tile data) and `FG_OBJECTS` (an object group containing placements for environmental assets like pillars, chandeliers, switches, and security elements). This is used by the world generation system to instantiate the room during map generation and does not implement an ECS component or behave like traditional gameplay components.

## Usage example
This file is loaded and parsed by the map system during world generation and is not instantiated directly by modders. It is referenced via the room system (e.g., in `map/rooms/caves/archive/` or `map/tasksets/`), but modders do not interact with it programmatically. No usage example is applicable.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties

## Main functions
Not applicable

## Events & listeners
Not applicable