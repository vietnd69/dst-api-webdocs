---
id: loadersexplorerpanel
title: LoadersExplorerPanel
description: A UI widget that displays and manages a multi-select explorer for loading skins, including filtering, sorting, and preview functionality.
tags: [ui, skin, explorer, filtering]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: b0360988
system_scope: ui
---

# LoadersExplorerPanel

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`LoadersExplorerPanel` is a UI widget that presents a grid-based explorer interface for selecting loading skins (collectible cosmetic items). It uses `ItemExplorer` for item display, `FilterBar` for filtering and sorting, and a preview `Image` widget to show the currently selected item's appearance. It is designed specifically for the loading screen and integrates with skin utility functions to fetch textures and apply filters.

## Usage example
```lua
local panel = LoadersExplorerPanel(player_inst, user_profile)
panel:SetPosition(0, 0)
self:AddChild(panel)
panel:OnShow()
local selected_items = panel._GetCurrentLoaders()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | `nil` | The entity that owns the panel (typically the player). |
| `user_profile` | table | `nil` | User profile data for skin selection context. |
| `preview_root` | Widget | `nil` | Container widget for the preview image. |
| `preview` | Image | `nil` | Image widget used to display the currently selected loader skin. |
| `picker` | ItemExplorer | `nil` | The explorer widget displaying the grid of loader skins. |
| `filter_bar` | FilterBar | `nil` | Filter and sorter control bar attached to the picker header. |
| `focus_forward` | Widget | `nil` | The widget that receives focus next. |

## Main functions
### `_DoFocusHookups()`
*   **Description:** Configures focus navigation by linking the picker header's forward focus to the filter bar.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `_GetCurrentLoaders()`
*   **Description:** Retrieves the keys of all currently selected items in the picker.
*   **Parameters:** None.
*   **Returns:** `table` — a list of item keys (strings) corresponding to selected loader skins.

### `OnClickedItem(item_data, is_selected)`
*   **Description:** Updates the preview image texture when an item is clicked, using the skin utility function `GetLoaderAtlasAndTex` to fetch the appropriate atlas and texture.
*   **Parameters:**  
    `item_data` (table) — item metadata including `item_key`.  
    `is_selected` (boolean) — whether the item is being selected or deselected (currently unused in implementation).
*   **Returns:** Nothing.

### `OnShow()`
*   **Description:** Called when the panel becomes visible; refreshes filter state and calls base `OnShow`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `_BuildItemExplorer()`
*   **Description:** Constructs and returns a configured `ItemExplorer` instance for the loading skins collection.
*   **Parameters:** None.
*   **Returns:** `ItemExplorer` — an instance with multi-select mode, configured dimensions, and scroll behavior.
*   **Error states:** May fail if required constants (`MISC_ITEMS`, `STRINGS.UI.COLLECTIONSCREEN.LOADERS`) are missing or invalid.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified