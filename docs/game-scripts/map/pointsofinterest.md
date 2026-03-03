---
id: pointsofinterest
title: Pointsofinterest
description: Provides a centralized registry of static map layouts used as points of interest in sandbox mode world generation.
tags: [map, generation, static]
sidebar_position: 100

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: c4b89638
system_scope: world
---

# Pointsofinterest

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Pointsofinterest` is a utility module—not an Entity Component System component—that aggregates predefined static map layouts by biome and thematic category for use in sandbox mode world generation. It loads layouts via `StaticLayout.Get()` from `map/static_layout.lua`, organizes them into structured tables, and exposes them for worldgen tasks to select appropriate points of interest based on terrain type, season, or rarity.

## Usage example
```lua
local PointsofInterest = require("map/pointsofinterest")
local layouts = PointsofInterest.Layouts
local biome_layouts = PointsofInterest.Sandbox[WORLD_TILES.DIRT]

-- Example: retrieve a specific layout
local miner_layout = layouts.skeleton_miner
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `Sandbox` | table | (see below) | Hierarchical mapping of biome/category keys to tables of named layouts. |
| `Layouts` | table | (see below) | Flattened mapping of layout names to loaded `StaticLayout` objects. |

### `Sandbox` structure
- **Biome keys** (e.g., `WORLD_TILES.FOREST`, `WORLD_TILES.MUD`) map to tables containing profession-specific skeleton layouts.
- **Special keys**: `"Rare"` and `"Any"` provide cross-biome or high-tier layouts.
- **Notable exclusions**: `"Winter"` is commented out and currently unused.

## Main functions
*This module returns a table and does not define public instance methods.* The primary interface is data access via the returned `Sandbox` and `Layouts` tables.

## Events & listeners
None identified
