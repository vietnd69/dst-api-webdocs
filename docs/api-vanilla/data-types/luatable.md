---
id: luatable
title: Lua Table
sidebar_position: 5
---

# Lua Table

Lua Table is a flexible data structure widely used in the Don't Starve Together API for storing and passing data. 

## Overview

In Lua, tables are the only built-in complex data structure and serve multiple purposes:
- Arrays (sequential data)
- Dictionaries/Maps (key-value pairs)
- Objects (through metatables)
- Namespaces (for organizing functions and variables)

Don't Starve Together uses tables extensively throughout its codebase to represent everything from inventory contents to game configurations and component data.

## Table Creation

```lua
-- Empty table
local empty_table = {}

-- Table with initial values (as an array)
local array_like = {"Wilson", "Willow", "Wolfgang", "Wendy"}

-- Table with initial values (as a dictionary)
local dict_like = {
    health = 150,
    hunger = 150,
    sanity = 200,
    damage = 1.0
}

-- Mixed table with both array and dictionary parts
local mixed = {
    "first_item",
    "second_item",
    name = "Backpack",
    slots = 8
}
```

## Accessing Table Elements

```lua
-- Array-like access (indices start at 1 in Lua)
local character = array_like[1]  -- "Wilson"
local last = array_like[#array_like]  -- "Wendy" (#table returns the length)

-- Dictionary-like access
local health_value = dict_like.health  -- 150
-- OR using square brackets (required for dynamic keys)
local stat_name = "hunger"
local hunger_value = dict_like[stat_name]  -- 150

-- Checking if a key exists
if dict_like.speed then
    -- This code won't run because 'speed' doesn't exist
end

-- Safe access pattern for nested tables
if dict_like and dict_like.attributes and dict_like.attributes.speed then
    -- Safe way to check deeply nested properties
end
```

## Iterating Over Tables

```lua
-- Iterate over all key-value pairs (unordered)
for k, v in pairs(dict_like) do
    print(k, v)  -- Prints each key and value
end

-- Iterate over array part only (ordered by index)
for i, v in ipairs(array_like) do
    print(i, v)  -- Prints each index and value
end

-- Manual iteration with numeric indices
for i = 1, #array_like do
    local value = array_like[i]
    -- Do something with value
end
```

## Table Manipulation

```lua
-- Adding elements
dict_like.speed = 6  -- Add a new key-value pair
table.insert(array_like, "Maxwell")  -- Add to the end of array
table.insert(array_like, 2, "Wickerbottom")  -- Insert at position 2

-- Removing elements
dict_like.damage = nil  -- Remove a key-value pair
table.remove(array_like, 3)  -- Remove item at index 3
table.remove(array_like)  -- Remove last item

-- Concatenating array contents to a string
local names_string = table.concat(array_like, ", ")

-- Sorting array part
table.sort(array_like)  -- Default sort (alphabetical for strings)
table.sort(array_like, function(a, b) return #a < #b end)  -- Sort by string length
```

## Tables as Objects

In Don't Starve Together, tables often function as objects with methods:

```lua
-- Creating a component-like object
local MyObject = {
    value = 100,
    
    -- Method definition
    GetValue = function(self)
        return self.value
    end,
    
    -- Alternative method definition
    SetValue = function(self, new_value)
        self.value = new_value
    end
}

-- Using methods
local current = MyObject:GetValue()  -- Colon syntax automatically passes 'self'
MyObject:SetValue(150)
```

## Common DST Table Patterns

### Component Structure

```lua
local MyComponent = Class(function(self, inst)
    self.inst = inst
    self.value = 100
    self.active = true
end)

function MyComponent:GetValue()
    return self.value
end

function MyComponent:SetValue(val)
    self.value = val
    -- Do something with the new value
end

return MyComponent
```

### Configuration Tables

```lua
-- Tuning constants
TUNING.MY_CHARACTER = {
    HEALTH = 150,
    HUNGER = 150,
    SANITY = 200,
    DAMAGE = 1.0,
    SPEED = 6,
    HUNGER_RATE = 0.15
}

-- Recipe definition
local my_item = Recipe("my_item", 
    {
        Ingredient("twigs", 2),
        Ingredient("cutgrass", 3),
        Ingredient("flint", 1)
    },
    RECIPETABS.SURVIVAL,
    TECH.SCIENCE_ONE
)
```

### Event Callbacks

```lua
-- Event handler table
local events = {
    onattacked = function(inst, data)
        -- React to being attacked
    end,
    
    ondeath = function(inst)
        -- React to death
    end
}

-- Register all events
for event, fn in pairs(events) do
    inst:ListenForEvent(event, fn)
end
```

## Advanced Table Techniques

### Table References

Tables are reference types in Lua, which means:

```lua
local original = {value = 10}
local reference = original  -- Both variables point to the same table

reference.value = 20  -- Changes both 'reference' and 'original'
print(original.value)  -- Prints 20

-- Deep copying a table (simple version)
function DeepCopy(orig)
    local copy
    if type(orig) == "table" then
        copy = {}
        for k, v in pairs(orig) do
            copy[k] = DeepCopy(v)
        end
    else
        copy = orig
    end
    return copy
end

local independent_copy = DeepCopy(original)
```

### Metatables

Metatables enable advanced table behavior in Lua:

```lua
-- Create a vector-like table with metamethods
local Vector = {}
Vector.__index = Vector

function Vector.new(x, y, z)
    return setmetatable({x = x or 0, y = y or 0, z = z or 0}, Vector)
end

function Vector.__add(a, b)
    return Vector.new(a.x + b.x, a.y + b.y, a.z + b.z)
end

-- Usage
local v1 = Vector.new(1, 0, 0)
local v2 = Vector.new(0, 1, 0)
local v3 = v1 + v2  -- Uses the __add metamethod
```

## Best Practices

1. **Use the right structure**: Arrays for sequential data, dictionaries for named properties.

2. **Check existence**: Always check if a table or key exists before accessing nested properties.

3. **Be careful with references**: Remember that tables are passed by reference, not by value.

4. **Prefer local tables**: Use local variables for tables to avoid polluting the global namespace.

5. **Initialize tables properly**: Set default values for all expected keys to avoid nil errors.

6. **Use table.insert/remove**: For array operations rather than directly setting indices.

7. **Cache table results**: Store table.X in a local variable if you'll access it multiple times. 