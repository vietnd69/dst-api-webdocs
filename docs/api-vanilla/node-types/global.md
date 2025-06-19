---
id: global
title: Global Node Type
sidebar_position: 10
last_updated: 2023-09-15
version: 624447
---
*Last Update: 2023-09-15*
# Global Node Type

*API Version: 624447*

The Global Node is a special node type in the Don't Starve Together API that provides access to globally available functions, variables, and systems. It is the entry point for accessing the Lua environment and game's core functionality.

## Global Node properties and methods

The Global Node provides access to:

- **Global Tables**
  - `_G` - The root Lua environment table
  - `GLOBAL` - Used in mods to access the game's global namespace
  - `STRINGS` - All game text strings
  - `TUNING` - Game balance and configuration values
  - `ACTIONS` - Available player and entity actions

- **Global Objects**
  - `TheWorld` - Access to the game world and its systems
  - `TheSim` - Low-level simulation functions
  - `ThePlayer` - Reference to the local player entity
  - `TheNet` - Networking and multiplayer functions
  - `TheInput` - User input handling

- **Core Functions**
  - `SpawnPrefab()` - Creates game entities
  - `GetTime()` - Gets the current game time
  - `GetTick()` - Gets the current simulation tick
  - `DebugSpawn()` - Spawns entities in developer mode

## Global Tables

### _G: `Table` `[readonly]`

The root Lua environment table containing all globally defined values. This is the standard Lua global environment.

```lua
-- Access a global function directly
local result = math.random(1, 10)

-- Check if a global exists
if type(SomeGlobalFunction) ~= "nil" then
    SomeGlobalFunction()
end
```

---

### GLOBAL: `Table` `[readonly]`

In mod development, GLOBAL is used to access the game's internal functions, classes, and variables. It provides a way for mods to interact with the game's global namespace.

```lua
-- In modmain.lua:
local SpawnPrefab = GLOBAL.SpawnPrefab
local TUNING = GLOBAL.TUNING

-- Adding custom functions to the global namespace
GLOBAL.MyModFunction = function()
    print("This is from my mod!")
end
```

---

### STRINGS: `Table` `[readonly]`

Contains all game text strings, organized by category and language. Mods can add or modify these strings.

```lua
-- Access specific game strings
local carrot_name = STRINGS.NAMES.CARROT
local wilson_examine = STRINGS.CHARACTERS.WILSON.DESCRIBE.CARROT

-- Modify strings
STRINGS.NAMES.CARROT = "Super Carrot"
STRINGS.CHARACTERS.WILSON.DESCRIBE.CARROT = "That's a fancy looking carrot!"
```

---

### TUNING: `Table` `[readonly]`

Contains game balance and configuration values that define entity statistics, timers, and gameplay mechanics.

```lua
-- Access tuning values
local wilson_health = TUNING.WILSON_HEALTH
local hunger_rate = TUNING.WILSON_HUNGER_RATE

-- Modify tuning values (in mods)
GLOBAL.TUNING.WILSON_HEALTH = 200
```

---

### ACTIONS: `Table` `[readonly]`

Contains all available actions that players and entities can perform in the game.

```lua
-- Access action definitions
local chop_action = ACTIONS.CHOP
local eat_action = ACTIONS.EAT

-- Use with buffered actions
local act = BufferedAction(player, target, ACTIONS.CHOP)
```

---

## Global Objects

### TheWorld: `WorldEntity` `[readonly]`

The main world entity that contains all game state, components, and systems.

```lua
-- Check world state
local is_cave = TheWorld:HasTag("cave")
local current_season = TheWorld.state.season

-- Access world components
local animals = TheWorld.components.birdspawner:GetCurrentBirds()
```

---

### TheSim: `Simulation` `[readonly]`

Provides low-level simulation functions for file I/O, performance measurement, and system operations.

```lua
-- File operations
local file_exists = TheSim:GetPersistentString("mymod_data")

-- Performance measurement
local start_time = TheSim:GetTick()

-- System functions
TheSim:SetErosionTexture("images/erosion.tex")
```

---

### ThePlayer: `Entity` `[readonly]`

Reference to the local player's entity (client-side only).

