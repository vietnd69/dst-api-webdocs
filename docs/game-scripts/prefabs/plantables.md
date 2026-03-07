---
id: plantables
title: Plantables
description: Generates plantable prefabs that can be placed in the world to spawn full-grown plants, including support for medium spacing, waxed variants, and Halloween moon mutations.
tags: [world, environment, crafting]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 88762974
system_scope: world
---

# Plantables

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`plantables.lua` is a factory module that dynamically generates multiple `prefab` definitions for plantable items (e.g., `dug_berrybush`, `dug_sapling`). Each item functions as a deployable inventory object: when placed via a placer, it spawns the corresponding full plant (e.g., `berrybush`, `sapling`), decrements the stack, and triggers `OnTransplant()` on the new plant if applicable. The module also handles special properties like floating behavior, scrapbook info, fuel value, burnability, and Hauntable compatibility.

It integrates tightly with the `deployable`, `stackable`, `inspectable`, `fuel`, `halloweenmoonmutable`, and `lunarthrall_plantspawner` components.

## Usage example
```lua
-- Example of a plantable prefab data definition (used internally by plantables.lua):
local data = {
    name = "grass",
    build = "grass1",
    mediumspacing = true,
    floater = {"med", 0.1, 0.92},
}
-- The module then produces:
--   Prefab("dug_grass", fn, assets)
--   Placer("dug_grass_placer", ...)
--   Waxed variant via WAXED_PLANTS.CreateDugWaxedPlant(data)
```

## Dependencies & tags
**Components used:** `stackable`, `inspectable`, `inventoryitem`, `fuel`, `deployable`, `halloweenmoonmutable`, `pickable`, `herdmember`, `knownlocations`.  
**Components added:** `stackable`, `inspectable`, `inventoryitem`, `fuel`, `deployable`, and conditionally `halloweenmoonmutable`.  
**Tags:** Adds `deployedplant` to the plantable item itself.

## Properties
No public properties are exposed or stored directly on the module. Each generated prefab instance defines the following internal properties via components:
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `stackable.maxsize` | number | `TUNING.STACK_SIZE_LARGEITEM` | Maximum stack size for the item. |
| `inspectable.nameoverride` | string | `"dug_"..data.name` | Display name used in tooltips. |
| `fuel.fuelvalue` | number | `TUNING.LARGE_FUEL` | Fuel value when burned. |
| `deployable.mode` | `DEPLOYMODE` | `DEPLOYMODE.PLANT` | Deployment mode restriction. |
| `deployable.spacing` | `DEPLOYSPACING` | Default (unless `mediumspacing` is set) | Spacing constraint when placing multiple. |
| `halloweenmoonmutable.prefab_mutated` | string | `nil` | Mutated prefab ID if under Moon influence. |

## Main functions
### `make_plantable(data)`
* **Description:** Constructs and returns a `Prefab` object for a plantable item (e.g., `dug_grass`) based on input data. Defines the `ondeploy` callback that spawns the target plant when placed.
* **Parameters:**  
  `data` (table) — Configuration table containing:  
  - `name` (string): Name of the target plant prefab (e.g., `"grass"`).  
  - `build` (string, optional): Build name for animation.  
  - `bank` (string, optional): Animation bank name (defaults to `name`).  
  - `floater` (table, optional): Floatable parameters: `{type, buoyancy, floatz}`.  
  - `mediumspacing` (boolean, optional): Enables `DEPLOYSPACING.MEDIUM`.  
  - `inspectoverride` (string, optional): Overrides the inspect name.  
  - `halloweenmoonmutable_settings` (table, optional): Contains `prefab` key for moon-mutated form.  
* **Returns:** `Prefab` — The generated plantable prefab definition.
* **Error states:** None.

### `ondeploy(inst, pt, deployer)`
* **Description:** Callback invoked when the plantable item is deployed. Spawns the target plant at the placement point, consumes one stack item, calls `OnTransplant()` on the new plant if it has a `pickable` component, and optionally notifies `lunarthrall_plantspawner` for lunar plants. Plays a planting sound on the deployer.
* **Parameters:**  
  `inst` (Entity) — The plantable item instance being deployed.  
  `pt` (Vector3) — Placement position (from `GetPoint()`).  
  `deployer` (Entity, optional) — The player/entity placing the item.  
* **Returns:** Nothing.
* **Error states:** Does nothing if `SpawnPrefab` fails (returns `nil`). Sound and lunar plant logic safely guarded with `nil` checks.

## Events & listeners
None. This module does not register or fire any DST events (`ListenForEvent` / `PushEvent`). It relies on component lifecycle hooks (`ondeploy`) and placement logic handled by the engine’s placer/deployable system.