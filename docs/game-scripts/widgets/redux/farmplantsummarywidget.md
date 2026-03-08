---
id: farmplantsummarywidget
title: Farmplantsummarywidget
description: Renders a visual summary of a farm plant's properties including seed, product, seasons, water requirements, and nutrient effects in the UI.
tags: [ui, farm, plant, redux]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 1983111d
system_scope: ui
---

# Farmplantsummarywidget

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Farmplantsummarywidget` is a UI widget responsible for visually summarizing key growth characteristics of a farm plant. It renders icons for the plant's seed and product, seasonal suitability (autumn, winter, spring, summer), water requirement level (via icon count), and nutrient consumption/restore effects for the three nutrient types. It is typically used in the Quagmire farming UI (e.g., plant registry or customization screens) to provide players with quick visual feedback about plant traits.

## Usage example
```lua
local FarmPlantSummaryWidget = require "widgets/redux/farmplantsummarywidget"

local data = {
    plant_def = {
        seed = "onion",
        product = "tomato",
        good_seasons = { autumn = true, spring = true },
        moisture = { drink_rate = TUNING.FARM_PLANT_DRINK_MED },
        nutrient_consumption = { 1, 0, 2 },
        nutrient_restoration = { 1, 0, 1 },
    },
}

local widget = FarmPlantSummaryWidget(120, data)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds hover text to icons using `SetHoverText`; no game tags are manipulated.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `w` | number | *(parameter)* | Width passed into constructor (not actively used beyond initialization). |
| `data` | table | *(parameter)* | Plant definition data containing `seed`, `product`, `good_seasons`, `moisture`, `nutrient_consumption`, and `nutrient_restoration`. |
| `root` | Widget | `nil` → created | Root child widget container for all UI elements. |
| `seed_icon` | Image | `nil` → created | Icon image for the plant's seed. |
| `product_icon` | Image | `nil` → created | Icon image for the plant's product. |
| `season_seperator` | Image | `nil` → created | Horizontal separator line above seasons. |
| `season_icons` | table of Image | `nil` → created | Array of seasonal icons (e.g., autumn, spring), sorted autumn→winter→spring→summer. |
| `water_seperator` | Image | `nil` → created | Horizontal separator line above water icons. |
| `water_icons` | table of Image | `nil` → created | Array of water-drop icons (1–3 icons depending on `drink_rate`). |
| `nutrients_seperator` | Image | `nil` → created | Horizontal separator line above nutrient icons. |
| `nutrients_icons` | table of table | `nil` → created | Array of tables, each with `nutrient_type` (1–3) and a `modifier` child image indicating effect direction/magnitude. |

## Main functions
This widget is a class constructor (`Class(Widget, ...)`); no explicit public methods beyond standard widget functionality (`:Remove`, inherited layout helpers). All configuration happens during construction.

### `FarmPlantSummaryWidget(w, data)`
*   **Description:** Constructor. Builds the entire widget layout by adding child images and positioning them relative to the root. Renders seed/product icons, seasonal icons with sorted order, water icons based on consumption rate, and nutrient icons with directional indicators.
*   **Parameters:**
    *   `w` (number) — Width hint for the widget (currently unused in layout logic).
    *   `data` (table) — Plant definition data (see `Properties` above).
*   **Returns:** New `FarmPlantSummaryWidget` instance.
*   **Error states:** Assumes `data.plant_def` and all required fields (e.g., `good_seasons`, `moisture.drink_rate`, `nutrient_consumption`, `nutrient_restoration`) exist; undefined behavior if missing.

## Events & listeners
None identified.