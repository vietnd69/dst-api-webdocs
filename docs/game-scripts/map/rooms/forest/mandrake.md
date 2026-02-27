---
id: mandrake
title: Mandrake
description: Registers a custom forest room (MandrakeHome) that occasionally spawns a mandrake_planted prefab among natural flora and structures.
tags: [room, worldgen, forest, spawn, flora]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 1459bd42
---

# Mandrake

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This file defines a custom forest room named `MandrakeHome` using `AddRoom`. It specifies visual and spatial properties for the room—including background tint (`colour`), underlying terrain (`value`), and spawn rules for contents. The room is designed to host a single `mandrake_planted` instance while populate surrounding space with typical forest flora (e.g., grass, bushes, trees, fireflies). The `countstaticlayouts` entry also allows rare placement of `InsanePighouse` as a static layout.

The component does not represent a modifiable entity behavior, but rather a world-generation directive for map room assignment.

## Usage example
This component is not instantiated on entities; instead, it declares a room definition used internally by the world generator. A typical usage pattern (in a mod `main.lua` or alike) would be:

```lua
require("map/rooms/forest/mandrake")
```

After loading, any `roomtask` referencing `"MandrakeHome"` may randomly select this room layout during world generation, with its contents governed by the defined rules.

## Dependencies & tags
**Components used:** None — this script only uses the global `AddRoom` function.
**Tags:** None — no entity tags are added or modified by this file.

## Properties
This file does not define a class or component with properties; it invokes a single top-level function with a single static configuration table. No persistent instance-level data exists.

## Main functions
No functions are defined in this script.

### `AddRoom(room_name, room_def)`
* **Description:** Registers a named room definition for use in world generation. The provided `room_def` table configures how the room appears and what it contains.
* **Parameters:**
  * `room_name` (`string`): Unique identifier for the room (e.g., `"MandrakeHome"`).
  * `room_def` (`table`): Configuration table containing:
    * `colour` (`{r: number, g: number, b: number, a: number}`): RGBA tint applied to the room's background.
    * `value` (`WORLD_TILES` constant): Base terrain type for the room (e.g., `WORLD_TILES.GRASS`).
    * `contents`: Nested table specifying spawn rules:
      * `countstaticlayouts`: `table<string, () => number>`. Each key is a static layout name; the function returns `1` (spawn) or `0` (skip). Here, `InsanePighouse` spawns with ~0.5% probability.
      * `countprefabs`: `table<string, number>`. Maps prefab names to fixed counts (here, `mandrake_planted` count is 1).
      * `distributepercent` (`number`): Probability of applying distributed prefabs (here, 20%).
      * `distributeprefabs`: `table<string, number>`. Maps prefabs to weights used for probabilistic selection. e.g., `flower = 4` is four times more likely than `fireflies = 0.3`.
* **Returns:** `nil` — only registers the room; no return value.
* **Error states:** No returnable errors; misuse (e.g., invalid table structure) may cause runtime generation failures or warnings.

## Events & listeners
No events or listeners are defined or used in this file.