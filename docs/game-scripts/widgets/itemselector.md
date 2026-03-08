---
id: itemselector
title: Itemselector
description: Manages the UI widget for selecting inventory skins in the tradescreen, displaying a scrollable grid of items and handling user selection events.
tags: [ui, inventory, skin, tradescreen, selection]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: ce71e46f
system_scope: ui
---

# Itemselector

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`ItemSelector` is a UI widget component responsible for rendering and managing a scrollable grid of inventory skins in the tradescreen. It inherits from `Widget` and integrates with `TrueScrollList` to display items in a paged layout. It filters the full inventory list based on provided criteria, excludes already-selected items, and notifies the owner (typically the tradescreen controller) when an item is selected.

## Usage example
```lua
-- Assuming 'owner' is a controller that implements StartAddSelectedItem()
local item_selector = ItemSelector(parent_widget, owner, profile)
item_selector:UpdateData(selections, filters_list)
item_selector:EnableInput()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `Entity` or table | — | The controller entity that receives selection callbacks. |
| `parent` | `Widget` | — | Parent UI widget container. |
| `profile` | table | — | UI profile or theme configuration. |
| `root` | `Widget` | — | Root container widget for the selector UI. |
| `inventory_list` | `Widget` | — | Container for the scrollable item list. |
| `scroll_list` | `TrueScrollList` | — | Scrollable list widget rendering the item grid. |
| `list_widgets` | array of widgets | — | Array of individual list item widgets (one per grid cell). |
| `full_skins_list` | array of tables | — | Complete list of inventory skins before filtering. |
| `skins_list` | array of tables | — | Filtered list of skins displayed to the user. |
| `show_hover_text` | boolean | `true` | Controls whether hover text is shown for list items. |

## Main functions
### `Close()`
* **Description:** Destroys the widget by calling `Kill()` — used to clean up UI state when closing the item selector.
* **Parameters:** None.
* **Returns:** Nothing.

### `BuildInventoryList()`
* **Description:** Initializes the scrollable inventory grid using `TrueScrollList`. Sets up the list container, positions it, and configures the grid layout with 4 rows × 4 columns (based on `NUM_ROWS` and `NUM_ITEMS_PER_ROW`). Assigns `self.focus_forward` to allow UI focus navigation.
* **Parameters:** None.
* **Returns:** Nothing.

### `UpdateData(selections, filters_list)`
* **Description:** Refreshes the displayed item list. Fetches the full inventory skins list, applies filters, and removes items already in `selections` to prevent duplicate selection. Sets the resulting list as data for the scroll list.
* **Parameters:**  
  * `selections` (array of tables) — list of currently selected item records (each with `item_id`).  
  * `filters_list` (array or function) — filter criteria applied to reduce the inventory list.  
* **Returns:** Nothing.
* **Error states:** None identified.

### `EnableInput()`
* **Description:** Enables interaction for all list item widgets (e.g., mouse/keyboard click handling).
* **Parameters:** None.
* **Returns:** Nothing.

### `DisableInput()`
* **Description:** Disables interaction for all list item widgets.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnItemSelect(type, item, item_id, itemimage)`
* **Description:** Callback invoked when a user selects an item from the list. Delegates to `owner:StartAddSelectedItem()` with the selected item data and screen position of the clicked widget.
* **Parameters:**  
  * `type` (string) — item type identifier.  
  * `item` (string or table) — item definition or identifier.  
  * `item_id` (string) — unique ID of the item instance.  
  * `itemimage` (widget) — the clicked UI widget representing the item.  
* **Returns:** Nothing.

### `NumItemsLikeThis(item_name)`
* **Description:** Returns the total count of items matching `item_name` in the *unfiltered* inventory list (`full_skins_list`). Useful for UI logic that requires total inventory counts.
* **Parameters:**  
  * `item_name` (string) — the name of the item to count.  
* **Returns:** `number` — count of matching items.

### `GetNumFilteredItems()`
* **Description:** Returns the count of items currently displayed after filtering and deduplication (`#skins_list`).
* **Parameters:** None.
* **Returns:** `number` — number of filtered items in the list.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified