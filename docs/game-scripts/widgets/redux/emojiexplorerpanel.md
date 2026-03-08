---
id: emojiexplorerpanel
title: Emojiexplorerpanel
description: A UI panel for exploring and selecting emoji items in the collection screen, built on top of the generic ItemExplorer system.
tags: [ui, emoji, collection]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 9e187025
system_scope: ui
---

# Emojiexplorerpanel

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`EmojiExplorerPanel` is a UI widget that displays and manages emoji items in the collection screen. It extends `Widget` and wraps an `ItemExplorer` instance configured specifically for emoji content. It integrates with a `FilterBar` to provide filtering, sorting, and search functionality, enabling players to browse owned, weavable, and searchable emoji items.

## Usage example
```lua
local emoji_panel = EmojiExplorerPanel(owner, user_profile)
emoji_panel:OnShow()
-- The panel will automatically render emoji items and handle filtering/sorting via its embedded ItemExplorer and FilterBar.
```

## Dependencies & tags
**Components used:** `ItemExplorer`, `FilterBar`, `Widget`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity (player) | `nil` | The entity that owns the emoji collection (typically the player instance). |
| `user_profile` | table | `nil` | User profile data, passed through to the item explorer for context. |
| `picker` | ItemExplorer instance | `nil` | The underlying item explorer widget that renders emoji items. |
| `filter_bar` | FilterBar instance | `nil` | The filter/sort/search control bar attached to the picker header. |

## Main functions
### `:OnShow()`
* **Description:** Called when the panel becomes visible. Refreshes the filter state of the embedded filter bar to ensure UI reflects current emoji availability.
* **Parameters:** None.
* **Returns:** Nothing.

### `:OnChangedCharacter(selected)`
* **Description:** Placeholder method (hook) intended for override; currently has no effect. Meant to handle character-switching events in other explorer panels.
* **Parameters:** `selected` (any) — character or data selection state.
* **Returns:** Nothing.

### `:OnClickedItem(item_data, is_selected)`
* **Description:** Placeholder method (hook) intended for override; currently has no effect. Meant to respond to emoji item selection events.
* **Parameters:**  
  - `item_data` (table) — Data for the clicked emoji item.  
  - `is_selected` (boolean) — Whether the item is now selected.
* **Returns:** Nothing.

### `:_GetCurrentEmoji()`
* **Description:** Returns the keys of currently selected emoji items from the picker.
* **Parameters:** None.
* **Returns:** `table` — A table of keys (typically strings) representing selected emoji items, or an empty table if none selected.

### `:_GetCurrentCharacter()`
* **Description:** Returns the currently selected character (via `self.heroselector`), though `heroselector` is not initialized in this class — likely a placeholder for consistency with sibling panels.
* **Parameters:** None.
* **Returns:** `nil` — Always returns `nil` since `heroselector` is not defined in this context.

### `:_BuildItemExplorer()`
* **Description:** Internal method to construct the `ItemExplorer` widget instance with emoji-specific configuration.
* **Parameters:** None.
* **Returns:** `ItemExplorer` instance — configured to display emoji items from `EMOJI_ITEMS`, with custom sizing, scroll context, and layout options.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.