---
id: tilemanager
title: TileManager
description: Core module for managing ground tiles, falloff textures, and ground creep in the world generation system
sidebar_position: 136
slug: api-vanilla/core-systems/tilemanager
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# TileManager

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `TileManager` module is the core system for managing ground tiles in Don't Starve Together. It provides functionality to register tile ranges, add new tiles with properties, manage falloff textures, and handle ground creep effects. This module is essential for world generation and tile rendering systems.

## Usage Example

```lua
local TileManager = require("tilemanager")

-- Register a new tile range (done internally)
TileManager.RegisterTileRange("CUSTOM", 1000, 1255)

-- Add a new tile with properties
TileManager.AddTile(
    "CUSTOM_GRASS",
    "LAND",
    {ground_name = "Custom Grass"},
    {
        name = "custom_grass",
        noise_texture = "custom_grass_noise",
        runsound = "dontstarve/movement/run_grass",
        walksound = "dontstarve/movement/walk_grass",
        snowsound = "dontstarve/movement/run_snow",
        mudsound = "dontstarve/movement/run_mud",
    },
    {
        name = "map_edge",
        noise_texture = "mini_custom_grass",
    },
    {
        name = "custom_grass",
        pickupsound = "vegetation_grassy",
    }
)
```

## Functions

### RegisterTileRange(range_name, range_start, range_end) {#register-tile-range}

**Status:** `stable`

**Description:**
Registers a new tile range for categorizing tiles. Tile ranges define the numeric ID ranges for different categories of tiles (LAND, OCEAN, IMPASSABLE, NOISE).

**Parameters:**
- `range_name` (string): Name of the tile range (converted to uppercase)
- `range_start` (number): Starting ID for the range
- `range_end` (number): Ending ID for the range (inclusive)

**Returns:**
- (void): No return value

**Restrictions:**
- Range must be at least 256 tiles wide
- Range name must be unique
- Cannot be called when `mod_protect_TileManager` is true

**Example:**
```lua
-- Register a custom tile range for mod tiles
TileManager.RegisterTileRange("MODTILES", 2000, 2255)

-- This creates a range that can hold 256 different tile types
-- for use by mods or custom content
```

### AddTile(tile_name, tile_range, tile_data, ground_tile_def, minimap_tile_def, turf_def) {#add-tile}

**Status:** `stable`

**Description:**
Adds a new tile with complete definitions for ground rendering, minimap display, and turf properties. This is the primary function for creating new tile types.

**Parameters:**
- `tile_name` (string): Unique name for the tile (converted to uppercase)
- `tile_range` (string): Range category for the tile (LAND, OCEAN, IMPASSABLE, NOISE)
- `tile_data` (table): Basic tile metadata
- `ground_tile_def` (table, optional): Ground rendering properties
- `minimap_tile_def` (table, optional): Minimap display properties  
- `turf_def` (table, optional): Turf item properties

**Returns:**
- (void): No return value

**Example:**
```lua
-- Add a custom volcanic tile
TileManager.AddTile(
    "VOLCANIC_ROCK",
    "LAND",
    {ground_name = "Volcanic Rock", old_static_id = nil},
    {
        name = "volcanic",
        noise_texture = "noise_volcanic",
        runsound = "dontstarve/movement/run_dirt",
        walksound = "dontstarve/movement/walk_dirt",
        snowsound = "dontstarve/movement/run_ice",
        mudsound = "dontstarve/movement/run_mud",
        hard = true,
        flashpoint_modifier = 50,
    },
    {
        name = "map_edge",
        noise_texture = "mini_volcanic",
    },
    {
        name = "volcanic_turf",
        anim = "volcanic",
        pickupsound = "rock",
    }
)
```

### SetTileProperty(tile_id, propertyname, value) {#set-tile-property}

**Status:** `stable`

**Description:**
Modifies a property of an existing ground tile definition. Useful for runtime adjustments to tile behavior.

**Parameters:**
- `tile_id` (number): Numeric ID of the tile to modify
- `propertyname` (string): Name of the property to change
- `value` (any): New value for the property

**Returns:**
- (void): No return value

