---
id: stackable
title: Stackable
sidebar_position: 25
last_updated: 2023-07-06
version: 619045
---

# Stackable Component

The Stackable component allows items to be stacked together, combining multiple identical items into a single inventory slot. It manages stack sizes, item splitting, and stack interactions.

## Basic Usage

```lua
-- Add a stackable component to an entity
local entity = CreateEntity()
entity:AddComponent("stackable")

-- Configure the stackable component
local stackable = entity.components.stackable
stackable:SetStackSize(20)
stackable:SetMaxSize(40)
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `stacksize` | Number | Current number of items in the stack |
| `maxsize` | Number | Maximum possible stack size |
| `forcedropsingle` | Boolean | Whether dropping always drops single items |
| `onstacksizelimitfn` | Function | Called when stack size limit is reached |
| `ondestack` | Function | Called when items are removed from the stack |

## Key Methods

### Stack Management

```lua
-- Set current stack size
stackable:SetStackSize(10)

-- Set maximum stack size
stackable:SetMaxSize(20)

-- Get current stack size
local size = stackable:StackSize()

-- Check if stack is full
local is_full = stackable:IsFull()

-- Add items to the stack
stackable:SetStackSize(stackable:StackSize() + 5)
```

### Stack Splitting

```lua
-- Split a stack, returning a new item with specified count
local split_stack = stackable:Get(5) -- Get 5 items from the stack

-- Try stacking with another stackable
local stacked = stackable:Put(another_stackable_item)

-- Put a single item into this stack
stackable:PutOneItem(single_item)
```

### Stack Events

```lua
-- Set callback for when stack size changes
stackable:SetOnStackSizeChange(function(inst, data)
    -- Do something when stack size changes
    print("New stack size: " .. data.stacksize)
end)
```

## Stack Size Calculations

When stacking items:

- Items can only stack with others of the same prefab
- Stack size is limited by `maxsize` property
- When a stack is split, a new entity is created with the same prefab
- Some components may be transferred or modified when stacking/splitting

## Integration with Other Components

The Stackable component often works with:

- `Inventoryitem` - For inventory management of stacks
- `Perishable` - Stacking may average perish times
- `Edible` - For stacking food items
- `Container` - For managing stacks in containers
- `Inspectable` - To show stack size in inspection

## See also

- [Inventory Component](inventory.md) - For managing stacked items
- [Perishable Component](perishable.md) - For food spoilage in stacks
- [Edible Component](edible.md) - For stacking food items
- [Container Component](container.md) - For storing stacks in containers
- [Inventoryitem Component](other-components.md) - For items that can be stacked

## Example: Creating a Stackable Resource

```lua
local function MakeResource()
    local inst = CreateEntity()
    
    -- Add basic components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    -- Make it an inventory item
    inst:AddComponent("inventoryitem")
    
    -- Make it stackable
    inst:AddComponent("stackable")
    inst.components.stackable:SetStackSize(1)
    inst.components.stackable:SetMaxSize(20)
    
    -- Update visual based on stack size
    inst.components.stackable:SetOnStackSizeChange(function(inst, data)
        if data.stacksize <= 5 then
            inst.AnimState:PlayAnimation("idle_small")
        elseif data.stacksize <= 15 then
            inst.AnimState:PlayAnimation("idle_medium")
        else
            inst.AnimState:PlayAnimation("idle_full")
        end
    end)
    
    -- Make it inspectable with stack info
    inst:AddComponent("inspectable")
    inst.components.inspectable.getspecialdescription = function(inst, viewer)
        return "Stack size: " .. inst.components.stackable:StackSize()
    end
    
    return inst
end

-- Example of stackable food with perishable component
local function MakeStackableFood()
    local inst = CreateEntity()
    
    -- Add basic components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    -- Make it an inventory item
    inst:AddComponent("inventoryitem")
    
    -- Make it stackable
    inst:AddComponent("stackable")
    inst.components.stackable:SetStackSize(1)
    inst.components.stackable:SetMaxSize(20)
    
    -- Make it perishable
    inst:AddComponent("perishable")
    inst.components.perishable:SetPerishTime(TUNING.PERISH_MED)
    inst.components.perishable:StartPerishing()
    
    -- Make it edible
    inst:AddComponent("edible")
    inst.components.edible:SetHealth(1)
    inst.components.edible:SetHunger(12.5)
    
    return inst
end
``` 
