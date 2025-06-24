---
id: consolecommands
title: Console Commands
description: Comprehensive DST console command system for debugging, administration, and development tasks
sidebar_position: 1
slug: core-systems-consolecommands
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Console Commands

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----| 
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The **Console Commands** module provides an extensive collection of debugging, administrative, and development commands for Don't Starve Together. These commands are essential tools for server administration, mod development, game testing, and world management.

## Usage Example

```lua
-- Basic server administration
c_save()                          -- Save the world
c_announce("Server maintenance in 10 minutes")
c_listplayers()                   -- List all connected players

-- Player debugging
c_godmode()                       -- Toggle invincibility
c_give("backpack")                -- Give item to player
c_teleport(100, 0, 200)           -- Teleport to coordinates

-- World manipulation
c_spawn("deerclops")              -- Spawn entity at cursor
c_regenerateworld()               -- Reset entire world
```

## Helper Functions

### ConsoleCommandPlayer() {#console-command-player}

**Status:** `stable`

**Description:**
Returns the appropriate player entity for console commands. Prioritizes selected player, then local player, then first player in AllPlayers.

**Returns:**
- (entity): Target player entity for command execution

**Example:**
```lua
local player = ConsoleCommandPlayer()
if player ~= nil then
    player.components.health:SetPercent(1)
end
```

### ConsoleWorldPosition() {#console-world-position}

**Status:** `stable`

**Description:**
Returns the current world position for console operations, using override position if available or input world position.

**Returns:**
- (Vector3): Current world position for operations

**Example:**
```lua
local x, y, z = ConsoleWorldPosition():Get()
local inst = SpawnPrefab("log")
inst.Transform:SetPosition(x, y, z)
```

### ConsoleWorldEntityUnderMouse() {#console-world-entity-under-mouse}

**Status:** `stable`

**Description:**
Returns the entity under the mouse cursor or at override position, with visibility checking.

**Returns:**
- (entity): Entity under cursor or nil if none found

## World Management Commands

### c_save() {#c-save}

**Status:** `stable`

**Description:**
Saves the current game state. Automatically handles master simulation checking and remote execution.

**Example:**
```lua
c_save()  -- Save current world state
```

### c_reset() {#c-reset}

**Status:** `stable`

**Description:**
Restarts the server to the last save file. Equivalent to `c_rollback(0)`.

**Example:**
```lua
c_reset()  -- Restart to last save
```

### c_rollback(count) {#c-rollback}

**Status:** `stable`

**Description:**
Rolls back a specified number of saves.

**Parameters:**
- `count` (number, optional): Number of saves to roll back (default: 1)

**Example:**
```lua
c_rollback()     -- Roll back 1 save
c_rollback(3)    -- Roll back 3 saves  
c_rollback(0)    -- Same as c_reset()
```

### c_regenerateworld() {#c-regenerate-world}

**Status:** `stable`

**Description:**
Permanently deletes all game worlds in a server cluster and regenerates new worlds. This affects all shards in the cluster.

**⚠️ Warning:** This permanently deletes save data for the entire cluster.

**Example:**
```lua
c_regenerateworld()  -- Delete and regenerate all worlds
```

### c_regenerateshard(wipesettings) {#c-regenerate-shard}

**Status:** `stable`

**Description:**
Regenerates only the current shard, optionally preserving world settings.

**Parameters:**
- `wipesettings` (boolean, optional): Whether to wipe world settings (default: false)

**Example:**
```lua
c_regenerateshard()        -- Regenerate shard, preserve settings
c_regenerateshard(true)    -- Regenerate shard, wipe settings
```

### c_shutdown(save) {#c-shutdown}

**Status:** `stable`

**Description:**
Shuts down the application with optional saving.

**Parameters:**
- `save` (boolean, optional): Whether to save before shutdown (default: true)

**Example:**
```lua
c_shutdown()       -- Save and shutdown
c_shutdown(false)  -- Shutdown without saving
```

## Server Administration Commands

