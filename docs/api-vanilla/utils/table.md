---
id: table
title: Table Utilities
sidebar_position: 4
---

# Table Utilities

Lua table manipulation and processing functions for Don't Starve Together modding.

## Standard Table Functions

These functions are part of the standard Lua table library:

### Basic Operations

```lua
-- Insert an element into a table
table.insert(t, value)       -- Appends value to the end
table.insert(t, pos, value)  -- Inserts at position pos

-- Remove an element from a table
table.remove(t)              -- Removes last element
table.remove(t, pos)         -- Removes element at position pos

-- Sort a table
table.sort(t)                -- Sort with default comparison (<)
table.sort(t, compare_fn)    -- Sort with custom comparison function

-- Concatenate table elements
table.concat(t)              -- Join all elements
table.concat(t, separator)   -- Join with separator
```

## Extended Table Functions

Don't Starve Together provides additional utility functions for working with tables:

### Table Properties

```lua
-- Get the number of elements in a table
local count = table.count(t)

-- Get the maximum numeric index
local max_index = table.maxn(t)

-- Get number of elements when used as an array
local length = table.getn(t)
```

### Table Transformations

```lua
-- Get all keys from a table
local keys = table.getkeys(t)

-- Invert a table (swap keys and values)
local inverted = table.invert(t)

-- Reverse a table (array)
local reversed = table.reverse(t)
```

### Table Element Operations

```lua
-- Remove a specific value from an array
table.removearrayvalue(t, value)

-- Remove a specific value from any table
table.removetablevalue(t, value)

-- Check if a table contains a value
if table.contains(t, value) then
    -- Table contains the value
end

-- Check if a table contains a key
if table.containskey(t, key) then
    -- Table contains the key
end

-- Find a key by its value
local key = table.reverselookup(t, value)

-- Check if two tables have identical keys
if table.keysareidentical(t1, t2) then
    -- Tables have the same keys
end
```

### Nested Table Operations

```lua
-- Access nested fields safely by string path
local value = table.getfield(t, "path.to.field")

-- Set nested fields by string path
table.setfield(t, "path.to.field", value)

-- Find a field in a nested table
local path = table.findfield(t, field_name)

-- Find the path to a field in a nested table
local path = table.findpath(t, field_name)

-- Access nested fields with type checking
local value = table.typecheckedgetfield(t, expected_type, "field1", "field2")
```

### Debug Functions

```lua
-- Get a string representation of a table (for debugging)
local str = table.inspect(t)
```

## Common Use Cases

### Working with Component Data

```lua
-- Store component configuration
local config = {
    health = 100,
    damage = 10,
    tags = {"monster", "hostile"}
}

-- Add tags
for _, tag in ipairs(config.tags) do
    inst:AddTag(tag)
end

-- Check if entity has any hostile tag
local hostile_tags = {"hostile", "monster", "epic"}
for _, tag in ipairs(hostile_tags) do
    if inst:HasTag(tag) then
        return true
    end
end
```

### Managing Collections

```lua
-- Keep track of all spawned entities
local spawned_entities = {}

local function RegisterEntity(entity)
    table.insert(spawned_entities, entity)
    entity:ListenForEvent("onremove", function()
        table.removetablevalue(spawned_entities, entity)
    end)
end

-- Find closest entity
local function GetClosestEntity(position, max_dist)
    local closest = nil
    local closest_dist = max_dist or math.huge
    
    for _, entity in ipairs(spawned_entities) do
        local dist = entity:GetDistanceSqToPoint(position)
        if dist < closest_dist then
            closest = entity
            closest_dist = dist
        end
    end
    
    return closest
end
```

### Configuration and Data Storage

```lua
-- Nested configuration
local config = {
    spawn = {
        frequency = 0.1,
        max_entities = 10
    },
    entity = {
        health = 100,
        speed = 4
    }
}

-- Access with getfield
local spawn_freq = table.getfield(config, "spawn.frequency")
local max_health = table.getfield(config, "entity.health")

-- Set with setfield
table.setfield(config, "spawn.max_entities", 20)
``` 