---
id: mainfunctions
title: Mainfunctions
description: Defines core global utility functions for game lifecycle, entity management, simulation control, and network operations in Don't Starve Together.
tags: [core, lifecycle, utilities, network, world]
sidebar_position: 10

last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: utility
source_hash: 0032e5f6
system_scope: world
---

# Mainfunctions

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`mainfunctions.lua` serves as the central hub for global game logic operations and simulation control. It exposes the primary API for managing the game lifecycle (initialization, shutdown, pause), entity spawning and removal, save/load processes, and network event handling. Unlike components, these functions are not attached to specific entities but operate on the global simulation context (`TheSim`, `TheWorld`, `TheNet`). Modders typically interact with this module indirectly through console commands or specific high-level APIs like `SpawnPrefab`, though direct calls are generally reserved for engine-level logic.

## Usage example
```lua
-- Spawn a prefab at the console position if it exists
local prefab_name = "chester"
if PrefabExists(prefab_name) then
    SpawnPrefab(prefab_name)
end

-- Pause the simulation with a reason string
SetPause(true, "debug_inspection")

-- Save the current game state manually
SaveGame()
```

## Dependencies & tags

**External dependencies:**
- `screens/redux/popupdialog` -- Required for popup dialog screens
- `screens/worldgenscreen` -- Required for world generation screen
- `screens/healthwarningpopup` -- Required for health warning popup on Rail
- `stats` -- Required for PushMetricsEvent
- `dbui_no_package/debug_nodes` -- Conditionally required for debug UI
- `dbui_no_package/debug_console` -- Conditionally required for debug console
- `scheduler` -- Required for task scheduling
- `gamelogic` -- Required in Start function
- `map/levels` -- Required in UpdateWorldGenOverride for worldgen data
- `savefileupgrades` -- Required for worldgen override upgrades
- `map/customize` -- Required for customize options in UpdateWorldGenOverride
- `screens/redux/pausescreen` -- Required in SetPauseFromCode
- `screens/redux/lobbyscreen` -- Required in ResumeRequestLoadComplete
- `widgets/text` -- Required in DisplayAntiAddictionNotification
- `dlcsupport` -- Required for DLC management
- `nis/` -- Required dynamically in PlayNIS for NIS scripts

**Components used:**
- `walkableplatformmanager` -- Accessed via TheWorld.components.walkableplatformmanager for platform position resolution
- `scenariorunner` -- Added and configured in SpawnSaveRecord for scenario scripts
- `playerspawner` -- Accessed via TheWorld.components.playerspawner:SpawnAtLocation for player spawning
- `walkableplatformplayer` -- TestForPlatform called on player component for platform attachment
- `worldoverseer` -- QuitAll called in DoWorldOverseerShutdown
- `vaultroommanager` -- GetVaultLobbyCenterMarker called for vault lobby position
- `worldstate` -- Dump method accessed for debug string
- `nis` -- Component added and configured in PlayNIS function

**Tags:**
- `player` -- check

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `DEBUG_MODE` | constant (local) | `BRANCH == "dev"` | Gates dev-mode error handling in LoadPrefabFile. |
| `modprefabinitfns` | table (local) | `{}` | Stores prefab post-init functions indexed by prefab name. Populated by RegisterPrefabsImpl, accessed by SpawnPrefabFromSim to apply mod post-init functions. |
| `PREFABDEFINITIONS` | table (local) | `{}` | Stores loaded prefab definitions indexed by prefab name. Populated by LoadPrefabFile after successful prefab registration. |
| `MOD_FRONTEND_PREFABS` | table (local) | `{}` | Tracks frontend mod prefab names for unload/reload operations. Used by ModUnloadFrontEndAssets and ModReloadFrontEndAssets. |
| `MOD_PRELOAD_PREFABS` | table (local) | `{}` | Tracks preload mod prefab names for unload/preload operations. Used by ModUnloadPreloadAssets and ModPreloadAssets. |
| `Scripts` | table (local) | `{}` | Caches loaded script functions by filename. Used by LoadScript to avoid reloading the same script multiple times. |
| `screen_fade_time` | constant (local) | `0.25` | Fade duration for network disconnect dialogs. |
| `BASE64_CHARS` | constant (local) | `"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"` | Character set for world state tag encoding. |
| `BASE64_LOOKUP` | constant (local) | table | Lookup table for base64 character decoding in world state tags. |
| `platforms_supporting_audio_focus` | constant (local) | table | Platforms that support audio focus handling (WIN32_STEAM, WIN32_RAIL, LINUX_STEAM, OSX_STEAM). Controls muting behavior in OnFocusLost/OnFocusGained. |
| `SimTearingDown` | global (boolean) | `false` | Set to true during SimReset; checked before shutdown operations. |
| `SimShuttingDown` | global (boolean) | `false` | Set to true in Shutdown(); indicates sim is quitting. |
| `PerformingRestart` | global (boolean) | `false` | Set to true in DoRestart(); prevents multiple restart sequences. |
| `Paused` | global (boolean) | `false` | Game pause state; read by SetPause, OnServerPauseDirty, IsPaused. |
| `Autopaused` | global (boolean) | `false` | Auto-pause state (e.g., map open); read by OnServerPauseDirty. |
| `GameAutopaused` | global (boolean) | `false` | Game auto-pause state (lobby); read by OnServerPauseDirty. |
| `Settings` | global (table) | `{}` | Stores instance parameters decoded from JSON; used by SetInstanceParameters, IsInFrontEnd. |
| `Purchases` | global (table) | `{}` | Stores purchases decoded from JSON; used by SetPurchases. |
| `exiting_game` | global (boolean) | `false` | Set to true in RequestShutdown(); prevents duplicate shutdown requests. |
| `IsDynamicCloudShutdown` | global (boolean) | `false` | Set to true in OnDynamicCloudSyncDelete(); affects server shutdown behavior. |
| `OnAccountEventListeners` | global (table) | `{}` | Array of listener objects registered via RegisterOnAccountEventListener; iterated in OnAccountEvent. |
| `login_button` | global (local) | `nil` | Reference to login button widget; used by TurnOffLoginButton/TurnOnLoginButton during integrity checks. |
| `LoadingStates` | table (enum) | --- | Loading state enum used by NotifyLoadingState: None=0, Loading=1, Generating=2, DoneGenerating=3, DoneLoading=4. Controls client-side screen transitions during world load/generation. |
| `HashesMessageState` | global (string) | `nil` | State of hash integrity check UI (SHOW_WARNING, SHOWING_POPUP, MISSING_HASHES, MISSING_DATABUNDLES, CHOSE_TO_PLAY_ANYWAY); read by ShowBadHashUI and DataBundleFileHashes. |
| `IsIntegrityChecking` | global (boolean) | `nil` | Set to true in BeginDataBundleFileHashes(); indicates integrity check is running. |
| `WORLDSTATETAGS` | table (world state tag namespace) | --- | Base game world state tag namespace created via CreateWorldStateTag("WS:", ...). Contains declared tags: CELESTIAL_ORB_FOUND, CELESTIAL_PORTAL_BUILT, CRABBY_HERMIT_HAPPY, LUNAR_RIFTS_ACTIVE (Forest); ATRIUM_KEY_FOUND, ARCHIVES_ENERGIZED, SHADOW_RIFTS_ACTIVE (Caves). Used by BuildTagsStringCommon() for server tag encoding. |
| `WORLDSTATE_NAMESPACES` | table | `{}` | Stores all registered world state tag namespace objects. Keys are namespace strings, values are tag namespace objects. Populated by CreateWorldStateTag(), used by tag lookup and encoding functions. |

## Main functions

### `SavePersistentString(name, data, encode, callback)`
* **Description:** Saves a persistent string to disk via TheSim, showing a saving indicator if TheFrontEnd exists. Callback is passed to TheSim and invoked when the operation completes.
* **Parameters:**
  - `name` -- string -- name identifier for the persistent string
  - `data` -- string -- data to save
  - `encode` -- boolean -- whether to encode the data (default false)
  - `callback` -- function -- callback passed to TheSim, invoked when save completes
* **Returns:** None

### `ErasePersistentString(name, callback)`
* **Description:** Erases a persistent string from disk via TheSim, showing a saving indicator if TheFrontEnd exists. Callback is passed to TheSim and invoked when the operation completes.
* **Parameters:**
  - `name` -- string -- name identifier for the persistent string to erase
  - `callback` -- function -- callback passed to TheSim, invoked when erase completes
* **Returns:** None

### `Print(msg_verbosity, ...)`
* **Description:** Conditionally prints messages based on verbosity level comparison.
* **Parameters:**
  - `msg_verbosity` -- number -- verbosity level to compare against VERBOSITY_LEVEL
  - `...` -- variadic -- arguments to print if verbosity check passes
* **Returns:** None

### `SecondsToTimeString(total_seconds)`
* **Description:** Converts seconds to a formatted time string (M:SS or SS format).
* **Parameters:**
  - `total_seconds` -- number -- total seconds to convert to time string
* **Returns:** string -- formatted time string

### `ShouldIgnoreResolve(filename, assettype)`
* **Description:** Determines if an asset should be ignored during prefab resolution based on type and dedicated server status.
* **Parameters:**
  - `filename` -- string -- asset filename to check
  - `assettype` -- string -- type of asset (INV_IMAGE, MINIMAP_IMAGE, SOUNDPACKAGE, SOUND, PKGREF, etc.)
* **Returns:** boolean -- true if asset should be ignored

### `RegisterPrefabsImpl(prefab, resolve_fn)`
* **Description:** Internal function to register a prefab, resolve its assets, and store post-init functions.
* **Parameters:**
  - `prefab` -- table -- prefab definition table
  - `resolve_fn` -- function -- function to resolve asset paths
