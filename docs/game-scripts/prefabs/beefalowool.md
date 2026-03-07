---
id: beefalowool
title: Beefalowool
description: A single stackable wool item that functions as fuel, a cat toy, and a burnable item in the DST game.
tags: [inventory, fuel, item, craftable]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 37489508
system_scope: inventory
---

# Beefalowool

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`beefalowool` is a simple item prefab representing wool collected from Beefalo. As an entity, it supports inventory handling, stacking, and burning mechanics. It is added to the world as a lightweight item with visual animation, physics for picking up and dropping, and network synchronization. It is commonly used as crafting fuel, a cat toy (via the `cattoy` tag), and can be ignited or burned.

## Usage example
```lua
local inst = SpawnPrefab("beefalowool")
if inst then
    inst.components.inventoryitem:Equip()
    inst.components.stackable:SetSize(5)
    inst.components.fuel:Ignite()
end
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `stackable`, `tradable`, `fuel`, `burnable`, `propagator`, `hauntable`
**Tags:** `cattoy` (added unconditionally), `ammable`, `burnable`, `fuel` (via `MakeSmallBurnable` and `MakeSmallPropagator`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fuelvalue` | number | `TUNING.MED_FUEL` | Fuel energy value used by the `fuel` component. |
| `maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size for this item. |

## Main functions
### `Fuel:Ignite()`
* **Description:** Ignites the item immediately if it has fuel value and is not already burning. This is a method on the attached `fuel` component.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No effect if the item is not flammable or already burning.

### `Stackable:SetSize(size)`
* **Description:** Updates the current stack size. Used when combining or splitting stacks.
* **Parameters:** `size` (number) — new stack count. Must be between `1` and `maxsize`.
* **Returns:** Nothing.
* **Error states:** silently clamps values outside the valid range.

### `InventoryItem:Equip(slot, child, anim, animname)`
* **Description:** Equips the item (e.g., as a held item or accessory). Note: `beefalowool` is typically unequipable and used only as a resource.
* **Parameters:**
  * `slot` (string) — inventory slot name (e.g., `"right_hand"`).
  * `child` (optional entity) — child entity to attach to.
  * `anim` (optional string) — animation bank.
  * `animname` (optional string) — animation name.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified directly in `beefalowool.lua`.
- **Pushes:** None directly in this file. Event handling is delegated via components like `burnable`, `hauntable`, and `fuel`.