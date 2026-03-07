---
id: two
title: Two
description: Defines the tilemap layout for a residential room in the caves, including background tiles and decorative foreground objects.
tags: [map, room, decoration]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: ae10c067
system_scope: world
---

# Two

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines a static room layout (`two.lua`) for the game's world generation system. It specifies the structure of a residential-style room in the caves using a Tiled map format: a 32x32 grid with 16x16 tiles for background layers and an object group for placing decorative foreground prefabs (e.g., `ruins_table`, `cave_banana_tree`). The layout uses hardcoded tile IDs and absolute object coordinates to position elements during world generation.

## Usage example
This file is not used directly in mod code. It is consumed internally by the worldgen system when generating caves. Modders typically do not interact with this file directly; instead, they create or modify room layouts by editing `.lua` files in `map/static_layouts/rooms/`.

```lua
-- This file is part of the static room definition system and is not instantiated by mod code.
-- Room layouts like this one are automatically loaded and applied by the map generator.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties. This module exports a plain Lua table containing map configuration data, not a component class.

## Main functions
Not applicable.

## Events & listeners
Not applicable.