---
id: mods
title: Mods
description: Central mod management system that handles mod loading, initialization, prefab registration, and lifecycle events for Don't Starve Together mods.
tags: [mods, system, lifecycle]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: system
source_hash: 5914aeca
system_scope: network
---

# Mods

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`mods.lua` defines the core mod management system for Don't Starve Together. It provides the `ModWrangler` class (instantiated as the global `ModManager` singleton) that handles all aspects of mod lifecycle: loading mod files, creating sandboxed environments, registering prefabs, executing post-init hooks, and managing mod errors. The file also exports numerous global utility functions for querying mod state, versions, and configuration. Mod release IDs are registered via `AddModReleaseID()` to allow mods to conditionally support beta features without crashing on live branches.

## Usage example
```lua
-- Query mod state via global functions
if AreServerModsEnabled() then
    print("Server mods are active")
end

-- Access mod info details
local modinfo = GetEnabledModsModInfoDetails()
for _, info in ipairs(modinfo) do
    print(info.name, info.version)
end

-- Use ModManager singleton for advanced operations
local enabled = ModManager:GetEnabledModNames()
local records = ModManager:GetModRecords()
ModManager:StartVersionChecking()  -- Begin client version verification
```

## Dependencies & tags
**External dependencies:**
- `class` -- Class definition system
- `modutil` -- Mod utility functions and post-init registration
- `prefabs` -- Prefab registration system
- `screens/modwarningscreen` -- Warning screen for failed mods
- `map/lockandkey` -- World generation locks and keys (loaded in CreateEnvironment)

**Components used:** None identified

**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `MOD_API_VERSION` | number | `10` | Current mod API version; mods should check compatibility against this. |
| `MOD_AVATAR_LOCATIONS` | table | `{ Default = "images/avatars/" }` | Default atlas path for mod avatar images. |
| `MOD_CRAFTING_AVATAR_LOCATIONS` | table | `{ Default = "images/crafting_menu_avatars/" }` | Default atlas path for mod crafting menu avatars. |
| `ModManager` | ModWrangler | singleton | Global singleton instance managing all mod operations. |
| `self.modnames` | table | `{}` | Array of all mod names queued for loading. |
| `self.mods` | table | `{}` | Array of mod environment tables with loaded mod data. |
| `self.records` | table | `{}` | Mod record metadata including active status. |
| `self.failedmods` | table | `{}` | Array of `{name, error}` tables for mods that failed to load. |
| `self.enabledmods` | table | `{}` | Array of enabled mod names after filtering. |
| `self.loadedprefabs` | table | `{}` | Array of prefab names registered by mods (prefixed with `MOD_`). |
| `self.servermods` | table | `nil` | Cached server mod names from TheNet (client-side). |
| `self.currentlyloadingmod` | string | `nil` | Name of mod currently being loaded; used for error reporting. |
| `self.worldgen` | boolean | `false` | Flag indicating if mods are loading during world generation phase. |

## Main functions
### `VisitModForums()`
* **Description:** Opens the Klei Entertainment forum page for DST beta mods and tools in the system browser.
* **Parameters:** None
* **Returns:** None
* **Error states:** None.

### `AreServerModsEnabled()`
* **Description:** Checks if any server-side mods are currently enabled. Returns `false` if ModManager is not yet initialized.
* **Parameters:** None
* **Returns:** `true` if enabled server mod count > 0, `false` otherwise.
* **Error states:** None (prints warning if ModManager is nil).

### `AreAnyModsEnabled()`
* **Description:** Checks if any mods (client or server) are currently enabled. Returns `false` if ModManager is not yet initialized.
* **Parameters:** None
* **Returns:** `true` if enabled mod count > 0, `false` otherwise.
* **Error states:** None (prints warning if ModManager is nil).

### `AreAnyClientModsEnabled()`
* **Description:** Iterates through enabled mods and checks if any are marked as client-only via `client_only_mod` flag in modinfo.
* **Parameters:** None
* **Returns:** `true` if at least one client-only mod is enabled, `false` otherwise.
* **Error states:** None (prints warning if ModManager or KnownModIndex is nil).

