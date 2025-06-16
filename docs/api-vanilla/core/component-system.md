---
id: component-system
title: Component System
sidebar_position: 2
last_updated: 2023-08-01
version: 624447
---
*Last Update: 2023-08-01*
# Component System

*API Version: 624447*

The component system is a fundamental part of Don't Starve Together's architecture. This document explains how components work, how to use them, and how to create custom components for your mods.

## Component Basics

Components are self-contained modules that define specific behaviors and properties for entities in the game. This approach allows for composition rather than inheritance, making the system flexible and modular.

### Component Evolution

Components can change between API versions as new features are added or existing functionality is modified. To stay updated on component changes, refer to the [API Changelog](../getting-started/api-changelog.md) which documents all significant component changes between versions.

## Core Concepts

### Entity-Component Relationship

An entity in DST is essentially a container for components. Each component handles a specific aspect of the entity's behavior:

- A `health` component manages an entity's health state
- A `combat` component handles attacking and being attacked
- An `inventory` component allows an entity to carry items

```lua
-- Creating an entity and adding components
local entity = CreateEntity()
entity:AddComponent("health")
entity:AddComponent("combat")

-- Accessing components
entity.components.health:SetMaxHealth(100)
entity.components.combat:SetDefaultDamage(10)
```

Don't Starve Together uses a Component System to add functionality and behaviors to entities. Each component represents a specific feature that an entity can possess.

## Basic Concepts

The Component System in DST allows:
- Code reuse between different entities
- Flexible addition/removal of features
- Clear separation of code responsibilities
- Easy extension through mods

## Adding and Using Components

```lua
-- Add components to entity
inst:AddComponent("health")
inst:AddComponent("combat")
inst:AddComponent("inventory")

-- Configure components
inst.components.health:SetMaxHealth(150)
inst.components.health:SetPercent(0.5)

inst.components.combat:SetDefaultDamage(20)
inst.components.combat:SetAttackPeriod(2)

-- Call component methods
inst.components.health:DoDelta(10) -- Increase HP
inst.components.inventory:GiveItem(item)
```

## Components and Replicas

In a multiplayer environment, DST uses two types of components:

1. **Server Components** - Execute logic on the server
2. **Replica Components** - Simplified versions for clients

```lua
-- In a prefab
local function fn()
    local inst = CreateEntity()
    
    -- Add basic components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    -- Add components for both client and server
    MakeInventoryPhysics(inst)
    
    -- Define that entity has finished replication setup
    inst.entity:SetPristine()
    
    -- Clients don't need server components
    if not TheWorld.ismastersim then
        return inst
    end
    
    -- Add server components
    inst:AddComponent("inventoryitem")
    inst:AddComponent("stackable")
    inst:AddComponent("edible")
    
    return inst
end
```

## Common Components

### Character Components

```lua
-- Basic character components
inst:AddComponent("health")       -- Health
inst:AddComponent("hunger")       -- Hunger
inst:AddComponent("sanity")       -- Sanity
inst:AddComponent("inventory")    -- Inventory
inst:AddComponent("locomotor")    -- Movement
inst:AddComponent("combat")       -- Combat
inst:AddComponent("temperature")  -- Temperature
inst:AddComponent("moisture")     -- Moisture
```

### Item Components

```lua
-- Common item components
inst:AddComponent("inventoryitem")    -- Can be put in inventory
inst:AddComponent("stackable")        -- Can be stacked
inst:AddComponent("equippable")       -- Can be equipped
inst:AddComponent("weapon")           -- Weapon
inst:AddComponent("armor")            -- Armor
inst:AddComponent("edible")           -- Can be eaten
inst:AddComponent("fuel")             -- Fuel
inst:AddComponent("tool")             -- Tool
inst:AddComponent("finiteuses")       -- Limited durability
```

### Structure Components

```lua
-- Components for structures
inst:AddComponent("workable")         -- Can be interacted with (mine, chop, etc.)
inst:AddComponent("container")        -- Stores items
inst:AddComponent("burnable")         -- Can burn
inst:AddComponent("freezable")        -- Can freeze
inst:AddComponent("grogginess")       -- Stun effect
inst:AddComponent("childspawner")     -- Spawns child entities
inst:AddComponent("perishable")       -- Deteriorates over time
```

## Creating Custom Components

To create a new component in a mod:

```lua
-- In components/mycomponent.lua
local MyComponent = Class(function(self, inst)
    self.inst = inst
    self.value = 10
    self.active = true
end)

function MyComponent:SetValue(val)
    self.value = val
    self.inst:PushEvent("valuechanged", {value = val})
end

function MyComponent:GetValue()
    return self.value
end

function MyComponent:Activate()
    self.active = true
end

function MyComponent:Deactivate()
    self.active = false
end

function MyComponent:OnSave()
    return {
        value = self.value,
        active = self.active
    }
end

function MyComponent:OnLoad(data)
    self.value = data.value or self.value
    self.active = data.active or self.active
end

return MyComponent
```

Register and use the component:

```lua
-- In modmain.lua
local MyComponent = require "components/mycomponent"
AddComponentPostInit("mycomponent", function(self, inst)
    -- Modify existing component (optional)
end)

-- In prefab
AddPrefabPostInit("myprefab", function(inst)
    if not TheWorld.ismastersim then return end
    
    inst:AddComponent("mycomponent")
    inst.components.mycomponent:SetValue(20)
end)
```

## Advanced Component Usage

See these case studies for examples of advanced component usage:

- [Case Study - The Forge Mod](../examples/case-forge.md) - A complete game mode with custom components
- [Custom Component Example](../examples/custom-component.md) - Creating and using custom components

## Creating Replicas for Components

To make a component work on clients:

```lua
-- In components/mycomponent_replica.lua
local MyComponent = Class(function(self, inst)
    self.inst = inst
    self._value = net_int(inst.GUID, "mycomponent.value", "valuedirty")
    
    if not TheWorld.ismastersim then
        inst:ListenForEvent("valuedirty", function()
            inst:PushEvent("valuechanged", {value = self:GetValue()})
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

return MyComponent
```

Register the replica:

```lua
-- In modmain.lua
local MyComponent = require "components/mycomponent"
local MyComponentReplica = require "components/mycomponent_replica"

-- Register replica when component is added to entity
AddReplicableComponent("mycomponent")
```

## Component Serialization

Components support saving and loading data:

```lua
-- Save component data
function MyComponent:OnSave()
    return {
        value = self.value,
        items = self.items,
        timestamp = self.timestamp
    }
end

-- Load component data
function MyComponent:OnLoad(data)
    if data then
        self.value = data.value or self.value
        self.items = data.items or {}
        self.timestamp = data.timestamp or 0
    end
end
```

For a real-world example of component serialization, see the [Wormhole Marks case study](../examples/case-wormhole.md), which demonstrates saving and restoring wormhole pair associations across game sessions. This case study showcases how to create custom components that track relationships between entities and persist that data between game sessions.

## Component Network Synchronization

Synchronize data between server and clients:

```lua
-- In component
function MyComponent:ctor(inst)
    self.inst = inst
    -- Network variables defined with GUID, path, and event name
    self.value = net_int(inst.GUID, "mycomponent.value", "mycomponent.valuedirty")
    self.active = net_bool(inst.GUID, "mycomponent.active", "mycomponent.activedirty")
end

function MyComponent:SetValue(val)
    self.value:set(val) -- Set value and send event to clients
end

-- In prefab
inst:ListenForEvent("mycomponent.valuedirty", function()
    local val = inst.components.mycomponent.value:value()
    -- Handle value change
end)
``` 
