---
id: waterplant_planter
title: Waterplant Planter
description: A stackable inventory item that serves as a specialized fuel source and can be upgraded via the waterplant planter upgrade type.
tags: [inventory, fuel, crafting]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 5aa4e4e4
system_scope: inventory
---

# Waterplant Planter

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `waterplant_planter` prefab is a collectible item representing a planted waterplant. It is designed to function as a medium-sized inventory item with stackable behavior, acting as fuel in campfires and other burnable receptacles. It integrates with the upgrader system to support waterplant-specific upgrades and participates in standard inventory, buoyancy, and burn physics systems.

## Usage example
```lua
local inst = SpawnPrefab("waterplant_planter")
if inst and inst.components then
    inst.components.stackable:SetSize(5) -- sets stack count
    inst.components.fuel.fuelvalue = TUNING.LARGE_FUEL -- confirms fuel capacity
    inst.components.upgrader.upgradetype = UPGRADETYPES.WATERPLANT -- upgrade compatibility
end
```

## Dependencies & tags
**Components used:** `stackable`, `inspectable`, `inventoryitem`, `fuel`, `upgrader`, plus internal helpers: `MakeInventoryPhysics`, `MakeInventoryFloatable`, `MakeMediumBurnable`, `MakeSmallPropagator`, `MakeHauntableLaunchAndIgnite`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scrapbook_specialinfo` | string | `"PLANTABLE_SEASTACK"` | Special tag used for scrapbook/encyclopedia display logic. |
| `fuelvalue` | number | `TUNING.LARGE_FUEL` | Fuel value assigned by the `fuel` component. |
| `maxsize` | number | `TUNING.STACK_SIZE_LARGEITEM` | Maximum stack size; set via the `stackable` component. |
| `upgradetype` | enum | `UPGRADETYPES.WATERPLANT` | Upgrade category handled by the `upgrader` component. |

## Main functions
This prefab does not define custom main functions beyond those provided by its attached components. The core functionality is exposed via:
- `inst.components.stackable:SetSize(n)`
- `inst.components.fuel.fuelvalue`
- `inst.components.upgrader.upgradetype`

No additional public methods are defined directly on the prefab instance.

## Events & listeners
No event listeners or events are defined directly in this prefab file. Event behavior (e.g., burn ignition, hauntable interaction) is handled internally by `MakeMediumBurnable`, `MakeSmallPropagator`, and `MakeHauntableLaunchAndIgnite`, whose specifics are defined in shared utility functions (not included in this source).