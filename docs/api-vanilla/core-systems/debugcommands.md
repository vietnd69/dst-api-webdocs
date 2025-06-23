---
title: "Debug Commands"
description: "Collection of debug utility functions for development, testing, and troubleshooting in Don't Starve Together"
sidebar_position: 11
slug: /api-vanilla/core-systems/debugcommands
last_updated: "2024-12-28"
build_version: "675312"
change_status: "stable"
---

# Debug Commands

The `debugcommands` module provides a comprehensive collection of debug utility functions for development, testing, and troubleshooting in Don't Starve Together. These functions are primarily used for spawning items, manipulating world state, testing game mechanics, and debugging various systems.

## Overview

Debug commands enable developers and testers to:
- Spawn prefabs and items in organized patterns
- Manipulate world state and game systems
- Test game mechanics and performance
- Debug entity interactions and behaviors
- Generate test scenarios and content
- Analyze game data and performance metrics

:::warning Development Only
These functions are intended for development and testing purposes only. They should not be used in production gameplay as they can significantly alter game balance and progression.
:::

## API Reference

### Spawning Functions

#### `d_spawnlist(list, spacing, fn)`

Spawns a list of prefabs in a grid pattern at the console cursor position.

**Parameters:**
- `list` (table): Array of prefab names or tables with `{prefab, count, item_fn}` format
- `spacing` (number, optional): Distance between spawned items (default: 2)
- `fn` (function, optional): Function to call on each spawned instance

**Returns:**
- `table`: Array of created instances

**Example:**
```lua
-- Spawn basic items
d_spawnlist({"log", "rocks", "cutgrass"})

-- Spawn with custom spacing
d_spawnlist({"log", "rocks", "cutgrass"}, 3)

-- Spawn with quantities and custom function
local items = {
    {"log", 10},
    {"rocks", 5, function(inst) inst.AnimState:SetMultColour(1, 0, 0, 1) end}
}
d_spawnlist(items, 2, function(inst) inst.persists = false end)
```

#### `d_playeritems()`

Spawns all craftable items organized by builder tags (character-specific items).

**Behavior:**
- Groups items by their builder_tag (character requirements)
- Sorts items alphabetically within each group
- Spawns items in a grid pattern near the console cursor
- Excludes placeable structures and invalid prefabs

**Example:**
```lua
d_playeritems()
-- Spawns all character-specific craftable items
```

#### `d_allmutators()`

Gives the player all available spider mutators for testing.

**Spawned Mutators:**
- `mutator_warrior`
- `mutator_dropper`
- `mutator_hider`
- `mutator_spitter`
- `mutator_moon`
- `mutator_water`

**Example:**
```lua
d_allmutators()
-- Player receives all spider mutator items
```

#### `d_allcircuits()`

Spawns all WX-78 circuit modules in a grid pattern.

**Behavior:**
- Reads module definitions from `wx78_moduledefs`
- Spawns each circuit module as `wx78module_[name]`
- Arranges modules in a square grid formation

**Example:**
```lua
d_allcircuits()
-- Spawns all WX-78 upgrade modules for testing
```

#### `d_allheavy()`

Spawns heavy objects that require special handling for movement.

**Heavy Objects Spawned:**
- `cavein_boulder`
- `sunkenchest`
- `sculpture_knighthead`
- `glassspike`
- `moon_altar_idol`
- `oceantreenut`
- `shell_cluster`
- `potato_oversized`
- `chesspiece_knight_stone`
- `chesspiece_knight_marble`
- `chesspiece_knight_moonglass`
- `potatosack`

**Example:**
```lua
d_allheavy()
-- Spawns various heavy objects for physics testing
```

#### `d_spiders()`

Spawns all spider variants as followers and gives water spider item.

**Spider Types:**
- `spider` (basic spider)
- `spider_warrior`
- `spider_dropper`
- `spider_hider`
- `spider_spitter`
- `spider_moon`
- `spider_healer`

