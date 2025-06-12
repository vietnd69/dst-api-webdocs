---
id: entity-system
title: Entity System
sidebar_position: 1
---

# Entity System

The Entity System is the foundation of Don't Starve Together's game architecture. It defines how game objects are created, managed, and destroyed within the game world.

## What is an Entity?

In Don't Starve Together, an entity is any object that exists in the game world. This includes:

- Characters (players and NPCs)
- Items (tools, resources, food)
- Structures (crafting stations, bases)
- Environmental objects (trees, rocks)
- Invisible managers (world, weather systems)

Every entity in DST is created from a prefab (prefabricated object) and is composed of components that define its behavior.

## Entity Creation

Entities are created using the `CreateEntity()` function and configured with various engine and game components:

```lua
local function CreateBasicEntity()
    -- Create a new entity
    local inst = CreateEntity()
    
    -- Add engine components
    inst.entity:AddTransform()        -- Position, rotation, scale
    inst.entity:AddAnimState()        -- Visual appearance and animation
    inst.entity:AddSoundEmitter()     -- Sound effects
    inst.entity:AddNetwork()          -- Multiplayer synchronization
    
    -- Setup physics (if needed)
    MakeInventoryPhysics(inst)
    
    -- Add tags for identification
    inst:AddTag("myentity")
    
    -- Setup network for multiplayer
    inst.entity:SetPristine()
    
    -- Client-side only code
    if not TheWorld.ismastersim then
        return inst
    end
    
    -- Add game components
    inst:AddComponent("inspectable")
    inst:AddComponent("inventoryitem")
    
    return inst
end
```

## Entity Management

Once created, entities can be:

### Managed in the World

```lua
-- Spawn an entity in the world
local entity = SpawnPrefab("prefab_name")
entity.Transform:SetPosition(x, y, z)

-- Remove an entity from the world
entity:Remove()
```

### Modified During Runtime

```lua
-- Add a new component
entity:AddComponent("burnable")

-- Remove a component
entity:RemoveComponent("burnable")

-- Change properties
entity.components.health:SetMaxHealth(100)
```

### Tracked and Found

```lua
-- Find entities by tag
local entities = TheSim:FindEntities(x, y, z, radius, {"mytag"})

-- Get all entities with a specific component
local fireEntities = {}
for k, v in pairs(Ents) do
    if v.components.burnable ~= nil then
        table.insert(fireEntities, v)
    end
end
```

## Entity Lifecycle

Entities follow a specific lifecycle in DST:

1. **Creation** - Entity is instantiated from a prefab
2. **Initialization** - Components and properties are set up
3. **Activation** - Entity becomes active in the world
4. **Updates** - Entity behavior is updated each frame
5. **Deactivation** - Entity is removed from active processing
6. **Destruction** - Entity is completely removed from the game

### Lifecycle Hooks

You can hook into various points in an entity's lifecycle:

```lua
-- On entity creation
inst.OnEntityWake = function(inst)
    -- Called when entity becomes active
end

-- On entity sleep (becomes inactive)
inst.OnEntitySleep = function(inst)
    -- Called when entity becomes inactive
end

-- On entity removal
inst:ListenForEvent("onremove", function(inst)
    -- Called when entity is removed
end)
```

## Entity Relationships

Entities can have relationships with other entities:

### Parent-Child Relationships

```lua
-- Add a child entity
parent:AddChild(child)

-- Remove a child entity
parent:RemoveChild(child)
```

### Entity References

```lua
-- Store a reference to another entity
self.target = target_entity

-- Clear reference when target is removed
inst:ListenForEvent("onremove", function()
    self.target = nil
end, target_entity)
```

## Multiplayer Considerations

In multiplayer, entities exist in different forms on server and clients:

- **Server**: Full entity with all components and logic
- **Client**: Simplified entity with only visual and minimal gameplay components

The network component and replica system handle synchronization between these versions.

## Best Practices

When working with entities:

1. **Be Mindful of Creation Costs**: Creating entities is expensive, so pool or reuse them when possible
2. **Clean Up References**: Always clear references to other entities when they're removed
3. **Use Tags for Identification**: Tags are more efficient than component checks for identifying entities
4. **Keep Entity Logic Separated**: Use components to isolate specific behaviors
5. **Optimize Entity Sleep**: When entities are off-screen, put expensive logic to sleep 