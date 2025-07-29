---
id: worldgen-main
title: World Generation Main
description: Core world generation system for creating game worlds with terrain, entities, and set pieces
sidebar_position: 1

last_updated: 2025-06-25
build_version: 676312
change_status: modified in build 676312
---

# World Generation Main

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|---|
| 676312 | 2025-06-25 | modified | Added ValidateLineNumber utility function |
| 676042 | 2025-06-21 | stable | Previous version |

## Overview

The `worldgen_main` module serves as the core world generation system for Don't Starve Together. It orchestrates the entire world creation process including terrain generation, entity placement, set piece distribution, and mod integration. This module is executed in a specialized world generation environment separate from the main game runtime.

## Usage Example

```lua
-- World generation is typically initiated through game parameters
local world_gen_data = {
    level_type = "SURVIVAL_TOGETHER",
    level_data = level_definition,
    show_debug = false
}

-- Generate new world with specified parameters
local savedata = GenerateNew(false, world_gen_data)
```

## Global Variables

### SEED {#seed}

**Type:** `number`

**Status:** `stable`

**Description:**
The world generation seed used for reproducible random number generation. Automatically set based on system time if not provided.

**Example:**
```lua
-- Seed is automatically generated
print("Current world seed:", SEED)

-- Or manually set for testing
SEED = 1234567890
SEED = SetWorldGenSeed(SEED)
```

### WORLDGEN_MAIN {#worldgen-main}

**Type:** `number`

**Status:** `stable`

**Description:**
Flag indicating that the code is running in world generation context (value: 1).

### POT_GENERATION {#pot-generation}

**Type:** `boolean`

**Status:** `stable`

**Description:**
Flag for pottery generation mode (default: false).

## Functions

### SetWorldGenSeed(seed) {#set-worldgen-seed}

**Status:** `stable`

**Description:**
Sets the random seed for world generation. If no seed is provided, generates one based on current system time using a reversed timestamp method.

**Parameters:**
- `seed` (number, optional): The seed value to use. If nil, generates from system time

**Returns:**
- (number): The seed value that was set

**Implementation:**
```lua
function SetWorldGenSeed(seed)
    if seed == nil then
        seed = tonumber(tostring(os.time()):reverse():sub(1,6))
    end

    math.randomseed(seed)
    math.random()

    return seed
end
```

**Example:**
```lua
-- Generate automatic seed from system time
local seed = SetWorldGenSeed()
print("Generated seed:", seed)

-- Use specific seed for reproducible generation
local specific_seed = SetWorldGenSeed(1234567890)

-- Global seed is automatically set during module load
SEED = SetWorldGenSeed(SEED)
print("SEED = ", SEED)
```

**Seed Generation Method:**
1. **Time Retrieval**: Gets current system time with `os.time()`
2. **String Conversion**: Converts to string representation
3. **Reversal**: Reverses the string to get different distribution
4. **Truncation**: Takes first 6 characters for manageable seed size
5. **Number Conversion**: Converts back to number for use as seed

**Version History:**
- Current implementation in build 676042

### GenerateNew(debug, world_gen_data) {#generate-new}

**Status:** `stable`

**Description:**
Generates a new world with the specified parameters. This is the main entry point for world creation, handling level selection, task assignment, set piece placement, and entity injection.

**Parameters:**
- `debug` (boolean): Whether to enable debug mode (uses special task set)
- `world_gen_data` (table): World generation configuration containing level type and data

**Returns:**
- (table): Complete world save data with serialized entities and map information
- (nil): If generation fails after maximum retries

**World Gen Data Structure:**
```lua
world_gen_data = {
    level_type = "SURVIVAL_TOGETHER",  -- Game mode
    level_data = {                     -- Level configuration
        id = "SURVIVAL_TOGETHER",
        name = "Default",
        location = "forest",
        overrides = {},                -- World setting overrides
        -- Additional level properties...
    },
    show_debug = false,                -- Whether to show debug visualization
    DLCEnabled = {}                    -- Enabled DLC content
}
```

**Example:**
```lua
local world_data = {
    level_type = "SURVIVAL_TOGETHER",
    level_data = {
        id = "SURVIVAL_TOGETHER",
        name = "Standard World",
        location = "forest",
        overrides = {
            worldsize = "default",
            monsters = "default",
            resources = "default"
        }
    },
    show_debug = false
}

local savedata = GenerateNew(false, world_data)
if savedata then
    print("World generation successful!")
    print("Map size:", savedata.map.width, "x", savedata.map.height)
end
```

**Generation Process:**
1. **Parameter Validation**: Validates world generation parameters
2. **Level Creation**: Creates Level object from level data
3. **Prefab Selection**: Determines world location prefab
4. **Task Assignment**: Chooses tasks for level generation
5. **Set Piece Addition**: Adds boons, traps, points of interest
6. **Map Generation**: Creates terrain and topology
7. **Entity Injection**: Places world entities and objects
8. **Metadata Recording**: Adds build version and mod information
9. **Data Serialization**: Converts to save data format

