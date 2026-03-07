---
id: flotationcushion
title: Flotationcushion
description: A prefab item that provides buoyancy support when equipped by a player, enabling underwater movement.
tags: [locomotion, buoyancy, equipment]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f533547a
system_scope: player
---

# Flotationcushion

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`flotationcushion` is a prefab definition for a wearable item that grants buoyancy to players. When equipped, it enables the player to float and move underwater, which is essential for traversing certain environments like swamps or during specific scenarios. The prefab relies on the `playerfloater` component to manage equip/unequip behavior and integrates with the entity system through standard DST ECS patterns, including transform, animation, network replication, and inventory subsystems.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("playerfloater")
inst:AddComponent("playerfloater")
-- The component is typically added automatically by the prefab's fn()
-- When added to a player:
player.components.inventory:Equip(inst)
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `network`, `equippable`, `playerfloater`, `inspectable`, `inventoryitem`  
**Tags:** Adds `cattoy`, `playerfloater`, and `__equippable` (temporary, removed before replication); uses `swap_float` animation symbol.

## Properties
No public properties.

## Main functions
This prefab does not define any public methods; all behavior is managed via attached components (e.g., `playerfloater`, `equippable`). The local functions `OnEquip` and `OnUnequip` are used internally by the `playerfloater` component.

### `OnEquip(inst, owner)`
*   **Description:** Called when the item is equipped. Handles skin-aware animation overrides for the `swap_float` symbol and fires the `equipskinneditem` event if applicable.
*   **Parameters:**  
    - `inst`: The flotationcushion entity instance.  
    - `owner`: The player entity receiving the item.  
*   **Returns:** Nothing.
*   **Error states:** None.

### `OnUnequip(inst, owner)`
*   **Description:** Called when the item is unequipped. Handles cleanup of skinned item events and animation overrides.
*   **Parameters:**  
    - `inst`: The flotationcushion entity instance.  
    - `owner`: The player entity losing the item.  
*   **Returns:** Nothing.
*   **Error states:** None.

## Events & listeners
- **Pushes:** `equipskinneditem` — fired on equip if the item has a skin build.  
- **Pushes:** `unequipskinneditem` — fired on unequip if the item has a skin build.  

*(No events are listened to by this prefab itself.)*