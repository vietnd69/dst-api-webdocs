---
id: consolecommands
title: Consolecommands
description: This module defines a comprehensive collection of console command functions for Don't Starve Together, including player management, world control, entity spawning, debugging utilities, server administration, boss summoning, shard/network management, and various testing tools.
tags: [debug, admin, utilities, console, server]
sidebar_position: 10

last_updated: 2026-04-27
build_version: 722832
change_status: stable
category_type: utility_module
source_hash: 21d5e922
system_scope: world
---

# Consolecommands

> Based on game build **722832** | Last updated: 2026-04-27

## Overview
`consolecommands.lua` defines a global collection of console command functions (prefixed with `c_`) that provide debugging, administration, and testing capabilities for Don't Starve Together. These commands are accessible from the in-game console and cover player state manipulation, entity spawning, world control, network/shard management, and various debugging utilities. The module integrates with core systems like `TheWorld`, `TheNet`, `AllPlayers`, and `TheSim` to execute server-side and client-side operations. Commands range from simple stat adjustments (`c_sethealth`, `c_setsanity`) to complex operations like boss summoning (`c_summondeerclops`), world regeneration (`c_regenerateworld`), and shard migration (`c_migrateto`).

## Usage example
```lua
-- Access console commands directly (these are global functions)
-- Spawn an entity at the console cursor position
c_spawn("beefalo", 3)

-- Set the selected player's health to 100%
c_sethealth(1.0)

-- Teleport to a specific prefab
c_goto("pigking")

-- List all connected players
c_listplayers()

-- Enable god mode for the selected player
c_godmode()

-- Summon a boss monster
c_summonbearger()
```

## Dependencies & tags

**External dependencies:**
- `TheWorld` -- Accessed for ismastersim check, Map component, DoPeriodicTask, PushEvent, __announcementtask
- `TheNet` -- SystemMessage, Announce, SendWorldRollbackRequestToServer, SendWorldResetRequestToServer, SendRemoteExecute, GetDefaultMaxPlayers, GetServerIsClientHosted, GetClientTable
- `ThePlayer` -- Local player entity reference for fallback in ConsoleCommandPlayer and c_despawn
- `AllPlayers` -- Table of all player entities for iteration and fallback selection
- `TheInput` -- overridepos and GetWorldPosition/GetWorldEntityUnderMouse for cursor positioning
- `TheSim` -- FindEntities, ProjectScreenPos, GetPosition for entity queries and screen projection
- `TheSystemService` -- EnableStorage called in c_shutdown()
- `ShardGameIndex` -- GetSlot, Delete, SaveCurrent for shard management and save operations
- `GLOBAL` -- RESET_ACTION, WORLD_TILES constants referenced
- `SpawnPrefab` -- Called in Spawn() helper function
- `DebugSpawn` -- Called in c_spawn() to spawn entities
- `SetDebugEntity` -- Called in c_spawn() and c_select() to set selected entity
- `GetDebugEntity` -- Called in c_sel() and c_doscenario() to get selected entity
- `UserToPlayer` -- Called in ListingOrConsolePlayer() and c_despawn() to resolve player from identifier
- `IsRestrictedCharacter` -- Called in c_spawn() to check if prefab is restricted
- `SuUsed` -- Called to track console command usage in c_spawn, c_doscenario, c_setinspiration, c_sethealth, c_minhealth
- `InGamePlay` -- Called in c_reset() to check gameplay state
- `StartNextInstance` -- Called in doreset() and c_reset() to restart instance
- `Shutdown` -- Called in c_shutdown() to close application
- `SerializeUserSession` -- Called in c_shutdown() for client session serialization
- `c_remote` -- Called for remote command execution on client
- `Ents` -- Global entity table for GUID lookup
- `AllRecipes` -- Recipe data lookup for ingredients
- `Profile` -- SetKit* methods for Kitcoon persistence
- `EntityScript` -- is_instance check for teleport arguments
- `VALID_KITCOON_BUILDS` -- Validation table for Kitcoon build names
- `DisableAllDLC` -- Disables DLC content on connection
- `Prefabs` -- Iterated in c_searchprefabs to search prefab names
- `TUNING` -- Accessed for TOTAL_DAY_TIME in c_skip
- `TheFrontEnd` -- screenroot access for client-side task scheduling
- `Shard_GetConnectedShards` -- Returns connected shard information for debug and reregister functions
- `ShardPortals` -- Global table of portal entities accessed in debug and reregister functions
- `Shard_IsWorldAvailable` -- Checks if a linked world is available
- `ConsoleScreenSettings` -- GetConsoleHistory for repeat last command
- `ConsoleRemote` -- Executes remote console command on client
- `ExecuteConsoleCommand` -- Executes local console command
- `UserToClientID` -- Converts userid string/number to client ID
- `LongUpdate` -- Called in c_skip() to advance simulation time by specified number of days
- `GetClosestInstWithTag` -- Called in c_findtag() to find closest entity with specified tag

- `known_assert` -- Triggers known assertion failure for testing
- `smallhash` -- Hashes command name for vote system
- `require` -- Loads debugsounds module for sound debugging
- `SOUNDDEBUG_ENABLED` -- Global flag for sound debug mode
- `SOUNDDEBUGUI_ENABLED` -- Global flag for sound debug UI mode
- `notetable_dsmaintheme` -- Required as default song data for c_shellsfromtable
- `components/heavyobstaclephysics` -- Required to enable deprecated floating exploit flag
- `CAN_USE_DBUI` -- Global flag checked before enabling recording
- `Vector3` -- Used for 3D position calculations in c_shellsfromtable, c_makeboat, c_makegrassboat, c_makecrabboat, c_showradius
- `table.contains` -- DST utility function used in c_kitcoon to validate build names against VALID_KITCOON_BUILDS
- `GetTime` -- Called in c_setinspiration() to record the last attack time
- `RequestShutdown` -- Called in ResetControllersAndQuitGame() to request application shutdown
- `GetTableSize` -- Called in c_countallprefabs() to count unique prefabs in the counted table

