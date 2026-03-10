---
id: modutil
title: Modutil
description: Provides utility functions and API hooks for mod configuration, world generation, and runtime initialization in Don't Starve Together.
tags: [modding, world, crafting, network]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 8abdb99e
system_scope: world
---

# Modutil

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`modutil.lua` is a core utility module for DST modding that exposes a standardized environment (`env`) to modders via `InsertPostInitFunctions`. It provides hooks for injecting custom logic at key initialization stages (e.g., before/after levels, prefabs, recipes) and exposes world generation, crafting, networking, and character registration APIs. This module is not a component, but a foundational runtime helper that populates the global `env` table passed into `modmain.lua` and `modworldgenmain.lua`.

Key responsibilities include:
- Registering world generation elements (levels, task sets, rooms, locations).
- Supporting recipe creation and filtering (including custom crafting filters).
- Enabling post-initialization hooks for prefabs, components, state graphs, and shaders.
- Handling RPC registration and mod-specific user commands.
- Managing debug/error output and mod character registration.

## Usage example
```lua
-- In modmain.lua or modworldgenmain.lua
local modutil = require "modutil"

functionModInit()
    modutil.InsertPostInitFunctions(_G, false, false)

    AddGamePostInit(function()
        print("Game fully initialized.")
    end)

    AddPlayerPostInit(function(inst)
        if inst:HasTag("player") then
            inst.components.inventory:PushEvent("onopen")
        end
    end)

    AddRecipe2("custom_sword", {
        Ingredient("bone_shard", 3),
        Ingredient("amber", 1),
    }, "ALCHEMY", { nutrition = 10 })
end
```

## Dependencies & tags
**Components used:** None (this is not a component itself).
**Tags:** Adds mod characters to `CHARACTER_GENDERS` and `MODCHARACTERLIST`; uses `modassert`/`moderror` for validation.

## Properties
No public properties exposed in the module's returned table. All functionality is via functions inserted into `env` during `InsertPostInitFunctions`.

## Main functions

### `InsertPostInitFunctions(env, isworldgen, isfrontend)`
*   **Description:** Populates the `env` table passed by the game with modding APIs. It conditionally exposes only worldgen-safe functions if `isworldgen` is `true`, and frontend-specific functions if `isfrontend` is `true`.
*   **Parameters:**
    *   `env` (table) — The environment table to populate (typically `_G` or a mod-specific table).
    *   `isworldgen` (boolean) — If `true`, only worldgen-compatible APIs are added (e.g., no player/HUD hooks).
    *   `isfrontend` (boolean) — If `true`, adds frontend reload hooks (e.g., `ReloadFrontEndAssets`).
*   **Returns:** Nothing.
*   **Error states:** None documented — this is a setup function and is non-failing by design.

### `ModInfoname(name)`
*   **Description:** Returns a display-friendly name for a mod, combining the mod ID with its "fancy name" from `modinfo.lua` if available.
*   **Parameters:** `name` (string) — The mod ID (e.g., `"my_mod"`).
*   **Returns:** `string` — Either `"my_mod (My Mod)"` or just `"my_mod"` if no fancy name exists.

### `AddModCharacter(name, gender, modes)`
*   **Description:** Registers a new mod character, adding it to `MODCHARACTERLIST` and `CHARACTER_GENDERS`. Logs a warning if gender is omitted.
*   **Parameters:**
    *   `name` (string) — The prefab name of the character.
    *   `gender` (string, optional) — One of `"FEMALE"`, `"MALE"`, `"ROBOT"`, `"NEUTRAL"`, or `"PLURAL"`.
    *   `modes` (table) — A list of game modes the character supports.
*   **Returns:** Nothing.

### `RemoveDefaultCharacter(name)`
*   **Description:** Removes a default character from the available list (used to prevent conflicting characters). Adds the name to `MODCHARACTEREXCEPTIONS_DST`.
*   **Parameters:** `name` (string) — The prefab name of the default character to remove.
*   **Returns:** Nothing.

### `moderror(message, level)`
*   **Description:** Raises an error with the mod’s name prepended, unless mod debug mode is disabled (in which case it prints a warning).
*   **Parameters:**
    *   `message` (string) — The error message.
    *   `level` (number, optional) — Error stack level (passed to `error()`).
*   **Returns:** Nothing or calls `error()`.

### `modassert(test, message)`
*   **Description:** Asserts `test`; if false, calls `moderror(message)`.
*   **Parameters:**
    *   `test` (any) — Value to assert (truthy passes, falsy fails).
    *   `message` (string, optional) — Error message on failure.
