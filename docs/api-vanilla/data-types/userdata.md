---
id: userdata
title: Userdata
sidebar_position: 5
last_updated: 2023-07-06
version: 619045
---
*Last Update: 2023-07-06*
# Userdata

*API Version: 619045*

Userdata is a special data type in Lua that represents C data in the Lua environment. In the context of Don't Starve Together, userdata objects are native engine objects or custom data structures that are implemented in C/C++ but exposed to Lua for scripting purposes.

## Basic Concepts

Userdata in DST represents data that is managed by the game engine itself rather than by the Lua garbage collector. These objects often encapsulate complex functionality or performance-critical operations that are more efficiently implemented in the native language (C/C++).

```lua
-- Userdata objects are typically accessed through API functions
local light = TheSim:GetLightAtPoint(x, y, z) -- Returns userdata representing light information
local physics = inst.Physics -- Physics component is a userdata object
```

## Common Userdata Types

In Don't Starve Together, several important engine systems are exposed to Lua as userdata:

| Userdata Type | Description |
|----------|-------------|
| `AnimState` | Animation system controlling entity visuals |
| `Physics` | Physics engine interface for physical interactions |
| `Light` | Lighting system components |
| `Transform` | Positional and orientation data |
| `SoundEmitter` | Sound playback system |
| `Network` | Networking system for multiplayer sync |
| `DynamicShadow` | Shadow casting system |
| `MiniMapEntity` | Minimap representation system |

## Interacting with Userdata

Userdata objects typically provide methods that can be called using the standard Lua method syntax:

```lua
-- Setting position using Transform userdata
inst.Transform:SetPosition(x, y, z)

-- Playing animations using AnimState userdata
inst.AnimState:PlayAnimation("idle")
inst.AnimState:PushAnimation("walk", true)

-- Working with Physics userdata
inst.Physics:SetMass(10)
inst.Physics:SetFriction(0.5)
```

### Read-only vs. Modifiable Userdata

Some userdata objects in DST are read-only, meaning you can query their state but not modify them directly. Others provide methods for both reading and modifying their state.

```lua
-- Reading from userdata
local x, y, z = inst.Transform:GetWorldPosition() -- Reading position data

-- Modifying userdata (when permitted)
inst.AnimState:SetMultColor(1, 0, 0, 1) -- Setting animation color to red
```

## Memory Management

Unlike regular Lua tables, userdata objects are not directly managed by Lua's garbage collector. Instead, their lifecycle is typically tied to the entity they belong to. When an entity is removed from the game, its associated userdata objects are cleaned up by the engine.

```lua
-- Userdata is automatically managed when the entity is created or destroyed
local inst = CreateEntity()
inst.entity:AddAnimState() -- Creates AnimState userdata
inst.entity:AddTransform() -- Creates Transform userdata

-- When the entity is removed, userdata is cleaned up automatically
inst:Remove()
```

## Limitations and Best Practices

### Limitations

1. **No Direct Creation**: Most userdata objects cannot be created directly in Lua; they must be obtained through specific API functions or entity components.
2. **Type Opacity**: The internal structure of userdata is opaque to Lua; you can't access or modify its fields directly.
3. **No Serialization**: Userdata cannot be directly serialized or saved; you must store relevant data separately.

### Best Practices

1. **Don't Store Userdata Long-Term**: References to userdata objects should not be stored long-term, as they may become invalid when entities are removed.
2. **Check for Nil**: Always check if userdata exists before using it, especially when accessing components that may not be present on all entities.
3. **Use Wrapper Functions**: Create wrapper functions for complex userdata operations to improve code readability and reusability.

```lua
-- Example of a wrapper function for userdata operations
function SetEntityColor(inst, r, g, b, a)
    if inst.AnimState ~= nil then
        inst.AnimState:SetMultColor(r, g, b, a or 1)
    end
end
```

## Integration with Other Systems

Userdata objects often serve as the bridge between Lua scripting and the underlying game engine. They interact with several other systems:

- **Entity System**: Most userdata is associated with specific entities
- **Component System**: Many components wrap userdata objects to provide higher-level functionality
- **Network System**: Some userdata objects contain network-synchronized properties
- **Serialization System**: While userdata itself can't be serialized, its relevant properties can be saved

## See also

- [EntityScript](../entity-framework/entityscript.md) - For entity creation and management
- [Network Variables](netvar.md) - For synchronized data between server and client
- [Vector3](vector3.md) - For positional data used with Transform userdata
- [Colour](colour.md) - For color values used with AnimState userdata

## Example: Working with AnimState Userdata

```lua
local function SetupVisuals(inst)
    -- Add the AnimState userdata to the entity
    inst.entity:AddAnimState()
    
    -- Configure the AnimState using its methods
    inst.AnimState:SetBank("spider")
    inst.AnimState:SetBuild("spider_build")
    inst.AnimState:PlayAnimation("idle")
    
    -- Modify visual properties
    inst.AnimState:SetScale(1.2, 1.2)
    inst.AnimState:SetMultColor(0.8, 0.8, 1, 1) -- Slightly blue tint
    
    -- Handling animation events
    inst:ListenForEvent("animover", function(inst)
        if inst.AnimState:IsCurrentAnimation("attack") then
            inst.AnimState:PlayAnimation("idle")
        end
    end)
end
```
