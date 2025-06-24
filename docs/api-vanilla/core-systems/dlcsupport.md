---
id: dlcsupport
title: DLC Support
description: Core DLC management system for registering, enabling, and managing downloadable content
sidebar_position: 41
slug: api-vanilla/core-systems/dlcsupport
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# DLC Support

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `dlcsupport` module provides the core DLC (Downloadable Content) management system for Don't Starve Together. It handles DLC registration, enabling/disabling, character list management, and prefab loading for DLC content.

## Usage Example

```lua
-- Enable Reign of Giants DLC
EnableDLC(REIGN_OF_GIANTS)

-- Check if DLC is enabled
if IsDLCEnabled(REIGN_OF_GIANTS) then
    print("Reign of Giants is enabled")
end

-- Get available character list
local characters = GetActiveCharacterList()
```

## Constants

### DLC Identifiers

#### MAIN_GAME

**Value:** `0`

**Status:** `stable`

**Description:**
Identifier for the base game (no DLC).

#### REIGN_OF_GIANTS

**Value:** `1`

**Status:** `stable`

**Description:**
Identifier for the Reign of Giants DLC.

### Application IDs

#### DONT_STARVE_TOGETHER_APPID

**Value:** `322330`

**Status:** `stable`

**Description:**
Steam application ID for Don't Starve Together.

#### DONT_STARVE_APPID

**Value:** `219740`

**Status:** `stable`

**Description:**
Steam application ID for the original Don't Starve.

### DLC Tables

#### NO_DLC_TABLE

**Value:** `{REIGN_OF_GIANTS=false}`

**Status:** `stable`

**Description:**
Table representing no DLC enabled state.

#### ALL_DLC_TABLE

**Value:** `{REIGN_OF_GIANTS=true}`

**Status:** `stable`

**Description:**
Table representing all DLC enabled state.

#### DLC_LIST

**Value:** `{REIGN_OF_GIANTS}`

**Status:** `stable`

**Description:**
Array of all available DLC identifiers.

#### MENU_DLC_LIST

**Value:** `{}`

**Status:** `stable`

**Description:**
Array of DLC identifiers that should be enabled in menu contexts.

## Global Variables

### RegisteredDLC

**Type:** `table`

**Status:** `stable`

**Description:**
Table mapping DLC indices to their registration data.

### ActiveDLC

**Type:** `table`

**Status:** `stable`

**Description:**
Table tracking currently active DLC states.

## DLC Registration Functions

### RegisterAllDLC() {#registeralldlc}

**Status:** `stable`

**Description:**
Registers all available DLC by scanning for DLC files (DLC0001 through DLC0010) and loading their configurations.

**Example:**
```lua
-- Register all available DLC
RegisterAllDLC()
```

### RegisterDLC(index) {#registerdlc}

**Status:** `stable`

**Description:**
Registers a specific DLC by index, clearing other registrations first.

**Parameters:**
- `index` (number): DLC index to register (1-10)

**Example:**
```lua
-- Register only Reign of Giants DLC
RegisterDLC(REIGN_OF_GIANTS)
```

## DLC Initialization Functions

### InitAllDLC() {#initalldlc}

**Status:** `stable`

**Description:**
Initializes all registered DLC by calling their Setup functions.

**Example:**
```lua
-- Initialize all registered DLC
InitAllDLC()
```

### InitDLC(index) {#initdlc}

**Status:** `stable`

**Description:**
Initializes a specific DLC by calling its Setup function.

**Parameters:**
- `index` (number): DLC index to initialize

**Example:**
```lua
-- Initialize Reign of Giants DLC
InitDLC(REIGN_OF_GIANTS)
```

## DLC State Management Functions

### EnableDLC(index) {#enabledlc}

**Status:** `stable`

**Description:**
Enables a specific DLC.

**Parameters:**
- `index` (number): DLC index to enable

**Example:**
```lua
EnableDLC(REIGN_OF_GIANTS)
```

### DisableDLC(index) {#disabledlc}

**Status:** `stable`

**Description:**
Disables a specific DLC.

**Parameters:**
- `index` (number): DLC index to disable

**Example:**
```lua
DisableDLC(REIGN_OF_GIANTS)
```

### EnableExclusiveDLC(index) {#enableexclusivedlc}

**Status:** `stable`

**Description:**
Disables all DLC first, then enables only the specified DLC.

**Parameters:**
- `index` (number): DLC index to enable exclusively

**Example:**
```lua
-- Enable only Reign of Giants, disable all others
EnableExclusiveDLC(REIGN_OF_GIANTS)
```

### EnableAllDLC() {#enablealldlc}

**Status:** `stable`

**Description:**
Enables all DLC listed in `DLC_LIST`.

**Example:**
```lua
EnableAllDLC()
```

### DisableAllDLC() {#disablealldlc}

**Status:** `stable`

**Description:**
Disables all DLC listed in `DLC_LIST`.

**Example:**
```lua
DisableAllDLC()
```

### EnableAllMenuDLC() {#enableallmenudlc}

**Status:** `stable`

**Description:**
Disables all DLC first, then enables only DLC listed in `MENU_DLC_LIST`.

**Example:**
```lua
-- Enable only menu-specific DLC
EnableAllMenuDLC()
```

