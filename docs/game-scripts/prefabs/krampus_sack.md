---
id: krampus_sack
title: Krampus Sack
description: A wearable container item that opens when equipped and closes when unequipped, providing inventory storage with water resistance.
tags: [inventory, container, equipment]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 97bd5c75
system_scope: inventory
---

# Krampus Sack

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `krampus_sack` prefab is a wearable inventory container item designed for equipping to the `BODY` equipment slot. It implements custom equip/unequip behaviors to open and close its internal container state when worn or removed by a player. As a specialized backpack, it inherits floatability and waterproofer properties but has water resistance disabled (`effectiveness = 0`). It integrates tightly with the `equippable`, `container`, `inventoryitem`, and `waterproofer` components.

## Usage example
```lua
local inst = TheWorld:SpawnPrefab("krampus_sack")
inst.components.equippable:Equip(player)
-- The container opens automatically on equip
-- Items can be added/removed via inst.components.container
player.components.inventory:EquipItem(inst)
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `equippable`, `waterproofer`, `container`

**Tags:** `backpack`, `waterproofer` (added unconditionally, though waterproofer effectiveness is set to `0`)

## Properties
No public properties are initialized directly in this script. Component properties are accessed via `inst.components.<name>`.

## Main functions
### `onequip(inst, owner)`
* **Description:** Callback invoked when the item is equipped by a player. Opens the container, sets skin overrides for the backpack and swap_body symbols on the owner's AnimState, and pushes an `equipskinneditem` event if a skin build is present.
* **Parameters:** 
  * `inst` (entity) — the Krampus sack entity.
  * `owner` (entity) — the entity equipping the item (typically a player).
* **Returns:** Nothing.
* **Error states:** Skin overrides are applied conditionally; if `inst:GetSkinBuild()` is `nil`, only standard symbol overrides occur.

### `onunequip(inst, owner)`
* **Description:** Callback invoked when the item is unequipped. Clears the backpack and swap_body symbol overrides, pushes an `unequipskinneditem` event if a skin build is present, and closes the container.
* **Parameters:** 
  * `inst` (entity) — the Krampus sack entity.
  * `owner` (entity) — the entity unequipping the item.
* **Returns:** Nothing.

### `onequiptomodel(inst, owner)`
* **Description:** Callback invoked when the item is equipped to a model (e.g., preview or UI context). Immediately closes the container to ensure no UI remains open during preview.
* **Parameters:** 
  * `inst` (entity) — the Krampus sack entity.
  * `owner` (entity) — the entity equipping to the model (often a dummy or HUD context).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls).
- **Pushes:** `equipskinneditem` — when a skin build is present during equip.  
  `unequipskinneditem` — when a skin build is present during unequip.  
  *(Container `Open`/`Close` also trigger their own standard events: `onopen`, `onclose`, etc., via `inst:PushEvent`.)*