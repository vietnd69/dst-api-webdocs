---
id: global
title: GLOBAL
sidebar_position: 6
---

# GLOBAL

The GLOBAL table is a special environment that contains all of the game's globally accessible functions, classes, and variables. In mod development, GLOBAL is used to access internal game functionality or to inject custom code into the game's global namespace.

## Accessing Game Globals

In a mod's `modmain.lua`, you can access game globals through the GLOBAL table:

```lua
-- Access global game functions
local SpawnPrefab = GLOBAL.SpawnPrefab
local TheSim = GLOBAL.TheSim
local TheWorld = GLOBAL.TheWorld

-- Access global tables
local STRINGS = GLOBAL.STRINGS
local TUNING = GLOBAL.TUNING
local ACTIONS = GLOBAL.ACTIONS

-- Access game classes
local EntityScript = GLOBAL.EntityScript
local Component = GLOBAL.Component
```

## Importing GLOBAL Modules

You can import specific parts of the game code for use in your mod:

```lua
-- Import specific modules
local Vector3 = require("vector3")
local Brain = require("brain")

-- Import from specific paths
local StateGraph = require("stategraph")
local BufferedAction = require("bufferedaction")
```

## Adding to the Global Namespace

You can add your own functions and variables to the global namespace:

```lua
-- Add a function to the global namespace
GLOBAL.MyModFunction = function()
    print("This is a global function from my mod!")
end

-- Add a table to the global namespace
GLOBAL.MY_MOD_DATA = {
    version = "1.0",
    author = "YourName",
    settings = {}
}
```

## Modifying Game Constants

You can modify game constants through the GLOBAL table:

```lua
-- Modify tuning values
GLOBAL.TUNING.WILSON_HEALTH = 200         -- Change Wilson's health
GLOBAL.TUNING.HAMMER_LOOT_PERCENT = 1.0   -- Always drop full loot when hammering

-- Modify string entries
GLOBAL.STRINGS.NAMES.CARROT = "Super Carrot"
GLOBAL.STRINGS.CHARACTERS.WILSON.DESCRIBE.CARROT = "That's one fancy carrot!"
```

## Adding Game Constants

You can add new constants for your mod:

```lua
-- Add new tuning values
GLOBAL.TUNING.MY_MOD = {
    SPAWN_CHANCE = 0.5,
    MAX_ITEMS = 10,
    DAMAGE_MULTIPLIER = 1.5
}

-- Add new string entries
GLOBAL.STRINGS.MY_MOD = {
    ITEMS = {
        SUPER_TOOL = "Super Tool",
        MEGA_WEAPON = "Mega Weapon"
    },
    UI = {
        OPEN = "Open",
        CLOSE = "Close"
    }
}
```

## Exposing Local Functions

You can get access to local functions in the game code by extracting them from environments:

```lua
-- Get local function from game code (advanced technique)
local env = getfenv(GLOBAL.TheWorld.IsPassableAtPoint)
local internal_function = env.SomeLocalFunction

-- Use with caution - may break with game updates
```

## Best Practices

When working with GLOBAL:

1. **Import Only What You Need**: For better performance, only import the specific globals you need
2. **Use Local Variables**: Store globals in local variables for faster access and better performance
3. **Avoid Name Collisions**: Use unique names for your global additions to avoid conflicts with other mods
4. **Be Cautious with Modifications**: Changing core game globals can have unintended consequences
5. **Use PrefixGlobalMethods**: For patching global functions, consider using PrefixGlobalMethods to keep the original functionality

```lua
-- Example of safely modifying a global function
local oldSpawnPrefab = GLOBAL.SpawnPrefab
GLOBAL.SpawnPrefab = function(name, ...)
    print("Spawning: " .. name)
    return oldSpawnPrefab(name, ...)
end
```

6. **Consider Load Order**: Your changes might be overwritten by other mods loaded after yours 