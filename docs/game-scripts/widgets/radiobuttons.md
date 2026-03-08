---
id: radiobuttons
title: Radiobuttons
description: Manages a group of radio button widgets for UI selection controls, supporting horizontal/vertical layouts and data-based selection.
tags: [ui, widget, input, selection]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: cada269d
system_scope: ui
---

# Radiobuttons

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`RadioButtons` is a UI widget class that manages a group of mutually exclusive selection buttons (radio buttons). It inherits from `Widget` and dynamically creates `TextButton`-based radio widgets based on a list of options. It supports horizontal or vertical layout, custom styling, and maintains state for the currently selected option via index or associated data.

## Usage example
```lua
local radiobuttons = AddChild(
    RadioButtons({
        { text = "Option A", data = "a" },
        { text = "Option B", data = "b" },
        { text = "Option C", data = "c" }
    }, 200, 100, {
        width = 180,
        height = 24,
        font = TINIFONT,
        font_size = 20,
        normal_colour = {0.2, 0.2, 0.2, 1},
        selected_colour = {0, 0, 0, 1}
    }, false, nil)
)

radiobuttons:SetSelected("b")
radiobuttons:SetOnChangedFn(function(data) print("Selected:", data) end)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `radiowidget` to each child radio button widget (via `Widget("radiowidget")`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `options` | table | `nil` | Array of option objects, each containing `text` (string) and `data` (any) fields. |
| `width` | number | `nil` | Total width of the widget container. |
| `height` | number | `nil` | Total height of the widget container. |
| `buttonsettings` | table | `nil` | Configuration table for appearance (keys: `atlas`, `on_image`, `off_image`, `width`, `height`, `font`, `font_size`, `normal_colour`, etc.). |
| `horizontal_layout` | boolean | `nil` | If `true`, arranges buttons horizontally; otherwise vertically. |
| `onbuttonconstruct` | function | `nil` | Optional callback invoked after each button widget is constructed. Signature: `fn(widget, buttonwidget)`. |
| `buttonwidgets` | table | `{}` | Internal list of created radio button widgets. |
| `selectedIndex` | number | `1` | 1-based index of the currently selected option. |
| `onchangedfn` | function | `nil` | Optional callback invoked when the selection changes. Signature: `fn(selected_data)`. |

## Main functions
### `MakeRadioButton()`
*   **Description:** Creates and returns a new radio button widget with configured visuals and behavior.
*   **Parameters:** None.
*   **Returns:** `widget` — A `Widget` instance containing `radio`, `background`, and `button` subwidgets.

### `UpdateButtons()`
*   **Description:** Syncs the internal list of button widgets with `self.options`, creates missing buttons, removes excess ones, positions them according to layout, assigns click handlers, and updates visual selection state (radio on/off). Also handles keyboard navigation focus chains.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetSelected(data)`
*   **Description:** Sets the selected radio button by matching `data` against `options[i].data`.
*   **Parameters:** `data` (any) — The data value associated with the desired option.
*   **Returns:** Nothing.
*   **Error states:** No-op if `data` is not found in any option.

### `SetSelectedIndex(i)`
*   **Description:** Sets the selected radio button by index and updates the UI. Fires `OnChanged` if selection changed.
*   **Parameters:** `i` (number) — 1-based index of the option to select.
*   **Returns:** Nothing.
*   **Error states:** No-op if `i` is outside `1 <= i <= #options`.

### `GetSelectedData()`
*   **Description:** Returns the `data` field of the currently selected option.
*   **Parameters:** None.
*   **Returns:** `any` — The data associated with the selected option, or `nil` if index is invalid.

### `EnableButton(data)`
*   **Description:** Enables the radio button associated with a given `data` value.
*   **Parameters:** `data` (any) — The data value identifying the button.
*   **Returns:** `boolean` — `true` if found and enabled; `false` otherwise.

### `EnableAllButtons()`
*   **Description:** Enables all radio buttons in the group.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `DisableButton(data)`
*   **Description:** Disables the radio button associated with a given `data` value.
*   **Parameters:** `data` (any) — The data value identifying the button.
*   **Returns:** `boolean` — `true` if found and disabled; `false` otherwise.

### `DisableAllButtons()`
*   **Description:** Disables all radio buttons in the group.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetOnChangedFn(fn)`
*   **Description:** Sets the callback invoked when the selected option changes.
*   **Parameters:** `fn` (function) — A function that accepts one argument: the new selected data.
*   **Returns:** Nothing.

### `OnChanged()`
*   **Description:** Internal callback invoked when selection changes. Calls `onchangedfn` if set.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified