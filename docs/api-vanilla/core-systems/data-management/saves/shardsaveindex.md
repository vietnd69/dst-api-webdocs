---
id: shardsaveindex
title: Shard Save Index
description: Multi-shard save slot management system for cluster save organization and data retrieval
sidebar_position: 3
slug: /api-vanilla/core-systems/shardsaveindex
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Shard Save Index

## Version History
| Build Version | Change Date | Change Type | Description |
|---------------|-------------|-------------|-------------|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `ShardSaveIndex` class provides comprehensive management of multi-shard save slots within cluster environments. This system handles save slot organization, shard index caching, character and world data retrieval, server modification management, and automatic migration from legacy save formats. It serves as the primary interface for save game operations in clustered Don't Starve Together installations.

## Class Structure

### ShardSaveIndex Class

**Status:** `stable`

**Description:**
Primary class for managing save slots and their associated shard data across cluster configurations.

**Properties:**
- `version` (number): Save index format version for compatibility
- `slot_cache` (table): Cached shard index instances for performance
- `slots` (table): Available save slots and their types
- `failed_slot_conversions` (table): Slots that failed migration attempts

## Initialization and Basic Operations

### ShardSaveIndex() {#constructor}

**Status:** `stable`

**Description:**
Creates a new ShardSaveIndex instance with version tracking and empty cache structures.

**Parameters:**
None

**Returns:**
- (ShardSaveIndex): New ShardSaveIndex instance

**Example:**
```lua
-- Create new shard save index
local shard_save_index = ShardSaveIndex()

-- Load existing save data
shard_save_index:Load(function(success)
    if success then
        print("Shard save index loaded successfully")
        local slots = shard_save_index:GetValidSlots()
        print("Available slots:", #slots)
    end
end)
```

### ShardSaveIndex:GetShardSaveIndexName() {#get-shard-save-index-name}

**Status:** `stable`

**Description:**
Returns the filename used for storing the shard save index data.

**Parameters:**
None

**Returns:**
- (string): Save index filename

**Example:**
```lua
local filename = shard_save_index:GetShardSaveIndexName()
print("Save index file:", filename)
-- Output: "shardsaveindex"
```

## Shard Index Management

### ShardSaveIndex:GetShardIndex(slot, shard, create_if_missing) {#get-shard-index}

**Status:** `stable`

**Description:**
Retrieves or creates a shard index for the specified slot and shard, with caching for performance optimization.

**Parameters:**
- `slot` (number): Save slot number
- `shard` (string): Shard identifier ("Master", "Caves", etc.)
- `create_if_missing` (boolean): Whether to create new shard if not found

**Returns:**
- (ShardIndex): Shard index instance or nil if not found/invalid

**Example:**
```lua
-- Get master shard for slot 1
local master_shard = shard_save_index:GetShardIndex(1, "Master")
if master_shard then
    local server_data = master_shard:GetServerData()
    print("Server name:", server_data.name)
end

-- Create caves shard if missing
local caves_shard = shard_save_index:GetShardIndex(1, "Caves", true)
if caves_shard then
    print("Caves shard ready")
end

-- Access cached shard index
local cached_master = shard_save_index:GetShardIndex(1, "Master") -- Uses cache
```

## Persistence Operations

### ShardSaveIndex:Save(callback) {#save}

**Status:** `stable`

**Description:**
Saves the shard save index and all cached shard indices to persistent storage.

**Parameters:**
- `callback` (function): Optional callback function called after save completion

**Returns:**
None

**Example:**
```lua
-- Save all changes
shard_save_index:Save(function(success)
    if success then
        print("Shard save index saved successfully")
    else
        print("Failed to save shard save index")
    end
end)

-- Save without callback
shard_save_index:Save()
```

### ShardSaveIndex:Load(callback) {#load}

**Status:** `stable`

**Description:**
Loads shard save index data from persistent storage and performs necessary migrations.

**Parameters:**
- `callback` (function): Optional callback function called after load completion

**Returns:**
None

