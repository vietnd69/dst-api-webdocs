---
id: theplayer
title: ThePlayer
sidebar_position: 3
---

# ThePlayer

ThePlayer is the global object representing the current player character in Don't Starve Together. It provides access to the player's state, components, and control capabilities.

## Basic Player Information

```lua
-- Get player position
local x, y, z = ThePlayer.Transform:GetWorldPosition()

-- Get player prefab (character type)
local character = ThePlayer.prefab -- Returns "wilson", "willow", "wx78", etc.

-- Get player entity ID
local entity_id = ThePlayer.entity:GetGUID()

-- Check if player is valid
local is_valid = ThePlayer:IsValid()

-- Check player tags
local is_ghost = ThePlayer:HasTag("playerghost")
local is_busy = ThePlayer:HasTag("busy")
```

## Player Components

ThePlayer has many components that control different aspects of the character:

```lua
-- Health component
local health = ThePlayer.components.health
local current_health = health.currenthealth
local max_health = health.maxhealth
local percent_health = health:GetPercent()

-- Hunger component
local hunger = ThePlayer.components.hunger
local current_hunger = hunger.current
local max_hunger = hunger.max
local percent_hunger = hunger:GetPercent()

-- Sanity component
local sanity = ThePlayer.components.sanity
local current_sanity = sanity.current
local max_sanity = sanity.max
local percent_sanity = sanity:GetPercent()

-- Temperature component
local temperature = ThePlayer.components.temperature
local current_temp = temperature.current
local is_freezing = temperature:IsFreezing()
local is_overheating = temperature:IsOverheating()

-- Inventory component
local inventory = ThePlayer.components.inventory
local active_item = inventory:GetActiveItem()
local equipped_item = inventory:GetEquippedItem(EQUIPSLOTS.HANDS)

-- Locomotor component
local locomotor = ThePlayer.components.locomotor
local speed = locomotor.walkspeed
local current_platform = ThePlayer:GetCurrentPlatform() -- Returns boat if on a boat

-- Builder component
local builder = ThePlayer.components.builder
local can_build = builder:CanBuild("campfire")
local recipes = builder.recipes -- Known recipes

-- Combat component
local combat = ThePlayer.components.combat
local damage = combat.defaultdamage
local attack_range = combat.attackrange

-- Player controller
local controller = ThePlayer.components.playercontroller
local is_enabled = controller.enabled
```

## Client-Side Replicas

On clients, components are accessed through their replicas:

```lua
-- Health replica
local health_replica = ThePlayer.replica.health
local current_health = health_replica:GetCurrent()
local max_health = health_replica:GetMax()
local percent_health = health_replica:GetPercent()

-- Hunger replica
local hunger_replica = ThePlayer.replica.hunger
local current_hunger = hunger_replica:GetCurrent()
local percent_hunger = hunger_replica:GetPercent()

-- Sanity replica
local sanity_replica = ThePlayer.replica.sanity
local current_sanity = sanity_replica:GetCurrent()
local percent_sanity = sanity_replica:GetPercent()

-- Inventory replica
local inventory_replica = ThePlayer.replica.inventory
local has_item = inventory_replica:Has("log", 1)
local active_item = inventory_replica:GetActiveItem()
```

## Player Actions

```lua
-- Make the player say something
ThePlayer.components.talker:Say("Hello world!")

-- Damage the player
ThePlayer.components.health:DoDelta(-10) -- Take 10 damage

-- Feed the player
ThePlayer.components.hunger:DoDelta(10) -- Add 10 hunger

-- Change player sanity
ThePlayer.components.sanity:DoDelta(10) -- Add 10 sanity

-- Give the player an item
ThePlayer.components.inventory:GiveItem(SpawnPrefab("log"))

-- Equip an item
local item = SpawnPrefab("axe")
ThePlayer.components.inventory:Equip(item)

-- Move the player
ThePlayer.Physics:Teleport(x, y, z) -- Teleport to coordinates
```

## User Interface

```lua
-- Access the player's HUD
local hud = ThePlayer.HUD

-- Show/hide HUD elements
hud:Show() -- Show the entire HUD
hud:Hide() -- Hide the entire HUD

-- Add chat message
ThePlayer.components.talker:Say("This is a chat message")

-- Show an announcement
hud:ShowPopup(STRINGS.UI.HUD.ANNOUNCE_SUFFIX.."Important announcement!")
```

## Player Events

```lua
-- Listen for player events
ThePlayer:ListenForEvent("death", function()
    print("Player died!")
end)

-- Common events
-- "death" - Player died
-- "respawn" - Player respawned
-- "attacked" - Player was attacked
-- "healthdelta" - Health changed
-- "hungerdelta" - Hunger changed
-- "sanitydelta" - Sanity changed
-- "equip" - Item equipped
-- "unequip" - Item unequipped
-- "itemget" - Item added to inventory
-- "itemlose" - Item removed from inventory
-- "newactiveitem" - Active item changed
```

## Important Considerations

1. **Client vs. Server**: Some components only exist on the server, use replicas on the client
2. **ThePlayer Availability**: ThePlayer may be nil until a player character is spawned
3. **Authority**: Only the server has authority to modify most player state
4. **Mod Compatibility**: Changing player state can affect other mods
5. **Character-Specific Logic**: Different characters may have different behavior

## Common Use Cases

- **Character State**: Checking and modifying health, hunger, and sanity
- **Inventory Management**: Giving, taking, and checking inventory
- **Player Movement**: Teleporting or checking position
- **Character Information**: Getting player character type and state
- **User Interface**: Displaying information to the player 