* **Returns:** None

### `RegisterPrefabs(...)`
* **Description:** Registers multiple prefabs with asset resolution.
* **Parameters:**
  - `...` -- variadic -- prefab definitions to register
* **Returns:** None

### `RegisterSinglePrefab(prefab)`
* **Description:** Registers a single prefab with asset resolution.
* **Parameters:**
  - `prefab` -- table -- single prefab definition to register
* **Returns:** None

### `LoadPrefabFile(filename, async_batch_validation, search_asset_first_path)`
* **Description:** Loads and executes a prefab file, registering all Prefab objects it returns.
* **Parameters:**
  - `filename` -- string -- path to prefab file
  - `async_batch_validation` -- boolean -- whether to use async batch validation
  - `search_asset_first_path` -- string -- alternative asset search path
* **Returns:** table -- array of loaded prefab definitions
* **Error states:** Errors if file cannot be loaded or doesn't return callable chunk

### `ModUnloadFrontEndAssets(modname)`
* **Description:** Unloads frontend assets for a specific mod or all mods.
* **Parameters:**
  - `modname` -- string -- mod name to unload (nil for all)
* **Returns:** None

### `ModReloadFrontEndAssets(assets, modname)`
* **Description:** Reloads frontend assets for a mod, creating a temporary prefab.
* **Parameters:**
  - `assets` -- table -- asset definitions to reload
  - `modname` -- string -- mod name
* **Returns:** None
* **Error states:** Errors if modname does not refer to a valid mod

### `ModUnloadPreloadAssets(modname)`
* **Description:** Unloads preload assets for a specific mod or all mods.
* **Parameters:**
  - `modname` -- string -- mod name to unload (nil for all)
* **Returns:** None

### `ModPreloadAssets(assets, modname)`
* **Description:** Preloads assets for a mod before game starts.
* **Parameters:**
  - `assets` -- table -- asset definitions to preload
  - `modname` -- string -- mod name
* **Returns:** None
* **Error states:** Errors if modname does not refer to a valid mod

### `RegisterAchievements(achievements)`
* **Description:** Registers achievements with TheGameService.
* **Parameters:**
  - `achievements` -- table -- array of achievement definitions
* **Returns:** None

### `LoadAchievements(filename)`
* **Description:** Loads and registers achievements from a file.
* **Parameters:**
  - `filename` -- string -- path to achievements file
* **Returns:** table -- array of loaded achievements
* **Error states:** Errors if file cannot be loaded or doesn't return callable chunk

### `LoadHapticEffects(filename)`
* **Description:** Loads and registers haptic effects from a file with TheHaptics.
* **Parameters:**
  - `filename` -- string -- path to haptic effects file
* **Returns:** table -- array of loaded effects
* **Error states:** Errors if file cannot be loaded or doesn't return callable chunk

### `AwardFrontendAchievement(name)`
* **Description:** Awards an achievement to the frontend player on console platforms.
* **Parameters:**
  - `name` -- string -- achievement name to award
* **Returns:** None

### `AwardPlayerAchievement(name, player)`
* **Description:** Awards an achievement to a specific player on console platforms.
* **Parameters:**
  - `name` -- string -- achievement name to award
  - `player` -- Entity -- player entity to award achievement to
* **Returns:** None

### `NotifyPlayerProgress(name, value, player)`
* **Description:** Notifies TheGameService of player progress on console platforms.
* **Parameters:**
  - `name` -- string -- progress stat name
  - `value` -- number -- progress value
  - `player` -- Entity -- player entity
* **Returns:** None

### `NotifyPlayerPresence(name, level, days, player)`
* **Description:** Notifies TheGameService of player presence on console platforms.
* **Parameters:**
  - `name` -- string -- presence stat name
  - `level` -- number -- presence level
  - `days` -- number -- days played
  - `player` -- Entity -- player entity or nil
* **Returns:** None

### `AwardRadialAchievement(name, pos, radius)`
* **Description:** Awards an achievement to all players within a radius on console platforms.
* **Parameters:**
  - `name` -- string -- achievement name
  - `pos` -- Vector3 -- center position
  - `radius` -- number -- search radius
* **Returns:** None

### `SpawnPrefabFromSim(name)`
* **Description:** Spawns a prefab directly from TheSim, applying mod post-init functions and pushing entity_spawned event.
* **Parameters:**
  - `name` -- string -- prefab name to spawn
* **Returns:** number -- entity GUID or -1 on failure
* **Error states:** None

### `PrefabExists(name)`
* **Description:** Checks if a prefab exists in the Prefabs table.
* **Parameters:**
  - `name` -- string -- prefab name to check
* **Returns:** boolean -- true if prefab exists

