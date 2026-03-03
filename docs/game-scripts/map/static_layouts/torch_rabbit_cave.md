---
id: torch_rabbit_cave
title: Torch Rabbit Cave
description: Defines the static layout data for the torch rabbit cave map room using Tiled map format.
tags: [map, world, room, static_layout]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 1685b0f8
system_scope: world
---

# Torch Rabbit Cave

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file is a static layout definition for the "torch rabbit cave" map room. It is not a component, but rather a Lua table-based representation of a Tiled map JSON export (stored in Lua syntax). It describes the tile-based background layer (`BG_TILES`) and object placements (`FG_OBJECTS`) used by the world generation system to construct the cave environment. It contributes to the visual and structural layout of the torch rabbit cave room during world generation.

## Usage example
This file is not instantiated as an entity or component. It is loaded by the world generation system via `require("map/static_layouts/torch_rabbit_cave")` to retrieve layout data for room instantiation.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties — this is a data module returning a static layout table.

## Main functions
Not applicable.

## Events & listeners
Not applicable.