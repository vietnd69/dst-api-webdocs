---
id: recipes_filter
title: Recipes Filter
description: Defines crafting menu filter categories and their associated recipe prefab lists for the crafting interface.
tags: [crafting, ui, config]
sidebar_position: 10
last_updated: 2026-04-22
build_version: 722832
change_status: stable
category_type: root
source_hash: b70b2de8
system_scope: ui
---

# Recipes Filter

> Based on game build **722832** | Last updated: 2026-04-22

## Overview
`recipes_filter.lua` defines the static configuration for crafting menu filter categories. It establishes `CRAFTING_FILTER_DEFS` as an array of filter definitions, then builds `CRAFTING_FILTERS` as a name-keyed lookup table. Each filter specifies its icon atlas, image, and optionally a list of recipe prefab names that belong to that category. This file is a configuration source — it is not a component and does not attach to entities; it is required by the crafting menu UI system to organize and display craftable items.

## Usage example
```lua
require "recipes_filter"

-- Access a filter by name (CRAFTING_FILTERS is now a global)
local toolsFilter = CRAFTING_FILTERS.TOOLS
print(toolsFilter.name)           -- "TOOLS"
print(toolsFilter.image)          -- "filter_tool.tex"

-- Access the recipes array for a filter
for i, recipe in ipairs(toolsFilter.recipes) do
    print(recipe)                 -- e.g., "axe", "pickaxe", etc.
end

-- Access filter definitions array
local firstDef = CRAFTING_FILTER_DEFS[1]
print(firstDef.name)              -- "FAVORITES"
```

## Dependencies & tags
**External dependencies:**
- `MODCHARACTERLIST` -- checks if owner is a mod character for avatar resolution
- `MOD_CRAFTING_AVATAR_LOCATIONS` -- mod character crafting menu avatar path overrides
- `MOD_AVATAR_LOCATIONS` -- mod character avatar path fallbacks
- `CRAFTING_ICONS_ATLAS` -- global constant for crafting menu icon atlas path
- `TheCraftingMenuProfile` -- accessed by FAVORITES filter for dynamic recipe lists
- `softresolvefilepath` -- checks if file path exists before using
- `resolvefilepath` -- resolves asset paths for atlases

**Components used:** None identified

**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `CRAFTING_FILTER_DEFS` | table | — | Array-indexed table of filter definition records; position determines display order. |
| `name` | string | — | Filter category identifier (e.g., `"TOOLS"`, `"WEAPONS"`, `"CHARACTER"`). |
| `atlas` | function | — | Function returning the atlas path for the filter icon; may be `GetCraftingMenuAtlas` or `GetCharacterAtlas`. |
| `image` | string or function | — | Texture name or function returning texture name for the filter icon. |
| `custom_pos` | boolean | `nil` | When true, indicates custom positioning for the filter in the UI. |
| `image_size` | number | `nil` | Custom image size for the filter icon (e.g., `80` for CHARACTER filter). |
| `recipes` | table or function | `nil` | Array of prefab names belonging to this filter, or function returning the array dynamically. |
| `recipes[]` | string | — | Prefab name string for craftable items in this filter category (e.g., `"axe"`, `"pickaxe"`). |
| `show_hidden` | boolean | `nil` | When true, includes hidden recipes in this filter (e.g., EVERYTHING filter). |
| `default_sort_values` | table | `nil` | Inverted recipe table for sorting; auto-populated for filters with static recipe arrays. |
| `CRAFTING_FILTERS` | table | — | Name-keyed lookup table built from `CRAFTING_FILTER_DEFS`; provides direct access by filter name. |

## Main functions
### `GetCharacterAtlas(owner)`
* **Description:** Returns the appropriate atlas path for a character's crafting menu avatar. Checks mod character overrides first, then falls back to default avatar locations.
* **Parameters:**
  - `owner` -- player entity instance; may be `nil` for default atlas
* **Returns:** String atlas path (e.g., `"images/crafting_menu_avatars.xml"` or mod character path), or `nil` if resolution fails.
* **Error states:** None

### `GetCharacterImage(owner)`
* **Description:** Returns the texture name for a character's crafting menu avatar image.
* **Parameters:**
  - `owner` -- player entity instance; may be `nil` for default mod avatar
* **Returns:** String texture name (e.g., `"avatar_wilson.tex"` or `"avatar_mod.tex"`).
* **Error states:** None

### `GetCraftingMenuAtlas()`
* **Description:** Returns the resolved file path for the main crafting menu icons atlas.
* **Parameters:** None
* **Returns:** String atlas path from `CRAFTING_ICONS_ATLAS` constant.
* **Error states:** None

## Events & listeners
None.