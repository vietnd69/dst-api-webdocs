---
id: shared-properties-overview
title: Shared Node Properties Overview
sidebar_position: 1
last_updated: 2023-07-06
slug: /api/shared-properties
---

# Shared Node Properties Overview

Shared node properties are fundamental building blocks used by almost all entities in the Don't Starve Together API. These properties provide essential functionality for positioning, identifying, and synchronizing game objects.

## Core Shared Properties

Don't Starve Together uses several key shared properties that appear across most entity types:

### Transform

The [Transform](./transform.md) property handles an entity's position, rotation, and scale in the 3D world. It is the most basic and essential property that every entity must have to exist in the game world.

```lua
-- Basic Transform usage
inst.entity:AddTransform()
inst.Transform:SetPosition(x, y, z)
inst.Transform:SetRotation(degrees)
```

### Network

The [Network](./network.md) property enables multiplayer functionality by synchronizing entity data between server and clients. This is essential for any entity that needs to be visible and interactive for all players in a multiplayer game.

```lua
-- Basic Network usage
inst.entity:AddNetwork()
inst.entity:SetPristine()
```

### Tags

The [Tags](./tags.md) system provides a lightweight and efficient way to categorize entities and identify their characteristics. Tags are used extensively for entity queries, targeting, and implementing game mechanics.

```lua
-- Basic Tags usage
inst:AddTag("tagname")
inst:HasTag("tagname")
```

## Property Relationships

These shared properties work together to create functional entities:

1. **Transform** provides the spatial foundation for entities to exist in the world
2. **Network** ensures consistent entity state across all connected clients
3. **Tags** allow for efficient categorization and identification of entities

## Common Property Patterns

When creating entities, these properties are typically added in a consistent order:

```lua
local function CreateEntity()
    local inst = CreateEntity()
    
    -- Always add Transform first
    inst.entity:AddTransform()
    
    -- Add other visual components
    inst.entity:AddAnimState()
    inst.entity:AddSoundEmitter()
    
    -- Add Network for multiplayer
    inst.entity:AddNetwork()
    
    -- Add tags that need to be networked
    inst:AddTag("example_tag")
    
    -- Finalize network setup
    inst.entity:SetPristine()
    
    -- Client-side early return
    if not TheWorld.ismastersim then
        return inst
    end
    
    -- Server-only components and logic
    
    return inst
end
```

## Technical Implementation

These shared properties are implemented at the engine level and exposed to Lua through the entity interface. The engine handles the low-level functionality, while Lua provides the interface for game logic.

## Best Practices

When working with shared properties:

1. Add properties in the correct order (Transform first, Network before tags)
2. Keep client and server code properly separated
3. Only network essential data to maintain performance
4. Use tags for categorization and quick lookups
5. Leverage the entity parenting system for complex object hierarchies

## Other Shared Properties

In addition to the core properties, entities may use other shared properties depending on their needs:

- **AnimState** - Handles animations and visual appearance
- **SoundEmitter** - Manages sound effects
- **Physics** - Provides collision detection and physical interactions
- **Light** - Creates light sources
- **MiniMapEntity** - Shows the entity on the minimap

These additional properties follow similar patterns to the core shared properties but serve more specialized functions. 
