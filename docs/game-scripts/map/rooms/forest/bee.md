---
id: bee
title: Bee
description: Defines forest room templates for bee-related biomes, including standard bee clearings and queen bee nests, specifying tile type, colour, and prefab spawn rules.
tags: [room, forest, bee, worldgen, map]
sidebar_position: 1
last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 2c484308
---
# Bee

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This file registers two map room templates—`BeeClearing` and `BeeQueenBee`—for the Forest biome. These templates are used during world generation to place specialized bee-themed clearings with predefined sets and probabilities of prefabs. The room definitions include visual properties (tile colour and transparency), tile value (`WORLD_TILES.GRASS`), and content generation rules such as fixed `countprefabs` and probabilistic `distributeprefabs`.

The file contributes to the procedural map layout system by extending the set of available forest rooms with ecologically distinct zones featuring bees and hives.

## Usage example

Room templates registered in this file are automatically consumed by the world generator when the forest map generation process selects a `bee`-themed room. No direct usage is required by modders outside of altering or extending the room definitions via `AddRoom`.

```lua
-- Example of how the world generator internally uses a registered room (not user code)
-- This is illustrative only; room logic is invoked internally by DST's map generation system.
local room = GetRoomTemplate("BeeClearing")
worldgen:PlaceRoom(room, position)
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
This file does not define a component; it registers room templates. Therefore, no properties table applies.

## Main functions
This file does not define a component; it uses the `AddRoom` global function to register room templates.

## Events & listeners
This file does not define a component; no events or listeners are associated.

