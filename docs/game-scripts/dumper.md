---
id: dumper
title: Dumper
description: Serializes Lua values (including tables and functions) into human-readable Lua source code strings for debugging or save/restore operations.
tags: [utility, serialization, debug]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 1df7de3b
system_scope: utility
---

# Dumper

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`DataDumper` is a utility module that converts arbitrary Lua values — including tables, functions, numbers, strings, booleans, and `nil` — into valid Lua source code strings. It supports two modes: a fast mode optimized for saving data, and a slower, more robust mode that handles closures and shared references (e.g., recursive tables or metatables) correctly. It is used internally for debugging, serialization, and world/entity state persistence — particularly in conjunction with `TheSim` or `WorldSim` save buffers when `USE_SAVEBUFFER` is enabled.

## Usage example
```lua
local val = { x = 1, y = { a = 2 }, name = "test" }
local dump = DataDumper(val, "mytable")
-- dump becomes: "mytable = {x=1,y={a=2},name=\"test\"}"

local func = function() return 42 end
dump = DataDumper(func, "myfunc")
-- dump becomes: "myfunc = loadstring(\"...bytecode...\")"
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
### `DataDumper(value, varname, fastmode, ident)`
*   **Description:** Serializes a Lua value into a string of executable Lua code. When `varname` is provided, it prefixes the output with `varname = ` (or `return ` if omitted). The `fastmode` flag enables optimized output (no indentation, no deduplication of shared references); `ident` controls indentation depth for readability in non-fast mode.
*   **Parameters:**
    *   `value` (any) — The Lua value to serialize.
    *   `varname` (string?, optional) — Variable name to assign the result to. If `nil`, returns `return <serialized_value>`. If a valid identifier, returns `<varname> = <serialized_value>`.
    *   `fastmode` (boolean?, optional) — If true, uses faster serialization without metatable/closure deduplication or formatting. Uses `WorldSim`/`TheSim` save buffers if available.
    *   `ident` (number?, optional) — Starting indentation level for pretty-printing (ignored in fast mode).
*   **Returns:** (string) — A string of Lua source code that, when executed, reproduces the input value (where possible).
*   **Error states:**
    *   Raises an error for `userdata` values with message `"Cannot dump userdata..."`.
    *   Raises an error for thread values: `"Cannot dump threads"`.
    *   In non-fast mode, handles cycles and shared references safely.

## Events & listeners
None identified