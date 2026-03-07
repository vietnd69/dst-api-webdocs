---
id: piggyback
title: Piggyback
description: A wearable backpack item that provides limited container storage, increases walk speed, and offers no water resistance.
tags: [inventory, container, wearable]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 36a930e6
system_scope: inventory
---

# Piggyback

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `piggyback` prefab is a wearable item that functions as a small backpack. It provides basic container storage functionality and modifies the wearer’s walk speed. It is equipped on the `BODY` slot and opens/closes its container automatically when equipped/unequipped. It explicitly disables container storage capability (`cangoincontainer = false`) and offers no water protection (`SetEffectiveness(0)`).

## Usage example
```lua
local inst = CreateEntity()
inst:AddPrefab("piggyback")
-- The component logic is fully encapsulated in the prefab; no further setup needed.
-- When equipped by a player using EQUIPSLOTS.BODY, the container opens automatically.
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `equippable`, `waterproofer`, `container`
**Tags:** Adds `backpack` and `waterproofer`; checks `waterproofer` for optimization.

## Properties
No public properties.

## Main functions
### `onequip(inst, owner)`
* **Description:** Handler called when the piggyback is equipped. Opens the container, sets visual overrides for skin-aware rendering, and notifies the owner of the equip event.
* **Parameters:**  
  `inst` (Entity) – the piggyback instance.  
  `owner` (Entity) – the entity equipping the item.  
* **Returns:** Nothing.
* **Error states:** May fail silently if `owner.AnimState` is unavailable or `owner:PushEvent` fails.

### `onunequip(inst, owner)`
* **Description:** Handler called when the piggyback is unequipped. Closes the container, clears the `swap_body` override, and notifies the owner of the unequip event if skin-aware.
* **Parameters:**  
  `inst` (Entity) – the piggyback instance.  
  `owner` (Entity) – the entity unequipping the item.  
* **Returns:** Nothing.
* **Error states:** May fail silently if `owner.AnimState` is unavailable or `owner:PushEvent` fails.

### `onequiptomodel(inst, owner)`
* **Description:** Handler called when the piggyback is rendered in a UI model (e.g., inventory preview). Closes the container to prevent persistent UI interaction.
* **Parameters:**  
  `inst` (Entity) – the piggyback instance.  
  `owner` (Entity) – the entity context (often unused).  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (no event listeners registered in this file).
- **Pushes:** `equipskinneditem`, `unequipskinneditem`, and standard container events (`onopen`, `onclose`) via component APIs.