**Behavior:**
- All spawned spiders become followers of the player
- Player receives `spider_water` item

**Example:**
```lua
d_spiders()
-- Spawns spider army following the player
```

#### `d_particles()`

Spawns emitting particle effects in a grid with labels and movement.

**Features:**
- Spawns various torch fires and particle effects
- Each effect moves in a circle for visibility
- Labels show prefab names above each effect
- Automatic cleanup (non-persistent entities)

**Example:**
```lua
d_particles()
-- Spawns moving particle effects with labels for visual testing
```

### World Manipulation Functions

#### `d_fullmoon()`

Sets the moon phase to full moon.

**Example:**
```lua
d_fullmoon()
-- Changes moon phase to full for testing lunar mechanics
```

#### `d_newmoon()`

Sets the moon phase to new moon.

**Example:**
```lua
d_newmoon()
-- Changes moon phase to new for testing mechanics
```

#### `d_lunarrift()`

Spawns a lunar rift at the console cursor position.

**Behavior:**
- Enables lunar rifts in the world
- Creates rift at tile-aligned position
- Used for testing rift mechanics

**Example:**
```lua
d_lunarrift()
-- Creates lunar rift for testing
```

#### `d_shadowrift()`

Spawns a shadow rift at the console cursor position.

**Behavior:**
- Enables shadow rifts in the world
- Creates rift at tile-aligned position
- Cave-specific rift testing

**Example:**
```lua
d_shadowrift()
-- Creates shadow rift for testing
```

#### `d_riftspawns()`

Triggers mass rift spawning for stress testing.

**Behavior:**
- Opens appropriate rift type based on world (lunar/shadow)
- Waits 10 seconds, then spawns 200 rifts
- Highlights all rifts for debugging
- Announces progress to players

**Example:**
```lua
d_riftspawns()
-- Mass spawns rifts for performance testing
```

### Exploration and Map Functions

#### `d_exploreland()`

Reveals all land tiles on the map.

**Behavior:**
- Scans world tiles with specified precision
- Reveals only land tiles (not ocean)
- Updates player's map exploration data

**Example:**
```lua
d_exploreland()
-- Reveals all land areas on the map
```

#### `d_exploreocean()`

Reveals all ocean tiles on the map.

**Example:**
```lua
d_exploreocean()
-- Reveals all ocean areas on the map
```

#### `d_explore_printunseentiles()`

Prints coordinates of all unseen tiles for debugging.

**Behavior:**
- Scans entire world with high precision
- Prints world coordinates of unexplored land tiles
- Useful for identifying map generation issues

**Example:**
```lua
d_explore_printunseentiles()
-- Outputs coordinates of unexplored areas
```

### Character and Skill Functions

#### `d_unlockaffinities()`

Unlocks character affinities by marking required bosses as defeated.

**Unlocked Affinities:**
- Marks Fuel Weaver as killed
- Marks Celestial Champion as killed
- Enables character affinity trees

**Example:**
```lua
d_unlockaffinities()
-- Unlocks all character skill tree affinities
```

#### `d_resetskilltree()`

Resets the player's skill tree and grants maximum skill points.

**Behavior:**
- Deactivates all currently learned skills
- Attempts up to 50 iterations to fully reset
- Grants 9,999,999 skill XP for testing
- Syncs changes between server and client

**Example:**
```lua
d_resetskilltree()
-- Resets skills and grants maximum XP
```

#### `d_reloadskilltreedefs()`

Reloads skill tree definitions for development.

**Example:**
```lua
d_reloadskilltreedefs()
-- Hot-reloads skill tree changes during development
```

#### `d_printskilltreestringsforcharacter(character)`

Generates missing localization strings for character skill trees.

**Parameters:**
- `character` (string, optional): Character prefab name (defaults to current player)

