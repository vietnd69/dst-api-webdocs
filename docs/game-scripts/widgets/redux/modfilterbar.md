---
id: modfilterbar
title: Modfilterbar
description: Manages a filter bar UI for the Mod tab, allowing users to filter mods by type (workshop/local/all), status (enabled/disabled), and search term.
tags: [ui, modding]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: dc03f932
system_scope: ui
---

# Modfilterbar

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`ModFilterBar` is a UI widget that provides interactive filtering controls for the Mods screen in Don't Starve Together. It manages a set of toggleable filter buttons (for mod source type and activation status) and a search input field, then constructs and applies a combined filter function to the mod list displayed in the associated `modstab`. It integrates with the `Profile` system to persist filter states across sessions and ensures layout adaptability based on visible buttons.

## Usage example
```lua
-- Assume modstab is a valid ModTab instance
local modfilterbar = ModFilterBar(modstab, "mod_filter_category")

-- Add filter buttons and search
modfilterbar:AddModTypeFilter(
    "Show %s mods",
    "workshop_icon.tex",
    "local_icon.tex",
    "all_icon.tex",
    "SOURCE",
    workshop_filter_fn,
    local_filter_fn
)

modfilterbar:AddModStatusFilter(
    "Show %s mods",
    "enabled_icon.tex",
    "disabled_icon.tex",
    "both_icon.tex",
    "STATUS",
    enabled_filter_fn,
    disabled_filter_fn
)

modfilterbar:AddSearch()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `modfilterbar` tag implicitly via `Widget._ctor` (inherited from `widgets/widget`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `modstab` | table | — | Reference to the parent ModTab instance this filter bar controls. |
| `filter_category` | string | — | Identifier string used to store/retrieve filter state in `Profile`. |
| `filters` | table | `{}` | Table mapping filter IDs to their active filter functions. |
| `filter_btns` | table | `{}` | Ordered list of `{btnid=id, widget=btn}` entries for each filter button. |
| `search_box` | widget | `nil` | Reference to the search input widget created by `AddSearch()`. |
| `no_refresh_modstab` | boolean | `nil` | Internal flag to suppress automatic refresh during batch filter updates. |

## Main functions
### `BuildFocusFinder()`
* **Description:** Returns a function that determines where keyboard focus should go (either the mod list if it has items, or the filter bar itself if empty). Used for keyboard navigation flow.
* **Parameters:** None.
* **Returns:** A function that takes no arguments and returns a focusable widget (`modstab.mods_scroll_list` or `self`).

### `RefreshFilterState()`
* **Description:** Synchronizes the visual state of filter buttons with saved profile settings and triggers a filter refresh on the mod tab.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Suppresses intermediate mod tab refreshes using `no_refresh_modstab`; one refresh occurs at the end.

### `AddModTypeFilter(...)`
* **Description:** Adds a source-type filter button (e.g., Workshop/Local/All). The button cycles through states on click and updates the corresponding filter function in `self.filters`.
* **Parameters:**  
  - `text_fmt` (string) – Hover text template string, e.g., `"Show %s mods"`.  
  - `workshop_tex`, `local_tex`, `all_tex` (string) – Texture filenames for button icons.  
  - `id` (string/number) – Unique filter identifier.  
  - `workshopfilterfn`, `localfilterfn` (function) – Functions that return `true`/`false` based on mod key for workshop/local filtering.
* **Returns:** The created `IconButton` widget.

### `AddModStatusFilter(...)`
* **Description:** Adds a status filter button (e.g., Enabled/Disabled/Both). Behaves similarly to `AddModTypeFilter` but for mod activation status.
* **Parameters:**  
  - `text_fmt` (string) – Hover text template string.  
  - `enabled_tex`, `disabled_tex`, `both_tex` (string) – Texture filenames for button icons.  
  - `id` (string/number) – Unique filter identifier.  
  - `enabledfilterfn`, `disabledfilterfn` (function) – Filtering functions for enabled/disabled status.
* **Returns:** The created `IconButton` widget.

### `AddSearch()`
* **Description:** Adds a search input field that filters mod list entries by name (case-insensitive substring and partial word match).
* **Parameters:** None.
* **Returns:** The created `Widget` container for the search text box.

### `HideFilter(id)` and `ShowFilter(id)`
* **Description:** Hides or shows a specific filter button by ID. Updates layout and focus chains accordingly.
* **Parameters:**  
  - `id` (string/number) – ID of the filter to toggle visibility.
* **Returns:** Nothing.

### `_UpdatePositions()`
* **Description:** Recalculates and sets positions of filter buttons and the search box to maintain horizontal alignment and spacing based on visible buttons. Updates keyboard focus chain (`focus_forward`).
* **Parameters:** None.
* **Returns:** Nothing.

### `_ConstructFilter()`
* **Description:** Constructs and returns a filter function that combines all active filter functions. A mod passes if *all* visible filters return `true`.
* **Parameters:** None.
* **Returns:** A function `(item_key) → boolean`.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** `nil` — This widget does not fire custom events directly.