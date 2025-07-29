---
id: splitscreenutils-pc
title: Split Screen Utils PC
description: PC-specific split screen utility functions and instance management for Don't Starve Together
sidebar_position: 4
slug: gams-scripts/core-systems/splitscreenutils-pc
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Split Screen Utils PC

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `splitscreenutils_pc` module provides PC-specific split screen utility functions and instance management. This module only functions on PC builds and is designed to reduce merge conflicts between PC and console builds. On PC, split screen functionality is disabled, and this module provides stub implementations.

## Platform Compatibility

**PC Only:** This module only loads on PC builds. It returns early if running on console platforms.

```lua
if IsConsole() then
    return
end
```

## Usage Example

```lua
-- Check if current instance is a game instance
local isGame = IsGameInstance(Instances.Player1)

-- Check split screen status (always false on PC)
local hasSplitScreen = IsSplitScreen()

-- Check multiple viewport support (always false on PC)
local hasMultipleViewports = HaveMultipleViewports()
```

## Constants

### Instances

**Value:** Table containing instance type identifiers

**Status:** `stable`

**Description:**
Defines the different instance types available in the game for instance identification and management.

**Structure:**
```lua
Instances = {
    Player1     = 0,
    Player2     = 1,
    Server      = 2,
    CaveServer  = 3,
    Overlay     = 4,
}
```

**Instance Types:**
- `Player1` (0): Primary player instance
- `Player2` (1): Secondary player instance (split screen)
- `Server` (2): Main server instance
- `CaveServer` (3): Cave server instance
- `Overlay` (4): Overlay interface instance

## Functions

### IsGameInstance(instance_id) {#is-game-instance}

**Status:** `stable`

**Description:**
Determines whether the specified instance ID represents a game instance (as opposed to server or overlay instances).

**Parameters:**
- `instance_id` (number): The instance identifier to check

**Returns:**
- (boolean): `true` if the instance is Player1 (primary game instance), `false` otherwise

**Example:**
```lua
-- Check if Player1 instance is a game instance
local isGame = IsGameInstance(Instances.Player1)  -- returns true

-- Check if Server instance is a game instance
local isServerGame = IsGameInstance(Instances.Server)  -- returns false

-- Check if Player2 instance is a game instance
local isPlayer2Game = IsGameInstance(Instances.Player2)  -- returns false
```

**Implementation Details:**
Only `Instances.Player1` (value 0) is considered a game instance on PC builds.

### IsSplitScreen() {#is-split-screen}

**Status:** `stable`

**Description:**
Returns whether split screen mode is currently active. On PC builds, this always returns `false` as split screen is not supported.

**Parameters:**
None

**Returns:**
- (boolean): Always `false` on PC builds

**Example:**
```lua
-- Check if split screen is active
local splitScreenActive = IsSplitScreen()  -- always returns false on PC

if not IsSplitScreen() then
    print("Single player mode")
end
```

**Platform Note:**
This is a stub implementation for PC. Console builds may have different behavior.

### HaveMultipleViewports() {#have-multiple-viewports}

**Status:** `stable`

**Description:**
Returns whether the system supports multiple viewports for rendering. On PC builds, this always returns `false`.

**Parameters:**
None

**Returns:**
- (boolean): Always `false` on PC builds

**Example:**
```lua
-- Check if multiple viewports are supported
local multiViewport = HaveMultipleViewports()  -- always returns false on PC

if not HaveMultipleViewports() then
    print("Single viewport rendering")
end
```

**Usage Context:**
This function is typically used for optimizing rendering systems and UI layout decisions based on viewport capabilities.

## Platform Differences

### PC Build Behavior
- Split screen functionality is disabled
- Only single player instance (Player1) is considered a game instance
- Multiple viewports are not supported
- All split screen related functions return `false`

### Console Build Reference
For console-specific split screen functionality, see the main `splitscreenutils.lua` module which contains additional functions and different behavior patterns.

## Integration Notes

### Instance Management
The `Instances` table provides a standardized way to identify different types of game instances:

```lua
-- Example usage in instance-specific code
if IsGameInstance(current_instance) then
    -- Handle game-specific logic
    InitializeGameplay()
else
    -- Handle server or overlay logic
    InitializeServerSystems()
end
```

### Merge Conflict Reduction
This module exists primarily to maintain code compatibility between PC and console builds. The stub implementations ensure that code referencing split screen functionality will compile and run on PC without modification.

## Related Modules

- [Split Screen Utils](./splitscreenutils.md): Main split screen utilities (console builds)
- [Platform Postload](./platformpostload.md): Platform-specific initialization
- [Frontend](./frontend.md): User interface management system
- [Input](./input.md): Input handling for different instance types

## Technical Notes

### Build System Integration
The early return mechanism (`if IsConsole() then return end`) ensures clean separation between PC and console codepaths:

```lua
-- Module only executes on PC builds
if IsConsole() then
    return  -- Exit early on console platforms
end

-- PC-specific implementation follows
```

### Memory Efficiency
The stub implementations provide minimal overhead while maintaining API compatibility across platforms.

### Future Considerations
This module structure allows for potential PC split screen support in future builds without breaking existing code that references these functions.
