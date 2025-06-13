---
id: saving-loading
title: Saving and Loading Snippets
sidebar_position: 3
---

# Saving and Loading Snippets

This page provides reusable code snippets for saving and loading data in Don't Starve Together mods.

## Basic Saving and Loading

### Saving Component Data

```lua
-- Basic component with save/load functionality
local MyComponent = Class(function(self, inst)
    self.inst = inst
    self.value = 0
    self.items = {}
    self.enabled = true
end)

-- Save component data
function MyComponent:OnSave()
    return {
        value = self.value,
        items = self.items,
        enabled = self.enabled
    }
end

-- Load component data
function MyComponent:OnLoad(data)
    if data then
        self.value = data.value or self.value
        self.items = data.items or self.items
        self.enabled = data.enabled ~= nil and data.enabled or self.enabled
    end
end

-- Usage in a prefab
local function fn()
    local inst = CreateEntity()
    -- ... other entity setup ...
    
    inst:AddComponent("mycomponent")
    
    return inst
end
```

### Entity Save/Load Handlers

```lua
-- Entity with save/load handlers
local function fn()
    local inst = CreateEntity()
    -- ... other entity setup ...
    
    -- Custom data to save
    inst.persistent_data = {
        counter = 0,
        last_used = nil,
        settings = {
            power_level = 1,
            mode = "normal"
        }
    }
    
    -- Save handler
    inst.OnSave = function(inst)
        local data = {
            counter = inst.persistent_data.counter,
            last_used = inst.persistent_data.last_used,
            settings = inst.persistent_data.settings
        }
        return data
    end
    
    -- Load handler
    inst.OnLoad = function(inst, data)
        if data then
            if data.counter then inst.persistent_data.counter = data.counter end
            if data.last_used then inst.persistent_data.last_used = data.last_used end
            if data.settings then inst.persistent_data.settings = data.settings end
        end
    end
    
    return inst
end
```

## Advanced Saving and Loading

### Saving References to Other Entities

```lua
-- Saving references to other entities
local function fn()
    local inst = CreateEntity()
    -- ... other entity setup ...
    
    -- References to other entities
    inst.linked_entities = {}
    
    -- Function to link to another entity
    inst.LinkEntity = function(inst, other)
        if other and other.GUID then
            table.insert(inst.linked_entities, other)
        end
    end
    
    -- Save handler with references
    inst.OnSave = function(inst)
        local references = {}
        local data = {
            linked_entity_guids = {}
        }
        
        -- Save GUIDs of linked entities
        for i, entity in ipairs(inst.linked_entities) do
            if entity:IsValid() then
                table.insert(data.linked_entity_guids, entity.GUID)
                table.insert(references, entity.GUID)
            end
        end
        
        return data, references
    end
    
    -- Load handler with references
    inst.OnLoad = function(inst, data)
        if data and data.linked_entity_guids then
            inst.linked_entity_guids = data.linked_entity_guids
        end
    end
    
    -- Resolve references after world loads
    inst.OnLoadPostPass = function(inst)
        if inst.linked_entity_guids then
            for i, guid in ipairs(inst.linked_entity_guids) do
                local entity = Ents[guid]
                if entity then
                    table.insert(inst.linked_entities, entity)
                end
            end
            inst.linked_entity_guids = nil
        end
    end
    
    return inst
end
```

### Saving Binary Data