### `SpawnPrefab(name, skin, skin_id, creator, skin_custom)`
* **Description:** Spawns a prefab via TheSim and returns the entity instance.
* **Parameters:**
  - `name` -- string -- prefab name
  - `skin` -- string -- skin identifier (optional)
  - `skin_id` -- string -- skin ID (optional)
  - `creator` -- Entity -- creator entity (optional)
  - `skin_custom` -- table -- custom skin data (optional)
* **Returns:** Entity -- spawned entity instance

### `ReplacePrefab(original_inst, name, skin, skin_id, creator)`
* **Description:** Replaces an entity with a new prefab at the same position.
* **Parameters:**
  - `original_inst` -- Entity -- entity to replace
  - `name` -- string -- new prefab name
  - `skin` -- string -- skin identifier (optional)
  - `skin_id` -- string -- skin ID (optional)
  - `creator` -- Entity -- creator entity (optional)
* **Returns:** Entity -- replacement entity instance

### `ResolveSaveRecordPosition(data)` (local)
* **Description:** (Local function) Resolves save record position with walkable platform support. Returns platform-relative coordinates if puid is set and platform exists, otherwise falls back to absolute x,y,z.
* **Parameters:**
  - `data` -- table -- save record data containing position (x,y,z) and optional platform info (puid, rx, ry, rz)
* **Returns:** number, number, number, Entity -- x, y, z coordinates and platform entity (or nil if no platform)

### `SpawnSaveRecord(saved, newents)`
* **Description:** Spawns an entity from save record data, restoring position, skins, scenario, and persist data.
* **Parameters:**
  - `saved` -- table -- save record with prefab, position, and data
  - `newents` -- table -- table to track new entities (optional)
* **Returns:** Entity -- spawned entity or nil on failure
* **Error states:** None

### `CreateEntity(name)`
* **Description:** Creates a new entity via TheSim and registers it in Ents table.
* **Parameters:**
  - `name` -- string -- optional entity name
* **Returns:** Entity -- created entity script

### `OnRemoveEntity(entityguid)`
* **Description:** Cleanup callback when entity is removed, handling brain, stategraph, tasks, and update lists.
* **Parameters:**
  - `entityguid` -- number -- GUID of entity being removed
* **Returns:** None

### `RemoveEntity(guid)`
* **Description:** Removes an entity, respecting delayclientdespawn flag for seamless player swapping.
* **Parameters:**
  - `guid` -- number -- entity GUID to remove
* **Returns:** None

### `PushEntityEvent(guid, event, data)`
* **Description:** Pushes an event to an entity by GUID.
* **Parameters:**
  - `guid` -- number -- entity GUID
  - `event` -- string -- event name
  - `data` -- table -- event data
* **Returns:** None

### `GetEntityDisplayName(guid)`
* **Description:** Gets the display name of an entity by GUID.
* **Parameters:**
  - `guid` -- number -- entity GUID
* **Returns:** string -- display name or empty string

### `GetTickTime()`
* **Description:** Gets the tick time from TheSim.
* **Parameters:** None
* **Returns:** number -- tick time in seconds

### `GetTime()`
* **Description:** Gets the current game time in seconds.
* **Parameters:** None
* **Returns:** number -- current time in seconds

### `GetStaticTime()`
* **Description:** Gets the static tick time in seconds.
* **Parameters:** None
* **Returns:** number -- static time in seconds

### `GetTick()`
* **Description:** Gets the current tick count.
* **Parameters:** None
* **Returns:** number -- current tick

### `GetStaticTick()`
* **Description:** Gets the static tick count.
* **Parameters:** None
* **Returns:** number -- static tick

### `GetTimeReal()`
* **Description:** Gets the real time in milliseconds from TheSim.
* **Parameters:** None
* **Returns:** number -- real time in ms

### `GetTimeRealSeconds()`
* **Description:** Gets the real time in seconds.
* **Parameters:** None
* **Returns:** number -- real time in seconds

### `LoadScript(filename)`
* **Description:** Loads and caches a script file from scripts/ directory.
* **Parameters:**
  - `filename` -- string -- script filename in scripts/ directory
* **Returns:** function -- loaded script function
* **Error states:** Crashes via assert if script file does not return a function

### `RunScript(filename)`
* **Description:** Loads and executes a script file.
* **Parameters:**
  - `filename` -- string -- script filename to run
* **Returns:** None

### `GetEntityString(guid)`
* **Description:** Gets the debug string for an entity by GUID.
* **Parameters:**
  - `guid` -- number -- entity GUID
* **Returns:** string -- debug string or empty string

### `GetExtendedDebugString()`
* **Description:** Gets extended debug info including brain, sound debug, worldstate, or current screen.
* **Parameters:** None
* **Returns:** string -- debug string

### `GetDebugString()`
* **Description:** Gets the current debug string including scheduler and debug entity info.
* **Parameters:** None
* **Returns:** string -- debug string

