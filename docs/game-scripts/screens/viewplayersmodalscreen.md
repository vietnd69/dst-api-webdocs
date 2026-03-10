---
id: viewplayersmodalscreen
title: Viewplayersmodalscreen
description: Displays a modal screen listing connected players with profile interaction capabilities.
tags: [ui, network, player, modal]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: d3f9546c
system_scope: ui
---

# Viewplayersmodalscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`Viewplayersmodalscreen` is a UI screen class that presents a scrollable list of currently connected players in the server lobby or main menu. It fetches player metadata (e.g., name, prefab, color, performance stats, event level) and renders each entry with a character badge, name, and a profile view button (where supported). It supports keyboard, mouse, and console controller inputs and adapts UI behavior based on platform constraints (e.g., PS4, Xbox One). The screen is typically used as a popup modal to provide player information without leaving the main menu context.

## Usage example
```lua
local players = {
    {
        name = "Walter",
        prefab = "walter",
        colour = { r=0.2, g=0.4, b=0.8, a=1 },
        netid = "1234567890abcdef",
        eventlevel = 5,
        userflags = 0
    },
    {
        name = "Wendy",
        prefab = "wendy",
        colour = { r=0.2, g=0.2, b=0.8, a=1 },
        netid = "0987654321fedcba",
        eventlevel = 3,
        userflags = 0
    }
}
TheFrontEnd:PushScreen(Viewplayersmodalscreen(players, 16))
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `players` | table | `{}` | List of player data tables (name, prefab, colour, netid, etc.) |
| `max_players` | string | `"?"` | String representation of server capacity (e.g., `"8/16"`) |
| `black` | Image | nil | Background tint widget instance |
| `root` | Widget | nil | Root container for the screen layout |
| `dialog` | Widget | nil | CurlyWindow container holding the modal UI body |
| `players_number` | Text | nil | Text widget displaying player count (e.g., `2/16`) |
| `numPlayers` | number | `0` | Cached count of players in the list |
| `player_widgets` | table | `{}` | Array of widget instances for each player entry |
| `list_root` | Widget | nil | Container widget for the scrollable list |
| `scroll_list` | ScrollableList | nil | Scrollable list widget rendering player entries |
| `empty_server_text` | Text | nil | Text shown when no players are connected |
| `default_focus` | Widget | nil | Focus target widget for initial focus (platform-dependent) |

## Main functions
### `Cancel()`
* **Description:** Closes the screen by popping it from the frontend stack.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Handles screen-level input events, including the cancel action and platform-specific controls (e.g., Xbox profile view via back button). Delegates focus navigation and standard screen control handling.
* **Parameters:**  
  `control` (number) — Control enum identifier (e.g., `CONTROL_CANCEL`).  
  `down` (boolean) — Whether the control was pressed (`true`) or released (`false`).  
* **Returns:** `true` if the control event was consumed; otherwise `false`.

### `GetHelpText()`
* **Description:** Returns a localized help string describing available actions for the current input device (e.g., keyboard/mouse or controller).
* **Parameters:** None.
* **Returns:** `string` — Concatenated help text, e.g., `"ESC Back"` or `"ESC Back  X Button View Gamer Card"`.

## Events & listeners
- **Listens to:** None  
- **Pushes:** None