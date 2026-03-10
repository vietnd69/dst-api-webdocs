---
id: mainfunctions
title: Mainfunctions
description: Central game logic component managing initialization, shutdown, loading, unloading, spawning, persistence, and state transitions for prefabs and player sessions in Don't Starve Together.
tags: [init, shutdown, loading, persistence, spawning]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: cabb37c1
system_scope: world
---

# Mainfunctions

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`mainfunctions.lua` serves as the foundational game logic module in Don't Starve Together. It handles high-level lifecycle management including startup, shutdown, world loading/unloading, player session persistence and restoration, prefab registration and spawning, non-interactive sequence (NIS) playback, pause/simulation state control, and UI-driven state transitions. It coordinates across entities, world state, components, and frontend/backend systems—acting as the orchestrator for core simulation and session behavior.

## Usage example
```lua
-- Initialize global systems and start game frontend
GlobalInit()
Start()

-- Load and spawn a player from save record
local saved = { x = 0, y = 0, z = 0, puid = 123, rx = 0, ry = 0, rz = 0 }
local newents = {}
local player = SpawnSaveRecord(saved, newents)

-- Set and apply time scale
SetDefaultTimeScale(1.0)

-- Save game before shutdown
SaveGame(true, function() Shutdown() end)
```

## Dependencies & tags
**Components used:**
- `components/nis.lua` (`Play`, `SetCancel`, `SetInit`, `SetName`, `SetScript`)
- `components/playerspawner.lua` (`SpawnAtLocation`)
- `components/scenariorunner.lua` (`SetScript`)
- `components/vaultroommanager.lua` (`GetVaultLobbyCenterMarker`)
- `components/walkableplatformplayer.lua` (`TestForPlatform`)
- `components/worldoverseer.lua` (`QuitAll`)
- `components/worldstate.lua` (`Dump`)
- `dbui_no_package/debug_console.lua`, `dbui_no_package/debug_nodes.lua`
- `debugsounds.lua`
- `dlcsupport.lua`
- `gamelogic.lua`
- `map/customize.lua`, `map/levels.lua`
- `savefileupgrades.lua`
- `stats.lua`

**Tags:**  
None explicitly declared in the chunks.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| (none) | — | — | No direct properties exposed; this module contains only functions and uses globals like `Settings`, `Purchases`, and `TheSim`. |

## Main functions
### `SavePersistentString(name, data, encode, callback)`
* **Description:** Saves a persistent string value, optionally showing a saving indicator in the frontend if `TheFrontEnd` exists.  
* **Parameters:**  
  - `name`: string — key for the persistent storage  
  - `data`: string — value to persist  
  - `encode`: boolean (optional, default `false`) — whether to encode the data  
  - `callback`: function (optional) — called after persistence completes  
* **Returns:** `nil`

### `ErasePersistentString(name, callback)`
* **Description:** Erases a persistent string entry, optionally showing a saving indicator in the frontend.  
* **Parameters:**  
  - `name`: string — key of the persistent entry to erase  
  - `callback`: function (optional) — called after erasure completes  
* **Returns:** `nil`

### `Print(msg_verbosity, ...)`
* **Description:** Conditionally prints messages to console based on `VERBOSITY_LEVEL`.  
* **Parameters:**  
  - `msg_verbosity`: number — minimum verbosity level to print  
  - `...`: variadic arguments to pass to `print`  
* **Returns:** `nil`

### `SecondsToTimeString(total_seconds)`
* **Description:** Converts a number of seconds to a formatted time string: `M:SS`, `SS`, or `S`.  
* **Parameters:**  
  - `total_seconds`: number — time in seconds  
* **Returns:** string

### `ShouldIgnoreResolve(filename, assettype)`
* **Description:** Determines whether a given asset should be skipped during path resolution (e.g., sounds on dedicated servers, certain image types).  
* **Parameters:**  
  - `filename`: string  
  - `assettype`: string — asset type enum (e.g., `"SOUNDPACKAGE"`, `"INV_IMAGE"`)  
* **Returns:** boolean — `true` if asset should be ignored, `false` otherwise

### `RegisterPrefabsImpl(prefab, resolve_fn)`
* **Description:** Registers a single prefab: resolves its assets using `resolve_fn`, registers post-init functions, and stores the prefab in global tables.  
* **Parameters:**  
  - `prefab`: table — prefab definition  
  - `resolve_fn`: function — function to resolve asset paths  
* **Returns:** `nil`

### `RegisterPrefabs(...)`
* **Description:** Registers multiple prefabs using `RegisterPrefabsImpl` and asset resolution.  
* **Parameters:**  
  - `...`: variadic list of prefab tables  
* **Returns:** `nil`

### `LoadPrefabFile(filename, async_batch_validation, search_asset_first_path)`
* **Description:** Loads a Lua file returning prefab definitions, validates, resolves assets, and registers them.  
* **Parameters:**  
  - `filename`: string — path to prefab file  
  - `async_batch_validation`: boolean (optional) — if true, uses `VerifyPrefabAssetExistsAsync` for resolution  
  - `search_asset_first_path`: boolean (optional) — overrides asset resolution behavior  
* **Returns:** table — list of successfully loaded prefab instances

### `ModUnloadFrontEndAssets(modname)`
* **Description:** Unloads and unregisters prefabs associated with frontend assets for a mod (or all mods if `modname` is `nil`).  
* **Parameters:**  
  - `modname`: string (optional) — mod identifier  
* **Returns:** `nil`

### `ModReloadFrontEndAssets(assets, modname)`
* **Description:** Reloads frontend assets for a mod: unloads existing, resolves paths, creates and registers a temporary prefab.  
* **Parameters:**  
  - `assets`: table — list of asset definitions  
  - `modname`: string — mod identifier (validated via `KnownModIndex`)  
* **Returns:** `nil`

### `ModUnloadPreloadAssets(modname)`
* **Description:** Unloads and unregisters prefabs associated with preloaded assets for a mod (or all mods).  
* **Parameters:**  
  - `modname`: string (optional)  
* **Returns:** `nil`

### `ModPreloadAssets(assets, modname)`
* **Description:** Reloads preloaded assets for a mod: unloads existing, resolves paths, creates and registers a temporary prefab, loads prefabs into sim.  
* **Parameters:**  
  - `assets`: table  
  - `modname`: string  
* **Returns:** `nil`

### `LoadAchievements(filename)`
* **Description:** Loads and registers achievements from a Lua file.  
* **Parameters:**  
  - `filename`: string  
* **Returns:** table — return values from the loaded file

### `LoadHapticEffects(filename)`
* **Description:** Loads haptic effects from a Lua file and registers them with `TheHaptics`.  
* **Parameters:**  
  - `filename`: string  
* **Returns:** table — return values from the loaded file

### `AwardFrontendAchievement(name)`
* **Description:** Awards an achievement in the frontend only (console-specific).  
* **Parameters:**  
  - `name`: string  
* **Returns:** `nil`

### `AwardPlayerAchievement(name, player)`
* **Description:** Awards an achievement for a specific player (console-specific).  
* **Parameters:**  
  - `name`: string  
  - `player`: entity (optional) — must have `"player"` tag  
* **Returns:** `nil`

### `NotifyPlayerProgress(name, value, player)`
* **Description:** Notifies progress toward an achievement for a player (console-specific).  
* **Parameters:**  
  - `name`: string  
  - `value`: number  
  - `player`: entity  
* **Returns:** `nil`

### `NotifyPlayerPresence(name, level, days, player)`
* **Description:** Notifies presence data (e.g., level, days survived) for a player (console-specific).  
* **Parameters:**  
  - `name`: string  
  - `level`: number  
  - `days`: number  
  - `player`: entity  
* **Returns:** `nil`

### `AwardRadialAchievement(name, pos, radius)`
* **Description:** Awards an achievement to all players within a radius of a position (console-specific).  
* **Parameters:**  
  - `name`: string  
  - `pos`: vector-like — `{x, y, z}`  
  - `radius`: number  
* **Returns:** `nil`

### `SpawnPrefabFromSim(name)`
* **Description:** Instantiates a prefab on the sim thread only (does not replicate to clients). Returns GUID or `-1` on error.  
* **Parameters:**  
  - `name`: string — prefab name  
* **Returns:** number (GUID) or `-1`

### `PrefabExists(name)`
* **Description:** Checks whether a prefab has been registered.  
* **Parameters:**  
  - `name`: string  
* **Returns:** boolean

### `SpawnPrefab(name, skin, skin_id, creator, skin_custom)`
* **Description:** Spawns a prefab with optional skin and metadata; returns instance reference via `Ents[guid]`.  
* **Parameters:**  
  - `name`: string  
  - `skin`: string/number (optional) — skin ID  
  - `skin_id`: string/number (optional)  
  - `creator`: entity (optional)  
  - `skin_custom`: any (optional)  
* **Returns:** entity — `Ents[guid]` or `nil`

### `ReplacePrefab(original_inst, name, skin, skin_id, creator)`
* **Description:** Destroys `original_inst`, spawns `name` at same position, returns new instance.  
* **Parameters:**  
  - `original_inst`: entity  
  - `name`, `skin`, `skin_id`, `creator`: same as `SpawnPrefab`  
* **Returns:** entity

### `ResolveSaveRecordPosition(data)`
* **Description:** Resolves save-record world position, preferring platform-relative coordinates if `data.puid` exists.  
* **Parameters:**  
  - `data`: table — expected to contain `x`, `y`, `z`, `puid`, `rx`, `ry`, `rz`  
* **Returns:** number, number, number, platform (if applicable)

### `SpawnSaveRecord(saved, newents)`
* **Description:** Spawns an entity from a save record, attaches scenario component if needed, sets position, and registers in `newents`.  
* **Parameters:**  
  - `saved`: table — save record  
  - `newents`: table — output mapping (by ID or entity key)  
* **Returns:** entity or `nil`

### `CreateEntity(name)`
* **Description:** Creates a new low-level entity, attaches script wrapper, adds to `Ents`.  
* **Parameters:**  
  - `name`: string (optional)  
* **Returns:** entity script wrapper

### `OnRemoveEntity(entityguid)`
* **Description:** Cleanup handler when entity is removed: cleans up debug state, brains, state graphs, schedulers, and entity tracking tables.  
* **Parameters:**  
  - `entityguid`: number  
* **Returns:** `nil`

### `RemoveEntity(guid)`
* **Description:** Removes an entity immediately, unless `delayclientdespawn` is set.  
* **Parameters:**  
  - `guid`: number  
* **Returns:** `nil`

### `PushEntityEvent(guid, event, data)`
* **Description:** Pushes an event to an entity if it exists.  
* **Parameters:**  
  - `guid`: number  
  - `event`: string  
  - `data`: any  
* **Returns:** `nil`

### `GetEntityDisplayName(guid)`
* **Description:** Returns the display name of an entity or empty string if not found.  
* **Parameters:**  
  - `guid`: number  
* **Returns:** string

### `GetTickTime()`, `GetTime()`, `GetStaticTime()`, `GetTick()`, `GetStaticTick()`, `GetTimeReal()`, `GetTimeRealSeconds()`
* **Description:** Returns simulation-related timing data (tick duration, current sim time, real time, etc.).  
* **Parameters:** none  
* **Returns:** number

### `LoadScript(filename)`
* **Description:** Loads and caches a script from `scripts/` by filename.  
* **Parameters:**  
  - `filename`: string  
* **Returns:** value — return value of the loaded script’s top-level call

### `RunScript(filename)`
* **Description:** Loads and runs a script if it returns a callable.  
* **Parameters:**  
  - `filename`: string  
* **Returns:** `nil`

