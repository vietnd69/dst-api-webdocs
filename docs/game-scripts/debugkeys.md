---
id: debugkeys
title: Debugkeys
description: A debug utility module that registers keyboard handlers, defines key bindings, and provides developer tools for testing and inspecting game state in Don't Starve Together.
tags: [debug, tools, development]
sidebar_position: 10
last_updated: 2026-04-18
build_version: 722832
change_status: stable
category_type: root
source_hash: bf25a46b
system_scope: world
---

# Debugkeys

> Based on game build **722832** | Last updated: 2026-04-18

## Overview
`debugkeys.lua` is a core debug utility module that enables developers to interact with the game through keyboard shortcuts and debug commands. It registers global and game-specific key handlers, defines multiple key binding tables for different debug purposes, and provides functions for spawning entities, manipulating game state, inspecting components, and triggering world events. This file is loaded for debug builds; specific features are disabled on Steam Deck via `IsSteamDeck()` check, and cheat-related functionality is gated by `CHEATS_ENABLED` within the file. It interacts extensively with entity components, world systems, and the frontend debug UI.

## Usage example
```lua
-- Debugkeys is automatically loaded when cheats are enabled
-- Register a custom debug key handler
AddGameDebugKey(KEY_Z, function()
    local player = ConsoleCommandPlayer()
    if player then
        player.components.health:DoDelta(10, nil, "debug_key")
    end
    return true
end)

-- Register a global debug key (works outside gameplay)
AddGlobalDebugKey(KEY_F12, function()
    TheSim:ToggleDebugPause()
    return true
end)

-- Access key binding tables
for _, binding in ipairs(GLOBAL_KEY_BINDINGS) do
    print(binding.name, binding.binding.key)
end
```

## Dependencies & tags
**External dependencies:**
- `dbui_no_package/debug_nodes` -- conditional require for debug UI panels (CAN_USE_DBUI)
- `dbui_no_package/debug_entity` -- debug entity panel
- `dbui_no_package/debug_prefabs` -- debug prefabs panel
- `dbui_no_package/debug_audio` -- debug audio panel
- `dbui_no_package/debug_weather` -- debug weather panel
- `dbui_no_package/debug_skins` -- debug skins panel
- `dbui_no_package/debug_widget` -- debug widget panel
- `dbui_no_package/debug_player` -- debug player panel
- `dbui_no_package/debug_input` -- debug input panel
- `dbui_no_package/debug_strings` -- debug strings panel
- `dbui_no_package/debug_console` -- debug console panel
- `dbui_no_package/debug_watch` -- debug watch panel
- `dbui_no_package/debug_anything` -- debug anything panel
- `dbui_no_package/debug_history` -- debug history panel
- `consolecommands` -- console command functions (c_spawn, c_give, etc.)
- `map/levels` -- level data for room/task inspection
- `map/tasks` -- task definitions
- `map/tasksets` -- task set definitions
- `map/rooms` -- room definitions
- `prefabs/skilltree_defs` -- skill tree definitions for debug
- `usercommands` -- user command execution for emotes

**Components used:**
- `cooldown` -- LongUpdate, cooldown_duration accessed for debug reset
- `domesticatable` -- BecomeDomesticated, BecomeFeral, IsDomesticated, tendencies
- `farming_manager` -- AddTileNutrients, GetTileNutrients for tile manipulation
- `fueled` -- SetPercent for refueling entities
- `growable` -- DoGrowth for forcing growth stages
- `harvestable` -- Grow for producing harvestable items
- `health` -- DoDelta, Kill, maxhealth for health manipulation
- `hunger` -- DoDelta for hunger modification
- `inventory` -- DropEverything, Equip for inventory management
- `inventoryitem` -- SetLanded for item state on boat teleport
- `knownlocations` -- GetLocation for teleporting to known locations
- `locomotor` -- accessed for target selection
- `mood` -- SetIsInMood for mood state forcing
- `periodicspawner` -- TrySpawn for forcing spawn events
- `perishable` -- Perish for forcing spoilage
- `pickable` -- Pick, Regen for plant interaction
- `sanity` -- DoDelta for sanity modification
- `setter` -- SetSetTime, StartSetting for setting timers
- `skilltreeupdater` -- AddSkillXP, DeactivateSkill, GetSkillXP for skill debug
- `walkableplatform` -- GetPlayersOnPlatform for boat platform handling
- `herd` -- members table access
- `herdmember` -- herd reference for herd navigation
- `hounded` -- ForceNextWave for triggering hound attacks

