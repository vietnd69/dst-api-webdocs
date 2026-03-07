---
id: four
title: Four
description: Defines the tile layout and object placement for the 'hallway_armoury' room variant 'four' in DST map generation.
tags: [map, procedural, room, static_layout]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 19fa2fe9
system_scope: world
---

# Four

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`four` is a static layout definition for a specific variant of the `hallway_armoury` room used in Don't Starve Together’s map generation. It specifies tile layer data (`BG_TILES`) and an object layer (`FG_OBJECTS`) containing placed entities, such as spawners. This file is consumed by the world generation system to assemble procedural rooms and is not an Entity Component System component — it is a pure data structure describing room geometry.

## Usage example
This file is not intended for direct instantiation or manual use. It is loaded automatically by the map generation system via `map/rooms/hallway_armoury.lua` or similar room loading logic.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties — this is a data-return file, not a component class.

## Main functions
Not applicable — this file returns a static table defining layout metadata and does not contain executable methods.

## Events & listeners
Not applicable — no event handling is present.