### c_announce(msg, interval, category) {#c-announce}

**Status:** `stable`

**Description:**
Sends server announcements with support for one-time, periodic, or system messages.

**Parameters:**
- `msg` (string): Message to announce
- `interval` (number, optional): Repeat interval in seconds
- `category` (string, optional): Announcement category ("system" for system messages)

**Example:**
```lua
c_announce("Server restarting in 5 minutes")      -- One-time announcement
c_announce("Welcome!", 300)                        -- Repeat every 5 minutes
c_announce("System message", nil, "system")        -- System message
c_announce()                                       -- Cancel periodic announcements
```

### c_listplayers() {#c-list-players}

**Status:** `stable`

**Description:**
Lists currently connected players with admin status, index, userid, name, and character.

**Example:**
```lua
c_listplayers()
-- Output format: [*][1] (userid) playername <character>
-- * indicates admin status
```

### c_listallplayers() {#c-list-all-players}

**Status:** `stable`

**Description:**
Returns a listing of all players in the AllPlayers table, including inactive players.

**Example:**
```lua
c_listallplayers()
-- Output format: [1] (userid) playername <character>
```

### c_getnumplayers() {#c-get-num-players}

**Status:** `stable`

**Description:**
Prints the current number of players in the AllPlayers table.

**Example:**
```lua
c_getnumplayers()  -- Prints current player count
```

### c_getmaxplayers() {#c-get-max-players}

**Status:** `stable`

**Description:**
Prints the maximum allowed number of players for the server.

**Example:**
```lua
c_getmaxplayers()  -- Prints max player limit
```

### c_remote(fnstr) {#c-remote}

**Status:** `stable`

**Description:**
Executes a Lua string remotely on the server with position context.

**Parameters:**
- `fnstr` (string): Lua code to execute on server

**Example:**
```lua
c_remote("c_spawn('wilson')")                    -- Remote spawn command
c_remote("print('Hello from server!')")         -- Remote print
c_remote("c_give('backpack')")                  -- Remote give command
```

## Player Management Commands

### c_sethealth(n) {#c-set-health}

**Status:** `stable`

**Description:**
Sets player health percentage. Only works on living players (not ghosts).

**Parameters:**
- `n` (number): Health percentage (0-1)

**Example:**
```lua
c_sethealth(1)     -- Full health
c_sethealth(0.5)   -- Half health
c_sethealth(0.1)   -- Very low health
```

### c_setsanity(n) {#c-set-sanity}

**Status:** `stable`

**Description:**
Sets player sanity percentage.

**Parameters:**
- `n` (number): Sanity percentage (0-1)

**Example:**
```lua
c_setsanity(1)     -- Full sanity
c_setsanity(0.2)   -- Low sanity
```

### c_sethunger(n) {#c-set-hunger}

**Status:** `stable`

**Description:**
Sets player hunger percentage.

**Parameters:**
- `n` (number): Hunger percentage (0-1)

**Example:**
```lua
c_sethunger(1)     -- Full hunger
c_sethunger(0.1)   -- Very hungry
```

### c_settemperature(n) {#c-set-temperature}

**Status:** `stable`

**Description:**
Sets player temperature to a specific value.

**Parameters:**
- `n` (number): Temperature value

**Example:**
```lua
c_settemperature(25)   -- Comfortable temperature
c_settemperature(80)   -- Very hot
c_settemperature(-20)  -- Very cold
```

### c_setmoisture(n) {#c-set-moisture}

**Status:** `stable`

**Description:**
Sets player wetness percentage.

**Parameters:**
- `n` (number): Moisture percentage (0-1)

**Example:**
```lua
c_setmoisture(0)    -- Completely dry
c_setmoisture(1)    -- Completely wet
c_setmoisture(0.5)  -- Half wet
```

### c_godmode(player) {#c-godmode}

**Status:** `stable`

**Description:**
Toggles invincibility for a player. Also handles reviving from ghost or corpse state.