### `GetEntityString(guid)`
* **Description:** Returns debug string of an entity.  
* **Parameters:**  
  - `guid`: number  
* **Returns:** string

### `GetExtendedDebugString()`, `GetDebugString()`, `GetDebugEntity()`, `SetDebugEntity(inst)`, `GetDebugTable()`, `SetDebugTable(tbl)`
* **Description:** Debug utility functions for inspecting or setting debugging context (entity, table, strings).  
* **Parameters:** varies  
* **Returns:** varies

### `OnEntitySleep(guid)`, `OnEntityWake(guid)`
* **Description:** Handles entity going to sleep or waking: pushes events, manages brain/SG/emitter state, and calls per-component hooks.  
* **Parameters:**  
  - `guid`: number  
* **Returns:** `nil`

### `OnPhysicsWake(guid)`, `OnPhysicsSleep(guid)`
* **Description:** Calls per-component `OnPhysicsWake` or `OnPhysicsSleep` hooks for entity.  
* **Parameters:**  
  - `guid`: number  
* **Returns:** `nil`

### `OnServerPauseDirty(pause, autopause, gameautopause, source)`
* **Description:** Syncs pause state across server and clients, updates UI, manages mixer mix and `"serverpauseddirty"` event.  
* **Parameters:**  
  - `pause`: boolean  
  - `autopause`: boolean  
  - `gameautopause`: boolean  
  - `source`: string  
* **Returns:** `nil`

### `ReplicateEntity(guid)`
* **Description:** Forces replication of an entity to clients; handles seamless swap targets specially.  
* **Parameters:**  
  - `guid`: number  
* **Returns:** `nil`

### `DisableLoadingProtection(guid)`
* **Description:** Disables loading protection on a player entity.  
* **Parameters:**  
  - `guid`: number  
* **Returns:** `nil`

### `PlayNIS(nisname, lines)`
* **Description:** Loads and plays a non-interactive sequence using the `nis` component.  
* **Parameters:**  
  - `nisname`: string — filename in `nis/`  
  - `lines`: table — script lines to pass to `nis.script`  
* **Returns:** entity — NIS entity

### `IsPaused()`, `IsSimPaused()`
* **Description:** Returns whether game is manually paused or simulation is paused.  
* **Parameters:** none  
* **Returns:** boolean

### `SetDefaultTimeScale(scale)`
* **Description:** Sets default time scale; applies immediately if not paused.  
* **Parameters:**  
  - `scale`: number  
* **Returns:** `nil`

### `SetSimPause(val)`
* **Description:** Sets `simpaused` flag. **Note:** Not used in DST.  
* **Parameters:**  
  - `val`: boolean  
* **Returns:** `nil`

### `SetServerPaused(pause)`
* **Description:** Sets server pause state; ignores request if IMGUI window is focused.  
* **Parameters:**  
  - `pause`: boolean (optional, default toggles current state)  
* **Returns:** `nil`

### `SetAutopaused(autopause)`
* **Description:** Increments/decrements `autopausecount` and updates net pause state via `DoAutopause()`.  
* **Parameters:**  
  - `autopause`: boolean  
* **Returns:** `nil`

### `SetCraftingAutopaused(autopause)`
* **Description:** Sets crafting autopause state and updates net pause state.  
* **Parameters:**  
  - `autopause`: boolean  
* **Returns:** `nil`

### `SetConsoleAutopaused(autopause)`
* **Description:** Increments/decrements `consoleautopausecount` and updates net pause state.  
* **Parameters:**  
  - `autopause`: boolean  
* **Returns:** `nil`

### `DoAutopause()`
* **Description:** Determines whether to autopause based on profile settings and counts.  
* **Parameters:** none  
* **Returns:** `nil`

### `OnSimPaused()`, `OnSimUnpaused()`
* **Description:** Stub for sim pause (`OnSimPaused`) and event `"ms_simunpaused"` fire on `"ms_simunpaused"` (`OnSimUnpaused`).  
* **Parameters:** none  
* **Returns:** `nil`

