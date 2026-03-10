---
id: launchingserverpopup
title: Launchingserverpopup
description: Manages the UI popup displayed while the dedicated server is starting or generating a world, providing visual feedback and cancellation support.
tags: [ui, network, server]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: dd0651f0
system_scope: ui
---

# Launchingserverpopup

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`LaunchingServerPopup` is a screen that informs the user that the dedicated server process is starting or performing world generation. It displays a dynamic, animated message and provides a cancellation button on non-console platforms. It integrates with `TheNet` to poll the server process status and triggers callbacks upon success or failure.

## Usage example
```lua
local LaunchingServerPopup = require "screens/launchingserverpopup"
local serverinfo = { ... } -- server configuration data

TheFrontEnd:PushScreen(
    LaunchingServerPopup(
        serverinfo,
        function(info) print("Server started successfully:", info) end,
        function() print("Server failed to start") end
    )
)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `serverinfo` | table | `nil` | Server configuration data passed into the constructor; forwarded to callbacks. |
| `successCallback` | function | `nil` | Callback invoked when the server process becomes ready (`status == 3`). |
| `errorCallback` | function | `nil` | Callback invoked if an error occurs during server startup. |
| `launchtime` | number | `GetStaticTime()` | Time when the popup was instantiated (used for timing, not exposed externally). |
| `errorStartingServers` | boolean | `false` | Internal flag indicating an error occurred external to `TheNet` status. |
| `black` | Image | `nil` | Full-screen darkening overlay background. |
| `proot` | Widget | `nil` | Root widget container for popup content. |
| `bg` | Widget | `nil` | Background container from `TEMPLATES.CurlyWindow`. |
| `bg.fill` | Image | `nil` | Decorative fill image inside the popup background. |
| `title` | Text | `nil` | Title label (currently unused; empty string). |
| `text` | Text | `nil` | Message text showing progress ("Launching Server..." or "Server WorldGen..."). |
| `menu` | Menu | `nil` | Cancel button menu (only present on non-console platforms). |
| `buttons` | table | `nil` | List of button definitions used to construct `menu`. |
| `default_focus` | Widget | `nil` | Initially focused widget (the `menu` if enabled). |
| `time` | number | `0` | Accumulated time delta used to drive animation of the ellipsis dots. |
| `progress` | number | `0` | Animation state index (1–3) controlling how many dots appear. |

## Main functions
### `OnUpdate(dt)`
*   **Description:** Updates the popup state each frame. Polls `TheNet:GetChildProcessStatus()` to determine server state and updates UI (e.g., animates ellipsis dots). Handles success, error, and progress states.
*   **Parameters:** `dt` (number) — Delta time in seconds since the last update.
*   **Returns:** Nothing.
*   **Error states:** Invokes `errorCallback` if `TheNet:GetChildProcessError()` returns true or `self.errorStartingServers` is set; invokes `successCallback` when `status == 3`.

### `OnControl(control, down)`
*   **Description:** Handles input events; specifically, allows pressing the cancel control to trigger shutdown on non-console platforms.
*   **Parameters:**  
    `control` (number) — Control code (e.g., `CONTROL_CANCEL`).  
    `down` (boolean) — Whether the control key is pressed (`true`) or released (`false`).
*   **Returns:** `true` if handled, otherwise `false`.
*   **Error states:** Only triggers `OnCancel()` if `ENABLE_CANCEL_BUTTON` is true, `control == CONTROL_CANCEL`, and `down == false`.

### `OnCancel()`
*   **Description:** Handles user-initiated cancellation of server launch. Stops all dedicated servers and removes the popup screen.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetErrorStartingServers()`
*   **Description:** Sets the internal `errorStartingServers` flag to `true`, causing the next `OnUpdate` loop to treat the startup as failed.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified