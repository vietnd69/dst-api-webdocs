---
id: terrain_grass
title: Terrain Grass
description: Defines forest floor terrain room templates for procedural world generation, including grassland variants with randomized vegetation and structures.
tags: [world, procedural, map, generation]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 5ea35030
system_scope: world
---

# Terrain Grass

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file registers five distinct forest floor terrain room templates using `AddRoom`. Each template defines a room with specific visual appearance, tile value, tags, and spawn rules for flora and small structures. These rooms are used by the world generation system to populate forest areas with natural ground cover and minor environmental features. The component has no associated ECS component class; it solely serves as a data definition for map room layouts.

## Usage example
This file is loaded during world generation initialization and is not meant for manual instantiation. Example usage occurs internally in DST's map generation system:
```lua
-- The following is illustrative of how the engine consumes these definitions
local room = GetRoomTemplate("BGGrass")
room:PlaceAt(x, y)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds room-level tags including `ExitPiece`, `Chester_Eyebone`, `Astral_1`, `Astral_2`, `StagehandGarden`, `StatueHarp_HedgeSpawner`, and `CharlieStage_Spawner`, depending on the room type.

## Properties
No public properties. This file defines room templates via `AddRoom` calls, which register static data structures used by the world generator.

## Main functions
This file contains no standalone functions; it is a declarative configuration script.

## Events & listeners
None identified
