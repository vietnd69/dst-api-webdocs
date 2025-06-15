---
id: thesim
title: TheSim
sidebar_position: 5
last_updated: 2023-07-06
---

# TheSim

TheSim is a global object that provides access to the game's simulation engine, offering functionality for working with the file system, finding entities, playing sounds, and more low-level operations.

## File System Operations

```lua
-- Check if a file exists
local exists = TheSim:GetPersistentString("mymod_config", function(success, str)
    if success then
        print("File exists with content: " .. str)
    else
        print("File does not exist")
    end
end)

-- Save data persistently
TheSim:SetPersistentString("mymod_config", "some_data_to_save", false)

-- Delete a persistent string
TheSim:ErasePersistentString("mymod_config", callback)

-- Get file list in a directory
local files = TheSim:GetFileList("scripts/prefabs/")
for _, file in ipairs(files) do
    print(file)
end

-- Save/load data in a cluster (multi-server setup)
TheSim:SetPersistentStringInClusterSlot(slot_num, "Master", "mymod_config", data, false, callback)
TheSim:GetPersistentStringInClusterSlot(slot_num, "Master", "mymod_config", callback)
```

## Entity Management

```lua
-- Find entities in a radius around a point
local x, y, z = inst.Transform:GetWorldPosition()
local radius = 10
local ents = TheSim:FindEntities(x, y, z, radius, {"tree"}, {"burnt"})

-- Count entities in a radius
local count = TheSim:CountEntities(x, y, z, radius, {"tag1"}, {"tag2"})

-- Find the first entity with a tag
local entity = TheSim:FindFirstEntityWithTag("player")

-- Project a point onto the ground
local success, px, py, pz = TheSim:ProjectPointToTerrain(x, y, z)
if success then
    -- Use projected point
end

-- Create an entity
local entity = TheSim:CreateEntity()

-- Spawn a prefab
local guid = TheSim:SpawnPrefab("log", skin_name, skin_id, creator_id)
```

## Sound and Visual Effects

```lua
-- Play a sound without an entity
TheSim:PlaySound("dontstarve/common/dropGeneric")

-- Create a particle effect
local fx = SpawnPrefab("fx_effect")
fx.Transform:SetPosition(x, y, z)

-- Set ambient color
TheSim:SetAmbientColour(r, g, b)
```

## Prefab Management

```lua
-- Register a prefab
TheSim:RegisterPrefab(prefab_name, assets, dependencies)

-- Load prefabs
TheSim:LoadPrefabs({"prefab1", "prefab2"})

-- Unload prefabs
TheSim:UnloadPrefabs({"prefab1", "prefab2"})

-- Unregister prefabs
TheSim:UnregisterPrefabs({"prefab1", "prefab2"})

-- Verify file exists
TheSim:AddBatchVerifyFileExists("path/to/file.lua")
```

## Networking and Performance

```lua
-- Get network statistics
local sent, recv = TheSim:GetNetworkStatistics()

-- Get FPS information
local fps = TheSim:GetFPS()
local memory = TheSim:GetMemoryUsage()

-- Set time scale (game speed)
TheSim:SetTimeScale(1.0) -- Normal speed
TheSim:SetTimeScale(2.0) -- Double speed
local current_speed = TheSim:GetTimeScale()
```

## Time and Scheduling

```lua
-- Get real-world time (in milliseconds)
local time_ms = TheSim:GetRealTime()
local time_seconds = TheSim:GetRealTime() / 1000

-- Get simulation time step
local ticktime = TheSim:GetTickTime()

-- Get current tick
local tick = TheSim:GetTick()
local static_tick = TheSim:GetStaticTick()

-- Convert ticks to time
local time = TheSim:GetTick() * TheSim:GetTickTime()
```

## Game Environment

```lua
-- Check if running on a dedicated server
local is_dedicated = TheSim:IsDedicatedServer()

-- Get client-specific information
local client_id = TheSim:GetUserId()

-- Check permissions
local can_write = TheSim:CanWriteConfigurationDirectory()
local can_read = TheSim:CanReadConfigurationDirectory()
local has_log = TheSim:HasValidLogFile()
local has_space = TheSim:HasEnoughFreeDiskSpace()

-- DLC management
TheSim:SetDLCEnabled(dlc_index, true)
local is_enabled = TheSim:IsDLCEnabled(dlc_index)
local is_installed = TheSim:IsDLCInstalled(dlc_index)
```

## Translation and Localization

```lua
-- Get translated string
local translated = TheSim:GetTranslatedString(STRINGS.NAMES.CARROT)

-- Font management
TheSim:LoadFont("filename.ttf", "font_alias", disable_color)
TheSim:SetupFontFallbacks("font_alias", "fallback_font")
TheSim:AdjustFontAdvance("font_alias", advance_adjustment)
TheSim:UnloadFont("font_alias")
```

## Debugging and Error Handling

```lua
-- Debug rendering
TheSim:SetDebugRenderEnabled(true)

-- Print texture information
TheSim:PrintTextureInfo("texture_name")

-- Reset error state
TheSim:ResetError()

-- Force application to quit
TheSim:ForceAbort()
TheSim:Quit()

-- Send hardware statistics
TheSim:SendHardwareStats()
```

## Screen and Input

```lua
-- Project screen position to world coordinates
local x, y, z = TheSim:ProjectScreenPos(screen_x, screen_y)

-- Get mouse position
local x, y, z = TheSim:GetPosition()

-- Set game settings
TheSim:SetSetting("misc", "controller_popup", "false")
```

## Important Considerations

1. **Server vs. Client**: Some TheSim functions behave differently on servers versus clients
2. **Performance Impact**: Many TheSim functions access low-level systems and should be used sparingly
3. **Asynchronous Operations**: File operations are asynchronous and use callbacks to return results
4. **Thread Safety**: Be careful with operations that might execute across different threads
5. **Engine Access**: TheSim provides direct access to the game engine, use with caution

## Common Use Cases

- **Configuration Storage**: Saving and loading mod configuration
- **Entity Queries**: Finding entities in the world based on tags and distance
- **Time Management**: Accessing and controlling game time
- **File System Access**: Reading and writing files
- **Performance Monitoring**: Tracking memory usage and frame rates
- **Sound Effects**: Playing sounds without an associated entity 
