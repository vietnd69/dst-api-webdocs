---
id: noisetilefunctions
title: Noise Tile Functions
description: Functions for converting noise values to specific world tile types in Don't Starve Together
sidebar_position: 5

last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Noise Tile Functions

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `noisetilefunctions` module provides a collection of noise-to-tile conversion functions used in world generation. These functions take noise values (typically between 0 and 1) and return appropriate `WORLD_TILES` constants based on predefined thresholds, enabling procedural terrain generation for different biome types.

## Usage Example

```lua
-- Access the noise tile function mapping
local noisetilefunctions = require("noisetilefunctions")

-- Get a specific conversion function
local groundConverter = noisetilefunctions[WORLD_TILES.GROUND_NOISE]

-- Convert noise value to tile type
local noise_value = 0.3
local tile_type = groundConverter(noise_value)
-- Result: WORLD_TILES.ROCKY

-- Use default converter for unknown noise types
local defaultConverter = noisetilefunctions.default
local default_tile = defaultConverter(0.6)
-- Result: WORLD_TILES.FOREST
```

## Noise Conversion Functions

### GetTileForFungusMoonNoise(noise) {#get-tile-for-fungus-moon-noise}

**Status:** `stable`

**Description:**
Converts noise values to fungus and fungusmoon tile types with alternating patterns for moon-influenced fungal areas.

**Parameters:**
- `noise` (number): Noise value between 0 and 1

**Returns:**
- (WORLD_TILES): `WORLD_TILES.FUNGUS` or `WORLD_TILES.FUNGUSMOON`

**Noise Thresholds:**
- `< 0.25`: FUNGUS
- `0.25-0.35`: FUNGUSMOON  
- `0.35-0.4`: FUNGUS
- `0.4-0.45`: FUNGUSMOON
- `0.45-0.55`: FUNGUS
- `0.55-0.65`: FUNGUSMOON
- `>= 0.65`: FUNGUS

**Example:**
```lua
local converter = noisetilefunctions[WORLD_TILES.FUNGUSMOON_NOISE]
local tile1 = converter(0.1)   -- WORLD_TILES.FUNGUS
local tile2 = converter(0.3)   -- WORLD_TILES.FUNGUSMOON
local tile3 = converter(0.6)   -- WORLD_TILES.FUNGUSMOON
```

### GetTileForDirtNoise(noise) {#get-tile-for-dirt-noise}

**Status:** `stable`

**Description:**
Converts noise values to dirt-based tile types for surface terrain generation.

**Parameters:**
- `noise` (number): Noise value between 0 and 1

**Returns:**
- (WORLD_TILES): `WORLD_TILES.DIRT` or `WORLD_TILES.DESERT_DIRT`

**Noise Thresholds:**
- `< 0.4`: DIRT
- `>= 0.4`: DESERT_DIRT

**Example:**
```lua
local converter = noisetilefunctions[WORLD_TILES.DIRT_NOISE]
local tile1 = converter(0.2)   -- WORLD_TILES.DIRT
local tile2 = converter(0.8)   -- WORLD_TILES.DESERT_DIRT
```

### GetTileForAbyssNoise(noise) {#get-tile-for-abyss-noise}

**Status:** `stable`

**Description:**
Converts noise values to abyss-related tile types, primarily creating impassable terrain with small cave areas.

**Parameters:**
- `noise` (number): Noise value between 0 and 1

**Returns:**
- (WORLD_TILES): `WORLD_TILES.IMPASSABLE` or `WORLD_TILES.CAVE`

**Noise Thresholds:**
- `< 0.75`: IMPASSABLE
- `0.75-0.85`: CAVE
- `>= 0.85`: IMPASSABLE

**Example:**
```lua
local converter = noisetilefunctions[WORLD_TILES.ABYSS_NOISE]
local tile1 = converter(0.5)   -- WORLD_TILES.IMPASSABLE
local tile2 = converter(0.8)   -- WORLD_TILES.CAVE
```

### GetTileForCaveNoise(noise) {#get-tile-for-cave-noise}

**Status:** `stable`

**Description:**
Converts noise values to cave terrain types, creating a mix of passable cave areas, underground rock, and impassable barriers.

**Parameters:**
- `noise` (number): Noise value between 0 and 1

**Returns:**
- (WORLD_TILES): `WORLD_TILES.IMPASSABLE`, `WORLD_TILES.CAVE`, or `WORLD_TILES.UNDERROCK`

**Noise Thresholds:**
- `< 0.25`: IMPASSABLE
- `0.25-0.4`: CAVE
- `0.4-0.7`: UNDERROCK
- `>= 0.7`: IMPASSABLE

**Example:**
```lua
local converter = noisetilefunctions[WORLD_TILES.CAVE_NOISE]
local tile1 = converter(0.1)   -- WORLD_TILES.IMPASSABLE
local tile2 = converter(0.3)   -- WORLD_TILES.CAVE
local tile3 = converter(0.5)   -- WORLD_TILES.UNDERROCK
```

### GetTileForFungusNoise(noise) {#get-tile-for-fungus-noise}

**Status:** `stable`

**Description:**
Converts noise values to fungal biome tile types, creating diverse underground fungal terrain.

**Parameters:**
- `noise` (number): Noise value between 0 and 1

**Returns:**
- (WORLD_TILES): Various tile types including `IMPASSABLE`, `MUD`, `DIRT`, `FUNGUS`, and `UNDERROCK`

