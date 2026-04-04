---
id: debugkeys
title: Debugkeys
description: This module defines a comprehensive set of debug key bindings, console command wrappers, and development utilities for manipulating world state, player attributes, entity components, and simulation parameters in the Don't Starve Together simulation, including mouse actions and farming nutrient controls.
tags: [debugging, utilities, development, input, simulation]
sidebar_position: 10

last_updated: 2026-03-21
build_version: 714014
change_status: stable
category_type: root
source_hash: 7d678f15
system_scope: world
---

# Debugkeys

> Based on game build **714014** | Last updated: 2026-03-21

## Overview
The `debugkeys` module provides a comprehensive framework for development and testing within Don't Starve Together. It registers global and gameplay-specific keyboard shortcuts to manipulate simulation parameters, entity states, and world topology. Key features include console command wrappers for spawning and removing entities, direct component manipulation (health, hunger, sanity), map tile editing, and simulation control (pause, step, time scale). It also handles mouse debug actions for entity inspection and removal, and facilitates remote command execution between client and server. This module is essential for developers needing to rapidly iterate on game mechanics or verify entity behaviors without standard gameplay constraints.

## Usage example
```lua
-- Register a global debug key to print player position
AddGlobalDebugKey(KEYS.F5, function()
    if ThePlayer then
        local pos = ThePlayer.Transform:GetWorldPosition()
        print("Player at:", pos.x, pos.y, pos.z)
    end
end)

-- Spawn a beefalo using the debug wrapper
d_c_spawn("beefalo", 1)

-- Teleport player to mouse position
DebugKeyHandler_T()

-- Force next hounded wave
DebugKeyHandler_H()
```

## Dependencies & tags

**External dependencies:**
- `TheWorld` -- Accessed for simulation state, topology, and event pushing
- `TheSim` -- Used for debug pause, stepping, and entity finding
- `TheInput` -- Used for key state checks and mouse position
- `TheFrontEnd` -- Used to toggle debug panels and UI
- `TheInventory` -- Used for debug gift functions
- `ConsoleCommandPlayer` -- Called to get the player entity for commands
- `GLOBAL` -- Used to expose global variables
- `Profile` -- Checked for threaded render setting
- `Vector3` -- Used for coordinate calculations
- `SpawnPrefab` -- Called to instantiate entities
- `ConsoleRemote` -- Called to execute commands on server from client
- `consolecommands` -- Required for console command functions
- `scripts/reload.lua` -- Required and reloaded for hot-reload functionality
- `dbui_no_package` -- Conditionally required for debug UI modules
- `ThePlayer` -- Used to access local player components and position
- `TheCamera` -- Used to access target position and heading
- `TUNING` -- Used to access game balance constants like TOTAL_DAY_TIME
- `Ents` -- Iterated to find specific prefabs in the world
- `DebugKeyPlayer` -- Called to get the debug key player instance
- `PostProcessor` -- Used to set colour cube data
- `require` -- Used to load map/levels, map/tasks, map/tasksets, map/rooms, prefabs/skilltree_defs
- `usercommands` -- Required to run user commands for emotes

**Components used:**
- `domesticatable` -- Accessed to print tendencies on beefalo
- `health` -- Accessed to modify health on boat bumpers
- `inventory` -- Accessed to equip items on console player
- `transform` -- Used to set entity positions
- `network` -- Used to get network ID for remote removal
- `sanity` -- Accessed to modify sanity via DoDelta or SetPercent
- `hunger` -- Accessed to modify hunger via DoDelta
- `temperature` -- Referenced for debug delta modification
- `pickable` -- Accessed to Pick or Regen plants
- `fueled` -- Accessed to SetPercent fuel
- `harvestable` -- Accessed to Grow produce
- `growable` -- Accessed to DoGrowth
- `perishable` -- Accessed to Perish item
- `setter` -- Accessed to SetSetTime and StartSetting
- `cooldown` -- Accessed to LongUpdate
- `locomotor` -- Checked for teleport target validation
- `walkableplatform` -- Accessed to get players on boat platform
- `inventoryitem` -- Accessed to SetLanded state
- `herdmember` -- Accessed to find herd association
- `herd` -- Accessed to iterate members
- `periodicspawner` -- Accessed to TrySpawn
- `mood` -- Accessed to SetIsInMood
- `knownlocations` -- Accessed to GetLocation
- `hounded` -- Accessed to ForceNextWave
- `skilltreeupdater` -- Accessed to manage skill XP and activation
- `farming_manager` -- Accessed via TheWorld.components to get and add tile nutrients
- `Transform` -- Used to get world position or set entity position
- `Map` -- Used to get tile coordinates, tile type, and set tile type
- `HUD` -- Accessed on ThePlayer to toggle visibility