**Components used:**
- `builder` -- GiveAllRecipes() called in c_freecrafting()
- `health` -- SetPercent() and SetMinHealth() called in c_sethealth() and c_setminhealth()
- `scenariorunner` -- ClearScenario(), SetScript(), Run() called in c_doscenario(); component added via AddComponent
- `singinginspiration` -- SetPercent() called in c_setinspiration()
- `skinner` -- SetSkinMode() called in c_spawn() for restricted characters
- `playercontroller` -- Checked for existence in c_despawn()
- `sanity` -- SetPercent
- `hunger` -- SetPercent
- `mightiness` -- SetPercent
- `upgrademoduleowner` -- AddCharge
- `wx78_shield` -- SetPercent
- `wereness` -- SetPercent, SetWereMode
- `moisture` -- SetPercent
- `temperature` -- SetTemperature
- `inventory` -- GiveItem, Equip
- `locomotor` -- Accessed via inst.components.locomotor for SetExternalSpeedMultiplier in c_speedmult
- `seasons` -- Accessed via TheWorld.net.components.seasons for GetDebugString in c_dumpseasons
- `worldstate` -- Accessed via TheWorld.components.worldstate for Dump in c_dumpworldstate
- `deerclopsspawner` -- Accessed via TheWorld.components.deerclopsspawner for SummonMonster in c_summondeerclops
- `beargerspawner` -- Accessed via TheWorld.components.beargerspawner for SummonMonster in c_summonbearger
- `malbatrossspawner` -- Accessed via TheWorld.components.malbatrossspawner for Summon in c_summonmalbatross
- `worldmigrator` -- c_migrationportal, c_debugshards, and c_reregisterportals access SetReceivedPortal, SetDestinationWorld, GetDebugString, and linkedWorld property
- `stackable` -- c_makeboat calls SetStackSize() method
- `transform` -- c_makeboat and c_makegrassboat call SetPosition() method
- `boatring` -- GetBumperAtPoint called to find bumper at position in c_boatcollision
- `cyclable` -- SetStep called on spawned shells to configure semitone step position
- `riftspawner` -- SpawnRift called on TheWorld to create rifts at specified position

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
| None | | | No properties are defined. |

## Main functions

### `ConsoleCommandPlayer()`
* **Description:** Returns the currently selected debug entity if it has the player tag, otherwise returns ThePlayer or the first player in AllPlayers.
* **Parameters:** None
* **Returns:** Player entity instance or nil if no valid player found.

### `ConsoleWorldPosition()`
* **Description:** Returns the world position from TheInput, using overridepos if set or GetWorldPosition() otherwise.
* **Parameters:** None
* **Returns:** Vector3 position or nil.

### `ConsoleWorldEntityUnderMouse()`
* **Description:** Returns the visible entity under the mouse cursor, using overridepos if set or GetWorldEntityUnderMouse() otherwise.
* **Parameters:** None
* **Returns:** Entity instance or nil.

### `ListingOrConsolePlayer(input)`
* **Description:** Helper function that converts string/number input to player via UserToPlayer(), or returns input/ConsoleCommandPlayer() as fallback.
* **Parameters:**
  - `input` -- string, number, or player entity -- user identifier or player instance
* **Returns:** Player entity instance or nil.

### `Spawn(prefab)`
* **Description:** Helper function that spawns a prefab using SpawnPrefab().
* **Parameters:**
  - `prefab` -- string -- prefab name to spawn
* **Returns:** Spawned entity instance or nil.

### `c_announce(msg, interval, category)`
* **Description:** Sends server announcements. With no msg, cancels periodic announcements. With interval `<=` 0 or nil, sends one-time announcement. With positive interval, sets up periodic announcement via DoPeriodicTask and stores task in TheWorld.__announcementtask for later cancellation.
* **Parameters:**
  - `msg` -- string or any -- announcement message, converted to string
  - `interval` -- number or nil -- repeat interval in seconds, nil for one-time
  - `category` -- string or nil -- announcement category, 'system' for system messages
* **Returns:** None

### `doreset()`
* **Description:** Local helper function that starts the next instance with RESET_ACTION.LOAD_SLOT using ShardGameIndex slot.
* **Parameters:** None
* **Returns:** None

### `c_mermking()`
* **Description:** Spawns mermthrone and mermking prefabs via c_spawn().
* **Parameters:** None
* **Returns:** None

### `c_mermthrone()`
* **Description:** Spawns mermthrone_construction, gives resources (kelp, beefalowool, pigskin, carrot), and spawns a merm.
* **Parameters:** None
* **Returns:** None

### `c_allbooks()`
* **Description:** Gives all book prefabs to the player via c_give(), including base and upgraded versions.
* **Parameters:** None
* **Returns:** None

### `c_rollback(count)`
* **Description:** Rolls back the specified number of saves. Only works on master sim, sends rollback request via TheNet.
* **Parameters:**
  - `count` -- number -- number of saves to roll back (default 1), 0 equals c_reset()
* **Returns:** None

### `c_reset()`
* **Description:** Restarts the server to the last save file. On client, sends remote command. On master, sends rollback request with count 0 or starts next instance if not in gameplay.
* **Parameters:** None
* **Returns:** None

