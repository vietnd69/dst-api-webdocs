---
id: weedplantpage
title: Weedplantpage
description: Renders the UI page for a specific weed plant type, displaying its growth stages, water/nutrient consumption, product, and effects with conditional visibility based on research progress.
tags: [ui, plantregistry, plant, weeds, education]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 641d9497
system_scope: ui
---

# Weedplantpage

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`WeedPlantPage` is a UI widget that displays detailed information for a specific weed plant type in the Plant Registry. It inherits from `PlantPageWidget` and handles rendering dynamic UI elements for plant growth stages, water and nutrient consumption, product output, and effects — all gated by the player’s research progress (via `ThePlantRegistry`). It also manages keyboard/controller focus navigation between UI elements.

## Usage example
```lua
local WeedPlantPage = require "widgets/redux/weedplantpage"

-- Assuming `plantspage` (parent) and `data` (plant-specific data) are defined:
local page = WeedPlantPage(plantspage, {
    plant = "weeds",
    plant_def = prefabs.weeds,
    info = {
        { text = "SEED", bank = "weeds", anim = "seed", grow_anim = "grow" },
        { text = "SAPLING", bank = "weeds", anim = "sapling", grow_anim = "grow" },
        { text = "MATURE", bank = "weeds", anim = "mature", grow_anim = "grow" }
    }
})

-- The widget automatically renders and handles focus.
```

## Dependencies & tags
**Components used:** None (pure UI widget, no entity components).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `known_percent` | number | `ThePlantRegistry:GetPlantPercent(...)` | Current research progress level (0–1) for the plant. |
| `cursor` | Image widget | `nil` | Focus cursor for UI navigation. |
| `plant_name` | Text widget | `nil` | Displays the plant’s name or "MYSTERY_PLANT". |
| `water`, `nutrients`, `product`, `effects` | Text widgets | `nil` | Section headers for respective categories. |
| `water_icons`, `nutrients_icons` | array of Image widgets | `nil` | Icon groups indicating consumption/restoration direction/magnitude. |
| `plant_grid` | array of plant-stage widgets | `{}` | Grid of growth-stage cells showing animation and lock state. |
| `plant_grid_root` | Widget | `nil` | Container for the growth-stage grid. |

## Main functions
### `_DoFocusHookups()`
*   **Description:** Configures directional focus navigation (MOVE_UP/DOWN/LEFT/RIGHT) between plant-grid cells and detail-section elements (nutrients, product, etc.).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `BuildPlantGrid()`
*   **Description:** Dynamically builds and positions the grid of plant growth stages (e.g., seed → sapling → mature), showing locked/unlocked visuals and animating stages based on research progress.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls).
- **Pushes:** None (no `inst:PushEvent` calls).