**Tags:**
- `player` -- check
- `boatbumper` -- check
- `FX` -- check
- `NOCLICK` -- check
- `DECOR` -- check
- `INLIMBO` -- check
- `_inventoryitem` -- check
- `wall` -- check

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|

## Main functions

### `dumpvariabletostr(var)`
* **Description:** Converts a variable to a string format using type-specific formatting functions.
* **Parameters:**
  - `var` -- The variable to convert to a string representation
* **Returns:** string representation of the variable
* **Error states:** Asserts if the type is not found in fcts table

### `d_c_spawn(prefab, count, dontselect)`
* **Description:** Wrapper for c_spawn that handles network replication for client/server.
* **Parameters:**
  - `prefab` -- String name of the prefab to spawn
  - `count` -- Number of entities to spawn
  - `dontselect` -- Boolean flag to prevent auto-selection
* **Returns:** nil

### `d_c_give(prefab, count, dontselect)`
* **Description:** Wrapper for c_give that handles network replication for client/server.
* **Parameters:**
  - `prefab` -- String name of the prefab to give
  - `count` -- Number of items to give
  - `dontselect` -- Boolean flag to prevent auto-selection
* **Returns:** nil

### `d_c_remove(entity)`
* **Description:** Removes an entity, handling network ID serialization for remote execution.
* **Parameters:**
  - `entity` -- Entity instance to remove, defaults to mouse entity
* **Returns:** nil
* **Error states:** Returns early if world or mouse entity is nil

### `d_c_removeall(entity)`
* **Description:** Removes all entities of the same prefab type.
* **Parameters:**
  - `entity` -- Entity instance to match for removal, defaults to mouse entity
* **Returns:** nil

### `DebugKeyPlayer()`
* **Description:** Retrieves the console command player entity if on master server.
* **Parameters:** None
* **Returns:** Entity or nil
* **Error states:** Returns nil if not master sim or no player

### `DoDebugKey(key, down)`
* **Description:** Iterates through registered handlers for a specific key and executes them.
* **Parameters:**
  - `key` -- Key code identifier
  - `down` -- Boolean indicating key press state
* **Returns:** true if handled, nil otherwise

### `AddGameDebugKey(key, fn, down)`
* **Description:** Registers a debug key handler that only activates during gameplay.
* **Parameters:**
  - `key` -- Key code identifier
  - `fn` -- Function to execute on key event
  - `down` -- Boolean indicating whether to trigger on key down (default true)
* **Returns:** nil

### `AddGlobalDebugKey(key, fn, down)`
* **Description:** Registers a debug key handler that activates globally regardless of game state.
* **Parameters:**
  - `key` -- Key code identifier
  - `fn` -- Function to execute on key event
  - `down` -- Boolean indicating whether to trigger on key down (default true)
* **Returns:** nil

### `SimBreakPoint()`
* **Description:** Toggles the simulation debug pause state.
* **Parameters:** None
* **Returns:** nil

### `DoDebugMouse(button, down, x, y)`
* **Description:** Routes mouse button events to corresponding debug handler functions.
* **Parameters:**
  - `button` -- number, mouse button identifier (MOUSEBUTTON_RIGHT or MOUSEBUTTON_LEFT)
  - `down` -- boolean, true if mouse button is pressed
  - `x` -- number, mouse x coordinate
  - `y` -- number, mouse y coordinate
* **Returns:** false if not down, otherwise nil
* **Error states:** Returns false immediately if down is false

### `DoReload()`
* **Description:** Reloads the scripts/reload.lua module to refresh debug scripts.
* **Parameters:** None
* **Returns:** nil

### `Spawn(prefab)`
* **Description:** Helper function to spawn a prefab entity.
* **Parameters:**
  - `prefab` -- String name of the prefab to spawn
* **Returns:** Entity instance