**Example:**
```lua
-- Load save index
shard_save_index:Load(function(success)
    if success then
        print("Loaded save index")
        
        -- Process available slots
        local slots = shard_save_index:GetValidSlots()
        for _, slot in ipairs(slots) do
            print("Slot", slot, ":", shard_save_index:GetSlotServerData(slot).name)
        end
    else
        print("Failed to load save index")
    end
end)
```

## Slot Management

### ShardSaveIndex:DeleteSlot(slot, callback, save_options) {#delete-slot}

**Status:** `stable`

**Description:**
Deletes a save slot and optionally preserves configuration settings for reuse.

**Parameters:**
- `slot` (number): Slot number to delete
- `callback` (function): Optional callback function
- `save_options` (boolean): Whether to preserve settings

**Returns:**
None

**Example:**
```lua
-- Delete slot completely
shard_save_index:DeleteSlot(3, function(success)
    print("Slot 3 deleted:", success)
end, false)

-- Delete slot but keep settings
shard_save_index:DeleteSlot(3, function(success)
    print("Slot 3 cleared, settings preserved:", success)
end, true)
```

### ShardSaveIndex:GetValidSlots() {#get-valid-slots}

**Status:** `stable`

**Description:**
Returns an array of all valid (non-empty) save slot numbers.

**Parameters:**
None

**Returns:**
- (table): Array of valid slot numbers

**Example:**
```lua
-- Get all valid slots
local valid_slots = shard_save_index:GetValidSlots()
print("Valid slots:", table.concat(valid_slots, ", "))

-- Process each valid slot
for _, slot in ipairs(valid_slots) do
    local server_data = shard_save_index:GetSlotServerData(slot)
    local day = shard_save_index:GetSlotDay(slot)
    print("Slot", slot, "- Day", day, "- Name:", server_data.name)
end
```

### ShardSaveIndex:GetNextNewSlot(force_slot_type) {#get-next-new-slot}

**Status:** `stable`

**Description:**
Finds the next available slot number for creating new saves.

**Parameters:**
- `force_slot_type` (string): Force slot type ("cloud", "local", or nil)

**Returns:**
- (number): Next available slot number

**Example:**
```lua
-- Get next available slot (respects profile setting)
local next_slot = shard_save_index:GetNextNewSlot()
print("Next available slot:", next_slot)

-- Force cloud save slot
local cloud_slot = shard_save_index:GetNextNewSlot("cloud")
print("Next cloud slot:", cloud_slot)

-- Force local save slot
local local_slot = shard_save_index:GetNextNewSlot("local")
print("Next local slot:", local_slot)
```

### ShardSaveIndex:IsSlotEmpty(slot) {#is-slot-empty}

**Status:** `stable`

**Description:**
Checks if a save slot is empty (has no world session data).

**Parameters:**
- `slot` (number): Slot number to check

**Returns:**
- (boolean): `true` if slot is empty, `false` otherwise

**Example:**
```lua
-- Check if slot is empty before using
if shard_save_index:IsSlotEmpty(5) then
    print("Slot 5 is available for new save")
    -- Create new world in slot 5
else
    print("Slot 5 contains existing save")
    local day = shard_save_index:GetSlotDay(5)
    print("Existing save on day:", day)
end
```

### ShardSaveIndex:IsSlotMultiLevel(slot) {#is-slot-multi-level}

**Status:** `stable`

**Description:**
Determines if a save slot contains multiple shard levels (e.g., Forest + Caves).

**Parameters:**
- `slot` (number): Slot number to check

**Returns:**
- (boolean): `true` if slot has multiple levels, `false` otherwise

**Example:**
```lua
-- Check slot configuration
if shard_save_index:IsSlotMultiLevel(1) then
    print("Slot 1 has Forest + Caves")
    
    -- Access both shards
    local master = shard_save_index:GetShardIndex(1, "Master")
    local caves = shard_save_index:GetShardIndex(1, "Caves")
else
    print("Slot 1 has Forest only")
    
    -- Access master shard only
    local master = shard_save_index:GetShardIndex(1, "Master")
end
```

