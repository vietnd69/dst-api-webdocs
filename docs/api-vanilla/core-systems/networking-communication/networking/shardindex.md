---
id: shardindex
title: Shard Index
description: Cluster shard management system for server data persistence and world generation configuration
sidebar_position: 5
slug: /api-vanilla/core-systems/shardindex
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Shard Index

## Version History
| Build Version | Change Date | Change Type | Description |
|---------------|-------------|-------------|-------------|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `ShardIndex` class provides comprehensive management of cluster shard data, including world generation options, server configuration, session management, and mod settings. This system enables persistent storage and retrieval of shard-specific information across game sessions and handles data migration between different save format versions.

## Class Structure

### ShardIndex Class

**Status:** `stable`

**Description:**
Core class for managing shard data within a cluster environment, supporting both master and non-master shards.

**Properties:**
- `ismaster` (boolean): Whether this shard is the master shard
- `slot` (number): Cluster slot number for save file organization
- `shard` (string): Shard identifier (e.g., "Master", "Caves")
- `version` (number): Save data format version for compatibility
- `world` (table): World generation options and settings
- `server` (table): Server configuration data
- `session_id` (string): Current session identifier
- `enabled_mods` (table): Enabled server modifications

## Initialization and Basic Management

### ShardIndex() {#constructor}

**Status:** `stable`

**Description:**
Creates a new ShardIndex instance with default values and initializes data structures.

**Parameters:**
None

**Returns:**
- (ShardIndex): New ShardIndex instance

**Example:**
```lua
-- Create new shard index
local shard_index = ShardIndex()

-- Check if it's a master shard
if shard_index:IsMasterShardIndex() then
    print("This is the master shard")
end
```

### ShardIndex:GetShardIndexName() {#get-shard-index-name}

**Status:** `stable`

**Description:**
Returns the filename used for storing shard index data.

**Parameters:**
None

**Returns:**
- (string): Filename for shard index storage

**Example:**
```lua
local filename = shard_index:GetShardIndexName()
print("Shard data stored in:", filename)
-- Output: "shardindex"
```

## Persistence Operations

### ShardIndex:Save(callback) {#save}

**Status:** `stable`

**Description:**
Saves current shard data to persistent storage, encoding all world options, server settings, and mod configurations.

**Parameters:**
- `callback` (function): Optional callback function called after save completion

**Returns:**
None

**Example:**
```lua
-- Save shard data with callback
shard_index:Save(function(success)
    if success then
        print("Shard data saved successfully")
    else
        print("Failed to save shard data")
    end
end)

-- Save without callback
shard_index:Save()
```

### ShardIndex:Load(callback) {#load}

**Status:** `stable`

**Description:**
Loads shard data from persistent storage, handling different server types and validating data integrity.

**Parameters:**
- `callback` (function): Optional callback function called after load completion

**Returns:**
None

**Example:**
```lua
-- Load shard data
shard_index:Load(function(success)
    if success then
        print("Shard data loaded successfully")
        local world_options = shard_index:GetGenOptions()
        print("World preset:", world_options.preset)
    else
        print("Failed to load shard data")
    end
end)
```

### ShardIndex:LoadShardInSlot(slot, shard, callback) {#load-shard-in-slot}

**Status:** `stable`

**Description:**
Loads specific shard data from a designated cluster slot and shard identifier.

**Parameters:**
- `slot` (number): Cluster slot number
- `shard` (string): Shard identifier
- `callback` (function): Optional callback function

**Returns:**
None

**Example:**
```lua
-- Load caves shard from slot 1
shard_index:LoadShardInSlot(1, "Caves", function(success)
    if success then
        print("Caves shard loaded from slot 1")
    end
end)

-- Load master shard from specific slot
shard_index:LoadShardInSlot(3, "Master", function(success)
    print("Master shard load result:", success)
end)
```

## Session and Save Data Management

### ShardIndex:GetSaveData(callback) {#get-save-data}

**Status:** `stable`

**Description:**
Retrieves world save data for the current session, handling both cluster and legacy save paths.

**Parameters:**
- `callback` (function): Callback function receiving save data

**Returns:**
None

**Example:**
```lua
-- Get current save data
shard_index:GetSaveData(function(savedata)
    if savedata then
        print("World version:", savedata.version)
        print("Entity count:", #savedata.ents)
    else
        print("No save data found")
    end
end)
```

