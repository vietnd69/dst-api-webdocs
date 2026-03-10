---
id: main
title: Main
description: Initializes the game environment, configures platform-specific settings, loads core systems and dependencies, and triggers the global initialization sequence.
tags: [startup, platform, config, initialization]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 74dbe051
system_scope: world
---

# Main

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`main.lua` serves as the primary entry point for the Don't Starve Together game runtime. It performs critical low-level setup: overriding Lua module paths, setting up platform detection helpers, initializing global state, registering custom loaders, loading essential subsystems (e.g., mods, tuning, language, networking), and executing the core startup sequence via `ModSafeStartup()`. It does not define a traditional component but orchestrates global initialization for the entire game process.

## Usage example
`main.lua` is automatically executed during game startup and is not added or invoked as a component. Typical interaction occurs implicitly through its exported configuration constants and global state. For example:

```lua
if IsSteam() then
    print("Running on Steam platform")
end

if CHEATS_ENABLED then
    TheSim:EnableCheats(true)
end
```

## Dependencies & tags
**Components used:** None (this is a root initialization script, not an entity component).  
**Tags:** None (does not operate on entities).

## Properties
No public properties are defined as instance variables (since this is not a component class). It defines global constants and tables:
- `MAIN = 1`
- `ENCODE_SAVES`
- `CHEATS_ENABLED`
- `CAN_USE_DBUI`
- `DEBUG_MENU_ENABLED`
- `GAME_SERVER`
- `GameplayOptions = {}`
- `Prefabs`, `Ents`, `AwakeEnts`, etc. (entity tracking tables)
- Global variables such as `TheGlobalInstance`, `TheCamera`, `TheWorld`, `ThePlayer`, `AllPlayers`, `EventAchievements`, `TheRecipeBook`, `TheCookbook`, `ThePlantRegistry`, `TheSkillTree`, `TheGenericKV`, `TheScrapbookPartitions`, `TheCraftingMenuProfile`, `Lavaarena_CommunityProgression`, `TheLoadingTips`, `SaveGameIndex`, `ShardGameIndex`, `ShardSaveGameIndex`, `CustomPresetManager`, `HashesMessageState`, `LastUIRoot`, `IsIntegrityChecking`, and `TheMixer`.

## Main functions
No functions defined in this file are callable *as component methods*. This file contains global functions and initialization logic. The following are key *global* functions defined in the file:

### `IsConsole()`
*   **Description:** Returns `true` if the game is running on a console platform (PS4, Xbox One, or Switch).
*   **Parameters:** None.
*   **Returns:** `true` if on console; otherwise `false`.

### `IsNotConsole()`
*   **Description:** Returns `true` if the game is *not* running on a console.
*   **Parameters:** None.
*   **Returns:** `true` if on PC (Windows, Linux, macOS); otherwise `false`.

### `IsPS4()`, `IsPS5()`, `IsPSN()`, `IsXB1()`, `IsSteam()`, `IsWin32()`, `IsLinux()`, `IsRail()`, `IsSteamDeck()`
*   **Description:** Platform detection helpers that return `true` for specific platform or store configurations.
*   **Parameters:** None.
*   **Returns:** Boolean indicating platform membership.

### `ValidateLineNumber(num)`
*   **Description:** Forwards line number validation to the underlying `TheSim` instance (if available). Used for debugging and editor integration.
*   **Parameters:** `num` (number) — the line number to validate.
*   **Returns:** Nothing.

### `loadfn(modulename)` (internal loader)
*   **Description:** Custom Lua module loader used to load mod Lua files with mod manifest awareness. Used by `package.loaders` to resolve `require()` calls.
*   **Parameters:** `modulename` (string) — dot-separated module path (e.g., `"modname/scripts/mymod"`).
*   **Returns:** A loaded module or an error message string.
*   **Error states:** Returns an error string if the file is not found.

### `ModSafeStartup()`
*   **Description:** The core startup function that initializes game systems, loads mods, instantiates global prefabs (`global`, `event_deps`), and builds global entities (`TheGlobalInstance`, `TheCamera`, etc.). It runs after mod index loading finishes (or synchronously if mods are disabled).
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None documented; assumed to be fatal on critical failure.

## Events & listeners
This file does not register or push game events via `inst:ListenForEvent` or `inst:PushEvent`. It performs top-level initialization before entities or components exist.