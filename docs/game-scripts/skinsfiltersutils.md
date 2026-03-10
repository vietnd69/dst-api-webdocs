---
id: skinsfiltersutils
title: Skinsfiltersutils
description: Provides filtering utilities for selecting subsets of skins based on type, rarity, item ID, and colour.
tags: [inventory, ui, skins]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: a52e3f3f
system_scope: ui
---

# Skinsfiltersutils

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`skinsfiltersutils` supplies helper functions for filtering skin lists in UI contexts (e.g., inventory screens). It enables dynamic subsetting of skin data based on multiple criteria: skin type, rarity, item ID, and colour. It depends on `skinsutils.lua` and relies on external functions like `GetRarityForItem`, `IsItemId`, and `IsItemMarketable`, as well as the global `ITEM_COLOURS` table and `TEMP_ITEM_ID` constant.

## Usage example
```lua
local skins_list = GetInventorySkinsList("Wx78")
local filters = { {"Classy", "legs"}, {"Common"} }
local filtered = ApplyFilters(skins_list, filters)

for _, skin in ipairs(filtered) do
    print(skin.item .. " matches one of the filter groups")
end
```

## Dependencies & tags
**Components used:** None. Uses functions and tables from `skinsutils.lua` (`GetRarityForItem`, `CopySkinsList`, `IsItemId`), plus the globals `ITEM_COLOURS` and `TEMP_ITEM_ID`.  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `ApplyFilters(full_skins_list, filters)`
* **Description:** Filters a full skins list based on multiple filter groups. Each filter group is a list of conditions that *must all match* for an item to be included; a skin qualifies if it matches *any one* of the filter groups. Items must also be marketable and not be temporary (`TEMP_ITEM_ID`).
* **Parameters:**  
  - `full_skins_list` (table) — List of skin items, typically returned by `GetInventorySkinsList()`. Each item must have fields: `type`, `item`, `item_id`.  
  - `filters` (table of tables of strings) — A list of filter groups; each group is a list of strings such as `"Classy"`, `"legs"`, `"wands"`, `"red"`, etc.
* **Returns:** `filtered_list` (table) — A list of skins matching at least one complete filter group.
* **Error states:** Returns early with a full copy of `full_skins_list` if any filter value in a group is `"none"` (case-insensitive).

## Events & listeners
Not applicable.