```lua
-- Saving binary or complex data with string encoding
local function fn()
    local inst = CreateEntity()
    -- ... other entity setup ...
    
    -- Complex data structure
    inst.map_data = {
        {1, 0, 1, 0, 1},
        {0, 1, 0, 1, 0},
        {1, 0, 1, 0, 1}
    }
    
    -- Encode map data to string
    local function EncodeMapData(map_data)
        local result = {}
        table.insert(result, #map_data) -- Height
        table.insert(result, #map_data[1]) -- Width
        
        for y, row in ipairs(map_data) do
            for x, cell in ipairs(row) do
                table.insert(result, cell)
            end
        end
        
        return table.concat(result, ",")
    end
    
    -- Decode map data from string
    local function DecodeMapData(encoded)
        local values = {}
        for value in string.gmatch(encoded, "[^,]+") do
            table.insert(values, tonumber(value))
        end
        
        local height = values[1]
        local width = values[2]
        local map = {}
        
        local index = 3
        for y = 1, height do
            map[y] = {}
            for x = 1, width do
                map[y][x] = values[index]
                index = index + 1
            end
        end
        
        return map
    end
    
    -- Save handler with encoding
    inst.OnSave = function(inst)
        return {
            encoded_map = EncodeMapData(inst.map_data)
        }
    end
    
    -- Load handler with decoding
    inst.OnLoad = function(inst, data)
        if data and data.encoded_map then
            inst.map_data = DecodeMapData(data.encoded_map)
        end
    end
    
    return inst
end
```

### Saving Player-Specific Data

```lua
-- Saving player-specific data
local function fn()
    local inst = CreateEntity()
    -- ... other entity setup ...
    
    -- Player data storage
    inst.player_data = {}
    
    -- Add data for a player
    inst.SetPlayerData = function(inst, player, key, value)
        local userid = player and player.userid
        if userid then
            inst.player_data[userid] = inst.player_data[userid] or {}
            inst.player_data[userid][key] = value
        end
    end
    
    -- Get data for a player
    inst.GetPlayerData = function(inst, player, key)
        local userid = player and player.userid
        if userid and inst.player_data[userid] then
            return inst.player_data[userid][key]
        end
        return nil
    end
    
    -- Save handler
    inst.OnSave = function(inst)
        return {
            player_data = inst.player_data
        }
    end
    
    -- Load handler
    inst.OnLoad = function(inst, data)
        if data and data.player_data then
            inst.player_data = data.player_data
        end
    end
    
    return inst
end
```

## Mod Configuration Saving

### Basic Mod Configuration

```lua
-- Basic mod configuration system
local ModConfig = {
    config = {
        difficulty = "normal",
        spawn_rate = 0.5,
        enable_feature = true
    },
    
    -- Default values
    defaults = {
        difficulty = "normal",
        spawn_rate = 0.5,
        enable_feature = true
    }
}

-- Save configuration to mod settings
function ModConfig:Save()
    local config_str = json.encode(self.config)
    TheSim:SetPersistentString("my_mod_config", config_str, false)
end

-- Load configuration from mod settings
function ModConfig:Load()
    TheSim:GetPersistentString("my_mod_config", function(success, config_str)
        if success and config_str and #config_str > 0 then
            local success, config = pcall(function() return json.decode(config_str) end)
            if success and config then
                -- Merge with defaults for any missing values
                for k, v in pairs(self.defaults) do
                    if config[k] == nil then
                        config[k] = v
                    end
                end
                self.config = config
            end
        end
    end)
end

-- Set a configuration value
function ModConfig:Set(key, value)
    self.config[key] = value
    self:Save()
end

-- Get a configuration value
function ModConfig:Get(key)
    return self.config[key]
end

-- Reset to defaults
function ModConfig:Reset()
    self.config = deepcopy(self.defaults)
    self:Save()
end

-- Initialize on mod load
function ModConfig:Init()
    self:Load()
end

-- Usage
-- ModConfig:Init()
-- local difficulty = ModConfig:Get("difficulty")
-- ModConfig:Set("spawn_rate", 0.75)
```

### Per-World Configuration

