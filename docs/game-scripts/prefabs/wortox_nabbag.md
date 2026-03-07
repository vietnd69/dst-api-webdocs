---
id: wortox_nabbag
title: Wortox Nabbag
description: Manages Wortox's soul-collecting bug net, dynamically adjusting weapon damage, visual size, and effects based on inventory soul count and slot usage.
tags: [combat, inventory, vfx, equipment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: af50d526
system_scope: inventory
---

# Wortox Nabbag

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The Wortox Nabbag handles the functional and visual behavior of Wortox's soul-collecting bug net. It dynamically scales the weapon's damage based on soul count (from `wortox_soul` and `wortox_souljar`) and inventory slot utilization, updates the equipable item's image and visual size buckets, and manages companion VFX entities (`wortox_nabbag_body`, `body_fx`, `body_soulfx`) that animate and emit particles. It integrates closely with the `equippable`, `weapon`, `inventory`, `inventoryitem`, `rider`, `skilltreeupdater`, `stackable`, and `tool` components.

## Usage example
```lua
local inst = SpawnPrefab("wortox_nabbag")
inst.components.equippable:Equip(player)
-- The Nabbag automatically updates damage, visuals, and VFX when the owner's inventory changes
```

## Dependencies & tags
**Components used:** `equippable`, `inventory`, `inventoryitem`, `weapon`, `stackable`, `rider`, `skilltreeupdater`, `tool`, `finiteuses`, `fuel`, `inspectable`
**Tags:** Adds `nabbag` and `weapon` to the main item instance; `FX` to visual VFX entities; `CLASSIFIED` to `body_fx`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `nabbag_size` | string | `"_empty"` | Current size bucket (`"_empty"`, `"_medium"`, or `"_full"`), determines visual representation and damage scaling factor. |
| `wortox_nabbag_body` | EntityRef | `nil` | Reference to the attached body entity (`wortox_nabbag_body`) when equipped. |
| `bodysize_netvar` | net_tinybyte | N/A | Network variable storing bucket index (0, 1, 2) for the body size; synchronized to clients. |
| `bodyvfx_souls` | net_tinybyte | N/A | Network variable indicating soul-based VFX level (0–3). |

## Main functions
### `UpdateStats(inst, percent, souls)`
*   **Description:** Recalculates and applies damage, size bucket, and VFX based on inventory usage (`percent`) and soul count (`souls`). Updates weapon damage, item image name, and body entity properties.
*   **Parameters:** 
    * `percent` (number) – Ratio of inventory slots filled (0–1).
    * `souls` (number) – Total soul count from stacks and soul jars.
*   **Returns:** Nothing.
*   **Error states:** If `inst.wortox_nabbag_body` exists, it synchronizes `bodysize_netvar` and `bodyvfx_souls`; updates its animation and visibility.

### `OnInventoryStateChanged_Internal(inst, owner)`
*   **Description:** Computes total soul count and inventory usage from the owner's inventory, then triggers `UpdateStats`.
*   **Parameters:** 
    * `owner` (Entity) – The player equipped with the Nabbag.
*   **Returns:** Nothing.
*   **Error states:** If `owner.components.inventory` is missing, sets stats to empty state (`percent=0`, `souls=0`).

### `ToggleOverrideSymbols(inst, owner)`
*   **Description:** Controls whether the Nabbag body entity is hidden or shown based on owner's state graph (`nodangle` or riding with non-forced angle). Updates the `swap_object` symbol override on the owner.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnEquip(inst, owner)`
*   **Description:** Initializes the Nabbag for use when equipped: spawns and parents the `wortox_nabbag_body`, sets animation states, and registers inventory change event listeners (`itemget`, `itemlose`, `stacksizechange`, `newactiveitem`, `ms_souljar_count_changed`).
*   **Parameters:** 
    * `owner` (Entity) – The equipped player.
*   **Returns:** Nothing.

### `OnUnequip(inst, owner)`
*   **Description:** Cleans up when unequipped: removes the `wortox_nabbag_body`, resets owner animations, and unregisters event listeners.
*   **Parameters:** 
    * `owner` (Entity) – The unequipped player.
*   **Returns:** Nothing.

### `UpdateBodySize(inst)`
*   **Description (on `wortox_nabbag_body`):** Reloads the body entity's animation to match the current size bucket stored in `bodysize_netvar`.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** 
    * `onremove` (on `wortox_nabbag_body` instance) – clears `wortox_nabbag_body` reference.
    * `itemget`, `itemlose`, `stacksizechange`, `newactiveitem`, `ms_souljar_count_changed` (on owner) – triggers `UpdateStats`.
    * `newstate` (on owner) – calls `ToggleOverrideSymbols`.
    * `sizedirty` (client-side on `wortox_nabbag_body`) – triggers `OnSizeDirty_body`.
- **Pushes:** None directly (uses owner's event system and network updates).