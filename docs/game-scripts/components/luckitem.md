---
id: luckitem
title: Luckitem
description: This component calculates and applies luck value to an owner entity based on the item's equipped status and stack size.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 2cdce8b2
---

# Luckitem

## Overview
This component manages the luck contribution of an inventory item to its owner entity. It calculates effective luck based on the item's base luck, equipped status, and stack size, then applies it to the owner via the `luckuser` component when the item is equipped or held as part of the inventory source. It also ensures proper cleanup when the item is unequipped, removed, or ownership changes.

## Dependencies & Tags
- **Components relied on:** `inventoryitem`, `equippable`, `luckuser`
- **Tags added:** None identified
- **Inheritance helpers:** Uses `MakeComponentAnInventoryItemSource(self)` and `RemoveComponentInventoryItemSource(self)` for inventory source integration.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (assigned in constructor) | Reference to the entity this component is attached to. |
| `luck` | `number` or `function` | `0` | Base luck value provided by the item when not equipped. |
| `equippedluck` | `number` or `function` | `0` | Luck value provided by the item when equipped (overrides `luck` when equipped). |

## Main Functions
### `UpdateOwnerLuck_Internal(owner)`
* **Description:** Calculates the current effective luck from the item and updates the owner's `luckuser` component. Uses equipped luck if the item is equipped, otherwise base luck. Multiplies by stack size. If no owner is provided, it determines the grand owner via the `inventoryitem` component.
* **Parameters:**  
  `owner` (optional `Entity`): The entity receiving the luck. If omitted, determined automatically.

### `RemoveOwnerLuck_Internal(owner)`
* **Description:** Removes the item’s luck contribution from the owner’s `luckuser` component. If no owner is provided, it determines the grand owner via the `inventoryitem` component.
* **Parameters:**  
  `owner` (optional `Entity`): The entity from which to remove the luck source. If omitted, determined automatically.

### `SetLuck(luck)`
* **Description:** Sets the base luck value for the item (used when unequipped).
* **Parameters:**  
  `luck` (`number` or `function`): The luck value or a function returning the value.

### `GetLuck()`
* **Description:** Returns the current base luck value, resolving it through `FunctionOrValue` to support dynamic values based on item owner context.
* **Parameters:** None.

### `SetEquippedLuck(luck)`
* **Description:** Sets the luck value applied when the item is equipped.
* **Parameters:**  
  `luck` (`number` or `function`): The equipped luck value or a function returning the value.

### `GetEquippedLuck()`
* **Description:** Returns the current equipped luck value, resolving it through `FunctionOrValue` to support dynamic values based on item owner context.
* **Parameters:** None.

### `GetDebugString()`
* **Description:** Returns a formatted debug string showing the calculated luck percentages for both base and equipped states (multiplied by 100 for readability).
* **Parameters:** None.

## Events & Listeners
- Listens for `"equipped"` → calls `UpdateOwnerLuck_Internal()`
- Listens for `"unequipped"` → calls `RemoveOwnerLuck_Internal()`
- Listens for `"stacksizechange"` → calls `UpdateOwnerLuck_Internal()`
- Listens for `"updateownerluck"` → calls `UpdateOwnerLuck_Internal()`
- Implements `OnItemSourceRemoved(owner)` callback → calls `RemoveOwnerLuck_Internal(owner)`
- Implements `OnItemSourceNewOwner(owner)` callback → calls `UpdateOwnerLuck_Internal(owner)`