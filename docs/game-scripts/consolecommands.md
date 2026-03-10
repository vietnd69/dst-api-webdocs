---
id: consolecommands
title: Consolecommands
description: Exposes a comprehensive suite of console commands for debugging, world manipulation, player control, entity spawning, and game state management in Don't Starve Together.
tags: [debug, player, world, entity, network]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: adf8c5cd
system_scope: player
---

# Consolecommands

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The `consolecommands.lua` file defines a rich set of console-triggered utilities for development, testing, and debugging in Don't Starve Together. It provides centralized access to entity manipulation, world simulation control, player state editing, spawning helpers, and administrative functions. Built around the Entity Component System, it leverages component APIs to modify state safely across client and server, and includes robust input handling for both local and remote execution. The module also supports complex debugging workflows like boat collision testing, rift spawning, singing shell generation, and network diagnostics.

## Usage example
```lua
-- Spawn a player with full stats, freebuild mode, and super armor
c_spawn("wilson")
c_supergodmode()
c_freecrafting()

-- Spawn a rift and a full boat setup at cursor position
c_spawnrift()
c_makeboat()

-- Start a repeating announcement and skip 5 days
c_announce("Simulation test starting", 60, "system")
c_skip(5)

-- Teleport all players to cursor and dump world state
c_gatherplayers()
c_dumpworldstate()
```

## Dependencies & tags
**Components used:**
- `health` — DoDelta, Kill, SetAbsorptionAmount, SetInvincible, SetMinHealth, SetPercent, currenthealth, invincible
- `sanity` — SetPercent
- `hunger` — SetPercent
- `temperature` — SetTemperature
- `moisture` — SetPercent
- `locomotor` — SetExternalSpeedMultiplier
- `singinginspiration` — SetPercent
- `mightiness` — SetPercent
- `upgrademoduleowner` — AddCharge
- `wereness` — SetPercent, SetWereMode
- `scenariorunner` — ClearScenario, Run, SetScript
- `builder` — GiveAllRecipes
- `inventory` — Equip, GiveItem
- `worldmigrator` — GetDebugString, SetDestinationWorld, SetReceivedPortal, linkedWorld
- `deerclopsspawner` — SummonMonster
- `beargerspawner` — SummonMonster
- `malbatrossspawner` — Summon
- `skinner` — SetSkinMode
- `cyclable` — SetStep
- `stackable` — SetStackSize
- `boatring` — GetBumperAtPoint
- `riftspawner` — SpawnRift
- `seasons` — GetDebugString
- `worldstate` — Dump
- `playercontroller` — (used, no methods exposed in snippet)

**Tags:**
- `"player"`, `"playerghost"`, `"corpse"`, `"debugnoattack"`, `"CLASSIFIED"`, `"INLIMBO"`, `"NOCLICK"`, `"cave"`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `TheWorld.auto_teleport_players` | boolean | `false` | Controls whether players are automatically teleported on map load |

## Main functions
### `ConsoleCommandPlayer()`
* **Description:** Returns the currently selected debug entity, the local player, or the first valid player in `AllPlayers`, ensuring it has the `"player"` tag. Used as a fallback when player-specific commands lack explicit target.
* **Parameters:** None
* **Returns:** Player instance (with `"player"` tag) or `nil` if no valid player found.

### `ConsoleWorldPosition()`
* **Description:** Returns the current world position, prioritizing `TheInput.overridepos` if set, otherwise `TheInput:GetWorldPosition()`.
* **Parameters:** None
* **Returns:** Vector3 — World coordinates (x, y, z) of the cursor or override.

### `ConsoleWorldEntityUnderMouse()`
* **Description:** Returns the visible entity under the mouse cursor. If `TheInput.overridepos` is active, searches within radius 1 of that position.
* **Parameters:** None
* **Returns:** Entity instance or `nil`.

### `ListingOrConsolePlayer(input)`
* **Description:** Converts string/number/user input to a player via `UserToPlayer`. Falls back to `ConsoleCommandPlayer()` if input is invalid.
* **Parameters:** `input` — string, number, or entity instance
* **Returns:** Player instance (or input if already a valid entity) or `nil`.