## Data Retrieval Methods

### ShardSaveIndex:GetSlotGameMode(slot) {#get-slot-game-mode}

**Status:** `stable`

**Description:**
Returns the game mode for the specified save slot.

**Parameters:**
- `slot` (number): Slot number

**Returns:**
- (string): Game mode identifier

**Example:**
```lua
-- Get game mode for slot
local game_mode = shard_save_index:GetSlotGameMode(2)
print("Slot 2 game mode:", game_mode)

-- Handle different game modes
if game_mode == "survival" then
    print("Standard survival mode")
elseif game_mode == "wilderness" then
    print("Wilderness mode")
elseif game_mode == "endless" then
    print("Endless mode")
end
```

### ShardSaveIndex:GetSlotServerData(slot) {#get-slot-server-data}

**Status:** `stable`

**Description:**
Returns server configuration data for the specified save slot.

**Parameters:**
- `slot` (number): Slot number

**Returns:**
- (table): Server configuration data

**Example:**
```lua
-- Get server data
local server_data = shard_save_index:GetSlotServerData(1)
print("Server name:", server_data.name)
print("Description:", server_data.description)
print("Max players:", server_data.max_players)
print("Password protected:", server_data.password ~= nil)
```

### ShardSaveIndex:SetSlotServerData(slot, serverdata) {#set-slot-server-data}

**Status:** `stable`

**Description:**
Updates server configuration data for the specified save slot.

**Parameters:**
- `slot` (number): Slot number
- `serverdata` (table): New server configuration

**Returns:**
None

**Example:**
```lua
-- Update server configuration
local new_config = {
    name = "Updated Server Name",
    description = "New server description",
    max_players = 8,
    pvp = false,
    password = "secret123"
}

shard_save_index:SetSlotServerData(1, new_config)
shard_save_index:Save() -- Save changes
```

### ShardSaveIndex:GetSlotGenOptions(slot, shard) {#get-slot-gen-options}

**Status:** `stable`

**Description:**
Returns world generation options for the specified save slot and shard.

**Parameters:**
- `slot` (number): Slot number
- `shard` (string): Shard identifier

**Returns:**
- (table): World generation options

**Example:**
```lua
-- Get master world options
local world_options = shard_save_index:GetSlotGenOptions(1, "Master")
if world_options then
    print("World preset:", world_options.preset)
    print("Season start:", world_options.overrides.season_start)
    print("Day length:", world_options.overrides.day)
end

-- Get caves world options
local caves_options = shard_save_index:GetSlotGenOptions(1, "Caves")
if caves_options then
    print("Caves preset:", caves_options.preset)
end
```

### ShardSaveIndex:SetSlotGenOptions(slot, shard, options) {#set-slot-gen-options}

**Status:** `stable`

**Description:**
Updates world generation options for the specified save slot and shard.

**Parameters:**
- `slot` (number): Slot number
- `shard` (string): Shard identifier
- `options` (table): New world generation options

**Returns:**
None

**Example:**
```lua
-- Update world generation options
local new_options = {
    preset = "SURVIVAL_TOGETHER",
    overrides = {
        season_start = "winter",
        day = "longday",
        deerclops = "often",
        bearger = "rare"
    }
}

shard_save_index:SetSlotGenOptions(1, "Master", new_options)
shard_save_index:Save()
```

## Character and World Information

### ShardSaveIndex:GetSlotCharacter(slot) {#get-slot-character}

**Status:** `stable`

**Description:**
Retrieves the character prefab name for the specified save slot by examining save metadata.

**Parameters:**
- `slot` (number): Slot number

**Returns:**
- (string): Character prefab name or nil

**Example:**
```lua
-- Get character for slot
local character = shard_save_index:GetSlotCharacter(3)
if character then
    print("Slot 3 character:", character)
    
    -- Handle different characters
    if character == "wilson" then
        print("Playing as Wilson")
    elseif character == "willow" then
        print("Playing as Willow")
    end
else
    print("No character data for slot 3")
end
```

