---
id: button
title: Button
description: Base class for interactive UI buttons, handling input, focus, state management, and visual feedback.
tags: [ui, input, widget]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 8fd793ec
system_scope: ui
---

# Button

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Button` serves as the foundational class for all interactive UI buttons in the game (e.g., `ImageButton`, `AnimButton`). It manages input handling (keyboard/controller/mouse), focus states, enabled/disabled/selected states, text rendering, and sound feedback. As a subclass of `Widget`, it integrates into the widget hierarchy and supports focus navigation, event callbacks, and visual state transitions.

## Usage example
```lua
local Button = require "widgets/button"
local inst = CreateEntity()
inst:AddWidget("button")
local btn = inst.components.widget
btn:SetText("OK")
btn:SetOnClick(function() print("Button clicked!") end)
btn:SetEnabled(true)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `font` | string | `NEWFONT` | Font used for text when in normal or focused state. |
| `fontdisabled` | string | `NEWFONT` | Font used for text when disabled. |
| `textcolour` | table `{r,g,b,a}` | `{0,0,0,1}` | RGBA color for text in normal state. |
| `textfocuscolour` | table `{r,g,b,a}` | `{0,0,0,1}` | RGBA color for text when focused. |
| `textdisabledcolour` | table `{r,g,b,a}` | `{0,0,0,1}` | RGBA color for text when disabled. |
| `textselectedcolour` | table `{r,g,b,a}` | `{0,0,0,1}` | RGBA color for text when selected. |
| `text` | Text widget | (constructed) | Child text element used for label display. |
| `clickoffset` | Vector3 | `Vector3(0,-3,0)` | Offset applied to button position on click. |
| `selected` | boolean | `false` | Whether the button is in the "selected" state (non-clickable but focusable). |
| `control` | number | `CONTROL_ACCEPT` | Control input binding (e.g., button press). |
| `mouseonly` | boolean | `false` | Whether only mouse input triggers the button. |
| `help_message` | string | `STRINGS.UI.HELP.SELECT` | Tooltip/help text associated with the button. |

## Main functions
### `SetControl(ctrl)`
*   **Description:** Sets the input control binding for the button and configures `mouseonly` behavior.
*   **Parameters:** `ctrl` (number) — the control identifier. If `CONTROL_PRIMARY`, sets `control` to `CONTROL_ACCEPT` and `mouseonly` to `true`.
*   **Returns:** Nothing.

### `OnControl(control, down)`
*   **Description:** Handles input events from keyboard/controller/mouse. Triggers click effects and callbacks based on state.
*   **Parameters:**  
    - `control` (number) — the control identifier being pressed/released.  
    - `down` (boolean) — `true` if button pressed, `false` if released.
*   **Returns:** `true` if the event was handled, `false` otherwise.
*   **Error states:** Returns early with no effect if button is disabled, not focused, or selected and `AllowOnControlWhenSelected` is `false`.

### `SetOnClick(fn)`
*   **Description:** Assigns the callback function to invoke when the button is clicked.
*   **Parameters:** `fn` (function) — the callback function.
*   **Returns:** Nothing.

### `SetOnDown(fn)`
*   **Description:** Assigns the callback function to invoke when the button is pressed down (not yet released).
*   **Parameters:** `fn` (function) — the callback function.
*   **Returns:** Nothing.

### `SetWhileDown(fn)`
*   **Description:** Assigns the callback function to invoke continuously while the button is held down (requires manual `StartUpdating()` in `OnControl`).
*   **Parameters:** `fn` (function) — the callback function.
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Called per-frame when button is in "down" state and has a `whiledown` callback.
*   **Parameters:** `dt` (number) — delta time since last frame.
*   **Returns:** Nothing.

### `SetText(msg, dropShadow, dropShadowOffset)`
*   **Description:** Sets the button’s label text, optionally adding a drop shadow.
*   **Parameters:**  
    - `msg` (string or nil) — the label text; `nil` hides the text.  
    - `dropShadow` (boolean, optional) — whether to add a text shadow.  
    - `dropShadowOffset` (table, optional) — `{x, y}` offset for shadow (defaults to `{-2, -2}`).
*   **Returns:** Nothing.

### `SetEnabled(enabled)`
*   **Description:** Enables or disables the button. Not documented directly in source — implemented via inherited `Widget:Enable()/Disable()` methods.
*   **Parameters:** `enabled` (boolean) — `true` to enable, `false` to disable.
*   **Returns:** Nothing.

### `Select()`
*   **Description:** Puts the button into "selected" state (non-clickable but still focusable). Used for page navigation or confirmed choices.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Unselect()`
*   **Description:** Cancels the "selected" state, returning the button to normal behavior.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetText()`
*   **Description:** Returns the current text label string.
*   **Parameters:** None.
*   **Returns:** string — the current text content.

### `SetHelpTextMessage(str)`
*   **Description:** Sets the help string shown when button is focused.
*   **Parameters:** `str` (string) — the help message.
*   **Returns:** Nothing.

### `GetHelpText()`
*   **Description:** Returns the help text formatted with the localized control key (e.g., "A Confirm").
*   **Parameters:** None.
*   **Returns:** string — the help text string.

### `IsSelected()`, `IsDisabledState()`, `IsFocusedState()`, `IsNormalState()`
*   **Description:** Helper methods to determine the current visual/state of the button.
*   **Parameters:** None.
*   **Returns:** boolean — state flag.
*   **State priority (highest to lowest):** `Selected`, `Focused`, `Disabled`, `Normal`.

### Font and colour setters
*   `SetFont(font)`, `SetDisabledFont(font)`
*   `SetTextColour(r,g,b,a)`, `SetTextFocusColour(...)`, `SetTextDisabledColour(...)`, `SetTextSelectedColour(...)`
*   `SetTextSize(sz)`
*   **Description:** Configure text appearance per state.
*   **Parameters:** Font name (string), RGBA values (number or table), or size (number).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `none` (no direct event listeners; relies on input system via `OnControl` and state hooks)  
- **Pushes:** `none` (no custom events; interaction via callback properties `onclick`, `ondown`, etc.)
