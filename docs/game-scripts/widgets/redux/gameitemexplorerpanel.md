---
id: gameitemexplorerpanel
title: Gameitemexplorerpanel
description: A UI panel for displaying and exploring collectible game items (e.g., skins) with filtering, selection, and details view.
tags: [ui, inventory, skin, collection]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 3693ce3e
system_scope: ui
---

# Gameitemexplorerpanel

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`GameItemExplorerPanel` is a `Widget`-based UI component that provides an interface for browsing and inspecting collectible game items (primarily wearable skins). It integrates with `ItemExplorer` to display items in a scrollable grid, and `FilterBar` to support filtering (owned/locked, weaveable) and search/sort. When an item is selected, it dynamically updates a details panel showing the item's visual representation and usage information.

## Usage example
```lua
local GameItemExplorerPanel = require "widgets/redux/gameitemexplorerpanel"

local panel = GameItemExplorerPanel(owner, profile)
-- The panel is typically added to a screen's widget hierarchy:
screen:AddChild(panel)
-- Filtering, sorting, and selection occur through user interaction; no additional setup required.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds no tags directly; uses `FilterBar`, `ItemExplorer`, and `AccountItemFrame` via composition.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | `nil` | The entity (typically a player) for which the item list is gathered. |
| `user_profile` | table | `nil` | The user profile containing unlocked/collection state. |
| `picker` | ItemExplorer | `nil` | The scrollable item picker widget. |
| `filter_bar` | FilterBar | `nil` | The filter/sort/search control bar. |
| `details_panel` | Widget | `nil` | The panel that displays details of the currently selected item. |
| `current_item_type` | string | `nil` | The type key of the currently selected item. |

## Main functions
### `DoInit()`
* **Description:** Initializes the panel by creating the fixed root container and building the inventory list and details panel.
* **Parameters:** None.
* **Returns:** Nothing.

### `BuildInventoryList()`
* **Description:** Constructs the `ItemExplorer` picker widget, configures its layout (grid size, scroll settings), and sets up a callback to hide the details panel when selection is cleared.
* **Parameters:** None.
* **Returns:** Nothing.

### `BuildDetailsPanel()`
* **Description:** Creates and positions the details panel, including image root, item frame (`AccountItemFrame`), shadow, and text root for descriptive info.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnClickedItem(item_data, is_selected)`
* **Description:** Updates the details panel when an item is selected in the list. Sets the displayed item, adjusts the shadow scale based on item type (`base`, `body`, `item`, etc.), and updates the "Usable on" description string.
* **Parameters:**  
  `item_data` (table) — Contains item metadata, including `item_key`.  
  `is_selected` (boolean) — Whether the item is newly selected.  
* **Returns:** Nothing.
* **Error states:** Returns early (no action) if `GetTypeForItem(item_data.item_key)` fails to resolve `type` or `item_type`.

### `OnShow()`
* **Description:** Overrides the base `OnShow` to refresh the filter bar state when the panel becomes visible.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
None identified. The component relies on `ItemExplorer` for internal item selection events and uses callback assignments (`clearSelectionCB`, `filter_bar:BuildFocusFinder()`) rather than event listeners.