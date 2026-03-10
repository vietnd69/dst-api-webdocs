---
id: festivaleventscreen
title: Festivaleventscreen
description: Manages the user interface for the festival event menu, including quick match, host, and browse server options, with support for Quagmire and Lava Arena events.
tags: [ui, event, menu, network]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: e22b2992
system_scope: ui
---

# Festivaleventscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`FestivalEventScreen` is a UI screen component responsible for displaying the main menu interface during active festival events (specifically Quagmire and Lava Arena). It provides navigation options for quick matching, hosting, and browsing servers filtered for the current event, while also handling event-specific assets (e.g., background animations, color correction, and community unlock books). It extends the base `Screen` class and is integrated into `TheFrontEnd`'s screen stack system.

## Usage example
```lua
-- Example of pushing the festival event screen in the UI stack
TheFrontEnd:PushScreen(
    FestivalEventScreen(prev_screen, session_data)
)
```

## Dependencies & tags
**Components used:** None directly (`inst` is a screen entity; no `inst.components.X` usage).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `parent_screen` | screen | `prev_screen` | The screen that launched this one; used to return music management. |
| `session_data` | table | `session_data` | Session data passed from the previous screen for connection context. |
| `root` | widget | `nil` | Root container widget for screen layout. |
| `fg`, `bg`, `bg_anim` | widget | `nil` | Foreground, static background, and animated background widgets. |
| `title` | widget | `nil` | Screen title widget. |
| `onlinestatus` | widget | `OnlineStatus(true)` | Online status indicator widget. |
| `userprogress` | widget | `UserProgress(...)` | User progress display widget. |
| `menu` | widget | `nil` | Main menu widget containing action buttons. |
| `event_details` | widget | `nil` | Event info detail widget (network links). |
| `eventbook` | widget | `nil` | Event-specific book widget (Quagmire or Lava Arena unlocks). |
| `back_button` | widget | `nil` | Back navigation button (added only for keyboard/mouse). |
| `tooltip` | widget | `nil` | Tooltip widget for menu buttons. |
| `leaving` | boolean | `nil` | Flag indicating screen transition is in progress. |
| `musicstarted` | boolean | `false` | Whether the event music has started playing. |
| `musictask` | task | `nil` | Delayed task to start music (to avoid early playback). |
| `popup_backout` | boolean | `nil` | Flag set when back button is used to dismiss an offline popup. |
| `last_focus_widget` | widget | `nil` | Widget to restore focus upon returning to this screen. |

## Main functions
### `DoInit()`
* **Description:** Initializes all UI subwidgets (backgrounds, title, menus, buttons, books) based on the active festival event. Handles event-specific logic (e.g., Quagmire vs Lava Arena).
* **Parameters:** None.
* **Returns:** Nothing.

### `_MakeMenu()`
* **Description:** Constructs and returns the main menu widget containing Quick Match, Host, and Browse buttons.
* **Parameters:** None.
* **Returns:** `widget` — The constructed `StandardMenu` widget.

### `OnQuickmatchButton()`
* **Description:** Initiates quick match flow by pushing the `QuickJoinScreen`, passing event-specific parameters and callbacks to Host/Browse.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnHostButton()`
* **Description:** Opens the cloud server settings popup pre-filled with event-specific defaults (co-op intention, max players = 6, event game mode).
* **Parameters:** None.
* **Returns:** Nothing.

### `OnBrowseButton()`
* **Description:** Initiates server browsing filtered for the current festival event. Adds `MINOPENSLOTS` filter for Quagmire and applies default filters for dedicated/non-empty servers.
* **Parameters:** None.
* **Returns:** Nothing.

### `_FadeToScreen(screen_type, data)`
* **Description:** Initiates screen transition with fade-out, preserving current focus and disabling the menu during transition.
* **Parameters:**  
  - `screen_type` (function) — Constructor function for the target screen.  
  - `data` (table) — Arguments to pass to `screen_type`.
* **Returns:** Nothing.

### `StartMusic()`
* **Description:** Starts event-specific front-end music with a 1.25-second delay if not already started. Falls back to parent screen music if no event music is defined.
* **Parameters:** None.
* **Returns:** Nothing.

### `StopMusic(going_back)`
* **Description:** Stops event-specific music or cancels pending music task. If `going_back` is false, delegates music stop to parent screen if no event music exists.
* **Parameters:**  
  - `going_back` (boolean) — Whether the user is navigating back to the previous screen.
* **Returns:** Nothing.

### `OnBecomeActive()`
* **Description:** Called when the screen becomes active. Restores focus, starts music, and displays an offline-mode popup if skins require online mode.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Handles input controls. Delegates tab control to the event book if active. Handles `CONTROL_CANCEL` to exit with music cleanup.
* **Parameters:**  
  - `control` (number) — Control code (e.g., `CONTROL_CANCEL`).  
  - `down` (boolean) — Whether the control is pressed (`true`) or released (`false`).
* **Returns:** `boolean` — `true` if the control was handled; `false` otherwise.

### `OnUpdate(dt)`
* **Description:** Calls `OnUpdate(dt)` on the event book if present (for animation or tab updates).
* **Parameters:**  
  - `dt` (number) — Delta time in seconds.
* **Returns:** Nothing.

### `GetHelpText()`
* **Description:** Generates localized help text by combining the cancel control and event book help text (if not focused).
* **Parameters:** None.
* **Returns:** `string` — Concatenated help text.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent()` calls in this component).
- **Pushes:** None (no `inst:PushEvent()` calls in this component).