### `c_regenerateshard(wipesettings)`
* **Description:** Permanently deletes the game world for one shard and regenerates. On client, sends remote command. On master, calls ShardGameIndex:Delete().
* **Parameters:**
  - `wipesettings` -- boolean or nil -- if nil/false, preserves settings; if true, wipes settings
* **Returns:** None

### `c_regenerateworld()`
* **Description:** Permanently deletes all game worlds in a server cluster and regenerates. Does not work properly for offline or loading shards.
* **Parameters:** None
* **Returns:** None

### `c_save()`
* **Description:** Triggers a save on master sim by pushing 'ms_save' event. On client, sends remote command.
* **Parameters:** None
* **Returns:** None

### `c_shutdown(save)`
* **Description:** Shuts down the application. On master, despawns all players and saves via ShardGameIndex. On client, serializes user session. If save is false or TheWorld is nil, shuts down immediately.
* **Parameters:**
  - `save` -- boolean -- if false, shuts down without saving; defaults to saving
* **Returns:** None

### `c_remote(fnstr)`
* **Description:** Remotely executes a Lua string on the server by sending via TheNet with screen-projected position.
* **Parameters:**
  - `fnstr` -- string -- Lua code string to execute remotely
* **Returns:** None

### `c_spawn(prefab, count, dontselect)`
* **Description:** Spawns count instances of prefab at console position. Auto-selects first spawned unless dontselect is true. For restricted characters with skinner component, sets skin mode to normal_skin.
* **Parameters:**
  - `prefab` -- string -- prefab name to spawn (converted to lowercase)
  - `count` -- number -- number of instances to spawn (default 1)
  - `dontselect` -- boolean -- if true, skips auto-selection of spawned entity
* **Returns:** Last spawned entity instance or nil.

### `dodespawn(player)`
* **Description:** Local helper function that pushes 'ms_playerdespawnanddelete' event on master sim to queue player deletion.
* **Parameters:**
  - `player` -- Player entity -- the player to despawn
* **Returns:** None

### `c_despawn(player)`
* **Description:** Despawns a player, returning to character select screen. On client, sends remote command. On master, resolves player via multi-step fallback: tries UserToPlayer(), then c_sel() with player tag check, then falls back to ThePlayer or AllPlayers[1]. Validates with IsValid() and playercontroller check before queueing despawn via DoTaskInTime.
* **Parameters:**
  - `player` -- Player entity, string, number, or nil -- player to despawn or identifier
* **Returns:** None

### `c_getnumplayers()`
* **Description:** Prints the count of players in the AllPlayers table.
* **Parameters:** None
* **Returns:** None

### `c_getmaxplayers()`
* **Description:** Prints the default max players from TheNet.
* **Parameters:** None
* **Returns:** None

### `c_listplayers()`
* **Description:** Prints a listing of currently active players from TheNet:GetClientTable(), showing admin status, index, userid, name, and prefab.
* **Parameters:** None
* **Returns:** None

### `c_listallplayers()`
* **Description:** Prints a listing of all entities in the AllPlayers table with index, userid, name, and prefab.
* **Parameters:** None
* **Returns:** None

### `c_sel()`
* **Description:** Returns the currently selected debug entity via GetDebugEntity().
* **Parameters:** None
* **Returns:** Entity instance or nil.

### `c_select(inst)`
* **Description:** Selects an entity for debugging. If inst is nil, selects entity under mouse cursor. Prints selection status and sets as debug entity.
* **Parameters:**
  - `inst` -- Entity or nil -- entity to select, or nil to select entity under mouse
* **Returns:** Selected entity instance or nil.

### `c_tile()`
* **Description:** Prints the visual tile coordinates and tile type under the cursor using TheWorld.Map.
* **Parameters:** None
* **Returns:** None

### `c_doscenario(scenario)`
* **Description:** Applies a scenario script to the selected entity. Clears existing scenariorunner, reloads the script, adds scenariorunner component, sets script, and runs it.
* **Parameters:**
  - `scenario` -- string -- scenario script name to apply
* **Returns:** None
* **Error states:** Errors if inst lacks scenariorunner component after AddComponent call (no nil guard before SetScript/Run).

### `c_freecrafting(player)`
* **Description:** Enables free crafting mode for a player by calling GiveAllRecipes() on builder component and pushing 'techlevelchange' event.
* **Parameters:**
  - `player` -- Player entity, string, number, or nil -- player to enable free crafting for
* **Returns:** None
* **Error states:** Errors if player has no builder component (nil dereference on player.components.builder).

### `c_sel_health()`
* **Description:** Returns the health component of the currently selected entity.
* **Parameters:** None
* **Returns:** Health component instance or nil.

### `c_setinspiration(n)`
* **Description:** Sets the singing inspiration percent for the console player. Only works if player has singinginspiration component and is not a ghost.
* **Parameters:**
  - `n` -- number -- inspiration percent value (clamped to max 1)
* **Returns:** None

### `c_sethealth(n)`
* **Description:** Sets the health percent for the console player. Only works if player has health component and is not a ghost.
* **Parameters:**
  - `n` -- number -- health percent value (clamped to max 1)
* **Returns:** None

### `c_setminhealth(n)`
* **Description:** Sets the minimum health for the console player. Only works if player has health component and is not a ghost.
* **Parameters:**
  - `n` -- number -- minimum health value to set
* **Returns:** None

### `c_setsanity(n)`
* **Description:** Sets the local player's sanity to the specified percentage.
* **Parameters:**
  - `n` -- number -- sanity percentage value (clamped to max 1)
* **Returns:** None

### `c_sethunger(n)`
* **Description:** Sets the local player's hunger to the specified percentage.
* **Parameters:**
  - `n` -- number -- hunger percentage value (clamped to max 1)
