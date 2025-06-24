---
id: core-systems-strict
title: Strict
description: Lua strict mode implementation preventing access to undeclared global variables
sidebar_position: 47
slug: api-vanilla/core-systems/strict
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Strict

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `Strict` module implements Lua strict mode functionality that prevents accidental access to undeclared global variables. It uses Lua's metatable mechanism to intercept global variable access and throws errors when code attempts to read or write variables that haven't been explicitly declared.

This is a crucial development tool that helps catch common programming errors such as typos in variable names, uninitialized variables, and accidental global pollution. It's particularly valuable in large codebases where variable scope issues can be difficult to track down.

## Usage Example

```lua
-- Without strict mode, this would silently create a global
someVariable = "value"  -- Error: assign to undeclared variable 'someVariable'

-- Must explicitly declare globals
global("someVariable")
someVariable = "value"  -- Now this works

-- Reading undeclared variables also errors
print(undeclaredVar)  -- Error: variable 'undeclaredVar' is not declared

-- Multiple declarations at once
global("VAR1", "VAR2", "VAR3")
VAR1 = "first"
VAR2 = "second" 
VAR3 = "third"
```

## Core Functionality

### Metatable Implementation

The strict mode system works by:

1. **Installing Metatables**: Sets `__newindex` and `__index` metamethods on the global table `_G`
2. **Tracking Declarations**: Maintains a registry of declared variables in `mt.__declared`
3. **Intercepting Access**: Catches all global variable read/write operations
4. **Error Reporting**: Throws descriptive errors for undeclared variable access

### Scope Handling

Strict mode distinguishes between different code contexts:

- **Main Chunks**: Code running at the top level (allowed to create globals)
- **C Functions**: Native functions (allowed to access globals)
- **Regular Functions**: User-defined functions (strict checking enforced)

## Global Variables

### __STRICT

**Type:** `boolean`

**Status:** `stable`

**Description:**
Global flag that enables strict mode checking. When `true`, the metamethods enforce strict variable access rules.

### mt.__declared

**Type:** `table`

**Status:** `stable`

**Description:**
Internal registry table that tracks which global variables have been explicitly declared. Maps variable names to `true` for declared variables.

## Core Functions

### global(...) {#global}

**Status:** `stable`

**Description:**
Declares one or more global variables, allowing them to be accessed without strict mode errors.

**Parameters:**
- `...` (string): Variable names to declare as global

**Example:**
```lua
-- Declare a single global
global("DEBUG_MODE")
DEBUG_MODE = true

-- Declare multiple globals
global("PLAYER_COUNT", "WORLD_SIZE", "GAME_VERSION")
PLAYER_COUNT = 4
WORLD_SIZE = "huge"
GAME_VERSION = "1.0.0"

-- Can be called multiple times
global("TEMP_VAR")
TEMP_VAR = "temporary value"
```

## Metatable Functions

### mt.__newindex(t, n, v) {#mt-newindex}

**Status:** `stable`

**Description:**
Metamethod that intercepts attempts to create new global variables. Throws an error if strict mode is enabled and the variable hasn't been declared.

**Parameters:**
- `t` (table): The global table `_G`
- `n` (string): Name of the variable being assigned
- `v` (any): Value being assigned to the variable

**Error Conditions:**
- Throws error if `__STRICT` is true and variable `n` is not in `mt.__declared`
- Exception: Allows assignment from main chunks and C functions

### mt.__index(t, n) {#mt-index}

**Status:** `stable`

**Description:**
Metamethod that intercepts attempts to read global variables. Throws an error if strict mode is enabled and the variable hasn't been declared.

**Parameters:**
- `t` (table): The global table `_G`
- `n` (string): Name of the variable being accessed

**Returns:**
- (any): The value of the variable if it exists and is declared

**Error Conditions:**
- Throws error if variable `n` is not in `mt.__declared`
- Exception: Allows access from C functions

## Pre-declared Variables

The strict module automatically declares certain essential variables:

### MAIN

**Type:** `string`

**Status:** `stable`

**Description:**
Pre-declared global variable typically used to identify main execution context.

### WORLDGEN_MAIN

**Type:** `string`

**Status:** `stable`

**Description:**
Pre-declared global variable used to identify world generation execution context.

## Implementation Details

### Debug Information Usage

The strict mode system uses Lua's debug library to determine the calling context:

```lua
local w = debug.getinfo(2, "S").what
```

This retrieves information about the function that's attempting the global access:

- **"main"**: Top-level code execution (allowed)
- **"C"**: C function calls (allowed)
- **Other**: Regular Lua functions (strict checking enforced)

### Error Messages

The strict mode provides clear error messages:

- **Write Error**: `"assign to undeclared variable 'varname'"`
- **Read Error**: `"variable 'varname' is not declared"`

These messages include the line number and source file information automatically provided by Lua's error handling.

## Development Workflow

### Enabling Strict Mode

Strict mode is automatically enabled when the module is loaded:

```lua
require("strict")  -- Enables strict mode globally
```

### Working with Strict Mode

1. **Declare Before Use**: Always call `global()` before using global variables
2. **Group Declarations**: Declare related globals together for clarity
3. **Use Locals**: Prefer local variables when possible to avoid global scope

