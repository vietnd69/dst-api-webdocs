---
id: data-types-overview
title: Data Types Overview
sidebar_position: 1
last_updated: 2024-08-22
---
*Last Update: 2024-08-22*
# Data Types Overview

Don't Starve Together uses a variety of data types to represent different kinds of information in the game. This page provides an overview of the common data types used in the Don't Starve Together API.

## Lua Data Types

Don't Starve Together is built on Lua, so it inherits all standard Lua data types:

- **nil** - Represents the absence of a value
- **boolean** - true or false
- **number** - Floating-point numbers (no separate integer type)
- **string** - Immutable sequences of characters
- **function** - First-class values that can be stored and passed around
- **table** - The primary data structure in Lua, used for arrays and dictionaries
- **userdata** - C data stored in Lua variables
- **thread** - Independent threads of execution

## DST-Specific Data Types

Don't Starve Together extends Lua with several custom data types implemented as userdata:

### Vectors and Positioning

- [Vector3](vector3.md) - Three-dimensional vectors used for positions, directions, and scales
- [Vector2](vector.md) - Two-dimensional vectors used for UI positioning and 2D calculations

### Graphics and UI

- [Colour](colour.md) - RGBA color values
- [Rect](rect.md) - Rectangle data type for UI layouts and collision detection
- [Anim](anim.md) - Animation state data

### Network and Data Synchronization

- [NetVar](netvar.md) - Network variables for synchronizing state across clients

### Utility Types

- [UserData](userdata.md) - Base type for DST custom data types
- [LuaTable](luatable.md) - Enhanced Lua tables with additional functionality

## Working with DST Data Types

### Creation

Most DST data types can be created via constructor functions:

```lua
-- Create a Vector3
local pos = Vector3(x, y, z)

-- Create a Color
local color = Color(r, g, b, a)

-- Create a Rect
local rect = Rect(x, y, width, height)
```

### Common Operations

DST data types typically support various operations:

```lua
-- Vector math
local sum = Vector3(1, 0, 0) + Vector3(0, 1, 0)  -- Vector3(1, 1, 0)
local direction = (target_pos - current_pos):Normalize()
local distance = (target_pos - current_pos):Length()

-- Color operations
local darker_color = color * 0.5  -- Multiply all components by 0.5
```

### Conversion

Most DST data types can be converted to standard Lua types when needed:

```lua
-- Convert Vector3 to table
local pos_table = pos:Get()  -- Returns {x, y, z}

-- Convert Rect to dimensions
local x, y, width, height = rect:GetRect()
```

## Memory Management

Unlike standard Lua values, some DST data types may require explicit memory management:

```lua
-- Some types might need cleanup
if anim and anim.Delete then
    anim:Delete()
end
```

## Type Checking

You can check for specific DST data types:

```lua
-- Check if a value is a Vector3
if type(value) == "userdata" and value.IsVector3 and value:IsVector3() then
    -- It's a Vector3
end
```

## See Also

- [Lua Manual](https://www.lua.org/manual/5.1/manual.html) - Official documentation for Lua 5.1
- [Lua Tables](luatable.md) - Advanced usage of Lua tables 