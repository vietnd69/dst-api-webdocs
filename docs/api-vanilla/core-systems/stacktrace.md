---
id: stacktrace
title: Stack Trace
description: Debug stack trace and error handling utilities for Lua error analysis and debugging
sidebar_position: 105
slug: core-systems/stacktrace
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Stack Trace

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `stacktrace` module provides comprehensive debugging utilities for Lua error analysis and stack trace generation. It includes functions for safe value conversion, local variable inspection, stack trace formatting, and error handling with detailed context information.

## Usage Example

```lua
-- Generate a stack trace for current execution context
local trace = StackTrace("Custom error message")
print(trace)

-- Print stack trace directly to log
StackTraceToLog()

-- Safe string conversion with truncation
local safeStr = SaveToString(complexObject)
```

## Functions

### SaveToString(v) {#save-to-string}

**Status:** `stable`

**Description:**
Safely converts any Lua value to a string representation with error handling and length truncation to prevent memory issues.

**Parameters:**
- `v` (any): The value to convert to string

**Returns:**
- (string): String representation of the value, truncated if necessary

**Features:**
- Error-safe conversion using `xpcall`
- Automatic truncation at 1024 characters
- Fallback message for conversion failures

**Example:**
```lua
-- Safe conversion of complex objects
local complexTable = { nested = { data = "value" } }
local str = SaveToString(complexTable)  -- "table: 0x..."

-- Handles conversion errors gracefully
local problematicValue = setmetatable({}, { __tostring = function() error("fail") end })
local safeStr = SaveToString(problematicValue)  -- "*** failed to evaluate ***"

-- Automatic truncation for long strings
local longStr = string.rep("a", 2000)
local truncated = SaveToString(longStr)  -- ends with " [**truncated**]"
```

### getdebuglocals(res, level) {#get-debug-locals}

**Status:** `stable`

**Description:**
Extracts and formats local variables from a specific stack level, with special handling for `self` references and entity validation.

**Parameters:**
- `res` (table): Result table to append formatted local variable information
- `level` (number): Stack level to inspect (relative to caller)

**Returns:**
- (string): Concatenated string of formatted local variables

**Special Handling:**
- **Self References**: Expanded with validity checking for entities
- **Functions**: Shows definition location and line numbers
- **Entities**: Displays validity status using `IsValid()` method
- **Compiler Variables**: Filters out variables starting with "("

**Example:**
```lua
-- Extract locals from current stack level
local result = {}
getdebuglocals(result, 0)

-- Example output format:
--   self (valid:true) =
--      component = table: 0x... (valid:true)
--      prefab = "wilson"
--      Transform = function - scripts/components/transform.lua:15
--   playerName = "Player1"
--   healthValue = 100
```

### getdebugstack(res, start, top, bottom) {#get-debug-stack}

**Status:** `stable`

**Description:**
Generates a detailed stack trace with local variable information for each stack frame.

**Parameters:**
- `res` (table): Result table to append stack trace information
- `start` (number, optional): Starting stack level (default: 1)
- `top` (number, optional): Number of top stack frames to include (default: 12)
- `bottom` (number, optional): Number of bottom stack frames to include (default: 10)

**Returns:**
- (table): The modified result table with stack trace information

**Features:**
- Automatic stack depth detection
- Intelligent frame truncation for large stacks
- Local variable extraction for each frame
- Source file and line number information

**Example:**
```lua
local result = {}
getdebugstack(result, 1, 5, 3)

-- Example output includes:
-- @scripts/prefabs/player.lua:45 in (local) DoSomething (Lua) <40-50>
--   health = 100
--   player = table: 0x... (valid:true)
-- @scripts/main.lua:123 in (global) main (main) <1-200>
--   dt = 0.016667
```

### DoStackTrace(err) {#do-stack-trace}

**Status:** `stable`

**Description:**
Internal function that generates a complete stack trace with error message formatting and local variable details.

**Parameters:**
- `err` (string, optional): Error message to include in the trace

**Returns:**
- (string): Formatted stack trace with error information

**Error Handling:**
- Processes multi-line error messages
- Prefixes error lines with "#" for identification
- Includes comprehensive stack information
- Handles nested error scenarios

