---
id: consolecommands
title: Consolecommands
description: This component defines a comprehensive set of global console command functions for debugging, server administration, entity spawning, player stat manipulation, world state management, and shard network operations in Don't Starve Together.
tags: [debugging, console, administration, entities, players]
sidebar_position: 10

last_updated: 2026-03-21
build_version: 714014
change_status: stable
category_type: root
source_hash: adf8c5cd
system_scope: world
---

# Consolecommands

> Based on game build **714014** | Last updated: 2026-03-21

## Overview

The `consolecommands` component provides an extensive collection of global console command functions designed for debugging, testing, and server administration in Don't Starve Together. These commands enable developers and server administrators to manipulate entity states, spawn prefabs, modify player statistics, manage world topology, control shard networking, and perform various diagnostic operations. The component integrates with core systems including TheWorld, TheNet, ThePlayer, and AllPlayers to provide comprehensive runtime control. Functions are organized into categories covering entity management (spawn, remove, select), player manipulation (stats, teleport, godmode), world control (save, reset, regenerate), debugging tools (dump, list, count), and specialized features (rift spawning, musical shells, boat creation). Most commands operate on the master simulation and require appropriate permissions in production environments.

## Usage example

```lua
-- Spawn 5 beefalo at cursor position and select the first
local beef = c_spawn("beefalo", 5)

-- Set player health to 100% and enable godmode
c_sethealth(1)
c_godmode()

-- Teleport to another player
c_goto("PlayerName")

-- Debug entity under mouse
c_dump()

-- Save world state
c_save()

-- Count all trees in the world
c_countprefabs("evergreen")

-- Spawn a rift at current position
c_spawnrift()

-- Maintain player stats periodically
c_maintainall(ThePlayer)
```

## Dependencies & tags

**External dependencies:**
- `TheWorld` -- Accessed for simulation state, topology, and event pushing
- `TheNet` -- Accessed for networking, announcements, and rollback requests
- `ThePlayer` -- Referenced as default player entity
- `AllPlayers` -- Iterated for player listings and shutdown
- `TheSim` -- Used for entity finding and position projection
- `TheInput` -- Used for mouse position and entity detection
- `ShardGameIndex` -- Used for save slot management and world deletion
- `TheSystemService` -- Used to enable storage during shutdown
- `Profile` -- Used to set kitcoon data
- `Ents` -- Table accessed to find entities by GUID
- `AllRecipes` -- Table accessed to find crafting recipes
- `VALID_KITCOON_BUILDS` -- Table validated for kitcoon build names
- `RESET_ACTION` -- Constant used for reset action type
- `STRINGS` -- Referenced for UI strings
- `WORLD_TILES` -- Table used to resolve tile IDs
- `EntityScript` -- Used to check instance type in teleport
- `DebugSpawn` -- Global function to spawn prefabs
- `SetDebugEntity` -- Global function to set selection
- `SuUsed` -- Global function to track command usage
- `UserToPlayer` -- Global function to resolve user to player
- `StartNextInstance` -- Global function to restart server
- `InGamePlay` -- Global function to check game state
- `Shutdown` -- Global function to close application
- `SerializeUserSession` -- Global function to save session
- `DisableAllDLC` -- Global function to disable DLC
- `GetDebugEntity` -- Global function to get selection
- `SpawnPrefab` -- Global function to instantiate prefab
- `TheFrontEnd` -- Used for crash forcing
- `TUNING` -- Accessed for day time and boat damage constants
- `Prefabs` -- Iterated for prefab searching
- `ShardPortals` -- Iterated for shard debugging
- `Shard_GetConnectedShards` -- Called to get shard list
- `Shard_IsWorldAvailable` -- Called to check world availability
- `ConsoleCommandPlayer` -- Called to get player entity
- `ListingOrConsolePlayer` -- Called to resolve player argument
- `ConsoleWorldPosition` -- Called to get world coordinates
- `LongUpdate` -- Called to skip time
- `ConsoleScreenSettings` -- Accessed for command history
- `debugsounds` -- Required for sound debugging
- `CreateEntity` -- Used to create debug radius entities
- `Vector3` -- Used for position calculations and spawning
- `ConsoleWorldEntityUnderMouse` -- Used to determine parent for radius visualization
- `CAN_USE_DBUI` -- Checked to allow debug menu recording
- `RequestShutdown` -- Called to quit game in ResetControllersAndQuitGame
- `ANIM_ORIENTATION` -- Used to set animation orientation for radius entities
- `LAYER_BACKGROUND` -- Used to set animation layer for radius entities
- `notetable_dsmaintheme` -- Required as default song data for c_shellsfromtable
- `components/heavyobstaclephysics` -- Required to access deprecated exploit flag