### ShardIndex:SaveCurrent(onsavedcb, isshutdown) {#save-current}

**Status:** `stable`

**Description:**
Saves the current world state and updates session information. Only available on server instances.

**Parameters:**
- `onsavedcb` (function): Optional callback function called after save completion
- `isshutdown` (boolean): Whether this save is part of server shutdown

**Returns:**
None

**Example:**
```lua
-- Regular world save
shard_index:SaveCurrent(function(success)
    print("World save completed:", success)
end, false)

-- Shutdown save
shard_index:SaveCurrent(function(success)
    print("Shutdown save completed:", success)
    -- Can safely exit now
end, true)
```

### ShardIndex:OnGenerateNewWorld(savedata, metadataStr, session_identifier, callback) {#on-generate-new-world}

**Status:** `stable`

**Description:**
Handles initial world generation and serializes new world data with session information.

**Parameters:**
- `savedata` (table): Generated world data
- `metadataStr` (string): World metadata information
- `session_identifier` (string): Unique session identifier
- `callback` (function): Optional callback function

**Returns:**
None

**Example:**
```lua
-- Generate new world with custom settings
local world_data = GenerateWorld(world_options)
local metadata = CreateWorldMetadata(world_options)
local session_id = CreateSessionIdentifier()

shard_index:OnGenerateNewWorld(world_data, metadata, session_id, function(success)
    if success then
        print("New world generated and saved")
    end
end)
```

## Cluster and Shard Management

### ShardIndex:NewShardInSlot(slot, shard) {#new-shard-in-slot}

**Status:** `stable`

**Description:**
Initializes a new shard configuration in the specified cluster slot.

**Parameters:**
- `slot` (number): Cluster slot number
- `shard` (string): Shard identifier

**Returns:**
None

**Example:**
```lua
-- Create new master shard in slot 1
shard_index:NewShardInSlot(1, "Master")

-- Create new caves shard in slot 2
shard_index:NewShardInSlot(2, "Caves")

-- Verify shard creation
print("Is master:", shard_index:IsMasterShardIndex())
print("Slot:", shard_index:GetSlot())
print("Shard:", shard_index:GetShard())
```

### ShardIndex:Delete(callback, save_options) {#delete}

**Status:** `stable`

**Description:**
Deletes shard data while optionally preserving configuration settings for reuse.

**Parameters:**
- `callback` (function): Optional callback function
- `save_options` (boolean): Whether to preserve settings for future use

**Returns:**
None

**Example:**
```lua
-- Delete shard but keep settings
shard_index:Delete(function(success)
    print("Shard deleted, settings preserved")
end, true)

-- Complete deletion
shard_index:Delete(function(success)
    print("Shard completely deleted")
end, false)
```

## World Configuration Management

### ShardIndex:SetServerShardData(customoptions, serverdata, onsavedcb) {#set-server-shard-data}

**Status:** `stable`

**Description:**
Configures shard with world generation options and server settings, applying overrides and validating configuration.

**Parameters:**
- `customoptions` (table): Custom world generation options
- `serverdata` (table): Server configuration data
- `onsavedcb` (function): Optional callback function

**Returns:**
None

**Example:**
```lua
-- Configure world with custom settings
local world_options = {
    preset = "SURVIVAL_TOGETHER",
    overrides = {
        season_start = "autumn",
        day = "longday",
        deerclops = "often"
    }
}

local server_config = {
    name = "My DST Server",
    description = "Custom configured server",
    game_mode = "survival",
    max_players = 6
}

shard_index:SetServerShardData(world_options, server_config, function(success)
    if success then
        print("Shard configured successfully")
    end
end)
```

## Data Access Methods

### ShardIndex:GetServerData() {#get-server-data}

**Status:** `stable`

**Description:**
Returns current server configuration data.

**Parameters:**
None

**Returns:**
- (table): Server configuration data

**Example:**
```lua
local server_info = shard_index:GetServerData()
print("Server name:", server_info.name)
print("Max players:", server_info.max_players)
print("Game mode:", server_info.game_mode)
```

### ShardIndex:GetGenOptions() {#get-gen-options}

**Status:** `stable`

**Description:**
Returns current world generation options and settings.

**Parameters:**
None

**Returns:**
- (table): World generation options

