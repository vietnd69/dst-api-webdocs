---
id: shadowdominance
title: Shadowdominance
description: Manages the "shadowdominance" tag on an entity based on equip state and presence of other shadow-dominant items.
tags: [inventory, tags, equipment]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 3dddb4d3
system_scope: inventory
---

# Shadowdominance

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Shadowdominance` is a component that enforces a single "shadowdominance" tag on an entity, ensuring the tag is present only when exactly one item with this component is equipped. It is designed to work in conjunction with the `shadowsubmissive` component. When an item with this component is equipped, it adds the tag to the owner, provided the owner does not already have an active `_shadowdsubmissive_task`. When unequipped or removed, it removes the tag unless another shadowdominance item remains equipped.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("shadowdominance")
-- Typically added to equipment prefabs (e.g., clothing or accessories)
-- Tag logic automatically activates when equipped via equipped/unequipped events
```

## Dependencies & tags
**Components used:** `equippable` (`IsEquipped`), `inventory` (`equipslots`), `inventoryitem` (`IsHeld`, `owner`)
**Tags:** Adds `shadowdominance` to the owner entity during equip and removes it during unequip/remove, under defined conditions.

## Properties
No public properties.

## Main functions
### `OnRemoveFromEntity()`
* **Description:** Cleans up event listeners and ensures the `shadowdominance` tag is removed from the owner when the component is removed from its entity.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Calls `_OnUnequipped` internally to correctly handle tag removal in all edge cases.

## Events & listeners
- **Listens to:**  
  - `equipped` — triggers tag addition to the owner.  
  - `unequipped` — triggers tag removal logic (unless another shadowdominance item is equipped).  
  - `onremove` — triggers tag removal logic if the item was still equipped at removal time.  
- **Pushes:** None.
