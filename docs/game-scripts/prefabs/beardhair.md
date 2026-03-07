---
id: beardhair
title: Beardhair
description: A small, stackable inventory item that serves as fuel and decorative snowman accessory, commonly used for campfire refueling and seasonal builds.
tags: [inventory, fuel, decoration]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 33f1f45a
system_scope: inventory
---

# Beardhair

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`beardhair` is a lightweight inventory item prefab designed primarily for fueling fires and decorating snowmen. It is stackable, has a modest fuel value, and supports seasonal mechanics such as being ignitable by flamethrowers or hauntable entities. It relies on standard components (`fuel`, `stackable`, `snowmandecor`, `inspectable`, `inventoryitem`) to integrate into DST's core gameplay systems.

## Usage example
```lua
local inst = SpawnPrefab("beardhair")
if inst then
    inst.Transform:SetPosition(x, y, z)
    inst.components.stackable:SetStackSize(5)
    inst.components.fuel:StartRegen()
end
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `stackable`, `fuel`, `snowmandecor`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fuelvalue` | number | `TUNING.MED_FUEL` | Amount of fuel contributed when burned (shared across all fuel items of this tier). |
| `maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size for grouping multiple items in inventory. |

## Main functions
Not applicable — the component logic is handled via component interfaces (`fuel`, `stackable`, etc.) and asset-driven animation/physics setup in the prefab constructor.

## Events & listeners
Not applicable — no event listeners or pushes are defined in this prefab’s constructor.