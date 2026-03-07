---
id: cutgrass
title: Cutgrass
description: A small, renewable grass item that serves as food, fuel, and repair material for entities in DST.
tags: [inventory, consumable, repair, fuel]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 99e526f0
system_scope: inventory
---

# Cutgrass

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`cutgrass` is a Prefab that defines a small, stackable item found in the game world, used as food for herbivores (e.g., beefalo), fuel for fire-based constructs (e.g., lightning rod), and a repair material for certain structures. It integrates with multiple core systems: `inventory`, `edible`, `fuel`, `repairer`, and utility systems like `snowmandecor`. It is pristined and network-aware, with a client-side-only early return to avoid duplicating work on non-master instances.

## Usage example
```lua
local cutgrass = SpawnPrefab("cutgrass")
cutgrass.components.stackable:SetSize(5)
cutgrass.components.edible:Eat()
cutgrass.components.fuel:StartBurn()
cutgrass.components.repairer:RepairEntity(target_structure)
```

## Dependencies & tags
**Components used:** `inventoryitem`, `stackable`, `edible`, `inspectable`, `tradable`, `fuel`, `repairer`, `snowmandecor`, and utility functions: `MakeInventoryPhysics`, `MakeInventoryFloatable`, `MakeSmallBurnable`, `MakeSmallPropagator`, `MakeHauntableLaunchAndIgnite`.  
**Tags:** `cattoy`, `renewable`, `cutgrass`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `animstate.bank` | string | `"cutgrass"` | Animation bank name used by the `AnimState` component. |
| `animstate.build` | string | `"cutgrass"` | Build/model name used by the `AnimState` component. |
| `pickupsound` | string | `"vegetation_grassy"` | Sound name played when the item is picked up. |
| `components.stackable.maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size for the item. |
| `components.edible.foodtype` | FOODTYPE | `FOODTYPE.ROUGHAGE` | Food classification for the edible behavior. |
| `components.edible.healthvalue` | number | `TUNING.HEALING_TINY` | Health restored when consumed. |
| `components.edible.hungervalue` | number | `TUNING.CALORIES_TINY/2` | Hunger restored when consumed. |
| `components.fuel.fuelvalue` | number | `TUNING.SMALL_FUEL` | Fuel units provided when burned. |
| `components.repairer.healthrepairvalue` | number | `TUNING.REPAIR_CUTGRASS_HEALTH` | Health repaired per use. |
| `components.repairer.repairmaterial` | MATERIALS | `MATERIALS.HAY` | Material type used in repair UI and compatibility checks. |

## Main functions
No custom methods are defined in `cutgrass.lua`. All functionality is exposed via attached component APIs.

## Events & listeners
No direct event listeners or events are pushed by this prefab. It relies on its components to emit and respond to events internally.

Notable external events triggered *by consumers* of this prefab (e.g., when eaten, burned, or used in repair) follow standard component behavior:
- `edible` component may emit `oneat` and `healthdelta` events.
- `fuel` component emits `onignite`, `onburn`, and `onextinguish`.
- `repairer` component emits `onrepair` when repair is performed.
(See `components/edible.lua`, `fuel.lua`, `repairer.lua` for full event lists.)