### `Spawn(prefab)`
* **Description:** Wraps `SpawnPrefab` to spawn a prefab instance at a default location.
* **Parameters:** `prefab` — string prefab name
* **Returns:** Instance returned by `SpawnPrefab`, or `nil`.

### `c_announce(msg, interval, category)`
* **Description:** Displays a message in the top-center UI. Supports one-time announcements, repeating announcements (via `interval` in seconds), and cancellation (by passing `nil` as `msg`).
* **Parameters:**  
  - `msg` — string message, or `nil` to cancel  
  - `interval` — numeric interval (seconds) for repeating; `nil` for one-time  
  - `category` — optional string (e.g., `"system"`)
* **Returns:** None

### `doreset()`
* **Description:** Internal helper to restart the server from the last save slot.
* **Parameters:** None
* **Returns:** None

### `c_mermking()`
* **Description:** Spawns merm-related prefabs (`mermthrone`, `mermking`, `mermbuilding`) and gives resources.
* **Parameters:** None
* **Returns:** None

### `c_mermthrone()`
* **Description:** Spawns a `mermthrone` prefab at console position.
* **Parameters:** None
* **Returns:** None

### `c_allbooks()`
* **Description:** Gives all predefined books (`book_...`) to the player via `c_give`.
* **Parameters:** None
* **Returns:** None

### `c_rollback(count)`
* **Description:** Sends a world rollback request to the server (only on master sim) to go back `count` saves. Defaults to 1.
* **Parameters:** `count` — number of saves to roll back (default `1`)
* **Returns:** None

### `c_reset()`
* **Description:** Resets the server to the last save by calling `c_rollback(0)` (on master) or forwarding request (on client).
* **Parameters:** None
* **Returns:** None

### `c_regenerateshard(wipesettings)`
* **Description:** Deletes the current shard’s world directory and regenerates a new world. If `wipesettings` is true, resets world settings.
* **Parameters:** `wipesettings` — boolean; if truthy, wipes current settings
* **Returns:** None

### `c_regenerateworld()`
* **Description:** Resets the entire world cluster (all shards) via `TheNet:SendWorldResetRequestToServer`.
* **Parameters:** None
* **Returns:** None

### `c_save()`
* **Description:** Triggers a save on master sim via `"ms_save"` event.
* **Parameters:** None
* **Returns:** None

### `c_shutdown(save)`
* **Description:** Shuts down the game. If `save` is false, skips saving.
* **Parameters:** `save` — boolean; if `false`, skip saving
* **Returns:** None

### `c_remote(fnstr)`
* **Description:** Sends a Lua code string to the server for execution at the projected world position.
* **Parameters:** `fnstr` — string of Lua code
* **Returns:** None

### `c_spawn(prefab, count, dontselect)`
* **Description:** Spawns `count` instances of `prefab` at console position. Auto-selects first spawned unless `dontselect`. For restricted characters, sets skin mode via `skinner`.
* **Parameters:**  
  - `prefab` — string prefab name  
  - `count` — number of instances (default `1`)  
  - `dontselect` — boolean to skip auto-selection
* **Returns:** Last spawned instance, or `nil`.

### `dodespawn(player)`
* **Description:** Sends `"ms_playerdespawnanddelete"` event on master to remove and delete a player.
* **Parameters:** `player` — player entity
* **Returns:** None

### `c_despawn(player)`
* **Description:** Despawns and deletes a player (or current `ConsoleCommandPlayer()`). Calls `dodespawn`.
* **Parameters:** `player` — optional player identifier or instance
* **Returns:** None

### `c_getnumplayers()`
* **Description:** Prints the current number of connected players.
* **Parameters:** None
* **Returns:** None

### `c_getmaxplayers()`
* **Description:** Prints the maximum player limit.
* **Parameters:** None
* **Returns:** None

### `c_listplayers()`
* **Description:** Lists players visible to the client via `AllPlayers`.
* **Parameters:** None
* **Returns:** None

### `c_listallplayers()`
* **Description:** Lists all players, including those not yet loaded (uses raw `AllPlayers` table).
* **Parameters:** None
* **Returns:** None

### `c_sel()`
* **Description:** Returns the current debug-selected entity. Sets selection if called with an entity.
* **Parameters:** None
* **Returns:** Currently selected entity, or `nil`.

