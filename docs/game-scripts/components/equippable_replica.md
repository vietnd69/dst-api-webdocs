---
id: equippable_replica
title: Equippable Replica
description: Main component that handles equippable item state and synchronization, operating on both server and client sides.
tags: [network, inventory, replication]
sidebar_position: 10
last_updated: 2026-04-22
build_version: 722832
change_status: stable
category_type: components
source_hash: 48992fd7
system_scope: network
---

# Equippable

> Based on game build **722832** | Last updated: 2026-04-22

## Overview
`Equippable` is the main component that handles equippable item state and synchronization. It uses network variables to synchronize equip slot assignment and unequipping restrictions across the network. This component operates on both server and client, with `IsEquipped()` delegating to the server-side implementation when available, otherwise using client-side logic to determine if an item is currently equipped.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("equippable")

-- Set the equip slot for this item
inst.components.equippable:SetEquipSlot(EQUIPSLOT.HAND)

-- Check if the item is currently equipped
local isEquipped = inst.components.equippable:IsEquipped()

-- Prevent the item from being unequipped
inst.components.equippable:SetPreventUnequipping(true)
```

## Dependencies & tags
**External dependencies:**
- `equipslotutil` -- provides EquipSlot utility functions for slot ID conversion

**Components used:**
- `linkeditem` -- checked in IsRestricted() for owner-based equipment restrictions

**Tags:**
- `player` -- checked in IsRestricted() to validate target is a player
- `possessedbody` -- checked in IsRestricted() as alternative valid target type
- Dynamic restriction tag -- retrieved from inventoryitem and checked against target

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_equipslot` | net_tinybyte or net_smallbyte | `---` | Network variable storing the equip slot ID. Uses tinybyte if slot count `<= 7`, otherwise smallbyte. |
| `_preventunequipping` | net_bool | `---` | Network variable that prevents the item from being unequipped when set to true. |

## Main functions
### `SetEquipSlot(eslot)`
* **Description:** Sets the equip slot for this item using network synchronization. The slot value is converted to an ID via EquipSlot.ToID() before being stored.
* **Parameters:** `eslot` -- equip slot constant from EQUIPSLOT table (e.g., EQUIPSLOT.HAND, EQUIPSLOT.HEAD)
* **Returns:** None
* **Error states:** None

### `EquipSlot()`
* **Description:** Returns the current equip slot for this item by converting the stored network ID back to an equip slot constant.
* **Parameters:** None
* **Returns:** Equip slot constant from EQUIPSLOT table.
* **Error states:** None

### `IsEquipped()`
* **Description:** Determines if this item is currently equipped. On server (when equippable component exists), delegates to server-side component. On client, checks inventoryitem held state and player's equipped item in the same slot.
* **Parameters:** None
* **Returns:** `true` if the item is equipped, `false` otherwise.
* **Error states:** Errors if `ThePlayer` is nil on client when calling `ThePlayer.replica.inventory:GetEquippedItem()` — no nil guard present.

### `IsRestricted(target)`
* **Description:** Checks if this item has equipment restrictions for a given target entity. Returns true if the target cannot equip this item due to linkeditem owner restrictions or inventoryitem restriction tags.
* **Parameters:** `target` -- entity to check restrictions against (typically a player)
* **Returns:** `true` if the item is restricted for the target, `false` if the target can equip it.
* **Error states:** Errors if `target` is nil when calling `target:HasAnyTag()` or `target:HasTag()` — no nil guard present.

### `ShouldPreventUnequipping()`
* **Description:** Returns whether unequipping this item is currently prevented via the network variable.
* **Parameters:** None
* **Returns:** `true` if unequipping is prevented, `false` otherwise.
* **Error states:** None

### `SetPreventUnequipping(shouldprevent)`
* **Description:** Sets the prevent unequipping flag via network synchronization. When true, the item cannot be unequipped through normal means.
* **Parameters:** `shouldprevent` -- boolean value to set the prevention state
* **Returns:** None
* **Error states:** None

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.