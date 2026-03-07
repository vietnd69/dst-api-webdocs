---
id: carpentry_blades
title: Carpentry Blades
description: Creates a moonglass carpentry blade prefab used as an ingredient in crafting recipes at the carpentry station.
tags: [crafting, inventory, prefab]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b63fac90
system_scope: crafting
---

# Carpentry Blades

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `carpentry_blades.lua` file defines a factory function `MakeBlade` that generates prefabs for carpentry station blade components — specifically, the moonglass blade in the current usage. These prefabs are in-game items used as intermediate materials in advanced carpentry station crafting recipes. The function constructs an entity with standard inventory and animation properties, registers it with the scrapbook via dependencies, and integrates it with the game’s inventory and hauntable systems.

## Usage example
```lua
local moonglassBlade = MakeBlade("moonglass", "CARPENTRY_STATION_STONE")
-- The returned prefab can be used in crafting recipes or spawned in the world
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `network`, `inventoryitem`, `inspectable`, `hauntable_launch`  
**Tags:** `carpentry_blade`  
**Scrapbook dependencies:** `"carpentry_station"`

## Properties
No public properties.

## Main functions
### `MakeBlade(material, tech_level)`
*   **Description:** Generates and returns a `Prefab` definition for a carpentry blade made of the specified `material`, using the given `tech_level` to determine unlocking requirements and visuals. This function is used internally to define blade prefabs for different materials (e.g., moonglass).
*   **Parameters:**  
    * `material` (string) – Used to construct the prefab name (`carpentry_blade_<material>`) and animation bank/build overrides.  
    * `tech_level` (string) – Key into `TUNING.PROTOTYPER_TREES` that defines which tech tree the blade belongs to (e.g., `CARPENTRY_STATION_STONE`). Must be a valid key.
*   **Returns:** `Prefab` – The prefab definition suitable for use in mod registration or crafting tables.
*   **Error states:** Raises an `assert` error if `TUNING.PROTOTYPER_TREES[tech_level]` is `nil`, indicating an invalid or unsupported `tech_level`.

## Events & listeners
None identified.

## Constants
| Constant | Type | Value | Description |
|----------|------|-------|-------------|
| `SCRAPBOOK_DEPENDENCIES` | table | `{ "carpentry_station" }` | List of dependencies required for the blade to appear in the scrapbook. |
| `BANK_NAME` | string | `"carpentry_blade_moonglass"` | Animation bank name used for default visuals. |

## Network and simulation behavior
- The entity is marked as `pristine` on both server and client.
- The `inventoryitem` component is initialized, and `SetSinks(true)` is called — enabling the item to sink in liquids like water.
- `inspectable` component is added only on the master simulation (`TheWorld.ismastersim`).
- `scrapbook_adddeps` is set on master only, ensuring scrapbook dependencies are registered in multiplayer contexts.

## Implementation notes
- Animation assets are loaded dynamically based on `BANK_NAME`, `material`, and `build_override`.
- On clients, the entity creation function returns early before attaching server-only logic (`scrapbook_adddeps`, `blade_tech_tree`, `build_override`, and component setup).
- The function defaults to returning a moonglass blade when the module is loaded: `return MakeBlade("moonglass", "CARPENTRY_STATION_STONE")`.