```lua
-- Get player position
local x, y, z = ThePlayer.Transform:GetWorldPosition()

-- Check player stats
local health = ThePlayer.components.health.currenthealth
local hunger = ThePlayer.components.hunger.current
```

---

### TheNet: `Network` `[readonly]`

Provides networking and multiplayer functions.

```lua
-- Check network state
local is_server = TheNet:GetIsServer()
local is_dedicated = TheNet:GetIsDedicated()

-- Get player information
local user_id = TheNet:GetUserID()
local players = TheNet:GetClientTable()
```

---

### TheInput: `Input` `[readonly]`

Manages user input and controls.

```lua
-- Check input state
local mouse_pos = TheInput:GetScreenPosition()
local key_pressed = TheInput:IsKeyDown(KEY_SPACE)

-- Bind a control action
TheInput:AddKeyUpHandler(KEY_F, MyCustomFunction)
```

---

## Core Functions

### SpawnPrefab(prefab: `string`): `Entity`

Creates and returns a new entity instance from a prefab name.

```lua
-- Spawn a basic entity
local carrot = SpawnPrefab("carrot")

-- Spawn with position
local x, y, z = ThePlayer.Transform:GetWorldPosition()
local fire = SpawnPrefab("campfire")
fire.Transform:SetPosition(x + 2, y, z)
```

---

### GetTime(): `number`

Returns the current game time in seconds.

```lua
-- Get the current game time
local current_time = GetTime()

-- Use for timing events
local start_time = GetTime()
-- ... do something
local elapsed = GetTime() - start_time
```

---

### GetTick(): `number`

Returns the current simulation tick (a higher precision time value).

```lua
-- Get current tick for precise timing
local current_tick = GetTick()

-- Measure performance
local start_tick = GetTick()
-- ... do something
local elapsed_ticks = GetTick() - start_tick
```

---

### DebugSpawn(prefab: `string`): `Entity`

Spawns an entity in developer mode, with additional debugging information.

```lua
-- Debug spawn an entity
local debug_entity = DebugSpawn("bearger")

-- Only works in developer mode
if CHEATS_ENABLED then
    DebugSpawn("dragonfly")
end
```

---

## Integration with Node Types

The Global Node provides access to all other node types in the game:

```lua
-- Create an entity using the global system
local entity = SpawnPrefab("pigman")

-- Access entity components
local health = entity.components.health

-- Access the global world state
local is_night = TheWorld.state.isnight

-- Create a behavior tree node
local sequence = SequenceNode(
    {
        ActionNode(function() return entity.components.locomotor:GoToPoint(point) end),
        ActionNode(function() return entity:PushEvent("arrived") end)
    }
)
```

## Best Practices

1. **Local References**: Store frequently accessed globals in local variables for better performance
2. **Use GLOBAL in Mods**: When writing mods, access game functions through the GLOBAL table
3. **Check Availability**: Always check if a global object exists before using it
4. **Version Compatibility**: Global functions and objects may change between game updates
5. **Avoid Namespace Pollution**: Don't create too many global variables

## Common Patterns

### In Regular Game Code

```lua
-- Standard globals access
local player = ThePlayer
local world = TheWorld

-- Using global functions
local entity = SpawnPrefab("spider")
local time = GetTime()
```

### In Mod Development

```lua
-- Importing globals
local TUNING = GLOBAL.TUNING
local TheWorld = GLOBAL.TheWorld

-- Adding to globals
GLOBAL.MY_MOD_CONFIG = {
    version = "1.0",
    features = {
        enabled = true,
        power = 10
    }
}

-- Modifying existing globals
local old_SpawnPrefab = GLOBAL.SpawnPrefab
GLOBAL.SpawnPrefab = function(prefab, ...)
    print("Spawning: " .. prefab)
    return old_SpawnPrefab(prefab, ...)
end
```

## See also

- [GLOBAL Table](../global-objects/global.md) - More detailed information about the GLOBAL table
- [TheWorld](../global-objects/theworld.md) - Main world entity and state
- [TheSim](../global-objects/thesim.md) - Simulation functions and system operations
- [Entity System](../core/entity-system.md) - How entities work in the game
- [TUNING System](../core/tuning.md) - Game balance and configuration values