### ShardSaveIndex:GetSlotDayAndSeasonText(slot) {#get-slot-day-and-season-text}

**Status:** `stable`

**Description:**
Returns formatted text showing the current day and season for the save slot.

**Parameters:**
- `slot` (number): Slot number

**Returns:**
- (string): Formatted day and season text

**Example:**
```lua
-- Get day and season info
local day_season_text = shard_save_index:GetSlotDayAndSeasonText(1)
print("Save progress:", day_season_text)
-- Output: "Late Summer Day 45" or "Early Spring Day 12"

-- Use in UI display
local function DisplaySaveSlot(slot)
    local server_data = shard_save_index:GetSlotServerData(slot)
    local progress = shard_save_index:GetSlotDayAndSeasonText(slot)
    
    print("Server: " .. server_data.name)
    print("Progress: " .. progress)
end
```

### ShardSaveIndex:GetSlotDay(slot) {#get-slot-day}

**Status:** `stable`

**Description:**
Returns the current day number for the specified save slot.

**Parameters:**
- `slot` (number): Slot number

**Returns:**
- (number): Current day number

**Example:**
```lua
-- Get day number
local day = shard_save_index:GetSlotDay(2)
print("Slot 2 is on day:", day)

-- Sort slots by progression
local slots = shard_save_index:GetValidSlots()
table.sort(slots, function(a, b)
    return shard_save_index:GetSlotDay(a) > shard_save_index:GetSlotDay(b)
end)

print("Slots by progression:")
for _, slot in ipairs(slots) do
    print("Slot", slot, "- Day", shard_save_index:GetSlotDay(slot))
end
```

### ShardSaveIndex:GetSlotPresetText(slot) {#get-slot-preset-text}

**Status:** `stable`

**Description:**
Returns descriptive text about the world configuration preset for the save slot.

**Parameters:**
- `slot` (number): Slot number

**Returns:**
- (string): Preset description text

**Example:**
```lua
-- Get preset description
local preset_text = shard_save_index:GetSlotPresetText(1)
print("Slot 1 configuration:", preset_text)
-- Output: "Forest Only" or "Forest and Caves"

-- Use for save slot selection UI
local function CreateSlotButton(slot)
    local server_data = shard_save_index:GetSlotServerData(slot)
    local preset = shard_save_index:GetSlotPresetText(slot)
    local day = shard_save_index:GetSlotDay(slot)
    
    return {
        title = server_data.name,
        subtitle = preset .. " - Day " .. day
    }
end
```

## Time and Date Methods

### ShardSaveIndex:GetSlotLastTimePlayed(slot) {#get-slot-last-time-played}

**Status:** `stable`

**Description:**
Returns the last time the save slot was played as a timestamp.

**Parameters:**
- `slot` (number): Slot number

**Returns:**
- (number): Unix timestamp of last play time

**Example:**
```lua
-- Get last played time
local last_played = shard_save_index:GetSlotLastTimePlayed(1)
if last_played then
    local date_string = os.date("%Y-%m-%d %H:%M:%S", last_played)
    print("Slot 1 last played:", date_string)
else
    print("No play time data for slot 1")
end

-- Sort slots by recency
local slots = shard_save_index:GetValidSlots()
table.sort(slots, function(a, b)
    local time_a = shard_save_index:GetSlotLastTimePlayed(a) or 0
    local time_b = shard_save_index:GetSlotLastTimePlayed(b) or 0
    return time_a > time_b
end)
```

### ShardSaveIndex:GetSlotDateCreated(slot) {#get-slot-date-created}

**Status:** `stable`

**Description:**
Returns the creation date of the save slot as a timestamp.

**Parameters:**
- `slot` (number): Slot number

**Returns:**
- (number): Unix timestamp of creation date

**Example:**
```lua
-- Get creation date
local created = shard_save_index:GetSlotDateCreated(2)
if created and created > 0 then
    local create_date = os.date("%Y-%m-%d", created)
    print("Slot 2 created on:", create_date)
else
    print("No creation date for slot 2")
end
```

