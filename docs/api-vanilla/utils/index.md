---
id: utils-overview
title: Utilities Overview
sidebar_position: 1
last_updated: 2023-07-06
slug: /api/utils
---
*Last Update: 2023-07-06*
# Utilities Overview

Don't Starve Together provides a variety of utility functions to assist with common modding tasks. These utilities are organized into several categories that help with everything from vector math to string manipulation.

## Available Utility Categories

| Category | Description |
|----------|-------------|
| [Vector Utilities](vector.md) | Tools for working with vectors, positions, and spatial calculations |
| [String Utilities](string.md) | Functions for string manipulation, formatting, and text processing |
| [Table Utilities](table.md) | Tools for working with Lua tables, collections, and data structures |
| [Math Utilities](math.md) | Mathematical functions and operations beyond the standard Lua math library |

## When to Use Utilities

These utility functions provide several advantages:

1. **Consistent Behavior**: Using built-in utilities ensures consistent behavior across different mods
2. **Performance**: Many utilities are optimized for performance in the game environment
3. **Convenience**: Complex operations are simplified into easy-to-use function calls
4. **Compatibility**: Utilities are maintained with the game, reducing the risk of breaking changes

## Common Patterns

### Importing Utilities

Most utility functions are globally available without requiring imports. However, it's good practice to check if they exist before using them:

```lua
if table.contains then
    -- Use table.contains
else
    -- Fallback implementation
end
```

### Vector Operations

Vector utilities are used extensively for positioning, movement, and spatial calculations:

```lua
-- Create a position vector
local pos = Vector3(x, y, z)

-- Calculate distance
local dist = pos:Dist(target_pos)

-- Get movement direction
local dir = (target_pos - pos):GetNormalized()
```

### Table Management

Table utilities help manage collections, configurations, and data structures:

```lua
-- Check if table contains a value
if table.contains(allowed_prefabs, prefab) then
    -- Do something
end

-- Safely access nested properties
local damage = table.getfield(config, "combat.damage") or 10
```

### String Processing

String utilities assist with text manipulation, formatting, and localization:

```lua
-- Format time for display
local time_display = str_seconds(time_remaining)

-- Get character-specific dialogue
local speech = GetString(inst, "DESCRIBE", item.prefab)
```

## Integration with Game Systems

Utilities often work together with game systems to create complex behaviors:

```lua
-- Find all entities of a type within a radius
local x, y, z = inst.Transform:GetWorldPosition()
local entities = TheSim:FindEntities(x, y, z, radius, {"monster"})

-- Sort them by distance
table.sort(entities, function(a, b)
    local a_pos = Vector3(a.Transform:GetWorldPosition())
    local b_pos = Vector3(b.Transform:GetWorldPosition())
    local pos = Vector3(x, y, z)
    return a_pos:DistSq(pos) < b_pos:DistSq(pos)
end)
```

## Creating Custom Utilities

You can extend the utility system with your own functions for commonly used operations:

```lua
-- Add custom utility function
if not table.shuffle then
    function table.shuffle(t)
        for i = #t, 2, -1 do
            local j = math.random(i)
            t[i], t[j] = t[j], t[i]
        end
        return t
    end
end
```

By leveraging these utility functions, you can write more concise, efficient, and maintainable mods for Don't Starve Together. 