**Components used:**
- `builder` -- Accessed to toggle free build mode
- `health` -- Accessed to modify invincibility, min health, and percent
- `singinginspiration` -- Accessed to set inspiration percent
- `sanity` -- Accessed to set sanity percent
- `hunger` -- Accessed to set hunger percent
- `mightiness` -- Accessed to set mightiness percent
- `upgrademoduleowner` -- Accessed to add charge
- `wereness` -- Accessed to set percent or were mode
- `moisture` -- Accessed to set moisture percent
- `temperature` -- Accessed to set temperature value
- `inventory` -- Accessed to give or equip items
- `scenariorunner` -- Accessed to clear, set script, and run scenarios
- `playercontroller` -- Checked to validate player entity
- `skinner` -- Accessed to set skin mode on spawn
- `locomotor` -- Accessed for speed multiplier
- `deerclopsspawner` -- Accessed for summoning Deerclops
- `beargerspawner` -- Accessed for summoning Bearger
- `malbatrossspawner` -- Accessed for summoning Malbatross
- `seasons` -- Accessed for debug string
- `worldstate` -- Accessed for dump
- `worldmigrator` -- Accessed for portal configuration
- `stackable` -- Accessed for setting stack size
- `boatring` -- Accessed for collision detection
- `cyclable` -- Accessed via shell.components.cyclable:SetStep in c_shellsfromtable
- `riftspawner` -- Accessed via TheWorld.components.riftspawner:SpawnRift in c_spawnrift
- `heavyobstaclephysics` -- Required module accessed to set deprecated_floating_exploit flag
- `transform` -- Used for SetPosition, SetRotation, GetRotation, SetScale on entities
- `animstate` -- Used for animation setup in showradius_createent

**Tags:**
- `player` -- check
- `playerghost` -- check
- `corpse` -- check
- `debugnoattack` -- add
- `CLASSIFIED` -- check
- `INLIMBO` -- check
- `NOCLICK` -- add

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|

## Main functions

### `ConsoleCommandPlayer()`
* **Description:** Returns the currently selected player entity, falling back to ThePlayer or the first entry in AllPlayers.
* **Parameters:** None
* **Returns:** Entity or nil

### `ConsoleWorldPosition()`
* **Description:** Returns the current world position from input override or input handler.
* **Parameters:** None
* **Returns:** Vector3 or nil

### `ConsoleWorldEntityUnderMouse()`
* **Description:** Returns the entity under the mouse cursor or at the override position.
* **Parameters:** None
* **Returns:** Entity or nil

### `ListingOrConsolePlayer(input)`
* **Description:** Resolves a player identifier to a player entity, defaulting to the console command player.
* **Parameters:**
  - `input` -- string, number, or Entity; identifies a player via userid, index, or direct reference
* **Returns:** Entity

### `Spawn(prefab)`
* **Description:** Helper to spawn a prefab entity.
* **Parameters:**
  - `prefab` -- string; name of the prefab to spawn
* **Returns:** Entity

### `c_announce(msg, interval, category)`
* **Description:** Sends a server announcement, optionally periodically or as a system message.
* **Parameters:**
  - `msg` -- string or any; message content to announce
  - `interval` -- number or nil; time interval for periodic announcements
  - `category` -- string or nil; category of the announcement (e.g., 'system')
* **Returns:** nil

### `doreset()`
* **Description:** Internal helper to start the next instance loading a specific save slot.
* **Parameters:** None
* **Returns:** nil

### `c_mermking()`
* **Description:** Spawns a mermthrone and a mermking prefab.
* **Parameters:** None
* **Returns:** nil

### `c_mermthrone()`
* **Description:** Spawns mermthrone construction and gives various resources.
* **Parameters:** None
* **Returns:** nil