### `AreClientModsDisabled()`
* **Description:** Queries KnownModIndex to check if client mods are globally disabled via settings.
* **Parameters:** None
* **Returns:** `true` if client mods are disabled, `false` otherwise.
* **Error states:** None (prints warning if KnownModIndex is nil).

### `GetEnabledModNamesDetailed()`
* **Description:** Returns detailed information for all enabled mods including name, version, and API version. Used for callstack reporting and debugging.
* **Parameters:** None
* **Returns:** Array of strings formatted as `"modname:displayname version: X api_version: Y"`.
* **Error states:** None.

### `GetModVersion(mod_name, mod_info_use)`
* **Description:** Loads or updates mod info and returns the version string for a specific mod.
* **Parameters:**
  - `mod_name` -- string mod identifier
  - `mod_info_use` -- string; if `"update_mod_info"`, forces a refresh of mod info before reading
* **Returns:** Version string, or `""` if modinfo or version is nil.
* **Error states:** None.

### `GetEnabledModsModInfoDetails()`
* **Description:** Returns structured modinfo details for all enabled server mods. Includes compatibility flags for client requirement checking.
* **Parameters:** None
* **Returns:** Array of tables with fields: `name`, `info_name`, `version`, `version_compatible`, `all_clients_require_mod`.
* **Error states:** None.

### `GetEnabledServerModsConfigData()`
* **Description:** Collects saved configuration data for all server mods that require all clients. Serializes the data via `DataDumper` for network transmission.
* **Parameters:** None
* **Returns:** String containing serialized config data table.
* **Error states:** None.

### `CreateEnvironment(modname, isworldgen, isfrontend)`
* **Description:** Creates a sandboxed Lua environment for mod execution. Installs custom `modimport` loader, sets up package paths, and injects global references (TUNING, GROUND, LOCKS, etc.).
* **Parameters:**
  - `modname` -- string mod identifier
  - `isworldgen` -- boolean; if `false`, adds `CHARACTERLIST` to environment
  - `isfrontend` -- boolean; enables frontend-specific environment setup
* **Returns:** Environment table with `modimport`, `env`, and all injected globals.
* **Error states:** Errors if `modimport` fails to load a module (calls `error()` with load result string).

### `ModWrangler:GetEnabledModNames()`
* **Description:** Returns the array of enabled mod names from the ModWrangler instance.
* **Parameters:** None
* **Returns:** Array of mod name strings.
* **Error states:** None.

### `ModWrangler:GetEnabledServerModTags()`
* **Description:** Collects all `server_filter_tags` from enabled server mods. Used for server browser filtering.
* **Parameters:** None
* **Returns:** Array of tag strings.
* **Error states:** None.

### `ModWrangler:GetEnabledServerModNames()`
* **Description:** Returns server mod names that are enabled or force-enabled, excluding client-only mods. Only returns data on non-console platforms.
* **Parameters:** None
* **Returns:** Array of server mod name strings.
* **Error states:** None.

### `ModWrangler:GetServerModsNames()`
* **Description:** Returns server mod names. On master sim, uses local enabled list; on client, fetches from TheNet and caches.
* **Parameters:** None
* **Returns:** Array of server mod name strings.
* **Error states:** None.

### `ModWrangler:GetMod(modname)`
* **Description:** Searches the mods array for a mod with matching name and returns its environment table.
* **Parameters:**
  - `modname` -- string mod identifier
* **Returns:** Mod environment table, or `nil` if not found.
* **Error states:** None.

### `ModWrangler:SetModRecords(records)`
* **Description:** Sets mod records and updates their `active` status based on whether each mod is in the enabled list. Creates empty records for enabled mods without existing records.
* **Parameters:**
  - `records` -- table of mod record data
* **Returns:** None
* **Error states:** None.

