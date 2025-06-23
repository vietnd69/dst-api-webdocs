---
title: "Console Commands"
description: "Comprehensive guide to Don't Starve Together console commands for debugging, administration, and development"
sidebar_position: 9
slug: /api-vanilla/core-systems/consolecommands
last_updated: "2024-12-19"
build_version: "675312"
change_status: "stable"
---

# Console Commands 🟢

The **Console Commands** module provides an extensive collection of debugging, administrative, and development commands for Don't Starve Together. These commands are essential tools for server administration, mod development, and game testing.

## Overview

Console commands in DST are prefixed with `c_` and provide powerful functionality for:
- **World Management**: Save, reset, regenerate worlds
- **Player Management**: Teleport, modify stats, manage inventories  
- **Entity Manipulation**: Spawn, remove, find entities
- **Server Administration**: Manage players, announcements, voting
- **Debug Tools**: Performance monitoring, testing utilities

## Helper Functions

### Core Helper Functions

#### ConsoleCommandPlayer()
Returns the appropriate player entity for console commands.

```lua
function ConsoleCommandPlayer()
    return (c_sel() ~= nil and c_sel():HasTag("player") and c_sel()) or ThePlayer or AllPlayers[1]
end
```

#### ConsoleWorldPosition()
Returns the current world position for console operations.

```lua
function ConsoleWorldPosition()
    return TheInput.overridepos or TheInput:GetWorldPosition()
end
```

#### ConsoleWorldEntityUnderMouse()
Returns the entity under the mouse cursor or at override position.

## World Management Commands

### Save & Reset Operations

#### c_save()
Saves the current game state.

```lua
c_save()
```

#### c_reset()
Restarts the server to the last save file.

```lua
c_reset()
```

#### c_rollback(count)
Rolls back a specified number of saves.

**Parameters:**
- `count` (number, optional): Number of saves to roll back (default: 1)

```lua
c_rollback(1)  -- Roll back 1 save
c_rollback(0)  -- Same as c_reset()
```

#### c_regenerateworld()
Permanently deletes all game worlds in a server cluster and regenerates new worlds.

⚠️ **Warning**: This permanently deletes save data.

```lua
c_regenerateworld()
```

#### c_regenerateshard(wipesettings)
Regenerates only the current shard.

**Parameters:**
- `wipesettings` (boolean, optional): Whether to wipe world settings

```lua
c_regenerateshard()        -- Preserve settings
c_regenerateshard(true)    -- Wipe settings
```

### Server Control

#### c_shutdown(save)
Shuts down the application.

**Parameters:**
- `save` (boolean, optional): Whether to save before shutdown (default: true)

```lua
c_shutdown()       -- Save and shutdown
c_shutdown(false)  -- Shutdown without saving
```

#### c_announce(msg, interval, category)
Sends server announcements.

**Parameters:**
- `msg` (string): Message to announce
- `interval` (number, optional): Repeat interval in seconds
- `category` (string, optional): Announcement category

```lua
c_announce("Server restarting in 5 minutes")
c_announce("Welcome!", 300)  -- Repeat every 5 minutes
c_announce("System message", nil, "system")
c_announce()  -- Cancel periodic announcements
```

## Player Management Commands

### Player Stats

#### c_sethealth(n)
Sets player health percentage.

**Parameters:**
- `n` (number): Health percentage (0-1)

```lua
c_sethealth(1)    -- Full health
c_sethealth(0.5)  -- Half health
```

#### c_setsanity(n)
Sets player sanity percentage.

```lua
c_setsanity(1)    -- Full sanity
c_setsanity(0.3)  -- Low sanity
```

#### c_sethunger(n)
Sets player hunger percentage.

```lua
c_sethunger(1)    -- Full hunger
c_sethunger(0.2)  -- Very hungry
```

#### c_settemperature(n)
Sets player temperature.

**Parameters:**
- `n` (number): Temperature value

```lua
c_settemperature(25)  -- Comfortable temperature
c_settemperature(80)  -- Very hot
c_settemperature(-20) -- Very cold
```

#### c_setmoisture(n)
Sets player wetness percentage.

```lua
c_setmoisture(0)    -- Dry
c_setmoisture(1)    -- Completely wet
```

### Player Abilities

#### c_godmode(player)
Toggles invincibility for a player.

**Parameters:**
- `player` (entity, optional): Target player (default: command player)

```lua
c_godmode()        -- Toggle godmode for self
c_godmode(player)  -- Toggle godmode for specific player
```

#### c_supergodmode(player)
Enhanced godmode that also restores all stats.

```lua
c_supergodmode()   -- Full restoration + invincibility
```

#### c_freecrafting(player)
Gives player access to all recipes.

```lua
c_freecrafting()   -- Unlock all recipes
```

### Player Movement

#### c_teleport(x, y, z, inst)
Teleports a player to specified coordinates.

**Parameters:**
- `x, y, z` (numbers): Target coordinates
- `inst` (entity, optional): Player to teleport

