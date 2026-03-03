---
id: dev_graveyard
title: Dev Graveyard
description: A static world layout defining decorative and narrative elements for a developer graveyard area, including named gravestones, statues, trees, pillars, and evil flowers.
tags: [world, static, environment]
sidebar_position: 1

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: 3a5a4207
system_scope: world
---

# Dev Graveyard

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file defines a static Tiled map layout (`dev_graveyard.lua`) used to place decorative and thematically consistent world objects in a developer graveyard area. It is not a component in the Entity Component System; rather, it is a data structure (Lua table) representing an isometric tilemap. The map contains two layers: a background tile layer (`BG_TILES`) with simple paving tiles and an object group (`FG_OBJECTS`) containing named gravestones with epitaph properties, statues, evergreen trees (standard/short), marble pillars, shovels, and evil flowers. One gravestone (`Kevin`) includes a scenario property (`graveyard_ghosts`), indicating special runtime behavior may be triggered in that context.

## Usage example
This file is not instantiated as a component on an entity. Instead, it is consumed by the game’s map loader to spawn world objects during world generation. An example of how such a layout file is typically loaded and applied is not shown here, as it resides in internal worldgen logic. Modders should not directly call or modify this file’s contents programmatically; instead, they may create their own static layout files in `map/static_layouts/` and reference them in worldgen tasksets or room definitions.

## Dependencies & tags
**Components used:** None (this file is pure data, not an ECS component).
**Tags:** None identified.

## Properties
No public properties are accessible via ECS component interfaces, as this file is not a component. The returned table is a raw Tiled JSON-compatible structure populated at load time.

## Main functions
No callable functions exist in this file. It returns a single static Lua table.

## Events & listeners
No events are defined, listened to, or pushed by this file.