**Parameters:**
- `player` (entity, optional): Target player (default: command player)

**Example:**
```lua
c_godmode()        -- Toggle godmode for self
c_godmode(player)  -- Toggle godmode for specific player
```

### c_supergodmode(player) {#c-super-godmode}

**Status:** `stable`

**Description:**
Enhanced godmode that toggles invincibility and restores all stats to maximum.

**Parameters:**
- `player` (entity, optional): Target player (default: command player)

**Example:**
```lua
c_supergodmode()   -- Full restoration + invincibility toggle
```

### c_freecrafting(player) {#c-free-crafting}

**Status:** `stable`

**Description:**
Gives player access to all recipes and triggers tech level change event.

**Parameters:**
- `player` (entity, optional): Target player (default: command player)

**Example:**
```lua
c_freecrafting()   -- Unlock all recipes for self
```

## Entity & Prefab Commands

### c_spawn(prefab, count, dontselect) {#c-spawn}

**Status:** `stable`

**Description:**
Spawns entities at cursor position with automatic selection and skin handling for restricted characters.

**Parameters:**
- `prefab` (string): Prefab name to spawn (case-insensitive)
- `count` (number, optional): Number to spawn (default: 1)
- `dontselect` (boolean, optional): Don't auto-select spawned entity

**Returns:**
- (entity): Last spawned entity

**Example:**
```lua
c_spawn("wilson")              -- Spawn Wilson
c_spawn("log", 20)             -- Spawn 20 logs
c_spawn("deerclops", 1, true)  -- Spawn Deerclops without selecting
```

### c_give(prefab, count, dontselect) {#c-give}

**Status:** `stable`

**Description:**
Gives items to player's inventory with automatic stacking.

**Parameters:**
- `prefab` (string): Prefab name to give (case-insensitive)
- `count` (number, optional): Number to give (default: 1)
- `dontselect` (boolean, optional): Don't auto-select given item

**Returns:**
- (entity): First given entity

**Example:**
```lua
c_give("axe")               -- Give an axe
c_give("goldnugget", 40)    -- Give 40 gold nuggets
c_give("backpack")          -- Give a backpack
```

### c_equip(prefab, count, dontselect) {#c-equip}

**Status:** `stable`

**Description:**
Gives and equips items to player. First item is equipped if possible, remainder goes to inventory.

**Parameters:**
- `prefab` (string): Prefab name to equip (case-insensitive)
- `count` (number, optional): Number to create (default: 1)
- `dontselect` (boolean, optional): Don't auto-select equipped item

**Returns:**
- (entity): First created entity

**Example:**
```lua
c_equip("football_helmet")     -- Equip football helmet
c_equip("spear", 2)            -- Equip spear, give second to inventory
```

### c_find(prefab, radius, inst) {#c-find}

**Status:** `stable`

**Description:**
Finds the closest entity of specified type within radius.

**Parameters:**
- `prefab` (string): Prefab name to find
- `radius` (number, optional): Search radius (default: 9001)
- `inst` (entity, optional): Search origin (default: command player)

**Returns:**
- (entity): Closest matching entity or nil

**Example:**
```lua
local tree = c_find("evergreen")        -- Find closest evergreen
local rock = c_find("rock1", 50)        -- Find rock within 50 units
```

### c_findnext(prefab, radius, inst) {#c-find-next}

**Status:** `stable`

**Description:**
Finds the next entity of specified type, cycling through available entities.

**Parameters:**
- `prefab` (string): Prefab name to find
- `radius` (number, optional): Search radius (unlimited if nil)
- `inst` (entity, optional): Search origin

**Returns:**
- (entity): Next matching entity or nil

**Example:**
```lua
c_findnext("beefalo")          -- Find next beefalo
c_findnext("spider", 100)      -- Find next spider within 100 units
```

### c_remove(entity) {#c-remove}

**Status:** `stable`

**Description:**
Removes an entity from the world. Uses health system if available, otherwise direct removal.

