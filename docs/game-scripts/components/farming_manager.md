---
id: farming_manager
title: Farming Manager
description: Manages soil nutrient and moisture systems across the world grid for farming gameplay, including plant growth, fertilization, drought effects, and seasonal weed/fruit fly spawning.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 8c7075a2
---

# Farming Manager

## Overview
This component handles the persistent, world-scoped soil system for farming mechanics. It maintains two 2D grids—`nutrientgrid` for soil fertility and `moisturegrid` for soil wetness—updating moisture continuously based on rainfall, temperature, and plant water consumption. Nutrients are updated discretely when plants grow, soil is fertilized, or crops rot. It also manages soil overlay entities, irrigation tags, weed spawning per season, and the Lord Fruit Fly event timer. Only exists on the master simulation.

## Dependencies & Tags
- `inst:AddComponent("health")` — *not present*  
- **Entity tags used internally**:  
  - `"wildfireprotected"` — added to plants when soil moisture > 0 at spawn; removed when soil dries  
  - `"fruitflyspawner"` — used in Lord Fruit Fly spawning logic  
  - `"soil"` — temporary tag during weed placement detection  
- **Dependencies on other components**:  
  - `TheWorld.components.worldsettingstimer` — for Lord Fruit Fly timer  
  - `TheWorld.components.undertile` — to store/restore underlying tile type  
  - `farmsoildrinker` — accessed via plant entity components for moisture consumption rate  

## Properties
No public member variables are exposed as public properties. All state is encapsulated in private module-level variables (`_nutrientgrid`, `_moisturegrid`, `_drinkersgrid`, `_overlaygrid`, `_remaining_weed_spawns`, `_weed_spawning_task`, and timer constants). The only public reference is:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The owning entity (world root) passed to the constructor |

## Main Functions

### `self:_RefreshSoilMoisture(dt)`
* **Description:** Updates soil moisture across all farming tiles based on world precipitation, ambient temperature (drying), and aggregate plant water consumption (from registered `farmsoildrinker` components).Clamps results to `[world_wetness, MAX_SOIL_MOISTURE]`. Calls `SetSoilMoisture` for each tile.
* **Parameters:**  
  `dt` *(number)* — Elapsed time in seconds since last update.

### `self:GetTileNutrients(x, y)`
* **Description:** Returns the current nutrient levels (n1, n2, n3) at tile (x, y). Falls back to tile definition defaults if no soil data exists.
* **Parameters:**  
  `x` *(number)* — Tile X coordinate  
  `y` *(number)* — Tile Y coordinate

### `self:SetTileNutrients(x, y, n1, n2, n3)`
* **Description:** Sets nutrient values at tile (x, y) and updates the overlay entity's visual state.
* **Parameters:**  
  `x` *(number)* — Tile X coordinate  
  `y` *(number)* — Tile Y coordinate  
  `n1`, `n2`, `n3` *(number)* — Nutrient amounts (0–100, clamped by `AddTileNutrients`)

### `self:AddTileNutrients(x, y, nutrient1, nutrient2, nutrient3)`
* **Description:** Adds specified amounts to tile nutrients, clamping each to [0, 100]. Calls `SetTileNutrients` internally.
* **Parameters:**  
  `x`, `y` *(number)* — Tile coordinates  
  `nutrient1`, `nutrient2`, `nutrient3` *(number)* — Delta values to add

### `self:CycleNutrientsAtPoint(_x, _y, _z, consume, restore, test_only)`
* **Description:** Simulates nutrient consumption by a plant (e.g., during growth stage transition), optionally restoring nutrients based on predefined rules (e.g., composting). If `test_only`, only returns whether the tile was depleted (i.e., couldn’t meet full consumption). Returns `true` if soil is now depleted after the operation.
* **Parameters:**  
  `_x`, `_y`, `_z` *(number)* — World position used to derive tile coordinates  
  `consume` *(table|nil)* — Index 1–3 array specifying nutrient amounts to consume  
  `restore` *(table|nil)* — Index 1–3 boolean map indicating which nutrient types get restored  
  `test_only` *(boolean)* — If `true`, only checks feasibility without modifying soil

### `self:LongUpdate(dt)`
* **Description:** Main update loop executed on world ticks. Runs `_RefreshSoilMoisture(dt)` and, if active, `_UpdateWeedSpawning()`.
* **Parameters:**  
  `dt` *(number)* — Delta time in seconds

### `self:_UpdateWeedSpawning()`
* **Description:** Drives seasonal weed spawning based on `_remaining_weed_spawns` queue, triggered during season change. Removes and spawns weeds when their scheduled time is reached.
* **Parameters:** None (uses internal state: `_remaining_weed_spawns`, `_weed_spawning_task`, `inst.state.elapseddaysinseason`)

### `self:GetTileBelowSoil(x, y)`
* **Description:** Retrieves the tile type underneath a farming soil tile (e.g., grass, dirt, mud).
* **Parameters:**  
  `x`, `y` *(number)* — Tile coordinates

### `self:AddSoilMoistureAtPoint(x, y, z, moisture_delta)`
* **Description:** Manually adjusts soil moisture by `moisture_delta` at a world point. Only affects tiles with valid overlay entities (i.e., active farming tiles).
* **Parameters:**  
  `x`, `y`, `z` *(number)* — World coordinates  
  `moisture_delta` *(number)* — Change in moisture (positive = add, negative = remove)

### `self:IsSoilMoistAtPoint(x, y, z)`
* **Description:** Returns whether the soil at the given point is considered moist (either local soil moisture > 0 or world wetness > 0).
* **Parameters:**  
  `x`, `y`, `z` *(number)* — World coordinates

### `self:GetDebugString()`
* **Description:** Returns a debug string with current tile’s moisture, drinker count, nutrients (n1,n2,n3), and Lord Fruit Fly timer state.
* **Parameters:** None

## Events & Listeners
- **Listens to events (via `inst:ListenForEvent` or equivalent):**  
  - `"worldmapsetsize"` → `InitializeDataGrids()` (initializes grids when map dimensions are known)  
  - `"onterraform"` → `OnTerraform()` (handles soil tile creation/destruction and overlay spawner updates)  
  - `"ms_registersoildrinker"` → `OnRegisterSoilDrinker()` (register a plant as a moisture consumer)  
  - `"ms_unregistersoildrinker"` → `OnRemoveSoilDrinker()` (cleanup when plant is removed)  
  - `"ms_fruitflyspawneractive"` → `OnFruitFlySpawnerActive()` (triggers Lord Fruit Fly spawning under specific conditions)  
  - `"ms_lordfruitflykilled"` → restarts fruit fly respawn timer  
  - `"ms_oncroprotted"` → advances fruit fly spawn timer  

- **Pushes events (via `inst:PushEvent`):**  
  - `"ms_fruitflytimerfinished"` — pushed when Lord Fruit Fly spawn timer elapses  

- **World state watch:**  
  - `"season"` → `OnSeasonChange()` — triggers seasonal weed spawning logic