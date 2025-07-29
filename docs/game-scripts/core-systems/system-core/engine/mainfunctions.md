---
id: mainfunctions
title: Main Functions
description: Core game functions for save/load operations, entity management, time functions, and game flow control
sidebar_position: 2

last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Main Functions

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `mainfunctions.lua` script provides essential game functions for save/load operations, entity management, time handling, and game flow control. These functions form the backbone of DST's runtime operations and are used throughout the game for critical system management.

## Usage Example

```lua
-- Entity spawning
local flower = SpawnPrefab("flower")
flower.Transform:SetPosition(10, 0, 5)

-- Time functions
local current_time = GetTime()
local tick_time = GetTickTime()

-- Save operations
SavePersistentString("my_save", data, true, function()
    print("Save completed")
end)
```

## Save/Load Functions

### SavePersistentString(name, data, encode, callback) {#save-persistent-string}

**Status:** `stable`

**Description:**
Saves data to persistent storage with optional encoding and callback notification.

**Parameters:**
- `name` (string): Name identifier for the save data
- `data` (string): Data to be saved
- `encode` (boolean): Whether to encode the data
- `callback` (function): Optional callback function executed after save

**Example:**
```lua
local save_data = "player_settings=enabled"
SavePersistentString("settings", save_data, true, function()
    print("Settings saved successfully")
end)
```

### ErasePersistentString(name, callback) {#erase-persistent-string}

**Status:** `stable`

**Description:**
Removes persistent data with the given name.

**Parameters:**
- `name` (string): Name identifier for the data to erase
- `callback` (function): Optional callback function executed after erasure

**Example:**
```lua
ErasePersistentString("old_save", function()
    print("Old save data removed")
end)
```

## Entity Management Functions

### SpawnPrefab(name, skin, skin_id, creator) {#spawn-prefab}

**Status:** `stable`

**Description:**
Spawns a prefab instance in the game world with optional skin and creator information.

**Parameters:**
- `name` (string): Prefab name to spawn
- `skin` (string): Optional skin identifier
- `skin_id` (string): Optional skin ID
- `creator` (EntityScript): Optional creator entity

**Returns:**
- (EntityScript): The spawned entity instance

**Example:**
```lua
-- Spawn a basic flower
local flower = SpawnPrefab("flower")

-- Spawn with specific skin
local character = SpawnPrefab("wilson", "wilson_formal")

-- Check if spawning succeeded
if flower then
    flower.Transform:SetPosition(x, y, z)
end
```

### ReplacePrefab(original_inst, name, skin, skin_id, creator) {#replace-prefab}

**Status:** `stable`

**Description:**
Replaces an existing entity with a new prefab at the same position.

**Parameters:**
- `original_inst` (EntityScript): Entity to replace
- `name` (string): New prefab name
- `skin` (string): Optional skin identifier
- `skin_id` (string): Optional skin ID
- `creator` (EntityScript): Optional creator entity

**Returns:**
- (EntityScript): The replacement entity instance

**Example:**
```lua
-- Replace a sapling with a tree
local tree = ReplacePrefab(sapling, "tree")
```

### CreateEntity(name) {#create-entity}

**Status:** `stable`

**Description:**
Creates a new entity with optional name identifier.

**Parameters:**
- `name` (string): Optional name for the entity

**Returns:**
- (EntityScript): The created entity script

**Example:**
```lua
local custom_entity = CreateEntity("MyCustomEntity")
custom_entity:AddComponent("health")
```

### RemoveEntity(guid) {#remove-entity}

**Status:** `stable`

**Description:**
Removes an entity from the game world by its GUID.

**Parameters:**
- `guid` (number): Entity GUID to remove

**Example:**
```lua
local entity_guid = entity.GUID
RemoveEntity(entity_guid)
```

## Time Functions

### GetTime() {#get-time}

**Status:** `stable`

**Description:**
Returns the current game time in seconds.

**Returns:**
- (number): Current game time

**Example:**
```lua
local current_time = GetTime()
print("Game has been running for", current_time, "seconds")
```

### GetTick() {#get-tick}

**Status:** `stable`

**Description:**
Returns the current game tick count.

**Returns:**
- (number): Current tick number

**Example:**
```lua
local tick = GetTick()
if tick % 30 == 0 then
    -- Execute every 30 ticks (approximately 1 second)
    DoPeriodicTask()
end
```

### GetTickTime() {#get-tick-time}

**Status:** `stable`

**Description:**
Returns the duration of one game tick in seconds.

**Returns:**
- (number): Tick duration in seconds

**Example:**
```lua
local tick_duration = GetTickTime()
local ticks_per_second = 1 / tick_duration
```

### GetStaticTime() {#get-static-time}

**Status:** `stable`

**Description:**
Returns the current static time (unaffected by time scale).

**Returns:**
- (number): Current static time

### GetTimeReal() {#get-time-real}

**Status:** `stable`

**Description:**
Returns real-world time in milliseconds since game start.

**Returns:**
- (number): Real time in milliseconds

### SecondsToTimeString(total_seconds) {#seconds-to-time-string}

**Status:** `stable`

**Description:**
Converts seconds to a formatted time string.

**Parameters:**
- `total_seconds` (number): Time in seconds to convert

**Returns:**
- (string): Formatted time string (MM:SS or SS format)

**Example:**
```lua
local time_str = SecondsToTimeString(125)
print(time_str) -- Output: "2:05"
```

## Game Flow Control

### SimReset(instanceparameters) {#sim-reset}

**Status:** `stable`

**Description:**
Resets the simulation with new instance parameters.