### `c_select(inst)`
* **Description:** Sets or clears the debug-selected entity.
* **Parameters:** `inst` — entity to select; if `nil`, clears selection
* **Returns:** Selected entity, or `nil`.

### `c_tile()`
* **Description:** Prints the tile coordinates and tile type index under the mouse.
* **Parameters:** None
* **Returns:** None

### `c_doscenario(scenario)`
* **Description:** Attaches and runs a scenario script on the selected entity. Requires the entity to support `"scenariorunner"`.
* **Parameters:** `scenario` — string scenario name (e.g., `"archive_cookpot"`)
* **Returns:** None

### `c_freecrafting(player)`
* **Description:** Toggles freebuild (free crafting) mode for `player`. Updates via `builder.giveAllRecipes()` and pushes `"techlevelchange"`.
* **Parameters:** `player` — optional player entity (defaults to `ConsoleCommandPlayer()`)
* **Returns:** None

### `c_sel_health()`
* **Description:** Returns the health component of the selected entity.
* **Parameters:** None
* **Returns:** Health component instance or `nil`.

### `c_setinspiration(n)`
* **Description:** Sets player inspiration percentage (1 = 100%). Clamped to ≤1. No-op on ghosts.
* **Parameters:** `n` — numeric percentage (0–1)
* **Returns:** None

### `c_sethealth(n)`
* **Description:** Sets player health to `n * maxhealth`.
* **Parameters:** `n` — numeric percentage (0–1)
* **Returns:** None

### `c_setminhealth(n)`
* **Description:** Sets player health minimum.
* **Parameters:** `n` — number health minimum
* **Returns:** None

### `c_setsanity(n)`
* **Description:** Sets player sanity percentage.
* **Parameters:** `n` — numeric percentage (0–1)
* **Returns:** None

### `c_sethunger(n)`
* **Description:** Sets player hunger percentage.
* **Parameters:** `n` — numeric percentage (0–1)
* **Returns:** None

### `c_setmightiness(n)`
* **Description:** Sets player mightiness percentage.
* **Parameters:** `n` — numeric percentage (0–1)
* **Returns:** None

### `c_addelectricity(n)`
* **Description:** Adds charge to player’s `upgrademoduleowner` component.
* **Parameters:** `n` — number of charges to add
* **Returns:** None

### `c_setwereness(n)`
* **Description:** Sets player wereness percentage or mode string (e.g., `"human"` or `"werewolf"`).
* **Parameters:** `n` — number percentage or string mode
* **Returns:** None

### `c_setmoisture(n)`
* **Description:** Sets player moisture percentage.
* **Parameters:** `n` — numeric percentage (0–1)
* **Returns:** None

### `c_settemperature(n)`
* **Description:** Sets player temperature.
* **Parameters:** `n` — numeric temperature (must be number)
* **Returns:** None

### `c_connect(ip, port, password)`
* **Description:** Attempts to connect to a remote server via `TheNet:StartClient`.
* **Parameters:**  
  - `ip` — server IP  
  - `port` — server port  
  - `password` — optional password
* **Returns:** `true` on success, `false` otherwise.

### `c_give(prefab, count, dontselect)`
* **Description:** Spawns `count` instances of `prefab` and gives them to player inventory.
* **Parameters:**  
  - `prefab` — item prefab name  
  - `count` — number of items (default `1`)  
  - `dontselect` — boolean to skip auto-selection
* **Returns:** First spawned item or `nil`.

### `c_equip(prefab, count, dontselect)`
* **Description:** Spawns `count` instances and equips the first in player’s inventory (rest are given).
* **Parameters:** Same as `c_give`
* **Returns:** First item or `nil`.

### `c_giveingredients(prefab)`
* **Description:** Finds recipe for `prefab` and gives all ingredients to player.
* **Parameters:** `prefab` — recipe result (e.g., `"log"` → `"campfire"`)
* **Returns:** None

### `c_mat(recname)`
* **Description:** Alias for `c_giveingredients`.
* **Parameters:** `recname` — recipe name
* **Returns:** None

### `c_pos(inst)`
* **Description:** Returns world position of `inst`.
* **Parameters:** `inst` — entity instance
* **Returns:** Vector3 or `nil`.

