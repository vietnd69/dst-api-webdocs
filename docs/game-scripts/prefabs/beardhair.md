---
id: beardhair
title: Beardhair
description: Defines the beard hair inventory item prefab used for fuel and crafting.
tags: [inventory, fuel, item]
sidebar_position: 10

last_updated: 2026-03-20
build_version: 714014
change_status: stable
category_type: root
source_hash: 33f1f45a
system_scope: inventory
---

# Beardhair

> Based on game build **714014** | Last updated: 2026-03-20

## Overview
`beardhair` is a prefab definition script that constructs the beard hair entity. This entity functions as a stackable inventory item, a fuel source for fires, and a inspectable object. It is networked to ensure state synchronization across clients in multiplayer sessions. The prefab configures standard components to handle physics, burning, and haunting interactions.

## Usage example
```lua
-- Spawn the beardhair prefab into the world
local inst = SpawnPrefab("beardhair")

-- Access configured component properties
local fuel_value = inst.components.fuel.fuelvalue
local max_stack = inst.components.stackable.maxsize

-- Add to player inventory
inst.components.inventoryitem:GiveToPlayer(player)
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `stackable`, `fuel`, `snowmandecor`, `network`
**Tags:** None identified (tags are managed by attached components).

## Properties
The prefab configures specific properties on attached components during initialization.

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `stackable.maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum number of items allowed in a single stack. |
| `fuel.fuelvalue` | number | `TUNING.MED_FUEL` | Amount of fuel time provided when burned. |
| `burnable.time` | number | `TUNING.MED_BURNTIME` | Duration the item burns when ignited. |

## Main functions
Not applicable. This file defines entity construction logic rather than exposing custom methods on the instance. Functionality is provided by standard components attached during initialization.

## Events & listeners
None identified. The prefab does not register custom event listeners or push custom events in its construction logic.