---
id: nightmare
title: Nightmare
description: Defines a static map layout for the Nightmare scenario, specifying terrain tiles, objects, and entity spawn points.
tags: [world, environment, scenario, map]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 05b88de4
system_scope: world
---

# Nightmare

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file defines the `nightmare` static layout — a tilemap configuration used exclusively for the Nightmare scenario in Don't Starve Together. It specifies a 32×32 grid of 16×16 pixel tiles, one background tile layer (`BG_TILES`) containing visual terrain data, and one object group (`FG_OBJECTS`) describing interactive entities (campfires, firepits, grass, saplings, rabbitholes, torches, skeletons, a backpack with loot, and a spawn point). This layout is not a Lua component and does not implement ECS behavior — it is static world data loaded at runtime for the scenario.

## Usage example
This file is consumed internally by the game’s world generation system and is not instantiated or used directly in mod code. It is referenced by scenario scripts (e.g., in `scenarios/archive_cookpot.lua` or related nightmare event logic) to initialize the environment. Modders wishing to modify or extend it should edit this file directly or create a custom layout with a unique name.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties — this file returns a pure data structure (a Tiled JSON-like Lua table) and contains no Lua components or classes.

## Main functions
Not applicable.

## Events & listeners
Not applicable.