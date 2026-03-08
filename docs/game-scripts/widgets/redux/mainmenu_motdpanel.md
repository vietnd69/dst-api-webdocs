---
id: mainmenu_motdpanel
title: Mainmenu Motdpanel
description: Renders the main menu's message-of-the-day panel, displaying announcements, update notes, and image-rich content with support for multiple panes, navigation bullets, and URL links.
tags: [ui, layout, networking]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: d49bdb5c
system_scope: ui
---

# Mainmenu Motdpanel

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`MotdPanel` is a UI widget that displays the server’s message-of-the-day (MOTD) content in the main menu. It fetches, parses, and renders up to three structured content boxes (one large, two small), handles image downloading indicators, supports sale/new announcement tags, and enables keyboard/controller navigation between multiple announcements using bullet controls. It integrates with `TheFrontEnd.MotdManager` to retrieve and track message state and uses `Stats.PushMetricsEvent` for analytics.

## Usage example
```lua
local MotdPanel = require "widgets/redux/mainmenu_motdpanel"
local panel = MotdPanel({
    x = 0,
    y = 0,
    font = FALLBACK_FONT,
    on_to_skins_cb = function(filter) ShowSkins(filter) end,
    on_no_focusforward = function() return nil end,
})
TheFrontEnd:AddWidget(panel)
```

## Dependencies & tags
**Components used:** None (this is a pure UI widget with no ECS components attached).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `bullets` | table | `{}` | Array of bullet `ImageButton` widgets for navigating between multiple announcements. |
| `selected_bullet_num` | number | `1` | Index of the currently selected bullet/announcement. |
| `config` | table | `{}` | Configuration passed at construction: `x`, `y`, `font`, callback functions. |
| `root` | Widget | — | Root container for all internal widgets. |
| `box_1_widget`, `box_2_widget`, `box_3_widget` | Widget or nil | `nil` | Widgets representing the large and two optional side content boxes. |
| `bullet_root` | Widget or nil | `nil` | Container for navigation bullets when multiple announcements are present. |
| `sync_indicator` | Widget or nil | `nil` | Loading state indicator shown while fetching MOTD. |
| `error_indicator` | Widget or nil | `nil` | Error indicator shown if MOTD fetch fails. |

## Main functions
### `MotdPanel(config)`
*   **Description:** Constructor. Initializes the panel, sets position, and immediately checks whether MOTD is still downloading; if so, shows a syncing indicator and registers a callback, otherwise calls `OnMotdLoaded()` directly.
*   **Parameters:** `config` (table, optional) — includes `x`, `y`, `font`, `on_to_skins_cb`, and `on_no_focusforward`.
*   **Returns:** `MotdPanel` instance.

### `ShowMOTDSyncingIndicator()`
*   **Description:** Displays a centered loading indicator with animated rotation when MOTD is still being downloaded.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ShowMOTDSyncingFailed()`
*   **Description:** Displays an error message if MOTD fetching failed after initial sync attempt.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnMotdLoaded()`
*   **Description:** Main rendering entry point after MOTD data is available. Parses server-provided announcements, builds up to three cell-based content widgets (large primary + optional smaller side panes), handles image loading, bullets, and focus routing. Triggers metrics event on failure. Marks messages as seen unless it’s a new update notice.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `DoFocusHookups()`
*   **Description:** Configures controller/keyboard focus navigation between the primary and secondary content boxes, if they exist and contain visible link buttons.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnControl(control, down)`
*   **Description:** Handles left/right control inputs (`CONTROL_MENU_L2`, `CONTROL_MENU_R2`) to cycle between announcement bullets when multiple exist. Plays a click sound and triggers the associated bullet click handler.
*   **Parameters:** `control` (number) — control code; `down` (boolean) — true if pressed, false if released.
*   **Returns:** `true` if the control was consumed; otherwise delegates to base class.

### `GetHelpText()`
*   **Description:** Returns localized string describing the control needed to switch between messages (e.g., `L2/R2: Change Message`).
*   **Parameters:** None.
*   **Returns:** `string` — localized help text.

## Events & listeners
- **Listens to:** `motd_image_loaded` (via `inst:ListenForEvent`) — fired globally by `TheGlobalInstance` to signal that a particular cell’s image has finished downloading; triggers `OnCellImageLoaded` for the matching cell widget.
- **Pushes:** None.
