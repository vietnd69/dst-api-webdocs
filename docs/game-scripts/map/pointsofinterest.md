---
id: pointsofinterest
title: Pointsofinterest
description: Defines collections of predefined map layouts used as Points of Interest (PoIs) for different world biomes and categories in DST.
tags: [world, map, layout]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: c4b89638
---

# Pointsofinterest

This module serves as a registry for preconfigured static map layouts intended to be used as Points of Interest (PoIs) within the game world. It does not implement a traditional ECS component, but rather returns structured data containing categorized layout definitions. It leverages `StaticLayout.Get()` to load and instantiate layout assets from disk, and organizes them by biome type (e.g., forest, swamp, cave), rarity (e.g., Rare), or other logical groupings (e.g., Winter, Any). These layout collections are typically consumed by world generation logic to place thematic structures or content markers.

## Usage example

```lua
local PointsofInterest = require("map/pointsofinterest")

-- Access all registered layouts by name
local all_layouts = PointsofInterest.Layouts

-- Access biome-specific layouts
local forest_layouts = PointsofInterest.Sandbox[FOREST]

-- Use a layout to place content during worldgen
local layout = all_layouts["skeleton_lumberjack"]
if layout then
    -- Assume some worldgen helper places the layout
    layout:Place(x, y, z)
end
```

## Dependencies & tags
**Components used:** None. This is a data-only module.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `Sandbox` | `table` |见源码| A nested table mapping category keys (e.g., `"Rare"`, `WORLD_TILES.DIRT`) to tables of layout definitions. Used for sandbox-mode and worldgen inclusion logic. |
| `Layouts` | `table` |见源码| A flat table mapping unique layout names (e.g., `"skeleton_wizard_ice"`) to their corresponding `StaticLayout` instances. Provides quick lookup by name across all categories. |

## Main functions
No public functions are exported directly. The module’s purpose is to expose static data tables (`Sandbox` and `Layouts`) constructed at load time. Layouts themselves are created using `StaticLayout.Get()`, whose behavior is defined in `map/static_layout.lua`.

## Events & listeners
This module does not register or fire events. It is a passive data provider.

---