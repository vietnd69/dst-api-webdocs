---
id: debugprint
title: Debug Print
description: Enhanced print functions with source line tracking and logger management for debugging purposes
sidebar_position: 6
slug: api-vanilla/core-systems/debugprint
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Debug Print

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `debugprint` module enhances the standard print functionality with source line tracking, multiple logger support, and console output management. It provides enhanced debugging capabilities by showing file names and line numbers for print statements.

## Usage Example

```lua
-- Enable source line printing
PRINT_SOURCE = true

-- Add a custom logger
AddPrintLogger(function(str) 
    log_file:write(str .. "\n") 
end)

-- Use enhanced print (will show line numbers)
print("Debug message")
```

## Global Variables

### PRINT_SOURCE

**Type:** `boolean`

**Status:** `stable`

**Description:**
Controls whether print statements include source file and line number information.

**Example:**
```lua
PRINT_SOURCE = true
print("Hello") -- Output: "main.lua(25,1) Hello"
```

## Functions

### AddPrintLogger(fn) {#addprintlogger}

**Status:** `stable`

**Description:**
Adds a custom logger function that will receive all print output.

**Parameters:**
- `fn` (function): Logger function that accepts a string parameter

**Example:**
```lua
-- Add file logger
AddPrintLogger(function(str)
    local file = io.open("debug.log", "a")
    file:write(os.date() .. ": " .. str .. "\n")
    file:close()
end)

-- Add network logger
AddPrintLogger(function(str)
    SendDebugMessage(str)
end)
```

### print(...) {#print-enhanced}

**Status:** `stable` (overridden)

**Description:**
Enhanced version of the standard print function that supports source line tracking and multiple loggers.

**Parameters:**
- `...` (any): Variable arguments to print

**Behavior:**
- If `PRINT_SOURCE` is true, prepends source file and line number
- Passes output to all registered print loggers
- Converts all arguments to strings separated by tabs

**Example:**
```lua
PRINT_SOURCE = true
print("Value:", 42, "Status:", true)
-- Output: "script.lua(15,1) Value:	42	Status:	true"
```

### nolineprint(...) {#nolineprint}

**Status:** `stable`

**Description:**
Print function that bypasses source line tracking, useful for interactive console output.

**Parameters:**
- `...` (any): Variable arguments to print

**Example:**
```lua
-- Interactive console command
function ExecuteCommand(cmd)
    local result = loadstring(cmd)()
    nolineprint("Result:", result) -- No line number shown
end
```

### GetConsoleOutputList() {#getconsoleoutputlist}

**Status:** `stable`

**Description:**
Returns the list of recent console output lines for display in debug interfaces.

**Returns:**
- (table): Array of recent output lines (limited to MAX_CONSOLE_LINES)

**Example:**
```lua
-- Display recent console output
local lines = GetConsoleOutputList()
for i, line in ipairs(lines) do
    DisplayConsoleLine(line)
end
```

## Internal Functions

### escape_lua_pattern(s) {#escape-lua-pattern}

**Status:** `stable`

**Description:**
Escapes special Lua pattern matching characters in a string.

**Parameters:**
- `s` (string): String to escape

**Returns:**
- (string): Escaped string safe for pattern matching

**Example:**
```lua
local pattern = escape_lua_pattern("file.lua")
-- Returns "file%.lua"
```

### packstring(...) {#packstring}

**Status:** `stable`

**Description:**
Internal function that converts multiple arguments to a tab-separated string.

**Parameters:**
- `...` (any): Variable arguments to pack

**Returns:**
- (string): Tab-separated string of all arguments

## Configuration

### MAX_CONSOLE_LINES

**Value:** `20`

**Status:** `stable`

**Description:**
Maximum number of console output lines to keep in memory for debug display.

## Logger Management

The module maintains an internal list of print loggers that receive all print output:

```lua
-- Internal logger list
local print_loggers = {}

-- Console logger (automatically added on non-console platforms)
local consolelog = function(...)
    local str = packstring(...)
    str = string.gsub(str, dir, "") -- Remove working directory from paths
    
    for idx, line in ipairs(string.split(str, "\r\n")) do
        table.insert(debugstr, line)
    end
    
    while #debugstr > MAX_CONSOLE_LINES do
        table.remove(debugstr, 1)
    end
end
```

## Platform Considerations

The module automatically adds a console logger when running on non-console platforms:

```lua
if IsNotConsole() then
    AddPrintLogger(consolelog)
end
```

## Source Line Format

When `PRINT_SOURCE` is enabled, output follows this format:

```
filename(line,column) message
```

**Example:**
```
scripts/main.lua(42,1) Player spawned at position (100, 0, 200)
```

## Complete Example

```lua
-- Setup debug printing
PRINT_SOURCE = true

-- Add file logger
local log_file = io.open("game_debug.log", "w")
AddPrintLogger(function(str)
    log_file:write(str .. "\n")
    log_file:flush()
end)

-- Add timestamp logger
AddPrintLogger(function(str)
    local timestamp = os.date("%H:%M:%S")
    print("[" .. timestamp .. "] " .. str)
end)

-- Use enhanced printing
print("Game started")
print("Player health:", player.health)

-- Use no-line printing for user interaction
function HandleUserInput(input)
    local result = ProcessCommand(input)
    nolineprint("Command result:", result)
end

-- Display recent console output
function ShowDebugConsole()
    local lines = GetConsoleOutputList()
    for i, line in ipairs(lines) do
        DrawConsoleLine(i, line)
    end
end
```

## Related Modules

- [Debug Tools](./debugtools.md): Additional debugging utilities
- [Debug Commands](./debugcommands.md): Command-line debugging interface
- [Console Commands](./consolecommands.md): Console command system
