---
id: modindex
title: Mod Index
description: Mod registry and management system for tracking installed and enabled mods
sidebar_position: 104
slug: /core-systems/modindex
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Mod Index

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `ModIndex` class (accessed globally as `KnownModIndex`) provides the central registry for all mod information, configuration, and state management. It handles mod discovery, loading, configuration management, and dependency resolution.

## Usage Example

```lua
-- Check if a mod is enabled
if KnownModIndex:IsModEnabled("workshop-12345") then
    print("Mod is enabled")
end

-- Get mod information
local modinfo = KnownModIndex:GetModInfo("mymod")
print(modinfo.name, modinfo.version)

-- Load mod configuration
local config = KnownModIndex:LoadModConfigurationOptions("mymod", false)
```

## Core Functions

### KnownModIndex:IsModEnabled(modname) {#is-mod-enabled}

**Status:** `stable`

**Description:**
Checks whether a mod is currently enabled and available for use.

**Parameters:**
- `modname` (string): The mod identifier

**Returns:**
- (boolean): True if the mod is enabled, false otherwise

**Example:**
```lua
if KnownModIndex:IsModEnabled("workshop-12345") then
    -- Mod-specific code here
end
```

### KnownModIndex:GetModInfo(modname) {#get-mod-info}

**Status:** `stable`

**Description:**
Retrieves the complete information table for a specified mod, including metadata, version information, and configuration options.

**Parameters:**
- `modname` (string): The mod identifier

**Returns:**
- (table): Mod information table, or nil if mod not found

**Example:**
```lua
local modinfo = KnownModIndex:GetModInfo("mymod")
if modinfo then
    print("Mod Name:", modinfo.name)
    print("Version:", modinfo.version)
    print("API Version:", modinfo.api_version)
end
```

### KnownModIndex:GetModNames() {#get-mod-names}

**Status:** `stable`

**Description:**
Returns a list of all known mod names in the index.

**Returns:**
- (table): Array of mod name strings

**Example:**
```lua
local all_mods = KnownModIndex:GetModNames()
for i, modname in ipairs(all_mods) do
    print("Known mod:", modname)
end
```

### KnownModIndex:GetServerModNames() {#get-server-mod-names}

**Status:** `stable`

**Description:**
Returns a list of all server-side mod names (excludes client-only mods).

**Returns:**
- (table): Array of server mod name strings

**Example:**
```lua
local server_mods = KnownModIndex:GetServerModNames()
for i, modname in ipairs(server_mods) do
    print("Server mod:", modname)
end
```

### KnownModIndex:GetClientModNames() {#get-client-mod-names}

**Status:** `stable`

**Description:**
Returns a list of all client-only mod names.

**Returns:**
- (table): Array of client mod name strings

**Example:**
```lua
local client_mods = KnownModIndex:GetClientModNames()
for i, modname in ipairs(client_mods) do
    print("Client mod:", modname)
end
```

## Configuration Management

### KnownModIndex:LoadModConfigurationOptions(modname, client_config) {#load-mod-configuration-options}

**Status:** `stable`

**Description:**
Loads the configuration options for a specified mod, returning either server or client configuration based on the parameters.

**Parameters:**
- `modname` (string): The mod identifier
- `client_config` (boolean): Whether to load client configuration (true) or server configuration (false)

**Returns:**
- (table): Configuration options table, or nil if not found

**Example:**
```lua
-- Load server configuration
local server_config = KnownModIndex:LoadModConfigurationOptions("mymod", false)

-- Load client configuration  
local client_config = KnownModIndex:LoadModConfigurationOptions("mymod", true)
```

### KnownModIndex:GetModConfigurationPath(modname, client_config) {#get-mod-configuration-path}

**Status:** `stable`

**Description:**
Returns the file path for a mod's configuration data.

**Parameters:**
- `modname` (string): The mod identifier
- `client_config` (boolean): Whether to get client config path

**Returns:**
- (string): Configuration file path

### KnownModIndex:GetModConfigurationName(modname, client_config) {#get-mod-configuration-name}

**Status:** `stable`

**Description:**
Returns the configuration file name for a mod.

**Parameters:**
- `modname` (string): The mod identifier
- `client_config` (boolean): Whether to get client config name

**Returns:**
- (string): Configuration file name

## Mod State Management

### KnownModIndex:EnableMod(modname) {#enable-mod}

**Status:** `stable`

**Description:**
Enables a mod in the index.

**Parameters:**
- `modname` (string): The mod identifier

### KnownModIndex:DisableMod(modname) {#disable-mod}

