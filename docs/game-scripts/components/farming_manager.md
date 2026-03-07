---
id: farming_manager
title: Farming Manager
description: Manages soil moisture, nutrients, and farming-related systems across the world map, including plant growth, weed spawning, and Lord Fruit Fly behavior.
tags: [farming, soil, environment, map, weather]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 8c7075a2
system_scope: environment
---

# Farming Manager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Farming_Manager` is a server-only component responsible for simulating and managing soil moisture and nutrient dynamics across the world grid. It supports farming by tracking soil state per tile, calculating moisture depletion and replenishment (via precipitation, temperature, and plant uptake), managing nutrient consumption and restoration during plant growth cycles, and handling weed spawning and Lord Fruit Fly population control. It integrates with `farmsoildrinker`, `undertile`, and `worldsettingstimer` components.

## Usage example
```lua
-- The component is added automatically to TheWorld on the master simulation
-- To manually query soil state on the server:
local fx, fy = 10, 15
local n1, n2, n3 = TheWorld.components.farming_manager:GetTileNutrients(fx, fy)
local is_moist = TheWorld.components.farming_manager:IsSoilMoistAtPoint(fx, fy, 0)
TheWorld.components.farming_manager:AddTileNutrients(fx, fy, 10, 0, 5)
```

## Dependencies & tags
**Components used:** `farmsoildrinker`, `undertile`, `worldsettingstimer`
**Tags:** Adds/Removes `wildfireprotected` on `farmsoildrinker` instances based on soil moisture state; Checks `fruitflyspawner` and `lordfruitfly` tags for spawner logic.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `GEntity` | `nil` | Reference to the owning entity (`TheWorld`), assigned in constructor. |

## Main functions
### `GetTileNutrients(x, y)`
*   **Description:** Returns the current nutrient values (n1, n2, n3) at tile coordinates (x, y). Falls back to default values if no soil overlay exists.
*   **Parameters:**  
    `x` (number) - X coordinate in tile units.  
    `y` (number) - Y coordinate in tile units.  
*   **Returns:** `n1`, `n2`, `n3` (numbers) — nutrient amounts (0–100 each), or 0,0,0 if tile is not farmland.

### `SetTileNutrients(x, y, n1, n2, n3)`
*   **Description:** Sets nutrient values at the specified tile and updates the visual overlay if present.
*   **Parameters:**  
    `x` (number), `y` (number) — tile coordinates.  
    `n1`, `n2`, `n3` (numbers) — new nutrient values (clamped to [0,100] in `AddTileNutrients`, but setter accepts raw values).  
*   **Returns:** Nothing.

### `AddTileNutrients(x, y, nutrient1, nutrient2, nutrient3)`
*   **Description:** Adjusts nutrients by adding deltas and clamping results to [0,100].
*   **Parameters:**  
    `x`, `y` — tile coordinates.  
    `nutrient1`, `nutrient2`, `nutrient3` (numbers) — change amounts (negative allowed).  
*   **Returns:** `true`.

### `CycleNutrientsAtPoint(x, y, z, consume, restore, test_only)`
*   **Description:** Simulates plant nutrient consumption and optional restoration (e.g., post-harvest). Handles rounding and distribution of restored nutrients. If `test_only`, only checks depletion without modifying.
*   **Parameters:**  
    `x`, `y`, `z` (numbers) — world coordinates.  
    `consume` (table or `nil`) — 3-element array of nutrient amounts to consume per type.  
    `restore` (table or `nil`) — 3-element boolean array indicating which nutrients receive restored amount.  
    `test_only` (boolean) — if `true`, only determines whether depletion occurred.  
*   **Returns:** `depleted` (boolean) — whether full consumption was possible. Returns `true` early if no soil overlay exists.

### `GetTileBelowSoil(x, y)`
*   **Description:** Retrieves the underlying tile beneath farming soil using the `undertile` component.
*   **Parameters:**  
    `x`, `y` (numbers) — tile coordinates.  
*   **Returns:** `tile_type` (string or `nil`) — the tile ID beneath the farming soil.

### `AddTileMoistureAtPoint(x, y, z, moisture_delta)`
*   **Description:** Directly modifies soil moisture at a point by a delta amount (e.g., for watering).
*   **Parameters:**  
    `x`, `y`, `z` (numbers) — world coordinates.  
    `moisture_delta` (number) — change in moisture (can be negative).  
*   **Returns:** Nothing. No-op if no soil overlay exists.

### `IsSoilMoistAtPoint(x, y, z)`
*   **Description:** Checks if soil moisture at the point is positive (considering global wetness if grid data is absent).
*   **Parameters:**  
    `x`, `y`, `z` (numbers) — world coordinates.  
*   **Returns:** `boolean` — `true` if soil moisture > 0 or world wetness > 0.

### `LongUpdate(dt)`
*   **Description:** Main simulation loop called each frame (server). Updates soil moisture and weed spawning tasks.
*   **Parameters:**  
    `dt` (number) — time elapsed since last frame.  
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a formatted string of soil moisture, nutrient values, and Lord Fruit Fly timer state for console display.
*   **Parameters:** None.  
*   **Returns:** `string` — debug info string.

### `OnSave()`
*   **Description:** Serializes the state of nutrient and moisture grids, pending weed spawns, and Lord Fruit Fly timer state.
*   **Parameters:** None.  
*   **Returns:** `string` — Base64-encoded, zip-compressed save data.

### `OnLoad(data)`
*   **Description:** Deserializes and restores grid state from save data (supports versions 1 and 2).
*   **Parameters:**  
    `data` (string) — encoded save data.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `onterraform` — updates soil grids when tiles are terraformed.  
  - `ms_registersoildrinker` — registers a `farmsoildrinker` instance for moisture consumption.  
  - `ms_unregistersoildrinker` — unregisters a drinker when removed.  
  - `ms_fruitflyspawneractive` — triggers Lord Fruit Fly spawn logic.  
  - `ms_lordfruitflykilled` — resets spawn timer after kill.  
  - `ms_oncroprotted` — advances spawn timer when crops rot.  
- **Pushes:** None directly; emits events to other components via their public APIs (e.g., `farmsoildrinker:OnSoilMoistureStateChange`).
- **World state watches:** `season` — triggers seasonal weed spawn setup via `OnSeasonChange`.