**Parameters:**
- `entity` (entity, optional): Entity to remove (default: entity under mouse)

**Example:**
```lua
c_remove()         -- Remove entity under cursor
c_remove(entity)   -- Remove specific entity
```

### c_removeall(name) {#c-remove-all}

**Status:** `stable`

**Description:**
Removes all entities of a specific prefab type and prints count.

**Parameters:**
- `name` (string): Prefab name to remove

**Example:**
```lua
c_removeall("spider")   -- Remove all spiders
c_removeall("hound")    -- Remove all hounds
```

## Entity Selection & Analysis

### c_sel() {#c-sel}

**Status:** `stable`

**Description:**
Returns the currently selected debug entity.

**Returns:**
- (entity): Currently selected entity or nil

**Example:**
```lua
local selected = c_sel()
if selected then
    print("Selected:", selected.prefab)
end
```

### c_select(inst) {#c-select}

**Status:** `stable`

**Description:**
Selects an entity for manipulation and debugging.

**Parameters:**
- `inst` (entity, optional): Entity to select (default: entity under cursor)

**Returns:**
- (entity): Selected entity

**Example:**
```lua
c_select()         -- Select entity under cursor
c_select(entity)   -- Select specific entity
```

### c_list(prefab) {#c-list}

**Status:** `stable`

**Description:**
Lists all entities of a specific prefab type with their positions.

**Parameters:**
- `prefab` (string): Prefab name to list

**Example:**
```lua
c_list("wilson")            -- List all Wilson entities
c_list("spider_warrior")    -- List all spider warriors
```

### c_listtag(tag) {#c-list-tag}

**Status:** `stable`

**Description:**
Lists all entities with a specific tag and their positions.

**Parameters:**
- `tag` (string): Tag to search for

**Example:**
```lua
c_listtag("player")         -- List all players
c_listtag("structure")      -- List all structures
```

### c_countprefabs(prefab, noprint) {#c-count-prefabs}

**Status:** `stable`

**Description:**
Counts entities of a specific prefab type.

**Parameters:**
- `prefab` (string): Prefab name to count
- `noprint` (boolean, optional): Suppress print output

**Returns:**
- (number): Count of matching entities

**Example:**
```lua
local count = c_countprefabs("tree")        -- Count trees with output
local silent = c_countprefabs("rock", true) -- Count without printing
```

### c_countallprefabs() {#c-count-all-prefabs}

**Status:** `stable`

**Description:**
Displays count of all prefab types in the world, sorted by frequency.

**Example:**
```lua
c_countallprefabs()  -- Comprehensive entity count analysis
```

## Movement & Teleportation Commands

### c_teleport(x, y, z, inst) {#c-teleport}

**Status:** `stable`

**Description:**
Teleports a player to specified coordinates using Physics or Transform as appropriate.

**Parameters:**
- `x, y, z` (numbers, optional): Target coordinates (default: cursor position)
- `inst` (entity, optional): Player to teleport (default: command player)

**Example:**
```lua
c_teleport(100, 0, 200)     -- Teleport to coordinates
c_teleport()                -- Teleport to cursor position
```

### c_goto(dest, inst) {#c-goto}

**Status:** `stable`

**Description:**
Teleports to another player or entity with camera snapping.

**Parameters:**
- `dest` (entity/string/number): Target player/entity or player identifier
- `inst` (entity, optional): Player to teleport (default: command player)

**Returns:**
- (entity): Destination entity

**Example:**
```lua
c_goto("PlayerName")  -- Go to specific player
c_goto(entity)        -- Go to specific entity
```

### c_gotoroom(roomname, inst) {#c-goto-room}

**Status:** `stable`

**Description:**
Teleports to a specific room type using world topology. Cycles through matching rooms.

**Parameters:**
- `roomname` (string): Room name to search for (case-insensitive)
- `inst` (entity, optional): Player to teleport (default: command player)

**Example:**
```lua
c_gotoroom("forest")     -- Go to forest room
c_gotoroom("cave")       -- Go to cave room
c_gotoroom("ruins")      -- Go to ruins room
```