* **Returns:** None

### `c_setmightiness(n)`
* **Description:** Sets the local player's mightiness to the specified percentage.
* **Parameters:**
  - `n` -- number -- mightiness percentage value
* **Returns:** None

### `c_addelectricity(n)`
* **Description:** Adds electrical charge to the player's upgrade module owner component.
* **Parameters:**
  - `n` -- number -- amount of charge to add to WX-78 upgrade modules
* **Returns:** None

### `c_setwxshield(n)`
* **Description:** Sets the WX-78 player's shield to the specified percentage.
* **Parameters:**
  - `n` -- number -- shield percentage value
* **Returns:** None

### `c_setwereness(n)`
* **Description:** Sets the player's wereness state. If n is a number, sets percent; otherwise sets mode and forces 100% were.
* **Parameters:**
  - `n` -- number or string -- if number, sets were percent; if string, sets were mode
* **Returns:** None

### `c_setmoisture(n)`
* **Description:** Sets the local player's moisture to the specified percentage.
* **Parameters:**
  - `n` -- number -- moisture percentage value (clamped to max 1)
* **Returns:** None

### `c_settemperature(n)`
* **Description:** Sets the local player's temperature to the specified value.
* **Parameters:**
  - `n` -- number -- temperature value to set
* **Returns:** None
* **Error states:** None

### `c_connect(ip, port, password)`
* **Description:** Attempts to connect to a multiplayer server directly. Disables DLC if successful.
* **Parameters:**
  - `ip` -- string -- server IP address
  - `port` -- number -- server port
  - `password` -- string -- server password
* **Returns:** boolean -- true if connection started, false otherwise

### `c_give(prefab, count, dontselect)`
* **Description:** Spawns items and places them in the player's inventory.
* **Parameters:**
  - `prefab` -- string -- prefab name to spawn
  - `count` -- number -- number of instances to spawn (default 1)
  - `dontselect` -- boolean -- if true, does not select the spawned item
* **Returns:** Entity -- the first spawned instance, or nil

### `c_equip(prefab, count, dontselect)`
* **Description:** Spawns items, attempts to equip the first one, and gives the rest to inventory.
* **Parameters:**
  - `prefab` -- string -- prefab name to spawn and equip
  - `count` -- number -- number of instances to spawn (default 1)
  - `dontselect` -- boolean -- if true, does not select the equipped item
* **Returns:** Entity -- the first spawned instance, or nil

### `c_giveingredients(prefab)`
* **Description:** Gives the player all ingredients required to craft the specified prefab.
* **Parameters:**
  - `prefab` -- string -- prefab name to look up recipe for
* **Returns:** None
* **Error states:** None

### `c_mat(recname)`
* **Description:** Spawns all ingredients for a recipe and gives them to the player's inventory.
* **Parameters:**
  - `recname` -- string -- recipe name to look up
* **Returns:** None
* **Error states:** None

### `c_pos(inst)`
* **Description:** Returns the world position of an entity.
* **Parameters:**
  - `inst` -- Entity -- entity to get position from
* **Returns:** Vector3 or nil

### `c_printpos(inst)`
* **Description:** Prints the world position of an entity to the console.
* **Parameters:**
  - `inst` -- Entity -- entity to print position for
* **Returns:** None

### `c_teleport(x, y, z, inst)`
* **Description:** Teleports an entity to specific coordinates or the console world position. If first argument is an Entity instance (EntityScript.is_instance check), parameters are reassigned to support c_teleport(inst, x, y, z) calling convention.
* **Parameters:**
  - `x` -- number or Entity -- x coordinate or entity to teleport
  - `y` -- number -- y coordinate
  - `z` -- number -- z coordinate
  - `inst` -- Entity -- entity to teleport (optional)
* **Returns:** None

### `c_move(inst)`
* **Description:** Moves an entity to the console world position.
* **Parameters:**
  - `inst` -- Entity -- entity to move (defaults to selected entity)
* **Returns:** None

### `c_goto(dest, inst)`
* **Description:** Teleports an entity to the position of another player or entity.
* **Parameters:**
  - `dest` -- string, number, or Entity -- target player or position
  - `inst` -- Entity -- entity to move (defaults to console player)
* **Returns:** Entity or nil -- the destination entity if successful, nil if dest or inst is nil.

### `c_inst(guid)`
* **Description:** Returns the entity instance associated with a GUID.
* **Parameters:**
  - `guid` -- number -- entity GUID
* **Returns:** Entity or nil

### `c_list(prefab)`
* **Description:** Lists all entities of a specific prefab near the console player with their positions.
* **Parameters:**
  - `prefab` -- string -- prefab name to search for
* **Returns:** None

### `c_listtag(tag)`
* **Description:** Lists all entities with a specific tag near the console player with their positions.
* **Parameters:**
  - `tag` -- string -- entity tag to search for
* **Returns:** None

### `c_kitcoon(name, age, build)`
* **Description:** Sets Kitcoon pet data in the player profile, useful for recovering lost pets. Prints error and returns early if parameters are invalid types or build not in VALID_KITCOON_BUILDS.
* **Parameters:**
  - `name` -- string -- name for the Kitcoon
  - `age` -- number -- age in days
  - `build` -- string -- build name (must be in VALID_KITCOON_BUILDS)
* **Returns:** None
* **Error states:** None

### `c_gotoroom(roomname, inst)`
* **Description:** Teleports an entity to a world room matching the given name.
* **Parameters:**
  - `roomname` -- string -- name or partial name of the room
  - `inst` -- Entity -- entity to teleport (defaults to console player)
* **Returns:** None