## Server Modification Management

### ShardSaveIndex:GetSlotEnabledServerMods(slot) {#get-slot-enabled-server-mods}

**Status:** `stable`

**Description:**
Returns the enabled server modifications configuration for the specified save slot.

**Parameters:**
- `slot` (number): Slot number

**Returns:**
- (table): Enabled server mods configuration

**Example:**
```lua
-- Get enabled mods for slot
local enabled_mods = shard_save_index:GetSlotEnabledServerMods(1)
for mod_name, mod_data in pairs(enabled_mods) do
    print("Mod:", mod_name)
    print("Enabled:", mod_data.enabled)
    
    if mod_data.configuration_options then
        print("Configuration options:")
        for option, value in pairs(mod_data.configuration_options) do
            print("  " .. option .. " = " .. tostring(value))
        end
    end
end
```

### ShardSaveIndex:SetSlotEnabledServerMods(slot) {#set-slot-enabled-server-mods}

**Status:** `stable`

**Description:**
Updates the enabled server modifications for the specified save slot based on current mod configuration.

**Parameters:**
- `slot` (number): Slot number

**Returns:**
None

**Example:**
```lua
-- Update mods for slot based on current settings
shard_save_index:SetSlotEnabledServerMods(1)
shard_save_index:Save()

-- Enable specific mods programmatically
ModManager:EnableMod("workshop-123456")
KnownModIndex:SetConfigurationOption("workshop-123456", "difficulty", "hard")
shard_save_index:SetSlotEnabledServerMods(1)
```

### ShardSaveIndex:LoadSlotEnabledServerMods(slot) {#load-slot-enabled-server-mods}

**Status:** `stable`

**Description:**
Loads and applies the server modifications configuration from the specified save slot.

**Parameters:**
- `slot` (number): Slot number

**Returns:**
None

**Example:**
```lua
-- Load mods for a specific slot
shard_save_index:LoadSlotEnabledServerMods(3)
print("Loaded server mods for slot 3")

-- Apply slot mods when hosting server
local function HostServer(slot)
    -- Load world configuration
    local server_data = shard_save_index:GetSlotServerData(slot)
    local world_options = shard_save_index:GetSlotGenOptions(slot, "Master")
    
    -- Load mod configuration
    shard_save_index:LoadSlotEnabledServerMods(slot)
    
    -- Start server with configuration
    StartServer(server_data, world_options)
end
```

## Migration and Conversion

### ShardSaveIndex:ForceRetrySlotConversion(slot, skiplegacyconversion) {#force-retry-slot-conversion}

**Status:** `stable`

**Description:**
Forces retry of save slot conversion from legacy format to shard index format.

**Parameters:**
- `slot` (number): Slot number to convert
- `skiplegacyconversion` (boolean): Whether to skip legacy path conversion

**Returns:**
None

**Example:**
```lua
-- Retry failed conversion
shard_save_index:ForceRetrySlotConversion(5, false)

-- Retry without legacy conversion
shard_save_index:ForceRetrySlotConversion(5, true)
```

### ShardSaveIndex:ForceRetryLegacyPathConversion(slot) {#force-retry-legacy-path-conversion}

**Status:** `stable`

**Description:**
Forces retry of legacy session path conversion for the specified slot.

**Parameters:**
- `slot` (number): Slot number

**Returns:**
None

**Example:**
```lua
-- Force legacy path conversion
shard_save_index:ForceRetryLegacyPathConversion(3)
print("Retrying legacy path conversion for slot 3")
```

### ShardSaveIndex:RerunSlotConversion(slot) {#rerun-slot-conversion}

**Status:** `stable`

**Description:**
Reruns the complete slot conversion process from save index to shard index format.

**Parameters:**
- `slot` (number): Slot number to convert

**Returns:**
None

**Example:**
```lua
-- Rerun conversion for slot
shard_save_index:RerunSlotConversion(2)
print("Rerunning conversion for slot 2")
```

## Usage Patterns

### Basic Save Slot Management

