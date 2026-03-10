---
id: gamelogic
title: Gamelogic
description: Central game logic controller that manages world initialization, loading, activation/deactivation, and high-level lifecycle events for Don't Starve Together.
tags: [world, lifecycle, loading, activation, savegame]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 9d3f0817
system_scope: world
---

# Gamelogic

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
Gamelogic is a top-level script responsible for the complete lifecycle of a DST world session: from initial load, generation, and population of the world to activation, deactivation, and session reset. It handles loading/unloading of prefabs, world instantiation, scenario execution, save file upgrades, and integrates with UI systems like loading screens, cancel tips, and error dialogs. It also coordinates player activation/deactivation events and manages audio and RPC state during these transitions.

## Usage example
```lua
-- Load world from a specific save file
DoLoadWorldFile("saves/myworld/worlddata")

-- Force authentication if needed before entering game
ForceAuthenticationDialog()

-- Deactivate current world before seamless player swap
DeactivateWorld()

-- Re-activate world after seamless swap
ActivateWorld()

-- Record achievement progress for all players
RecordEventAchievementProgressForAllPlayers("survived_winter", { days = 30 })
```

## Dependencies & tags
**Components used:**
- childspawner (GoHome)
- emitter (Emit, area_emitter, density_factor)
- eventachievementtracker (RecordProgress, RecordSharedProgress)
- homeseeker (home)
- oceancolor (Initialize)
- scenariorunner (Run)
- spawner (GoHome)
- walkableplatformmanager (PostUpdate)

**Tags:** None

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `global_loading_widget` | widget | nil | Global loading UI widget; set when `LoadSlot()` or `DoInitGame()` runs and `not TheNet:IsDedicated()`. |
| `cancel_tip` | widget | nil | Cancel tip widget; created in `ShowCancelTip()`. |
| `start_game_time` | number | nil | Unix timestamp of game start; used by `GetTimePlaying()`. |
| `isdeactivated` | boolean | false | World deactivation state; set in `DeactivateWorld()`, cleared in `ActivateWorld()`. |

## Main functions
### `RecordEventAchievementProgressForAllPlayers(achievement, data)`
* **Description:** Records achievement progress for all players using the EventAchievementTracker component attached to TheWorld.
* **Parameters:** 
  - `achievement`: String identifier for the achievement.
  - `data`: Optional table of data passed along with progress.
* **Returns:** None.
* **Error states:** Safely checks for existence of TheWorld and its eventachievementtracker component.

### `RecordEventAchievementProgress(achievement, src, data)`
* **Description:** Records achievement progress for a specific player or entity source.
* **Parameters:** 
  - `achievement`: String identifier for the achievement.
  - `src`: Player or entity instance for which progress is being recorded.
  - `data`: Optional table of progress data.
* **Returns:** None.
* **Error states:** Same as above; silently skips if tracker is missing.

### `RecordEventAchievementSharedProgress(achievement, data)`
* **Description:** Records shared (non-player-specific) achievement progress.
* **Parameters:** 
  - `achievement`: String identifier for the achievement.
  - `data`: Optional table of progress data.
* **Returns:** None.
* **Error states:** Same as above.

### `ForceAuthenticationDialog()`
* **Description:** Ensures the authentication dialog is shown; if currently in a game context, switches to MainScreen and triggers login flow.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** Checks if screen exists before calling `ForceLogin()` or showing UI.

### `DoAgeWorld()`
* **Description:** Iterates over all entities in TheWorld and attempts to return those with a homeseeker component to their designated home by calling GoHome on their spawner/childspawner components.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** Conditionally validates `self.gohomevalidatefn` on spawner, checks for home existence and component validity.

### `KeepAlive()`
* **Description:** Forces rendering of loading UI during long operations to prevent frozen or blank screens (e.g., asset loading).
* **Parameters:** None.
* **Returns:** None.
* **Error states:** Verifies existence of `global_loading_widget` and `cancel_tip` before calling render functions.

### `ShowLoading()`
* **Description:** Displays the global loading widget (non-dedicated servers only).
* **Parameters:** None.
* **Returns:** None.
* **Error states:** Guarded by `TheNet:IsDedicated()`.

### `ShowCancelTip()`
* **Description:** Enables the cancel tip UI widget for user interaction during long operations.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** Guarded by `cancel_tip` existence.

### `HideCancelTip()`
* **Description:** Hides the cancel tip UI widget.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** Guarded by `cancel_tip` existence.

### `LoadAssets(asset_set, savedata)`
* **Description:** Loads/unloads prefabs based on `asset_set` ("FRONTEND"/"BACKEND"), current world config, active DLCs, and special event flags. Handles transitions such as frontend-only mode or post-generation asset load.
* **Parameters:** 
  - `asset_set`: String ("FRONTEND"/"BACKEND").
  - `savedata`: Optional save data table with world metadata (e.g., overrides, environment flags).
* **Returns:** None.
* **Error states:** Asserts `asset_set`; safely handles nil savedata; supports platform-specific prefabs.

### `GetTimePlaying()`
* **Description:** Returns the number of seconds elapsed since game start.
* **Parameters:** None.
* **Returns:** Number: seconds played (0 if `start_game_time` is nil).
* **Error states:** Returns 0 if `start_game_time` is missing.

