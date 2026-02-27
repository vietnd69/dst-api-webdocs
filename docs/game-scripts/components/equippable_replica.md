---
id: equippable_replica
title: Equippable Replica
description: Provides networked replica logic for an entity's equip slot assignment, unequip prevention, and restriction checks.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: network
source_hash: 8e4d0899
---

# Equippable Replica

## Overview
This component implements the client-side replica logic for an equippable entity's slot assignment, unequip prevention flag, and equipment restriction behavior. It does not contain gameplay logic itself but synchronizes and exposes replica state needed by the UI and other systems to correctly display and enforce equipment constraints.

## Dependencies & Tags
- Uses `EquipSlot` module (`equipslotutil.lua`)
- Relies on replica fields:
  - `net_tinybyte` or `net_smallbyte` (depending on slot count) for `_equipslot`
  - `net_bool` for `_preventunequipping`
- No component dependencies are declared directly in this file.
- No tags are added or removed by this component.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (passed in) | The entity this replica belongs to. |
| `_equipslot` | `net_var<byte>` | `nil` | Networked variable storing the equip slot ID (converted from `EquipSlot` enum). |
| `_preventunequipping` | `net_var<bool>` | `false` | Networked flag indicating whether the item can be unequipped by the player. |

## Main Functions

### `SetEquipSlot(eslot)`
* **Description:** Sets the equip slot for the item using a human-readable `EquipSlot` enum value, converting it to the internal numeric ID for network synchronization.
* **Parameters:**  
  - `eslot` (`string` or `EquipSlot enum`): The desired equip slot (e.g., `"hands"`, `"head"`, etc.).

### `EquipSlot()`
* **Description:** Returns the currently assigned equip slot as a human-readable `EquipSlot` enum value.
* **Parameters:** None.  
* **Returns:** `string` — The equip slot name (e.g., `"hands"`).

### `IsEquipped()`
* **Description:** Determines if the item is currently equipped on a player. Checks local component state first; if the `equippable` component isn’t present (e.g., on a client), falls back to replica-based checks against the player's inventory.
* **Parameters:** None.  
* **Returns:** `boolean` — `true` if equipped, `false` otherwise.

### `IsRestricted(target)`
* **Description:** Checks whether a given target (typically a player) is allowed to equip this item. Enforces two restriction types:  
  1. Owner-only restriction for linked items (via `linkeditem` component).  
  2. Tag-based restriction (via `inventoryitem` replica’s restricted tag).  
* **Parameters:**  
  - `target` (`Entity`): The entity attempting to equip the item. Must have the `"player"` tag to be evaluated.

### `ShouldPreventUnequipping()`
* **Description:** Returns the current value of the unequip prevention flag.
* **Parameters:** None.  
* **Returns:** `boolean` — `true` if the item cannot be unequipped, `false` otherwise.

### `SetPreventUnequipping(shouldprevent)`
* **Description:** Sets the unequip prevention flag.
* **Parameters:**  
  - `shouldprevent` (`boolean`): Whether to prevent unequipping the item.

## Events & Listeners
None. This component does not register any event listeners or push events.