### `BindKeys(bindings)`
* **Description:** Iterates through a binding table and registers keys using AddGlobalDebugKey.
* **Parameters:**
  - `bindings` -- Table of key binding configurations
* **Returns:** nil

### `try_boat_teleport(boat, x, y, z)`
* **Description:** Teleports a boat entity and its attached items to a new position, handling physics and platform updates.
* **Parameters:**
  - `boat` -- Entity instance of the boat to teleport
  - `x` -- Number, target X coordinate
  - `y` -- Number, target Y coordinate
  - `z` -- Number, target Z coordinate
* **Returns:** boolean, true if successful

### `DebugKeyHandler_PAGEUP()`
* **Description:** Increases wetness, moisture, snow level, or advances season based on modifier keys.
* **Parameters:** None
* **Returns:** boolean, true

### `DebugKeyHandler_PAGEDOWN()`
* **Description:** Decreases wetness, moisture, snow level, or retreats season based on modifier keys.
* **Parameters:** None
* **Returns:** boolean, true

### `DebugKeyHandler_O()`
* **Description:** Scans map levels, tasks, and rooms for specific tags like Chester_Eyebone when Shift is held.
* **Parameters:** None
* **Returns:** boolean, true

### `DebugKeyHandler_F9()`
* **Description:** Triggers a LongUpdate with 25% of total day time.
* **Parameters:** None
* **Returns:** boolean, true

### `DebugKeyHandler_F11()`
* **Description:** Automatically picks all planted carrot entities in the world.
* **Parameters:** None
* **Returns:** boolean, true

### `DebugKeyHandler_1()`
* **Description:** Teleports the main character to the next teleportato part location when Ctrl is held.
* **Parameters:** None
* **Returns:** boolean, true or nil
* **Error states:** Returns nil if Ctrl is not held

### `DebugKeyHandler_X()`
* **Description:** Selects the entity under the mouse or equips the player's hand item when Ctrl is held.
* **Parameters:** None
* **Returns:** boolean, true

### `DebugKeyHandler_LEFTBRACKET()`
* **Description:** Adjusts simulation time scale or resets player skill tree XP based on modifier keys.
* **Parameters:** None
* **Returns:** boolean, true

### `DebugKeyHandler_RIGHTBRACKET()`
* **Description:** Adjusts simulation time scale or adds skill tree XP based on modifier keys.
* **Parameters:** None
* **Returns:** boolean, true

### `DebugKeyHandler_KP_PLUS()`
* **Description:** Increases player health, hunger, or sanity via remote commands or direct component calls.
* **Parameters:** None
* **Returns:** boolean, true

### `DebugKeyHandler_KP_MINUS()`
* **Description:** Decreases player health, hunger, or sanity via remote commands or direct component calls.
* **Parameters:** None
* **Returns:** boolean, true

### `DebugKeyHandler_T()`
* **Description:** Teleports the player or selected entity to the mouse map position, handling boat platforms.
* **Parameters:** None
* **Returns:** boolean, true

### `DebugKeyHandler_G()`
* **Description:** Triggers growth, fuel, harvest, regen, perish, setting, cooldown, or domestication on the mouse entity when Ctrl is held.
* **Parameters:** None
* **Returns:** boolean, true

### `DebugKeyHandler_D()`
* **Description:** Prepares to modify map tiles at the world position under the mouse when Shift is held.
* **Parameters:** None
* **Returns:** None

### `DebugKeyHandler_K()`
* **Description:** Removes selected entity or teleports to monkeyhut based on modifier keys.
* **Parameters:** None
* **Returns:** boolean, true

### `DebugKeyHandler_L()`
* **Description:** Prints map node and tile information around the player or resets loading widget if no world.
* **Parameters:** None
* **Returns:** None
* **Error states:** Returns early if ThePlayer is nil

### `DebugKeyHandler_KP_DIVIDE_GLOBAL()`
* **Description:** Toggles frame profiler or debug texture visibility based on modifier keys.
* **Parameters:** None
* **Returns:** boolean, true

### `DebugKeyHandler_EQUALS()`
* **Description:** Updates debug texture value or increments map overlay lerp value.
* **Parameters:** None
* **Returns:** boolean, true

### `DebugKeyHandler_MINUS()`
* **Description:** Updates debug texture value or decrements map overlay lerp value.
* **Parameters:** None
* **Returns:** boolean, true

