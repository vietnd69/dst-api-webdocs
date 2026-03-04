---
id: skeleton_notplayer
title: Skeleton Notplayer
description: A static map layout file defining the placement of background tiles and foreground objects (including skeleton entities and ambient elements) for a non-player skeleton scene.
tags: [map, static_layout, level_design]
sidebar_position: 10
last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 30dd8c07
system_scope: world
---
# Skeleton Notplayer

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file is a Tiled map layout used in the DST world generation system. It defines a static, non-procedural room layout for spawning a specific scene involving non-player skeletons (`skeleton_notplayer_1`, `skeleton_notplayer_2`), ambient silk placements, and a small cave light. It contains only tile layer and object group data, with no Lua logic or components — meaning it is purely a data file consumed by the world generation system to place prefabs in the game world.

## Usage example
This file is not instantiated or used directly in Lua code. Instead, it is referenced indirectly by world generation tasks (e.g., in `map/tasks/caves.lua`) via room placement logic, where it is loaded as a static layout to populate a region of the world.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties.

## Main functions
Not applicable — this file is a pure data structure (a Lua table) representing a static map layout and contains no executable functions.

## Events & listeners
None identified.
