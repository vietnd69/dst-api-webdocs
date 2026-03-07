---
id: steelwool
title: Steelwool
description: A small, stackable fuel item that provides moderate burn duration and ignites easily when exposed to fire or heat sources.
tags: [fuel, inventory, ignitable]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9f9b36f9
system_scope: inventory
---

# Steelwool

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`steelwool` is a lightweight inventory item that serves as a highly flammable fuel source. It is designed for quick ignition and moderate fuel yield, making it useful for lighting fires or as kindling. The prefab integrates with the `fuel`, `stackable`, `ignite`, and `burnable` systems via standard DST components and helper functions. It is fully network-replicated and supports both server-side logic and client-side animation/sound playback.

## Usage example
```lua
-- Example: Spawning and using steelwool
local inst = SpawnPrefab("steelwool")
inst.Transform:SetPosition(x, y, z)

-- Ignite via close proximity to fire (handled automatically by MakeSmallBurnable and MakeSmallPropagator)
-- Or manually ignite in a custom context (e.g., via event):
inst.components.fuel:StartLighting(TUNING.MED_BURNTIME)
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `stackable`, `fuel`, and animation/sound utilities (`MakeInventoryPhysics`, `MakeInventoryFloatable`, `MakeSmallBurnable`, `MakeSmallPropagator`, `MakeHauntableLaunchAndIgnite`).  
**Tags:** None explicitly added or removed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fuelvalue` | number | `TUNING.MED_FUEL` | Fuel energy provided when burned. |
| `maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size for this item. |

## Main functions
No custom public methods are defined in `steelwool.lua`. It relies entirely on methods from attached components (`fuel`, `stackable`, etc.) and helper functions (`MakeSmallBurnable`, `MakeSmallPropagator`, `MakeHauntableLaunchAndIgnite`) to implement behavior.

## Events & listeners
This prefab does not define any direct event listeners or events. Event-driven behavior is handled by helper functions and attached components (`fuel`, `burnable`, `hauntable`), which register and react to events internally.