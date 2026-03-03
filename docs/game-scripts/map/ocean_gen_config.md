---
id: ocean_gen_config
title: Ocean Gen Config
description: Contains configuration parameters for procedural ocean tile generation, including depth thresholds, noise settings, and elevation mapping for ocean terrain blending.
tags: [world, generation, ocean, terrain, noise]
sidebar_position: 100

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: e2776ae1
---

# Ocean Gen Config

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This module defines a static configuration table `watergen` used during ocean terrain generation. It specifies parameters for depth-based water tiling, noise-based feature placement (e.g., coral, shipwrecks), elevation thresholds, and Gaussian blur settings for smooth transitions between ocean tile types. The configuration drives procedural ocean generation by controlling how raw heightmaps are interpreted and transformed into playable ocean tiles.

## Usage example

This file is a pure configuration module and is not instantiated as a component. It is returned as a table and typically imported by ocean generation scripts (e.g., `ocean_gen.lua`) to apply consistent rules for terrain generation.

```lua
local watergen = require "map/ocean_gen_config"

-- Example: Access a configuration value
local coral_threshold = watergen.init_level_coral

-- Example: Iterate elevation levels for custom logic
for _, ellevel in ipairs(watergen.ellevels) do
    local tile = ellevel[1]
    local elevation = ellevel[2]
    print(tile .. " has elevation threshold " .. tostring(elevation))
end
```

## Dependencies & tags

**Components used:** None identified.  
**Tags:** None identified.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `depthShallow` | `number` | `2` | Minimum depth for shallow water tile assignment. |
| `depthMed` | `number` | `0` | Minimum depth for medium water tile assignment. |
| `fillDepth` | `number` | `4` | Depth used for prefilling ocean tiles; increasing may impact performance. |
| `fillOffset` | `number` | `8` | Offset used in fill calculations (likely related to terrain padding). |
| `shallowRadius` | `number` | `4` | Radius (in tiles) for square-fill around shallow water features. |
| `mediumRadius` | `number` | `0` | Radius for square-fill around medium water features. |
| `ocean_prefill_setpieces_min_land_dist` | `number` | `5` | Minimum distance between landmass and ocean setpieces; must not be less than `shallowRadius`. |
| `noise_octave_water` | `number` | `6` | Number of octaves for water height noise. |
| `noise_octave_coral` | `number` | `4` | Number of octaves for coral distribution noise. |
| `noise_octave_grave` | `number` | `4` | Number of octaves for shipgrave (shipwreck) placement noise. |
| `noise_persistence_water` | `number` | `0.5` | Persistence (amplitude decay per octave) for water height noise. |
| `noise_persistance_coral` | `number` | `0.5` | Persistence for coral noise. Note: Typo in key name (`persistance` vs `persistence`) is preserved. |
| `noise_persistance_grave` | `number` | `0.5` | Persistence for shipgrave noise. |
| `noise_scale_water` | `number` | `3` | Scale (frequency) for water height noise — higher values yield smaller patches. |
| `noise_scale_coral` | `number` | `6` | Scale for coral noise. |
| `noise_scale_grave` | `number` | `18` | Scale for shipgrave noise. |
| `init_level_coral` | `number` | `0.65` | Threshold: noise value greater than this → coral tiles. |
| `init_level_medium` | `number` | `0.55` | Threshold: noise value greater than this → medium depth tiles. |
| `init_level_grave` | `number` | `0.65` | Threshold: noise value greater than this → shipgrave tiles. |
| `kernelSize` | `number` | `15` | Size (radius + 1) of the Gaussian blur kernel. |
| `sigma` | `number` | `3.0` | Standard deviation for Gaussian blur smoothing. |
| `ellevels` | `table` |见下文 | List of `{tile_type, elevation_threshold}` pairs used to construct the grayscale elevation map before blurring. |

### `ellevels`

An array of `{WORLD_TILES.X, elevation}` entries. Only active entries (uncommented) define elevation weights:

| Entry | Elevation | Description |
|-------|-----------|-------------|
| `{WORLD_TILES.OCEAN_BRINEPOOL, 1.0}` | `1.0` | Brine pool tile marked highest elevation (white). |
| `{WORLD_TILES.OCEAN_COASTAL, 0.9}` | `0.9` | Coastal ocean tile. |
| `{WORLD_TILES.OCEAN_SWELL, 0.4}` | `0.4` | Swell ocean tile. |
| `{WORLD_TILES.OCEAN_ROUGH, 0.0}` | `0.0` | Rough ocean tile (black). |
| `{WORLD_TILES.OCEAN_HAZARDOUS, 0.0}` | `0.0` | Hazardous ocean tile. |
| `{WORLD_TILES.IMPASSABLE, 0.0}` | `0.0` | Impassable terrain (non-ocean, excluded from water generation). |

## Main functions

None. This module returns a static configuration table and exports no functions.

## Events & listeners

None.