---
id: thief
title: Thief
description: Enables an entity to steal items from other entities' inventories or containers.
tags: [inventory, combat, interaction]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 4a5b6726
system_scope: entity
---

# Thief

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Thief` component allows an entity to steal items from targets that have an `inventory` or `container` component. It supports optional attacks before stealing, and triggers callbacks and events upon successful theft. It is designed for gameplay interactions where characters (e.g., enemies or special entities) can pilfer items from other beings or containers.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("thief")
inst:AddComponent("combat")
inst:AddComponent("inventory")

inst.components.thief:SetOnStolenFn(function(thief, victim, item)
    print("Item '" .. (item.name or "unknown") .. "' stolen from " .. victim.prefab)
end)

-- Attempt to steal an item from a victim, optionally attacking first
inst.components.thief:StealItem(victim, nil, true)
```

## Dependencies & tags
**Components used:** `combat`, `inventory`, `container`, `equippable`, `inventoryitem`  
**Tags:** Checks `nosteal` tag on items to determine stealability

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `stolenitems` | table | `{}` (empty) | **Deprecated.** Previously used to track stolen item references; no longer actively used. |
| `onstolen` | function or `nil` | `nil` | Optional callback function called after an item is successfully stolen. |

## Main functions
### `SetOnStolenFn(fn)`
*   **Description:** Sets a callback function to be invoked whenever an item is successfully stolen.
*   **Parameters:** `fn` (function) — a function with signature `(thief, victim, item)`, where `thief` and `victim` are entity instances, and `item` is the stolen item.
*   **Returns:** Nothing.

### `StealItem(victim, itemtosteal, attack)`
*   **Description:** Attempts to steal an item from a victim entity. If `attack` is `true`, the thief attacks the victim before stealing. Supports both inventory-based and container-based targets.
*   **Parameters:**
    * `victim` (Entity instance) — The target entity to steal from.
    * `itemtosteal` (Entity instance or `nil`) — Optional specific item to steal. If `nil`, a random stealable item is selected.
    * `attack` (boolean) — Whether to perform an attack on the victim before attempting to steal.
*   **Returns:** `true` if an item was successfully stolen, `false` otherwise.
*   **Error states:**
    * Returns `false` if the victim has neither `inventory` nor `container` components.
    * Returns `false` if no stealable item is found (i.e., all items are tagged `nosteal` or container/inventory is empty).
    * If `itemtosteal` is provided but not found in the victim's container/inventory, stealing fails.

## Events & listeners
- **Listens to:** None (no event listeners are registered directly by this component).
- **Pushes:** `onitemstolen` — fired on the victim entity when an item is stolen. Event data includes `{ item = item, thief = self.inst }`.
