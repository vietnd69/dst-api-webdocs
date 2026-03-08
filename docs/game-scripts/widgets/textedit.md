---
id: textedit
title: Textedit
description: A UI widget for displaying and editing text input with keyboard/controller support, formatting, and word prediction.
tags: [ui, input, widget]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: a8018bcd
system_scope: ui
---

# Textedit

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`TextEdit` is a UI widget that provides interactive text input and display capabilities. It supports keyboard and controller input handling, character filtering, input formatting (e.g., masks like `"***/**"`), word prediction, and dynamic focus management. It extends the base `Text` widget and integrates with `TextWidget` and `TextEditWidget` entities to render and manage editable text. The component is typically used for chat fields, name entry, configuration inputs, and similar interactive UI elements.

## Usage example
```lua
local textedit = TextEdit(FONT, 24, "Enter text", {0,0,0,1})
textedit:SetRegionSize(200, 32)
textedit:SetTextLengthLimit(32)
textedit:SetCharacterFilter("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_")
ui_root:AddChild(textedit)
```

## Dependencies & tags
**Components used:** `TextWidget`, `TextEditWidget`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | `nil` | Owning entity (set by `Class` constructor). |
| `limit` | number or `nil` | `nil` | Maximum character count allowed in the text field. |
| `regionlimit` | boolean | `false` | If `true`, prevents input when the displayed region overflows (clips). |
| `editing` | boolean | `false` | Whether the widget is currently in edit mode. |
| `editing_enter_down` | boolean | `false` | Tracks if the Enter key is held down during editing to avoid duplicate processing. |
| `allow_newline` | boolean | `false` | If `true`, allows Enter key to insert newline characters during editing. |
| `enable_accept_control` | boolean | `true` | Controls whether the Accept control (e.g., Enter) initiates editing or confirms input. |
| `validrawkeys` | table | `{}` | Set of raw keys that should be consumed (not propagated) when pressed. |
| `force_edit` | boolean | `false` | When true, forces the frontend to process text input through this widget. |
| `pasting` | boolean | `false` | Temporary flag used during paste operations to bypass tab navigation checks. |
| `pass_controls_to_screen` | table | `{}` | Map of controls to forward to the parent screen when set. |
| `ignore_controls` | table | `{}` | Map of controls to ignore completely (do not process). |
| `idle_text_color` | `{number, number, number, number}` | `{0,0,0,1}` | RGBA color used for text when idle. |
| `edit_text_color` | `{number, number, number, number}` | `{0,0,0,1}` | RGBA color used for text when editing. |
| `idle_tint` | `{number, number, number, number}` | `{1,1,1,1}` | Tint applied to the idle (unfocused) state image. |
| `hover_tint` | `{number, number, number, number}` | `{1,1,1,1}` | Tint applied to the hovered state image. |
| `selected_tint` | `{number, number, number, number}` | `{1,1,1,1}` | Tint applied to the active/focus (editing) state image. |
| `format` | string or `nil` | `nil` | Formatting mask (e.g., `"***/***"`), where `*` is replaced by user input. |
| `nextTextEditWidget` | widget/function or `nil` | `nil` | Next widget to receive focus when Tab is pressed, or a function returning one. |
| `prediction_widget` | WordPredictionWidget or `nil` | `nil` | Optional widget for predictive text suggestions. |
| `prompt` | Text or `nil` | `nil` | Ghost placeholder text shown when the field is empty and not editing. |

## Main functions
### `SetForceEdit(force)`
*   **Description:** Enables or disables forced text input processing. When enabled, the frontend routes text input directly to this widget regardless of focus.
*   **Parameters:** `force` (boolean) — whether to enable forced input mode.
*   **Returns:** Nothing.

### `SetString(str)`
*   **Description:** Sets the displayed text string after applying formatting and truncation rules. Updates the underlying `TextEditWidget`.
*   **Parameters:** `str` (string) — the text to set.
*   **Returns:** Nothing.

### `SetAllowNewline(allow_newline)`
*   **Description:** Configures whether newlines (Enter key) are inserted into the text during editing, and synchronizes `enable_accept_control` accordingly.
*   **Parameters:** `allow_newline` (boolean) — if `true`, Enter inserts newline; otherwise, Enter confirms editing.
*   **Returns:** Nothing.

### `SetEditing(editing)`
*   **Description:** Enters or exits edit mode. Adjusts text color, updates focus, shows/hides the edit cursor, manages controller help text visibility, and disengages word prediction when leaving edit mode.
*   **Parameters:** `editing` (boolean) — whether to enter edit mode.
*   **Returns:** Nothing.
*   **Error states:** No explicit error states; silently does nothing if state matches current mode.

### `ValidateChar(text)`
*   **Description:** Checks whether a single character is valid for input based on configured filters (`validchars`, `invalidchars`, `allow_newline`), and system-reserved characters (e.g., backspace, escape).
*   **Parameters:** `text` (string, 1-char) — the character to validate.
*   **Returns:** `true` if valid, `false` otherwise.

### `ValidatedString(str)`
*   **Description:** Filters an entire string, returning only characters that pass `ValidateChar`.
*   **Parameters:** `str` (string) — the raw input string.
*   **Returns:** Filtered string (string).

### `SetFormat(format)`
*   **Description:** Applies a formatting mask (e.g., `"***/***"`), setting the text length limit to the format length and enabling `FormatString`.
*   **Parameters:** `format` (string or `nil`) — the mask string; `nil` disables formatting.
*   **Returns:** Nothing.

### `FormatString(str)`
*   **Description:** Applies the configured `format` mask to an unformatted string by inserting literal format characters and replacing `*` placeholders with validated input.
*   **Parameters:** `str` (string) — the unformatted text.
*   **Returns:** Formatted string (string).

### `SetTextConversion(in_char, out_char)`
*   **Description:** Registers a character transformation rule. If `in_char` is typed, it is replaced with `out_char`.
*   **Parameters:**  
    *   `in_char` (string, 1-char) — input character to intercept.  
    *   `out_char` (string, 1-char) — replacement character.
*   **Returns:** Nothing.

### `OnTextInput(text)`
*   **Description:** Handles text input (single characters). Performs validation, formatting, paste mode handling, and updates the `TextEditWidget`. Triggers overflow correction if `regionlimit` is enabled.
*   **Parameters:** `text` (string, 1-char) — the input character.
*   **Returns:** `{ boolean success, boolean overflow? }` — success (`true` if input accepted), overflow (`true` if region limit exceeded and backspace triggered).
*   **Error states:** Returns `false` if input exceeds `limit` or violates filters.

### `OnProcess()`
*   **Description:** Commits the current text, exits edit mode, flushes input, and fires `OnTextEntered` callback if set.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetOnTabGoToTextEditWidget(texteditwidget)`
*   **Description:** Sets the next `TextEdit` widget to focus when Tab is pressed, or a function returning such a widget.
*   **Parameters:** `texteditwidget` (TextEdit widget or function returning widget) — the next widget in the tab sequence.
*   **Returns:** Nothing.

### `OnRawKey(key, down)`
*   **Description:** Handles raw key events: paste, newline, tab navigation, and widget-level control. Manages paste loop, Enter key handling, and tab-based focus switching.
*   **Parameters:**  
    *   `key` (KEY_*) — the pressed key.  
    *   `down` (boolean) — `true` on key press, `false` on release.
*   **Returns:** `true` if key was consumed; `false` otherwise.

### `OnControl(control, down)`
*   **Description:** Handles controller/UI control actions (e.g., `CONTROL_ACCEPT`, `CONTROL_CANCEL`). Enters/exits edit mode, processes confirmations, and respects pass/ignore lists.
*   **Parameters:**  
    *   `control` (CONTROL_*) — the control action.  
    *   `down` (boolean) — `true` on press, `false` on release.
*   **Returns:** `true` if control was consumed, `false` otherwise.

### `OnFocusMove(dir, down)`
*   **Description:** Prevents focus movement while editing to avoid interfering with text entry.
*   **Parameters:**  
    *   `dir` (number) — direction of focus movement (`-1`/`1`).  
    *   `down` (boolean) — key press flag.
*   **Returns:** `true` (always blocks focus movement while editing).

### `OnGainFocus()` / `OnLoseFocus()`
*   **Description:** Updates the widget's image state (hover/idle) based on focus changes.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetFocusedImage(widget, atlas, unfocused, hovered, active)`
*   **Description:** Configures visual states (idle, hover, active) for the focus highlight.
*   **Parameters:**  
    *   `widget` (Widget) — the image widget to update.  
    *   `atlas` (string) — texture atlas name.  
    *   `unfocused` (string) — texture for idle/unfocused state.  
    *   `hovered` (string) — texture for hover state.  
    *   `active` (string) — texture for active (editing) state.
