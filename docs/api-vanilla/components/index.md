---
id: components-overview
title: Components Overview
sidebar_position: 1
slug: /api/components
---

# Components Overview

Components are the fundamental building blocks for entity behavior in Don't Starve Together. The game uses a component-based architecture where entities (players, creatures, items, etc.) are composed of various components that define their functionality.

## What are Components?

Components are self-contained modules that handle specific aspects of an entity's behavior. Each component is responsible for a particular feature or capability of an entity. For example:

- A `health` component manages an entity's health state
- A `combat` component handles attacking and being attacked
- An `inventory` component allows an entity to carry items

By combining different components, the game creates complex entities with diverse behaviors.

## Using Components

Components are attached to entities and then configured to create the desired behavior:

```lua
-- Create a basic entity
local entity = CreateEntity()

-- Add components
entity:AddComponent("health")
entity:AddComponent("combat")

-- Configure components
entity.components.health:SetMaxHealth(100)
entity.components.combat:SetDefaultDamage(10)
```

## Core Components

Some of the most commonly used components in Don't Starve Together include:

| Component | Purpose |
|-----------|---------|
| [Combat](combat.md) | Handles attacking and being attacked |
| [Health](health.md) | Manages health, damage, and death |
| [Inventory](inventory.md) | Allows carrying and using items |
| [Weapon](weapon.md) | Defines item attack behavior |
| [Temperature](temperature.md) | Manages temperature effects |
| [Hunger](hunger.md) | Handles food and starvation |
| [Sanity](sanity.md) | Controls mental state and effects |
| [Burnable](burnable.md) | Makes entity flammable |
| [Cookable](cookable.md) | Allows entity to be cooked |
| [Workable](workable.md) | Makes entity interact with tools |
| [Growable](growable.md) | Allows entity to grow over time |
| [Perishable](perishable.md) | Makes items spoil over time |
| [Locomotor](locomotor.md) | Controls entity movement |
| [Builder](builder.md) | Manages crafting capabilities |
| [Edible](edible.md) | Defines food properties |
| [Eater](eater.md) | Allows entity to consume food |
| [Container](container.md) | Provides storage capabilities |
| [Stackable](stackable.md) | Allows items to stack |
| [Equippable](equippable.md) | Allows items to be equipped |
| [Inspectable](inspectable.md) | Enables examination by players |
| [Trader](trader.md) | Manages trading interactions |
| [LootDropper](lootdropper.md) | Controls item drops |
| [Other Components](other-components.md) | Additional specialized components |

## Component Lifecycle

Components have several lifecycle methods:

- **Constructor**: Called when the component is created
- **OnRemoveFromEntity**: Called when the component is removed
- **OnSave**: Called when the game is saved to serialize component state
- **OnLoad**: Called when the game is loaded to deserialize component state

## Component Communication

Components can communicate with each other through:

1. **Direct Access**: Components can directly access other components on the same entity
   ```lua
   -- Health component accessing combat component
   local damage = self.inst.components.combat.defaultdamage
   ```

2. **Events**: Components can trigger and listen for events
   ```lua
   -- Trigger an event
   self.inst:PushEvent("attacked", {attacker = attacker, damage = damage})
   
   -- Listen for an event
   self.inst:ListenForEvent("death", OnDeath)
   ```

## Creating Custom Components

While modding, you can create custom components to add new behaviors:

```lua
local MyComponent = Class(function(self, inst)
    self.inst = inst
    self.value = 10
end)

function MyComponent:DoSomething()
    print("Doing something with value:", self.value)
end

return MyComponent
```

Then register and use the component:

```lua
local MyComponent = require "components/mycomponent"
AddComponentPostInit("mycomponent", MyComponent)

-- Later, add to an entity
entity:AddComponent("mycomponent")
entity.components.mycomponent:DoSomething()
```

## Component Replication

For multiplayer synchronization, many components have corresponding replica components that exist on both server and client. Replica components contain only the data needed by clients for rendering and prediction.

For example, the `health` component has a `health_replica` counterpart that replicates the current health value to clients without exposing all server-side health logic.

## Best Practices

When working with components:

1. **Keep components focused**: Each component should handle one specific aspect of functionality
2. **Use events for cross-component communication** when appropriate
3. **Avoid circular dependencies** between components
4. **Clean up event listeners** in OnRemoveFromEntity to prevent memory leaks
5. **Use the existing component architecture** rather than creating workarounds 