---
id: thesim
title: TheSim
sidebar_position: 5
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

-- Get file list in a directory
local files = TheSim:GetFileList("scripts/prefabs/")
for _, file in ipairs(files) do
    print(file)
end
```

## Entity Management

```lua
-- Find entities in a radius around a point
local x, y, z = inst.Transform:GetWorldPosition()
local radius = 10
local ents = TheSim:FindEntities(x, y, z, radius, {"tree"}, {"burnt"})

-- Project a point onto the ground
local success, px, py, pz = TheSim:ProjectPointToTerrain(x, y, z)
if success then
    -- Use projected point
end
```

## Sound and Visual Effects

```lua
-- Play a sound without an entity
TheSim:PlaySound("dontstarve/common/dropGeneric")

-- Create a particle effect
local fx = SpawnPrefab("fx_effect")
fx.Transform:SetPosition(x, y, z)
```

## Networking and Performance

```lua
-- Get network statistics
local sent, recv = TheSim:GetNetworkStatistics()

-- Get FPS information
local fps = TheSim:GetFPS()
local memory = TheSim:GetMemoryUsage()
```

## Time and Scheduling

```lua
-- Get real-world time
local time = TheSim:GetRealTime()

-- Get simulation time step
local timestep = TheSim:GetTickTime()
```

## Game Environment

```lua
-- Check if running on a dedicated server
local is_dedicated = TheSim:IsDedicatedServer()

-- Get client-specific information
local client_id = TheSim:GetUserId()
```

## Translation and Localization

```lua
-- Get translated string
local translated = TheSim:GetTranslatedString(STRINGS.NAMES.CARROT)
```

## Important Considerations

1. **Server vs. Client**: Some TheSim functions behave differently on servers versus clients
2. **Performance Impact**: Many TheSim functions access low-level systems and should be used sparingly
3. **Platform Differences**: Some functions have different behavior across platforms
4. **Thread Safety**: File operations are asynchronous and use callbacks to return results

## Common Use Cases

- **Configuration Storage**: Saving and loading mod configuration
- **Area Effects**: Finding entities in an area to apply effects
- **Environment Queries**: Checking terrain or environment properties
- **Performance Monitoring**: Tracking memory usage and frame rates
- **Platform Detection**: Adapting behavior based on platform 