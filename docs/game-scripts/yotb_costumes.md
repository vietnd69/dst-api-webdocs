---
id: yotb_costumes
title: Yotb Costumes
description: Defines YotB-themed beefalo costume configurations, including skin sets, crafting requirements, and category compatibility modifiers.
tags: [beefalo, cosmetic, crafting]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 67325de8
system_scope: inventory
---

# Yotb Costumes

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`yotb_costumes.lua` is a static configuration module that defines all available YotB-themed beefalo costumes. It does not implement a component, but instead exposes three top-level tables: `costumes`, `parts`, and `categories`. Each costume specifies test logic for ingredient validation, sewing time, skin assets, and a priority order—used when resolving overlapping costume application. The `parts` table maps individual costume part prefabs (e.g., `beefalo_head_war`) to their所属 category, while `categories` defines numeric modifiers applied per category (e.g., for behavior scoring).

## Usage example
```lua
-- Access a costume definition
local costume = yotb_costumes.costumes.WAR

-- Check if a set of ingredients satisfies the WAR costume requirement
local ingredients = {
    yotb_pattern_fragment_1 = 3,
    yotb_pattern_fragment_2 = 1,
}
local can_sew = costume.test(ingredients) -- returns true

-- Get skin names for the WAR costume
for _, skin_prefab in ipairs(costume.skins) do
    print("WAR skin:", skin_prefab)
end

-- Resolve the category for a given part prefab
local category = yotb_costumes.parts["beefalo_head_war"] -- returns the WAR table
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `costumes` | table | (see source) | Maps costume names (e.g., `"WAR"`) to costume definitions containing `test`, `priority`, `time`, and `skins`. |
| `parts` | table | (see source) | Maps individual part prefabs (e.g., `"beefalo_head_war"`) to their所属 category table (e.g., `WAR`). |
| `categories` | table | (see source) | Contains category-modifier tables keyed by costume type; used for scoring/behavior weighting. |

## Main functions
No top-level functions are exposed—only data structures.

## Events & listeners
None identified