### `c_findnext(prefab, radius, inst)`
* **Description:** Finds the next entity of a specific prefab, cycling through GUIDs higher than the last found.
* **Parameters:**
  - `prefab` -- string -- prefab name to find
  - `radius` -- number -- search radius (optional, defaults to all Ents)
  - `inst` -- Entity or string -- center of search or player identifier
* **Returns:** Entity or nil -- the found entity, or nil if no matching prefab found

### `c_godmode(player)`
* **Description:** Toggles god mode (invincibility) for the specified player. If player has playerghost tag, pushes respawnfromghost event and returns early. If player has corpse tag, pushes respawnfromcorpse event and returns early. Otherwise toggles invincibility on health component. Sends remote command if not on master sim.
* **Parameters:**
  - `player` -- Player instance or nil to use console player
* **Returns:** None

### `c_supergodmode(player)`
* **Description:** Toggles god mode and sets all stats to maximum (health, sanity, hunger to 100%, temperature to 25, moisture to 0). If player has playerghost tag, pushes respawnfromghost event and returns early without toggling invincibility. Otherwise toggles invincibility on health component then sets stats.
* **Parameters:**
  - `player` -- Player instance or nil to use console player
* **Returns:** None

### `c_armor(player)`
* **Description:** Sets player health absorption amount to 1 (full absorption).
* **Parameters:**
  - `player` -- Player instance or nil to use console player
* **Returns:** None

### `c_armour(player)`
* **Description:** Alias for c_armor (British spelling variant).
* **Parameters:**
  - `player` -- Player instance or nil to use console player
* **Returns:** None

### `c_find(prefab, radius, inst)`
* **Description:** Finds the closest entity matching the prefab name within radius of the instance.
* **Parameters:**
  - `prefab` -- string -- prefab name to search for
  - `radius` -- number -- search radius in units (default 9001)
  - `inst` -- Entity -- entity to search from, or nil to use console player
* **Returns:** Entity instance or nil if not found

### `c_findtag(tag, radius, inst)`
* **Description:** Finds the closest entity with the specified tag within radius.
* **Parameters:**
  - `tag` -- string -- entity tag to search for
  - `radius` -- number -- search radius in units (default 1000)
  - `inst` -- Entity -- entity to search from, or nil to use console player
* **Returns:** Entity instance or nil if not found

### `c_gonext(name)`
* **Description:** Finds the next entity matching name and teleports console player to it via c_goto.
* **Parameters:**
  - `name` -- Prefab name to find and go to
* **Returns:** Result of c_goto or nil

### `c_printtextureinfo(filename)`
* **Description:** Prints texture information for the specified filename via TheSim.
* **Parameters:**
  - `filename` -- Texture file path to print info for
* **Returns:** None

### `c_simphase(phase)`
* **Description:** Pushes a phasechange event to TheWorld with the new phase.
* **Parameters:**
  - `phase` -- Phase name to change to
* **Returns:** None

### `c_countprefabs(prefab, noprint)`
* **Description:** Counts all entities with the specified prefab name in the world.
* **Parameters:**
  - `prefab` -- Prefab name to count
  - `noprint` -- Boolean to suppress print output
* **Returns:** Number count of entities

### `c_counttagged(tag, noprint)`
* **Description:** Counts all entities with the specified tag in the world.
* **Parameters:**
  - `tag` -- Entity tag to count
  - `noprint` -- Boolean to suppress print output
* **Returns:** Number count of tagged entities

### `c_countallprefabs()`
* **Description:** Counts and prints statistics for all prefabs in the world, including unknown entities.
* **Parameters:** None
* **Returns:** None

### `c_speedmult(multiplier)`
* **Description:** Sets external speed multiplier on the console player's locomotor component.
* **Parameters:**
  - `multiplier` -- Speed multiplier value
* **Returns:** None

### `c_dump()`
* **Description:** Dumps entity information for the debug entity or entity under mouse.
* **Parameters:** None
* **Returns:** None

### `c_dumpseasons()`
* **Description:** Prints debug string from TheWorld net components seasons.
* **Parameters:** None
* **Returns:** None

### `c_dumpworldstate()`
* **Description:** Prints the full world state dump from TheWorld components worldstate.
* **Parameters:** None
* **Returns:** None

### `c_worldstatedebug()`
* **Description:** Toggles the WORLDSTATEDEBUG_ENABLED global flag.
* **Parameters:** None
* **Returns:** None

### `c_makeinvisible()`
* **Description:** Adds debugnoattack tag to the console player to prevent attacking.
* **Parameters:** None
* **Returns:** None

### `c_selectnext(name)`
* **Description:** Finds the next entity matching name and selects it via c_select.
* **Parameters:**
  - `name` -- Prefab name to find and select
* **Returns:** Entity instance or nil

### `c_selectnear(prefab, rad)`
* **Description:** Finds the closest entity with matching prefab near the console player and selects it.
* **Parameters:**
  - `prefab` -- Prefab name to search for
  - `rad` -- Search radius (default 30)
* **Returns:** Entity instance or nil

### `c_summondeerclops()`
* **Description:** Summons Deerclops boss monster at the console player location via world deerclopsspawner component.
* **Parameters:** None
* **Returns:** None

### `c_summonbearger()`
* **Description:** Summons Bearger boss monster at the console player location via world bearerspawner component.
* **Parameters:** None
* **Returns:** None

### `c_summonmalbatross()`
* **Description:** Summons Malbatross boss monster at the nearest fish shoal to the console player via world malbatrossspawner component.
* **Parameters:** None
* **Returns:** None

### `c_gatherplayers()`
* **Description:** Teleports all players to the console world position.
* **Parameters:** None
* **Returns:** None

