---
id: itemmimic
title: ItemMimic
description: Manages deceptive inventory items that transform into hostile entities when players interact with them in specific ways.
tags: [deception, transformation, inventory]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: components
source_hash: c2c3b4da
system_scope: entity
---

# ItemMimic

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`ItemMimic` attaches to inventory items that disguise themselves as harmless objects until triggered by player interaction. The component monitors various player actions including equipping, attacking, working, and taking damage to determine when the mimic should reveal its true hostile form. It integrates with the inventory, equippable, and sanity systems to create a deceptive gameplay mechanic.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("itemmimic")
inst:AddComponent("inventoryitem")
inst.components.itemmimic:SetNoLoot(true)
-- The mimic will auto-reveal after TUNING.ITEMMIMIC_AUTO_REVEAL_BASE seconds
-- or when a player performs certain actions with it
```

## Dependencies & tags
**Components used:**
- `equippable` -- checks equipslot to determine which owner events to listen for
- `inventoryitem` -- retrieves grand owner via GetGrandOwner() for event routing
- `inventory` -- drops item from owner's inventory on reveal
- `container` -- alternative container check for dropping item on reveal
- `sanity` -- applies sanity drain to target when revealed (via DoDelta)
- `talker` -- displays action fail message to owner before reveal

**Tags:**
- None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | Entity | `nil` | The entity instance that owns this component. |
| `noloot` | boolean | `nil` | When true, the revealed form drops no loot. |
| `_auto_reveal_task` | Task | `nil` | Scheduled task for automatic reveal after timeout. |
| `_on_interacted_with` | Function | `nil` | Callback for machine interaction events. |
| `_on_do_attack` | Function | `nil` | Callback triggered when owner attacks another entity. |
| `_on_do_work` | Function | `nil` | Callback triggered when owner performs work actions. |
| `_on_owner_attacked` | Function | `nil` | Callback triggered when owner is attacked or blocked. |
| `_perform_action_listener` | Function | `nil` | Callback for monitoring owner's performaction events. |

## Main functions
### `TurnEvil(target)`
* **Description:** Transforms the mimic into its revealed hostile form. Drops the item from owner's inventory (if owner has inventory or container component), replaces the prefab with "itemmimic_revealed", startles the target (if target is valid with sg component), and drains sanity by TUNING.SANITY_SMALL (if target has sanity component and game mode allows sanity). Sets noloot flag on revealed form if configured.
* **Parameters:** `target` -- Entity that triggered the reveal (typically a player or mob).
* **Returns:** None
* **Error states:** None

### `SetNoLoot(noloot)`
* **Description:** Sets whether the revealed mimic form should drop loot when destroyed.
* **Parameters:** `noloot` -- Boolean value to enable or disable loot drops.
* **Returns:** None
* **Error states:** None

### `LongUpdate(dt)`
* **Description:** Updates the auto-reveal timer during long update cycles. Cancels and reschedules the reveal task to account for frame time, or triggers reveal if time has expired.
* **Parameters:** `dt` -- Delta time in seconds since last update.
* **Returns:** None
* **Error states:** None

### `OnSave()`
* **Description:** Serializes component state for save games. Includes noloot flag and remaining auto-reveal time if a reveal task is pending.
* **Parameters:** None
* **Returns:** Table containing `add_component_if_missing`, `noloot`, and optionally `reveal_time_remaining`.
* **Error states:** None

### `OnLoad(data)`
* **Description:** Restores component state from saved data. Re-schedules the auto-reveal task with remaining time if present in save data.
* **Parameters:** `data` -- Table containing saved component state from OnSave().
* **Returns:** None
* **Error states:** Errors if `data.reveal_time_remaining` is invalid when passed to `DoTaskInTime`.

### `GetDebugString()`
* **Description:** Returns a debug string showing the status of the auto-reveal timer for console inspection.
* **Parameters:** None
* **Returns:** String describing auto-reveal status and remaining time.
* **Error states:** None

## Events & listeners
- **Listens to:** `machineturnedon` -- triggers interacted_with redirect on self
- **Listens to:** `machineturnedoff` -- triggers interacted_with redirect on self
- **Listens to:** `percentusedchange` -- triggers interacted_with redirect on self
- **Listens to:** `equipped` -- registers owner event listeners based on equip slot
- **Listens to:** `unequipped` -- removes owner event listeners based on equip slot
- **Listens to:** `onputininventory` -- registers performaction listener on owner, schedules auto-reveal
- **Listens to:** `ondropped` -- removes performaction listener from owner
- **Listens to:** `working` (on owner) -- triggers reveal after 5 frames for HANDS slot items
- **Listens to:** `onattackother` (on owner) -- triggers reveal after 5 frames for HANDS slot items
- **Listens to:** `attacked` (on owner) -- triggers reveal after 5 frames for HEAD/BODY slot items
- **Listens to:** `blocked` (on owner) -- triggers reveal after 5 frames for HEAD/BODY slot items
- **Listens to:** `performaction` (on owner) -- triggers reveal on non-acceptable actions
- **Pushes:** `jump` -- fired on revealed entity with target as data
- **Pushes:** `startled` -- fired on target entity when revealed