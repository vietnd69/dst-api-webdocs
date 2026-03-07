---
id: glommerfuel
title: Glommerfuel
description: A multipurpose item component that functions as fuel, fertilizer, and consumable food in DST, with research support and deployable fertilizer capabilities.
tags: [fuel, fertilizer, food, research, deployable]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: aa5390e9
system_scope: inventory
---

# Glommerfuel

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`glommerfuel.lua` defines thePrefab `glommerfuel`, an item that serves as fuel, fertilizer, and consumable food. It integrates with multiple subsystems: `fuel` (for lighting torches/lights), `fertilizer` (for farming), `edible` (for consumption), and `fertilizerresearchable` (for research tables). The item is also made deployable, hauntable, and buoyant for water traversal.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("fertilizer")
inst:AddComponent("fuel")
inst:AddComponent("edible")
-- Then configure properties as done in the glommerfuel prefab:
-- inst.components.fuel.fuelvalue = TUNING.LARGE_FUEL
-- inst.components.fertilizer.fertilizervalue = TUNING.GLOMMERFUEL_FERTILIZE
-- inst.components.fertilizer:SetNutrients(FERTILIZER_DEFS.glommerfuel.nutrients)
-- inst.components.edible.healthvalue = TUNING.HEALING_LARGE
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `stackable`, `fertilizerresearchable`, `fuel`, `fertilizer`, `edible`, `deployablefertilizer`, `hauntablelaunch`, `smallburnable`, `smallpropagator`, `animstate`, `transform`, `network`.

**Tags:** Adds `fertilizerresearchable`.

## Properties
No public properties are defined directly on `glommerfuel` itself. All modifications occur by configuring attached component properties in the constructor.

## Main functions
### `GetFertilizerKey(inst)`
*   **Description:** Returns the unique key used to identify this item in fertilizer research, typically the prefab name.
*   **Parameters:** `inst` (entity) - the instance whose key is returned.
*   **Returns:** string — the `inst.prefab` value (`"glommerfuel"`).
*   **Error states:** None.

### `fertilizerresearchfn(inst)`
*   **Description:** Research function callback used by `fertilizerresearchable` to fetch the research key for this item.
*   **Parameters:** `inst` (entity) - the fertilizer instance.
*   **Returns:** string — the result of `inst:GetFertilizerKey()`.

## Events & listeners
None identified.