**Status:** `stable`

**Description:**
Disables a mod in the index.

**Parameters:**
- `modname` (string): The mod identifier

### KnownModIndex:DisableAllMods() {#disable-all-mods}

**Status:** `stable`

**Description:**
Disables all mods in the index.

## Startup and Loading

### KnownModIndex:BeginStartupSequence(callback) {#begin-startup-sequence}

**Status:** `stable`

**Description:**
Begins the mod loading startup sequence, handling crash detection and mod state initialization.

**Parameters:**
- `callback` (function): Function to call when startup sequence is ready

### KnownModIndex:EndStartupSequence(callback) {#end-startup-sequence}

**Status:** `stable`

**Description:**
Completes the mod loading startup sequence.

**Parameters:**
- `callback` (function): Function to call when startup sequence is complete

### KnownModIndex:WasLoadBad() {#was-load-bad}

**Status:** `stable`

**Description:**
Checks if the last mod loading attempt resulted in a crash or failure.

**Returns:**
- (boolean): True if the last load was bad, false otherwise

## Utility Functions

### KnownModIndex:GetModFancyName(modname) {#get-mod-fancy-name}

**Status:** `stable`

**Description:**
Returns the display name for a mod (from modinfo.name or falls back to modname).

**Parameters:**
- `modname` (string): The mod identifier

**Returns:**
- (string): Display name for the mod

### KnownModIndex:GetModActualName(fancyname) {#get-mod-actual-name}

**Status:** `stable`

**Description:**
Converts a display name back to the actual mod identifier.

**Parameters:**
- `fancyname` (string): The display name

**Returns:**
- (string): Actual mod identifier

## Helper Functions

### ResolveModname(name) {#resolve-modname}

**Status:** `stable`

**Description:**
Resolves a mod name to its canonical form, handling both fancy names and actual mod identifiers.

**Parameters:**
- `name` (string): The mod name to resolve

**Returns:**
- (string): Resolved mod name

### IsWorkshopMod(name) {#is-workshop-mod}

**Status:** `stable`

**Description:**
Determines if a mod is from the Steam Workshop based on its naming pattern.

**Parameters:**
- `name` (string): The mod name to check

**Returns:**
- (boolean): True if it's a workshop mod (starts with "workshop-"), false otherwise

**Example:**
```lua
if IsWorkshopMod("workshop-12345") then
    print("This is a Steam Workshop mod")
end
```

## Data Structures

### Mod Information Structure

```lua
modinfo = {
    name = "Mod Display Name",
    version = "1.0.0",
    api_version = 10,
    author = "Author Name",
    description = "Mod description",
    client_only_mod = false,
    all_clients_require_mod = true,
    dependencies = {...},
    -- Additional mod metadata
}
```

### Save Data Structure

```lua
savedata = {
    known_mods = {
        [modname] = {
            enabled = true,
            favorite = false,
            temp_enabled = false,
            temp_disabled = false,
            disabled_bad = false,
            disabled_incompatible_with_mode = false,
            modinfo = {...}
        }
    },
    known_api_version = 10,
    disable_special_event_warning = false
}
```

## Mod Override Processing

### KnownModIndex:ProcessModOverrides(overrides) {#process-mod-overrides}

**Status:** `stable`

**Description:**
Processes mod override data from server, enabling/disabling mods based on server configuration.

**Parameters:**
- `overrides` (table): Mod override configuration from server

## Dependency Management

### KnownModIndex:GetModDependencies(modname, include_optional) {#get-mod-dependencies}

**Status:** `stable`

**Description:**
Returns the dependency list for a specified mod.

**Parameters:**
- `modname` (string): The mod identifier
- `include_optional` (boolean): Whether to include optional dependencies

**Returns:**
- (table): Array of dependency mod names

### KnownModIndex:DoModsExistAnyVersion(mod_list) {#do-mods-exist-any-version}

**Status:** `stable`

**Description:**
Checks if all mods in a list exist in any version.

**Parameters:**
- `mod_list` (table): Array of mod names to check

**Returns:**
- (boolean): True if all mods exist, false otherwise

## Integration

The ModIndex system integrates with:
- **Mod Loading**: Core mod discovery and loading system
- **Configuration**: Mod settings and options management
- **Networking**: Server mod synchronization
- **UI**: Mod management screens and interfaces

## Related Modules

- [Mods](./mods.md): Core mod loading and management system
- [Mod Utilities](./modutil.md): Mod development utilities and helpers
- [Mod Compatibility](./modcompatability.md): Version upgrade and compatibility handling