*   **Returns:** `test` if truthy; otherwise aborts execution via `moderror`.

### `modprint(...)`
*   **Description:** Prints arguments to console only if mod debug mode is enabled.
*   **Parameters:** Arbitrary arguments (passed to `print()`).
*   **Returns:** Nothing.

### `GetModConfigData(optionname, modname, get_local_config)`
*   **Description:** Retrieves the current value of a config option from `modconfiguration.lua`. Prioritizes server-side saved values (`saved_server`) unless `get_local_config` is `true`, then prefers `saved_client`, `saved`, or `default`.
*   **Parameters:**
    *   `optionname` (string) — The config option key.
    *   `modname` (string) — The mod ID (required if not called inside `modmain`/`modworldgenmain`).
    *   `get_local_config` (boolean, optional) — If `true`, prefer local client config.
*   **Returns:** `any?` — The config value or `nil` if not found.

### `AddClassPostConstruct(package, postfn)`
*   **Description:** Registers a function to run after a class constructor finishes. Similar to `AddClassPostInit` but for class definitions.
*   **Parameters:**
    *   `package` (string) — Path to the class file (e.g., `"prefabs/wolf"`).
    *   `postfn` (function) — Function taking `(self, ...)` as arguments.
*   **Returns:** Nothing.

### `AddPrefabPostInit(prefab, fn)`
*   **Description:** Registers a function to run after a specific prefab is spawned. Called on both server and client.
*   **Parameters:**
    *   `prefab` (string) — The prefab name (e.g., `"woodie"`).
    *   `fn` (function) — Function taking `(inst)` as argument.
*   **Returns:** Nothing.

### `AddPlayerPostInit(fn)`
*   **Description:** Convenience wrapper for `AddPrefabPostInitAny` that filters for player prefabs (`inst:HasTag("player")`).
*   **Parameters:** `fn` (function) — Function taking `(inst)` as argument.
*   **Returns:** Nothing.

### `AddRecipe2(name, ingredients, tech, config, filters)`
*   **Description:** Creates and registers a new recipe. Automatically assigns the recipe to appropriate filters (e.g., `"MODS"` or `"CRAFTING_STATION"`).
*   **Parameters:**
    *   `name` (string) — Recipe ID.
    *   `ingredients` (table) — List of `Ingredient(...)` entries.
    *   `tech` (string) — Tech node required (e.g., `"ALCHEMY"`).
    *   `config` (table, optional) — Config options like `nutrition`, `builder_tag`, etc.
    *   `filters` (table, optional) — Additional custom filter names.
*   **Returns:** `Recipe2` — The created recipe instance.

### `AddAction(id, str, fn)`
*   **Description:** Registers a custom in-game action (e.g., for UI buttons or hotkeys).
*   **Parameters:**
    *   `id` (string or `Action` instance) — Action ID or an existing action object (backward compatibility).
    *   `str` (string) — Display name of the action.
    *   `fn` (function) — Callback `(action)` for handling the action.
*   **Returns:** `Action` — The registered action.

### `AddModRPCHandler(namespace, name, fn)`
*   **Description:** Registers a server-side RPC handler for a mod-specific network call.
*   **Parameters:**
    *   `namespace` (string) — RPC namespace (e.g., mod ID).
    *   `name` (string) — RPC function name.
    *   `fn` (function) — Handler accepting `(data)` and returning `nil`.
*   **Returns:** Nothing.

### `GetModConfigData(optionname, modname, get_local_config)`
*   **Description:** Retrieves the current value of a config option from `modconfiguration.lua`. Prioritizes server-side saved values (`saved_server`) unless `get_local_config` is `true`, then prefers `saved_client`, `saved`, or `default`.
*   **Parameters:**
    *   `optionname` (string) — The config option key.
    *   `modname` (string) — The mod ID (required if not called inside `modmain`/`modworldgenmain`).
    *   `get_local_config` (boolean, optional) — If `true`, prefer local client config.
*   **Returns:** `any?` — The config value or `nil` if not found.

### `SetLoadingTipCategoryWeights(weighttable, weightdata)`
*   **Description:** Updates category weights for loading screen tips (used to bias tip selection early/late in gameplay).
*   **Parameters:**
    *   `weighttable` (table) — Either `LOADING_SCREEN_TIP_CATEGORY_WEIGHTS_START` or `LOADING_SCREEN_TIP_CATEGORY_WEIGHTS_END`.
    *   `weightdata` (table) — Map of category names to numeric weights.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None directly (this module sets up handlers but does not listen for events itself).
- **Pushes:** None directly (does not fire events itself).