### `DebugKeyHandler_M()`
* **Description:** Toggles fog of war, revealed areas, or reveals entire map based on modifier keys.
* **Parameters:** None
* **Returns:** boolean, true

### `DebugKeyHandler_N()`
* **Description:** Teleports player to the next node.
* **Parameters:** None
* **Returns:** None

### `DebugKeyHandler_S()`
* **Description:** Triggers a world save event remotely or locally when Ctrl is held.
* **Parameters:** None
* **Returns:** boolean, true
* **Error states:** Returns nil if Ctrl is not held

### `DebugKeyHandler_KP_MULTIPLY()`
* **Description:** Gives a devtool item if debug toggle is enabled.
* **Parameters:** None
* **Returns:** boolean, true
* **Error states:** Returns nil if debug toggle is disabled

### `DebugKeyHandler_KP_DIVIDE_GAME()`
* **Description:** Drops everything from the debug key player inventory if debug toggle is enabled.
* **Parameters:** None
* **Returns:** boolean, true
* **Error states:** Returns nil if debug toggle is disabled or no player

### `DebugKeyHandler_C()`
* **Description:** Resets colour cube or teleports selected entity to rookery based on user name and modifiers.
* **Parameters:** None
* **Returns:** boolean, true

### `DebugKeyHandler_PAUSE()`
* **Description:** Toggles debug pause and debug camera, configuring render settings.
* **Parameters:** None
* **Returns:** boolean, true

### `DebugKeyHandler_H()`
* **Description:** Toggles HUD, forces hounded wave, or cycles through herd members based on modifiers.
* **Parameters:** None
* **Returns:** boolean, true

### `DebugKeyHandler_J()`
* **Description:** Triggers periodic spawner or sets mood on selected entity based on Shift key.
* **Parameters:** None
* **Returns:** boolean, true

### `DebugKeyHandler_INSERT()`
* **Description:** Enables debug render, toggles debug camera, or toggles physics render based on modifiers.
* **Parameters:** None
* **Returns:** boolean, true
* **Error states:** Returns nil if debug toggle is disabled

### `DebugKeyHandler_I()`
* **Description:** Spawns dragonfly, light flower, or locks lavae targets based on modifiers.
* **Parameters:** None
* **Returns:** boolean, true

### `DebugRMB(x, y)`
* **Description:** Handles right mouse button debug actions including spawning selected prefab, removing entities, killing entities under cursor, or inspecting entities.
* **Parameters:**
  - `x` -- number, screen or world x coordinate
  - `y` -- number, screen or world y coordinate
* **Returns:** nil

### `DebugLMB(x, y)`
* **Description:** Handles left mouse button debug action to set debug entity if simulation is paused.
* **Parameters:**
  - `x` -- number, screen or world x coordinate
  - `y` -- number, screen or world y coordinate
* **Returns:** nil

### `d_addemotekeys()`
* **Description:** Registers numpad keys to trigger specific player emote user commands.
* **Parameters:** None
* **Returns:** nil

### `d_gettiles()`
* **Description:** Scans a grid around the player for farming soil tiles and prints their coordinates.
* **Parameters:** None
* **Returns:** nil

## Events & listeners

**Listens to:**
- `onattackother` -- Listened conditionally on player entity when F1 is pressed

**Pushes:**
- `ms_nextnightmarephase` -- Pushed on TheWorld to advance nightmare phase
- `ms_nextphase` -- Pushed on TheWorld to advance day phase
- `ms_advanceseason` -- Pushed on TheWorld to advance season
- `spawnnewboatleak` -- Pushed on boat entity to spawn a leak
- `boatcollision` -- Pushed on boat bumper entity to simulate collision
- `ms_sendlightningstrike` -- Pushed on TheWorld to trigger lightning
- `ms_setseasonlength` -- Pushed on TheWorld to modify season length
- `ms_deltawetness` -- Pushed to TheWorld to change wetness level
- `ms_deltamoisture` -- Pushed to TheWorld to change moisture level
- `ms_setsnowlevel` -- Pushed to TheWorld to set snow level
- `ms_retreatseason` -- Pushed to TheWorld to retreat the season
- `ms_save` -- Pushed to TheWorld to trigger a save