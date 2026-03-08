---
id: lavaarena_communityhistory_panel
title: Lavaarena Communityhistory Panel
description: Displays community unlock progression for the Lava Arena event, showing unlock status of bosses, items, and creatures based on server-wide progress.
tags: [ui, progression, event, lavaarena]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 4dbc01b1
system_scope: ui
---

# Lavaarena Communityhistory Panel

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`CommunityProgress` is a UI widget component that renders a panel showing the community-wide unlock history for the Lava Arena event. It queries `Lavaarena_CommunityProgression` to retrieve and display unlocked or locked content (bosses, items, creatures) in a grid layout. It listens for `community_clientdata_updated` events to refresh its contents when new data arrives from the server and gracefully handles query failures and missing data.

## Usage example
```lua
local progress_panel = require("widgets/redux/lavaarena_communityhistory_panel")
local panel_instance = progress_panel()
-- Typically added to a parent widget or screen
parent_widget:AddChild(panel_instance)
-- Data populates automatically upon initialization or when `community_clientdata_updated` fires
```

## Dependencies & tags
**Components used:** None (this is a pure UI widget; it interacts with the `Lavaarena_CommunityProgression` component globally)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `root` | Widget | Created in constructor | Root container widget for all UI elements. Position offset by `(12, 0)`. |
| `details_root` | Widget | `nil` until populated | Container for the unlock details grid. Set during data population. |

## Main functions
### `ShowSyncing()`
*   **Description:** Clears the root container and displays a "Syncing data..." message to indicate the UI is waiting for progression data.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnRecievedData()`
*   **Description:** Refreshes the UI panel based on the latest progression data. Shows either the success state with unlock details, or an error message if the query failed. Handles both active and inactive festival modes.
*   **Parameters:** None (implicitly triggered by event handler or direct call).
*   **Returns:** Nothing.
*   **Error states:** Displays failure message if `Lavaarena_CommunityProgression:GetProgressionQuerySuccessful()` returns `false`.

### `BuildDetailsPanel()`
*   **Description:** Constructs and returns a widget containing a 2-column grid of unlock entries (locked/unlocked). Skips the first entry in the unlock order (commonly a placeholder or initial item).
*   **Parameters:** None.
*   **Returns:** `Widget` — A child widget containing the grid of unlock detail entries.
*   **Layout details:** Uses `detail_width = 375`, `detail_height = 70`, `spacing_x = 25`, `spacing_y = 15` for positioning.

### `MakeDetailsEntry(item)`
*   **Description:** Helper that constructs a single unlock entry (a card) for a given unlockable item. The entry visually differs for locked and unlocked states, including icon, title, description (for unlocked only), and scaling.
*   **Parameters:** `item` (table) — Expected to contain at least `id`, `style`, and optionally `icon`, `atlas`.
*   **Returns:** `Widget` — A widget representing the single unlock entry.

## Events & listeners
- **Listens to:** `community_clientdata_updated` (on `TheGlobalInstance`) — Triggers `OnRecievedData()` to refresh panel contents.
- **Pushes:** None.