### `c_printpos(inst)`
* **Description:** Prints world position of `inst`.
* **Parameters:** `inst` — entity instance
* **Returns:** None

### `c_teleport(x, y, z, inst)`
* **Description:** Teleports `inst` to coordinates or auto-detects arg order. Uses `ConsoleWorldPosition()` if x,y,z are `nil`.
* **Parameters:**  
  - `x,y,z` — target coords (or swapped: `inst` first, then x,y,z)  
  - `inst` — optional entity
* **Returns:** None

### `c_move(inst)`
* **Description:** Moves `inst` to the cursor’s world position.
* **Parameters:** `inst` — optional entity (defaults to selected)
* **Returns:** None

### `c_goto(dest, inst)`
* **Description:** Teleports `inst` to `dest`’s position and snaps camera.
* **Parameters:**  
  - `dest` — entity or identifier (e.g., player)  
  - `inst` — optional entity to move
* **Returns:** `dest` entity or `nil`.

### `c_inst(guid)`
* **Description:** Returns entity by GUID from `Ents` table.
* **Parameters:** `guid` — string or number GUID
* **Returns:** Entity or `nil`.

### `c_list(prefab)`
* **Description:** Lists entities of `prefab` within 9001 radius of player.
* **Parameters:** `prefab` — string
* **Returns:** None

### `c_listtag(tag)`
* **Description:** Lists entities with `tag` within 9001 radius.
* **Parameters:** `tag` — string
* **Returns:** None

### `c_kitcoon(name, age, build)`
* **Description:** Creates or updates a Kitcoon pet via Profile system.
* **Parameters:**  
  - `name` — string  
  - `age` — number of days  
  - `build` — string (must be in `VALID_KITCOON_BUILDS`)
* **Returns:** None

### `c_gotoroom(roomname, inst)`
* **Description:** Teleports `inst` to the first room whose name contains `roomname` (case-insensitive).
* **Parameters:**  
  - `roomname` — substring  
  - `inst` — optional entity
* **Returns:** None

### `c_findnext(prefab, radius, inst)`
* **Description:** Finds next instance of `prefab` with GUID greater than last found; wraps around if not found.
* **Parameters:**  
  - `prefab` — string  
  - `radius` — optional radius (default 9001)  
  - `inst` — source entity
* **Returns:** Entity or `nil`.

### `c_godmode(player)`
* **Description:** Toggles invincibility on player health. Revives ghost/corpse if needed.
* **Parameters:** `player` — optional player
* **Returns:** None

### `c_supergodmode(player)`
* **Description:** Enables godmode + sets health/sanity/hunger/temperature/moisture to max.
* **Parameters:** `player` — optional player
* **Returns:** None

### `c_armor(player)`
* **Description:** Sets player absorption to `1` (full).
* **Parameters:** `player` — optional player
* **Returns:** None

### `c_find(prefab, radius, inst)`
* **Description:** Finds nearest instance of `prefab` within radius.
* **Parameters:** Same as `c_findnext`
* **Returns:** Entity or `nil`.

### `c_findtag(tag, radius, inst)`
* **Description:** Finds nearest entity with `tag` within radius.
* **Parameters:** Same as `c_find`
* **Returns:** Entity or `nil`.

### `c_gonext(name)`
* **Description:** Finds next `name` and teleports to it (via `c_goto`).
* **Parameters:** `name` — prefab or identifier
* **Returns:** Result of `c_goto`, or `nil`.

### `c_printtextureinfo(filename)`
* **Description:** Delegates to `TheSim:PrintTextureInfo` for debugging texture loading.
* **Parameters:** `filename` — string texture file path
* **Returns:** None

### `c_simphase(phase)`
* **Description:** Forces world phase change by pushing `"phasechange"` with `phase`.
* **Parameters:** `phase` — string (e.g., `"day"`, `"night"`)
* **Returns:** None

### `c_countprefabs(prefab, noprint)`
* **Description:** Counts entities of `prefab` in world. Prints count unless `noprint`.
* **Parameters:**  
  - `prefab` — string  
  - `noprint` — boolean to suppress output
* **Returns:** Integer count

### `c_counttagged(tag, noprint)`
* **Description:** Counts entities with `tag` in world.
* **Parameters:** Same as `c_countprefabs`
* **Returns:** Integer count

