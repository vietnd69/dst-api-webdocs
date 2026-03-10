---
id: inputdialog
title: Inputdialog
description: Provides a modal or non-modal screen for entering and submitting user text input via a text field and button controls.
tags: [ui, input, modal]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 556eeaf2
system_scope: ui
---

# Inputdialog

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`InputDialogScreen` is a UI screen widget that displays a customizable text input dialog. It presents a titled panel with a text-editing field, optional background overlay, and a configurable list of buttons (e.g., OK/Cancel). It handles keyboard/controller input, focus management, and text validation. Being a subclass of `Screen`, it integrates into the frontend screen stack and supports both modal and non-modal usage modes.

## Usage example
```lua
local InputDialogScreen = require "screens/inputdialog"

-- Define button callbacks
local buttons = {
    { text = "OK", cb = function() print("OK pressed: " .. InputDialogScreen:GetActualString()) end },
    { text = "Cancel", cb = function() print("Cancel pressed") end },
}

-- Create and push the screen
local dialog = InputDialogScreen("Enter your name", buttons, true, true)
TheFrontEnd:PushScreen(dialog)

-- Optionally override or filter text
dialog:OverrideText("Default name")
dialog:SetValidChars("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ")
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `buttons` | table | `nil` | Array of button definitions (each with `text` and `cb` fields) passed during construction. |
| `black` | Image | `nil` | Full-screen background overlay image, tinted based on `modal` flag. |
| `proot` | Widget | `nil` | Root widget container for dialog contents. |
| `bg` | Widget | `nil` | Main dialog background panel (curly window). |
| `title` | Text | `nil` | Title text label. |
| `edit_text` | TextEdit | `nil` | Text input field widget. |
| `menu` | Menu | `nil` | Menu widget containing the button list. |
| `default_focus` | Widget | `self.edit_text` | Widget to receive focus on screen open. |

## Main functions
### `GetText()`
* **Description:** Returns the global `InputDialogString`, which is updated during `OnControl` calls. This value may lag behind user input if the text field hasn’t lost focus.
* **Parameters:** None.
* **Returns:** `string` — the current value of `InputDialogString`.
* **Error states:** May return outdated value if used before `OnControl` has been called.

### `GetActualString()`
* **Description:** Returns the *current* text in the text field, regardless of focus state.
* **Parameters:** None.
* **Returns:** `string` — text currently in `self.edit_text`, or `""` if `edit_text` is `nil`.

### `OverrideText(text)`
* **Description:** Programmatically sets the content of the text field.
* **Parameters:** `text` (string) — text to display in the input field.
* **Returns:** Nothing.

### `SetValidChars(chars)`
* **Description:** Configures a character filter so only specified characters can be entered.
* **Parameters:** `chars` (string) — string containing valid characters (e.g., `"abc123"`).
* **Returns:** Nothing.

### `SetTitleTextSize(size)`
* **Description:** Adjusts the font size of the dialog’s title.
* **Parameters:** `size` (number) — font size in pixels.
* **Returns:** Nothing.

### `SetButtonTextSize(size)`
* **Description:** Adjusts the font size of the buttons.
* **Parameters:** `size` (number) — font size in pixels.
* **Returns:** Nothing.

### `Close()`
* **Description:** Removes the dialog screen from the frontend stack.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
None identified