**Example:**
```lua
d_printskilltreestringsforcharacter("wilson")
-- Outputs missing localization strings for Wilson's skills
```

### Transportation Functions

#### `d_teleportboat(x, y, z)`

Teleports the player's boat to specified coordinates.

**Parameters:**
- `x, y, z` (numbers, optional): Target coordinates (defaults to console position)

**Safety Checks:**
- Verifies player is on a boat
- Checks for blocking entities at destination
- Handles item collision and physics constraints
- Snaps camera for smooth transition

**Example:**
```lua
-- Teleport to console cursor
d_teleportboat()

-- Teleport to specific coordinates
d_teleportboat(100, 0, 200)
```

### Boss and Event Functions

#### `d_rabbitking(kind)`

Spawns a Rabbit King for the current player.

**Parameters:**
- `kind` (string, optional): Specific rabbit king type

**Example:**
```lua
-- Spawn random rabbit king
d_rabbitking()

-- Spawn specific type
d_rabbitking("aggressive")
```

#### `d_oceanarena()`

Triggers ocean arena placement for shark boi events.

**Behavior:**
- Enables debug rate for faster placement
- Initiates arena finding and placement process
- Requires `sharkboimanager` component

**Example:**
```lua
d_oceanarena()
-- Triggers shark boi ocean arena event
```

### Audio Testing Functions

#### `d_testsound(soundpath, loopname, volume)`

Plays a sound effect for testing.

**Parameters:**
- `soundpath` (string): Path to sound file
- `loopname` (string, optional): Loop identifier for continuous sounds
- `volume` (number, optional): Volume level

**Example:**
```lua
d_testsound("dontstarve/creatures/spider/attack")
d_testsound("dontstarve/music/music_epicfight", "combat_music", 0.5)
```

#### `d_stopsound(loopname)`

Stops a looping sound effect.

**Parameters:**
- `loopname` (string): Loop identifier to stop

**Example:**
```lua
d_stopsound("combat_music")
```

### Performance and Analysis Functions

#### `d_testdps(time, target)`

Measures damage per second output against a target.

**Parameters:**
- `time` (number, optional): Test duration in seconds (default: 5)
- `target` (Entity, optional): Target entity (defaults to entity under mouse)

**Behavior:**
- Monitors damage events on target entity
- Calculates and reports DPS after test period
- Automatically cleans up event listeners

**Example:**
```lua
-- Test DPS on entity under mouse for 5 seconds
d_testdps()

-- Test for 10 seconds on specific target
local target = c_sel()
d_testdps(10, target)
```

#### `d_mapstatistics(count_cutoff, item_cutoff, density_cutoff)`

Analyzes map content and generates statistics report.

**Parameters:**
- `count_cutoff` (number, optional): Minimum count for prefab reporting (default: 200)
- `item_cutoff` (number, optional): Minimum count for item reporting (default: 200)
- `density_cutoff` (number, optional): Minimum density for location reporting (default: 100)

**Reports:**
- Most common prefabs by count
- Most common items and inventory status
- High-density entity locations
- Total counts and statistics

**Example:**
```lua
-- Default analysis
d_mapstatistics()

-- Custom thresholds
d_mapstatistics(100, 50, 50)
```

### Utility Functions

#### `d_decodedata(path)`

Decodes and saves persistent data files for debugging.

**Parameters:**
- `path` (string): Path to persistent data file

**Behavior:**
- Loads encoded persistent data
- Saves decoded version with "_decoded" suffix
- Useful for examining save file contents

**Example:**
```lua
d_decodedata("client_save/survival_1")
-- Creates "client_save/survival_1_decoded" with readable data
```

#### `d_require(file)`

Forces module reload by clearing cache and re-requiring.

**Parameters:**
- `file` (string): Module path to reload

**Example:**
```lua
d_require("components/health")
-- Forces reload of health component for development
```

#### `d_timeddebugprefab(x, y, z, lifetime, prefab)`

