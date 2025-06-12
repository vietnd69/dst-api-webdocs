---
id: netvar
title: Network Variables
sidebar_position: 4
---

# Network Variables

Network Variables (net_*) are special data types used to synchronize data between server and client in the multiplayer system. 

## Overview

Network Variables (NetVars) are an essential component of the Don't Starve Together multiplayer architecture. They provide a mechanism for automatically synchronizing state between the server and connected clients, ensuring that all players see a consistent game world.

Key characteristics of NetVars include:
- They are unidirectional, flowing from server to clients
- They trigger events when values change, allowing for reactive updates
- They are bound to specific entities through their GUIDs
- They support various data types with different performance characteristics and size limitations

## NetVar Types

Don't Starve Together provides several NetVar types for different data needs:

| Type | Description | Range/Size |
|------|-------------|------------|
| `net_bool` | Boolean value | `true` or `false` |
| `net_byte` | 8-bit unsigned integer | 0 to 255 |
| `net_tinybyte` | 3-bit unsigned integer | 0 to 7 |
| `net_smallbyte` | 6-bit unsigned integer | 0 to 63 |
| `net_shortint` | 16-bit signed integer | -32,767 to 32,767 |
| `net_ushortint` | 16-bit unsigned integer | 0 to 65,535 |
| `net_int` | 32-bit signed integer | -2,147,483,647 to 2,147,483,647 |
| `net_uint` | 32-bit unsigned integer | 0 to 4,294,967,295 |
| `net_float` | 32-bit floating point | Standard float range |
| `net_string` | Variable-length string | Limited by network protocol |
| `net_hash` | 32-bit hash value | Usually derived from strings |
| `net_entity` | Entity reference | Valid entity GUIDs |
| `net_bytearray` | Array of bytes | Maximum 31 bytes |
| `net_smallbytearray` | Array of smallbytes | Maximum 31 entries |
| `net_event` | Convenience wrapper over net_bool | Used for one-shot triggers |

## Creating and Using NetVars

NetVars must be created on both the server and client sides to function properly. They are typically declared in component or classified files.

```lua
-- Basic NetVar declaration syntax
local my_variable = net_type(entity_guid, "unique_name", "dirty_event_name")

-- Examples for different types
local is_active = net_bool(inst.GUID, "component_name.is_active", "is_active_dirty")
local health_value = net_byte(inst.GUID, "component_name.health", "health_dirty")
local position_x = net_float(inst.GUID, "component_name.position_x", "position_dirty")
local entity_name = net_string(inst.GUID, "component_name.name", "name_dirty")
```

## NetVar Methods

All NetVar types share a common interface:

```lua
-- Set the value (server-side, will sync to clients)
my_variable:set(new_value)

-- Get the current value (both server and client)
local value = my_variable:value()

-- Set the value locally without syncing
my_variable:set_local(new_value)
```

For `net_event` specifically:
```lua
-- Trigger the event without providing a value
my_event:push()
```

## Event Handling

NetVars can trigger "dirty" events when their values change, allowing components to react to network updates:

```lua
-- Listen for the "dirty" event
inst:ListenForEvent("health_dirty", OnHealthDirty)

-- Handler function
function OnHealthDirty(inst)
    -- React to the updated value
    local new_health = health_value:value()
    -- Update visual representation, play sounds, etc.
end
```

## Common Usage Patterns

### Component Synchronization

```lua
-- In a component initialization
function MyComponent:Init(inst)
    if TheWorld.ismastersim then
        -- Server-side initialization
        self.value = 100
        self.net_value = net_int(inst.GUID, "mycomponent.value", "value_dirty")
        self.net_value:set(self.value)
    else
        -- Client-side initialization
        self.net_value = net_int(inst.GUID, "mycomponent.value", "value_dirty")
        inst:ListenForEvent("value_dirty", function()
            -- Update client-side representation
            local new_value = self.net_value:value()
            -- Do something with the new value
        end)
    end
end

-- Server-side setter that synchronizes to clients
function MyComponent:SetValue(val)
    if TheWorld.ismastersim then
        self.value = val
        self.net_value:set(val)
    end
end
```

### One-time Events

```lua
-- Using net_event for one-time notifications
local explode_event = net_event(inst.GUID, "bomb.explode", "explode_event")

-- Server triggers the event
explode_event:push()

-- Client listens for the event
inst:ListenForEvent("explode_event", function()
    -- Play explosion effects locally
    SpawnPrefab("explosion_fx").Transform:SetPosition(inst.Transform:GetWorldPosition())
    TheFocalPoint.SoundEmitter:PlaySound("dontstarve/common/blackpowder_explo")
end)
```

## Best Practices

1. **Use the appropriate type**: Choose the smallest NetVar type that fits your needs to minimize bandwidth.

2. **Limit update frequency**: NetVars have overhead, so avoid updating them every frame.

3. **Batch updates**: When changing multiple related values, consider using arrays or a single update.

4. **Use local setters for prediction**: Use `:set_local()` for client-side prediction between server updates.

5. **Only set from server**: While clients can call `:set()`, it only changes their local value and doesn't sync.

6. **Use unique names**: Each NetVar on an entity must have a unique name to avoid conflicts.

## Notes

- NetVars are one-way only (server to client). For client-to-server communication, use Remote Procedure Calls (RPCs).
- NetVars must be attached to entities that have had `:AddNetwork()` called on them.
- Avoid binding NetVars to entities that don't exist on the client, as this will cause crashes.
- NetVars should be declared in both the server and client initialization paths. 