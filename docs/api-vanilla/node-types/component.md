---
id: component
title: Component
sidebar_position: 3
last_updated: 2023-07-06
---
*Last Update: 2023-07-06*
# Component

Components are functional modules attached to entities to provide specific behaviors and properties.

## Overview

The component system is a key part of Don't Starve Together's entity-component architecture. Components encapsulate specific functionality that can be added to entities, making them modular and reusable. Each component handles a specific aspect of an entity's behavior or properties.

## Component Structure

A typical component has this structure:

```lua
local MyComponent = Class(function(self, inst)
    self.inst = inst
    self.value = 100
    self.enabled = true
end)

function MyComponent:OnSave()
    return {
        value = self.value,
        enabled = self.enabled
    }
end

function MyComponent:OnLoad(data)
    self.value = data.value or self.value
    self.enabled = data.enabled or self.enabled
end

function MyComponent:GetDebugString()
    return string.format("Value: %d, Enabled: %s", self.value, tostring(self.enabled))
end

function MyComponent:DoSomething(amount)
    if self.enabled then
        self.value = self.value + amount
        self.inst:PushEvent("valueupdated", {value = self.value})
    end
end

return MyComponent
```

## Component Lifecycle

Components have several lifecycle methods:

- **Constructor**: Called when the component is created
- **OnRemoveFromEntity**: Called when the component is removed
- **OnSave**: Called when the game is saving
- **OnLoad**: Called when the game is loading
- **GetDebugString**: Called when debugging information is requested

## Adding Components to Entities

Components are added to entities like this:

```lua
entity:AddComponent("health")
entity.components.health:SetMaxHealth(100)

-- Check if entity has a component
if entity.components.combat then
    entity.components.combat:SetDefaultDamage(10)
end

-- Remove a component
entity:RemoveComponent("burnable")
```

## Common Components

Here are some important components in Don't Starve Together:

- **health**: Handles entity health and damage
- **hunger**: Manages hunger for characters
- **sanity**: Controls sanity level for characters
- **inventory**: Manages item storage
- **combat**: Handles attacking and combat
- **lootdropper**: Determines what items an entity drops when killed
- **inspectable**: Allows an entity to be inspected
- **workable**: Makes an entity workable with tools
- **burnable**: Makes an entity able to burn
- **propagator**: Allows an entity to spread fire
- **stewer**: For cooking food items
- **growable**: For things that grow over time
- **trader**: For entities that can trade
- **locomotor**: Handles movement

## Component Replication

For multiplayer, components need to replicate their state between server and clients:

```lua
-- In component initialization
if TheWorld.ismastersim then
    -- Server-only initialization
    self.netvar = net_bool(self.inst.GUID, "mycomponent.value", "valuedirty")
end

-- Server setting a value
function MyComponent:SetValue(val)
    self.value = val
    self.netvar:set(val)
end

-- Client listening for changes
if not TheWorld.ismastersim then
    inst:ListenForEvent("valuedirty", OnValueChanged)
end
```

## Related Systems

- Entity system
- Network replication
- Event system
- Save/load system 
