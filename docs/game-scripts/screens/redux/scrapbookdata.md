---
id: scrapbookdata
title: Scrapbookdata
description: Static data registry defining scrapbook entries for items, creatures, and structures used in the in-game scrapbook UI.
tags: [ui, data, scrapbook]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: d193a275
system_scope: ui
---

# Scrapbookdata

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
Scrapbookdata is a self-contained data module that defines static configuration tables for scrapbook entries. Each entry maps a unique key (e.g., `eyeturret`, `farm_plant_potato`, `moon_altar_cosmic`) to a structured metadata table containing properties such as display name, texture, subcategory, type, associated prefab, build recipe, unlock dependencies, and special notes. It serves as a data source for the scrapbook UI system, which likely consumes these tables to populate entries without procedural logic in this file.

## Usage example
The module exports a table of scrapbook entries; these are typically referenced directly by UI components (e.g., scrapbook panels) to render entry details:

```lua
local scrapbookdata = require("screens/redux/scrapbookdata")

local potato_entry = scrapbookdata.farm_plant_potato
print(potato_entry.name)         -- "Potato Plant"
print(potato_entry.prefab)       -- "farm_plant_potato"
print(potato_entry.build[1].prefab) -- "farm_plant_potato"
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scrapbookdata` (global export) | Table of tables | N/A | Top-level table mapping string keys (e.g., `"eyeturret"`) to scrapbook entry tables. Each entry table contains fields like `name`, `tex`, `subcat`, `type`, `prefab`, `build`, `bank`, `deps`, and `specialinfo`. |

## Main functions
None identified  

## Events & listeners
None identified