---
id: four
title: Four
description: Defines a static map layout using Tiled JSON data for a 32x32 tileroom with decorative background tiles and foreground objects.
tags: [world, map, room]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: cfd978ef
system_scope: world
---

# Four

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file is a static room layout definition used in the DST world generation system. It specifies a square room (32 tiles by 32 tiles) with fixed tile placement for background layers (`BG_TILES`) and object placements (`FG_OBJECTS`). It is consumed by the worldgen system to instantiate rooms during map generation, not by ECS components or runtime entities. The room contains sparse decorative elements — specifically, a few "pig torch" objects placed at grid-aligned coordinates.

## Usage example
This file is loaded by the world generation system internally and not instantiated directly by modders. It is referenced as part of room templates in tasksets or static layouts.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties — this is a pure data file returning a table conforming to the Tiled map format.

## Main functions
Not applicable.

## Events & listeners
Not applicable.