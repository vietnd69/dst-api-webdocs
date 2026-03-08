---
id: clothingexplorerpanel
title: Clothingexplorerpanel
description: Manages the UI panel for browsing and selecting clothing items in the wardrobe screen, integrating item exploration, filtering, and selection handling.
tags: [ui, clothing, filtering, selection]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: bcfc3bdf
system_scope: ui
---

# Clothingexplorerpanel

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`ClothingExplorerPanel` is a UI widget responsible for displaying and managing clothing item selection in the wardrobe screen. It inherits from `Widget` and acts as a composite container that integrates an `ItemExplorer` for item display, a `FilterBar` for filtering and sorting, and custom logic for handling user interactions, selection, and activity reporting. It dynamically adjusts its item source (`CLOTHING`, `BEEFALO_CLOTHING`, or character-specific skin bases) based on `item_type` and character context.

## Usage example
```lua
local panel = ClothingExplorerPanel(owner, user_profile, "base", checker_fn, writer_fn, {
    npccharacter = "waxwell",
    ignore_survivor = false,
    ignore_hero = false,
})
-- Add to screen or parent widget
parent:AddChild(panel)
-- Use methods as needed
panel:ClearSelection()
panel:RefreshInventory()
```

## Dependencies & tags
**Components used:** None (uses other widget classes: `ItemExplorer`, `FilterBar`, `Widget`; accesses global tables `CLOTHING`, `BEEFALO_CLOTHING`; and functions `GetAffinityFilterForHero`, `GetNullFilter`, `GetLockedSkinFilter`, `GetWeaveableSkinFilter`, `GetCharacterSkinBases`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | `nil` | The entity (usually the player) whose wardrobe is being viewed. |
| `user_profile` | table | `nil` | User profile data used for item access/validation. |
| `item_type` | string | `nil` | Type of items to display: `"base"`, `"wardrobe"`, etc. |
| `activity_checker_fn` | function | `nil` | Function used to check if an item is currently active/usable. |
| `activity_writer_fn` | function | `nil` | Function invoked when an item is selected/deselected. |
| `filter_options` | table | `nil` | Optional configuration including `yotb_filter`, `npccharacter`, `ignore_hero`, `ignore_survivor`. |
| `yotb_filter` | boolean | `nil` | Indicates if Year-of-the-Beast filter is active. |
| `npccharacter` | string | `nil` | Character name used for base-skin filtering (if applicable). |
| `picker` | ItemExplorer | `nil` | Child widget responsible for listing and selecting items. |
| `filter_bar` | FilterBar | `nil` | Child widget handling filters (survivor, owned, weaveable) and search/sort. |
| `focus_forward` | widget | `self.filter_bar` | Widget to receive focus when navigating forward from this panel. |

## Main functions
### `ClothingExplorerPanel(owner, user_profile, item_type, activity_checker_fn, activity_writer_fn, filter_options)`
*   **Description:** Constructor. Initializes the panel, builds the item explorer and filter bar, and sets up filtering and focus behavior.
*   **Parameters:**
    *   `owner` (entity) – entity whose context owns the clothing set.
    *   `user_profile` (table) – user profile data.
    *   `item_type` (string) – item category (`"base"`, `"wardrobe"`, etc.).
    *   `activity_checker_fn` (function) – function `(item_data) -> boolean` to check if item is active.
    *   `activity_writer_fn` (function) – function `(item_data) -> void` to handle item selection.
    *   `filter_options` (table, optional) – includes `yotb_filter`, `npccharacter`, `ignore_hero`, `ignore_survivor`.
*   **Returns:** New instance of `ClothingExplorerPanel`.

### `_GetCurrentClothing()`
*   **Description:** Returns the currently selected clothing item data.
*   **Parameters:** None.
*   **Returns:** `item_data` (table or `nil`) – the first item in the current selection, or `nil` if nothing selected.
*   **Error states:** May return `nil` if no items are selected.

### `OnClickedItem(item_data, is_selected)`
*   **Description:** Callback invoked when an item is clicked. Delegates selection activity to `activity_writer_fn`.
*   **Parameters:**
    *   `item_data` (table) – data of the clicked item.
    *   `is_selected` (boolean) – whether the item is now selected.
*   **Returns:** Nothing.

### `OnShow()`
*   **Description:** Called when the panel becomes visible. Refreshes the filter bar’s state to match current selections.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ClearSelection()`
*   **Description:** Clears all selections in the item explorer.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `RefreshInventory()`
*   **Description:** Refreshes filter state to apply current filter settings to any updated item list, preserving filter state (unlike direct `picker:RefreshItems()`).
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.