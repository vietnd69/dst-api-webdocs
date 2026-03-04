---
id: retrofit_moonisland_small
title: Retrofit Moonisland Small
description: Defines the static layout and worldgen data for a small Moon Island map using Tiled map format.
tags: [world, map, environment, worldgen]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 85ce2ad8
system_scope: world
---

# Retrofit Moonisland Small

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file describes a static map layout for a Moon Island scene in DST, stored in Tiled map format (v1.1). It defines a 18×18 tile grid with ground tile data (`BG_TILES`) and multiple object groups (`FG_OBJECTS`, `FG_OBJECTS_FOREST`, `FG_OBJECTS_BEACH`, `FG_OBJECTS_MINE`, `FG_OBJECTS_CREATURES`) specifying placements of in-game prefabs like `moon_fissure`, `hotspring`, `sapling_moon`, `rock_avocado_bush`, `trap_starfish`, `driftwood_small1`, `moonspiderden`, `fruitdragon`, and others. The file is self-contained and does not require external references or component instantiation at runtime.

## Usage example
Not applicable. This file is a map definition used by the worldgen system and not intended for direct programmatic use by modders. It is loaded and processed by the game engine during level setup.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties. This file returns a plain Lua table describing map metadata and layers.

## Main functions
Not applicable. No functional methods are defined; this is a data-only module.

## Events & listeners
Not applicable.