*   **Returns:** Nothing.

### `SetIdleTextColour(r,g,b,a)` / `SetEditTextColour(r,g,b,a)`
*   **Description:** Updates idle or editing text color. Colors can be specified as RGBA numbers or a `{r,g,b,a}` table.
*   **Parameters:** `r` (number or table), `g`, `b`, `a` — color components.
*   **Returns:** Nothing.

### `SetEditCursorColour(r,g,b,a)`
*   **Description:** Sets the color of the edit cursor (caret).
*   **Parameters:** `r`, `g`, `b`, `a` — RGBA components (number or `{r,g,b,a}` table).
*   **Returns:** Nothing.

### `SetTextLengthLimit(limit)`
*   **Description:** Sets the maximum number of characters allowed in the field.
*   **Parameters:** `limit` (number or `nil`) — maximum length; `nil` disables limit.
*   **Returns:** Nothing.

### `EnableRegionSizeLimit(enable)`
*   **Description:** Enables/disables clipping-based input restriction: prevents input if text overflows the widget's region.
*   **Parameters:** `enable` (boolean).
*   **Returns:** Nothing.

### `SetCharacterFilter(validchars)` / `SetInvalidCharacterFilter(invalidchars)`
*   **Description:** Configures allowed or forbidden characters for input validation.
*   **Parameters:** `validchars`/`invalidchars` (string or `nil`) — string of characters to allow/block.
*   **Returns:** Nothing.

### `GetLineEditString()`
*   **Description:** Returns the logical text string, even if the display is masked (e.g., passwords).
*   **Parameters:** None.
*   **Returns:** Text string (string).

### `SetPassword(to)`
*   **Description:** Masks the displayed text (e.g., for password fields).
*   **Parameters:** `to` (boolean).
*   **Returns:** Nothing.

### `SetForceUpperCase(to)`
*   **Description:** Forces all input to uppercase.
*   **Parameters:** `to` (boolean).
*   **Returns:** Nothing.

### `EnableWordPrediction(layout, dictionary)`
*   **Description:** Enables the word prediction overlay (e.g., for mobile/controller input). Creates and positions `WordPredictionWidget`.
*   **Parameters:**  
    *   `layout` (table) — `{ width = number, mode = "..." }`.  
    *   `dictionary` (table/string or `nil`) — optional word list(s) to add.
*   **Returns:** Nothing.

### `ApplyWordPrediction(prediction_index)`
*   **Description:** Applies a word prediction suggestion by index.
*   **Parameters:** `prediction_index` (number) — index of the suggestion in the prediction list.
*   **Returns:** `true` if applied; `false` otherwise.

### `SetTextPrompt(prompt_text, colour)`
*   **Description:** Sets ghost placeholder text shown when the field is empty and not editing.
*   **Parameters:**  
    *   `prompt_text` (string) — the placeholder text.  
    *   `colour` (table or `nil`) — text color (defaults to widget's current color).
*   **Returns:** Nothing.

### `GetHelpText()`
*   **Description:** Returns controller-friendly help text (e.g., `"X Change Text"` or `"X Apply"`).
*   **Parameters:** None.
*   **Returns:** Help text string (string).

### `EnableScrollEditWindow(enable)`
*   **Description:** Enables scrolling of the text content when the input exceeds visible area.
*   **Parameters:** `enable` (boolean).
*   **Returns:** Nothing.

### `SetHelpTextEdit(str)` / `SetHelpTextCancel(str)` / `SetHelpTextApply(str)`
*   **Description:** Overrides default controller help text strings for editing, cancel, and apply actions.
*   **Parameters:** `str` (string) — the new help text.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None directly via `inst:ListenForEvent`.
- **Pushes:** None directly via `inst:PushEvent`.  
- **Callbacks (optional):**  
  * `OnTextEntered(string)` — called by `OnProcess()` after confirming input.  
  * `OnTextInputted(boolean down)` — called in `OnRawKey()` during input.  
  * `OnStopForceEdit(TextEdit)` — called when `force_edit` is disabled.