## DLC Query Functions

### IsDLCEnabled(index) {#isdlcenabled}

**Status:** `stable`

**Description:**
Checks if a specific DLC is currently enabled.

**Parameters:**
- `index` (number): DLC index to check

**Returns:**
- (boolean): true if DLC is enabled, false otherwise

**Example:**
```lua
if IsDLCEnabled(REIGN_OF_GIANTS) then
    -- Reign of Giants specific code
    SpawnPrefab("deerclops")
end
```

### IsDLCInstalled(index) {#isdlcinstalled}

**Status:** `stable`

**Description:**
Checks if a specific DLC is installed on the system.

**Parameters:**
- `index` (number): DLC index to check

**Returns:**
- (boolean): true if DLC is installed, false otherwise

**Example:**
```lua
if IsDLCInstalled(REIGN_OF_GIANTS) then
    print("Reign of Giants DLC is available")
end
```

## Character List Functions

### GetActiveCharacterList() {#getactivecharacterlist}

**Status:** `stable`

**Description:**
Returns the complete list of characters available for gameplay, including both base game and mod characters.

**Returns:**
- (table): Array of character prefab names

**Example:**
```lua
local characters = GetActiveCharacterList()
for i, character in ipairs(characters) do
    print("Available character:", character)
end
```

### GetSelectableCharacterList() {#getselectablecharacterlist}

**Status:** `stable`

**Description:**
Returns the list of characters that players can select in character selection screens. Excludes characters that require special unlock methods.

**Returns:**
- (table): Array of selectable character prefab names

**Example:**
```lua
local selectable = GetSelectableCharacterList()
-- This excludes SEAMLESSSWAP_CHARACTERLIST characters
```

### GetFEVisibleCharacterList() {#getfevisiblecharacterlist}

**Status:** `stable`

**Description:**
Returns the list of characters visible in the frontend/menu system. Includes special logic for characters like "wonkey" that require unlocking.

**Returns:**
- (table): Array of frontend-visible character prefab names

**Example:**
```lua
local visible_chars = GetFEVisibleCharacterList()
-- Wonkey only appears if previously played
```

## Internal Functions

### AddPrefab(prefabName) {#addprefab-internal}

**Status:** `stable` (internal)

**Description:**
Internal function that adds a prefab name to the `PREFABFILES` list if not already present.

**Parameters:**
- `prefabName` (string): Name of prefab to add

### GetDLCPrefabFiles(filename) {#getdlcprefabfiles-internal}

**Status:** `stable` (internal)

**Description:**
Internal function that loads DLC prefab file lists from specified files.

**Parameters:**
- `filename` (string): Path to DLC prefab file

**Returns:**
- (table): Array of prefab names from the DLC file

### RegisterPrefabs(index) {#registerprefabs-internal}

**Status:** `stable` (internal)

**Description:**
Internal function that registers prefabs for a specific DLC index.

**Parameters:**
- `index` (number): DLC index to register prefabs for

### ReloadPrefabList() {#reloadprefablist-internal}

**Status:** `stable` (internal)

**Description:**
Internal function that reloads the prefab list by registering all DLC prefabs.

## Complete Example

```lua
-- Setup DLC system
print("Setting up DLC system...")

-- Register all available DLC
RegisterAllDLC()

-- Check what's available
if IsDLCInstalled(REIGN_OF_GIANTS) then
    print("Reign of Giants is installed")
    
    if IsDLCEnabled(REIGN_OF_GIANTS) then
        print("Reign of Giants is enabled")
    else
        print("Enabling Reign of Giants...")
        EnableDLC(REIGN_OF_GIANTS)
    end
else
    print("Reign of Giants not installed")
end

-- Initialize all DLC
InitAllDLC()

-- Get character lists
local all_characters = GetActiveCharacterList()
local selectable_characters = GetSelectableCharacterList()
local visible_characters = GetFEVisibleCharacterList()

print("Total characters:", #all_characters)
print("Selectable characters:", #selectable_characters)
print("Visible in menu:", #visible_characters)

-- Example of conditional DLC content
if IsDLCEnabled(REIGN_OF_GIANTS) then
    -- Spawn DLC-specific content
    local deerclops = SpawnPrefab("deerclops")
    print("Spawned Deerclops (RoG content)")
end

-- DLC management examples
print("Disabling all DLC...")
DisableAllDLC()

print("Enabling only menu DLC...")
EnableAllMenuDLC()

print("Enabling all DLC...")
EnableAllDLC()
```

## DLC File Structure

DLC configurations are loaded from files following this pattern:

- **DLC Files**: `scripts/DLC0001` through `scripts/DLC0010`
- **Prefab Files**: `scripts/DLC001_prefab_files` through `scripts/DLC010_prefab_files`

Each DLC file should return a table with optional Setup function:

```lua
-- Example DLC file structure
return {
    Setup = function()
        -- DLC initialization code
        print("Setting up Example DLC")
    end
}
```

## Related Modules

- [DLC Support Worldgen](./dlcsupport_worldgen.md): DLC support for world generation
- [DLC Support Strings](./dlcsupport_strings.md): DLC string and localization support
- [Prefabs](./prefabs.md): Prefab management system
- [Mod Index](./modindex.md): Mod management system
