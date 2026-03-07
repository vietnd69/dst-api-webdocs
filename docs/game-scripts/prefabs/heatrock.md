---
id: heatrock
title: Heatrock
description: Manages thermal energy storage and emission for the Heat Rock item, dynamically adjusting insulation, heating behavior, visuals, and light intensity based on environmental temperature.
tags: [environment, thermal, inventory, light]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: fb991f54
system_scope: environment
---

# Heatrock

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `heatrock` prefab represents the in-game Heat Rock item, which stores thermal energy and passively heats or cools its surroundings depending on its current temperature relative to the environment. It functions as a thermal buffer: absorbing ambient heat in warm conditions and releasing stored heat when cold (or vice versa for cooling). The behavior is implemented primarily via the `temperature`, `heater`, `fueled`, and `inventoryitem` components. Visual state, lighting, and scrapbook metadata are updated dynamically as temperature changes.

## Usage example
```lua
local inst = Prefab("heatrock", fn)
inst:AddComponent("fueled")
inst:AddComponent("heater")
inst:AddComponent("temperature")
-- TemperatureChange will auto-trigger updates to visuals and heating behavior
inst:PushEvent("temperaturedelta", { hasrate = true })
```

## Dependencies & tags
**Components used:** `fueled`, `heater`, `temperature`, `inventoryitem`, `inspectable`, `tradable`, `light`, `soundemitter`, `animstate`, `transform`, `network`  
**Tags added:** `heatrock`, `icebox_valid`, `bait`, `molebait`, `HASHEATER`, `FX` (for light prefab)  
**Tags checked:** `pocketdimension_container`, `buried`, `INLIMBO` (via `temperature:IgnoreTags`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `currentTempRange` | number | `0` (initialized to 3 on spawn) | Current temperature range index (1–5) corresponding to visual states |
| `highTemp` | number | `nil` | Stores the maximum recorded temperature if the rock reached HOT/HOTTEST states |
| `lowTemp` | number | `nil` | Stores the minimum recorded temperature if the rock reached FROZEN/COLD states |
| `_light` | Entity | `SpawnPrefab("heatrocklight")` | Reference to the attached light entity |
| `_owners` | table | `{}` | Map of owner entities (used for light parent tracking) |
| `scrapbook_fueled_rate` | number | `TUNING.HEATROCK_NUMUSES` | Scrapbook metadata: number of uses per fuel |
| `scrapbook_fueled_uses` | boolean | `true` | Scrapbook metadata: indicates fuel consumption on temperature shifts |

## Main functions
### `GetRangeForTemperature(temp, ambient)`
* **Description:** Calculates which of five temperature bands the rock falls into, based on thresholds `{-30, -10, 10, 30}` relative to ambient.
* **Parameters:** `temp` (number) - current temperature of the rock; `ambient` (number) - current ambient temperature at location.
* **Returns:** `number` — an integer from 1 to 5, where 1 = FROZEN, 2 = COLD, 3 = NEUTRAL, 4 = WARM, 5 = HOT.
* **Error states:** None.

### `HeatFn(inst, observer)`
* **Description:** Computes and sets the rock's thermal exchange behavior (endothermic/exothermic) and returns the effective temperature emitted to the environment.
* **Parameters:** `inst` (Entity) — the heat rock instance; `observer` (Entity, unused) — retained for API compatibility.
* **Returns:** `number` — one of `{ -10, 10, 25, 40, 60 }` corresponding to the five temperature bands.
* **Error states:** None.

### `UpdateImages(inst, range)`
* **Description:** Updates animations, image names, bloom effect, and light enable state based on the current temperature range.
* **Parameters:** `inst` (Entity) — the heat rock instance; `range` (number) — temperature band index (1–5).
* **Returns:** Nothing.
* **Error states:** If `range == 5`, enables bloom and light; otherwise, clears them.

### `TemperatureChange(inst, data)`
* **Description:** Core update handler fired on `temperaturedelta` events. Adjusts light intensity, tracks min/max recorded temperatures, updates visuals, and consumes fuel if temperature shifts cross the NEUTRAL band.
* **Parameters:** `inst` (Entity) — the heat rock instance; `data` (table) — event data, optionally containing `hasrate` boolean.
* **Returns:** Nothing.
* **Error states:** Fuel is consumed only if `hasrate == true` and the temperature crosses into or out of the NEUTRAL band (range == 3) after recording extremes.

## Events & listeners
- **Listens to:** `temperaturedelta` — triggers `TemperatureChange` to recompute heating behavior and visuals.
- **Pushes:** None directly, but interacts via component events:
  - `onfueldsectionchanged`, `imagechange`, `onputininventory`, `ondropped`, `onremoveentity`
- **Subscribed events (via `inst:ListenForEvent`):**
  - `onputininventory`, `ondropped` — handled by `inst._onownerchange` (alias for `OnOwnerChange`) to manage light parenting.