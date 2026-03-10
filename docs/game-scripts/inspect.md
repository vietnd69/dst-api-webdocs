---
id: inspect
title: Inspect
description: Provides a human-readable string representation of Lua tables, including support for recursive tables and metatables.
tags: [debug, utility]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: bb0eefe9
system_scope: utility
---

# Inspect

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`inspect` is a utility module that generates human-readable string representations of Lua tables. It handles circular references, metatables, and displays both array and dictionary parts of tables in a structured format. This component is typically used for debugging, logging, or development-time inspection of complex data structures.

## Usage example
```lua
local inspect = require("inspect")
local my_table = { name = "Wes", inventory = {"apple", "match"}, meta = { version = 1 } }
print(inspect(my_table))
-- Output:
-- {
--   "apple",
--   "match",
--   name = "Wes",
--   meta = {
--     version = 1
--   }
-- }
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
### `inspect(table, depth)`
*   **Description:** Returns a formatted, human-readable string representation of the given Lua table. Handles circular references, metatables, and type-specific display formatting.
*   **Parameters:**  
    `table` (table) – The table to inspect.  
    `depth` (number, optional) – Maximum nesting depth to recurse into; omit or pass `nil` for unlimited depth.
*   **Returns:** (string) A string representation of the table.
*   **Error states:** Handles errors gracefully via `pcall` if a `__tostring` metamethod throws; no exceptions thrown by this function.

## Events & listeners
None identified