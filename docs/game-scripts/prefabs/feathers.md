---
id: feathers
title: Feathers
description: Prefab factory that generates bird feather items with inventory, fuel, and interaction properties for gameplay integration.
tags: [inventory, crafting, collectible]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d4f8ab3d
system_scope: inventory
---

# Feathers

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`feathers.lua` defines a factory function `makefeather(name)` that creates reusable feather item prefabs (crow, robin, robin_winter, canary). Each feather is a lightweight collectible item with animation, physics, and game mechanics support including stacking, flammability, fuel value, tradability, and usability as a cat toy or snowman decoration. It is part of the game's item system and integrates with multiple core components for gameplay interactions.

## Usage example
```lua
-- The prefabs are automatically registered by returning them from the file:
return makefeather("crow"),
    makefeather("robin"),
    makefeather("robin_winter"),
    makefeather("canary")

-- In mod code, spawn a specific feather instance via:
local feather = SpawnPrefab("feather_crow")
feather.components.stackable:SetStackSize(5)
feather.components.fuel.fuelvalue = TUNING.TINY_FUEL
```

## Dependencies & tags
**Components used:** `stackable`, `inspectable`, `fuel`, `inventoryitem`, `tradable`, `snowmandecor`  
**Tags added:** `cattoy`, `birdfeather`  
**Components referenced via helpers:** `MakeInventoryPhysics`, `MakeInventoryFloatable`, `MakeSmallBurnable`, `MakeSmallPropagator`, `MakeHauntableLaunchAndIgnite`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fuelvalue` (from `fuel` component) | number | `TUNING.TINY_FUEL` | Fuel value contributed when burned in a fire. |
| `nobounce` (from `inventoryitem` component) | boolean | `true` | Prevents item from bouncing when dropped. |
| `maxsize` (from `stackable` component) | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size allowed for the item. |

## Main functions
### `makefeather(name)`
*   **Description:** Factory function that constructs and returns a Prefab for a specific feather type. The name suffix determines the asset bank and build name (e.g., `"crow"` → `"feather_crow"`).
*   **Parameters:** `name` (string) — identifier used to construct asset paths and tag the item.
*   **Returns:** Prefab — a reusable template used to instantiate the feather entity.
*   **Error states:** None.

## Events & listeners
None identified.