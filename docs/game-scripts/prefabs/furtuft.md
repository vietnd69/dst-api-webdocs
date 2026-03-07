---
id: furtuft
title: Furtuft
description: A consumable/loot item that disappears over time when dropped on the ground but stops decaying when placed in an inventory slot.
tags: [dropped, decay, inventory, fuel]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 5a4afa48
system_scope: entity
---

# Furtuft

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`furtuft` is a small, single-use item prefab that behaves as a portable fuel source and igniter, with built-in time-based decay. When dropped on the ground, it begins disappearing after a short delay using the `disappears` component. If picked up and placed into an inventory, the disappearance is halted until it is dropped again. It supports stacking, fuel usage, and basic burning mechanics (ignition and burn duration). This prefab is typically used as crafting material, bait, or temporary fuel in the world.

## Usage example
```lua
local inst = SpawnPrefab("furtuft")
if inst then
    -- Set custom fuel value if needed
    inst.components.fuel.fuelvalue = TUNING.MED_FUEL
    -- Manually trigger or delay disappearance
    inst.components.disappears:StopDisappear()
end
```

## Dependencies & tags
**Components used:** `disappears`, `inventoryitem`, `stackable`, `fuel`, `inspectable`, `smallburnable`, `propagator`, `hauntable`
**Tags:** None explicitly added or checked in this prefab’s initialization.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst.components.disappears.sound` | string | `"dontstarve/common/dust_blowaway"` | Sound played during disappearance. |
| `inst.components.disappears.anim` | string | `"disappear"` | Animation played during disappearance. |
| `inst.components.stackable.maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size for the item. |
| `inst.components.fuel.fuelvalue` | number | `TUNING.MED_FUEL` | Fuel value when used in a fire/furnace. |
| `inst.AnimState` | AnimState | `anim/bearger_tuft.zip` | Animation state controller; plays `"idle"` by default. |

## Main functions
### `OnDropped(inst)`
* **Description:** Handler for the `ondropped` event; initiates the disappearance timer for the item.
* **Parameters:** `inst` (Entity) — the entity that was dropped.
* **Returns:** Nothing.
* **Error states:** None — always proceeds if called.

### `OnPutInInventory(inst)`
* **Description:** Handler for when the item is placed into an inventory; stops the disappearance timer.
* **Parameters:** `inst` (Entity) — the entity being placed into inventory.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `ondropped` — triggers `OnDropped`, which calls `disappears:PrepareDisappear()`.
- **Pushes:** None — the prefab does not fire custom events directly.

### Related external behaviors
- `disappears:PrepareDisappear()` — starts the decay timer.
- `disappears:StopDisappear()` — cancels the decay timer (called by `OnPutInInventory`).
- `inventoryitem:SetOnPutInInventoryFn()` — registers `OnPutInInventory` as the callback for inventory insertion.
- `stackable.maxsize` — limits stack count to small item size.
- `fuel.fuelvalue` — sets burn duration when used as fuel.