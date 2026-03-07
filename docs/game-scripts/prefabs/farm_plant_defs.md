---
id: farm_plant_defs
title: Farm Plant Defs
description: Provides plant definition data used by the farming system to configure growth, moisture, season, nutrient, and other gameplay properties for each crop.
tags: [farming, data, crops]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4e3783ee
system_scope: world
---

# Farm Plant Defs

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`farm_plant_defs.lua` is a data file defining static configuration tables for each farmable plant in the game. These tables (`PLANT_DEFS`) contain metadata used by the farming system to determine growth timelines, moisture requirements, seasonal preferences, nutrient consumption/restoration, killjoy tolerance, weight distribution, sounds, and UI/prefab references. The file is not a component, but rather a shared data dictionary referenced by farming-related prefabs and logic (e.g., plant growth, harvest, and registry systems).

## Usage example
```lua
local PLANT_DEFS = require "prefabs/farm_plant_defs"

-- Access growth time data for tomato
local tomato_def = PLANT_DEFS.tomato
print(tomato_def.grow_time.full) -- e.g., 4 * TUNING.TOTAL_DAY_TIME

-- Get watermelon moisture settings
local water_def = PLANT_DEFS.watermelon
print(water_def.moisture.drink_rate)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `modded = true` to any new entries via metatable `__newindex`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `grow_time` | table | `nil` | Container for germination and growth stage time ranges (seed, sprout, small, med, full, oversized, regrow). |
| `moisture` | table | `nil` | Moisture consumption config (`drink_rate`, `min_percent`). |
| `good_seasons` | table | `nil` | Boolean map of season names (`spring`, `summer`, `autumn`, `winter`) that the plant tolerates. |
| `nutrient_consumption` | table | `{0,0,0}` | Ordered nutrient consumption per stage (typically [N, P, K]). |
| `nutrient_restoration` | table | `{nil,nil,nil}` | Restoration amounts per nutrient stage (computed from consumption). |
| `max_killjoys_tolerance` | number | `TUNING.FARM_PLANT_KILLJOY_TOLERANCE` | Maximum killjoy count the plant can tolerate before growth penalty. |
| `prefab` | string | `"farm_plant_"..veggie` | Prefab name used for the plant entity. |
| `seed` | string | `veggie.."_seeds"` or `"seeds"` (randomseed) | String ID of the seed item required to plant. |
| `plant_type_tag` | string | `"farm_plant_"..veggie` | Tag used internally (e.g., for pollinator stress). |
| `plantregistryinfo` | array of tables | Built-in registry stage definitions | Configuration for UI display of plant growth stages. |
| `plantregistrywidget` | string | `"widgets/redux/farmplantpage"` | Widget path for the plant’s registry UI page. |
| `plantregistrysummarywidget` | string | `"widgets/redux/farmplantsummarywidget"` | Widget path for the plant’s registry summary view. |
| `pictureframeanim` | table | `{anim = "emoteXL_happycheer", time = 0.5}` | Picture-frame animation name and duration for the plant. |
| `sounds` | table | `{}` | Sound paths for grow events (`grow_oversized`, `grow_full`, `grow_rot`). |
| `iscarvable` | boolean | `false` | Marks plants that can be carved (currently only pumpkin). |
| `fireproof` | boolean | `false` | Marks plants unaffected by fire (currently only dragonfruit). |
| `is_randomseed` | boolean | `false` | Marks the random seed placeholder plant type. |

## Main functions
### `MakeGrowTimes(germination_min, germination_max, full_grow_min, full_grow_max)`
* **Description:** Helper function that computes staged growth time ranges and full-grown/oversized/perish durations for a plant. Returns a table of time values for each growth stage.
* **Parameters:**  
  `germination_min` (number) – Minimum germination time (in segments or seconds, typically `12 * TUNING.SEG_TIME`).  
  `germination_max` (number) – Maximum germination time.  
  `full_grow_min` (number) – Minimum full-growth time (will be divided among sprout → small → med stages).  
  `full_grow_max` (number) – Maximum full-growth time.
* **Returns:** Table with keys: `seed` (germination time range), `sprout`, `small`, `med` (stage durations), `full` (full-grown perish duration), `oversized` (oversized perish duration), `regrow` (regrowth time range).
* **Error states:** None.

## Events & listeners
Not applicable.

