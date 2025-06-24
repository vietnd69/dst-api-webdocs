---
id: gamelogic
title: Game Logic
description: Core game initialization, world management, and main game loop functionality
sidebar_position: 1
slug: api-vanilla/core-systems/gamelogic
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Game Logic

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `gamelogic` module serves as the central orchestrator for Don't Starve Together's core game systems. It manages the complete game lifecycle from initial startup through world generation, asset loading, game state management, and the main game loop. This module coordinates between frontend/backend states, handles save/load operations, and manages player session lifecycle.

## Usage Example

```lua
-- Game initialization flow (automatically handled)
-- 1. Profile and save index loading
-- 2. Asset loading based on game state
-- 3. World generation or loading
-- 4. Game state activation

-- Manual world aging (development/testing)
DoAgeWorld()

-- Check current play time
local play_time = GetTimePlaying()
print("Current session duration:", play_time, "seconds")
```

## Core Functions

### RecordEventAchievementProgressForAllPlayers(achievement, data) {#record-event-achievement-progress-for-all-players}

**Status:** `stable`

**Description:**
Records achievement progress for all currently active players simultaneously.

**Parameters:**
- `achievement` (string): Achievement identifier to update
- `data` (table): Achievement progress data

**Example:**
```lua
-- Record collaborative achievement progress
RecordEventAchievementProgressForAllPlayers("WORLD_BOSSES_DEFEATED", {
    boss_name = "dragonfly",
    day = TheWorld.state.cycles
})
```

### RecordEventAchievementProgress(achievement, src, data) {#record-event-achievement-progress}

**Status:** `stable`

**Description:**
Records achievement progress for a specific player.

**Parameters:**
- `achievement` (string): Achievement identifier
- `src` (EntityScript): Player entity to credit with progress
- `data` (table): Progress data specific to the achievement

**Example:**
```lua
-- Record individual player achievement
local player = ThePlayer
RecordEventAchievementProgress("ITEMS_CRAFTED", player, {
    item = "spear",
    count = 1
})
```

### ShowLoading() {#show-loading}

**Status:** `stable`

**Description:**
Displays the loading screen widget for non-dedicated servers.

**Example:**
```lua
-- Show loading screen during long operations
ShowLoading()
-- Perform loading operations...
-- Loading automatically hidden when complete
```

### ShowCancelTip() / HideCancelTip() {#show-hide-cancel-tip}

**Status:** `stable`

**Description:**
Shows or hides the cancel tip widget that informs players they can cancel loading operations.

**Example:**
```lua
-- Show cancel tip during world generation
ShowCancelTip()

-- Hide when operation completes
HideCancelTip()
```

### GetTimePlaying() {#get-time-playing}

**Status:** `stable`

**Description:**
Returns the total time in seconds that the current game session has been active.

**Returns:**
- (number): Session duration in seconds, or 0 if no session is active

**Example:**
```lua
local session_time = GetTimePlaying()
if session_time > 3600 then -- 1 hour
    print("Long session detected:", session_time / 3600, "hours")
end
```

### DeactivateWorld() {#deactivate-world}

**Status:** `stable`

**Description:**
Deactivates the current world, disabling RPC sending and pausing the game state. Called when clients receive loading state notifications.

**Example:**
```lua
-- Deactivate world during server reset
DeactivateWorld()
-- World state is now paused and RPCs disabled
```

### ForceAuthenticationDialog() {#force-authentication-dialog}

**Status:** `stable`

**Description:**
Forces the authentication dialog to appear, typically used when authentication is required or has expired.

**Example:**
```lua
-- Force re-authentication when needed
if not TheNet:IsAuthenticated() then
    ForceAuthenticationDialog()
end
```

## World Management Functions

### PopulateWorld(savedata, profile) {#populate-world}

**Status:** `stable`

**Description:**
Creates and populates the game world with all entities, components, and systems based on save data. This is the core world instantiation function.

**Parameters:**
- `savedata` (table): Complete world save data including map, entities, and metadata
- `profile` (table): Player profile data

**Technical Notes:**
- Sets global `POPULATING` flag during execution
- Applies world settings overrides
- Instantiates all saved entities
- Runs post-load passes for entity references
- Executes scenario scripts

### DoInitGame(savedata, profile) {#do-init-game}

