---
id: debugprint
title: Debugprint
description: Custom print function wrapper that logs messages with optional source location and supports external logger registration for debugging output.
tags: [debug, logging, console]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 3d167db2
system_scope: world
---

# Debugprint

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`debugprint` replaces the global `print` function to provide enhanced debugging capabilities. It supports optional line-number and source-file reporting (via `PRINT_SOURCE` flag), registered custom logger callbacks, and automatic integration with the in-game debug console. Messages are normalized and stored in a rolling buffer for retrieval when the console is active.

## Usage example
```lua
-- Add a custom logger (e.g., to pipe output to a file or UI)
AddPrintLogger(function(msg) 
    print("[CUSTOM LOGGER]: " .. msg) 
end)

-- Enable source location reporting
PRINT_SOURCE = true
print("Hello from debugprint", 123)

-- Retrieve console output buffer
local lines = GetConsoleOutputList()
for _, line in ipairs(lines) do
    print("Console line:", line)
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `PRINT_SOURCE` | boolean | `false` | Controls whether `print` output includes source file and line number. |
| `print_loggers` | array of functions | `{}` | Internal list of logger callbacks registered via `AddPrintLogger`. |

## Main functions
### `AddPrintLogger(fn)`
*   **Description:** Registers a new callback function to receive all `print` output. Loggers receive a single string argument containing the formatted message.
*   **Parameters:** `fn` (function) - callback to invoke on every print call.
*   **Returns:** Nothing.

### `GetConsoleOutputList()`
*   **Description:** Returns the current list of last `MAX_CONSOLE_LINES` debug console messages.
*   **Parameters:** None.
*   **Returns:** Array of strings (`debugstr`) containing the buffered log lines.

### `escape_lua_pattern(s)`
*   **Description:** Escapes Lua pattern metacharacters in a string so it can be safely used in `string.gsub` or `string.find` calls.
*   **Parameters:** `s` (string) - input string to escape.
*   **Returns:** Escaped string with all pattern metacharacters prefixed by `%`.

### `packstring(...)`
*   **Description:** Converts multiple arguments into a tab-delimited string.
*   **Parameters:** `...` - variable arguments of any type.
*   **Returns:** String with arguments converted to strings and joined by tabs (`\t`).

### `nolineprint(...)`
*   **Description:** Prints messages to all registered loggers *without* prepending source location information, even when `PRINT_SOURCE` is `true`. Used for clean output (e.g., in interactive console).
*   **Parameters:** `...` - variable arguments to log.
*   **Returns:** Nothing.

## Events & listeners
*   **Listens to:** None identified  
*   **Pushes:** None identified