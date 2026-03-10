---
id: bugreportscreen
title: Bugreportscreen
description: Provides a UI screen for players to submit bug reports by entering descriptive text and sending it to the game's bug reporting system.
tags: [ui, input, network]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 39389b79
system_scope: ui
---

# Bugreportscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`BugReportScreen` is a UI screen that allows players to compose and submit bug reports through the game's native bug reporting system (`TheSim:FileBugReport`). It presents a full-screen overlay with a darkened background, a centered panel containing a large text input field for the bug description, and action buttons (Cancel and Submit). The screen inherits from `Screen`, integrates standard DST UI widgets (`TextEdit`, `ImageButton`, `Text`), and uses localized strings for interface elements.

## Usage example
```lua
local BugReportScreen = require "screens/bugreportscreen"
local screen = BugReportScreen()
TheFrontEnd:PushScreen(screen)
-- Player types bug details into the text field and presses Submit
-- On Submit, the description is sent to TheSim:FileBugReport()
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `black` | `Image` | `nil` | Full-screen dark overlay (alpha = 0.95) to dim the background. |
| `root` | `Widget` | `nil` | Root container widget for the dialog content. |
| `title` | `Text` | `nil` | Header text showing the screen's description label. |
| `description_text` | `TextEdit` | `nil` | Primary text input field for the bug report. |
| `cancel_button` | `ImageButton` | `nil` | Button to dismiss the screen without submitting. |
| `submit_button` | `ImageButton` | `nil` | Button to trigger bug report submission. |

## Main functions
### `OnBecomeActive()`
* **Description:** Activates the screen and gives keyboard focus to the description text input field for immediate typing.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Calls base `Screen.OnBecomeActive()` before applying focus.

### `FileBugReport()`
* **Description:** Reads the current text from `description_text`, sends it to `TheSim:FileBugReport()`, and displays a success/failure dialog using `PopupDialogScreen`.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** If `TheSim:FileBugReport()` returns `false`, the screen shows a failure dialog instead of success; in both cases, the dialog includes an OK button to close the report dialog and optionally the main bug report screen (only on success is the main screen popped twice).

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.