### `c_countallprefabs()`
* **Description:** Counts and prints all prefabs present in the world, grouped and sorted by count descending.
* **Parameters:** None
* **Returns:** None

### `c_speedmult(multiplier)`
* **Description:** Sets locomotor speed multiplier (e.g., 2 = 200% speed).
* **Parameters:** `multiplier` — numeric
* **Returns:** None

### `c_dump()`
* **Description:** Dumps current entity count and world info.
* **Parameters:** None
* **Returns:** None

### `c_dumpseasons()`
* **Description:** Prints debug info about current season state via `seasons.getDebugString()`.
* **Parameters:** None
* **Returns:** None

### `c_dumpworldstate()`
* **Description:** Dumps world state via `worldstate.dump()`.
* **Parameters:** None
* **Returns:** None

### `c_worldstatedebug()`
* **Description:** Toggles `WORLDSTATEDEBUG_ENABLED` global.
* **Parameters:** None
* **Returns:** None

### `c_makeinvisible()`
* **Description:** Adds `"debugnoattack"` tag to player to prevent attacks.
* **Parameters:** None
* **Returns:** None

### `c_selectnext(name)`
* **Description:** Finds next entity matching `name` and selects it.
* **Parameters:** `name` — string
* **Returns:** Selected entity or `nil`.

### `c_selectnear(prefab, rad)`
* **Description:** Selects nearest entity of `prefab` within `rad`.
* **Parameters:**  
  - `prefab` — string  
  - `rad` — radius (default `30`)
* **Returns:** Selected entity or `nil`.

### `c_summondeerclops()`
* **Description:** Summons a Deerclops for current player via world spawner.
* **Parameters:** None
* **Returns:** None

### `c_summonbearger()`
* **Description:** Summons a Bearger for current player.
* **Parameters:** None
* **Returns:** None

### `c_summonmalbatross()`
* **Description:** Summons a Malbatross for current player.
* **Parameters:** None
* **Returns:** None

### `c_gatherplayers()`
* **Description:** Teleports all players to the console world position.
* **Parameters:** None
* **Returns:** None

### `c_speedup()`
* **Description:** Multiplies `TheWorld.simtime.timescale` by `10`.
* **Parameters:** None
* **Returns:** None

### `c_skip(num)`
* **Description:** Simulates `num` days via `TheWorld:LongUpdate`.
* **Parameters:** `num` — number of days (default `1`)
* **Returns:** None

### `c_groundtype()`
* **Description:** Prints current tile type index and tile table.
* **Parameters:** None
* **Returns:** None

### `c_searchprefabs(str)`
* **Description:** Fuzzy-searches `Prefabs` table for `str`; returns best match.
* **Parameters:** `str` — search string
* **Returns:** Best match prefab name or `nil`.

### `c_maintainhealth(player, percent)`
* **Description:** Starts periodic task to maintain player health at `percent`.
* **Parameters:**  
  - `player` — entity  
  - `percent` — number (0–1)
* **Returns:** None

### `c_maintainsanity(player, percent)`
* **Description:** Maintains sanity at `percent`.
* **Parameters:** Same
* **Returns:** None

### `c_maintainhunger(player, percent)`
* **Description:** Maintains hunger at `percent`.
* **Parameters:** Same
* **Returns:** None

### `c_maintaintemperature(player, temp)`
* **Description:** Maintains temperature at `temp`.
* **Parameters:**  
  - `player`  
  - `temp` — number
* **Returns:** None

### `c_maintainmoisture(player, percent)`
* **Description:** Maintains moisture at `percent`.
* **Parameters:** Same
* **Returns:** None

### `c_maintainall(player, health, sanity, hunger, temp, moisture)`
* **Description:** Starts all maintenance tasks on `player`.
* **Parameters:**  
  - `player`  
  - `health, sanity, hunger, temp, moisture` — target values
* **Returns:** None

### `c_cancelmaintaintasks(player)`
* **Description:** Cancels all maintenance tasks for `player`.
* **Parameters:** `player` — optional
* **Returns:** None

