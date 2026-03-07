---
id: three
title: Three
description: Defines the layout and static geometry for the "three" hallway room used in world generation.
tags: [room, hallway, procedural, static_layout, map]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 28a9daf7
system_scope: world
---

# Three

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines a static room layout named "three" for use in DST’s procedural world generation system. It specifies the 2D tilemap grid, background tile placements (via layer `BG_TILES`), and foreground objects (via `FG_OBJECTS`), forming a pre-designed hallway segment. It does not contain logic code or entity behavior—it is purely declarative map data consumed by the game’s room placement and rendering systems.

## Usage example
This file is not intended for direct usage in mod code. It is automatically loaded by the world generation system when a room of this type is selected from the `taskset` definitions. For reference, the structure is typically included in room tasksets like `forest/rooms` or `cave/rooms`.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties. This file returns a Lua table conforming to Tiled map format (version 1.1), used as a data asset—not a functional component.

## Main functions
Not applicable. This is a data file, not a component or script with executable functions.

## Events & listeners
Not applicable.