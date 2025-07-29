---
id: inspect
title: Inspect
description: Library for creating human-readable representations of Lua tables and values
sidebar_position: 8
slug: /game-scripts/core-systems/inspect
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Inspect

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `inspect` module provides functionality for creating human-readable string representations of Lua tables and other data types. It is particularly useful for debugging and development purposes, offering pretty-printed output with proper indentation and handling of complex data structures.

## Usage Example

```lua
local inspect = require("inspect")

local data = {
    name = "Wilson",
    health = 150,
    items = {"axe", "torch", "berries"},
    position = {x = 100, y = 50}
}

print(inspect(data))
-- Output:
-- {
--   health = 150,
--   items = { "axe", "torch", "berries" },
--   name = "Wilson",
--   position = {
--     x = 100,
--     y = 50
--   }
-- }
```

## Functions

### inspect(value, depth) {#inspect-function}

**Status:** `stable`

**Description:**
Creates a human-readable string representation of any Lua value, with special formatting for tables.

**Parameters:**
- `value` (any): The value to inspect and convert to string representation
- `depth` (number, optional): Maximum depth to traverse when inspecting nested tables. If not specified, inspects all levels

**Returns:**
- (string): Human-readable string representation of the value

**Example:**
```lua
-- Simple value inspection
print(inspect("Hello World"))  -- "Hello World"
print(inspect(42))             -- 42
print(inspect(true))           -- true
print(inspect(nil))            -- nil

-- Table inspection with depth limit
local nested = {
    level1 = {
        level2 = {
            level3 = {
                data = "deep"
            }
        }
    }
}

print(inspect(nested, 2))
-- Output stops at level 2, showing {...} for deeper levels
```

**Version History:**
- Stable since initial implementation

## Module Properties

### inspect.__VERSION

**Value:** `"1.2.0"`

**Status:** `stable`

**Description:** Version identifier for the inspect module.

## Features

### Smart String Quoting

The module intelligently chooses between single and double quotes for strings based on their content:

```lua
print(inspect('String with "quotes"'))  -- 'String with "quotes"'
print(inspect("String with 'apostrophes'"))  -- "String with 'apostrophes'"
```

### Circular Reference Detection

Handles circular references by assigning unique IDs to tables and referencing them:

```lua
local a = {}
local b = {ref_to_a = a}
a.ref_to_b = b

print(inspect(a))
-- Output includes table IDs like <table 1> to handle circular references
```

### Array vs Dictionary Distinction

Differentiates between array-like tables and dictionary tables in output formatting:

```lua
-- Array-like table
local array = {"first", "second", "third"}
print(inspect(array))
-- { "first", "second", "third" }

-- Dictionary table
local dict = {key1 = "value1", key2 = "value2"}
print(inspect(dict))
-- {
--   key1 = "value1",
--   key2 = "value2"
-- }
```

### Metatable Support

Displays metatable information when present:

```lua
local t = {data = "example"}
setmetatable(t, {__tostring = function() return "custom string" end})

print(inspect(t))
-- Shows both table content and metatable information
```

### Type-Specific Formatting

Handles different Lua types appropriately:

- **Strings**: Properly quoted with escape sequence handling
- **Numbers**: Direct representation
- **Booleans**: `true` or `false`
- **Nil**: `nil`
- **Tables**: Pretty-printed with indentation
- **Functions**: `<function ID>`
- **Userdata**: `<userdata ID>`
- **Threads**: `<thread ID>`

## Internal Functions

The module includes several internal utility functions:

### smartQuote(str)

Intelligently chooses quote style for strings based on content.

### isIdentifier(str)

Determines if a string can be used as a table key without brackets.

### isArrayKey(k, length)

Checks if a key represents an array index.

### sortKeys(a, b)

Comparison function for sorting table keys by type and value.

## Common Usage Patterns

### Debugging Tables

```lua
-- Debug player data
local player_data = {
    name = "Wilson",
    health = {current = 75, max = 150},
    inventory = {"log", "stone", "gold"}
}

print("Player data:", inspect(player_data))
```

### Configuration Inspection

```lua
-- Inspect game configuration
local config = GetModConfigData()
print("Current config:", inspect(config, 3))  -- Limit depth to 3 levels
```

### Component State Debugging

```lua
-- Debug component state
if inst.components.health then
    print("Health component:", inspect(inst.components.health))
end
```

## Performance Considerations

- The inspect function creates a complete string representation in memory
- For very large or deeply nested tables, consider using the `depth` parameter to limit traversal
- Circular reference detection adds overhead but prevents infinite loops
- String concatenation is optimized using table-based buffering

## Related Modules

- [Debug Tools](./debugtools.md): Comprehensive debugging utilities that may use inspect
- [Debug Print](./debugprint.md): Printing utilities for development
- [Debug Helpers](./debughelpers.md): Additional debugging assistance functions

## See Also

- [Lua Manual - Tables](https://www.lua.org/manual/5.4/manual.html#2.1): Official Lua documentation on tables
- [Programming in Lua - Tables](http://www.lua.org/pil/2.5.html): Detailed guide on Lua table usage
