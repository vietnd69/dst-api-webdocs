---
id: mods
title: Mods
description: Manages the lifecycle of mods, including loading, registering prefabs, version checking, and frontend integration.
tags: [modding, lifecycle, worldgen, server]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 06ad7669
system_scope: world
---

# Mods

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The `Mods` component (implemented via the `ModWrangler` class and its singleton `ModManager`) handles the entire mod lifecycle: loading mod files, registering prefabs, applying overrides, initializing post-init callbacks, and managing mod version compatibility and safety. It interfaces with the mod infrastructure (`KnownModIndex`, `ModManager`, `TheNet`) and provides environments (`CreateEnvironment`) for mod Lua code to execute in.

## Usage example
```lua
-- Typical mod usage: register prefabs and use post-init hooks
ModManager:RegisterPrefabs()

-- Trigger post-init callbacks for all enabled mods
ModManager:SimPostInit(player_instance)

-- Check enabled server mod names
local server_mod_names = ModManager:GetEnabledServerModNames()

-- Load a mod in the frontend (e.g., to populate world gen options)
ModManager:FrontendLoadMod("my_mod_id")
```

## Dependencies & tags
**Components used:** None directly (this is a script, not a component). It uses external modules via `require`, notably: `modutil`, `map/lockandkey`, `screens/modwarningscreen`, `prefabs`, `class`.  
**Tags:** None.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `modnames` | table | `{}` | List of mod directory names being loaded. |
| `mods` | table | `{}` | List of environment tables for each loaded mod. |
| `records` | table | `{}` | Runtime records of mod states. |
| `failedmods` | table | `{}` | List of mods that failed to load, with error details. |
| `enabledmods` | table | `{}` | List of enabled mod names. |
| `loadedprefabs` | table | `{}` | List of mod prefab names registered in the sim. |
| `servermods` | table or `nil` | `nil` | Cached list of server mod names (client-side only). |
| `currentlyloadingmod` | string or `nil` | `nil` | Name of the mod currently being loaded. |
| `worldgen` | boolean or `nil` | `nil` | Whether the current load is for world generation. |

## Main functions
### `GetEnabledModNames()`
*   **Description:** Returns the list of currently enabled mod names.
*   **Parameters:** None.
*   **Returns:** `table` — List of enabled mod name strings.

### `GetEnabledServerModNames()`
*   **Description:** Returns the list of enabled *server* mods (non-client-only) suitable for use on the server or in a dedicated environment.
*   **Parameters:** None.
*   **Returns:** `table` — List of enabled server mod name strings.

### `LoadMods(worldgen)`
*   **Description:** Loads all enabled mods, applying overrides and loading modmain.lua (and optionally modworldgenmain.lua).
*   **Parameters:** `worldgen` (boolean, optional) — If true, loads mods for worldgen mode only.
*   **Returns:** Nothing.

### `RegisterPrefabs()`
*   **Description:** Iterates over enabled mods, loads their `prefabs/*.lua` files, and registers the resulting prefabs with the global `Prefabs` table. Also creates a default `MOD_<modname>` prefab for asset loading.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `FrontendLoadMod(modname)`
*   **Description:** Partially loads a mod for frontend use (e.g., world gen options, settings), loading `modservercreationmain.lua` and `modworldgenmain.lua` only.
*   **Parameters:** `modname` (string) — Mod directory name.
*   **Returns:** Nothing.

### `InitializeModMain(modname, env, mainfile, safe)`
*   **Description:** Loads and executes the given mod main file (`modmain.lua`, `modworldgenmain.lua`, or `modservercreationmain.lua`) in a custom environment.
*   **Parameters:**
    *   `modname` (string) — Mod directory name.
    *   `env` (table) — Custom environment table for the mod to run in.
    *   `mainfile` (string) — Filename to load (e.g., `"modmain.lua"`).
    *   `safe` (boolean) — If true, executes in a safe environment via `RunInEnvironmentSafe`.
*   **Returns:** `boolean` — `true` if successful or no file found; `false` on error.

### `SetPostEnv()`
*   **Description:** Runs `GamePostInit` callbacks, displays mod warnings if needed, and shows error dialogs for failed mods.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SimPostInit(wilson)`
*   **Description:** Runs `SimPostInit` callbacks for all enabled mods (e.g., character-specific initialization).
*   **Parameters:** `wilson` (entity) — The player entity (typically Wilson or default).
*   **Returns:** Nothing.

### `GetPostInitFns(type, id)`
*   **Description:** Returns a list of post-init function closures for a given callback type and optional ID (e.g., `"GamePostInit"`, `"prefabpostinit"`).
*   **Parameters:**
    *   `type` (string) — Callback type (e.g., `"GamePostInit"`, `"simpostinit"`).
    *   `id` (string, optional) — Specific ID (e.g., prefab name) if filtering per-ID.
*   **Returns:** `table` — List of closures (mod functions wrapped in error handling).

### `GetPostInitData(type, id)`
*   **Description:** Returns a list of post-init data entries for a given callback type and optional ID.
*   **Parameters:** Same as `GetPostInitFns`.
*   **Returns:** `table` — List of data tables returned by mods during initialization.

### `GetVoteCommands()`
*   **Description:** Aggregates vote commands defined by mods into a single command table.
*   **Parameters:** None.
*   **Returns:** `table` — Key-value map of command names to command functions.

### `IsModCharacterClothingSymbolExcluded(name, symbol)`
*   **Description:** Checks if a given clothing symbol is explicitly excluded for a character by any mod.
*   **Parameters:**
    *   `name` (string) — Character prefab name.
    *   `symbol` (string) — Clothing symbol name (e.g., `"BEEFALO_HAT"`).
*   **Returns:** `boolean` — `true` if excluded, otherwise `false`.

### `StartVersionChecking()`
*   **Description:** Begins periodic mod version verification for server mods that require all clients to have the same mod.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetLinkForMod(mod_name)`
*   **Description:** Returns a closure that opens the appropriate mod webpage (Workshop or forum thread) and a flag indicating whether it’s a generic link.
*   **Parameters:** `mod_name` (string) — Mod directory name.
*   **Returns:**
    *   `function` — A closure that, when called, opens the URL.
    *   `boolean` — `true` if the link is generic (non-thread-specific).

### `AreServerModsEnabled()`, `AreAnyModsEnabled()`, `AreAnyClientModsEnabled()`, `AreClientModsDisabled()`
*   **Description:** Helper functions that query `ModManager` and `KnownModIndex` for mod status. Typically used in gameplay logic.
*   **Parameters:** None.
*   **Returns:** `boolean`.

## Events & listeners
None. The `ModManager` singleton is not an entity component and does not register or push game events.