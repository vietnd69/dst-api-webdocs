---
id: connectingtogamepopup
title: Connectingtogamepopup
description: Displays a UI modal during server connection attempts, showing a dynamic 'connecting...' animation and handling user cancellation.
tags: [ui, network, modal]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 3ff2c94c
system_scope: ui
---

# Connectingtogamepopup

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`ConnectingToGamePopup` is a UI screen component that presents a modal dialog during game connection attempts (e.g., joining or migrating to a server). It provides visual feedback via an animated ellipsis and exposes a cancel action that aborts the connection attempt and cleans up network state. It is part of the UI screen hierarchy and inherits from `Screen`, managing widgets like text labels, images, and menu buttons.

## Usage example
```lua
local popup = CreateEntity()
popup:AddTag("popup")
popup:AddComponent("connectingtogamepopup")
-- The component is automatically constructed and displayed via TheFrontEnd:AddScreen()
TheFrontEnd:AddScreen("ConnectingToGamePopup", {})
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `popup` (implicitly via `Screen` base class).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `black` | Image | `nil` | Full-screen dark overlay (`Image`) to dim background UI. |
| `proot` | Widget | `nil` | Root container widget for layout positioning. |
| `bg` | Widget | `nil` | Background container (CurlyWindow template). |
| `title` | Text | `""` | Title text label (initially empty). |
| `text` | Text | `STRINGS.UI.NOTIFICATION.CONNECTING` | Dynamic status text showing 'Connecting' with animating dots. |
| `menu` | Menu | `nil` | Menu containing the Cancel button. |
| `buttons` | table | `nil` | Reference to button configuration table. |
| `time` | number | `0` | Accumulator for animation timing. |
| `progress` | number | `0` | Current ellipsis count (1–3 dots). |
| `default_focus` | Menu | `self.menu` | Default UI focus target. |

## Main functions
### `OnUpdate(dt)`
*   **Description:** Called periodically to update the ellipsis animation for the connecting status text.
*   **Parameters:** `dt` (number) – Delta time in seconds since the last frame.
*   **Returns:** Nothing.
*   **Error states:** None. Advances animation every 0.75s; resets dot count after 3 dots.

### `OnControl(control, down)`
*   **Description:** Handles input control events; specifically listens for `CONTROL_CANCEL` (e.g., ESC key) to trigger cancellation.
*   **Parameters:**  
  `control` (string) – Control type identifier.  
  `down` (boolean) – Whether the control was pressed (`true`) or released (`false`).
*   **Returns:** `true` if the event was consumed; `false` otherwise.
*   **Error states:** Fires `OnCancel()` only when `control == CONTROL_CANCEL` and `down == false`.

### `OnCancel()`
*   **Description:** Aborts the current connection attempt, cleans up network state, and removes the screen from the UI stack.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Calls `TheNet:JoinServerResponse(true)`, `TheNet:Disconnect(false)`, and `TheFrontEnd:PopScreen()` to cancel and close; invokes `TheSystemService:StopDedicatedServers()` to ensure background servers are stopped; triggers `DoRestart(false)` if migrating.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified