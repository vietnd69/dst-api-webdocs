---
id: armor_snurtleshell
title: Armor Snurtleshell
description: A wearable body armor that grants increased damage absorption when the wearer enters the shell state, and disables absorption upon exiting it.
tags: [combat, armor, equipment, state]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4333f6dc
system_scope: inventory
---

# Armor Snurtleshell

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `armorsnurtleshell` prefab is a wearable body armor item in Don't Starve Together that dynamically adjusts its damage absorption based on the owner's state. When the owner enters the `"shell"` state, absorption increases to full; upon exiting, absorption drops to a lower baseline. It also integrates with other components such as `equippable`, `armor`, `useableitem`, and `inventoryitem` to support equip/unequip logic, usage state management, and achievement tracking.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("inventoryitem")
inst:AddTag("shell")
inst:AddComponent("armor")
inst:AddComponent("equippable")
inst:AddComponent("useableitem")

-- Attach this prefab's logic manually if needed
-- The prefab itself is referenced as "armorsnurtleshell" in prefabs/
```

## Dependencies & tags
**Components used:** `armor`, `equippable`, `useableitem`, `inventoryitem`, `inventory`, `combat`, `inspectable`  
**Tags:** Adds `"shell"` and `"hardarmor"` to the item entity; checks for `"player"`, `"shell"`, and `"INLIMBO"` tags on owner or nearby entities.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `task` | Task or `nil` | `nil` | Timer task used to drop combat targets after 5 seconds of being in shell state. |

## Main functions
### `OnBlocked(owner)`
*   **Description:** Handles the `"blocked"` event; plays the shell armor hit sound.
*   **Parameters:** `owner` (entity) - the entity wearing this armor when a hit is blocked.
*   **Returns:** Nothing.

### `ProtectionLevels(inst, data)`
*   **Description:** Adjusts armor absorption dynamically based on whether the owner is in the `"shell"` state. Sets full absorption in shell state; otherwise reduces to baseline and stops using the item.
*   **Parameters:** `inst` (entity) - this armor item instance; `data` (table) - event data (unused).
*   **Returns:** Nothing.

### `droptargets(inst)`
*   **Description:** Iterates over nearby combat-capable entities and clears their target if they were targeting the armor owner *and* the owner is currently in the `"shell"` state.
*   **Parameters:** `inst` (entity) - this armor item instance.
*   **Returns:** Nothing.
*   **Error states:** Skips if `owner` is `nil` or `owner.sg` is not in `"shell"` state.

### `onuse(inst)`
*   **Description:** Initiates the shell state entry for the owner and schedules a 5-second delay after which combat targets are dropped.
*   **Parameters:** `inst` (entity) - this armor item instance.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `owner` is `nil`.

### `onstopuse(inst)`
*   **Description:** Cancels the pending target-dropping task if the usage is interrupted before completion.
*   **Parameters:** `inst` (entity) - this armor item instance.
*   **Returns:** Nothing.

### `onequip(inst, owner)`
*   **Description:** Called when the armor is equipped. Sets visual override, registers `"blocked"` and `"newstate"` event listeners, and awards the `"snail_armour_set"` achievement if worn together with `slurtlehat`.
*   **Parameters:** `inst` (entity) - this armor item; `owner` (entity) - the entity equipping the armor.
*   **Returns:** Nothing.

### `onunequip(inst, owner)`
*   **Description:** Called when the armor is unequipped. Clears visual override, removes event listeners, and cancels the pending task.
*   **Parameters:** `inst` (entity) - this armor item; `owner` (entity) - the entity unequipping the armor.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"blocked"` on owner — triggers `OnBlocked(owner)`  
  - `"newstate"` on owner — triggers `ProtectionLevels(inst, data)`  
- **Pushes:** None directly (no `inst:PushEvent(...)` calls); achieves side effects by modifying armor component and triggering state changes in owner.