---
id: walking_stick
title: Walking Stick
description: Manages equippable item behavior for the Walking Stick, including fuel consumption based on owner movement and animation overrides.
tags: [inventory, equippable, fuel, locomotion]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e6331e28
system_scope: inventory
---

# Walking Stick

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `walking_stick` prefab implements a consumable item that grants increased movement speed when equipped and automatically consumes fuel only while the owner is moving forward. It integrates with the `equippable`, `fueled`, and `fuel` components to manage state changes on equip/unequip, handle fuel depletion, and update the owner's appearance via animation overrides.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("fueled")
inst:AddComponent("fuel")
inst:AddComponent("equippable")

inst.components.equippable:SetOnEquip(function(inst, owner) ... end)
inst.components.equippable:SetOnUnequip(function(inst, owner) ... end)
inst.components.equippable.walkspeedmult = TUNING.WALKING_STICK_SPEED_MULT
```

## Dependencies & tags
**Components used:** `equippable`, `fueled`, `fuel`, `inspectable`, `inventoryitem`, `transform`, `animstate`, `soundemitter`, `network`, `inventory`, `locomotor` (indirectly via event listening)  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `OnEquip(inst, owner)`
*   **Description:** Called when the walking stick is equipped by an entity. Sets animation symbols for equipping, hides idle arm animation, shows carry arm animation, starts listening to owner's `locomote` events to manage fuel consumption, and applies skin overrides if applicable.
*   **Parameters:**  
    `inst` (Entity) – the walking stick entity.  
    `owner` (Entity) – the entity equipping the item.
*   **Returns:** Nothing.
*   **Error states:** Does not return errors; safely handles missing skin builds.

### `OnUnequip(inst, owner)`
*   **Description:** Called when the walking stick is unequipped. Restores original arm animations, removes `locomote` event listeners, and stops fuel consumption.
*   **Parameters:**  
    `inst` (Entity) – the walking stick entity.  
    `owner` (Entity) – the entity unequipping the item.
*   **Returns:** Nothing.

### `OnEquipToModel(inst, owner, from_ground)`
*   **Description:** Called when the item is equipped to a preview model (e.g., in UI). Stops fuel consumption if a `fueled` component exists, as fuel should not drain in UI previews.
*   **Parameters:**  
    `inst` (Entity) – the walking stick entity.  
    `owner` (Entity) – the model entity.  
    `from_ground` (boolean) – whether the item was picked up from the ground.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `locomote` – triggered by the owner's `Locomotor` component when movement intent changes; used to start/stop fuel consumption.
- **Pushes:** `equipskinneditem` – when a skinned version is equipped.  
  `unequipskinneditem` – when a skinned version is unequipped.