---
id: three
title: Three
description: A static map layout file defining the pit_room_armoury room configuration using Tiled map data.
tags: [map, room, layout]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 8ef75282
system_scope: world
---

# Three

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines a static layout for the `pit_room_armoury` room in the game world using Tiled map format. It specifies tile layer data (`BG_TILES`) for background tile placement and an object group (`FG_OBJECTS`) containing world entities such as `nightmarelight`, `rook_nightmare_spawner`, and `chessjunk_spawner`. It is used by the world generation system to spawn pre-defined room layouts.

## Usage example
This file is not intended for direct usage in mod code. It is loaded by the world generation system as part of `static_layouts/` room definitions.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
Not applicable — this file returns a pure data structure (a table) and contains no executable functions.

## Events & listeners
None identified