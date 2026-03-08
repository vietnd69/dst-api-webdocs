---
id: emotesexplorerpanel
title: Emotesexplorerpanel
description: Provides a UI panel for browsing and previewing emote items with character selection and filtering capabilities.
tags: [ui, emote, inventory, selection, filtering]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 4efcb137
system_scope: ui
---

# Emotesexplorerpanel

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`EmotesExplorerPanel` is a UI widget that displays emote items in a scrollable grid, allows character selection for previewing, and supports filtering and sorting. It integrates with `ItemExplorer` to render emote items, `Puppet` for character animation preview, and `FilterBar` for filtering by owned/locked/weaveable states and search terms. It is typically used in the wardrobe or collection screen context.

## Usage example
```lua
local panel = EmotesExplorerPanel(owner, user_profile)
screen:AddChild(panel)
panel:OnShow() -- Initialize and load saved selection state
```

## Dependencies & tags
**Components used:** None (this is a pure UI widget; no entity components are accessed).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | Entity or nil | `nil` | The entity that owns the emote items (used for inventory checks). |
| `user_profile` | table | `nil` | User profile data used for loading saved selections and persistence. |
| `puppet_root` | Widget | `nil` | Container widget for the character puppet. |
| `puppet` | Puppet | `nil` | The animated character model used for emote preview. |
| `heroselector` | Widget (CharacterSpinner) | `nil` | Character selection UI component. |
| `picker` | ItemExplorer | `nil` | Widget managing the grid display of emote items. |
| `filter_bar` | FilterBar | `nil` | Widget housing filters and search. |

## Main functions
### `OnShow()`
*   **Description:** Called when the panel becomes visible. Loads the last selected character from `user_profile`, and refreshes the filter state.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnClickedItem(item_data, is_selected)`
*   **Description:** Plays the emote animation associated with the clicked item on the puppet preview.
*   **Parameters:**  
    `item_data` (table) - Item data from the `ItemExplorer`, must contain `item_key`.  
    `is_selected` (boolean) - Whether the item was newly selected.
*   **Returns:** Nothing.
*   **Error states:** Uses `EMOTE_ITEMS[item_data.item_key]` without null-safety; may fail if `item_key` is missing or invalid.

### `OnUpdate(dt)`
*   **Description:** Updates the puppet animation state every frame.
*   **Parameters:** `dt` (number) - Delta time since last frame.
*   **Returns:** Nothing.

### `_GetCurrentCharacter()`
*   **Description:** Returns the currently selected character data.
*   **Parameters:** None.
*   **Returns:** Table — the selected character data from `heroselector`.

### `_GetCurrentEmotes()`
*   **Description:** Returns a list of keys for currently selected emotes.
*   **Parameters:** None.
*   **Returns:** Table — list of `item_key` strings from selected items in the picker.

## Events & listeners
- **Listens to:** None identified in this widget's definition.
- **Pushes:** None identified in this widget's definition.