### `c_speedup()`
* **Description:** Multiplies simulation time scale by 10 to speed up the game.
* **Parameters:** None
* **Returns:** None

### `c_skip(num)`
* **Description:** Skips forward in time by num days using LongUpdate with TUNING.TOTAL_DAY_TIME.
* **Parameters:**
  - `num` -- Number of days to skip (default 1)
* **Returns:** None

### `c_groundtype()`
* **Description:** Prints the current tile type index and table for the console player.
* **Parameters:** None
* **Returns:** None

### `c_searchprefabs(str)`
* **Description:** Searches all prefabs using regex pattern matching and returns the best match. Prints all matches if multiple found.
* **Parameters:**
  - `str` -- Search string to match against prefab names
* **Returns:** Best matching prefab name string or nil

### `c_maintainhealth(player, percent)`
* **Description:** Creates a periodic task that sets player health to specified percent every 3 seconds. Cancels existing task if present.
* **Parameters:**
  - `player` -- Player instance or nil to use console player
  - `percent` -- Health percent to maintain (default 1 = 100%)
* **Returns:** None

### `c_maintainsanity(player, percent)`
* **Description:** Creates a periodic task that sets player sanity to specified percent every 3 seconds. Cancels existing task if present.
* **Parameters:**
  - `player` -- Player instance or nil to use console player
  - `percent` -- Sanity percent to maintain (default 1 = 100%)
* **Returns:** None

### `c_maintainhunger(player, percent)`
* **Description:** Creates a periodic task that sets player hunger to specified percent every 3 seconds. Cancels existing task if present.
* **Parameters:**
  - `player` -- Player instance or nil to use console player
  - `percent` -- Hunger percent to maintain (default 1 = 100%)
* **Returns:** None

### `c_maintaintemperature(player, temp)`
* **Description:** Creates a periodic task that sets player temperature to specified value every 3 seconds. Cancels existing task if present.
* **Parameters:**
  - `player` -- Player instance or nil to use console player
  - `temp` -- Temperature value to maintain (default 25)
* **Returns:** None

### `c_maintainmoisture(player, percent)`
* **Description:** Creates a periodic task that sets player moisture to specified percent every 3 seconds. Cancels existing task if present.
* **Parameters:**
  - `player` -- Player instance or nil to use console player
  - `percent` -- Moisture percent to maintain (default 0)
* **Returns:** None

### `c_maintainall(player)`
* **Description:** Calls all maintain functions (health, sanity, hunger, temperature, moisture) for the player.
* **Parameters:**
  - `player` -- Player instance or nil to use console player
* **Returns:** None

### `c_cancelmaintaintasks(player)`
* **Description:** Cancels all debug maintenance tasks (health, sanity, hunger, temperature, moisture) on the specified player and sets them to nil.
* **Parameters:**
  - `player` -- Player entity or nil to use console player via ListingOrConsolePlayer
* **Returns:** None

### `c_removeallwithtags(...)`
* **Description:** Iterates through all entities in Ents and removes any entity that has at least one of the specified tags. Prints removal count.
* **Parameters:**
  - `...` -- Variable number of tag strings to match against entities
* **Returns:** None

### `c_emptyworld()`
* **Description:** Removes all entities from the world that have no widget, are not players, have no parent, have a Network component, and lack CLASSIFIED or INLIMBO tags.
* **Parameters:** None
* **Returns:** None

### `c_netstats()`
* **Description:** Retrieves network statistics from TheNet and prints each key-value pair. Prints 'No Netstats yet' if stats are unavailable.
* **Parameters:** None
* **Returns:** None

### `c_remove(entity)`
* **Description:** Removes the specified entity or the entity under the mouse cursor. If entity has health component with current health > 0, calls Kill() instead of Remove() to trigger death behavior. Skips removal if entity matches ConsoleCommandPlayer() result.
* **Parameters:**
  - `entity` -- Entity to remove, or nil to use entity under mouse cursor
* **Returns:** None

### `c_removeat(x, y, z)`
* **Description:** Finds all entities within radius 1 of the specified position and removes each using c_remove().
* **Parameters:**
  - `x` -- X coordinate for entity search
  - `y` -- Y coordinate for entity search
  - `z` -- Z coordinate for entity search
* **Returns:** None

### `c_removeall(name)`
* **Description:** Iterates through all entities and removes those matching the specified prefab name. Prints removal count.
* **Parameters:**
  - `name` -- Prefab name string to match against entities
* **Returns:** None

### `c_forcecrash(unique)`
* **Description:** Schedules a task to trigger a crash by accessing an undefined global variable path. Uses TheWorld on server or TheFrontEnd.screenroot on client.
* **Parameters:**
  - `unique` -- Boolean to generate a random path string instead of fixed 'a'
* **Returns:** None

### `c_knownassert(key)`
* **Description:** Schedules a task to trigger a known_assert failure with the specified key. Uses TheWorld on server or TheFrontEnd.screenroot on client.
* **Parameters:**
  - `key` -- Assert key string, defaults to 'CONFIG_DIR_WRITE_PERMISSION'
* **Returns:** None

### `c_migrationportal(worldId, portalId)`
* **Description:** Spawns a migration_portal prefab and configures its worldmigrator component. If portalId is provided, calls SetReceivedPortal; otherwise calls SetDestinationWorld.
* **Parameters:**
  - `worldId` -- Target world ID for migration
  - `portalId` -- Portal ID for received portal, or nil to set destination world
* **Returns:** None
* **Error states:** Errors if c_spawn returns nil or spawned entity lacks worldmigrator component (no nil guard before component access).