### Common Patterns

```lua
-- Configuration variables
global("CONFIG_DEBUG", "CONFIG_VERBOSE", "CONFIG_LOG_LEVEL")
CONFIG_DEBUG = true
CONFIG_VERBOSE = false
CONFIG_LOG_LEVEL = 2

-- System state
global("GAME_STATE", "CURRENT_PLAYER", "WORLD_INSTANCE")
GAME_STATE = "menu"
CURRENT_PLAYER = nil
WORLD_INSTANCE = nil

-- Constants
global("MAX_PLAYERS", "DEFAULT_WORLD_SIZE", "VERSION_STRING")
MAX_PLAYERS = 6
DEFAULT_WORLD_SIZE = "medium"
VERSION_STRING = "1.0.0"
```

## Error Handling

### Common Errors

**Undeclared Assignment:**
```lua
-- This will error
myVariable = "value"
-- Error: assign to undeclared variable 'myVariable'

-- Correct approach
global("myVariable")
myVariable = "value"
```

**Undeclared Access:**
```lua
-- This will error if someVar was never declared
local value = someVar
-- Error: variable 'someVar' is not declared

-- Correct approach
global("someVar")
someVar = "initial"
local value = someVar
```

**Typos in Variable Names:**
```lua
global("playerHealth")
playerHealth = 100

-- This will error due to typo
playerHeath = 50  -- Error: assign to undeclared variable 'playerHeath'
```

### Debugging Tips

1. **Check Spelling**: Verify variable names are spelled correctly
2. **Verify Declarations**: Ensure `global()` was called for the variable
3. **Check Scope**: Confirm you're not trying to create globals from within functions
4. **Use Locals**: Consider if the variable should be local instead of global

## Best Practices

### Global Variable Management

- **Minimize Globals**: Use global variables sparingly
- **Descriptive Names**: Use clear, descriptive names for global variables
- **Group Related Globals**: Declare related variables together
- **Document Purpose**: Comment the purpose of global variables

### Code Organization

```lua
-- Game configuration globals
global("GAME_MODE", "DIFFICULTY_LEVEL", "DEBUG_ENABLED")
GAME_MODE = "survival"
DIFFICULTY_LEVEL = "normal"
DEBUG_ENABLED = false

-- Player state globals
global("CURRENT_PLAYER", "PLAYER_INVENTORY", "PLAYER_STATS")
CURRENT_PLAYER = nil
PLAYER_INVENTORY = {}
PLAYER_STATS = {}

-- World state globals  
global("WORLD_DAY", "WORLD_SEASON", "WORLD_TEMPERATURE")
WORLD_DAY = 1
WORLD_SEASON = "autumn"
WORLD_TEMPERATURE = 20
```

### Performance Considerations

- **Minimal Overhead**: Metatable checks have minimal performance impact
- **Development Only**: Consider disabling in production builds if needed
- **Batch Declarations**: Declare multiple variables at once when possible

## Integration with DST

### Module Loading

The strict module is typically loaded early in the initialization process:

```lua
-- Usually in main.lua or similar entry point
require("strict")
```

### Interaction with Other Systems

- **Compatible with all DST modules**: Works transparently with existing code
- **Debug-friendly**: Helps catch errors during development
- **Production-ready**: Can be left enabled in release builds

## Common Usage Patterns

### Configuration Management
```lua
-- System configuration
global("SIM_TICK_RATE", "NETWORK_TIMEOUT", "MAX_ENTITIES")
SIM_TICK_RATE = 60
NETWORK_TIMEOUT = 5.0
MAX_ENTITIES = 10000
```

### State Management
```lua
-- Game state tracking
global("CURRENT_SCREEN", "GAME_PAUSED", "SAVE_REQUIRED")
CURRENT_SCREEN = "mainmenu"
GAME_PAUSED = false
SAVE_REQUIRED = false
```

### Development Tools
```lua
-- Debug helpers
global("DEBUG_DRAW_ENABLED", "PROFILING_ENABLED", "LOG_LEVEL")
DEBUG_DRAW_ENABLED = false
PROFILING_ENABLED = false
LOG_LEVEL = "info"
```

## Troubleshooting

### Disabling Strict Mode

If strict mode needs to be temporarily disabled:

```lua
__STRICT = false  -- Disables strict checking
-- ... code that needs relaxed checking ...
__STRICT = true   -- Re-enable strict checking
```

### Working with Dynamic Code

For code that generates variable names dynamically:

```lua
-- Declare variables before dynamic access
global("DYNAMIC_VAR_1", "DYNAMIC_VAR_2", "DYNAMIC_VAR_3")

-- Now dynamic access works
for i = 1, 3 do
    _G["DYNAMIC_VAR_" .. i] = "value" .. i
end
```

## Related Modules

- [Class](./class.md): Object-oriented programming system that works with strict mode
- [Debug](./debugtools.md): Debug utilities that respect strict mode declarations
- [ModUtil](./modutil.md): Mod utilities that handle global variable management
- [Main](./main.md): Main game initialization that loads strict mode
