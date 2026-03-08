---
id: portraitbackgroundexplorerpanel
title: PortraitBackgroundExplorerPanel
description: Manages the UI panel for selecting and previewing player portrait backgrounds, integrating a character spinner, item picker, and filter bar for skin customization.
tags: [ui, portrait, skin, exploration, filter]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 3acc000c
system_scope: ui
---

# PortraitBackgroundExplorerPanel

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`PortraitBackgroundExplorerPanel` is a UI widget that provides an interface for browsing and selecting portrait background items. It combines a character portrait preview (`PlayerAvatarPortrait`), a character selection spinner (`TEMPLATES.CharacterSpinner`), and an item explorer (`ItemExplorer`) with filtering and sorting capabilities. It is used in contexts such as the wardrobe or profile customization screens to let players preview background skins on their character avatar.

## Usage example
```lua
local PortraitBackgroundExplorerPanel = require "widgets/redux/portraitbackgroundexplorerpanel"
local user_profile = someUserProfileTable
local owner = someOwnerEntity

local panel = PortraitBackgroundExplorerPanel(owner, user_profile)
-- Add panel to a parent container to display
parent:AddChild(panel)
panel:OnShow() -- Ensure initial state is populated and preview is refreshed
```

## Dependencies & tags
**Components used:** None (this is a pure widget; no ECS components are used)
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `GenuineEntity` | `nil` | The entity that owns the profile/data context; used for access to inventory and preferences. |
| `user_profile` | `table` | `nil` | User profile table containing flair, selection state, and ownership data. |
| `puppet_root` | `Widget` | instance | Root container widget for positioning the avatar puppet. |
| `puppet` | `PlayerAvatarPortrait` | instance | Avatar preview widget displaying the character with selected background. |
| `heroselector` | `Widget` (CharacterSpinner) | instance | Spinner for selecting the active character. |
| `picker` | `ItemExplorer` | instance | Item grid explorer for selecting background items. |
| `filter_bar` | `FilterBar` | instance | UI bar managing filters and search for the item picker. |

## Main functions
### `_GetCurrentCharacter()`
*   **Description:** Retrieves the name of the currently selected character from the character spinner.
*   **Parameters:** None.
*   **Returns:** `string` — the name (key) of the selected character.

### `_GetCurrentBackground()`
*   **Description:** Retrieves the item key of the currently selected background item in the item picker. Returns `nil` if no background is selected.
*   **Parameters:** None.
*   **Returns:** `string?` — the `item_key` of the selected background, or `nil`.

### `OnChangedCharacter(selected)`
*   **Description:** Callback invoked when the character selection changes. Triggers a refresh of the preview to ensure correct background state.
*   **Parameters:** `selected` — the newly selected character data (used only for triggering update).
*   **Returns:** Nothing.

### `OnShow()`
*   **Description:** Initializes the panel when displayed. Loads last-selected character, refreshes filter state, and updates the preview.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `_RefreshPreview()`
*   **Description:** Updates the avatar puppet's rank and background based on current selection and profile state.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnClickedItem(item_data, is_selected)`
*   **Description:** Handles clicks on background items in the picker. Applies the selected background to the puppet or clears it.
*   **Parameters:**  
  - `item_data` (table) — contains at least `item_key` and `is_owned`.  
  - `is_selected` (boolean) — true if the item was just selected; false if deselected or clicked while already selected.  
*   **Returns:** Nothing.

### `_SetRank()`
*   **Description:** Sets the rank displayed on the avatar puppet based on the most recently selected flair and the active world level.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `_BuildItemExplorer()`
*   **Description:** Constructs and returns an `ItemExplorer` instance preconfigured for portrait background items, using `MISC_ITEMS` as the data source.
*   **Parameters:** None.
*   **Returns:** `ItemExplorer` — fully configured item picker widget.

### `OnUpdate(dt)`
*   **Description:** Updates the puppet's emote animation state during each frame.
*   **Parameters:** `dt` (number) — delta time since last frame.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent()` calls are present).
- **Pushes:** None (no `inst:PushEvent()` calls are present).