**Noise Thresholds:**
- `< 0.25`: IMPASSABLE
- `0.25-0.35`: MUD
- `0.35-0.4`: DIRT
- `0.4-0.45`: FUNGUS
- `0.45-0.55`: DIRT
- `0.55-0.65`: UNDERROCK
- `>= 0.65`: IMPASSABLE

**Example:**
```lua
local converter = noisetilefunctions[WORLD_TILES.FUNGUS_NOISE]
local tile1 = converter(0.3)   -- WORLD_TILES.MUD
local tile2 = converter(0.42)  -- WORLD_TILES.FUNGUS
local tile3 = converter(0.6)   -- WORLD_TILES.UNDERROCK
```

### GetTileForMeteorCoastNoise(noise) {#get-tile-for-meteor-coast-noise}

**Status:** `stable`

**Description:**
Converts noise values to meteor coast terrain, creating areas with meteor impact sites along coastlines.

**Parameters:**
- `noise` (number): Noise value between 0 and 1

**Returns:**
- (WORLD_TILES): `WORLD_TILES.PEBBLEBEACH` or `WORLD_TILES.METEOR`

**Noise Thresholds:**
- `< 0.55`: PEBBLEBEACH
- `0.55-0.75`: METEOR
- `>= 0.75`: PEBBLEBEACH

**Example:**
```lua
local converter = noisetilefunctions[WORLD_TILES.METEORCOAST_NOISE]
local tile1 = converter(0.3)   -- WORLD_TILES.PEBBLEBEACH
local tile2 = converter(0.6)   -- WORLD_TILES.METEOR
```

### GetTileForMeteorMineNoise(noise) {#get-tile-for-meteor-mine-noise}

**Status:** `stable`

**Description:**
Converts noise values to meteor mining terrain, creating alternating patterns of rocky and meteor tile areas.

**Parameters:**
- `noise` (number): Noise value between 0 and 1

**Returns:**
- (WORLD_TILES): `WORLD_TILES.ROCKY` or `WORLD_TILES.METEOR`

**Noise Thresholds:**
- `< 0.4`: ROCKY
- `0.4-0.6`: METEOR
- `0.6-0.8`: ROCKY
- `>= 0.8`: METEOR

**Example:**
```lua
local converter = noisetilefunctions[WORLD_TILES.METEORMINE_NOISE]
local tile1 = converter(0.2)   -- WORLD_TILES.ROCKY
local tile2 = converter(0.5)   -- WORLD_TILES.METEOR
local tile3 = converter(0.9)   -- WORLD_TILES.METEOR
```

### GetTileForGroundNoise(noise) {#get-tile-for-ground-noise}

**Status:** `stable`

**Description:**
Converts noise values to general surface terrain types, creating diverse overworld biomes. This is also used as the default conversion function.

**Parameters:**
- `noise` (number): Noise value between 0 and 1

**Returns:**
- (WORLD_TILES): Various surface tile types

**Noise Thresholds:**
- `< 0.25`: IMPASSABLE
- `0.25-0.26`: ROAD
- `0.26-0.35`: ROCKY
- `0.35-0.4`: DIRT
- `0.4-0.5`: GRASS
- `0.5-0.75`: FOREST
- `>= 0.75`: MARSH

**Example:**
```lua
local converter = noisetilefunctions[WORLD_TILES.GROUND_NOISE]
-- or use the default converter
local defaultConverter = noisetilefunctions.default

local tile1 = converter(0.1)   -- WORLD_TILES.IMPASSABLE
local tile2 = converter(0.45)  -- WORLD_TILES.GRASS
local tile3 = converter(0.6)   -- WORLD_TILES.FOREST
local tile4 = converter(0.8)   -- WORLD_TILES.MARSH
```

## Module Structure

The module returns a table that maps `WORLD_TILES` noise constants to their corresponding conversion functions:

```lua
{
    [WORLD_TILES.FUNGUSMOON_NOISE] = GetTileForFungusMoonNoise,
    [WORLD_TILES.DIRT_NOISE] = GetTileForDirtNoise,
    [WORLD_TILES.ABYSS_NOISE] = GetTileForAbyssNoise,
    [WORLD_TILES.CAVE_NOISE] = GetTileForCaveNoise,
    [WORLD_TILES.FUNGUS_NOISE] = GetTileForFungusNoise,
    [WORLD_TILES.METEORCOAST_NOISE] = GetTileForMeteorCoastNoise,
    [WORLD_TILES.METEORMINE_NOISE] = GetTileForMeteorMineNoise,
    [WORLD_TILES.GROUND_NOISE] = GetTileForGroundNoise,
    default = GetTileForGroundNoise,
}
```

## Usage in World Generation

These functions are typically used in the world generation pipeline where noise maps are converted to actual terrain tiles:

```lua
-- Example world generation usage
local noisetilefunctions = require("noisetilefunctions")

function ConvertNoiseToTiles(noise_map, noise_type)
    local converter = noisetilefunctions[noise_type] or noisetilefunctions.default
    local tile_map = {}
    
    for i, noise_value in ipairs(noise_map) do
        tile_map[i] = converter(noise_value)
    end
    
    return tile_map
end

-- Convert fungus moon noise to tiles
local fungus_tiles = ConvertNoiseToTiles(fungus_noise_data, WORLD_TILES.FUNGUSMOON_NOISE)
```

## Related Modules

- [Constants](./constants.md): Contains `WORLD_TILES` definitions used by these functions
- [Map Generation](../map/): World generation systems that utilize these noise conversion functions
- [World Settings](./config.md): Configuration options that may affect terrain generation
