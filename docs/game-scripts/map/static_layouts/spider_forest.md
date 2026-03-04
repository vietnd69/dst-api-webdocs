---
id: spider_forest
title: Spider Forest
description: Static map layout configuration for the Spider Forest biome, defining background tiles, foreground objects, and spider den placements with growth and sleep state metadata.
tags: [world, map, environment]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 9a2ca3d1
system_scope: environment
---

# Spider Forest

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file defines a Tiled map layout (`spider_forest.lua`) used to generate the Spider Forest biome in DST. It contains static geometry including background tile patterns, decorative foreground objects (e.g., evergreen trees), and spider dens with associated metadata such as stage (growth level) and sleep state. It is not an ECS component and does not implement entity behavior logic.

## Usage example
This file is not intended for direct usage by modders in scripts. It is consumed by DST's world generation system to populate the Spider Forest biome layer.

```lua
-- Not applicable: This is a static data file used internally by the engine.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties. This file exports a Lua table conforming to the Tiled JSON schema format.

## Main functions
Not applicable. This file returns a table containing map metadata and layer data; it does not define executable functions.

## Events & listeners
Not applicable.