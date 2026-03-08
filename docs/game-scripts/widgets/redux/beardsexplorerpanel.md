---
id: beardsexplorerpanel
title: Beardsexplorerpanel
description: A UI panel for browsing, selecting, and previewing beard items, integrating an item explorer, filter bar, and dynamic skin puppet preview.
tags: [ui, skin, exploration, character, preview]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 1f3d228c
system_scope: ui
---

# Beardsexplorerpanel

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`BeardsExplorerPanel` is a UI widget responsible for displaying and managing beard item selection and preview in the character customization screen. It embeds an `ItemExplorer` to list beard items, a `FilterBar` for filtering and sorting, and a `Puppet` to render a live preview of the selected beard on a character model. It ties together user input, item data, and visual feedback in a cohesive skin/beard selection interface.

## Usage example
```lua
local panel = BeardsExplorerPanel(owner_entity, user_profile)
panel:OnShow() -- activates the panel and refreshes filters
-- User interacts with the panel (e.g., selects beard via mouse or keyboard)
panel.puppet:SetBeard("beard_default2") -- programmatically set beard
```

## Dependencies & tags
**Components used:** None (this is a pure UI widget; no components attached via `inst:AddComponent`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | `nil` | The entity that owns or manages this panel (e.g., the screen instance). |
| `user_profile` | object | `nil` | User profile object containing saved skins and item ownership data. |
| `character` | string | `"wilson"` | The current character ID being previewed; updated when a different character's beard is selected. |
| `puppet_root` | Widget | Created in constructor | Root container widget for the puppet preview. |
| `puppet` | Puppet | Created in constructor | Skin puppet instance used to render character and beard visuals. |
| `beard_len_selector` | Spinner | Created via `TEMPLATES.StandardSpinner` | Spinner control for selecting beard length (1–3). |
| `picker` | ItemExplorer | Created by `_BuildItemExplorer()` | Item explorer widget listing beard items. |
| `filter_bar` | FilterBar | Created in constructor | Container for filters (owned, weaveable), sorters, and search input. |
| `focus_forward` | widget | `self.beard_len_selector` | Default widget to receive focus when panel gains focus. |

## Main functions
### `:OnShow()`
* **Description:** Called when the panel becomes visible. Triggers the filter bar to refresh its internal filter state, ensuring UI controls reflect current filter settings.
* **Parameters:** None.
* **Returns:** Nothing.

### `:OnClickedItem(item_data, is_selected)`
* **Description:** Handles item selection from the `ItemExplorer`. Updates the preview character (`self.character`) if a non-default beard is selected, loads the character’s full skin set, and applies the selected beard to the puppet.
* **Parameters:**  
  `item_data` (table) – Item data containing `item_key` (e.g., `"willow_bea1"`), used to determine the character and beard ID.  
  `is_selected` (boolean) – Whether the item was selected (currently unused in implementation).
* **Returns:** Nothing.
* **Error states:** If `item_key` lacks underscore (e.g., malformed key), `string.find(...)` may return `nil`, leading to incorrect character extraction — but no explicit error handling is present.

### `:OnUpdate(dt)`
* **Description:** Called every frame to update puppet animations, including emotes. Ensures the preview remains responsive to time-based animations.
* **Parameters:**  
  `dt` (number) – Delta time since the last frame.
* **Returns:** Nothing.

### `_BuildItemExplorer()`
* **Description:** Internal helper to construct the `ItemExplorer` for beard items. Configures layout, scroll context, and item metadata.
* **Parameters:** None.
* **Returns:** `ItemExplorer` instance configured for beard item display.

### `_DoFocusHookups()`
* **Description:** Sets up keyboard navigation focus transitions between panel controls.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (this widget does not register `inst:ListenForEvent` calls internally; it inherits event handling from parent widgets if any.)
- **Pushes:** None (no `inst:PushEvent` calls are present in the code.)