---
id: monkeyisland_worldgen
title: Monkeyisland Worldgen
description: Generates dock systems and associated assets for monkey islands during world generation.
tags: [worldgen, map, island, dock, procedural]
sidebar_position: 100
last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 808204d2
---
# Monkeyisland Worldgen

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This file provides procedural world generation logic for monkey islands in DST, specifically handling the creation of docks extending from the island into the ocean. It ensures docks grow only in valid directions (toward open water), avoid land bridges, respect safe area bounds, and spawn optional decor or functional assets (e.g., posts, huts, cannons). It does not function as a standard ECS component but is a standalone procedural module invoked during world generation. It relies on utility modules (`prefabutil`, `maputil`, `vecutil`, `datagrid`) and global constants like `TILE_SCALE`, `WORLD_TILES`, and `TUNING` values.

## Usage example

Typical usage is internal to DST's world generation flow. To manually trigger dock generation for a monkey island, call:

```lua
require "maputil"
require "map/monkeyisland_worldgen"

-- Assume world, entities, width, height are already initialized
MonkeyIsland_GenerateDocks(world, entities, width, height)
```

The function modifies the `world` tile map and populates the `entities` table with dock-related prefabs at generated coordinates.

## Dependencies & tags
**Components used:** None. This script does not interact with entity components; it is a pure procedural generator.

**Tags:** None identified.

## Properties

No persistent properties exist on this module. All state is held in local variables within the `GenerateDocks` and `MonkeyIsland_GenerateDocks` functions and is scoped per invocation.

## Main functions

### `GenerateDocks(world, entities, map_width, map_height, prefabs_data)`
* **Description:** Generates a network of docks around a monkey island based on provided configuration. Dock segments start from randomly selected edge points and recursively branch toward the ocean while avoiding land bridges. It also spawns optional decor and endpoint assets.
* **Parameters:**
  - `world`: Table implementing `GetTile(x, z)` and `SetTile(x, z, tile_type)`. Represents the world tilemap.
  - `entities`: Table where generated entity positions are appended by prefab name (e.g., `entities["dock_woodposts"] = \{{x, z}, ...}\`).
  - `map_width`: Integer number of tiles horizontally.
  - `map_height`: Integer number of tiles vertically.
  - `prefabs_data`: Table with keys:
    - `center_prefab`: String name of the center marker prefab (used for orientation).
    - `direction_prefab`: String name of the direction marker prefab.
    - `safety_prefab`: String name of the safe-area bounds marker.
    - `dock_post_chance`: Number (0.0 to 1.0) chance per dock tile to spawn a wood post.
    - `dock_prefabs_withchance`: Optional table mapping prefab names to spawn probabilities (`sum <= 1.0`).
    - `endpoint_prefabs_with_chance`: Optional table mapping endpoint-specific prefab names to probabilities (must `sum <= 1.0`).
* **Returns:** Nothing. Modifies `world` and `entities` in-place.
* **Error states:** Fails silently if required prefabs (center, direction, safety) are missing or not paired 1-to-1. Docks may not generate if no valid starting ocean tiles are found.

### `MonkeyIsland_GenerateDocks(world, entities, map_width, map_height)`
* **Description:** Convenience wrapper for `GenerateDocks` using the preconfigured monkey island asset set.
* **Parameters:** Same as `GenerateDocks`, except `prefabs_data` is omitted.
* **Returns:** Nothing.
* **Error states:** Same as `GenerateDocks`. Internally uses `MONKEYISLAND_PREFABSDATA`, including defaults: 40% post spawn chance, 0.06 chance for `monkeyhut`, 0.03 for `pirate_flag_pole`, and `boat_cannon` per `TUNING.MONKEYISLANDGEN_CANNONCHANCE`.

### `generate_starting_points(center_x, center_z, direction_entity)`
* **Description:** Locates candidate dock start points on the island's perimeter that lie in the ocean and are not adjacent to existing docks. Returns a list of start descriptors.
* **Parameters:**
  - `center_x`, `center_z`: Float world-space coordinates for the island center.
  - `direction_entity`: Table with `x` and `z` (world-space) indicating the island’s orientation (e.g., where “land” is relative to the center).
* **Returns:** Array of tables with keys `{x, z, is_on_x, dir, orientation}`, where:
  - `x`, `z`: Grid-space coordinates of the starting ocean tile.
  - `is_on_x`: Boolean indicating axis of growth.
  - `dir`: Integer step direction (-1 or 1).
  - `orientation`: String `"left"`, `"right"`, `"up"`, or `"down"` indicating major growth direction.
* **Error states:** Retries up to `TUNING.MONKEYISLANDGEN_DOCKAMOUNT` times; failures may reduce the actual number of docks generated if valid ocean tiles are unavailable.

### `GenBranch(orientation, start_x, start_z, is_on_x, dir, min_length, max_length, branch_chance_r, branch_chance_l)`
* **Description:** Recursively extends a dock segment from a starting ocean tile, optionally creating left/right sub-branches. Marks tiles as `WORLD_TILES.MONKEY_DOCK`, registers underytile data, and potentially spawns decor prefabs per tile.
* **Parameters:**
  - `orientation`: String direction constraint (`"left"`, `"right"`, `"up"`, `"down"`).
  - `start_x`, `start_z`: Grid-space coordinates where the branch begins.
  - `is_on_x`: Boolean; `true` if growth is along the X axis, else Z axis.
  - `dir`: Integer step direction (-1 or 1) along the primary axis.
  - `min_length`, `max_length`: Integer min/max dock segment length.
  - `branch_chance_r`, `branch_chance_l`: Numbers (0.0–1.0) for right/left branch probabilities (default `0.25` each).
* **Returns:** Nothing.
* **Error states:** Branch terminates early if:
  - `min_length` drops below `1`.
  - Next tile falls outside safe dock range.
  - Next tile is not ocean.
  - Adjacent tiles would form a land bridge.
  - Direction violates orientation constraint (e.g., growing left while orientation is `"left"`).
  Endpoint tiles are marked in `GENERATED_DOCK_LIST` for endpoint-specific asset checks.

### `try_make_post(tile_x, tile_z, offx, offz, chance)`
* **Description:** Conditionally spawns dock wood posts adjacent to a dock tile (inward offset to ensure accurate tile sampling by `dockmanager`).
* **Parameters:**
  - `tile_x`, `tile_z`: Grid-space dock tile coordinates.
  - `offx`, `offz`: Integer offsets (±1) for post placement (N/S/E/W).
  - `chance`: Number (0.0–1.0) spawn probability.
* **Returns:** Nothing. Appends to `ENTITIES["dock_woodposts"]` on success.

### `ValidateSurroundingTiles(x, z)`
* **Description:** Ensures no adjacent tile (including diagonals) is ocean or monkey dock, preventing accidental land bridges between islands.
* **Parameters:**
  - `x`, `z`: Grid-space coordinates to validate.
* **Returns:** `true` if safe; `false` if any adjacent tile is ocean or dock.
* **Error states:** Recursively initializes `TESTED_TILES` rows on demand.

### `IsPointInSafeDockRange(x, z)`
* **Description:** Checks whether a grid tile lies within the safe dock generation bounds defined by the safety prefabs.
* **Parameters:**
  - `x`, `z`: Grid-space coordinates.
* **Returns:** `true` if `DOCK_SAFETY_MINX < x < DOCK_SAFETY_MAXX` and `DOCK_SAFETY_MINZ < z < DOCK_SAFETY_MAXZ`.

## Events & listeners
This module is invoked during world generation and does not register or fire events.

