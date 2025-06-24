---
id: main
title: Main Entry Point
description: Core game initialization script containing platform detection, system setup, and asset loading
sidebar_position: 1
slug: api-vanilla/core-systems/main
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Main Entry Point

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `main.lua` script serves as the primary entry point for Don't Starve Together. It handles platform detection, game configuration, asset loading, and initialization of core game systems. This script sets up the fundamental environment required for the game to run across different platforms.

## Usage Example

```lua
-- The main script is automatically executed at game startup
-- Platform detection example:
if IsSteam() then
    print("Running on Steam platform")
elseif IsConsole() then
    print("Running on console platform")
end
```

## Platform Detection Functions

### IsConsole() {#is-console}

**Status:** `stable`

**Description:**
Determines if the game is running on a console platform (PS4, Xbox One, or Switch).

**Returns:**
- (boolean): True if running on console platform

**Example:**
```lua
if IsConsole() then
    -- Console-specific logic
    print("Console platform detected")
end
```

### IsNotConsole() {#is-not-console}

**Status:** `stable`

**Description:**
Determines if the game is NOT running on a console platform.

**Returns:**
- (boolean): True if not running on console platform

**Example:**
```lua
if IsNotConsole() then
    -- PC/Mobile-specific logic
    EnableAdvancedSettings()
end
```

### IsSteam() {#is-steam}

**Status:** `stable`

**Description:**
Checks if the game is running on any Steam platform (Windows, Linux, or macOS Steam).

**Returns:**
- (boolean): True if running on Steam

**Example:**
```lua
if IsSteam() then
    -- Enable Steam Workshop integration
    LoadSteamWorkshopMods()
end
```

### IsWin32() {#is-win32}

**Status:** `stable`

**Description:**
Determines if the game is running on Windows (Steam or Rail).

**Returns:**
- (boolean): True if running on Windows

### IsLinux() {#is-linux}

**Status:** `stable`

**Description:**
Checks if the game is running on Linux Steam.

**Returns:**
- (boolean): True if running on Linux

### IsRail() {#is-rail}

**Status:** `stable`

**Description:**
Determines if the game is running on the Rail platform (WeGame).

**Returns:**
- (boolean): True if running on Rail platform

### IsSteamDeck() {#is-steam-deck}

**Status:** `stable`

**Description:**
Checks if the game is running on Steam Deck.

**Returns:**
- (boolean): True if running on Steam Deck

## Game Configuration Constants

### MAIN

**Value:** `1`

**Status:** `stable`

**Description:** Identifies this as the main game instance.

### ENCODE_SAVES

**Value:** `BRANCH ~= "dev"`

**Status:** `stable`

**Description:** Determines whether save files should be encoded based on the game branch.

### CHEATS_ENABLED

**Value:** `CONFIGURATION ~= "PRODUCTION"`

**Status:** `stable`

**Description:** Enables cheat functionality in non-production builds.

### DEBUG_MENU_ENABLED

**Status:** `stable`

**Description:** Controls availability of debug menu based on branch and platform.

**Usage:**
```lua
if DEBUG_MENU_ENABLED then
    ShowDebugMenu()
end
```

### METRICS_ENABLED

**Value:** `true`

**Status:** `stable`

**Description:** Enables metrics collection for analytics.

## Network Configuration

### DEFAULT_JOIN_IP

**Value:** `"127.0.0.1"`

**Status:** `stable`

**Description:** Default IP address for local server connections.

### DISABLE_MOD_WARNING

**Value:** `false`

**Status:** `stable`

**Description:** Controls whether mod warning dialogs are shown.

### DEFAULT_SERVER_SAVE_FILE

**Value:** `"/server_save"`

**Status:** `stable`

**Description:** Default filename for server save files.

## Global Instances

### TheGlobalInstance

**Status:** `stable`

**Description:**
The main global entity that manages core game systems and components.

**Properties:**
- Non-networked entity
- Cannot sleep
- Does not persist
- Tagged as "CLASSIFIED"

### TheCamera

**Status:** `stable`

**Description:**
Global camera instance using FollowCamera system.

### ShadowManager

**Status:** `stable`

**Description:**
Manages shadow rendering and textures.

### PostProcessor

**Status:** `stable`

**Description:**
Handles post-processing effects and shaders.

### FontManager

**Status:** `stable`

**Description:**
Manages font loading and rendering.

## Asset Loading

### Package Path Configuration

The script configures Lua package paths for mod and script loading:

```lua
package.path = "scripts\\?.lua;scriptlibs\\?.lua"
```

### Asset Resolution

The custom loader handles asset resolution for mods and base game files, ensuring proper file loading across different directory structures.

## System Initialization

The main script initializes critical game systems in order:

1. **Core Libraries:** Math, utilities, configuration
2. **Localization:** Language and string systems  
3. **Game Systems:** Prefabs, recipes, networking
4. **Rendering:** Fonts, physics, graphics
5. **Mod Support:** Mod loading and management

## Startup Sequence

### ModSafeStartup()

**Status:** `stable`

**Description:**
Handles safe mod loading and game system initialization.

**Process:**
1. Clear filesystem aliases
2. Load mods with error handling
3. Apply translations
4. Register prefabs
5. Initialize global systems
6. Set up rendering pipeline

### GlobalInit()

**Status:** `stable`

**Description:**
One-time initialization for global game systems.

**Process:**
1. Load global prefabs
2. Initialize fonts
3. Send hardware statistics
4. Set up networking flags

## Error Handling

The script includes comprehensive error handling for:
- File loading failures
- Mod conflicts
- Asset resolution issues
- System initialization problems

## Related Modules

- [MainFunctions](./mainfunctions.md): Core game functions and utilities
- [Prefabs](./prefabs.md): Prefab registration and management
- [ModIndex](./modindex.md): Mod loading and management
- [Networking](./networking.md): Network system initialization
- [FontHelper](./fonthelper.md): Font loading and management
