---
id: two
title: Two
description: Room layout definition for the 'armoury_two' static room used in world generation.
tags: [map, room, static_layout]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 137d823d
system_scope: world
---

# Two

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines the static layout for the `armoury_two` room in Don't Starve Together's world generation system. It is a TMX-formatted room template exported from Tiled map editor, containing background tile data and a set of object spawners placed within the room. It does not implement a component class; rather, it returns raw map data used by the worldgen system to instantiate room prefabs during map generation.

## Usage example
This file is not used directly as a component. It is loaded and processed by the world generation system, for example via `static_layouts/rooms/room_armoury_two.lua`, which loads and returns this file's table to define the layout of the room.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties — this file returns a raw map data table (not a component instance).

## Main functions
Not applicable.

## Events & listeners
Not applicable.