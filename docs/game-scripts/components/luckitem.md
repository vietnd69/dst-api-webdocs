---
id: luckitem
title: Luckitem
description: Manages luck contribution from an item to its owner, adjusting based on equipped state and stack size.
tags: [luck, inventory, equipment]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 2cdce8b2
system_scope: inventory
---

# Luckitem

> Based on game build **7140014** | Last updated: 2026-03-03

## Overview
`Luckitem` is a component that allows an item to contribute luck to its owner (a `luckuser` entity). It dynamically computes and applies luck based on whether the item is equipped, its stack size, and the luck values set for equipped and unequipped states. It integrates with the `equippable`, `inventoryitem`, and `luckuser` components and automatically updates the owner’s luck when the item is equipped, unequipped, or its stack size changes.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("luckitem")
inst:AddComponent("equippable")
inst:AddComponent("inventoryitem")
inst:AddComponent("luckuser")

inst.components.luckitem:SetLuck(0.05)          -- 5% luck when unequipped
inst.components.luckitem:SetEquippedLuck(0.10)  -- 10% luck when equipped
inst.components.luckitem:UpdateOwnerLuck_Internal()  -- Apply current luck to owner
```

## Dependencies & tags
**Components used:** `equippable`, `inventoryitem`, `luckuser`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `luck` | number | `0` | Base luck contribution when the item is unequipped (can be a function). |
| `equippedluck` | number | `0` | Luck contribution when the item is equipped (can be a function). |

## Main functions
### `SetLuck(luck)`
*   **Description:** Sets the base luck value applied when the item is unequipped. Accepts either a number or a callable function.
*   **Parameters:** `luck` (number or function) — luck multiplier (e.g., `0.05` for +5%).
*   **Returns:** Nothing.

### `GetLuck()`
*   **Description:** Returns the current base luck value, resolving it as a function if necessary.
*   **Parameters:** None.
*   **Returns:** number — resolved luck value.

### `SetEquippedLuck(luck)`
*   **Description:** Sets the luck value applied when the item is equipped. Accepts either a number or a callable function.
*   **Parameters:** `luck` (number or function) — equipped luck multiplier (e.g., `0.10` for +10%).
*   **Returns:** Nothing.

### `GetEquippedLuck()`
*   **Description:** Returns the current equipped luck value, resolving it as a function if necessary.
*   **Parameters:** None.
*   **Returns:** number — resolved luck value.

### `UpdateOwnerLuck_Internal([owner])`
*   **Description:** Calculates and applies the item’s luck contribution to the owner based on current equipped state and stack size. If `owner` is not provided, it attempts to infer it from `inventoryitem:GetGrandOwner()`.
*   **Parameters:** `owner` (Entity, optional) — the entity to update luck on.
*   **Returns:** Nothing.
*   **Error states:** No effect if `owner` is missing, or if `owner.components.luckuser` is not present.

### `RemoveOwnerLuck_Internal([owner])`
*   **Description:** Removes this item’s luck contribution from the owner.
*   **Parameters:** `owner` (Entity, optional) — the entity to remove luck from; inferred from `inventoryitem` if omitted.
*   **Returns:** Nothing.
*   **Error states:** No effect if `owner` is missing, or if `owner.components.luckuser` is not present.

### `GetDebugString()`
*   **Description:** Returns a formatted string for debugging, showing percentage-formatted luck values adjusted for stack size.
*   **Parameters:** None.
*   **Returns:** string — e.g., `"luck: 5.0%, equippedluck: 10.0%"`.

## Events & listeners
- **Listens to:**  
  - `equipped` — triggers `UpdateOwnerLuck_Internal()` when the item is equipped.  
  - `unequipped` — triggers `RemoveOwnerLuck_Internal()` when the item is unequipped.  
  - `stacksizechange` — triggers `UpdateOwnerLuck_Internal()` when stack size changes.  
  - `updateownerluck` — triggers `UpdateOwnerLuck_Internal()` for manual refreshes.
- **Pushes:** None.
