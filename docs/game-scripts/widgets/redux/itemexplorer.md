---
id: itemexplorer
title: Itemexplorer
description: Displays a scrollable grid of account-owned items for player selection, commerce, and set information, with keyboard/controller UI integration.
tags: [ui, inventory, account, commerce, selection]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 89acca9f
system_scope: ui
---

# Itemexplorer

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`ItemExplorer` is a UI widget that presents a scrolling grid of account-linked customization items (e.g., skins, costumes) for selection, purchase, grinds, and set information display. It integrates with `BarterScreen`, `PurchasePackScreen`, and user profile state to manage item ownership, selection state, and commerce interactions. The component handles focus navigation (mouse/controller), input mapping for context-sensitive actions (commerce, marketplace, set info), and dynamic footer display of item details. It requires a supplied `item_table_getter`, item type filter, and optional activity checker/writer functions for selection persistence.

## Usage example
```lua
local ItemExplorer = require "widgets/redux/itemexplorer"

local my_item_explorer = ItemExplorer(
    "My Collection", -- title_text
    "cosmetic",      -- primary_item_type
    function() return GetCollectionTable("cosmetic") end, -- item_table_getter
    {
        scroll_context = { user_profile = user_profile, selection_type = "single" },
        widget_width = 100,
        widget_height = 100,
    },
    {
        yotb_filter = nil,
        npccharacter = nil,
    }
)

-- Add to a parent widget later
parent:AddChild(my_item_explorer)
```

## Dependencies & tags
**Components used:** None (no `inst.components.X` usage; this is a UI widget, not an entity component).  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `primary_item_type` | string | (required) | The category/type of items displayed (e.g., `"cosmetic"`). |
| `item_table` | table | (computed from `item_table_getter`) | Map of `item_key` → boolean indicating item inclusion in the list. |
| `filter_options.yotb_filter` | table or nil | `nil` | Optional filter for Ye of the Beast skins sets. |
| `filter_options.npccharacter` | string or nil | `nil` | Optional character context for filtering. |
| `activity_checker_fn` | function | `nil` (default: reads `user_profile:GetCustomizationItemState`) | Function `(item_key) → boolean` to check if an item is active. |
| `activity_writer_fn` | function | `nil` (default: calls `user_profile:SetCustomizationItemState`) | Function `(item_data) → nil` to persist selection state. |
| `selection_allow_nil` | boolean | `false` | Whether a "no selection" state is valid (e.g., for single-selection contexts). |
| `selected_items` | table | `{}` | Map `{ item_key → true }` of currently active selections. |
| `last_interaction_target` | table or nil | `nil` | Data object of the currently focused/interacted item (includes `item_key`, `is_owned`, etc.). |
| `scroll_list` | Widget (ScrollingGrid) | `nil` | Internal scrolling grid widget for items. |
| `progress` | Text | `nil` | Header text showing owned/unlocked count (e.g., `"3/10"`). |
| `footer` | Widget | `nil` | Container for focused item details, commerce buttons, and info. |
| `set_item_type` | string | `nil` | Item key for current set (used when launching `SetPopupDialog`). |

## Main functions
### `_DoInit(title_text, contained_items, list_options)`
* **Description:** Initializes the widget’s internal layout (header, footer, scroll grid, commerce buttons) and registers `self` as an input receiver.
* **Parameters:**  
  - `title_text` (string) – Unused in UI (commented out), reserved for historical consistency.  
  - `contained_items` (table) – Pre-filtered list of item data tables (each with `item_key`, `is_active`, `is_owned`, etc.).  
  - `list_options` (table) – Configuration (scroll context, grid dimensions, callbacks). Missing defaults are filled automatically.
* **Returns:** Nothing.
* **Error states:** Expects `contained_items[1]` to have a non-nil `item_key` and valid `is_active` (unless `selection_type == nil`); otherwise triggers `assert` failures.

### `OnGainGridItemFocus(item_data)`
* **Description:** Stub method for input receivers. Currently does nothing.

### `OnLoseGridItemFocus(item_data)`
* **Description:** Stub method for input receivers. Currently does nothing.

### `OnClickedItem(item_data, is_selected)`
* **Description:** Updates internal selection state when an item is clicked (via `scroll_list`). Calls `_UpdateItemSelectedInfo` to refresh footer content (set info, store button visibility).
* **Parameters:**  
  - `item_data` (table) – Item data (includes `item_key`).  
  - `is_selected` (boolean) – Whether the item is now selected (based on `_ApplyDataToDescription`’s `IsDataSelected` logic).
* **Returns:** Nothing.

### `_ApplyDataToDescription(item_data)`
* **Description:** Updates the footer text to show the item’s name, rarity, description, action info (commerce/grind details), and divider visibility.
* **Parameters:**  
  - `item_data` (table or nil) – Item data; if `nil`, clears the footer.
* **Returns:** Nothing.

### `RepositionFooter(new_parent, y, footer_width)`
* **Description:** Moves and resizes footer widgets (labels, buttons, dividers) to fit a new parent and width. Called by screen layout managers.
* **Parameters:**  
  - `new_parent` (Widget) – Parent widget to re-add the footer to.  
  - `y` (number) – Vertical position.  
  - `footer_width` (number) – Width used to scale text and button regions.
* **Returns:** Nothing.

### `ClearSelection()`
* **Description:** Clears selection state, interaction target, footer info, and commerce state. Optionally invokes `clearSelectionCB`.
* **Parameters:** None.
* **Returns:** Nothing.

