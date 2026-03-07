---
id: shell_cluster
title: Shell Cluster
description: A breakable environmental object that drops singing shells when mined and can be equipped as body armor.
tags: [environment, mining, crafting, equipment, loot]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 61a166d2
system_scope: environment
---

# Shell Cluster

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `shell_cluster` prefab represents a collectible and interactable environmental structure found in the game world. It functions as a breakable obstacle with physics properties, supports mining via the `workable` component, and grants temporary protective gear when equipped using the `equippable` component. It is primarily used for resource acquisition (singing shells) and can be part of crafting or exploration mechanics.

## Usage example
```lua
local inst = SpawnPrefab("shell_cluster")
inst.Transform:SetPosition(x, y, z)
inst.components.workable:SetWorkLeft(5) -- Set custom mining difficulty
inst.components.lootdropper:DropLoot(inst:GetPosition()) -- Force drop loot immediately
```

## Dependencies & tags
**Components used:** `lootdropper`, `heavyobstaclephysics`, `inventoryitem`, `equippable`, `workable`, `submersible`, `symbolswapdata`, `inspectable`, `hauntable`
**Tags:** Adds `heavy`

## Properties
No public properties.

## Main functions
### `OnWorked(inst, worker)`
*   **Description:** Callback fired when the shell cluster is fully mined. Spawns visual feedback (`rock_break_fx`), drops loot, and removes the entity.
*   **Parameters:**  
    `inst` (Entity) – the shell cluster instance.  
    `worker` (Entity) – the entity that performed the mining action.  
*   **Returns:** Nothing.

### `OnEquip(inst, owner)`
*   **Description:** Called when the shell cluster is equipped. Overrides the `swap_body` symbol with the singing shell asset on the owner's animation state.
*   **Parameters:**  
    `inst` (Entity) – the shell cluster instance.  
    `owner` (Entity) – the entity equipping the item.  
*   **Returns:** Nothing.

### `OnUnequip(inst, owner)`
*   **Description:** Called when the shell cluster is unequipped. Clears the `swap_body` symbol override on the owner's animation state.
*   **Parameters:**  
    `inst` (Entity) – the shell cluster instance.  
    `owner` (Entity) – the entity unequipping the item.  
*   **Returns:** Nothing.

### `fn()`
*   **Description:** Prefab constructor function. Initializes the shell cluster entity, attaches all necessary components, sets gameplay-relevant properties, and returns the fully configured instance.
*   **Parameters:** None.
*   **Returns:** `inst` (Entity) – fully constructed shell cluster entity.

## Events & listeners
- **Listens to:** None explicitly defined in this file.
- **Pushes:** None explicitly defined in this file.