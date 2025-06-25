---
id: saveindex
title: SaveIndex
description: Save game management system for slot-based save data and session handling
sidebar_position: 1
slug: /game-scripts/core-systems/saveindex
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# SaveIndex

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `SaveIndex` class manages save game slots, session data, and save/load operations in Don't Starve Together. It provides a unified interface for handling save data across different game modes, world configurations, and multi-level setups (Master/Caves shards).

## Constants

### SAVEDATA_VERSION

**Value:** `4`

**Description:** Current version number for save data format, used for upgrade compatibility.

## Core Concepts

### Save Slots
The system manages numbered save slots, each containing world options, server configuration, session identifiers, and enabled mod lists.

### Session Management
Each save slot is associated with a unique session identifier that links to the actual world save data files.

### Multi-Level Support
Supports both single-world saves and multi-level cluster saves with separate Master and Caves shards.

### Mod Integration
Tracks enabled server mods and their configuration for each save slot.

## Class Structure

### SaveIndex() {#saveindex-constructor}

**Status:** `stable`

**Description:**
Creates a new SaveIndex instance and initializes the save data structure.

**Example:**
```lua
local saveIndex = SaveIndex()
-- saveIndex is now ready for save/load operations
```

**Initialization Process:**
1. Sets save data version to current `SAVEDATA_VERSION`
2. Creates empty slots table
3. Guarantees minimum number of slots via `GuaranteeMinNumSlots()`
4. Sets current slot to 1

## Instance Methods

### Init() {#init}

**Status:** `stable`

**Description:**
Initializes the SaveIndex with default data structure and ensures minimum slot count.

**Example:**
```lua
local saveIndex = SaveIndex()
saveIndex:Init()
-- Save index is now initialized with default structure
```

### GuaranteeMinNumSlots(numslots) {#guarantee-min-num-slots}

**Status:** `stable`

**Description:**
Ensures the save index has at least the specified number of slots, creating empty slot data as needed.

**Parameters:**
- `numslots` (number): Minimum number of slots required

**Example:**
```lua
saveIndex:GuaranteeMinNumSlots(10)
-- Save index now has at least 10 slots available
```

### GetNumSlots() {#get-num-slots}

**Status:** `stable`

**Description:**
Returns the current number of save slots available.

**Returns:**
- (number): Number of available save slots

**Example:**
```lua
local slotCount = saveIndex:GetNumSlots()
print("Available slots:", slotCount)
```

### Save(callback) {#save}

**Status:** `deprecated in build 676042`

**Description:**
Previously saved the SaveIndex to persistent storage. As of 09/09/2020, SaveIndex saving is deprecated and this function only calls the callback.

**Parameters:**
- `callback` (function|nil): Optional callback function to execute after save

**Example:**
```lua
saveIndex:Save(function()
    print("Save operation completed (deprecated)")
end)
```

### Load(callback) {#load}

**Status:** `stable`

**Description:**
Loads the SaveIndex from persistent storage, upgrading save data format if necessary.

**Parameters:**
- `callback` (function|nil): Optional callback function to execute after load

**Example:**
```lua
saveIndex:Load(function()
    print("Save index loaded successfully")
    -- Access loaded data here
end)
```

**Load Process:**
1. Retrieves persistent string data
2. Validates data integrity
3. Populates slots with loaded data
4. Applies save file upgrades if needed
5. Sets default world options for empty slots

### LoadClusterSlot(slot, shard, callback) {#load-cluster-slot}

**Status:** `stable`

**Description:**
Loads save data for a specific slot and shard in a cluster configuration.

**Parameters:**
- `slot` (number): The save slot number
- `shard` (string): The shard name ("Master" or "Caves")
- `callback` (function|nil): Optional callback function

**Example:**
```lua
saveIndex:LoadClusterSlot(1, "Master", function()
    print("Cluster slot loaded")
end)
```

### GetSaveData(slotnum, cb) {#get-save-data}

**Status:** `stable`

**Description:**
Retrieves the actual world save data for a specific slot, handling both cluster and non-cluster configurations.

