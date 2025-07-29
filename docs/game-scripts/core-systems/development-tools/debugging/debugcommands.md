---
id: debugcommands
title: Debug Commands
description: Collection of debug utility functions for development, testing, and troubleshooting in Don't Starve Together
sidebar_position: 1
slug: core-systems-debugcommands
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Debug Commands

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current stable implementation |

## Overview

The `debugcommands` module provides a comprehensive collection of debug utility functions for development, testing, and troubleshooting in Don't Starve Together. These functions enable developers and testers to spawn items, manipulate world state, test game mechanics, debug entity interactions, and generate test scenarios.

:::warning Development Only
These functions are intended for development and testing purposes only. They should not be used in production gameplay as they can significantly alter game balance and progression.
:::

## Usage Example

```lua
-- Basic item spawning
d_spawnlist({"log", "rocks", "cutgrass"})

-- Complete character testing setup
d_unlockaffinities()  -- Unlock skill trees
d_resetskilltree()    -- Reset and max out skills
d_allsongs()          -- Give all battle songs
d_playeritems()       -- Spawn all craftable items

-- World state testing
d_fullmoon()          -- Set moon phase
d_lunarrift()         -- Create lunar rift
d_exploreland()       -- Reveal map
```

## Functions

### d_spawnlist(list, spacing, fn) {#d-spawnlist}

**Status:** `stable`

**Description:**
Spawns a list of prefabs in a grid pattern at the console cursor position.

**Parameters:**
- `list` (table): Array of prefab names or tables with `{prefab, count, item_fn}` format
- `spacing` (number, optional): Distance between spawned items (default: 2)
- `fn` (function, optional): Function to call on each spawned instance

**Returns:**
- (table): Array of created instances

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

**Version History:**
- Current implementation since build 676042

### d_playeritems() {#d-playeritems}

**Status:** `stable`

**Description:**
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

**Version History:**
- Current implementation since build 676042

### d_allmutators() {#d-allmutators}

**Status:** `stable`

**Description:**
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

**Version History:**
- Current implementation since build 676042

### d_allcircuits() {#d-allcircuits}

**Status:** `stable`

**Description:**
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

**Version History:**
- Current implementation since build 676042

### d_allheavy() {#d-allheavy}

**Status:** `stable`

**Description:**
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

**Version History:**
- Current implementation since build 676042

### d_spiders() {#d-spiders}

**Status:** `stable`

**Description:**
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

**Version History:**
- Current implementation since build 676042

### d_particles() {#d-particles}

**Status:** `stable`

**Description:**
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

**Version History:**
- Current implementation since build 676042

### d_fullmoon() {#d-fullmoon}

**Status:** `stable`

**Description:**
Sets the moon phase to full moon.

**Example:**
```lua
d_fullmoon()
-- Changes moon phase to full for testing lunar mechanics
```

**Version History:**
- Current implementation since build 676042

### d_newmoon() {#d-newmoon}

**Status:** `stable`

**Description:**
Sets the moon phase to new moon.

**Example:**
```lua
d_newmoon()
-- Changes moon phase to new for testing mechanics
```

**Version History:**
- Current implementation since build 676042

### d_lunarrift() {#d-lunarrift}

**Status:** `stable`

**Description:**
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

**Version History:**
- Current implementation since build 676042

### d_shadowrift() {#d-shadowrift}

**Status:** `stable`

**Description:**
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

**Version History:**
- Current implementation since build 676042

### d_riftspawns() {#d-riftspawns}

**Status:** `stable`

**Description:**
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

**Version History:**
- Current implementation since build 676042

### d_exploreland() {#d-exploreland}

**Status:** `stable`

**Description:**
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

**Version History:**
- Current implementation since build 676042

### d_exploreocean() {#d-exploreocean}

**Status:** `stable`

**Description:**
Reveals all ocean tiles on the map.

**Example:**
```lua
d_exploreocean()
-- Reveals all ocean areas on the map
```

**Version History:**
- Current implementation since build 676042

### d_explore_printunseentiles() {#d-explore-printunseentiles}

**Status:** `stable`

**Description:**
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

**Version History:**
- Current implementation since build 676042

### d_unlockaffinities() {#d-unlockaffinities}

**Status:** `stable`

**Description:**
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

**Version History:**
- Current implementation since build 676042

### d_resetskilltree() {#d-resetskilltree}

**Status:** `stable`

**Description:**
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

**Version History:**
- Current implementation since build 676042

### d_reloadskilltreedefs() {#d-reloadskilltreedefs}

**Status:** `stable`

**Description:**
Reloads skill tree definitions for development.

**Example:**
```lua
d_reloadskilltreedefs()
-- Hot-reloads skill tree changes during development
```

**Version History:**
- Current implementation since build 676042

### d_printskilltreestringsforcharacter(character) {#d-printskilltreestringsforcharacter}

**Status:** `stable`

**Description:**
Generates missing localization strings for character skill trees.

**Parameters:**
- `character` (string, optional): Character prefab name (defaults to current player)

**Example:**
```lua
d_printskilltreestringsforcharacter("wilson")
-- Outputs missing localization strings for Wilson's skills
```

**Version History:**
- Current implementation since build 676042

### d_teleportboat(x, y, z) {#d-teleportboat}

**Status:** `stable`

**Description:**
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

**Version History:**
- Current implementation since build 676042

### d_rabbitking(kind) {#d-rabbitking}

**Status:** `stable`

**Description:**
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

**Version History:**
- Current implementation since build 676042

### d_oceanarena() {#d-oceanarena}

**Status:** `stable`

**Description:**
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

**Version History:**
- Current implementation since build 676042

### d_allsongs() {#d-allsongs}

**Status:** `stable`

**Description:**
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

**Version History:**
- Current implementation since build 676042

### d_decodedata(path) {#d-decodedata}

**Status:** `stable`

**Description:**
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

**Version History:**
- Current implementation since build 676042

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

## Related Modules

- [Console Commands](./consolecommands.md): Built-in console command system
- [Prefabs](./prefabs.md): Entity spawning and management
- [Main Functions](./mainfunctions.md): Core game functions

## Notes

- **Development Tool**: Debug commands are development utilities, not gameplay features
- **Master Simulation**: Most world-altering commands only work on the master simulation
- **Performance Impact**: Some commands can significantly impact game performance
- **Non-Persistent**: Many spawned debug entities don't persist through save/load cycles
- **Console Integration**: Commands are typically accessed through the game's debug console
- **Testing Efficiency**: Commands are designed to quickly set up complex testing scenarios
