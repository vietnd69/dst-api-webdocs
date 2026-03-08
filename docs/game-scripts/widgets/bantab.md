---
id: bantab
title: Bantab
description: Manages the ban list UI tab for managing banned players in the server admin interface, including displaying ban entries, viewing player details, and deleting or clearing bans.
tags: [ui, server, admin, network]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: b5ae5da1
system_scope: ui
---

# Bantab

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`BanTab` is a UI widget component that implements the ban list tab of the server admin screen. It displays a scrollable list of banned players with their names, characters, server metadata, and action buttons (View Details, View Profile, Unban). It also provides functionality to delete individual ban entries or clear the entire ban list. It interacts with the `TheNet` service to read/write the server’s blacklist and integrates with `TheFrontEnd` to present modal dialogs.

## Usage example
```lua
-- Typically instantiated internally by the server admin screen
local banTab = BanTab(serverCreationScreen)
TheFrontEnd:AddScreen(banTab)
-- Internally refreshes the ban list from TheNet
banTab:RefreshPlayers()
```

## Dependencies & tags
**Components used:** None (this is a UI widget, not a game entity component).  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `servercreationscreen` | table or `nil` | `nil` | Reference to the parent server creation screen; used to navigate focus. |
| `ban_page` | `Widget` | — | Root container for the tab’s UI elements. |
| `blacklist` | table | `TheNet:GetBlacklist()` | Current list of banned player entries, updated via `TheNet:SetBlacklist`. |
| `player_scroll_list` | `ScrollableList` | — | Scrollable list widget rendering ban entries. |
| `clear_button` | `IconButton` | — | Button to clear the entire ban list (controller-only). |
| `ban_page_row_root` | `Widget` | — | Container widget for individual ban row widgets. |
| `banned_player_widgets` | table | `{} | — Pre-allocated list of row widgets used by `ScrollableList`. |

## Main functions
### `MakePlayerPanel()`
* **Description:** Creates and initializes the player list panel UI container (`player_list_rows`) and calls `MakePlayerList()` to populate it.
* **Parameters:** None.
* **Returns:** Nothing.

### `MakePlayerList()`
* **Description:** Constructs the scrollable list of banned players, creating row widgets for each entry. Each row displays the ban entry’s name and provides action buttons. Supports empty slots if the list is shorter than the view size.
* **Parameters:** None.
* **Returns:** Nothing.

### `RefreshPlayers()`
* **Description:** Updates the scroll list to reflect changes in the `blacklist`, re-syncs the view count with the list length, and toggles the `clear_button` enabled state depending on whether any non-empty entries exist.
* **Parameters:** None.
* **Returns:** Nothing.

### `ShowPlayerDetails(selected_player)`
* **Description:** Opens a `PlayerDetailsPopup` screen for the banned player at the given index, showing full ban details (name, server info, date).
* **Parameters:** `selected_player` (number) — 1-based index into `self.blacklist`.
* **Returns:** Nothing.
* **Error states:** No effect if `selected_player` is invalid or entry is missing.

### `ShowNetProfile(selected_player)`
* **Description:** Triggers the platform’s native network profile viewer (e.g., Steam/PSN/Xbox profile) for the player at the given index.
* **Parameters:** `selected_player` (number) — 1-based index into `self.blacklist`.
* **Returns:** Nothing.
* **Error states:** No effect if `selected_player` is invalid or the player’s `netid` is invalid (`TheNet:IsNetIDPlatformValid` returns `false`).

### `PromptDeletePlayer(selected_player)`
* **Description:** Displays a confirmation dialog to delete the ban entry at the given index. If confirmed, calls `DeletePlayer`.
* **Parameters:** `selected_player` (number) — 1-based index into `self.blacklist`.
* **Returns:** Nothing.

### `DeletePlayer(selected_player)`
* **Description:** Removes the ban entry at the given index from `self.blacklist`, filters out empty placeholders, and saves the cleaned list via `TheNet:SetBlacklist`. Then calls `RefreshPlayers`.
* **Parameters:** `selected_player` (number) — 1-based index into `self.blacklist`.
* **Returns:** Nothing.

### `ClearPlayers()`
* **Description:** Displays a confirmation dialog to clear the entire ban list. If confirmed, clears `self.blacklist`, updates `TheNet`, and refreshes the UI.
* **Parameters:** None.
* **Returns:** Nothing.

### `MakeMenuButtons()`
* **Description:** Creates and positions the `clear_button` for clearing all ban entries. Conditionally hides the button on controller input (per platform conventions) and sets focus navigation behavior.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `CONTROL_MENU_MISC_2` — triggers `ClearPlayers()` when released on controller (if no mouse tracking).  
- **Pushes:** None.