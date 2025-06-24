---
id: worldtiledefs
title: World Tile Definitions
description: Ground tile system for terrain properties, footstep sounds, and visual assets management
sidebar_position: 154
slug: api-vanilla/core-systems/worldtiledefs
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# World Tile Definitions

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|---|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `worldtiledefs` module defines the ground tile system for Don't Starve Together, managing terrain properties, visual assets, and audio feedback. It provides the foundation for different ground types including grass, rock, dirt, cave floors, and specialized tiles, along with their associated footstep sounds and visual representations.

## Usage Example

```lua
-- Get tile information for a specific ground type
local tileinfo = GetTileInfo(GROUND.GRASS)
if tileinfo then
    print("Tile name:", tileinfo.name)
    print("Walk sound:", tileinfo.walksound)
end

-- Play footstep sound for an entity
PlayFootstep(inst, 1.0, false)
```

## Functions

### Initialize() {#initialize}

**Status:** `stable`

**Description:**
Caches all tile information for optimized runtime access using `CacheAllTileInfo()` internal function. This function must be called during game initialization before any tile lookups are performed. It creates the `GROUND_PROPERTIES_CACHE` table for O(1) tile information access.

**Parameters:**
None

**Returns:**
None

**Example:**
```lua
-- Called during game initialization (typically in gamelogic.lua)
local worldtiledefs = require("worldtiledefs")
worldtiledefs.Initialize()

-- After initialization, tile info cache is available
local grassinfo = worldtiledefs.GetTileInfo(GROUND.GRASS)
```

**Implementation Details:**
```lua
-- Internal caching function
local function CacheAllTileInfo()
    assert(GROUND_PROPERTIES_CACHE == nil, "Tile info already initialized")
    GROUND_PROPERTIES_CACHE = {}
    for i, data in ipairs(GROUND_PROPERTIES) do
        local tile_type, tile_info = unpack(data)
        GROUND_PROPERTIES_CACHE[tile_type] = tile_info
    end
end
```

**Version History:**
- Current implementation in build 676042

### GetTileInfo(tile) {#get-tile-info}

**Status:** `stable`

**Description:**
Retrieves cached tile information for the specified tile type. This is the preferred method for tile lookups as it uses cached data for optimal performance.

**Parameters:**
- `tile` (number): The GROUND constant representing the tile type

**Returns:**
- (table): Tile information containing properties like name, sounds, and visual data
- (nil): If tile type is not found

**Example:**
```lua
local tileinfo = GetTileInfo(GROUND.FOREST)
if tileinfo then
    local walksound = tileinfo.walksound
    local runsound = tileinfo.runsound
    local tilename = tileinfo.name
end
```

**Version History:**
- Current implementation in build 676042

### LookupTileInfo(tile) {#lookup-tile-info}

**Status:** `stable`

**Description:**
Legacy function for tile information lookup using slow table iteration. Use GetTileInfo() instead for better performance.

**Parameters:**
- `tile` (number): The GROUND constant representing the tile type

**Returns:**
- (table): Tile information if found
- (nil): If tile type is not found

**Example:**
```lua
-- Legacy usage (not recommended)
local tileinfo = LookupTileInfo(GROUND.ROCKY)
```

**Version History:**
- Legacy implementation, use GetTileInfo() instead

### PlayFootstep(inst, volume, ispredicted) {#play-footstep}

**Status:** `stable`

**Description:**
Plays appropriate footstep sounds for an entity based on the ground tile they are standing on. Handles various conditions including creature size, riding state, ground overlays (snow, mud, creep), and special surfaces. Supports platform walking and special sound effects.

**Parameters:**
- `inst` (Entity): The entity to play footstep sound for
- `volume` (number, optional): Sound volume (default: 1.0)
- `ispredicted` (boolean, optional): Whether this is a predicted sound event

**Returns:**
None

**Example:**
```lua
-- Play footstep for player at normal volume
local worldtiledefs = require("worldtiledefs")
worldtiledefs.PlayFootstep(ThePlayer, 1.0, false)

-- Play quieter footstep for creature
worldtiledefs.PlayFootstep(creature_inst, 0.7, false)

-- Play predicted footstep (for network optimization)
worldtiledefs.PlayFootstep(inst, 1.0, true)

-- Called automatically by locomotor component
inst.components.locomotor:PlayFootstep()
```

