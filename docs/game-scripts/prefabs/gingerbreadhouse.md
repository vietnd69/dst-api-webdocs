---
id: gingerbreadhouse
title: Gingerbreadhouse
description: A festive structure that can be hammered to harvest loot, extinguish burning, and potentially spawn special seasonal items like gingerdead pigs.
tags: [structure, loot, seasonal, hammer, event]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 728bff03
system_scope: world
---

# Gingerbreadhouse

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`gingerbreadhouse` is a seasonal, interactive structure prefab used during the Winters' Feast event. It is built using pre-defined animation sets and provides loot when hammered by players. It integrates with the `workable`, `lootdropper`, and `burnable` systems to handle durability, looting behavior, and fire response. The prefab supports networked state for multiplayer sync and includes custom save/load logic to persist its visual configuration.

## Usage example
```lua
-- Example: Spawning and configuring a gingerbread house manually
local house = SpawnPrefab("gingerbreadhouse")
house.Transform:SetPosition(x, y, z)
-- The prefab is self-contained; no additional configuration is required after spawning
```

## Dependencies & tags
**Components used:** `lootdropper`, `workable`, `inspectable`, `burnable`, `propagator`, `fueled`, `inventoryitem`, `heavystoneobstaclephysics` (via `MakeObstaclePhysics` and `MakeSmallBurnable` helpers), and implicitly `animstate`, `transform`, `soundemitter`, `network`.

**Tags:** Adds `structure` to the instance.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `build` | string | `nil` (set at runtime) | The animation build name used for the house's visual variant. |
| `bank` | string | `nil` (set at runtime) | The animation bank name corresponding to the house's visual variant. |
| `scrapbook_bank` | string | `"gingerbread_house2"` | Animation bank used in the scrapbook UI. |
| `scrapbook_build` | string | `"gingerbread_house2"` | Animation build used in the scrapbook UI. |

## Main functions
### `sethousetype(inst, bank, build)`
*   **Description:** Sets the visual variant of the gingerbread house by applying the specified bank and build to its AnimState, or randomly selects one if none are provided. Called during construction and when loading saved data.
*   **Parameters:** 
    *   `inst` (entity) – The house entity instance.
    *   `bank` (string or `nil`) – Optional animation bank name.
    *   `build` (string or `nil`) – Optional animation build name.
*   **Returns:** Nothing.
*   **Error states:** If either `bank` or `build` is `nil`, a random variant is selected.

### `onhammered(inst, worker)`
*   **Description:** Callback triggered when the house is hammered to completion. Extinguishes fire if burning, spawns a small collapse FX, and drops loot (including a chance to spawn a gingerdead pig and wintersfeastfuel). Removes the house entity afterward.
*   **Parameters:** 
    *   `inst` (entity) – The house entity instance.
    *   `worker` (entity) – The entity performing the hammering action.
*   **Returns:** Nothing.
*   **Error states:** If the house has the `burnt` tag, loot is not dropped and the gingerdead pig chance is skipped.

### `onhit(inst, worker)`
*   **Description:** Callback triggered during hammering progress. Plays a short "hit" animation, then returns to idle.
*   **Parameters:** 
    *   `inst` (entity) – The house entity instance.
    *   `worker` (entity) – The entity performing the hammering action.
*   **Returns:** Nothing.
*   **Error states:** If the house has the `burnt` tag, no animation is played.

### `OnSave(inst, data)`
*   **Description:** Save callback to persist the house's visual variant (`build` and `bank`) across game sessions.
*   **Parameters:** 
    *   `inst` (entity) – The house entity instance.
    *   `data` (table) – The save data table to populate.
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Load callback to restore the house's visual variant from saved data.
*   **Parameters:** 
    *   `inst` (entity) – The house entity instance.
    *   `data` (table or `nil`) – The loaded save data.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None explicitly in this file; event callbacks (`onhammered`, `onhit`) are registered via `workable` component APIs, not direct `ListenForEvent` calls.
- **Pushes:** 
    * `entity_droploot` – via `lootdropper:DropLoot()`.
    * `loot_prefab_spawned` – via `lootdropper:SpawnLootPrefab()`.
    * `onextinguish` – indirectly via `burnable:Extinguish()`.
