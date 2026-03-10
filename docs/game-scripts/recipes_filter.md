---
id: recipes_filter
title: Recipes Filter
description: Defines and organizes crafting menu filters for categorizing recipes by type, character, season, and other criteria.
tags: [crafting, ui, data]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 74fc4bbc
system_scope: crafting
---

# Recipes Filter

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`recipes_filter.lua` defines the structure and contents of crafting menu filters used in the game’s UI. It establishes `CRAFTING_FILTER_DEFS`, a list of filter definitions (each specifying name, icon atlas, image, and optional properties), and populates `CRAFTING_FILTERS`, a lookup table mapping filter names to their definitions. Each filter includes a `recipes` list (or function) that determines which recipes belong to that filter. Helper functions `GetCharacterAtlas`, `GetCharacterImage`, and `GetCraftingMenuAtlas` compute file paths for filter icons, supporting mod characters and fallbacks. This module does not manage state or components; it is a pure data configuration file.

## Usage example
```lua
-- Access a specific filter's recipe list
local filters = require("recipes_filter")

-- Iterate over all filters and print their names and recipe counts
for name, filter in pairs(filters.CRAFTING_FILTERS) do
    if type(filter.recipes) == "table" then
        print(name .. ": " .. #filter.recipes .. " recipes")
    elseif type(filter.recipes) == "function" then
        print(name .. ": dynamic recipe list")
    end
end

-- Get recipes for a specific filter
local tools = filters.CRAFTING_FILTERS.TOOLS.recipes
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `CRAFTING_FILTER_DEFS` | array of tables | — | Ordered list of filter definitions; each table contains `name`, `atlas`, `image`, `image_size`, `custom_pos`, and `recipes` keys. |
| `CRAFTING_FILTERS` | table | `nil` → populated at load time | Lookup table mapping filter names (e.g., `"TOOLS"`, `"CHARACTER"`) to their corresponding definition tables. |
| `GetCharacterAtlas(owner)` | function | — | Returns atlas file path for a character’s avatar, with mod-specific fallback logic. |
| `GetCharacterImage(owner)` | function | — | Returns image filename (`avatar_<prefab>.tex` or `avatar_mod.tex`). |
| `GetCraftingMenuAtlas()` | function | — | Returns the base crafting menu atlas path. |

## Main functions
Not applicable — this file defines data structures and helper functions but no public methods attached to components.

## Events & listeners
Not applicable — this file does not register or dispatch events.