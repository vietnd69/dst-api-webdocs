---
id: tallbird_blocker_small
title: Tallbird Blocker Small
description: A static map layout defining geometry and object placement for small tallbird-related map areas.
tags: [map, static_layout, environment]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 7c190a36
system_scope: environment
---

# Tallbird Blocker Small

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file defines a static map layout (`tallbird_blocker_small`) used in the world generation system. It specifies tile-based background layers (`BG_TILES`) and an object layer (`FG_OBJECTS`) containing placements for tallbird nests and rocks. As a static layout, it is used by map task generators to populate specific world regions with thematic environmental features — in this case, features associated with tallbird habitats. It does not implement an ECS component; rather, it is a data structure consumed by the worldgen system.

## Usage example
This file is not directly instantiated as a component. Instead, it is referenced indirectly through map generation systems (e.g., `map/tasksets/caves.lua` or `map/levels/` files). Modders customizing world layouts typically extend or replace static layouts in `map/static_layouts/` and configure their use in tasksets or levels.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties — this file returns a plain Lua table containing layout metadata.

## Main functions
Not applicable — this file defines data, not executable logic.

## Events & listeners
None identified