### `SetPause(val, reason)`
* **Description:** Toggles pause state, updates mixer, and calls `PlayerPauseCheck` if defined.  
* **Parameters:**  
  - `val`: boolean  
  - `reason`: any  
* **Returns:** `nil`

### `SetInstanceParameters(settings)`
* **Description:** Decodes JSON `settings` and stores in global `Settings`.  
* **Parameters:**  
  - `settings`: string — JSON object  
* **Returns:** `nil`

### `SetPurchases(purchases)`
* **Description:** Decodes JSON `purchases` and stores in global `Purchases`.  
* **Parameters:**  
  - `purchases`: string — JSON array/object  
* **Returns:** `nil`

### `SaveGame(isshutdown, cb)`
* **Description:** Saves game data on the server: entities, map, players, mods, snapshots, worldgen overrides.  
* **Parameters:**  
  - `isshutdown`: boolean — whether shutdown is imminent  
  - `cb`: function (optional) — called after save completes  
* **Returns:** `nil`

### `ProcessJsonMessage(message)`
* **Description:** Processes JSON-encoded client commands (e.g., pause toggle, quit).  
* **Parameters:**  
  - `message`: string — JSON message  
* **Returns:** `nil`

### `LoadFonts()`, `UnloadFonts()`
* **Description:** Loads or unloads fonts via `TheSim`.  
* **Parameters:** none  
* **Returns:** `nil`

### `Start()`, `GlobalInit()`
* **Description:** Initializes frontend, disk permissions, custom commands, and mod checks. Initializes global assets and hardware stats.  
* **Parameters:** none  
* **Returns:** `nil`

### `DoLoadingPortal(cb)`
* **Description:** Triggers fade-out to white and logs stats.  
* **Parameters:**  
  - `cb`: function — called after fade  
* **Returns:** `nil`

### `LoadMapFile(map_name)`
* **Description:** Loads map file in-game via `StartNextInstance`.  
* **Parameters:**  
  - `map_name`: string  
* **Returns:** `nil`

### `StartNextInstance(in_params)`
* **Description:** Begins a new instance (load, new game, etc.) via `SimReset`.  
* **Parameters:**  
  - `in_params`: table (optional)  
* **Returns:** `nil`

### `ForceAssetReset()`
* **Description:** Forces a full asset reset by clearing asset-set flags.  
* **Parameters:** none  
* **Returns:** `nil`

### `SimReset(instanceparameters)`
* **Description:** Shuts down current instance and resets the sim with provided parameters.  
* **Parameters:**  
  - `instanceparameters`: table (optional)  
* **Returns:** `nil`

### `RequestShutdown()`, `DoWorldOverseerShutdown()`, `Shutdown()`
* **Description:** Graceful shutdown: shows quit dialog, stops servers, notifies overseer, calls `TheSim:Quit()`.  
* **Parameters:** none  
* **Returns:** `nil`

### `DisplayError(error)`
* **Description:** Displays a global error screen; handles mod vs. vanilla errors differently.  
* **Parameters:**  
  - `error`: string  
* **Returns:** `nil`

### `SetPauseFromCode(pause)`
* **Description:** Pushes `PauseScreen` if pausing in gameplay.  
* **Parameters:**  
  - `pause`: boolean  
* **Returns:** `nil`

### `InGamePlay()`, `IsMigrating()`
* **Description:** Returns `inGamePlay` flag or checks migration state.  
* **Parameters:** none  
* **Returns:** boolean

### `DoRestart(save)`
* **Description:** Restarts game (new instance), optionally saving first.  
* **Parameters:**  
  - `save`: boolean — whether to save before restart  
* **Returns:** `nil`

### `OnPlayerLeave(player_guid, expected)`
* **Description:** Handles server-side player disconnect: fires `"ms_playerdisconnected"` and `"ms_playerdespawn"` events.  
* **Parameters:**  
  - `player_guid`: number  
  - `expected`: boolean  
