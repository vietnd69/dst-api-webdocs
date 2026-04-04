---
id: recipes_filter
title: Recipes Filter
description: A configuration file defining crafting menu filter categories, their icons, and associated recipe lists for the crafting UI.
tags: [crafting, ui, configuration]
sidebar_position: 10

last_updated: 2026-04-04
build_version: 718694
change_status: stable
category_type: root
source_hash: 0c271291
system_scope: crafting
---

# Recipes Filter

> Based on game build **718694** | Last updated: 2026-04-04

## Overview
`recipes_filter.lua` is a configuration file that defines the structure and content of crafting menu filters in Don't Starve Together. It establishes filter categories (such as Tools, Weapons, Armour, Light, etc.), their visual assets (atlas and image paths), and the recipes assigned to each category. This file is not a component and does not attach to entities; it is required by UI systems that populate the crafting menu with organized recipe groups.

## Usage example
```lua
local CRAFTING_FILTERS = require "recipes_filter"

-- Access a filter definition by name
local toolsFilter = CRAFTING_FILTERS.TOOLS
print(toolsFilter.name)        -- "TOOLS"
print(toolsFilter.image)       -- "filter_tool.tex"

-- Iterate through recipes in a filter category
if toolsFilter.recipes then
    for i, recipeName in ipairs(toolsFilter.recipes) do
        print("Recipe:", recipeName)
    end
end

-- Access filter definitions array
local allFilters = CRAFTING_FILTER_DEFS
print(#allFilters)             -- Total number of filter categories
```

## Dependencies & tags
**External dependencies:** `MODCHARACTERLIST` — mod character list check, `MOD_CRAFTING_AVATAR_LOCATIONS` — mod avatar path override, `MOD_AVATAR_LOCATIONS` — fallback avatar path, `resolvefilepath` — path resolution, `softresolvefilepath` — soft path resolution, `CRAFTING_ICONS_ATLAS` — crafting icons atlas path constant, `TheCraftingMenuProfile` — favorites data access
**Components used:** None identified
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `CRAFTING_FILTER_DEFS` | table | — | Array-indexed table containing all filter definition records in display order. |
| `CRAFTING_FILTERS` | table | — | Lookup table keyed by filter name (e.g., `CRAFTING_FILTERS.TOOLS`) for quick access. |
| `name` | string | — | Filter category identifier used as the lookup key (e.g., `"TOOLS"`, `"WEAPONS"`). |
| `atlas` | function or string | — | Path to the texture atlas containing the filter icon, or a function returning the path. |
| `image` | function or string | — | Texture image name for the filter icon, or a function returning the name. |
| `custom_pos` | boolean | `false` | When `true`, indicates the filter uses a custom position in the UI layout. |
| `image_size` | number | — | Custom size for the filter icon image (e.g., `80` for character filter). |
| `show_hidden` | boolean | `false` | When `true`, includes hidden recipes in this filter category. |
| `recipes` | table or function | `{}` | Array of recipe prefab names assigned to this filter, or a function returning the list. |
| `default_sort_values` | table or function | — | Inverted recipe table or function used for sorting recipes within the filter. |

## Internal Helper Functions

### `GetCharacterAtlas(owner)`
*   **Description:** Resolves the texture atlas path for a character's crafting menu avatar. Checks mod-specific locations first, then falls back to default avatar locations.
*   **Parameters:**
    *   `owner` (entity) — The character entity instance; used to determine the prefab name for atlas resolution.
*   **Returns:** `string` — Full path to the avatar atlas XML file, or `nil` if not found.
*   **Error states:** Returns default crafting menu avatars.xml path if owner is nil or not a mod character. May return nil only if mod character atlas lookups fail and softresolvefilepath returns nil.

### `GetCharacterImage(owner)`
*   **Description:** Returns the texture image name for a character's crafting menu avatar. Returns `"avatar_mod.tex"` as fallback when owner is `nil`.
*   **Parameters:**
    *   `owner` (entity) — The character entity instance; used to determine the prefab name.
*   **Returns:** `string` — Texture image name (e.g., `"avatar_wilson.tex"` or `"avatar_mod.tex"` for mod characters).

### `GetCraftingMenuAtlas()`
*   **Description:** Resolves the file path for the main crafting menu icons atlas.
*   **Parameters:** None.
*   **Returns:** `string` — Full path to the crafting icons atlas via `resolvefilepath(CRAFTING_ICONS_ATLAS)`.
*   **Error states:** None.

## Events & listeners
None. This is a static configuration file with no event subscriptions or emissions.