```lua
-- Initialize and load save index
local save_index = ShardSaveIndex()
save_index:Load(function(success)
    if success then
        -- List all available saves
        local slots = save_index:GetValidSlots()
        print("Available save slots:")
        
        for _, slot in ipairs(slots) do
            local server_data = save_index:GetSlotServerData(slot)
            local day = save_index:GetSlotDay(slot)
            local preset = save_index:GetSlotPresetText(slot)
            
            print(string.format("Slot %d: %s (Day %d, %s)", 
                slot, server_data.name, day, preset))
        end
    end
end)
```

### Creating New Save Slot

```lua
-- Create new save in next available slot
local function CreateNewSave(server_config, world_config)
    local slot = save_index:GetNextNewSlot()
    print("Creating new save in slot:", slot)
    
    -- Get or create master shard
    local master_shard = save_index:GetShardIndex(slot, "Master", true)
    if master_shard then
        -- Configure server settings
        master_shard:SetServerData(server_config)
        master_shard:SetGenOptions(world_config)
        
        -- Update save index
        save_index:SetSlotServerData(slot, server_config)
        save_index:SetSlotGenOptions(slot, "Master", world_config)
        
        -- Save changes
        save_index:Save()
        
        print("Created new save in slot", slot)
        return slot
    end
    
    return nil
end
```

### Multi-Level World Management

```lua
-- Manage forest + caves configuration
local function SetupMultiLevelWorld(slot)
    -- Create master shard (forest)
    local master_config = {
        preset = "SURVIVAL_TOGETHER",
        overrides = {season_start = "autumn"}
    }
    
    local master = save_index:GetShardIndex(slot, "Master", true)
    master:SetGenOptions(master_config)
    
    -- Create caves shard
    local caves_config = {
        preset = "SURVIVAL_TOGETHER_CAVE",
        overrides = {cave_spiders = "often"}
    }
    
    local caves = save_index:GetShardIndex(slot, "Caves", true)
    caves:SetGenOptions(caves_config)
    
    -- Mark as multi-level
    save_index.slots[slot] = true
    save_index:Save()
    
    print("Set up multi-level world in slot", slot)
end
```

## Data Structures

### Slot Cache Structure

```lua
-- slot_cache structure
{
    [slot_number] = {
        ["Master"] = ShardIndex_instance,
        ["Caves"] = ShardIndex_instance,
        -- Additional shards...
    }
}
```

### Slots Structure

```lua
-- slots structure
{
    [slot_number] = boolean,  -- true for multi-level, false for single-level
    -- Additional slots...
}
```

### Failed Conversions Structure

```lua
-- failed_slot_conversions structure
{
    [slot_number] = true,  -- Slots that failed conversion
    -- Additional failed slots...
}
```

## Constants

### Shard Names

- `"Master"`: Primary world shard
- `"Caves"`: Underground cave shard

### Version Management

- `SHARDSAVEINDEX_VERSION`: Current save index format version (1)

## Integration Points

### ShardIndex Integration

Direct management of individual shard data:

```lua
-- Access shard indices
local master_shard = save_index:GetShardIndex(slot, "Master")
local caves_shard = save_index:GetShardIndex(slot, "Caves")
```

### TheSim Integration

File system operations for save management:

```lua
-- Get available save files
local save_files = TheSim:GetSaveFiles()

-- Cluster storage operations
TheSim:GetPersistentStringInClusterSlot(slot, shard, filename, callback)
```

### ModManager Integration

Server modification management:

```lua
-- Get enabled server mods
local server_mods = ModManager:GetEnabledServerModNames()

-- Load mod configurations
local config = KnownModIndex:LoadModConfigurationOptions(modname)
```

## Related Modules

- [ShardIndex](./shardindex.md): Individual shard data management
- [ShardNetworking](./shardnetworking.md): Inter-shard communication
- [SaveGameIndex](./saveindex.md): Legacy save game management
- [ModManager](../core-systems/index.md#modmanager): Server modification management
- [KnownModIndex](./modindex.md): Mod installation and configuration
