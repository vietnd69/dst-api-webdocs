---
id: inputdialog
title: Inputdialog
description: Provides a reusable modal or non-modal dialog screen for capturing single-line text input from the user.
tags: [ui, input, dialog]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 6b3aa382
system_scope: ui
---

# Inputdialog

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`InputDialogScreen` is a UI screen subclass that renders a styled dialog box containing a text input field (`TextEdit`), a background window frame (`CurlyWindow`), and a customizable button set. It supports both modal and non-modal presentation modes and handles keyboard/controller input for text editing and button selection. The class inherits from `Screen` and is designed for quick integration into the frontend flow, typically used for renaming items, entering server passwords, or prompting user input during gameplay.

## Usage example
```lua
local InputDialogScreen = require "screens/redux/inputdialog"

local title = "Rename Item"
local buttons = {
    { text = "OK", cb = function() print("Accepted:", TheFrontEnd:GetTopScreen():GetText()) end },
    { text = "Cancel", cb = function() print("Cancelled") end }
}

local screen = InputDialogScreen(title, buttons, true, true)
TheFrontEnd:AddScreen(screen)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds no tags — it is a pure UI screen component and does not interact with entity tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `buttons` | table | `nil` | Array of button definitions (`{text, cb}`) passed to constructor. |
| `edit_text` | `TextEdit` | `nil` | Text input widget for user typing. |
| `edit_text_bg` | `Image` | `nil` | Background image for the text field. |
| `black` | `Image` | `nil` | Full-screen overlay used for modal dimming or click-to-cancel behavior. |
| `proot` | `Widget` | `nil` | Root widget container for proportional layout. |
| `bg` | `Widget` | `nil` | Curly window frame containing title and buttons. |

## Main functions
### `GetText()`
* **Description:** Returns the current value of the global `InputDialogString`, which is updated during `OnControl` calls. This is the canonical public getter for the user-entered text.
* **Parameters:** None.
* **Returns:** `string` — the cached input string captured during the last control event.

### `GetActualString()`
* **Description:** Queries the active `TextEdit` widget directly for the current text content. Safer than `GetText()` when the widget may not have processed recent input yet.
* **Parameters:** None.
* **Returns:** `string` — current text in the `TextEdit`, or `""` if `edit_text` is `nil`.

### `OverrideText(text)`
* **Description:** Pre-fills or replaces the current content of the text field.
* **Parameters:** `text` (`string`) — the string to set in the input field.

### `SetValidChars(chars)`
* **Description:** Applies a character filter to restrict input (e.g., alphanumeric-only).
* **Parameters:** `chars` (`string` or function) — expected format is either a string of allowed characters or a predicate function for `TextEdit:SetCharacterFilter`.

### `SetTitleTextSize(size)`
* **Description:** Adjusts the font size of the dialog title text.
* **Parameters:** `size` (`number`) — font size multiplier or absolute size (applied to `self.title`, but `self.title` is not explicitly set in constructor — may be a bug or reliance on `TEMPLATES.CurlyWindow` behavior).

### `SetButtonTextSize(size)`
* **Description:** Adjusts the font size of all buttons in the dialog.
* **Parameters:** `size` (`number`) — font size applied to the internal `Menu` widget (`self.menu`).

### `Close()`
* **Description:** Removes the screen from the frontend stack.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Handles input events for text editing and button selection (keyboard/controller). Updates `InputDialogString` and routes input to the text field or button actions.
* **Parameters:**  
  - `control` (`number`) — input control constant (e.g., `CONTROL_ACCEPT`, `CONTROL_CANCEL`).  
  - `down` (`boolean`) — whether the control was pressed (`true`) or released (`false`).  
* **Returns:** `boolean` — `true` if the event was consumed, `false` otherwise.

## Events & listeners
**Listens to:** None identified  
**Pushes:** None identified  
This screen does not fire or register events; it operates through direct method calls and UI interaction events (`OnControl`, mouse clicks).