Spawns a temporary debug marker that auto-removes.

**Parameters:**
- `x, y, z` (numbers): World position
- `lifetime` (number, optional): Duration in seconds (default: 7)
- `prefab` (string, optional): Prefab to spawn (default: "log")

**Returns:**
- `Entity`: Spawned debug entity

**Example:**
```lua
-- Mark a location for 10 seconds
d_timeddebugprefab(100, 0, 200, 10, "telelocator_staff")
```

## Item and Content Functions

#### `d_allsongs()`

Gives the player all battle songs for testing.

**Songs Provided:**
- `battlesong_durability`
- `battlesong_healthgain`
- `battlesong_sanitygain`
- `battlesong_sanityaura`
- `battlesong_fireresistance`
- `battlesong_instant_taunt`

**Example:**
```lua
d_allsongs()
-- Player receives all Wigfrid battle songs
```

#### `d_prizepouch(prefab, nugget_count)`

Creates a prize pouch with specified contents.

**Parameters:**
- `prefab` (string, optional): Pouch type (default: "redpouch")
- `nugget_count` (number, optional): Number of gold nuggets to include (default: 0)

**Example:**
```lua
-- Empty red pouch
d_prizepouch()

-- Green pouch with 5 gold nuggets
d_prizepouch("greenpouch", 5)
```

## Usage Guidelines

### Development Best Practices

1. **Test Environment**: Use debug commands only in dedicated test worlds
2. **Save Backups**: Create save backups before extensive testing
3. **Performance Impact**: Some commands (like `d_riftspawns`) can impact performance
4. **Cleanup**: Many spawned entities are non-persistent and will disappear on reload

### Common Testing Scenarios

```lua
-- Complete character testing setup
d_unlockaffinities()  -- Unlock skill trees
d_resetskilltree()    -- Reset and max out skills
d_allsongs()          -- Give all battle songs
d_playeritems()       -- Spawn all craftable items

-- World state testing
d_fullmoon()          -- Set moon phase
d_lunarrift()         -- Create lunar rift
d_exploreland()       -- Reveal map

-- Performance testing
d_mapstatistics()     -- Analyze current state
d_riftspawns()        -- Stress test with multiple rifts
```

### Safety Considerations

- **Master Simulation**: Many commands require `TheWorld.ismastersim` check
- **Player Validation**: Commands verify player existence and state
- **Error Handling**: Most functions include safety checks and error reporting
- **Resource Usage**: Be mindful of spawning large quantities of entities

## Dependencies

### Required Systems
- **Console System**: For world position and entity selection
- **World Components**: Various world managers and systems
- **Player Systems**: Character, inventory, and skill systems
- **Entity Framework**: For spawning and manipulating entities

### Global Functions Used
- `ConsoleWorldPosition()`: Get cursor world position
- `ConsoleCommandPlayer()`: Get command-issuing player
- `SpawnPrefab()`: Create entity instances
- `c_give()`, `c_spawn()`, `c_sel()`: Console utility functions

## Version History

| Version | Changes |
|---------|---------|
| 675312  | Current implementation with comprehensive debug command set |

## Related Systems

- [Console Commands](/api-vanilla/core-systems/consolecommands/) - Built-in console command system
- [Prefabs](/api-vanilla/core-systems/prefabs/) - Entity spawning and management
- [World Management](/api-vanilla/core-systems/world-management/) - World state manipulation
- [Components](/api-vanilla/core-systems/components/) - Entity component systems

## Notes

- **Development Tool**: Debug commands are development utilities, not gameplay features
- **Master Simulation**: Most world-altering commands only work on the master simulation
- **Performance Impact**: Some commands can significantly impact game performance
- **Non-Persistent**: Many spawned debug entities don't persist through save/load cycles
- **Console Integration**: Commands are typically accessed through the game's debug console
- **Testing Efficiency**: Commands are designed to quickly set up complex testing scenarios