### `c_allbooks()`
* **Description:** Gives the player all book prefabs.
* **Parameters:** None
* **Returns:** nil

### `c_rollback(count)`
* **Description:** Requests a world rollback to a previous save file.
* **Parameters:**
  - `count` -- number; number of saves to roll back
* **Returns:** nil

### `c_reset()`
* **Description:** Restarts the server to the last save file or starts a new instance.
* **Parameters:** None
* **Returns:** nil

### `c_regenerateshard(wipesettings)`
* **Description:** Permanently deletes the game world shard and regenerates it.
* **Parameters:**
  - `wipesettings` -- boolean or nil; if true, settings are wiped
* **Returns:** nil

### `c_regenerateworld()`
* **Description:** Permanently deletes all game worlds in a cluster and regenerates them.
* **Returns:** nil

### `c_save()`
* **Description:** Triggers a world save event.
* **Parameters:** None
* **Returns:** nil

### `c_shutdown(save)`
* **Description:** Shuts down the application, optionally saving state.
* **Parameters:**
  - `save` -- boolean; whether to save before shutting down
* **Returns:** nil

### `c_remote(fnstr)`
* **Description:** Executes a lua string remotely on the server.
* **Parameters:**
  - `fnstr` -- string; lua code string to execute remotely
* **Returns:** nil

### `c_spawn(prefab, count, dontselect)`
* **Description:** Spawns a prefab at the cursor and optionally selects it.
* **Parameters:**
  - `prefab` -- string; name of the prefab to spawn
  - `count` -- number; number of entities to spawn
  - `dontselect` -- boolean; if true, do not set the spawned entity as debug selection
* **Returns:** Entity

### `dodespawn(player)`
* **Description:** Internal helper to push the player despawn and delete event.
* **Parameters:**
  - `player` -- Entity; the player entity to despawn
* **Returns:** nil

### `c_despawn(player)`
* **Description:** Despawns a player, returning them to the character select screen.
* **Parameters:**
  - `player` -- Entity, string, or number; player to despawn
* **Returns:** nil

### `c_getnumplayers()`
* **Description:** Prints the number of connected players.
* **Parameters:** None
* **Returns:** nil

### `c_getmaxplayers()`
* **Description:** Prints the default maximum player count.
* **Parameters:** None
* **Returns:** nil

### `c_listplayers()`
* **Description:** Prints a listing of currently active players from the network client table.
* **Parameters:** None
* **Returns:** nil

### `c_listallplayers()`
* **Description:** Prints a listing of the AllPlayers table.
* **Parameters:** None
* **Returns:** nil

### `c_sel()`
* **Description:** Returns the currently selected debug entity.
* **Parameters:** None
* **Returns:** Entity or nil

### `c_select(inst)`
* **Description:** Selects an entity for debugging.
* **Parameters:**
  - `inst` -- Entity or nil; entity to select, defaults to entity under mouse
* **Returns:** Entity

### `c_tile()`
* **Description:** Prints the visual tile coordinates and type under the cursor.
* **Parameters:** None
* **Returns:** nil

### `c_doscenario(scenario)`
* **Description:** Applies and runs a scenario script on the selected entity.
* **Parameters:**
  - `scenario` -- string; name of the scenario script to run
* **Returns:** nil

### `c_freecrafting(player)`
* **Description:** Toggles free build mode for a player.
* **Parameters:**
  - `player` -- Entity, string, or number; player to enable free crafting
* **Returns:** nil

### `c_sel_health()`
* **Description:** Returns the health component of the selected entity.
* **Parameters:** None
* **Returns:** Component or nil

### `c_setinspiration(n)`
* **Description:** Sets the singing inspiration percent for the player.
* **Parameters:**
  - `n` -- number; percentage value for inspiration
* **Returns:** nil

### `c_sethealth(n)`
* **Description:** Sets the health percent for the player.
* **Parameters:**
  - `n` -- number; percentage value for health
* **Returns:** nil

### `c_setminhealth(n)`
* **Description:** Sets the minimum health value for the player.
* **Parameters:**
  - `n` -- number; minimum health amount
* **Returns:** nil

### `c_setsanity(n)`
* **Description:** Sets the sanity percent for the player.
* **Parameters:**
  - `n` -- number; percentage value for sanity
