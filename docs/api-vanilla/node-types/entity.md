---
id: entity
title: Entity
sidebar_position: 2
last_updated: 2023-07-06
---
*Last Update: 2023-07-06*
# Entity

Entity is the most basic node type in Don't Starve Together, representing all objects in the game from characters and items to structures.

## Entity properties and methods

Entity provides the following key properties and methods:

- **Properties**
  - `entity` - Low-level entity object with core functionality
  - `Transform` - Position, rotation, and scale
  - `AnimState` - Animations and visual appearance
  - `components` - Components attached to the entity
  - `tags` - Lightweight markers for entity characteristics

- **Methods**
  - `AddTag()` - Add a tag to the entity
  - `RemoveTag()` - Remove a tag from the entity
  - `HasTag()` - Check if entity has a tag
  - `AddComponent()` - Add a component to the entity
  - `RemoveComponent()` - Remove a component from the entity
  - `Remove()` - Remove the entity from the game

## Properties

### entity: EntityObject `[readonly]`

The low-level entity object that provides core functionality. You use this object to add basic parts to the entity.

```lua
-- Add core parts to entity
entity.entity:AddTransform()
entity.entity:AddAnimState()
entity.entity:AddNetwork()
entity.entity:SetPristine()
```

---

### Transform: TransformComponent `[readonly]`

Controls the entity's position, rotation, and scale in the world.

```lua
-- Get position
local x, y, z = entity.Transform:GetWorldPosition()

-- Set position
entity.Transform:SetPosition(10, 0, 20)

-- Set rotation
entity.Transform:SetRotation(45)  -- degrees

-- Set scale
entity.Transform:SetScale(1.5, 1.5, 1.5)
```

---

### AnimState: AnimStateComponent `[readonly]`

Controls the entity's visual appearance and animations.

```lua
-- Set the visual appearance
entity.AnimState:SetBank("spiderden")  -- animation bank
entity.AnimState:SetBuild("spider_cocoon")  -- art assets
entity.AnimState:PlayAnimation("idle")  -- animation to play

-- Animation parameters
entity.AnimState:SetMultColour(1, 0.5, 0.5, 1)  -- tint red
entity.AnimState:SetTime(0.5)  -- set animation time
```

---

### components: ComponentTable `[readonly]`

Table containing all components attached to this entity. Each component provides specific functionality.

```lua
-- Access components
local health = entity.components.health
if health then
    health:SetMaxHealth(100)
end

-- Check component exists
if entity.components.combat then
    entity.components.combat:SetDefaultDamage(10)
end
```

---

### tags: TagTable `[readonly]`

Set of tags attached to this entity. Tags are used for quick identification of entity characteristics.

```lua
-- Check tags
if entity.tags["player"] then
    print("This is a player entity")
end

-- Iterate through tags
for tag, _ in pairs(entity.tags) do
    print("Entity has tag: " .. tag)
end
```

---

## Methods

### AddTag(tag: string): void

Adds a tag to the entity. Tags are lightweight markers used to identify entity characteristics.

```lua
-- Add tags to identify entity characteristics
entity:AddTag("player")
entity:AddTag("scarytoprey")
entity:AddTag("character")
```

---

### RemoveTag(tag: string): void

Removes a tag from the entity.

```lua
-- Remove a tag
entity:RemoveTag("scarytoprey")
```

---

### HasTag(tag: string): boolean

Checks if the entity has the specified tag.

```lua
-- Check if entity has a tag
if entity:HasTag("player") then
    -- Do something with player entities
end
```

---

### AddComponent(name: string): Component

Adds a component to the entity and returns the newly created component.

```lua
-- Add components to provide functionality
local health = entity:AddComponent("health")
health:SetMaxHealth(100)

local combat = entity:AddComponent("combat")
combat:SetDefaultDamage(10)
```

---

### RemoveComponent(name: string): void

Removes a component from the entity.

```lua
-- Remove a component
entity:RemoveComponent("burnable")
```

---

### Remove(): void

Removes the entity from the game world. The entity will be destroyed and can no longer be used.

```lua
-- Remove entity from game
entity:Remove()
```

---

## Entity Creation

Entities are typically created through prefabs, but can also be created directly:

```lua
local entity = CreateEntity()
entity:AddTag("myentity")
entity.entity:AddTransform()
entity.entity:AddAnimState()
entity.entity:AddNetwork()

-- Set up other entity properties
entity.entity:SetPristine()

if not TheWorld.ismastersim then
    return entity
end

-- Server-side component setup
entity:AddComponent("inventoryitem")

return entity
```

## Core Entity Parts

Each entity can have these core parts:

- **Transform**: Position, rotation, and scale
- **AnimState**: Animations and visual appearance
- **SoundEmitter**: Sound effects
- **Network**: Multiplayer synchronization
- **Physics**: Collision and physical interactions
- **Light**: Light emission
- **MiniMapEntity**: Appearance on the minimap

```lua
-- Add core parts
entity.entity:AddTransform()
entity.entity:AddAnimState()
entity.entity:AddSoundEmitter()
entity.entity:AddNetwork()
entity.entity:AddPhysics()
entity.entity:AddLight()
entity.entity:AddMiniMapEntity()
```

## Entity Lifecycle

Entities have a lifecycle in the game:

1. **Creation**: Entity is created through prefab or directly
2. **Setup**: Components and properties are configured
3. **Activation**: Entity becomes active in the world
4. **Updates**: Entity is updated each frame
5. **Removal**: Entity is removed from the world

## Finding Entities

Entities can be found using various functions:

```lua
-- Find entities near a position
local entities = TheSim:FindEntities(x, y, z, radius, {"player"}, {"ghost"})

-- Find closest entity
local entity = FindClosestEntity(x, y, z, radius, {"tree"})

-- Find entities in a given area
local entities = FindEntitiesInArea(x1, y1, z1, x2, y2, z2, {"monster"})
```

## See also

- [Component](component.md) - Modular functionality attached to entities
- [Prefab](prefab.md) - Templates for entity creation
- [Network](network.md) - Multiplayer synchronization system
- [Tags](tags.md) - Tag system for entity identification