**Parameters:**
- `instanceparameters` (table): Optional parameters for the new instance

**Example:**
```lua
-- Reset to main menu
SimReset({reset_action = RESET_ACTION.LOAD_FRONTEND})
```

### Shutdown() {#shutdown}

**Status:** `stable`

**Description:**
Safely shuts down the game, handling cleanup operations.

**Example:**
```lua
-- Graceful shutdown
Shutdown()
```

### DoRestart(save) {#do-restart}

**Status:** `stable`

**Description:**
Restarts the game with optional save operation.

**Parameters:**
- `save` (boolean): Whether to save before restarting

**Example:**
```lua
-- Restart without saving
DoRestart(false)

-- Restart with save
DoRestart(true)
```

## Pause/Resume Functions

### SetPause(val, reason) {#set-pause}

**Status:** `stable`

**Description:**
Sets the game pause state with optional reason.

**Parameters:**
- `val` (boolean): Whether to pause the game
- `reason` (string): Optional reason for pause

**Example:**
```lua
-- Pause the game
SetPause(true, "Menu opened")

-- Resume the game
SetPause(false)
```

### IsPaused() {#is-paused}

**Status:** `stable`

**Description:**
Checks if the game is currently paused.

**Returns:**
- (boolean): True if game is paused

**Example:**
```lua
if not IsPaused() then
    -- Only update when not paused
    UpdateGameLogic()
end
```

### SetAutopaused(autopause) {#set-autopaused}

**Status:** `stable`

**Description:**
Sets automatic pause state (e.g., when inventory is open).

**Parameters:**
- `autopause` (boolean): Whether to enable autopause

## Script and Asset Loading

### LoadScript(filename) {#load-script}

**Status:** `stable`

**Description:**
Loads and caches a Lua script file.

**Parameters:**
- `filename` (string): Script filename relative to scripts directory

**Returns:**
- (any): The loaded script's return value

**Example:**
```lua
local utility_script = LoadScript("util/helpers")
```

### RunScript(filename) {#run-script}

**Status:** `stable`

**Description:**
Loads and executes a Lua script file.

**Parameters:**
- `filename` (string): Script filename to execute

**Example:**
```lua
RunScript("custom/initialization")
```

### LoadPrefabFile(filename, async_batch_validation, search_asset_first_path) {#load-prefab-file}

**Status:** `stable`

**Description:**
Loads prefab definitions from a file with optional validation settings.

**Parameters:**
- `filename` (string): Prefab file to load
- `async_batch_validation` (boolean): Whether to use async validation
- `search_asset_first_path` (boolean): Whether to prioritize asset paths

**Returns:**
- (table): Array of loaded prefab definitions

**Example:**
```lua
-- Load character prefabs
LoadPrefabFile("prefabs/characters")

-- Load with async validation
LoadPrefabFile("prefabs/items", true)
```

## Network and Multiplayer

### OnPlayerLeave(player_guid, expected) {#on-player-leave}

**Status:** `stable`

**Description:**
Handles player disconnection events.

**Parameters:**
- `player_guid` (number): GUID of the leaving player
- `expected` (boolean): Whether the disconnection was expected

### OnNetworkDisconnect(message, should_reset, force_immediate_reset, details, miscdata) {#on-network-disconnect}

**Status:** `stable`

**Description:**
Handles network disconnection with appropriate UI feedback.

**Parameters:**
- `message` (string): Disconnection reason code
- `should_reset` (boolean): Whether to reset to main menu
- `force_immediate_reset` (boolean): Whether to force immediate reset
- `details` (table): Additional disconnect details
- `miscdata` (any): Miscellaneous data

## Debug and Development

### SetDebugEntity(inst) {#set-debug-entity}

**Status:** `stable`

**Description:**
Sets an entity as the current debug target.

**Parameters:**
- `inst` (EntityScript): Entity to debug

**Example:**
```lua
-- Set player as debug target
SetDebugEntity(ThePlayer)
```

### GetDebugEntity() {#get-debug-entity}

**Status:** `stable`

**Description:**
Gets the current debug entity.

**Returns:**
- (EntityScript): Current debug entity

### ExecuteConsoleCommand(fnstr, guid, x, z) {#execute-console-command}

**Status:** `stable`

**Description:**
Executes arbitrary Lua code in console context.

**Parameters:**
- `fnstr` (string): Lua code to execute
- `guid` (number): Optional player GUID for context
- `x` (number): Optional X position override
- `z` (number): Optional Z position override

## Error Handling

### DisplayError(error) {#display-error}

**Status:** `stable`

**Description:**
Displays an error dialog with appropriate options for recovery.

**Parameters:**
- `error` (string): Error message to display

## State Queries

### InGamePlay() {#in-game-play}

**Status:** `stable`

**Description:**
Checks if the game is currently in gameplay state (not in menus).

**Returns:**
- (boolean): True if in gameplay

**Example:**
```lua
if InGamePlay() then
    -- Only process game logic when actually playing
    ProcessPlayerActions()
end
```

### IsMigrating() {#is-migrating}

**Status:** `stable`

**Description:**
Checks if the game is currently migrating between servers.

**Returns:**
- (boolean): True if migrating

## Related Modules

- [Main](./main.md): Game initialization and platform detection
- [EntityScript](./entityscript.md): Entity scripting framework
- [SaveIndex](./saveindex.md): Save file management
- [Networking](./networking.md): Network communication
- [Scheduler](./scheduler.md): Task scheduling system
- [DebugHelpers](./debughelpers.md): Development and debugging tools