### `ModWrangler:GetModRecords()`
* **Description:** Returns the mod records table containing metadata for all tracked mods.
* **Parameters:** None
* **Returns:** Records table.
* **Error states:** None.

### `ModWrangler:LoadServerModsFile()`
* **Description:** Loads `dedicated_server_mods_setup.lua` (or Rail variant) to execute `ServerModSetup()` and `ServerModCollectionSetup()` calls. Downloads server mods after setup.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors and shuts down if setup file fails to load (calls `Shutdown()`).

### `ModWrangler:DisableAllServerMods()`
* **Description:** Disables all server mods via KnownModIndex and saves the changes.
* **Parameters:** None
* **Returns:** None
* **Error states:** None.

### `ModWrangler:FrontendLoadMod(modname)`
* **Description:** Partially loads a mod in the frontend to populate settings screens and world gen options. Loads `modservercreationmain.lua` and `modworldgenmain.lua` in sandboxed environments.
* **Parameters:**
  - `modname` -- string mod identifier
* **Returns:** None
* **Error states:** Returns early if mod does not exist in KnownModIndex.

### `ModWrangler:FrontendUnloadMod(modname)`
* **Description:** Clears all mod data from map generation systems (Levels, TaskSets, Tasks, Rooms, StartLocations, Customize) and unloads frontend assets.
* **Parameters:**
  - `modname` -- string mod identifier or `nil` for all
* **Returns:** None
* **Error states:** None.

### `ModWrangler:LoadMods(worldgen)`
* **Description:** Main mod loading entry point. Loads server mods file on dedicated servers, updates mod info, applies overrides, sorts mods by priority, and initializes each mod's main files.
* **Parameters:**
  - `worldgen` -- boolean; if `true`, skips `modmain.lua` loading (worldgen phase only)
* **Returns:** None
* **Error states:** Returns early if `MODS_ENABLED` is false.

### `ModWrangler:InitializeModMain(modname, env, mainfile, safe)`
* **Description:** Loads and executes a mod's main file (`modmain.lua` or `modworldgenmain.lua`) in the provided environment. Uses safe or unsafe execution based on the `safe` flag.
* **Parameters:**
  - `modname` -- string mod identifier
  - `env` -- sandboxed environment table
  - `mainfile` -- string filename to load
  - `safe` -- boolean; if `true`, uses `RunInEnvironmentSafe` with error capture
* **Returns:** `true` on success, `false` on error (adds to `failedmods`).
* **Error states:** None (errors are captured and logged).

### `ModWrangler:RemoveBadMod(badmodname, error)`
* **Description:** Disables a mod due to errors and records the failure for later display.
* **Parameters:**
  - `badmodname` -- string mod identifier
  - `error` -- string error message/traceback
* **Returns:** None
* **Error states:** None.

### `ModWrangler:DisplayBadMods()`
* **Description:** Displays error screens for failed mods via TheFrontEnd. Disables bad mods, saves changes, and shows mod failure dialog with quit/forum options.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors directly (via `error()`) if called during worldgen phase.

### `ModWrangler:RegisterPrefabs()`
* **Description:** Iterates through enabled mods and registers their prefabs. Loads prefab files via `LoadPrefabFile`, collects prefabs into `mod.Prefabs`, and registers a default `MOD_<modname>` prefab for asset path resolution.
* **Parameters:** None
* **Returns:** None
* **Error states:** Returns early if `MODS_ENABLED` is false.

### `ModWrangler:UnloadPrefabs()`
* **Description:** Unloads all mod-registered prefabs by calling `UnloadPrefabsFromData` with data from `GetUnloadPrefabsData`.
* **Parameters:** None
* **Returns:** None
* **Error states:** None.

### `ModWrangler:GetUnloadPrefabsData()`
* **Description:** Collects prefab unload data including mod info names and prefab names (stripping `MOD_` prefix for display).
* **Parameters:** None
* **Returns:** Array of `{infoname, name}` tables.
* **Error states:** None.

