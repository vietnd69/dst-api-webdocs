---
id: maxwell_6
title: Maxwell 6
description: A Tiled map data file representing the static layout for the Maxwell 6 level, defining background tile layers and foreground object placements for the Don't Starve Together world generation system.
tags: [world, map, level, static, tiling]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 769285c9
system_scope: world
---

# Maxwell 6

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`maxwell_6.lua` is a static layout file used by the world generation system to define the visual and structural configuration of the Maxwell 6 level. It conforms to the Tiled map format (v1.1) and specifies tile-based background layers (`BG_TILES`) and object-based foreground placements (`FG_OBJECTS`). This file is not a component in the Entity Component System (ECS) but a map data definition consumed by the engine during level generation.

## Usage example
This file is not instantiated or used directly in modder code. It is referenced by the world generation task system, e.g., as part of a static layout in `map/tasksets/caves.lua` or `map/levels/caves.lua`.

## Dependencies & tags
**Components used:** None — this is a pure data file.
**Tags:** None — not an ECS component.

## Properties
No public properties — this is a data module returning a table literal.

## Main functions
Not applicable.

## Events & listeners
Not applicable.