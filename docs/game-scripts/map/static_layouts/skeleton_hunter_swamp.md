---
id: skeleton_hunter_swamp
title: Skeleton Hunter Swamp
description: A static layout map asset defining spawn positions for loot, structures, and environmental objects in the skeleton hunter swamp world area.
tags: [world, map, layout]
sidebar_position: 10
last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 1b356785
system_scope: world
---
# Skeleton Hunter Swamp

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file defines a static layout used for procedural world generation in the skeleton hunter swamp area of DST. It specifies background tile patterns (`BG_TILES`) and a collection of object placements (`FG_OBJECTS`), including items (e.g., `houndbone`, `houndstooth`, `spear`), entities (`skeleton`), and creature spawn points (`tentacle`, `beefalohat`). It is not an ECS component but a Tiled map export used by the world generation system to populate specific map regions.

## Usage example
This file is not instantiated or used directly by modders. It is loaded automatically by the worldgen system during map generation when referenced in a taskset or static layout configuration.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties  
*(This file returns raw map data; it contains no Lua component logic or instance properties.)*

## Main functions
Not applicable  
*(This file is a pure data definition, containing no executable functions.)*

## Events & listeners
Not applicable
