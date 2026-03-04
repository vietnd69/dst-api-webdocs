---
id: rabbithermit
title: Rabbithermit
description: Defines a static map layout for a rabbit-themed area containing placed objects (e.g., rabbit house, carrot plants, tools) using Tiled TMX format data.
tags: [map, static, layout, environment]
sidebar_position: 10
last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 0069c01c
system_scope: world
---
# Rabbithermit

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`rabbithermit` is a map layout definition expressed in Tiled TMX JSON-compatible Lua table format. It specifies a 16×16 tile-based grid with background tile data (`BG_TILES` layer) and a foreground object layer (`FG_OBJECTS`) containing placed prefabs such as `rabbithouse`, `carrot_planted`, `grass`, `pitchfork`, and `cavelight_tiny`. This file is used by the world generation system to instantiate a predefined environment in the game world — likely part of a special zone or event room.

This file does not implement a component for entities; it is a data definition used by the map system to spawn static content.

## Usage example
This file is not intended for direct instantiation or direct component usage. Instead, it is loaded by the map generation system, e.g. via `static_layouts.lua` or `roomloader.lua` as part of procedural room assignment or event setup.

No manual instantiation is required by modders.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties — this is a pure data file (a Lua table), not a component.

## Main functions
Not applicable — this file only exports a static Lua table. It contains no functions.

## Events & listeners
Not applicable.