### c_gonext(name) {#c-go-next}

**Status:** `stable`

**Description:**
Finds and teleports to the next entity of specified type.

**Parameters:**
- `name` (string): Prefab name to find and go to

**Returns:**
- (entity): Destination entity or nil

**Example:**
```lua
c_gonext("beefalo")      -- Find and go to next beefalo
c_gonext("spider")       -- Find and go to next spider
```

## Specialized Commands

### c_giveingredients(prefab) {#c-give-ingredients}

**Status:** `stable`

**Description:**
Gives player all ingredients needed to craft a specific item based on recipe data.

**Parameters:**
- `prefab` (string): Recipe name

**Example:**
```lua
c_giveingredients("backpack")    -- Give backpack ingredients
c_giveingredients("pighouse")    -- Give pig house ingredients
```

### c_allbooks() {#c-all-books}

**Status:** `stable`

**Description:**
Gives player all book types including standard and upgraded variants.

**Example:**
```lua
c_allbooks()  -- Receive all book variants
```

### c_summondeerclops() {#c-summon-deerclops}

**Status:** `stable`

**Description:**
Summons Deerclops for the command player using the world's deerclops spawner.

**Example:**
```lua
c_summondeerclops()  -- Summon Deerclops
```

### c_summonbearger() {#c-summon-bearger}

**Status:** `stable`

**Description:**
Summons Bearger for the command player using the world's bearger spawner.

**Example:**
```lua
c_summonbearger()    -- Summon Bearger
```

### c_summonmalbatross() {#c-summon-malbatross}

**Status:** `stable`

**Description:**
Summons Malbatross at the fish shoal nearest to the command player.

**Example:**
```lua
c_summonmalbatross() -- Summon Malbatross at nearest fish shoal
```

## Ocean & Boat Commands

### c_makeboat() {#c-make-boat}

**Status:** `stable`

**Description:**
Creates a fully equipped boat with mast, steering wheel, anchor, oars, and supplies at cursor position.

**Example:**
```lua
c_makeboat()         -- Spawn complete boat setup with equipment
```

### c_makegrassboat() {#c-make-grass-boat}

**Status:** `stable`

**Description:**
Creates a grass boat setup with basic equipment.

**Example:**
```lua
c_makegrassboat()    -- Spawn grass boat with basic equipment
```

## Maintenance Commands

### c_maintainhealth(player, percent) {#c-maintain-health}

**Status:** `stable`

**Description:**
Automatically maintains player health at specified level using periodic task.

**Parameters:**
- `player` (entity, optional): Target player (default: command player)
- `percent` (number, optional): Health percentage to maintain (default: 1)

**Example:**
```lua
c_maintainhealth()              -- Maintain full health
c_maintainhealth(player, 0.8)   -- Maintain 80% health
```

### c_maintainall(player) {#c-maintain-all}

**Status:** `stable`

**Description:**
Maintains all player stats (health, sanity, hunger, temperature, moisture) at optimal levels.

**Parameters:**
- `player` (entity, optional): Target player (default: command player)

**Example:**
```lua
c_maintainall()      -- Auto-maintain all stats
```

### c_cancelmaintaintasks(player) {#c-cancel-maintain-tasks}

**Status:** `stable`

**Description:**
Cancels all active maintenance tasks for a player.

**Parameters:**
- `player` (entity, optional): Target player (default: command player)

**Example:**
```lua
c_cancelmaintaintasks()  -- Stop all auto-maintenance
```

## Debug & Development Commands

### c_speedmult(multiplier) {#c-speed-mult}

**Status:** `stable`

**Description:**
Modifies player movement speed using external speed multiplier.

**Parameters:**
- `multiplier` (number): Speed multiplier value

**Example:**
```lua
c_speedmult(2)       -- Double speed
c_speedmult(0.5)     -- Half speed
c_speedmult(1)       -- Normal speed
```

### c_speedup() {#c-speed-up}

