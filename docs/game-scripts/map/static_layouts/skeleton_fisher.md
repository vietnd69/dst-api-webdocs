---
id: skeleton_fisher
title: Skeleton Fisher
description: Static layout data for the Skeleton Fisher room used in cave world generation.
tags: [worldgen, map, room]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 1fc02d85
system_scope: environment
---

# Skeleton Fisher

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file defines a static map layout (`skeleton_fisher`) used in Don't Starve Together's cave world generation. It is not a scriptable component or entity — it is a Tiled JSON structure that describes the tile layer and object placements for a predefined room. It specifies background tiles, foreground object positions, and object types (e.g., `skeleton`, `fishingrod`, `spoiled_food`) to be instantiated during world generation. These object types are references to prefabs that will be spawned at the given coordinates when the room is placed.

## Usage example
```lua
-- Not applicable — this is a data file, not a moddable Lua component
-- The layout is consumed by the worldgen system, not instantiated manually
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  
> This file contains only layout metadata and does not define any components, tags, or runtime logic.

## Properties
No public properties  
> The returned table contains fixed map layout fields (e.g., `width`, `layers`, `tilesets`), but no user-accessible properties for modder configuration.

## Main functions
Not applicable  
> This file is data-only and does not define any functions.

## Events & listeners
None identified  
> This file contains no event listeners or event emissions.