### `GetDebugEntity()`
* **Description:** Gets the current debug entity.
* **Parameters:** None
* **Returns:** Entity -- debug entity or nil

### `SetDebugEntity(inst)`
* **Description:** Sets or clears the debug entity, updating selection state.
* **Parameters:**
  - `inst` -- Entity -- entity to set as debug target or nil to clear
* **Returns:** None

### `GetDebugTable()`
* **Description:** Gets the current debug table.
* **Parameters:** None
* **Returns:** table -- debug table or nil

### `SetDebugTable(tbl)`
* **Description:** Sets the debug table.
* **Parameters:**
  - `tbl` -- table -- table to set as debug target
* **Returns:** None

### `OnEntitySleep(guid)`
* **Description:** Callback when entity goes to sleep, pushing entitysleep event and hibernating brain, stategraph, emitter, and components.
* **Parameters:**
  - `guid` -- number -- entity GUID
* **Returns:** None

### `OnEntityWake(guid)`
* **Description:** Callback when entity wakes up, pushing entitywake event and waking brain, stategraph, emitter, and components.
* **Parameters:**
  - `guid` -- number -- entity GUID
* **Returns:** None

### `OnPhysicsWake(guid)`
* **Description:** Callback when entity physics wakes, calling OnPhysicsWake on entity and components.
* **Parameters:**
  - `guid` -- number -- entity GUID
* **Returns:** None

### `OnPhysicsSleep(guid)`
* **Description:** Callback when entity physics sleeps, calling OnPhysicsSleep on entity and components.
* **Parameters:**
  - `guid` -- number -- entity GUID
* **Returns:** None

### `OnServerPauseDirty(pause, autopause, gameautopause, source)`
* **Description:** Handles server pause state changes, updating mixer, HUD, frontend, and pushing serverpauseddirty event.
* **Parameters:**
  - `pause` -- boolean -- whether server is paused
  - `autopause` -- boolean -- whether auto-paused (e.g., map open)
  - `gameautopause` -- boolean -- whether game auto-paused (lobby state)
  - `source` -- string -- source of pause request
* **Returns:** None

### `ReplicateEntity(guid)`
* **Description:** Replicates an entity, temporarily swapping ThePlayer for seamless swap targets.
* **Parameters:**
  - `guid` -- number -- entity GUID
* **Returns:** None

### `DisableLoadingProtection(guid)`
* **Description:** Disables loading protection for a player entity.
* **Parameters:**
  - `guid` -- number -- player entity GUID
* **Returns:** None

### `PlayNIS(nisname, lines)`
* **Description:** Creates and plays a Non-Interactive Sequence (cinematic) with specified script and dialogue.
* **Parameters:**
  - `nisname` -- string -- name of NIS script in nis/ directory
  - `lines` -- table -- dialogue lines for the NIS
* **Returns:** Entity -- NIS entity instance

### `IsPaused()`
* **Description:** Checks if the game is paused.
* **Parameters:** None
* **Returns:** boolean -- true if paused

### `IsSimPaused()`
* **Description:** Checks if the sim is paused.
* **Parameters:** None
* **Returns:** boolean -- true if sim paused

### `SetDefaultTimeScale(scale)`
* **Description:** Sets the default time scale, applying immediately if not paused.
* **Parameters:**
  - `scale` -- number -- time scale value
* **Returns:** None

### `SetSimPause(val)`
* **Description:** Sets sim pause state (V2C: unused in DST).
* **Parameters:**
  - `val` -- boolean -- pause value
* **Returns:** None

### `SetServerPaused(pause)`
* **Description:** Sets server pause state via TheNet, ignoring if ImGui window is focused.
* **Parameters:**
  - `pause` -- boolean -- pause state (nil toggles)
* **Returns:** None

### `SetAutopaused(autopause)`
* **Description:** Increments or decrements autopause counter and triggers DoAutopause.
* **Parameters:**
  - `autopause` -- boolean -- whether to increment or decrement autopause count
* **Returns:** None
* **Error states:** Asserts if autopausecount goes out of valid range in DEBUG_MODE

### `SetCraftingAutopaused(autopause)`
* **Description:** Sets crafting autopause flag and triggers DoAutopause.
* **Parameters:**
  - `autopause` -- boolean -- crafting autopause state
* **Returns:** None

### `SetConsoleAutopaused(autopause)`
* **Description:** Increments or decrements console autopause counter and triggers DoAutopause.
* **Parameters:**
  - `autopause` -- boolean -- whether to increment or decrement console autopause count
* **Returns:** None

### `DoAutopause()`
* **Description:** Evaluates autopause conditions and sets TheNet autopaused state based on profile settings.
* **Parameters:** None
* **Returns:** None

### `OnSimPaused()`
* **Description:** Callback when sim pauses (V2C: should not do anything as sim is paused).
* **Parameters:** None
* **Returns:** None

