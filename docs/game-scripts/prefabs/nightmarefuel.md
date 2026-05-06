---
id: nightmarefuel
title: Nightmarefuel
description: Defines the nightmarefuel prefab, a stackable inventory item used as fuel and repair material with shadow socket compatibility.
tags: [item, fuel, crafting]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 2998e45a
system_scope: inventory
---

# Nightmarefuel

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`nightmarefuel` is a stackable inventory item prefab that serves multiple purposes in Don't Starve Together. It functions as high-tier fuel for structures requiring nightmare fuel, a repair material for specific items, and can be socketed into shadow socket equipment. The prefab includes server-side component initialization with client-side optimization tags for waterproofer functionality.

## Usage example
```lua
-- Spawn nightmarefuel in the world
local inst = SpawnPrefab("nightmarefuel")

-- Access components after spawn
inst.components.stackable.maxsize = TUNING.STACK_SIZE_SMALLITEM
inst.components.fuel.fueltype = FUELTYPE.NIGHTMARE
inst.components.fuel.fuelvalue = TUNING.LARGE_FUEL

-- Check socket quality
inst.components.socketable:SetSocketQuality(SOCKETQUALITY.LOW)
```

## Dependencies & tags
**External dependencies:**
- `prefabs/wx78_common` -- provides MakeItemSocketable for WX78 character compatibility

**Components used:**
- `stackable` -- enables stacking with maxsize set to STACK_SIZE_SMALLITEM
- `inspectable` -- allows player inspection of the item
- `fuel` -- provides fuel functionality with NIGHTMARE fueltype
- `repairer` -- enables item repair with NIGHTMARE material type
- `waterproofer` -- set to 0 effectiveness, tagged for optimization
- `inventoryitem` -- enables inventory storage and pickup
- `socketable` -- allows socketing into shadow socket equipment

**Tags:**
- `waterproofer` -- added for client-side optimization

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| None | | | No class-level properties defined. Component configurations set in `fn()`: `stackable.maxsize`, `fuel.fueltype`, `fuel.fuelvalue`, `repairer.repairmaterial`, `repairer.finiteusesrepairvalue`, `waterproofer.effectiveness`, `socketable.socketquality`. |

## Main functions
### `fn()`
* **Description:** Constructor function that creates the nightmarefuel entity instance. Adds all components, sets up animations, and configures server-side logic. Returns the entity instance.
* **Parameters:** None
* **Returns:** Entity instance (`inst`)
* **Error states:** None

## Events & listeners
None identified.