**Sound Logic Flow:**
1. **Override Check**: Returns early if entity has `"gelblobbed"` tag (plays goop sound)
2. **Platform Check**: Uses platform sounds if entity is on a structure
3. **Tile Detection**: Gets tile type from locomotor component or current position
4. **Overlay Detection**: Checks for snow (>0.15), mud (wetness >15), or creep
5. **Road Detection**: For players only, checks if on road (performance optimized)
6. **Size Suffix**: Applies "_small" or "_large" based on creature tags
7. **Sound Selection**: Chooses walk/run sound based on stategraph

**Special Sound Conditions:**
```lua
-- Gel blob override (highest priority)
if inst:HasTag("gelblobbed") then
    sound:PlaySound("dontstarve/movement/walk_goop", nil, volume or 1, ispredicted)
    return
end

-- Ground overlay priorities
local soundpath = 
    (oncreep and "dontstarve/movement/run_web") or
    (onsnow and tileinfo.snowsound) or  
    (onmud and tileinfo.mudsound) or
    nil

-- Size variations
local sizesuffix = 
    (size_inst:HasTag("smallcreature") and "_small") or
    (size_inst:HasTag("largecreature") and "_large") or
    ""
```

**Platform Sound Support:**
- **Primary Sound**: Uses `platform.walksound` or `platform.runsound`
- **Secondary Sound**: Optional `platform.second_walk_sound` for layered effects
- **Size Variants**: Platform sounds support size suffixes

**Performance Optimizations:**
- **Road Detection**: Only performed for players due to performance cost
- **Temp Ground Tile**: Uses locomotor's cached tile when available
- **Sound Caching**: Tile info retrieved through optimized cache lookup

**Version History:**
- Current implementation in build 676042

## Constants

### GROUND_PROPERTIES

**Status:** `stable`

**Description:**
Array of tile definitions containing all ground tile types and their properties. Each entry consists of a tile type constant and its associated properties table. Used for tile information lookup and asset management.

**Structure:**
```lua
-- Each entry format:
{ GROUND.TILE_TYPE, { 
    name = "tile_name",
    noise_texture = "path/to/texture.tex",
    walksound = "sound/path/walk",
    runsound = "sound/path/run",
    snowsound = "sound/path/walk_snow", -- Optional
    mudsound = "sound/path/walk_mud",   -- Optional
    nogroundoverlays = false,           -- Optional
    -- Additional properties...
}}
```

**Asset Integration:**
```lua
-- Assets are automatically generated using helper functions
function GroundImage(name)
    return "levels/tiles/"..name..".tex"
end

function GroundAtlas(name)
    return "levels/tiles/"..name..".xml"
end

-- AddAssets automatically processes GROUND_PROPERTIES
local function AddAssets(assets, layers)
    for i, data in ipairs(layers) do
        local tile_type, properties = unpack(data)
        table.insert(assets, Asset("IMAGE", properties.noise_texture))
        table.insert(assets, Asset("IMAGE", GroundImage(properties.name)))
        table.insert(assets, Asset("FILE", GroundAtlas(properties.name)))
    end
end
```

**Caching System:**
- **Initialize Required**: Must call `Initialize()` to populate cache
- **Runtime Access**: Use `GetTileInfo(tile)` for O(1) lookup
- **Cache Structure**: `GROUND_PROPERTIES_CACHE[tile_type] = tile_info`

### WALL_PROPERTIES

**Status:** `stable`

**Description:**
Definitions for wall tile types including cave walls, marsh walls, and other barrier tiles. All wall tiles use placeholder noise texture ("images/square.tex") and generic "walls" name.

