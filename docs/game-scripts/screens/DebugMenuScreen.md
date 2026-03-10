---
id: DebugMenuScreen
title: Debugmenuscreen
description: Provides an in-game debug menu UI overlay for modifying game state, spawning entities, controlling time/weather, and accessing developer tools.
tags: [debug, ui, tool]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 5fc88f2a
system_scope: ui
---

# Debugmenuscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`DebugMenuScreen` is a `Screen` subclass that renders a debug menu interface over the current UI layer. It supports in-game and front-end modes, offering controls for player stats, world state, entity spawning, teleportation, and localization. It integrates with the `menus` module to build hierarchical menu options and interacts with network commands (`c_remote`, `TheNet:SendRemoteExecute`) to apply changes in real time. The screen suppresses the console log by default and manages global pause and time scale during operation.

## Usage example
```lua
-- Typically invoked via a control input (e.g., Shift+Tab), not manually instantiated.
-- Example programmatic launch:
TheFrontEnd:PushScreen("DebugMenuScreen")
```

## Dependencies & tags
**Components used:** None. This is a `Screen` subclass (widget) and does not use ECS components.  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `DebugMenuScreen:OnBecomeActive()`
* **Description:** Initializes and displays the debug menu. Loads player-specific options when in-game (`InGamePlay()`) or front-end options otherwise. Populates menus for spawning, teleporting, player bars, time/weather control, language selection, and crafting ingredients.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Opens a `TextMenu` from the `menus` module; may throw errors if referenced UI or prefabs are misconfigured.

### `DebugMenuScreen:OnControl(control, down)`
* **Description:** Handles UI navigation and menu interaction. Supports `CONTROL_OPEN_DEBUG_MENU`, `CONTROL_CANCEL`, `CONTROL_ACCEPT`, directional controls, and inventory/focus navigation.
* **Parameters:**  
  `control` (string) — The control identifier (e.g., `"CONTROL_ACCEPT"`, `"CONTROL_OPEN_DEBUG_MENU"`).  
  `down` (boolean) — Whether the control was pressed (`true`) or released (`false`).  
* **Returns:** `true` if the control was handled; `false` otherwise.

### `DebugMenuScreen:Close()`
* **Description:** Closes the debug menu and restores game state: unpauses the game, restores the time scale, and removes the screen from the front-end stack.
* **Parameters:** None.
* **Returns:** Nothing.

### `Remote_Spawn(prefab, x, y, z)`
* **Description:** (Local helper) Sends a remote spawn command for a given prefab at coordinates to the server or local world.
* **Parameters:**  
  `prefab` (string) — Prefab name to spawn.  
  `x`, `z` (numbers) — World coordinates.  
* **Returns:** Nothing.

### `ConsoleRemote(cmd, data)`
* **Description:** (Local helper) Formats and executes a console command string via `c_remote`.
* **Parameters:**  
  `cmd` (string) — A `string.format`-style command template (e.g., `"c_spawn('%s')"`).  
  `data` (table, optional) — Arguments to interpolate into `cmd`.  
* **Returns:** Nothing.

## Events & listeners
None identified.