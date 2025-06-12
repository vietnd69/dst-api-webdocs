---
id: inventory
title: Inventory Component
sidebar_position: 4
---

# Inventory Component

The Inventory component manages item storage, equipment slots, and item manipulation for entities that can carry items (such as players and some creatures).

## Basic Usage

```lua
-- Add an inventory component to an entity
local entity = CreateEntity()
entity:AddComponent("inventory")

-- Configure the inventory component
local inventory = entity.components.inventory
inventory.maxslots = 16 -- Set maximum inventory slots
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `maxslots` | Number | Maximum number of item slots in the inventory |
| `itemslots` | Table | Table of items currently in inventory slots |
| `equipslots` | Table | Table of items currently equipped in equipment slots |
| `activeitem` | Entity | The currently active item (being held/manipulated) |
| `acceptsstacks` | Boolean | Whether inventory accepts stacked items |
| `heavylifting` | Boolean | Whether the entity is currently carrying a heavy object |
| `isopen` | Boolean | Whether the inventory UI is open |
| `isvisible` | Boolean | Whether the inventory is visible |
| `dropondeath` | Boolean | Whether items are dropped on death |

## Key Methods

### Basic Inventory Operations

```lua
-- Give an item to the inventory
inventory:GiveItem(item)

-- Get an item by slot number
local item = inventory:GetItemInSlot(1)

-- Get the slot number of a specific item
local slot = inventory:GetItemSlot(item)

-- Remove an item from a specific slot
local item = inventory:RemoveItemBySlot(1)

-- Check if inventory is full
local is_full = inventory:IsFull()

-- Count items in inventory
local count = inventory:NumItems()

-- Count all items including stacked items
local total = inventory:NumStackedItems()

-- Drop everything in the inventory
inventory:DropEverything(drop_active_item)
```

### Equipment Management

```lua
-- Equip an item
inventory:Equip(item)

-- Unequip an item from a specific slot
local item = inventory:Unequip(EQUIPSLOTS.HANDS)

-- Check if a slot has an item equipped
local is_equipped = inventory:IsEquipped(item)

-- Get item in a specific equipment slot
local weapon = inventory:GetEquippedItem(EQUIPSLOTS.HANDS)
```

### Active Item Management

```lua
-- Set the active item
inventory:GiveActiveItem(item)

-- Get the currently active item
local active_item = inventory:GetActiveItem()

-- Drop the active item
local item = inventory:DropActiveItem()

-- Check if an item is the active item
local is_active = inventory:IsActiveItem(item)
```

### Item Finding

```lua
-- Find an item by prefab name
local berries = inventory:FindItem(function(item) return item.prefab == "berries" end)

-- Count items by prefab
local count = inventory:CountItems("log")

-- Check if has at least one of an item
local has_item = inventory:Has("flint", 1)
```

### Containers

```lua
-- Open a container
inventory:OpenContainer(container)

-- Close a container
inventory:CloseContainer(container)

-- Check if a container is open
local is_open = inventory:IsContainerOpen(container)
```

## Events

The Inventory component responds to and triggers various events:

- `itemget` - Triggered when an item is added to the inventory
- `itemlose` - Triggered when an item is removed from the inventory
- `equip` - Triggered when an item is equipped
- `unequip` - Triggered when an item is unequipped
- `activeitem` - Triggered when the active item changes
- `death` - Listens for death to drop items (if dropondeath is true)

## Integration with Other Components

The Inventory component often works with:

- `ItemSlot` - For managing item slots and organization
- `Container` - For storing items in containers like chests
- `Equippable` - For items that can be equipped
- `Combat` - For equipping weapons
- `Health` - For using healing items

## Examples

```lua
-- Create a basic entity with inventory
local function MakeInventoryEntity()
    local inst = CreateEntity()
    
    -- Add required components
    inst:AddComponent("inventory")
    
    -- Configure inventory
    local inventory = inst.components.inventory
    inventory.maxslots = 20
    
    -- Add callback for when items are added
    inst:ListenForEvent("itemget", function(inst, data)
        print("Got item:", data.item.prefab)
    end)
    
    return inst
end

-- Example of using inventory to craft an item
local function CraftItem(inventory, recipe)
    -- Check if inventory has all ingredients
    local has_ingredients = true
    for _, ingredient in ipairs(recipe.ingredients) do
        if not inventory:Has(ingredient.type, ingredient.amount) then
            has_ingredients = false
            break
        end
    end
    
    if has_ingredients then
        -- Remove ingredients
        for _, ingredient in ipairs(recipe.ingredients) do
            for i = 1, ingredient.amount do
                local item = inventory:FindItem(function(item) 
                    return item.prefab == ingredient.type 
                end)
                inventory:RemoveItem(item, true)
            end
        end
        
        -- Give crafted item
        local crafted_item = SpawnPrefab(recipe.product)
        inventory:GiveItem(crafted_item)
        return true
    end
    
    return false
end 