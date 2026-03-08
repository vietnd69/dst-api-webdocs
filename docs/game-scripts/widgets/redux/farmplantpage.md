---
id: farmplantpage
title: Farmplantpage
description: Renders a detailed UI page in the Plant Registry for a specific farm plant, showing unlocked knowledge (seasons, water, nutrients, description), plant stages, and oversized plant imagery.
tags: [ui, registry, plant]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 82fede9f
system_scope: ui
---

# Farmplantpage

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`FarmPlantPage` is a UI widget that displays a single plant's registry information in Don't Starve Together's Plant Registry screen. It extends `PlantPageWidget` and dynamically renders unlocked plant data — including seed/product icons, growth stages, seasons, water/nutrient consumption, and descriptive text — based on the player's current research progress. It also handles oversized plant illustrations when applicable, and implements keyboard/controller focus navigation between interactive UI elements.

## Usage example
```lua
local FarmPlantPage = require "widgets/redux/farmplantpage"
local plantspage = some_plant_registry_parent_widget
local data = {
    plant = "onion",
    info = {
        { bank="farm_plant_onion", anim="grow_1", text="SEEDLING" },
        { bank="farm_plant_onion", anim="grow_2", text="MATURE" }
    },
    plant_def = require("prefabs/farm_plant_defs").PLANT_DEFS.onion
}
local page = FarmPlantPage(plantspage, data)
plantspage:AddChild(page)
```

## Dependencies & tags
**Components used:** `ThePlantRegistry` (global), `TUNING.FARM_PLANT_DRINK_*`, `TUNING.FARM_PLANT_CONSUME_NUTRIENT_*`, `PLANT_DEFS`, `GetSkinModes`, `GetTableSize`, `string.upper`, `ThePlantRegistry:KnowsPlantStage`, `ThePlantRegistry:KnowsPlantName`, `ThePlantRegistry:KnowsSeed`, `ThePlantRegistry:GetPlantPercent`, `ThePlantRegistry:GetOversizedPictureData`, `ThePlantRegistry:HasOversizedPicture`, `ThePlantRegistry:HasOversizedPicture`, `DST_CHARACTERLIST`.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `known_percent` | number | inferred from `ThePlantRegistry:GetPlantPercent` | Current research progress of the plant (0–1), mapping to `LEARN_PERCENTS`. |
| `cursor` | Image | `nil` | Focus cursor image used for UI navigation highlighting. |
| `plant_name` | Text | `nil` | Label widget displaying the plant's name (or "Mystery Plant"). |
| `seed`, `product`, `seasons`, `water`, `nutrients`, `description` | Text | `nil` | Section title labels. |
| `seed_icon`, `product_icon` | Image (backed widget) | `nil` | UI widgets representing the seed and product items. |
| `season_icons`, `water_icons`, `nutrients_icons` | `{Image}` | `nil` | Tables of icon widgets for seasonal suitability, water usage, and nutrient effects. |
| `unknown_*_text` | Text | `nil` | Fallback labels shown when knowledge is locked ("Needs more research"). |
| `description_text` | Text | `nil` | Multi-line description displayed when unlocked. |
| `plant_grid` | `{Widget}` | `{}` | Array of growth-stage UI cells. |
| `plant_grid_root` | Widget | `nil` | Container widget for the plant grid. |
| `picturebg`, `scale`, `player`, `picturefilter` | UI/Image/Puppet | `nil` | Components for oversized plant illustration visuals (only present for supported plants). |

## Main functions
### `FarmPlantPage:_DoFocusHookups()`
*   **Description:** Configures directional focus navigation between interactive elements (seed/product icons, season/nutrient icons, and plant growth stages). This ensures keyboard/controller navigation behaves intuitively in the registry UI.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `FarmPlantPage:BuildPlantGrid()`
*   **Description:** Dynamically generates and positions a horizontal grid of plant growth-stage cells (e.g., seedling, mature), displaying animating plant stages for known growths or locked icons for unknown ones. Calculates per-cell widths based on total entries and layout constraints.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
None.