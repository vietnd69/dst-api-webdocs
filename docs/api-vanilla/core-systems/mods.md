---
id: mods
title: Mods System
description: Core mod loading and management system for Don't Starve Together
sidebar_position: 105
slug: /core-systems/mods
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Mods System

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `mods` module provides the core mod loading and management system for Don't Starve Together. It handles mod discovery, environment creation, loading sequences, and integration with the game's prefab and asset systems.

## Usage Example

```lua
-- Check if any mods are enabled
if AreAnyModsEnabled() then
    print("Mods are active")
end

-- Get enabled mod details
local enabled_mods = GetEnabledModNamesDetailed()
for i, mod_details in ipairs(enabled_mods) do
    print("Enabled mod:", mod_details)
end

-- Get mod version
local version = GetModVersion("mymod")
print("Mod version:", version)
```

## Constants

### MOD_API_VERSION {#mod-api-version}

**Value:** `10`

**Status:** `stable`

**Description:** The current mod API version supported by the game. Mods must specify this API version in their modinfo.lua to ensure compatibility.

### Release IDs

The system maintains a list of release IDs for mod compatibility:

```lua
-- Recent release IDs (partial list)
"R35_SANITYTROUBLES"
"R36_ST_WENDWALTWORT"
"R37_LUNAR_CAGE"
```

**Description:** Release IDs allow modders to test for specific game features and ensure compatibility across different game versions.

### Avatar Locations

```lua
MOD_AVATAR_LOCATIONS = { Default = "images/avatars/" }
MOD_CRAFTING_AVATAR_LOCATIONS = { Default = "images/crafting_menu_avatars/" }
```

**Description:** Default paths for mod avatar and crafting menu icon assets.

## Core Functions

### AreServerModsEnabled() {#are-server-mods-enabled}

**Status:** `stable`

**Description:**
Checks if any server-side mods are currently enabled.

**Returns:**
- (boolean): True if server mods are enabled, false otherwise

**Example:**
```lua
if AreServerModsEnabled() then
    print("Server has mods enabled")
end
```

### AreAnyModsEnabled() {#are-any-mods-enabled}

**Status:** `stable`

**Description:**
Checks if any mods (server or client) are currently enabled.

**Returns:**
- (boolean): True if any mods are enabled, false otherwise

### AreAnyClientModsEnabled() {#are-any-client-mods-enabled}

**Status:** `stable`

**Description:**
Checks if any client-only mods are currently enabled.

**Returns:**
- (boolean): True if client mods are enabled, false otherwise

### AreClientModsDisabled() {#are-client-mods-disabled}

**Status:** `stable`

**Description:**
Checks if client mods have been explicitly disabled.

**Returns:**
- (boolean): True if client mods are disabled, false otherwise

### GetEnabledModNamesDetailed() {#get-enabled-mod-names-detailed}

**Status:** `stable`

**Description:**
Returns detailed information about all enabled mods, including names, versions, and API versions. Used primarily for error reporting and callstack analysis.

**Returns:**
- (table): Array of detailed mod information strings

**Example:**
```lua
local mod_details = GetEnabledModNamesDetailed()
for i, details in ipairs(mod_details) do
    print("Mod details:", details)
    -- Output example: "workshop-12345:Better Farming version: 2.1 api_version: 10"
end
```

### GetModVersion(mod_name, mod_info_use) {#get-mod-version}

**Status:** `stable`

**Description:**
Retrieves the version string for a specified mod.

**Parameters:**
- `mod_name` (string): The mod identifier
- `mod_info_use` (string): Optional parameter for updating mod info ("update_mod_info")

**Returns:**
- (string): The mod version string, or empty string if not found

**Example:**
```lua
local version = GetModVersion("workshop-12345")
if version ~= "" then
    print("Mod version:", version)
end
```

### GetEnabledModsModInfoDetails() {#get-enabled-mods-modinfo-details}

**Status:** `stable`

**Description:**
Returns structured mod information for all enabled server mods, including compatibility flags and version information.

**Returns:**
- (table): Array of mod information tables

