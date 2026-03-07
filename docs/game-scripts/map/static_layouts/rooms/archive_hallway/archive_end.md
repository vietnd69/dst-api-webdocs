---
id: archive_end
title: Archive End
description: Defines the static layout data for the archive hallway end room, including background tile configuration and object placement for walls, chandeliers, and lockbox dispensers.
tags: [map, level-design, static-layout]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: e6798513
system_scope: environment
---

# Archive End

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`archive_end.lua` is a static room layout definition used by the DST map generation system. It specifies the tile-based layout of the "archive hallway end" room via Tiled map format metadata, including background tile layer data and an object group for entity placement (e.g., pillars, chandeliers, lockbox dispensers). This file does not implement an ECS component or game logic — it is pure data consumed by the world generation system to instantiate room prefabs.

## Usage example
Not applicable — this file is a data definition and is not instantiated directly in mod code. Room layouts like this are referenced internally by `map/tasksets/caves.lua` or similar taskset files during world generation.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties.

## Main functions
Not applicable — this file returns a plain table with layout metadata and does not define functions.

## Events & listeners
Not applicable — this file does not register or dispatch events.