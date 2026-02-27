---
id: playerinspectable
title: Playerinspectable
description: This component synchronizes player equipment and skill selection data across the network by listening for equip/unequip and skill-related events.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: network
source_hash: f49dfbc1
---

# Playerinspectable

## Overview
The `PlayerInspectable` component ensures that equipment and active skill selection state for a player entity are properly broadcast to clients via the network layer. It does not store persistent state but acts as a bridge between gameplay events (equipping items, activating skills) and network synchronization.

## Dependencies & Tags
- **Component Events Listened To:** `equip`, `unequip`, `onactivateskill_server`, `ondeactivateskill_server`, `onsetskillselection_server`
- **No components added or tags set** by this component itself.
- **Uses external modules:** `equipslotutil` (for `EquipSlot.ToID`)

## Properties
No public properties are initialized in this component. It only holds a reference to the owner instance (`self.inst`) and registers event listeners in the constructor.

## Main Functions

### `OnEquip(inst, data)`
* **Description:** Handles the `equip` event by updating the network-equipped item for the corresponding equipment slot. Uses `EquipSlot.ToID` to convert the slot enum to an ID and sends the item’s prefab name (or override/skin name if provided).
* **Parameters:**
  - `inst`: The entity (player) that equipped an item.
  - `data`: Table containing:
    - `data.eslot`: Equipment slot (enum).
    - `data.item`: The equipped item instance, expected to have `GetSkinName()` and/or `playerinspectable_override` or `prefab`.

### `OnUnequip(inst, data)`
* **Description:** Handles the `unequip` event by clearing the network representation of the equipped item in the specified slot.
* **Parameters:**
  - `inst`: The entity (player) that unequipped an item.
  - `data`: Table containing:
    - `data.eslot`: Equipment slot (enum).

### `OnSkillSelectionUpdated(inst, data)`
* **Description:** Broadcasts the current player skill selection to clients via the network when skill activation/deactivation or explicit setting occurs. Returns early if `skilltreeupdater` component is absent.
* **Parameters:**
  - `inst`: The player entity.
  - `data`: Event data (unused in function body).

## Events & Listeners
- Listens to `"equip"` → triggers `OnEquip`
- Listens to `"unequip"` → triggers `OnUnequip`
- Listens to `"onactivateskill_server"` → triggers `OnSkillSelectionUpdated`
- Listens to `"ondeactivateskill_server"` → triggers `OnSkillSelectionUpdated`
- Listens to `"onsetskillselection_server"` → triggers `OnSkillSelectionUpdated`