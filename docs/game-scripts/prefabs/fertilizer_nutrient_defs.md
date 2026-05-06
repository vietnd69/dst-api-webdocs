---
id: fertilizer_nutrient_defs
title: Fertilizer Nutrient Defs
description: Defines nutrient values, usage counts, and metadata for all fertilizer types used in the farming system.
tags: [farming, data, nutrients]
sidebar_position: 10
last_updated: 2026-04-17
build_version: 722832
change_status: stable
category_type: data
source_hash: 46a8c4ba
system_scope: inventory
---

# Fertilizer Nutrient Defs

> Based on game build **722832** | Last updated: 2026-04-17

## Overview
`fertilizer_nutrient_defs` is a data configuration file that defines nutrient values, usage counts, and display metadata for all fertilizer types in the game. Other systems access this data via `require()` to look up fertilizer properties when applying nutrients to soil or crops. The file exports both a definition table and a sorted list for consistent UI ordering.

## Usage example
```lua
local FertilizerDefs = require("scripts/fertilizer_nutrient_defs")

-- Access fertilizer definitions
local fertilizerData = FertilizerDefs.FERTILIZER_DEFS["poop"]
local nutrients = fertilizerData.nutrients
local uses = fertilizerData.uses

-- Access sorted fertilizer list for UI ordering
local sortedList = FertilizerDefs.SORTED_FERTILIZERS
for i, fertilizerName in ipairs(sortedList) do
    print(fertilizerName)
end

-- Check if a fertilizer was added by a mod
local isModded = FertilizerDefs.FERTILIZER_DEFS["custom_fertilizer"].modded
```

## Dependencies & tags
**External dependencies:**
- `TUNING` -- provides nutrient values, use counts, and other balance constants for each fertilizer type

**Components used:**
- None identified

**Tags:**
- None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `FERTILIZER_DEFS` | table | --- | Top-level table containing all fertilizer definition records keyed by fertilizer name. |
| `SORTED_FERTILIZERS` | array | --- | Ordered list of fertilizer names for consistent UI display ordering. |
| `nutrients` | table | --- | Nutrient values table from TUNING for this fertilizer type. |
| `uses` | number | --- | Number of times this fertilizer can be applied before depletion. |
| `inventoryimage` | string | --- | Texture filename for the fertilizer inventory icon. |
| `name` | string | --- | String key for localization of the fertilizer display name. |
| `modded` | boolean | --- | True if this fertilizer entry was added after initial file load (via metatable). |

## Main functions
None identified. This is a pure data configuration file with no constructor or factory functions.

## Events & listeners
None identified. This file does not register or fire any events.