**Parameters:**
- `slotnum` (number): The save slot number
- `cb` (function): Callback function that receives the save data

**Example:**
```lua
saveIndex:GetSaveData(1, function(savedata)
    if savedata then
        print("World data loaded for slot 1")
        -- Process world save data
    else
        print("No save data found for slot 1")
    end
end)
```

### DeleteSlot(slot, cb, save_options) {#delete-slot}

**Status:** `stable`

**Description:**
Deletes a save slot, optionally preserving world options and server configuration.

**Parameters:**
- `slot` (number): The save slot number to delete
- `cb` (function|nil): Optional callback function
- `save_options` (boolean): Whether to preserve options after deletion

**Example:**
```lua
-- Delete slot completely
saveIndex:DeleteSlot(3, function()
    print("Slot 3 deleted")
end, false)

-- Delete but preserve world options
saveIndex:DeleteSlot(3, function()
    print("Slot 3 reset but options preserved")
end, true)
```

### SaveCurrent(onsavedcb, isshutdown) {#save-current}

**Status:** `stable`

**Description:**
Saves the current world state to the active save slot. Only functions on server instances.

**Parameters:**
- `onsavedcb` (function|nil): Callback function after save completion
- `isshutdown` (boolean): Whether this save is part of a shutdown process

**Example:**
```lua
-- Regular save
saveIndex:SaveCurrent(function()
    print("World saved successfully")
end, false)

-- Shutdown save
saveIndex:SaveCurrent(function()
    print("World saved for shutdown")
end, true)
```

### StartSurvivalMode(saveslot, customoptions, serverdata, onsavedcb) {#start-survival-mode}

**Status:** `stable`

**Description:**
Initializes a new survival mode save slot with world generation options and server configuration.

**Parameters:**
- `saveslot` (number): The save slot number to initialize
- `customoptions` (table|nil): Custom world generation options
- `serverdata` (table): Server configuration data
- `onsavedcb` (function|nil): Callback function after initialization

**Example:**
```lua
local serverConfig = {
    game_mode = "survival",
    max_players = 6,
    use_cluster_path = true
}

saveIndex:StartSurvivalMode(1, nil, serverConfig, function()
    print("Survival mode initialized for slot 1")
end)
```

**Initialization Process:**
1. Sets session identifier
2. Applies custom or default world options
3. Processes level data overrides
4. Merges worldgen overrides
5. Updates server data

### IsSlotEmpty(slot) {#is-slot-empty}

**Status:** `stable`

**Description:**
Checks whether a save slot is empty (has no session data).

**Parameters:**
- `slot` (number): The save slot number to check

**Returns:**
- (boolean): True if slot is empty, false otherwise

**Example:**
```lua
if saveIndex:IsSlotEmpty(1) then
    print("Slot 1 is available for new game")
else
    print("Slot 1 contains existing save data")
end
```

### IsSlotMultiLevel(slot) {#is-slot-multi-level}

**Status:** `stable`

**Description:**
Determines if a save slot uses multi-level (cluster) configuration with separate Master and Caves worlds.

**Parameters:**
- `slot` (number): The save slot number to check

**Returns:**
- (boolean): True if slot is multi-level, false otherwise

**Example:**
```lua
if saveIndex:IsSlotMultiLevel(1) then
    print("Slot 1 has both surface and caves")
else
    print("Slot 1 has single world only")
end
```

### GetSlotServerData(slot) {#get-slot-server-data}

**Status:** `stable`

**Description:**
Retrieves server configuration data for a specific save slot.

**Parameters:**
- `slot` (number): The save slot number

**Returns:**
- (table): Server configuration data, or empty table if none exists

**Example:**
```lua
local serverData = saveIndex:GetSlotServerData(1)
print("Game mode:", serverData.game_mode or "unknown")
print("Max players:", serverData.max_players or "unknown")
```

### GetSlotGenOptions(slot) {#get-slot-gen-options}

**Status:** `stable`

**Description:**
Returns a deep copy of world generation options for the specified slot.

**Parameters:**
- `slot` (number|nil): The save slot number (uses current slot if nil)

**Returns:**
- (table): Deep copy of world generation options

**Example:**
```lua
local worldOptions = saveIndex:GetSlotGenOptions(1)
for i, levelData in ipairs(worldOptions) do
    print("Level", i, ":", levelData.name)
    print("Overrides:", #levelData.overrides, "settings")
end
```

### GetSlotSession(slot, caves_session) {#get-slot-session}

**Status:** `stable`

**Description:**
Retrieves the session identifier for a save slot, handling multi-level configurations.

**Parameters:**
- `slot` (number|nil): The save slot number (uses current slot if nil)
- `caves_session` (boolean): Whether to get caves session ID in multi-level setup

**Returns:**
- (string|nil): Session identifier, or nil if none exists

**Example:**
```lua
-- Get surface world session
local surfaceSession = saveIndex:GetSlotSession(1, false)

-- Get caves world session  
local cavesSession = saveIndex:GetSlotSession(1, true)

print("Surface session:", surfaceSession)
print("Caves session:", cavesSession)
```

### LoadSlotCharacter(slot) {#load-slot-character}

**Status:** `stable`

**Description:**
Loads the character prefab name for the current user in the specified save slot.

**Parameters:**
- `slot` (number|nil): The save slot number (uses current slot if nil)

**Returns:**
- (string|nil): Character prefab name, or nil if not found

**Example:**
```lua
local character = saveIndex:LoadSlotCharacter(1)
if character then
    print("Player character in slot 1:", character)
else
    print("No character data found for slot 1")
end
```

### SetServerEnabledMods(slot) {#set-server-enabled-mods}

**Status:** `stable`

**Description:**
Saves the currently enabled server mods and their configurations to the specified save slot.

**Parameters:**
- `slot` (number|nil): The save slot number (uses current slot if nil)

**Example:**
```lua
-- Enable some mods through ModManager, then save to slot
ModManager:EnableMod("workshop-12345")
KnownModIndex:SetConfigurationOption("workshop-12345", "setting1", "value1")

saveIndex:SetServerEnabledMods(1)
print("Enabled mods saved to slot 1")
```

### LoadServerEnabledModsFromSlot(slot) {#load-server-enabled-mods-from-slot}

**Status:** `stable`

**Description:**
Loads and applies server mod configurations from the specified save slot.

**Parameters:**
- `slot` (number|nil): The save slot number (uses current slot if nil)

**Example:**
```lua
saveIndex:LoadServerEnabledModsFromSlot(1)
print("Server mods loaded from slot 1")
-- All previously enabled mods are now active with saved configurations
```

## Usage Patterns

### Basic Save/Load Operations
```lua
-- Initialize save system
local saveIndex = SaveIndex()
saveIndex:Load(function()
    print("Save index ready")
    
    -- Check available slots
    for i = 1, saveIndex:GetNumSlots() do
        if saveIndex:IsSlotEmpty(i) then
            print("Slot", i, "is available")
        else
            print("Slot", i, "contains saved game")
        end
    end
end)
```

### Starting New Game
```lua
-- Configure new survival game
local serverConfig = {
    game_mode = "survival",
    max_players = 4,
    pvp = false,
    pause_when_empty = true
}

local worldOptions = GetDefaultWorldOptions(LEVELTYPE.SURVIVAL)

saveIndex:StartSurvivalMode(1, worldOptions, serverConfig, function()
    print("New game started in slot 1")
end)
```

### Multi-Level Save Management
```lua
-- Check if save supports caves
if saveIndex:IsSlotMultiLevel(1) then
    -- Load surface world data
    local surfaceSession = saveIndex:GetSlotSession(1, false)
    
    -- Load caves world data  
    local cavesSession = saveIndex:GetSlotSession(1, true)
    
    print("Surface session:", surfaceSession)
    print("Caves session:", cavesSession)
end
```

### Mod Configuration Management
```lua
-- Save current mod setup to slot
saveIndex:SetServerEnabledMods(3)

-- Later, restore mod setup from slot
saveIndex:LoadServerEnabledModsFromSlot(3)
```

## File Override System