* **Returns:** `nil`

### `OnPushPopupDialog(message)`
* **Description:** Displays a popup dialog with localized title/body.  
* **Parameters:**  
  - `message`: string — key into `STRINGS.UI.POPUPDIALOG.BODY`  
* **Returns:** `nil`

### `OnDemoTimeout()`
* **Description:** Handles demo timeout: stops servers, serializes session, restarts.  
* **Parameters:** none  
* **Returns:** `nil`

### `OnNetworkDisconnect(message, should_reset, force_immediate_reset, details, miscdata)`
* **Description:** Handles client/server disconnection events, including immediate resets, account-based blocks (e.g., bans), and UI flow (popups, screen transitions, fading).  
* **Parameters:**  
  - `message`: string — localized message key (e.g., `"E_BANNED"`)  
  - `should_reset`: boolean — whether full reset is appropriate  
  - `force_immediate_reset`: boolean — triggers immediate restart  
  - `details`: table (optional) — with `help_button` for UI controls  
  - `miscdata`: function (optional) — callback after screen pop  
* **Returns:** `true`

### `RegisterOnAccountEventListener(listener)`
* **Description:** Adds a listener to the global account event listener list.  
* **Parameters:**  
  - `listener`: object — expects `OnAccountEvent(success, event_code, custom_message)`  
* **Returns:** `nil`

### `RemoveOnAccountEventListener(listener_to_remove)`
* **Description:** Removes a listener from the account event listener list by reference.  
* **Parameters:**  
  - `listener_to_remove`: object  
* **Returns:** `nil`

### `OnAccountEvent(success, event_code, custom_message)`
* **Description:** Broadcasts an account-related event to all registered listeners.  
* **Parameters:**  
  - `success`: boolean  
  - `event_code`: string  
  - `custom_message`: string (optional)  
* **Returns:** `nil`

### `TintBackground(bg)`
* **Description:** Applies a tint to a background UI element using a color constant from `BGCOLOURS.FULL`.  
* **Parameters:**  
  - `bg`: UI background widget — expects `:SetTint(r, g, b, a)`  
* **Returns:** `nil`

### `OnFocusLost()`, `OnFocusGained()`
* **Description:** Handles app focus loss/gain (save, mute/unmute, unpause).  
* **Parameters:** none  
* **Returns:** `nil`

### `OnUserPickedCharacter(char, skin_base, clothing_body, clothing_hand, clothing_legs, clothing_feet)`
* **Description:** Handles player selection in character select screen; packages data and sends spawn request to server.  
* **Parameters:**  
  - `char`: string — prefab name  
  - `skin_base`, `clothing_*`: string — skin names  
* **Returns:** `nil`

### `ResumeRequestLoadComplete(success)`
* **Description:** Handles post-resume-request outcome; on failure, deletes invalid session and returns to lobby.  
* **Parameters:**  
  - `success`: boolean  
* **Returns:** `nil`

### `ParseUserSessionData(data)`
* **Description:** Safely parses raw save file string into a Lua table using sandboxed execution.  
* **Parameters:**  
  - `data`: string — raw save file content  
* **Returns:** `playerdata` (table or `nil`), `prefab` (string)

### `ResumeExistingUserSession(data, guid)`
* **Description:** Spawns a player entity on the server using persisted session data, respecting vault room placement.  
* **Parameters:**  
  - `data`: table — session payload (`data.data`, position info)  
  - `guid`: number  
* **Returns:** `player.player_classified.entity` or `nil`

### `RestoreSnapshotUserSession(sessionid, userid)`
* **Description:** Loads a session snapshot by ID, spawns a new player, and teleports it; sets `_snapshot_platform` metadata.  
* **Parameters:**  
  - `sessionid`: string — snapshot file ID  
  - `userid`: string — associated user ID  
* **Returns:** `player.player_classified.entity` or `nil`

