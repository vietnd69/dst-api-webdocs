---
id: beefalowool
title: Beefalowool
description: Defines the beefalo wool inventory item prefab with burning, stacking, and trading capabilities.
tags: [inventory, item, fuel, prefab]
sidebar_position: 10

last_updated: 2026-03-20
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 37489508
system_scope: inventory
---

# Beefalowool

> Based on game build **714014** | Last updated: 2026-03-20

## Overview
The `beefalowool` prefab defines the Beefalo Wool entity found in Don't Starve Together. It configures the entity as an inventory item that can be stacked, traded, and used as fuel. The prefab attaches standard components to handle inspection, inventory management, and combustion properties. It is typically spawned via the prefab system rather than instantiated directly by modders.

## Usage example
```lua
-- Spawn the beefalo wool prefab
local inst = SpawnPrefab("beefalowool")

-- Access component properties
local fuel_value = inst.components.fuel.fuelvalue
local max_stack = inst.components.stackable.maxsize

-- Add to player inventory
if ThePlayer then
    ThePlayer.components.inventory:GiveItem(inst)
end
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `stackable`, `tradable`, `fuel`
**Tags:** Adds `cattoy`

## Properties
The following properties are configured on the entity's components during instantiation.

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `components.fuel.fuelvalue` | number | `TUNING.MED_FUEL` | Amount of fuel provided when burned in a fire pit. |
| `components.stackable.maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum number of items allowed in a single stack. |

## Main functions
None identified. This prefab does not expose custom methods on the entity or component tables. Interaction is handled through standard component APIs (e.g., `inst.components.inventoryitem`).

## Events & listeners
None identified. The prefab does not register custom event listeners or push custom events in its constructor logic.