---
id: consolehistorywidget
title: Consolehistorywidget
description: Renders a scrollable history of past console commands for user selection and completion.
tags: [ui, console, input]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 0903fc41
system_scope: ui
---

# Consolehistorywidget

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`ConsoleHistoryWidget` is a UI widget that displays a history of previously entered console commands. It is typically used in the console screen to let players scroll through and re-select past commands using keyboard navigation or mouse interaction. It manages a bounded list of up to `MAX_LINES` (10) entries, highlights selected items, and updates the main text input field when a command is selected or navigated.

## Usage example
```lua
local history_widget = ConsoleHistoryWidget(text_edit, remote_execute, 300, "enter,tab")
history_widget:Show(ConsoleScreenSettings:GetConsoleHistory(), 1)
-- Navigate with UP/DOWN keys; select with ENTER or click.
-- Pressing ESC or clicking dismiss hides and clears selection.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds no tags (this is a UI widget, not an ECS component)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `text_edit` | Widget | *(required)* | Reference to the text input widget used to populate with selected history entries. |
| `console_remote_execute` | function | *(required)* | Callback function used to execute remote console commands (currently unused in logic). |
| `enter_complete` | boolean | `false` | Whether pressing ENTER should commit and hide the widget. |
| `tab_complete` | boolean | `false` | Whether pressing TAB should trigger completion behavior and hide the widget. |
| `max_width` | number | `300` | Maximum width of the widget in pixels. |
| `sizey` | number | `26` | Height of a single line (`FONT_SIZE + 4`). |
| `selection_btns` | table | `{}` | Array of buttons representing each visible history entry. |
| `active_selection_btn` | number or nil | `nil` | Index (1-based) of the currently selected history item. |
| `start_offset` | number | `0` | Offset used to determine the first history entry to display when history exceeds `MAX_LINES`. |

## Main functions
### `Show(history, index)`
* **Description:** Displays the widget and populates it with command history, starting at the specified index (reversed index; `index=1` is most recent). Enables the widget and stops mouse tracking.
* **Parameters:**  
  `history` (table) — Array of console command strings (typically from `ConsoleScreenSettings:GetConsoleHistory()`).  
  `index` (number or nil) — 1-based index into the *reversed* history (i.e., `index=1` selects the most recent command).
* **Returns:** Nothing.

### `Hide()`
* **Description:** Hides the widget, disables input handling, and resets console log positioning.
* **Parameters:** None.
* **Returns:** Nothing.

### `Dismiss()`
* **Description:** Clears all internal state (selection, buttons) and hides the widget.
* **Parameters:** None.
* **Returns:** Nothing.

### `RefreshHistory(history, index)`
* **Description:** Rebuilds the list of buttons from the command history and adjusts the view based on `index`. Lays out buttons vertically and resizes the backing panel.
* **Parameters:**  
  `history` (table) — Array of history entries (each entry should have a `.str` field).  
  `index` (number) — The target index (reversed index) to pre-select (e.g., `1` = most recent).
* **Returns:** Nothing.

### `OnRawKey(key, down)`
* **Description:** Handles keyboard input for navigation and selection of history items. Supports `UP`, `DOWN`, `TAB`, `ENTER`, and `ESCAPE`.
* **Parameters:**  
  `key` (KEY_*) — The key code pressed.  
  `down` (boolean) — `true` if the key is pressed down; `false` on release.
* **Returns:** boolean — `true` if the key event was handled; `false` otherwise.

### `OnControl(control, down)`
* **Description:** Handles high-level control actions (`CONTROL_CANCEL` maps to dismiss). Delegates to base widget handling first.
* **Parameters:**  
  `control` (CONTROL_*) — The control type.  
  `down` (boolean) — `true` if the control is activated; `false` on release.
* **Returns:** boolean — `true` if the control event was handled; `false` otherwise.

### `IsMouseOnly()`
* **Description:** Returns `true` if both `enter_complete` and `tab_complete` modes are disabled, meaning the widget is only actionable via mouse.
* **Parameters:** None.
* **Returns:** boolean.

## Events & listeners
- **Pushes:** `onconsolehistoryitemclicked` — fired when a history entry is clicked; argument is the 1-based index (`i`) in the full history array.
- **Pushes:** `onhistoryupdated` — fired when the active selection changes via selection behavior; argument is the reversed index (`#history - i + 1`) into the history array.