---
id: bantab
title: Bantab
description: Manages the ban list UI tab in the server admin screen, allowing administrators to view, delete, or clear banned players.
tags: [ui, server, admin, ban]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: c0df13d4
system_scope: ui
---

# Bantab

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`BanTab` is a UI screen widget that displays and manages the server's ban list. It presents banned players in a scrollable list, supports viewing detailed ban information (via `PlayerDetailsPopup`), opening external network profiles (on supported platforms), deleting individual entries, and clearing the entire ban list. It integrates with `TheNet` for blacklist data synchronization and uses Redux UI templates for consistent styling and layout.

## Usage example
This widget is instantiated and managed internally by the server admin UI system (e.g., `ServerAdminScreen`). Typical external usage does not occur; however, a minimal initialization pattern would be:

```lua
local BanTab = require "widgets/redux/bantab"
local tab = BanTab()
TheFrontEnd:PushScreen(tab)
```

## Dependencies & tags
**Components used:** None — this is a UI widget (not a game entity component).  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `can_view_profile` | boolean | `not IsPS4()` | Whether the current platform supports viewing external net profiles. |
| `root` | `Widget` | — | Root container widget for the screen. |
| `dialog` | `Widget` | — | Main backdrop window container. |
| `ban_page` | `Widget` | — | Content container for ban list and controls. |
| `blacklist` | table (array) | `TheNet:GetBlacklist()` | Local copy of the server’s ban list. |
| `player_scroll_list` | `ScrollingGrid` | — | Scrollable grid of ban entries. |
| `clear_button` | `StandardButton` | — | Button to clear all non-empty ban entries. |
| `allEmpties` | boolean | `true` initially | Tracks whether all blacklist entries are empty placeholders. |

## Main functions
### `MakePlayerList()`
*   **Description:** Constructs and returns a `ScrollingGrid` widget that renders each ban list entry as a row with player name, details button, profile button (conditional), and unban button. Handles focus traversal and dynamic content updates.
*   **Parameters:** None.
*   **Returns:** `ScrollingGrid` widget instance (`self.player_scroll_list`).
*   **Error states:** None.

### `RefreshPlayers()`
*   **Description:** Synchronizes the internal `blacklist` with `TheNet`’s blacklist, pads the list with empty placeholder entries to maintain UI row count, and updates the `clear_button` enabled state based on content.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None.

### `ShowPlayerDetails(selected_player)`
*   **Description:** Opens a `PlayerDetailsPopup` to show ban details (e.g., name, server, date banned) for the selected player entry. Buttons are omitted on non-controller setups to simplify UI flow.
*   **Parameters:** `selected_player` (number) — 1-based index in `self.blacklist`.
*   **Returns:** Nothing.
*   **Error states:** No-op if `selected_player` is `nil` or `self.blacklist[selected_player]` is missing.

### `ShowNetProfile(selected_player)`
*   **Description:** Attempts to open the network profile for the banned player on platforms that support it (e.g., Steam). Calls `TheNet:ViewNetProfile(netid)`.
*   **Parameters:** `selected_player` (number) — 1-based index in `self.blacklist`.
*   **Returns:** Nothing.
*   **Error states:** No-op if `selected_player` is invalid; no explicit validation of `netid` beyond platform capability (`can_view_profile`).

### `PromptDeletePlayer(selected_player)`
*   **Description:** Displays a confirmation dialog before deleting a ban entry. Shows the banned player’s name for clarity.
*   **Parameters:** `selected_player` (number) — 1-based index in `self.blacklist`.
*   **Returns:** Nothing.
*   **Error states:** No-op if `selected_player` is invalid.

### `DeletePlayer(selected_player)`
*   **Description:** Removes the specified ban entry, filters empty placeholders, updates the authoritative blacklist via `TheNet:SetBlacklist()`, and refreshes the UI.
*   **Parameters:** `selected_player` (number) — 1-based index in `self.blacklist`.
*   **Returns:** Nothing.
*   **Error states:** None; safely ignores invalid indices.

### `ClearPlayers()`
*   **Description:** Displays a confirmation dialog to clear all ban entries. On confirmation, clears `self.blacklist`, updates `TheNet`, and refreshes the UI.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None.

### `MakeMenuButtons()`
*   **Description:** Creates and positions the `clear_button`, sets its initial enabled state, and hides it on controller input (to prevent accidental activation).
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None.

## Events & listeners
- **Listens to:** `OnControl` events (handled via `BanTab:OnControl`) — responds to `CONTROL_CANCEL` to close popups and `CONTROL_MENU_MISC_2` (on controllers) to trigger clear list action.  
- **Pushes:** No events — this is a passive UI component relying on modal dialogs (`PopupDialogScreen`, `PlayerDetailsPopup`) for user interaction.