```lua
c_teleport(100, 0, 200)     -- Teleport to coordinates
c_teleport()                -- Teleport to cursor position
```

#### c_goto(dest, inst)
Teleports to another player or entity.

**Parameters:**
- `dest` (entity/string): Target player or entity
- `inst` (entity, optional): Player to teleport

```lua
c_goto("PlayerName")  -- Go to specific player
c_goto(entity)        -- Go to specific entity
```

#### c_gotoroom(roomname, inst)
Teleports to a specific room type.

```lua
c_gotoroom("forest")     -- Go to forest room
c_gotoroom("cave")       -- Go to cave room
c_gotoroom("ruins")      -- Go to ruins room
```

## Entity & Prefab Commands

### Spawning Entities

#### c_spawn(prefab, count, dontselect)
Spawns entities at cursor position.

**Parameters:**
- `prefab` (string): Prefab name to spawn
- `count` (number, optional): Number to spawn (default: 1)
- `dontselect` (boolean, optional): Don't auto-select spawned entity

```lua
c_spawn("wilson")           -- Spawn Wilson
c_spawn("log", 20)          -- Spawn 20 logs
c_spawn("deerclops", 1, true) -- Spawn Deerclops without selecting
```

#### c_give(prefab, count, dontselect)
Gives items to player's inventory.

```lua
c_give("axe")               -- Give an axe
c_give("goldnugget", 40)    -- Give 40 gold nuggets
c_give("backpack")          -- Give a backpack
```

#### c_equip(prefab, count, dontselect)
Gives and equips items to player.

```lua
c_equip("football_helmet")  -- Equip football helmet
c_equip("spear", 2)         -- Equip spear, give second to inventory
```

### Finding Entities

#### c_find(prefab, radius, inst)
Finds the closest entity of specified type.

**Parameters:**
- `prefab` (string): Prefab name to find
- `radius` (number, optional): Search radius
- `inst` (entity, optional): Search origin

```lua
local tree = c_find("evergreen")        -- Find closest evergreen
local rock = c_find("rock1", 50)        -- Find rock within 50 units
```

#### c_findnext(prefab, radius, inst)
Finds the next entity of specified type.

```lua
c_findnext("beefalo")       -- Find next beefalo
c_gonext("spider")          -- Find and go to next spider
```

#### c_list(prefab)
Lists all entities of a specific prefab type.

```lua
c_list("wilson")            -- List all Wilson entities
c_list("spider_warrior")    -- List all spider warriors
```

#### c_listtag(tag)
Lists all entities with a specific tag.

```lua
c_listtag("player")         -- List all players
c_listtag("structure")      -- List all structures
```

### Entity Selection & Manipulation

#### c_sel()
Returns the currently selected entity.

```lua
local selected = c_sel()
if selected then
    print("Selected:", selected.prefab)
end
```

#### c_select(inst)
Selects an entity for manipulation.

```lua
c_select()              -- Select entity under cursor
c_select(entity)        -- Select specific entity
```

#### c_remove(entity)
Removes an entity from the world.

```lua
c_remove()              -- Remove entity under cursor
c_remove(entity)        -- Remove specific entity
```

#### c_removeall(name)
Removes all entities of a specific type.

```lua
c_removeall("spider")   -- Remove all spiders
c_removeall("hound")    -- Remove all hounds
```

## Debug & Development Commands

### World Analysis

#### c_countprefabs(prefab, noprint)
Counts entities of a specific prefab type.

```lua
local count = c_countprefabs("tree")        -- Count trees
local silent = c_countprefabs("rock", true) -- Count without printing
```

#### c_countallprefabs()
Displays count of all prefab types in the world.

```lua
c_countallprefabs()  -- Comprehensive entity count
```

#### c_dumpentities()
Outputs detailed entity statistics.

```lua
c_dumpentities()     -- Dump entity counts and statistics
```

### World State Debugging

#### c_dumpworldstate()
Displays current world state information.

```lua
c_dumpworldstate()   -- Show world state debug info
```

#### c_dumpseasons()
Shows seasonal information.

```lua
c_dumpseasons()      -- Display season debug info
```

#### c_tile()
Shows tile information at cursor position.

```lua
c_tile()             -- Display tile type and coordinates
```

### Performance & Testing

#### c_speedmult(multiplier)
Modifies player movement speed.

**Parameters:**
- `multiplier` (number): Speed multiplier

```lua
c_speedmult(2)       -- Double speed
c_speedmult(0.5)     -- Half speed
c_speedmult(1)       -- Normal speed
```

#### c_speedup()
Increases game time scale by 10x.

```lua
c_speedup()          -- Speed up time
```

#### c_skip(num)
Skips game time.

**Parameters:**
- `num` (number, optional): Number of days to skip (default: 1)

```lua
c_skip()             -- Skip 1 day
c_skip(5)            -- Skip 5 days
```

