---
id: worldtiledefs
title: Worldtiledefs
description: Defines ground tile properties, wall configurations, and footstep sound logic for terrain-based audio and visual effects.
tags: [terrain, audio, map, config]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: root
source_hash: 5bfe43d8
system_scope: environment
---

# Worldtiledefs

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`worldtiledefs.lua` is a data configuration file that defines terrain tile properties, wall types, and footstep sound playback logic. It provides helper functions to cache tile information for performance, lookup tile data by type, and play context-aware footstep sounds based on ground type, creature size, and movement state. The file returns a table containing tile property arrays, asset lists, and initialization functions used by the world generation and audio systems.

## Usage example
```lua
local WorldTileDefs = require "worldtiledefs"

-- Initialize tile cache (called once during world setup)
WorldTileDefs.Initialize()

-- Get cached tile info for a ground type (global function, not via module)
local tileinfo = GetTileInfo(GROUND.GRASS)
print(tileinfo.name) -- e.g., "grass"

-- Legacy lookup (slower, use GetTileInfo instead; global function)
local legacyinfo = LookupTileInfo(GROUND.GRASS)
```

## Dependencies & tags
**External dependencies:**
- `constants` -- provides GROUND tile type constants

**Components used:**
- `locomotor` -- calls `TempGroundTile()` to get temporary ground tile override
- `rider` -- checks `IsRiding()` and calls `GetMount()` for mounted entities
- `SoundEmitter` -- plays footstep sound effects
- `Transform` -- gets entity world position for tile lookup

**Tags:**
- `gelblobbed` -- check: overrides footstep sound to goop walking sound
- `player` -- check: determines if entity is a player for road detection
- `smallcreature` -- check: appends `_small` suffix to footstep sounds
- `largecreature` -- check: appends `_large` suffix to footstep sounds

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `Initialize` | function | — | Calls `CacheAllTileInfo()` to build the tile info cache from `GROUND_PROPERTIES`. |
| `ground` | table | `GROUND_PROPERTIES` | Array of ground tile property definitions; each entry is `{ tile_type, { name, noise_texture } }`. |
| `minimap` | table | `{}` | Reserved table for minimap tile configurations (currently empty). |
| `turf` | table | `{}` | Reserved table for turf item configurations (currently empty). |
| `falloff` | table | `{}` | Reserved table for world edge falloff configurations (currently empty). |
| `creep` | table | `{}` | Reserved table for ground creep/effect configurations (currently empty). |
| `assets` | table | — | Array of Asset objects for tile images and atlases, built from `WALL_PROPERTIES` and `underground_layers`. |
| `minimapassets` | table | `{}` | Reserved table for minimap-specific assets (currently empty). |
| `wall` | table | `WALL_PROPERTIES` | Deprecated: Array of wall tile property definitions with name and noise texture. |
| `underground` | table | `underground_layers` | Deprecated: Array of underground layer definitions (currently only `GROUND.UNDERGROUND`). |

### Tile info record fields
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `name` | string | — | Human-readable tile name used for asset path construction (e.g., `"falloff"`, `"walls"`). |
| `noise_texture` | string | — | Path to the noise texture image used for tile rendering (e.g., `"images/square.tex"`). |

## Main functions
### `GroundImage(name)`
* **Description:** Constructs the asset path for a ground tile texture image.
* **Parameters:**
  - `name` -- string tile name (e.g., `"grass"`, `"marsh"`)
* **Returns:** `"levels/tiles/"..name..".tex"` — full asset path string.
* **Error states:** None.

### `GroundAtlas(name)`
* **Description:** Constructs the asset path for a ground tile XML atlas file.
* **Parameters:**
  - `name` -- string tile name
* **Returns:** `"levels/tiles/"..name..".xml"` — full asset path string.
* **Error states:** None.

### `AddAssets(assets, layers)`
* **Description:** Iterates through layer definitions and inserts corresponding IMAGE and FILE assets into the assets table.
* **Parameters:**
  - `assets` -- table to insert Asset objects into
  - `layers` -- array of `{ tile_type, { name, noise_texture } }` definitions
* **Returns:** None
* **Error states:** None.

### `Initialize()`
* **Description:** Initializes `GROUND_PROPERTIES_CACHE` by iterating through `GROUND_PROPERTIES` and mapping tile types to their info tables. Logs warnings for duplicate tile types. Exported as `Initialize` in the module return table.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if called more than once (assert fails if `GROUND_PROPERTIES_CACHE` is already set).

### `GetTileInfo(tile)`
* **Description:** Returns cached tile info for the given tile type. Must be called after `Initialize()` has populated the cache. Note: This is a global function, not accessible via the module return value.
* **Parameters:**
  - `tile` -- number tile type ID (e.g., `GROUND.GRASS`)
* **Returns:** Tile info table `{ name, noise_texture, ... }` or `nil` if cache not initialized or tile type not in cache.
* **Error states:** Errors if `Initialize()` has not been called (`GROUND_PROPERTIES_CACHE` is nil, causing nil index error).

### `LookupTileInfo(tile)`
* **Description:** Legacy slow lookup function that iterates through `GROUND_PROPERTIES` array to find matching tile type. Use `GetTileInfo()` instead for performance. Note: This is a global function, not accessible via the module return value.
* **Parameters:**
  - `tile` -- number tile type ID
* **Returns:** Tile info table or `nil` if not found.
* **Error states:** None

### `PlayFootstep(inst, volume, ispredicted)`
* **Description:** Plays footstep sound effects based on entity state, ground type, creature size, and movement speed. Handles special cases for gelblobbed entities, riders, web/snow/mud terrain, and roads. Note: This is a global function, not accessible via the module return value.
* **Parameters:**
  - `inst` -- entity instance with SoundEmitter component
  - `volume` -- number sound volume (default `1`)
  - `ispredicted` -- boolean for network prediction handling
* **Returns:** None
* **Error states:** Errors if `inst.Transform` is `nil` (no guard before `GetWorldPosition` call), errors if `TheWorld.Map` is `nil`.

## Events & listeners
None.