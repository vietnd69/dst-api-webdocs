---
id: modindex
title: Modindex
description: Manages mod loading, state, dependencies, configuration, and compatibility for Don't Starve Together.
tags: [modding, network, configuration, lifecycle]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 392da437
system_scope: network
---

# Modindex

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`ModIndex` is a singleton component responsible for tracking all installed and enabled mods, managing their dependencies, loading and validating `modinfo.lua` files, handling configuration persistence, and controlling mod lifecycle during startup. It serves as the central authority for mod metadata, enabling/disabling behavior, API version compatibility, and integration with the game's persistence and network systems (including mod overrides and client-server sync). It does not attach to entities but operates globally via the `KnownModIndex` instance.

## Usage example
```lua
-- Enable a mod
KnownModIndex:Enable("my_mod_name")

-- Check if a mod is currently enabled
if KnownModIndex:IsModEnabled("my_mod_name") then
    print("Mod is enabled.")
end

-- Get list of enabled mod names
local enabled_mods = KnownModIndex:GetModNames()
for _, modname in ipairs(enabled_mods) do
    print("Loaded mod:", modname)
end

-- Load mod configuration options from disk
local config_options = KnownModIndex:LoadModConfigurationOptions("my_mod_name", false)
```

## Dependencies & tags
**Components used:** None (singleton, not attached to an entity instance).  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `startingup` | boolean | `false` | Indicates whether the mod loading sequence is currently in progress. |
| `cached_data` | table | `{}` | Stores a deep copy of `savedata` and `modsettings` when caching state for revert. |
| `savedata` | table | See constructor | Holds persistent mod state, including `known_mods`, `known_api_version`, and `disable_special_event_warning`. |
| `forceddirs` | table | `{}` | Tracks mod directories that are forced via `modsettings.lua` or `modoverrides.lua`. |
| `mod_dependencies` | table | `{ server_dependency_list = {}, dependency_list = {} }` | Tracks dependency relationships for mods. |
| `modsettings` | table | `{ forceenable = {}, disablemods = true, localmodwarning = true }` | Runtime flags for mod behavior (e.g., debug, force enable). |

## Main functions
### `GetModIndexName()`
* **Description:** Returns the base filename used for persistent storage of mod index data (`modindex` or `modindex_dev` in dev branches).
* **Parameters:** None.
* **Returns:** `string` – the filename used for `modindex` persistence.

### `GetModConfigurationPath(modname, client_config)`
* **Description:** Builds the full path to a mod's configuration file, appending `_CLIENT` if `client_config` is `true` and the mod is client-only.
* **Parameters:**  
  `modname` (string) – the mod's directory name.  
  `client_config` (boolean) – whether this is client-side config.  
* **Returns:** `string` – full file path.

### `BeginStartupSequence(callback)`
* **Description:** Initiates the mod loading sequence. On non-dedicated servers, it saves a "loading" marker to detect bad loads; on dedicated servers, it disables all mods by default (expecting re-enablement via `modoverrides.lua`).
* **Parameters:**  
  `callback` (function) – called after startup setup completes.  
* **Returns:** Nothing.

### `EndStartupSequence(callback)`
* **Description:** Finalizes the mod loading sequence by saving a "done" marker and logging success.
* **Parameters:**  
  `callback` (function) – called after completion.  
* **Returns:** Nothing.

### `GetModsToLoad(usecached)`
* **Description:** Returns a list of mod directories to be loaded, considering enabled, forced, and temp-enabled status, and skipping temp-disabled mods. Supports standalone mod early-return behavior.
* **Parameters:**  
  `usecached` (boolean) – if `true`, uses `savedata.known_mods` instead of scanning disk.  
* **Returns:** `table` – list of mod directory names (strings).

### `GetModInfo(modname)`
* **Description:** Returns the loaded `modinfo` table for the given mod name, or `nil` if unknown.
* **Parameters:**  
  `modname` (string) – the mod's directory name.  
