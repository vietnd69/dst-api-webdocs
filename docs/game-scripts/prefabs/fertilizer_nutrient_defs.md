---
id: fertilizer_nutrient_defs
title: Fertilizer Nutrient Defs
description: Defines structured data for fertilizer types used in the game, including nutrient values, usage counts, and display metadata.
tags: [crafting, inventory, environment]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ac405585
system_scope: crafting
---

# Fertilizer Nutrient Defs

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`fertilizer_nutrient_defs.lua` defines a central data table `FERTILIZER_DEFS` that specifies the properties of each fertilizer item in DST. Each entry maps a fertilizer identifier (e.g., `"poop"`, `"fertilizer"`) to a table containing nutrient content, optional usage count, inventory image, and localization key. The file also enforces sensible defaults, defines a sort order for UI presentation, and supports modded additions via metatable hooks. This is a configuration file—not a component—and is used to populate fertilizer-related prefabs during initialization.

## Usage example
```lua
local fertilizer_defs = require "prefabs/fertilizer_nutrient_defs"

-- Access data for a specific fertilizer
local def = fertilizer_defs.FERTILIZER_DEFS.poop
print(def.nutrients)   -- Value from TUNING.POOP_NUTRIENTS
print(def.uses)        -- 1 (default fallback)
print(def.inventoryimage) -- "poop.tex" (default fallback)

-- Iterate through sorted fertilizers for UI display
for _, name in ipairs(fertilizer_defs.SORTED_FERTILIZERS) do
    local data = fertilizer_defs.FERTILIZER_DEFS[name]
    print(name, data.name, data.nutrients)
end
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `FERTILIZER_DEFS` | table | `{}` | Dictionary of fertilizer definitions. Each key is a string (e.g., `"poop"`); each value is a table with keys `nutrients` (number), `uses` (number, default `1`), `inventoryimage` (string, default `"<key>.tex"`), and `name` (string, default `"<KEY>"`). May include `modded` boolean flag added by modded code. |
| `SORTED_FERTILIZERS` | array of strings | `{"spoiled_fish_small", ...}` | Ordered list of fertilizer keys for consistent UI sorting. |

## Main functions
None identified.

## Events & listeners
None identified.