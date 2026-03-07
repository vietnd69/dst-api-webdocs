---
id: bathbomb
title: Bathbomb
description: A consumable item that provides fuel and can be burned, featuring perishable behavior and inventory compatibility.
tags: [inventory, fuel, perishable, consumable, crafting]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: de1c7bb9
system_scope: inventory
---

# Bathbomb

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`bathbomb` is a prefab definition that creates an inventory item with burnable and tradable properties. It is primarily used as a fuel source in campfires or firepits. The item visually indicates spoilage (via `show_spoilage` tag), floats in water (`MakeInventoryFloatable`), and supports stacking. Although the perishable component is present in comments, it is currently commented out — the active code includes fuel, stackable, inventory, and tradable components, along with basic burnable and propagator behavior.

## Usage example
```lua
-- Example: spawning a bath bomb in the world
local bomb = SpawnPrefab("bathbomb")
bomb.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `fuel`, `inventoryitem`, `stackable`, `tradable`, `inspectable`  
**Tags added:** `show_spoilage`  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fuelvalue` | number | `TUNING.MED_FUEL` | Amount of fuel the bath bomb provides when burned. |
| `maxsize` | number | `TUNING.STACK_SIZE_MEDITEM` | Maximum stack size for this item. |

## Main functions
*Not applicable* — This file is a prefab definition, not a component. It does not define a class with methods; instead, it constructs an entity and attaches components to it.

## Events & listeners
*None identified.*