* **Returns:** `table?` – modinfo data (e.g., `version`, `api_version`, `name`, `configuration_options`). Returns `{}` if missing, `nil` if mod is unknown.

### `Load(callback)`
* **Description:** Loads persistent mod index data from disk, parses it via sandbox, and updates `modinfo` for all known mods.
* **Parameters:**  
  `callback` (function) – called after loading and parsing complete.  
* **Returns:** Nothing.

### `Enable(modname)` / `Disable(modname)`
* **Description:** Marks a mod as enabled or disabled in `savedata.known_mods`. Resets failure/incompatibility flags on enable.
* **Parameters:**  
  `modname` (string) – the mod's directory name.  
* **Returns:** Nothing.

### `IsModEnabled(modname)` / `IsModEnabledAny(modname)`
* **Description:**  
  `IsModEnabled`: Checks if the mod is persistently enabled.  
  `IsModEnabledAny`: Checks if the mod is enabled, forced-enabled, or temp-enabled, and not temp-disabled.
* **Parameters:**  
  `modname` (string) – the mod's directory name.  
* **Returns:** `boolean`.

### `LoadModInfo(modname, prev_info)`
* **Description:** Loads and parses `modinfo.lua` for a mod, validates required fields and API version, resolves dependencies (including fallbacks), and returns normalized modinfo.
* **Parameters:**  
  `modname` (string) – the mod's directory name.  
  `prev_info` (table?) – previous modinfo to preserve if version unchanged.  
* **Returns:** `table` – the parsed and validated `modinfo` structure.

### `GetModDependencies(modname, recursive, rec_deps)`
* **Description:** Returns a flat list of mod names directly or transitively required by `modname`.
* **Parameters:**  
  `modname` (string) – the mod's directory name.  
  `recursive` (boolean) – if `true`, includes transitive dependencies.  
  `rec_deps` (table?) – internal use for recursion to track visited nodes.  
* **Returns:** `table` – list of dependency mod names.

### `DoModsExistAnyVersion(modlist)`
* **Description:** Checks if all mods in a list exist (any version) in the known index.
* **Parameters:**  
  `modlist` (table) – list of mod names.  
* **Returns:** `boolean`.

### `Save(callback)`
* **Description:** Serializes and writes the current `savedata` to persistent storage. Skipped on consoles.
* **Parameters:**  
  `callback` (function?) – called after write completes.  
* **Returns:** Nothing.

### `GetModConfigurationOptions_Internal(modname, force_local_options)`
* **Description:** Returns the configuration options table for a mod, prioritizing temp options when appropriate (e.g., frontend, temp-enabled state).
* **Parameters:**  
  `modname` (string) – the mod's directory name.  
  `force_local_options` (boolean) – if `true`, skips temp state and uses persisted options.  
* **Returns:** `table?` – configuration options table; second return value is a boolean indicating if the table is temporary.

### `SetConfigurationOption(modname, option_name, value)`
* **Description:** Updates the saved value for a specific configuration option.
* **Parameters:**  
  `modname` (string) – the mod's directory name.  
  `option_name` (string) – the option's name (must match `configuration_options[i].name`).  
  `value` (any) – the value to persist.  
* **Returns:** Nothing.

### `LoadModConfigurationOptions(modname, client_config)`
* **Description:** Loads saved configuration from disk for a mod. Handles fallback for missing config and updates `modinfo.configuration_options`.
* **Parameters:**  
  `modname` (string) – the mod's directory name.  
  `client_config` (boolean) – whether loading client-side config.  
* **Returns:** `table?` – configuration options table, or `nil` if mod is unknown.

### `UpdateModSettings()`
* **Description:** Parses `modsettings.lua` to populate `modsettings` (e.g., forced mods, debug flags).
* **Parameters:** None.
* **Returns:** Nothing.

### `UpdateModInfo()`
* **Description:** Scans the disk for mod directories and updates `modinfo` for all known mods (including forced ones), removing entries for missing mods unless they are temporarily enabled.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
None identified. `ModIndex` does not register or dispatch events.