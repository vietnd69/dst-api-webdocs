---
id: tilegroups
title: TileGroups
description: Tile categorization and validation system for checking tile types and managing tile group relationships
sidebar_position: 2
slug: api-vanilla/core-systems/tilegroups
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# TileGroups

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `TileGroups` module extends the `TileGroupManager` to provide tile categorization and validation functions. It defines tile groups for different categories (land, ocean, impassable, etc.) and provides utility functions to check tile properties and relationships. This system is essential for AI pathfinding, placement validation, and game logic.

## Usage Example

```lua
-- Check if a tile is suitable for land-based entities
if TileGroupManager:IsLandTile(tile_id) then
    print("Entity can walk here")
end

-- Validate ocean navigation
if TileGroupManager:IsOceanTile(tile_id) and 
   TileGroupManager:IsShallowOceanTile(tile_id) then
    print("Boat can navigate in shallow water")
end

-- Check for impassable areas
if TileGroupManager:IsImpassableTile(tile_id) then
    print("Cannot place structures here")
end
```

## Functions

### IsLandTile(tile) {#is-land-tile}

**Status:** `stable`

**Description:**
Determines if a tile is a land tile that entities can walk on. Checks both legacy and current land tile ranges.

**Parameters:**
- `tile` (number): Tile ID to check

**Returns:**
- (boolean): True if the tile is a land tile, false otherwise

**Example:**
```lua
-- Check if player can walk on this tile
local tile_under_player = TheWorld.Map:GetTileAtPoint(player.Transform:GetWorldPosition())

if TileGroupManager:IsLandTile(tile_under_player) then
    print("Player is on solid ground")
    -- Allow land-based actions
    player.components.locomotor:SetCanWalkOnLand(true)
else
    print("Player is not on land")
    -- Handle water/ocean movement
end

-- Validate placement for land structures
local function CanPlaceOnTile(x, y)
    local tile = TheWorld.Map:GetTile(x, y)
    return TileGroupManager:IsLandTile(tile)
end
```

### IsOceanTile(tile) {#is-ocean-tile}

**Status:** `stable`

**Description:**
Determines if a tile is an ocean tile. Checks both legacy and current ocean tile ranges for water-based gameplay.

**Parameters:**
- `tile` (number): Tile ID to check

**Returns:**
- (boolean): True if the tile is an ocean tile, false otherwise

**Example:**
```lua
-- Check if boat can navigate this area
local tile_id = TheWorld.Map:GetTileAtPoint(boat_x, boat_y)

if TileGroupManager:IsOceanTile(tile_id) then
    print("Boat can sail here")
    boat.components.locomotor:SetCanWalkOnWater(true)
else
    print("Boat cannot sail on land")
    -- Stop boat movement or handle beaching
end

-- Ocean fishing validation
local function CanFishHere(x, y)
    local tile = TheWorld.Map:GetTile(x, y)
    return TileGroupManager:IsOceanTile(tile)
end
```

### IsImpassableTile(tile) {#is-impassable-tile}

**Status:** `stable`

**Description:**
Determines if a tile is impassable and cannot be traversed by entities. Includes both legacy impassable tiles and specific impassable tile types.

**Parameters:**
- `tile` (number): Tile ID to check

**Returns:**
- (boolean): True if the tile is impassable, false otherwise

**Example:**
```lua
-- Pathfinding validation
local function IsValidPathTile(tile)
    if TileGroupManager:IsImpassableTile(tile) then
        return false  -- Cannot path through this tile
    end
    return true
end

-- Structure placement validation
local function CanBuildHere(x, y)
    local tile = TheWorld.Map:GetTile(x, y)
    if TileGroupManager:IsImpassableTile(tile) then
        return false, "Cannot build on impassable terrain"
    end
    return true
end

-- AI navigation check
if not TileGroupManager:IsImpassableTile(target_tile) then
    -- Safe to move to this location
    entity.components.locomotor:GoToPoint(target_x, target_y)
end
```

### IsInvalidTile(tile) {#is-invalid-tile}

**Status:** `stable`

**Description:**
Determines if a tile is invalid, including both impassable tiles and specifically invalid tile types.

**Parameters:**
- `tile` (number): Tile ID to check

**Returns:**
- (boolean): True if the tile is invalid, false otherwise

**Example:**
```lua
-- World boundary checking
local function IsWithinValidWorld(x, y)
    local tile = TheWorld.Map:GetTile(x, y)
    if TileGroupManager:IsInvalidTile(tile) then
        return false  -- Outside world boundaries
    end
    return true
end

-- Entity spawning validation
local function SafeToSpawnAt(x, y)
    local tile = TheWorld.Map:GetTile(x, y)
    if TileGroupManager:IsInvalidTile(tile) then
        return false, "Cannot spawn on invalid terrain"
    end
    return true
end
```

