---
id: netvar
title: Network Variables
sidebar_position: 5
last_updated: 2023-07-06
---

# Network Variables

Network variables (netvars) are specialized data types in Don't Starve Together that handle automatic synchronization between server and clients. They are the backbone of DST's multiplayer architecture.

## Overview

Network variables provide a mechanism to:
- Automatically synchronize state between server and clients
- Trigger events when values change
- Optimize network bandwidth through various encoding methods
- Support different data types and sizes

## Available Network Variable Types

```lua
-- Import network variable modules
local net_string = require "net_string"    -- String values
local net_bool = require "net_bool"        -- Boolean values
local net_byte = require "net_byte"        -- Byte values (0-255)
local net_tinybyte = require "net_tinybyte" -- 4-bit values (0-15)
local net_smallbyte = require "net_smallbyte" -- 6-bit values (0-63)
local net_int = require "net_int"          -- Integer values
local net_uint = require "net_uint"        -- Unsigned integer values
local net_float = require "net_float"      -- Floating point values
local net_hash = require "net_hash"        -- String hash values (efficient for strings)
local net_entity = require "net_entity"    -- Entity references
local net_shortint = require "net_shortint" -- 16-bit integer values
local net_bytearray = require "net_bytearray" -- Array of bytes
```

## Creating Network Variables

Network variables are initialized with three parameters:

```lua
-- Basic initialization format
local my_netvar = net_type(entity_guid, variable_path, [dirty_event_name])

-- Parameters:
-- entity_guid: GUID of the entity that owns this variable (typically inst.GUID)
-- variable_path: String that uniquely identifies the variable (e.g., "health.current")
-- dirty_event_name: Optional name of event to trigger when value changes
```

### Examples

```lua
-- Create a network variable for health
self.current_health = net_float(inst.GUID, "health.current", "healthdirty")

-- Create a network variable for entity state
self.state = net_string(inst.GUID, "npc.state", "statechanged") 

-- Create a network variable for carrying an item
self.carrying_item = net_entity(inst.GUID, "inventory.activeitem", "activeitembecamedirty")

-- Create a network variable without a custom dirty event
self.mana = net_int(inst.GUID, "mana.current") -- Uses default dirty event name
```

## Using Network Variables

### Setting Values (Server Only)

Network variables can only be set on the server:

```lua
-- Set a value (server-only)
if TheWorld.ismastersim then
    self.current_health:set(100)
    self.state:set("idle")
    self.carrying_item:set(item_entity)
end

-- Set a value without triggering dirty event
self.current_health:set_local(100)

-- Force a dirty event even if value hasn't changed
self.current_health:set(100, true)
```

### Reading Values (Both Server and Client)

Both server and clients can read network variable values:

```lua
-- Get the current value
local health = self.current_health:value()
local state = self.state:value()
local item = self.carrying_item:value()

-- Check if the value exists
if self.carrying_item:value() ~= nil then
    -- Has an item
end
```

### Handling Value Changes

Clients can listen for network variable changes:

```lua
-- In component initialization
if not TheWorld.ismastersim then
    -- Listen for the dirty event
    inst:ListenForEvent("healthdirty", function()
        local new_health = self.current_health:value()
        -- Update visual health bar
        UpdateHealthBar(new_health)
    end)
    
    inst:ListenForEvent("statechanged", function()
        local new_state = self.state:value()
        -- Play animation for new state
        inst.AnimState:PlayAnimation(new_state)
    end)
end
```

## Advanced Features

### Target-Specific Network Variables

Some network variables can be targeted to specific players:

```lua
-- Network variable visible only to a specific player
self.secret_info = net_string(inst.GUID, "player.secretinfo", "secretinfodirty")

-- Set the variable to be visible only to the owner
inst.Network:SetClassifiedTarget(owner)

-- Make the variable visible to everyone again
inst.Network:SetClassifiedTarget(nil)
```

### Array Network Variables

For arrays of data:

```lua
-- Create a byte array network variable (for inventory slots)
self.inventory_items = net_bytearray(inst.GUID, "inventory.items", "inventorydirty")

-- Set the array data
local data = {1, 5, 3, 0, 2}
self.inventory_items:set(data)
```

### Optimizing with Different Types

Choose appropriate network variable types to conserve bandwidth:

```lua
-- For values 0-15, use tinybyte (4 bits)
self.small_value = net_tinybyte(inst.GUID, "tinystats.value")

-- For values 0-63, use smallbyte (6 bits)
self.medium_value = net_smallbyte(inst.GUID, "smallstats.value")

-- For values 0-255, use byte (8 bits)
self.byte_value = net_byte(inst.GUID, "bytestats.value")

-- For values 0-65535, use shortint (16 bits)
self.short_value = net_shortint(inst.GUID, "shortstats.value")

-- For larger or negative values, use int (32 bits)
self.large_value = net_int(inst.GUID, "stats.value")
```

## Network Variables in Replica Components

Network variables are the foundation of replica components:

```lua
-- components/mycomponent_replica.lua
local MyComponent = Class(function(self, inst)
    self.inst = inst
    
    -- Define network variables
    self._value = net_int(inst.GUID, "mycomponent.value", "mycomponent.valuedirty")
    self._active = net_bool(inst.GUID, "mycomponent.active", "mycomponent.activedirty")
    self._owner = net_entity(inst.GUID, "mycomponent.owner", "mycomponent.ownerdirty")
    
    -- Set up client-side event handlers
    if not TheWorld.ismastersim then
        inst:ListenForEvent("mycomponent.valuedirty", function()
            inst:PushEvent("valuechanged", {value = self:GetValue()})
        end)
        
        inst:ListenForEvent("mycomponent.activedirty", function()
            if self:IsActive() then
                inst:PushEvent("activated")
            else
                inst:PushEvent("deactivated")
            end
        end)
    end
end)

function MyComponent:SetValue(val)
    if TheWorld.ismastersim then
        self._value:set(val)
    end
end

function MyComponent:GetValue()
    return self._value:value()
end

function MyComponent:SetActive(active)
    if TheWorld.ismastersim then
        self._active:set(active)
    end
end

function MyComponent:IsActive()
    return self._active:value()
end

return MyComponent
```

## Best Practices

1. **Use Appropriate Types**: Select the smallest netvar type that can represent your data range
2. **Minimize Updates**: Only set network variables when values actually change
3. **Batch Updates**: Group related changes to minimize network traffic
4. **Prioritize Important Data**: Consider which data needs immediate synchronization
5. **Consider Visibility**: Use classified targets for player-specific data
6. **Avoid Large Strings**: Large strings consume significant bandwidth
7. **Optimize Dirty Events**: Only listen for events you need to respond to

## Common Issues and Solutions

### Debugging Network Variables

```lua
-- Print the current value
print("Current health: " .. tostring(self.current_health:value()))

-- Check if variable is initialized
assert(self.current_health ~= nil, "Network variable not initialized")

-- Force a variable update
if TheWorld.ismastersim then
    self.current_health:set(self.current_health:value(), true) -- Force dirty
end
```

### Variable Not Synchronizing

Common causes:
- Variable is created after `SetPristine()`
- Missing entity:AddNetwork() call
- Server and client have different variable paths
- Setting values on the client (which is ignored)

### Excessive Network Traffic

Solutions:
- Use smaller network variable types
- Reduce update frequency
- Use delta compression for related values
- Batch updates of related variables 
