---
id: dumper
title: Data Dumper
description: Advanced Lua data serialization utility for converting complex data structures to executable Lua code
sidebar_position: 1

last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Data Dumper

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `dumper` module provides advanced Lua data serialization capabilities, converting complex data structures into executable Lua code. It supports all Lua data types, handles circular references, preserves metatables, and includes optimizations for memory usage and performance.

## Usage Example

```lua
-- Simple data dumping
local data = {name = "Wilson", health = 100, items = {"axe", "torch"}}
local lua_code = DataDumper(data, "player_data")

-- Fast mode for performance
local fast_dump = DataDumper(large_table, "big_data", true)

-- Load dumped data
local restored_data = loadstring(lua_code)()
```

## Core Functions

### DataDumper(value, varname, fastmode, ident) {#datadumper}

**Status:** `stable`

**Description:**
Serializes a Lua value into executable Lua code that can recreate the original data structure.

**Parameters:**
- `value` (any): The value to serialize
- `varname` (string): Variable name for the output (defaults to "return ")
- `fastmode` (boolean): Enable fast mode for better performance (optional)
- `ident` (number): Initial indentation level (optional, defaults to 0)

**Returns:**
- (string): Executable Lua code that recreates the original value

**Features:**
- Supports all Lua data types
- Handles circular references
- Preserves metatables (in normal mode)
- Optimized memory usage with save buffer
- Function serialization with closures

**Example:**
```lua
-- Basic usage
local simple_data = {x = 10, y = 20}
local code = DataDumper(simple_data, "position")
print(code)
-- Output: position = {x=10,y=20}

-- Complex nested structure
local complex_data = {
    player = {
        name = "Wilson",
        stats = {health = 100, hunger = 75},
        inventory = {"axe", "torch", "berries"}
    },
    world = {
        day = 15,
        season = "autumn"
    }
}

local serialized = DataDumper(complex_data, "game_state")
local restored = loadstring(serialized)()
```

## Configuration Variables

### USE_SAVEBUFFER

**Type:** `boolean`

**Status:** `stable`

**Description:**
Controls whether to use the save buffer system for memory optimization. Automatically enabled when `MAIN == 1` or `WORLDGEN_MAIN == 1`.

**Purpose:**
- Reduces memory spikes during serialization
- Uses `TheSim` or `WorldSim` buffer functions
- Only active in fast mode

## Internal Data Structures

### lua_reserved_keywords

**Type:** `table`

**Status:** `stable`

**Description:**
Array of Lua reserved keywords that require special handling during key serialization.

**Contents:**
```lua
{'and', 'break', 'do', 'else', 'elseif', 'end', 'false', 'for',
'function', 'if', 'in', 'local', 'nil', 'not', 'or', 'repeat',
'return', 'then', 'true', 'until', 'while'}
```

### c_functions

**Type:** `table`

**Status:** `stable`

**Description:**
Lookup table mapping C functions to their string representations for proper serialization.

## Data Type Handlers

The module includes specialized handlers for each Lua data type:

### String Handler
```lua
string = function(value) 
    return string.format('%q', value) 
end
```
- Properly escapes special characters
- Handles multi-line strings
- Unicode support

### Number Handler
```lua
number = function(value) 
    return value 
end
```
- Direct numeric representation
- Preserves precision

### Boolean Handler
```lua
boolean = function(value) 
    return tostring(value) 
end
```
- Converts to "true" or "false" strings

### Function Handler
- **Normal Mode**: Handles closures with upvalues
- **Fast Mode**: Simple `loadstring` serialization
- **C Functions**: Uses predefined string representations

### Table Handler
- **Circular Reference Detection**: Prevents infinite loops
- **Metatable Preservation**: Includes `setmetatable` calls
- **Optimized Key Handling**: Efficient numeric vs string keys
- **Pretty Printing**: Configurable formatting based on content size

### Userdata Handler
```lua
userdata = function(value)
    error("Cannot dump userdata (" .. tostring(value) .. ")")
end
```
- Userdata cannot be serialized
- Provides error with context information

## Advanced Features

### Closure Serialization

The module can serialize functions with their upvalues:

```lua
local function CreateCounter(start)
    local count = start
    return function()
        count = count + 1
        return count
    end
end

local counter = CreateCounter(10)
local serialized = DataDumper(counter, "my_counter")
-- Includes closure restoration code
```

