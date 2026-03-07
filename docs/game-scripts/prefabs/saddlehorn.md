---
id: saddlehorn
title: Saddlehorn
description: A consumable tool that removes saddles from beefalo and other animals, with limited durability and weapon functionality.
tags: [combat, inventory, utility]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b57bf933
system_scope: inventory
---

# Saddlehorn

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `saddlehorn` prefab is a consumable utility tool used to remove saddles from mounted creatures such as beefalo. It functions as both a weapon and a finite-use item, integrated with the `equippable`, `weapon`, `finiteuses`, and `unsaddler` components. It supports visual swap animations when equipped and degrades with use until it is consumed and removed from the game.

## Usage example
```lua
local inst = SpawnPrefab("saddlehorn")
-- Ensure the saddlehorn is added to an entity's inventory
inst.Transform:SetPosition(x, y, z)
-- The saddlehorn is automatically usable with ACTIONS.UNSADDLE
```

## Dependencies & tags
**Components used:** `weapon`, `finiteuses`, `equippable`, `inspectable`, `inventoryitem`, `unsaddler`  
**Tags:** Adds `weapon`; checks `usesdepleted` (via `finiteuses`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scrapbook_subcat` | string | `"tool"` | Category for Scrapbook display. |
| `animstate` |AnimState component|—|AnimBank `"saddlehorn"`, AnimBuild `"saddlehorn"`, initial animation `"idle"` |

## Main functions
### `onequip(inst, owner)`
*   **Description:** Sets up visual state when the saddlehorn is equipped. Overrides the `swap_object` symbol and swaps animation layers to show `ARM_carry`.
*   **Parameters:**  
    `inst` (Entity) — the saddlehorn instance.  
    `owner` (Entity) — the character equipping the item.  
*   **Returns:** Nothing.

### `onunequip(inst, owner)`
*   **Description:** Restores the owner's default animation state when the saddlehorn is unequipped.
*   **Parameters:**  
    `inst` (Entity) — the saddlehorn instance.  
    `owner` (Entity) — the character unequipping the item.  
*   **Returns:** Nothing.

## Events & listeners
- **Pushes:** `percentusedchange` — fired via `finiteuses:SetUses()` when use count changes.
- **Listens to:** None (no `inst:ListenForEvent` calls in constructor).
- **Callback hook:** `inst.Remove` is invoked via `finiteuses:SetOnFinished()` when uses are depleted.