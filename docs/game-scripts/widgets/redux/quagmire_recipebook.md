---
id: quagmire_recipebook
title: Quagmire Recipebook
description: Manages the UI for the Quagmire Recipe Book, displaying discovered recipes, filtering options, and detailed recipe information.
tags: [ui, crafting, quagmire, recipebook]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 10586753
system_scope: ui
---

# Quagmire Recipebook

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`QuagmireRecipeBook` is a UI widget component responsible for rendering the Quagmire Recipe Book interface. It dynamically displays discovered Quagmire food recipes in a scrolling grid, provides filtering controls for station, craving type, and tribute value, and shows detailed information for the selected recipe—including ingredient lists, required cook stations, and tribute values (coin and silver). It integrates with `TheRecipeBook` to access current filter state and recipe data, and responds to `quagmire_refreshrecipbookwidget` events to update the UI when recipe discovery state changes.

## Usage example
```lua
-- Example: Construct and display the Quagmire Recipe Book UI
local recipebook = QuagmireRecipeBook(parent_screen, season)
parent_screen:AddChild(recipebook)

-- Trigger a UI refresh programmatically
recipebook.inst:PushEvent("quagmire_refreshrecipbookwidget")
```

## Dependencies & tags
**Components used:** None (this is a pure widget component, not an entity component).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `parent_screen` | widget | `nil` | Reference to the parent screen widget. |
| `gridroot` | widget | `nil` | Container for the recipe grid and filter panel. |
| `recipe_grid` | ScrollingGrid | `nil` | The scrolling grid displaying recipe list items. |
| `details_root` | widget | `nil` | Container for the recipe details panel. |
| `filters_root` | widget | `nil` | Container for filter spinners (station, craving, value). |
| `spinners` | array of spinner widgets | `{}` | List of spinner widgets for filter controls. |
| `all_recipes` | array of recipe data tables | `{}` | Full list of all possible recipes (indexed by ID). |
| `num_recipes_discovered` | number | `0` | Count of discovered recipes. |

## Main functions
### `CreateRecipeBook()`
* **Description:** Constructs the entire recipe book UI layout, including the scrolling recipe grid, details panel, filter panel, and decorative elements.
* **Parameters:** None.
* **Returns:** Nothing.

### `BuildRecipeBook()`
* **Description:** Returns a `ScrollingGrid` widget populated with recipe list entries (one per discovered/unknown recipe), using `ScrollWidgetsCtor` and `ScrollWidgetApply` callbacks to instantiate and configure grid cells.
* **Parameters:** None.
* **Returns:** `ScrollingGrid` widget instance.

### `CreateRecipeDetailPanel(data)`
* **Description:** Builds and returns a widget displaying detailed information for the given recipe `data`, including title, Tribute (coin/silver) values, Cravings, Required Stations, and Ingredients.
* **Parameters:** `data` (table) — recipe data table from `self.all_recipes[id]`.
* **Returns:** `Widget` — fully constructed detail panel.

### `OnRecipeBookUpdated()`
* **Description:** Rebuilds the recipe grid and updates the details panel when the recipe discovery state changes (e.g., after discovering a new recipe). Preserves the current scroll position.
* **Parameters:** None.
* **Returns:** Nothing.

### `ApplyFilters()`
* **Description:** Updates the recipe grid to show only recipes matching the current filter criteria (`value`, `station`, `craving`). Registers and updates focus chain via `_DoFocusHookups`.
* **Parameters:** None.
* **Returns:** Nothing.

### `BuildFilterPanel()`
* **Description:** Constructs and returns a widget containing spinner controls for filtering recipes by station, craving, and tribute value. Register filter change callbacks that call `ApplyFilters`.
* **Parameters:** None.
* **Returns:** `Widget` — filter panel container with spinners.

### `_DoFocusHookups()`
* **Description:** Configures focus navigation between recipe grid cells, filter spinners, and the recipe grid itself. Updates `parent_default_focus` and optionally syncs `parent_screen.default_focus`.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `quagmire_refreshrecipbookwidget` — triggers `OnRecipeBookUpdated()` to refresh the UI when recipe data changes.
- **Pushes:** None.