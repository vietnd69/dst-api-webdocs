---
id: blackflag
title: Blackflag
description: A small, stackable, floating inventory item that serves as cattoy fuel with burnable properties and tradability.
tags: [inventory, crafting, environment]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b3284bbe
system_scope: inventory
---

# Blackflag

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `blackflag` is a lightweight, stackable inventory item prefabricated for use as fuel (e.g., in campfires or other fuel-consuming entities) and as a cattoy. It is designed to float on water, be inspectable, tradable, and burnable, with built-in networking support for server synchronization. It is not a standalone component—this documentation reflects the entity and its attached components via thePrefab definition.

## Usage example
```lua
-- Typical usage in modding: spawning or referencing the item
local item = SpawnPrefab("blackflag")
if item and item.components.stackable then
    item.components.stackable:SetStackSize(5)
end
```

## Dependencies & tags
**Components used:** `inventoryitem`, `stackable`, `inspectable`, `tradable`, `fuel`
**Tags:** Adds `cattoy`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fuelvalue` | number | `TUNING.SMALL_FUEL` | Fuel amount provided when burned. |
| `maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size. |

## Main functions
None — this is a prefab definition, not a component with custom methods. Functional behavior is provided via standard components (`fuel`, `stackable`, etc.), and is inherited from their APIs as referenced.

## Events & listeners
None identified in this file.

## Notes
- The entity is built using common helpers: `MakeInventoryPhysics`, `MakeInventoryFloatable`, `MakeSmallBurnable`, `MakeSmallPropagator`, and `MakeHauntableLaunchAndIgnite`.
- The animation bank and build are both `"blackflag"` with an `"idle"` animation loop.
- On non-master clients, only transform, animstate, network, and floatable properties are initialized—logic (components) is master-only.