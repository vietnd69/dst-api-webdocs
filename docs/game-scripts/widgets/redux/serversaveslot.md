---
id: serversaveslot
title: Serversaveslot
description: Renders a UI slot representing a saved server world in the server management screens, displaying metadata and enabling navigation or deletion.
tags: [ui, server, save, management]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: adac5151
system_scope: ui
---

# Serversaveslot

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`ServerSaveSlot` is a UI widget responsible for visualizing individual saved server worlds in the server creation and slot management screens. It displays server metadata (name, description, day/season, preset, playstyle, privacy type, etc.), icons for enabled features (cloud saves, mods, PvP), and supports user interaction such as selecting a slot to create a server or delete/modify a slot. It depends on external UI screens (`ServerCreationScreen`, `ManageServerSlotScreen`, `PopupDialogScreen`) and uses `ShardSaveGameIndex` to access saved world data.

## Usage example
```lua
local ServerSaveSlot = require("widgets/redux/serversaveslot")
local serverslotscreen = ... -- instance of a screen deriving from ServerSlotScreenBase

local save_slot = ServerSaveSlot(serverslotscreen, false) -- false = not in creation screen
save_slot:SetSaveSlot(1, some_server_data) -- populate slot 1 with data
save_slot:SetPosition(x, y)
screen:AddChild(save_slot)
```

## Dependencies & tags
**Components used:** None directly — it is a UI widget and does not use ECS components.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `serverslotscreen` | table | `nil` | Reference to the parent screen (`ServerSlotScreenBase` derivative) that manages this slot. |
| `isservercreationscreen` | boolean | `false` | Flag indicating whether this slot is part of the server creation screen (affects behavior and UI layout). |
| `slot` | number or `nil` | `-1` initially | The save slot index currently displayed; set via `SetSaveSlot`. |
| `root` | Widget | `nil` | Root container widget holding all visual elements. |
| `frame`, `frame_focused` | Image | `nil` | Static and hover frames used for visual feedback. |
| `server_name`, `server_desc` | Text | `nil` | Display fields for server name and description. |
| `character_portrait` | Widget | `nil` | Container with portrait image and background for the server's world character. |
| `day_and_season`, `preset` | Text | `nil` | Display fields for current day/season and world preset. |
| `privacy`, `playstyle`, `pvp`, `mods`, `cloud`, `offline` | Widget | `nil` | Detail icons/buttons and text fields representing server configuration. |
| `manageslot` | IconButton | `nil` | Manage button (only visible in non-creation mode). |
| `onclick` | function | `nil` | Callback triggered on click to launch `ServerCreationScreen`. |

## Main functions
### `SetSaveSlot(slot, server_data)`
*   **Description:** Populates the slot UI with data from `ShardSaveGameIndex` for the given slot index. If `server_data` is provided directly, it is used instead of fetching from index.
*   **Parameters:** 
    *   `slot` (number or `nil`) — the save slot index (e.g., `1`, `2`). If `nil` or empty and no `server_data`, the slot is hidden.
    *   `server_data` (table or `nil`) — optional override for server metadata (name, description, privacy, etc.).
*   **Returns:** Nothing.
*   **Error states:** If `slot` is `nil` and `server_data` is also `nil`, the widget is hidden (no error).

### `HideHoverText()`
*   **Description:** Removes hover tooltips from all interactive detail icons (privacy, playstyle, pvp, mods, cloud, manage button) and is typically called before screen transitions.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnGainFocus()`
*   **Description:** Called when this widget receives focus (e.g., via mouse hover or controller selection). In non-creation modes, plays an overlay sound and shows the focused frame.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnLoseFocus()`
*   **Description:** Called when this widget loses focus. Hides the focused frame.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnManageButton()`
*   **Description:** Launches the `ManageServerSlotScreen` to delete, rename, or modify the saved slot. Only available when not in console mode (`assert(IsNotConsole())`).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnDeleteButton(slot)`
*   **Description:** Initiates a deletion confirmation dialog for the specified slot (defaults to `self.slot`). If confirmed, deletes the slot, clears caches, refreshes the parent screen, and pops screens.
*   **Parameters:** 
    *   `slot` (number or `nil`) — the slot index to delete; defaults to `self.slot`.
*   **Returns:** Nothing.

### `OnControl(control, down)`
*   **Description:** Handles input actions (`CONTROL_ACCEPT`, `CONTROL_MENU_BACK`). Invokes `onclick` on accept, and manages delete/manage actions on menu-back (differs per console mode).
*   **Parameters:** 
    *   `control` (string) — input control code (e.g., `"accept"`, `"menu_back"`).
    *   `down` (boolean) — whether the control is pressed (`true`) or released (`false`).
*   **Returns:** `true` if the input was handled; `false` otherwise.

### `GetHelpText()`
*   **Description:** Returns localized help text describing the available controls (accept = select, menu_back = delete/manage depending on platform).
*   **Parameters:** None.
*   **Returns:** `string` — concatenated localized help string.

## Events & listeners
None. `ServerSaveSlot` is a UI widget and does not register for game events via `inst:ListenForEvent`. It uses local function callbacks (`onclick`, button callbacks) for UI interactions.