---
id: spicedfoods
title: Spicedfoods
description: Generates recipe data for spiced variants of base foods and registers their cooking behavior and effects.
tags: [crafting, food, tuning]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: e258e758
system_scope: crafting
---

# Spicedfoods

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`spicedfoods` is a data-generating module that creates recipe definitions for spiced food variants by combining base food recipes (from `preparedfoods.lua` and `preparedfoods_warly.lua`) with predefined spice types. Each spice contributes unique effects (e.g., garlic grants absorption) and modifies recipe properties such as cook time, stack size, and temperature behavior. It populates and returns a flat table (`spicedfoods`) keyed by the spiced food's name (e.g., `"rottensmall_spice_chili"`), which is used by the cooking system.

## Usage example
```lua
local spicedfoods = require("spicedfoods")
-- Access a specific spiced food recipe
local spiced_chili_wetgoop = spicedfoods["wetgoop_spice_chili"]
if spiced_chili_wetgoop then
    print("Cook time:", spiced_chili_wetgoop.cooktime)
    print("Spice type:", spiced_chili_wetgoop.spice)
end
```

## Dependencies & tags
**Components used:** None (this is a pure data generator; no components are added or accessed at runtime).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `spicedfoods` | table (returned) | `{}` | Key-value map where keys are spiced food names (e.g., `"rotten_spice_sugar"`) and values are recipe data tables. |

## Main functions
### `GenerateSpicedFoods(foods)`
*   **Description:** Iterates over a table of base food recipes and generates spiced variants for each spice defined in `SPICES`. Modifies and stores new recipe entries in the global `spicedfoods` table.
*   **Parameters:** `foods` (table) — A map of base food recipe data, typically obtained from `require("preparedfoods")` or `require("preparedfoods_warly")`.
*   **Returns:** Nothing (modifies the module-level `spicedfoods` table in-place).
*   **Error states:** None documented. Assumes all inputs are well-formed recipe tables.

## Events & listeners
- **None.**