---
id: nitre
title: Nitre
description: A small elemental item used as fuel, bait, and food, primarily for attracting moles and fueling campfires.
tags: [fuel, bait, food, inventory, world]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 22b718a1
system_scope: world
---

# Nitre

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`nitre` is a world-level item prefab used as a small elemental resource in DST. It functions as fuel (chemical type), edible food (elemental + nitre subtype), bait for moles, and smashable debris. It is stackable and tradable, and is sinkable in water due to its `inventoryitem` configuration.

## Usage example
```lua
-- Spawn a single Nitre at world coordinates
local item = Prefab("nitre", fn, assets)()
-- Alternatively, via SpawnPrefab
local nitre = SpawnPrefab("nitre")
nitre.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `edible`, `tradable`, `stackable`, `fuel`, `inspectable`, `bait`, `inventoryitem`, `snowmandecor`
**Tags:** Adds `molebait`, `quakedebris`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fuelvalue` | number | `TUNING.MED_LARGE_FUEL` | Fuel energy provided when burned. |
| `fueltype` | FUELTYPE | `FUELTYPE.CHEMICAL` | Type of fuel (chemical). |
| `maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size. |
| `foodtype` | FOODTYPE | `FOODTYPE.ELEMENTAL` | Primary food classification. |
| `secondaryfoodtype` | FOODTYPE | `FOODTYPE.NITRE` | Secondary food classification (for effects). |
| `hungervalue` | number | `2` | Hunger restoration value. |
| `sinks` | boolean | `true` | Whether the item sinks when dropped in water. |

## Main functions
*This prefab does not define any custom functions; functionality is delegated entirely to attached components.*

## Events & listeners
*No event listeners or custom events are defined in this prefab's constructor.*