### `OnSimUnpaused()`
* **Description:** Callback when sim unpauses, pushing ms_simunpaused event to TheWorld.
* **Parameters:** None
* **Returns:** None

### `SetPause(val, reason)`
* **Description:** Sets game pause state, updating mixer and calling PlayerPauseCheck callback.
* **Parameters:**
  - `val` -- boolean -- pause state
  - `reason` -- string -- reason for pause
* **Returns:** None

### `SetInstanceParameters(settings)`
* **Description:** Decodes and stores instance parameters from JSON string.
* **Parameters:**
  - `settings` -- string -- JSON-encoded settings string
* **Returns:** None

### `SetPurchases(purchases)`
* **Description:** Decodes and stores purchases from JSON string.
* **Parameters:**
  - `purchases` -- string -- JSON-encoded purchases string
* **Returns:** None

### `UpdateWorldGenOverride(overrides, cb, slot, shard)` (local)
* **Description:** (Local function) Updates worldgen override file, merging with existing saves and validating options against worldgen/settings presets.
* **Parameters:**
  - `overrides` -- table -- worldgen override options
  - `cb` -- function -- callback after update
  - `slot` -- string -- cluster slot (optional)
  - `shard` -- string -- shard name (optional)
* **Returns:** None
* **Error states:** None

### `SaveGame(isshutdown, cb)`
* **Description:** Saves the game including entities, map, world network, shard network, and player sessions. Disabled for clients.
* **Parameters:**
  - `isshutdown` -- boolean -- whether this is a shutdown save
  - `cb` -- function -- callback after save completes
* **Returns:** None
* **Error states:** Crashes via assert if save.map, save.map.prefab, save.map.tiles, save.map.width, save.map.height, or save.mods are missing from savedata

### `ProcessJsonMessage(message)`
* **Description:** Processes JSON commands for sim control including toggle_pause, upsell_closed, quit, and player ID setting.
* **Parameters:**
  - `message` -- string -- JSON-encoded command message
* **Returns:** None

### `LoadFonts()`
* **Description:** Loads all fonts from FONTS table with fallbacks and advance adjustments.
* **Parameters:** None
* **Returns:** None

### `UnloadFonts()`
* **Description:** Unloads all fonts from FONTS table.
* **Parameters:** None
* **Returns:** None

### `Start()`
* **Description:** Initializes the game including sound debug, FrontEnd, gamelogic, config permissions, custom commands, and controllers.
* **Parameters:** None
* **Returns:** None
* **Error states:** Calls known_assert() for config directory write/read permissions, log file validity, and disk space — triggers error UI on failure

### `GlobalInit()`
* **Description:** Called once when sim is first created, loading global prefabs, fonts, sounds, and sending hardware stats.
* **Parameters:** None
* **Returns:** None

### `DoLoadingPortal(cb)`
* **Description:** Handles transition to loading screen, pushing metrics and fading out.
* **Parameters:**
  - `cb` -- function -- callback after fade completes
* **Returns:** None

### `LoadMapFile(map_name)`
* **Description:** Loads a map file, disabling DLC and starting next instance with LOAD_FILE action.
* **Parameters:**
  - `map_name` -- string -- name of map file to load
* **Returns:** None

### `JapaneseOnPS4()`
* **Description:** Checks if running on PS4 in Japanese region.
* **Parameters:** None
* **Returns:** boolean -- true if PS4 Japanese region

### `StartNextInstance(in_params)`
* **Description:** Starts the next game instance, collecting match results and calling SimReset.
* **Parameters:**
  - `in_params` -- table -- instance parameters (optional)
* **Returns:** None

### `ForceAssetReset()`
* **Description:** Forces asset reset by setting Settings.current_asset_set to FORCERESET.
* **Parameters:** None
* **Returns:** None

### `SimReset(instanceparameters)`
* **Description:** Resets the sim, encoding instance parameters and calling TheSim:Reset().
* **Parameters:**
  - `instanceparameters` -- table -- instance parameters (optional)
* **Returns:** None

### `RequestShutdown()`
* **Description:** Requests game shutdown, showing quit dialog and stopping dedicated servers if hosting.
* **Parameters:** None
* **Returns:** None

### `DoWorldOverseerShutdown()`
* **Description:** Calls QuitAll on worldoverseer component if on master shard.
* **Parameters:** None
* **Returns:** None

### `Shutdown()`
* **Description:** Performs shutdown sequence including world overseer cleanup and TheSim:Quit().
* **Parameters:** None
* **Returns:** None

### `DisplayError(error)`
* **Description:** Displays error screen with mod names and appropriate buttons based on error type and platform.
* **Parameters:**
  - `error` -- string -- error message to display
* **Returns:** None

### `SetPauseFromCode(pause)`
* **Description:** Sets pause from code, pushing pause screen if in gameplay.
* **Parameters:**
  - `pause` -- boolean -- whether to pause
* **Returns:** None

