---
id: tentaclespots
title: Tentaclespots
description: A small fuel item used to power burnable structures and devices in the game.
tags: [fuel, item, environment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 58391ebf
system_scope: environment
---

# Tentaclespots

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `tentaclespots` prefab represents a consumable fuel item (commonly known as "Tentacle Spots") used to ignite and sustain campfires, torches, and other fuel-burning structures. It is implemented as a prefab with attached components for inventory, stackability, and fuel behavior. The component logic resides in the prefab definition itself rather than a standalone component class.

## Usage example
```lua
local inst = SpawnPrefab("tentaclespots")
if inst then
    -- Stack up to 8 items
    inst.components.stackable:SetSize(8)
    -- Provides small fuel value for burning
    print("Fuel value:", inst.components.fuel.fuelvalue)
end
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `stackable`, `fuel`  
**Tags:** None identified.

## Properties
No public properties. The prefab directly modifies component properties after adding them:
- `inst.components.fuel.fuelvalue` is set to `TUNING.SMALL_FUEL`
- `inst.components.stackable.maxsize` is set to `TUNING.STACK_SIZE_SMALLITEM`

## Main functions
None identified. This is a prefab definition; behavior is configured during instantiation.

## Events & listeners
None identified.