**Tags:**
- `player` -- checked for player entity identification
- `boatbumper` -- used in boat collision debug
- `_inventoryitem` -- used in boat teleport item filtering
- `FX`, `NOCLICK`, `DECOR`, `INLIMBO` -- exclusion tags for entity filtering
- `wall` -- exclusion tag for right-click debug entity filtering

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `handlers` | table | `{}` | Global table storing registered debug key handler functions keyed by key code. |
| `GLOBAL_KEY_BINDINGS` | table | — | Array of key binding definitions for general debug functions (pause, god mode, etc.). |
| `PROGRAMMER_KEY_BINDINGS` | table | — | Array of key binding definitions for programmer-specific debug functions (perf graph, world select). |
| `WINDOW_KEY_BINDINGS` | table | — | Array of key binding definitions for debug UI panel windows (prefabs, audio, entity, etc.). |

## Main functions
### `DoDebugKey(key, down)`
* **Description:** Called by frontend code when a raw key event has not been consumed by the current screen. Iterates through registered handlers for the key and executes them if the down state matches.
* **Parameters:**
  - `key` -- key code constant (e.g., KEY_HOME, KEY_F1)
  - `down` -- boolean indicating key press (true) or release (false)
* **Returns:** `true` if a handler consumed the event, `nil` otherwise.
* **Error states:** None.

### `AddGameDebugKey(key, fn, down)`
* **Description:** Registers a debug key handler that only activates during gameplay (`inGamePlay` is true). Used for in-game debug functions.
* **Parameters:**
  - `key` -- key code constant
  - `fn` -- function to execute when key is pressed
  - `down` -- boolean for key state match (default `true`)
* **Returns:** None
* **Error states:** None.

### `AddGlobalDebugKey(key, fn, down)`
* **Description:** Registers a debug key handler that activates globally (works outside gameplay, in menus, lobby, etc.).
* **Parameters:**
  - `key` -- key code constant
  - `fn` -- function to execute when key is pressed
  - `down` -- boolean for key state match (default `true`)
* **Returns:** None
* **Error states:** None.

### `SimBreakPoint()`
* **Description:** Toggles debug pause on the simulation if not already paused. Used for breaking execution in debug builds.
* **Parameters:** None
* **Returns:** None
* **Error states:** None.

### `DoReload()`
* **Description:** Reloads the scripts/reload.lua module by clearing it from package.loaded and requiring it again. Used for hot-reloading code changes.
* **Parameters:** None
* **Returns:** None
* **Error states:** None.

### `DebugKeyPlayer()`
* **Description:** Returns the console command player entity if on master sim and TheWorld exists. Used as a safe player reference for debug operations.
* **Parameters:** None
* **Returns:** Player entity or `nil` if conditions not met.
* **Error states:** None.

### `d_c_spawn(prefab, count, dontselect)`
* **Description:** Wrapper around c_spawn that handles network replication. Sends ConsoleRemote call on client, executes directly on master sim.
* **Parameters:**
  - `prefab` -- string prefab name to spawn
  - `count` -- number of instances to spawn (default `1`)
  - `dontselect` -- boolean to skip auto-selection of spawned entity
* **Returns:** None
* **Error states:** None.

### `d_c_give(prefab, count, dontselect)`
* **Description:** Wrapper around c_give that handles network replication. Gives items to player inventory with proper client/server handling.
* **Parameters:**
  - `prefab` -- string prefab name to give
  - `count` -- number of items to give
  - `dontselect` -- boolean flag (unused for give)
* **Returns:** None
* **Error states:** None.

### `d_c_remove(entity)`
* **Description:** Removes an entity with network-safe handling. Uses mouse entity if none provided. Sends network ID and position to server on client. Calls `c_remove()` as fallback if entity Network component is nil on client.
* **Parameters:** `entity` -- entity to remove or `nil` to use entity under mouse
* **Returns:** None
* **Error states:** None.