### `c_removeallwithtags(...)`
* **Description:** Removes all entities that have any of the given tags.
* **Parameters:** vararg tags (e.g., `"spider"`, `"insect"`)
* **Returns:** None

### `c_emptyworld()`
* **Description:** Removes all non-essential entities (excludes players, widgets, etc.).
* **Parameters:** None
* **Returns:** None

### `c_netstats()`
* **Description:** Prints network statistics via `TheNet:GetNetworkStatistics`.
* **Parameters:** None
* **Returns:** None

### `c_remove(entity)`
* **Description:** Removes `entity` via `RemoveEntity`.
* **Parameters:** `entity` — instance
* **Returns:** None

### `c_removeat(x,y,z)`
* **Description:** Removes entities near position.
* **Parameters:** `x,y,z` — coords
* **Returns:** None

### `c_removeall(name)`
* **Description:** Removes all entities of `prefab` name.
* **Parameters:** `name` — string
* **Returns:** None

### `c_forcecrash(unique)`
* **Description:** Intentionally crashes the game. If `unique`, generates unique variable name to avoid duplicate crash reports.
* **Parameters:**  
  - `unique` — boolean
* **Returns:** None

### `c_knownassert(key)`
* **Description:** Triggers a known assertion via `assert(false, key)`.
* **Parameters:** `key` — assertion message
* **Returns:** None

### `c_migrationportal(worldId, portalId)`
* **Description:** Spawns a migration portal and configures its `worldmigrator` component.
* **Parameters:**  
  - `worldId` — string or number  
  - `portalId` — number (default `1`)
* **Returns:** None

### `c_goadventuring(player)`
* **Description:** Gives predefined Adventuring gear to `player`.
* **Parameters:** `player` — optional
* **Returns:** None

### `c_startinggear(player)`
* **Description:** Gives predefined Starting Gear to `player`.
* **Parameters:** `player` — optional
* **Returns:** None

### `c_sounddebug()`
* **Description:** Enables sound debug flags.
* **Parameters:** None
* **Returns:** None

### `c_sounddebugui()`
* **Description:** Enables sound debug rendering UI.
* **Parameters:** None
* **Returns:** None

### `c_migrateto(worldId, portalId)`
* **Description:** Sends `"ms_playerdespawnandmigrate"` event for `ThePlayer` to migrate to `worldId`.
* **Parameters:**  
  - `worldId` — string  
  - `portalId` — number (default `1`)
* **Returns:** None

### `c_debugshards()`
* **Description:** Prints shard and portal debug info.
* **Parameters:** None
* **Returns:** None

### `c_reregisterportals()`
* **Description:** Resets portal destinations to first connected shard.
* **Parameters:** None
* **Returns:** None

### `c_repeatlastcommand()`
* **Description:** Re-executes the last console command, handling remote vs local logic.
* **Parameters:** None
* **Returns:** None

### `c_startvote(commandname, playeroruserid)`
* **Description:** Starts a vote via `TheNet` to execute `commandname`.
* **Parameters:**  
  - `commandname` — string command  
  - `playeroruserid` — optional target player
* **Returns:** None

### `c_stopvote()`
* **Description:** Stops the active vote.
* **Parameters:** None
* **Returns:** None

### `c_makeboat()`
* **Description:** Spawns a full boat setup at console position, including hull, mast, wheel, anchor, oars, lantern, fishing rod, and upgrade kits.
* **Parameters:** None
* **Returns:** None

### `c_makegrassboat()`
* **Description:** Spawns a minimal grass boat at console position.
* **Parameters:** None
* **Returns:** None

### `c_makecrabboat()`
* **Description:** Spawns a crab boat variant with custom items and gem stack sizes.
* **Parameters:** None
* **Returns:** None

### `c_makeboatspiral()`
* **Description:** Spawns a logarithmic spiral of items around console position using default math-based layout.
* **Parameters:** None
* **Returns:** None

### `c_boatcollision()`
* **Description:** If player is on a boat, finds bumper at cursor and inflicts `TUNING.BOAT.MAX_HULL_HEALTH_DAMAGE`.
* **Parameters:** None
* **Returns:** None

### `c_autoteleportplayers()`
* **Description:** Toggles `TheWorld.auto_teleport_players`.
* **Parameters:** None
* **Returns:** None

