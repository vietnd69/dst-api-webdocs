---
id: trap_forceinsane
title: Trap Forceinsane
description: A static map layout file defining tile-based background patterns and object placements for a game environment.
tags: [map, level_design]
sidebar_position: 10
last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 9fff127c
system_scope: world
---
# Trap Forceinsane

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`trap_forceinsane.lua` is a Tiled map data file used to define a static world layout. It specifies tile-based background patterns (`BG_TILES`) and object placements (`FG_OBJECTS`) via object groups — commonly used in level generation to lay out scenery, obstacles, or interactive elements in the game world. Unlike typical entity components, this file is not an ECS component but rather serialized map data consumed by the worldgen system.

## Usage example
This file is not used directly by modders; it is loaded by the engine during world generation. It defines static content (e.g., floor tiles and "flower_evil" placements) and is referenced indirectly via worldgen tasksets or level templates. Modders typically work with higher-level levelgen APIs (`tasks/caves.lua`, `levels/`, `rooms/`) rather than editing such raw tilemaps.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties. This file returns a raw Lua table with Tiled-compatible metadata (map dimensions, tilesets, layers). No component instantiation or ECS properties are present.

## Main functions
Not applicable.

## Events & listeners
Not applicable.
