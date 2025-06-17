---
id: components-overview
title: Components Overview
sidebar_position: 1
last_updated: 2024-08-22
---
*Last Update: 2024-08-22*
# Components Overview

Components are the fundamental building blocks of entity behavior in Don't Starve Together. Each component provides specific functionality to entities, and components can be combined to create complex behaviors. This page provides an overview of the component system and links to documentation for specific components.

## What are Components?

In Don't Starve Together, components are modular pieces of functionality that can be attached to entities. Each component is responsible for a specific aspect of an entity's behavior, such as health, hunger, combat, or inventory management.

Components follow these key principles:

- **Modularity**: Components can be added or removed from entities independently
- **Reusability**: The same component can be used by many different types of entities
- **Encapsulation**: Components handle their own internal state and logic
- **Interaction**: Components can communicate with each other through events and direct method calls

## Using Components

### Adding Components to Entities

Components are typically added to entities in their prefab definition:

```lua
local function fn()
    local inst = CreateEntity()
    
    -- Add components
    inst:AddComponent("health")
    inst:AddComponent("inventory")
    inst:AddComponent("locomotor")
    
    -- Configure components
    inst.components.health:SetMaxHealth(100)
    inst.components.locomotor.walkspeed = 4
    
    return inst
end
```

### Accessing Components

Components can be accessed through the `components` field on entity instances:

```lua
-- Access a component
local health = inst.components.health

-- Call component methods
health:SetMaxHealth(150)
health:DoDelta(-10)

-- Access component properties
local current_health = health.currenthealth
local max_health = health.maxhealth
```

### Removing Components

Components can be removed if needed:

```lua
inst:RemoveComponent("burnable")
```

## Core Components

These components are fundamental to many game mechanics:

- [Health](health.md) - Manages entity health points and death
- [Combat](combat.md) - Handles attacking and being attacked
- [Inventory](inventory.md) - Stores and manages items
- [Locomotor](locomotor.md) - Controls movement speed and pathing

## Survival Components

These components relate to survival mechanics:

- [Hunger](hunger.md) - Manages hunger level
- [Sanity](sanity.md) - Manages sanity level
- [Temperature](temperature.md) - Handles temperature effects

## Item Components

These components are typically found on items:

- [Equippable](equippable.md) - Allows items to be equipped
- [Armor](armor.md) - Provides damage protection
- [Weapon](weapon.md) - Deals damage when used to attack
- [Stackable](stackable.md) - Allows items to stack
- [Perishable](perishable.md) - Makes items spoil over time

## Interaction Components

These components enable various interactions:

- [Workable](workable.md) - Allows entities to be worked (chopped, mined, etc.)
- [Inspectable](inspectable.md) - Provides inspection text
- [Container](container.md) - Stores other items inside
- [Trader](trader.md) - Enables trading with other entities

## Food-related Components

These components handle food mechanics:

- [Edible](edible.md) - Makes items consumable
- [Cookable](cookable.md) - Allows items to be cooked
- [Eater](eater.md) - Allows entities to eat food

## Miscellaneous Components

Other important components:

- [Builder](builder.md) - Enables crafting and prototype unlocking
- [Growable](growable.md) - Manages growth stages
- [Burnable](burnable.md) - Makes entities flammable
- [LootDropper](lootdropper.md) - Generates loot when killed

## Other Components

For a list of less commonly used components, see [Other Components](other-components.md).

## Creating Custom Components

For information on creating your own custom components, see the [Custom Component](../examples/custom-component.md) example and the [Component System](../core/component-system.md) documentation. 