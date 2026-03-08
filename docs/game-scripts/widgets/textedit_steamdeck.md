---
id: textedit_steamdeck
title: Textedit Steamdeck
description: A UI widget for text input that supports virtual keyboard editing, word prediction, text formatting, and keyboard/controller control handling.
tags: [ui, input, text]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 727381c1
system_scope: ui
---

# Textedit Steamdeck

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`TextEdit` is a UI widget derived from `Text` that provides interactive text input functionality. It integrates with the virtual keyboard, supports real-time text validation, formatting, tab navigation between text fields, and word prediction on platforms like Steam Deck. It manages state transitions (idle, hover, editing), text cursor display, and controller help text rendering.

## Usage example
```lua
local textedit = TextEdit("default_font", 24, "", {1,1,1,1})
textedit:SetRegionSize(300, 50)
textedit:SetTextLengthLimit(20)
textedit:SetTextPrompt("Enter name", {0.7, 0.7, 0.7, 1})
textedit:SetAllowNewline(false)
textedit:EnableWordPrediction({mode = "enabled", width = 300}, {"apple", "banana"})
widget:AddChild(textedit)
```

## Dependencies & tags
**Components used:** `TextWidget`, `TextEditWidget` (added via `self.inst.entity:AddTextEditWidget()`), `WorldEntity`, `Widget` base.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `limit` | number | `nil` | Maximum character count (using UTF-8 length). |
| `regionlimit` | boolean | `false` | If `true`, trimming occurs on text overflow during input. |
| `editing` | boolean | `false` | Whether the widget is currently in edit mode. |
| `editing_enter_down` | boolean | `false` | Tracks if Enter key was pressed down during editing to avoid spurious exits. |
| `allow_newline` | boolean | `false` | Whether `\n` characters are allowed. |
| `enable_accept_control` | boolean | `true` | Controls whether `CONTROL_ACCEPT` triggers editing or submits. |
| `force_edit` | boolean | `false` | Forces text input processing when editing. |
| `pasting` | boolean | `false` | Flag set during paste operations. |
| `validrawkeys` | table | `{}` | Map of raw keys to ignore (to prevent debug key conflicts). |
| `validchars` | string | `nil` | String of allowed characters. |
| `invalidchars` | string | `nil` | String of disallowed characters. |
| `format` | string | `nil` | Template string with `*` placeholders for formatting input. |
| `conversions` | table | `{}` | Character transformation map (e.g., case overrides). |
| `idle_text_color`, `edit_text_color` | `{r,g,b,a}` | `{0,0,0,1}` | Text colors for idle/edit states. |
| `idle_tint`, `hover_tint`, `selected_tint` | `{r,g,b,a}` | `{1,1,1,1}` | Tints for idle/hover/selected states of the focus image. |
| `nextTextEditWidget` | TextEdit or function | `nil` | Widget (or function returning widget) to receive focus on `TAB`. |
| `prediction_widget` | WordPredictionWidget | `nil` | Sub-widget for word prediction suggestions. |
| `pass_controls_to_screen` | table | `{}` | Map of controls that bypass this widget and go to parent screen. |
| `ignore_controls` | table | `{}` | Map of controls to ignore. |
| `prompt` | Text | `nil` | Ghost text shown when field is empty and not editing. |

## Main functions
### `SetString(str)`
* **Description:** Sets the displayed and stored string, applying formatting if present.
* **Parameters:** `str` (string) – text to set; may be `nil` or empty.
* **Returns:** Nothing.

### `SetEditing(editing)`
* **Description:** Enters or exits editing mode, opening/closing the virtual keyboard and updating visual state.
* **Parameters:** `editing` (boolean) – `true` to start editing, `false` to finish.
* **Returns:** Nothing.

### `OnTextInput(text)`
* **Description:** Processes a single-character input event. Handles validation, formatting, paste overflow, and prediction.
* **Parameters:** `text` (string) – a single UTF-8 character.
* **Returns:** `true, overflow` (boolean, boolean) – success flag and whether text was cut due to region limit.

### `OnProcess()`
* **Description:** Finalizes editing (e.g., submits text). Calls `OnTextEntered` callback if present.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnRawKey(key, down)`
* **Description:** Handles raw keyboard input during editing, including paste, Enter, Tab, and cursor keys.
* **Parameters:** `key` (KEY_* constant), `down` (boolean).
* **Returns:** `true` if the key event was handled; `false` otherwise.

### `OnControl(control, down)`
* **Description:** Handles controller/abstract control input. Manages accept, cancel, navigation, and input routing.
* **Parameters:** `control` (`CONTROL_*` constant), `down` (boolean).
* **Returns:** `true` if control was handled and should not propagate further.

### `ValidateChar(text)`
* **Description:** Checks if a character is allowed based on `validchars`, `invalidchars`, and system rules (e.g., newline handling).
* **Parameters:** `text` (string) – single character.
* **Returns:** `true` if valid; `false` otherwise.

### `FormatString(str)`
* **Description:** Applies the `format` template to a validated string, inserting characters at `*` positions.
* **Parameters:** `str` (string) – raw unformatted input.
* **Returns:** Formatted string.

### `SetFormat(format)`
* **Description:** Sets a template string (e.g., `"***-***"`), enabling character formatting and setting a length limit.
* **Parameters:** `format` (string or `nil`) – template with `*` placeholders; `nil` disables formatting.
* **Returns:** Nothing.

### `SetAllowNewline(allow_newline)`
* **Description:** Enables/disables newline characters; updates `enable_accept_control` accordingly.
* **Parameters:** `allow_newline` (boolean).
* **Returns:** Nothing.

### `SetPassword(to)`
* **Description:** Masks input when `true`, hides actual characters from display.
* **Parameters:** `to` (boolean).
* **Returns:** Nothing.

### `SetForceUpperCase(to)`
* **Description:** Forces uppercase input when `true`.
* **Parameters:** `to` (boolean).
* **Returns:** Nothing.

### `EnableWordPrediction(layout, dictionary)`
* **Description:** Initializes and displays the `WordPredictionWidget` for on-screen prediction suggestions.
* **Parameters:**  
  `layout` (table) – e.g., `{mode = "enabled", width = 300, pad_y = 5}`  
  `dictionary` (table) – optional list of strings.
* **Returns:** Nothing.

### `ApplyWordPrediction(prediction_index)`
* **Description:** Applies a predicted word selection at the given index.
* **Parameters:** `prediction_index` (number) – 0-based or 1-based index (depending on prediction widget).
* **Returns:** `true` if prediction applied; `false` otherwise.

### `GetLineEditString()`
* **Description:** Returns the raw internal string (useful for password fields where display is masked).
* **Parameters:** None.
* **Returns:** string.

### `SetHelpTextEdit`, `SetHelpTextCancel`, `SetHelpTextApply`
* **Description:** Customizes help text displayed for editing, cancel, and apply actions.
* **Parameters:** `str` (string) – help text label.
* **Returns:** Nothing.

### `GetHelpText()`
* **Description:** Returns concatenated localized help strings for the current state (editing vs idle).
* **Parameters:** None.
* **Returns:** string.

## Events & listeners
- **Listens to:** `onremove` – aborts virtual keyboard when entity is removed.
- **Pushes:** None identified.