* **Returns:** nil

### `c_sethunger(n)`
* **Description:** Sets the hunger percent for the player.
* **Parameters:**
  - `n` -- number; percentage value for hunger
* **Returns:** nil

### `c_setmightiness(n)`
* **Description:** Sets the mightiness percent for the player.
* **Parameters:**
  - `n` -- number; percentage value for mightiness
* **Returns:** nil

### `c_addelectricity(n)`
* **Description:** Adds charge to the player's upgrade module owner.
* **Parameters:**
  - `n` -- number; charge amount to add
* **Returns:** nil

### `c_setwereness(n)`
* **Description:** Sets the wereness percent or mode for the player.
* **Parameters:**
  - `n` -- number or string; percentage or were mode
* **Returns:** nil

### `c_setmoisture(n)`
* **Description:** Sets the moisture percent for the player.
* **Parameters:**
  - `n` -- number; percentage value for moisture
* **Returns:** nil

### `c_settemperature(n)`
* **Description:** Sets the temperature for the player.
* **Parameters:**
  - `n` -- number; temperature value
* **Returns:** nil
* **Error states:** Expects a number value

### `c_connect(ip, port, password)`
* **Description:** Attempts to connect to an online server.
* **Parameters:**
  - `ip` -- string; server IP address
  - `port` -- number; server port
  - `password` -- string; server password
* **Returns:** boolean

### `c_give(prefab, count, dontselect)`
* **Description:** Spawns and gives items to the player's inventory.
* **Parameters:**
  - `prefab` -- string; prefab name to give
  - `count` -- number; number of items to give
  - `dontselect` -- boolean; if true, do not select the given item
* **Returns:** Entity

### `c_equip(prefab, count, dontselect)`
* **Description:** Spawns items and attempts to equip the first one.
* **Parameters:**
  - `prefab` -- string; prefab name to equip
  - `count` -- number; number of items to spawn
  - `dontselect` -- boolean; if true, do not select the equipped item
* **Returns:** Entity

### `c_giveingredients(prefab)`
* **Description:** Gives the player all ingredients required to craft a prefab.
* **Parameters:**
  - `prefab` -- string; prefab name to find recipe for
* **Returns:** nil
* **Error states:** No recipe found

### `c_mat(recname)`
* **Description:** Spawns and gives all ingredients for a recipe.
* **Parameters:**
  - `recname` -- string; recipe name
* **Returns:** nil

### `c_pos(inst)`
* **Description:** Returns the position of an entity.
* **Parameters:**
  - `inst` -- Entity; entity to get position from
* **Returns:** Vector3 or nil

### `c_printpos(inst)`
* **Description:** Prints the position of an entity.
* **Parameters:**
  - `inst` -- Entity; entity to print position of
* **Returns:** nil

### `c_teleport(x, y, z, inst)`
* **Description:** Teleports an entity or player to coordinates.
* **Parameters:**
  - `x` -- number or Entity; x coordinate or entity to teleport
  - `y` -- number; y coordinate
  - `z` -- number; z coordinate
  - `inst` -- Entity; entity to teleport
* **Returns:** nil

### `c_move(inst)`
* **Description:** Moves the selected entity to the cursor position.
* **Parameters:**
  - `inst` -- Entity; entity to move
* **Returns:** nil

### `c_goto(dest, inst)`
* **Description:** Teleports a player to another player's position.
* **Parameters:**
  - `dest` -- Entity, string, or number; destination player
  - `inst` -- Entity, string, or number; player to move
* **Returns:** Entity

### `c_inst(guid)`
* **Description:** Returns the entity associated with a GUID.
* **Parameters:**
  - `guid` -- number; entity GUID
* **Returns:** Entity or nil

### `c_list(prefab)`
* **Description:** Lists entities of a specific prefab near the player.
* **Parameters:**
  - `prefab` -- string; prefab name to search for
* **Returns:** nil

### `c_listtag(tag)`
* **Description:** Lists entities with a specific tag near the player.
* **Parameters:**
  - `tag` -- string; entity tag to search for
* **Returns:** nil

### `c_kitcoon(name, age, build)`
* **Description:** Sets profile data for a kitcoon pet.
* **Parameters:**
  - `name` -- string; kitcoon name
  - `age` -- number; age in days
  - `build` -- string; build name