**Status:** `stable`

**Description:**
Increases game time scale by 10x for faster testing.

**Example:**
```lua
c_speedup()          -- Speed up time by 10x
```

### c_skip(num) {#c-skip}

**Status:** `stable`

**Description:**
Skips game time using LongUpdate to simulate passage of days.

**Parameters:**
- `num` (number, optional): Number of days to skip (default: 1)

**Example:**
```lua
c_skip()             -- Skip 1 day
c_skip(5)            -- Skip 5 days
```

### c_tile() {#c-tile}

**Status:** `stable`

**Description:**
Shows tile information at cursor position including coordinates and tile type.

**Example:**
```lua
c_tile()             -- Display tile type and coordinates
```

### c_dumpworldstate() {#c-dump-world-state}

**Status:** `stable`

**Description:**
Displays comprehensive current world state information for debugging.

**Example:**
```lua
c_dumpworldstate()   -- Show detailed world state debug info
```

### c_dumpseasons() {#c-dump-seasons}

**Status:** `stable`

**Description:**
Shows seasonal information and debug data.

**Example:**
```lua
c_dumpseasons()      -- Display season debug info
```

### c_dumpentities() {#c-dump-entities}

**Status:** `stable`

**Description:**
Outputs detailed entity statistics sorted by frequency.

**Example:**
```lua
c_dumpentities()     -- Dump entity counts and statistics
```

## Voting System Commands

### c_startvote(commandname, playeroruserid) {#c-start-vote}

**Status:** `stable`

**Description:**
Starts a server vote for a specific command targeting a player.

**Parameters:**
- `commandname` (string): Command to vote on
- `playeroruserid` (string/number/entity): Target player

**Example:**
```lua
c_startvote("kick", "PlayerName")  -- Start kick vote
```

### c_stopvote() {#c-stop-vote}

**Status:** `stable`

**Description:**
Stops the current active vote.

**Example:**
```lua
c_stopvote()  -- Cancel current vote
```

## Advanced Features

### Remote Command Execution

Console commands automatically handle master simulation checking and can be executed remotely:

```lua
-- Commands automatically check for master sim
c_save()  -- Will execute remotely if needed

-- Manual remote execution
c_remote("c_spawn('wilson')")
c_remote("TheWorld:PushEvent('ms_save')")
```

### Player Targeting System

Many commands support flexible player targeting:

```lua
-- Target by player entity
c_godmode(player_entity)

-- Target by username or userid
c_goto("PlayerName")
c_despawn("12345")

-- Default to command player
c_sethealth(1)  -- Affects self or selected player
```

### Entity Selection Integration

Commands integrate with the entity selection system:

```lua
-- Select and manipulate entities
c_select(entity)
local selected = c_sel()
if selected then
    c_remove(selected)
end

-- Many commands use selected entity as default
c_move()     -- Move selected entity to cursor
c_dump()     -- Dump selected entity info
```

## Technical Notes

- Commands prefixed with `c_` are console functions available in global scope
- Most administrative commands require master simulation and handle remote execution automatically
- Player-targeting commands support entities, usernames, userids, and default targeting
- Entity manipulation commands integrate with the debug entity selection system
- Server admin privileges are required for administrative and potentially disruptive commands
- Many commands include usage tracking via SuUsed() for analytics
- Commands automatically handle error conditions and provide informative output

## Related Modules

- [DebugKeys](./debugkeys.md): Keyboard debug shortcuts
- [DebugHelpers](./debughelpers.md): Additional debugging utilities
- [Networking](./networking.md): Network communication for remote commands
- [Class](./class.md): Base entity system for command targets

## Related Modules

- [DebugKeys](./debugkeys.md): Keyboard debug shortcuts
- [DebugHelpers](./debughelpers.md): Additional debugging utilities
- [Networking](./networking.md): Network communication for remote commands
- [Class](./class.md): Base entity system for command targets

---

*Documentation based on build version 676042. Last updated: 2025-06-21*