**Version History:**
- Current implementation in build 676042

### PROFILE_world_gen(debug) {#profile-world-gen}

**Status:** `stable`

**Description:**
Generates a world with performance profiling enabled. Outputs detailed timing information to profile.txt file.

**Parameters:**
- `debug` (boolean): Whether to enable debug mode during profiling

**Returns:**
- (table): World save data with profiling information

**Example:**
```lua
-- Generate world with profiling
local profiled_data = PROFILE_world_gen(false)
-- Check profile.txt for timing details
```

**Version History:**
- Current implementation in build 676042

### ShowDebug(savedata) {#show-debug}

**Status:** `stable`

**Description:**
Displays debug visualization of generated world entities. Shows entity positions and special data like wormhole connections.

**Parameters:**
- `savedata` (table): Complete world save data to visualize

**Returns:**
None

**Example:**
```lua
-- Show debug visualization after generation
if savedata then
    ShowDebug(savedata)
end
```

**Debug Information Displayed:**
- Entity positions scaled to map coordinates
- Wormhole target connections
- Set piece placements
- Special entity data

**Version History:**
- Current implementation in build 676042

### CheckMapSaveData(savedata) {#check-map-savedata}

**Status:** `stable`

**Description:**
Validates that generated save data contains all required map components. Throws assertions if critical data is missing.

**Parameters:**
- `savedata` (table): World save data to validate

**Returns:**
None (throws assertion on failure)

**Validation Checks:**
- Map structure exists
- Map prefab is set
- Tile data is present
- Map dimensions are defined
- Topology information exists
- Entity list is present

**Example:**
```lua
-- Validate generated world data
CheckMapSaveData(savedata)
print("Map validation passed!")
```

**Version History:**
- Current implementation in build 676042

### ValidateLineNumber(num) {#validate-line-number}

**Status:** `added in build 676312`

**Description:**
A placeholder utility function that provides a consistent API for line number validation across different execution contexts. In the world generation environment, this function performs no operations but maintains compatibility with debugging tools that may call it.

**Parameters:**
- `num` (number): Line number to validate (parameter is ignored)

**Returns:**
- (void): No return value

**Implementation:**
```lua
function ValidateLineNumber(num)
    --do nothing
end
```

**Purpose:**
This function serves as a compatibility shim for debugging and development tools that expect line number validation functionality. While it performs no actual validation in the world generation context, it prevents errors when debugging tools attempt to call it.

**Example:**
```lua
-- Called by debugging tools, but does nothing in worldgen
ValidateLineNumber(42)

-- Safe to call without effect
local line_num = 100
ValidateLineNumber(line_num)
```

**Version History:**
- Added in build 676312 for debugging tool compatibility

## Set Piece Management

### AddSetPeices(level) {#add-set-pieces}

**Status:** `stable`

**Description:**
Adds set pieces (special structures and points of interest) to the level based on world setting overrides.

**Parameters:**
- `level` (Level): The level object to modify

**Returns:**
None (modifies level object)

**Set Piece Types:**
- **Boons**: Beneficial structures and resources
- **Traps**: Dangerous areas and obstacles
- **Points of Interest**: Special locations and landmarks
- **Protected Resources**: Guarded valuable areas
- **Touchstones**: Resurrection structures

**Override Settings:**
```lua
level.overrides = {
    boons = "default",        -- never/rare/default/often/always
    traps = "default",        -- never/rare/default/often/always
    poi = "default",          -- never/rare/default/often/always
    protected = "default",    -- never/rare/default/often/always
    touchstone = "default"    -- never/rare/default/often/always
}
```

**Example:**
```lua
local level = Level(level_data)
AddSetPeices(level)
print("Set pieces added based on overrides")
```

## Utility Functions

### LoadParametersAndGenerate(debug) {#load-parameters-and-generate}

**Status:** `stable`

**Description:**
Loads world generation parameters from global GEN_PARAMETERS and initiates world generation.

**Parameters:**
- `debug` (boolean): Whether to enable debug mode

**Returns:**
- (table): Serialized world save data

**Parameter Loading:**
- Decodes JSON parameters from GEN_PARAMETERS global
- Sets DLC enabled status
- Validates parameter completeness
- Initiates generation process

**Example:**
```lua
-- Parameters are typically set externally
GEN_PARAMETERS = json.encode(world_gen_data)
local result = LoadParametersAndGenerate(false)
```

### Platform Detection Functions

**Status:** `stable`

**Description:**
Platform detection utilities for platform-specific world generation behavior. These functions check the global PLATFORM variable to determine the current platform.

