---
id: spider_blocker_b
title: Spider Blocker B
description: A static map layout configuration defining terrain tiles and dynamic spider den placements for a specific arena zone.
tags: [map, environment, spawn, arena]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 523c4cf7
system_scope: environment
---

# Spider Blocker B

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`spider_blocker_b` is a static map layout definition used to generate a predefined arena section in the game world. It contains a tile layer (`BG_TILES`) specifying the floor texture pattern (using tile IDs) and an object layer (`FG_OBJECTS`) that places environmental props (evergreen trees) and spider dens at specific coordinates. This file does not define a game component or entity system behavior—it is a data template consumed by the world generation system to instantiate static map content.

## Usage example
This file is not intended for direct use in mod code. It is loaded automatically during world generation when referenced by a static layout task or room definition. Example integration is handled internally by DST's `worldgen` system.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties. This file returns a plain Lua table conforming to the Tiled map format specification.

## Main functions
Not applicable.

## Events & listeners
Not applicable.