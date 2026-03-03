---
id: crop
title: Crop
description: Manages growth, maturation, fertilization, and harvesting logic for plant entities in the game world.
tags: [growth, harvest, farming, plant, lifecycle]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 9f984bba
system_scope: world
---

# Crop

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Crop` component handles the full lifecycle of a plant entity—from planting and growth to maturation, fertilization, and harvesting—or withering under poor conditions. It integrates with time-of-day systems, weather, season, and temperature to determine growth rate, and interacts with other components (`burnable`, `cookable`, `fertilizer`, `grower`, `witherable`, `inventoryitem`) to enable nuanced gameplay mechanics such as cooking, burning, and crop rotation. It is typically attached to plant prefabs like corn, berries, or melons.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("crop")

-- Start growth with a product prefab and growth duration
inst.components.crop:StartGrowing("corn", 300, grower_inst, 0.2)

-- Fertilize the crop
local fertilizer = SpawnPrefab("manure")
inst.components.crop:Fertilize(fertilizer, player)

-- Harvest when mature
if inst.components.crop:IsReadyForHarvest() then
    inst.components.crop:Harvest(player)
end
```

## Dependencies & tags
**Components used:** `burnable`, `cookable`, `fertilizer`, `grower`, `inventoryitem`, `inventoryitemmoisture`, `rainimmunity`, `witherable`, `halloweenmoonmutable`, `light`, `transform`  
**Tags:** Adds/removes `readyforharvest` and `notreadyforharvest`; checks `withered`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `product_prefab` | string or `nil` | `nil` | Prefab name of the item produced upon harvest. |
| `growthpercent` | number | `0` | Current progress toward maturity, clamped to `0–1`. |
| `rate` | number | `1 / 120` | Growth rate multiplier (inverse of total grow time in seconds). |
| `task` | `Task` or `nil` | `nil` | Periodic growth task handle. |
| `matured` | boolean | `false` | Whether the crop has reached maturity. |
| `cantgrowtime` | number | `0` | Accumulated time the crop has been in darkness, leading to withering. |
| `onmatured` | function or `nil` | `nil` | Callback when the crop matures. |
| `onwithered` | function or `nil` | `nil` | Callback when the crop withers. |
| `onharvest` | function or `nil` | `nil` | Callback on harvest. |
| `grower` | `Entity` or `nil` | `nil` | Reference to the `grower` entity that owns this crop (e.g., farm plot). |

## Main functions
### `StartGrowing(product_prefab, grow_time, grower, percent)`
*   **Description:** Initializes and begins the crop’s growth process.
*   **Parameters:**  
    - `product_prefab` (string) — prefab name of the harvested item.  
    - `grow_time` (number) — total time in seconds to mature.  
    - `grower` (entity or `nil`) — optional parent entity (e.g., farm plot) that manages this crop.  
    - `percent` (number, optional) — starting growth progress (`0–1`), defaults to `0`.
*   **Returns:** Nothing.

### `Fertilize(fertilizer, doer)`
*   **Description:** Increases growth progress using a fertilizer item. Stops smoldering if applicable. Does nothing during winter if temperature is `<= 0`.
*   **Parameters:**  
    - `fertilizer` (entity) — entity with the `fertilizer` component.  
    - `doer` (entity or `nil`) — optional entity performing fertilization (used to play sound).
*   **Returns:** `true` if growth was increased, `false` otherwise.

### `DoGrow(dt, nowither)`
*   **Description:** Advances growth by `dt` seconds, considering environmental conditions (light, rain, season, temperature). May trigger withering if exposed to darkness too long.
*   **Parameters:**  
    - `dt` (number) — time delta in seconds.  
    - `nowither` (boolean, optional) — if `true`, skips darkness-induced withering.
*   **Returns:** `true` if growth occurred or changed, `false` if already mature or withered.

### `Mature()`
*   **Description:** Marks the crop as mature and plays the `"grow_pst"` animation. Triggers `onmatured` callback.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Harvest(harvester)`
*   **Description:** Harvests the crop if mature or withered, spawns the product, and handles wetness inheritance and inventory placement. Removes the crop instance.
*   **Parameters:**  
    - `harvester` (entity or `nil`) — entity receiving the product (or `nil` to drop at position).
*   **Returns:**  
    - `true` (boolean)  
    - `product` (entity or `nil`) — spawned product item.

### `MakeWithered()`
*   **Description:** Converts the crop into a withered state (grass-like). Cancels growth task, sets product to `"cutgrass"`, disables growth rate, and prepares for burning.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `IsReadyForHarvest()`
*   **Description:** Checks if the crop has matured.
*   **Parameters:** None.
*   **Returns:** `true` if mature, `false` otherwise.

### `Resume()`
*   **Description:** Resumes the periodic growth task if the crop is not mature or withered. Typically called post-load or when detached from a `grower`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a debug-readable string summarizing the crop’s current state.
*   **Parameters:** None.
*   **Returns:** string — formatted as e.g., `"[corn] 45.00% (done in 30.00) darkwither: 5.00"`.

### `GetWorldGrowthRateMultiplier()`
*   **Description:** Computes environmental growth multiplier based on temperature, rain, and season (e.g., spring bonus).
*   **Parameters:** None.
*   **Returns:** number — multiplier (e.g., `0`, `1`, or `1 + bonus`).

## Events & listeners
- **Listens to:** None explicitly registered in `Crop`; listens implicitly via callbacks like `onmatured`, `onwithered`, `onharvest`.
- **Pushes:** Not applicable.

## Lifecycle events & callbacks
The following optional callbacks may be set via `SetOnXFn()` methods and are invoked internally during game logic:
- `onmatured(inst)` — called when crop becomes mature (`Mature()`).
- `onwithered(inst)` — called when `MakeWithered()` runs.
- `onharvest(inst, product, harvester)` — called during `Harvest()` before item placement.

## Notes
- `DAYLIGHT_SEARCH_RANGE = 30` is a deprecated constant (use `TUNING.DAYLIGHT_SEARCH_RANGE`).
- If the crop belongs to a `grower` (e.g., a farm plot), `Grower:RemoveCrop()` is called during harvest.
- The `withered` tag is checked extensively to prevent growth during bad states.
- During winter (`TheWorld.state.iswinter and TheWorld.state.temperature <= 0`), `Fertilize()` does nothing.
- Growth暂停s at night unless ambient light sources (tagged `daylight` or `lightsource`) are nearby, based on `CANGROW_TAGS` and radius checks.