### `ModWrangler:UnloadPrefabsFromData(data)`
* **Description:** Unloads prefabs and manifests for each entry in the provided data array.
* **Parameters:**
  - `data` -- array of `{infoname, name}` tables
* **Returns:** None
* **Error states:** None.

### `ModWrangler:SetPostEnv()`
* **Description:** Executes post-init functions for enabled and force-enabled mods. Displays mod warning screen if mods are loaded and warnings are enabled. Shows error screens for bad mods.
* **Parameters:** None
* **Returns:** None
* **Error states:** None.

### `ModWrangler:SimPostInit(wilson)`
* **Description:** Executes `SimPostInit` hooks for all enabled mods, passing the wilson entity. Displays bad mod errors after completion.
* **Parameters:**
  - `wilson` -- player entity instance
* **Returns:** None
* **Error states:** None.

### `ModWrangler:GetPostInitFns(type, id)`
* **Description:** Collects post-init functions of a specific type (e.g., `"GamePostInit"`, `"SimPostInit"`) from all enabled mods. Optionally filters by ID for per-entity hooks.
* **Parameters:**
  - `type` -- string hook type name
  - `id` -- optional entity or identifier for filtered hooks
* **Returns:** Array of wrapped function closures.
* **Error states:** None.

### `ModWrangler:GetPostInitData(type, id)`
* **Description:** Collects post-init data tables of a specific type from all enabled mods. Optionally filters by ID.
* **Parameters:**
  - `type` -- string data type name
  - `id` -- optional entity or identifier for filtered data
* **Returns:** Array of data tables.
* **Error states:** None.

### `ModWrangler:GetVoteCommands()`
* **Description:** Aggregates vote commands from all enabled mods that define `mod.vote_commands`.
* **Parameters:** None
* **Returns:** Table mapping command names to command functions.
* **Error states:** None.

### `ModWrangler:IsModCharacterClothingSymbolExcluded(name, symbol)`
* **Description:** Checks if a clothing symbol is excluded for a specific character by any enabled mod's `clothing_exclude` table.
* **Parameters:**
  - `name` -- string character/clothing name
  - `symbol` -- string symbol name to check
* **Returns:** `true` if excluded, `false` otherwise.
* **Error states:** None.

### `GetModFancyName(mod_name)`
* **Description:** Returns the display/fancy name for a mod via KnownModIndex.
* **Parameters:**
  - `mod_name` -- string mod identifier
* **Returns:** String display name.
* **Error states:** None.

### `ModWrangler:StartVersionChecking()`
* **Description:** **Master only.** Starts a periodic task (every 120 seconds, first run at 60 seconds) to verify mod versions for mods that require all clients. Calls `TheSim:VerifyModVersions` with mod info.
* **Parameters:** None
* **Returns:** None
* **Error states:** None (only runs on master sim).

### `ModWrangler:GetLinkForMod(mod_name)`
* **Description:** Returns a function that opens the mod's forum or workshop page, plus a flag indicating if the URL is generic. Platform-specific: uses RAIL API on Rail, Steam workshop URLs on Steam, forum URLs otherwise.
* **Parameters:**
  - `mod_name` -- string mod identifier
* **Returns:** Function `function() VisitURL(url) end`, and boolean `is_generic_url`.
* **Error states:** None.

### `ModWrangler:ShowMoreMods()`
* **Description:** Opens the mod browsing page (Steam workshop or Klei forums) based on current platform.
* **Parameters:** None
* **Returns:** None
* **Error states:** None.

### `runmodfn(fn, mod, modtype)` (local)
* **Description:** Returns a wrapper function that executes a mod function with error handling. On error, logs the traceback, removes the bad mod, and displays bad mod screen.
* **Parameters:**
  - `fn` -- function to wrap
  - `mod` -- mod environment table
  - `modtype` -- string describing the function type for error messages
* **Returns:** Wrapped function that accepts varargs and returns the original function's result or `nil` on error.
* **Error states:** None (errors are caught via `xpcall`).

## Events & listeners
**Listens to:** None identified

**Pushes:** None identified

**World state watchers:** None identified