### IsNoiseTile(tile) {#is-noise-tile}

**Status:** `stable`

**Description:**
Determines if a tile is a noise tile used for texture blending and world generation. Checks both legacy and current noise tile ranges.

**Parameters:**
- `tile` (number): Tile ID to check

**Returns:**
- (boolean): True if the tile is a noise tile, false otherwise

**Example:**
```lua
-- World generation validation
local function IsTextureBlendTile(tile)
    return TileGroupManager:IsNoiseTile(tile)
end

-- Skip noise tiles in gameplay logic
if not TileGroupManager:IsNoiseTile(tile_id) then
    -- Process only actual gameplay tiles
    ProcessGameplayTile(tile_id)
end
```

### IsTemporaryTile(tile) {#is-temporary-tile}

**Status:** `stable`

**Description:**
Determines if a tile is temporary and uses the undertile component. Temporary tiles help avoid placement conflicts when multiple temporary tiles try to occupy the same spot.

**Parameters:**
- `tile` (number): Tile ID to check

**Returns:**
- (boolean): True if the tile is temporary, false otherwise

**Example:**
```lua
-- Prevent overlapping temporary structures
local function CanPlaceTemporaryStructure(x, y)
    local tile = TheWorld.Map:GetTile(x, y)
    if TileGroupManager:IsTemporaryTile(tile) then
        return false, "Another temporary structure already here"
    end
    return true
end

-- Special handling for temporary tiles
if TileGroupManager:IsTemporaryTile(current_tile) then
    -- Use undertile component logic
    local undertile = entity.components.undertile
    if undertile then
        undertile:SetOriginalTile(underlying_tile)
    end
end
```

### IsShallowOceanTile(tile) {#is-shallow-ocean-tile}

**Status:** `stable`

**Description:**
Determines if a tile is specifically a shallow ocean tile suitable for certain ocean activities. Only includes coastal shore, coastal ocean, and waterlog ocean tiles.

**Parameters:**
- `tile` (number): Tile ID to check

**Returns:**
- (boolean): True if the tile is a shallow ocean tile, false otherwise

**Example:**
```lua
-- Boat navigation in shallow water
if TileGroupManager:IsShallowOceanTile(tile_id) then
    print("Safe for small boats")
    boat.components.locomotor:SetSpeedMultiplier(1.0)
else
    print("Deep water - large boats only")
    if boat.size == "small" then
        boat.components.locomotor:SetSpeedMultiplier(0.5)
    end
end

-- Shallow water fishing
local function CanShorelinefish(x, y)
    local tile = TheWorld.Map:GetTile(x, y)
    return TileGroupManager:IsShallowOceanTile(tile)
end

-- Wade in shallow water
if TileGroupManager:IsShallowOceanTile(player_tile) then
    player.components.locomotor:SetTriggersCreatedSounds(false)  -- Quiet movement
end
```

## Tile Groups

The module defines several tile groups used throughout the game:

### Legacy Tile Groups

These groups maintain compatibility with older tile systems:

- `TileGroups.Legacy_LandTiles` - Legacy land tile range
- `TileGroups.Legacy_OceanTiles` - Legacy ocean tile range  
- `TileGroups.Legacy_ImpassableTiles` - Legacy impassable tile range
- `TileGroups.Legacy_NoiseTiles` - Legacy noise tile range

### Current Tile Groups

Modern tile groups that extend legacy groups:

- `TileGroups.LandTiles` - All land tiles including legacy
- `TileGroups.OceanTiles` - All ocean tiles including legacy
- `TileGroups.TransparentOceanTiles` - Ocean tiles with transparency effects
- `TileGroups.ImpassableTiles` - All impassable tiles including legacy
- `TileGroups.InvalidTiles` - Invalid tiles including impassable
- `TileGroups.NoiseTiles` - All noise tiles including legacy

### Specialized Tile Groups

Groups for specific gameplay mechanics:

- `TileGroups.LandTilesNotDock` - **Deprecated:** Use `LandTilesWithDefaultFalloff`
- `TileGroups.LandTilesWithDefaultFalloff` - Land tiles excluding dock tiles
- `TileGroups.DockTiles` - Only dock tiles
- `TileGroups.OceanIceTiles` - Ice floe tiles
- `TileGroups.LandTilesInvisible` - Land tiles including invisible ones
- `TileGroups.ShallowOceanTiles` - Shallow ocean areas only

## Common Usage Patterns

### Entity Movement Validation

```lua
-- Comprehensive movement check
local function CanMoveToTile(entity, tile_id)
    if TileGroupManager:IsInvalidTile(tile_id) then
        return false, "Invalid terrain"
    end
    
    if entity.is_land_entity and not TileGroupManager:IsLandTile(tile_id) then
        return false, "Land entity cannot enter water"
    end
    
    if entity.is_boat and not TileGroupManager:IsOceanTile(tile_id) then
        return false, "Boat cannot sail on land"
    end
    
    if entity.is_small_boat and TileGroupManager:IsOceanTile(tile_id) and 
       not TileGroupManager:IsShallowOceanTile(tile_id) then
        return false, "Small boat cannot handle deep water"
    end
    
    return true
end
```