### Level Data Override
The system supports `leveldataoverride.lua` files that completely replace level generation settings:

```lua
-- Example leveldataoverride.lua
return {
    id = "CUSTOM_LEVEL",
    name = "Custom World",
    desc = "A customized world configuration",
    location = "forest",
    overrides = {
        world_size = "huge",
        branching = "most",
        loops = "always"
    }
}
```

### World Generation Override  
The system supports `worldgenoverride.lua` files for partial world setting modifications:

```lua
-- Example worldgenoverride.lua
return {
    override_enabled = true,
    preset = "SURVIVAL_TOGETHER",
    overrides = {
        world_size = "large",
        season_start = "autumn",
        day = "longday"
    }
}
```

## Integration with Game Systems

### Session Management
- Integrates with `TheNet:GetSessionIdentifier()` for unique session tracking
- Handles session file paths for both legacy and cluster configurations
- Supports session metadata for quick world information access

### World Generation
- Coordinates with world generation system for applying overrides
- Manages preset data and custom world configurations
- Handles upgrade paths for world generation format changes

### Cluster Support
- Manages Master/Caves shard coordination
- Handles cross-shard session data sharing
- Supports cluster-specific file path management

## Performance Considerations

### File I/O Operations
- Uses asynchronous file operations with callbacks
- Implements lazy loading for slot data
- Caches frequently accessed data during session

### Memory Management
- Uses deep copying for world options to prevent shared references
- Cleans up temporary data after operations
- Manages slot data efficiently across multiple shards

## Error Handling

### Data Validation
The system includes comprehensive validation for:
- Save data integrity checks
- Version compatibility verification
- Required field presence validation
- Corrupted file recovery

### Common Error Scenarios
```lua
-- Handle missing save data
saveIndex:GetSaveData(1, function(savedata)
    if not savedata then
        print("No save data found - slot may be corrupted")
        -- Handle empty slot or corruption
    end
end)

-- Validate world options
local worldOptions = saveIndex:GetSlotGenOptions(1)
if not worldOptions or #worldOptions == 0 then
    print("Invalid world options - using defaults")
    worldOptions = GetDefaultWorldOptions(LEVELTYPE.SURVIVAL)
end
```

## Related Systems

- [Save File Upgrades](./savefileupgrades.md): Handles version compatibility and data migration
- [Shard Index](./shardindex.md): Manages individual shard save data in cluster configurations
- [World Generation](./worldgen.md): Provides world creation and customization systems
- [Mod Manager](./modmanager.md): Handles server mod enablement and configuration
- [Session Management](./networking.md): Manages network sessions and multiplayer coordination

## Migration and Upgrades

The SaveIndex system automatically handles migration from older save formats:

### Legacy Save Migration
- Converts single-world saves to cluster format when needed
- Migrates mod configuration from legacy formats
- Preserves world generation settings across format changes

### Version Upgrade Process
```lua
-- Automatic upgrade during load
saveIndex:Load(function()
    -- System automatically applies upgrades based on save version
    -- UpgradeSavedLevelData() converts older world option formats
    -- Version-specific migrations preserve backward compatibility
    print("Save data upgraded to current version")
end)
```

## Technical Implementation Notes

### Data Structure Format
```lua
-- SaveIndex data structure
{
    version = 4,  -- SAVEDATA_VERSION
    slots = {
        [1] = {
            world = {
                options = {
                    [1] = { -- Surface world options
                        id = "SURVIVAL_TOGETHER",
                        name = "Default World",
                        overrides = { -- World generation settings
                            world_size = "default",
                            branching = "default"
                        }
                    },
                    [2] = { -- Caves world options (if multi-level)
                        id = "DST_CAVE",
                        name = "The Caves"
                    }
                }
            },
            server = {
                game_mode = "survival",
                max_players = 6,
                use_cluster_path = true
            },
            session_id = "unique_session_identifier",
            enabled_mods = {
                ["workshop-12345"] = {
                    enabled = true,
                    configuration_options = {
                        setting1 = "value1"
                    }
                }
            }
        }
    },
    last_used_slot = 1
}
