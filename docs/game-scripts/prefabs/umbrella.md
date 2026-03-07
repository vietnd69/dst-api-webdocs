---
id: umbrella
title: Umbrella
description: An equippable item that provides rain protection, insulation, and temporary coverage, consuming fuel or perishing over time depending on variant.
tags: [inventory, weather, equipment, durability]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 86be3873
system_scope: inventory
---

# Umbrella

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `umbrella` prefab provides a wearable item that protects the player from rain and offers seasonal insulation. It supports two variants—`umbrella` (Pigskin Umbrella), which consumes fuel over time, and `grass_umbrella` (Grass Umbrella), which perishes gradually. The component logic is embedded directly in the prefab definition via event handlers for equipping/unequipping, and integrates with the `equippable`, `fueled`, `perishable`, `waterproofer`, and `insulator` components.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("player")

-- Equip the pigskin umbrella (fuel-based)
local umbrella = SpawnPrefab("umbrella")
inst.components.inventoryitem:GiveItem(umbrella)
umbrella.components.equippable:Equip(inst)

-- Equip the grass umbrella (perishable)
local grass_umbrella = SpawnPrefab("grass_umbrella")
inst.components.inventoryitem:GiveItem(grass_umbrella)
grass_umbrella.components.equippable:Equip(inst)
```

## Dependencies & tags
**Components used:** `equippable`, `fueled`, `perishable`, `waterproofer`, `insulator`, `floater`, `inventoryitem`, `fuel`, `inspectable`, `tradable`, `hauntable`  
**Tags added:** `nopunch`, `umbrella`, `waterproofer`, `show_spoilage` (grass variant only)  

## Properties
No public properties initialized in the constructor; all state is managed via component interfaces (`components.*`).

## Main functions
### `onequip(inst, owner)`
*   **Description:** Callback invoked when the umbrella is equipped. Changes character animation, adjusts dynamic shadow size, and starts fuel consumption.
*   **Parameters:**  
    `inst` (Entity) – the umbrella instance.  
    `owner` (Entity) – the character equipping the item.  
*   **Returns:** Nothing.

### `onunequip(inst, owner)`
*   **Description:** Callback invoked when the umbrella is unequipped. Restores character animation and stops fuel consumption.
*   **Parameters:**  
    `inst` (Entity) – the umbrella instance.  
    `owner` (Entity) – the character unequipping the item.  
*   **Returns:** Nothing.

### `onequiptomodel(inst, owner, from_ground)`
*   **Description:** Callback invoked when the item is picked up from the ground into an inventory slot. Stops fuel consumption to prevent drain during inventory transit.
*   **Parameters:**  
    `inst` (Entity) – the umbrella instance.  
    `owner` (Entity) – the character.  
    `from_ground` (boolean) – true if picked from world.  
*   **Returns:** Nothing.

### `onperish(inst)`
*   **Description:** Callback invoked when the grass umbrella fully perishes or the pigskin umbrella's fuel is depleted. Removes the item and notifies the owner if equipped.
*   **Parameters:**  
    `inst` (Entity) – the umbrella instance.  
*   **Returns:** Nothing.

### `common_fn(name)`
*   **Description:** Shared initialization logic for both umbrella variants. Sets up transforms, animation states, physics, tags, and common components.
*   **Parameters:**  
    `name` (string) – asset bank/build name (`"umbrella"` or `"parasol"`).  
*   **Returns:** The initialized entity instance.

### `grass()`
*   **Description:** Factory function for the `grass_umbrella` variant. Adds perishable behavior and grass-specific tuning values.
*   **Parameters:** None.  
*   **Returns:** The initialized `grass_umbrella` prefab instance.

### `pigskin()`
*   **Description:** Factory function for the `umbrella` (pigskin) variant. Adds fueled behavior and higher waterproofing.
*   **Parameters:** None.  
*   **Returns:** The initialized `umbrella` prefab instance.

## Events & listeners
- **Listens to:** None directly; events are handled via callbacks registered to `equippable` component hooks (`SetOnEquip`, `SetOnUnequip`, `SetOnEquipToModel`) and `perishable` (`SetOnPerishFn`).
- **Pushes:**  
    `equipskinneditem` – sent to the owner when a skinned item is equipped.  
    `unequipskinneditem` – sent to the owner when a skinned item is unequipped.  
    `umbrellaranout` – sent to the owner when the umbrella perishes while equipped.  
    `onfueldsectionchanged` – pushed by the `fueled` component when fuel section changes (e.g., low fuel warning).