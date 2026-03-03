---
id: one
title: One
description: Provides Tiled map data for the Pit Room Armoury layout used in world generation.
tags: [map, static_layout, generation]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 0275a89a
system_scope: world
---

# One

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines a static map layout for the "pit_room_armoury" room, expressed in Tiled JSON format. It specifies a 32x32 tile grid using 64x64px tiles and contains two layers: a background tile layer (`BG_TILES`) and an object group (`FG_OBJECTS`) that declares spawn points for various room contents. The data is used by the world generation system to procedurally place and render this specific room variant during world setup.

## Usage example
This file is loaded and processed internally by the engine's map loader and is not intended for direct manual instantiation. It is referenced as part of the `static_layouts` system during room generation, for example via `static_layouts/rooms/pit_room_armoury/load.lua` or similar loader scripts.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties — this file returns a plain Lua table describing Tiled map data.

## Main functions
Not applicable.

## Events & listeners
Not applicable.