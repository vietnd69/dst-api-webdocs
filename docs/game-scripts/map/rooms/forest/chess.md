---
id: chess
title: Chess
description: Defines corruption-themed world rooms (ChessArea, MarbleForest, etc.) with randomized static layouts and prefab spawn probabilities for procedural map generation.
tags: [world, generation, room, corruption]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: e8ee9d7a
---

# Chess

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This file registers five corruption-themed world rooms using `AddRoom()` for procedural map generation in DST. Each room defines visual appearance (via `value` and `colour`), spatial coverage (`distributepercent`), and spawn rules for static layouts and prefabs. The "Chess" naming convention reflects the checkerboard terrain pattern and thematic association with chess pieces (knight, bishop, rook) and Maxwell-related static layouts. These rooms are intended for use in specific world types or scenarios where corruption and chess-themed aesthetics are desired.

## Usage example
This file is automatically loaded during world initialization and does not require manual instantiation. To use these rooms, reference them in a room taskset (e.g., via `AddRoomToTaskSet`) in world generation configuration files.

```lua
-- Example usage in a worldgen script (not part of this file)
AddRoomToTaskSet("FOREST", "ChessArea")
AddRoomToTaskSet("CAVES", "MarbleForest")
```

## Dependencies & tags
**Components used:** None — this file operates solely at the map generation level via `AddRoom()` and static utility functions.

**Tags:** Only one room (`ChessBarrens`) explicitly assigns tags: `ExitPiece`, `Chester_Eyebone`, `Astral_1`. Other rooms have no declared tags.

## Properties
This file does not define a component class or entity. It executes top-level `AddRoom()` calls during world generation setup. Therefore, no instance properties or constructor variables exist.

## Main functions
This file does not define any reusable functions. It exclusively contains calls to `AddRoom()`.

### `AddRoom(name, config)`
* **Description:** Registers a new room template for procedural map generation. Each room specifies its terrain type, visual tint, and spawn probabilities for static layouts and prefabs.
* **Parameters:**
  * `name` (`string`): Unique identifier for the room (e.g., `"ChessArea"`).
  * `config` (`table`): Room configuration table containing:
    * `colour`: `{r, g, b, a}` table for the room's visual tint.
    * `value`: `WORLD_TILES` constant defining the room's terrain pattern (e.g., `WORLD_TILES.CHECKER`).
    * `tags`: Optional list of tags assigned to the room (see example above).
    * `contents`: Table with:
      * `countstaticlayouts`: Map of static layout names to RNG functions returning the count to place.
      * `distributepercent`: Probability weight for this room type relative to others.
      * `distributeprefabs`: Map of prefab names to relative spawn probabilities.
* **Returns:** None. Registers the room with the world generation system.
* **Error states:** None documented; malformed `config` tables may cause runtime errors during world generation.

## Events & listeners
None.