### `ExecuteConsoleCommand(fnstr, guid, x, z)`
* **Description:** Executes arbitrary Lua code in sandboxed context, temporarily overriding `ThePlayer` and `TheInput.overridepos`.  
* **Parameters:**  
  - `fnstr`: string — Lua code  
  - `guid`, `x`, `z`: optional inputs  
* **Returns:** `nil`

### `NotifyLoadingState(loading_state, match_results)`
* **Description:** Coordinates loading screen transitions based on client/server role and worldgen settings.  
* **Parameters:**  
  - `loading_state`: number — from `LoadingStates` (`None`, `Loading`, `Generating`, `DoneGenerating`, `DoneLoading`)  
  - `match_results`: string (optional JSON) — decoded into `TheFrontEnd.match_results`  
* **Returns:** `nil`

### `CreateWorldStateTag(namespace, atlas)`
* **Description:** Factory function for namespace-specific world state tag system using bit-encoding.  
* **Parameters:**  
  - `namespace`: string — unique identifier (e.g., `"WS:"`)  
  - `atlas`: string — UI atlas path  
* **Returns:** table of tag functions (`DeclareTag`, `EncodeTags`, `DecodeTags`, etc.)

### `GetWorldStateTagObjectFromNamespace(namespace)`, `GetWorldStateTagObjectFromTag(tag)`, `ForEachWorldStateTagObject(fn, ...)`
* **Description:** Retrieves or iterates over world state tag objects by namespace or tag.  
* **Parameters:**  
  - `namespace`/`tag`/`fn`: varies  
* **Returns:** object or `nil`

### `BuildTagsStringCommon(tagsTable)`
* **Description:** Builds a comma-separated string of server visibility tags, including game state, mod, language, and world state tags.  
* **Parameters:**  
  - `tagsTable`: table of tag strings  
* **Returns:** string

### `SaveAndShutdown()`
* **Description:** Performs server shutdown: despawns players, saves shard game index.  
* **Parameters:** none  
* **Returns:** `nil`

### `IsInFrontEnd()`
* **Description:** Checks if game is in frontend using `Settings.reset_action`.  
* **Parameters:** none  
* **Returns:** boolean

### `CreateRepeatedSoundVolumeReduction(repeat_time, lowered_volume_percent)`
* **Description:** Factory function returning a closure for time-based audio volume reduction.  
* **Parameters:**  
  - `repeat_time`: number — seconds between triggers  
  - `lowered_volume_percent`: number — volume multiplier (e.g., `0.75`)  
* **Returns:** function — current volume level (0–1)

### `DisplayAntiAddictionNotification(notification)`
* **Description:** Displays a persistent anti-addiction message for ~10 seconds. De-duplicates overlapping notifications.  
* **Parameters:**  
  - `notification`: string — key into `STRINGS.ANTIADDICTION`  
* **Returns:** `nil`

### `ShowBadHashUI()`
* **Description:** Shows a modal popup when game file integrity is compromised.  
* **Parameters:** none  
* **Returns:** `nil`

### `HookLoginButtonForDataBundleFileHashes(button)`
* **Description:** Registers a login button widget for enabling/disabling during integrity checks.  
* **Parameters:**  
  - `button`: UI button widget  
* **Returns:** `nil`

### `BeginDataBundleFileHashes()`, `DataBundleFileHashes(calculatedhashes)`
* **Description:** Marks integrity check as in-progress, disables login, compares hashes.  
* **Parameters:**  
  - `calculatedhashes`: table — `{filename = hash}`  
* **Returns:** `nil`

## Events & listeners
* **`ms_playerdisconnected`** — fired server-side on player disconnect (via `OnPlayerLeave`)
* **`ms_playerdespawn`** — fired server-side on player disconnect (via `OnPlayerLeave`)
* **`serverpauseddirty`** — fired on pause state change (via `OnServerPauseDirty`)
* **`ms_simunpaused`** — fired on simulation unpaused (via `OnSimUnpaused`)
* **Account event notifications** — delivered to registered listeners via `OnAccountEvent`