### `PopulateWorld(savedata, profile)`
* **Description:** Instantiates and initializes the world from save data: spawns world prefab, configures ocean color, builds map, initializes tiles, spawns entities, sets up walkable platforms, runs scenarios, and retrofits world layout.
* **Parameters:** 
  - `savedata`: Full save data table containing map, topology, entities, overrides, and metadata.
  - `profile`: Player profile for loading the correct character.
* **Returns:** None.
* **Error states:** Logs error and returns early if savedata is nil; asserts critical fields.

### `DeactivateWorld()`
* **Description:** Deactivates the current world: disables RPC, pushes `deactivateworld` event, mutes audio, pauses the world.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** Guards against double-deactivation and checks `TheWorld` existence.

### `ActivateWorld()`
* **Description:** Re-activates the world: restores volume, unpause, pushes audio mix, cleans up deactivation state.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** Guards against re-activation and checks `TheWorld` existence.

### `OnPlayerActivated(world, player)`
* **Description:** Triggered when a player activates: starts game timer, restores audio state, fades in, handles character-specific logic (e.g., Wonkey).
* **Parameters:** 
  - `world`: World entity.
  - `player`: Player entity.
* **Returns:** None.
* **Error states:** Guards seamless swap state; skips for swap source.

### `SendResumeRequestToServer(world, delay)`
* **Description:** Sends a resume request to the server after a delay; retries up to a limit if world remains paused.
* **Parameters:** 
  - `world`: World entity.
  - `delay`: Number of ticks to wait before sending request.
* **Returns:** None.
* **Error states:** Aborts if world is deactivated or client has no player.

### `OnPlayerDeactivated(world, player)`
* **Description:** Triggered when a player deactivates: clears UI screens, fades out audio, mutes channels, and schedules resume request.
* **Parameters:** 
  - `world`: World entity.
  - `player`: Player entity.
* **Returns:** None.
* **Error states:** Guards against false triggers during seamless swaps.

### `WriteServerSaveTempFile(savedata)`
* **Description:** Writes a cleaned temporary server save file for upload; removes unnecessary fields to reduce payload size.
* **Parameters:** 
  - `savedata`: Full save data table.
* **Returns:** None.
* **Error states:** Only runs on server (`TheNet:GetIsServer()`); re-restores modified tables post-save.

### `DoInitGame(savedata, profile)`
* **Description:** Finalizes game initialization: validates savedata, loads prefabs, calls PopulateWorld, sets up event listeners (playeractivated, playerdeactivated), initializes equip slots and tiles, and restores autosaves.
* **Parameters:** 
  - `savedata`: Fully validated save data.
  - `profile`: Player profile.
* **Returns:** None.
* **Error states:** Extensive asserts; guards against `global_error_widget`.

### `UpgradeSaveFile(savedata)`
* **Description:** Applies progressive version upgrades to older save files until the current schema version is reached.
* **Parameters:** 
  - `savedata`: Save data table (modified in-place).
* **Returns:** None.
* **Error states:** Compares `savedata.meta.saveversion` with the upgrade version to determine if upgrades are needed.

### `DoLoadWorldFile(file)`
* **Description:** Loads world data from a specific file path and calls `DoInitGame`.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** Callback asserts savedata validity and handles load errors.

### `DoLoadWorld()`
* **Description:** Loads world data from the currently selected save slot and calls `DoInitGame`.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** Same as above.

### `DoGenerateWorld()`
* **Description:** Generates a new world, saves the output, and calls `DoInitGame`.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** Checks sandbox result for errors (e.g., `"error:..."` prefix).

### `LoadSlot()`
* **Description:** Clears screens, checks for existing world, and dispatches to either `DoLoadWorld` or `DoGenerateWorld`.
* **Parameters:** None.
* **Returns:** None.

### `ShowDemoExpiredDialog()`
* **Description:** Displays a demo-expired dialog and requests shutdown.
* **Parameters:** None.
* **Returns:** None.

### `DoResetAction()`
* **Description:** Executes various reset actions based on `LOAD_UPFRONT_MODE` and `Settings.reset_action`: demo expiry, load slot, load file, join server, frontend-only mode, etc.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** Uses conditional logic to avoid invalid transitions.

### `OnUpdatePurchaseStateComplete()`
* **Description:** Triggered after a purchase state update; calls `DoResetAction`.
* **Parameters:** None.
* **Returns:** None.

### `OnFilesLoaded()`
* **Description:** Triggered after profile and save index files load; cleans session cache and shows a first-time host popup.
* **Parameters:** None.
* **Returns:** None.

### `DrawDebugGraph(graph)`
* **Description:** Renders a debug visualization of a map topology graph (nodes and edges) on-screen.
* **Parameters:** 
  - `graph`: Table with keys `nodes`, `edges`, `colours`, `ids`.
* **Returns:** None.
* **Error states:** Guards against missing node/edge references.

## Events & listeners
* **Listens to:** `playeractivated` — registered in `DoInitGame` on `TheWorld`; triggers `OnPlayerActivated`.
* **Listens to:** `playerdeactivated` — registered in `DoInitGame` on `TheWorld`; triggers `OnPlayerDeactivated`.
* **Pushes:** `worldmapsetsize` — pushed in `PopulateWorld` after setting map size.
* **Pushes:** `deactivateworld` — pushed in `DeactivateWorld`.
* **Pushes:** `gohomefailed` — indirectly via `Spawner:GoHome` if home spawn fails (not directly called in gamelogic, but expected by API contract).