---
id: techtree
title: Techtree
description: Defines and manages available technology trees and associated bonus/level naming conventions for crafting systems.
tags: [crafting, data, constants]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: bfe8cd4a
system_scope: crafting
---

# Techtree

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`Techtree` is a data module that defines the complete list of valid technology trees (e.g., `SCIENCE`, `MAGIC`, `CELESTIAL`) and related utility constants used throughout the game's crafting and progression systems. It provides a centralized registry of tech tree names and precomputed string mappings for bonus, temporary bonus, and level keys (e.g., `"science_bonus"`, `"magiclevel"`). This module is not an ECS component but a shared configuration singleton, returned as a table of constants and factory functions.

## Usage example
```lua
local TechTree = require "techtree"

-- Get list of all available tech trees
local all_tech = TechTree.AVAILABLE_TECH

-- Check if a tech tree supports bonuses
if TechTree.BONUS_TECH["SCIENCE"] ~= nil then
    -- Create a tech tree state container
    local my_tech_state = TechTree.Create()
    my_tech_state.SCIENCE = 2
    my_tech_state.MAGIC = 1
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `AVAILABLE_TECH` | table (array) | `{"SCIENCE", "MAGIC", ...}` | List of all valid technology tree names as uppercase strings. |
| `BONUS_TECH` | table (set) | `{"SCIENCE", "MAGIC", ...}` | Set of technology trees that support tech bonuses (used as keys; presence indicates support). |
| `Create` | function | — | Factory function returning a new tech tree state table initialized to `0` for all `AVAILABLE_TECH` entries. |
| `AVAILABLE_TECH_BONUS` | table | `{"SCIENCE" → "science_bonus", ...}` | Precomputed map from tech tree name to its bonus string key (deprecated, for backward compatibility). |
| `AVAILABLE_TECH_TEMPBONUS` | table | `{"SCIENCE" → "science_tempbonus", ...}` | Precomputed map from tech tree name to its temporary bonus string key (deprecated). |
| `AVAILABLE_TECH_BONUS_CLASSIFIED` | table | `{"SCIENCE" → "sciencebonus", ...}` | Alternative bonus key map (missing underscore) for legacy techs; not guaranteed stable. |
| `AVAILABLE_TECH_TEMPBONUS_CLASSIFIED` | table | `{"SCIENCE" → "sciencetempbonus", ...}` | Alternative temporary bonus key map (missing underscore); not guaranteed stable. |
| `AVAILABLE_TECH_LEVEL_CLASSIFIED` | table | `{"SCIENCE" → "sciencelevel", ...}` | Level key map (deprecated, included only for compatibility). |

## Main functions
### `Create(t)`
* **Description:** Creates and returns a new table representing a tech tree state, initializing all known tech trees from `AVAILABLE_TECH` to `0` unless overridden in the input table `t`.
* **Parameters:** `t` (table?, optional) — Initial values for specific tech trees. Missing tech trees default to `0`.
* **Returns:** table — A new tech tree state table.
* **Error states:** None. Non-table input is safely handled as `t = {}`.

## Events & listeners
Not applicable