### `d_c_removeall(entity)`
* **Description:** Removes all entities of the same prefab type as the target entity. Uses mouse entity if none provided.
* **Parameters:** `entity` -- reference entity for prefab type or `nil` to use entity under mouse
* **Returns:** None
* **Error states:** None.

### `Spawn(prefab)`
* **Description:** Simple wrapper around SpawnPrefab for debug spawning. Commented LoadPrefabs call suggests prefabs should be pre-loaded.
* **Parameters:** `prefab` -- string prefab name
* **Returns:** Spawned entity instance.
* **Error states:** None.

### `try_boat_teleport(boat, x, y, z)`
* **Description:** Teleports a boat entity and all items on it to a new position. Handles physics constraints and player camera snapping.
* **Parameters:**
  - `boat` -- boat entity with walkableplatform component
  - `x` -- target X world position
  - `y` -- target Y world position
  - `z` -- target Z world position
* **Returns:** `true` on success.
* **Error states:** May fail if boat lacks required components (Physics, walkableplatform).

### `DebugRMB(x, y)`
* **Description:** Handles right mouse button debug actions. Supports spawn selected prefab, remove entities, kill nearby entities, set debug entity based on modifier keys.
* **Parameters:**
  - `x` -- screen X position
  - `y` -- screen Y position
* **Returns:** None
* **Error states:** None.

### `DebugLMB(x, y)`
* **Description:** Handles left mouse button debug actions. Sets debug entity when simulation is paused.
* **Parameters:**
  - `x` -- screen X position
  - `y` -- screen Y position
* **Returns:** None
* **Error states:** None.

### `DoDebugMouse(button, down, x, y)`
* **Description:** Main mouse event handler for debug input. Routes to DebugRMB or DebugLMB based on button. Only processes on button down.
* **Parameters:**
  - `button` -- mouse button constant (MOUSEBUTTON_LEFT, MOUSEBUTTON_RIGHT)
  - `down` -- boolean for button state
  - `x` -- screen X position
  - `y` -- screen Y position
* **Returns:** Returns `false` if `down` is `false`; otherwise returns `nil` (handlers do not return a value).
* **Error states:** None.

### `d_addemotekeys()`
* **Description:** Registers keypad number keys (KP_0 through KP_9, KP_PERIOD) to trigger user command emotes (sit, happy, joy, slowclap, no, angry, facepalm, impatient, shrug, wave, fistshake).
* **Parameters:** None
* **Returns:** None
* **Error states:** None.

### `d_gettiles()`
* **Description:** Scans a 11x11 grid around the player for FARMING_SOIL tiles and prints their coordinates. Used for farm plot debugging.
* **Parameters:** None
* **Returns:** None (prints to console).
* **Error states:** None.

### `BindKeys(bindings)`
* **Description:** Iterates through a binding table and registers each binding via AddGlobalDebugKey. Handles modifier key checks (CTRL, SHIFT, ALT) before executing the bound function.
* **Parameters:** `bindings` -- array of binding definition tables with binding, name, fn, down fields
* **Returns:** None
* **Error states:** None.

## Events & listeners
**Listens to:** None

**Pushes:**
- `ms_nextnightmarephase` -- triggered by SHIFT+F10 to advance nightmare phase
- `ms_nextphase` -- triggered by F10 to advance day phase
- `ms_advanceseason` -- triggered by F3 or PAGEUP to advance season
- `ms_retreatseason` -- triggered by PAGEDOWN to retreat season
- `ms_deltawetness` -- triggered by PAGEUP/PAGEDOWN with SHIFT for wetness adjustment
- `ms_deltamoisture` -- triggered by PAGEUP/PAGEDOWN with CTRL for moisture adjustment
- `ms_setsnowlevel` -- triggered by PAGEUP/PAGEDOWN with ALT for snow level adjustment
- `ms_sendlightningstrike` -- triggered by SHIFT+F5 for lightning strike at position
- `ms_setseasonlength` -- triggered by F5 to set season lengths
- `ms_save` -- triggered by CTRL+S to save game
- `spawnnewboatleak` -- pushed to boat entity for debug leak spawning
- `boatcollision` -- pushed to boat bumper for collision debug