**Example:**
```lua
local mods_info = GetEnabledModsModInfoDetails()
for i, mod_info in ipairs(mods_info) do
    print("Mod:", mod_info.name)
    print("Display name:", mod_info.info_name)
    print("Version:", mod_info.version)
    print("All clients require:", mod_info.all_clients_require_mod)
end
```

### GetEnabledServerModsConfigData() {#get-enabled-server-mods-config-data}

**Status:** `stable`

**Description:**
Returns encoded configuration data for all enabled server mods that require client synchronization.

**Returns:**
- (string): Encoded configuration data

**Example:**
```lua
local config_data = GetEnabledServerModsConfigData()
-- This data is typically sent to clients for mod synchronization
```

## Mod Loading System

### ModWrangler Class

The `ModWrangler` class handles the core mod loading functionality:

#### Mod Discovery
- Scans mod directories for valid mod files
- Validates mod structure and dependencies
- Builds mod loading order based on dependencies

#### Environment Creation
- Creates isolated execution environments for each mod
- Provides safe access to game APIs
- Handles mod-specific global variables

#### Loading Sequence
- Loads mods in dependency order
- Handles mod initialization callbacks
- Manages error recovery and bad mod detection

#### Prefab Registration
- Registers mod-defined prefabs with the game
- Handles asset loading for mod prefabs
- Manages prefab overrides and modifications

## Error Handling

### Bad Mod Detection
The system automatically detects and handles problematic mods:

```lua
-- Example of mod error handling
local status, error = xpcall(mod_function, debug.traceback)
if not status then
    ModManager:RemoveBadMod(modname, error)
    ModManager:DisplayBadMods()
end
```

### Crash Recovery
- Detects crashes during mod loading
- Automatically disables problematic mods
- Provides recovery mechanisms for broken mod states

## Mod Environment

### Safe Function Execution
```lua
local runmodfn = function(fn, mod, modtype)
    return function(...)
        if fn then
            local status, r = xpcall(function() 
                return fn(unpack(arg)) 
            end, debug.traceback)
            if not status then
                -- Handle mod error
                ModManager:RemoveBadMod(mod.modname, r)
            end
        end
    end
end
```

### API Access Control
- Controlled access to game functions
- Prevention of unsafe operations
- Sandboxed execution environment

## Release ID System

### CurrentRelease.GreaterOrEqualTo(release_id)

**Status:** `stable`

**Description:**
Checks if the current game version supports a specific release ID.

**Parameters:**
- `release_id` (string): The release ID to check

**Returns:**
- (boolean): True if the current version supports the release, false otherwise

**Example:**
```lua
if CurrentRelease.GreaterOrEqualTo("R35_SANITYTROUBLES") then
    -- Use features from the Sanity Troubles update
    print("Sanity Troubles features available")
end
```

### AddModReleaseID(name)

**Status:** `stable`

**Description:**
Adds a new release ID to the system for mod compatibility testing.

**Parameters:**
- `name` (string): The release ID name

**Example:**
```lua
AddModReleaseID("R37_LUNAR_CAGE")
```

## Version Checking

### Version Compatibility
The system checks mod compatibility based on:
- API version requirements
- Game version compatibility
- Release ID support
- Platform-specific features

### Update Detection
- Compares mod versions with installed versions
- Handles version upgrade scenarios
- Manages backward compatibility

## Integration

The mod system integrates with:
- **Asset Loading**: Mod-specific assets and textures
- **Prefab System**: Custom entities and items
- **Networking**: Server-client mod synchronization
- **UI System**: Mod configuration interfaces
- **Save System**: Mod data persistence

## Platform Support

### Steam Workshop
- Automatic mod downloading and updates
- Workshop mod ID resolution
- Subscription management

### Standalone Mods
- Local mod installation
- Manual mod management
- Development mod support

## Configuration Management

### Mod Settings
- Per-mod configuration options
- Server-client setting synchronization
- Runtime configuration changes

### Override System
- Server-side mod overrides
- Configuration validation
- Default value management

## Related Modules

- [Mod Index](./modindex.md): Mod registry and information management
- [Mod Utilities](./modutil.md): Development utilities and helpers
- [Mod Compatibility](./modcompatability.md): Version upgrade handling