### `InGamePlay()`
* **Description:** Checks if currently in gameplay state.
* **Parameters:** None
* **Returns:** boolean -- value of inGamePlay

### `IsMigrating()`
* **Description:** Checks if currently migrating (no active screen or only ConnectingToGamePopup).
* **Parameters:** None
* **Returns:** boolean -- true if migrating

### `DoRestart(save)`
* **Description:** Restarts the game, optionally saving first and showing loading screen.
* **Parameters:**
  - `save` -- boolean -- whether to save before restart
* **Returns:** None

### `OnDynamicCloudSyncReload()`
* **Description:** Handles dynamic cloud sync reload by sending world rollback request.
* **Parameters:** None
* **Returns:** None

### `OnDynamicCloudSyncDelete()`
* **Description:** Handles dynamic cloud sync delete by setting flag and restarting.
* **Parameters:** None
* **Returns:** None

### `OnPlayerLeave(player_guid, expected)`
* **Description:** Handles player leave event on master sim, pushing ms_playerdisconnected and ms_playerdespawn events.
* **Parameters:**
  - `player_guid` -- number -- GUID of leaving player
  - `expected` -- boolean -- whether departure was expected
* **Returns:** None

### `OnPushPopupDialog(message)`
* **Description:** Shows a popup dialog with localized title and body from STRINGS.
* **Parameters:**
  - `message` -- string -- message key for popup dialog
* **Returns:** None

### `OnDemoTimeout()`
* **Description:** Handles demo timeout by stopping servers, serializing session, and restarting.
* **Parameters:** None
* **Returns:** None

### `OnNetworkDisconnect(message, should_reset, force_immediate_reset, details, miscdata)`
* **Description:** Handles network disconnect with multiple code paths:
  - `force_immediate_reset = true` — immediately calls DoRestart(true) and returns.
  - `IsMigrating()` check — skips server stop if currently migrating between shards.
  - Screen name checks — special handling for ConnectingToGamePopup (pops screen), QuickJoinScreen (cancels join, tries next server), HostCloudServerPopup (cancels join, shows error).
  - Fade level check — if already fading, queues popup dialog to appear after fade-in completes; otherwise shows popup immediately.
  Session serialization occurs before reset decision. Returns true.
* **Parameters:**
  - `message` -- string -- disconnect reason code
  - `should_reset` -- boolean -- whether to reset after disconnect
  - `force_immediate_reset` -- boolean -- whether to force immediate reset
  - `details` -- table -- additional disconnect details
  - `miscdata` -- any -- miscellaneous data
* **Returns:** boolean -- true

### `RegisterOnAccountEventListener(listener)`
* **Description:** Registers a listener for account events.
* **Parameters:**
  - `listener` -- table -- listener object with OnAccountEvent method
* **Returns:** None

### `RemoveOnAccountEventListener(listener_to_remove)`
* **Description:** Removes a listener from account event listeners.
* **Parameters:**
  - `listener_to_remove` -- table -- listener object to remove
* **Returns:** None

### `OnAccountEvent(success, event_code, custom_message)`
* **Description:** Dispatches account event to all registered listeners.
* **Parameters:**
  - `success` -- boolean -- whether account event succeeded
  - `event_code` -- string -- event code
  - `custom_message` -- string -- custom message
* **Returns:** None

### `TintBackground(bg)`
* **Description:** Sets background tint color (currently uses BGCOLOURS.FULL).
* **Parameters:**
  - `bg` -- widget -- background widget to tint
* **Returns:** None

### `OnFocusLost()`
* **Description:** Handles focus lost event, pausing on Android and muting audio on supported platforms.
* **Parameters:** None
* **Returns:** None

### `OnFocusGained()`
* **Description:** Handles focus gained event, unpausing on Android and restoring audio on supported platforms.
* **Parameters:** None
* **Returns:** None

### `ResumeRequestLoadComplete(success)`
* **Description:** Handles resume request load completion, showing lobby screen on failure.
* **Parameters:**
  - `success` -- boolean -- whether resume load succeeded
* **Returns:** None

### `ParseUserSessionData(data)`
* **Description:** Parses user session data from save file string.
* **Parameters:**
  - `data` -- string -- raw session data string
* **Returns:** table, string -- playerdata table and prefab name, or nil and empty string on failure

### `ResumeExistingUserSession(data, guid)`
* **Description:** Resumes existing user session on server, spawning player at last known location.
* **Parameters:**
  - `data` -- table -- session data table
  - `guid` -- number -- player entity GUID
* **Returns:** number -- player classified entity or nil

### `RestoreSnapshotUserSession(sessionid, userid)`
* **Description:** Restores user session from snapshot, spawning player with persist data.
* **Parameters:**
  - `sessionid` -- string -- snapshot session ID
  - `userid` -- string -- user ID
* **Returns:** number -- player classified entity or nil