### Structure Placement Logic

```lua
-- Building placement validation
local function ValidateBuildingSite(x, y, building_type)
    local tile = TheWorld.Map:GetTile(x, y)
    
    -- Check for invalid terrain
    if TileGroupManager:IsInvalidTile(tile) then
        return false, "Cannot build on invalid terrain"
    end
    
    -- Land buildings
    if building_type.requires_land then
        if not TileGroupManager:IsLandTile(tile) then
            return false, "This structure requires solid ground"
        end
    end
    
    -- Ocean structures
    if building_type.requires_ocean then
        if not TileGroupManager:IsOceanTile(tile) then
            return false, "This structure requires water"
        end
        
        if building_type.shallow_water_only and 
           not TileGroupManager:IsShallowOceanTile(tile) then
            return false, "This structure requires shallow water"
        end
    end
    
    -- Temporary structure collision
    if building_type.is_temporary and TileGroupManager:IsTemporaryTile(tile) then
        return false, "Another temporary structure already here"
    end
    
    return true
end
```

### AI Pathfinding Integration

```lua
-- Pathfinding cost calculation
local function GetTileCost(tile_id, entity_type)
    if TileGroupManager:IsInvalidTile(tile_id) then
        return math.huge  -- Infinite cost - impassable
    end
    
    local base_cost = 1
    
    -- Land entity on water
    if entity_type == "land" and TileGroupManager:IsOceanTile(tile_id) then
        if TileGroupManager:IsShallowOceanTile(tile_id) then
            return base_cost * 3  -- Can wade but slow
        else
            return math.huge  -- Cannot swim in deep water
        end
    end
    
    -- Boat on land
    if entity_type == "boat" and TileGroupManager:IsLandTile(tile_id) then
        return math.huge  -- Boats cannot go on land
    end
    
    -- Temporary tiles have higher cost
    if TileGroupManager:IsTemporaryTile(tile_id) then
        return base_cost * 2
    end
    
    return base_cost
end
```

### Resource Gathering Validation

```lua
-- Check if resources can be gathered from tile
local function CanGatherFrom(tile_id, resource_type)
    if TileGroupManager:IsInvalidTile(tile_id) then
        return false
    end
    
    if resource_type == "fish" then
        return TileGroupManager:IsOceanTile(tile_id)
    end
    
    if resource_type == "shoreline_fish" then
        return TileGroupManager:IsShallowOceanTile(tile_id)
    end
    
    if resource_type == "land_plants" then
        return TileGroupManager:IsLandTile(tile_id) and 
               not TileGroupManager:IsTemporaryTile(tile_id)
    end
    
    return false
end
```

## Integration with Game Systems

### World Generation

The tile groups are used during world generation to determine valid placement areas:

```lua
-- World generation example
if TileGroupManager:IsLandTile(tile) then
    -- Can place land biomes, structures, resources
    PlaceLandContent(x, y)
elseif TileGroupManager:IsOceanTile(tile) then
    -- Can place ocean content, sea stacks, etc.
    PlaceOceanContent(x, y)
end
```

### Falloff Texture System

Tile groups determine which falloff textures to use for smooth tile transitions:

```lua
-- The system uses predefined groups for falloff calculations
TileGroupManager:SetIsLandTileGroup(TileGroups.LandTiles)
TileGroupManager:SetIsOceanTileGroup(TileGroups.OceanTiles)
TileGroupManager:SetIsTransparentOceanTileGroup(TileGroups.TransparentOceanTiles)
```

### Component Integration

Many components use tile groups for validation:

- **Locomotor Component**: Checks tile types for movement validation
- **Undertile Component**: Uses temporary tile detection
- **Builder Component**: Validates placement based on tile types
- **Boat Component**: Uses ocean tile detection for navigation

## Performance Considerations

The tile group functions are optimized for frequent calls:

- Range checks use simple numeric comparisons
- No table iterations for basic tile type checks
- Legacy compatibility maintained without performance cost
- Global constants used for quick validation

## Related Modules

- [TileManager](./tilemanager.md): Core tile management and registration
- [TileDefs](./tiledefs.md): Contains all vanilla tile definitions
- [World Tile Definitions](../map/worldtiledefs.md): Tile constants and ranges

## Source Reference

**File:** `scripts/tilegroups.lua`

**Key Implementation Notes:**
- Extends TileGroupManager with utility functions
- Maintains legacy compatibility through dual range checking
- Integrates with falloff texture system for smooth tile transitions
- Provides specialized tile groups for specific game mechanics
- Worldgen protection prevents execution during world generation
