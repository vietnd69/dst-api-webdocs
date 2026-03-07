---
id: lightbulb
title: Lightbulb
description: A multipurpose item that emits light, can be used as fuel or food, and mutates into a lightflier during Halloween events.
tags: [inventory, lighting, consumption, event]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1a3d977f
system_scope: inventory
---

# Lightbulb

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `lightbulb` prefab is an interactive item that functions as a portable light source, stackable inventory object, fuel, and consumable food. It integrates with multiple systems including lighting, fuel, edible, perishable, and Halloween event handling. It is pristined on creation and adds networked replication via `AddNetwork()`. Its behavior changes based on inventory state: light is disabled when held and enabled when dropped.

## Usage example
```lua
local inst = SpawnPrefab("lightbulb")
inst.components.inventoryitem:PushToInventory(player)
-- When dropped by player, light automatically re-enables
inst.components.fuel.fuelvalue = TUNING.LARGE_FUEL  -- adjust fuel value if needed
```

## Dependencies & tags
**Components used:** `stackable`, `tradable`, `vasedecoration`, `inspectable`, `fuel`, `edible`, `perishable`, `inventoryitem`, `halloweenmoonmutable`  
**Tags added:** `lightbattery`, `vasedecoration`, `light`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `pickupsound` | string | `"vegetation_firm"` | Sound played when picked up. |
| `Light` | Light component | N/A | Light emission settings (falloff, intensity, radius, colour, enabled state). |
| `stackable.maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size. |
| `fuel.fuelvalue` | number | `TUNING.MED_LARGE_FUEL` | Amount of fuel this item provides. |
| `fuel.fueltype` | FUELTYPE | `FUELTYPE.CAVE` | Fuel category used for matching against fuel sources. |
| `edible.healthvalue` | number | `TUNING.HEALING_TINY` | Health restored on consumption. |
| `edible.hungervalue` | number | `0` | Hunger restored on consumption. |
| `edible.foodtype` | FOODTYPE | `FOODTYPE.VEGGIE` | Food classification for gameplay interactions. |
| `perishable.perishtime` | number | `TUNING.PERISH_FAST` | Time until the item perishes. |
| `perishable.onperishreplacement` | string | `"spoiled_food"` | Prefab name to spawn on decay completion. |

## Main functions
This prefab does not define custom component methods; all functionality comes from attached components. Key configuration methods used during initialization include:

### `inst.components.inventoryitem:SetOnDroppedFn(fn)`
* **Description:** Assigns a callback that runs when the item is dropped from inventory.
* **Parameters:** `fn` (function) — function taking `inst` as argument.
* **Returns:** Nothing.

### `inst.components.inventoryitem:SetOnPutInInventoryFn(fn)`
* **Description:** Assigns a callback that runs when the item is placed into an inventory.
* **Parameters:** `fn` (function) — function taking `inst` as argument.
* **Returns:** Nothing.

### `inst.components.perishable:SetPerishTime(time)`
* **Description:** Sets the total time before the item perishes; initializes remaining time and restarts perishing task if active.
* **Parameters:** `time` (number) — perish duration in seconds.
* **Returns:** Nothing.

### `inst.components.perishable:StartPerishing()`
* **Description:** Starts the periodic task that tracks and decrements perish time.
* **Parameters:** None.
* **Returns:** Nothing.

### `inst.components.halloweenmoonmutable:SetPrefabMutated(prefab)`
* **Description:** Configures the prefab that replaces this item when mutated by the Halloween Moon.
* **Parameters:** `prefab` (string) — prefab name to use on mutation (`"lightflier"` for this item).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None explicitly (event handling is delegated to components like `inventoryitem`, `perishable`, and `halloweenmoonmutable`).
- **Pushes:** None directly (event emission is handled by attached components during lifecycle events).