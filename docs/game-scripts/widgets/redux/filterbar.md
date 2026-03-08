---
id: filterbar
title: Filterbar
description: Manages filter buttons, sort mode selection, and search input for the wardrobe item explorer UI.
tags: [ui, filtering, search, wardrobe]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: aa4fa4f3
system_scope: ui
---

# Filterbar

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`FilterBar` is a UI widget that provides interactive filtering, sorting, and search capabilities for the item explorer (wardrobe) screen. It is typically attached to an entity that hosts the UI and works in coordination with a `picker` widget to dynamically filter displayed items. The component manages multiple filter buttons, a sort mode toggle button, and a text-based search box, updating the picker’s contents whenever any filter state changes.

## Usage example
```lua
local filterbar = AddChild(Widget("filterbar_container"))
local picker = AddChild(Picker("item_picker"))
filterbar:AddComponent("filterbar", picker, "wardrobe_category")
filterbar.components.filterbar:AddFilter(STRINGS.UI.WARDROBESCREEN.FILTER_FMT, "filter1_on.tex", "filter1_off.tex", "FILTER1", filterfn1)
filterbar.components.filterbar:AddSorter()
filterbar.components.filterbar:AddSearch(false)
filterbar.components.filterbar:RefreshFilterState()
```

## Dependencies & tags
**Components used:** None (this is a standalone widget, not a Component).  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `picker` | Widget (Picker) | `nil` | Reference to the associated item picker widget that displays filtered items. |
| `filter_category` | string | `nil` | The category string used to persist filter/sort state in `Profile`. |
| `filters` | table | `{}` | Map of active filter IDs to filter functions. Used during item filtering. |
| `filter_btns` | table | `{}` | List of filter button structures containing `{btnid, widget}`. |
| `sort_btn` | Widget (IconButton) | `nil` | Reference to the sort mode toggle button. |
| `search_box` | Widget | `nil` | Reference to the search input widget. |
| `thin_mode` | boolean | `false` | Controls layout compactness for constrained UI spaces. |
| `no_refresh_picker` | boolean | `nil` | Internal flag used to suppress auto-refresh during bulk state updates. |

## Main functions
### `BuildFocusFinder()`
* **Description:** Returns a closure that determines the next widget to receive focus, prioritizing the picker if items are available, otherwise returning itself.
* **Parameters:** None.
* **Returns:** `function()` — A focus-finding callback.

### `RefreshFilterState()`
* **Description:** Reads stored filter/sort state from `Profile`, updates all filter buttons and sort button UI states accordingly, then triggers a single picker refresh.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None.

### `AddFilter(text_fmt, on_tex, off_tex, id, filterfn)`
* **Description:** Creates and configures a new toggle filter button. Updates internal filter map and picker upon state change.
* **Parameters:**  
  `text_fmt` (string) — Format string for hover text, e.g., `STRINGS.UI.WARDROBESCREEN.FILTER_FMT`.  
  `on_tex` (string) — Texture name when the filter is active (e.g., `"filter1_on.tex"`).  
  `off_tex` (string) — Texture name when the filter is inactive.  
  `id` (string) — Unique identifier for this filter, used as the key in `self.filters`.  
  `filterfn` (function) — Predicate function `function(item_key): boolean` that returns `true` if the item passes the filter.  
* **Returns:** `Widget` — The created `IconButton` widget.

### `AddSorter()`
* **Description:** Creates a button to cycle through predefined sort modes (`SORT_RELEASE`, `SORT_NAME`, `SORT_RARITY`, `SORT_COUNT`). Each click advances the sort mode, updates `Profile`, and refreshes the picker.
* **Parameters:** None.
* **Returns:** `Widget` — The created sort button widget.

### `AddSearch(thin)`
* **Description:** Creates and returns a search input field with debounced input handling. Defines a `"SEARCH"` filter in `self.filters` that matches against skin name, base prefab name, and collection name.
* **Parameters:**  
  `thin` (boolean) — If `true`, enables compact layout and narrower search box (`box_size = 120`, `search_width = 23`).  
* **Returns:** `Widget` — The created search box widget.

### `HideFilter(id)`
* **Description:** Hides the filter button with the given ID and recalculates layout positions.
* **Parameters:**  
  `id` (string) — The ID of the filter button to hide.  
* **Returns:** Nothing.

### `ShowFilter(id)`
* **Description:** Shows the filter button with the given ID (if previously hidden) and recalculates layout positions.
* **Parameters:**  
  `id` (string) — The ID of the filter button to show.  
* **Returns:** Nothing.

### `:UpdatePositions()`
* **Description:** Repositions filter buttons, sort button, and search box horizontally within the picker’s scroll region. Sets focus navigation links (`SetFocusChangeDir`) between adjacent controls.
* **Parameters:** None.
* **Returns:** Nothing.

### `_ConstructFilter()`
* **Description:** Constructs and returns a composite filter function that combines all registered filter functions (`self.filters`) using logical AND.
* **Parameters:** None.
* **Returns:** `function(item_key): boolean` — A single filter function to pass to `picker:RefreshItems()`.

## Events & listeners
* **Listens to:** None.  
* **Pushes:** None.  
  *(Note: FilterBar does not fire events directly; it triggers `picker:RefreshItems(...)` internally.)*