* **Returns:** nil
* **Error states:** Invalid arguments

### `c_gotoroom(roomname, inst)`
* **Description:** Teleports a player to a specific topology room.
* **Parameters:**
  - `roomname` -- string; name of the room to find
  - `inst` -- Entity, string, or number; player to teleport
* **Returns:** nil

### `c_findnext(prefab, radius, inst)`
* **Description:** Finds the next entity of a prefab type.
* **Parameters:**
  - `prefab` -- string; prefab name to find
  - `radius` -- number; search radius
  - `inst` -- Entity, string, or number; reference entity
* **Returns:** Entity

### `c_godmode(player)`
* **Description:** Toggles invincibility for a player or revives them.
* **Parameters:**
  - `player` -- Entity, string, or number; player to toggle god mode
* **Returns:** nil

### `c_supergodmode(player)`
* **Description:** Toggles invincibility and maximizes all stats for a player.
* **Parameters:**
  - `player` -- Entity, string, or number; player to toggle super god mode
* **Returns:** nil

### `c_armor(player)`
* **Description:** Enables full absorption on the specified player's health component.
* **Parameters:**
  - `player` -- Player entity or userid to apply armor to
* **Returns:** nil
* **Error states:** Returns early if player is nil or lacks health component

### `c_armour(player)`
* **Description:** Alias for c_armor.
* **Parameters:**
  - `player` -- Player entity or userid
* **Returns:** nil

### `c_find(prefab, radius, inst)`
* **Description:** Finds the closest entity with matching prefab within radius.
* **Parameters:**
  - `prefab` -- Prefab name to search for
  - `radius` -- Search radius around inst
  - `inst` -- Reference entity or player
* **Returns:** Entity instance or nil
* **Error states:** Returns nil if inst is nil

### `c_findtag(tag, radius, inst)`
* **Description:** Finds closest entity with specific tag.
* **Parameters:**
  - `tag` -- Tag to search for
  - `radius` -- Search radius
  - `inst` -- Reference entity
* **Returns:** Entity instance or nil
* **Error states:** Returns nil if inst is nil

### `c_gonext(name)`
* **Description:** Teleports to the next instance of the named prefab.
* **Parameters:**
  - `name` -- Prefab name to find and goto
* **Returns:** Result of c_goto or nil
* **Error states:** Returns nil if name is nil or entity not found

### `c_printtextureinfo(filename)`
* **Description:** Prints texture information to console.
* **Parameters:**
  - `filename` -- Texture file path
* **Returns:** nil

### `c_simphase(phase)`
* **Description:** Pushes a phasechange event to the world.
* **Parameters:**
  - `phase` -- New phase name
* **Returns:** nil

### `c_countprefabs(prefab, noprint)`
* **Description:** Counts instances of a specific prefab in the world.
* **Parameters:**
  - `prefab` -- Prefab name to count
  - `noprint` -- Suppress console output
* **Returns:** Count number

### `c_counttagged(tag, noprint)`
* **Description:** Counts entities with a specific tag.
* **Parameters:**
  - `tag` -- Tag to count
  - `noprint` -- Suppress console output
* **Returns:** Count number

### `c_countallprefabs()`
* **Description:** Counts and prints all prefab types in the world.
* **Parameters:** None
* **Returns:** nil

### `c_speedmult(multiplier)`
* **Description:** Sets external speed multiplier on the console player.
* **Parameters:**
  - `multiplier` -- Speed multiplier value
* **Returns:** nil
* **Error states:** Returns early if player is nil

### `c_dump()`
* **Description:** Dumps debug info for entity under mouse or debug entity.
* **Parameters:** None
* **Returns:** nil

### `c_dumpseasons()`
* **Description:** Prints world seasons component debug string.
* **Parameters:** None
* **Returns:** nil

### `c_dumpworldstate()`
* **Description:** Prints world state dump to console.
* **Parameters:** None
* **Returns:** nil

### `c_worldstatedebug()`
* **Description:** Toggles WORLDSTATEDEBUG_ENABLED flag.
* **Parameters:** None
* **Returns:** nil

### `c_makeinvisible()`
* **Description:** Adds debugnoattack tag to console player.
* **Parameters:** None
* **Returns:** nil

### `c_selectnext(name)`
* **Description:** Selects the next instance of the named prefab.
* **Parameters:**
  - `name` -- Prefab name
* **Returns:** Result of c_select

### `c_selectnear(prefab, rad)`
* **Description:** Selects the closest entity of prefab near player.
* **Parameters:**
  - `prefab` -- Prefab name
  - `rad` -- Search radius
* **Returns:** Result of c_select or nil
* **Error states:** Returns nil if not found

### `c_summondeerclops()`
* **Description:** Summons Deerclops monster for the player.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Returns early if player is nil

### `c_summonbearger()`
* **Description:** Summons Bearger monster for the player.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Returns early if player is nil

### `c_summonmalbatross()`
* **Description:** Summons Malbatross at nearest fish shoal.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Returns early if player is nil

### `c_gatherplayers()`
* **Description:** Teleports all players to console world position.
* **Parameters:** None
* **Returns:** nil

### `c_speedup()`
* **Description:** Multiplies simulation time scale by 10.
* **Parameters:** None
* **Returns:** nil

### `c_skip(num)`
* **Description:** Advances time by num days.
* **Parameters:**
  - `num` -- Number of days to skip
* **Returns:** nil
* **Error states:** Defaults num to 1

### `c_groundtype()`
* **Description:** Prints current ground tile type for player.
* **Parameters:** None
* **Returns:** nil

### `c_searchprefabs(str)`
* **Description:** Searches prefabs by regex-like string matching.
* **Parameters:**
  - `str` -- Search string for prefab names
* **Returns:** First matching prefab name or nil
* **Error states:** Returns nil if no matches

### `c_maintainhealth(player, percent)`
* **Description:** Sets up periodic task to maintain health percent.
* **Parameters:**
  - `player` -- Player entity
  - `percent` -- Health percent to maintain
* **Returns:** nil
* **Error states:** Returns early if player is nil

### `c_maintainsanity(player, percent)`
* **Description:** Sets up periodic task to maintain sanity percent.
* **Parameters:**
  - `player` -- Player entity
  - `percent` -- Sanity percent to maintain
* **Returns:** nil
* **Error states:** Returns early if player is nil

### `c_maintainhunger(player, percent)`
* **Description:** Sets up periodic task to maintain hunger percent.
* **Parameters:**
  - `player` -- Player entity
  - `percent` -- Hunger percent to maintain
* **Returns:** nil
* **Error states:** Returns early if player is nil

### `c_maintaintemperature(player, temp)`
* **Description:** Sets up periodic task to maintain temperature.
* **Parameters:**
  - `player` -- Player entity
  - `temp` -- Temperature value
* **Returns:** nil
* **Error states:** Returns early if player is nil

### `c_maintainmoisture(player, percent)`
* **Description:** Sets up periodic task to maintain moisture percent.
* **Parameters:**
  - `player` -- Player entity
  - `percent` -- Moisture percent
* **Returns:** nil
* **Error states:** Returns early if player is nil

### `c_maintainall(player)`
* **Description:** Calls all maintain functions for player.
* **Parameters:**
  - `player` -- Player entity
* **Returns:** nil
* **Error states:** Returns early if player is nil

### `c_cancelmaintaintasks(player)`
* **Description:** Cancels all debug maintain tasks for player.
* **Parameters:**
  - `player` -- Player entity
* **Returns:** nil
* **Error states:** Returns early if player is nil

### `c_removeallwithtags(...)`
* **Description:** Removes all entities having any of the provided tags.
* **Parameters:**
  - `...` -- Variable list of tags
* **Returns:** nil

### `c_emptyworld()`
* **Description:** Removes non-player entities without widgets or parents.
* **Parameters:** None
* **Returns:** nil

### `c_netstats()`
* **Description:** Prints network statistics to console.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Prints message if no stats available

### `c_remove(entity)`
* **Description:** Removes entity or entity under mouse.
* **Parameters:**
  - `entity` -- Entity to remove or nil for mouse entity
* **Returns:** nil
* **Error states:** Returns early if World or entity is nil

### `c_removeat(x, y, z)`
* **Description:** Removes entities at specific position.
* **Parameters:**
  - `x` -- X coordinate
  - `y` -- Y coordinate
  - `z` -- Z coordinate
* **Returns:** nil

### `c_removeall(name)`
* **Description:** Removes all entities of specific prefab.
* **Parameters:**
  - `name` -- Prefab name
* **Returns:** nil

### `c_forcecrash(unique)`
* **Description:** Forces a crash by accessing invalid global path.
* **Parameters:**
  - `unique` -- Generate random path if true
* **Returns:** nil

### `c_knownassert(key)`
* **Description:** Triggers a known assertion failure.
* **Parameters:**
  - `key` -- Assert key name
* **Returns:** nil
* **Error states:** Defaults key to CONFIG_DIR_WRITE_PERMISSION

### `c_migrationportal(worldId, portalId)`
* **Description:** Spawns a migration portal and configures world migrator.
* **Parameters:**
  - `worldId` -- Target world ID
  - `portalId` -- Target portal ID
* **Returns:** nil

### `c_goadventuring(player)`
* **Description:** Equips player with starting adventure gear.
* **Parameters:**
  - `player` -- Player entity
* **Returns:** nil
* **Error states:** Returns early if player is nil

### `c_startinggear(player)`
* **Description:** Equips player with basic starting gear.
* **Parameters:**
  - `player` -- Player entity
* **Returns:** nil
* **Error states:** Returns early if player is nil

### `c_sounddebug()`
* **Description:** Enables sound debugging and render.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Requires debugsounds module

### `c_sounddebugui()`
* **Description:** Enables sound debugging UI and render.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Requires debugsounds module

### `c_migrateto(worldId, portalId)`
* **Description:** Pushes migration event for console player.
* **Parameters:**
  - `worldId` -- Target world ID
  - `portalId` -- Target portal ID
* **Returns:** nil
* **Error states:** Returns early if player is nil

### `c_debugshards()`
* **Description:** Prints connected shards and portal status.
* **Parameters:** None
* **Returns:** nil

### `c_reregisterportals()`
* **Description:** Reassigns destination worlds to shard portals.
* **Parameters:** None
* **Returns:** nil

### `c_repeatlastcommand()`
* **Description:** Executes the last command from console history.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Returns early if history is empty

### `c_startvote(commandname, playeroruserid)`
* **Description:** Starts a vote via TheNet.
* **Parameters:**
  - `commandname` -- Vote command name
  - `playeroruserid` -- Player entity or userid
* **Returns:** nil
* **Error states:** Returns early if userid resolution fails

### `c_stopvote()`
* **Description:** Stops current vote via TheNet.
* **Parameters:** None
* **Returns:** nil

### `c_makeboat()`
* **Description:** Spawns a complete boat with components at world position.
* **Parameters:** None
* **Returns:** nil

### `c_makegrassboat()`
* **Description:** Spawns a grass boat with basic components.
* **Parameters:** None
* **Returns:** nil

### `c_makecrabboat()`
* **Description:** Spawns a boat with crab-themed items and gems.
* **Parameters:** None
* **Returns:** nil

### `c_makeboatspiral()`
* **Description:** Spawns various boat items in a spiral pattern.
* **Parameters:** None
* **Returns:** nil

### `c_boatcollision()`
* **Description:** Debugs boat collision by damaging bumper under player.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Returns early if player or boat is nil

### `c_autoteleportplayers()`
* **Description:** Toggles auto_teleport_players flag on TheWorld.
* **Parameters:** None
* **Returns:** nil

### `c_dumpentities()`
* **Description:** Iterates through all entities in the world, counts them by prefab or name, and prints a sorted list of entity counts to the console.
* **Parameters:** None
* **Returns:** nil

### `NoteToSemitone(note)`
* **Description:** Converts a musical note string into a semitone integer value based on octave and note name.
* **Parameters:**
  - `note` -- string representing a musical note (e.g., 'C4'), used to calculate semitone value
* **Returns:** number (semitone value)

### `c_shellsfromtable(song, startpos, placementfn, spacing_multiplier, out_of_range_mode)`
* **Description:** Spawns singing shell entities based on a song table, handling transposition and range validation.
* **Parameters:**
  - `song` -- table or module name containing note data for spawning singing shells
  - `startpos` -- Vector3 position where spawning begins; defaults to ConsoleWorldPosition()
  - `placementfn` -- function determining position of each shell; defaults to linear spacing along X axis
  - `spacing_multiplier` -- number scaling the distance between spawned shells
  - `out_of_range_mode` -- string defining behavior for notes outside valid semitone range (AUTO_TRANSPOSE, OMIT, TRUNCATE, TERMINATE)
