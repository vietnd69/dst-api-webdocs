---
id: maptags
title: Maptags
description: Provides a central registry of map-specific tags and spawner configurations used during level generation in DST's worldgen system.
tags: [map, worldgen, entity, tag]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: ef485b88
---

# Maptags

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

`maptags.lua` defines a static registry of map-related tags and conditional spawner templates used by DST's world generation system. It is not a component attached to entities, but rather a utility module that exports a function (`MakeTags`) returning two tables: `Tag` (a map of tag identifiers to generator functions) and `TagData` (a map of spawner names to boolean flags). These are consumed by the worldgen logic to dynamically assign tags or spawn static assets during map generation.

## Usage example

This module is typically used internally by the worldgen engine, but a typical usage pattern in custom worldgen logic might look like:

```lua
local MakeTags = require("maptags")
local tags = MakeTags()

-- Check if a spawner is available in TagData
if tags.TagData["Chester_Eyebone"] then
    -- Process spawner conditionally
end

-- Generate tag from a tag name and data
local tagtype, tagvalue = tags.Tag["Maze"]()
```

## Dependencies & tags

**Components used:** None — this module is self-contained and does not access any `inst.components.X` or add components.

**Tags:**  
The module produces or enables the following tags (either directly via `return "TAG", "..."` or via `"GLOBALTAG"` for world-wide tags):

- `Maze`, `MazeEntrance`, `Labyrinth`, `LabyrinthEntrance`, `OverrideCentroid`  
- `RoadPoison`, `ForceConnected`, `ForceDisconnected`, `OneshotWormhole`, `ExitPiece`  
- `Town`  
- `Chester_Eyebone`, `Hutch_Fishbowl`, `StagehandGarden`, `Terrarium_Spawner`, `CharlieStage_Spawner`, `Junkyard_Spawner`, `Balatro_Spawner`, `StatueHarp_HedgeSpawner`  
- `Astral_1`, `Astral_2`  
- `Nightmare`, `Atrium`, `Mist`, `sandstorm`, `nohunt`, `moonhunt`, `nohasslers`, `not_mainland`, `lunacyarea`, `GrottoWarEntrance`, `fumarolearea`  

Note: Some tag functions (e.g., `ExitPiece`) are commented out in the current build.

## Properties

No public properties are initialized in a class-like structure; this is a pure functional module. However, `MakeTags()` internally uses two static tables:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `map_data` | `table` | `Chester_Eyebone`, `Hutch_Fishbowl`, etc. → `true` | List of spawner keys used in worldgen (usually set to `true` during initial setup). |
| `Terrarium_Spawners` | `table` | `{"Terrarium_Forest_Spiders", "Terrarium_Forest_Pigs", "Terrarium_Forest_Fire"}` | Pool of spawner prefabs used by `Terrarium_Spawner`. |
| `map_tags` | `table` | Keys are tag identifiers, values are functions | Map from tag name (string) to a tag generator function. |

## Main functions

### `MakeTags()`
* **Description:** Constructs and returns the tag registry. Called once during worldgen initialization. Returns a table with two keys: `Tag` (function map) and `TagData` (boolean map).
* **Parameters:** None.
* **Returns:**  
  `table`:  
  - `.Tag`: `table<string, function>` — map of tag names to generator functions.  
  - `.TagData`: `table<string, boolean>` — map of spawner names (e.g., `"Chester_Eyebone"`) to their presence flag.
* **Error states:** None — returns a well-formed table in all cases.

Each generator function in `tags.Tag[name]` has the following general behavior:

### Generator function signature: `function(tagdata, level)`
* **Description:** Evaluates conditions and returns a tag specification (type and value) for worldgen. These are invoked by the worldgen engine when the map is being assembled.
* **Parameters:**
  * `tagdata` (`table`): Shared mutable state tracking spawner flags. Generator functions often set `tagdata[key] = false` to prevent re-spawning.
  * `level` (`?table`, optional): The level configuration, used to check `level.overrides` (e.g., `"never"`, `"always"`).
* **Returns:**  
  `nil` (if conditionally skipped), or  
  `string, string/number`: One of the following tuples:  
  - `("GLOBALTAG", name)` — applies a global-world tag  
  - `("TAG", name)` — applies a local entity/tag  
  - `("TAG", number)` — applies a bitmask tag (e.g., `Town` uses `0x000001`)  
  - `("ITEM", itemname)` — schedules an item to be spawned as a spawner  
  - `("STATIC", spawnername)` — schedules a static room/spawner to be placed  
* **Error states:**  
  - Returns `nil` if the spawner is already consumed (`tagdata[key] == false`)  
  - Returns `nil` if the world override (`level.overrides`) is set to `"never"`  
  - `math.random(#Terrarium_Spawners)` is used for `Terrarium_Spawner`; relies on non-empty array.

## Events & listeners

This module has no event listeners or event pushes — it is a static configuration factory, not tied to runtime entity behavior.