### `c_goadventuring(player)`
* **Description:** Equips the player with a backpack and gives them a full set of adventuring gear including lantern, minerhat, axe, pickaxe, armor, weapons, food, and resources.
* **Parameters:**
  - `player` -- Player entity or nil to use console player via ListingOrConsolePlayer
* **Returns:** None
* **Error states:** Errors if player lacks inventory component or c_spawn returns nil (no nil guards before component access).

### `c_startinggear(player)`
* **Description:** Equips the player with a flowerhat and gives them basic starting resources including food, grass, twigs, logs, rocks, flint, and gold.
* **Parameters:**
  - `player` -- Player entity or nil to use console player via ListingOrConsolePlayer
* **Returns:** None
* **Error states:** Errors if player lacks inventory component or c_spawn returns nil (no nil guards before component access).

### `c_sounddebug()`
* **Description:** Enables sound debugging by loading debugsounds module if not already loaded, setting SOUNDDEBUG_ENABLED to true, SOUNDDEBUGUI_ENABLED to false, and enabling debug render on TheSim.
* **Parameters:** None
* **Returns:** None

### `c_sounddebugui()`
* **Description:** Enables sound debugging UI by loading debugsounds module if not already loaded, setting both SOUNDDEBUG_ENABLED and SOUNDDEBUGUI_ENABLED to true, and enabling debug render on TheSim.
* **Parameters:** None
* **Returns:** None

### `c_migrateto(worldId, portalId)`
* **Description:** Pushes ms_playerdespawnandmigrate event to TheWorld with player, portalid, and worldid data to initiate player migration to another shard.
* **Parameters:**
  - `worldId` -- Target world ID for player migration
  - `portalId` -- Portal ID, defaults to 1 if nil
* **Returns:** None

### `c_debugshards()`
* **Description:** Prints debug information about connected shards, known portals with their worldmigrator debug strings, portal availability status, and unknown portals not in ShardPortals list.
* **Parameters:** None
* **Returns:** None

### `c_reregisterportals()`
* **Description:** Iterates through ShardPortals and sets each portal's worldmigrator destination world to the next connected shard.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if any portal lacks worldmigrator component

### `c_repeatlastcommand()`
* **Description:** Retrieves the last command from console history and re-executes it. Uses ConsoleRemote for remote commands on client if admin, otherwise ExecuteConsoleCommand.
* **Parameters:** None
* **Returns:** None

### `c_startvote(commandname, playeroruserid)`
* **Description:** Starts a vote on TheNet with the hashed command name and resolved userid. Converts player table to userid, or string/number via UserToClientID. Returns early if UserToClientID returns nil for string/number userid.
* **Parameters:**
  - `commandname` -- Vote command name string
  - `playeroruserid` -- Player entity table, userid string, or userid number
* **Returns:** None
* **Error states:** None

### `c_stopvote()`
* **Description:** Stops the current vote on TheNet.
* **Parameters:** None
* **Returns:** None

### `c_makeboat()`
* **Description:** Spawns a complete boat assembly at console world position including boat, mast, steering wheel, rotator, anchor, oars, mast items, boat patches, lantern, fishing rod, bumpers, mast upgrades, cannon kit, and cannonballs. Sets stack sizes on stackable items.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if any spawned prefab lacks Transform component (15+ unguarded SetPosition calls) or stackable component (4 unguarded SetStackSize calls) -- no nil guards after SpawnPrefab.

### `c_makegrassboat()`
* **Description:** Spawns a grass boat assembly at console world position including boat_grass, mast, steering wheel, anchor, and driftwood oar.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if any spawned prefab lacks Transform component (5 unguarded SetPosition calls after SpawnPrefab with no nil guards).

### `c_makecrabboat()`
* **Description:** Spawns a complete crab boat setup at the console world position including boat, oars, ham bats, boat patches, boards, lantern, and all six colored gems with appropriate stack sizes.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if any spawned prefab lacks Transform component (14+ unguarded SetPosition calls) or stackable component (7 unguarded SetStackSize calls) -- no nil guards after SpawnPrefab.

### `c_makeboatspiral()`
* **Description:** Spawns various boat and survival items in a spiral pattern around the console position. Uses a predefined items table with prefab names and stack counts. Items are positioned using trigonometric calculations based on theta angle and distance from center.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if spawned entities lack Transform or stackable component (no nil guards before component access).

### `c_boatcollision()`
* **Description:** Debug function to test boat collision damage. Only works when the player is standing on a boat. Gets the bumper at console position and applies maximum hull damage to it, then pushes a boatcollision event.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if player lacks current platform, platform lacks boatring component, or bumper lacks health component (no nil guards before chained component access).

### `c_autoteleportplayers()`
* **Description:** Toggles the TheWorld.auto_teleport_players flag and prints the new state to console. Used for debugging player teleportation behavior.
* **Parameters:** None
* **Returns:** None

### `c_dumpentities()`
* **Description:** Iterates through all entities in the Ents table, counts occurrences by prefab/widget/name, sorts by count descending, and prints a summary table to console with total entity count.
* **Parameters:** None
* **Returns:** None

### `NoteToSemitone(note)`
* **Description:** Local helper function that converts a musical note string to a semitone value. Extracts the octave from the last character and the note name from preceding characters, then calculates semitone using the note_to_semitone lookup table.
* **Parameters:**
  - `note` -- string -- musical note name with octave number (e.g., 'C4', 'A#3')
* **Returns:** number -- semitone value

