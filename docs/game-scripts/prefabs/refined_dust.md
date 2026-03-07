---
id: refined_dust
title: Refined Dust
description: A small consumable elemental item that provides minimal hunger restoration and can be traded to rock-based entities.
tags: [consumable, trade, elemental, smallitem, bait]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 2f17a7a2
system_scope: inventory
---

# Refined Dust

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`refined_dust` is a lightweight, elemental consumable item. It functions primarily as low-tier food (restoring minimal hunger) and can be used as bait or traded (e.g., to Rockity). The prefab combines several utility components (`edible`, `tradable`, `stackable`, `inventoryitem`, `bait`) and supports being launched and smashed via Hauntables. It is intended for crafting, trading, or minimal sustenance.

## Usage example
```lua
local inst = Prefab("refined_dust")
inst:AddComponent("edible")
inst.components.edible.foodtype = FOODTYPE.ELEMENTAL
inst.components.edible.hungervalue = 1
inst:AddComponent("tradable")
inst.components.tradable.rocktribute = 1
inst:AddComponent("stackable")
inst.components.stackable.maxsize = TUNING.STACK_SIZE_SMALLITEM
```

## Dependencies & tags
**Components used:** `edible`, `tradable`, `stackable`, `inventoryitem`, `bait`, `inspectable`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `foodtype` | `FOODTYPE` enum | `FOODTYPE.ELEMENTAL` | Category of food, used by some systems for food compatibility checks. |
| `hungervalue` | number | `1` | Amount of hunger restored when consumed. |
| `maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size. |
| `rocktribute` | number | `1` | Amount of tribute paid to Rockity when traded. |
| `sinks` | boolean | `true` | Whether the item sinks in water when dropped. |

## Main functions
### `MakeInventoryPhysics(inst)`
*   **Description:** Sets up basic physics (e.g., gravity, collision) for an inventory item. Typically called internally during prefab creation.
*   **Parameters:** `inst` (Entity) — the entity instance to configure.
*   **Returns:** Nothing.

### `MakeHauntableLaunchAndSmash(inst)`
*   **Description:** Configures the entity to be affected by Hauntable launch mechanics (pushed by Hauntable projectiles) and to be destroyable by smashing.
*   **Parameters:** `inst` (Entity) — the entity instance to configure.
*   **Returns:** Nothing.

### `inst.components.inventoryitem:SetSinks(true)`
*   **Description:** Enables sinking behavior — the item will sink instead of float on water.
*   **Parameters:** `should_sink` (boolean) — if `true`, the item sinks when dropped in water.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.