**Implementation:**
```lua
function IsConsole()
    return (PLATFORM == "PS4") or (PLATFORM == "XBONE")
end

function IsNotConsole()
    return not IsConsole()
end

function IsPS4()
    return (PLATFORM == "PS4")
end

function IsPS5()
    return (PLATFORM == "PS5")
end

function IsXB1()
    return (PLATFORM == "XBONE")
end

function IsSteam()
    return PLATFORM == "WIN32_STEAM" or PLATFORM == "LINUX_STEAM" or PLATFORM == "OSX_STEAM"
end

function IsLinux()
    return PLATFORM == "LINUX_STEAM"
end

function IsRail()
    return PLATFORM == "WIN32_RAIL"
end

function IsSteamDeck()
    return IS_STEAM_DECK
end
```

**Platform Constants:**
- **Console Platforms**: `"PS4"`, `"PS5"`, `"XBONE"`
- **Steam Platforms**: `"WIN32_STEAM"`, `"LINUX_STEAM"`, `"OSX_STEAM"`
- **Other Platforms**: `"WIN32_RAIL"` (WeGame)
- **Special**: `IS_STEAM_DECK` global variable for Steam Deck detection

**Example:**
```lua
if IsConsole() then
    -- Apply console-specific generation settings
    max_entities = 1000
    print("Console platform detected:", PLATFORM)
else
    -- PC can handle more entities  
    max_entities = 2000
    print("PC platform detected:", PLATFORM)
end

-- Platform-specific optimizations
if IsSteam() then
    -- Steam-specific features
    enable_steam_workshop = true
elseif IsRail() then
    -- WeGame platform adjustments
    enable_rail_features = true
end
```

## Environment Setup

### Package Path Configuration

The module configures custom package loading for the world generation environment:

```lua
package.path = "scripts\\?.lua;scriptlibs\\?.lua"
package.assetpath = {}
```

### Custom Module Loader

Implements specialized module loading for mod support and asset management:

- **Mod Manifest Support**: Loads mods with proper manifest paths
- **Asset Path Resolution**: Resolves script paths for different platforms
- **Fallback Loading**: Uses kleiloadlua for custom file loading

### Required Dependencies

The module loads essential systems for world generation:

- **Core Systems**: util, class, vector3, constants, tuning
- **Map Systems**: tasks, levels, rooms, tasksets, forest_map
- **Mod Support**: mods, modindex, mod data handling
- **Data Processing**: json, dumper, savefileupgrades

## Error Handling

### Generation Retry Logic

```lua
local try = 1
local maxtries = 5

while savedata == nil do
    savedata = forest_map.Generate(...)
    
    if savedata == nil then
        if try >= maxtries then
            print("World generation failed after", maxtries, "attempts")
            return nil
        else
            print("Retrying world generation, attempt", try, "of", maxtries)
        end
        try = try + 1
        collectgarbage("collect")
        WorldSim:ResetAll()
    end
end
```

### Memory Management

- **Garbage Collection**: Forces collection between retry attempts
- **WorldSim Reset**: Clears simulation state for clean retries
- **Resource Cleanup**: Manages memory during intensive generation

## Save Data Structure

### Generated Save Data Format

```lua
savedata = {
    map = {
        prefab = "forest",           -- World location
        width = 1024,               -- Map width in tiles
        height = 1024,              -- Map height in tiles
        tiles = {...},              -- Tile type array
        topology = {...},           -- Room and connection data
        name = "Standard World",    -- Level display name
        hideminimap = false        -- Minimap visibility
    },
    ents = {                       -- Entity placement data
        ["prefab_name"] = {        -- Array of entity instances
            {x = 100, z = 200, data = {...}},
            -- Additional instances...
        }
    },
    meta = {                       -- Generation metadata
        build_version = "676042",
        build_date = "2025-06-21",
        seed = 1234567890,
        level_id = "SURVIVAL_TOGETHER",
        session_identifier = "unique_id"
    },
    mods = {...}                   -- Mod configuration data
}
```

### Data Serialization

- **Pretty Printing**: Development builds use formatted output
- **Entity Separation**: Entities serialized individually for efficiency
- **Metadata Tracking**: Records build version and generation parameters

## Performance Considerations

### Generation Optimization
- **Retry Mechanism**: Handles generation failures gracefully
- **Memory Management**: Clears resources between attempts
- **Profiling Support**: Built-in performance analysis tools

### Map Size Limits
- **Default Size**: 1024x1024 tiles for standard worlds
- **Memory Constraints**: Balanced for different platforms
- **Entity Density**: Optimized placement algorithms

## Related Modules

- [`forest_map`](../map/forest_map.md): Core map generation algorithms
- [`levels`](../map/levels.md): Level definition and configuration
- [`tasks`](../map/tasks.md): World generation task system
- [`rooms`](../map/rooms.md): Room placement and connectivity
- [`worldentities`](./worldentities.md): World entity injection system
- [`mods`](./mods.md): Mod loading and integration system

## Recent Changes

### Build 676312 Utility Addition

A new utility function was added to support debugging and development workflows:

#### ValidateLineNumber Function
```lua
function ValidateLineNumber(num)
    --do nothing
end
```

**Purpose:** This placeholder function provides a consistent API for line number validation across different execution contexts. In the world generation environment, it performs no operations but maintains compatibility with debugging tools that may call it.