**Status:** `stable`

**Description:**
Initializes the complete game state from save data, including world creation, asset loading, and game activation.

**Parameters:**
- `savedata` (table): World save data
- `profile` (table): Player profile data

**Technical Notes:**
- Validates save data integrity
- Creates world topology
- Sets up roads and navigation
- Initializes audio and graphics systems
- Establishes player event listeners

## Asset Management Functions

### LoadAssets(asset_set, savedata) {#load-assets}

**Status:** `stable`

**Description:**
Manages loading and unloading of game assets based on the current game state (frontend vs backend).

**Parameters:**
- `asset_set` (string): Either "FRONTEND" or "BACKEND"
- `savedata` (table|nil): Save data containing world-specific asset requirements

**Technical Notes:**
- Handles asset set transitions efficiently
- Loads character prefabs based on active character list
- Manages special event and festival assets
- Implements asset streaming for large worlds

## Save/Load Functions

### DoLoadWorld() {#do-load-world}

**Status:** `stable`

**Description:**
Loads the current world from the active save slot.

**Technical Notes:**
- Retrieves save data through ShardGameIndex
- Performs save file upgrades if necessary
- Transitions to backend asset set before world initialization

### DoLoadWorldFile(file) {#do-load-world-file}

**Status:** `stable`

**Description:**
Loads a specific world save file by name.

**Parameters:**
- `file` (string): Save file name to load

### DoGenerateWorld() {#do-generate-world}

**Status:** `stable`

**Description:**
Initiates new world generation through the world generation screen.

**Technical Notes:**
- Creates world generation data structure
- Handles generation errors gracefully
- Manages world generation UI flow

## Constants

### POPULATING

**Value:** `boolean`

**Status:** `stable`

**Description:** Global flag indicating whether world population is currently in progress.

### LOAD_UPFRONT_MODE

**Value:** `boolean`

**Status:** `stable`

**Description:** Platform-specific flag (true for PS4) that determines whether all assets are loaded upfront.

### DEBUG_MODE

**Value:** `boolean`

**Status:** `stable`

**Description:** Flag indicating whether debug features are enabled (true for dev branch).

## Global Variables

### global_loading_widget

**Type:** `LoadingWidget`

**Status:** `stable`

**Description:** Global loading screen widget instance used throughout the application.

### global_error_widget

**Type:** `ScriptErrorWidget`

**Status:** `stable`

**Description:** Global error display widget for handling script errors.

### cancel_tip

**Type:** `CancelTip`

**Status:** `stable`

**Description:** Widget that displays cancel instructions during loading operations.

### start_game_time

**Type:** `number`

**Status:** `stable`

**Description:** Timestamp when the current game session started, used for calculating play time.

## Events

### "playeractivated"

**Status:** `stable`

**Description:**
Triggered when a player becomes active in the world.

**Parameters:**
- `world` (EntityScript): The world entity
- `player` (EntityScript): The activated player

### "playerdeactivated"

**Status:** `stable`

**Description:**
Triggered when a player becomes inactive (disconnects, world changes, etc.).

**Parameters:**
- `world` (EntityScript): The world entity
- `player` (EntityScript): The deactivated player

## Common Usage Patterns

### Session Management
```lua
-- Check if game is currently being played
if InGamePlay() then
    local session_duration = GetTimePlaying()
    -- Handle session-specific logic
end
```

### Achievement Tracking
```lua
-- Track individual achievement
RecordEventAchievementProgress("SURVIVE_DAYS", player, {
    days = TheWorld.state.cycles
})

-- Track group achievement
RecordEventAchievementProgressForAllPlayers("BOSS_DEFEATED", {
    boss = "bearger",
    participants = #AllPlayers
})
```

### Loading State Management
```lua
-- Proper loading flow
ShowLoading()
ShowCancelTip()

-- Perform loading operations...

HideCancelTip()
-- Loading widget automatically hidden when complete
```

## Related Modules

- [Main Functions](./mainfunctions.md): High-level game control functions
- [Save Index](./saveindex.md): Save file management system
- [World Settings](./worldsettings.md): World configuration and overrides
- [Player Profile](./playerprofile.md): Player data management
- [Mod Manager](./modmanager.md): Mod loading and management
- [Network](./networking.md): Network communication systems