**Complete Wall Types:**
```lua
local WALL_PROPERTIES = {
    { GROUND.UNDERGROUND,        { name = "falloff", noise_texture = "images/square.tex" } },
    { GROUND.WALL_MARSH,         { name = "walls",   noise_texture = "images/square.tex" } },
    { GROUND.WALL_ROCKY,         { name = "walls",   noise_texture = "images/square.tex" } },
    { GROUND.WALL_DIRT,          { name = "walls",   noise_texture = "images/square.tex" } },
    { GROUND.WALL_CAVE,          { name = "walls",   noise_texture = "images/square.tex" } },
    { GROUND.WALL_FUNGUS,        { name = "walls",   noise_texture = "images/square.tex" } },
    { GROUND.WALL_SINKHOLE,      { name = "walls",   noise_texture = "images/square.tex" } },
    { GROUND.WALL_MUD,           { name = "walls",   noise_texture = "images/square.tex" } },
    { GROUND.WALL_TOP,           { name = "walls",   noise_texture = "images/square.tex" } },
    { GROUND.WALL_WOOD,          { name = "walls",   noise_texture = "images/square.tex" } },
    { GROUND.WALL_HUNESTONE_GLOW,{ name = "walls",   noise_texture = "images/square.tex" } },
    { GROUND.WALL_HUNESTONE,     { name = "walls",   noise_texture = "images/square.tex" } },
    { GROUND.WALL_STONEEYE_GLOW, { name = "walls",   noise_texture = "images/square.tex" } },
    { GROUND.WALL_STONEEYE,      { name = "walls",   noise_texture = "images/square.tex" } },
}
```

**Wall Categories:**
- **Surface Walls**: `WALL_MARSH`, `WALL_ROCKY`, `WALL_DIRT`
- **Cave Walls**: `WALL_CAVE`, `WALL_FUNGUS`, `WALL_SINKHOLE`, `WALL_MUD`
- **Structure Walls**: `WALL_TOP`, `WALL_WOOD`
- **Archive Walls**: `WALL_HUNESTONE_GLOW`, `WALL_HUNESTONE`, `WALL_STONEEYE_GLOW`, `WALL_STONEEYE`
- **Special**: `UNDERGROUND` (uses "falloff" name instead of "walls")

### Assets Management

**Status:** `stable`

**Description:**
The module automatically manages texture and atlas assets for all defined tile types using helper functions.

**Helper Functions:**
- `GroundImage(name)`: Generates texture path for tile
- `GroundAtlas(name)`: Generates atlas path for tile
- `AddAssets(assets, layers)`: Adds required assets to asset list

## Module Exports

The module returns a table containing:

### ground {#ground-export}

**Type:** `array`

**Description:** The complete GROUND_PROPERTIES array containing all tile definitions.

### minimap {#minimap-export}

**Type:** `table`

**Description:** Minimap-related tile properties (currently empty).

### turf {#turf-export}

**Type:** `table`

**Description:** Turf placement definitions (currently empty).

### falloff {#falloff-export}

**Type:** `table`

**Description:** Falloff properties for tile transitions (currently empty).

### creep {#creep-export}

**Type:** `table`

**Description:** Ground creep overlay definitions (currently empty).

### assets {#assets-export}

**Type:** `array`

**Description:** Asset list containing all required textures and atlases for the defined tiles.

### minimapassets {#minimapassets-export}

**Type:** `table`

**Description:** Minimap-specific assets (currently empty).

### minimapassets {#minimapassets-export}

**Type:** `table`

**Description:** Minimap-specific assets (currently empty).

## Internal Module Structure

### GROUND_PROPERTIES_CACHE

**Type:** `table`

**Status:** `stable`

**Description:** Internal cache populated by `Initialize()` function for fast tile lookups.

**Structure:**
```lua
-- After Initialize() is called:
GROUND_PROPERTIES_CACHE = {
    [GROUND.GRASS] = { name = "grass", walksound = "...", ... },
    [GROUND.ROCKY] = { name = "rocky", walksound = "...", ... },
    -- All other tile types...
}
```

### Helper Functions

**GroundImage(name)**: Returns `"levels/tiles/"..name..".tex"`
**GroundAtlas(name)**: Returns `"levels/tiles/"..name..".xml"`
**AddAssets(assets, layers)**: Processes tile definitions and adds required assets

### Legacy Properties (Deprecated)

**wall**: Legacy wall properties array (use WALL_PROPERTIES directly)
**underground**: Legacy underground layer definitions

## Sound System Integration

The footstep system integrates with multiple game systems:

### Ground Overlay Detection
```lua
-- Snow overlay conditions
local onsnow = not tileinfo.nogroundoverlays and TheWorld.state.snowlevel > 0.15

-- Mud overlay conditions  
local onmud = not tileinfo.nogroundoverlays and TheWorld.state.wetness > 15

-- Ground creep detection
local oncreep = TheWorld.GroundCreep:OnCreep(x, y, z)

-- Road detection (players only for performance)
if isplayer and not oncreep and RoadManager and RoadManager:IsOnRoad(x, 0, z) then
    tile = WORLD_TILES.ROAD
    tileinfo = GetTileInfo(WORLD_TILES.ROAD) or tileinfo
end
```

**Overlay Priority (Highest to Lowest):**
1. **Creep**: Web sounds (`"dontstarve/movement/run_web"`)
2. **Snow**: Tile-specific snow sounds (`tileinfo.snowsound`)
3. **Mud**: Tile-specific mud sounds (`tileinfo.mudsound`)
4. **Road**: Special road tile sounds (players only)
5. **Default**: Standard tile walk/run sounds

### Creature Size Categories
```lua
-- Size detection logic
local size_inst = inst
local isplayer = inst:HasTag("player")

-- Check if player is riding (use mount's size instead)
if isplayer then
    local rider = inst.components.rider or inst.replica.rider
    if rider ~= nil and rider:IsRiding() then
        size_inst = rider:GetMount() or inst
    end
end

-- Size suffix determination
local sizesuffix = 
    (size_inst:HasTag("smallcreature") and "_small") or
    (size_inst:HasTag("largecreature") and "_large") or
    ""
```

**Size Categories:**
- **Small Creatures**: `"smallcreature"` tag → "_small" sound suffix
- **Large Creatures**: `"largecreature"` tag → "_large" sound suffix  
- **Normal Size**: No suffix applied
- **Rider Override**: Players use their mount's size category when riding

### Special Conditions
- **Gel Blob**: Overrides normal footsteps with goop sounds
- **Riding**: Uses mount's size category instead of rider's
- **Platform Walking**: Uses platform-specific sound sets
- **Rope Bridge**: Commented legacy system for parameterized sounds

## Performance Considerations

### Tile Info Caching
- **Initialize**: Call `Initialize()` once during game startup
- **Runtime Lookups**: Use `GetTileInfo()` for O(1) cached access
- **Avoid Legacy**: Don't use `LookupTileInfo()` in performance-critical code

### Asset Loading
- All tile assets are pre-declared during module loading
- Textures and atlases are automatically included in the asset manifest
- No runtime asset loading required for standard tiles

## Integration Examples

### Custom Tile Definition
```lua
-- Add custom tile to GROUND_PROPERTIES
table.insert(GROUND_PROPERTIES, {
    GROUND.CUSTOM_TILE, {
        name = "custom_ground",
        noise_texture = "levels/textures/custom_noise.tex",
        walksound = "dontstarve/movement/walk_custom",
        runsound = "dontstarve/movement/run_custom",
        snowsound = "dontstarve/movement/walk_custom_snow",
        mudsound = "dontstarve/movement/walk_custom_mud"
    }
})
```

### Tile-Based Gameplay Logic
```lua
local function OnPlayerStep(inst)
    local x, y, z = inst.Transform:GetWorldPosition()
    local tile = TheWorld.Map:GetTileAtPoint(x, y, z)
    local tileinfo = GetTileInfo(tile)
    
    if tileinfo then
        -- Apply tile-specific effects
        if tile == GROUND.MARSH then
            -- Slow movement in marsh
            inst.components.locomotor:SetExternalSpeedMultiplier(inst, "marsh", 0.7)
        else
            -- Remove marsh slowdown
            inst.components.locomotor:RemoveExternalSpeedMultiplier(inst, "marsh")
        end
    end
end
```

## Related Modules

- [`constants`](./constants.md): Defines GROUND tile type constants
- [`gamelogic`](./gamelogic.md): Calls Initialize() during game startup
- [`locomotor`](../components/locomotor.md): Uses TempGroundTile() for movement sounds
- [`map`](../map/index.md): Provides tile type lookups for world positions
