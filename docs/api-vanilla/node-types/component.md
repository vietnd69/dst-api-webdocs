---
id: component
title: Component
sidebar_position: 3
last_updated: 2023-07-06
version: 624447
---
*Last Update: 2023-07-06*
# Component

*API Version: 624447*

Components are functional modules attached to entities to provide specific behaviors and properties.

## Component properties and methods

Components provide the following key properties and methods:

- **Properties**
  - `inst` - Reference to the entity this component is attached to

- **Methods**
  - `OnSave()` - Called when the game is saving
  - `OnLoad()` - Called when the game is loading
  - `GetDebugString()` - Called when debugging information is requested
  - `OnRemoveFromEntity()` - Called when the component is removed

## Properties

### inst: [Entity](entity.md) `[readonly]`

A reference to the entity that this component is attached to. This property is set automatically when the component is added to an entity.

```lua
function MyComponent:SomeAction()
    -- Access the entity's position
    local x, y, z = self.inst.Transform:GetWorldPosition()
    
    -- Access other components on the same entity
    if self.inst.components.health then
        self.inst.components.health:SetMaxHealth(100)
    end
end
```

---

## Methods

### OnSave(): `Table`

Called when the game is saving. Return a table containing any data that should be saved.

```lua
function MyComponent:OnSave()
    return {
        value = self.value,
        enabled = self.enabled
    }
end
```

---

### OnLoad(data: `Table`): `void`

Called when the game is loading. The data parameter contains the table returned by OnSave.

```lua
function MyComponent:OnLoad(data)
    self.value = data.value or self.value
    self.enabled = data.enabled or self.enabled
end
```

---

### GetDebugString(): `String`

Called when debugging information is requested. Return a string containing debug information.

```lua
function MyComponent:GetDebugString()
    return string.format("Value: %d, Enabled: %s", self.value, tostring(self.enabled))
end
```

---

### OnRemoveFromEntity(): `void`

Called when the component is removed from its entity. Use this to clean up any resources or event listeners.

```lua
function MyComponent:OnRemoveFromEntity()
    -- Clean up event listeners
    if self.eventtask then
        self.eventtask:Cancel()
        self.eventtask = nil
    end
    
    -- Reset entity state if needed
    self.inst.ispowerful = nil
end
```

---

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

## Adding Components to Entities

Components are added to entities like this:

```lua
-- Add a component to an entity
entity:AddComponent("health")

-- Configure the component
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

- [Entity](entity.md) - The entity system that components attach to
- [Network](network.md) - Network replication system for multiplayer
- [Event](event.md) - Event system for communication between components
- [Save/Load](save-load.md) - Save/Load system for persistence 
