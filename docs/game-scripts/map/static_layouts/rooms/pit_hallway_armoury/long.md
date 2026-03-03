---
id: long
title: Long
description: Defines a static map layout for the Pit Hallway Armoury room in DST’s caves worldgen.
tags: [map, worldgen, static_layout]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 37b34eb5
system_scope: environment
---

# Long

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file is a static layout definition (in JSON/Tiled format) used for the "Pit Hallway Armoury" room in DST's cave world generation system. It specifies tile layer data (`BG_TILES`) and object placement (`FG_OBJECTS`) for a specific room configuration — specifically, the *long* variant of the armoury hallway. It contains no Lua components or ECS logic and is consumed by the worldgen pipeline during map construction.

## Usage example
This file is not instantiated as an entity or component at runtime. It is referenced by worldgen task/room prefabs (e.g., in `map/tasksets/caves.lua`) to spawn the layout via the static layout system. No direct modder usage is required or possible at the script level.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties — the file is a pure data structure returning a table used exclusively by `map/archive_worldgen.lua` and the Tiled loader.

## Main functions
None identified.

## Events & listeners
Not applicable.