### `ExecuteConsoleCommand(fnstr, guid, x, z)`
* **Description:** Executes arbitrary Lua console command with optional player and position context.
* **Parameters:**
  - `fnstr` -- string -- Lua code to execute
  - `guid` -- number -- entity GUID to set as ThePlayer (optional)
  - `x` -- number -- x position override (optional)
  - `z` -- number -- z position override (optional)
* **Returns:** None

### `NotifyLoadingState(loading_state, match_results)`
* **Description:** Notifies loading state with client/server-specific behavior:
  - **Client:** Handles screen transitions based on `loading_state` enum:
    - `LoadingStates.Loading` — shows loading screen, fades out (or pops screen if hide_worldgen_loading_screen property set).
    - `LoadingStates.Generating` — shows WorldGenScreen after 0.15s delay (unless hide_worldgen_loading_screen set).
    - `LoadingStates.DoneGenerating` — pops current screen.
  - **Server:** Notifies TheNet with encoded match_results.
  Behavior varies by `hide_worldgen_loading_screen` game mode property.
* **Parameters:**
  - `loading_state` -- number -- loading state from LoadingStates enum
  - `match_results` -- table -- match results data
* **Returns:** None

### `CreateWorldStateTag(namespace, atlas)`
* **Description:** Creates a world state tag namespace object with tag declaration, encoding, and sync capabilities.
* **Parameters:**
  - `namespace` -- string -- namespace with colon suffix (e.g., 'WS:')
  - `atlas` -- string -- atlas path for tag icons
* **Returns:** table -- world state tag object or nil if invalid namespace
* **Error states:** None

### `GetWorldStateTagObjectFromNamespace(namespace)`
* **Description:** Gets world state tag object by namespace.
* **Parameters:**
  - `namespace` -- string -- namespace to look up
* **Returns:** table -- tag object or nil

### `GetWorldStateTagObjectFromTag(tag)`
* **Description:** Gets world state tag object by searching all namespaces for matching encoded tag.
* **Parameters:**
  - `tag` -- string -- encoded tag string
* **Returns:** table -- tag object or nil

### `ForEachWorldStateTagObject(fn, ...)`
* **Description:** Iterates over all world state tag objects, calling fn for each.
* **Parameters:**
  - `fn` -- function -- function to call for each tag object
  - `...` -- variadic -- arguments to pass to fn
* **Returns:** None

### `BuildTagsStringCommon(tagsTable)`
* **Description:** Builds server tags string including vote, shard, mod, beta, language, and world state tags.
* **Parameters:**
  - `tagsTable` -- table -- table to build tags into
* **Returns:** string -- concatenated tags string

### `SaveAndShutdown()`
* **Description:** Saves game and shuts down, despawning all players on master sim. Returns early (nil) if TheWorld is nil.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `IsInFrontEnd()`
* **Description:** Checks if currently in frontend (no reset action or LOAD_FRONTEND).
* **Parameters:** None
* **Returns:** boolean -- true if in frontend

### `CreateRepeatedSoundVolumeReduction(repeat_time, lowered_volume_percent)`
* **Description:** Creates a function that reduces sound volume if called within repeat_time window.
* **Parameters:**
  - `repeat_time` -- number -- time window in seconds
  - `lowered_volume_percent` -- number -- reduced volume percentage
* **Returns:** function -- volume reduction function

### `DisplayAntiAddictionNotification(notification)`
* **Description:** Displays anti-addiction notification text for 10.5 seconds.
* **Parameters:**
  - `notification` -- string -- notification key from STRINGS.ANTIADDICTION
* **Returns:** None

### `ShowBadHashUI()`
* **Description:** Shows bad hashes error UI with options to play anyway, view instructions, or quit. Returns early (nil) if HashesMessageState is not SHOW_WARNING.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `BeginDataBundleFileHashes()`
* **Description:** Begins data bundle file hash integrity check, disabling login button.
* **Parameters:** None
* **Returns:** None

### `DataBundleFileHashes(calculatedhashes)`
* **Description:** Validates data bundle file hashes against hashes.txt, setting HashesMessageState on mismatch.
* **Parameters:**
  - `calculatedhashes` -- table -- calculated file hashes
* **Returns:** None

## Events & listeners

**Pushes:**
- `entity_spawned` — Pushed by SpawnPrefabFromSim when entity spawns
- `entitysleep` — Pushed by OnEntitySleep when entity goes to sleep
- `entitywake` — Pushed by OnEntityWake when entity wakes up
- `serverpauseddirty` — Pushed by OnServerPauseDirty with pause state data
- `ms_simunpaused` — Pushed by OnSimUnpaused when sim unpauses
- `ms_playerdisconnected` — Pushed by OnPlayerLeave when player disconnects
- `ms_playerdespawn` — Pushed by OnPlayerLeave when player despawns
- `entercharacterselect` — Pushed by ResumeRequestLoadComplete on failure
- `quit` — Pushed by ProcessJsonMessage on quit command