### Metatable Preservation

```lua
local mt = {__tostring = function(t) return "Custom:" .. t.value end}
local obj = setmetatable({value = 42}, mt)

local code = DataDumper(obj, "custom_obj")
-- Output includes setmetatable call to restore behavior
```

### Circular Reference Handling

```lua
local a = {}
local b = {ref_to_a = a}
a.ref_to_b = b

local serialized = DataDumper(a, "circular_data")
-- Properly handles the circular reference
```

## Performance Modes

### Fast Mode (`fastmode = true`)
- **Optimized for Speed**: Minimal formatting
- **Memory Efficient**: Uses save buffer when available
- **Simple Functions**: Basic function serialization
- **Compact Output**: No pretty printing

### Normal Mode (`fastmode = false`)
- **Full Features**: Complete metatable and closure support
- **Pretty Printing**: Readable output with proper indentation
- **Circular References**: Advanced reference tracking
- **Debug Support**: Better error reporting

## Memory Optimization

When `USE_SAVEBUFFER` is enabled:

```lua
-- Instead of building large strings in memory
local huge_data = GenerateHugeDataSet()
local code = DataDumper(huge_data, "data", true)
-- Uses incremental buffer writing to reduce memory spikes
```

## Complete Example

```lua
-- Example: Serializing game state
local game_state = {
    world = {
        day = 25,
        season = "winter",
        temperature = -10,
        entities = {}
    },
    players = {
        {
            name = "Wilson",
            health = 85,
            hunger = 60,
            position = {x = 100, y = 0, z = 200},
            inventory = {
                {item = "axe", durability = 0.8},
                {item = "torch", fuel = 0.5},
                {item = "berries", quantity = 15}
            }
        }
    },
    settings = {
        difficulty = "normal",
        pvp_enabled = false
    }
}

-- Add some circular references
game_state.world.main_player = game_state.players[1]
game_state.players[1].world_ref = game_state.world

-- Serialize with different modes
print("=== Fast Mode ===")
local fast_serialized = DataDumper(game_state, "game_state", true)
print(fast_serialized)

print("\n=== Normal Mode ===")
local normal_serialized = DataDumper(game_state, "game_state", false)
print(normal_serialized)

-- Restore and verify
local restored_state = loadstring(normal_serialized)()
print("\nVerification:")
print("Original player name:", game_state.players[1].name)
print("Restored player name:", restored_state.players[1].name)
print("Circular reference intact:", 
      restored_state.world.main_player == restored_state.players[1])

-- Function serialization example
local function CreateValidator(min_value)
    return function(value)
        return value >= min_value
    end
end

local health_validator = CreateValidator(0)
local validator_code = DataDumper(health_validator, "health_check")
print("\nFunction with closure:")
print(validator_code)

-- Load and test the function
local restored_validator = loadstring(validator_code)()
print("Validator test (-10):", restored_validator(-10))  -- false
print("Validator test (50):", restored_validator(50))    -- true
```

## Error Handling

The module provides specific error handling for unsupported data types:

```lua
-- Userdata error with context
local userdata_obj = newproxy()
-- DataDumper(userdata_obj) -- Error: "Cannot dump userdata"

-- Thread error
local co = coroutine.create(function() end)
-- DataDumper(co) -- Error: "Cannot dump threads"
```

## Integration with Save System

The module integrates with DST's save system through the save buffer:

```lua
-- When USE_SAVEBUFFER is true and TheSim/WorldSim available
if USE_SAVEBUFFER and TheSim then
    -- Uses TheSim:AppendSaveString() for memory efficiency
    -- Reduces memory allocation during large data serialization
end
```

## Performance Considerations

1. **Fast Mode**: Use for large datasets where speed is critical
2. **Save Buffer**: Automatically used when available to reduce memory usage
3. **Circular References**: Normal mode handles these but adds overhead
4. **Function Closures**: Complex functions increase serialization time

## Limitations

1. **Userdata**: Cannot serialize userdata objects
2. **Threads**: Coroutines cannot be serialized
3. **C Functions**: Limited to predefined function mappings
4. **File Handles**: IO objects cannot be serialized

## Related Modules

- [Debug Tools](./debugtools.md): Table inspection utilities
- [Save Index](./saveindex.md): Game save/load system
- [JSON](./json.md): Alternative serialization format
- [Util](../util/): General utility functions
