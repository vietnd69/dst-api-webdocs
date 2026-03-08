---
id: profileflairexplorerpanel
title: Profileflairexplorerpanel
description: Manages the UI panel for selecting and previewing player profile flair items in the Redux UI framework.
tags: [ui, inventory, character, skin, profile]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 5498e41c
system_scope: ui
---

# Profileflairexplorerpanel

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`ProfileFlairExplorerPanel` is a Redux-based UI widget responsible for presenting and managing profile flair item selection for a given player profile. It displays a character portrait puppet that updates to reflect the currently selected flair, and provides a scrolling explorer list with filtering, sorting, and search capabilities. It integrates with `PlayerAvatarPortrait`, `ItemExplorer`, `FilterBar`, and profile-related utility functions (`wxputils`, `GetMostRecentlySelectedItem`) to synchronize UI state with user-selected profile flair.

## Usage example
```lua
local panel = ProfileFlairExplorerPanel(owner, user_profile)
self:AddChild(panel)
panel:OnShow() -- initialize and load saved selection
```

## Dependencies & tags
**Components used:** None (this is a UI widget, not a component)
**Tags:** `owned_filter`, `weaveableFilter`, `lockedFilter` (used via filter states)
**External modules used:** `ItemExplorer`, `FilterBar`, `PlayerAvatarPortrait`, `Widget`, `TEMPLATES`, `dlcsupport`, `misc_items`, `util`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity or nil | `nil` | The entity instance that owns this panel (typically the HUD or screen entity). |
| `user_profile` | table | `nil` | The user profile table containing saved selections and inventory state. |
| `puppet_root` | Widget | `nil` | Root container widget for positioning the puppet and spinner. |
| `puppet` | PlayerAvatarPortrait | `nil` | The portrait component that renders the character with flair applied. |
| `heroselector` | Widget | `nil` | Character spinner widget used to switch characters. |
| `picker` | ItemExplorer | `nil` | The explorer panel listing available profile flairs. |
| `filter_bar` | FilterBar | `nil` | Filter bar container for_owned_, _weaveable, sort, and search controls. |
| `focus_forward` | Widget | `nil` | Widget to receive focus when moving right from this panel. |

## Main functions
### `_BuildItemExplorer()`
*   **Description:** Constructs and returns an `ItemExplorer` instance configured for profile flair items. Sets up layout, scroll context, and item list parameters.
*   **Parameters:** None.
*   **Returns:** `ItemExplorer` — a configured explorer widget.

### `OnChangedCharacter(selected)`
*   **Description:** Called when the character spinner selection changes. Triggers a refresh of the flair preview for the new character.
*   **Parameters:** `selected` (table) — data for the newly selected character.
*   **Returns:** Nothing.

### `OnShow()`
*   **Description:** Initializes the panel when shown. Loads the last selected character from profile, refreshes filter state, and updates the flair preview.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `_RefreshPreview()`
*   **Description:** Updates the `puppet` with the currently selected background portrait and applies the selected flair (if any). Called during initialization and after character changes.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnClickedItem(item_data, is_selected)`
*   **Description:** Handles clicks on flair items in the explorer. Applies or removes the flair on the puppet depending on selection state.
*   **Parameters:**  
  * `item_data` (table) — item data including `item_key`, `is_owned`, etc.  
  * `is_selected` (boolean) — whether the item is currently selected.  
*   **Returns:** Nothing.

### `_SetProfileFlair(item_key)`
*   **Description:** Applies the specified flair item to the `puppet`. If `nil`, removes any flair.
*   **Parameters:** `item_key` (string or nil) — the unique key identifying the flair item to apply.
*   **Returns:** Nothing.

### `_GetCurrentCharacter()`
*   **Description:** Returns the name of the currently selected character from the spinner.
*   **Parameters:** None.
*   **Returns:** `string` — the name of the selected character.

### `_GetCurrentBackground()`
*   **Description:** Returns the item key of the currently selected flair background from the picker.
*   **Parameters:** None.
*   **Returns:** `string or nil` — the `item_key` of the selected flair, or `nil` if none selected.

### `OnUpdate(dt)`
*   **Description:** Called every frame to update the puppet’s emote animation.
*   **Parameters:** `dt` (number) — delta time in seconds.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None explicitly (event handling is deferred to child widgets like `ItemExplorer` and `FilterBar`).
- **Pushes:** None directly; relies on internal callbacks (`OnShow`, `OnChangedCharacter`, etc.) for state updates.