---
id: global-objects-overview
title: Global Objects Overview
sidebar_position: 1
slug: /api/global-objects
---

# Global Objects Overview

Global objects in Don't Starve Together are special singleton instances that provide access to core game systems, data, and functionality. These objects are accessible from anywhere in your mod code and serve as the primary interface for interacting with the game world, players, networking, and other essential systems.

## Key Global Objects

| Object | Description |
|--------|-------------|
| [TheWorld](/docs/api-vanilla/global-objects/theworld) | The main world instance that manages terrain, environment, and game state |
| [ThePlayer](/docs/api-vanilla/global-objects/theplayer) | The local player character (client-side only) |
| [TheNet](/docs/api-vanilla/global-objects/thenet) | Networking functionality for multiplayer and server management |
| [TheSim](/docs/api-vanilla/global-objects/thesim) | Low-level simulation engine access |
| [GLOBAL](/docs/api-vanilla/global-objects/global) | The game's global namespace for accessing internal functions and tables |

## Other Important Global Objects

| Object | Description |
|--------|-------------|
| TheInput | Manages input handling from keyboard, mouse, and controllers |
| TheInventory | Manages player's item collection (including skins) |
| TheShard | Handles communication between different server shards |
| TheGlobalInstance | Manages global data that persists across shards |
| TheFrontEnd | Controls the game's user interface and screens |
| TheClock | Provides timing and day/night cycle information |
| TheFocalPoint | Controls the camera's focal point |

## Context-Dependent Globals

Some global objects only exist in specific contexts:

- **ThePlayer** - Only exists on the client and represents the local player
- **AllPlayers** - An array of all player entities in the game
- **TheCamera** - Only exists on the client and manages the game camera
- **TheGameModes** - Manages different game modes (survival, wilderness, etc.)

## Using Global Objects in Mods

Global objects are a powerful way to interact with the game, but they should be used carefully:

```lua
-- Example: Using global objects in a mod
local function OnWorldLoaded(inst)
    -- Check if we are on the server
    if TheWorld.ismastersim then
        -- Modify world properties
        TheWorld.components.seasons:SetSeasonLength(TUNING.SEASON_LENGTH_MODERATE)
        
        -- Get all players
        for i, v in ipairs(AllPlayers) do
            -- Give each player some items
            if v.components.inventory then
                v.components.inventory:GiveItem(SpawnPrefab("log"))
            end
        end
    end
    
    -- Client-side code (runs on all clients)
    if ThePlayer then
        -- Show a message to the local player
        ThePlayer.components.talker:Say("World loaded!")
    end
end

-- Listen for world load event
AddPrefabPostInit("world", OnWorldLoaded)
```

## Best Practices

1. **Check Existence**: Always check if a global object exists before using it (e.g., `if ThePlayer then`)
2. **Check Context**: Verify you're in the right execution context (client/server) with `TheWorld.ismastersim`
3. **Use Local References**: Store frequently accessed globals in local variables for better performance
4. **Avoid Overwriting**: Never reassign global objects (e.g., `TheWorld = nil`)
5. **Understand Authority**: Only the server has authority to make most gameplay changes

## Common Pitfalls

- Using **ThePlayer** on a dedicated server (it doesn't exist there)
- Modifying server state from client code
- Assuming all components exist on all objects
- Using TheWorld components on the client (many only exist on the server)
- Not checking if global objects are initialized before using them

Global objects are essential for Don't Starve Together modding, providing the primary interface to interact with the game's systems. Understanding these objects and their proper usage is key to creating effective and compatible mods. 