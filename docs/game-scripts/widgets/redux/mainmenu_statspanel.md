---
id: mainmenu_statspanel
title: Mainmenu Statspanel
description: Renders the statistics and recent activity summary panel on the main menu, displaying friends, recent items, and M.O.T.D. content.
tags: [ui, mainmenu, stats]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 9415f14e
system_scope: ui
---

# Mainmenu Statspanel

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`MainMenuStatsPanel` is a UI widget responsible for displaying player statistics and recent activity on the main menu screen. It aggregates data from `PlayerHistory`, `Morgue`, and `TheInventory` to present friends, most common deaths (via `FindMostCommonDeaths`), a Message of the Day (M.O.T.D.), and a summary of recently acquired items (skins). It is instantiated during main menu initialization and refreshed when active.

## Usage example
```lua
-- Typically constructed internally by the main menu UI framework.
-- Example of manual instantiation and configuration:
local config = {
    store_cb = function() TheFrontEnd:OpenStore() end,
}
local stats_panel = MainMenuStatsPanel(config)
TheFrontEnd:AddChild(stats_panel)
stats_panel:OnBecomeActive()
```

## Dependencies & tags
**Components used:** `PlayerHistory`, `Morgue`, `TheInventory`, `TheFrontEnd`, `TheNet`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `config` | table | `nil` | Configuration table containing `store_cb` callback for store interaction. |
| `frame` | Widget | `nil` | Root frame container for the panel, created with `TEMPLATES.RectangleWindow`. |
| `image_bg` | ImageButton | `nil` | Background image button for M.O.T.D. area. |
| `image` | ImageButton | `nil` | Optional featured IAP image button. |
| `friend_widgets` | table | `{}` | Array of `Text` widgets displaying up to 3 recent friends. |
| `recent_items` | Widget | `nil` | Container widget holding the recent items summary section. |
| `hide_items` | boolean | `false` | Flag indicating if items should be hidden (e.g., during daily gift pending). |
| `refresh_task` | Task | `nil` | Scheduled task to retry inventory refresh if not ready. |
| `width` | number | `300` | Width used for text layout and alignment. |

## Main functions
### `RefreshFriends()`
*   **Description:** Updates the `friend_widgets` array with names from `PlayerHistory:GetRows()`, showing the most recent friends or a "no friends" placeholder.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnBecomeActive()`
*   **Description:** Called when the panel becomes active (e.g., when returning to the main menu). Refreshes friends list, updates recent items summary via `recent_items:UpdateItems()`, and rechecks the `hide_items` flag.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `FindMostCommonDeaths()`
*   **Description:** Analyzes `Morgue:GetRows()` data to compute the most common causes of death across all player records, sorting them by frequency.
*   **Parameters:** None.
*   **Returns:** `table` — A sorted list of death cause strings (e.g., `"pigman"`, `"klaus"`), in descending order of occurrence count.

### `BuildItemsSummary(width)`
*   **Description:** Constructs and returns a widget for the recent items summary section. Includes dynamic logic to handle offline mode, pending inventory download, missing skins support, and mystery boxes.
*   **Parameters:** `width` (number) — Width used for layout sizing.
*   **Returns:** `Widget` — A widget containing item entries, a "no items" placeholder, and unopened mystery box counter.

### `UpdateItems()` (attached to `new_root`)
*   **Description:** Dynamically updates the recent items list by reading from `TheInventory`. Handles loading states, errors, and displays up to `NUM_RECENT_ITEMS` (`4`) skins by timestamp. Also shows unopened mystery boxes.
*   **Parameters:** None (method is attached to the `new_root` widget returned by `BuildItemsSummary`).
*   **Returns:** Nothing.

### `ScheduleRefresh()`
*   **Description:** Schedules a delayed call to `UpdateItems` after 2 seconds (e.g., while waiting for inventory download to complete). Cancels any existing scheduled task first.
*   **Parameters:** None (method is attached to `new_root` widget).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified (no `inst:ListenForEvent` calls).
- **Pushes:** None identified (no `inst:PushEvent` calls).