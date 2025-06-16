---
id: file-utils
title: File Utils
sidebar_position: 5
last_updated: 2023-07-06
version: 619045
---
*Last Update: 2023-07-06*
# File Utils

*API Version: 619045*

File Utils provide functionality for reading, writing, and managing files in Don't Starve Together mods. These utilities allow mods to persistently store configuration data, save game state, and access file system resources.

## Basic Usage

```lua
-- Save data to a file
TheSim:SetPersistentString("mymod_config", json.encode({
    enabled = true,
    difficulty = "hard",
    custom_options = {
        spawn_rate = 0.5,
        damage_multiplier = 1.2
    }
}), false)

-- Load data from a file
TheSim:GetPersistentString("mymod_config", function(success, data)
    if success then
        local config = json.decode(data)
        print("Mod enabled: " .. tostring(config.enabled))
        print("Difficulty: " .. config.difficulty)
    else
        print("Failed to load configuration")
    end
end)
```

## Core File Operations

| Function | Description |
|----------|-------------|
| `TheSim:GetPersistentString(filename, callback)` | Reads data from a file with callback |
| `TheSim:SetPersistentString(filename, data, compress, callback)` | Writes data to a file |
| `TheSim:ErasePersistentString(filename, callback)` | Deletes a file |
| `TheSim:GetFileList(directory)` | Gets a list of files in a directory |
| `TheSim:GetFileModificationTime(filename)` | Gets last modification time of a file |
| `TheSim:OnAssetPathResolve(assetfile, resolvedpath)` | Resolves an asset path |

## Multi-Shard File Operations

For clusters with multiple shards (servers):

```lua
-- Save data in a specific cluster slot
TheSim:SetPersistentStringInClusterSlot(slot_number, shard_id, filename, data, compress, callback)

-- Load data from a specific cluster slot
TheSim:GetPersistentStringInClusterSlot(slot_number, shard_id, filename, callback)
```

## File System Paths

Don't Starve Together organizes files in specific locations:

- **Mod Configuration**: Files in the mod's directory
- **Save Data**: Stored in the game's save directory
- **Cluster Data**: Server-specific data stored in cluster folders
- **Asset Data**: Game assets like textures, animations, and sounds

## Data Serialization

Data is typically serialized before saving to files:

```lua
-- Save complex data structure using json encoding
local data = {
    player_stats = {
        health = 100,
        hunger = 75,
        sanity = 50
    },
    world_state = {
        day = 10,
        season = "summer"
    }
}

TheSim:SetPersistentString("gamestate", json.encode(data), false)

-- Alternative serialization using DataDumper
local serialized = DataDumper(data)
TheSim:SetPersistentString("gamestate_lua", serialized, false)
```

## File Verification

```lua
-- Check if files exist (batch operation)
TheSim:StartFileExistsAsync()
TheSim:AddBatchVerifyFileExists("path/to/file1.lua")
TheSim:AddBatchVerifyFileExists("path/to/file2.lua")

-- For KLUMP encrypted files
local data = TheSim:LoadKlumpFile("encrypted_file.lua", cipher)
local string_data = TheSim:LoadKlumpString("encrypted_file.lua", cipher)
```

## Common Use Cases

### Mod Configuration

```lua
-- Save mod configuration
local function SaveModConfig(config)
    TheSim:SetPersistentString("mymod_config", json.encode(config), false, function()
        print("Configuration saved successfully")
    end)
end

-- Load mod configuration
local function LoadModConfig(callback)
    TheSim:GetPersistentString("mymod_config", function(success, data)
        if success then
            local config = json.decode(data)
            callback(config)
        else
            -- Create default configuration if none exists
            local default_config = { enabled = true, value = 100 }
            SaveModConfig(default_config)
            callback(default_config)
        end
    end)
end
```

### Player Data Management

```lua
-- Save player-specific data
local function SavePlayerData(userid, data)
    local filename = "player_data_" .. userid
    TheSim:SetPersistentString(filename, json.encode(data), false)
end

-- Load player-specific data
local function LoadPlayerData(userid, callback)
    local filename = "player_data_" .. userid
    TheSim:GetPersistentString(filename, function(success, data)
        if success then
            callback(json.decode(data))
        else
            callback({ visits = 1, last_login = os.time() })
        end
    end)
end
```

### Hot Reloading for Development

```lua
-- Check if a file was modified since last check
local file_cache = {}

local function CheckForFileChanges(filename)
    local current_time = TheSim:GetFileModificationTime(filename)
    
    if file_cache[filename] ~= nil and file_cache[filename] ~= current_time then
        print("File changed: " .. filename)
        -- Reload the file...
    end
    
    file_cache[filename] = current_time
end

-- Usage in development environment
local function CheckModFiles()
    CheckForFileChanges("mymod/scripts/myfile.lua")
end

inst:DoPeriodicTask(5, CheckModFiles) -- Check every 5 seconds
```

## Best Practices

1. **Error Handling**: Always check for success in file callbacks
2. **Compression**: Use compression for large data files
3. **Serialization**: Use json.encode/decode for complex data structures
4. **Backward Compatibility**: Include version information in saved data
5. **Performance**: Avoid excessive file operations, especially in render loops
6. **Debugging**: Use print statements to verify file operations

## Integration with Other Systems

File Utils work closely with:

- **PlayerProfile**: For player-specific settings
- **ModIndex**: For mod information and settings
- **SaveIndex**: For game save management
- **Asset System**: For loading game assets

## See also

- [TheSim](../global-objects/thesim.md) - Global simulation object with file functions
- [Modding System](../core/mod-structure.md) - For mod structure and configuration
- [Asset System](../core/entity-system.md) - For game asset management
- [Saving and Loading](../examples/snippets/saving-loading.md) - For save game examples
- [Debug Utils](debug-utils.md) - For debugging file operations