### `c_dumpentities()`
* **Description:** Counts and prints all entities grouped by prefab, sorted descending by count.
* **Parameters:** None
* **Returns:** None

### `NoteToSemitone(note)`
* **Description:** Converts musical note (e.g., `"C4"`, `"D#5"`) to semitone index.
* **Parameters:** `note` — string note (e.g., `"C4"`)
* **Returns:** Number (semitone index) or `nil`.

### `c_shellsfromtable(song, startpos, placementfn, spacing_multiplier, out_of_range_mode)`
* **Description:** Spawns singing shells based on `song` table. Supports out-of-range modes: `"AUTO_TRANSPOSE"`, `"OMIT"`, `"TRUNCATE"`, `"TERMINATE"`.
* **Parameters:**  
  - `song` — table or module name (default `notetable_dsmaintheme`)  
  - `startpos` — Vector3 start (default `ConsoleWorldPosition()`)  
  - `placementfn` — function(currentpos, multiplier) → new pos  
  - `spacing_multiplier` — number  
  - `out_of_range_mode` — string
* **Returns:** Table of spawned shells or `false, err` or `nil`.

### `c_guitartab(songdata, overrides, dont_spawn_shells)`
* **Description:** Parses guitar tab (from file or table), applies tuning/transposition, optionally spawns shells.
* **Parameters:**  
  - `songdata` — filename or tab table  
  - `overrides` — optional `{tuning, transposition, startpos, placementfn, spacing_multiplier}`  
  - `dont_spawn_shells` — boolean
* **Returns:** `{songtable=song, shells_spawned=shells}` or `{false, err}`.

### `c_setrotation(angle)`
* **Description:** Sets rotation of selected/mouse entity to `angle` degrees.
* **Parameters:** `angle` — number (default `0`)
* **Returns:** None

### `c_rotatecw(delta)`
* **Description:** Rotates selected entity clockwise by `delta`.
* **Parameters:** `delta` — degrees (default `45`)
* **Returns:** None

### `c_rotateccw(delta)`
* **Description:** Rotates selected entity counterclockwise by `delta`.
* **Parameters:** `delta` — degrees (default `45`)
* **Returns:** None

### `c_record()`
* **Description:** Toggles history recording in debug menu if allowed (`CAN_USE_DBUI` and not threaded render).
* **Parameters:** None
* **Returns:** None

### `c_spawnrift()`
* **Description:** Spawns a rift (shadow/lunar) at console position based on world tag `"cave"`.
* **Parameters:** None
* **Returns:** None

### `c_showradius(radius, parent)`
* **Description:** Spawns non-networked debug entities showing radius(s) as color overlays.
* **Parameters:**  
  - `radius` — number or table of numbers  
  - `parent` — entity to parent visuals (default mouse entity or player)
* **Returns:** None

### `c_use_deprecated_floating_heavyobstaclephysics_exploit()`
* **Description:** Enables legacy floating physics exploit via global flag.
* **Parameters:** None
* **Returns:** None

### `ResetControllersAndQuitGame()`
* **Description:** Resets controller config and shuts down the game. Only valid in frontend.
* **Parameters:** None
* **Returns:** None

## Events & listeners
**Pushed events:**
- `"healthdelta"` — `{ oldpercent, newpercent, overtime, cause, afflicter, amount }`  
- `"invincibletoggle"` — `{ invincible }`  
- `"stacksizechange"` — `{ stacksize, oldstacksize }`  
- `"startfreezing"` / `"stopfreezing"` — fired on temperature sign change  
- `"startoverheating"` / `"stopoverheating"` — fired on overheat threshold crossing  
- `"temperaturedelta"` — `{ last, new, hasrate }`  
- `"unlockrecipe"` — fired by builder toggle  
- `"techlevelchange"` — fired by `c_freecrafting`  
- `"ms_save"` — triggers master save  
- `"ms_playerdespawnanddelete"` — triggers player cleanup  
- `"phasechange"` — triggers world phase change  
- `"ms_playerdespawnandmigrate"` — triggers player migration  
- `"boatcollision"` — fired by bumper on boat collision  
- `"shadowrift_opened"` — fired when rift spawns in cave world  
- `"lunarrift_opened"` — fired when rift spawns in surface world