## Server Administration Commands

### Player Management

#### c_listplayers()
Lists currently connected players.

```lua
c_listplayers()      -- Show active player list
```

#### c_listallplayers()
Lists all players in AllPlayers table.

```lua
c_listallplayers()   -- Show all players including inactive
```

#### c_despawn(player)
Despawns a player, returning them to character select.

```lua
c_despawn()          -- Despawn self
c_despawn("PlayerName") -- Despawn specific player
```

#### c_getnumplayers()
Prints current number of players.

```lua
c_getnumplayers()    -- Show player count
```

#### c_getmaxplayers()
Prints maximum allowed players.

```lua
c_getmaxplayers()    -- Show max player limit
```

### Remote Command Execution

#### c_remote(fnstr)
Executes a Lua string remotely on the server.

**Parameters:**
- `fnstr` (string): Lua code to execute

```lua
c_remote("c_spawn('wilson')")    -- Remote spawn command
c_remote("print('Hello from server!')")
```

### Voting System

#### c_startvote(commandname, playeroruserid)
Starts a server vote.

**Parameters:**
- `commandname` (string): Command to vote on
- `playeroruserid` (string/number/entity): Target player

```lua
c_startvote("kick", "PlayerName")
```

#### c_stopvote()
Stops the current vote.

```lua
c_stopvote()
```

## Specialized Commands

### Seasonal Events

#### c_summondeerclops()
Summons Deerclops for the command player.

```lua
c_summondeerclops()
```

#### c_summonbearger()
Summons Bearger for the command player.

```lua
c_summonbearger()
```

#### c_summonmalbatross()
Summons Malbatross at nearest fish shoal.

```lua
c_summonmalbatross()
```

### Ocean Content

#### c_makeboat()
Creates a fully equipped boat at cursor position.

```lua
c_makeboat()         -- Spawn complete boat setup
```

#### c_makegrassboat()
Creates a grass boat setup.

```lua
c_makegrassboat()    -- Spawn grass boat
```

### Material Helpers

#### c_giveingredients(prefab)
Gives all ingredients needed to craft a specific item.

**Parameters:**
- `prefab` (string): Recipe name

```lua
c_giveingredients("backpack")    -- Give backpack ingredients
c_giveingredients("pighouse")    -- Give pig house ingredients
```

#### c_allbooks()
Gives player all book types.

```lua
c_allbooks()         -- Receive all book variants
```

### Maintenance Commands

#### c_maintainhealth(player, percent)
Automatically maintains player health at specified level.

**Parameters:**
- `player` (entity, optional): Target player
- `percent` (number, optional): Health percentage to maintain (default: 1)

```lua
c_maintainhealth()           -- Maintain full health
c_maintainhealth(player, 0.8) -- Maintain 80% health
```

#### c_maintainall(player)
Maintains all player stats at maximum levels.

```lua
c_maintainall()      -- Auto-maintain health, sanity, hunger, etc.
```

#### c_cancelmaintaintasks(player)
Cancels all maintenance tasks.

```lua
c_cancelmaintaintasks()  -- Stop all auto-maintenance
```

## Usage Examples

### Basic Server Administration
```lua
-- List all players
c_listplayers()

-- Save the game
c_save()

-- Send server announcement
c_announce("Server maintenance in 10 minutes")

-- Teleport troublesome player to spawn
c_teleport(0, 0, 0, UserToPlayer("PlayerName"))
```

### Development & Testing
```lua
-- Setup test environment
c_godmode()                    -- Enable invincibility
c_freecrafting()              -- Unlock all recipes
c_give("backpack")            -- Get basic gear
c_speedmult(2)                -- Move faster

-- Spawn test entities
c_spawn("deerclops")          -- Boss testing
c_spawn("pighouse", 5)        -- Structure testing
```

### World Exploration
```lua
-- Find and go to different areas
c_gotoroom("deciduous")       -- Go to deciduous forest
c_findnext("wormhole")        -- Find next wormhole
c_gonext("beefalo")           -- Go to next beefalo
```

### Resource Management
```lua
-- Give common resources
c_give("log", 40)
c_give("rocks", 40)
c_give("goldnugget", 20)
c_give("gears", 10)

-- Give ingredients for specific item
c_giveingredients("icepack")
```

## Technical Notes

- Commands prefixed with `c_` are console functions
- Most commands support remote execution via `c_remote()`
- Many commands check for master simulation before execution
- Commands automatically handle player targeting and validation
- Server admin privileges required for administrative commands
- Some commands are development/debug only and not meant for regular gameplay

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 675312 | 2024-12-19 | Current stable implementation with all documented commands |

## Related Modules

- **[Class](class.md)** - Base class system
- **[Networking](networking.md)** - Network communication system
- **[Prefabs](prefabs.md)** - Entity prefab system

---

*This documentation covers the Console Commands module as of build 675312. Console commands are powerful tools that should be used responsibly, especially on production servers.*
