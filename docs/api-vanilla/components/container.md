---
id: container
title: Container
sidebar_position: 24
last_updated: 2023-07-06
version: 619045
---
*Last Update: 2023-07-06*
# Container Component

*API Version: 619045*

The Container component allows entities to store multiple items within them, such as chests, backpacks, or other storage containers. It manages slot configuration, opening/closing, and item access.

## Basic Usage

```lua
-- Add a container component to an entity
local entity = CreateEntity()
entity:AddComponent("container")

-- Configure the container component
local container = entity.components.container
container:SetNumSlots(12)
container.widgetslotpos = {} -- Position slots in UI
container.widgetanimbank = "ui_chest_3x3"
container.widgetanimbuild = "ui_chest_3x3"
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `numslots` | Number | Number of storage slots in the container |
| `itemslots` | Table | Table of items stored in the container |
| `openable` | Boolean | Whether the container can be opened |
| `openers` | Table | List of entities that have this container open |
| `widgetslotpos` | Table | Positions of slots in UI |
| `widgetbuttoninfo` | Table | Button info for container UI |
| `widgetanimbank` | String | Animation bank for container UI |
| `widgetanimbuild` | String | Animation build for container UI |
| `widgetpos` | Vector3 | Position of container UI |
| `acceptsstacks` | Boolean | Whether container accepts stacked items |
| `usespecificslotsforitems` | Boolean | Whether items have specific slot requirements |
| `type` | String | Container type (for UI and behaviors) |

## Key Methods

### Slot Management

```lua
-- Set number of slots
container:SetNumSlots(9)

-- Check if slot is empty
local is_empty = container:IsEmpty(slot_num)

-- Check if container has a specific item type
local has_log = container:Has("log", 1)

-- Count items of a specific type
local num_rocks = container:CountItems("rocks")

-- Find specific item in container
local axe = container:FindItem(function(item) return item.prefab == "axe" end)
```

### Item Operations

```lua
-- Give an item to the container
container:GiveItem(item)

-- Give item to a specific slot
container:GiveItemInSlot(item, slot_num)

-- Take an item from a specific slot
local item = container:RemoveItemBySlot(slot_num)

-- Drop all contents
container:DropEverything()

-- Close container for all users
container:Close()

-- Open container for a user
container:Open(opener)
```

> **Related functions**: Container operations often interact with the [Inventory Component](inventory.md). When a player opens a container using `Open()`, the inventory manages the UI interaction. When transferring items between containers and inventory, methods like `GiveItem()` check for [Stackable Components](stackable.md) to combine compatible items. For portable containers, the [Equippable Component](equippable.md) allows the container to be worn while retaining its storage functionality.

### Container Configuration

```lua
-- Make container non-openable (e.g., just stores items internally)
container.openable = false

-- Set UI positions for a 3x3 container
local function MakeContainerSlots(container)
    container.widgetslotpos = {}
    for y = 0, 2 do
        for x = 0, 2 do
            table.insert(container.widgetslotpos, Vector3(80*x-80*2/2, 80*y-80*2/2, 0))
        end
    end
end
```

## Item Slot Configuration

Container slots can be configured in multiple ways:

- **Standard Container**: Fixed number of slots for any item
- **Specialized Container**: Slots that only accept specific items
- **Sorted Container**: Container that sorts items automatically

## Integration with Other Components

The Container component often works with:

- `Inventory` - For transferring items between containers and inventories
- `ItemSlot` - For slot-specific behaviors
- `Preserver` - For containers that preserve items (like ice boxes)
- `Inventoryitem` - For containers that can be carried

## Real-World Examples

For practical implementations of the Container component in mods, see these case studies:

- **[Combined Status Mod](../examples/case-status.md)** - Shows how mods can interact with container UI elements:
  ```lua
  -- Example from Combined Status: accessing container data
  local function GetItemsFromContainer(container)
      local items = {}
      if container and container.classified then
          for i = 0, container:GetNumSlots() - 1 do
              local item = container:GetItemInSlot(i)
              if item ~= nil then
                  table.insert(items, item)
              end
          end
      end
      return items
  end
  ```

- **[Global Position CompleteSync Mod](../examples/case-global-position.md)** - Demonstrates custom container integration with map and positional systems.

## See also

- [Inventory Component](inventory.md) - For player item storage and management
- [Inventoryitem Component](other-components.md) - For items that can be stored in containers
- [Stackable Component](stackable.md) - For stacking items in containers
- [Preserver Component](other-components.md) - For preserving items in containers
- [Equippable Component](equippable.md) - For wearable containers like backpacks

## Example: Creating a Chest Container

```lua
local function MakeChest()
    local inst = CreateEntity()
    
    -- Add basic components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    -- Add container
    inst:AddComponent("container")
    local container = inst.components.container
    container:SetNumSlots(9)
    
    -- Configure container UI
    container.widgetslotpos = {}
    for y = 0, 2 do
        for x = 0, 2 do
            table.insert(container.widgetslotpos, Vector3(80*x-80*2/2, 80*y-80*2/2, 0))
        end
    end
    container.widgetanimbank = "ui_chest_3x3"
    container.widgetanimbuild = "ui_chest_3x3"
    container.widgetpos = Vector3(0, 200, 0)
    container.side_align_tip = 160
    
    -- Add events for opening/closing
    inst:ListenForEvent("onopen", function(inst)
        inst.AnimState:PlayAnimation("open")
        inst.SoundEmitter:PlaySound("dontstarve/wilson/chest_open")
    end)
    
    inst:ListenForEvent("onclose", function(inst)
        inst.AnimState:PlayAnimation("close")
        inst.SoundEmitter:PlaySound("dontstarve/wilson/chest_close")
    end)
    
    return inst
end

-- Example of a specialized container (backpack)
local function MakeBackpack()
    local inst = CreateEntity()
    
    -- Add basic components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    -- Make it an inventory item
    inst:AddComponent("inventoryitem")
    inst.components.inventoryitem.cangoincontainer = true
    
    -- Add container
    inst:AddComponent("container")
    local container = inst.components.container
    container:SetNumSlots(4)
    
    -- Configure container UI
    container.widgetslotpos = {
        Vector3(-37, 0, 0),
        Vector3(-12, 0, 0),
        Vector3(12, 0, 0),
        Vector3(37, 0, 0),
    }
    container.widgetanimbank = "ui_backpack_2x2"
    container.widgetanimbuild = "ui_backpack_2x2"
    container.widgetpos = Vector3(-5, -50, 0)
    
    -- Make it equippable
    inst:AddComponent("equippable")
    inst.components.equippable.equipslot = EQUIPSLOTS.BODY
    
    return inst
end
``` 