### `c_shellsfromtable(song, startpos, placementfn, spacing_multiplier, out_of_range_mode)`
* **Description:** Spawns singing shell prefabs based on a note table, with configurable transposition and out-of-range handling modes. Supports four modes: AUTO_TRANSPOSE shifts all notes to fit valid range, OMIT skips invalid notes, TRUNCATE stops spawning at first invalid note, TERMINATE removes all spawned shells on invalid note. Returns nil if song table is invalid, auto-transposition fails due to tonal range exceeding 3 octaves, or shell prefab lookup fails during transposition.
* **Parameters:**
  - `song` -- table or string - notes table or path to notetable file (defaults to notetable_dsmaintheme)
  - `startpos` -- Vector3 - starting position for shell spawning (defaults to ConsoleWorldPosition)
  - `placementfn` -- function - callback for calculating spawn positions based on current position and multiplier
  - `spacing_multiplier` -- number - multiplier for spacing between shells (default 1)
  - `out_of_range_mode` -- string - one of AUTO_TRANSPOSE, OMIT, TRUNCATE, or TERMINATE for handling out-of-range semitones (default AUTO_TRANSPOSE)
* **Returns:** table of spawned shell entities, or nil on error
* **Error states:** Errors if placementfn returns invalid position or spawned shell lacks Transform/cyclable component (no nil guards before component access in SpawnShell helper).

### `c_guitartab(songdata, overrides, dont_spawn_shells)`
* **Description:** Processes guitar tablature data by converting fret positions to semitones based on tuning, applies transposition, and optionally spawns shells via c_shellsfromtable. Returns false with INVALID_SONGDATA if songdata is invalid type, or NO_TABLATURE_FOUND if tab table is missing.
* **Parameters:**
  - `songdata` -- string or table - guitartab file name or data table (defaults to guitartab_dsmaintheme)
  - `overrides` -- table - optional overrides for tuning, transposition, startpos, placementfn, spacing_multiplier
  - `dont_spawn_shells` -- boolean - if true, skips shell spawning and only returns transcribed song table
* **Returns:** table with songtable and optionally shells_spawned
* **Error states:** Errors if songdata lacks tab field (no nil guard after require), or if c_shellsfromtable fails due to missing components on spawned shells.

### `c_setrotation(angle)`
* **Description:** Sets the rotation of the entity under mouse or currently selected entity to the specified angle.
* **Parameters:**
  - `angle` -- number - rotation angle in degrees (defaults to 0)
* **Returns:** None
* **Error states:** Errors if mouseentity is nil or lacks Transform component (no nil guard before Transform access).

### `c_rotatecw(delta)`
* **Description:** Rotates the entity under mouse or selected entity clockwise by delta degrees from current rotation.
* **Parameters:**
  - `delta` -- number - degrees to rotate clockwise (default 45)
* **Returns:** None
* **Error states:** Errors if mouseentity is nil or lacks Transform component (no nil guard before Transform access).

### `c_rotateccw(delta)`
* **Description:** Rotates the entity under mouse or selected entity counter-clockwise by delta degrees from current rotation.
* **Parameters:**
  - `delta` -- number - degrees to rotate counter-clockwise (default 45)
* **Returns:** None
* **Error states:** Errors if mouseentity is nil or lacks Transform component (no nil guard before Transform access).

### `c_record()`
* **Description:** Toggles debug menu history recording on or off and prints current state to console.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if TheFrontEnd or TheFrontEnd.debugMenu.history is nil (no nil guard before access).

### `c_spawnrift()`
* **Description:** Spawns a rift at console world position, pushing shadowrift_opened event for cave worlds or lunarrift_opened for surface worlds.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `showradius_createent()`
* **Description:** Local helper function that creates a classified non-networked entity with firefighter_placement animation for radius visualization.
* **Parameters:** None
* **Returns:** Entity instance

### `c_showradius(radius, parent)`
* **Description:** Creates visual radius indicators around a parent entity using scaled firefighter_placement prefabs, removing any existing indicators first.
* **Parameters:**
  - `radius` -- number or table of numbers -- radius values to visualize in game units
  - `parent` -- Entity -- parent entity to attach radius visualizers to (defaults to entity under mouse or player)
* **Returns:** None
* **Error states:** Errors if created entity lacks AnimState or Transform component (no nil guard in showradius_createent helper). Also errors if parent is nil when entity:SetParent is called (no nil guard before parent.entity access).

### `c_use_deprecated_floating_heavyobstaclephysics_exploit()`
* **Description:** Enables the deprecated floating heavy obstacle physics exploit by setting a flag on the heavyobstaclephysics module.
* **Parameters:** None
* **Returns:** None

### `ResetControllersAndQuitGame()`
* **Description:** Resets all controller mappings in profile and ini file, then requests game shutdown. Intended for recovering from busted controller configurations. Only works when not InGamePlay(); prints message and returns without action if called during gameplay.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if TheSim or Profile is nil (no nil guard before access).

## Events & listeners

**Listens to:**
None

**Pushes:**
- `ms_save` — Pushed by c_save() on master sim to trigger world save.
- `ms_playerdespawnanddelete` — Pushed by dodespawn() on master sim to queue player deletion.
- `techlevelchange` — Pushed by c_freecrafting() after enabling free crafting mode.
- `respawnfromghost` — Pushed when reviving player from ghost state in c_godmode and c_supergodmode
- `respawnfromcorpse` — Pushed when reviving player from corpse state in c_godmode
- `phasechange` — Pushed to TheWorld in c_simphase with newphase data
- `ms_playerdespawnandmigrate` — Pushed by c_migrateto to TheWorld with player, portalid, and worldid data to initiate shard migration
- `boatcollision` — Pushed on collided bumper when c_boatcollision detects a collision at console position
- `shadowrift_opened` — Pushed when spawning rift in cave world
- `lunarrift_opened` — Pushed when spawning rift in non-cave world