**Example:**
```lua
local world_options = shard_index:GetGenOptions()
print("World preset:", world_options.preset)
print("Season start:", world_options.overrides.season_start)

-- Check specific world settings
if world_options.overrides.deerclops == "often" then
    print("Deerclops spawns frequently")
end
```

### ShardIndex:GetSession() {#get-session}

**Status:** `stable`

**Description:**
Returns the current session identifier.

**Parameters:**
None

**Returns:**
- (string): Session identifier

**Example:**
```lua
local session = shard_index:GetSession()
if session then
    print("Current session:", session)
else
    print("No active session")
end
```

### ShardIndex:GetGameMode() {#get-game-mode}

**Status:** `stable`

**Description:**
Returns the current game mode setting.

**Parameters:**
None

**Returns:**
- (string): Game mode identifier

**Example:**
```lua
local game_mode = shard_index:GetGameMode()
print("Game mode:", game_mode)

-- Handle different game modes
if game_mode == "survival" then
    print("Standard survival mode")
elseif game_mode == "wilderness" then
    print("Wilderness mode")
end
```

## Mod Management

### ShardIndex:GetEnabledServerMods() {#get-enabled-server-mods}

**Status:** `stable`

**Description:**
Returns enabled server modifications for master shards.

**Parameters:**
None

**Returns:**
- (table): Enabled server mods configuration

**Example:**
```lua
local enabled_mods = shard_index:GetEnabledServerMods()
for mod_name, mod_data in pairs(enabled_mods) do
    print("Mod:", mod_name)
    print("Enabled:", mod_data.enabled)
    if mod_data.config_data then
        print("Has custom configuration")
    end
end
```

### ShardIndex:LoadEnabledServerMods() {#load-enabled-server-mods}

**Status:** `stable`

**Description:**
Loads and applies enabled server modifications to the current session.

**Parameters:**
None

**Returns:**
None

**Example:**
```lua
-- Load mods during server startup
if shard_index:IsMasterShardIndex() then
    shard_index:LoadEnabledServerMods()
    print("Server mods loaded")
end
```

### ShardIndex:SetEnabledServerMods(enabled_mods) {#set-enabled-server-mods}

**Status:** `stable`

**Description:**
Updates the enabled server modifications configuration for master shards.

**Parameters:**
- `enabled_mods` (table): New mod configuration

**Returns:**
None

**Example:**
```lua
-- Enable specific mods with configuration
local mod_config = {
    ["workshop-123456"] = {
        enabled = true,
        config_data = {
            setting1 = "value1",
            setting2 = "value2"
        }
    },
    ["workshop-789012"] = {
        enabled = true,
        config_data = {}
    }
}

shard_index:SetEnabledServerMods(mod_config)
```

## Utility Methods

### ShardIndex:IsMasterShardIndex() {#is-master-shard-index}

**Status:** `stable`

**Description:**
Checks if this shard index represents the master shard.

**Parameters:**
None

**Returns:**
- (boolean): `true` if master shard, `false` otherwise

**Example:**
```lua
if shard_index:IsMasterShardIndex() then
    -- Only master shard can manage mods
    shard_index:LoadEnabledServerMods()
end
```

### ShardIndex:GetSlot() {#get-slot}

**Status:** `stable`

**Description:**
Returns the cluster slot number.

**Parameters:**
None

**Returns:**
- (number): Cluster slot number

**Example:**
```lua
local slot = shard_index:GetSlot()
print("Using cluster slot:", slot)
```

### ShardIndex:GetShard() {#get-shard}

**Status:** `stable`

**Description:**
Returns the shard identifier.

**Parameters:**
None

**Returns:**
- (string): Shard identifier

**Example:**
```lua
local shard = shard_index:GetShard()
print("Shard identifier:", shard)
```

### ShardIndex:MarkDirty() {#mark-dirty}

**Status:** `stable`

**Description:**
Marks the shard data as dirty, requiring a save operation.

**Parameters:**
None

**Returns:**
None

**Example:**
```lua
-- Mark data as dirty after modifications
shard_index:MarkDirty()

-- Save will be performed on next save cycle
```

### ShardIndex:IsValid() {#is-valid}

**Status:** `stable`

**Description:**
Checks if the shard index has valid data.

**Parameters:**
None

**Returns:**
- (boolean): `true` if valid, `false` otherwise

