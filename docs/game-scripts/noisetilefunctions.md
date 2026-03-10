---
id: noisetilefunctions
title: Noisetilefunctions
description: Provides noise-based tile mapping functions used during world generation to assign tile types based on noise values.
tags: [worldgen, terrain, noise]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: e2118af2
system_scope: world
---

# Noisetilefunctions

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
This file defines a set of utility functions that map continuous noise values (typically from procedural noise generation) to discrete `WORLD_TILES` constants. These functions are used during world generation to determine which tile type should appear at a given location based on the local noise value. The file returns a table that indexes each noise type by its identifier (e.g., `WORLD_TILES.VENT_NOISE`) to its corresponding mapping function, plus a `default` entry for general use.

## Usage example
```lua
local noisetilefunctions = require("noisetilefunctions")

-- Get tile for a cave noise value
local tile = noisetilefunctions[WORLD_TILES.CAVE_NOISE](0.35)

-- Use the default mapping for ground
local ground_tile = noisetilefunctions.default(0.6)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties — this is a function-returning table, not a component.

## Main functions
The file exports only internal helper functions (not methods), which are invoked by world generation systems.

### `GetTileForVentNoise(noise)`
* **Description:** Maps noise values to `CAVE` or `VENT` tiles for vent regions.
* **Parameters:** `noise` (number) — a float value typically in `[0, 1]`.
* **Returns:** One of `WORLD_TILES.CAVE`, `WORLD_TILES.VENT`.
* **Error states:** Returns `WORLD_TILES.VENT` if `noise >= 0.35`; otherwise `WORLD_TILES.CAVE`.

### `GetTileForFungusMoonNoise(noise)`
* **Description:** Maps noise values to alternating `FUNGUS` and `FUNGUSMOON` tiles in the Fungus Moon biome.
* **Parameters:** `noise` (number) — a float value typically in `[0, 1]`.
* **Returns:** One of `WORLD_TILES.FUNGUS`, `WORLD_TILES.FUNGUSMOON`.
* **Error states:** Returns `WORLD_TILES.FUNGUS` for most values (`noise >= 0.65`); `FUNGUSMOON` appears in narrow bands (e.g., `[0.25, 0.35)`, `[0.45, 0.55)`).

### `GetTileForDirtNoise(noise)`
* **Description:** Maps noise values to `DIRT` or `DESERT_DIRT` tiles.
* **Parameters:** `noise` (number) — a float value typically in `[0, 1]`.
* **Returns:** One of `WORLD_TILES.DIRT`, `WORLD_TILES.DESERT_DIRT`.
* **Error states:** Returns `WORLD_TILES.DESERT_DIRT` if `noise >= 0.4`; otherwise `WORLD_TILES.DIRT`.

### `GetTileForAbyssNoise(noise)`
* **Description:** Maps noise values to `IMPASSABLE` or `CAVE` tiles for abyss regions.
* **Parameters:** `noise` (number) — a float value typically in `[0, 1]`.
* **Returns:** One of `WORLD_TILES.IMPASSABLE`, `WORLD_TILES.CAVE`.
* **Error states:** Returns `WORLD_TILES.IMPASSABLE` for `noise < 0.75` or `noise >= 0.85`; `WORLD_TILES.CAVE` in `[0.75, 0.85)`.

### `GetTileForCaveNoise(noise)`
* **Description:** Maps noise values to `IMPASSABLE`, `CAVE`, or `UNDERROCK` tiles for cave layers.
* **Parameters:** `noise` (number) — a float value typically in `[0, 1]`.
* **Returns:** One of `WORLD_TILES.IMPASSABLE`, `WORLD_TILES.CAVE`, `WORLD_TILES.UNDERROCK`.
* **Error states:** `IMPASSABLE` for low (`< 0.25`) or high (`>= 0.7`) noise; `CAVE` in `[0.25, 0.4)`; `UNDERROCK` in `[0.4, 0.7)`.

### `GetTileForFungusNoise(noise)`
* **Description:** Maps noise values to various ground tiles (`IMPASSABLE`, `MUD`, `DIRT`, `FUNGUS`, `UNDERROCK`) in the fungus biome.
* **Parameters:** `noise` (number) — a float value typically in `[0, 1]`.
* **Returns:** One of `WORLD_TILES.IMPASSABLE`, `WORLD_TILES.MUD`, `WORLD_TILES.DIRT`, `WORLD_TILES.FUNGUS`, `WORLD_TILES.UNDERROCK`.
* **Error states:** `IMPASSABLE` for `noise < 0.25` or `noise >= 0.65`; other tiles appear in distinct narrow ranges.

### `GetTileForMeteorCoastNoise(noise)`
* **Description:** Maps noise values to `PEBBLEBEACH` or `METEOR` tiles for meteor coast regions.
* **Parameters:** `noise` (number) — a float value typically in `[0, 1]`.
* **Returns:** One of `WORLD_TILES.PEBBLEBEACH`, `WORLD_TILES.METEOR`.
* **Error states:** Returns `WORLD_TILES.METEOR` for `noise` in `[0.55, 0.75)`; otherwise `PEBBLEBEACH`.

### `GetTileForMeteorMineNoise(noise)`
* **Description:** Maps noise values to `ROCKY`, `METEOR`, or `ROCKY` tiles in alternating bands for meteor mines.
* **Parameters:** `noise` (number) — a float value typically in `[0, 1]`.
* **Returns:** One of `WORLD_TILES.ROCKY`, `WORLD_TILES.METEOR`.
* **Error states:** `ROCKY` for `noise < 0.4` or `noise >= 0.8`; `METEOR` in `[0.4, 0.8)`.

### `GetTileForGroundNoise(noise)`
* **Description:** Default mapper for surface terrain, producing a gradient from `IMPASSABLE` to `MARSH`.
* **Parameters:** `noise` (number) — a float value typically in `[0, 1]`.
* **Returns:** One of `WORLD_TILES.IMPASSABLE`, `WORLD_TILES.ROAD`, `WORLD_TILES.ROCKY`, `WORLD_TILES.DIRT`, `WORLD_TILES.GRASS`, `WORLD_TILES.FOREST`, `WORLD_TILES.MARSH`.
* **Error states:** `MARSH` for `noise >= 0.75`; other tiles in narrow bands (e.g., `ROAD` only in `[0.26, 0.27)`).

## Events & listeners
Not applicable — this file defines pure utility functions and does not interact with the event system.