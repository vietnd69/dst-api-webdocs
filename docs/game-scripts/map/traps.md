---
id: traps
title: Traps
description: Provides static layout mappings for world tile types and sandbox mode trap configurations used in map generation.
tags: [map, generation, world, sandbox]
sidebar_position: 100
last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 1ee21a39
---
# Traps

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `traps.lua` module is a data definition file that organizes static layout assets for map generation purposes in Don't Starve Together. It groups trap layouts (e.g., seasonal or tile-specific configurations) by biome or world type and supports sandbox mode-specific trap presets. This file does not implement a component class, but rather acts as a centralized registry returning two tables: `SandboxModeTraps` (grouped by tile type and preset categories) and `Layouts` (a flattened index of all named layouts). It relies on `StaticLayout.Get()` to resolve layout asset references, ensuring correct map data loading during world generation.

## Usage example
```lua
local Traps = require("map/traps")

-- Access sandbox mode trap preset for Rare layouts
local rareTraps = Traps.Sandbox.Rare

-- Access layouts flattened list by name
local sleepingSpiderLayout = Traps.Layouts["Sleeping Spider"]

-- Iterate all trap layouts for current world tile
local currentTile = WORLD_TILES.FOREST
for name, layout in pairs(Traps.Sandbox[currentTile]) do
    -- Use layout data for map generation
    print(name)
end
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
This module returns a table with two key fields; no properties are stored on a per-instance basis.

| Property   | Type  | Default Value | Description |
|------------|-------|---------------|-------------|
| `Sandbox`  | Table | `SandboxModeTraps` | Nested table mapping world tile constants and `"Rare"`, `"Any"` keys to tables of trap layout names and their `StaticLayout` data. |
| `Layouts`  | Table | `layouts` | Flattened table mapping trap layout names (e.g., `"Sleeping Spider"`) to their `StaticLayout` references. |

## Main functions
This module does not define any exported functions; it exports a single table containing precomputed layout groupings. Functionality is realized via `StaticLayout.Get()` calls during initialization, not runtime methods.

## Events & listeners
This module does not define or use any events or listeners.