```lua
-- Per-world configuration system
local WorldConfig = {
    world_configs = {},
    current_config = nil,
    
    -- Default values
    defaults = {
        structures = {},
        resources_harvested = 0,
        events_triggered = {}
    }
}

-- Get current world ID
function WorldConfig:GetWorldID()
    if TheWorld and TheWorld.meta then
        return TheWorld.meta.session_identifier
    end
    return nil
end

-- Save configuration for current world
function WorldConfig:Save()
    local world_id = self:GetWorldID()
    if world_id and self.current_config then
        self.world_configs[world_id] = deepcopy(self.current_config)
        
        local config_str = json.encode(self.world_configs)
        TheSim:SetPersistentString("my_mod_world_configs", config_str, false)
    end
end

-- Load configurations for all worlds
function WorldConfig:LoadAll()
    TheSim:GetPersistentString("my_mod_world_configs", function(success, config_str)
        if success and config_str and #config_str > 0 then
            local success, configs = pcall(function() return json.decode(config_str) end)
            if success and configs then
                self.world_configs = configs
            end
        end
    end)
end

-- Initialize configuration for current world
function WorldConfig:InitForCurrentWorld()
    local world_id = self:GetWorldID()
    if world_id then
        if self.world_configs[world_id] then
            self.current_config = deepcopy(self.world_configs[world_id])
        else
            self.current_config = deepcopy(self.defaults)
        end
    else
        self.current_config = deepcopy(self.defaults)
    end
end

-- Set a configuration value for current world
function WorldConfig:Set(key, value)
    if self.current_config then
        self.current_config[key] = value
        self:Save()
    end
end

-- Get a configuration value for current world
function WorldConfig:Get(key)
    if self.current_config then
        return self.current_config[key]
    end
    return nil
end

-- Initialize on mod load and world load
function WorldConfig:Init()
    self:LoadAll()
    
    -- Initialize when world is ready
    if TheWorld then
        self:InitForCurrentWorld()
    else
        -- Wait for world to be ready
        self.world_ready_task = TheWorld:DoTaskInTime(0, function()
            self:InitForCurrentWorld()
            self.world_ready_task = nil
        end)
    end
end

-- Usage
-- WorldConfig:Init()
-- local resources = WorldConfig:Get("resources_harvested")
-- WorldConfig:Set("resources_harvested", resources + 1)
```

## Saving Large Data Structures

### Chunked Data Saving

```lua
-- Saving large data structures in chunks
local ChunkedStorage = {
    chunk_size = 10000, -- Maximum size of each chunk
    prefix = "my_mod_data_chunk_"
}

-- Save large data in chunks
function ChunkedStorage:Save(key, data)
    -- Convert data to string
    local data_str = json.encode(data)
    
    -- Calculate number of chunks needed
    local num_chunks = math.ceil(#data_str / self.chunk_size)
    
    -- Save metadata
    TheSim:SetPersistentString(self.prefix .. key .. "_meta", json.encode({
        num_chunks = num_chunks,
        total_size = #data_str
    }), false)
    
    -- Save each chunk
    for i = 1, num_chunks do
        local start_pos = (i - 1) * self.chunk_size + 1
        local end_pos = math.min(i * self.chunk_size, #data_str)
        local chunk = string.sub(data_str, start_pos, end_pos)
        
        TheSim:SetPersistentString(self.prefix .. key .. "_" .. i, chunk, false)
    end
    
    return true
end

-- Load large data from chunks
function ChunkedStorage:Load(key, callback)
    -- Load metadata first
    TheSim:GetPersistentString(self.prefix .. key .. "_meta", function(success, meta_str)
        if success and meta_str and #meta_str > 0 then
            local success, meta = pcall(function() return json.decode(meta_str) end)
            
            if success and meta and meta.num_chunks then
                local chunks = {}
                local chunks_loaded = 0
                
                -- Function to check if all chunks are loaded
                local function CheckAllChunksLoaded()
                    if chunks_loaded == meta.num_chunks then
                        -- Combine all chunks
                        local full_data_str = table.concat(chunks)
                        
                        -- Decode the data
                        local success, data = pcall(function() return json.decode(full_data_str) end)
                        
                        if success and data then
                            callback(true, data)
                        else
                            callback(false)
                        end
                    end
                end
                
                -- Load each chunk
                for i = 1, meta.num_chunks do
                    TheSim:GetPersistentString(self.prefix .. key .. "_" .. i, function(success, chunk)
                        if success and chunk then
                            chunks[i] = chunk
                            chunks_loaded = chunks_loaded + 1
                            CheckAllChunksLoaded()
                        else
                            callback(false)
                        end
                    end)
                end
            else
                callback(false)
            end
        else
            callback(false)
        end
    end)
end

-- Delete saved data
function ChunkedStorage:Delete(key)
    -- Load metadata to know how many chunks to delete
    TheSim:GetPersistentString(self.prefix .. key .. "_meta", function(success, meta_str)
        if success and meta_str and #meta_str > 0 then
            local success, meta = pcall(function() return json.decode(meta_str) end)
            
            if success and meta and meta.num_chunks then
                -- Delete each chunk
                for i = 1, meta.num_chunks do
                    TheSim:ErasePersistentString(self.prefix .. key .. "_" .. i)
                end
            end
            
            -- Delete metadata
            TheSim:ErasePersistentString(self.prefix .. key .. "_meta")
        end
    end)
end

-- Usage
-- local large_data = {/* ... large data structure ... */}
-- ChunkedStorage:Save("world_map", large_data)
-- 
-- ChunkedStorage:Load("world_map", function(success, data)
--     if success then
--         print("Loaded large data structure!")
--     else
--         print("Failed to load data")
--     end
-- end)
```