**Example:**
```lua
-- Make grass tiles harder (immune to being dug up)
TileManager.SetTileProperty(WORLD_TILES.GRASS, "hard", true)

-- Change the run sound for forest tiles
TileManager.SetTileProperty(WORLD_TILES.FOREST, "runsound", "custom/movement/forest_run")

-- Modify flashpoint for scale tiles
TileManager.SetTileProperty(WORLD_TILES.SCALE, "flashpoint_modifier", 300)
```

### ChangeTileRenderOrder(tile_id, target_tile_id, moveafter) {#change-tile-render-order}

**Status:** `stable`

**Description:**
Changes the rendering order of tiles by moving one tile's position relative to another. This affects which tiles appear on top when overlapping.

**Parameters:**
- `tile_id` (number): ID of the tile to move
- `target_tile_id` (number): ID of the reference tile
- `moveafter` (boolean): If true, move after target; if false, move before target

**Returns:**
- (void): No return value

**Example:**
```lua
-- Move volcanic tiles to render after rocky tiles
TileManager.ChangeTileRenderOrder(
    WORLD_TILES.VOLCANIC_ROCK, 
    WORLD_TILES.ROCKY, 
    true  -- Move after rocky tiles
)

-- Move custom tiles to render before existing tiles
TileManager.ChangeTileRenderOrder(
    WORLD_TILES.CUSTOM_TILE,
    WORLD_TILES.GRASS,
    false  -- Move before grass tiles
)
```

### ChangeMiniMapTileRenderOrder(tile_id, target_tile_id, moveafter) {#change-minimap-tile-render-order}

**Status:** `stable`

**Description:**
Changes the rendering order of tiles specifically for minimap display. Similar to ChangeTileRenderOrder but only affects minimap rendering.

**Parameters:**
- `tile_id` (number): ID of the tile to move
- `target_tile_id` (number): ID of the reference tile
- `moveafter` (boolean): If true, move after target; if false, move before target

**Returns:**
- (void): No return value

**Example:**
```lua
-- Adjust minimap rendering order for better visibility
TileManager.ChangeMiniMapTileRenderOrder(
    WORLD_TILES.CUSTOM_WATER,
    WORLD_TILES.OCEAN_COASTAL,
    true
)
```

### SetMiniMapTileProperty(tile_id, propertyname, value) {#set-minimap-tile-property}

**Status:** `stable`

**Description:**
Modifies a property of an existing minimap tile definition. Allows runtime changes to how tiles appear on the minimap.

**Parameters:**
- `tile_id` (number): Numeric ID of the tile to modify
- `propertyname` (string): Name of the property to change
- `value` (any): New value for the property

**Returns:**
- (void): No return value

**Example:**
```lua
-- Change minimap noise texture for better visibility
TileManager.SetMiniMapTileProperty(
    WORLD_TILES.CUSTOM_BIOME, 
    "noise_texture", 
    "mini_custom_biome_enhanced"
)
```

### AddFalloffTexture(falloff_id, falloff_def) {#add-falloff-texture}

**Status:** `stable`

**Description:**
Adds a falloff texture definition for smooth transitions between different tile types. Falloff textures create smooth blending at tile boundaries.

**Parameters:**
- `falloff_id` (number): Unique ID for the falloff texture
- `falloff_def` (table): Falloff texture definition with rendering properties

**Returns:**
- (void): No return value

**Example:**
```lua
-- Add falloff texture for smooth grass-to-dirt transitions
TileManager.AddFalloffTexture(1001, {
    name = "grass_to_dirt_falloff",
    noise_texture = "falloff_grass_dirt",
    should_have_falloff = function(tile1, tile2)
        return tile1 == WORLD_TILES.GRASS and tile2 == WORLD_TILES.DIRT
    end,
    should_have_falloff_result = true,
    neighbor_needs_falloff = function(neighbor_tile)
        return neighbor_tile == WORLD_TILES.ROCKY
    end,
    neighbor_needs_falloff_result = false
})
```

### ChangeFalloffRenderOrder(falloff_id, target_falloff_id, moveafter) {#change-falloff-render-order}

**Status:** `stable`

**Description:**
Changes the rendering order of falloff textures. This affects the priority of different falloff effects when multiple transitions overlap.

