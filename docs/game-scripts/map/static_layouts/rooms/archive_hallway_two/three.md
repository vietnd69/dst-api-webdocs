---
id: three
title: Three
description: Defines the Tiled map layout for a hallway room (archive_hallway_two/three) used in DST's cave world generation, specifying tile layers and object placement for static dungeon architecture.
tags: [map, environment, static_layout]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 087c455c
system_scope: environment
---

# Three

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines a static map layout (in Tiled JSON format) for a hallway room (`archive_hallway_two/three`) used in DST's cave world generation. It specifies background tile data, decorative objects (e.g., statues, chandeliers), architectural walls, and specialized areas (e.g., creature zones, sound areas). The layout is consumed by the world generation system to build room instances and is not an ECS component — it does not define logic, state, or runtime behavior.

## Usage example
This file is not instantiated as a component. It is referenced internally by the world generation system during room placement, for example via `tasksets/caves.lua` and related room-loading logic.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties — this is a static data file returned as a Lua table.

## Main functions
Not applicable.

## Events & listeners
Not applicable.