### Versioned Data Saving

```lua
-- Versioned data saving system
local VersionedStorage = {
    current_version = 1, -- Increment when data format changes
    prefix = "my_mod_versioned_"
}

-- Upgrade functions for each version
VersionedStorage.upgraders = {
    -- Upgrade from v1 to v2
    [1] = function(data_v1)
        -- Example: Convert old format to new format
        local data_v2 = {
            settings = data_v1.config or {},
            player_stats = {},
            version = 2
        }
        
        -- Move player stats from old location to new
        if data_v1.player_data then
            for player_id, stats in pairs(data_v1.player_data) do
                data_v2.player_stats[player_id] = {
                    score = stats.score or 0,
                    level = stats.level or 1
                }
            end
        end
        
        return data_v2
    end,
    
    -- Add more upgraders as needed for future versions
}

-- Save data with version
function VersionedStorage:Save(key, data)
    -- Ensure data has current version
    data.version = self.current_version
    
    -- Convert to string and save
    local data_str = json.encode(data)
    TheSim:SetPersistentString(self.prefix .. key, data_str, false)
    
    return true
end

-- Load data and upgrade if needed
function VersionedStorage:Load(key, callback)
    TheSim:GetPersistentString(self.prefix .. key, function(success, data_str)
        if success and data_str and #data_str > 0 then
            local success, data = pcall(function() return json.decode(data_str) end)
            
            if success and data then
                -- Check if data needs upgrading
                local version = data.version or 1
                
                -- Apply upgraders sequentially
                while version < self.current_version do
                    if self.upgraders[version] then
                        data = self.upgraders[version](data)
                        version = data.version
                    else
                        -- Missing upgrader, can't proceed
                        callback(false)
                        return
                    end
                end
                
                callback(true, data)
            else
                callback(false)
            end
        else
            callback(false)
        end
    end)
end

-- Usage
-- local data = {
--     config = {difficulty = "hard"},
--     player_data = {
--         ["KU_12345"] = {score = 100, level = 5}
--     },
--     version = 1
-- }
-- 
-- VersionedStorage:Save("game_state", data)
-- 
-- VersionedStorage:Load("game_state", function(success, loaded_data)
--     if success then
--         -- Data will be automatically upgraded to current version
--         print("Loaded data version: " .. loaded_data.version)
--     end
-- end)
```

These snippets provide a foundation for various saving and loading scenarios in Don't Starve Together mods. Adapt them to your specific needs and combine them for more complex data persistence requirements. 