* **Returns:** table (list of spawned shell entities) or nil on failure
* **Error states:** Returns nil if song data is invalid, auto-transposition fails, or tonal range exceeds 3 octaves

### `c_guitartab(songdata, overrides, dont_spawn_shells)`
* **Description:** Processes guitar tablature data into semitone values and optionally spawns singing shells.
* **Parameters:**
  - `songdata` -- string module name or table containing guitar tab data
  - `overrides` -- table allowing custom tuning, transposition, or spawning parameters
  - `dont_spawn_shells` -- boolean if true, prevents spawning physical shell entities
* **Returns:** table (contains songtable and optionally shells_spawned)
* **Error states:** Returns false and error string if songdata is invalid or tab table is missing

### `c_setrotation(angle)`
* **Description:** Sets the rotation of the entity under the mouse or the selected entity to a specific angle.
* **Parameters:**
  - `angle` -- number representing the absolute rotation angle in degrees
* **Returns:** nil
* **Error states:** Returns early if TheWorld or target entity is nil

### `c_rotatecw(delta)`
* **Description:** Rotates the entity under the mouse or selected entity clockwise by a delta amount.
* **Parameters:**
  - `delta` -- number representing degrees to rotate clockwise; defaults to 45
* **Returns:** nil
* **Error states:** Returns early if TheWorld or target entity is nil

### `c_rotateccw(delta)`
* **Description:** Rotates the entity under the mouse or selected entity counter-clockwise by a delta amount.
* **Parameters:**
  - `delta` -- number representing degrees to rotate counter-clockwise; defaults to 45
* **Returns:** nil
* **Error states:** Returns early if TheWorld or target entity is nil

### `c_record()`
* **Description:** Toggles history recording in the debug menu if DBUI is available and threaded render is disabled.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Returns early if CAN_USE_DBUI is false or threaded render is enabled

### `c_spawnrift()`
* **Description:** Spawns a rift at the console world position, pushing a world event based on cave/forest status.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Returns early if TheWorld does not have riftspawner component

### `showradius_createent()`
* **Description:** Creates a classified, non-clickable entity with a firefighter_placement animation for visualizing radius.
* **Parameters:** None
* **Returns:** Entity (the created instance)

### `c_showradius(radius, parent)`
* **Description:** Visualizes a given radius around a parent entity using animated debug entities.
* **Parameters:**
  - `radius` -- number or table of numbers defining the radius size in game units
  - `parent` -- Entity to parent the radius indicator to; defaults to entity under mouse or player
* **Returns:** nil
* **Error states:** Returns early if radius is nil; cleans up existing indicators before creating new ones

### `c_use_deprecated_floating_heavyobstaclephysics_exploit()`
* **Description:** Enables a deprecated floating exploit flag in the heavyobstaclephysics component module.
* **Parameters:** None
* **Returns:** nil

### `ResetControllersAndQuitGame()`
* **Description:** Resets controller configuration profile settings and requests game shutdown if not in gameplay.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Prints error and does nothing if called during InGamePlay

## Events & listeners

**Events pushed:**
- `ms_save` -- Pushed by c_save to trigger world save
- `ms_playerdespawnanddelete` -- Pushed by dodespawn to handle player removal
- `techlevelchange` -- Pushed by c_freecrafting to update crafting tech level
- `respawnfromghost` -- Pushed by c_godmode/c_supergodmode to revive ghost players
- `respawnfromcorpse` -- Pushed by c_godmode to revive corpse players
- `phasechange` -- Pushed by c_simphase to change world phase
- `ms_playerdespawnandmigrate` -- Pushed by c_migrateto to migrate player
- `boatcollision` -- Pushed by c_boatcollision on bumper entity
- `shadowrift_opened` -- Pushed by c_spawnrift when TheWorld has the 'cave' tag
- `lunarrift_opened` -- Pushed by c_spawnrift when TheWorld does not have the 'cave' tag

**Events listened to:**
- None