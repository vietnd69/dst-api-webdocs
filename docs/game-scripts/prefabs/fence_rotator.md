---
id: fence_rotator
title: Fence Rotator
description: A consumable tool used to rotate fences; equipped as an inventory item and decrements finite uses per rotation.
tags: [consumable, combat, inventory, tool]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ea70e882
system_scope: inventory
---

# Fence Rotator

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `fence_rotator` is a utility item that allows players to rotate fences in the world. It functions as a consumable tool with a limited number of uses, equipped in the character’s hands. When used, it emits sound and visual effects and triggers the `fencerotated` event, which decrements its use count. Once all uses are exhausted, the item is automatically removed. It integrates with the `equippable`, `finiteuses`, `floater`, and `weapon` components for proper behavior and aesthetics.

## Usage example
```lua
-- Typical prefab creation (internal to DST; not used directly by modders)
-- The component itself is not meant to be added standalone; it's embedded in the fence_rotator prefab.
-- Modders may reference its behavior when creating similar tools:
--   - Equip/unequip animations via `equippable`
--   - Use counting via `finiteuses`
--   - Weapon tags for combat interactions
```

## Dependencies & tags
**Components used:** `equippable`, `finiteuses`, `floater`, `weapon`, `inspectable`, `inventoryitem`, `fencerotator`  
**Tags added:** `fence_rotator`, `nopunch`, `sharp`, `pointy`, `jab`, `weapon`  
**Tags removed:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scrapbook_specialinfo` | string | `"FENCEROTATOR"` | Identifier used by the Scrapbook system for entry categorization. |

## Main functions
### `onequip(inst, owner)`
*   **Description:** Called when the fence rotator is equipped. Updates the character's animation state to show the arm-carry pose and swap symbol for the tool.
*   **Parameters:**
    *   `inst` (Entity) — the fence rotator entity.
    *   `owner` (Entity) — the character equipping the item.
*   **Returns:** Nothing.

### `onunequip(inst, owner)`
*   **Description:** Called when the fence rotator is unequipped. Restores the normal arm animation and hides the carry pose.
*   **Parameters:**
    *   `inst` (Entity) — the fence rotator entity.
    *   `owner` (Entity) — the character unequipping the item.
*   **Returns:** Nothing.

### `onfencerotated(inst)`
*   **Description:** Listener for the `fencerotated` event. Decrements the use count of the fence rotator when a fence is rotated. Triggers `finiteuses:Use(1)`, and if uses reach zero, removes the item.
*   **Parameters:** `inst` (Entity) — the fence rotator entity.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `fencerotated` — triggers use decrement and eventual removal.
- **Pushes:** None identified.