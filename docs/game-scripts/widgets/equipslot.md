---
id: equipslot
title: Equipslot
description: Manages interactive equipment slots on the UI, handling item equipping, unequipping, and highlighting based on active items.
tags: [ui, inventory, equipment]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: d86967e5
system_scope: ui
---

# Equipslot

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`EquipSlot` is a UI widget subclassed from `ItemSlot` that represents a dedicated equipment slot in the player's inventory UI (e.g., head, hands, torso). It listens for changes in the active item and highlights itself when an item matches its slot type and is not restricted. It also handles user input (clicks and control inputs) to equip, unequip, use, or drop items via the owner's `inventory` component.

## Usage example
```lua
local equipslot = CreateWidget("equipslot", "equipslot", "background", owner)
equipslot:SetPos(100, 100)
equipslot.equipslot = "torso"
```

## Dependencies & tags
**Components used:** `inventory` (via `owner.replica.inventory`), `equippable` (via `data.item.replica.equippable` and `tile.item.replica.equippable`)
**Tags:** Checks `debuffed`, `restricted` indirectly via `IsRestricted()` — none added directly.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `GoreEntity` or `Player` | `nil` | The entity that owns this equipment slot and whose inventory is being modified. |
| `equipslot` | string | `nil` | The slot identifier (e.g., `"head"`, `"hands"`, `"torso"`), matching values returned by `equippable:EquipSlot()`. |
| `highlight` | boolean | `false` | Whether the slot should be visually highlighted (set via `LockHighlight()`/`UnlockHighlight()` from parent `ItemSlot`). |

## Main functions
### `Click()`
* **Description:** Simulates a primary click on the slot, delegating to `OnControl(CONTROL_ACCEPT, true)`.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No explicit error conditions.

### `OnControl(control, down)`
* **Description:** Handles UI control inputs (e.g., accept or secondary) when the slot is interacted with. Handles equipping, unequipping, using, or dropping items depending on state.
* **Parameters:**  
  `control` (number) — The control constant (e.g., `CONTROL_ACCEPT`, `CONTROL_SECONDARY`).  
  `down` (boolean) — Whether the control was pressed (`true`) or released (`false`).
* **Returns:** `true` if the control was handled; otherwise `nil`.
* **Error states:**  
  - No action occurs if `down == false`.  
  - Equipment operations are skipped if the item is restricted (`IsRestricted(owner) == true`) or prevents unequipping (`ShouldPreventUnequipping() == true`).  
  - Returns early without action if `owner.replica.inventory` or item replicas are missing.

## Events & listeners
- **Listens to:** `newactiveitem` — registered on `owner`; updates highlight state when the active item changes:
  - Highlights if the new active item matches the slot and is not restricted.
  - Unhighlights otherwise.
- **Pushes:** None.