### `RefreshItems(new_item_filter_fn)`
* **Description:** Rebuilds the item list and updates the grid. Restores previous selection if possible, handling filter changes and single-selection edge cases.
* **Parameters:**  
  - `new_item_filter_fn` (function or nil) – Optional filter `(item_key) → boolean` applied before displaying.
* **Returns:** Nothing.

### `GetSelectedItems()`
* **Description:** Returns a table `{ item_key → true }` of currently active item keys, constrained by `selection_type`. Fails if `selection_type` is `nil`.
* **Parameters:** None.
* **Returns:** `table` – Map of selected item keys.

### `_LaunchCommerce()`
* **Description:** Safely launches the barter screen for the current `last_interaction_target`, including warning dialogs for restricted characters or ensembles. Prevents duplicate commerce launches.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** early-exits if `self.launched_commerce` is already set.

### `_DoCommerce(item_key)`
* **Description:** Creates and pushes a `BarterScreen` instance for buying/selling `item_key`, handling post-barter updates (inventory refresh, item selection toggle on last-unit sell).
* **Parameters:**  
  - `item_key` (string) – Item key to trade.
* **Returns:** Nothing.

### `_ShowMarketplaceForInteractTarget()`
* **Description:** Opens the Steam marketplace listing for `last_interaction_target` (Windows/Linux/macOS only).
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Early-exits if platform is not Steam.

### `_ShowItemSetInfo()`
* **Description:** Pushes a `SetPopupDialog` for the current set (based on `self.set_item_type`).
* **Parameters:** None.
* **Returns:** Nothing.

### `_ApplyItemToCommerce(item_data)`
* **Description:** Updates the commerce button’s text and enabled state based on `item_data`.
* **Parameters:**  
  - `item_data` (table) – Item data (includes `is_owned`, `item_key`).
* **Returns:** Nothing.

### `_ApplyItemToMarket(item_data)`
* **Description:** Controls visibility of the Steam marketplace button based on marketability.
* **Parameters:**  
  - `item_data` (table) – Item data (includes `item_key`).
* **Returns:** Nothing.

### `_GetActionInfoText(item_data)`
* **Description:** Generates the string displayed in the footer action info field, accounting for ownership, grinds, entitlements, restrictions, and platform.
* **Parameters:**  
  - `item_data` (table) – Item data.
* **Returns:** `string` – Multi-line description (e.g., `"Grindable: 10 / 12"`).

### `_OnClickWidget(item_widget)`
* **Description:** Handles widget click events: toggles selection, updates `last_interaction_target`, refreshes commerce/footer UI.
* **Parameters:**  
  - `item_widget` (Widget) – Clicked item widget (has `data` property).
* **Returns:** Nothing.

### `_UpdateClickedWidget(item_widget, was_active)`
* **Description:** Manages single-selection toggling logic (unselects previous selection if needed). Calls `widget:UpdateSelectionState()`.
* **Parameters:**  
  - `item_widget` (Widget) – Widget to update.  
  - `was_active` (boolean) – Previous selection state for the target item.
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Controller input handler (e.g., `CONTROL_MENU_MISC_2` for commerce, `CONTROL_MENU_BACK` for set info). Calls parent `OnControl` first.
* **Parameters:**  
  - `control` (string) – Input control name.  
  - `down` (boolean) – Whether the button was pressed (`true`) or released (`false`).
* **Returns:** `boolean` – `true` if handled, `false` otherwise.

### `GetHelpText()`
* **Description:** Returns a localized, space-separated string of controller hints for current item (e.g., `"A: Grind"`).
* **Parameters:** None.
* **Returns:** `string` – Action hint text.

### `_CreateScrollingGridItem(context, scroll_index, width, height)`
* **Description:** Creates and configures an `ItemImage` widget for the grid. Sets `ongainfocusfn`, `onlosefocusfn`, click handler, and `UpdateSelectionState`.
* **Parameters:**  
  - `context` (table) – Scroll context (includes `user_profile`, `screen`).  
  - `scroll_index` (number) – Position in the list.  
  - `width`/`height` (number) – Size in pixels.
* **Returns:** `ItemImage` widget.

### `ItemExplorer._ApplyDataToWidget(context, widget, data, index)`
* **Description:** Static helper to bind item `data` to a widget. Calls `ItemImage:ApplyDataToWidget` or `bg:ApplyDataToWidget`.
* **Parameters:**  
  - `context` (table) – Scroll context.  
  - `widget` (Widget) – Target widget.  
  - `data` (table or nil) – Item data.  
  - `index` (number) – List index.
* **Returns:** Nothing.

### `_CreateWidgetDataListForItems(item_table, item_type, activity_checker_fn)`
* **Description:** Internal helper that converts raw `item_table` to a sorted list of item data tables for the grid. Counts inventory ownership, filters by type, applies `yotb_filter`, and sorts by user’s selected mode.
* **Parameters:**  
  - `item_table` (table) – Map of `item_key` → value (value unused).  
  - `item_type` (string) – Required item type filter.  
  - `activity_checker_fn` (function) – Function to determine `is_active` state.
* **Returns:** `table` – Sorted list of item data tables (each with `item_key`, `is_active`, `is_owned`, `owned_count`, `is_dlc_owned`, `acquire_timestamp`).

## Events & listeners
- **Listens to:** None directly via `inst:ListenForEvent` (this is a UI widget, not an entity component).
- **Pushes:** None directly via `inst:PushEvent`. Events are communicated via callbacks (`activity_writer_fn`, `clearSelectionCB`) and `OnClickedItem`/`OnGainGridItemFocus` hooks for external widgets.