**Parameters:**
- `falloff_id` (number): ID of the falloff to move
- `target_falloff_id` (number): ID of the reference falloff
- `moveafter` (boolean): If true, move after target; if false, move before target

**Returns:**
- (void): No return value

### SetFalloffProperty(falloff_id, propertyname, value) {#set-falloff-property}

**Status:** `stable`

**Description:**
Modifies a property of an existing falloff texture definition.

**Parameters:**
- `falloff_id` (number): Numeric ID of the falloff to modify
- `propertyname` (string): Name of the property to change
- `value` (any): New value for the property

**Returns:**
- (void): No return value

### AddGroundCreep(groundcreep_id, groundcreep_def) {#add-ground-creep}

**Status:** `stable`

**Description:**
Adds a ground creep effect definition. Ground creep creates dynamic overlay effects on tiles, such as corruption or growth patterns.

**Parameters:**
- `groundcreep_id` (number): Unique ID for the ground creep effect
- `groundcreep_def` (table): Ground creep definition with visual properties

**Returns:**
- (void): No return value

**Example:**
```lua
-- Add corruption creep effect
TileManager.AddGroundCreep(2001, {
    name = "corruption_creep",
    noise_texture = "creep_corruption",
    atlas = "corruption_creep_atlas",
})
```

### ChangeGroundCreepRenderOrder(groundcreep_id, target_groundcreep_id, moveafter) {#change-ground-creep-render-order}

**Status:** `stable`

**Description:**
Changes the rendering order of ground creep effects.

**Parameters:**
- `groundcreep_id` (number): ID of the ground creep to move
- `target_groundcreep_id` (number): ID of the reference ground creep
- `moveafter` (boolean): If true, move after target; if false, move before target

**Returns:**
- (void): No return value

### SetGroundCreepProperty(groundcreep_id, propertyname, value) {#set-ground-creep-property}

**Status:** `stable`

**Description:**
Modifies a property of an existing ground creep definition.

**Parameters:**
- `groundcreep_id` (number): Numeric ID of the ground creep to modify
- `propertyname` (string): Name of the property to change
- `value` (any): New value for the property

**Returns:**
- (void): No return value

## Data Structures

### Tile Data Structure

```lua
local tile_data = {
    ground_name = "Display Name",    -- Human-readable name
    old_static_id = 42,             -- Legacy ID (for vanilla tiles only)
}
```

### Ground Tile Definition

```lua
local ground_tile_def = {
    name = "texture_name",               -- Base texture name
    atlas = "texture_atlas",             -- Atlas file (optional)
    noise_texture = "noise_texture",     -- Noise overlay texture
    
    -- Movement sounds
    runsound = "path/to/run_sound",
    walksound = "path/to/walk_sound", 
    snowsound = "path/to/snow_sound",
    mudsound = "path/to/mud_sound",
    
    -- Properties
    hard = false,                        -- Cannot be dug up
    flooring = false,                    -- Acts as flooring
    roadways = false,                    -- Part of road system
    cannotbedug = false,                 -- Immune to terraforming
    nogroundoverlays = false,            -- No snow/mud overlays
    isinvisibletile = false,             -- Invisible tile type
    istemptile = false,                  -- Temporary tile using undertile
    
    -- Visual properties
    flashpoint_modifier = 0,             -- Fire spread modifier
    colors = {                           -- Color blending
        primary_color = {r, g, b, a},
        secondary_color = {r, g, b, a},
        secondary_color_dusk = {r, g, b, a},
        minimap_color = {r, g, b, a},
    },
    wavetint = {r, g, b},               -- Ocean wave tinting
    ocean_depth = "SHALLOW",             -- Ocean depth category
}
```

### Minimap Tile Definition

```lua
local minimap_tile_def = {
    name = "minimap_texture",            -- Minimap texture name
    atlas = "minimap_atlas",             -- Minimap atlas (optional)
    noise_texture = "mini_noise",        -- Minimap noise texture
}
```

### Turf Definition

```lua
local turf_def = {
    name = "turf_item_name",             -- Turf item prefab name
    anim = "turf_animation",             -- Ground item animation
    bank_build = "turf_bank",            -- Animation bank/build
    pickupsound = "sound_type",          -- Sound when picked up
    
    -- Optional mod parameters
    bank_override = "custom_bank",
    build_override = "custom_build", 
    animzip_override = "custom.zip",
    inv_override = "custom_inv_item",
}
```

## Common Usage Patterns

### Creating Custom Biome Tiles

```lua
-- Define color scheme for new biome
local CRYSTAL_COLORS = {
    primary_color = {200, 255, 255, 40},
    secondary_color = {100, 200, 255, 120},
    secondary_color_dusk = {50, 100, 150, 140},
    minimap_color = {80, 160, 200, 180},
}

-- Add crystal biome tile
TileManager.AddTile(
    "CRYSTAL_BIOME",
    "LAND",
    {ground_name = "Crystal Ground"},
    {
        name = "crystal_ground",
        noise_texture = "crystal_noise",
        runsound = "dontstarve/movement/run_marble",
        walksound = "dontstarve/movement/walk_marble",
        snowsound = "dontstarve/movement/run_ice",
        mudsound = "dontstarve/movement/run_mud",
        hard = true,
        colors = CRYSTAL_COLORS,
    },
    {
        name = "map_edge",
        noise_texture = "mini_crystal",
    },
    {
        name = "crystal_turf",
        pickupsound = "rock",
    }
)
```

### Modifying Existing Tiles

```lua
-- Make marsh tiles more dangerous
TileManager.SetTileProperty(WORLD_TILES.MARSH, "flashpoint_modifier", -50)

-- Change sounds for rocky areas
TileManager.SetTileProperty(WORLD_TILES.ROCKY, "runsound", "custom/rocky_run")
TileManager.SetTileProperty(WORLD_TILES.ROCKY, "walksound", "custom/rocky_walk")

-- Add hard property to prevent digging
TileManager.SetTileProperty(WORLD_TILES.CUSTOM_TILE, "hard", true)
```

### Ocean Tile Depth Categories

Ocean tiles support different depth categories that affect gameplay:

- `"SHALLOW"` - Coastal areas, boats can navigate
- `"BASIC"` - Normal ocean depth  
- `"DEEP"` - Deep ocean areas
- `"VERY_DEEP"` - Deepest ocean regions

```lua
-- Create shallow lagoon tile
TileManager.AddTile(
    "LAGOON",
    "OCEAN", 
    {ground_name = "Lagoon"},
    {
        name = "lagoon",
        noise_texture = "lagoon_noise",
        ocean_depth = "SHALLOW",
        colors = LAGOON_COLORS,
        wavetint = {0.9, 1.0, 1.0},
    }
)
```

## Integration with Game Systems

### World Generation Integration

The TileManager works closely with world generation systems:

```lua
-- World generation uses tile IDs from WORLD_TILES
local function PlaceBiome(x, y, biome_type)
    if biome_type == "crystal" then
        TheWorld.Map:SetTile(x, y, WORLD_TILES.CRYSTAL_BIOME)
    end
end
```

### Asset Management

TileManager automatically handles asset loading for tiles:

- Ground textures are loaded from `levels/tiles/`
- Noise textures are loaded from `levels/textures/`
- Atlas files are resolved automatically
- Assets are added to the appropriate asset tables

### Protection System

The module uses a protection system to prevent unauthorized modifications:

```lua
-- Protection is enabled after tile definitions are loaded
mod_protect_TileManager = true  -- Prevents mod interference

-- Legacy compatibility flag
allow_existing_GROUND_entry = false  -- Prevents GROUND table conflicts
```

## Related Modules

- [TileDefs](./tiledefs.md): Contains all vanilla tile definitions
- [TileGroups](./tilegroups.md): Provides tile categorization and validation
- [World Tile Definitions](../map/worldtiledefs.md): Core tile constants and structures

## Source Reference

**File:** `scripts/tilemanager.lua`

**Key Implementation Notes:**
- Uses asset resolution system for automatic texture loading
- Validates all tile definitions for required properties
- Maintains render order for proper tile layering
- Integrates with world generation and minimap systems
- Supports mod extensibility through proper range management