**Example:**
```lua
if shard_index:IsValid() then
    print("Shard data is valid")
    local options = shard_index:GetGenOptions()
else
    print("Shard data is invalid")
end
```

### ShardIndex:IsEmpty() {#is-empty}

**Status:** `stable`

**Description:**
Checks if the shard has no active session.

**Parameters:**
None

**Returns:**
- (boolean): `true` if empty, `false` otherwise

**Example:**
```lua
if shard_index:IsEmpty() then
    print("No active world session")
else
    print("World session active")
end
```

### ShardIndex:CheckWorldFile() {#check-world-file}

**Status:** `stable`

**Description:**
Verifies if a world save file exists for the current session.

**Parameters:**
None

**Returns:**
- (boolean): `true` if world file exists, `false` otherwise

**Example:**
```lua
if shard_index:CheckWorldFile() then
    print("World save file found")
else
    print("No world save file")
end
```

## Data Structure Examples

### World Options Structure

```lua
-- Example world.options structure
{
    preset = "SURVIVAL_TOGETHER",
    overrides = {
        season_start = "autumn",
        day = "longday",
        deerclops = "often",
        weather = "dynamic",
        temperature = "default"
    },
    playstyle = "survival"
}
```

### Server Data Structure

```lua
-- Example server structure
{
    name = "My Server",
    description = "Custom DST server",
    game_mode = "survival",
    max_players = 6,
    pvp = false,
    pause_when_empty = true,
    encode_user_path = true
}
```

### Enabled Mods Structure

```lua
-- Example enabled_mods structure
{
    ["workshop-123456"] = {
        enabled = true,
        config_data = {
            option1 = "value1",
            option2 = 50
        }
    },
    ["workshop-789012"] = {
        enabled = false,
        config_data = {}
    }
}
```

## Save Format Upgrades

### Version Management

The system includes automatic save format upgrades:

```lua
-- Version upgrade system
local SHARDINDEX_VERSION = 5

-- Automatic upgrades from older versions
-- V1 → V2: Basic structure improvements
-- V2 → V3: Mod configuration enhancements
-- V3 → V4: Session management updates
-- V4 → V5: Playstyle calculation additions
```

## Usage Patterns

### Basic Shard Setup

```lua
-- Initialize and configure a new shard
local shard_index = ShardIndex()

-- Load existing data or create new
shard_index:Load(function(success)
    if success then
        print("Existing shard loaded")
    else
        -- Create new shard
        shard_index:NewShardInSlot(1, "Master")
        
        -- Configure world settings
        local world_options = GetDefaultWorldOptions()
        local server_config = GetDefaultServerConfig()
        
        shard_index:SetServerShardData(world_options, server_config)
    end
end)
```

### Cluster Management

```lua
-- Manage multiple shards in a cluster
local master_shard = ShardIndex()
local caves_shard = ShardIndex()

-- Load master shard
master_shard:LoadShardInSlot(1, "Master", function(success)
    if success and master_shard:IsMasterShardIndex() then
        -- Load enabled mods
        master_shard:LoadEnabledServerMods()
        
        -- Load caves shard
        caves_shard:LoadShardInSlot(1, "Caves", function(caves_success)
            if caves_success then
                print("Cluster loaded successfully")
            end
        end)
    end
end)
```

## Integration Points

### TheNet Integration

Network service integration for server management:

```lua
-- Session identifier management
local session_id = TheNet:GetSessionIdentifier()
shard_index.session_id = session_id
```

### TheSim Integration

Persistent storage integration:

```lua
-- Cluster slot storage
TheSim:SetPersistentStringInClusterSlot(slot, shard, filename, data)
TheSim:GetPersistentStringInClusterSlot(slot, shard, filename, callback)
```

### KnownModIndex Integration

Mod management integration:

```lua
-- Mod configuration management
KnownModIndex:Enable(modname)
KnownModIndex:SetConfigurationOption(modname, option, value)
```

## Related Modules

- [SaveGameIndex](./saveindex.md): Individual save game management
- [KnownModIndex](./modindex.md): Mod installation and configuration
- [TheNet](../core-systems/index.md#thenet): Network and session services
- [TheSim](../core-systems/index.md#thesim): Simulation and persistence services
- [SaveFileUpgrades](./savefileupgrades.md): Save data format migration system
