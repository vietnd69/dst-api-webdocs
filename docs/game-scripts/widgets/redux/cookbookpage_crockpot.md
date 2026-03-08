---
id: cookbookpage_crockpot
title: Cookbookpage Crockpot
description: Renders the recipe book UI page for Crock Pot recipes, including recipe grid, filtering, sorting, and detailed recipe panels.
tags: [ui, crafting, cookbook, quagmire]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: f7f14dda
system_scope: ui
---

# Cookbookpage Crockpot

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`CookbookPageCrockPot` is a UI widget component that manages the visual layout, data presentation, and interaction handling for the Crock Pot recipe book page in the Quagmire DLC. It builds and populates a scrolling grid of recipes, handles filter/sort spinners, and dynamically renders detailed recipe information panels when a recipe is selected. It interacts with the global `TheCookbook` state and `cooking.cookbook_recipes` to gather recipe data.

## Usage example
```lua
local CookbookPageCrockPot = require "widgets/redux/cookbookpage_crockpot"
local parent_screen = some_parent_screen -- a Widget or Screen instance

local page = CookbookPageCrockPot(parent_screen, "cookbook")
parent_screen:AddChild(page)
page:ApplyFilters() -- refreshes and displays filtered/sorted recipes
```

## Dependencies & tags
**Components used:** None (this is a UI widget, not an ECS component)  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `parent_screen` | Widget | `nil` | Parent screen widget that hosts this cookbook page. |
| `category` | string | `"cookbook"` | Recipe category key (e.g., `"cookbook"`) used to select `cooking.cookbook_recipes`. |
| `all_recipes` | table | `{}` | Array of all recipe data objects (unfiltered, sorted by priority/name). |
| `filtered_recipes` | table | `{}` | Current filtered and sorted list of recipes for display. |
| `num_recipes_discovered` | number | `0` | Count of recipes with discovered ingredients (`recipes ~= nil`). |
| `num_foods_eaten` | number | `0` | Count of recipes where the food has been eaten (`has_eaten == true`). |
| `details_root` | Widget | `nil` | Root widget container for the recipe detail panel. |
| `recipe_grid` | ScrollingGrid | `nil` | Scrolling grid widget displaying recipe items. |
| `spinners` | table | `{}` | Array of spinner widgets (sort/filter). |

## Main functions
### `PopulateRecipeDetailPanel(data)`
*   **Description:** Constructs and returns a widget containing the detailed visual panel for a single recipe. Handles locked/unlocked states, nutritional stats, side effects, ingredients, and cooking time. Supports custom mod-defined detail display via `recipe_def.custom_cookbook_details_fn`.
*   **Parameters:** `data` (table) — recipe data object containing `prefab`, `name`, `recipe_def`, `unlocked`, `has_eaten`, and recipe-specific fields.
*   **Returns:** Widget — root widget containing all detail UI elements.
*   **Error states:** None identified. Returns `nil` only if called incorrectly.

### `BuildRecipeBook()`
*   **Description:** Creates and configures a scrolling grid widget (`TEMPLATES.ScrollingGrid`) for displaying recipes. Defines cell creation (`ScrollWidgetsCtor`) and data binding (`ScrollWidgetSetData`) logic, including icon handling, “new recipe” animation, and selection behavior.
*   **Parameters:** None.
*   **Returns:** ScrollingGrid — configured grid widget.

### `ApplyFilters()`
*   **Description:** Filters `all_recipes` into `filtered_recipes` based on `TheCookbook:GetFilter("filter")`, then triggers sorting. Supports filter categories: `"ALL"`, `FOODTYPE.MEAT`, `FOODTYPE.VEGGIE`, `"OTHER"`, `"SIDEEFFECTS"`, `"INCOMPLETE"`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ApplySort()`
*   **Description:** Sorts `filtered_recipes` in-place based on `TheCookbook:GetFilter("sort")`. Supports `"default"`, `"alphabetical"`, `"health"`, `"hunger"`, `"sanity"`, and `"sideeffects"` sort orders.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `BuildSpinners()`
*   **Description:** Constructs and returns a root widget containing sort and filter `Spinner` widgets, configured with localized labels and option lists. Attaches callbacks to update global `TheCookbook` filters and trigger `ApplyFilters()`/`ApplySort()`.
*   **Parameters:** None.
*   **Returns:** Widget — root container for spinner widgets.

### `_SetupRecipeIngredientDetails(recipes, parent, y)`
*   **Description:** Populates `parent` with ingredient icons for up to three recipe variants, arranged either in a single row or two-column layout depending on number of variants.
*   **Parameters:**  
  - `recipes` (table) — array of ingredient lists (e.g., `{{"onion"}, {"tomato", "acorn"}}`).  
  - `parent` (Widget) — container widget to add ingredient visuals to.  
  - `y` (number) — vertical baseline position.
*   **Returns:** Nothing.

### `:_GetSpoilString(perishtime)`
*   **Description:** Maps a numeric `perishtime` value to a localized string describing spoil rate (e.g., `"Very Quickly"`, `"Average"`, `"Never"`).
*   **Parameters:** `perishtime` (number?) — perish time in game ticks or `nil`.
*   **Returns:** string — localized perish description string.

### `:_GetCookingTimeString(cooktime)`
*   **Description:** Maps a numeric `cooktime` to a localized string describing cooking duration (e.g., `"Short"`, `"Average"`, `"Very Long"`).
*   **Parameters:** `cooktime` (number?) — cooking time in seconds or `nil`.
*   **Returns:** string — localized cooking time description string.

### `:_GetSideEffectString(recipe_def)`
*   **Description:** Returns a localized string describing a food’s side effects (hot, cold, or custom `oneat_desc`). Falls back to `"None"` if no effects exist.
*   **Parameters:** `recipe_def` (table) — recipe definition table.
*   **Returns:** string — localized side effect description.

### `:_sortfn_default(a, b)`
*   **Description:** Default sort function for recipes, comparing `recipe_def.priority` and fallback `hash(prefab)`.
*   **Parameters:**  
  - `a`, `b` (table) — recipe data objects.
*   **Returns:** boolean — `true` if `a` should sort before `b`.

### `:_sortfn_sideeffects(a, b)`
*   **Description:** Sorts recipes primarily by side-effect presence and severity, then alphabetically by name if both have side effects.
*   **Parameters:**  
  - `a`, `b` (table) — recipe data objects.
*   **Returns:** boolean — `true` if `a` should sort before `b`.

### `_DoFocusHookups()`
*   **Description:** Configures keyboard/controller focus navigation between spinner widgets and the recipe grid. Sets `focus_forward` and `parent_default_focus` for Redux UI navigation.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified (commented-out event listener for `"quagmire_refreshrecipbookwidget"` is present but not active).  
- **Pushes:** None identified.