**Example:**
```lua
-- Generate stack trace with custom error
local trace = DoStackTrace("Custom error occurred")

-- Example output:
-- #Custom error occurred
-- #LUA ERROR stack traceback:
-- @scripts/example.lua:10 in (local) errorFunction (Lua) <8-15>
--   errorMsg = "Custom error occurred"
-- @scripts/main.lua:5 in (global) main (main) <1-20>
```

### StackTrace(err) {#stack-trace}

**Status:** `stable`

**Description:**
Main function for generating stack traces with comprehensive error handling and panic recovery.

**Parameters:**
- `err` (string, optional): Error message to include in the trace

**Returns:**
- (string): Complete formatted stack trace

**Safety Features:**
- Panic recovery mechanism for recursive errors
- Fallback to basic debug information
- Protected execution using `xpcall`
- Graceful degradation on errors

**Example:**
```lua
-- Generate stack trace for debugging
local function problemFunction()
    local trace = StackTrace("Something went wrong")
    return trace
end

-- Use with error handling
local status, result = pcall(riskyFunction)
if not status then
    local trace = StackTrace(result)
    print("Error occurred:", trace)
end
```

### StackTraceToLog() {#stack-trace-to-log}

**Status:** `stable`

**Description:**
Convenience function that generates a stack trace for the current execution context and prints it directly to the log.

**Parameters:**
None

**Returns:**
None (outputs to log)

**Usage Context:**
Ideal for debugging scenarios where immediate log output is needed without error context.

**Example:**
```lua
-- Debug current execution context
function debugCurrentState()
    print("Current state:")
    StackTraceToLog()  -- Prints trace to log immediately
end

-- Use in conditional debugging
if DEBUG_MODE then
    StackTraceToLog()
end
```

## Global Variables

### _TRACEBACK

**Value:** Reference to `StackTrace` function

**Status:** `stable`

**Description:**
Global reference to the main stack trace function, allowing it to be used as a standard Lua error handler.

**Usage:**
```lua
-- Set as global error handler
debug.traceback = _TRACEBACK

-- Use in xpcall
local success, result = xpcall(riskyFunction, _TRACEBACK)
```

## Internal Functions

### getfiltersource(src) {#get-filter-source}

**Status:** `stable` (internal)

**Description:**
Internal utility that filters and formats source file paths for display in stack traces.

**Processing:**
- Removes "@" prefix from source paths
- Handles missing source information
- Returns filtered path or "[?]" placeholder

### getformatinfo(info) {#get-format-info}

**Status:** `stable` (internal)

**Description:**
Internal function that formats debug info structures into readable stack frame descriptions.

**Format Pattern:**
```
@source:line in (namewhat) name (what) <startline-endline>
```

## Configuration

### String Truncation

**Maximum Length:** 1024 characters

**Purpose:** Prevents memory issues with extremely large object representations

**Behavior:** Appends " [**truncated**]" to indicate truncation

### Stack Frame Limits

**Default Top Frames:** 12

**Default Bottom Frames:** 10

**Adaptive Behavior:** Adjusts limits based on total stack depth

## Error Handling Patterns

### Basic Error Tracing
```lua
local function safeOperation()
    local success, result = xpcall(
        dangerousFunction,
        StackTrace
    )
    
    if not success then
        print("Operation failed:", result)
        return nil
    end
    
    return result
end
```

### Debug Context Capture
```lua
local function debugWrapper(func, ...)
    print("Before operation:")
    StackTraceToLog()
    
    local result = func(...)
    
    print("After operation:")
    StackTraceToLog()
    
    return result
end
```

## Related Modules

- [Debug Helpers](./debughelpers.md): Additional debugging utilities
- [Debug Commands](./debugcommands.md): Interactive debugging commands
- [Debug Print](./debugprint.md): Debug output formatting
- [Known Errors](./knownerrors.md): Common error patterns and solutions

## Technical Notes

### Performance Considerations
- Stack trace generation is expensive; use judiciously
- Local variable inspection can be memory-intensive
- Consider conditional debugging in production builds

### Lua Debug Integration
Uses Lua's built-in `debug` library functions:
- `debug.getinfo()` for stack frame information
- `debug.getlocal()` for local variable access
- Protected execution patterns for error safety

### Memory Management
- Automatic string truncation prevents memory bloat
- Cleanup of strict mode during execution
- Efficient table operations for result building
