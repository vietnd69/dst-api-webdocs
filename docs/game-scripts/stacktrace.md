---
id: stacktrace
title: Stacktrace
description: Provides utility functions for generating and formatting Lua stack traces for debugging purposes.
tags: [debug, util, error-handling]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: acd553d6
system_scope: util
---

# Stacktrace

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`stacktrace.lua` is a utility module that provides functions for capturing, formatting, and reporting Lua stack traces during runtime. It is used primarily for debugging—capturing execution context when errors occur or for manual inspection. The module exposes functions that wrap Lua’s `debug` library to produce human-readable tracebacks with source location, function names, line ranges, and local variable values.

## Usage example
```lua
local StackTrace = require("stacktrace")

-- Capture and print a stack trace manually
print(StackTrace())

-- Or override the default traceback handler
debug.traceback = StackTrace
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
### `SaveToString(v)`
*   **Description:** Safely converts a Lua value to a string representation using `xpcall` to prevent errors from `tostring()` or metamethods. Truncates output exceeding 1024 characters and appends `[**truncated**]`.
*   **Parameters:** `v` (any) - The value to convert.
*   **Returns:** `string` - A safe string representation of the value, potentially truncated.

### `getformatinfo(info)`
*   **Description:** Formats a `debug.getinfo` table into a standardized traceback line, including source path (filtered), line number (if available), function type, name, and line range.
*   **Parameters:** `info` (table|nil) - A table returned by `debug.getinfo()`. If `nil`, returns `"**error**"`.
*   **Returns:** `string` - A formatted traceback line string.

### `getdebuglocals(res, level)`
*   **Description:** Captures local variables for a given stack level and appends formatted entries to the provided `res` array. Handles special formatting for `self`, function references, and tables with `IsValid()` methods.
*   **Parameters:**  
    * `res` (table) - Array to append formatted local variable strings to.  
    * `level` (number) - Stack level (passed to `debug.getlocal`).  
*   **Returns:** `string` - Concatenated result of all local variable entries (unused in practice since `res` is mutated in-place).

### `getdebugstack(res, start, top, bottom)`
*   **Description:** Iterates over stack frames starting at `start`, formats each using `getformatinfo`, and records locals via `getdebuglocals`. Uses heuristics to limit depth.
*   **Parameters:**  
    * `res` (table) - Array to append formatted stack entries to.  
    * `start` (number?) - Starting stack level offset; defaults to `1`.  
    * `top` (number?) - Number of top frames to capture; defaults to `12`.  
    * `bottom` (number?) - Number of bottom frames to capture; defaults to `10`.  
*   **Returns:** `table` - The mutated `res` array containing formatted traceback lines.

### `DoStackTrace(err)`
*   **Description:** Generates a full stack trace prefixed with an optional error message. Parses multi-line error strings and formats the traceback consistently.
*   **Parameters:** `err` (string?) - Optional error message string to prefix the traceback.
*   **Returns:** `string` - Complete stack trace as a multi-line string.

### `StackTrace(err)`
*   **Description:** A robust wrapper around `DoStackTrace` using `xpcall` to prevent failures during trace generation (e.g., due to panics or broken metamethods).
*   **Parameters:** `err` (any) - Error message or value to include in the traceback.
*   **Returns:** `string` - A safe traceback string, or a fallback string if the main function fails.

### `StackTraceToLog()`
*   **Description:** Generates a stack trace and prints it to the console via `print()`.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
Not applicable