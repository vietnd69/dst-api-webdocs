---
id: dlcsupport-worldgen
title: DLC Support Worldgen
description: DLC support system specialized for world generation with parameter-based DLC state management
sidebar_position: 3
slug: game-scripts/core-systems/dlcsupport-worldgen
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# DLC Support Worldgen

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `dlcsupport_worldgen` module provides a specialized DLC support system for world generation contexts. It uses JSON parameters to configure DLC states and provides simplified DLC checking functionality during the world generation process.

## Usage Example

```lua
-- Check if Reign of Giants is enabled during worldgen
if IsDLCEnabled(REIGN_OF_GIANTS) then
    -- Include RoG-specific world generation features
    AddRogBiomes()
end

-- Set DLC state from parameters
SetDLCEnabled({REIGN_OF_GIANTS = true})
```

## Constants

### DLC Identifiers

#### MAIN_GAME

**Value:** `0`

**Status:** `stable`

**Description:**
Identifier for the base game (no DLC).

#### REIGN_OF_GIANTS

**Value:** `1`

**Status:** `stable`

**Description:**
Identifier for the Reign of Giants DLC.

### DLC Configuration Tables

#### NO_DLC_TABLE

**Value:** `{REIGN_OF_GIANTS=false}`

**Status:** `stable`

**Description:**
Table representing no DLC enabled state for world generation.

#### ALL_DLC_TABLE

**Value:** `{REIGN_OF_GIANTS=true}`

**Status:** `stable`

**Description:**
Table representing all DLC enabled state for world generation.

#### DLC_LIST

**Value:** `{REIGN_OF_GIANTS}`

**Status:** `stable`

**Description:**
Array of all available DLC identifiers for world generation.

## Functions

### IsDLCEnabled(index) {#isdlcenabled}

**Status:** `stable`

**Description:**
Checks if a specific DLC is enabled in the current world generation context.

**Parameters:**
- `index` (number): DLC index to check

**Returns:**
- (boolean): true if DLC is enabled, false if disabled or not set

**Example:**
```lua
-- Check DLC state during world generation
if IsDLCEnabled(REIGN_OF_GIANTS) then
    print("Generating world with Reign of Giants content")
    -- Add seasonal giants
    AddSeasonalGiants()
    -- Include additional biomes
    AddDesertBiome()
else
    print("Generating base game world")
end
```

### SetDLCEnabled(tbl) {#setdlcenabled}

**Status:** `stable`

**Description:**
Sets the DLC enabled state table for world generation. Accepts a table mapping DLC indices to boolean values.

**Parameters:**
- `tbl` (table): Table mapping DLC indices to enabled states (defaults to empty table)

**Example:**
```lua
-- Enable Reign of Giants for world generation
SetDLCEnabled({
    [REIGN_OF_GIANTS] = true
})

-- Disable all DLC
SetDLCEnabled({})

-- Or explicitly disable
SetDLCEnabled({
    [REIGN_OF_GIANTS] = false
})
```

## Global Variables

### GEN_PARAMETERS

**Type:** `string` (JSON)

**Status:** `stable`

**Description:**
JSON string containing world generation parameters, including DLC enabled states. This is typically set by the world generation system.

**Structure:**
```json
{
    "DLCEnabled": {
        "1": true
    }
}
```

## Initialization

The module automatically initializes DLC state from the `GEN_PARAMETERS` global:

```lua
local parameters = json.decode(GEN_PARAMETERS or {})
SetDLCEnabled(parameters.DLCEnabled)
```

## Internal Variables

### __DLCEnabledTable

**Type:** `table`

**Status:** `stable` (internal)

**Description:**
Internal table storing the current DLC enabled states. Modified by `SetDLCEnabled()` and read by `IsDLCEnabled()`.

## Complete Example

```lua
-- World generation with DLC support
print("Starting world generation...")

-- Check initial DLC state
print("DLC enabled:", IsDLCEnabled(REIGN_OF_GIANTS))

-- Example world generation logic
function GenerateWorld()
    local world_config = {
        biomes = {"forest", "grassland", "savanna"},
        creatures = {"rabbit", "beefalo", "spider"},
        resources = {"flint", "gold", "logs"}
    }
    
    -- Add DLC content if enabled
    if IsDLCEnabled(REIGN_OF_GIANTS) then
        print("Adding Reign of Giants content to world...")
        
        -- Add DLC biomes
        table.insert(world_config.biomes, "desert")
        table.insert(world_config.biomes, "deciduous")
        
        -- Add DLC creatures
        table.insert(world_config.creatures, "volt_goat")
        table.insert(world_config.creatures, "catcoon")
        
        -- Add DLC resources
        table.insert(world_config.resources, "cactus")
        table.insert(world_config.resources, "tumbleweeds")
        
        -- Add seasonal giants
        world_config.giants = {
            autumn = "bearger",
            winter = "deerclops", 
            spring = "moose_goose",
            summer = "dragonfly"
        }
    else
        print("Generating base game world only")
        
        -- Base game giants only
        world_config.giants = {
            winter = "deerclops"
        }
    end
    
    return world_config
end

-- Generate world with current DLC settings
local world = GenerateWorld()

-- Example of dynamic DLC configuration
function ConfigureWorldDLC(enable_rog)
    local dlc_config = {}
    if enable_rog then
        dlc_config[REIGN_OF_GIANTS] = true
    else
        dlc_config[REIGN_OF_GIANTS] = false
    end
    
    SetDLCEnabled(dlc_config)
    print("DLC configuration updated. RoG enabled:", IsDLCEnabled(REIGN_OF_GIANTS))
end

-- Test different configurations
ConfigureWorldDLC(true)   -- Enable RoG
local rog_world = GenerateWorld()

ConfigureWorldDLC(false)  -- Disable RoG  
local base_world = GenerateWorld()

print("Base world biomes:", #base_world.biomes)
print("RoG world biomes:", #rog_world.biomes)
```

## JSON Parameter Integration

The module integrates with the world generation parameter system:

```lua
-- Example GEN_PARAMETERS JSON structure
GEN_PARAMETERS = [[{
    "DLCEnabled": {
        "1": true
    },
    "world_size": "default",
    "season_length": "default",
    "day_length": "default"
}]]

-- The module automatically parses this on load
local parameters = json.decode(GEN_PARAMETERS or {})
SetDLCEnabled(parameters.DLCEnabled)
```

## Worldgen-Specific Considerations

This module is specifically designed for world generation contexts:

1. **Simplified State Management**: Uses a simple boolean table instead of full DLC registration
2. **Parameter-Driven**: DLC state comes from world generation parameters
3. **JSON Integration**: Seamlessly integrates with JSON-based parameter systems
4. **Lightweight**: Minimal overhead for world generation performance

## Differences from Main DLC Support

| Feature | dlcsupport.lua | dlcsupport_worldgen.lua |
|---------|---------------|------------------------|
| DLC Registration | Full registration system | Parameter-based only |
| Character Lists | Multiple character list functions | Not applicable |
| Prefab Loading | Automatic prefab registration | Not included |
| State Persistence | Uses game systems | Uses parameter table |
| Initialization | Complex setup functions | Simple JSON parsing |

## Related Modules

- [DLC Support](./dlcsupport.md): Main DLC management system
- [DLC Support Strings](./dlcsupport_strings.md): DLC string support
- [JSON](./json.md): JSON parsing utilities
- [Map Generation](../map/): World generation systems
